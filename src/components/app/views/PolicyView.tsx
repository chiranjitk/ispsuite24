"use client";

import * as React from "react";
import { ViewProps, useModuleHeader } from "./_shared";
import { PageHeader, KpiCard, SectionCard } from "@/components/app/shared";
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
  ShieldCheck,
  Waves,
  Clock,
  Gauge,
  Database,
  Scale,
  Zap,
  Plus,
  Pencil,
  Save,
  Calendar,
  Trash2,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import {
  SURFING_POLICIES,
  ACCESS_TIME_POLICIES,
  BANDWIDTH_POLICIES,
  DATA_TRANSFER_POLICIES,
  FAP_POLICIES,
  QOS_POLICIES,
} from "@/lib/mock-data";

export function PolicyView({ moduleId, childId }: ViewProps) {
  const { mod } = useModuleHeader(moduleId, childId);
  if (!mod) return null;
  if (!childId) return <PolicyOverview moduleId={moduleId} />;
  switch (childId) {
    case "surfing-quota":
      return <SurfingQuotaChild moduleId={moduleId} childId={childId} />;
    case "access-time":
      return <AccessTimeChild moduleId={moduleId} childId={childId} />;
    case "bandwidth":
      return <BandwidthChild moduleId={moduleId} childId={childId} />;
    case "data-transfer":
      return <DataTransferChild moduleId={moduleId} childId={childId} />;
    case "fap":
      return <FapChild moduleId={moduleId} childId={childId} />;
    case "qos":
      return <QosChild moduleId={moduleId} childId={childId} />;
    default:
      return <PolicyOverview moduleId={moduleId} />;
  }
}

/* ---------------- Overview ---------------- */

