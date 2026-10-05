"use client";

import * as React from "react";
import {
  ViewProps,
  useModuleHeader,
  useViewRouter,
  ChildOverview,
} from "./_shared";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingCart,
  Plus,
  LayoutGrid,
  List,
  Calendar,
  Filter,
  TrendingUp,
  Phone,
  MapPin,
  User,
  Wrench,
  Clock,
  CheckCircle2,
  Save,
  X,
  Pencil,
  Trash2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import {
  LEADS,
  SERVICE_REQUESTS,
  type Lead,
  type ServiceRequest,
} from "@/lib/mock-data";

export function SalesView({ moduleId, childId, grandchildId }: ViewProps) {
  const router = useViewRouter(moduleId, childId, grandchildId);

  if (router.state === "loading") return null;
  if (router.state === "module-overview")
    return <SalesOverview moduleId={moduleId} />;
  if (router.state === "child-overview")
    return <ChildOverview moduleId={moduleId} childId={router.childId} />;

  if (router.state === "grandchild") {
    // Lead Management grandchildren
    if (childId === "lead" && grandchildId === "create")
      return <LeadCreatePage moduleId={moduleId} childId={childId} grandchildId={grandchildId} />;
    if (childId === "lead" && grandchildId === "manage")
      return <LeadManagePage moduleId={moduleId} childId={childId} grandchildId={grandchildId} />;

    // Service Request grandchildren
    if (childId === "service-request" && grandchildId === "manage")
      return <ServiceRequestManagePage moduleId={moduleId} childId={childId} grandchildId={grandchildId} />;
  }

  // state === "child" — children without grandchildren (none in sales module today)
  return <SalesOverview moduleId={moduleId} />;
}

/* ---------------- Shared helpers ---------------- */

function useBreadcrumb(moduleId: string, childId: string, grandchildId?: string) {
  const { mod, child, grandchild } = useModuleHeader(moduleId, childId, grandchildId);
  const setActive = useAppStore((s) => s.setActive);
  return [
    { label: "Cryptsk" },
    { label: mod?.label ?? "Sales", onClick: () => setActive(moduleId, "", "") },
    { label: child?.label ?? childId, onClick: () => setActive(moduleId, childId, "") },
    ...(grandchild ? [{ label: grandchild.label }] : []),
  ];
}

/* ---------------- Overview ---------------- */

