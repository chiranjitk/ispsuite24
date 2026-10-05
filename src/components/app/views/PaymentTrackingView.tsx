"use client";

import * as React from "react";
import {
  ViewProps,
  useModuleHeader,
  useViewRouter,
  ChildOverview,
  LeafPlaceholder,
} from "./_shared";
import {
  PageHeader,
  ActionBar,
  KpiCard,
  SectionCard,
  EmptyState,
  InfoRow,
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
  Users,
  Save,
} from "lucide-react";
import {
  PAYMENT_TXNS,
  PAYMENT_MODES,
  FRANCHISE_ACCOUNTS,
  ACCOUNT_SEARCH_RESULTS,
  type PaymentTxn,
} from "@/lib/mock-data";

export function PaymentTrackingView({ moduleId, childId, grandchildId }: ViewProps) {
  const router = useViewRouter(moduleId, childId, grandchildId);

  if (router.state === "loading") return null;
  if (router.state === "module-overview")
    return <PaymentTrackingOverview moduleId={moduleId} />;
  if (router.state === "child-overview")
    return <ChildOverview moduleId={moduleId} childId={router.childId} />;

  if (router.state === "grandchild") {
    // Manage Accounts
    if (childId === "manage-accounts" && grandchildId === "customers")
      return <ManageCustomerAccountsPage {...{ moduleId, childId, grandchildId }} />;
    if (childId === "manage-accounts" && grandchildId === "zone")
      return <ManageZoneAccountsPage {...{ moduleId, childId, grandchildId }} />;

    // Search Accounts
    if (childId === "search-accounts" && grandchildId === "customer")
      return <SearchCustomerAccountsPage {...{ moduleId, childId, grandchildId }} />;
    if (childId === "search-accounts" && grandchildId === "zone")
      return <SearchZoneAccountsPage {...{ moduleId, childId, grandchildId }} />;

    // Payment Details
    if (childId === "payment-details" && grandchildId === "search-details")
      return <SearchPaymentDetailsPage {...{ moduleId, childId, grandchildId }} />;
    if (childId === "payment-details" && grandchildId === "payment-mode")
      return <PaymentModePage {...{ moduleId, childId, grandchildId }} />;

    // Reverse
    if (childId === "reverse" && grandchildId === "customer")
      return <ReverseCustomerTxnPage {...{ moduleId, childId, grandchildId }} />;
    if (childId === "reverse" && grandchildId === "zone")
      return <ReverseZoneTxnPage {...{ moduleId, childId, grandchildId }} />;

    // Settle
    if (childId === "settle" && grandchildId === "customers")
      return <SettleCustomerTxnPage {...{ moduleId, childId, grandchildId }} />;

    return (
      <LeafPlaceholder
        moduleId={moduleId}
        childId={router.childId}
        grandchildId={router.grandchildId}
      />
    );
  }

  return <PaymentTrackingOverview moduleId={moduleId} />;
}

/* ================ Shared helpers ================ */

function useBreadcrumb(moduleId: string, childId: string, grandchildId?: string) {
  const { mod, child, grandchild } = useModuleHeader(moduleId, childId, grandchildId);
  const setActive = useAppStore((s) => s.setActive);
  return [
    { label: "Cryptsk" },
    { label: mod?.label ?? "Payment Tracking", onClick: () => setActive(moduleId, "", "") },
    { label: child?.label ?? childId, onClick: () => setActive(moduleId, childId, "") },
    ...(grandchild ? [{ label: grandchild.label }] : []),
  ];
}

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

/* ================ Overview ================ */

