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
import {
  Package,
  LayoutTemplate,
  PlusCircle,
  Settings2,
  Receipt,
  Trash2,
  Pencil,
  Plus,
  Save,
  Eye,
  ArrowUp,
  ArrowDown,
  Users,
  TrendingUp,
  IndianRupee,
  Search,
  Filter,
} from "lucide-react";
import {
  PLANS,
  INVOICES,
  INVOICE_TEMPLATES,
  ANCILLARY_SERVICES,
  TAX_INFO,
  INVOICE_SUMMARY,
} from "@/lib/mock-data";

export function PackageView({ moduleId, childId }: ViewProps) {
  const { mod } = useModuleHeader(moduleId, childId);
  if (!mod) return null;
  if (!childId) return <PackageOverview moduleId={moduleId} />;
  switch (childId) {
    case "package":
      return <PackageChild moduleId={moduleId} childId={childId} />;
    case "invoice":
      return <InvoiceChild moduleId={moduleId} childId={childId} />;
    case "invoice-template":
      return <InvoiceTemplateChild moduleId={moduleId} childId={childId} />;
    case "ancillary":
      return <AncillaryChild moduleId={moduleId} childId={childId} />;
    case "tax":
      return <TaxChild moduleId={moduleId} childId={childId} />;
    default:
      return <PackageOverview moduleId={moduleId} />;
  }
}

/* ---------------- Overview ---------------- */

