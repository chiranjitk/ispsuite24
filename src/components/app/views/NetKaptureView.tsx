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
  Radar,
  Play,
  Square,
  Save,
  HardDrive,
  Activity,
  Trash2,
  Download,
} from "lucide-react";
import { NET_KAPTURE_SESSIONS } from "@/lib/mock-data";

export function NetKaptureView({ moduleId, childId }: ViewProps) {
  const { mod } = useModuleHeader(moduleId, childId);
  if (!mod) return null;
  if (!childId) return <NetKaptureOverview moduleId={moduleId} />;
  switch (childId) {
    case "manage-service":
      return <ManageService moduleId={moduleId} childId={childId} />;
    default:
      return <NetKaptureOverview moduleId={moduleId} />;
  }
}

/* ---------------- Overview ---------------- */

function NetKaptureOverview({ moduleId }: { moduleId: string }) {
  const { mod } = useModuleHeader(moduleId);
  const setActive = useAppStore((s) => s.setActive);
  if (!mod) return null;
  const cards = [
    { label: "Manage Service", desc: "Configure net kapture", icon: Radar, child: "manage-service" },
  ];
  return (
    <div className="space-y-6">
      <PageHeader title={mod.label} description={mod.desc} icon={<mod.icon className="h-5 w-5" />} />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <KpiCard label="Active Captures" value={String(NET_KAPTURE_SESSIONS.filter((s) => s.status === "Running").length)} icon={<Activity className="h-4 w-4" />} accent />
        <KpiCard label="Total Packets" value={NET_KAPTURE_SESSIONS.reduce((s, c) => s + c.packets, 0).toLocaleString()} icon={<Radar className="h-4 w-4" />} />
        <KpiCard label="Storage" value="88.0 MB / 5 GB" icon={<HardDrive className="h-4 w-4" />} />
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

/* ---------------- Manage Service ---------------- */

function ManageService({ moduleId, childId }: ViewProps) {
  const { toast } = useToast();
  const [enabled, setEnabled] = React.useState(true);
  const [iface, setIface] = React.useState("eth12(M)");
  const [bpFilter, setBpFilter] = React.useState("port 80 or port 443");
  const [maxPackets, setMaxPackets] = React.useState("100000");
  const [duration, setDuration] = React.useState("300");

  const start = () => {
    toast({ title: "Capture started", description: `Listening on ${iface} · filter: ${bpFilter || "(none)"}` });
  };
  const stop = () => {
    toast({ title: "Capture stopped", description: "Session saved to disk.", variant: "destructive" });
  };
  const save = () => {
    toast({ title: "Configuration saved" });
  };

  return (
    <div className="space-y-6">
      <ChildHeader moduleId={moduleId} childId={childId} />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <KpiCard label="Active Captures" value={String(NET_KAPTURE_SESSIONS.filter((s) => s.status === "Running").length)} icon={<Activity className="h-4 w-4" />} accent />
        <KpiCard label="Total Packets" value={NET_KAPTURE_SESSIONS.reduce((s, c) => s + c.packets, 0).toLocaleString()} icon={<Radar className="h-4 w-4" />} />
        <KpiCard label="Storage" value="88.0 MB / 5 GB" icon={<HardDrive className="h-4 w-4" />} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <SectionCard title="Capture Configuration" description="Service control and capture parameters" className="lg:col-span-2">
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-border bg-muted/40 p-3">
              <div>
                <p className="text-sm font-medium">Enable Net Kapture Service</p>
                <p className="text-xs text-muted-foreground">Allow packet capture sessions to run.</p>
              </div>
              <Switch checked={enabled} onCheckedChange={setEnabled} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="iface">Capture Interface</Label>
              <Select value={iface} onValueChange={setIface}>
                <SelectTrigger id="iface"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="eth0(A)">eth0(A) — Internal</SelectItem>
                  <SelectItem value="eth1(B)">eth1(B) — Internal</SelectItem>
                  <SelectItem value="eth12(M)">eth12(M) — External</SelectItem>
                  <SelectItem value="eth13(N)">eth13(N) — External</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="bp">Capture Filter (BPF syntax)</Label>
              <Input id="bp" placeholder="e.g. port 80 or port 443" value={bpFilter} onChange={(e) => setBpFilter(e.target.value)} className="font-mono text-xs" />
              <p className="text-xs text-muted-foreground">tcpdump / BPF expression — leave blank for all traffic.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="pkt">Max Packets</Label>
                <Input id="pkt" type="number" min={1} value={maxPackets} onChange={(e) => setMaxPackets(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="dur">Duration (sec)</Label>
                <Input id="dur" type="number" min={1} value={duration} onChange={(e) => setDuration(e.target.value)} />
              </div>
            </div>
            <div className="flex gap-2">
              <Button className="flex-1" onClick={start} disabled={!enabled}>
                <Play className="mr-1.5 h-4 w-4" /> Start
              </Button>
              <Button className="flex-1" variant="destructive" onClick={stop} disabled={!enabled}>
                <Square className="mr-1.5 h-4 w-4" /> Stop
              </Button>
            </div>
            <Button variant="outline" className="w-full" onClick={save}>
              <Save className="mr-1.5 h-4 w-4" /> Save Defaults
            </Button>
          </div>
        </SectionCard>

        <SectionCard
          title="Capture Sessions"
          description={`${NET_KAPTURE_SESSIONS.length} sessions`}
          className="lg:col-span-3"
          actions={
            <Button variant="outline" size="sm" onClick={() => toast({ title: "Purged", description: "Old capture sessions deleted.", variant: "destructive" })}>
              <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Purge Old
            </Button>
          }
        >
          <div className="max-h-96 overflow-y-auto overflow-x-auto scrollbar-thin">
            <Table>
              <TableHeader className="sticky top-0 bg-card">
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Interface</TableHead>
                  <TableHead>Filter</TableHead>
                  <TableHead>Packets</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Started</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {NET_KAPTURE_SESSIONS.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-mono text-xs">{s.id}</TableCell>
                    <TableCell className="font-mono text-xs">{s.interface}</TableCell>
                    <TableCell className="max-w-[180px] truncate font-mono text-xs text-muted-foreground">{s.filter}</TableCell>
                    <TableCell className="font-mono text-xs">{s.packets.toLocaleString()}</TableCell>
                    <TableCell className="font-mono text-xs">{s.size}</TableCell>
                    <TableCell className="font-mono text-xs">{s.duration}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          s.status === "Running"
                            ? "bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400"
                            : s.status === "Stopped"
                            ? "bg-primary/10 text-primary hover:bg-primary/10"
                            : "bg-muted text-muted-foreground hover:bg-muted"
                        }
                      >
                        {s.status === "Running" && <Activity className="mr-1 h-2.5 w-2.5 animate-pulse" />}
                        {s.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-xs text-muted-foreground">{s.started}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toast({ title: "Download capture", description: `${s.id}.pcap download started.` })}
                      >
                        <Download className="mr-1 h-3.5 w-3.5" /> .pcap
                      </Button>
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
