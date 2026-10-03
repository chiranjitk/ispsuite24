"use client";

import * as React from "react";
import { ViewProps, useModuleHeader } from "./_shared";
import {
  PageHeader,
  ActionBar,
  KpiCard,
  SectionCard,
  EmptyState,
} from "@/components/app/shared";
import { useAppStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  Wallet,
  Search,
  RefreshCw,
  Undo2,
  CheckCircle2,
  Download,
  Building2,
  Coins,
  AlertTriangle,
  Clock,
} from "lucide-react";
import {
  PAYMENT_TXNS,
  PAYMENT_MODES,
  FRANCHISE_ACCOUNTS,
  ACCOUNT_SEARCH_RESULTS,
} from "@/lib/mock-data";
import type { PaymentTxn } from "@/lib/mock-data";

export function PaymentTrackingView({ moduleId, childId }: ViewProps) {
  const { mod } = useModuleHeader(moduleId, childId);
  if (!mod) return null;
  if (!childId) return <PaymentTrackingOverview moduleId={moduleId} />;
  switch (childId) {
    case "manage-accounts":
      return <ManageAccounts moduleId={moduleId} childId={childId} />;
    case "search-accounts":
      return <SearchAccounts moduleId={moduleId} childId={childId} />;
    case "payment-details":
      return <PaymentDetails moduleId={moduleId} childId={childId} />;
    case "reverse":
      return <ReverseTransactions moduleId={moduleId} childId={childId} />;
    case "settle":
      return <SettleTransactions moduleId={moduleId} childId={childId} />;
    default:
      return <PaymentTrackingOverview moduleId={moduleId} />;
  }
}

/* ---------------- Overview ---------------- */