function SalesOverview({ moduleId }: { moduleId: string }) {
  const { mod } = useModuleHeader(moduleId);
  const setActive = useAppStore((s) => s.setActive);
  if (!mod) return null;

  const activeLeads = LEADS.filter((l) => l.stage !== "Converted" && l.stage !== "Lost").length;
  const converted = LEADS.filter((l) => l.stage === "Converted").length;
  const conversionRate = Math.round((converted / LEADS.length) * 100);
  const openSR = SERVICE_REQUESTS.filter((s) => s.status !== "Completed" && s.status !== "Cancelled").length;

  const cards = [
    { label: "Lead Management", desc: `${LEADS.length} leads in pipeline`, icon: TrendingUp, child: "lead" },
    { label: "Service Request", desc: `${openSR} open requests`, icon: Wrench, child: "service-request" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={mod.label}
        description={mod.desc}
        icon={<mod.icon className="h-5 w-5" />}
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <KpiCard label="Active Leads" value={String(activeLeads)} icon={<TrendingUp className="h-4 w-4" />} accent />
        <KpiCard label="Conversion Rate" value={`${conversionRate}%`} icon={<CheckCircle2 className="h-4 w-4" />} />
        <KpiCard label="Open Service Requests" value={String(openSR)} icon={<Wrench className="h-4 w-4" />} />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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

/* ---------------- Lead → Create ---------------- */

const LEAD_SOURCES = ["Walk-in", "Referral", "Facebook", "Cold Call"] as const;
const LEAD_STAGES: Lead["stage"][] = ["New", "Contacted", "Survey Done", "Converted", "Lost"];

function LeadCreatePage({ moduleId, childId, grandchildId }: ViewProps) {
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const setActive = useAppStore((s) => s.setActive);
  const [saving, setSaving] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const [form, setForm] = React.useState({
    name: "",
    contact: "",
    area: "",
    plan: "",
    source: "Walk-in" as (typeof LEAD_SOURCES)[number],
    owner: "Sales-A",
    notes: "",
  });

  const set = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => { const n = { ...e }; delete n[field]; return n; });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});

    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Lead name is required";
    if (!form.contact.trim()) errs.contact = "Contact number is required";
    else if (!/^[+\d][\d\s-]{6,}$/.test(form.contact))
      errs.contact = "Enter a valid contact number";
    if (!form.area.trim()) errs.area = "Area is required";

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      setSaving(false);
      return;
    }

    // Simulate API call (would be leadsApi.create(form))
    await new Promise((r) => setTimeout(r, 500));
    setSaving(false);
    toast({
      title: "Lead created",
      description: `Lead "${form.name}" has been added to the pipeline (stage: New).`,
    });
    setActive(moduleId, "lead", "manage");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Lead"
        description="Capture a new sales lead. New leads enter the pipeline in the New stage."
        icon={<TrendingUp className="h-5 w-5" />}
        breadcrumb={breadcrumb}
        actions={
          <Button variant="outline" onClick={() => setActive(moduleId, "lead", "manage")}>
            <X className="mr-2 h-4 w-4" /> Cancel
          </Button>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <SectionCard title="Lead Information" description="Basic lead contact details">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">
                Name <span className="text-primary">*</span>
              </Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="e.g. Rohit Sharma"
                className={errors.name ? "border-primary" : ""}
              />
              {errors.name && (
                <p className="text-xs text-primary flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.name}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact">
                Contact <span className="text-primary">*</span>
              </Label>
              <Input
                id="contact"
                value={form.contact}
                onChange={(e) => set("contact", e.target.value)}
                placeholder="+91-98xxxxxxxx"
                className={errors.contact ? "border-primary" : ""}
              />
              {errors.contact && (
                <p className="text-xs text-primary flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.contact}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="area">
                Area <span className="text-primary">*</span>
              </Label>
              <Input
                id="area"
                value={form.area}
                onChange={(e) => set("area", e.target.value)}
                placeholder="e.g. Bhiwani-North"
                className={errors.area ? "border-primary" : ""}
              />
              {errors.area && (
                <p className="text-xs text-primary flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.area}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="plan">Plan Interested</Label>
              <Input
                id="plan"
                value={form.plan}
                onChange={(e) => set("plan", e.target.value)}
                placeholder="e.g. PR HULC 500"
              />
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Source & Ownership" description="Where the lead came from and who owns it">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Source <span className="text-primary">*</span></Label>
              <Select value={form.source} onValueChange={(v) => set("source", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {LEAD_SOURCES.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Owner <span className="text-primary">*</span></Label>
              <Select value={form.owner} onValueChange={(v) => set("owner", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sales-A">Sales-A</SelectItem>
                  <SelectItem value="Sales-B">Sales-B</SelectItem>
                  <SelectItem value="Sales-C">Sales-C</SelectItem>
                  <SelectItem value="Sales-D">Sales-D</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
                placeholder="Any additional context about this lead…"
                rows={3}
              />
            </div>
          </div>
        </SectionCard>

        <div className="flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => setActive(moduleId, "lead", "manage")}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating…</>
            ) : (
              <><Save className="mr-2 h-4 w-4" /> Create Lead</>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

/* ---------------- Lead → Manage ---------------- */

const STAGE_ACCENT: Record<Lead["stage"], string> = {
  New: "border-l-sky-500",
  Contacted: "border-l-amber-500",
  "Survey Done": "border-l-violet-500",
  Converted: "border-l-emerald-500",
  Lost: "border-l-primary",
};

const STAGE_BADGE: Record<Lead["stage"], string> = {
  New: "bg-sky-500/10 text-sky-700 hover:bg-sky-500/10 dark:text-sky-400",
  Contacted: "bg-amber-500/10 text-amber-700 hover:bg-amber-500/10 dark:text-amber-400",
  "Survey Done": "bg-violet-500/10 text-violet-700 hover:bg-violet-500/10 dark:text-violet-400",
  Converted: "bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400",
  Lost: "bg-primary/10 text-primary hover:bg-primary/10",
};

function LeadManagePage({ moduleId, childId, grandchildId }: ViewProps) {
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const setActive = useAppStore((s) => s.setActive);
  const [view, setView] = React.useState<"board" | "list">("board");
  const [ownerFilter, setOwnerFilter] = React.useState("all");
  const [areaFilter, setAreaFilter] = React.useState("all");
  const [stageFilter, setStageFilter] = React.useState("all");
  const [deleteTarget, setDeleteTarget] = React.useState<Lead | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  const owners = Array.from(new Set(LEADS.map((l) => l.owner)));
  const areas = Array.from(new Set(LEADS.map((l) => l.area)));

  const filtered = LEADS.filter((l) => {
    if (ownerFilter !== "all" && l.owner !== ownerFilter) return false;
    if (areaFilter !== "all" && l.area !== areaFilter) return false;
    if (stageFilter !== "all" && l.stage !== stageFilter) return false;
    return true;
  });

  const converted = LEADS.filter((l) => l.stage === "Converted").length;
  const conversionRate = Math.round((converted / LEADS.length) * 100);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    // Simulate API call (would be leadsApi.delete(deleteTarget.id))
    await new Promise((r) => setTimeout(r, 400));
    setDeleting(false);
    toast({
      title: "Lead deleted",
      description: `Lead ${deleteTarget.id} (${deleteTarget.name}) has been removed.`,
      variant: "destructive",
    });
    setDeleteTarget(null);
  };

  const handleEdit = (l: Lead) => {
    toast({
      title: `Edit lead ${l.id}`,
      description: `Editing ${l.name} — stage: ${l.stage}.`,
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manage Leads"
        description="Track sales leads through the pipeline from new enquiry to conversion."
        icon={<TrendingUp className="h-5 w-5" />}
        breadcrumb={breadcrumb}
        actions={
          <Button onClick={() => setActive(moduleId, "lead", "create")}>
            <Plus className="mr-2 h-4 w-4" /> Add Lead
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <KpiCard label="Total Leads" value={String(LEADS.length)} icon={<TrendingUp className="h-4 w-4" />} accent />
        <KpiCard label="Conversion Rate" value={`${conversionRate}%`} icon={<CheckCircle2 className="h-4 w-4" />} />
        <KpiCard label="Showing" value={String(filtered.length)} icon={<Filter className="h-4 w-4" />} />
      </div>

      <ActionBar>
        <Select value={ownerFilter} onValueChange={setOwnerFilter}>
          <SelectTrigger className="h-8 w-[140px]">
            <SelectValue placeholder="Owner" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All owners</SelectItem>
            {owners.map((o) => (
              <SelectItem key={o} value={o}>{o}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={areaFilter} onValueChange={setAreaFilter}>
          <SelectTrigger className="h-8 w-[160px]">
            <SelectValue placeholder="Area" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All areas</SelectItem>
            {areas.map((a) => (
              <SelectItem key={a} value={a}>{a}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={stageFilter} onValueChange={setStageFilter}>
          <SelectTrigger className="h-8 w-[140px]">
            <SelectValue placeholder="Stage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All stages</SelectItem>
            {LEAD_STAGES.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="ml-auto flex items-center gap-1 rounded-md border border-border bg-muted/40 p-0.5">
          <Button
            size="sm"
            variant={view === "board" ? "default" : "ghost"}
            className="h-7"
            onClick={() => setView("board")}
          >
            <LayoutGrid className="mr-1.5 h-3.5 w-3.5" /> Board
          </Button>
          <Button
            size="sm"
            variant={view === "list" ? "default" : "ghost"}
            className="h-7"
            onClick={() => setView("list")}
          >
            <List className="mr-1.5 h-3.5 w-3.5" /> List
          </Button>
        </div>
      </ActionBar>

      {view === "board" ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {LEAD_STAGES.map((stage) => {
            const cards = filtered.filter((l) => l.stage === stage);
            return (
              <div
                key={stage}
                className="flex max-h-[640px] flex-col rounded-xl border border-border bg-muted/30"
              >
                <div className="flex items-center justify-between border-b border-border px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${STAGE_ACCENT[stage].replace("border-l-", "bg-")}`} />
                    <span className="text-sm font-semibold text-foreground">{stage}</span>
                  </div>
                  <Badge variant="secondary" className="text-[10px]">{cards.length}</Badge>
                </div>
                <div className="scrollbar-thin flex-1 space-y-2 overflow-y-auto p-2">
                  {cards.map((l) => (
                    <div
                      key={l.id}
                      className={`rounded-lg border border-l-4 border-border bg-card p-3 text-left shadow-sm transition-all hover:shadow-md ${STAGE_ACCENT[l.stage]}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">{l.name}</span>
                        <span className="font-mono text-[10px] text-muted-foreground">{l.id}</span>
                      </div>
                      <div className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
                        <Phone className="h-3 w-3" /> {l.contact}
                      </div>
                      <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" /> {l.area}
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="truncate text-xs font-medium text-primary">{l.plan}</span>
                        <span className="text-[10px] text-muted-foreground">{l.owner}</span>
                      </div>
                      <div className="mt-2 flex items-center justify-end gap-1 border-t border-border pt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2"
                          onClick={() => handleEdit(l)}
                        >
                          <Pencil className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-primary hover:text-primary"
                          onClick={() => setDeleteTarget(l)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {cards.length === 0 && (
                    <p className="px-2 py-6 text-center text-xs text-muted-foreground">No leads</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <SectionCard title="Leads" description={`${filtered.length} lead(s)`}>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Area</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((l) => (
                  <TableRow key={l.id}>
                    <TableCell className="font-mono text-xs text-primary">{l.id}</TableCell>
                    <TableCell className="font-medium">{l.name}</TableCell>
                    <TableCell className="text-muted-foreground">{l.contact}</TableCell>
                    <TableCell className="text-muted-foreground">{l.area}</TableCell>
                    <TableCell className="text-muted-foreground">{l.plan}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={STAGE_BADGE[l.stage]}>{l.stage}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{l.source}</TableCell>
                    <TableCell className="text-muted-foreground">{l.owner}</TableCell>
                    <TableCell className="whitespace-nowrap text-xs text-muted-foreground">{l.created}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2"
                          onClick={() => handleEdit(l)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-primary hover:text-primary"
                          onClick={() => setDeleteTarget(l)}
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
          {filtered.length === 0 && (
            <EmptyState icon={<Filter className="h-5 w-5" />} title="No leads match your filters" />
          )}
        </SectionCard>
      )}

      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Lead</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete lead <span className="font-medium text-foreground">{deleteTarget?.name}</span> ({deleteTarget?.id})? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)} disabled={deleting}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting…</>
              ) : (
                <><Trash2 className="mr-2 h-4 w-4" /> Delete</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ---------------- Service Request → Manage ---------------- */

const SR_STATUS_BADGE: Record<ServiceRequest["status"], string> = {
  Pending: "bg-amber-500/10 text-amber-700 hover:bg-amber-500/10 dark:text-amber-400",
  Scheduled: "bg-sky-500/10 text-sky-700 hover:bg-sky-500/10 dark:text-sky-400",
  "In Progress": "bg-violet-500/10 text-violet-700 hover:bg-violet-500/10 dark:text-violet-400",
  Completed: "bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400",
  Cancelled: "bg-primary/10 text-primary hover:bg-primary/10",
};

const SR_PRIORITY_BADGE: Record<ServiceRequest["priority"], string> = {
  Low: "bg-slate-500/10 text-slate-600 hover:bg-slate-500/10 dark:text-slate-300",
  Medium: "bg-amber-500/10 text-amber-700 hover:bg-amber-500/10 dark:text-amber-400",
  High: "bg-primary/10 text-primary hover:bg-primary/10",
};

const SR_TYPES: ServiceRequest["type"][] = ["Installation", "Relocation", "Plan Change", "Termination"];
const SR_STATUSES: ServiceRequest["status"][] = ["Pending", "Scheduled", "In Progress", "Completed", "Cancelled"];
const SR_PRIORITIES: ServiceRequest["priority"][] = ["Low", "Medium", "High"];

function ServiceRequestManagePage({ moduleId, childId, grandchildId }: ViewProps) {
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const [view, setView] = React.useState<"table" | "timeline">("table");
  const [typeFilter, setTypeFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [priorityFilter, setPriorityFilter] = React.useState("all");
  const [search, setSearch] = React.useState("");

  const filtered = SERVICE_REQUESTS.filter((s) => {
    if (typeFilter !== "all" && s.type !== typeFilter) return false;
    if (statusFilter !== "all" && s.status !== statusFilter) return false;
    if (priorityFilter !== "all" && s.priority !== priorityFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (
        !s.id.toLowerCase().includes(q) &&
        !s.customer.toLowerCase().includes(q) &&
        !s.technician.toLowerCase().includes(q)
      ) return false;
    }
    return true;
  });

  const pending = SERVICE_REQUESTS.filter((s) => s.status === "Pending").length;
  const inProgress = SERVICE_REQUESTS.filter((s) => s.status === "In Progress").length;
  const completed = SERVICE_REQUESTS.filter((s) => s.status === "Completed").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manage Service Requests"
        description="Track installation, relocation, plan change and termination service requests."
        icon={<Wrench className="h-5 w-5" />}
        breadcrumb={breadcrumb}
        actions={
          <Button onClick={() => toast({ title: "New Service Request", description: "Request creation form will open." })}>
            <Plus className="mr-2 h-4 w-4" /> New Request
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard label="Total Requests" value={String(SERVICE_REQUESTS.length)} icon={<Wrench className="h-4 w-4" />} accent />
        <KpiCard label="Pending" value={String(pending)} icon={<Clock className="h-4 w-4" />} />
        <KpiCard label="In Progress" value={String(inProgress)} icon={<TrendingUp className="h-4 w-4" />} />
        <KpiCard label="Completed" value={String(completed)} icon={<CheckCircle2 className="h-4 w-4" />} />
      </div>

      <ActionBar>
        <div className="relative flex-1 max-w-xs">
          <Filter className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by ID, customer, technician…"
            className="h-8 pl-8 text-xs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="h-8 w-[150px] text-xs">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            {SR_TYPES.map((t) => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-8 w-[140px] text-xs">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All status</SelectItem>
            {SR_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="h-8 w-[130px] text-xs">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All priority</SelectItem>
            {SR_PRIORITIES.map((p) => (
              <SelectItem key={p} value={p}>{p}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="ml-auto flex items-center gap-1 rounded-md border border-border bg-muted/40 p-0.5">
          <Button
            size="sm"
            variant={view === "table" ? "default" : "ghost"}
            className="h-7"
            onClick={() => setView("table")}
          >
            <List className="mr-1.5 h-3.5 w-3.5" /> Table
          </Button>
          <Button
            size="sm"
            variant={view === "timeline" ? "default" : "ghost"}
            className="h-7"
            onClick={() => setView("timeline")}
          >
            <Calendar className="mr-1.5 h-3.5 w-3.5" /> Timeline
          </Button>
        </div>
      </ActionBar>

      {view === "table" ? (
        <SectionCard title="Service Requests" description={`${filtered.length} request(s)`}>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Scheduled Date</TableHead>
                  <TableHead>Technician</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((s) => (
                  <TableRow
                    key={s.id}
                    className="cursor-pointer"
                    onClick={() => toast({ title: `Request ${s.id}`, description: `${s.type} for ${s.customer}` })}
                  >
                    <TableCell className="font-mono text-xs text-primary">{s.id}</TableCell>
                    <TableCell className="font-medium">{s.customer}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px]">{s.type}</Badge>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-xs text-muted-foreground">{s.scheduledDate}</TableCell>
                    <TableCell className="text-muted-foreground">{s.technician}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={SR_PRIORITY_BADGE[s.priority]}>{s.priority}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={SR_STATUS_BADGE[s.status]}>{s.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filtered.length === 0 && (
            <EmptyState icon={<Filter className="h-5 w-5" />} title="No service requests match your filters" />
          )}
        </SectionCard>
      ) : (
        <SectionCard title="Upcoming Schedule" description="Service requests ordered by scheduled date">
          <ol className="relative space-y-4 border-l border-border pl-4">
            {filtered.map((s) => (
              <li key={s.id} className="relative">
                <span className="absolute -left-[21px] top-1 h-3 w-3 rounded-full border-2 border-background bg-primary" />
                <div className="flex flex-col gap-1 rounded-lg border border-border bg-card p-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{s.customer}</span>
                      <Badge variant="outline" className="text-[10px]">{s.type}</Badge>
                      <Badge variant="outline" className={SR_PRIORITY_BADGE[s.priority]}>{s.priority}</Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      <User className="mr-1 inline h-3 w-3" />{s.technician}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="whitespace-nowrap text-xs text-muted-foreground">{s.scheduledDate}</span>
                    <Badge variant="outline" className={SR_STATUS_BADGE[s.status]}>{s.status}</Badge>
                  </div>
                </div>
              </li>
            ))}
          </ol>
          {filtered.length === 0 && (
            <EmptyState icon={<Filter className="h-5 w-5" />} title="No service requests match your filters" />
          )}
        </SectionCard>
      )}
    </div>
  );
}
