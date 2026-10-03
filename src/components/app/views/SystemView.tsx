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
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Network,
  ShieldAlert,
  Server,
  Database,
  Power,
  RefreshCw,
  Plus,
  Pencil,
  Trash2,
  Download,
  Upload,
  Play,
  Square,
  Save,
  Eye,
  EyeOff,
  Terminal,
  Globe,
  Wifi,
  Activity,
  SlidersHorizontal,
  LayoutGrid,
  Wrench,
  AlertTriangle,
  Info,
  Clock,
  KeyRound,
  HardDrive,
  Layers,
  Route,
  Lock,
  UserCog,
  ArrowRight,
  Pause,
} from "lucide-react";
import {
  INTERFACES,
  FIREWALL_RULES,
  DHCP_LEASES,
  NAS_DEVICES,
  SYSTEM_SERVICES,
  ACL_ROLES,
  DYNAMIC_DNS,
  CAPTIVE_TEMPLATES,
  DENY_NETWORK,
  DEVICE_LOGS,
  MANAGED_DEVICES,
  DASHBOARD_LAYOUTS,
  type FirewallRule,
  type SystemService,
} from "@/lib/mock-data";

export function SystemView({ moduleId, childId }: ViewProps) {
  const { mod } = useModuleHeader(moduleId, childId);
  if (!mod) return null;
  if (!childId) return <SystemOverview moduleId={moduleId} />;
  switch (childId) {
    case "network":
      return <NetworkChild moduleId={moduleId} childId={childId} />;
    case "firewall":
      return <FirewallChild moduleId={moduleId} childId={childId} />;
    case "dhcp":
      return <DhcpChild moduleId={moduleId} childId={childId} />;
    case "services":
      return <ServicesChild moduleId={moduleId} childId={childId} />;
    case "pppoe":
      return <PppoeChild moduleId={moduleId} childId={childId} />;
    case "console":
      return <ConsoleChild moduleId={moduleId} childId={childId} />;
    case "manage-data":
      return <ManageDataChild moduleId={moduleId} childId={childId} />;
    case "client-services":
      return <ClientServicesChild moduleId={moduleId} childId={childId} />;
    case "acl":
      return <AclChild moduleId={moduleId} childId={childId} />;
    case "dynamic-dns":
      return <DynamicDnsChild moduleId={moduleId} childId={childId} />;
    case "captive-portal":
      return <CaptivePortalChild moduleId={moduleId} childId={childId} />;
    case "nas":
      return <NasChild moduleId={moduleId} childId={childId} />;
    case "status-tracker":
      return <StatusTrackerChild moduleId={moduleId} childId={childId} />;
    case "system-settings":
      return <SystemSettingsChild moduleId={moduleId} childId={childId} />;
    case "dashboard-conf":
      return <DashboardConfChild moduleId={moduleId} childId={childId} />;
    case "system-tools":
      return <SystemToolsChild moduleId={moduleId} childId={childId} />;
    default:
      return <SystemOverview moduleId={moduleId} />;
  }
}

/* ---------------- Overview ---------------- */