function PaymentTrackingOverview({ moduleId }: { moduleId: string }) {
  const { mod } = useModuleHeader(moduleId);
  const setActive = useAppStore((s) => s.setActive);
  if (!mod) return null;
  const cards = [
    { label: "Manage Accounts", desc: "Payment modes & franchise accounts", icon: Wallet, child: "manage-accounts" },
    { label: "Search Accounts", desc: "Customer & franchise lookup", icon: Search, child: "search-accounts" },
    { label: "Payment Details", desc: "Payment history search", icon: Coins, child: "payment-details" },
    { label: "Reverse Transactions", desc: "Reverse erroneous payments", icon: Undo2, child: "reverse" },
    { label: "Settle Transactions", desc: "Settle pending payments", icon: CheckCircle2, child: "settle" },
  ];
  const collected = PAYMENT_TXNS.filter((t) => t.status === "Settled").length;
  const pending = PAYMENT_TXNS.filter((t) => t.status === "Pending").length;
  const reversed = PAYMENT_TXNS.filter((t) => t.status === "Reversed").length;
  return (
    <div className="space-y-6">
      <PageHeader title={mod.label} description={mod.desc} icon={<mod.icon className="h-5 w-5" />} />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <KpiCard label="Collected Today" value={String(collected)} icon={<Coins className="h-4 w-4" />} accent />
        <KpiCard label="Pending Settlement" value={String(pending)} icon={<Clock className="h-4 w-4" />} />
        <KpiCard label="Reversed This Month" value={String(reversed)} icon={<Undo2 className="h-4 w-4" />} />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <button
            key={c.child}
            onClick={() => setActive(moduleId, c.child)}
            className="group flex items-start gap-3 rounded-xl border border-border bg-card p-4 text-left shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <c.icon className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-foreground">{c.label}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{c.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function ChildHeader({ moduleId, childId }: ViewProps) {
  const { mod, child } = useModuleHeader(moduleId, childId);
  if (!mod || !child) return null;
  return (
    <PageHeader
      title={child.label}
      description={child.desc}
      icon={<mod.icon className="h-5 w-5" />}
      breadcrumb={[{ label: "Cryptsk" }, { label: mod.label }, { label: child.label }]}
    />
  );
}

/* ---------------- Manage Accounts ---------------- */

function ManageAccounts({ moduleId, childId }: ViewProps) {
  const { toast } = useToast();
  const [modes, setModes] = React.useState(PAYMENT_MODES);
  const toggleMode = (id: string, enabled: boolean) => {
    setModes((prev) => prev.map((m) => (m.id === id ? { ...m, enabled } : m)));
    const m = modes.find((x) => x.id === id);
    toast({ title: `${m?.name} ${enabled ? "enabled" : "disabled"}` });
  };
  const setDefault = (id: string) => {
    setModes((prev) => prev.map((m) => ({ ...m, isDefault: m.id === id })));
    const m = modes.find((x) => x.id === id);
    toast({ title: "Default payment mode", description: `${m?.name} is now the default.` });
  };
  return (
    <div className="space-y-6">
      <ChildHeader moduleId={moduleId} childId={childId} />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard label="Payment Modes" value={String(modes.length)} icon={<Wallet className="h-4 w-4" />} accent />
        <KpiCard label="Enabled" value={String(modes.filter((m) => m.enabled).length)} icon={<CheckCircle2 className="h-4 w-4" />} />
        <KpiCard label="Franchise Accounts" value={String(FRANCHISE_ACCOUNTS.length)} icon={<Building2 className="h-4 w-4" />} />
        <KpiCard label="Active Franchises" value={String(FRANCHISE_ACCOUNTS.filter((f) => f.status === "Active").length)} icon={<Building2 className="h-4 w-4" />} />
      </div>
      <SectionCard title="Payment Modes" description="Enable / disable modes and set the default">
        <div className="overflow-x-auto scrollbar-thin">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">Enabled</TableHead>
                <TableHead>Mode</TableHead>
                <TableHead>Default</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {modes.map((m) => (
                <TableRow key={m.id}>
                  <TableCell>
                    <Switch checked={m.enabled} onCheckedChange={(v) => toggleMode(m.id, v)} />
                  </TableCell>
                  <TableCell className="font-medium">{m.name}</TableCell>
                  <TableCell>
                    {m.isDefault ? (
                      <Badge className="bg-primary/10 text-primary hover:bg-primary/10">Default</Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={!m.enabled || m.isDefault}
                      onClick={() => setDefault(m.id)}
                    >
                      Set Default
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      <SectionCard title="Franchise Accounts" description={`${FRANCHISE_ACCOUNTS.length} accounts`}>
        <div className="overflow-x-auto scrollbar-thin">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {FRANCHISE_ACCOUNTS.map((f) => (
                <TableRow key={f.id}>
                  <TableCell className="font-mono text-xs">{f.id}</TableCell>
                  <TableCell className="font-medium">{f.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px]">{f.type}</Badge>
                  </TableCell>
                  <TableCell className={`font-mono text-xs ${f.balance.startsWith("-") ? "text-primary" : "text-foreground"}`}>{f.balance}</TableCell>
                  <TableCell>
                    <Badge
                      variant={f.status === "Active" ? "default" : "secondary"}
                      className={
                        f.status === "Active"
                          ? "bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400"
                          : "bg-primary/10 text-primary hover:bg-primary/10"
                      }
                    >
                      {f.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => toast({ title: "View account", description: f.name })}>
                      View Ledger
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>
    </div>
  );
}

/* ---------------- Search Accounts ---------------- */

function SearchAccounts({ moduleId, childId }: ViewProps) {
  const { toast } = useToast();
  const [accountType, setAccountType] = React.useState("Customer");
  const [zone, setZone] = React.useState("all");
  const [query, setQuery] = React.useState("");
  return (
    <div className="space-y-6">
      <ChildHeader moduleId={moduleId} childId={childId} />
      <SectionCard title="Search Filter" description="Find customer or franchise accounts">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
          <div className="space-y-1.5">
            <Label htmlFor="at">Account Type</Label>
            <Select value={accountType} onValueChange={setAccountType}>
              <SelectTrigger id="at"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Customer">Customer</SelectItem>
                <SelectItem value="Franchise">Franchise</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="zone">Zone</Label>
            <Select value={zone} onValueChange={setZone}>
              <SelectTrigger id="zone"><SelectValue placeholder="All zones" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All zones</SelectItem>
                <SelectItem value="Z01">Bhiwani-Core</SelectItem>
                <SelectItem value="Z02">Bhiwani-North</SelectItem>
                <SelectItem value="Z03">Bhiwani-South</SelectItem>
                <SelectItem value="Z04">Bhiwani-East</SelectItem>
                <SelectItem value="Z05">Bhiwani-West</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="sq">Search</Label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="sq" placeholder="Account no, customer name, mobile…" className="pl-9" value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Button onClick={() => toast({ title: "Search complete", description: `${ACCOUNT_SEARCH_RESULTS.length} account(s) found.` })}>
            <Search className="mr-1.5 h-4 w-4" /> Search
          </Button>
        </div>
      </SectionCard>

      <SectionCard
        title="Search Results"
        description={`${ACCOUNT_SEARCH_RESULTS.length} account(s)`}
        actions={
          <Button variant="outline" size="sm" onClick={() => toast({ title: "Export", description: "CSV download started." })}>
            <Download className="mr-1.5 h-3.5 w-3.5" /> Export
          </Button>
        }
      >
        <div className="overflow-x-auto scrollbar-thin">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Account</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Last Payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ACCOUNT_SEARCH_RESULTS.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-mono text-xs">{a.account}</TableCell>
                  <TableCell className="font-medium text-primary">{a.customer}</TableCell>
                  <TableCell className="font-mono text-xs">{a.balance}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{a.lastPayment}</TableCell>
                  <TableCell>
                    <Badge
                      variant={a.status === "Active" ? "default" : "secondary"}
                      className={
                        a.status === "Active"
                          ? "bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400"
                          : "bg-primary/10 text-primary hover:bg-primary/10"
                      }
                    >
                      {a.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => toast({ title: "View ledger", description: a.customer })}>View Ledger</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>
    </div>
  );
}

/* ---------------- Payment Details ---------------- */

const modeBadgeClass = (mode: PaymentTxn["mode"]) => {
  const map: Record<PaymentTxn["mode"], string> = {
    Cash: "bg-amber-500/10 text-amber-700 hover:bg-amber-500/10 dark:text-amber-400",
    UPI: "bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400",
    Card: "bg-chart-5/10 text-chart-5 hover:bg-chart-5/10",
    Cheque: "bg-chart-3/10 text-chart-3 hover:bg-chart-3/10",
    "Bank Transfer": "bg-primary/10 text-primary hover:bg-primary/10",
  };
  return map[mode];
};

const statusBadgeClass = (status: PaymentTxn["status"]) =>
  status === "Settled"
    ? "bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400"
    : status === "Pending"
    ? "bg-amber-500/10 text-amber-700 hover:bg-amber-500/10 dark:text-amber-400"
    : "bg-primary/10 text-primary hover:bg-primary/10";

function PaymentDetails({ moduleId, childId }: ViewProps) {
  const { toast } = useToast();
  const [fromDate, setFromDate] = React.useState("");
  const [toDate, setToDate] = React.useState("");
  const [account, setAccount] = React.useState("");
  const total = PAYMENT_TXNS.reduce((s, t) => s + parseFloat(t.amount), 0);
  const settled = PAYMENT_TXNS.filter((t) => t.status === "Settled").reduce((s, t) => s + parseFloat(t.amount), 0);
  const pending = PAYMENT_TXNS.filter((t) => t.status === "Pending").reduce((s, t) => s + parseFloat(t.amount), 0);
  const reversed = PAYMENT_TXNS.filter((t) => t.status === "Reversed").reduce((s, t) => s + parseFloat(t.amount), 0);

  return (
    <div className="space-y-6">
      <ChildHeader moduleId={moduleId} childId={childId} />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard label="Total Collected" value={`₹ ${total.toFixed(2)}`} icon={<Coins className="h-4 w-4" />} accent />
        <KpiCard label="Settled" value={`₹ ${settled.toFixed(2)}`} icon={<CheckCircle2 className="h-4 w-4" />} />
        <KpiCard label="Pending" value={`₹ ${pending.toFixed(2)}`} icon={<Clock className="h-4 w-4" />} />
        <KpiCard label="Reversed" value={`₹ ${reversed.toFixed(2)}`} icon={<Undo2 className="h-4 w-4" />} />
      </div>
      <SectionCard title="Search Filter" description="Filter payment details by date range & account">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
          <div className="space-y-1.5">
            <Label htmlFor="from">From Date</Label>
            <Input id="from" type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="to">To Date</Label>
            <Input id="to" type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="acc">Account No / Customer</Label>
            <Input id="acc" placeholder="e.g. A000002959 or shubham270597" value={account} onChange={(e) => setAccount(e.target.value)} />
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => { setFromDate(""); setToDate(""); setAccount(""); toast({ title: "Filters cleared" }); }}>
            <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Reset
          </Button>
          <Button onClick={() => toast({ title: "Search complete", description: `${PAYMENT_TXNS.length} transaction(s) found.` })}>
            <Search className="mr-1.5 h-4 w-4" /> Search
          </Button>
        </div>
      </SectionCard>

      <SectionCard
        title="Payment Transactions"
        description={`${PAYMENT_TXNS.length} transactions`}
        actions={
          <Button variant="outline" size="sm" onClick={() => toast({ title: "Export", description: "CSV download started." })}>
            <Download className="mr-1.5 h-3.5 w-3.5" /> Export
          </Button>
        }
      >
        <div className="overflow-x-auto scrollbar-thin">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Txn ID</TableHead>
                <TableHead>Account</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Mode</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Collected By</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {PAYMENT_TXNS.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-mono text-xs">{t.id}</TableCell>
                  <TableCell className="font-mono text-xs">{t.account}</TableCell>
                  <TableCell className="font-medium text-primary">{t.customer}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-[10px] ${modeBadgeClass(t.mode)}`}>{t.mode}</Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{t.amount}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{t.date}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-[10px] ${statusBadgeClass(t.status)}`}>{t.status}</Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{t.collectedBy}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>
    </div>
  );
}

/* ---------------- Reverse Transactions ---------------- */

function ReverseTransactions({ moduleId, childId }: ViewProps) {
  const { toast } = useToast();
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const [reason, setReason] = React.useState("");

  // show all, but pre-flag reversed ones; allow reversing pending/settled ones
  const rows = PAYMENT_TXNS;
  const toggle = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelected(next);
  };

  const reverse = () => {
    if (selected.size === 0) {
      toast({ title: "No selection", description: "Select one or more transactions to reverse.", variant: "destructive" });
      return;
    }
    if (!reason.trim()) {
      toast({ title: "Reason required", description: "Provide a reason for reversal.", variant: "destructive" });
      return;
    }
    toast({ title: "Transactions reversed", description: `${selected.size} transaction(s) reversed.`, variant: "destructive" });
    setSelected(new Set());
    setReason("");
  };

  return (
    <div className="space-y-6">
      <ChildHeader moduleId={moduleId} childId={childId} />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <KpiCard label="Reversed This Month" value={String(PAYMENT_TXNS.filter((t) => t.status === "Reversed").length)} icon={<Undo2 className="h-4 w-4" />} accent />
        <KpiCard label="Currently Selected" value={String(selected.size)} icon={<AlertTriangle className="h-4 w-4" />} />
        <KpiCard label="Total Reversed Amount" value={`₹ ${PAYMENT_TXNS.filter((t) => t.status === "Reversed").reduce((s, t) => s + parseFloat(t.amount), 0).toFixed(2)}`} icon={<Coins className="h-4 w-4" />} />
      </div>
      <SectionCard title="Reverse Transactions" description="Select transactions and provide a reason to reverse">
        <div className="overflow-x-auto scrollbar-thin">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8">Select</TableHead>
                <TableHead>Txn ID</TableHead>
                <TableHead>Account</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Mode</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Collected By</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((t) => (
                <TableRow key={t.id} data-state={selected.has(t.id) ? "selected" : undefined}>
                  <TableCell>
                    <Checkbox checked={selected.has(t.id)} onCheckedChange={() => toggle(t.id)} />
                  </TableCell>
                  <TableCell className="font-mono text-xs">{t.id}</TableCell>
                  <TableCell className="font-mono text-xs">{t.account}</TableCell>
                  <TableCell className="font-medium text-primary">{t.customer}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-[10px] ${modeBadgeClass(t.mode)}`}>{t.mode}</Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{t.amount}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{t.date}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-[10px] ${statusBadgeClass(t.status)}`}>{t.status}</Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{t.collectedBy}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-end">
          <div className="flex-1 space-y-1.5">
            <Label htmlFor="reason">Reason for Reversal</Label>
            <Input id="reason" placeholder="e.g. Duplicate payment, wrong account, customer request…" value={reason} onChange={(e) => setReason(e.target.value)} />
          </div>
          <Button variant="destructive" onClick={reverse}>
            <Undo2 className="mr-1.5 h-4 w-4" /> Reverse Selected
          </Button>
        </div>
      </SectionCard>
    </div>
  );
}

/* ---------------- Settle Transactions ---------------- */

function SettleTransactions({ moduleId, childId }: ViewProps) {
  const { toast } = useToast();
  const pending = PAYMENT_TXNS.filter((t) => t.status === "Pending");
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const toggle = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelected(next);
  };
  const toggleAll = () => {
    if (selected.size === pending.length) setSelected(new Set());
    else setSelected(new Set(pending.map((p) => p.id)));
  };
  const settle = () => {
    if (selected.size === 0) {
      toast({ title: "No selection", description: "Select one or more transactions to settle.", variant: "destructive" });
      return;
    }
    toast({ title: "Transactions settled", description: `${selected.size} transaction(s) settled.` });
    setSelected(new Set());
  };
  return (
    <div className="space-y-6">
      <ChildHeader moduleId={moduleId} childId={childId} />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <KpiCard label="Pending Settlement" value={String(pending.length)} icon={<Clock className="h-4 w-4" />} accent />
        <KpiCard label="Selected" value={String(selected.size)} icon={<CheckCircle2 className="h-4 w-4" />} />
        <KpiCard label="Pending Amount" value={`₹ ${pending.reduce((s, t) => s + parseFloat(t.amount), 0).toFixed(2)}`} icon={<Coins className="h-4 w-4" />} />
      </div>
      <SectionCard title="Pending Transactions" description="Select transactions to settle">
        {pending.length === 0 ? (
          <EmptyState icon={<CheckCircle2 className="h-5 w-5" />} title="No pending transactions" description="Everything is settled." />
        ) : (
          <>
            <ActionBar>
              <Button size="sm" onClick={settle}>
                <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" /> Settle Selected
              </Button>
              <Button variant="outline" size="sm" onClick={toggleAll}>
                {selected.size === pending.length ? "Clear All" : "Select All"}
              </Button>
            </ActionBar>
            <div className="mt-3 overflow-x-auto scrollbar-thin">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-8">
                      <Checkbox
                        checked={pending.length > 0 && selected.size === pending.length}
                        onCheckedChange={toggleAll}
                      />
                    </TableHead>
                    <TableHead>Txn ID</TableHead>
                    <TableHead>Account</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Mode</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Collected By</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pending.map((t) => (
                    <TableRow key={t.id} data-state={selected.has(t.id) ? "selected" : undefined}>
                      <TableCell>
                        <Checkbox checked={selected.has(t.id)} onCheckedChange={() => toggle(t.id)} />
                      </TableCell>
                      <TableCell className="font-mono text-xs">{t.id}</TableCell>
                      <TableCell className="font-mono text-xs">{t.account}</TableCell>
                      <TableCell className="font-medium text-primary">{t.customer}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-[10px] ${modeBadgeClass(t.mode)}`}>{t.mode}</Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{t.amount}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{t.date}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{t.collectedBy}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </SectionCard>
    </div>
  );
}