function PackageOverview({ moduleId }: { moduleId: string }) {
  const { mod } = useModuleHeader(moduleId);
  const setActive = useAppStore((s) => s.setActive);
  if (!mod) return null;
  const activePlans = PLANS.filter((p) => p.status === "Active").length;
  const totalUsers = PLANS.reduce((a, p) => a + p.activeUsers, 0);
  // crude revenue estimate
  const totalRevenue = PLANS.reduce((a, p) => a + Number(p.price) * p.activeUsers, 0);
  const cards = [
    { label: "Package", desc: `${PLANS.length} plans configured`, icon: Package, child: "package" },
    { label: "Invoice", desc: `${INVOICES.length} recent invoices`, icon: Receipt, child: "invoice" },
    { label: "Invoice Template", desc: `${INVOICE_TEMPLATES.length} templates`, icon: LayoutTemplate, child: "invoice-template" },
    { label: "Ancillary Service", desc: `${ANCILLARY_SERVICES.length} add-ons`, icon: PlusCircle, child: "ancillary" },
    { label: "Tax Information", desc: `${TAX_INFO.length} tax slabs`, icon: Settings2, child: "tax" },
  ];
  return (
    <div className="space-y-6">
      <PageHeader title={mod.label} description={mod.desc} icon={<mod.icon className="h-5 w-5" />} />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <KpiCard label="Total Plans" value={String(PLANS.length)} icon={<Package className="h-4 w-4" />} accent />
        <KpiCard label="Active Plans" value={String(activePlans)} icon={<TrendingUp className="h-4 w-4" />} />
        <KpiCard label="Active Users" value={totalUsers.toLocaleString()} icon={<Users className="h-4 w-4" />} />
        <KpiCard label="Est. MRR" value={`₹${totalRevenue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`} icon={<IndianRupee className="h-4 w-4" />} />
        <KpiCard label="Invoices" value={String(INVOICES.length)} icon={<Receipt className="h-4 w-4" />} />
        <KpiCard label="Tax Slabs" value={String(TAX_INFO.length)} icon={<Settings2 className="h-4 w-4" />} />
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

/* ---------------- Package (Plans) ---------------- */

function PackageChild({ moduleId, childId }: ViewProps) {
  const { mod, child } = useModuleHeader(moduleId, childId);
  const { toast } = useToast();
  const [typeFilter, setTypeFilter] = React.useState("all");
  const [search, setSearch] = React.useState("");
  if (!mod) return null;
  const filtered = PLANS.filter((p) => {
    if (typeFilter !== "all" && p.type !== typeFilter) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q);
  });
  return (
    <div className="space-y-6">
      <PageHeader
        title={child!.label}
        description="Create and manage subscriber billing plans (prepaid & postpaid)."
        icon={<mod.icon className="h-5 w-5" />}
        breadcrumb={[{ label: "Cryptsk" }, { label: mod.label }, { label: child!.label }]}
        actions={
          <Button onClick={() => toast({ title: "Add plan", description: "Plan builder form will open." })}>
            <Plus className="mr-2 h-4 w-4" /> Add Plan
          </Button>
        }
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard label="Total Plans" value={String(PLANS.length)} icon={<Package className="h-4 w-4" />} accent />
        <KpiCard label="Prepaid" value={String(PLANS.filter((p) => p.type === "Prepaid").length)} icon={<Package className="h-4 w-4" />} />
        <KpiCard label="Postpaid" value={String(PLANS.filter((p) => p.type === "Postpaid").length)} icon={<Package className="h-4 w-4" />} />
        <KpiCard label="Active Users" value={PLANS.reduce((a, p) => a + p.activeUsers, 0).toLocaleString()} icon={<Users className="h-4 w-4" />} />
      </div>
      <SectionCard
        title="Billing Plans"
        description={`${filtered.length} of ${PLANS.length} plans`}
        actions={
          <div className="flex items-center gap-2">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="h-8 w-[120px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="Prepaid">Prepaid</SelectItem>
                <SelectItem value="Postpaid">Postpaid</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search plan"
                className="h-8 w-[180px] pl-8 text-xs"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        }
      >
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Plan Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Up</TableHead>
                <TableHead>Down</TableHead>
                <TableHead>Data Limit</TableHead>
                <TableHead>Validity</TableHead>
                <TableHead>Price (₹)</TableHead>
                <TableHead>Tax (₹)</TableHead>
                <TableHead>Active Users</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => (
                <TableRow
                  key={p.id}
                  className="cursor-pointer"
                  onClick={() => toast({ title: "Open plan", description: `${p.name} (${p.id}) — detail view` })}
                >
                  <TableCell className="font-mono text-xs">{p.id}</TableCell>
                  <TableCell className="font-medium text-primary">{p.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={p.type === "Prepaid"
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                      : "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400"}
                    >
                      {p.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    <span className="inline-flex items-center gap-1"><ArrowUp className="h-3 w-3 text-emerald-600" />{p.bandwidthUp}</span>
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    <span className="inline-flex items-center gap-1"><ArrowDown className="h-3 w-3 text-primary" />{p.bandwidthDown}</span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{p.dataLimit}</TableCell>
                  <TableCell className="text-muted-foreground">{p.validity}</TableCell>
                  <TableCell className="font-mono text-xs">{p.price}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{p.tax}</TableCell>
                  <TableCell>{p.activeUsers.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={p.status === "Active"
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                      : "border-border bg-muted text-muted-foreground"}
                    >
                      {p.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="sm" onClick={() => toast({ title: "Edit plan", description: p.name })}>
                      <Pencil className="mr-1 h-3.5 w-3.5" /> Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {filtered.length === 0 && (
          <EmptyState icon={<Filter className="h-5 w-5" />} title="No plans match your filters" />
        )}
      </SectionCard>
    </div>
  );
}

/* ---------------- Invoice ---------------- */

function InvoiceChild({ moduleId, childId }: ViewProps) {
  const { mod, child } = useModuleHeader(moduleId, childId);
  const { toast } = useToast();
  if (!mod) return null;
  const totalCollected = INVOICES.filter((i) => i.status === "Paid").reduce((a, i) => a + Number(i.total), 0);
  const totalDue = INVOICES.filter((i) => i.status === "Due").reduce((a, i) => a + Number(i.total), 0);
  const totalOverdue = INVOICES.filter((i) => i.status === "Overdue").reduce((a, i) => a + Number(i.total), 0);
  return (
    <div className="space-y-6">
      <PageHeader
        title={child!.label}
        description="Invoice front page summary and purge tooling."
        icon={<mod.icon className="h-5 w-5" />}
        breadcrumb={[{ label: "Cryptsk" }, { label: mod.label }, { label: child!.label }]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => toast({ title: "Purge invoices", description: "Old invoices will be purged.", variant: "destructive" })}>
              <Trash2 className="mr-2 h-4 w-4" /> Purge
            </Button>
            <Button onClick={() => toast({ title: "Generate invoice", description: "Invoice generator will open." })}>
              <Plus className="mr-2 h-4 w-4" /> Generate Invoice
            </Button>
          </div>
        }
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard label="Total Invoices" value={String(INVOICES.length)} icon={<Receipt className="h-4 w-4" />} accent />
        <KpiCard label="Collected" value={`₹${totalCollected.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`} icon={<TrendingUp className="h-4 w-4" />} />
        <KpiCard label="Due" value={`₹${totalDue.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`} icon={<IndianRupee className="h-4 w-4" />} />
        <KpiCard label="Overdue" value={`₹${totalOverdue.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`} icon={<Receipt className="h-4 w-4" />} />
      </div>
      <SectionCard title="Invoices" description={`${INVOICES.length} recent invoices`}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice No</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Account</TableHead>
                <TableHead>Package</TableHead>
                <TableHead>Amount (₹)</TableHead>
                <TableHead>Tax (₹)</TableHead>
                <TableHead>Total (₹)</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {INVOICES.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell className="font-mono text-xs">{inv.id}</TableCell>
                  <TableCell className="font-medium">{inv.customer}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{inv.account}</TableCell>
                  <TableCell className="text-muted-foreground">{inv.packageName}</TableCell>
                  <TableCell className="font-mono text-xs">{inv.amount}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{inv.tax}</TableCell>
                  <TableCell className="font-mono text-xs font-semibold">{inv.total}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{inv.date}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={
                      inv.status === "Paid"
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                        : inv.status === "Due"
                        ? "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400"
                        : "border-primary/30 bg-primary/10 text-primary"
                    }>
                      {inv.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => toast({ title: "View invoice", description: inv.id })}>
                      <Eye className="mr-1 h-3.5 w-3.5" /> View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>
      <SectionCard title="Invoice Summary (by package)" description="Aggregated invoice totals per package">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Package</TableHead>
                <TableHead>No. of Invoices</TableHead>
                <TableHead>Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {INVOICE_SUMMARY.map((s) => (
                <TableRow key={s.packageName}>
                  <TableCell className="font-medium">{s.packageName}</TableCell>
                  <TableCell>{s.invoices}</TableCell>
                  <TableCell className="font-mono text-xs">{s.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>
    </div>
  );
}

/* ---------------- Invoice Template ---------------- */

function InvoiceTemplateChild({ moduleId, childId }: ViewProps) {
  const { mod, child } = useModuleHeader(moduleId, childId);
  const { toast } = useToast();
  if (!mod) return null;
  return (
    <div className="space-y-6">
      <PageHeader
        title={child!.label}
        description="Design and manage invoice templates rendered to PDF/HTML."
        icon={<mod.icon className="h-5 w-5" />}
        breadcrumb={[{ label: "Cryptsk" }, { label: mod.label }, { label: child!.label }]}
        actions={
          <Button onClick={() => toast({ title: "Create template" })}>
            <Plus className="mr-2 h-4 w-4" /> New Template
          </Button>
        }
      />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {INVOICE_TEMPLATES.map((t) => (
          <SectionCard key={t.id} title={t.name} description={`Last edited ${t.lastEdited}`}>
            <div className="flex aspect-[3/4] flex-col rounded-lg border border-dashed border-border bg-muted/30 p-3">
              <div className="flex items-center justify-between border-b border-border pb-2 text-xs">
                <span className="font-semibold text-foreground">Cryptsk Networks</span>
                <span className="text-muted-foreground">INV-2026-10042</span>
              </div>
              <div className="mt-2 space-y-1.5">
                {Array.from({ length: t.columns > 6 ? 5 : t.columns > 3 ? 4 : 2 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between text-[10px] text-muted-foreground">
                    <span className="h-2 w-20 rounded-sm bg-muted" />
                    <span className="h-2 w-10 rounded-sm bg-muted" />
                  </div>
                ))}
              </div>
              <div className="mt-auto flex items-center justify-between border-t border-border pt-2 text-xs">
                <span className="text-muted-foreground">Total</span>
                <span className="font-semibold text-foreground">₹706.82</span>
              </div>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">{t.description}</p>
            <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="outline">{t.columns} columns</Badge>
            </div>
            <div className="mt-3 flex gap-2">
              <Button size="sm" variant="outline" onClick={() => toast({ title: "Edit template", description: t.name })}>
                <Pencil className="mr-1.5 h-3.5 w-3.5" /> Edit
              </Button>
              <Button size="sm" variant="ghost" onClick={() => toast({ title: "Preview template", description: t.name })}>
                <Eye className="mr-1.5 h-3.5 w-3.5" /> Preview
              </Button>
            </div>
          </SectionCard>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Ancillary ---------------- */

function AncillaryChild({ moduleId, childId }: ViewProps) {
  const { mod, child } = useModuleHeader(moduleId, childId);
  const { toast } = useToast();
  if (!mod) return null;
  return (
    <div className="space-y-6">
      <PageHeader
        title={child!.label}
        description="Add-on services that can be attached to any subscriber plan."
        icon={<mod.icon className="h-5 w-5" />}
        breadcrumb={[{ label: "Cryptsk" }, { label: mod.label }, { label: child!.label }]}
        actions={
          <Button onClick={() => toast({ title: "Create ancillary service" })}>
            <Plus className="mr-2 h-4 w-4" /> Add Service
          </Button>
        }
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard label="Services" value={String(ANCILLARY_SERVICES.length)} icon={<PlusCircle className="h-4 w-4" />} accent />
        <KpiCard label="Active" value={String(ANCILLARY_SERVICES.filter((s) => s.status === "Active").length)} icon={<PlusCircle className="h-4 w-4" />} />
        <KpiCard label="Avg Price" value={`₹${(ANCILLARY_SERVICES.reduce((a, s) => a + Number(s.price), 0) / ANCILLARY_SERVICES.length).toFixed(0)}`} icon={<IndianRupee className="h-4 w-4" />} />
        <KpiCard label="Taxable" value={String(ANCILLARY_SERVICES.length)} icon={<Settings2 className="h-4 w-4" />} />
      </div>
      <SectionCard title="Ancillary Services" description={`${ANCILLARY_SERVICES.length} services`}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Price (₹)</TableHead>
                <TableHead>Tax (₹)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ANCILLARY_SERVICES.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-mono text-xs">{s.id}</TableCell>
                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell className="text-muted-foreground">{s.description}</TableCell>
                  <TableCell className="font-mono text-xs">{s.price}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{s.tax}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={s.status === "Active"
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                      : "border-border bg-muted text-muted-foreground"}
                    >
                      {s.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => toast({ title: "Edit service", description: s.name })}>
                      <Pencil className="mr-1 h-3.5 w-3.5" /> Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>
      <SectionCard title="Create Ancillary Service">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-1.5">
            <Label>Service Name</Label>
            <Input placeholder="e.g. Static IP" />
          </div>
          <div className="space-y-1.5">
            <Label>Price (₹)</Label>
            <Input type="number" placeholder="0.00" />
          </div>
          <div className="space-y-1.5">
            <Label>Tax Slab</Label>
            <Select defaultValue="gst18">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="gst18">GST 18%</SelectItem>
                <SelectItem value="gst0">Exempt</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button className="w-full" onClick={() => toast({ title: "Ancillary service created" })}>
              <Save className="mr-2 h-4 w-4" /> Save
            </Button>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

/* ---------------- Tax ---------------- */

function TaxChild({ moduleId, childId }: ViewProps) {
  const { mod, child } = useModuleHeader(moduleId, childId);
  const { toast } = useToast();
  if (!mod) return null;
  return (
    <div className="space-y-6">
      <PageHeader
        title={child!.label}
        description="Configure tax slabs applied to plans, invoices and ancillary services."
        icon={<mod.icon className="h-5 w-5" />}
        breadcrumb={[{ label: "Cryptsk" }, { label: mod.label }, { label: child!.label }]}
        actions={
          <Button onClick={() => toast({ title: "Create tax slab" })}>
            <Plus className="mr-2 h-4 w-4" /> Add Tax
          </Button>
        }
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard label="Tax Slabs" value={String(TAX_INFO.length)} icon={<Settings2 className="h-4 w-4" />} accent />
        <KpiCard label="Active" value={String(TAX_INFO.filter((t) => t.status === "Active").length)} icon={<Settings2 className="h-4 w-4" />} />
        <KpiCard label="Max Rate" value={TAX_INFO.map((t) => t.rate).sort()[TAX_INFO.length - 1]} icon={<IndianRupee className="h-4 w-4" />} />
        <KpiCard label="Default" value="GST 18%" icon={<IndianRupee className="h-4 w-4" />} />
      </div>
      <SectionCard title="Tax Configuration" description={`${TAX_INFO.length} slabs`}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Tax Name</TableHead>
                <TableHead>Rate</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Applies To</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {TAX_INFO.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-mono text-xs">{t.id}</TableCell>
                  <TableCell className="font-medium">{t.name}</TableCell>
                  <TableCell className="font-mono text-xs font-semibold text-primary">{t.rate}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={t.type === "Inclusive"
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                      : "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400"}
                    >
                      {t.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{t.appliesTo}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={t.status === "Active"
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                      : "border-border bg-muted text-muted-foreground"}
                    >
                      {t.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => toast({ title: "Edit tax", description: t.name })}>
                      <Pencil className="mr-1 h-3.5 w-3.5" /> Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>
      <SectionCard title="Create Tax Slab">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-1.5">
            <Label>Tax Name</Label>
            <Input placeholder="e.g. GST" />
          </div>
          <div className="space-y-1.5">
            <Label>Rate (%)</Label>
            <Input type="number" placeholder="18" />
          </div>
          <div className="space-y-1.5">
            <Label>Type</Label>
            <Select defaultValue="exclusive">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="exclusive">Exclusive</SelectItem>
                <SelectItem value="inclusive">Inclusive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button className="w-full" onClick={() => toast({ title: "Tax slab created" })}>
              <Save className="mr-2 h-4 w-4" /> Save
            </Button>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