function PaymentTrackingOverview({ moduleId }: { moduleId: string }) {
  const { mod } = useModuleHeader(moduleId);
  const setActive = useAppStore((s) => s.setActive);
  if (!mod) return null;
  const cards = [
    { label: "Manage Accounts", desc: "Customer & zone account ledgers", icon: Wallet, child: "manage-accounts" },
    { label: "Search Accounts", desc: "Customer & zone lookup", icon: Search, child: "search-accounts" },
    { label: "Payment Details", desc: "Payment history & modes", icon: Coins, child: "payment-details" },
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

/* ================ MANAGE ACCOUNTS: CUSTOMERS ================ */

interface CustomerAccount {
  id: string;
  account: string;
  customer: string;
  balance: string;
  lastPayment: string;
  status: "Active" | "Suspended";
}

const INITIAL_CUSTOMER_ACCOUNTS: CustomerAccount[] = [
  { id: "CA01", account: "A000002959", customer: "shubham270597", balance: "0.00", lastPayment: "04 Oct 2026 — UPI 599.00", status: "Active" },
  { id: "CA02", account: "A000003537", customer: "rajesh130773", balance: "899.00", lastPayment: "01 Oct 2026 — Cash 899.00", status: "Active" },
  { id: "CA03", account: "A000001743", customer: "suresh030381", balance: "0.00", lastPayment: "03 Oct 2026 — Card 599.00", status: "Active" },
  { id: "CA04", account: "A000003572", customer: "sweety250397", balance: "1,298.00", lastPayment: "27 Sep 2026 — UPI 649.00", status: "Suspended" },
  { id: "CA05", account: "A000002884", customer: "ravi130686", balance: "0.00", lastPayment: "02 Oct 2026 — Bank Transfer 4999.00", status: "Active" },
];

function ManageCustomerAccountsPage({ moduleId, childId, grandchildId }: ViewProps) {
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const [rows] = React.useState<CustomerAccount[]>(INITIAL_CUSTOMER_ACCOUNTS);

  const totalBalance = rows.reduce((s, r) => s + parseFloat(r.balance.replace(/,/g, "")), 0);
  const active = rows.filter((r) => r.status === "Active").length;

  return (
    <div className="space-y-6">
      <PageHeader title="Manage Customer Accounts" description="Customer account ledgers with balance & last payment." icon={<Users className="h-5 w-5" />} breadcrumb={breadcrumb}
        actions={<Button variant="outline" size="sm" onClick={() => toast({ title: "Export started", description: `Exporting ${rows.length} account(s).` })}><Download className="mr-1.5 h-3.5 w-3.5" /> Export</Button>} />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard label="Total Accounts" value={String(rows.length)} icon={<Users className="h-4 w-4" />} accent />
        <KpiCard label="Active" value={String(active)} icon={<CheckCircle2 className="h-4 w-4" />} />
        <KpiCard label="Suspended" value={String(rows.length - active)} icon={<AlertTriangle className="h-4 w-4" />} />
        <KpiCard label="Outstanding" value={`₹${totalBalance.toFixed(2)}`} icon={<Coins className="h-4 w-4" />} />
      </div>
      <SectionCard title="Customer Accounts" description={`${rows.length} account(s)`}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow><TableHead>Account</TableHead><TableHead>Customer</TableHead><TableHead>Balance</TableHead><TableHead>Last Payment</TableHead><TableHead>Status</TableHead></TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-mono text-xs">{r.account}</TableCell>
                  <TableCell className="font-medium text-primary">{r.customer}</TableCell>
                  <TableCell className={`font-mono text-xs ${parseFloat(r.balance.replace(/,/g, "")) > 0 ? "text-amber-600 dark:text-amber-400" : ""}`}>₹{r.balance}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{r.lastPayment}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={r.status === "Active" ? "bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400" : "bg-primary/10 text-primary hover:bg-primary/10"}>{r.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {rows.length === 0 && <EmptyState icon={<Users className="h-5 w-5" />} title="No customer accounts" />}
      </SectionCard>
    </div>
  );
}

/* ================ MANAGE ACCOUNTS: ZONE ================ */

interface ZoneAccount {
  id: string;
  zone: string;
  franchise: string;
  balance: string;
  status: "Active" | "Suspended";
}

const INITIAL_ZONE_ACCOUNTS: ZoneAccount[] = FRANCHISE_ACCOUNTS.map((f, i) => ({
  id: f.id,
  zone: ["Bhiwani-Core", "Bhiwani-North", "Bhiwani-South", "Bhiwani-East", "Bhiwani-West", "Bhiwani-North"][i] ?? "Bhiwani-Core",
  franchise: f.name,
  balance: f.balance,
  status: f.status === "Active" ? "Active" : "Suspended",
}));

function ManageZoneAccountsPage({ moduleId, childId, grandchildId }: ViewProps) {
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const [rows] = React.useState<ZoneAccount[]>(INITIAL_ZONE_ACCOUNTS);

  const active = rows.filter((r) => r.status === "Active").length;

  return (
    <div className="space-y-6">
      <PageHeader title="Manage Zone Accounts" description="Zone / franchise account ledgers." icon={<Building2 className="h-5 w-5" />} breadcrumb={breadcrumb}
        actions={<Button variant="outline" size="sm" onClick={() => toast({ title: "Export started", description: `Exporting ${rows.length} account(s).` })}><Download className="mr-1.5 h-3.5 w-3.5" /> Export</Button>} />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <KpiCard label="Total Accounts" value={String(rows.length)} icon={<Building2 className="h-4 w-4" />} accent />
        <KpiCard label="Active" value={String(active)} icon={<CheckCircle2 className="h-4 w-4" />} />
        <KpiCard label="Suspended" value={String(rows.length - active)} icon={<AlertTriangle className="h-4 w-4" />} />
      </div>
      <SectionCard title="Zone Accounts" description={`${rows.length} account(s)`}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow><TableHead>Zone</TableHead><TableHead>Franchise</TableHead><TableHead>Balance</TableHead><TableHead>Status</TableHead></TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="text-muted-foreground">{r.zone}</TableCell>
                  <TableCell className="font-medium">{r.franchise}</TableCell>
                  <TableCell className={`font-mono text-xs ${r.balance.startsWith("-") ? "text-primary" : "text-foreground"}`}>₹{r.balance}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={r.status === "Active" ? "bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400" : "bg-primary/10 text-primary hover:bg-primary/10"}>{r.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {rows.length === 0 && <EmptyState icon={<Building2 className="h-5 w-5" />} title="No zone accounts" />}
      </SectionCard>
    </div>
  );
}

/* ================ SEARCH ACCOUNTS: CUSTOMER ================ */

function SearchCustomerAccountsPage({ moduleId, childId, grandchildId }: ViewProps) {
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const [query, setQuery] = React.useState("");
  const [searched, setSearched] = React.useState(false);

  const results = ACCOUNT_SEARCH_RESULTS.filter((a) => {
    if (!query.trim()) return false;
    const q = query.toLowerCase();
    return a.account.toLowerCase().includes(q) || a.customer.toLowerCase().includes(q) || a.id.toLowerCase().includes(q);
  });

  const search = () => {
    if (!query.trim()) {
      toast({ title: "Enter a search term", description: "Type an account no, customer name or mobile.", variant: "destructive" });
      return;
    }
    setSearched(true);
    toast({ title: "Search complete", description: `${results.length} account(s) found.` });
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Search Customer Accounts" description="Look up customer accounts by account no / name / mobile." icon={<Search className="h-5 w-5" />} breadcrumb={breadcrumb} />
      <SectionCard title="Search" description="Enter your search criteria">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="space-y-2 sm:col-span-2">
            <Label>Account / Name / Mobile</Label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="e.g. A000002959 or shubham270597 or 9876..." className="pl-9" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && search()} />
            </div>
          </div>
          <div className="flex items-end gap-2">
            <Button onClick={search}><Search className="mr-2 h-4 w-4" /> Search</Button>
            <Button variant="outline" onClick={() => { setQuery(""); setSearched(false); }}><RefreshCw className="mr-1.5 h-4 w-4" /> Reset</Button>
          </div>
        </div>
      </SectionCard>
      {searched && (
        <SectionCard title="Search Results" description={`${results.length} account(s)`}>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow><TableHead>Account</TableHead><TableHead>Customer</TableHead><TableHead>Balance</TableHead><TableHead>Last Payment</TableHead><TableHead>Status</TableHead></TableRow>
              </TableHeader>
              <TableBody>
                {results.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-mono text-xs">{a.account}</TableCell>
                    <TableCell className="font-medium text-primary">{a.customer}</TableCell>
                    <TableCell className="font-mono text-xs">₹{a.balance}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{a.lastPayment}</TableCell>
                    <TableCell><Badge variant="outline" className={a.status === "Active" ? "bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400" : "bg-primary/10 text-primary hover:bg-primary/10"}>{a.status}</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {results.length === 0 && <EmptyState icon={<Search className="h-5 w-5" />} title="No matching accounts" />}
        </SectionCard>
      )}
    </div>
  );
}

/* ================ SEARCH ACCOUNTS: ZONE ================ */

function SearchZoneAccountsPage({ moduleId, childId, grandchildId }: ViewProps) {
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const [zone, setZone] = React.useState("all");
  const [query, setQuery] = React.useState("");
  const [searched, setSearched] = React.useState(false);

  const results = INITIAL_ZONE_ACCOUNTS.filter((r) => {
    if (zone !== "all" && r.zone !== zone) return false;
    if (query.trim()) {
      const q = query.toLowerCase();
      if (!r.franchise.toLowerCase().includes(q) && !r.zone.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const search = () => {
    setSearched(true);
    toast({ title: "Search complete", description: `${results.length} account(s) found.` });
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Search Zone Accounts" description="Look up zone / franchise accounts." icon={<Building2 className="h-5 w-5" />} breadcrumb={breadcrumb} />
      <SectionCard title="Search" description="Filter by zone or franchise name">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label>Zone</Label>
            <Select value={zone} onValueChange={setZone}>
              <SelectTrigger><SelectValue placeholder="All zones" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All zones</SelectItem>
                <SelectItem value="Bhiwani-Core">Bhiwani-Core</SelectItem>
                <SelectItem value="Bhiwani-North">Bhiwani-North</SelectItem>
                <SelectItem value="Bhiwani-South">Bhiwani-South</SelectItem>
                <SelectItem value="Bhiwani-East">Bhiwani-East</SelectItem>
                <SelectItem value="Bhiwani-West">Bhiwani-West</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Franchise Name</Label>
            <Input placeholder="e.g. Franchise-12" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && search()} />
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => { setZone("all"); setQuery(""); setSearched(false); }}><RefreshCw className="mr-1.5 h-4 w-4" /> Reset</Button>
          <Button onClick={search}><Search className="mr-2 h-4 w-4" /> Search</Button>
        </div>
      </SectionCard>
      {searched && (
        <SectionCard title="Search Results" description={`${results.length} account(s)`}>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow><TableHead>Zone</TableHead><TableHead>Franchise</TableHead><TableHead>Balance</TableHead><TableHead>Status</TableHead></TableRow>
              </TableHeader>
              <TableBody>
                {results.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="text-muted-foreground">{r.zone}</TableCell>
                    <TableCell className="font-medium">{r.franchise}</TableCell>
                    <TableCell className={`font-mono text-xs ${r.balance.startsWith("-") ? "text-primary" : ""}`}>₹{r.balance}</TableCell>
                    <TableCell><Badge variant="outline" className={r.status === "Active" ? "bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400" : "bg-primary/10 text-primary hover:bg-primary/10"}>{r.status}</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {results.length === 0 && <EmptyState icon={<Building2 className="h-5 w-5" />} title="No matching accounts" />}
        </SectionCard>
      )}
    </div>
  );
}

/* ================ PAYMENT DETAILS: SEARCH DETAILS ================ */

function SearchPaymentDetailsPage({ moduleId, childId, grandchildId }: ViewProps) {
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const [fromDate, setFromDate] = React.useState("");
  const [toDate, setToDate] = React.useState("");
  const [account, setAccount] = React.useState("");
  const [mode, setMode] = React.useState("all");
  const [searched, setSearched] = React.useState(false);

  const filtered = PAYMENT_TXNS.filter((t) => {
    if (mode !== "all" && t.mode !== mode) return false;
    if (account.trim()) {
      const q = account.toLowerCase();
      if (!t.account.toLowerCase().includes(q) && !t.customer.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const search = () => {
    setSearched(true);
    toast({ title: "Search complete", description: `${filtered.length} transaction(s) found.` });
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Search Payment Details" description="Filter payment history by date, account & mode." icon={<Coins className="h-5 w-5" />} breadcrumb={breadcrumb} />
      <SectionCard title="Filters" description="Date range, account & mode">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div className="space-y-2"><Label>From Date</Label><Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} /></div>
          <div className="space-y-2"><Label>To Date</Label><Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} /></div>
          <div className="space-y-2"><Label>Account / Customer</Label><Input placeholder="A000002959 or shubham270597" value={account} onChange={(e) => setAccount(e.target.value)} /></div>
          <div className="space-y-2">
            <Label>Mode</Label>
            <Select value={mode} onValueChange={setMode}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All modes</SelectItem>
                <SelectItem value="Cash">Cash</SelectItem>
                <SelectItem value="UPI">UPI</SelectItem>
                <SelectItem value="Card">Card</SelectItem>
                <SelectItem value="Cheque">Cheque</SelectItem>
                <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => { setFromDate(""); setToDate(""); setAccount(""); setMode("all"); setSearched(false); }}><RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Reset</Button>
          <Button size="sm" onClick={search}><Search className="mr-1.5 h-3.5 w-3.5" /> Search</Button>
        </div>
      </SectionCard>
      {searched && (
        <SectionCard title="Payment Transactions" description={`${filtered.length} transaction(s)`}
          actions={<Button variant="outline" size="sm" onClick={() => toast({ title: "Export started" })}><Download className="mr-1.5 h-3.5 w-3.5" /> Export</Button>}>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow><TableHead>ID</TableHead><TableHead>Account</TableHead><TableHead>Customer</TableHead><TableHead>Mode</TableHead><TableHead>Amount</TableHead><TableHead>Date</TableHead><TableHead>Status</TableHead><TableHead>Collected By</TableHead></TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="font-mono text-xs">{t.id}</TableCell>
                    <TableCell className="font-mono text-xs">{t.account}</TableCell>
                    <TableCell className="font-medium text-primary">{t.customer}</TableCell>
                    <TableCell><Badge variant="outline" className={`text-[10px] ${modeBadgeClass(t.mode)}`}>{t.mode}</Badge></TableCell>
                    <TableCell className="font-mono text-xs">{t.amount}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{t.date}</TableCell>
                    <TableCell><Badge variant="outline" className={`text-[10px] ${statusBadgeClass(t.status)}`}>{t.status}</Badge></TableCell>
                    <TableCell className="text-xs text-muted-foreground">{t.collectedBy}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filtered.length === 0 && <EmptyState icon={<Coins className="h-5 w-5" />} title="No transactions match your filters" />}
        </SectionCard>
      )}
    </div>
  );
}

/* ================ PAYMENT DETAILS: PAYMENT MODE ================ */

function PaymentModePage({ moduleId, childId, grandchildId }: ViewProps) {
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const [modes, setModes] = React.useState(PAYMENT_MODES);

  const toggle = (id: string, enabled: boolean) => {
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
      <PageHeader title="Payment Mode" description="Enable / disable payment modes & set the default." icon={<Wallet className="h-5 w-5" />} breadcrumb={breadcrumb} />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <KpiCard label="Total Modes" value={String(modes.length)} icon={<Wallet className="h-4 w-4" />} accent />
        <KpiCard label="Enabled" value={String(modes.filter((m) => m.enabled).length)} icon={<CheckCircle2 className="h-4 w-4" />} />
        <KpiCard label="Default" value={modes.find((m) => m.isDefault)?.name ?? "—"} icon={<Coins className="h-4 w-4" />} />
      </div>
      <SectionCard title="Payment Modes" description="Enable / disable modes and set the default">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow><TableHead className="w-10">Enabled</TableHead><TableHead>Mode</TableHead><TableHead>Default</TableHead><TableHead className="text-right">Actions</TableHead></TableRow>
            </TableHeader>
            <TableBody>
              {modes.map((m) => (
                <TableRow key={m.id}>
                  <TableCell><Switch checked={m.enabled} onCheckedChange={(v) => toggle(m.id, v)} /></TableCell>
                  <TableCell className="font-medium">{m.name}</TableCell>
                  <TableCell>{m.isDefault ? <Badge className="bg-primary/10 text-primary hover:bg-primary/10">Default</Badge> : <span className="text-xs text-muted-foreground">—</span>}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" disabled={!m.enabled || m.isDefault} onClick={() => setDefault(m.id)}>Set Default</Button>
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

/* ================ REVERSE: CUSTOMER ================ */

function ReverseCustomerTxnPage({ moduleId, childId, grandchildId }: ViewProps) {
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const [search, setSearch] = React.useState("");
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const [reason, setReason] = React.useState("");

  const rows = PAYMENT_TXNS.filter((t) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return t.account.toLowerCase().includes(q) || t.customer.toLowerCase().includes(q) || t.id.toLowerCase().includes(q);
  });

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
    toast({ title: "Customer transactions reversed", description: `${selected.size} transaction(s) reversed.`, variant: "destructive" });
    setSelected(new Set());
    setReason("");
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Reverse Customer Transactions" description="Search and reverse customer payment transactions." icon={<Undo2 className="h-5 w-5" />} breadcrumb={breadcrumb} />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <KpiCard label="Available" value={String(rows.length)} icon={<Coins className="h-4 w-4" />} accent />
        <KpiCard label="Selected" value={String(selected.size)} icon={<AlertTriangle className="h-4 w-4" />} />
        <KpiCard label="Already Reversed" value={String(PAYMENT_TXNS.filter((t) => t.status === "Reversed").length)} icon={<Undo2 className="h-4 w-4" />} />
      </div>
      <ActionBar>
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search account / customer / txn id" className="h-8 w-[280px] pl-8 text-xs" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </ActionBar>
      <SectionCard title="Customer Transactions" description={`${rows.length} transaction(s)`}>
        <div className="max-h-96 overflow-y-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-card">
              <TableRow><TableHead className="w-8">Select</TableHead><TableHead>Txn ID</TableHead><TableHead>Account</TableHead><TableHead>Customer</TableHead><TableHead>Mode</TableHead><TableHead>Amount</TableHead><TableHead>Status</TableHead></TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((t) => (
                <TableRow key={t.id} data-state={selected.has(t.id) ? "selected" : undefined}>
                  <TableCell><Checkbox checked={selected.has(t.id)} onCheckedChange={() => toggle(t.id)} disabled={t.status === "Reversed"} /></TableCell>
                  <TableCell className="font-mono text-xs">{t.id}</TableCell>
                  <TableCell className="font-mono text-xs">{t.account}</TableCell>
                  <TableCell className="font-medium text-primary">{t.customer}</TableCell>
                  <TableCell><Badge variant="outline" className={`text-[10px] ${modeBadgeClass(t.mode)}`}>{t.mode}</Badge></TableCell>
                  <TableCell className="font-mono text-xs">{t.amount}</TableCell>
                  <TableCell><Badge variant="outline" className={`text-[10px] ${statusBadgeClass(t.status)}`}>{t.status}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-end">
          <div className="flex-1 space-y-2">
            <Label htmlFor="reason">Reason for Reversal</Label>
            <Input id="reason" placeholder="e.g. Duplicate payment, wrong account…" value={reason} onChange={(e) => setReason(e.target.value)} />
          </div>
          <Button variant="destructive" onClick={reverse}><Undo2 className="mr-2 h-4 w-4" /> Reverse Selected</Button>
        </div>
      </SectionCard>
    </div>
  );
}

/* ================ REVERSE: ZONE ================ */

interface ZoneTxn {
  id: string;
  franchise: string;
  zone: string;
  mode: PaymentTxn["mode"];
  amount: string;
  date: string;
  status: PaymentTxn["status"];
}

const INITIAL_ZONE_TXNS: ZoneTxn[] = [
  { id: "ZT-0501", franchise: "Franchise-12 Bhiwani", zone: "Bhiwani-Core", mode: "Cash", amount: "899.00", date: "04 Oct 2026", status: "Pending" },
  { id: "ZT-0500", franchise: "Franchise-09 Rohtak", zone: "Bhiwani-North", mode: "UPI", amount: "1299.00", date: "03 Oct 2026", status: "Settled" },
  { id: "ZT-0499", franchise: "Franchise-14 Hisar", zone: "Bhiwani-South", mode: "Cheque", amount: "1797.00", date: "03 Oct 2026", status: "Reversed" },
  { id: "ZT-0498", franchise: "Franchise-21 Jhajjar", zone: "Bhiwani-East", mode: "Bank Transfer", amount: "4999.00", date: "02 Oct 2026", status: "Settled" },
];

function ReverseZoneTxnPage({ moduleId, childId, grandchildId }: ViewProps) {
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const [search, setSearch] = React.useState("");
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const [reason, setReason] = React.useState("");

  const rows = INITIAL_ZONE_TXNS.filter((t) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return t.franchise.toLowerCase().includes(q) || t.zone.toLowerCase().includes(q) || t.id.toLowerCase().includes(q);
  });

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
    toast({ title: "Zone transactions reversed", description: `${selected.size} transaction(s) reversed.`, variant: "destructive" });
    setSelected(new Set());
    setReason("");
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Reverse Zone Transactions" description="Search and reverse zone / franchise payment transactions." icon={<Undo2 className="h-5 w-5" />} breadcrumb={breadcrumb} />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <KpiCard label="Available" value={String(rows.length)} icon={<Building2 className="h-4 w-4" />} accent />
        <KpiCard label="Selected" value={String(selected.size)} icon={<AlertTriangle className="h-4 w-4" />} />
        <KpiCard label="Already Reversed" value={String(INITIAL_ZONE_TXNS.filter((t) => t.status === "Reversed").length)} icon={<Undo2 className="h-4 w-4" />} />
      </div>
      <ActionBar>
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search franchise / zone / txn id" className="h-8 w-[280px] pl-8 text-xs" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </ActionBar>
      <SectionCard title="Zone Transactions" description={`${rows.length} transaction(s)`}>
        <div className="max-h-96 overflow-y-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-card">
              <TableRow><TableHead className="w-8">Select</TableHead><TableHead>Txn ID</TableHead><TableHead>Franchise</TableHead><TableHead>Zone</TableHead><TableHead>Mode</TableHead><TableHead>Amount</TableHead><TableHead>Status</TableHead></TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((t) => (
                <TableRow key={t.id} data-state={selected.has(t.id) ? "selected" : undefined}>
                  <TableCell><Checkbox checked={selected.has(t.id)} onCheckedChange={() => toggle(t.id)} disabled={t.status === "Reversed"} /></TableCell>
                  <TableCell className="font-mono text-xs">{t.id}</TableCell>
                  <TableCell className="font-medium">{t.franchise}</TableCell>
                  <TableCell className="text-muted-foreground">{t.zone}</TableCell>
                  <TableCell><Badge variant="outline" className={`text-[10px] ${modeBadgeClass(t.mode)}`}>{t.mode}</Badge></TableCell>
                  <TableCell className="font-mono text-xs">{t.amount}</TableCell>
                  <TableCell><Badge variant="outline" className={`text-[10px] ${statusBadgeClass(t.status)}`}>{t.status}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-end">
          <div className="flex-1 space-y-2">
            <Label htmlFor="zreason">Reason for Reversal</Label>
            <Input id="zreason" placeholder="e.g. Wrong franchise credit, customer dispute…" value={reason} onChange={(e) => setReason(e.target.value)} />
          </div>
          <Button variant="destructive" onClick={reverse}><Undo2 className="mr-2 h-4 w-4" /> Reverse Selected</Button>
        </div>
      </SectionCard>
    </div>
  );
}

/* ================ SETTLE: CUSTOMERS ================ */

function SettleCustomerTxnPage({ moduleId, childId, grandchildId }: ViewProps) {
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);
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
      <PageHeader title="Settle Customer Transactions" description="Settle pending customer payments." icon={<CheckCircle2 className="h-5 w-5" />} breadcrumb={breadcrumb} />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <KpiCard label="Pending Settlement" value={String(pending.length)} icon={<Clock className="h-4 w-4" />} accent />
        <KpiCard label="Selected" value={String(selected.size)} icon={<CheckCircle2 className="h-4 w-4" />} />
        <KpiCard label="Pending Amount" value={`₹${pending.reduce((s, t) => s + parseFloat(t.amount), 0).toFixed(2)}`} icon={<Coins className="h-4 w-4" />} />
      </div>
      <SectionCard title="Pending Transactions" description="Select transactions to settle">
        {pending.length === 0 ? (
          <EmptyState icon={<CheckCircle2 className="h-5 w-5" />} title="No pending transactions" description="Everything is settled." />
        ) : (
          <>
            <ActionBar>
              <Button size="sm" onClick={settle}><CheckCircle2 className="mr-1.5 h-3.5 w-3.5" /> Settle Selected</Button>
              <Button variant="outline" size="sm" onClick={toggleAll}>{selected.size === pending.length ? "Clear All" : "Select All"}</Button>
            </ActionBar>
            <div className="mt-3 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-8"><Checkbox checked={selected.size === pending.length && pending.length > 0} onCheckedChange={toggleAll} /></TableHead>
                    <TableHead>Txn ID</TableHead><TableHead>Account</TableHead><TableHead>Customer</TableHead><TableHead>Mode</TableHead><TableHead>Amount</TableHead><TableHead>Date</TableHead><TableHead>Collected By</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pending.map((t) => (
                    <TableRow key={t.id} data-state={selected.has(t.id) ? "selected" : undefined}>
                      <TableCell><Checkbox checked={selected.has(t.id)} onCheckedChange={() => toggle(t.id)} /></TableCell>
                      <TableCell className="font-mono text-xs">{t.id}</TableCell>
                      <TableCell className="font-mono text-xs">{t.account}</TableCell>
                      <TableCell className="font-medium text-primary">{t.customer}</TableCell>
                      <TableCell><Badge variant="outline" className={`text-[10px] ${modeBadgeClass(t.mode)}`}>{t.mode}</Badge></TableCell>
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
