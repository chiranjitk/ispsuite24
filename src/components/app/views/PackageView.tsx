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
} from "lucide-react";
import { packagesApi, type Package } from "@/lib/api";
import { INVOICES, INVOICE_TEMPLATES, ANCILLARY_SERVICES, TAX_INFO } from "@/lib/mock-data";

export function PackageView({ moduleId, childId, grandchildId }: ViewProps) {
  const router = useViewRouter(moduleId, childId, grandchildId);

  if (router.state === "loading") return null;
  if (router.state === "module-overview") return <PackageOverview moduleId={moduleId} />;
  if (router.state === "child-overview")
    return <ChildOverview moduleId={moduleId} childId={router.childId} />;

  if (router.state === "grandchild") {
    // Bespoke grandchild handlers for the Package module
    if (childId === "package" && grandchildId === "create")
      return <CreatePackagePage moduleId={moduleId} childId={childId} grandchildId={grandchildId} />;
    if (childId === "package" && grandchildId === "manage")
      return <ManagePackagesPage moduleId={moduleId} childId={childId} grandchildId={grandchildId} />;

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