function SystemOverview({ moduleId }: { moduleId: string }) {
  const { mod } = useModuleHeader(moduleId);
  const setActive = useAppStore((s) => s.setActive);
  if (!mod) return null;
  const cards = [
    { label: "Network", desc: "Interfaces, gateways, DNS, routes", icon: Network, child: "network" },
    { label: "Firewall", desc: "Rules, DoS, free sites", icon: ShieldAlert, child: "firewall" },
    { label: "DHCP", desc: "Scopes & IP leasing reports", icon: Database, child: "dhcp" },
    { label: "Services", desc: "Control system services", icon: Server, child: "services" },
    { label: "PPPoE", desc: "PPPoE configuration", icon: Wifi, child: "pppoe" },
    { label: "Console", desc: "Reset console password", icon: Terminal, child: "console" },
    { label: "Manage Data", desc: "Backup, restore, purge", icon: HardDrive, child: "manage-data" },
    { label: "Client Services", desc: "Client GUI & web config", icon: Globe, child: "client-services" },
    { label: "ACL", desc: "Roles, modules, security", icon: Lock, child: "acl" },
    { label: "Dynamic DNS", desc: "DDNS services", icon: Globe, child: "dynamic-dns" },
    { label: "Captive Portal", desc: "Login templates, deny net", icon: LayoutGrid, child: "captive-portal" },
    { label: "NAS Management", desc: "RADIUS clients & attributes", icon: Server, child: "nas" },
    { label: "Status Tracker", desc: "Device logs & capture", icon: Activity, child: "status-tracker" },
    { label: "System Settings", desc: "Proactive reports, GUI", icon: SlidersHorizontal, child: "system-settings" },
    { label: "Dashboard Conf", desc: "Dashboard layouts", icon: LayoutGrid, child: "dashboard-conf" },
    { label: "System Tools", desc: "Diagnostics & utilities", icon: Wrench, child: "system-tools" },
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

/* ---------------- Network ---------------- */

function NetworkChild({ moduleId, childId }: ViewProps) {
  const { mod, child } = useModuleHeader(moduleId, childId);
  const { toast } = useToast();
  if (!mod) return null;
  const externalCount = INTERFACES.filter((i) => i.type === "External").length;
  const internalCount = INTERFACES.filter((i) => i.type === "Internal").length;
  return (
    <div className="space-y-6">
      <PageHeader
        title={child!.label}
        description="Interfaces, gateways, DNS, routes and priorities."
        icon={<mod.icon className="h-5 w-5" />}
        breadcrumb={[{ label: "Cryptsk" }, { label: mod.label }, { label: child!.label }]}
        actions={
          <Button onClick={() => toast({ title: "Add interface", description: "Interface creation form will open." })}>
            <Plus className="mr-2 h-4 w-4" /> Add Interface
          </Button>
        }
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard label="Interfaces" value={String(INTERFACES.length)} icon={<Network className="h-4 w-4" />} accent />
        <KpiCard label="Internal" value={String(internalCount)} icon={<Server className="h-4 w-4" />} />
        <KpiCard label="External" value={String(externalCount)} icon={<Globe className="h-4 w-4" />} />
        <KpiCard label="Default GW" value="103.205.148.25" icon={<Route className="h-4 w-4" />} />
      </div>
      <SectionCard title="Network Interfaces" description={`${INTERFACES.length} interfaces configured`}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>IP Address / Mask</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {INTERFACES.map((i) => (
                <TableRow key={i.name}>
                  <TableCell className="font-mono font-medium">{i.name}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        i.type === "External"
                          ? "border-primary/30 bg-primary/10 text-primary"
                          : "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                      }
                    >
                      {i.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{i.ip}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => toast({ title: "Edit interface", description: i.name })}>
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

/* ---------------- Firewall ---------------- */

function FirewallChild({ moduleId, childId }: ViewProps) {
  const { mod, child } = useModuleHeader(moduleId, childId);
  const { toast } = useToast();
  const [rules, setRules] = React.useState<FirewallRule[]>(FIREWALL_RULES);
  if (!mod) return null;
  const toggle = (id: string) => {
    setRules((prev) => prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)));
    const r = rules.find((x) => x.id === id);
    toast({
      title: `${r?.enabled ? "Disabled" : "Enabled"} rule`,
      description: r?.name,
    });
  };
  const actionBadge = (action: FirewallRule["action"]) => {
    if (action === "Allow")
      return <Badge className="bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400">Allow</Badge>;
    if (action === "Deny")
      return <Badge className="bg-primary/10 text-primary hover:bg-primary/10">Deny</Badge>;
    return <Badge className="bg-amber-500/10 text-amber-700 hover:bg-amber-500/10 dark:text-amber-400">Drop</Badge>;
  };
  return (
    <div className="space-y-6">
      <PageHeader
        title={child!.label}
        description="Create, manage and reorder firewall rules. DoS protection & free sites also configured here."
        icon={<mod.icon className="h-5 w-5" />}
        breadcrumb={[{ label: "Cryptsk" }, { label: mod.label }, { label: child!.label }]}
        actions={
          <Button onClick={() => toast({ title: "Create rule", description: "Firewall rule builder will open." })}>
            <Plus className="mr-2 h-4 w-4" /> Create Rule
          </Button>
        }
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard label="Total Rules" value={String(rules.length)} icon={<ShieldAlert className="h-4 w-4" />} accent />
        <KpiCard label="Enabled" value={String(rules.filter((r) => r.enabled).length)} icon={<Power className="h-4 w-4" />} />
        <KpiCard label="Allow" value={String(rules.filter((r) => r.action === "Allow").length)} icon={<ArrowRight className="h-4 w-4" />} />
        <KpiCard label="Deny/Drop" value={String(rules.filter((r) => r.action !== "Allow").length)} icon={<AlertTriangle className="h-4 w-4" />} />
      </div>
      <SectionCard title="Firewall Rules" description="Rules are evaluated top-to-bottom. Drag the position column to reorder.">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Position</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Enabled</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rules.map((r) => (
                <TableRow key={r.id} data-state={!r.enabled ? "selected" : undefined}>
                  <TableCell>
                    <div className="flex items-center gap-1 font-mono text-xs text-muted-foreground">
                      <GripIcon /> {String(r.position).padStart(2, "0")}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{r.name}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{r.src}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{r.dst}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{r.service}</TableCell>
                  <TableCell>{actionBadge(r.action)}</TableCell>
                  <TableCell>
                    <Checkbox checked={r.enabled} onCheckedChange={() => toggle(r.id)} aria-label={`Toggle ${r.name}`} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => toast({ title: "Edit rule", description: r.name })}>
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

function GripIcon() {
  return (
    <svg width="10" height="14" viewBox="0 0 10 14" fill="currentColor" className="text-muted-foreground/60">
      <circle cx="2" cy="2" r="1.2" />
      <circle cx="8" cy="2" r="1.2" />
      <circle cx="2" cy="7" r="1.2" />
      <circle cx="8" cy="7" r="1.2" />
      <circle cx="2" cy="12" r="1.2" />
      <circle cx="8" cy="12" r="1.2" />
    </svg>
  );
}

/* ---------------- DHCP ---------------- */

function DhcpChild({ moduleId, childId }: ViewProps) {
  const { mod, child } = useModuleHeader(moduleId, childId);
  const { toast } = useToast();
  if (!mod) return null;
  const active = DHCP_LEASES.filter((l) => l.status === "Active").length;
  const expired = DHCP_LEASES.filter((l) => l.status === "Expired").length;
  return (
    <div className="space-y-6">
      <PageHeader
        title={child!.label}
        description="Manage DHCP scopes and view IP leasing reports."
        icon={<mod.icon className="h-5 w-5" />}
        breadcrumb={[{ label: "Cryptsk" }, { label: mod.label }, { label: child!.label }]}
        actions={
          <Button onClick={() => toast({ title: "Manage DHCP", description: "DHCP scope editor will open." })}>
            <Plus className="mr-2 h-4 w-4" /> Add Scope
          </Button>
        }
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard label="Total Leases" value={String(DHCP_LEASES.length)} icon={<Database className="h-4 w-4" />} accent />
        <KpiCard label="Active" value={String(active)} icon={<Power className="h-4 w-4" />} />
        <KpiCard label="Expired" value={String(expired)} icon={<Clock className="h-4 w-4" />} />
        <KpiCard label="Scopes" value="6" icon={<Server className="h-4 w-4" />} />
      </div>
      <Tabs defaultValue="manage">
        <TabsList>
          <TabsTrigger value="manage">Manage DHCP</TabsTrigger>
          <TabsTrigger value="report">IP Leasing Report</TabsTrigger>
        </TabsList>
        <TabsContent value="manage">
          <SectionCard title="DHCP Leases" description="Active and historic leases per pool">
            <DhcpLeaseTable />
          </SectionCard>
        </TabsContent>
        <TabsContent value="report">
          <SectionCard title="IP Leasing Report" description="Lease utilization summary">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pool</TableHead>
                    <TableHead>Active Leases</TableHead>
                    <TableHead>Expired</TableHead>
                    <TableHead>Utilization</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {["Pool-Bhiwani0", "Pool-Bhiwani1", "Pool-Bhiwani3", "Pool-Bhiwani4"].map((p, idx) => {
                    const leases = DHCP_LEASES.filter((l) => l.pool === p);
                    const act = leases.filter((l) => l.status === "Active").length;
                    const exp = leases.filter((l) => l.status === "Expired").length;
                    const total = [198, 211, 167, 88][idx] || 100;
                    return (
                      <TableRow key={p}>
                        <TableCell className="font-medium">{p}</TableCell>
                        <TableCell>{act}</TableCell>
                        <TableCell>{exp}</TableCell>
                        <TableCell>
                          <span className="font-mono text-xs text-muted-foreground">{total} allocated</span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function DhcpLeaseTable() {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>IP Address</TableHead>
            <TableHead>MAC Address</TableHead>
            <TableHead>Hostname</TableHead>
            <TableHead>Pool</TableHead>
            <TableHead>Lease Start</TableHead>
            <TableHead>Lease End</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {DHCP_LEASES.map((l) => (
            <TableRow key={l.ip + l.mac}>
              <TableCell className="font-mono text-xs">{l.ip}</TableCell>
              <TableCell className="font-mono text-xs text-muted-foreground">{l.mac}</TableCell>
              <TableCell className="font-medium">{l.host}</TableCell>
              <TableCell className="text-muted-foreground">{l.pool}</TableCell>
              <TableCell className="text-xs text-muted-foreground">{l.leaseStart}</TableCell>
              <TableCell className="text-xs text-muted-foreground">{l.leaseEnd}</TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={
                    l.status === "Active"
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                      : l.status === "Expired"
                      ? "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400"
                      : "border-border bg-muted text-muted-foreground"
                  }
                >
                  {l.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

/* ---------------- Services ---------------- */

function ServicesChild({ moduleId, childId }: ViewProps) {
  const { mod, child } = useModuleHeader(moduleId, childId);
  const { toast } = useToast();
  const [services, setServices] = React.useState<SystemService[]>(SYSTEM_SERVICES);
  if (!mod) return null;
  const toggleService = (id: string) => {
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, running: !s.running } : s)));
    const s = services.find((x) => x.id === id);
    toast({
      title: `${s?.running ? "Stopped" : "Started"} service`,
      description: s?.name,
      variant: s?.running ? "destructive" : "default",
    });
  };
  const act = (id: string, action: "start" | "stop" | "restart") => {
    const s = services.find((x) => x.id === id);
    toast({
      title: `${action.charAt(0).toUpperCase() + action.slice(1)} ${s?.name}`,
      description: `Service ${action} requested.`,
    });
    if (action === "stop") setServices((prev) => prev.map((x) => (x.id === id ? { ...x, running: false } : x)));
    if (action === "start" || action === "restart")
      setServices((prev) => prev.map((x) => (x.id === id ? { ...x, running: true } : x)));
  };
  return (
    <div className="space-y-6">
      <PageHeader
        title={child!.label}
        description="Start, stop or restart core system services."
        icon={<mod.icon className="h-5 w-5" />}
        breadcrumb={[{ label: "Cryptsk" }, { label: mod.label }, { label: child!.label }]}
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard label="Services" value={String(services.length)} icon={<Server className="h-4 w-4" />} accent />
        <KpiCard label="Running" value={String(services.filter((s) => s.running).length)} icon={<Power className="h-4 w-4" />} />
        <KpiCard label="Stopped" value={String(services.filter((s) => !s.running).length)} icon={<Square className="h-4 w-4" />} />
        <KpiCard label="Auto-start" value={String(services.filter((s) => s.autoStart).length)} icon={<RefreshCw className="h-4 w-4" />} />
      </div>
      <SectionCard title="System Services" description="Toggle a service on/off, or use the action buttons to start, stop or restart.">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {services.map((s) => (
            <div key={s.id} className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground">{s.name}</p>
                    <Badge
                      variant="outline"
                      className={
                        s.running
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                          : "border-primary/30 bg-primary/10 text-primary"
                      }
                    >
                      {s.running ? "Running" : "Stopped"}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{s.description}</p>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span>Port: <span className="font-mono">{s.port}</span></span>
                    <span>Uptime: <span className="font-mono">{s.uptime}</span></span>
                  </div>
                </div>
                <Switch checked={s.running} onCheckedChange={() => toggleService(s.id)} aria-label={`Toggle ${s.name}`} />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => act(s.id, "start")} disabled={s.running}>
                  <Play className="mr-1 h-3.5 w-3.5" /> Start
                </Button>
                <Button size="sm" variant="outline" onClick={() => act(s.id, "stop")} disabled={!s.running}>
                  <Pause className="mr-1 h-3.5 w-3.5" /> Stop
                </Button>
                <Button size="sm" variant="outline" onClick={() => act(s.id, "restart")}>
                  <RefreshCw className="mr-1 h-3.5 w-3.5" /> Restart
                </Button>
                <span className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
                  Auto-start
                  <Checkbox
                    checked={s.autoStart}
                    onCheckedChange={() =>
                      setServices((prev) => prev.map((x) => (x.id === s.id ? { ...x, autoStart: !x.autoStart } : x)))
                    }
                  />
                </span>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

/* ---------------- PPPoE ---------------- */

function PppoeChild({ moduleId, childId }: ViewProps) {
  const { mod, child } = useModuleHeader(moduleId, childId);
  const { toast } = useToast();
  const [authMode, setAuthMode] = React.useState("pap-chap");
  const [pool, setPool] = React.useState("Pool-Bhiwani0");
  const [encryption, setEncryption] = React.useState({ mppe: true, pap: true, chap: false });
  const [timeout, setTimeoutVal] = React.useState("86400");
  if (!mod) return null;
  return (
    <div className="space-y-6">
      <PageHeader
        title={child!.label}
        description="Configure PPPoE authentication, IP pools, encryption and session timeout."
        icon={<mod.icon className="h-5 w-5" />}
        breadcrumb={[{ label: "Cryptsk" }, { label: mod.label }, { label: child!.label }]}
        actions={
          <Button onClick={() => toast({ title: "PPPoE config saved", description: "PPPoE service will reload." })}>
            <Save className="mr-2 h-4 w-4" /> Save Config
          </Button>
        }
      />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SectionCard title="Authentication & IP Pool">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Authentication Mode</Label>
              <Select value={authMode} onValueChange={setAuthMode}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pap-chap">PAP + CHAP</SelectItem>
                  <SelectItem value="pap">PAP only</SelectItem>
                  <SelectItem value="chap">CHAP only</SelectItem>
                  <SelectItem value="mschap">MS-CHAP v2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>IP Pool</Label>
              <Select value={pool} onValueChange={setPool}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pool-Bhiwani0">Pool-Bhiwani0 (10.172.0.0/24)</SelectItem>
                  <SelectItem value="Pool-Bhiwani1">Pool-Bhiwani1 (10.172.1.0/24)</SelectItem>
                  <SelectItem value="Pool-Bhiwani3">Pool-Bhiwani3 (10.172.3.0/24)</SelectItem>
                  <SelectItem value="Pool-Bhiwani4">Pool-Bhiwani4 (10.172.4.0/24)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Session Timeout (seconds)</Label>
              <Input value={timeout} onChange={(e) => setTimeoutVal(e.target.value)} />
              <p className="text-xs text-muted-foreground">86400 = 24 hours. 0 = no timeout.</p>
            </div>
          </div>
        </SectionCard>
        <SectionCard title="Encryption Options">
          <div className="space-y-3">
            {[
              { key: "mppe", label: "MPPE Encryption (128-bit)", desc: "Microsoft Point-to-Point Encryption" },
              { key: "pap", label: "PAP", desc: "Password Authentication Protocol (plaintext)" },
              { key: "chap", label: "CHAP", desc: "Challenge-Handshake Authentication Protocol" },
            ].map((opt) => (
              <label
                key={opt.key}
                htmlFor={`pppoe-${opt.key}`}
                className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/40"
              >
                <Checkbox
                  id={`pppoe-${opt.key}`}
                  checked={encryption[opt.key as keyof typeof encryption]}
                  onCheckedChange={(v) =>
                    setEncryption((prev) => ({ ...prev, [opt.key]: v === true }))
                  }
                />
                <div>
                  <p className="text-sm font-medium text-foreground">{opt.label}</p>
                  <p className="text-xs text-muted-foreground">{opt.desc}</p>
                </div>
              </label>
            ))}
            <div className="rounded-lg bg-muted/40 p-3 text-xs text-muted-foreground">
              <Info className="mr-1 inline h-3.5 w-3.5" /> Changes require a PPPoE service restart to take effect.
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

/* ---------------- Console ---------------- */

function ConsoleChild({ moduleId, childId }: ViewProps) {
  const { mod, child } = useModuleHeader(moduleId, childId);
  const { toast } = useToast();
  const [show, setShow] = React.useState({ cur: false, new: false, confirm: false });
  const [form, setForm] = React.useState({ cur: "", new: "", confirm: "" });
  if (!mod) return null;
  const submit = () => {
    if (!form.cur || !form.new) {
      toast({ title: "Missing fields", description: "All password fields are required.", variant: "destructive" });
      return;
    }
    if (form.new !== form.confirm) {
      toast({ title: "Passwords do not match", description: "New password and confirmation must be identical.", variant: "destructive" });
      return;
    }
    toast({ title: "Console password updated", description: "Use the new password on next console login." });
    setForm({ cur: "", new: "", confirm: "" });
  };
  const fields: { key: "cur" | "new" | "confirm"; label: string }[] = [
    { key: "cur", label: "Current Password" },
    { key: "new", label: "New Password" },
    { key: "confirm", label: "Confirm New Password" },
  ];
  return (
    <div className="space-y-6">
      <PageHeader
        title={child!.label}
        description="Reset the console (admin shell) password used for SSH/serial access."
        icon={<mod.icon className="h-5 w-5" />}
        breadcrumb={[{ label: "Cryptsk" }, { label: mod.label }, { label: child!.label }]}
      />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SectionCard title="Reset Console Password">
          <div className="space-y-4">
            {fields.map((f) => (
              <div key={f.key} className="space-y-1.5">
                <Label htmlFor={`pw-${f.key}`}>{f.label}</Label>
                <div className="relative">
                  <Input
                    id={`pw-${f.key}`}
                    type={show[f.key] ? "text" : "password"}
                    value={form[f.key]}
                    onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
                    className="pr-9"
                  />
                  <button
                    type="button"
                    onClick={() => setShow((prev) => ({ ...prev, [f.key]: !prev[f.key] }))}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={show[f.key] ? "Hide password" : "Show password"}
                  >
                    {show[f.key] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            ))}
            <div className="flex gap-2">
              <Button onClick={submit}>
                <KeyRound className="mr-2 h-4 w-4" /> Update Password
              </Button>
              <Button variant="outline" onClick={() => setForm({ cur: "", new: "", confirm: "" })}>
                Reset
              </Button>
            </div>
          </div>
        </SectionCard>
        <SectionCard title="Security Notes">
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><Lock className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> Use a minimum of 12 characters with mixed case, digits and symbols.</li>
            <li className="flex items-start gap-2"><Lock className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> Console password is separate from the GUI administrator password.</li>
            <li className="flex items-start gap-2"><Lock className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> SSH access is rate-limited after 5 failed attempts.</li>
            <li className="flex items-start gap-2"><Lock className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> Password change is logged to the audit trail.</li>
          </ul>
        </SectionCard>
      </div>
    </div>
  );
}

/* ---------------- Manage Data ---------------- */

function ManageDataChild({ moduleId, childId }: ViewProps) {
  const { mod, child } = useModuleHeader(moduleId, childId);
  const { toast } = useToast();
  if (!mod) return null;
  return (
    <div className="space-y-6">
      <PageHeader
        title={child!.label}
        description="Backup, restore, purge and review RADIUS authentication logs."
        icon={<mod.icon className="h-5 w-5" />}
        breadcrumb={[{ label: "Cryptsk" }, { label: mod.label }, { label: child!.label }]}
      />
      <Tabs defaultValue="backup">
        <TabsList className="flex-wrap">
          <TabsTrigger value="backup">Backup</TabsTrigger>
          <TabsTrigger value="restore">Restore</TabsTrigger>
          <TabsTrigger value="purge">Purge</TabsTrigger>
          <TabsTrigger value="radius-log">RADIUS Auth Log</TabsTrigger>
        </TabsList>
        <TabsContent value="backup">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <SectionCard title="Backup Now">
              <p className="mb-3 text-sm text-muted-foreground">Generate a full snapshot of system configuration, user DB and policies.</p>
              <Button onClick={() => toast({ title: "Backup started", description: "Snapshot will be available in /var/backups within 2 minutes." })}>
                <Download className="mr-2 h-4 w-4" /> Download Backup
              </Button>
            </SectionCard>
            <SectionCard title="Backup Schedule">
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label>Frequency</Label>
                  <Select defaultValue="daily">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily (02:00 AM)</SelectItem>
                      <SelectItem value="weekly">Weekly (Sun 02:00 AM)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Retention</Label>
                  <Select defaultValue="14">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7 days</SelectItem>
                      <SelectItem value="14">14 days</SelectItem>
                      <SelectItem value="30">30 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button variant="outline" onClick={() => toast({ title: "Schedule saved" })}>
                  <Save className="mr-2 h-4 w-4" /> Save Schedule
                </Button>
              </div>
            </SectionCard>
          </div>
        </TabsContent>
        <TabsContent value="restore">
          <SectionCard title="Restore from Backup">
            <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-muted/20 px-6 py-10 text-center">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <p className="font-medium text-foreground">Drop a backup archive here</p>
              <p className="text-xs text-muted-foreground">Accepts .tar.gz snapshots generated by this system</p>
              <Button onClick={() => toast({ title: "Upload dialog", description: "File picker will open." })}>
                <Upload className="mr-2 h-4 w-4" /> Choose File
              </Button>
            </div>
            <div className="mt-3 rounded-lg bg-amber-500/10 p-3 text-xs text-amber-700 dark:text-amber-400">
              <AlertTriangle className="mr-1 inline h-3.5 w-3.5" /> Restore will overwrite the current database. Take a fresh backup first.
            </div>
          </SectionCard>
        </TabsContent>
        <TabsContent value="purge">
          <SectionCard title="Purge Data" description="Remove historical records older than the selected date range.">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label>From</Label>
                <Input type="date" />
              </div>
              <div className="space-y-1.5">
                <Label>To</Label>
                <Input type="date" />
              </div>
              <div className="flex items-end">
                <Button variant="destructive" onClick={() => toast({ title: "Purge requested", description: "Selected tables will be purged.", variant: "destructive" })}>
                  <Trash2 className="mr-2 h-4 w-4" /> Purge Now
                </Button>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {["Live User Logs", "RADIUS Accounting", "Web Surfing Logs", "SMS Logs", "Net Kapture Packets"].map((t) => (
                <label key={t} className="flex items-center gap-2 rounded border border-border p-2 text-sm">
                  <Checkbox id={`purge-${t}`} />
                  <span>{t}</span>
                </label>
              ))}
            </div>
          </SectionCard>
        </TabsContent>
        <TabsContent value="radius-log">
          <SectionCard title="RADIUS Auth Log" description="Latest 200 authentication events">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>NAS</TableHead>
                    <TableHead>Result</TableHead>
                    <TableHead>Reason</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { ts: "04 Oct 09:14:22", user: "shubham270597", nas: "sms-core-01", result: "OK", reason: "—" },
                    { ts: "04 Oct 09:14:18", user: "aakash080198", nas: "sms-core-01", result: "OK", reason: "—" },
                    { ts: "04 Oct 09:13:55", user: "unknown_user", nas: "sms-core-02", result: "Reject", reason: "Invalid credentials" },
                    { ts: "04 Oct 09:13:11", user: "rajesh130773", nas: "sms-core-02", result: "OK", reason: "—" },
                    { ts: "04 Oct 09:12:30", user: "suresh030381", nas: "sms-core-01", result: "Reject", reason: "Account suspended" },
                  ].map((r, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-mono text-xs text-muted-foreground">{r.ts}</TableCell>
                      <TableCell className="font-medium">{r.user}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{r.nas}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={r.result === "OK"
                            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                            : "border-primary/30 bg-primary/10 text-primary"}
                        >
                          {r.result}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{r.reason}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ---------------- Client Services ---------------- */

function ClientServicesChild({ moduleId, childId }: ViewProps) {
  const { mod, child } = useModuleHeader(moduleId, childId);
  const { toast } = useToast();
  if (!mod) return null;
  const urls = [
    { id: "URL01", label: "User Login", url: "https://noc.cryptsk.in/userlogin", active: true },
    { id: "URL02", label: "Self Care", url: "https://noc.cryptsk.in/selfcare", active: true },
    { id: "URL03", label: "Renewal", url: "https://noc.cryptsk.in/renew", active: true },
    { id: "URL04", label: "Forgot Password", url: "https://noc.cryptsk.in/forgot", active: true },
  ];
  return (
    <div className="space-y-6">
      <PageHeader
        title={child!.label}
        description="Manage client GUI URLs, web service config and forgot-password workflow."
        icon={<mod.icon className="h-5 w-5" />}
        breadcrumb={[{ label: "Cryptsk" }, { label: mod.label }, { label: child!.label }]}
      />
      <SectionCard
        title="Client GUI URLs"
        description="External URLs exposed to subscribers"
        actions={
          <Button size="sm" onClick={() => toast({ title: "Add URL", description: "URL form will open." })}>
            <Plus className="mr-2 h-3.5 w-3.5" /> Add URL
          </Button>
        }
      >
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Label</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {urls.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-mono text-xs">{u.id}</TableCell>
                  <TableCell className="font-medium">{u.label}</TableCell>
                  <TableCell className="font-mono text-xs text-primary">{u.url}</TableCell>
                  <TableCell>
                    <Badge className="bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400">Active</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => toast({ title: "Edit URL", description: u.label })}>
                      <Pencil className="mr-1 h-3.5 w-3.5" /> Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SectionCard title="Web Service Config">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Listen Port</Label>
              <Input defaultValue="443" />
            </div>
            <div className="space-y-1.5">
              <Label>SSL Certificate</Label>
              <Select defaultValue="wildcard">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="wildcard">*.cryptsk.in (Lets Encrypt)</SelectItem>
                  <SelectItem value="self">Self-signed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Max Concurrent Sessions</Label>
              <Input defaultValue="1024" />
            </div>
            <Button onClick={() => toast({ title: "Web service config saved" })}>
              <Save className="mr-2 h-4 w-4" /> Save
            </Button>
          </div>
        </SectionCard>
        <SectionCard title="Forgot Password Config">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Delivery Channel</Label>
              <Select defaultValue="sms-email">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="sms">SMS only</SelectItem>
                  <SelectItem value="email">Email only</SelectItem>
                  <SelectItem value="sms-email">SMS + Email</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>OTP Validity (minutes)</Label>
              <Input defaultValue="5" />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox defaultChecked />
              Require secondary verification (mobile number)
            </label>
            <Button onClick={() => toast({ title: "Forgot-password config saved" })}>
              <Save className="mr-2 h-4 w-4" /> Save
            </Button>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

/* ---------------- ACL ---------------- */

function AclChild({ moduleId, childId }: ViewProps) {
  const { mod, child } = useModuleHeader(moduleId, childId);
  const { toast } = useToast();
  if (!mod) return null;
  return (
    <div className="space-y-6">
      <PageHeader
        title={child!.label}
        description="Manage roles, modules, security policies and console ACL."
        icon={<mod.icon className="h-5 w-5" />}
        breadcrumb={[{ label: "Cryptsk" }, { label: mod.label }, { label: child!.label }]}
      />
      <Tabs defaultValue="module">
        <TabsList className="flex-wrap">
          <TabsTrigger value="module">Module Detail</TabsTrigger>
          <TabsTrigger value="role">Role Management</TabsTrigger>
          <TabsTrigger value="security">Security Management</TabsTrigger>
          <TabsTrigger value="console-acl">Console ACL</TabsTrigger>
        </TabsList>
        <TabsContent value="module">
          <SectionCard title="Module Detail" description="Module-level access matrix">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Module</TableHead>
                    <TableHead>View</TableHead>
                    <TableHead>Create</TableHead>
                    <TableHead>Edit</TableHead>
                    <TableHead>Delete</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {["System", "Policy", "Package", "User", "Reports", "Inventory"].map((m) => (
                    <TableRow key={m}>
                      <TableCell className="font-medium">{m}</TableCell>
                      <TableCell><Checkbox defaultChecked /></TableCell>
                      <TableCell><Checkbox defaultChecked /></TableCell>
                      <TableCell><Checkbox /></TableCell>
                      <TableCell><Checkbox /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <Button className="mt-3" onClick={() => toast({ title: "Module permissions saved" })}>
              <Save className="mr-2 h-4 w-4" /> Save Permissions
            </Button>
          </SectionCard>
        </TabsContent>
        <TabsContent value="role">
          <SectionCard
            title="Roles"
            description={`${ACL_ROLES.length} roles configured`}
            actions={
              <Button size="sm" onClick={() => toast({ title: "Create role" })}>
                <Plus className="mr-2 h-3.5 w-3.5" /> New Role
              </Button>
            }
          >
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Users</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ACL_ROLES.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-mono text-xs">{r.id}</TableCell>
                      <TableCell className="font-medium">{r.name}</TableCell>
                      <TableCell className="text-muted-foreground">{r.description}</TableCell>
                      <TableCell>{r.users}</TableCell>
                      <TableCell>{r.permissions}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={r.status === "Active"
                            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                            : "border-border bg-muted text-muted-foreground"}
                        >
                          {r.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => toast({ title: "Edit role", description: r.name })}>
                          <UserCog className="mr-1 h-3.5 w-3.5" /> Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </SectionCard>
        </TabsContent>
        <TabsContent value="security">
          <SectionCard title="Security Management">
            <div className="space-y-3">
              {[
                { label: "Enforce password rotation (90 days)", checked: true },
                { label: "Two-factor authentication for admin", checked: true },
                { label: "IP allowlist for console access", checked: false },
                { label: "Session timeout after 30 minutes idle", checked: true },
                { label: "Lock account after 5 failed logins", checked: true },
              ].map((opt) => (
                <label key={opt.label} className="flex items-center justify-between rounded border border-border p-3 text-sm">
                  <span>{opt.label}</span>
                  <Switch defaultChecked={opt.checked} />
                </label>
              ))}
              <Button onClick={() => toast({ title: "Security policy saved" })}>
                <Save className="mr-2 h-4 w-4" /> Save
              </Button>
            </div>
          </SectionCard>
        </TabsContent>
        <TabsContent value="console-acl">
          <SectionCard title="Console ACL" description="Restrict which IPs/networks can reach the admin console">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Network</TableHead>
                    <TableHead>Mask</TableHead>
                    <TableHead>Access</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { net: "172.16.16.0", mask: "255.255.255.0", access: "Allow" },
                    { net: "10.10.0.0", mask: "255.255.0.0", access: "Allow" },
                    { net: "0.0.0.0", mask: "0.0.0.0", access: "Deny" },
                  ].map((r) => (
                    <TableRow key={r.net + r.mask}>
                      <TableCell className="font-mono text-xs">{r.net}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">{r.mask}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={r.access === "Allow"
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                          : "border-primary/30 bg-primary/10 text-primary"}
                        >
                          {r.access}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => toast({ title: "Edit ACL entry" })}>Edit</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <Button className="mt-3" size="sm" onClick={() => toast({ title: "Add ACL entry" })}>
              <Plus className="mr-2 h-3.5 w-3.5" /> Add Entry
            </Button>
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ---------------- Dynamic DNS ---------------- */

function DynamicDnsChild({ moduleId, childId }: ViewProps) {
  const { mod, child } = useModuleHeader(moduleId, childId);
  const { toast } = useToast();
  if (!mod) return null;
  return (
    <div className="space-y-6">
      <PageHeader
        title={child!.label}
        description="Add and manage dynamic DNS services for public-facing hostnames."
        icon={<mod.icon className="h-5 w-5" />}
        breadcrumb={[{ label: "Cryptsk" }, { label: mod.label }, { label: child!.label }]}
        actions={
          <Button onClick={() => toast({ title: "Add DDNS", description: "DDNS service form will open." })}>
            <Plus className="mr-2 h-4 w-4" /> Add Service
          </Button>
        }
      />
      <SectionCard title="Dynamic DNS Services" description={`${DYNAMIC_DNS.length} services`}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Hostname</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Current IP</TableHead>
                <TableHead>Last Update</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {DYNAMIC_DNS.map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="font-mono text-xs">{d.id}</TableCell>
                  <TableCell className="font-medium">{d.host}</TableCell>
                  <TableCell className="text-muted-foreground">{d.provider}</TableCell>
                  <TableCell className="font-mono text-xs">{d.currentIp}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{d.lastUpdate}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={d.status === "Active"
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                      : "border-border bg-muted text-muted-foreground"}
                    >
                      {d.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => toast({ title: "Manage DDNS", description: d.host })}>
                      <Pencil className="mr-1 h-3.5 w-3.5" /> Manage
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

/* ---------------- Captive Portal ---------------- */

function CaptivePortalChild({ moduleId, childId }: ViewProps) {
  const { mod, child } = useModuleHeader(moduleId, childId);
  const { toast } = useToast();
  if (!mod) return null;
  return (
    <div className="space-y-6">
      <PageHeader
        title={child!.label}
        description="Client login templates, deny network and leased-line templates."
        icon={<mod.icon className="h-5 w-5" />}
        breadcrumb={[{ label: "Cryptsk" }, { label: mod.label }, { label: child!.label }]}
        actions={
          <Button onClick={() => toast({ title: "Create template" })}>
            <Plus className="mr-2 h-4 w-4" /> Create Template
          </Button>
        }
      />
      <SectionCard title="Client Login Templates" description={`${CAPTIVE_TEMPLATES.length} templates`}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Zone</TableHead>
                <TableHead>Last Edited</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {CAPTIVE_TEMPLATES.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-mono text-xs">{t.id}</TableCell>
                  <TableCell className="font-medium">{t.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={t.type === "Leased Line"
                      ? "border-primary/30 bg-primary/10 text-primary"
                      : "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"}
                    >
                      {t.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{t.zone}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{t.lastEdited}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={t.status === "Active"
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                      : "border-border bg-muted text-muted-foreground"}
                    >
                      {t.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => toast({ title: "Edit template", description: t.name })}>
                      <Pencil className="mr-1 h-3.5 w-3.5" /> Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>
      <SectionCard
        title="Deny Network"
        description="Networks blocked from reaching the captive portal"
        actions={
          <Button size="sm" variant="outline" onClick={() => toast({ title: "Add deny network" })}>
            <Plus className="mr-2 h-3.5 w-3.5" /> Add
          </Button>
        }
      >
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Network</TableHead>
                <TableHead>Mask</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Added By</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {DENY_NETWORK.map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="font-mono text-xs">{d.id}</TableCell>
                  <TableCell className="font-mono text-xs">{d.network}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{d.mask}</TableCell>
                  <TableCell className="text-muted-foreground">{d.reason}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{d.addedBy}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => toast({ title: "Remove entry", description: d.network, variant: "destructive" })}>
                      <Trash2 className="mr-1 h-3.5 w-3.5" /> Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>
      <SectionCard title="Leased Line User Template">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Template Name</Label>
            <Input defaultValue="LL-Default" />
          </div>
          <div className="space-y-1.5">
            <Label>Bandwidth (Mbps)</Label>
            <Input defaultValue="100" />
          </div>
          <div className="space-y-1.5">
            <Label>Static IP / Pool</Label>
            <Select defaultValue="static">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="static">Static (assigned per user)</SelectItem>
                <SelectItem value="pool">From public IP pool</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Authentication</Label>
            <Select defaultValue="pppoe">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="pppoe">PPPoE</SelectItem>
                <SelectItem value="ip">IP-based (no auth)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button className="mt-4" onClick={() => toast({ title: "Leased line template saved" })}>
          <Save className="mr-2 h-4 w-4" /> Save Template
        </Button>
      </SectionCard>
    </div>
  );
}

/* ---------------- NAS Management ---------------- */

function NasChild({ moduleId, childId }: ViewProps) {
  const { mod, child } = useModuleHeader(moduleId, childId);
  const { toast } = useToast();
  if (!mod) return null;
  return (
    <div className="space-y-6">
      <PageHeader
        title={child!.label}
        description="RADIUS client config, attribute mapping, NAS connectivity and 24online NAS reader."
        icon={<mod.icon className="h-5 w-5" />}
        breadcrumb={[{ label: "Cryptsk" }, { label: mod.label }, { label: child!.label }]}
        actions={
          <Button onClick={() => toast({ title: "Create NAS config" })}>
            <Plus className="mr-2 h-4 w-4" /> Create NAS Config
          </Button>
        }
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard label="NAS Devices" value={String(NAS_DEVICES.length)} icon={<Server className="h-4 w-4" />} accent />
        <KpiCard label="Online" value={String(NAS_DEVICES.filter((n) => n.status === "Online").length)} icon={<Power className="h-4 w-4" />} />
        <KpiCard label="Offline" value={String(NAS_DEVICES.filter((n) => n.status === "Offline").length)} icon={<AlertTriangle className="h-4 w-4" />} />
        <KpiCard label="Sessions" value={String(NAS_DEVICES.reduce((a, n) => a + n.sessions, 0))} icon={<Activity className="h-4 w-4" />} />
      </div>
      <SectionCard title="NAS Devices" description={`${NAS_DEVICES.length} devices`}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Secret</TableHead>
                <TableHead>Sessions</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {NAS_DEVICES.map((n) => (
                <TableRow key={n.id}>
                  <TableCell className="font-mono text-xs">{n.id}</TableCell>
                  <TableCell className="font-medium">{n.name}</TableCell>
                  <TableCell className="font-mono text-xs">{n.ip}</TableCell>
                  <TableCell className="text-muted-foreground">{n.type}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{n.secret}</TableCell>
                  <TableCell>{n.sessions}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={n.status === "Online"
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                      : "border-primary/30 bg-primary/10 text-primary"}
                    >
                      {n.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => toast({ title: "Edit NAS", description: n.name })}>
                      <Pencil className="mr-1 h-3.5 w-3.5" /> Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SectionCard title="RADIUS Client Config">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Client Name</Label>
              <Input defaultValue="sms-core-01" />
            </div>
            <div className="space-y-1.5">
              <Label>IP Address</Label>
              <Input defaultValue="172.16.16.16" />
            </div>
            <div className="space-y-1.5">
              <Label>Shared Secret</Label>
              <Input type="password" defaultValue="radiussecret" />
            </div>
            <div className="space-y-1.5">
              <Label>Auth Type</Label>
              <Select defaultValue="pap">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pap">PAP</SelectItem>
                  <SelectItem value="chap">CHAP</SelectItem>
                  <SelectItem value="mschap">MS-CHAP v2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => toast({ title: "RADIUS client saved" })}>
              <Save className="mr-2 h-4 w-4" /> Save Client
            </Button>
          </div>
        </SectionCard>
        <SectionCard title="Attribute Mapping">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>RADIUS Attribute</TableHead>
                  <TableHead>Mapped To</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { attr: "User-Name", map: "username" },
                  { attr: "User-Password", map: "password (PAP)" },
                  { attr: "Framed-IP-Address", map: "assigned_ip" },
                  { attr: "Session-Timeout", map: "session_timeout" },
                  { attr: "Acct-Status-Type", map: "accounting_event" },
                  { attr: "NAS-IP-Address", map: "nas.device.ip" },
                ].map((r) => (
                  <TableRow key={r.attr}>
                    <TableCell className="font-mono text-xs">{r.attr}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{r.map}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Button className="mt-3" size="sm" variant="outline" onClick={() => toast({ title: "Add attribute mapping" })}>
            <Plus className="mr-2 h-3.5 w-3.5" /> Add Mapping
          </Button>
        </SectionCard>
      </div>
    </div>
  );
}

/* ---------------- Status Tracker ---------------- */

function StatusTrackerChild({ moduleId, childId }: ViewProps) {
  const { mod, child } = useModuleHeader(moduleId, childId);
  const { toast } = useToast();
  if (!mod) return null;
  const levelBadge = (lvl: "INFO" | "WARN" | "ERROR") => {
    if (lvl === "INFO") return <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">{lvl}</Badge>;
    if (lvl === "WARN") return <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400">{lvl}</Badge>;
    return <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">{lvl}</Badge>;
  };
  return (
    <div className="space-y-6">
      <PageHeader
        title={child!.label}
        description="Device logs, managed devices and packet capture configuration."
        icon={<mod.icon className="h-5 w-5" />}
        breadcrumb={[{ label: "Cryptsk" }, { label: mod.label }, { label: child!.label }]}
      />
      <SectionCard title="Device Logs" description={`${DEVICE_LOGS.length} recent entries`} actions={
        <Button size="sm" variant="outline" onClick={() => toast({ title: "Refresh logs" })}>
          <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Refresh
        </Button>
      }>
        <div className="max-h-96 overflow-y-auto scrollbar-thin">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Device</TableHead>
                <TableHead>Message</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {DEVICE_LOGS.map((l, i) => (
                <TableRow key={i}>
                  <TableCell className="whitespace-nowrap font-mono text-xs text-muted-foreground">{l.timestamp}</TableCell>
                  <TableCell>{levelBadge(l.level)}</TableCell>
                  <TableCell className="font-mono text-xs">{l.device}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{l.message}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>
      <SectionCard title="Managed Devices" description={`${MANAGED_DEVICES.length} devices under management`}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>IP</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Last Seen</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MANAGED_DEVICES.map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="font-mono text-xs">{d.id}</TableCell>
                  <TableCell className="font-medium">{d.name}</TableCell>
                  <TableCell className="font-mono text-xs">{d.ip}</TableCell>
                  <TableCell className="text-muted-foreground">{d.model}</TableCell>
                  <TableCell className="text-muted-foreground">{d.role}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{d.lastSeen}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={d.status === "Online"
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                      : "border-primary/30 bg-primary/10 text-primary"}
                    >
                      {d.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => toast({ title: "Edit device", description: d.name })}>
                      <Pencil className="mr-1 h-3.5 w-3.5" /> Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>
      <SectionCard title="Packet Capture Config">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Interface</Label>
            <Select defaultValue="eth0">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {INTERFACES.slice(0, 5).map((i) => (
                  <SelectItem key={i.name} value={i.name}>{i.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Duration (seconds)</Label>
            <Input defaultValue="60" />
          </div>
          <div className="space-y-1.5">
            <Label>Filter (tcpdump syntax)</Label>
            <Input defaultValue="port 1812 or port 1813" />
          </div>
          <div className="space-y-1.5">
            <Label>Packets to Capture</Label>
            <Input defaultValue="5000" />
          </div>
        </div>
        <Button className="mt-4" onClick={() => toast({ title: "Packet capture started", description: "Capture running for 60 seconds." })}>
          <Play className="mr-2 h-4 w-4" /> Start Capture
        </Button>
      </SectionCard>
    </div>
  );
}

/* ---------------- System Settings ---------------- */

function SystemSettingsChild({ moduleId, childId }: ViewProps) {
  const { mod, child } = useModuleHeader(moduleId, childId);
  const { toast } = useToast();
  const [theme, setTheme] = React.useState("light");
  const [density, setDensity] = React.useState("comfortable");
  if (!mod) return null;
  return (
    <div className="space-y-6">
      <PageHeader
        title={child!.label}
        description="Proactive reports configuration and GUI preferences."
        icon={<mod.icon className="h-5 w-5" />}
        breadcrumb={[{ label: "Cryptsk" }, { label: mod.label }, { label: child!.label }]}
      />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SectionCard title="Proactive Reports">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Report Frequency</Label>
              <Select defaultValue="daily">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Delivery Email</Label>
              <Input type="email" defaultValue="noc@cryptsk.in" />
            </div>
            <div className="space-y-1.5">
              <Label>FTP Server</Label>
              <Input defaultValue="ftp://reports.cryptsk.in" />
            </div>
            <div className="space-y-2">
              {[
                "Active user count",
                "Bandwidth usage summary",
                "Failed RADIUS attempts",
                "NAS health",
              ].map((r) => (
                <label key={r} className="flex items-center gap-2 text-sm">
                  <Checkbox defaultChecked />
                  <span>{r}</span>
                </label>
              ))}
            </div>
            <Button onClick={() => toast({ title: "Proactive reports saved" })}>
              <Save className="mr-2 h-4 w-4" /> Save
            </Button>
          </div>
        </SectionCard>
        <SectionCard title="GUI Preferences">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Theme</Label>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Density</Label>
              <Select value={density} onValueChange={setDensity}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="comfortable">Comfortable</SelectItem>
                  <SelectItem value="compact">Compact</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Date Format</Label>
              <Select defaultValue="dmy">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="dmy">DD-MM-YYYY</SelectItem>
                  <SelectItem value="mdy">MM-DD-YYYY</SelectItem>
                  <SelectItem value="ymd">YYYY-MM-DD</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {[
              "Show breadcrumbs",
              "Sticky table headers",
              "Auto-refresh tables every 30s",
            ].map((o) => (
              <label key={o} className="flex items-center justify-between rounded border border-border p-2 text-sm">
                <span>{o}</span>
                <Switch defaultChecked />
              </label>
            ))}
            <Button onClick={() => toast({ title: "GUI preferences saved" })}>
              <Save className="mr-2 h-4 w-4" /> Save
            </Button>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

/* ---------------- Dashboard Conf ---------------- */

function DashboardConfChild({ moduleId, childId }: ViewProps) {
  const { mod, child } = useModuleHeader(moduleId, childId);
  const { toast } = useToast();
  if (!mod) return null;
  return (
    <div className="space-y-6">
      <PageHeader
        title={child!.label}
        description="Configure dashboard layouts and widget placement."
        icon={<mod.icon className="h-5 w-5" />}
        breadcrumb={[{ label: "Cryptsk" }, { label: mod.label }, { label: child!.label }]}
        actions={
          <Button onClick={() => toast({ title: "Add dashboard" })}>
            <Plus className="mr-2 h-4 w-4" /> Add Dashboard
          </Button>
        }
      />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {DASHBOARD_LAYOUTS.map((d) => (
          <SectionCard key={d.id} title={d.name} description={`${d.widgets} widgets · ${d.columns}-column layout · last edited ${d.lastEdited}`}>
            <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${d.columns}, minmax(0, 1fr))` }}>
              {Array.from({ length: d.widgets }).map((_, i) => (
                <div key={i} className="flex h-20 items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 text-xs text-muted-foreground">
                  <Layers className="mr-1 h-3.5 w-3.5" /> Widget {i + 1}
                </div>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <Button size="sm" variant="outline" onClick={() => toast({ title: "Edit layout", description: d.name })}>
                <Pencil className="mr-1.5 h-3.5 w-3.5" /> Edit
              </Button>
              <Button size="sm" variant="ghost" onClick={() => toast({ title: "Preview", description: d.name })}>
                Preview
              </Button>
            </div>
          </SectionCard>
        ))}
      </div>
    </div>
  );
}

/* ---------------- System Tools ---------------- */

function SystemToolsChild({ moduleId, childId }: ViewProps) {
  const { mod, child } = useModuleHeader(moduleId, childId);
  const { toast } = useToast();
  const [activeTool, setActiveTool] = React.useState<"ping" | "traceroute" | "dns" | "conn">("ping");
  const [target, setTarget] = React.useState("");
  const [output, setOutput] = React.useState("");
  const tools = [
    { id: "ping" as const, label: "Ping", icon: Activity, placeholder: "Host or IP (e.g. 8.8.8.8)" },
    { id: "traceroute" as const, label: "Traceroute", icon: Route, placeholder: "Host or IP (e.g. google.com)" },
    { id: "dns" as const, label: "DNS Lookup", icon: Globe, placeholder: "Domain (e.g. cryptsk.in)" },
    { id: "conn" as const, label: "Connectivity Test", icon: Network, placeholder: "Host:port (e.g. radius.cryptsk.in:1812)" },
  ];
  if (!mod) return null;
  const run = () => {
    if (!target.trim()) {
      toast({ title: "Enter a target", description: "Provide a host or IP to run the diagnostic.", variant: "destructive" });
      return;
    }
    const lines = [
      `Running ${activeTool} against ${target}...`,
      activeTool === "ping" && `PING ${target} 56(84) bytes of data.`,
      activeTool === "ping" && `64 bytes from ${target}: icmp_seq=1 ttl=58 time=12.4 ms`,
      activeTool === "ping" && `64 bytes from ${target}: icmp_seq=2 ttl=58 time=11.9 ms`,
      activeTool === "ping" && `64 bytes from ${target}: icmp_seq=3 ttl=58 time=13.1 ms`,
      activeTool === "ping" && `--- ${target} ping statistics ---`,
      activeTool === "ping" && `3 packets transmitted, 3 received, 0% packet loss`,
      activeTool === "traceroute" && `traceroute to ${target}, 30 hops max`,
      activeTool === "traceroute" && ` 1  172.16.16.1 (172.16.16.1)  1.221 ms`,
      activeTool === "traceroute" && ` 2  10.0.0.1 (10.0.0.1)  4.311 ms`,
      activeTool === "traceroute" && ` 3  ${target} (${target})  12.842 ms`,
      activeTool === "dns" && `Server: 127.0.0.1`,
      activeTool === "dns" && `Name:    ${target}`,
      activeTool === "dns" && `Address: 103.205.148.26`,
      activeTool === "conn" && `Testing TCP ${target}...`,
      activeTool === "conn" && `Connection: SUCCESS (rtt 18ms)`,
    ].filter(Boolean) as string[];
    setOutput(lines.join("\n"));
    toast({ title: `${activeTool} complete`, description: `Result rendered below.` });
  };
  return (
    <div className="space-y-6">
      <PageHeader
        title={child!.label}
        description="Run ping, traceroute, DNS lookup and connectivity tests from the appliance."
        icon={<mod.icon className="h-5 w-5" />}
        breadcrumb={[{ label: "Cryptsk" }, { label: mod.label }, { label: child!.label }]}
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {tools.map((t) => (
          <button
            key={t.id}
            onClick={() => { setActiveTool(t.id); setOutput(""); }}
            className={`flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition-all ${
              activeTool === t.id
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-border bg-card hover:border-primary/40 hover:shadow-sm"
            }`}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <t.icon className="h-4 w-4" />
            </div>
            <p className="text-sm font-medium text-foreground">{t.label}</p>
          </button>
        ))}
      </div>
      <SectionCard
        title={tools.find((t) => t.id === activeTool)!.label}
        description="Enter a target and run the diagnostic"
      >
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            placeholder={tools.find((t) => t.id === activeTool)!.placeholder}
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && run()}
            className="font-mono text-sm"
          />
          <Button onClick={run}>
            <Play className="mr-2 h-4 w-4" /> Run
          </Button>
        </div>
        {output && (
          <pre className="mt-4 max-h-80 overflow-y-auto scrollbar-thin rounded-lg border border-border bg-muted/40 p-3 font-mono text-xs text-foreground/80">
            {output}
          </pre>
        )}
        {!output && (
          <div className="mt-4">
            <EmptyState icon={<Terminal className="h-5 w-5" />} title="No output yet" description="Run the tool to see results." />
          </div>
        )}
      </SectionCard>
    </div>
  );
}
