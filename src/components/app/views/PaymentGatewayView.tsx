"use client";

import * as React from "react";
import { ViewProps, useModuleHeader } from "./_shared";
import { PageHeader, KpiCard, SectionCard, EmptyState } from "@/components/app/shared";
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
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  CreditCard,
  Settings2,
  Store,
  Search,
  Save,
  Plus,
  Pencil,
  RefreshCw,
  TrendingUp,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Filter,
  IndianRupee,
  Globe,
  Eye,
  EyeOff,
  KeyRound,
} from "lucide-react";
import {
  MERCHANTS,
  GATEWAY_TXNS,
  type Merchant,
  type GatewayTxn,
} from "@/lib/mock-data";

export function PaymentGatewayView({ moduleId, childId }: ViewProps) {
  const { mod } = useModuleHeader(moduleId, childId);
  if (!mod) return null;
  if (!childId) return <GatewayOverview moduleId={moduleId} />;
  switch (childId) {
    case "configure":
      return <ConfigureChild moduleId={moduleId} childId={childId} />;
    case "merchant":
      return <MerchantChild moduleId={moduleId} childId={childId} />;
    case "search-transactions":
      return <SearchTxnChild moduleId={moduleId} childId={childId} />;
    default:
      return <GatewayOverview moduleId={moduleId} />;
  }
}

/* ---------------- Overview ---------------- */