function PolicyOverview({ moduleId }: { moduleId: string }) {
  const { mod } = useModuleHeader(moduleId);
  const setActive = useAppStore((s) => s.setActive);
  if (!mod) return null;
  const cards = [
    { label: "Surfing Quota", desc: `${SURFING_POLICIES.length} policies · daily/monthly data caps`, icon: Waves, child: "surfing-quota" },
    { label: "Access Time", desc: `${ACCESS_TIME_POLICIES.length} time-based policies`, icon: Clock, child: "access-time" },
    { label: "Bandwidth", desc: `${BANDWIDTH_POLICIES.length} up/down restrictions`, icon: Gauge, child: "bandwidth" },
    { label: "Data Transfer", desc: `${DATA_TRANSFER_POLICIES.length} data quota policies`, icon: Database, child: "data-transfer" },
    { label: "Fair Access Policy", desc: `${FAP_POLICIES.length} FAP rules`, icon: Scale, child: "fap" },
    { label: "QoS Policy", desc: `${QOS_POLICIES.length} QoS / cache policies`, icon: Zap, child: "qos" },
  ];
  return (
    <div className="space-y-6">
      <PageHeader title={mod.label} description={mod.desc} icon={<mod.icon className="h-5 w-5" />} />
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

/* ---------------- Surfing Quota ---------------- */

function SurfingQuotaChild({ moduleId, childId }: ViewProps) {
  const { mod, child } = useModuleHeader(moduleId, childId);
  const { toast } = useToast();
  if (!mod) return null;
  return (
    <div className="space-y-6">
      <PageHeader
        title={child!.label}
        description="Define data caps per user / plan with daily or monthly reset periods."
        icon={<mod.icon className="h-5 w-5" />}
        breadcrumb={[{ label: "Cryptsk" }, { label: mod.label }, { label: child!.label }]}
        actions={
          <Button onClick={() => toast({ title: "Create surf policy" })}>
            <Plus className="mr-2 h-4 w-4" /> Create Policy
          </Button>
        }
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard label="Total Policies" value={String(SURFING_POLICIES.length)} icon={<Waves className="h-4 w-4" />} accent />
        <KpiCard label="Active" value={String(SURFING_POLICIES.filter((p) => p.status === "Active").length)} icon={<ShieldCheck className="h-4 w-4" />} />
        <KpiCard label="Daily Reset" value={String(SURFING_POLICIES.filter((p) => p.resetPeriod === "Daily").length)} icon={<Clock className="h-4 w-4" />} />
        <KpiCard label="Unlimited" value={String(SURFING_POLICIES.filter((p) => p.quotaMb === 0).length)} icon={<Database className="h-4 w-4" />} />
      </div>
      <SectionCard title="Surfing Quota Policies" description={`${SURFING_POLICIES.length} policies`}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Policy Name</TableHead>
                <TableHead>Quota (MB)</TableHead>
                <TableHead>Reset Period</TableHead>
                <TableHead>Applies To</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {SURFING_POLICIES.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono text-xs">{p.id}</TableCell>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell className="font-mono text-xs">
                    {p.quotaMb === 0 ? <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">Unlimited</Badge> : p.quotaMb.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{p.resetPeriod}</TableCell>
                  <TableCell className="text-muted-foreground">{p.appliesTo}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={p.status === "Active"
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                      : "border-border bg-muted text-muted-foreground"}
                    >
                      {p.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => toast({ title: "Edit policy", description: p.name })}>
                      <Pencil className="mr-1 h-3.5 w-3.5" /> Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>
      <CreateSurfPolicyForm />
    </div>
  );
}

function CreateSurfPolicyForm() {
  const { toast } = useToast();
  return (
    <SectionCard title="Create Surf Policy">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Policy Name</Label>
          <Input placeholder="e.g. Night Free Surf" />
        </div>
        <div className="space-y-1.5">
          <Label>Quota (MB)</Label>
          <Input type="number" placeholder="0 for unlimited" />
        </div>
        <div className="space-y-1.5">
          <Label>Reset Period</Label>
          <Select defaultValue="daily">
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="time">Time window</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Applies To</Label>
          <Select defaultValue="all">
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="prepaid">All Prepaid</SelectItem>
              <SelectItem value="hotspot">Hotspot Plans</SelectItem>
              <SelectItem value="ll">Leased Line</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button className="mt-4" onClick={() => toast({ title: "Policy created", description: "Surfing quota policy saved." })}>
        <Save className="mr-2 h-4 w-4" /> Save Policy
      </Button>
    </SectionCard>
  );
}

/* ---------------- Access Time ---------------- */

function AccessTimeChild({ moduleId, childId }: ViewProps) {
  const { mod, child } = useModuleHeader(moduleId, childId);
  const { toast } = useToast();
  // 7 days x 24 hours visual grid (default: Mon-Fri 09-18 + Night 22-06)
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const [grid, setGrid] = React.useState<boolean[][]>(() => {
    return days.map((_, d) =>
      Array.from({ length: 24 }, (_, h) => {
        // Office hours 09-18 Mon-Fri
        if (d < 5 && h >= 9 && h < 18) return true;
        // Night unlimited 22-06 all days
        if (h >= 22 || h < 6) return true;
        return false;
      })
    );
  });
  const toggle = (d: number, h: number) => {
    setGrid((prev) => prev.map((row, di) => (di === d ? row.map((v, hi) => (hi === h ? !v : v)) : row)));
  };
  if (!mod) return null;
  return (
    <div className="space-y-6">
      <PageHeader
        title={child!.label}
        description="Time-based access policies with a visual weekly schedule grid."
        icon={<mod.icon className="h-5 w-5" />}
        breadcrumb={[{ label: "Cryptsk" }, { label: mod.label }, { label: child!.label }]}
        actions={
          <Button onClick={() => toast({ title: "Create access policy" })}>
            <Plus className="mr-2 h-4 w-4" /> Create Policy
          </Button>
        }
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard label="Policies" value={String(ACCESS_TIME_POLICIES.length)} icon={<Clock className="h-4 w-4" />} accent />
        <KpiCard label="Active" value={String(ACCESS_TIME_POLICIES.filter((p) => p.status === "Active").length)} icon={<ShieldCheck className="h-4 w-4" />} />
        <KpiCard label="Weekend" value={String(ACCESS_TIME_POLICIES.filter((p) => p.days.includes("Sat")).length)} icon={<Calendar className="h-4 w-4" />} />
        <KpiCard label="24/7" value={String(ACCESS_TIME_POLICIES.filter((p) => p.days.includes("Mon-Sun")).length)} icon={<Clock className="h-4 w-4" />} />
      </div>
      <SectionCard title="Weekly Schedule Grid" description="Click a cell to toggle access for that day/hour. Green = allowed, muted = blocked.">
        <div className="overflow-x-auto">
          <div className="min-w-[640px]">
            <div className="grid grid-cols-[40px_repeat(24,_1fr)] gap-0.5">
              <div />
              {Array.from({ length: 24 }).map((_, h) => (
                <div key={h} className="text-center text-[9px] font-mono text-muted-foreground">{String(h).padStart(2, "0")}</div>
              ))}
              {days.map((d, di) => (
                <React.Fragment key={d}>
                  <div className="flex items-center text-xs font-medium text-foreground">{d}</div>
                  {grid[di].map((on, h) => (
                    <button
                      key={h}
                      onClick={() => toggle(di, h)}
                      aria-label={`${d} ${h}:00`}
                      className={`h-6 rounded-sm border border-border/50 transition-colors ${
                        on
                          ? "bg-emerald-500/70 hover:bg-emerald-500"
                          : "bg-muted/60 hover:bg-muted"
                      }`}
                    />
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-sm bg-emerald-500/70" /> Allowed</span>
          <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-sm bg-muted/60" /> Blocked</span>
          <Button size="sm" variant="outline" className="ml-auto" onClick={() => toast({ title: "Schedule saved" })}>
            <Save className="mr-1.5 h-3.5 w-3.5" /> Save Schedule
          </Button>
        </div>
      </SectionCard>
      <SectionCard title="Access Time Policies" description={`${ACCESS_TIME_POLICIES.length} policies`}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Policy Name</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Days</TableHead>
                <TableHead>Applies To</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ACCESS_TIME_POLICIES.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono text-xs">{p.id}</TableCell>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell className="font-mono text-xs">{p.allowedFrom}</TableCell>
                  <TableCell className="font-mono text-xs">{p.allowedTo}</TableCell>
                  <TableCell className="text-muted-foreground">{p.days}</TableCell>
                  <TableCell className="text-muted-foreground">{p.appliesTo}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={p.status === "Active"
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                      : "border-border bg-muted text-muted-foreground"}
                    >
                      {p.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => toast({ title: "Edit policy", description: p.name })}>
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

/* ---------------- Bandwidth ---------------- */

function BandwidthChild({ moduleId, childId }: ViewProps) {
  const { mod, child } = useModuleHeader(moduleId, childId);
  const { toast } = useToast();
  if (!mod) return null;
  return (
    <div className="space-y-6">
      <PageHeader
        title={child!.label}
        description="Per-plan up/down bandwidth restrictions with optional schedules."
        icon={<mod.icon className="h-5 w-5" />}
        breadcrumb={[{ label: "Cryptsk" }, { label: mod.label }, { label: child!.label }]}
        actions={
          <Button onClick={() => toast({ title: "Create bandwidth policy" })}>
            <Plus className="mr-2 h-4 w-4" /> Create Policy
          </Button>
        }
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard label="Policies" value={String(BANDWIDTH_POLICIES.length)} icon={<Gauge className="h-4 w-4" />} accent />
        <KpiCard label="Active" value={String(BANDWIDTH_POLICIES.filter((p) => p.status === "Active").length)} icon={<ShieldCheck className="h-4 w-4" />} />
        <KpiCard label="Max Down" value={`${Math.max(...BANDWIDTH_POLICIES.map((p) => p.downMbps))} Mbps`} icon={<ArrowDown className="h-4 w-4" />} />
        <KpiCard label="Max Up" value={`${Math.max(...BANDWIDTH_POLICIES.map((p) => p.upMbps))} Mbps`} icon={<ArrowUp className="h-4 w-4" />} />
      </div>
      <SectionCard title="Bandwidth Policies" description={`${BANDWIDTH_POLICIES.length} policies`}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Up (Mbps)</TableHead>
                <TableHead>Down (Mbps)</TableHead>
                <TableHead>Applies To</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {BANDWIDTH_POLICIES.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono text-xs">{p.id}</TableCell>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell className="font-mono text-xs">
                    <span className="inline-flex items-center gap-1"><ArrowUp className="h-3 w-3 text-emerald-600" />{p.upMbps}</span>
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    <span className="inline-flex items-center gap-1"><ArrowDown className="h-3 w-3 text-primary" />{p.downMbps}</span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{p.appliesTo}</TableCell>
                  <TableCell className="text-muted-foreground">{p.schedule}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={p.status === "Active"
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                      : "border-border bg-muted text-muted-foreground"}
                    >
                      {p.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => toast({ title: "Edit policy", description: p.name })}>
                      <Pencil className="mr-1 h-3.5 w-3.5" /> Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>
      <CreateBandwidthForm />
    </div>
  );
}

function CreateBandwidthForm() {
  const { toast } = useToast();
  return (
    <SectionCard title="Create Bandwidth Policy">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-1.5">
          <Label>Policy Name</Label>
          <Input placeholder="e.g. Peak Hour Cap" />
        </div>
        <div className="space-y-1.5">
          <Label>Upload (Mbps)</Label>
          <Input type="number" defaultValue={5} />
        </div>
        <div className="space-y-1.5">
          <Label>Download (Mbps)</Label>
          <Input type="number" defaultValue={50} />
        </div>
        <div className="space-y-1.5">
          <Label>Applies To</Label>
          <Select defaultValue="all">
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="prepaid">All Prepaid</SelectItem>
              <SelectItem value="ll">Leased Line</SelectItem>
              <SelectItem value="fap">FAP-triggered</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Schedule</Label>
          <Select defaultValue="always">
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="always">Always</SelectItem>
              <SelectItem value="peak">Peak hours 19-23</SelectItem>
              <SelectItem value="weekend">Weekend all day</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-end">
          <Button className="w-full" onClick={() => toast({ title: "Bandwidth policy created" })}>
            <Save className="mr-2 h-4 w-4" /> Save
          </Button>
        </div>
      </div>
    </SectionCard>
  );
}

/* ---------------- Data Transfer ---------------- */

function DataTransferChild({ moduleId, childId }: ViewProps) {
  const { mod, child } = useModuleHeader(moduleId, childId);
  const { toast } = useToast();
  if (!mod) return null;
  return (
    <div className="space-y-6">
      <PageHeader
        title={child!.label}
        description="Monthly/weekly data transfer quotas applied to subscriber plans."
        icon={<mod.icon className="h-5 w-5" />}
        breadcrumb={[{ label: "Cryptsk" }, { label: mod.label }, { label: child!.label }]}
        actions={
          <Button onClick={() => toast({ title: "Create data transfer policy" })}>
            <Plus className="mr-2 h-4 w-4" /> Create Policy
          </Button>
        }
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard label="Policies" value={String(DATA_TRANSFER_POLICIES.length)} icon={<Database className="h-4 w-4" />} accent />
        <KpiCard label="Active" value={String(DATA_TRANSFER_POLICIES.filter((p) => p.status === "Active").length)} icon={<ShieldCheck className="h-4 w-4" />} />
        <KpiCard label="Uncapped" value={String(DATA_TRANSFER_POLICIES.filter((p) => p.quotaGb === 0).length)} icon={<Database className="h-4 w-4" />} />
        <KpiCard label="Max Quota" value={`${Math.max(...DATA_TRANSFER_POLICIES.filter((p) => p.quotaGb > 0).map((p) => p.quotaGb), 0)} GB`} icon={<Database className="h-4 w-4" />} />
      </div>
      <SectionCard title="Data Transfer Policies" description={`${DATA_TRANSFER_POLICIES.length} policies`}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Quota (GB)</TableHead>
                <TableHead>Reset Period</TableHead>
                <TableHead>Applies To</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {DATA_TRANSFER_POLICIES.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono text-xs">{p.id}</TableCell>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell className="font-mono text-xs">
                    {p.quotaGb === 0 ? <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">Uncapped</Badge> : p.quotaGb.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{p.resetPeriod}</TableCell>
                  <TableCell className="text-muted-foreground">{p.appliesTo}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={p.status === "Active"
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                      : "border-border bg-muted text-muted-foreground"}
                    >
                      {p.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => toast({ title: "Edit policy", description: p.name })}>
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

/* ---------------- FAP ---------------- */

function FapChild({ moduleId, childId }: ViewProps) {
  const { mod, child } = useModuleHeader(moduleId, childId);
  const { toast } = useToast();
  if (!mod) return null;
  return (
    <div className="space-y-6">
      <PageHeader
        title={child!.label}
        description="Fair Access Policy — throttle heavy users after threshold GB, reset on a schedule."
        icon={<mod.icon className="h-5 w-5" />}
        breadcrumb={[{ label: "Cryptsk" }, { label: mod.label }, { label: child!.label }]}
        actions={
          <Button onClick={() => toast({ title: "Create FAP rule" })}>
            <Plus className="mr-2 h-4 w-4" /> Create FAP
          </Button>
        }
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard label="FAP Rules" value={String(FAP_POLICIES.length)} icon={<Scale className="h-4 w-4" />} accent />
        <KpiCard label="Active" value={String(FAP_POLICIES.filter((p) => p.status === "Active").length)} icon={<ShieldCheck className="h-4 w-4" />} />
        <KpiCard label="Max Threshold" value={`${Math.max(...FAP_POLICIES.filter((p) => p.thresholdGb > 0).map((p) => p.thresholdGb), 0)} GB`} icon={<Database className="h-4 w-4" />} />
        <KpiCard label="Exempt Plans" value={String(FAP_POLICIES.filter((p) => p.thresholdGb === 0).length)} icon={<ShieldCheck className="h-4 w-4" />} />
      </div>
      <SectionCard title="Fair Access Policies" description={`${FAP_POLICIES.length} rules`}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Threshold (GB)</TableHead>
                <TableHead>Reset Period</TableHead>
                <TableHead>Throttle Down</TableHead>
                <TableHead>Applies To</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {FAP_POLICIES.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono text-xs">{p.id}</TableCell>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell className="font-mono text-xs">
                    {p.thresholdGb === 0 ? <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">Exempt</Badge> : p.thresholdGb.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{p.resetPeriod}</TableCell>
                  <TableCell className="font-mono text-xs text-amber-700 dark:text-amber-400">{p.throttleDown}</TableCell>
                  <TableCell className="text-muted-foreground">{p.appliesTo}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={p.status === "Active"
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                      : "border-border bg-muted text-muted-foreground"}
                    >
                      {p.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => toast({ title: "Edit FAP", description: p.name })}>
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

/* ---------------- QoS ---------------- */

function QosChild({ moduleId, childId }: ViewProps) {
  const { mod, child } = useModuleHeader(moduleId, childId);
  const { toast } = useToast();
  if (!mod) return null;
  const priorityBadge = (p: "High" | "Medium" | "Low") => {
    if (p === "High") return <Badge className="bg-primary/10 text-primary hover:bg-primary/10">High</Badge>;
    if (p === "Medium") return <Badge className="bg-amber-500/10 text-amber-700 hover:bg-amber-500/10 dark:text-amber-400">Medium</Badge>;
    return <Badge className="bg-muted text-muted-foreground hover:bg-muted">Low</Badge>;
  };
  return (
    <div className="space-y-6">
      <PageHeader
        title={child!.label}
        description="Quality-of-service and cache policies with optional scheduling."
        icon={<mod.icon className="h-5 w-5" />}
        breadcrumb={[{ label: "Cryptsk" }, { label: mod.label }, { label: child!.label }]}
        actions={
          <Button onClick={() => toast({ title: "Create QoS / cache policy" })}>
            <Plus className="mr-2 h-4 w-4" /> Create Policy
          </Button>
        }
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard label="Policies" value={String(QOS_POLICIES.length)} icon={<Zap className="h-4 w-4" />} accent />
        <KpiCard label="QoS Rules" value={String(QOS_POLICIES.filter((p) => p.type === "QoS").length)} icon={<Gauge className="h-4 w-4" />} />
        <KpiCard label="Cache Rules" value={String(QOS_POLICIES.filter((p) => p.type === "Cache").length)} icon={<Database className="h-4 w-4" />} />
        <KpiCard label="Active" value={String(QOS_POLICIES.filter((p) => p.status === "Active").length)} icon={<ShieldCheck className="h-4 w-4" />} />
      </div>
      <SectionCard title="QoS / Cache Policies" description={`${QOS_POLICIES.length} policies`}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead>Applies To</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {QOS_POLICIES.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono text-xs">{p.id}</TableCell>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={p.type === "QoS"
                      ? "border-primary/30 bg-primary/10 text-primary"
                      : "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"}
                    >
                      {p.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{priorityBadge(p.priority)}</TableCell>
                  <TableCell className="text-muted-foreground">{p.schedule}</TableCell>
                  <TableCell className="text-muted-foreground">{p.appliesTo}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={p.status === "Active"
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                      : "border-border bg-muted text-muted-foreground"}
                    >
                      {p.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => toast({ title: "Edit policy", description: p.name })}>
                      <Pencil className="mr-1 h-3.5 w-3.5" /> Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>
      <SectionCard title="Manage Schedule" description="Define cache warm-up and QoS time windows">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label>Schedule Name</Label>
            <Input defaultValue="Peak Cache Warmup" />
          </div>
          <div className="space-y-1.5">
            <Label>From</Label>
            <Input type="time" defaultValue="03:00" />
          </div>
          <div className="space-y-1.5">
            <Label>To</Label>
            <Input type="time" defaultValue="06:00" />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <Button onClick={() => toast({ title: "Schedule saved" })}>
            <Save className="mr-2 h-4 w-4" /> Save Schedule
          </Button>
          <Button variant="outline" onClick={() => toast({ title: "Schedule deleted", variant: "destructive" })}>
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </Button>
        </div>
      </SectionCard>
    </div>
  );
}
