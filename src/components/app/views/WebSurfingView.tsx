"use client";

import * as React from "react";
import { ViewProps, useModuleHeader } from "./_shared";
import {
  PageHeader,
  KpiCard,
  SectionCard,
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
  Globe,
  Save,
  ShieldBan,
  CheckCircle2,
  HardDrive,
  Trash2,
  Filter,
  Search,
} from "lucide-react";
import { WEB_LOG_URLS } from "@/lib/mock-data";

export function WebSurfingView({ moduleId, childId }: ViewProps) {
  const { mod } = useModuleHeader(moduleId, childId);
  if (!mod) return null;
  if (!childId) return <WebSurfingOverview moduleId={moduleId} />;
  switch (childId) {
    case "manage-logger":
      return <ManageLogger moduleId={moduleId} childId={childId} />;
    default:
      return <WebSurfingOverview moduleId={moduleId} />;
  }
}

/* ---------------- Overview ---------------- */

function WebSurfingOverview({ moduleId }: { moduleId: string }) {
  const { mod } = useModuleHeader(moduleId);
  const setActive = useAppStore((s) => s.setActive);
  if (!mod) return null;
  const cards = [
    { label: "Manage Logger", desc: "Configure web surfing logger", icon: Globe, child: "manage-logger" },
  ];
  return (
    <div className="space-y-6">
      <PageHeader title={mod.label} description={mod.desc} icon={<mod.icon className="h-5 w-5" />} />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <KpiCard label="URLs Logged Today" value="12,481" icon={<Globe className="h-4 w-4" />} accent />
        <KpiCard label="Blocked Today" value={String(WEB_LOG_URLS.filter((w) => w.action === "Blocked").length)} icon={<ShieldBan className="h-4 w-4" />} />
        <KpiCard label="Storage Used" value="2.4 GB / 10 GB" icon={<HardDrive className="h-4 w-4" />} />
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

/* ---------------- Manage Logger ---------------- */

function ManageLogger({ moduleId, childId }: ViewProps) {
  const { toast } = useToast();
  const [enabled, setEnabled] = React.useState(true);
  const [retention, setRetention] = React.useState("30");
  const [logLevel, setLogLevel] = React.useState("all");
  const [storagePath, setStoragePath] = React.useState("/var/log/cryptsk/surfing");
  const [maxSize, setMaxSize] = React.useState("10");
  const [filter, setFilter] = React.useState("");

  const save = () => {
    toast({ title: "Logger configuration saved", description: `Logging is ${enabled ? "ON" : "OFF"} · ${retention} day retention.` });
  };

  const filtered = WEB_LOG_URLS.filter((w) => {
    if (!filter.trim()) return true;
    const q = filter.toLowerCase();
    return w.user.toLowerCase().includes(q) || w.url.toLowerCase().includes(q) || w.category.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      <ChildHeader moduleId={moduleId} childId={childId} />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <KpiCard label="URLs Logged Today" value="12,481" icon={<Globe className="h-4 w-4" />} accent />
        <KpiCard label="Blocked Today" value={String(WEB_LOG_URLS.filter((w) => w.action === "Blocked").length)} icon={<ShieldBan className="h-4 w-4" />} />
        <KpiCard label="Storage Used" value="2.4 GB / 10 GB" icon={<HardDrive className="h-4 w-4" />} />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <SectionCard title="Logger Configuration" description="Enable, retention, level and storage" className="lg:col-span-2">
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-border bg-muted/40 p-3">
              <div>
                <p className="text-sm font-medium">Enable Web Surfing Logger</p>
                <p className="text-xs text-muted-foreground">Capture and store subscriber URL visits.</p>
              </div>
              <Switch checked={enabled} onCheckedChange={setEnabled} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="retention">Log Retention (days)</Label>
              <Input id="retention" type="number" min={1} value={retention} onChange={(e) => setRetention(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="level">Log Level</Label>
              <Select value={logLevel} onValueChange={setLogLevel}>
                <SelectTrigger id="level"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All requests</SelectItem>
                  <SelectItem value="url">URLs only</SelectItem>
                  <SelectItem value="blocked">Blocked only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="path">Storage Path</Label>
              <Input id="path" value={storagePath} onChange={(e) => setStoragePath(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="max">Max Size (GB)</Label>
              <Input id="max" type="number" min={1} value={maxSize} onChange={(e) => setMaxSize(e.target.value)} />
            </div>
            <Button className="w-full" onClick={save}>
              <Save className="mr-1.5 h-4 w-4" /> Save Configuration
            </Button>
          </div>
        </SectionCard>

        <SectionCard
          title="Recent Logged URLs"
          description={`${filtered.length} entries`}
          className="lg:col-span-3"
          actions={
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Filter user / URL" className="h-8 w-[200px] pl-8 text-xs" value={filter} onChange={(e) => setFilter(e.target.value)} />
              </div>
              <Button variant="outline" size="sm" className="h-8" onClick={() => toast({ title: "Purged", description: "All logged URLs cleared.", variant: "destructive" })}>
                <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Purge
              </Button>
            </div>
          }
        >
          <div className="max-h-96 overflow-y-auto overflow-x-auto scrollbar-thin">
            <Table>
              <TableHeader className="sticky top-0 bg-card">
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((w) => (
                  <TableRow key={w.id}>
                    <TableCell className="whitespace-nowrap font-mono text-xs text-muted-foreground">{w.timestamp}</TableCell>
                    <TableCell className="font-medium text-primary">{w.user}</TableCell>
                    <TableCell className="max-w-[280px] truncate font-mono text-xs">{w.url}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px]"><Filter className="mr-1 h-2.5 w-2.5" />{w.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          w.action === "Allowed"
                            ? "bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400"
                            : "bg-primary/10 text-primary hover:bg-primary/10"
                        }
                      >
                        {w.action === "Allowed" ? <CheckCircle2 className="mr-1 h-2.5 w-2.5" /> : <ShieldBan className="mr-1 h-2.5 w-2.5" />}
                        {w.action}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
