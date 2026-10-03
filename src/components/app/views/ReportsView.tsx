"use client";

import * as React from "react";
import { ViewProps, useModuleHeader } from "./_shared";
import {
  PageHeader,
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
import { Switch } from "@/components/ui/switch";
import {
  BarChart3,
  FileText,
  CalendarDays,
  Plus,
  Play,
  Filter,
  Server,
  Clock,
  RefreshCw,
} from "lucide-react";
import { REPORTS, FTP_REPORT_SCHEDULES } from "@/lib/mock-data";
import type { ReportItem } from "@/lib/mock-data";

export function ReportsView({ moduleId, childId }: ViewProps) {
  const { mod } = useModuleHeader(moduleId, childId);
  if (!mod) return null;
  if (!childId) return <ReportsOverview moduleId={moduleId} />;
  switch (childId) {
    case "reports":
      return <ReportLauncher moduleId={moduleId} childId={childId} />;
    case "ftp-report":
      return <FtpReport moduleId={moduleId} childId={childId} />;
    default:
      return <ReportsOverview moduleId={moduleId} />;
  }
}

/* ---------------- Overview ---------------- */

function ReportsOverview({ moduleId }: { moduleId: string }) {
  const { mod } = useModuleHeader(moduleId);
  const setActive = useAppStore((s) => s.setActive);
  if (!mod) return null;
  const cards = [
    { label: "Reports", desc: "Report launcher", icon: BarChart3, child: "reports" },
    { label: "FTP Report Configuration", desc: "Scheduled FTP reports", icon: Server, child: "ftp-report" },
  ];
  return (
    <div className="space-y-6">
      <PageHeader title={mod.label} description={mod.desc} icon={<mod.icon className="h-5 w-5" />} />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <KpiCard label="Total Reports" value={String(REPORTS.length)} icon={<FileText className="h-4 w-4" />} accent />
        <KpiCard label="Scheduled Reports" value={String(FTP_REPORT_SCHEDULES.filter((s) => s.enabled).length)} icon={<Server className="h-4 w-4" />} />
        <KpiCard label="Generated Today" value="37" icon={<BarChart3 className="h-4 w-4" />} />
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

/* ---------------- Report Launcher ---------------- */

const CATEGORIES = ["All", "User", "Billing", "Support", "System", "Alert", "Policy"];

const formatBadgeClass = (fmt: ReportItem["format"]) => {
  const map: Record<ReportItem["format"], string> = {
    HTML: "bg-chart-5/10 text-chart-5 hover:bg-chart-5/10",
    PDF: "bg-primary/10 text-primary hover:bg-primary/10",
    CSV: "bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400",
    XLS: "bg-amber-500/10 text-amber-700 hover:bg-amber-500/10 dark:text-amber-400",
  };
  return map[fmt];
};

function ReportLauncher({ moduleId, childId }: ViewProps) {
  const { toast } = useToast();
  const [category, setCategory] = React.useState("All");
  const [fromDate, setFromDate] = React.useState("");
  const [toDate, setToDate] = React.useState("");
  const [zone, setZone] = React.useState("all");
  const [format, setFormat] = React.useState("all");

  const filtered = REPORTS.filter((r) => {
    if (category !== "All" && r.category !== category) return false;
    if (format !== "all" && r.format !== format) return false;
    return true;
  });

  const generate = (r: ReportItem) => {
    toast({ title: "Generating report", description: `${r.name} (${r.format}) is being generated.` });
  };
  const generateAll = () => {
    toast({ title: "Generating all reports", description: `${filtered.length} report(s) queued.` });
  };

  return (
    <div className="space-y-6">
      <ChildHeader moduleId={moduleId} childId={childId} />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <KpiCard label="Total Reports" value={String(REPORTS.length)} icon={<FileText className="h-4 w-4" />} accent />
        <KpiCard label="Categories" value={String(CATEGORIES.length - 1)} icon={<Filter className="h-4 w-4" />} />
        <KpiCard label="Generated Today" value="37" icon={<BarChart3 className="h-4 w-4" />} />
      </div>

      <SectionCard title="Report Filter" description="Pick a date range, zone and output format">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
          <div className="space-y-1.5">
            <Label htmlFor="from">From Date</Label>
            <Input id="from" type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="to">To Date</Label>
            <Input id="to" type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
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
          <div className="space-y-1.5">
            <Label htmlFor="fmt">Format</Label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger id="fmt"><SelectValue placeholder="All formats" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All formats</SelectItem>
                <SelectItem value="HTML">HTML</SelectItem>
                <SelectItem value="PDF">PDF</SelectItem>
                <SelectItem value="CSV">CSV</SelectItem>
                <SelectItem value="XLS">XLS</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Button onClick={generateAll}>
            <Play className="mr-1.5 h-4 w-4" /> Generate All
          </Button>
        </div>
      </SectionCard>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <SectionCard title="Categories" description="Filter by report type" className="lg:col-span-1">
          <div className="flex flex-col gap-1">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={
                  "flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors " +
                  (category === c
                    ? "bg-primary/10 font-medium text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground")
                }
              >
                <span>{c}</span>
                <Badge variant="outline" className="text-[10px]">
                  {c === "All" ? REPORTS.length : REPORTS.filter((r) => r.category === c).length}
                </Badge>
              </button>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Reports Catalog"
          description={`${filtered.length} report(s)`}
          className="lg:col-span-4"
        >
          {filtered.length === 0 ? (
            <EmptyState icon={<Filter className="h-5 w-5" />} title="No reports in this category" />
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {filtered.map((r) => (
                <div key={r.id} className="flex flex-col justify-between gap-3 rounded-lg border border-border bg-muted/30 p-4 transition-colors hover:border-primary/40">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium text-foreground">{r.name}</p>
                      <Badge variant="outline" className={`text-[10px] ${formatBadgeClass(r.format)}`}>{r.format}</Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{r.description}</p>
                    <Badge variant="outline" className="mt-2 text-[10px]">{r.category}</Badge>
                  </div>
                  <Button size="sm" className="w-full" onClick={() => generate(r)}>
                    <Play className="mr-1.5 h-3.5 w-3.5" /> Generate
                  </Button>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
}

/* ---------------- FTP Report ---------------- */

function FtpReport({ moduleId, childId }: ViewProps) {
  const { toast } = useToast();
  const [schedules, setSchedules] = React.useState(FTP_REPORT_SCHEDULES);
  const [showForm, setShowForm] = React.useState(false);
  const [reportName, setReportName] = React.useState("");
  const [ftpServer, setFtpServer] = React.useState("ftp.cryptsk.net");
  const [path, setPath] = React.useState("/reports/");
  const [schedule, setSchedule] = React.useState<"Daily" | "Weekly" | "Monthly">("Daily");
  const [format, setFormat] = React.useState<"HTML" | "PDF" | "CSV" | "XLS">("PDF");

  const toggle = (id: string, enabled: boolean) => {
    setSchedules((prev) => prev.map((s) => (s.id === id ? { ...s, enabled } : s)));
    const s = schedules.find((x) => x.id === id);
    toast({ title: `${s?.reportName} ${enabled ? "enabled" : "disabled"}` });
  };

  const add = () => {
    if (!reportName.trim()) {
      toast({ title: "Report name required", variant: "destructive" });
      return;
    }
    toast({ title: "Schedule added", description: `${reportName} → ${ftpServer}${path} (${schedule}, ${format})` });
    setReportName("");
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <ChildHeader moduleId={moduleId} childId={childId} />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <KpiCard label="Total Schedules" value={String(schedules.length)} icon={<Server className="h-4 w-4" />} accent />
        <KpiCard label="Enabled" value={String(schedules.filter((s) => s.enabled).length)} icon={<Clock className="h-4 w-4" />} />
        <KpiCard label="Next Run" value={schedules.find((s) => s.enabled)?.nextRun ?? "—"} icon={<CalendarDays className="h-4 w-4" />} />
      </div>

      {showForm && (
        <SectionCard title="Add FTP Schedule" description="Configure a new scheduled report upload">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="rn">Report Name</Label>
              <Input id="rn" placeholder="e.g. Daily Collection Report" value={reportName} onChange={(e) => setReportName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="fs">FTP Server</Label>
              <Input id="fs" value={ftpServer} onChange={(e) => setFtpServer(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="path">Path</Label>
              <Input id="path" value={path} onChange={(e) => setPath(e.target.value)} className="font-mono text-xs" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sch">Schedule</Label>
              <Select value={schedule} onValueChange={(v) => setSchedule(v as typeof schedule)}>
                <SelectTrigger id="sch"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Daily">Daily</SelectItem>
                  <SelectItem value="Weekly">Weekly</SelectItem>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="fmt">Format</Label>
              <Select value={format} onValueChange={(v) => setFormat(v as typeof format)}>
                <SelectTrigger id="fmt"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="HTML">HTML</SelectItem>
                  <SelectItem value="PDF">PDF</SelectItem>
                  <SelectItem value="CSV">CSV</SelectItem>
                  <SelectItem value="XLS">XLS</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button onClick={add}><Plus className="mr-1.5 h-4 w-4" /> Add Schedule</Button>
          </div>
        </SectionCard>
      )}

      <SectionCard
        title="FTP Schedules"
        description={`${schedules.length} schedule(s)`}
        actions={
          <Button size="sm" onClick={() => setShowForm((v) => !v)}>
            <Plus className="mr-1.5 h-3.5 w-3.5" /> {showForm ? "Close Form" : "Add Schedule"}
          </Button>
        }
      >
        <div className="overflow-x-auto scrollbar-thin">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report Name</TableHead>
                <TableHead>FTP Server</TableHead>
                <TableHead>Path</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead>Format</TableHead>
                <TableHead>Last Run</TableHead>
                <TableHead>Next Run</TableHead>
                <TableHead>Enabled</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schedules.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.reportName}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{s.ftpServer}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{s.path}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px]">{s.schedule}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-[10px] ${formatBadgeClass(s.format)}`}>{s.format}</Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{s.lastRun}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{s.nextRun}</TableCell>
                  <TableCell>
                    <Switch checked={s.enabled} onCheckedChange={(v) => toggle(s.id, v)} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toast({ title: "Run now", description: `${s.reportName} triggered manually.` })}
                    >
                      <RefreshCw className="mr-1 h-3.5 w-3.5" /> Run Now
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
