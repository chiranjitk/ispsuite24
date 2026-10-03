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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent } from "@/components/ui/tabs";
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
} from "lucide-react";
import { LEADS, SERVICE_REQUESTS, type Lead, type ServiceRequest } from "@/lib/mock-data";

export function SalesView({ moduleId, childId }: ViewProps) {
  const { mod } = useModuleHeader(moduleId, childId);
  if (!mod) return null;

  if (!childId) return <SalesOverview moduleId={moduleId} />;
  switch (childId) {
    case "lead":
      return <LeadManagement moduleId={moduleId} childId={childId} />;
    case "service-request":
      return <ServiceRequestPage moduleId={moduleId} childId={childId} />;
    default:
      return <SalesOverview moduleId={moduleId} />;
  }
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

/* ---------------- Lead Management ---------------- */

const STAGES: Lead["stage"][] = ["New", "Contacted", "Survey Done", "Converted", "Lost"];

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

function LeadManagement({ moduleId, childId }: ViewProps) {
  const { mod, child } = useModuleHeader(moduleId, childId);
  const { toast } = useToast();
  const [view, setView] = React.useState<"board" | "list">("board");
  const [ownerFilter, setOwnerFilter] = React.useState("all");
  const [areaFilter, setAreaFilter] = React.useState("all");
  const [stageFilter, setStageFilter] = React.useState("all");
  if (!mod) return null;

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

  return (
    <div className="space-y-6">
      <PageHeader
        title={child!.label}
        description="Track sales leads through the pipeline from new enquiry to conversion."
        icon={<mod.icon className="h-5 w-5" />}
        breadcrumb={[{ label: "Cryptsk" }, { label: mod.label }, { label: child!.label }]}
        actions={
          <Button onClick={() => toast({ title: "Add Lead", description: "New lead capture form will open." })}>
            <Plus className="mr-2 h-4 w-4" /> Add Lead
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <KpiCard label="Total Leads" value={String(LEADS.length)} icon={<TrendingUp className="h-4 w-4" />} accent />
        <KpiCard label="Conversion Rate" value={`${conversionRate}%`} icon={<CheckCircle2 className="h-4 w-4" />} />
        <KpiCard label="This Week" value="3" icon={<Clock className="h-4 w-4" />} />
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
            {STAGES.map((s) => (
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
          {STAGES.map((stage) => {
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
                    <button
                      key={l.id}
                      onClick={() => toast({ title: `Lead ${l.id}`, description: `${l.name} · ${l.plan}` })}
                      className={`block w-full rounded-lg border border-l-4 border-border bg-card p-3 text-left shadow-sm transition-all hover:shadow-md ${STAGE_ACCENT[l.stage]}`}
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
                    </button>
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((l) => (
                  <TableRow
                    key={l.id}
                    className="cursor-pointer"
                    onClick={() => toast({ title: `Lead ${l.id}`, description: l.name })}
                  >
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
    </div>
  );
}

/* ---------------- Service Requests ---------------- */

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

function ServiceRequestPage({ moduleId, childId }: ViewProps) {
  const { mod, child } = useModuleHeader(moduleId, childId);
  const { toast } = useToast();
  const [view, setView] = React.useState<"table" | "timeline">("table");
  if (!mod) return null;

  const pending = SERVICE_REQUESTS.filter((s) => s.status === "Pending").length;
  const inProgress = SERVICE_REQUESTS.filter((s) => s.status === "In Progress").length;
  const completed = SERVICE_REQUESTS.filter((s) => s.status === "Completed").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title={child!.label}
        description="Track installation, relocation, plan change and termination service requests."
        icon={<mod.icon className="h-5 w-5" />}
        breadcrumb={[{ label: "Cryptsk" }, { label: mod.label }, { label: child!.label }]}
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

      <Tabs value={view} onValueChange={(v) => setView(v as "table" | "timeline")}>
        <TabsContent value="table">
          <SectionCard title="Service Requests" description={`${SERVICE_REQUESTS.length} request(s)`}>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Scheduled</TableHead>
                    <TableHead>Technician</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {SERVICE_REQUESTS.map((s) => (
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
          </SectionCard>
        </TabsContent>

        <TabsContent value="timeline">
          <SectionCard title="Upcoming Schedule" description="Service requests ordered by scheduled date">
            <ol className="relative space-y-4 border-l border-border pl-4">
              {SERVICE_REQUESTS.map((s) => (
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
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
