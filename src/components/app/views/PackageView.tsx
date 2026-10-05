"use client";

import * as React from "react";
import { ViewProps, useModuleHeader, useViewRouter, ChildOverview, LeafPlaceholder } from "./_shared";
import { PageHeader, KpiCard, SectionCard, EmptyState, ActionBar } from "@/components/app/shared";
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Package as PackageIcon,
  PlusCircle,
  Receipt,
  Trash2,
  Pencil,
  Save,
  X,
  Search,
  Filter,
  Users,
  TrendingUp,
  IndianRupee,
  AlertCircle,
  Loader2,
  FileText,
  Settings2,
  Percent,
  MapPin,
  Layers,
} from "lucide-react";
import { packagesApi, type Package } from "@/lib/api";
import {
  INVOICES,
  INVOICE_TEMPLATES,
  ANCILLARY_SERVICES,
  TAX_INFO,
  ZONES,
  type Invoice,
  type AncillaryService,
  type TaxInfo,
} from "@/lib/mock-data";

export function PackageView({ moduleId, childId, grandchildId }: ViewProps) {
  const router = useViewRouter(moduleId, childId, grandchildId);

  if (router.state === "loading") return null;
  if (router.state === "module-overview") return <PackageOverview moduleId={moduleId} />;
  if (router.state === "child-overview")
    return <ChildOverview moduleId={moduleId} childId={router.childId} />;

  if (router.state === "grandchild") {
    // Package (already implemented)
    if (childId === "package" && grandchildId === "create")
      return <CreatePackagePage moduleId={moduleId} childId={childId} grandchildId={grandchildId} />;
    if (childId === "package" && grandchildId === "manage")
      return <ManagePackagesPage moduleId={moduleId} childId={childId} grandchildId={grandchildId} />;

    // Invoice sub-pages
    if (childId === "invoice" && grandchildId === "custom-invoice")
      return <CustomInvoicePage moduleId={moduleId} childId={childId} grandchildId={grandchildId} />;
    if (childId === "invoice" && grandchildId === "purge-invoice")
      return <PurgeInvoicePage moduleId={moduleId} childId={childId} grandchildId={grandchildId} />;
    if (childId === "invoice" && grandchildId === "invoice-reports")
      return <InvoiceReportsPage moduleId={moduleId} childId={childId} grandchildId={grandchildId} />;
    if (childId === "invoice" && grandchildId === "create-invoice")
      return <CreateInvoicePage moduleId={moduleId} childId={childId} grandchildId={grandchildId} />;
    if (childId === "invoice" && grandchildId === "configuration")
      return <InvoiceConfigPage moduleId={moduleId} childId={childId} grandchildId={grandchildId} />;
    if (childId === "invoice" && grandchildId === "zone-invoice")
      return <ZoneInvoicePage moduleId={moduleId} childId={childId} grandchildId={grandchildId} />;

    // Ancillary Service sub-pages
    if (childId === "ancillary" && grandchildId === "add-service")
      return <AddServicePage moduleId={moduleId} childId={childId} grandchildId={grandchildId} />;
    if (childId === "ancillary" && grandchildId === "manage-service")
      return <ManageServicePage moduleId={moduleId} childId={childId} grandchildId={grandchildId} />;
    if (childId === "ancillary" && grandchildId === "default-service")
      return <DefaultServicePage moduleId={moduleId} childId={childId} grandchildId={grandchildId} />;

    // Tax sub-pages
    if (childId === "tax" && grandchildId === "add")
      return <AddTaxPage moduleId={moduleId} childId={childId} grandchildId={grandchildId} />;
    if (childId === "tax" && grandchildId === "default-tax")
      return <DefaultTaxPage moduleId={moduleId} childId={childId} grandchildId={grandchildId} />;

    // Fall back to placeholder for other grandchildren
    return (
      <LeafPlaceholder
        moduleId={moduleId}
        childId={router.childId}
        grandchildId={router.grandchildId}
      />
    );
  }

  // state === "child" — children without grandchildren
  switch (childId) {
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
  const [pkgs, setPkgs] = React.useState<Package[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    packagesApi.list().then((res) => {
      if (res.data) setPkgs(res.data);
      setLoading(false);
    });
  }, []);

  if (!mod) return null;
  const activePlans = pkgs.filter((p) => p.groupstatus === "Y").length;
  const totalRevenue = pkgs.reduce((a, p) => a + p.price, 0);

  const cards = [
    { label: "Package", desc: "Create & manage billing plans", icon: PackageIcon, child: "package" },
    { label: "Invoice", desc: "Invoice front page, purge, reports", icon: Receipt, child: "invoice" },
    { label: "Invoice Template", desc: "Invoice template designer", icon: Receipt, child: "invoice-template" },
    { label: "Ancillary Service", desc: "Add-on services", icon: PlusCircle, child: "ancillary" },
    { label: "Tax Information", desc: "Tax configuration", icon: IndianRupee, child: "tax" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title={mod.label} description={mod.desc} icon={<mod.icon className="h-5 w-5" />} />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard label="Total Plans" value={loading ? "…" : String(pkgs.length)} icon={<PackageIcon className="h-4 w-4" />} accent />
        <KpiCard label="Active Plans" value={loading ? "…" : String(activePlans)} icon={<TrendingUp className="h-4 w-4" />} />
        <KpiCard label="Est. MRR" value={loading ? "…" : `₹${totalRevenue.toFixed(0)}`} icon={<IndianRupee className="h-4 w-4" />} />
        <KpiCard label="Invoices" value={String(INVOICES.length)} icon={<Receipt className="h-4 w-4" />} />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <button
            key={c.child}
            onClick={() => setActive(moduleId, c.child, "")}
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

/* ---------------- Create Package (REAL FUNCTIONAL) ---------------- */

function CreatePackagePage({ moduleId, childId, grandchildId }: ViewProps) {
  const { mod, child, grandchild } = useModuleHeader(moduleId, childId, grandchildId);
  const setActive = useAppStore((s) => s.setActive);
  const { toast } = useToast();
  const [saving, setSaving] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  // Form state — mirrors PackageHelper.sendcreatePackageReqMap fields
  const [form, setForm] = React.useState({
    groupname: "",
    description: "",
    billingScheme: "PREPAID" as "PREPAID" | "POSTPAID",
    connectionType: "User" as "User" | "Leased Line",
    cycleType: "Weekly" as "Weekly" | "Monthly",
    cyclemultiplier: "1",
    billingDate_Day: "1",
    billDuration: "24",
    billCycleAmtBasedOn: "1",
    countAmtBasedOn: "2",
    price: "",
    idleTimeout: "-11",
    idleTimeoutType: "LIVE_REQUEST" as "NO_IDLE_TIMEOUT" | "LIVE_REQUEST" | "INTERNET_DATA",
    isbindtomac: "N" as "Y" | "N",
    onlinePurchase: "N" as "Y" | "N",
    multipleLoginLimit: "1",
    surfingPolicyName: "Default Surfing",
    bandwidthPolicyName: "Default BW",
    accessTimePolicyName: "Default Access",
    dataTransferPolicyName: "Default DT",
    fairAccessPolicyName: "Default FAP",
  });

  const set = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => { const n = { ...e }; delete n[field]; return n; });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});

    const res = await packagesApi.create({
      ...form,
      price: Number(form.price),
      cyclemultiplier: Number(form.cyclemultiplier),
      billingDate_Day: Number(form.billingDate_Day),
      billDuration: Number(form.billDuration),
      billCycleAmtBasedOn: Number(form.billCycleAmtBasedOn),
      countAmtBasedOn: Number(form.countAmtBasedOn),
      idleTimeout: Number(form.idleTimeout),
      multipleLoginLimit: Number(form.multipleLoginLimit),
    });

    setSaving(false);

    if (res.responseCode === "0") {
      toast({
        title: "Package created",
        description: `"${form.groupname}" has been created successfully.`,
      });
      setActive(moduleId, "package", "manage");
    } else {
      if (res.errors) setErrors(res.errors);
      toast({
        title: "Failed to create package",
        description: res.responseMsg,
        variant: "destructive",
      });
    }
  };

  if (!mod || !child) return null;

  return (
    <div className="space-y-6">
      <PageHeader
        title={grandchild?.label ?? "Create Package"}
        description="Create a new billing plan/package. Fields mirror the accsium PackageService.createPackage API."
        icon={<mod.icon className="h-5 w-5" />}
        breadcrumb={[
          { label: "Cryptsk" },
          { label: mod.label, onClick: () => setActive(moduleId, "", "") },
          { label: child.label, onClick: () => setActive(moduleId, childId, "") },
          { label: grandchild?.label ?? "Create" },
        ]}
        actions={
          <Button variant="outline" onClick={() => setActive(moduleId, "package", "manage")}>
            <X className="mr-2 h-4 w-4" /> Cancel
          </Button>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <SectionCard title="Basic Information" description="Package name, description and pricing">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="groupname">
                Package Name <span className="text-primary">*</span>
              </Label>
              <Input
                id="groupname"
                value={form.groupname}
                onChange={(e) => set("groupname", e.target.value)}
                placeholder="e.g. PR HULC 500"
                className={errors.groupname ? "border-primary" : ""}
              />
              {errors.groupname && (
                <p className="text-xs text-primary flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.groupname}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">
                Price (₹) <span className="text-primary">*</span>
              </Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={(e) => set("price", e.target.value)}
                placeholder="e.g. 599.00"
                className={errors.price ? "border-primary" : ""}
              />
              {errors.price && (
                <p className="text-xs text-primary flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.price}
                </p>
              )}
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Plan description…"
                rows={2}
              />
            </div>
          </div>
        </SectionCard>

        {/* Billing Configuration */}
        <SectionCard title="Billing Configuration" description="Scheme, cycle and duration settings">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>
                Billing Scheme <span className="text-primary">*</span>
              </Label>
              <Select value={form.billingScheme} onValueChange={(v) => set("billingScheme", v)}>
                <SelectTrigger className={errors.billingScheme ? "border-primary" : ""}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PREPAID">Prepaid</SelectItem>
                  <SelectItem value="POSTPAID">Postpaid</SelectItem>
                </SelectContent>
              </Select>
              {errors.billingScheme && (
                <p className="text-xs text-primary">{errors.billingScheme}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>
                Connection Type <span className="text-primary">*</span>
              </Label>
              <Select value={form.connectionType} onValueChange={(v) => set("connectionType", v)}>
                <SelectTrigger className={errors.connectionType ? "border-primary" : ""}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="User">User (Normal Line)</SelectItem>
                  <SelectItem value="Leased Line">Leased Line</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>
                Cycle Type <span className="text-primary">*</span>
              </Label>
              <Select value={form.cycleType} onValueChange={(v) => set("cycleType", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Weekly">Weekly</SelectItem>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cyclemultiplier">Cycle Multiplier</Label>
              <Input
                id="cyclemultiplier"
                type="number"
                min="1"
                value={form.cyclemultiplier}
                onChange={(e) => set("cyclemultiplier", e.target.value)}
              />
              <p className="text-xs text-muted-foreground">e.g. 7 = 7 weeks</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="billDuration">Bill Duration (hours)</Label>
              <Input
                id="billDuration"
                type="number"
                min="0"
                value={form.billDuration}
                onChange={(e) => set("billDuration", e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Total validity hours</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="billingDate_Day">Billing Date (day of month)</Label>
              <Input
                id="billingDate_Day"
                type="number"
                min="1"
                max="31"
                value={form.billingDate_Day}
                onChange={(e) => set("billingDate_Day", e.target.value)}
              />
              <p className="text-xs text-muted-foreground">For postpaid billing cycle</p>
            </div>
          </div>
        </SectionCard>

        {/* Session & Access */}
        <SectionCard title="Session & Access" description="Idle timeout, MAC binding and login limits">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>
                Idle Timeout Type <span className="text-primary">*</span>
              </Label>
              <Select value={form.idleTimeoutType} onValueChange={(v) => set("idleTimeoutType", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NO_IDLE_TIMEOUT">No Idle Timeout</SelectItem>
                  <SelectItem value="LIVE_REQUEST">Live Request Based</SelectItem>
                  <SelectItem value="INTERNET_DATA">Internet Data Transfer Based</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="idleTimeout">Idle Timeout Value (minutes)</Label>
              <Input
                id="idleTimeout"
                type="number"
                value={form.idleTimeout}
                onChange={(e) => set("idleTimeout", e.target.value)}
              />
              <p className="text-xs text-muted-foreground">-11 = use default</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="multipleLoginLimit">Multiple Login Limit</Label>
              <Input
                id="multipleLoginLimit"
                type="number"
                min="1"
                value={form.multipleLoginLimit}
                onChange={(e) => set("multipleLoginLimit", e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3 md:col-span-3">
              <Switch
                id="isbindtomac"
                checked={form.isbindtomac === "Y"}
                onCheckedChange={(v) => set("isbindtomac", v ? "Y" : "N")}
              />
              <div>
                <Label htmlFor="isbindtomac" className="cursor-pointer">
                  Bind to MAC
                </Label>
                <p className="text-xs text-muted-foreground">
                  Require users to connect from a specific MAC address
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 md:col-span-3">
              <Switch
                id="onlinePurchase"
                checked={form.onlinePurchase === "Y"}
                onCheckedChange={(v) => set("onlinePurchase", v ? "Y" : "N")}
              />
              <div>
                <Label htmlFor="onlinePurchase" className="cursor-pointer">
                  Available for Online Purchase
                </Label>
                <p className="text-xs text-muted-foreground">
                  Show this package in the self-service portal
                </p>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Policy Assignment */}
        <SectionCard title="Policy Assignment" description="Default policies applied to users on this plan">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="surfingPolicyName">Surfing Policy</Label>
              <Input
                id="surfingPolicyName"
                value={form.surfingPolicyName}
                onChange={(e) => set("surfingPolicyName", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bandwidthPolicyName">Bandwidth Policy</Label>
              <Input
                id="bandwidthPolicyName"
                value={form.bandwidthPolicyName}
                onChange={(e) => set("bandwidthPolicyName", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="accessTimePolicyName">Access Time Policy</Label>
              <Input
                id="accessTimePolicyName"
                value={form.accessTimePolicyName}
                onChange={(e) => set("accessTimePolicyName", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dataTransferPolicyName">Data Transfer Policy</Label>
              <Input
                id="dataTransferPolicyName"
                value={form.dataTransferPolicyName}
                onChange={(e) => set("dataTransferPolicyName", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fairAccessPolicyName">Fair Access Policy</Label>
              <Input
                id="fairAccessPolicyName"
                value={form.fairAccessPolicyName}
                onChange={(e) => set("fairAccessPolicyName", e.target.value)}
              />
            </div>
          </div>
        </SectionCard>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => setActive(moduleId, "package", "manage")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating…
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" /> Create Package
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

/* ---------------- Manage Packages (REAL FUNCTIONAL) ---------------- */

function ManagePackagesPage({ moduleId, childId, grandchildId }: ViewProps) {
  const { mod, child, grandchild } = useModuleHeader(moduleId, childId, grandchildId);
  const setActive = useAppStore((s) => s.setActive);
  const { toast } = useToast();
  const [packages, setPackages] = React.useState<Package[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [schemeFilter, setSchemeFilter] = React.useState("all");
  const [deleteTarget, setDeleteTarget] = React.useState<Package | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  const load = React.useCallback(() => {
    setLoading(true);
    packagesApi
      .list({
        search: search || undefined,
        scheme: schemeFilter !== "all" ? schemeFilter : undefined,
      })
      .then((res) => {
        setPackages(res.data ?? []);
        setLoading(false);
      });
  }, [search, schemeFilter]);

  React.useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const res = await packagesApi.delete(deleteTarget.groupid);
    setDeleting(false);
    if (res.responseCode === "0") {
      toast({ title: "Package deleted", description: `"${deleteTarget.groupname}" was deleted.` });
      setDeleteTarget(null);
      load();
    } else {
      toast({
        title: "Delete failed",
        description: res.responseMsg,
        variant: "destructive",
      });
    }
  };

  if (!mod || !child) return null;

  return (
    <div className="space-y-6">
      <PageHeader
        title={grandchild?.label ?? "Manage Packages"}
        description="View, search and manage all billing plans. Data is backed by the packages API."
        icon={<mod.icon className="h-5 w-5" />}
        breadcrumb={[
          { label: "Cryptsk" },
          { label: mod.label, onClick: () => setActive(moduleId, "", "") },
          { label: child.label, onClick: () => setActive(moduleId, childId, "") },
          { label: grandchild?.label ?? "Manage" },
        ]}
        actions={
          <Button onClick={() => setActive(moduleId, "package", "create")}>
            <PlusCircle className="mr-2 h-4 w-4" /> Create Package
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard label="Total Packages" value={String(packages.length)} icon={<PackageIcon className="h-4 w-4" />} accent />
        <KpiCard label="Prepaid" value={String(packages.filter((p) => p.billingScheme === "PREPAID").length)} icon={<TrendingUp className="h-4 w-4" />} />
        <KpiCard label="Postpaid" value={String(packages.filter((p) => p.billingScheme === "POSTPAID").length)} icon={<TrendingUp className="h-4 w-4" />} />
        <KpiCard label="Active" value={String(packages.filter((p) => p.groupstatus === "Y").length)} icon={<PackageIcon className="h-4 w-4" />} />
      </div>

      <ActionBar>
        <div className="relative flex-1 max-w-xs">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search packages…"
            className="h-8 pl-8 text-xs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={schemeFilter} onValueChange={setSchemeFilter}>
          <SelectTrigger className="h-8 w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All schemes</SelectItem>
            <SelectItem value="PREPAID">Prepaid</SelectItem>
            <SelectItem value="POSTPAID">Postpaid</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" className="h-8" onClick={load}>
          <Filter className="mr-1.5 h-3.5 w-3.5" /> Refresh
        </Button>
      </ActionBar>

      <SectionCard>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : packages.length === 0 ? (
          <EmptyState
            icon={<PackageIcon className="h-5 w-5" />}
            title="No packages found"
            description="Create your first package to get started."
            action={
              <Button onClick={() => setActive(moduleId, "package", "create")}>
                <PlusCircle className="mr-2 h-4 w-4" /> Create Package
              </Button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Package Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Scheme</TableHead>
                  <TableHead>Connection</TableHead>
                  <TableHead>Cycle</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Bind MAC</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {packages.map((p) => (
                  <TableRow key={p.groupid}>
                    <TableCell className="font-mono text-xs text-muted-foreground">{p.groupid}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">{p.groupname}</p>
                        {p.description && (
                          <p className="text-xs text-muted-foreground truncate max-w-[200px]">{p.description}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">₹{p.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={p.billingScheme === "PREPAID" ? "default" : "secondary"}
                        className={p.billingScheme === "PREPAID" ? "bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400" : "bg-amber-500/10 text-amber-700 hover:bg-amber-500/10 dark:text-amber-400"}
                      >
                        {p.billingScheme}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px]">{p.connectionType}</Badge>
                    </TableCell>
                    <TableCell className="text-xs">{p.cycleType} ×{p.cyclemultiplier}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{p.billDuration}h</TableCell>
                    <TableCell>
                      <Badge variant={p.isbindtomac === "Y" ? "default" : "secondary"} className="text-[10px]">
                        {p.isbindtomac === "Y" ? "Yes" : "No"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={p.groupstatus === "Y" ? "default" : "secondary"}
                        className={p.groupstatus === "Y" ? "bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400" : ""}
                      >
                        {p.groupstatus === "Y" ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toast({ title: "Edit package", description: `Editing ${p.groupname} (coming soon)` })}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-primary hover:text-primary"
                          onClick={() => setDeleteTarget(p)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </SectionCard>

      {/* Delete confirmation dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Package</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete{" "}
            <span className="font-medium text-foreground">{deleteTarget?.groupname}</span>?
            This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)} disabled={deleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting…
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ---------------- Invoice (existing, uses mock data for now) ---------------- */

function InvoiceChild({ moduleId, childId }: ViewProps) {
  const { mod, child } = useModuleHeader(moduleId, childId);
  const { toast } = useToast();
  if (!mod || !child) return null;
  return (
    <div className="space-y-6">
      <PageHeader
        title={child.label}
        description={child.desc}
        icon={<mod.icon className="h-5 w-5" />}
        breadcrumb={[{ label: "Cryptsk" }, { label: mod.label }, { label: child.label }]}
        actions={<Button onClick={() => toast({ title: "Create invoice", description: "Invoice form will open." })}><PlusCircle className="mr-2 h-4 w-4" /> Generate Invoice</Button>}
      />
      <SectionCard title="Invoices" description={`${INVOICES.length} invoices`}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice No</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Package</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {INVOICES.map((inv: any) => (
                <TableRow key={inv.id}>
                  <TableCell className="font-mono text-xs">{inv.id}</TableCell>
                  <TableCell className="font-medium">{inv.customer}</TableCell>
                  <TableCell className="text-muted-foreground">{inv.packageName}</TableCell>
                  <TableCell className="font-semibold">₹{inv.amount}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{inv.date}</TableCell>
                  <TableCell>
                    <Badge variant={inv.status === "Paid" ? "default" : inv.status === "Due" ? "secondary" : "destructive"}
                      className={inv.status === "Paid" ? "bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400" : inv.status === "Due" ? "bg-amber-500/10 text-amber-700 hover:bg-amber-500/10 dark:text-amber-400" : ""}>
                      {inv.status}
                    </Badge>
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

function InvoiceTemplateChild({ moduleId, childId }: ViewProps) {
  const { mod, child } = useModuleHeader(moduleId, childId);
  if (!mod || !child) return null;
  return (
    <div className="space-y-6">
      <PageHeader title={child.label} description={child.desc} icon={<mod.icon className="h-5 w-5" />}
        breadcrumb={[{ label: "Cryptsk" }, { label: mod.label }, { label: child.label }]} />
      <SectionCard title="Templates" description={`${INVOICE_TEMPLATES.length} templates`}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Layout</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {INVOICE_TEMPLATES.map((t: any) => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium">{t.name}</TableCell>
                  <TableCell className="text-muted-foreground">{t.layout || t.description}</TableCell>
                  <TableCell><Badge variant="secondary">{t.status || "Active"}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>
    </div>
  );
}

function AncillaryChild({ moduleId, childId }: ViewProps) {
  const { mod, child } = useModuleHeader(moduleId, childId);
  if (!mod || !child) return null;
  return (
    <div className="space-y-6">
      <PageHeader title={child.label} description={child.desc} icon={<mod.icon className="h-5 w-5" />}
        breadcrumb={[{ label: "Cryptsk" }, { label: mod.label }, { label: child.label }]} />
      <SectionCard title="Ancillary Services" description={`${ANCILLARY_SERVICES.length} services`}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ANCILLARY_SERVICES.map((s: any) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell className="font-semibold">₹{s.price}</TableCell>
                  <TableCell><Badge variant="secondary">{s.status || "Active"}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>
    </div>
  );
}

function TaxChild({ moduleId, childId }: ViewProps) {
  const { mod, child } = useModuleHeader(moduleId, childId);
  if (!mod || !child) return null;
  return (
    <div className="space-y-6">
      <PageHeader title={child.label} description={child.desc} icon={<mod.icon className="h-5 w-5" />}
        breadcrumb={[{ label: "Cryptsk" }, { label: mod.label }, { label: child.label }]} />
      <SectionCard title="Tax Information" description={`${TAX_INFO.length} tax slabs`}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Rate</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {TAX_INFO.map((t: any) => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium">{t.name}</TableCell>
                  <TableCell className="font-semibold">{t.rate}%</TableCell>
                  <TableCell><Badge variant="secondary">{t.status || "Active"}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>
    </div>
  );
}

/* ============================================================
 * INVOICE — Custom Invoice (grandchild)
 * ============================================================ */

const INVOICE_CUSTOMERS = Array.from(
  new Set(INVOICES.map((i) => i.customer))
).map((c, idx) => ({ id: `CUST-${String(idx + 1).padStart(3, "0")}`, name: c }));

const INVOICE_PACKAGES = Array.from(
  new Set(INVOICES.map((i) => i.packageName))
).map((p, idx) => ({ id: `PKG-${String(idx + 1).padStart(3, "0")}`, name: p }));

function useBreadcrumb(moduleId: string, childId: string, grandchildId?: string) {
  const { mod, child, grandchild } = useModuleHeader(moduleId, childId, grandchildId);
  const setActive = useAppStore((s) => s.setActive);
  return [
    { label: "Cryptsk" },
    { label: mod?.label ?? "Package", onClick: () => setActive(moduleId, "", "") },
    { label: child?.label ?? childId, onClick: () => setActive(moduleId, childId, "") },
    ...(grandchild ? [{ label: grandchild.label }] : []),
  ];
}

function CustomInvoicePage({ moduleId, childId, grandchildId }: ViewProps) {
  const { mod, grandchild } = useModuleHeader(moduleId, childId, grandchildId);
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);
  const setActive = useAppStore((s) => s.setActive);
  const { toast } = useToast();
  const [saving, setSaving] = React.useState(false);

  const [form, setForm] = React.useState({
    customer: "",
    packageName: "",
    amount: "",
    tax: "18",
    discount: "0",
    description: "",
  });
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const amount = Number(form.amount) || 0;
  const tax = Number(form.tax) || 0;
  const discount = Number(form.discount) || 0;
  const taxableAmount = Math.max(amount - discount, 0);
  const taxAmount = (taxableAmount * tax) / 100;
  const total = taxableAmount + taxAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customer) {
      toast({ title: "Customer required", variant: "destructive" });
      return;
    }
    if (!form.amount || amount <= 0) {
      toast({ title: "Valid amount required", variant: "destructive" });
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    toast({
      title: "Custom invoice created",
      description: `INV-CUST-${Date.now().toString().slice(-6)} for ${form.customer} (₹${total.toFixed(2)}).`,
    });
    setActive(moduleId, childId, "");
  };

  if (!mod) return null;

  return (
    <div className="space-y-6">
      <PageHeader
        title={grandchild?.label ?? "Custom Invoice"}
        description="Create a one-off custom invoice for any customer & package combination."
        icon={<Receipt className="h-5 w-5" />}
        breadcrumb={breadcrumb}
        actions={
          <Button variant="outline" onClick={() => setActive(moduleId, childId, "")}>
            <X className="mr-2 h-4 w-4" /> Cancel
          </Button>
        }
      />
      <form onSubmit={handleSubmit} className="space-y-6">
        <SectionCard title="Customer & Package" description="Select the customer and the package to invoice">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Customer <span className="text-primary">*</span></Label>
              <Select value={form.customer} onValueChange={(v) => set("customer", v)}>
                <SelectTrigger><SelectValue placeholder="Select customer" /></SelectTrigger>
                <SelectContent>
                  {INVOICE_CUSTOMERS.map((c) => (
                    <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Package</Label>
              <Select value={form.packageName} onValueChange={(v) => set("packageName", v)}>
                <SelectTrigger><SelectValue placeholder="Select package" /></SelectTrigger>
                <SelectContent>
                  {INVOICE_PACKAGES.map((p) => (
                    <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Charge Details" description="Amount, tax and discount">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₹) <span className="text-primary">*</span></Label>
              <Input id="amount" type="number" step="0.01" min="0" value={form.amount}
                onChange={(e) => set("amount", e.target.value)} placeholder="599.00" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tax">Tax Rate (%)</Label>
              <Input id="tax" type="number" step="0.01" min="0" max="100" value={form.tax}
                onChange={(e) => set("tax", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discount">Discount (₹)</Label>
              <Input id="discount" type="number" step="0.01" min="0" value={form.discount}
                onChange={(e) => set("discount", e.target.value)} />
            </div>
            <div className="space-y-2 md:col-span-3">
              <Label htmlFor="desc">Description</Label>
              <Textarea id="desc" rows={2} value={form.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Reason for the custom invoice (e.g. one-time installation fee)" />
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-lg border border-border bg-muted/20 p-3">
              <p className="text-xs text-muted-foreground">Base</p>
              <p className="mt-1 font-mono text-sm font-semibold">₹{amount.toFixed(2)}</p>
            </div>
            <div className="rounded-lg border border-border bg-muted/20 p-3">
              <p className="text-xs text-muted-foreground">Discount</p>
              <p className="mt-1 font-mono text-sm font-semibold text-primary">- ₹{discount.toFixed(2)}</p>
            </div>
            <div className="rounded-lg border border-border bg-muted/20 p-3">
              <p className="text-xs text-muted-foreground">Tax ({form.tax}%)</p>
              <p className="mt-1 font-mono text-sm font-semibold">₹{taxAmount.toFixed(2)}</p>
            </div>
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-3">
              <p className="text-xs text-primary">Total</p>
              <p className="mt-1 font-mono text-sm font-semibold text-primary">₹{total.toFixed(2)}</p>
            </div>
          </div>
        </SectionCard>

        <div className="flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => setActive(moduleId, childId, "")}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating…</>
            ) : (
              <><Save className="mr-2 h-4 w-4" /> Create Invoice</>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

/* ============================================================
 * INVOICE — Purge Invoice (grandchild)
 * ============================================================ */

function PurgeInvoicePage({ moduleId, childId, grandchildId }: ViewProps) {
  const { mod, grandchild } = useModuleHeader(moduleId, childId, grandchildId);
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);
  const setActive = useAppStore((s) => s.setActive);
  const { toast } = useToast();
  const [from, setFrom] = React.useState("");
  const [to, setTo] = React.useState("");
  const [status, setStatus] = React.useState("all");
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [purging, setPurging] = React.useState(false);

  const matches = INVOICES.filter((i) => {
    if (status !== "all" && i.status !== status) return false;
    return true;
  });

  const handlePurge = async () => {
    setPurging(true);
    await new Promise((r) => setTimeout(r, 700));
    setPurging(false);
    setConfirmOpen(false);
    toast({
      title: "Invoices purged",
      description: `${matches.length} invoice(s) between ${from || "—"} and ${to || "—"} were removed.`,
      variant: "destructive",
    });
    setFrom(""); setTo(""); setStatus("all");
  };

  if (!mod) return null;

  return (
    <div className="space-y-6">
      <PageHeader
        title={grandchild?.label ?? "Purge Invoice"}
        description="Permanently remove invoices within a date range. This action is irreversible."
        icon={<Trash2 className="h-5 w-5" />}
        breadcrumb={breadcrumb}
        actions={
          <Button variant="outline" onClick={() => setActive(moduleId, childId, "")}>
            <X className="mr-2 h-4 w-4" /> Cancel
          </Button>
        }
      />
      <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 text-sm text-primary">
        <AlertCircle className="mr-2 inline h-4 w-4" />
        Purging removes invoices permanently from the database. Export a backup before continuing.
      </div>
      <SectionCard title="Purge Filters" description="Pick the date range and invoice status to purge">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="from">From Date <span className="text-primary">*</span></Label>
            <Input id="from" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="to">To Date <span className="text-primary">*</span></Label>
            <Input id="to" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Due">Due</SelectItem>
                <SelectItem value="Overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Invoices to be Purged" description={`${matches.length} invoice(s) match your filters`}>
        {matches.length === 0 ? (
          <EmptyState icon={<Receipt className="h-5 w-5" />} title="No invoices match" description="Adjust filters to find invoices to purge." />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice No</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {matches.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell className="font-mono text-xs">{inv.id}</TableCell>
                    <TableCell className="font-medium">{inv.customer}</TableCell>
                    <TableCell className="font-semibold">₹{inv.total}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{inv.date}</TableCell>
                    <TableCell>
                      <Badge variant={inv.status === "Paid" ? "default" : inv.status === "Due" ? "secondary" : "destructive"}
                        className={inv.status === "Paid" ? "bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400" : inv.status === "Due" ? "bg-amber-500/10 text-amber-700 hover:bg-amber-500/10 dark:text-amber-400" : ""}>
                        {inv.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </SectionCard>

      <div className="flex items-center justify-end gap-3">
        <Button variant="outline" onClick={() => setActive(moduleId, childId, "")}>Cancel</Button>
        <Button variant="destructive" disabled={!from || !to || matches.length === 0} onClick={() => setConfirmOpen(true)}>
          <Trash2 className="mr-2 h-4 w-4" /> Purge {matches.length} Invoice(s)
        </Button>
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Purge</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            You are about to permanently delete{" "}
            <span className="font-medium text-foreground">{matches.length} invoice(s)</span>{" "}
            between <span className="font-medium">{from}</span> and <span className="font-medium">{to}</span>.
            This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)} disabled={purging}>Cancel</Button>
            <Button variant="destructive" onClick={handlePurge} disabled={purging}>
              {purging ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Purging…</>
              ) : (
                <><Trash2 className="mr-2 h-4 w-4" /> Yes, Purge</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ============================================================
 * INVOICE — Invoice Reports (grandchild)
 * ============================================================ */

function InvoiceReportsPage({ moduleId, childId, grandchildId }: ViewProps) {
  const { mod, grandchild } = useModuleHeader(moduleId, childId, grandchildId);
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);
  const setActive = useAppStore((s) => s.setActive);
  const { toast } = useToast();
  const [from, setFrom] = React.useState("");
  const [to, setTo] = React.useState("");
  const [zone, setZone] = React.useState("all");
  const [status, setStatus] = React.useState("all");
  const [loading, setLoading] = React.useState(false);
  const [results, setResults] = React.useState<Invoice[]>([]);

  const runReport = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    const filtered = INVOICES.filter((i) => {
      if (status !== "all" && i.status !== status) return false;
      return true;
    });
    setResults(filtered);
    setLoading(false);
    toast({ title: "Report generated", description: `${filtered.length} invoice(s) found.` });
  };

  const totalAmount = results.reduce((a, i) => a + Number(i.total), 0);

  if (!mod) return null;

  return (
    <div className="space-y-6">
      <PageHeader
        title={grandchild?.label ?? "Invoice Reports"}
        description="Filter and export invoices by date range, zone and status."
        icon={<FileText className="h-5 w-5" />}
        breadcrumb={breadcrumb}
        actions={
          <Button variant="outline" onClick={() => setActive(moduleId, childId, "")}>
            <X className="mr-2 h-4 w-4" /> Close
          </Button>
        }
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard label="Results" value={String(results.length)} icon={<Receipt className="h-4 w-4" />} accent />
        <KpiCard label="Total Value" value={`₹${totalAmount.toFixed(2)}`} icon={<IndianRupee className="h-4 w-4" />} />
        <KpiCard label="Paid" value={String(results.filter((r) => r.status === "Paid").length)} icon={<TrendingUp className="h-4 w-4" />} />
        <KpiCard label="Due / Overdue" value={String(results.filter((r) => r.status !== "Paid").length)} icon={<AlertCircle className="h-4 w-4" />} />
      </div>
      <SectionCard title="Filters" description="Date range, zone and status">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="space-y-2">
            <Label>From Date</Label>
            <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>To Date</Label>
            <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Zone</Label>
            <Select value={zone} onValueChange={setZone}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All zones</SelectItem>
                {ZONES.map((z) => (
                  <SelectItem key={z.id} value={z.id}>{z.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Due">Due</SelectItem>
                <SelectItem value="Overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => { setFrom(""); setTo(""); setZone("all"); setStatus("all"); setResults([]); }}>
            Clear
          </Button>
          <Button onClick={runReport} disabled={loading}>
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Running…</> : <><Filter className="mr-2 h-4 w-4" /> Run Report</>}
          </Button>
        </div>
      </SectionCard>
      <SectionCard title="Report Results" description={`${results.length} invoice(s)`}>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : results.length === 0 ? (
          <EmptyState icon={<FileText className="h-5 w-5" />} title="No results yet" description="Apply filters and run the report." />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice No</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell className="font-mono text-xs">{inv.id}</TableCell>
                    <TableCell className="font-medium">{inv.customer}</TableCell>
                    <TableCell className="font-semibold">₹{inv.total}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{inv.date}</TableCell>
                    <TableCell>
                      <Badge variant={inv.status === "Paid" ? "default" : inv.status === "Due" ? "secondary" : "destructive"}
                        className={inv.status === "Paid" ? "bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400" : inv.status === "Due" ? "bg-amber-500/10 text-amber-700 hover:bg-amber-500/10 dark:text-amber-400" : ""}>
                        {inv.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </SectionCard>
    </div>
  );
}

/* ============================================================
 * INVOICE — Create Invoice (grandchild)
 * ============================================================ */

function CreateInvoicePage({ moduleId, childId, grandchildId }: ViewProps) {
  const { mod, grandchild } = useModuleHeader(moduleId, childId, grandchildId);
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);
  const setActive = useAppStore((s) => s.setActive);
  const { toast } = useToast();
  const [saving, setSaving] = React.useState(false);

  const [form, setForm] = React.useState({
    customer: "",
    packageName: "",
    billingPeriod: "Monthly",
    amount: "",
    tax: "18",
    discount: "0",
  });
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const amount = Number(form.amount) || 0;
  const tax = Number(form.tax) || 0;
  const discount = Number(form.discount) || 0;
  const total = Math.max(amount - discount, 0) * (1 + tax / 100);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customer || !form.packageName || amount <= 0) {
      toast({ title: "Missing fields", description: "Customer, package and amount are required.", variant: "destructive" });
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    toast({
      title: "Invoice created",
      description: `INV-${Date.now().toString().slice(-6)} · ${form.customer} · ₹${total.toFixed(2)}`,
    });
    setActive(moduleId, childId, "");
  };

  if (!mod) return null;

  return (
    <div className="space-y-6">
      <PageHeader
        title={grandchild?.label ?? "Create Invoice"}
        description="Generate a new invoice for a customer against a billing package."
        icon={<PlusCircle className="h-5 w-5" />}
        breadcrumb={breadcrumb}
        actions={
          <Button variant="outline" onClick={() => setActive(moduleId, childId, "")}>
            <X className="mr-2 h-4 w-4" /> Cancel
          </Button>
        }
      />
      <form onSubmit={handleSubmit} className="space-y-6">
        <SectionCard title="Invoice Details" description="Customer, package and billing period">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Customer <span className="text-primary">*</span></Label>
              <Select value={form.customer} onValueChange={(v) => set("customer", v)}>
                <SelectTrigger><SelectValue placeholder="Select customer" /></SelectTrigger>
                <SelectContent>
                  {INVOICE_CUSTOMERS.map((c) => (
                    <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Package <span className="text-primary">*</span></Label>
              <Select value={form.packageName} onValueChange={(v) => set("packageName", v)}>
                <SelectTrigger><SelectValue placeholder="Select package" /></SelectTrigger>
                <SelectContent>
                  {INVOICE_PACKAGES.map((p) => (
                    <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Billing Period <span className="text-primary">*</span></Label>
              <Select value={form.billingPeriod} onValueChange={(v) => set("billingPeriod", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Weekly">Weekly</SelectItem>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                  <SelectItem value="Quarterly">Quarterly</SelectItem>
                  <SelectItem value="Half-Yearly">Half-Yearly</SelectItem>
                  <SelectItem value="Yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₹) <span className="text-primary">*</span></Label>
              <Input id="amount" type="number" step="0.01" min="0" value={form.amount}
                onChange={(e) => set("amount", e.target.value)} placeholder="599.00" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tax">Tax Rate (%)</Label>
              <Input id="tax" type="number" step="0.01" min="0" max="100" value={form.tax}
                onChange={(e) => set("tax", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discount">Discount (₹)</Label>
              <Input id="discount" type="number" step="0.01" min="0" value={form.discount}
                onChange={(e) => set("discount", e.target.value)} />
            </div>
          </div>
          <div className="mt-4 rounded-lg border border-primary/30 bg-primary/5 p-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Invoice Total</span>
              <span className="font-mono text-lg font-semibold text-primary">₹{total.toFixed(2)}</span>
            </div>
          </div>
        </SectionCard>
        <div className="flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => setActive(moduleId, childId, "")}>Cancel</Button>
          <Button type="submit" disabled={saving}>
            {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating…</> : <><Save className="mr-2 h-4 w-4" /> Create Invoice</>}
          </Button>
        </div>
      </form>
    </div>
  );
}

/* ============================================================
 * INVOICE — Configuration (grandchild)
 * ============================================================ */

function InvoiceConfigPage({ moduleId, childId, grandchildId }: ViewProps) {
  const { mod, grandchild } = useModuleHeader(moduleId, childId, grandchildId);
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);
  const setActive = useAppStore((s) => s.setActive);
  const { toast } = useToast();
  const [saving, setSaving] = React.useState(false);
  const [form, setForm] = React.useState({
    prefix: "INV-2026-",
    startingNumber: "10001",
    taxRate: "18",
    currencySymbol: "₹",
    footerText: "Thank you for choosing Cryptsk Networks. This is a computer-generated invoice.",
  });
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.prefix.trim() || !form.startingNumber.trim()) {
      toast({ title: "Prefix and starting number are required", variant: "destructive" });
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    setSaving(false);
    toast({ title: "Invoice configuration saved", description: `Next invoice: ${form.prefix}${form.startingNumber}` });
  };

  if (!mod) return null;

  return (
    <div className="space-y-6">
      <PageHeader
        title={grandchild?.label ?? "Invoice Configuration"}
        description="Configure global invoice numbering, tax and footer text."
        icon={<Settings2 className="h-5 w-5" />}
        breadcrumb={breadcrumb}
        actions={
          <Button variant="outline" onClick={() => setActive(moduleId, childId, "")}>
            <X className="mr-2 h-4 w-4" /> Close
          </Button>
        }
      />
      <form onSubmit={handleSave} className="space-y-6">
        <SectionCard title="Numbering" description="Invoice prefix and starting number">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="prefix">Invoice Prefix <span className="text-primary">*</span></Label>
              <Input id="prefix" value={form.prefix} onChange={(e) => set("prefix", e.target.value)} placeholder="INV-2026-" />
              <p className="text-xs text-muted-foreground">All new invoices will start with this prefix.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="start">Starting Number <span className="text-primary">*</span></Label>
              <Input id="start" type="number" min="1" value={form.startingNumber} onChange={(e) => set("startingNumber", e.target.value)} />
              <p className="text-xs text-muted-foreground">Next invoice will be <span className="font-mono">{form.prefix}{form.startingNumber}</span></p>
            </div>
          </div>
        </SectionCard>
        <SectionCard title="Tax & Currency" description="Default tax rate and currency symbol">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="tax">Default Tax Rate (%)</Label>
              <Input id="tax" type="number" step="0.01" min="0" max="100" value={form.taxRate}
                onChange={(e) => set("taxRate", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cur">Currency Symbol</Label>
              <Input id="cur" value={form.currencySymbol} onChange={(e) => set("currencySymbol", e.target.value)} maxLength={3} />
            </div>
            <div className="space-y-2">
              <Label>Preview</Label>
              <div className="rounded-lg border border-border bg-muted/20 p-2 font-mono text-sm">
                {form.currencySymbol}1,234.56
              </div>
            </div>
          </div>
        </SectionCard>
        <SectionCard title="Invoice Footer" description="Text printed at the bottom of every invoice">
          <div className="space-y-2">
            <Textarea rows={3} value={form.footerText} onChange={(e) => set("footerText", e.target.value)} />
          </div>
        </SectionCard>
        <div className="flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => setActive(moduleId, childId, "")}>Cancel</Button>
          <Button type="submit" disabled={saving}>
            {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving…</> : <><Save className="mr-2 h-4 w-4" /> Save Configuration</>}
          </Button>
        </div>
      </form>
    </div>
  );
}

/* ============================================================
 * INVOICE — Zone Invoice (grandchild)
 * ============================================================ */

function ZoneInvoicePage({ moduleId, childId, grandchildId }: ViewProps) {
  const { mod, grandchild } = useModuleHeader(moduleId, childId, grandchildId);
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);
  const setActive = useAppStore((s) => s.setActive);
  const { toast } = useToast();
  const [zone, setZone] = React.useState("");
  const [from, setFrom] = React.useState("");
  const [to, setTo] = React.useState("");
  const [template, setTemplate] = React.useState("Standard");
  const [generating, setGenerating] = React.useState(false);
  const [generated, setGenerated] = React.useState<
    { zone: string; invoiceNo: string; customers: number; amount: string; date: string; status: "Generated" }[]
  >([]);

  const handleGenerate = async () => {
    if (!zone || !from || !to) {
      toast({ title: "Zone and date range are required", variant: "destructive" });
      return;
    }
    setGenerating(true);
    await new Promise((r) => setTimeout(r, 700));
    const zoneObj = ZONES.find((z) => z.id === zone);
    const newRows = Array.from({ length: 3 }, (_, i) => ({
      zone: zoneObj?.name ?? zone,
      invoiceNo: `ZINV-${Date.now().toString().slice(-4)}${i + 1}`,
      customers: Math.floor(Math.random() * zoneObj!.users) + 10,
      amount: (Math.floor(Math.random() * 90000) + 10000).toFixed(2),
      date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      status: "Generated" as const,
    }));
    setGenerated((prev) => [...newRows, ...prev]);
    setGenerating(false);
    toast({ title: "Zone invoices generated", description: `${newRows.length} invoices for ${zoneObj?.name}.` });
  };

  if (!mod) return null;

  return (
    <div className="space-y-6">
      <PageHeader
        title={grandchild?.label ?? "Zone Invoice"}
        description="Generate bulk invoices for all customers in a zone for the chosen period."
        icon={<MapPin className="h-5 w-5" />}
        breadcrumb={breadcrumb}
        actions={
          <Button variant="outline" onClick={() => setActive(moduleId, childId, "")}>
            <X className="mr-2 h-4 w-4" /> Close
          </Button>
        }
      />
      <SectionCard title="Generate Zone Invoices" description="Pick zone, date range and invoice template">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="space-y-2">
            <Label>Zone <span className="text-primary">*</span></Label>
            <Select value={zone} onValueChange={setZone}>
              <SelectTrigger><SelectValue placeholder="Select zone" /></SelectTrigger>
              <SelectContent>
                {ZONES.map((z) => (
                  <SelectItem key={z.id} value={z.id}>{z.name} ({z.users} users)</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>From Date <span className="text-primary">*</span></Label>
            <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>To Date <span className="text-primary">*</span></Label>
            <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Template</Label>
            <Select value={template} onValueChange={setTemplate}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {INVOICE_TEMPLATES.map((t) => (
                  <SelectItem key={t.id} value={t.name}>{t.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Button onClick={handleGenerate} disabled={generating}>
            {generating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating…</> : <><PlusCircle className="mr-2 h-4 w-4" /> Generate Invoices</>}
          </Button>
        </div>
      </SectionCard>

      <SectionCard title="Generated Zone Invoices" description={`${generated.length} batch(es) generated`}>
        {generated.length === 0 ? (
          <EmptyState icon={<MapPin className="h-5 w-5" />} title="No zone invoices yet" description="Configure parameters above and click Generate." />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice No</TableHead>
                  <TableHead>Zone</TableHead>
                  <TableHead>Customers</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Generated On</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {generated.map((g) => (
                  <TableRow key={g.invoiceNo}>
                    <TableCell className="font-mono text-xs">{g.invoiceNo}</TableCell>
                    <TableCell className="font-medium">{g.zone}</TableCell>
                    <TableCell>{g.customers}</TableCell>
                    <TableCell className="font-semibold">₹{g.amount}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{g.date}</TableCell>
                    <TableCell>
                      <Badge variant="default" className="bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400">
                        {g.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </SectionCard>
    </div>
  );
}

/* ============================================================
 * ANCILLARY — Add Service (grandchild)
 * ============================================================ */

function AddServicePage({ moduleId, childId, grandchildId }: ViewProps) {
  const { mod, grandchild } = useModuleHeader(moduleId, childId, grandchildId);
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);
  const setActive = useAppStore((s) => s.setActive);
  const { toast } = useToast();
  const [saving, setSaving] = React.useState(false);
  const [form, setForm] = React.useState({
    name: "",
    price: "",
    description: "",
    status: "Active" as "Active" | "Inactive",
  });
  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price) {
      toast({ title: "Service name and price are required", variant: "destructive" });
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    setSaving(false);
    toast({ title: "Ancillary service created", description: `${form.name} (₹${form.price}) added.` });
    setActive(moduleId, childId, "manage-service");
  };

  if (!mod) return null;

  return (
    <div className="space-y-6">
      <PageHeader
        title={grandchild?.label ?? "Add Ancillary Service"}
        description="Define a new add-on service (e.g. Static IP, Speed Boost)."
        icon={<PlusCircle className="h-5 w-5" />}
        breadcrumb={breadcrumb}
        actions={
          <Button variant="outline" onClick={() => setActive(moduleId, childId, "manage-service")}>
            <X className="mr-2 h-4 w-4" /> Cancel
          </Button>
        }
      />
      <form onSubmit={handleSubmit} className="space-y-6">
        <SectionCard title="Service Details" description="Name, pricing and status">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Service Name <span className="text-primary">*</span></Label>
              <Input id="name" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Static IP" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price (₹) <span className="text-primary">*</span></Label>
              <Input id="price" type="number" step="0.01" min="0" value={form.price}
                onChange={(e) => set("price", e.target.value)} placeholder="250.00" />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => set("status", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="desc">Description</Label>
              <Textarea id="desc" rows={2} value={form.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Short description of what this service offers" />
            </div>
          </div>
        </SectionCard>
        <div className="flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => setActive(moduleId, childId, "manage-service")}>Cancel</Button>
          <Button type="submit" disabled={saving}>
            {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating…</> : <><Save className="mr-2 h-4 w-4" /> Create Service</>}
          </Button>
        </div>
      </form>
    </div>
  );
}

/* ============================================================
 * ANCILLARY — Manage Service (grandchild)
 * ============================================================ */

function ManageServicePage({ moduleId, childId, grandchildId }: ViewProps) {
  const { mod, grandchild } = useModuleHeader(moduleId, childId, grandchildId);
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);
  const setActive = useAppStore((s) => s.setActive);
  const { toast } = useToast();
  const [services, setServices] = React.useState<AncillaryService[]>(ANCILLARY_SERVICES);
  const [search, setSearch] = React.useState("");
  const [deleteTarget, setDeleteTarget] = React.useState<AncillaryService | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  const filtered = services.filter((s) =>
    !search.trim() ? true : s.name.toLowerCase().includes(search.toLowerCase()) || s.id.toLowerCase().includes(search.toLowerCase())
  );

  const toggleStatus = (id: string) => {
    setServices((prev) => prev.map((s) => s.id === id ? { ...s, status: s.status === "Active" ? "Inactive" : "Active" } : s));
    const s = services.find((x) => x.id === id);
    toast({ title: `${s?.status === "Active" ? "Deactivated" : "Activated"} service`, description: s?.name });
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    await new Promise((r) => setTimeout(r, 400));
    setDeleting(false);
    setServices((prev) => prev.filter((s) => s.id !== deleteTarget.id));
    toast({ title: "Service deleted", description: deleteTarget.name, variant: "destructive" });
    setDeleteTarget(null);
  };

  if (!mod) return null;

  return (
    <div className="space-y-6">
      <PageHeader
        title={grandchild?.label ?? "Manage Ancillary Services"}
        description="View, search and manage all add-on services."
        icon={<Layers className="h-5 w-5" />}
        breadcrumb={breadcrumb}
        actions={
          <Button onClick={() => setActive(moduleId, childId, "add-service")}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Service
          </Button>
        }
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <KpiCard label="Total Services" value={String(services.length)} icon={<Layers className="h-4 w-4" />} accent />
        <KpiCard label="Active" value={String(services.filter((s) => s.status === "Active").length)} icon={<TrendingUp className="h-4 w-4" />} />
        <KpiCard label="Inactive" value={String(services.filter((s) => s.status === "Inactive").length)} icon={<AlertCircle className="h-4 w-4" />} />
      </div>
      <ActionBar>
        <div className="relative flex-1 max-w-xs">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search services…" className="h-8 pl-8 text-xs" value={search}
            onChange={(e) => setSearch(e.target.value)} />
        </div>
      </ActionBar>
      <SectionCard>
        {filtered.length === 0 ? (
          <EmptyState icon={<Layers className="h-5 w-5" />} title="No services found"
            description="Create your first ancillary service."
            action={<Button onClick={() => setActive(moduleId, childId, "add-service")}><PlusCircle className="mr-2 h-4 w-4" /> Add Service</Button>} />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-mono text-xs text-muted-foreground">{s.id}</TableCell>
                    <TableCell>
                      <p className="font-medium text-foreground">{s.name}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-[260px]">{s.description}</p>
                    </TableCell>
                    <TableCell className="font-semibold">₹{s.price}</TableCell>
                    <TableCell>
                      <button onClick={() => toggleStatus(s.id)} aria-label={`Toggle ${s.name}`}>
                        <Badge variant="outline" className={s.status === "Active"
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                          : "border-border bg-muted text-muted-foreground"}>
                          {s.status}
                        </Badge>
                      </button>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm"
                          onClick={() => toast({ title: "Edit service", description: `${s.name} (coming soon)` })}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-primary hover:text-primary"
                          onClick={() => setDeleteTarget(s)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </SectionCard>
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete Service</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete <span className="font-medium text-foreground">{deleteTarget?.name}</span>?
            This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)} disabled={deleting}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting…</> : <><Trash2 className="mr-2 h-4 w-4" /> Delete</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ============================================================
 * ANCILLARY — Default Service (grandchild) — checkbox matrix
 * ============================================================ */

function DefaultServicePage({ moduleId, childId, grandchildId }: ViewProps) {
  const { mod, grandchild } = useModuleHeader(moduleId, childId, grandchildId);
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);
  const setActive = useAppStore((s) => s.setActive);
  const { toast } = useToast();
  const [saving, setSaving] = React.useState(false);

  // Matrix: rows = packages, cols = ancillary services
  const packages = INVOICE_PACKAGES.slice(0, 6);
  const services = ANCILLARY_SERVICES;
  const [matrix, setMatrix] = React.useState<Record<string, Set<string>>>(() => {
    const initial: Record<string, Set<string>> = {};
    packages.forEach((p) => {
      initial[p.id] = new Set(services.slice(0, 2).map((s) => s.id));
    });
    return initial;
  });

  const toggle = (pkgId: string, svcId: string) => {
    setMatrix((prev) => {
      const next = { ...prev };
      const set = new Set(next[pkgId]);
      if (set.has(svcId)) set.delete(svcId); else set.add(svcId);
      next[pkgId] = set;
      return next;
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    setSaving(false);
    const total = Object.values(matrix).reduce((a, s) => a + s.size, 0);
    toast({ title: "Default services saved", description: `${total} service-package binding(s) updated.` });
  };

  if (!mod) return null;

  return (
    <div className="space-y-6">
      <PageHeader
        title={grandchild?.label ?? "Default Ancillary Services"}
        description="Configure which ancillary services are added by default to each package."
        icon={<Layers className="h-5 w-5" />}
        breadcrumb={breadcrumb}
        actions={
          <Button variant="outline" onClick={() => setActive(moduleId, childId, "")}>
            <X className="mr-2 h-4 w-4" /> Close
          </Button>
        }
      />
      <form onSubmit={handleSave} className="space-y-6">
        <SectionCard title="Service-Package Matrix" description={`${packages.length} packages × ${services.length} services`}>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="sticky left-0 bg-card">Package</TableHead>
                  {services.map((s) => (
                    <TableHead key={s.id} className="text-center">{s.name}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {packages.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium sticky left-0 bg-card">{p.name}</TableCell>
                    {services.map((s) => (
                      <TableCell key={s.id} className="text-center">
                        <Checkbox
                          checked={matrix[p.id]?.has(s.id) ?? false}
                          onCheckedChange={() => toggle(p.id, s.id)}
                          aria-label={`${s.name} for ${p.name}`}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </SectionCard>
        <div className="flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => setActive(moduleId, childId, "")}>Cancel</Button>
          <Button type="submit" disabled={saving}>
            {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving…</> : <><Save className="mr-2 h-4 w-4" /> Save Defaults</>}
          </Button>
        </div>
      </form>
    </div>
  );
}

/* ============================================================
 * TAX — Add Tax (grandchild)
 * ============================================================ */

function AddTaxPage({ moduleId, childId, grandchildId }: ViewProps) {
  const { mod, grandchild } = useModuleHeader(moduleId, childId, grandchildId);
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);
  const setActive = useAppStore((s) => s.setActive);
  const { toast } = useToast();
  const [saving, setSaving] = React.useState(false);
  const [form, setForm] = React.useState({
    name: "",
    rate: "",
    type: "Exclusive" as "Inclusive" | "Exclusive",
    appliesTo: "All services",
    description: "",
  });
  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || form.rate === "") {
      toast({ title: "Tax name and rate are required", variant: "destructive" });
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    setSaving(false);
    toast({ title: "Tax created", description: `${form.name} @ ${form.rate}% added.` });
    setActive(moduleId, childId, "");
  };

  if (!mod) return null;

  return (
    <div className="space-y-6">
      <PageHeader
        title={grandchild?.label ?? "Add Tax"}
        description="Define a new tax slab (e.g. GST, CGST, SGST)."
        icon={<Percent className="h-5 w-5" />}
        breadcrumb={breadcrumb}
        actions={
          <Button variant="outline" onClick={() => setActive(moduleId, childId, "")}>
            <X className="mr-2 h-4 w-4" /> Cancel
          </Button>
        }
      />
      <form onSubmit={handleSubmit} className="space-y-6">
        <SectionCard title="Tax Details" description="Name, rate and applicability">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Tax Name <span className="text-primary">*</span></Label>
              <Input id="name" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. GST" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rate">Rate (%) <span className="text-primary">*</span></Label>
              <Input id="rate" type="number" step="0.01" min="0" max="100" value={form.rate}
                onChange={(e) => set("rate", e.target.value)} placeholder="18" />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={form.type} onValueChange={(v) => set("type", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Exclusive">Exclusive (added on top)</SelectItem>
                  <SelectItem value="Inclusive">Inclusive (included in price)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Applies To</Label>
              <Select value={form.appliesTo} onValueChange={(v) => set("appliesTo", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="All services">All services</SelectItem>
                  <SelectItem value="Intra-state">Intra-state</SelectItem>
                  <SelectItem value="Inter-state">Inter-state</SelectItem>
                  <SelectItem value="Ancillary only">Ancillary only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="desc">Description</Label>
              <Textarea id="desc" rows={2} value={form.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Short note about this tax slab" />
            </div>
          </div>
        </SectionCard>
        <div className="flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => setActive(moduleId, childId, "")}>Cancel</Button>
          <Button type="submit" disabled={saving}>
            {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating…</> : <><Save className="mr-2 h-4 w-4" /> Create Tax</>}
          </Button>
        </div>
      </form>
    </div>
  );
}

/* ============================================================
 * TAX — Default Tax (grandchild)
 * ============================================================ */

function DefaultTaxPage({ moduleId, childId, grandchildId }: ViewProps) {
  const { mod, grandchild } = useModuleHeader(moduleId, childId, grandchildId);
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);
  const setActive = useAppStore((s) => s.setActive);
  const { toast } = useToast();
  const [saving, setSaving] = React.useState(false);
  const [taxes] = React.useState<TaxInfo[]>(TAX_INFO.map((t) => ({ ...t })));
  const [defaultId, setDefaultId] = React.useState("TAX01");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    setSaving(false);
    const t = taxes.find((x) => x.id === defaultId);
    toast({ title: "Default tax saved", description: `${t?.name} @ ${t?.rate} is now the default.` });
  };

  if (!mod) return null;

  return (
    <div className="space-y-6">
      <PageHeader
        title={grandchild?.label ?? "Default Tax"}
        description="Pick the tax slab that will be applied by default on new invoices."
        icon={<Percent className="h-5 w-5" />}
        breadcrumb={breadcrumb}
        actions={
          <Button variant="outline" onClick={() => setActive(moduleId, childId, "")}>
            <X className="mr-2 h-4 w-4" /> Close
          </Button>
        }
      />
      <form onSubmit={handleSave} className="space-y-6">
        <SectionCard title="Default Tax Selection" description={`${taxes.length} tax slabs available`}>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Default</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Applies To</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {taxes.map((t) => (
                  <TableRow key={t.id} data-state={t.id === defaultId ? "selected" : undefined}>
                    <TableCell>
                      <Checkbox
                        checked={t.id === defaultId}
                        onCheckedChange={() => setDefaultId(t.id)}
                        aria-label={`Set ${t.name} as default`}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{t.name}</TableCell>
                    <TableCell className="font-semibold">{t.rate}</TableCell>
                    <TableCell><Badge variant="outline" className="text-[10px]">{t.type}</Badge></TableCell>
                    <TableCell className="text-xs text-muted-foreground">{t.appliesTo}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={t.status === "Active"
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                        : "border-border bg-muted text-muted-foreground"}>
                        {t.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </SectionCard>
        <div className="flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => setActive(moduleId, childId, "")}>Cancel</Button>
          <Button type="submit" disabled={saving}>
            {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving…</> : <><Save className="mr-2 h-4 w-4" /> Save Default</>}
          </Button>
        </div>
      </form>
    </div>
  );
}