function GatewayOverview({ moduleId }: { moduleId: string }) {
  const { mod } = useModuleHeader(moduleId);
  const setActive = useAppStore((s) => s.setActive);
  if (!mod) return null;
  const successCount = GATEWAY_TXNS.filter((t) => t.status === "Success").length;
  const refundedCount = GATEWAY_TXNS.filter((t) => t.status === "Refunded").length;
  const successRate = ((successCount / GATEWAY_TXNS.length) * 100).toFixed(1);
  const cards = [
    { label: "Configure", desc: "Gateway provider & credentials", icon: Settings2, child: "configure" },
    { label: "Merchant", desc: `${MERCHANTS.length} merchant accounts`, icon: Store, child: "merchant" },
    { label: "Search Transactions", desc: `${GATEWAY_TXNS.length} recent txns`, icon: Search, child: "search-transactions" },
  ];
  return (
    <div className="space-y-6">
      <PageHeader title={mod.label} description={mod.desc} icon={<mod.icon className="h-5 w-5" />} />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <KpiCard label="Total Transactions" value={String(GATEWAY_TXNS.length)} icon={<CreditCard className="h-4 w-4" />} accent />
        <KpiCard label="Success Rate" value={`${successRate}%`} icon={<TrendingUp className="h-4 w-4" />} />
        <KpiCard label="Refunded" value={String(refundedCount)} icon={<RotateCcw className="h-4 w-4" />} />
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

/* ---------------- Configure ---------------- */

function ConfigureChild({ moduleId, childId }: ViewProps) {
  const { mod, child } = useModuleHeader(moduleId, childId);
  const { toast } = useToast();
  const [provider, setProvider] = React.useState("Razorpay");
  const [currency, setCurrency] = React.useState("INR");
  const [testMode, setTestMode] = React.useState(true);
  const [showSecret, setShowSecret] = React.useState(false);
  if (!mod) return null;
  return (
    <div className="space-y-6">
      <PageHeader
        title={child!.label}
        description="Configure payment gateway provider credentials, callbacks and currency."
        icon={<mod.icon className="h-5 w-5" />}
        breadcrumb={[{ label: "Cryptsk" }, { label: mod.label }, { label: child!.label }]}
        actions={
          <Button onClick={() => toast({ title: "Gateway config saved", description: `${provider} configuration saved${testMode ? " (test mode)" : ""}.` })}>
            <Save className="mr-2 h-4 w-4" /> Save Configuration
          </Button>
        }
      />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SectionCard title="Provider Credentials">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Payment Provider</Label>
              <Select value={provider} onValueChange={setProvider}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Razorpay">Razorpay</SelectItem>
                  <SelectItem value="PayU">PayU</SelectItem>
                  <SelectItem value="Stripe">Stripe</SelectItem>
                  <SelectItem value="Cashfree">Cashfree</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Merchant ID</Label>
              <Input defaultValue="rzp_live_BHIWANI" placeholder="Provider-issued merchant ID" />
            </div>
            <div className="space-y-1.5">
              <Label>Secret / API Key</Label>
              <div className="relative">
                <Input
                  type={showSecret ? "text" : "password"}
                  defaultValue="sk_live_5f3eBhiwaniCryptsk"
                  className="pr-9 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowSecret((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showSecret ? "Hide secret" : "Show secret"}
                >
                  {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                <KeyRound className="mr-1 inline h-3 w-3" /> Stored encrypted at rest. Never exposed in client GUI.
              </p>
            </div>
            <div className="space-y-1.5">
              <Label>Callback / Webhook URL</Label>
              <Input defaultValue="https://noc.cryptsk.in/api/payments/callback" className="font-mono text-xs" />
            </div>
          </div>
        </SectionCard>
        <SectionCard title="Mode & Currency">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Currency</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="INR">INR — Indian Rupee (₹)</SelectItem>
                  <SelectItem value="USD">USD — US Dollar ($)</SelectItem>
                  <SelectItem value="EUR">EUR — Euro (€)</SelectItem>
                  <SelectItem value="AED">AED — UAE Dirham</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Settlement Cycle</Label>
              <Select defaultValue="t2">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="t1">T+1 (next business day)</SelectItem>
                  <SelectItem value="t2">T+2</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <label className="flex items-center justify-between rounded-lg border border-border p-3">
              <div>
                <p className="text-sm font-medium text-foreground">Test Mode</p>
                <p className="text-xs text-muted-foreground">Route transactions through the sandbox environment.</p>
              </div>
              <Switch checked={testMode} onCheckedChange={setTestMode} aria-label="Test mode toggle" />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-border p-3">
                <p className="text-xs text-muted-foreground">Min amount</p>
                <p className="mt-1 font-mono text-sm font-semibold">₹1.00</p>
              </div>
              <div className="rounded-lg border border-border p-3">
                <p className="text-xs text-muted-foreground">Max amount</p>
                <p className="mt-1 font-mono text-sm font-semibold">₹5,00,000.00</p>
              </div>
            </div>
            <div className="rounded-lg bg-primary/5 p-3 text-xs text-primary">
              <Globe className="mr-1 inline h-3.5 w-3.5" /> Active provider: <span className="font-semibold">{provider}</span> · Currency: <span className="font-semibold">{currency}</span> · Mode: <span className="font-semibold">{testMode ? "TEST" : "LIVE"}</span>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

/* ---------------- Merchant ---------------- */

function MerchantChild({ moduleId, childId }: ViewProps) {
  const { mod, child } = useModuleHeader(moduleId, childId);
  const { toast } = useToast();
  const [merchants, setMerchants] = React.useState<Merchant[]>(MERCHANTS);
  if (!mod) return null;
  const setDefault = (id: string) => {
    setMerchants((prev) => prev.map((m) => ({ ...m, isDefault: m.id === id })));
    const m = merchants.find((x) => x.id === id);
    toast({ title: "Default merchant updated", description: `${m?.name} is now the default ${m?.provider} account.` });
  };
  const toggleStatus = (id: string) => {
    setMerchants((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: m.status === "Active" ? "Inactive" : "Active" } : m))
    );
    const m = merchants.find((x) => x.id === id);
    toast({ title: `${m?.status === "Active" ? "Deactivated" : "Activated"} merchant`, description: m?.name });
  };
  return (
    <div className="space-y-6">
      <PageHeader
        title={child!.label}
        description="Manage merchant accounts across providers and select the default for new transactions."
        icon={<mod.icon className="h-5 w-5" />}
        breadcrumb={[{ label: "Cryptsk" }, { label: mod.label }, { label: child!.label }]}
        actions={
          <Button onClick={() => toast({ title: "Add merchant", description: "Merchant onboarding form will open." })}>
            <Plus className="mr-2 h-4 w-4" /> Add Merchant
          </Button>
        }
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard label="Merchants" value={String(merchants.length)} icon={<Store className="h-4 w-4" />} accent />
        <KpiCard label="Active" value={String(merchants.filter((m) => m.status === "Active").length)} icon={<CheckCircle2 className="h-4 w-4" />} />
        <KpiCard label="Providers" value={String(new Set(merchants.map((m) => m.provider)).size)} icon={<CreditCard className="h-4 w-4" />} />
        <KpiCard label="Default" value={merchants.find((m) => m.isDefault)?.provider ?? "—"} icon={<TrendingUp className="h-4 w-4" />} />
      </div>
      <SectionCard title="Merchant Accounts" description={`${merchants.length} accounts`}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Merchant ID</TableHead>
                <TableHead>Default</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {merchants.map((m) => (
                <TableRow key={m.id} data-state={m.status === "Inactive" ? "selected" : undefined}>
                  <TableCell className="font-mono text-xs">{m.id}</TableCell>
                  <TableCell className="font-medium">{m.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">{m.provider}</Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{m.merchantId}</TableCell>
                  <TableCell>
                    <Checkbox checked={m.isDefault} onCheckedChange={() => setDefault(m.id)} aria-label={`Set ${m.name} as default`} />
                  </TableCell>
                  <TableCell>
                    <button onClick={() => toggleStatus(m.id)} aria-label={`Toggle ${m.name} status`}>
                      <Badge variant="outline" className={m.status === "Active"
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                        : "border-border bg-muted text-muted-foreground"}
                      >
                        {m.status}
                      </Badge>
                    </button>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => toast({ title: "Edit merchant", description: m.name })}>
                      <Pencil className="mr-1 h-3.5 w-3.5" /> Edit
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

/* ---------------- Search Transactions ---------------- */

function SearchTxnChild({ moduleId, childId }: ViewProps) {
  const { mod, child } = useModuleHeader(moduleId, childId);
  const { toast } = useToast();
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [gatewayFilter, setGatewayFilter] = React.useState("all");
  const [from, setFrom] = React.useState("");
  const [to, setTo] = React.useState("");
  if (!mod) return null;
  const filtered = GATEWAY_TXNS.filter((t) => {
    if (statusFilter !== "all" && t.status !== statusFilter) return false;
    if (gatewayFilter !== "all" && t.gateway !== gatewayFilter) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      t.id.toLowerCase().includes(q) ||
      t.customer.toLowerCase().includes(q) ||
      t.account.toLowerCase().includes(q)
    );
  });
  const statusBadge = (s: GatewayTxn["status"]) => {
    if (s === "Success")
      return <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">{s}</Badge>;
    if (s === "Failed")
      return <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">{s}</Badge>;
    if (s === "Refunded")
      return <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400">{s}</Badge>;
    return <Badge variant="outline" className="border-border bg-muted text-muted-foreground">{s}</Badge>;
  };
  const successCount = filtered.filter((t) => t.status === "Success").length;
  const failedCount = filtered.filter((t) => t.status === "Failed").length;
  const refundedCount = filtered.filter((t) => t.status === "Refunded").length;
  const totalAmount = filtered.reduce((a, t) => a + Number(t.amount), 0);
  return (
    <div className="space-y-6">
      <PageHeader
        title={child!.label}
        description="Search transactions by date range, gateway, status or customer."
        icon={<mod.icon className="h-5 w-5" />}
        breadcrumb={[{ label: "Cryptsk" }, { label: mod.label }, { label: child!.label }]}
        actions={
          <Button variant="outline" onClick={() => toast({ title: "Export transactions", description: "CSV export prepared." })}>
            <RefreshCw className="mr-2 h-4 w-4" /> Export CSV
          </Button>
        }
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard label="Total Transactions" value={String(filtered.length)} icon={<CreditCard className="h-4 w-4" />} accent />
        <KpiCard label="Success" value={String(successCount)} icon={<CheckCircle2 className="h-4 w-4" />} />
        <KpiCard label="Failed" value={String(failedCount)} icon={<XCircle className="h-4 w-4" />} />
        <KpiCard label="Total Amount" value={`₹${totalAmount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`} icon={<IndianRupee className="h-4 w-4" />} />
      </div>
      <SectionCard title="Search Filters">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-1.5">
            <Label>From Date</Label>
            <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>To Date</Label>
            <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="Success">Success</SelectItem>
                <SelectItem value="Failed">Failed</SelectItem>
                <SelectItem value="Refunded">Refunded</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Gateway</Label>
            <Select value={gatewayFilter} onValueChange={setGatewayFilter}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All gateways</SelectItem>
                <SelectItem value="Razorpay">Razorpay</SelectItem>
                <SelectItem value="PayU">PayU</SelectItem>
                <SelectItem value="Stripe">Stripe</SelectItem>
                <SelectItem value="Cashfree">Cashfree</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by txn id, customer or account"
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={() => toast({ title: "Search applied", description: `${filtered.length} transactions match.` })}>
              <Filter className="mr-2 h-4 w-4" /> Search
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setSearch(""); setStatusFilter("all"); setGatewayFilter("all"); setFrom(""); setTo("");
                toast({ title: "Filters cleared" });
              }}
            >
              Clear
            </Button>
          </div>
        </div>
      </SectionCard>
      <SectionCard title="Transaction Results" description={`${filtered.length} of ${GATEWAY_TXNS.length} transactions · ${refundedCount} refunded`}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Txn ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Account</TableHead>
                <TableHead>Amount (₹)</TableHead>
                <TableHead>Gateway</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-mono text-xs">{t.id}</TableCell>
                  <TableCell className="font-medium">{t.customer}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{t.account}</TableCell>
                  <TableCell className="font-mono text-xs font-semibold">{t.amount}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">{t.gateway}</Badge>
                  </TableCell>
                  <TableCell>{statusBadge(t.status)}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{t.date}</TableCell>
                  <TableCell className="text-right">
                    {t.status === "Success" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toast({ title: "Refund initiated", description: `${t.id} for ₹${t.amount}`, variant: "destructive" })}
                      >
                        <RotateCcw className="mr-1 h-3.5 w-3.5" /> Refund
                      </Button>
                    )}
                    {t.status !== "Success" && (
                      <Button variant="ghost" size="sm" onClick={() => toast({ title: "View transaction", description: t.id })}>
                        <Eye className="mr-1 h-3.5 w-3.5" /> View
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {filtered.length === 0 && (
          <EmptyState icon={<Filter className="h-5 w-5" />} title="No transactions match your filters" />
        )}
      </SectionCard>
    </div>
  );
}
