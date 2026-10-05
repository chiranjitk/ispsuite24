"use client";

import * as React from "react";
import {
  ViewProps,
  useModuleHeader,
  useViewRouter,
  ChildOverview,
  LeafPlaceholder,
} from "./_shared";
import {
  PageHeader,
  KpiCard,
  SectionCard,
  EmptyState,
  ActionBar,
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
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Settings2,
  Network as NetworkIcon,
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
  Route as RouteIcon,
  Lock,
  UserCog,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Search,
  Filter,
  Loader2,
  X,
  AlertCircle,
  FileText,
  CalendarClock,
  Cpu,
  ShieldCheck,
  Plug,
  ListChecks,
} from "lucide-react";
import { systemApi } from "@/lib/api";

/* ===================================================================== *
 *  SystemView — top-level router for the System module
 * ===================================================================== */

export function SystemView({ moduleId, childId, grandchildId }: ViewProps) {
  const router = useViewRouter(moduleId, childId, grandchildId);

  if (router.state === "loading") return null;
  if (router.state === "module-overview")
    return <SystemOverview moduleId={moduleId} />;
  if (router.state === "child-overview")
    return <ChildOverview moduleId={moduleId} childId={router.childId} />;

  if (router.state === "grandchild") {
    /* ---------------- Network ---------------- */
    if (childId === "network" && grandchildId === "interface")
      return <InterfacePage moduleId={moduleId} childId={childId} grandchildId={grandchildId} />;
    if (childId === "network" && grandchildId === "gateway")
      return <GatewayPage moduleId={moduleId} childId={childId} grandchildId={grandchildId} />;
    if (childId === "network" && grandchildId === "priorities")
      return <PrioritiesPage moduleId={moduleId} childId={childId} grandchildId={grandchildId} />;
    if (childId === "network" && grandchildId === "dns")
      return <DnsPage moduleId={moduleId} childId={childId} grandchildId={grandchildId} />;
    if (childId === "network" && grandchildId === "static-route")
      return <StaticRoutePage moduleId={moduleId} childId={childId} grandchildId={grandchildId} />;

    /* ---------------- Firewall ---------------- */
    if (childId === "firewall" && grandchildId === "create")
      return <FirewallCreatePage moduleId={moduleId} childId={childId} grandchildId={grandchildId} />;
    if (childId === "firewall" && grandchildId === "manage")
      return <FirewallManagePage moduleId={moduleId} childId={childId} grandchildId={grandchildId} />;
    if (childId === "firewall" && grandchildId === "dos-settings")
      return <DosSettingsPage moduleId={moduleId} childId={childId} grandchildId={grandchildId} />;
    if (childId === "firewall" && grandchildId === "dos-bypass")
      return <DosBypassPage moduleId={moduleId} childId={childId} grandchildId={grandchildId} />;
    if (childId === "firewall" && grandchildId === "free-sites")
      return <FreeSitesPage moduleId={moduleId} childId={childId} grandchildId={grandchildId} />;

    /* ---------------- DHCP ---------------- */
    if (childId === "dhcp" && grandchildId === "manage-dhcp")
      return <ManageDhcpPage moduleId={moduleId} childId={childId} grandchildId={grandchildId} />;
    if (childId === "dhcp" && grandchildId === "ip-leasing")
      return <IpLeasingPage moduleId={moduleId} childId={childId} grandchildId={grandchildId} />;

    /* ---------------- PPPoE ---------------- */
    if (childId === "pppoe" && grandchildId === "manage-pppoe")
      return <ManagePppoePage moduleId={moduleId} childId={childId} grandchildId={grandchildId} />;

    /* ---------------- Manage Data ---------------- */
    if (childId === "manage-data" && grandchildId === "backup")
      return <BackupPage moduleId={moduleId} childId={childId} grandchildId={grandchildId} />;
    if (childId === "manage-data" && grandchildId === "backup-schedule")
      return <BackupSchedulePage moduleId={moduleId} childId={childId} grandchildId={grandchildId} />;
    if (childId === "manage-data" && grandchildId === "restore")
      return <RestorePage moduleId={moduleId} childId={childId} grandchildId={grandchildId} />;
    if (childId === "manage-data" && grandchildId === "auto-purge")
      return <AutoPurgePage moduleId={moduleId} childId={childId} grandchildId={grandchildId} />;
    if (childId === "manage-data" && grandchildId === "manual-purge")
      return <ManualPurgePage moduleId={moduleId} childId={childId} grandchildId={grandchildId} />;
    if (childId === "manage-data" && grandchildId === "migrate-user")
      return <MigrateUserPage moduleId={moduleId} childId={childId} grandchildId={grandchildId} />;
    if (childId === "manage-data" && grandchildId === "auth-logs")
      return <AuthLogsPage moduleId={moduleId} childId={childId} grandchildId={grandchildId} />;

    /* ---------------- Client Services ---------------- */
    if (childId === "client-services" && grandchildId === "parameters")
      return <ClientServicesParametersPage moduleId={moduleId} childId={childId} grandchildId={grandchildId} />;
    if (childId === "client-services" && grandchildId === "customized-images")
      return <CustomizedImagesPage moduleId={moduleId} childId={childId} grandchildId={grandchildId} />;
    if (childId === "client-services" && grandchildId === "forgot-password")
      return <ForgotPasswordConfigPage moduleId={moduleId} childId={childId} grandchildId={grandchildId} />;
    if (childId === "client-services" && grandchildId === "clientgui-urls")
      return <ClientGuiUrlsPage moduleId={moduleId} childId={childId} grandchildId={grandchildId} />;
    if (childId === "client-services" && grandchildId === "webservice-config")
      return <WebserviceConfigPage moduleId={moduleId} childId={childId} grandchildId={grandchildId} />;
    if (childId === "client-services" && grandchildId === "password-config")
      return <PasswordConfigPage moduleId={moduleId} childId={childId} grandchildId={grandchildId} />;
    if (childId === "client-services" && grandchildId === "configuration")
      return <ClientConfigurationPage moduleId={moduleId} childId={childId} grandchildId={grandchildId} />;

    /* ---------------- ACL ---------------- */
    if (childId === "acl" && grandchildId === "access-control")
      return <AccessControlPage moduleId={moduleId} childId={childId} grandchildId={grandchildId} />;
    if (childId === "acl" && grandchildId === "user-type")
      return <UserTypePage moduleId={moduleId} childId={childId} grandchildId={grandchildId} />;
    if (childId === "acl" && grandchildId === "user-access")
      return <UserAccessPage moduleId={moduleId} childId={childId} grandchildId={grandchildId} />;
    if (childId === "acl" && grandchildId === "console-acl")
      return <ConsoleAclPage moduleId={moduleId} childId={childId} grandchildId={grandchildId} />;

    /* ---------------- Dynamic DNS ---------------- */
    if (childId === "dynamic-dns" && grandchildId === "register-host")
      return <DdnsRegisterPage moduleId={moduleId} childId={childId} grandchildId={grandchildId} />;
    if (childId === "dynamic-dns" && grandchildId === "manage-hosts")
      return <DdnsManagePage moduleId={moduleId} childId={childId} grandchildId={grandchildId} />;

    /* ---------------- Captive Portal ---------------- */
    if (childId === "captive-portal" && grandchildId === "create")
      return <CaptiveCreatePage moduleId={moduleId} childId={childId} grandchildId={grandchildId} />;
    if (childId === "captive-portal" && grandchildId === "manage")
      return <CaptiveManagePage moduleId={moduleId} childId={childId} grandchildId={grandchildId} />;
    if (childId === "captive-portal" && grandchildId === "client-page")
      return <CpClientPagePage moduleId={moduleId} childId={childId} grandchildId={grandchildId} />;
    if (childId === "captive-portal" && grandchildId === "portal-networks")
      return <PortalNetworksPage moduleId={moduleId} childId={childId} grandchildId={grandchildId} />;
    if (childId === "captive-portal" && grandchildId === "leased-line-page")
      return <LeasedLinePageConfigPage moduleId={moduleId} childId={childId} grandchildId={grandchildId} />;
    if (childId === "captive-portal" && grandchildId === "messages")
      return <PortalMessagesPage moduleId={moduleId} childId={childId} grandchildId={grandchildId} />;
    if (childId === "captive-portal" && grandchildId === "portal-config")
      return <PortalConfigPage moduleId={moduleId} childId={childId} grandchildId={grandchildId} />;
    if (childId === "captive-portal" && grandchildId === "configure-profile")
      return <ConfigureProfilePage moduleId={moduleId} childId={childId} grandchildId={grandchildId} />;
    if (childId === "captive-portal" && grandchildId === "security-config")
      return <CpSecurityConfigPage moduleId={moduleId} childId={childId} grandchildId={grandchildId} />;
    if (childId === "captive-portal" && grandchildId === "social-media")
      return <SocialMediaConfigPage moduleId={moduleId} childId={childId} grandchildId={grandchildId} />;
    if (childId === "captive-portal" && grandchildId === "cp-registration")
      return <CpRegistrationPolicyPage moduleId={moduleId} childId={childId} grandchildId={grandchildId} />;

    /* ---------------- NAS Management ---------------- */
    if (childId === "nas" && grandchildId === "nas-ip-config")
      return <NasIpConfigPage moduleId={moduleId} childId={childId} grandchildId={grandchildId} />;
    if (childId === "nas" && grandchildId === "radius-config")
      return <RadiusConfigPage moduleId={moduleId} childId={childId} grandchildId={grandchildId} />;
    if (childId === "nas" && grandchildId === "nas-configuration")
      return <NasConfigurationPage moduleId={moduleId} childId={childId} grandchildId={grandchildId} />;
    if (childId === "nas" && grandchildId === "preferences")
      return <NasPreferencesPage moduleId={moduleId} childId={childId} grandchildId={grandchildId} />;
    if (childId === "nas" && grandchildId === "connectivity")
      return <NasConnectivityPage moduleId={moduleId} childId={childId} grandchildId={grandchildId} />;
    if (childId === "nas" && grandchildId === "nas-client-config")
      return <NasClientConfigPage moduleId={moduleId} childId={childId} grandchildId={grandchildId} />;
    if (childId === "nas" && grandchildId === "attribute-mapping")
      return <AttributeMappingPage moduleId={moduleId} childId={childId} grandchildId={grandchildId} />;

    /* ---------------- Status Tracker ---------------- */
    if (childId === "status-tracker" && grandchildId === "add-device")
      return <AddDevicePage moduleId={moduleId} childId={childId} grandchildId={grandchildId} />;
    if (childId === "status-tracker" && grandchildId === "manage-devices")
      return <ManageDevicesPage moduleId={moduleId} childId={childId} grandchildId={grandchildId} />;
    if (childId === "status-tracker" && grandchildId === "device-logs")
      return <DeviceLogsPage moduleId={moduleId} childId={childId} grandchildId={grandchildId} />;

    /* ---------------- System Tools ---------------- */
    if (childId === "system-tools" && grandchildId === "packet-capture")
      return <PacketCapturePage moduleId={moduleId} childId={childId} grandchildId={grandchildId} />;

    /* Default fallback to placeholder */
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
    case "services":
      return <ServicesPage moduleId={moduleId} childId={childId} />;
    case "console":
      return <ConsolePage moduleId={moduleId} childId={childId} />;
    case "system-settings":
      return <SystemSettingsPage moduleId={moduleId} childId={childId} />;
    case "dashboard-conf":
      return <DashboardConfPage moduleId={moduleId} childId={childId} />;
    default:
      return <SystemOverview moduleId={moduleId} />;
  }
}

/* ===================================================================== *
 *  Small shared helpers
 * ===================================================================== */

function StatusBadge({
  status,
  type = "default",
}: {
  status: string;
  type?: "default" | "running" | "active" | "online" | "completed";
}) {
  const map: Record<string, string> = {
    Up: "bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400",
    Active: "bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400",
    Online: "bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400",
    Running: "bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400",
    Completed: "bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400",
    Enabled: "bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400",
    Accept: "bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400",
    Down: "bg-primary/10 text-primary hover:bg-primary/10",
    Inactive: "bg-slate-500/10 text-slate-700 hover:bg-slate-500/10 dark:text-slate-300",
    Offline: "bg-primary/10 text-primary hover:bg-primary/10",
    Stopped: "bg-primary/10 text-primary hover:bg-primary/10",
    Disabled: "bg-slate-500/10 text-slate-700 hover:bg-slate-500/10 dark:text-slate-300",
    Failed: "bg-primary/10 text-primary hover:bg-primary/10",
    Expired: "bg-primary/10 text-primary hover:bg-primary/10",
    Reject: "bg-primary/10 text-primary hover:bg-primary/10",
    Warning: "bg-amber-500/10 text-amber-700 hover:bg-amber-500/10 dark:text-amber-400",
    "In Progress": "bg-amber-500/10 text-amber-700 hover:bg-amber-500/10 dark:text-amber-400",
  };
  const cls = map[status] ?? "bg-slate-500/10 text-slate-700 hover:bg-slate-500/10 dark:text-slate-300";
  return (
    <Badge variant="secondary" className={cls} data-type={type}>
      {status}
    </Badge>
  );
}

function LevelBadge({ level }: { level: string }) {
  if (level === "ERROR")
    return <Badge className="bg-primary/10 text-primary hover:bg-primary/10">ERROR</Badge>;
  if (level === "WARN")
    return <Badge className="bg-amber-500/10 text-amber-700 hover:bg-amber-500/10 dark:text-amber-400">WARN</Badge>;
  return <Badge className="bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400">INFO</Badge>;
}

function PageLoader() {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  );
}

/** Standard 3-level breadcrumb builder for grandchild pages */
function useBreadcrumb(moduleId: string, childId: string, grandchildId?: string) {
  const { mod, child, grandchild } = useModuleHeader(moduleId, childId, grandchildId);
  const setActive = useAppStore((s) => s.setActive);
  return [
    { label: "Cryptsk" },
    { label: mod?.label ?? "System", onClick: () => setActive(moduleId, "", "") },
    { label: child?.label ?? childId, onClick: () => setActive(moduleId, childId, "") },
    ...(grandchild ? [{ label: grandchild.label }] : []),
  ];
}

/** Delete confirmation dialog */
function DeleteDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  busy,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title: string;
  description: React.ReactNode;
  busy: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={busy}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={busy}>
            {busy ? (
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
  );
}

/* ===================================================================== *
 *  SystemOverview — module landing page
 * ===================================================================== */

function SystemOverview({ moduleId }: { moduleId: string }) {
  const { mod } = useModuleHeader(moduleId);
  const setActive = useAppStore((s) => s.setActive);

  const cards = [
    { label: "Network", desc: "Interfaces, gateways, DNS, routes", icon: NetworkIcon, child: "network" },
    { label: "Firewall", desc: "Rules, DoS, free sites", icon: ShieldAlert, child: "firewall" },
    { label: "DHCP", desc: "Scopes & IP leasing", icon: Wifi, child: "dhcp" },
    { label: "Services", desc: "Start, stop, restart services", icon: Server, child: "services" },
    { label: "Console", desc: "Reset console password", icon: Terminal, child: "console" },
    { label: "Manage Data", desc: "Backup, restore, purge, logs", icon: Database, child: "manage-data" },
    { label: "Client Services", desc: "Client GUI, web service, passwords", icon: SlidersHorizontal, child: "client-services" },
    { label: "ACL", desc: "Access control, user types", icon: Lock, child: "acl" },
    { label: "Dynamic DNS", desc: "Register & manage DDNS", icon: Globe, child: "dynamic-dns" },
    { label: "Captive Portal", desc: "Login pages & portal config", icon: Plug, child: "captive-portal" },
    { label: "NAS Management", desc: "RADIUS clients, attributes", icon: HardDrive, child: "nas" },
    { label: "Status Tracker", desc: "Devices & device logs", icon: Activity, child: "status-tracker" },
    { label: "System Settings", desc: "Proactive reports, GUI prefs", icon: Settings2, child: "system-settings" },
    { label: "Dashboard Conf", desc: "Dashboard layouts", icon: LayoutGrid, child: "dashboard-conf" },
    { label: "System Tools", desc: "Diagnostics & utilities", icon: Wrench, child: "system-tools" },
  ];

  if (!mod) return null;

  return (
    <div className="space-y-6">
      <PageHeader title={mod.label} description={mod.desc} icon={<mod.icon className="h-5 w-5" />} />
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
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium text-foreground">{c.label}</p>
                <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">{c.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ===================================================================== *
 *  NETWORK
 * ===================================================================== */

/* ---------- Interface ---------- */

function InterfacePage({ moduleId, childId, grandchildId }: ViewProps) {
  const { mod, child, grandchild } = useModuleHeader(moduleId, childId, grandchildId);
  const setActive = useAppStore((s) => s.setActive);
  const { toast } = useToast();
  const [rows, setRows] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<any | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<any | null>(null);
  const [busy, setBusy] = React.useState(false);

  const load = React.useCallback(() => {
    setLoading(true);
    systemApi.list("interfaces").then((res) => {
      setRows(res.data ?? []);
      setLoading(false);
    });
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const handleToggle = async (r: any) => {
    await systemApi.toggle("interfaces", r.id, "status");
    toast({
      title: "Status toggled",
      description: `${r.deviceName} is now ${r.status === "Up" ? "Down" : "Up"}.`,
    });
    load();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setBusy(true);
    await systemApi.delete("interfaces", deleteTarget.id);
    setBusy(false);
    toast({ title: "Interface deleted", description: deleteTarget.deviceName });
    setDeleteTarget(null);
    load();
  };

  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);

  return (
    <div className="space-y-6">
      <PageHeader
        title={grandchild?.label ?? "Interface"}
        description={grandchild?.desc ?? "View & configure network interfaces"}
        icon={<Settings2 className="h-5 w-5" />}
        breadcrumb={breadcrumb}
        actions={
          <Button
            onClick={() => {
              setEditing(null);
              setDialogOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Interface
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard label="Total" value={String(rows.length)} icon={<NetworkIcon className="h-4 w-4" />} accent />
        <KpiCard label="Up" value={String(rows.filter((r) => r.status === "Up").length)} icon={<Activity className="h-4 w-4" />} />
        <KpiCard label="External" value={String(rows.filter((r) => r.interfaceType === "External").length)} icon={<Globe className="h-4 w-4" />} />
        <KpiCard label="Internal" value={String(rows.filter((r) => r.interfaceType === "Internal").length)} icon={<Wifi className="h-4 w-4" />} />
      </div>

      <SectionCard title="Network Interfaces" description={`${rows.length} interfaces`}>
        {loading ? (
          <PageLoader />
        ) : rows.length === 0 ? (
          <EmptyState
            icon={<NetworkIcon className="h-5 w-5" />}
            title="No interfaces"
            description="Add your first network interface."
          />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Port</TableHead>
                  <TableHead>Device</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Netmask</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-mono font-semibold">{r.port}</TableCell>
                    <TableCell className="font-mono text-xs">{r.deviceName}</TableCell>
                    <TableCell className="font-mono text-xs">{r.ipAddress}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{r.netmask}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={r.interfaceType === "External"
                          ? "border-amber-500/30 text-amber-700 dark:text-amber-400"
                          : "border-emerald-500/30 text-emerald-700 dark:text-emerald-400"}
                      >
                        {r.interfaceType}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs">{r.description}</TableCell>
                    <TableCell>
                      <button onClick={() => handleToggle(r)}>
                        <StatusBadge status={r.status} />
                      </button>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditing(r);
                            setDialogOpen(true);
                          }}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-primary hover:text-primary"
                          onClick={() => setDeleteTarget(r)}
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

      <InterfaceDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editing={editing}
        onSaved={() => {
          setDialogOpen(false);
          load();
        }}
      />

      <DeleteDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Interface"
        description={<>Delete interface <span className="font-medium text-foreground">{deleteTarget?.deviceName}</span>? This cannot be undone.</>}
        busy={busy}
      />
    </div>
  );
}

function InterfaceDialog({
  open,
  onOpenChange,
  editing,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  editing: any | null;
  onSaved: () => void;
}) {
  const { toast } = useToast();
  const [saving, setSaving] = React.useState(false);
  const [form, setForm] = React.useState({
    deviceName: "",
    ipAddress: "",
    netmask: "255.255.255.0",
    interfaceType: "Internal",
    description: "",
    port: "",
  });

  React.useEffect(() => {
    if (editing) {
      setForm({
        deviceName: editing.deviceName ?? "",
        ipAddress: editing.ipAddress ?? "",
        netmask: editing.netmask ?? "255.255.255.0",
        interfaceType: editing.interfaceType ?? "Internal",
        description: editing.description ?? "",
        port: editing.port ?? "",
      });
    } else {
      setForm({
        deviceName: "",
        ipAddress: "",
        netmask: "255.255.255.0",
        interfaceType: "Internal",
        description: "",
        port: "",
      });
    }
  }, [editing, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    if (editing) {
      await systemApi.update("interfaces", { ...form, id: editing.id });
      toast({ title: "Interface updated", description: form.deviceName });
    } else {
      await systemApi.create("interfaces", { ...form, status: "Up" });
      toast({ title: "Interface created", description: form.deviceName });
    }
    setSaving(false);
    onSaved();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editing ? "Edit Interface" : "Add Interface"}</DialogTitle>
          <DialogDescription>
            {editing ? "Update network interface configuration." : "Configure a new network interface."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Port</Label>
              <Input value={form.port} onChange={(e) => setForm({ ...form, port: e.target.value })} placeholder="e.g. A" maxLength={2} />
            </div>
            <div className="space-y-2">
              <Label>Device Name</Label>
              <Input value={form.deviceName} onChange={(e) => setForm({ ...form, deviceName: e.target.value })} placeholder="eth0" required />
            </div>
            <div className="space-y-2">
              <Label>IP Address</Label>
              <Input value={form.ipAddress} onChange={(e) => setForm({ ...form, ipAddress: e.target.value })} placeholder="0.0.0.0" required />
            </div>
            <div className="space-y-2">
              <Label>Netmask</Label>
              <Input value={form.netmask} onChange={(e) => setForm({ ...form, netmask: e.target.value })} placeholder="255.255.255.0" />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={form.interfaceType} onValueChange={(v) => setForm({ ...form, interfaceType: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Internal">Internal</SelectItem>
                  <SelectItem value="External">External</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="LAN / WAN / DMZ" />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {editing ? "Save Changes" : "Create Interface"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* ---------- Gateway ---------- */

function GatewayPage({ moduleId, childId, grandchildId }: ViewProps) {
  const { mod, child, grandchild } = useModuleHeader(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const [rows, setRows] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<any | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<any | null>(null);
  const [busy, setBusy] = React.useState(false);

  const load = React.useCallback(() => {
    setLoading(true);
    systemApi.list("gateways").then((res) => {
      setRows(res.data ?? []);
      setLoading(false);
    });
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setBusy(true);
    await systemApi.delete("gateways", deleteTarget.id);
    setBusy(false);
    toast({ title: "Gateway deleted", description: deleteTarget.priorityName });
    setDeleteTarget(null);
    load();
  };

  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);

  return (
    <div className="space-y-6">
      <PageHeader
        title={grandchild?.label ?? "Gateway"}
        description="Manage network gateways and routing priorities."
        icon={<Settings2 className="h-5 w-5" />}
        breadcrumb={breadcrumb}
        actions={
          <Button onClick={() => { setEditing(null); setDialogOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" /> Add Gateway
          </Button>
        }
      />

      <SectionCard title="Gateways" description={`${rows.length} gateways`}>
        {loading ? <PageLoader /> : rows.length === 0 ? (
          <EmptyState icon={<RouteIcon className="h-5 w-5" />} title="No gateways" description="Add a gateway to get started." />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Priority Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Effective Gateway</TableHead>
                  <TableHead>IP Version</TableHead>
                  <TableHead>Default</TableHead>
                  <TableHead>Network</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.priorityName}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{r.priorityDesc}</TableCell>
                    <TableCell className="font-mono text-xs">{r.effectiveGateway}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px]">{r.ipVersion}</Badge>
                    </TableCell>
                    <TableCell>
                      {r.isDefault ? (
                        <Badge className="bg-primary/10 text-primary hover:bg-primary/10">Default</Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{r.network}</TableCell>
                    <TableCell><StatusBadge status={r.status} /></TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => { setEditing(r); setDialogOpen(true); }}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-primary hover:text-primary" onClick={() => setDeleteTarget(r)}>
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

      <GatewayDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editing={editing}
        onSaved={() => { setDialogOpen(false); load(); }}
      />

      <DeleteDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Gateway"
        description={<>Delete gateway <span className="font-medium text-foreground">{deleteTarget?.priorityName}</span>?</>}
        busy={busy}
      />
    </div>
  );
}

function GatewayDialog({
  open, onOpenChange, editing, onSaved,
}: { open: boolean; onOpenChange: (o: boolean) => void; editing: any | null; onSaved: () => void; }) {
  const { toast } = useToast();
  const [saving, setSaving] = React.useState(false);
  const [form, setForm] = React.useState({
    priorityName: "",
    priorityDesc: "",
    effectiveGateway: "",
    ipVersion: "IPv4",
    isDefault: false,
    network: "0.0.0.0/0",
    status: "Active",
  });

  React.useEffect(() => {
    if (editing) {
      setForm({
        priorityName: editing.priorityName ?? "",
        priorityDesc: editing.priorityDesc ?? "",
        effectiveGateway: editing.effectiveGateway ?? "",
        ipVersion: editing.ipVersion ?? "IPv4",
        isDefault: !!editing.isDefault,
        network: editing.network ?? "0.0.0.0/0",
        status: editing.status ?? "Active",
      });
    } else {
      setForm({ priorityName: "", priorityDesc: "", effectiveGateway: "", ipVersion: "IPv4", isDefault: false, network: "0.0.0.0/0", status: "Active" });
    }
  }, [editing, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    if (editing) {
      await systemApi.update("gateways", { ...form, id: editing.id });
      toast({ title: "Gateway updated", description: form.priorityName });
    } else {
      await systemApi.create("gateways", form);
      toast({ title: "Gateway created", description: form.priorityName });
    }
    setSaving(false);
    onSaved();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editing ? "Edit Gateway" : "Add Gateway"}</DialogTitle>
          <DialogDescription>Configure a routing gateway.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Priority Name</Label>
              <Input value={form.priorityName} onChange={(e) => setForm({ ...form, priorityName: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Effective Gateway</Label>
              <Input value={form.effectiveGateway} onChange={(e) => setForm({ ...form, effectiveGateway: e.target.value })} placeholder="0.0.0.0" required />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input value={form.priorityDesc} onChange={(e) => setForm({ ...form, priorityDesc: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Network</Label>
              <Input value={form.network} onChange={(e) => setForm({ ...form, network: e.target.value })} placeholder="0.0.0.0/0" />
            </div>
            <div className="space-y-2">
              <Label>IP Version</Label>
              <Select value={form.ipVersion} onValueChange={(v) => setForm({ ...form, ipVersion: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="IPv4">IPv4</SelectItem>
                  <SelectItem value="IPv6">IPv6</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.isDefault} onCheckedChange={(v) => setForm({ ...form, isDefault: v })} id="isDefault" />
              <Label htmlFor="isDefault">Default Gateway</Label>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>Cancel</Button>
            <Button type="submit" disabled={saving}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {editing ? "Save Changes" : "Create Gateway"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* ---------- DNS ---------- */

function DnsPage({ moduleId, childId, grandchildId }: ViewProps) {
  const { mod, child, grandchild } = useModuleHeader(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [form, setForm] = React.useState({
    id: 1,
    dnsServers: "",
    domainName: "",
    isEnabled: true,
    nxdomainIp: "",
    nxdomainUrl: "",
    reverseIp: "",
  });

  React.useEffect(() => {
    systemApi.list("dns").then((res) => {
      if (res.data && res.data.length > 0) setForm(res.data[0]);
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    if (form.id) {
      await systemApi.update("dns", form);
    } else {
      const r = await systemApi.create("dns", form);
      if (r.data) setForm(r.data);
    }
    setSaving(false);
    toast({ title: "DNS configuration saved", description: form.domainName || "DNS settings updated." });
  };

  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);

  return (
    <div className="space-y-6">
      <PageHeader
        title={grandchild?.label ?? "DNS"}
        description="Configure DNS servers, domain and NXDOMAIN handling."
        icon={<Settings2 className="h-5 w-5" />}
        breadcrumb={breadcrumb}
      />

      {loading ? (
        <SectionCard><PageLoader /></SectionCard>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <SectionCard title="DNS Settings" description="Server and domain configuration">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>DNS Servers</Label>
                <Input
                  value={form.dnsServers}
                  onChange={(e) => setForm({ ...form, dnsServers: e.target.value })}
                  placeholder="8.8.8.8, 8.8.4.4"
                />
                <p className="text-xs text-muted-foreground">Comma-separated list of DNS server IPs.</p>
              </div>
              <div className="space-y-2">
                <Label>Domain Name</Label>
                <Input
                  value={form.domainName}
                  onChange={(e) => setForm({ ...form, domainName: e.target.value })}
                  placeholder="cryptsk.local"
                />
              </div>
              <div className="space-y-2">
                <Label>NXDOMAIN IP</Label>
                <Input
                  value={form.nxdomainIp}
                  onChange={(e) => setForm({ ...form, nxdomainIp: e.target.value })}
                  placeholder="10.172.0.1"
                />
              </div>
              <div className="space-y-2">
                <Label>NXDOMAIN URL</Label>
                <Input
                  value={form.nxdomainUrl}
                  onChange={(e) => setForm({ ...form, nxdomainUrl: e.target.value })}
                  placeholder="portal.cryptsk.com"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Reverse IP Range</Label>
                <Input
                  value={form.reverseIp}
                  onChange={(e) => setForm({ ...form, reverseIp: e.target.value })}
                  placeholder="10.172.0.x"
                />
              </div>
              <div className="flex items-center gap-3 md:col-span-2">
                <Switch
                  id="dnsEnabled"
                  checked={form.isEnabled}
                  onCheckedChange={(v) => setForm({ ...form, isEnabled: v })}
                />
                <Label htmlFor="dnsEnabled" className="cursor-pointer">
                  Enable DNS Service
                </Label>
              </div>
            </div>
          </SectionCard>

          <div className="flex items-center justify-end gap-3">
            <Button type="submit" disabled={saving}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save DNS Configuration
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

/* ---------- Static Route ---------- */

function StaticRoutePage({ moduleId, childId, grandchildId }: ViewProps) {
  const { mod, child, grandchild } = useModuleHeader(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const [rows, setRows] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<any | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<any | null>(null);
  const [busy, setBusy] = React.useState(false);

  const load = React.useCallback(() => {
    setLoading(true);
    systemApi.list("routes").then((res) => {
      setRows(res.data ?? []);
      setLoading(false);
    });
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setBusy(true);
    await systemApi.delete("routes", deleteTarget.id);
    setBusy(false);
    toast({ title: "Route deleted", description: `${deleteTarget.destinationIp}/${deleteTarget.netmask}` });
    setDeleteTarget(null);
    load();
  };

  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);

  return (
    <div className="space-y-6">
      <PageHeader
        title={grandchild?.label ?? "Static Route"}
        description="Manage static routes for network traffic."
        icon={<Settings2 className="h-5 w-5" />}
        breadcrumb={breadcrumb}
        actions={
          <Button onClick={() => { setEditing(null); setDialogOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" /> Add Route
          </Button>
        }
      />

      <SectionCard title="Static Routes" description={`${rows.length} routes`}>
        {loading ? <PageLoader /> : rows.length === 0 ? (
          <EmptyState icon={<RouteIcon className="h-5 w-5" />} title="No routes" description="Add a static route." />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Destination IP</TableHead>
                  <TableHead>Netmask</TableHead>
                  <TableHead>Gateway</TableHead>
                  <TableHead>Interface</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-mono text-xs">{r.destinationIp}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{r.netmask}</TableCell>
                    <TableCell className="font-mono text-xs">{r.gateway}</TableCell>
                    <TableCell className="font-mono text-xs">{r.interface}</TableCell>
                    <TableCell><StatusBadge status={r.status} /></TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => { setEditing(r); setDialogOpen(true); }}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-primary hover:text-primary" onClick={() => setDeleteTarget(r)}>
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

      <RouteDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editing={editing}
        onSaved={() => { setDialogOpen(false); load(); }}
      />

      <DeleteDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Route"
        description={<>Delete route <span className="font-medium text-foreground font-mono">{deleteTarget?.destinationIp}/{deleteTarget?.netmask}</span>?</>}
        busy={busy}
      />
    </div>
  );
}

function RouteDialog({
  open, onOpenChange, editing, onSaved,
}: { open: boolean; onOpenChange: (o: boolean) => void; editing: any | null; onSaved: () => void; }) {
  const { toast } = useToast();
  const [saving, setSaving] = React.useState(false);
  const [form, setForm] = React.useState({
    destinationIp: "",
    netmask: "255.255.255.0",
    gateway: "",
    interface: "eth0",
    status: "Active",
  });

  React.useEffect(() => {
    if (editing) {
      setForm({
        destinationIp: editing.destinationIp ?? "",
        netmask: editing.netmask ?? "255.255.255.0",
        gateway: editing.gateway ?? "",
        interface: editing.interface ?? "eth0",
        status: editing.status ?? "Active",
      });
    } else {
      setForm({ destinationIp: "", netmask: "255.255.255.0", gateway: "", interface: "eth0", status: "Active" });
    }
  }, [editing, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    if (editing) {
      await systemApi.update("routes", { ...form, id: editing.id });
      toast({ title: "Route updated" });
    } else {
      await systemApi.create("routes", form);
      toast({ title: "Route created" });
    }
    setSaving(false);
    onSaved();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editing ? "Edit Route" : "Add Static Route"}</DialogTitle>
          <DialogDescription>Configure a static route entry.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Destination IP</Label>
              <Input value={form.destinationIp} onChange={(e) => setForm({ ...form, destinationIp: e.target.value })} placeholder="10.172.0.0" required />
            </div>
            <div className="space-y-2">
              <Label>Netmask</Label>
              <Input value={form.netmask} onChange={(e) => setForm({ ...form, netmask: e.target.value })} placeholder="255.255.255.0" />
            </div>
            <div className="space-y-2">
              <Label>Gateway</Label>
              <Input value={form.gateway} onChange={(e) => setForm({ ...form, gateway: e.target.value })} placeholder="172.16.16.1" required />
            </div>
            <div className="space-y-2">
              <Label>Interface</Label>
              <Input value={form.interface} onChange={(e) => setForm({ ...form, interface: e.target.value })} placeholder="eth0" />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>Cancel</Button>
            <Button type="submit" disabled={saving}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {editing ? "Save Changes" : "Create Route"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* ===================================================================== *
 *  FIREWALL
 * ===================================================================== */

/* ---------- Firewall Create ---------- */

function FirewallCreatePage({ moduleId, childId, grandchildId }: ViewProps) {
  const { mod, child, grandchild } = useModuleHeader(moduleId, childId, grandchildId);
  const setActive = useAppStore((s) => s.setActive);
  const { toast } = useToast();
  const [saving, setSaving] = React.useState(false);
  const [form, setForm] = React.useState({
    source: "*",
    destination: "*",
    sourcePort: "*",
    srcPortType: "Include" as "Include" | "Exclude",
    destPort: "*",
    dstPortType: "Include" as "Include" | "Exclude",
    protocol: "ANY" as "TCP" | "UDP" | "ICMP" | "ANY",
    action: "Allow" as "Allow" | "Deny" | "Drop",
    description: "",
    bandwidth: "",
    startDate: "",
    endDate: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await systemApi.create("firewallRules", { ...form, position: 999, enabled: true });
    setSaving(false);
    if (res.responseCode === "0") {
      toast({ title: "Firewall rule created", description: form.description || "Rule added to chain." });
      setActive(moduleId, "firewall", "manage");
    } else {
      toast({ title: "Failed to create rule", description: res.responseMsg, variant: "destructive" });
    }
  };

  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);

  return (
    <div className="space-y-6">
      <PageHeader
        title={grandchild?.label ?? "Create Firewall Rule"}
        description="Create a new firewall rule. Fields mirror the 24online createfirewall.jsp form."
        icon={<Settings2 className="h-5 w-5" />}
        breadcrumb={breadcrumb}
        actions={
          <Button variant="outline" onClick={() => setActive(moduleId, "firewall", "manage")}>
            <X className="mr-2 h-4 w-4" /> Cancel
          </Button>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <SectionCard title="Source & Destination" description="Define where traffic comes from and goes to">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Source</Label>
              <Input value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} placeholder="* or IP/CIDR or LAN" />
            </div>
            <div className="space-y-2">
              <Label>Destination</Label>
              <Input value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} placeholder="* or IP/CIDR or WAN" />
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Ports & Protocol" description="Match specific ports and protocol">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Source Port</Label>
              <Input value={form.sourcePort} onChange={(e) => setForm({ ...form, sourcePort: e.target.value })} placeholder="* or 80,443 or 1000-2000" />
            </div>
            <div className="space-y-2">
              <Label>Source Port Type</Label>
              <Select value={form.srcPortType} onValueChange={(v) => setForm({ ...form, srcPortType: v as any })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Include">Include</SelectItem>
                  <SelectItem value="Exclude">Exclude</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Protocol</Label>
              <Select value={form.protocol} onValueChange={(v) => setForm({ ...form, protocol: v as any })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ANY">ANY</SelectItem>
                  <SelectItem value="TCP">TCP</SelectItem>
                  <SelectItem value="UDP">UDP</SelectItem>
                  <SelectItem value="ICMP">ICMP</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Destination Port</Label>
              <Input value={form.destPort} onChange={(e) => setForm({ ...form, destPort: e.target.value })} placeholder="* or 80,443" />
            </div>
            <div className="space-y-2">
              <Label>Dest Port Type</Label>
              <Select value={form.dstPortType} onValueChange={(v) => setForm({ ...form, dstPortType: v as any })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Include">Include</SelectItem>
                  <SelectItem value="Exclude">Exclude</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Action</Label>
              <Select value={form.action} onValueChange={(v) => setForm({ ...form, action: v as any })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Allow">Allow</SelectItem>
                  <SelectItem value="Deny">Deny</SelectItem>
                  <SelectItem value="Drop">Drop</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Schedule & Bandwidth" description="Optional time window and bandwidth limit">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <Input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Bandwidth Limit</Label>
              <Input value={form.bandwidth} onChange={(e) => setForm({ ...form, bandwidth: e.target.value })} placeholder="e.g. 10M (empty = unlimited)" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} placeholder="Rule description…" />
            </div>
          </div>
        </SectionCard>

        <div className="flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => setActive(moduleId, "firewall", "manage")}>Cancel</Button>
          <Button type="submit" disabled={saving}>
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Create Rule
          </Button>
        </div>
      </form>
    </div>
  );
}

/* ---------- Firewall Manage ---------- */

function FirewallManagePage({ moduleId, childId, grandchildId }: ViewProps) {
  const { mod, child, grandchild } = useModuleHeader(moduleId, childId, grandchildId);
  const setActive = useAppStore((s) => s.setActive);
  const { toast } = useToast();
  const [rows, setRows] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [deleteTarget, setDeleteTarget] = React.useState<any | null>(null);
  const [busy, setBusy] = React.useState(false);

  const load = React.useCallback(() => {
    setLoading(true);
    systemApi.list("firewallRules").then((res) => {
      setRows(res.data ?? []);
      setLoading(false);
    });
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const handleToggle = async (r: any) => {
    await systemApi.toggle("firewallRules", r.id, "enabled");
    toast({ title: "Rule toggled", description: `Rule #${r.position} is now ${r.enabled ? "Disabled" : "Enabled"}.` });
    load();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setBusy(true);
    await systemApi.delete("firewallRules", deleteTarget.id);
    setBusy(false);
    toast({ title: "Rule deleted", description: `Rule #${deleteTarget.position}` });
    setDeleteTarget(null);
    load();
  };

  const handleMove = (r: any, dir: "up" | "down") => {
    toast({
      title: `Rule moved ${dir}`,
      description: `Rule #${r.position} reordered.`,
    });
  };

  const actionBadge = (a: string) => {
    if (a === "Allow") return <Badge className="bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400">Allow</Badge>;
    if (a === "Deny") return <Badge className="bg-primary/10 text-primary hover:bg-primary/10">Deny</Badge>;
    return <Badge className="bg-amber-500/10 text-amber-700 hover:bg-amber-500/10 dark:text-amber-400">Drop</Badge>;
  };

  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);

  return (
    <div className="space-y-6">
      <PageHeader
        title={grandchild?.label ?? "Manage Firewall Rules"}
        description="View, toggle, reorder and delete firewall rules."
        icon={<Settings2 className="h-5 w-5" />}
        breadcrumb={breadcrumb}
        actions={
          <Button onClick={() => setActive(moduleId, "firewall", "create")}>
            <Plus className="mr-2 h-4 w-4" /> Create Rule
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard label="Total Rules" value={String(rows.length)} icon={<ShieldAlert className="h-4 w-4" />} accent />
        <KpiCard label="Enabled" value={String(rows.filter((r) => r.enabled).length)} icon={<ShieldCheck className="h-4 w-4" />} />
        <KpiCard label="Allow" value={String(rows.filter((r) => r.action === "Allow").length)} icon={<ShieldCheck className="h-4 w-4" />} />
        <KpiCard label="Deny/Drop" value={String(rows.filter((r) => r.action !== "Allow").length)} icon={<AlertTriangle className="h-4 w-4" />} />
      </div>

      <SectionCard title="Firewall Rules" description={`${rows.length} rules in chain`}>
        {loading ? <PageLoader /> : rows.length === 0 ? (
          <EmptyState icon={<ShieldAlert className="h-5 w-5" />} title="No rules" description="Create a firewall rule to get started." />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Port</TableHead>
                  <TableHead>Protocol</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Bandwidth</TableHead>
                  <TableHead>Enabled</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-mono text-xs">{r.position}</TableCell>
                    <TableCell className="font-mono text-xs">{r.source}</TableCell>
                    <TableCell className="font-mono text-xs">{r.destination}</TableCell>
                    <TableCell className="font-mono text-xs">
                      <div>{r.destPort}</div>
                      <div className="text-[10px] text-muted-foreground">{r.dstPortType}</div>
                    </TableCell>
                    <TableCell><Badge variant="outline" className="text-[10px]">{r.protocol}</Badge></TableCell>
                    <TableCell>{actionBadge(r.action)}</TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">{r.description}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{r.bandwidth || "—"}</TableCell>
                    <TableCell>
                      <Switch checked={!!r.enabled} onCheckedChange={() => handleToggle(r)} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-0.5">
                        <Button variant="ghost" size="sm" onClick={() => handleMove(r, "up")} title="Move up">
                          <ArrowUp className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleMove(r, "down")} title="Move down">
                          <ArrowDown className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-primary hover:text-primary" onClick={() => setDeleteTarget(r)}>
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

      <DeleteDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Firewall Rule"
        description={<>Delete rule #{deleteTarget?.position}? This cannot be undone.</>}
        busy={busy}
      />
    </div>
  );
}

/* ---------- DoS Settings ---------- */

function DosSettingsPage({ moduleId, childId, grandchildId }: ViewProps) {
  const { mod, child, grandchild } = useModuleHeader(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const [rows, setRows] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  const load = React.useCallback(() => {
    setLoading(true);
    systemApi.list("dosSettings").then((res) => {
      setRows(res.data ?? []);
      setLoading(false);
    });
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const handleToggle = async (r: any) => {
    await systemApi.toggle("dosSettings", r.id, "status");
    toast({
      title: "DoS protection toggled",
      description: `${r.attackType} is now ${r.status === "Enabled" ? "Disabled" : "Enabled"}.`,
    });
    load();
  };

  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);

  return (
    <div className="space-y-6">
      <PageHeader
        title={grandchild?.label ?? "DoS Settings"}
        description="Enable or disable protection against various Denial of Service attack types."
        icon={<Settings2 className="h-5 w-5" />}
        breadcrumb={breadcrumb}
      />
      <SectionCard title="DoS Attack Protection" description={`${rows.length} attack types`}>
        {loading ? <PageLoader /> : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Attack Type</TableHead>
                  <TableHead>Protocol</TableHead>
                  <TableHead>Threshold</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.attackType}</TableCell>
                    <TableCell><Badge variant="outline" className="text-[10px]">{r.protocol}</Badge></TableCell>
                    <TableCell className="font-mono text-xs">{r.threshold}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch checked={r.status === "Enabled"} onCheckedChange={() => handleToggle(r)} />
                        <span className="text-xs text-muted-foreground">{r.status}</span>
                      </div>
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

/* ---------- DoS Bypass ---------- */

function DosBypassPage({ moduleId, childId, grandchildId }: ViewProps) {
  const { mod, child, grandchild } = useModuleHeader(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const [rows, setRows] = React.useState<any[]>([
    { id: 1, ip: "192.168.1.100", description: "Admin workstation" },
    { id: 2, ip: "10.10.5.20", description: "Monitoring server" },
  ]);
  const [form, setForm] = React.useState({ ip: "", description: "" });
  const [saving, setSaving] = React.useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.ip) return;
    setSaving(true);
    await systemApi.create("dosBypass", form);
    setSaving(false);
    setRows([...rows, { id: Date.now(), ...form }]);
    setForm({ ip: "", description: "" });
    toast({ title: "Bypass IP added", description: form.ip });
  };

  const handleDelete = (r: any) => {
    setRows(rows.filter((x) => x.id !== r.id));
    toast({ title: "Bypass IP removed", description: r.ip });
  };

  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);

  return (
    <div className="space-y-6">
      <PageHeader
        title={grandchild?.label ?? "DoS Bypass"}
        description="Add IP addresses that bypass DoS protection checks."
        icon={<Settings2 className="h-5 w-5" />}
        breadcrumb={breadcrumb}
      />
      <SectionCard title="Add Bypass IP" description="IPs here will not be subjected to DoS protection thresholds">
        <form onSubmit={handleAdd} className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_2fr_auto] md:items-end">
          <div className="space-y-2">
            <Label>IP Address</Label>
            <Input value={form.ip} onChange={(e) => setForm({ ...form, ip: e.target.value })} placeholder="192.168.1.100" required />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Why is this IP bypassed?" />
          </div>
          <Button type="submit" disabled={saving}>
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
            Add
          </Button>
        </form>
      </SectionCard>

      <SectionCard title="Bypass Entries" description={`${rows.length} entries`}>
        {rows.length === 0 ? (
          <EmptyState icon={<ShieldCheck className="h-5 w-5" />} title="No bypass entries" description="Add an IP to bypass DoS protection." />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-mono text-xs">{r.ip}</TableCell>
                    <TableCell className="text-xs">{r.description}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="text-primary hover:text-primary" onClick={() => handleDelete(r)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
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

/* ---------- Free Sites ---------- */

function FreeSitesPage({ moduleId, childId, grandchildId }: ViewProps) {
  const { mod, child, grandchild } = useModuleHeader(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const [rows, setRows] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [deleteTarget, setDeleteTarget] = React.useState<any | null>(null);
  const [busy, setBusy] = React.useState(false);

  const load = React.useCallback(() => {
    setLoading(true);
    systemApi.list("freeSites").then((res) => {
      setRows(res.data ?? []);
      setLoading(false);
    });
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const handleToggle = async (r: any) => {
    await systemApi.toggle("freeSites", r.id, "status");
    toast({
      title: "Free site toggled",
      description: `${r.siteName} is now ${r.status === "Active" ? "Inactive" : "Active"}.`,
    });
    load();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setBusy(true);
    await systemApi.delete("freeSites", deleteTarget.id);
    setBusy(false);
    toast({ title: "Free site deleted", description: deleteTarget.siteName });
    setDeleteTarget(null);
    load();
  };

  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);

  return (
    <div className="space-y-6">
      <PageHeader
        title={grandchild?.label ?? "Free Sites"}
        description="Zero-rated sites that don't count against user data quota."
        icon={<Settings2 className="h-5 w-5" />}
        breadcrumb={breadcrumb}
        actions={
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Site
          </Button>
        }
      />
      <SectionCard title="Free Sites" description={`${rows.length} sites`}>
        {loading ? <PageLoader /> : rows.length === 0 ? (
          <EmptyState icon={<Globe className="h-5 w-5" />} title="No free sites" description="Add a zero-rated site." />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Site Name</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.siteName}</TableCell>
                    <TableCell className="font-mono text-xs">{r.url}</TableCell>
                    <TableCell>
                      <Switch checked={r.status === "Active"} onCheckedChange={() => handleToggle(r)} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="text-primary hover:text-primary" onClick={() => setDeleteTarget(r)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </SectionCard>

      <FreeSiteDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSaved={() => { setDialogOpen(false); load(); }}
      />

      <DeleteDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Free Site"
        description={<>Delete free site <span className="font-medium text-foreground">{deleteTarget?.siteName}</span>?</>}
        busy={busy}
      />
    </div>
  );
}

function FreeSiteDialog({
  open, onOpenChange, onSaved,
}: { open: boolean; onOpenChange: (o: boolean) => void; onSaved: () => void; }) {
  const { toast } = useToast();
  const [saving, setSaving] = React.useState(false);
  const [form, setForm] = React.useState({ siteName: "", url: "" });

  React.useEffect(() => {
    if (open) setForm({ siteName: "", url: "" });
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await systemApi.create("freeSites", { ...form, status: "Active" });
    setSaving(false);
    toast({ title: "Free site added", description: form.siteName });
    onSaved();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Free Site</DialogTitle>
          <DialogDescription>Zero-rated sites don&apos;t count against user data quota.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Site Name</Label>
            <Input value={form.siteName} onChange={(e) => setForm({ ...form, siteName: e.target.value })} placeholder="Google" required />
          </div>
          <div className="space-y-2">
            <Label>URL</Label>
            <Input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="google.com" required />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>Cancel</Button>
            <Button type="submit" disabled={saving}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Add Site
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* ===================================================================== *
 *  DHCP
 * ===================================================================== */

/* ---------- Manage DHCP ---------- */

function ManageDhcpPage({ moduleId, childId, grandchildId }: ViewProps) {
  const { mod, child, grandchild } = useModuleHeader(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const [rows, setRows] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<any | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<any | null>(null);
  const [busy, setBusy] = React.useState(false);

  const load = React.useCallback(() => {
    setLoading(true);
    systemApi.list("dhcpScopes").then((res) => {
      setRows(res.data ?? []);
      setLoading(false);
    });
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setBusy(true);
    await systemApi.delete("dhcpScopes", deleteTarget.id);
    setBusy(false);
    toast({ title: "DHCP scope deleted", description: `${deleteTarget.startIp} – ${deleteTarget.endIp}` });
    setDeleteTarget(null);
    load();
  };

  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);

  return (
    <div className="space-y-6">
      <PageHeader
        title={grandchild?.label ?? "Manage DHCP"}
        description="Configure DHCP scopes for IP address allocation."
        icon={<Settings2 className="h-5 w-5" />}
        breadcrumb={breadcrumb}
        actions={
          <Button onClick={() => { setEditing(null); setDialogOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" /> Add Scope
          </Button>
        }
      />
      <SectionCard title="DHCP Scopes" description={`${rows.length} scopes`}>
        {loading ? <PageLoader /> : rows.length === 0 ? (
          <EmptyState icon={<Wifi className="h-5 w-5" />} title="No DHCP scopes" description="Add a DHCP scope." />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Interface</TableHead>
                  <TableHead>Start IP</TableHead>
                  <TableHead>End IP</TableHead>
                  <TableHead>Netmask</TableHead>
                  <TableHead>Gateway</TableHead>
                  <TableHead>DNS</TableHead>
                  <TableHead>Lease Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-mono text-xs">{r.interface}</TableCell>
                    <TableCell className="font-mono text-xs">{r.startIp}</TableCell>
                    <TableCell className="font-mono text-xs">{r.endIp}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{r.netmask}</TableCell>
                    <TableCell className="font-mono text-xs">{r.gateway}</TableCell>
                    <TableCell className="font-mono text-xs">{r.dns}</TableCell>
                    <TableCell className="text-xs">{r.leaseTime}</TableCell>
                    <TableCell><StatusBadge status={r.status} /></TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => { setEditing(r); setDialogOpen(true); }}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-primary hover:text-primary" onClick={() => setDeleteTarget(r)}>
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

      <DhcpScopeDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editing={editing}
        onSaved={() => { setDialogOpen(false); load(); }}
      />

      <DeleteDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete DHCP Scope"
        description={<>Delete DHCP scope <span className="font-mono text-foreground">{deleteTarget?.startIp}–{deleteTarget?.endIp}</span>?</>}
        busy={busy}
      />
    </div>
  );
}

function DhcpScopeDialog({
  open, onOpenChange, editing, onSaved,
}: { open: boolean; onOpenChange: (o: boolean) => void; editing: any | null; onSaved: () => void; }) {
  const { toast } = useToast();
  const [saving, setSaving] = React.useState(false);
  const [form, setForm] = React.useState({
    interface: "eth0",
    startIp: "",
    endIp: "",
    netmask: "255.255.255.0",
    gateway: "",
    dns: "",
    leaseTime: "24h",
    status: "Active",
  });

  React.useEffect(() => {
    if (editing) {
      setForm({
        interface: editing.interface ?? "eth0",
        startIp: editing.startIp ?? "",
        endIp: editing.endIp ?? "",
        netmask: editing.netmask ?? "255.255.255.0",
        gateway: editing.gateway ?? "",
        dns: editing.dns ?? "",
        leaseTime: editing.leaseTime ?? "24h",
        status: editing.status ?? "Active",
      });
    } else {
      setForm({ interface: "eth0", startIp: "", endIp: "", netmask: "255.255.255.0", gateway: "", dns: "", leaseTime: "24h", status: "Active" });
    }
  }, [editing, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    if (editing) {
      await systemApi.update("dhcpScopes", { ...form, id: editing.id });
      toast({ title: "Scope updated" });
    } else {
      await systemApi.create("dhcpScopes", form);
      toast({ title: "Scope created" });
    }
    setSaving(false);
    onSaved();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editing ? "Edit DHCP Scope" : "Add DHCP Scope"}</DialogTitle>
          <DialogDescription>Configure an IP address allocation scope.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Interface</Label>
              <Input value={form.interface} onChange={(e) => setForm({ ...form, interface: e.target.value })} placeholder="eth0" />
            </div>
            <div className="space-y-2">
              <Label>Lease Time</Label>
              <Input value={form.leaseTime} onChange={(e) => setForm({ ...form, leaseTime: e.target.value })} placeholder="24h" />
            </div>
            <div className="space-y-2">
              <Label>Start IP</Label>
              <Input value={form.startIp} onChange={(e) => setForm({ ...form, startIp: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>End IP</Label>
              <Input value={form.endIp} onChange={(e) => setForm({ ...form, endIp: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Netmask</Label>
              <Input value={form.netmask} onChange={(e) => setForm({ ...form, netmask: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Gateway</Label>
              <Input value={form.gateway} onChange={(e) => setForm({ ...form, gateway: e.target.value })} />
            </div>
            <div className="space-y-2 col-span-2">
              <Label>DNS Servers</Label>
              <Input value={form.dns} onChange={(e) => setForm({ ...form, dns: e.target.value })} placeholder="8.8.8.8,8.8.4.4" />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>Cancel</Button>
            <Button type="submit" disabled={saving}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {editing ? "Save Changes" : "Create Scope"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* ---------- IP Leasing ---------- */

function IpLeasingPage({ moduleId, childId, grandchildId }: ViewProps) {
  const { mod, child, grandchild } = useModuleHeader(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const [rows, setRows] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [poolFilter, setPoolFilter] = React.useState("all");

  React.useEffect(() => {
    systemApi.list("dhcpLeases").then((res) => {
      setRows(res.data ?? []);
      setLoading(false);
    });
  }, []);

  const filtered = rows.filter((r) => {
    if (poolFilter !== "all" && r.pool !== poolFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        r.ip?.toLowerCase().includes(q) ||
        r.mac?.toLowerCase().includes(q) ||
        r.host?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleRelease = (r: any) => {
    toast({
      title: "Lease released",
      description: `Released ${r.ip} (${r.host}).`,
    });
    setRows(rows.filter((x) => x.ip !== r.ip));
  };

  const pools = Array.from(new Set(rows.map((r) => r.pool)));
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);

  return (
    <div className="space-y-6">
      <PageHeader
        title={grandchild?.label ?? "IP Leasing Report"}
        description="View active and expired DHCP leases."
        icon={<Settings2 className="h-5 w-5" />}
        breadcrumb={breadcrumb}
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard label="Total Leases" value={String(rows.length)} icon={<Wifi className="h-4 w-4" />} accent />
        <KpiCard label="Active" value={String(rows.filter((r) => r.status === "Active").length)} icon={<Activity className="h-4 w-4" />} />
        <KpiCard label="Expired" value={String(rows.filter((r) => r.status === "Expired").length)} icon={<AlertTriangle className="h-4 w-4" />} />
        <KpiCard label="Pools" value={String(pools.length)} icon={<Layers className="h-4 w-4" />} />
      </div>

      <ActionBar>
        <div className="relative flex-1 max-w-xs">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search IP / MAC / host…"
            className="h-8 pl-8 text-xs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={poolFilter} onValueChange={setPoolFilter}>
          <SelectTrigger className="h-8 w-[140px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All pools</SelectItem>
            {pools.map((p) => (
              <SelectItem key={p} value={p}>{p}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </ActionBar>

      <SectionCard title="DHCP Leases" description={`${filtered.length} of ${rows.length} leases`}>
        {loading ? <PageLoader /> : filtered.length === 0 ? (
          <EmptyState icon={<Wifi className="h-5 w-5" />} title="No leases found" description="Try a different filter." />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>IP</TableHead>
                  <TableHead>MAC</TableHead>
                  <TableHead>Host</TableHead>
                  <TableHead>Pool</TableHead>
                  <TableHead>Lease Start</TableHead>
                  <TableHead>Lease End</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((r) => (
                  <TableRow key={r.ip}>
                    <TableCell className="font-mono text-xs">{r.ip}</TableCell>
                    <TableCell className="font-mono text-xs">{r.mac}</TableCell>
                    <TableCell className="text-xs">{r.host}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{r.pool}</TableCell>
                    <TableCell className="text-xs">{r.leaseStart}</TableCell>
                    <TableCell className="text-xs">{r.leaseEnd}</TableCell>
                    <TableCell><StatusBadge status={r.status} /></TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRelease(r)}
                        disabled={r.status !== "Active"}
                      >
                        Release
                      </Button>
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

/* ===================================================================== *
 *  SERVICES (leaf child)
 * ===================================================================== */

function ServicesPage({ moduleId, childId }: ViewProps) {
  const { mod, child } = useModuleHeader(moduleId, childId);
  const { toast } = useToast();
  const [rows, setRows] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [busyId, setBusyId] = React.useState<string | null>(null);

  const load = React.useCallback(() => {
    setLoading(true);
    systemApi.list("services").then((res) => {
      setRows(res.data ?? []);
      setLoading(false);
    });
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const handleControl = async (r: any, command: "start" | "stop" | "restart") => {
    setBusyId(r.id);
    await systemApi.serviceControl("services", r.id, command);
    setBusyId(null);
    toast({
      title: `Service ${command}`,
      description: `${r.name}: ${command} command issued.`,
    });
    load();
  };

  const handleAutoStart = async (r: any) => {
    await systemApi.toggle("services", r.id, "autoStart");
    toast({
      title: "Auto-start toggled",
      description: `${r.name} auto-start ${r.autoStart ? "disabled" : "enabled"}.`,
    });
    load();
  };

  if (!mod || !child) return null;

  return (
    <div className="space-y-6">
      <PageHeader
        title={child.label}
        description={child.desc}
        icon={<mod.icon className="h-5 w-5" />}
        breadcrumb={[{ label: "Cryptsk" }, { label: mod.label }, { label: child.label }]}
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard label="Total Services" value={String(rows.length)} icon={<Server className="h-4 w-4" />} accent />
        <KpiCard label="Running" value={String(rows.filter((r) => r.status === "Running").length)} icon={<Activity className="h-4 w-4" />} />
        <KpiCard label="Stopped" value={String(rows.filter((r) => r.status === "Stopped").length)} icon={<Power className="h-4 w-4" />} />
        <KpiCard label="Auto-Start" value={String(rows.filter((r) => r.autoStart).length)} icon={<RefreshCw className="h-4 w-4" />} />
      </div>

      <SectionCard title="System Services" description={`${rows.length} services`}>
        {loading ? <PageLoader /> : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Auto-Start</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.name}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{r.description}</TableCell>
                    <TableCell><StatusBadge status={r.status} /></TableCell>
                    <TableCell>
                      <Switch checked={!!r.autoStart} onCheckedChange={() => handleAutoStart(r)} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {busyId === r.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleControl(r, "start")}
                              disabled={r.status === "Running"}
                            >
                              <Play className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleControl(r, "stop")}
                              disabled={r.status === "Stopped"}
                            >
                              <Square className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleControl(r, "restart")}
                            >
                              <RefreshCw className="h-3.5 w-3.5" />
                            </Button>
                          </>
                        )}
                      </div>
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

/* ===================================================================== *
 *  CONSOLE (leaf child)
 * ===================================================================== */

function ConsolePage({ moduleId, childId }: ViewProps) {
  const { mod, child } = useModuleHeader(moduleId, childId);
  const { toast } = useToast();
  const [saving, setSaving] = React.useState(false);
  const [showOld, setShowOld] = React.useState(false);
  const [showNew, setShowNew] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [form, setForm] = React.useState({
    consoleUsername: "administrator",
    guiadminpass: "",
    newconsolepass: "",
    newconsolepass1: "",
  });
  const [error, setError] = React.useState("");

  if (!mod || !child) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.newconsolepass !== form.newconsolepass1) {
      setError("New password and confirmation do not match.");
      return;
    }
    if (form.newconsolepass.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    toast({ title: "Console password reset", description: "Password updated successfully." });
    setForm({ ...form, guiadminpass: "", newconsolepass: "", newconsolepass1: "" });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={child.label}
        description={child.desc}
        icon={<mod.icon className="h-5 w-5" />}
        breadcrumb={[{ label: "Cryptsk" }, { label: mod.label }, { label: child.label }]}
      />
      <form onSubmit={handleSubmit} className="space-y-6">
        <SectionCard title="Reset Console Password" description="Update the console administrator credentials.">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Console Username</Label>
              <Input
                value={form.consoleUsername}
                onChange={(e) => setForm({ ...form, consoleUsername: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Current GUI Admin Password</Label>
              <div className="relative">
                <Input
                  type={showOld ? "text" : "password"}
                  value={form.guiadminpass}
                  onChange={(e) => setForm({ ...form, guiadminpass: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowOld((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showOld ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>New Console Password</Label>
              <div className="relative">
                <Input
                  type={showNew ? "text" : "password"}
                  value={form.newconsolepass}
                  onChange={(e) => setForm({ ...form, newconsolepass: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNew((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showNew ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Confirm New Password</Label>
              <div className="relative">
                <Input
                  type={showConfirm ? "text" : "password"}
                  value={form.newconsolepass1}
                  onChange={(e) => setForm({ ...form, newconsolepass1: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirm ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            {error && (
              <p className="md:col-span-2 text-xs text-primary flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {error}
              </p>
            )}
          </div>
        </SectionCard>
        <div className="flex items-center justify-end gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <KeyRound className="mr-2 h-4 w-4" />}
            Reset Password
          </Button>
        </div>
      </form>
    </div>
  );
}

/* ===================================================================== *
 *  MANAGE DATA
 * ===================================================================== */

/* ---------- Backup ---------- */

function BackupPage({ moduleId, childId, grandchildId }: ViewProps) {
  const { mod, child, grandchild } = useModuleHeader(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const [rows, setRows] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [busy, setBusy] = React.useState(false);

  const load = React.useCallback(() => {
    setLoading(true);
    systemApi.list("backups").then((res) => {
      setRows(res.data ?? []);
      setLoading(false);
    });
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const handleBackupNow = async () => {
    setBusy(true);
    await systemApi.create("backups", {
      type: "Full",
      filename: `backup_${new Date().toISOString().slice(0, 10).replace(/-/g, "")}_${new Date().getHours().toString().padStart(2, "0")}00.tar.gz`,
      size: "—",
      date: new Date().toLocaleString(),
      status: "In Progress",
    });
    setBusy(false);
    toast({ title: "Backup started", description: "A new full backup is in progress." });
    load();
  };

  const handleDownload = (r: any) => {
    toast({ title: "Download started", description: r.filename });
  };

  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);

  return (
    <div className="space-y-6">
      <PageHeader
        title={grandchild?.label ?? "Backup"}
        description="View and trigger system backups."
        icon={<Settings2 className="h-5 w-5" />}
        breadcrumb={breadcrumb}
        actions={
          <Button onClick={handleBackupNow} disabled={busy}>
            {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
            Backup Now
          </Button>
        }
      />
      <SectionCard title="Backup Records" description={`${rows.length} records`}>
        {loading ? <PageLoader /> : rows.length === 0 ? (
          <EmptyState icon={<Database className="h-5 w-5" />} title="No backups" description="Trigger your first backup." />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Filename</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell><Badge variant="outline" className="text-[10px]">{r.type}</Badge></TableCell>
                    <TableCell className="font-mono text-xs">{r.filename}</TableCell>
                    <TableCell className="text-xs">{r.size}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{r.date}</TableCell>
                    <TableCell><StatusBadge status={r.status} /></TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleDownload(r)} disabled={r.status !== "Completed"}>
                        <Download className="h-3.5 w-3.5" />
                      </Button>
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

/* ---------- Backup Schedule ---------- */

function BackupSchedulePage({ moduleId, childId, grandchildId }: ViewProps) {
  const { mod, child, grandchild } = useModuleHeader(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const [rows, setRows] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<any | null>(null);

  const load = React.useCallback(() => {
    setLoading(true);
    systemApi.list("backupSchedules").then((res) => {
      setRows(res.data ?? []);
      setLoading(false);
    });
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const handleToggle = async (r: any) => {
    await systemApi.toggle("backupSchedules", r.id, "enabled");
    toast({ title: "Schedule toggled", description: `${r.type} ${r.enabled ? "disabled" : "enabled"}.` });
    load();
  };

  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);

  return (
    <div className="space-y-6">
      <PageHeader
        title={grandchild?.label ?? "Backup Schedule"}
        description="Configure automatic backup schedules."
        icon={<Settings2 className="h-5 w-5" />}
        breadcrumb={breadcrumb}
        actions={
          <Button onClick={() => { setEditing(null); setDialogOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" /> Add Schedule
          </Button>
        }
      />
      <SectionCard title="Schedules" description={`${rows.length} schedules`}>
        {loading ? <PageLoader /> : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Retention</TableHead>
                  <TableHead>Enabled</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.type}</TableCell>
                    <TableCell><Badge variant="outline" className="text-[10px]">{r.frequency}</Badge></TableCell>
                    <TableCell className="font-mono text-xs">{r.time}</TableCell>
                    <TableCell className="text-xs">{r.retention}</TableCell>
                    <TableCell><Switch checked={!!r.enabled} onCheckedChange={() => handleToggle(r)} /></TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => { setEditing(r); setDialogOpen(true); }}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </SectionCard>

      <BackupScheduleDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editing={editing}
        onSaved={() => { setDialogOpen(false); load(); }}
      />
    </div>
  );
}

function BackupScheduleDialog({
  open, onOpenChange, editing, onSaved,
}: { open: boolean; onOpenChange: (o: boolean) => void; editing: any | null; onSaved: () => void; }) {
  const { toast } = useToast();
  const [saving, setSaving] = React.useState(false);
  const [form, setForm] = React.useState({
    type: "Full Backup",
    frequency: "Daily",
    time: "01:00",
    retention: "7 days",
    enabled: true,
  });

  React.useEffect(() => {
    if (editing) {
      setForm({
        type: editing.type ?? "Full Backup",
        frequency: editing.frequency ?? "Daily",
        time: editing.time ?? "01:00",
        retention: editing.retention ?? "7 days",
        enabled: editing.enabled ?? true,
      });
    } else {
      setForm({ type: "Full Backup", frequency: "Daily", time: "01:00", retention: "7 days", enabled: true });
    }
  }, [editing, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    if (editing) {
      await systemApi.update("backupSchedules", { ...form, id: editing.id });
      toast({ title: "Schedule updated" });
    } else {
      await systemApi.create("backupSchedules", form);
      toast({ title: "Schedule created" });
    }
    setSaving(false);
    onSaved();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editing ? "Edit Schedule" : "Add Backup Schedule"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Full Backup">Full Backup</SelectItem>
                  <SelectItem value="Audit Log">Audit Log</SelectItem>
                  <SelectItem value="RRD">RRD</SelectItem>
                  <SelectItem value="User Session">User Session</SelectItem>
                  <SelectItem value="Web Surfing">Web Surfing</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Frequency</Label>
              <Select value={form.frequency} onValueChange={(v) => setForm({ ...form, frequency: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Daily">Daily</SelectItem>
                  <SelectItem value="Weekly">Weekly</SelectItem>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Time</Label>
              <Input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Retention</Label>
              <Input value={form.retention} onChange={(e) => setForm({ ...form, retention: e.target.value })} placeholder="7 days" />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>Cancel</Button>
            <Button type="submit" disabled={saving}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {editing ? "Save Changes" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* ---------- Restore ---------- */

function RestorePage({ moduleId, childId, grandchildId }: ViewProps) {
  const { mod, child, grandchild } = useModuleHeader(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const [backups, setBackups] = React.useState<any[]>([]);
  const [selected, setSelected] = React.useState("");
  const [restoring, setRestoring] = React.useState(false);

  React.useEffect(() => {
    systemApi.list("backups").then((res) => {
      const completed = (res.data ?? []).filter((b: any) => b.status === "Completed");
      setBackups(completed);
      if (completed.length > 0) setSelected(completed[0].filename);
    });
  }, []);

  const handleRestore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    setRestoring(true);
    await new Promise((r) => setTimeout(r, 800));
    setRestoring(false);
    toast({ title: "Restore started", description: `Restoring from ${selected}.` });
  };

  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);

  return (
    <div className="space-y-6">
      <PageHeader
        title={grandchild?.label ?? "Restore"}
        description="Restore system data from a previous backup."
        icon={<Settings2 className="h-5 w-5" />}
        breadcrumb={breadcrumb}
      />
      <form onSubmit={handleRestore}>
        <SectionCard title="Restore From Backup" description="Select a backup to restore">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Backup File</Label>
              <Select value={selected} onValueChange={setSelected}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {backups.map((b) => (
                    <SelectItem key={b.id} value={b.filename}>{b.filename} ({b.date})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="rounded-lg border border-dashed border-border bg-muted/20 p-6 text-center">
              <Upload className="mx-auto h-6 w-6 text-muted-foreground" />
              <p className="mt-2 text-sm font-medium">Or upload a backup file</p>
              <p className="text-xs text-muted-foreground">.tar.gz files only — file upload is a mock for now.</p>
              <Button type="button" variant="outline" className="mt-3" onClick={() => toast({ title: "File upload", description: "Upload is mocked in this demo." })}>
                <Upload className="mr-2 h-4 w-4" /> Choose File
              </Button>
            </div>
            <div className="rounded-md border border-amber-500/30 bg-amber-500/5 p-3 text-xs text-amber-700 dark:text-amber-400">
              <AlertTriangle className="inline h-3.5 w-3.5 mr-1" />
              Restoring will overwrite current data. This action cannot be undone.
            </div>
          </div>
          <div className="mt-4 flex items-center justify-end">
            <Button type="submit" disabled={restoring || !selected}>
              {restoring ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
              Restore Now
            </Button>
          </div>
        </SectionCard>
      </form>
    </div>
  );
}

/* ---------- Auto Purge ---------- */

function AutoPurgePage({ moduleId, childId, grandchildId }: ViewProps) {
  const { mod, child, grandchild } = useModuleHeader(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const [saving, setSaving] = React.useState(false);
  const [form, setForm] = React.useState({
    purgeType: "Audit Log",
    retentionDays: "30",
    enabled: true,
  });

  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    setSaving(false);
    toast({
      title: "Auto purge saved",
      description: `${form.purgeType} retention: ${form.retentionDays} days.`,
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={grandchild?.label ?? "Auto Purge"}
        description="Configure automatic purging of old log data."
        icon={<Settings2 className="h-5 w-5" />}
        breadcrumb={breadcrumb}
      />
      <form onSubmit={handleSubmit}>
        <SectionCard title="Auto Purge Configuration">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Purge Type</Label>
              <Select value={form.purgeType} onValueChange={(v) => setForm({ ...form, purgeType: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Audit Log">Audit Log</SelectItem>
                  <SelectItem value="Access Log">Access Log</SelectItem>
                  <SelectItem value="User Session">User Session</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Retention (days)</Label>
              <Input
                type="number"
                min="1"
                value={form.retentionDays}
                onChange={(e) => setForm({ ...form, retentionDays: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-3 pt-6">
              <Switch
                id="purgeEnabled"
                checked={form.enabled}
                onCheckedChange={(v) => setForm({ ...form, enabled: v })}
              />
              <Label htmlFor="purgeEnabled" className="cursor-pointer">Enabled</Label>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-end">
            <Button type="submit" disabled={saving}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save Configuration
            </Button>
          </div>
        </SectionCard>
      </form>
    </div>
  );
}

/* ---------- Manual Purge ---------- */

function ManualPurgePage({ moduleId, childId, grandchildId }: ViewProps) {
  const { mod, child, grandchild } = useModuleHeader(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const [purging, setPurging] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [form, setForm] = React.useState({
    purgeType: "Audit Log",
    fromDate: "",
    toDate: "",
  });

  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);

  const handlePurge = async () => {
    setPurging(true);
    await new Promise((r) => setTimeout(r, 700));
    setPurging(false);
    setConfirmOpen(false);
    toast({
      title: "Purge complete",
      description: `${form.purgeType} from ${form.fromDate || "—"} to ${form.toDate || "—"} purged.`,
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={grandchild?.label ?? "Manual Purge"}
        description="Manually purge log data within a specific date range."
        icon={<Settings2 className="h-5 w-5" />}
        breadcrumb={breadcrumb}
      />
      <SectionCard title="Manual Purge">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label>Purge Type</Label>
            <Select value={form.purgeType} onValueChange={(v) => setForm({ ...form, purgeType: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Audit Log">Audit Log</SelectItem>
                <SelectItem value="Access Log">Access Log</SelectItem>
                <SelectItem value="User Session">User Session</SelectItem>
                <SelectItem value="Web Surfing">Web Surfing</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>From Date</Label>
            <Input type="date" value={form.fromDate} onChange={(e) => setForm({ ...form, fromDate: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>To Date</Label>
            <Input type="date" value={form.toDate} onChange={(e) => setForm({ ...form, toDate: e.target.value })} />
          </div>
        </div>
        <div className="mt-4 rounded-md border border-amber-500/30 bg-amber-500/5 p-3 text-xs text-amber-700 dark:text-amber-400">
          <AlertTriangle className="inline h-3.5 w-3.5 mr-1" />
          Manual purge is irreversible. Make sure you have a backup.
        </div>
        <div className="mt-4 flex items-center justify-end">
          <Button onClick={() => setConfirmOpen(true)} disabled={purging}>
            {purging ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
            Purge Now
          </Button>
        </div>
      </SectionCard>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Manual Purge</DialogTitle>
            <DialogDescription>
              This will permanently delete <span className="font-medium text-foreground">{form.purgeType}</span> records
              {form.fromDate && ` from ${form.fromDate}`}
              {form.toDate && ` to ${form.toDate}`}. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)} disabled={purging}>Cancel</Button>
            <Button variant="destructive" onClick={handlePurge} disabled={purging}>
              {purging ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
              Confirm Purge
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ---------- Migrate User ---------- */

function MigrateUserPage({ moduleId, childId, grandchildId }: ViewProps) {
  const { mod, child, grandchild } = useModuleHeader(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const [migrating, setMigrating] = React.useState(false);
  const [form, setForm] = React.useState({
    sourceZone: "",
    targetZone: "",
    username: "",
  });

  const zones = [
    { id: "zone-1", name: "Bhiwani Zone 1" },
    { id: "zone-2", name: "Bhiwani Zone 2" },
    { id: "zone-3", name: "Hisar Zone" },
    { id: "zone-4", name: "Rohtak Zone" },
  ];

  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);

  const handleMigrate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.sourceZone === form.targetZone) {
      toast({ title: "Invalid selection", description: "Source and target zones must differ.", variant: "destructive" });
      return;
    }
    setMigrating(true);
    await new Promise((r) => setTimeout(r, 800));
    setMigrating(false);
    toast({
      title: "User migrated",
      description: `${form.username || "User"} moved from ${form.sourceZone} to ${form.targetZone}.`,
    });
    setForm({ sourceZone: "", targetZone: "", username: "" });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={grandchild?.label ?? "Migrate User"}
        description="Move a user account from one zone to another."
        icon={<Settings2 className="h-5 w-5" />}
        breadcrumb={breadcrumb}
      />
      <form onSubmit={handleMigrate}>
        <SectionCard title="Migration Form">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Source Zone</Label>
              <Select value={form.sourceZone} onValueChange={(v) => setForm({ ...form, sourceZone: v })}>
                <SelectTrigger><SelectValue placeholder="Select source zone" /></SelectTrigger>
                <SelectContent>
                  {zones.map((z) => (
                    <SelectItem key={z.id} value={z.id}>{z.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Target Zone</Label>
              <Select value={form.targetZone} onValueChange={(v) => setForm({ ...form, targetZone: v })}>
                <SelectTrigger><SelectValue placeholder="Select target zone" /></SelectTrigger>
                <SelectContent>
                  {zones.map((z) => (
                    <SelectItem key={z.id} value={z.id}>{z.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Username</Label>
              <Input
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                placeholder="aakash080198"
              />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-end">
            <Button type="submit" disabled={migrating || !form.sourceZone || !form.targetZone}>
              {migrating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ArrowRight className="mr-2 h-4 w-4" />}
              Migrate User
            </Button>
          </div>
        </SectionCard>
      </form>
    </div>
  );
}

/* ---------- Authentication Logs ---------- */

const AUTH_LOGS_MOCK = [
  { id: 1, timestamp: "04 Oct 2026 01:14:22", username: "aakash080198", ip: "10.172.0.30", nas: "sms-core-01", result: "Accept" },
  { id: 2, timestamp: "04 Oct 2026 01:13:55", username: "shubham99", ip: "10.172.0.201", nas: "sms-core-01", result: "Accept" },
  { id: 3, timestamp: "04 Oct 2026 01:12:18", username: "rajeshk", ip: "10.10.3.36", nas: "sms-core-02", result: "Reject" },
  { id: 4, timestamp: "04 Oct 2026 01:10:42", username: "vinay123", ip: "10.10.4.55", nas: "sms-core-02", result: "Accept" },
  { id: 5, timestamp: "04 Oct 2026 01:09:11", username: "priya_s", ip: "10.172.1.55", nas: "sms-core-01", result: "Accept" },
  { id: 6, timestamp: "04 Oct 2026 01:07:30", username: "abhimanyu", ip: "10.172.1.78", nas: "sms-core-02", result: "Reject" },
  { id: 7, timestamp: "04 Oct 2026 01:05:00", username: "abhishek_j", ip: "10.10.3.92", nas: "sms-core-01", result: "Accept" },
  { id: 8, timestamp: "04 Oct 2026 01:02:44", username: "deepak_m", ip: "10.172.0.150", nas: "sms-core-02", result: "Reject" },
];

function AuthLogsPage({ moduleId, childId, grandchildId }: ViewProps) {
  const { mod, child, grandchild } = useModuleHeader(moduleId, childId, grandchildId);
  const [search, setSearch] = React.useState("");
  const [resultFilter, setResultFilter] = React.useState("all");
  const [fromDate, setFromDate] = React.useState("");
  const [toDate, setToDate] = React.useState("");

  const filtered = AUTH_LOGS_MOCK.filter((r) => {
    if (resultFilter !== "all" && r.result !== resultFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!r.username.toLowerCase().includes(q) && !r.ip.includes(q) && !r.nas.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const accepts = AUTH_LOGS_MOCK.filter((r) => r.result === "Accept").length;
  const rejects = AUTH_LOGS_MOCK.filter((r) => r.result === "Reject").length;

  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);

  return (
    <div className="space-y-6">
      <PageHeader
        title={grandchild?.label ?? "Authentication Logs"}
        description="RADIUS authentication logs for user sessions."
        icon={<Settings2 className="h-5 w-5" />}
        breadcrumb={breadcrumb}
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard label="Total Attempts" value={String(AUTH_LOGS_MOCK.length)} icon={<KeyRound className="h-4 w-4" />} accent />
        <KpiCard label="Accepted" value={String(accepts)} icon={<ShieldCheck className="h-4 w-4" />} />
        <KpiCard label="Rejected" value={String(rejects)} icon={<ShieldAlert className="h-4 w-4" />} />
        <KpiCard label="Success Rate" value={`${Math.round((accepts / AUTH_LOGS_MOCK.length) * 100)}%`} icon={<Activity className="h-4 w-4" />} />
      </div>

      <ActionBar>
        <div className="relative flex-1 max-w-xs">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search user / IP / NAS…"
            className="h-8 pl-8 text-xs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={resultFilter} onValueChange={setResultFilter}>
          <SelectTrigger className="h-8 w-[120px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All results</SelectItem>
            <SelectItem value="Accept">Accept</SelectItem>
            <SelectItem value="Reject">Reject</SelectItem>
          </SelectContent>
        </Select>
        <Input type="date" className="h-8 w-[150px]" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
        <Input type="date" className="h-8 w-[150px]" value={toDate} onChange={(e) => setToDate(e.target.value)} />
      </ActionBar>

      <SectionCard title="RADIUS Auth Logs" description={`${filtered.length} of ${AUTH_LOGS_MOCK.length} entries`}>
        <div className="overflow-x-auto max-h-96 overflow-y-auto scrollbar-thin">
          <Table>
            <TableHeader className="sticky top-0 bg-card z-10">
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>IP</TableHead>
                <TableHead>NAS</TableHead>
                <TableHead>Result</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-mono text-xs text-muted-foreground">{r.timestamp}</TableCell>
                  <TableCell className="font-medium text-xs">{r.username}</TableCell>
                  <TableCell className="font-mono text-xs">{r.ip}</TableCell>
                  <TableCell className="text-xs">{r.nas}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={r.result === "Accept"
                        ? "bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400"
                        : "bg-primary/10 text-primary hover:bg-primary/10"}
                    >
                      {r.result}
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

/* ===================================================================== *
 *  CLIENT SERVICES — Parameters
 * ===================================================================== */

function ClientServicesParametersPage({ moduleId, childId, grandchildId }: ViewProps) {
  const { mod, child, grandchild } = useModuleHeader(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const [saving, setSaving] = React.useState(false);
  const [form, setForm] = React.useState({
    sessionTimeout: "60",
    maxLoginAttempts: "5",
    lockoutDuration: "15",
    passwordMinLength: "8",
    requireSpecialChars: true,
    requireNumbers: true,
    allowMultipleSessions: false,
    enableSelfCare: true,
  });

  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    setSaving(false);
    toast({ title: "Parameters saved", description: "Client service parameters updated." });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={grandchild?.label ?? "Parameters"}
        description="Configure client service parameters: session, login, and password policies."
        icon={<Settings2 className="h-5 w-5" />}
        breadcrumb={breadcrumb}
      />
      <form onSubmit={handleSubmit} className="space-y-6">
        <SectionCard title="Session & Login" description="Session timeout and login attempt limits">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Session Timeout (minutes)</Label>
              <Input type="number" min="1" value={form.sessionTimeout} onChange={(e) => setForm({ ...form, sessionTimeout: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Max Login Attempts</Label>
              <Input type="number" min="1" value={form.maxLoginAttempts} onChange={(e) => setForm({ ...form, maxLoginAttempts: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Lockout Duration (minutes)</Label>
              <Input type="number" min="1" value={form.lockoutDuration} onChange={(e) => setForm({ ...form, lockoutDuration: e.target.value })} />
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Password Policy" description="Rules for user passwords">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Minimum Length</Label>
              <Input type="number" min="6" value={form.passwordMinLength} onChange={(e) => setForm({ ...form, passwordMinLength: e.target.value })} />
            </div>
            <div className="flex items-center gap-6 pt-6">
              <div className="flex items-center gap-2">
                <Switch id="reqSpecial" checked={form.requireSpecialChars} onCheckedChange={(v) => setForm({ ...form, requireSpecialChars: v })} />
                <Label htmlFor="reqSpecial" className="cursor-pointer text-xs">Special chars</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch id="reqNum" checked={form.requireNumbers} onCheckedChange={(v) => setForm({ ...form, requireNumbers: v })} />
                <Label htmlFor="reqNum" className="cursor-pointer text-xs">Numbers</Label>
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Behavior" description="Session and self-care options">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Switch id="multiSession" checked={form.allowMultipleSessions} onCheckedChange={(v) => setForm({ ...form, allowMultipleSessions: v })} />
              <div>
                <Label htmlFor="multiSession" className="cursor-pointer">Allow Multiple Concurrent Sessions</Label>
                <p className="text-xs text-muted-foreground">Allow the same user to log in from multiple devices simultaneously.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch id="selfCare" checked={form.enableSelfCare} onCheckedChange={(v) => setForm({ ...form, enableSelfCare: v })} />
              <div>
                <Label htmlFor="selfCare" className="cursor-pointer">Enable Self-Care Portal</Label>
                <p className="text-xs text-muted-foreground">Let users change passwords and view usage from a self-service portal.</p>
              </div>
            </div>
          </div>
        </SectionCard>

        <div className="flex items-center justify-end gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Parameters
          </Button>
        </div>
      </form>
    </div>
  );
}

/* ===================================================================== *
 *  ACL
 * ===================================================================== */

/* ---------- Access Control ---------- */

const ACL_MODULES_MOCK = [
  { id: 1, module: "System", view: true, create: true, update: true, delete: false },
  { id: 2, module: "Policy", view: true, create: true, update: true, delete: false },
  { id: 3, module: "Package", view: true, create: true, update: true, delete: true },
  { id: 4, module: "User", view: true, create: true, update: true, delete: true },
  { id: 5, module: "Payment Gateway", view: true, create: false, update: false, delete: false },
  { id: 6, module: "Ticket Management", view: true, create: true, update: true, delete: false },
  { id: 7, module: "Reports", view: true, create: false, update: false, delete: false },
  { id: 8, module: "Inventory", view: true, create: true, update: true, delete: false },
];

function AccessControlPage({ moduleId, childId, grandchildId }: ViewProps) {
  const { mod, child, grandchild } = useModuleHeader(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const [rows, setRows] = React.useState(ACL_MODULES_MOCK);

  const toggle = (id: number, field: "view" | "create" | "update" | "delete") => {
    setRows(rows.map((r) => (r.id === id ? { ...r, [field]: !r[field] } : r)));
  };

  const handleSave = () => {
    toast({ title: "Access control saved", description: "Module permissions updated." });
  };

  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);

  return (
    <div className="space-y-6">
      <PageHeader
        title={grandchild?.label ?? "Access Control"}
        description="Configure module-level view/create/update/delete permissions."
        icon={<Settings2 className="h-5 w-5" />}
        breadcrumb={breadcrumb}
        actions={
          <Button onClick={handleSave}><Save className="mr-2 h-4 w-4" /> Save Permissions</Button>
        }
      />
      <SectionCard title="Module Permissions" description={`${rows.length} modules`}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Module</TableHead>
                <TableHead className="text-center">View</TableHead>
                <TableHead className="text-center">Create</TableHead>
                <TableHead className="text-center">Update</TableHead>
                <TableHead className="text-center">Delete</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.module}</TableCell>
                  <TableCell className="text-center"><Checkbox checked={r.view} onCheckedChange={() => toggle(r.id, "view")} /></TableCell>
                  <TableCell className="text-center"><Checkbox checked={r.create} onCheckedChange={() => toggle(r.id, "create")} /></TableCell>
                  <TableCell className="text-center"><Checkbox checked={r.update} onCheckedChange={() => toggle(r.id, "update")} /></TableCell>
                  <TableCell className="text-center"><Checkbox checked={r.delete} onCheckedChange={() => toggle(r.id, "delete")} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>
    </div>
  );
}

/* ---------- User Type ---------- */

const ACL_ROLES_MOCK = [
  { id: 1, name: "Super Admin", description: "Full access to all modules", users: 1 },
  { id: 2, name: "Zone Admin", description: "Zone-scoped admin access", users: 8 },
  { id: 3, name: "L1 Support", description: "Ticket + user view access", users: 12 },
  { id: 4, name: "L2 Support", description: "Ticket + user edit access", users: 5 },
  { id: 5, name: "Accountant", description: "Invoice + payment access", users: 3 },
  { id: 6, name: "Auditor", description: "Read-only access to all reports", users: 2 },
];

function UserTypePage({ moduleId, childId, grandchildId }: ViewProps) {
  const { mod, child, grandchild } = useModuleHeader(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);

  return (
    <div className="space-y-6">
      <PageHeader
        title={grandchild?.label ?? "User Type"}
        description="Manage user roles and their permission scopes."
        icon={<Settings2 className="h-5 w-5" />}
        breadcrumb={breadcrumb}
        actions={
          <Button onClick={() => toast({ title: "Add role", description: "Role form will open." })}>
            <Plus className="mr-2 h-4 w-4" /> Add Role
          </Button>
        }
      />
      <SectionCard title="Roles" description={`${ACL_ROLES_MOCK.length} roles`}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>User Count</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ACL_ROLES_MOCK.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.name}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{r.description}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px]">{r.users} users</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm" onClick={() => toast({ title: "Edit role", description: r.name })}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-primary hover:text-primary" onClick={() => toast({ title: "Delete role", description: r.name })}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
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

/* ---------- User Access ---------- */

const USER_ACCESS_MOCK = [
  { id: 1, username: "administrator", role: "Super Admin", zones: "All", status: "Active" },
  { id: 2, username: "zone1admin", role: "Zone Admin", zones: "Bhiwani Zone 1", status: "Active" },
  { id: 3, username: "zone2admin", role: "Zone Admin", zones: "Bhiwani Zone 2", status: "Active" },
  { id: 4, username: "support_l1_1", role: "L1 Support", zones: "Hisar Zone", status: "Active" },
  { id: 5, username: "support_l1_2", role: "L1 Support", zones: "Rohtak Zone", status: "Inactive" },
  { id: 6, username: "accountant1", role: "Accountant", zones: "All", status: "Active" },
];

function UserAccessPage({ moduleId, childId, grandchildId }: ViewProps) {
  const { mod, child, grandchild } = useModuleHeader(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);

  return (
    <div className="space-y-6">
      <PageHeader
        title={grandchild?.label ?? "User Access"}
        description="Manage console user access rights and zone assignments."
        icon={<Settings2 className="h-5 w-5" />}
        breadcrumb={breadcrumb}
        actions={
          <Button onClick={() => toast({ title: "Add user access", description: "Form will open." })}>
            <Plus className="mr-2 h-4 w-4" /> Add User Access
          </Button>
        }
      />
      <SectionCard title="User Access" description={`${USER_ACCESS_MOCK.length} entries`}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Zones</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {USER_ACCESS_MOCK.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-mono text-xs">{r.username}</TableCell>
                  <TableCell><Badge variant="outline" className="text-[10px]">{r.role}</Badge></TableCell>
                  <TableCell className="text-xs">{r.zones}</TableCell>
                  <TableCell><StatusBadge status={r.status} /></TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => toast({ title: "Edit access", description: r.username })}>
                      <Pencil className="h-3.5 w-3.5" />
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

/* ---------- Console ACL ---------- */

function ConsoleAclPage({ moduleId, childId, grandchildId }: ViewProps) {
  const { mod, child, grandchild } = useModuleHeader(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const [saving, setSaving] = React.useState(false);
  const [form, setForm] = React.useState({
    enableConsoleAcl: true,
    sessionTimeout: "30",
    maxFailedLogins: "5",
    ipWhitelist: "10.172.0.0/24,10.10.3.0/24",
    enforceHttps: true,
  });

  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    setSaving(false);
    toast({ title: "Console ACL saved", description: "Console access control settings updated." });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={grandchild?.label ?? "Console ACL"}
        description="Configure console access control — IP whitelists, login limits, and HTTPS enforcement."
        icon={<Settings2 className="h-5 w-5" />}
        breadcrumb={breadcrumb}
      />
      <form onSubmit={handleSubmit}>
        <SectionCard title="Console Access Control">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Switch id="enableAcl" checked={form.enableConsoleAcl} onCheckedChange={(v) => setForm({ ...form, enableConsoleAcl: v })} />
              <div>
                <Label htmlFor="enableAcl" className="cursor-pointer">Enable Console ACL</Label>
                <p className="text-xs text-muted-foreground">When enabled, the rules below apply to all console logins.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Session Timeout (minutes)</Label>
                <Input type="number" value={form.sessionTimeout} onChange={(e) => setForm({ ...form, sessionTimeout: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Max Failed Logins</Label>
                <Input type="number" value={form.maxFailedLogins} onChange={(e) => setForm({ ...form, maxFailedLogins: e.target.value })} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>IP Whitelist (CIDR, comma-separated)</Label>
                <Textarea
                  rows={2}
                  value={form.ipWhitelist}
                  onChange={(e) => setForm({ ...form, ipWhitelist: e.target.value })}
                  placeholder="10.172.0.0/24,10.10.3.0/24"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch id="httpsEnforce" checked={form.enforceHttps} onCheckedChange={(v) => setForm({ ...form, enforceHttps: v })} />
              <Label htmlFor="httpsEnforce" className="cursor-pointer">Enforce HTTPS for Console Access</Label>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-end">
            <Button type="submit" disabled={saving}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save Console ACL
            </Button>
          </div>
        </SectionCard>
      </form>
    </div>
  );
}

/* ===================================================================== *
 *  DYNAMIC DNS
 * ===================================================================== */

/* ---------- Register Host ---------- */

function DdnsRegisterPage({ moduleId, childId, grandchildId }: ViewProps) {
  const { mod, child, grandchild } = useModuleHeader(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const [saving, setSaving] = React.useState(false);
  const [form, setForm] = React.useState({
    hostname: "",
    domain: "cryptsk.ddns.net",
    ipAddress: "",
    updateUrl: "https://update.cryptsk.com/nic/update",
    username: "",
    password: "",
  });

  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    toast({
      title: "DDNS host registered",
      description: `${form.hostname}.${form.domain} → ${form.ipAddress}`,
    });
    setForm({ ...form, hostname: "", ipAddress: "", username: "", password: "" });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={grandchild?.label ?? "Register Host"}
        description="Register a new dynamic DNS host."
        icon={<Settings2 className="h-5 w-5" />}
        breadcrumb={breadcrumb}
      />
      <form onSubmit={handleSubmit}>
        <SectionCard title="DDNS Host Registration">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Hostname</Label>
              <Input value={form.hostname} onChange={(e) => setForm({ ...form, hostname: e.target.value })} placeholder="myhost" required />
            </div>
            <div className="space-y-2">
              <Label>Domain</Label>
              <Select value={form.domain} onValueChange={(v) => setForm({ ...form, domain: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="cryptsk.ddns.net">cryptsk.ddns.net</SelectItem>
                  <SelectItem value="cryptsk.dyndns.org">cryptsk.dyndns.org</SelectItem>
                  <SelectItem value="cryptsk.no-ip.com">cryptsk.no-ip.com</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>IP Address</Label>
              <Input value={form.ipAddress} onChange={(e) => setForm({ ...form, ipAddress: e.target.value })} placeholder="0.0.0.0" required />
            </div>
            <div className="space-y-2">
              <Label>Update URL</Label>
              <Input value={form.updateUrl} onChange={(e) => setForm({ ...form, updateUrl: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Username</Label>
              <Input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-end">
            <Button type="submit" disabled={saving}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Globe className="mr-2 h-4 w-4" />}
              Register Host
            </Button>
          </div>
        </SectionCard>
      </form>
    </div>
  );
}

/* ---------- Manage Hosts ---------- */

const DDNS_HOSTS_MOCK = [
  { id: 1, hostname: "bhiwani-gw", domain: "cryptsk.ddns.net", ip: "103.205.148.26", lastUpdate: "04 Oct 01:00", status: "Active" },
  { id: 2, hostname: "hisar-gw", domain: "cryptsk.ddns.net", ip: "103.205.151.129", lastUpdate: "04 Oct 00:55", status: "Active" },
  { id: 3, hostname: "rohtak-gw", domain: "cryptsk.dyndns.org", ip: "—", lastUpdate: "03 Oct 22:11", status: "Inactive" },
];

function DdnsManagePage({ moduleId, childId, grandchildId }: ViewProps) {
  const { mod, child, grandchild } = useModuleHeader(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);

  return (
    <div className="space-y-6">
      <PageHeader
        title={grandchild?.label ?? "Manage Hosts"}
        description="View, update, and delete dynamic DNS hosts."
        icon={<Settings2 className="h-5 w-5" />}
        breadcrumb={breadcrumb}
      />
      <SectionCard title="DDNS Hosts" description={`${DDNS_HOSTS_MOCK.length} hosts`}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hostname</TableHead>
                <TableHead>Domain</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Last Update</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {DDNS_HOSTS_MOCK.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-mono text-xs font-semibold">{r.hostname}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{r.domain}</TableCell>
                  <TableCell className="font-mono text-xs">{r.ip}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{r.lastUpdate}</TableCell>
                  <TableCell><StatusBadge status={r.status} /></TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toast({ title: "IP updated", description: `${r.hostname}.${r.domain} IP refreshed.` })}
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary hover:text-primary"
                        onClick={() => toast({ title: "Host deleted", description: r.hostname })}
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
      </SectionCard>
    </div>
  );
}

/* ===================================================================== *
 *  CAPTIVE PORTAL
 * ===================================================================== */

const CAPTIVE_TEMPLATES_MOCK = [
  { id: 1, name: "Default Login", type: "Hotspot", status: "Active" },
  { id: 2, name: "Hotel Premium", type: "Hotel", status: "Active" },
  { id: 3, name: "Cafe Express", type: "Cafe", status: "Inactive" },
];

function CaptiveCreatePage({ moduleId, childId, grandchildId }: ViewProps) {
  const { mod, child, grandchild } = useModuleHeader(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const [saving, setSaving] = React.useState(false);
  const [form, setForm] = React.useState({
    name: "",
    type: "Hotspot",
    description: "",
  });

  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    setSaving(false);
    toast({ title: "Template created", description: `${form.name} (${form.type})` });
    setForm({ name: "", type: "Hotspot", description: "" });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={grandchild?.label ?? "Create Captive Portal Template"}
        description="Create a new captive portal login page template."
        icon={<Settings2 className="h-5 w-5" />}
        breadcrumb={breadcrumb}
      />
      <form onSubmit={handleSubmit}>
        <SectionCard title="Template Details">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Template Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Hotel Premium" required />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Hotspot">Hotspot</SelectItem>
                  <SelectItem value="Hotel">Hotel</SelectItem>
                  <SelectItem value="Cafe">Cafe</SelectItem>
                  <SelectItem value="Airport">Airport</SelectItem>
                  <SelectItem value="Leased Line">Leased Line</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={2}
                placeholder="Template description…"
              />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-end">
            <Button type="submit" disabled={saving}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Create Template
            </Button>
          </div>
        </SectionCard>
      </form>
    </div>
  );
}

function CaptiveManagePage({ moduleId, childId, grandchildId }: ViewProps) {
  const { mod, child, grandchild } = useModuleHeader(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const [rows, setRows] = React.useState(CAPTIVE_TEMPLATES_MOCK);

  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);

  const handleToggle = (r: any) => {
    setRows(rows.map((x) => (x.id === r.id ? { ...x, status: x.status === "Active" ? "Inactive" : "Active" } : x)));
    toast({ title: "Template toggled", description: r.name });
  };

  const handleDelete = (r: any) => {
    setRows(rows.filter((x) => x.id !== r.id));
    toast({ title: "Template deleted", description: r.name });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={grandchild?.label ?? "Manage Captive Portal Templates"}
        description="View, edit, and delete captive portal templates."
        icon={<Settings2 className="h-5 w-5" />}
        breadcrumb={breadcrumb}
      />
      <SectionCard title="Templates" description={`${rows.length} templates`}>
        {rows.length === 0 ? (
          <EmptyState icon={<Plug className="h-5 w-5" />} title="No templates" description="Create a captive portal template." />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.name}</TableCell>
                    <TableCell><Badge variant="outline" className="text-[10px]">{r.type}</Badge></TableCell>
                    <TableCell>
                      <Switch checked={r.status === "Active"} onCheckedChange={() => handleToggle(r)} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => toast({ title: "Edit template", description: r.name })}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-primary hover:text-primary" onClick={() => handleDelete(r)}>
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
    </div>
  );
}

/* ===================================================================== *
 *  NAS MANAGEMENT — NAS IP Configuration
 * ===================================================================== */

function NasIpConfigPage({ moduleId, childId, grandchildId }: ViewProps) {
  const { mod, child, grandchild } = useModuleHeader(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const [rows, setRows] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<any | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<any | null>(null);
  const [busy, setBusy] = React.useState(false);

  const load = React.useCallback(() => {
    setLoading(true);
    systemApi.list("nasDevices").then((res) => {
      setRows(res.data ?? []);
      setLoading(false);
    });
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setBusy(true);
    await systemApi.delete("nasDevices", deleteTarget.id);
    setBusy(false);
    toast({ title: "NAS device deleted", description: deleteTarget.name });
    setDeleteTarget(null);
    load();
  };

  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);

  return (
    <div className="space-y-6">
      <PageHeader
        title={grandchild?.label ?? "NAS IP Configuration"}
        description="Configure RADIUS NAS clients (network access servers)."
        icon={<Settings2 className="h-5 w-5" />}
        breadcrumb={breadcrumb}
        actions={
          <Button onClick={() => { setEditing(null); setDialogOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" /> Add NAS
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard label="Total NAS" value={String(rows.length)} icon={<HardDrive className="h-4 w-4" />} accent />
        <KpiCard label="Online" value={String(rows.filter((r) => r.status === "Online").length)} icon={<Activity className="h-4 w-4" />} />
        <KpiCard label="Offline" value={String(rows.filter((r) => r.status === "Offline").length)} icon={<Power className="h-4 w-4" />} />
        <KpiCard label="Total Sessions" value={String(rows.reduce((a, r) => a + (r.sessions || 0), 0))} icon={<Wifi className="h-4 w-4" />} />
      </div>

      <SectionCard title="NAS Devices" description={`${rows.length} devices`}>
        {loading ? <PageLoader /> : rows.length === 0 ? (
          <EmptyState icon={<HardDrive className="h-5 w-5" />} title="No NAS devices" description="Add a RADIUS client." />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>IP</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Secret</TableHead>
                  <TableHead>Sessions</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.name}</TableCell>
                    <TableCell className="font-mono text-xs">{r.ip}</TableCell>
                    <TableCell><Badge variant="outline" className="text-[10px]">{r.type}</Badge></TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{r.secret}</TableCell>
                    <TableCell className="text-xs">{r.sessions}</TableCell>
                    <TableCell><StatusBadge status={r.status} /></TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => { setEditing(r); setDialogOpen(true); }}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-primary hover:text-primary" onClick={() => setDeleteTarget(r)}>
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

      <NasDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editing={editing}
        onSaved={() => { setDialogOpen(false); load(); }}
      />

      <DeleteDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete NAS Device"
        description={<>Delete NAS <span className="font-medium text-foreground">{deleteTarget?.name}</span>?</>}
        busy={busy}
      />
    </div>
  );
}

function NasDialog({
  open, onOpenChange, editing, onSaved,
}: { open: boolean; onOpenChange: (o: boolean) => void; editing: any | null; onSaved: () => void; }) {
  const { toast } = useToast();
  const [saving, setSaving] = React.useState(false);
  const [form, setForm] = React.useState({
    name: "",
    ip: "",
    type: "24online SMS",
    secret: "",
    status: "Online",
    sessions: 0,
  });

  React.useEffect(() => {
    if (editing) {
      setForm({
        name: editing.name ?? "",
        ip: editing.ip ?? "",
        type: editing.type ?? "24online SMS",
        secret: editing.secret ?? "",
        status: editing.status ?? "Online",
        sessions: editing.sessions ?? 0,
      });
    } else {
      setForm({ name: "", ip: "", type: "24online SMS", secret: "", status: "Online", sessions: 0 });
    }
  }, [editing, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    if (editing) {
      await systemApi.update("nasDevices", { ...form, id: editing.id });
      toast({ title: "NAS updated" });
    } else {
      await systemApi.create("nasDevices", form);
      toast({ title: "NAS created" });
    }
    setSaving(false);
    onSaved();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editing ? "Edit NAS" : "Add NAS Device"}</DialogTitle>
          <DialogDescription>Configure a RADIUS client device.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>IP Address</Label>
              <Input value={form.ip} onChange={(e) => setForm({ ...form, ip: e.target.value })} placeholder="0.0.0.0" required />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="24online SMS">24online SMS</SelectItem>
                  <SelectItem value="BRAS">BRAS</SelectItem>
                  <SelectItem value="Hotspot">Hotspot</SelectItem>
                  <SelectItem value="Mikrotik">Mikrotik</SelectItem>
                  <SelectItem value="Cisco">Cisco</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Secret</Label>
              <Input value={form.secret} onChange={(e) => setForm({ ...form, secret: e.target.value })} placeholder="••••••••" required />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>Cancel</Button>
            <Button type="submit" disabled={saving}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {editing ? "Save Changes" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* ===================================================================== *
 *  STATUS TRACKER
 * ===================================================================== */

/* ---------- Add Device ---------- */

function AddDevicePage({ moduleId, childId, grandchildId }: ViewProps) {
  const { mod, child, grandchild } = useModuleHeader(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const [saving, setSaving] = React.useState(false);
  const [form, setForm] = React.useState({
    name: "",
    ip: "",
    type: "Switch",
    community: "public",
  });

  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await systemApi.create("managedDevices", {
      ...form,
      status: "Online",
      lastSeen: "just now",
    });
    setSaving(false);
    toast({ title: "Device added", description: `${form.name} (${form.ip})` });
    setForm({ name: "", ip: "", type: "Switch", community: "public" });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={grandchild?.label ?? "Add Device"}
        description="Register a new device for status tracking via SNMP."
        icon={<Settings2 className="h-5 w-5" />}
        breadcrumb={breadcrumb}
      />
      <form onSubmit={handleSubmit}>
        <SectionCard title="Device Details">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Device Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Core-Switch-02" required />
            </div>
            <div className="space-y-2">
              <Label>IP Address</Label>
              <Input value={form.ip} onChange={(e) => setForm({ ...form, ip: e.target.value })} placeholder="0.0.0.0" required />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Switch">Switch</SelectItem>
                  <SelectItem value="Router">Router</SelectItem>
                  <SelectItem value="OLT">OLT</SelectItem>
                  <SelectItem value="Server">Server</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>SNMP Community</Label>
              <Input value={form.community} onChange={(e) => setForm({ ...form, community: e.target.value })} placeholder="public" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-end">
            <Button type="submit" disabled={saving}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
              Add Device
            </Button>
          </div>
        </SectionCard>
      </form>
    </div>
  );
}

/* ---------- Manage Devices ---------- */

function ManageDevicesPage({ moduleId, childId, grandchildId }: ViewProps) {
  const { mod, child, grandchild } = useModuleHeader(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const [rows, setRows] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [deleteTarget, setDeleteTarget] = React.useState<any | null>(null);
  const [busy, setBusy] = React.useState(false);

  const load = React.useCallback(() => {
    setLoading(true);
    systemApi.list("managedDevices").then((res) => {
      setRows(res.data ?? []);
      setLoading(false);
    });
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setBusy(true);
    await systemApi.delete("managedDevices", deleteTarget.id);
    setBusy(false);
    toast({ title: "Device deleted", description: deleteTarget.name });
    setDeleteTarget(null);
    load();
  };

  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);

  return (
    <div className="space-y-6">
      <PageHeader
        title={grandchild?.label ?? "Manage Devices"}
        description="View and manage tracked network devices."
        icon={<Settings2 className="h-5 w-5" />}
        breadcrumb={breadcrumb}
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard label="Total" value={String(rows.length)} icon={<Cpu className="h-4 w-4" />} accent />
        <KpiCard label="Online" value={String(rows.filter((r) => r.status === "Online").length)} icon={<Activity className="h-4 w-4" />} />
        <KpiCard label="Warning" value={String(rows.filter((r) => r.status === "Warning").length)} icon={<AlertTriangle className="h-4 w-4" />} />
        <KpiCard label="Offline" value={String(rows.filter((r) => r.status === "Offline").length)} icon={<Power className="h-4 w-4" />} />
      </div>

      <SectionCard title="Devices" description={`${rows.length} devices`}>
        {loading ? <PageLoader /> : rows.length === 0 ? (
          <EmptyState icon={<Cpu className="h-5 w-5" />} title="No devices" description="Add a device to track." />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>IP</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Seen</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.name}</TableCell>
                    <TableCell className="font-mono text-xs">{r.ip}</TableCell>
                    <TableCell><Badge variant="outline" className="text-[10px]">{r.type}</Badge></TableCell>
                    <TableCell><StatusBadge status={r.status} /></TableCell>
                    <TableCell className="text-xs text-muted-foreground">{r.lastSeen}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => toast({ title: "Edit device", description: r.name })}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-primary hover:text-primary" onClick={() => setDeleteTarget(r)}>
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

      <DeleteDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Device"
        description={<>Delete device <span className="font-medium text-foreground">{deleteTarget?.name}</span>?</>}
        busy={busy}
      />
    </div>
  );
}

/* ---------- Device Logs ---------- */

function DeviceLogsPage({ moduleId, childId, grandchildId }: ViewProps) {
  const { mod, child, grandchild } = useModuleHeader(moduleId, childId, grandchildId);
  const [rows, setRows] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [levelFilter, setLevelFilter] = React.useState("all");

  const load = React.useCallback(() => {
    setLoading(true);
    systemApi.list("deviceLogs").then((res) => {
      setRows(res.data ?? []);
      setLoading(false);
    });
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const filtered = rows.filter((r) => {
    if (levelFilter !== "all" && r.level !== levelFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return r.device?.toLowerCase().includes(q) || r.message?.toLowerCase().includes(q);
    }
    return true;
  });

  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);

  return (
    <div className="space-y-6">
      <PageHeader
        title={grandchild?.label ?? "Device Logs"}
        description="Real-time logs from all tracked devices."
        icon={<Settings2 className="h-5 w-5" />}
        breadcrumb={breadcrumb}
        actions={
          <Button variant="outline" size="sm" onClick={load}>
            <RefreshCw className="mr-2 h-3.5 w-3.5" /> Refresh
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard label="Total Logs" value={String(rows.length)} icon={<FileText className="h-4 w-4" />} accent />
        <KpiCard label="INFO" value={String(rows.filter((r) => r.level === "INFO").length)} icon={<Info className="h-4 w-4" />} />
        <KpiCard label="WARN" value={String(rows.filter((r) => r.level === "WARN").length)} icon={<AlertTriangle className="h-4 w-4" />} />
        <KpiCard label="ERROR" value={String(rows.filter((r) => r.level === "ERROR").length)} icon={<AlertCircle className="h-4 w-4" />} />
      </div>

      <ActionBar>
        <div className="relative flex-1 max-w-xs">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search device / message…"
            className="h-8 pl-8 text-xs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={levelFilter} onValueChange={setLevelFilter}>
          <SelectTrigger className="h-8 w-[120px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All levels</SelectItem>
            <SelectItem value="INFO">INFO</SelectItem>
            <SelectItem value="WARN">WARN</SelectItem>
            <SelectItem value="ERROR">ERROR</SelectItem>
          </SelectContent>
        </Select>
      </ActionBar>

      <SectionCard title="Device Logs" description={`${filtered.length} of ${rows.length} entries`}>
        {loading ? <PageLoader /> : filtered.length === 0 ? (
          <EmptyState icon={<FileText className="h-5 w-5" />} title="No logs" description="No matching log entries." />
        ) : (
          <div className="max-h-96 overflow-y-auto scrollbar-thin">
            <Table>
              <TableHeader className="sticky top-0 bg-card z-10">
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Device</TableHead>
                  <TableHead>Message</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-mono text-xs text-muted-foreground whitespace-nowrap">{r.timestamp}</TableCell>
                    <TableCell><LevelBadge level={r.level} /></TableCell>
                    <TableCell className="font-mono text-xs">{r.device}</TableCell>
                    <TableCell className="text-xs">{r.message}</TableCell>
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

/* ===================================================================== *
 *  SYSTEM SETTINGS (leaf child)
 * ===================================================================== */

function SystemSettingsPage({ moduleId, childId }: ViewProps) {
  const { mod, child } = useModuleHeader(moduleId, childId);
  const { toast } = useToast();
  const [saving, setSaving] = React.useState(false);
  const [form, setForm] = React.useState({
    proactiveReports: true,
    guiDensity: "comfortable",
    language: "en",
    timezone: "Asia/Kolkata",
    dateFormat: "DD/MM/YYYY",
  });

  if (!mod || !child) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    setSaving(false);
    toast({ title: "Settings saved", description: "System settings updated." });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={child.label}
        description={child.desc}
        icon={<mod.icon className="h-5 w-5" />}
        breadcrumb={[{ label: "Cryptsk" }, { label: mod.label }, { label: child.label }]}
      />
      <form onSubmit={handleSubmit} className="space-y-6">
        <SectionCard title="Proactive Reports" description="Automatic alerts for system health">
          <div className="flex items-center gap-3">
            <Switch
              id="proactiveReports"
              checked={form.proactiveReports}
              onCheckedChange={(v) => setForm({ ...form, proactiveReports: v })}
            />
            <div>
              <Label htmlFor="proactiveReports" className="cursor-pointer">Enable Proactive Reports</Label>
              <p className="text-xs text-muted-foreground">Send daily health reports and anomaly alerts via email.</p>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="GUI Preferences" description="Customize the admin interface">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>GUI Density</Label>
              <Select value={form.guiDensity} onValueChange={(v) => setForm({ ...form, guiDensity: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="compact">Compact</SelectItem>
                  <SelectItem value="comfortable">Comfortable</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Language</Label>
              <Select value={form.language} onValueChange={(v) => setForm({ ...form, language: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">Hindi</SelectItem>
                  <SelectItem value="mr">Marathi</SelectItem>
                  <SelectItem value="pa">Punjabi</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Timezone</Label>
              <Select value={form.timezone} onValueChange={(v) => setForm({ ...form, timezone: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST)</SelectItem>
                  <SelectItem value="Asia/Dubai">Asia/Dubai (GST)</SelectItem>
                  <SelectItem value="UTC">UTC</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Date Format</Label>
              <Select value={form.dateFormat} onValueChange={(v) => setForm({ ...form, dateFormat: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                  <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                  <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </SectionCard>

        <div className="flex items-center justify-end gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Settings
          </Button>
        </div>
      </form>
    </div>
  );
}

/* ===================================================================== *
 *  DASHBOARD CONF (leaf child)
 * ===================================================================== */

const DASHBOARD_LAYOUTS_MOCK = [
  { id: 1, name: "Dashboard 1", description: "Live users, sessions, bandwidth, top plans", columns: 3, lastEdited: "01 Oct 2026" },
  { id: 2, name: "Dashboard 2", description: "Revenue, alerts, tickets, device status", columns: 3, lastEdited: "29 Sep 2026" },
];

function DashboardConfPage({ moduleId, childId }: ViewProps) {
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
        actions={
          <Button onClick={() => toast({ title: "Add layout", description: "Layout builder will open." })}>
            <Plus className="mr-2 h-4 w-4" /> Add Layout
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {DASHBOARD_LAYOUTS_MOCK.map((d) => (
          <SectionCard key={d.id} title={d.name} description={`Last edited: ${d.lastEdited}`}>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">{d.description}</p>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((col) => (
                  <div key={col} className="rounded-md border border-dashed border-border bg-muted/20 p-3 text-center">
                    <LayoutGrid className="mx-auto h-4 w-4 text-muted-foreground" />
                    <p className="mt-1 text-[10px] text-muted-foreground">Col {col}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => toast({ title: "Edit layout", description: d.name })}>
                  <Pencil className="mr-1.5 h-3.5 w-3.5" /> Edit
                </Button>
                <Button variant="outline" size="sm" onClick={() => toast({ title: "Preview", description: d.name })}>
                  <ListChecks className="mr-1.5 h-3.5 w-3.5" /> Preview
                </Button>
              </div>
            </div>
          </SectionCard>
        ))}
      </div>
    </div>
  );
}

/* ===================================================================== *
 *  SYSTEM TOOLS — Packet Capture
 * ===================================================================== */

function PacketCapturePage({ moduleId, childId, grandchildId }: ViewProps) {
  const { mod, child, grandchild } = useModuleHeader(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const [capturing, setCapturing] = React.useState(false);
  const [form, setForm] = React.useState({
    interface: "eth0",
    filter: "",
    packetCount: "100",
    duration: "30",
  });
  const [output, setOutput] = React.useState<string[]>([]);

  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);

  const startCapture = async () => {
    setCapturing(true);
    setOutput([`# tcpdump -i ${form.interface} -c ${form.packetCount} ${form.filter ? `'${form.filter}'` : ""}`]);
    // Simulate streaming capture output
    const lines = [
      `tcpdump: listening on ${form.interface}, link-type EN10MB (Ethernet), capture size 262144 bytes`,
      `12:01:01.000234 IP 10.172.0.30.54321 > 8.8.8.8.53: 12345+ A? google.com. (29)`,
      `12:01:01.001123 IP 8.8.8.8.53 > 10.172.0.30.54321: 12345 1/0/0 A 142.250.190.46 (45)`,
      `12:01:01.002456 IP 10.172.0.30.49152 > 142.250.190.46.443: Flags [S], seq 12345, win 65535, length 0`,
      `12:01:01.003789 IP 142.250.190.46.443 > 10.172.0.30.49152: Flags [S.], seq 9999, ack 12346, win 65535, length 0`,
      `12:01:01.005012 IP6 fe80::1%eth0 > ff02::2: ICMP6, router solicitation, length 16`,
      `12:01:01.006234 ARP, Request who-has 10.172.0.1 tell 10.172.0.30, length 28`,
      `12:01:01.007456 ARP, Reply 10.172.0.1 is-at aa:bb:cc:dd:ee:ff, length 28`,
    ];
    for (const line of lines) {
      await new Promise((r) => setTimeout(r, 250));
      setOutput((o) => [...o, line]);
    }
    setOutput((o) => [...o, `${parseInt(form.packetCount)} packets captured`]);
    setOutput((o) => [...o, `tcpdump: captured ${parseInt(form.packetCount)} packets on ${form.interface}`]);
    setCapturing(false);
    toast({ title: "Capture complete", description: `${form.packetCount} packets on ${form.interface}` });
  };

  const stopCapture = () => {
    setCapturing(false);
    setOutput((o) => [...o, "^C", `# Capture stopped by user`]);
    toast({ title: "Capture stopped", description: "Packet capture halted." });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={grandchild?.label ?? "Packet Capture"}
        description="Capture network packets on a specific interface using BPF filters."
        icon={<Settings2 className="h-5 w-5" />}
        breadcrumb={breadcrumb}
      />

      <SectionCard title="Capture Configuration">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <Label>Interface</Label>
            <Select value={form.interface} onValueChange={(v) => setForm({ ...form, interface: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="eth0">eth0 (LAN)</SelectItem>
                <SelectItem value="eth1">eth1 (DMZ)</SelectItem>
                <SelectItem value="eth12">eth12 (WAN-1)</SelectItem>
                <SelectItem value="eth13">eth13 (WAN-2)</SelectItem>
                <SelectItem value="any">any</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Packet Count</Label>
            <Input type="number" min="1" value={form.packetCount} onChange={(e) => setForm({ ...form, packetCount: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Duration (sec)</Label>
            <Input type="number" min="1" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
          </div>
          <div className="space-y-2 lg:col-span-1 md:col-span-2">
            <Label>BPF Filter</Label>
            <Input value={form.filter} onChange={(e) => setForm({ ...form, filter: e.target.value })} placeholder="port 80 and host 10.0.0.1" />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          {!capturing ? (
            <Button onClick={startCapture}>
              <Play className="mr-2 h-4 w-4" /> Start Capture
            </Button>
          ) : (
            <Button variant="destructive" onClick={stopCapture}>
              <Square className="mr-2 h-4 w-4" /> Stop Capture
            </Button>
          )}
          {capturing && (
            <span className="text-xs text-muted-foreground flex items-center gap-2">
              <Loader2 className="h-3 w-3 animate-spin" /> Capturing on {form.interface}…
            </span>
          )}
        </div>
      </SectionCard>

      <SectionCard title="Capture Output" description="Live tcpdump output">
        {output.length === 0 ? (
          <EmptyState icon={<Wrench className="h-5 w-5" />} title="No output yet" description="Start a capture to see packets." />
        ) : (
          <div className="max-h-96 overflow-y-auto scrollbar-thin rounded-md bg-slate-950 p-3 font-mono text-xs text-emerald-400">
            {output.map((line, i) => (
              <div key={i} className="whitespace-pre-wrap break-all">{line}</div>
            ))}
            {capturing && <div className="animate-pulse">▋</div>}
          </div>
        )}
      </SectionCard>
    </div>
  );
}

/* ===================================================================== *
 *  CLIENT SERVICES — Real functional pages (6 grandchildren)
 * ===================================================================== */

/* --- Customized Images --- */
function CustomizedImagesPage({ moduleId, childId, grandchildId }: ViewProps) {
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const [images, setImages] = React.useState([
    { id: 1, name: "Top Banner", filename: "topbanner_default.jpg", size: "45 KB", uploaded: "01 Oct 2026" },
    { id: 2, name: "Bottom Banner", filename: "bottombanner_default.jpg", size: "32 KB", uploaded: "01 Oct 2026" },
    { id: 3, name: "Top Left Corner", filename: "topleft_logo.png", size: "12 KB", uploaded: "01 Oct 2026" },
    { id: 4, name: "Coupon Logo", filename: "coupon_logo.png", size: "8 KB", uploaded: "01 Oct 2026" },
    { id: 5, name: "Default Image", filename: "default_bg.jpg", size: "120 KB", uploaded: "01 Oct 2026" },
  ]);

  return (
    <div className="space-y-6">
      <PageHeader title="Customized Images" description="Upload and manage custom banner/logo images for the client portal." breadcrumb={breadcrumb} icon={<Settings2 className="h-5 w-5" />} />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard label="Total Images" value={String(images.length)} icon={<FileText className="h-4 w-4" />} accent />
        <KpiCard label="Default Set" value="5" icon={<Layers className="h-4 w-4" />} />
      </div>
      <SectionCard title="Uploaded Images" description="Custom images displayed on the client login page and my-account portal">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Image Type</TableHead><TableHead>Filename</TableHead><TableHead>Size</TableHead><TableHead>Uploaded</TableHead><TableHead className="text-right">Actions</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {images.map((img) => (
                <TableRow key={img.id}>
                  <TableCell className="font-medium">{img.name}</TableCell>
                  <TableCell className="font-mono text-xs">{img.filename}</TableCell>
                  <TableCell className="text-muted-foreground">{img.size}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{img.uploaded}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => toast({ title: "Replace image", description: `Upload new ${img.name}` })}><Upload className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="sm" className="text-primary" onClick={() => { setImages(images.filter((i) => i.id !== img.id)); toast({ title: "Image removed", description: img.name }); }}><Trash2 className="h-3.5 w-3.5" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>
      <SectionCard title="Upload New Image" description="Select an image type and upload a file (JPG/PNG/GIF, max 500 KB)">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label>Image Type</Label>
            <Select defaultValue="topfilename">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="topfilename">Top Banner</SelectItem>
                <SelectItem value="bottomfilename">Bottom Banner</SelectItem>
                <SelectItem value="topleftcornerfilename">Top Left Corner</SelectItem>
                <SelectItem value="couponlogo1">Coupon Logo 1</SelectItem>
                <SelectItem value="couponlogo2">Coupon Logo 2</SelectItem>
                <SelectItem value="defaultimage">Default Image</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>File</Label>
            <div className="flex h-10 items-center justify-center rounded-md border border-dashed border-border bg-muted/30 text-sm text-muted-foreground">
              <Upload className="mr-2 h-4 w-4" /> Choose file…
            </div>
          </div>
          <div className="flex items-end">
            <Button className="w-full" onClick={() => toast({ title: "Image uploaded", description: "Image has been uploaded successfully." })}>
              <Upload className="mr-2 h-4 w-4" /> Upload
            </Button>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

/* --- Forgot Password Config --- */
function ForgotPasswordConfigPage({ moduleId, childId, grandchildId }: ViewProps) {
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const [form, setForm] = React.useState({
    passwordConfiguration: "email",
    forgotPasswordTime: "30",
    limits: "3",
    otpLength: "6",
    otpExpiry: "5",
  });
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="space-y-6">
      <PageHeader title="Forgot Password Configuration" description="Configure how users recover forgotten passwords." breadcrumb={breadcrumb} icon={<Settings2 className="h-5 w-5" />} />
      <form onSubmit={(e) => { e.preventDefault(); toast({ title: "Configuration saved", description: "Forgot password settings updated." }); }}>
        <SectionCard title="Recovery Settings" description="Set the recovery method and limits">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Recovery Method</Label>
              <Select value={form.passwordConfiguration} onValueChange={(v) => set("passwordConfiguration", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email Verification</SelectItem>
                  <SelectItem value="sms">SMS OTP</SelectItem>
                  <SelectItem value="question">Security Question</SelectItem>
                  <SelectItem value="admin">Admin Approval</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="forgotPasswordTime">Recovery Link Validity (minutes)</Label>
              <Input id="forgotPasswordTime" type="number" min="1" value={form.forgotPasswordTime} onChange={(e) => set("forgotPasswordTime", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="limits">Max Attempts per Day</Label>
              <Input id="limits" type="number" min="1" value={form.limits} onChange={(e) => set("limits", e.target.value)} />
            </div>
            {form.passwordConfiguration === "sms" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="otpLength">OTP Length</Label>
                  <Input id="otpLength" type="number" min="4" max="8" value={form.otpLength} onChange={(e) => set("otpLength", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="otpExpiry">OTP Expiry (minutes)</Label>
                  <Input id="otpExpiry" type="number" min="1" value={form.otpExpiry} onChange={(e) => set("otpExpiry", e.target.value)} />
                </div>
              </>
            )}
          </div>
        </SectionCard>
        <div className="mt-4 flex justify-end">
          <Button type="submit"><Save className="mr-2 h-4 w-4" /> Save Configuration</Button>
        </div>
      </form>
    </div>
  );
}

/* --- Client GUI URLs --- */
function ClientGuiUrlsPage({ moduleId, childId, grandchildId }: ViewProps) {
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const [urls, setUrls] = React.useState([
    { id: "txtmyaccounturl", label: "My Account URL", value: "https://portal.cryptsk.com/myaccount" },
    { id: "txtpackageplansurl", label: "Package Plans URL", value: "https://portal.cryptsk.com/plans" },
    { id: "txtregusingpinurl", label: "Registration via PIN URL", value: "https://portal.cryptsk.com/register?mode=pin" },
    { id: "txtregwithoutusingpinurl", label: "Registration without PIN URL", value: "https://portal.cryptsk.com/register" },
    { id: "txtrecoverpasswdurl", label: "Recover Password URL", value: "https://portal.cryptsk.com/recover" },
    { id: "txtrenewusingpinurl", label: "Renew via PIN URL", value: "https://portal.cryptsk.com/renew?mode=pin" },
    { id: "txtrenewusingpgwayurl", label: "Renew via Payment Gateway URL", value: "https://portal.cryptsk.com/renew?mode=pg" },
    { id: "txtbuypkgusingpgwayurl", label: "Buy Package via PG URL", value: "https://portal.cryptsk.com/buy?mode=pg" },
    { id: "txtbuypkgusingsmswayurl", label: "Buy Package via SMS URL", value: "https://portal.cryptsk.com/buy?mode=sms" },
    { id: "txtrenewpkgusingsmswayurl", label: "Renew via SMS URL", value: "https://portal.cryptsk.com/renew?mode=sms" },
    { id: "txtchangebodurl", label: "Change BOD URL", value: "https://portal.cryptsk.com/bod" },
    { id: "txtresetpasswordurl", label: "Reset Password URL", value: "https://portal.cryptsk.com/reset" },
    { id: "txtcoupondetailsurl", label: "Coupon Details URL", value: "https://portal.cryptsk.com/coupon" },
  ]);

  return (
    <div className="space-y-6">
      <PageHeader title="Client GUI URLs" description="Configure the URLs used by the client GUI and self-service portal." breadcrumb={breadcrumb} icon={<Settings2 className="h-5 w-5" />} />
      <form onSubmit={(e) => { e.preventDefault(); toast({ title: "URLs saved", description: `${urls.length} client GUI URLs updated.` }); }}>
        <SectionCard title="Portal URLs" description="These URLs are used for client login redirects and self-service actions">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {urls.map((u) => (
              <div key={u.id} className="space-y-2">
                <Label htmlFor={u.id}>{u.label}</Label>
                <Input id={u.id} value={u.value} onChange={(e) => setUrls((arr) => arr.map((x) => x.id === u.id ? { ...x, value: e.target.value } : x))} className="font-mono text-xs" />
              </div>
            ))}
          </div>
        </SectionCard>
        <div className="mt-4 flex justify-end">
          <Button type="submit"><Save className="mr-2 h-4 w-4" /> Save All URLs</Button>
        </div>
      </form>
    </div>
  );
}

/* --- Webservice Config --- */
function WebserviceConfigPage({ moduleId, childId, grandchildId }: ViewProps) {
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const [mq, setMq] = React.useState({ serviceUrl: "https://spearhd.cryptsk.com/ws", userId: "cryptsk_api", password: "••••••••", maxDays: "30", maxDaysLimit: "90", enableAuthUser: true, bindToMac: false, generateInvoice: true, ipAllocation: "0", packageId: "1", poolId: "1", restrictionValue: "0", userStatus: "Y" });
  const [spearhd, setSpearhd] = React.useState({ serviceUrl: "https://spearhd.cryptsk.com/api", userId: "cryptsk_sph", password: "••••••••" });

  return (
    <div className="space-y-6">
      <PageHeader title="Webservice Configuration" description="Configure integration with external web services (Spearhead, MQ)." breadcrumb={breadcrumb} icon={<Settings2 className="h-5 w-5" />} />
      <form onSubmit={(e) => { e.preventDefault(); toast({ title: "Webservice config saved", description: "External web service settings updated." }); }}>
        <div className="space-y-6">
          <SectionCard title="Spearhead Integration" description="Spearhead web service for user synchronization">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label>Service URL</Label>
                <Input value={spearhd.serviceUrl} onChange={(e) => setSpearhd((s) => ({ ...s, serviceUrl: e.target.value }))} className="font-mono text-xs" />
              </div>
              <div className="space-y-2"><Label>User ID</Label><Input value={spearhd.userId} onChange={(e) => setSpearhd((s) => ({ ...s, userId: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Password</Label><Input type="password" value={spearhd.password} onChange={(e) => setSpearhd((s) => ({ ...s, password: e.target.value }))} /></div>
            </div>
          </SectionCard>
          <SectionCard title="MQ Integration" description="Message Queue web service for external user management">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label>MQ Service URL</Label>
                <Input value={mq.serviceUrl} onChange={(e) => setMq((s) => ({ ...s, serviceUrl: e.target.value }))} className="font-mono text-xs" />
              </div>
              <div className="space-y-2"><Label>MQ User ID</Label><Input value={mq.userId} onChange={(e) => setMq((s) => ({ ...s, userId: e.target.value }))} /></div>
              <div className="space-y-2"><Label>MQ Password</Label><Input type="password" value={mq.password} onChange={(e) => setMq((s) => ({ ...s, password: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Max Days</Label><Input type="number" value={mq.maxDays} onChange={(e) => setMq((s) => ({ ...s, maxDays: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Max Days Limit</Label><Input type="number" value={mq.maxDaysLimit} onChange={(e) => setMq((s) => ({ ...s, maxDaysLimit: e.target.value }))} /></div>
              <div className="space-y-2"><Label>IP Allocation</Label><Select value={mq.ipAllocation} onValueChange={(v) => setMq((s) => ({ ...s, ipAllocation: v }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="0">Dynamic</SelectItem><SelectItem value="1">Static</SelectItem><SelectItem value="2">Pool</SelectItem></SelectContent></Select></div>
              <div className="space-y-2"><Label>User Status</Label><Select value={mq.userStatus} onValueChange={(v) => setMq((s) => ({ ...s, userStatus: v }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Y">Active</SelectItem><SelectItem value="D">Deactive</SelectItem><SelectItem value="N">Suspended</SelectItem></SelectContent></Select></div>
              <div className="flex items-center gap-3"><Switch checked={mq.enableAuthUser} onCheckedChange={(v) => setMq((s) => ({ ...s, enableAuthUser: v }))} /><Label>Enable Auth User</Label></div>
              <div className="flex items-center gap-3"><Switch checked={mq.bindToMac} onCheckedChange={(v) => setMq((s) => ({ ...s, bindToMac: v }))} /><Label>Bind to MAC</Label></div>
              <div className="flex items-center gap-3"><Switch checked={mq.generateInvoice} onCheckedChange={(v) => setMq((s) => ({ ...s, generateInvoice: v }))} /><Label>Generate Invoice</Label></div>
            </div>
          </SectionCard>
        </div>
        <div className="mt-4 flex justify-end">
          <Button type="submit"><Save className="mr-2 h-4 w-4" /> Save Configuration</Button>
        </div>
      </form>
    </div>
  );
}

/* --- Password Config --- */
function PasswordConfigPage({ moduleId, childId, grandchildId }: ViewProps) {
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const [form, setForm] = React.useState({
    configType: "alphanumeric",
    minLength: "8",
    mixLetter: true,
    nonStandard: false,
    expiryDays: "90",
    historyCount: "5",
    requireSpecial: true,
    requireNumber: true,
    requireUpper: true,
    requireLower: true,
  });
  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="space-y-6">
      <PageHeader title="Password Configuration" description="Configure password policies for users and administrators." breadcrumb={breadcrumb} icon={<KeyRound className="h-5 w-5" />} />
      <form onSubmit={(e) => { e.preventDefault(); toast({ title: "Password policy saved", description: "Password configuration updated successfully." }); }}>
        <SectionCard title="Password Policy" description="Define password complexity rules">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Password Type</Label>
              <Select value={form.configType} onValueChange={(v) => set("configType", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="alphanumeric">Alphanumeric</SelectItem>
                  <SelectItem value="numeric">Numeric Only (PIN)</SelectItem>
                  <SelectItem value="alphabetic">Alphabetic Only</SelectItem>
                  <SelectItem value="complex">Complex (with special chars)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="minLength">Minimum Length</Label>
              <Input id="minLength" type="number" min="4" max="32" value={form.minLength} onChange={(e) => set("minLength", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiryDays">Password Expiry (days)</Label>
              <Input id="expiryDays" type="number" min="0" value={form.expiryDays} onChange={(e) => set("expiryDays", e.target.value)} />
              <p className="text-xs text-muted-foreground">0 = never expires</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="historyCount">Password History</Label>
              <Input id="historyCount" type="number" min="0" value={form.historyCount} onChange={(e) => set("historyCount", e.target.value)} />
              <p className="text-xs text-muted-foreground">Prevent reusing last N passwords</p>
            </div>
          </div>
        </SectionCard>
        <SectionCard title="Complexity Requirements" description="Character types that must be included in passwords">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex items-center gap-3"><Switch checked={form.requireUpper} onCheckedChange={(v) => set("requireUpper", v)} /><Label>Require Uppercase Letters (A-Z)</Label></div>
            <div className="flex items-center gap-3"><Switch checked={form.requireLower} onCheckedChange={(v) => set("requireLower", v)} /><Label>Require Lowercase Letters (a-z)</Label></div>
            <div className="flex items-center gap-3"><Switch checked={form.requireNumber} onCheckedChange={(v) => set("requireNumber", v)} /><Label>Require Numbers (0-9)</Label></div>
            <div className="flex items-center gap-3"><Switch checked={form.requireSpecial} onCheckedChange={(v) => set("requireSpecial", v)} /><Label>Require Special Characters (!@#$%)</Label></div>
            <div className="flex items-center gap-3"><Switch checked={form.mixLetter} onCheckedChange={(v) => set("mixLetter", v)} /><Label>Mix Letters and Numbers</Label></div>
            <div className="flex items-center gap-3"><Switch checked={form.nonStandard} onCheckedChange={(v) => set("nonStandard", v)} /><Label>Allow Non-Standard Characters</Label></div>
          </div>
        </SectionCard>
        <div className="mt-4 flex justify-end">
          <Button type="submit"><Save className="mr-2 h-4 w-4" /> Save Password Policy</Button>
        </div>
      </form>
    </div>
  );
}

/* --- Client Configuration --- */
function ClientConfigurationPage({ moduleId, childId, grandchildId }: ViewProps) {
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const [form, setForm] = React.useState({
    systemGracedays: "3",
    maxLoginAllowed: "3",
    pgRedirectType: "self",
    pgRedirectUrl: "https://portal.cryptsk.com/thankyou",
    accountPrefix: "A",
    accountPre: "8",
    httpdPort: "443",
    additionalDay: "30",
  });
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="space-y-6">
      <PageHeader title="Client Configuration" description="General client service configuration parameters." breadcrumb={breadcrumb} icon={<Settings2 className="h-5 w-5" />} />
      <form onSubmit={(e) => { e.preventDefault(); toast({ title: "Configuration saved", description: "Client configuration updated." }); }}>
        <div className="space-y-6">
          <SectionCard title="Session & Login" description="Grace days and login limits">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2"><Label htmlFor="systemGracedays">System Grace Days</Label><Input id="systemGracedays" type="number" min="0" value={form.systemGracedays} onChange={(e) => set("systemGracedays", e.target.value)} /><p className="text-xs text-muted-foreground">Days after expiry before suspension</p></div>
              <div className="space-y-2"><Label htmlFor="maxLoginAllowed">Max Login Allowed</Label><Input id="maxLoginAllowed" type="number" min="1" value={form.maxLoginAllowed} onChange={(e) => set("maxLoginAllowed", e.target.value)} /><p className="text-xs text-muted-foreground">Concurrent logins per user</p></div>
              <div className="space-y-2"><Label htmlFor="additionalDay">Additional Day (minutes)</Label><Input id="additionalDay" type="number" value={form.additionalDay} onChange={(e) => set("additionalDay", e.target.value)} /></div>
            </div>
          </SectionCard>
          <SectionCard title="Payment Gateway Redirect" description="Where users are redirected after payment">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2"><Label>Redirect Type</Label><Select value={form.pgRedirectType} onValueChange={(v) => set("pgRedirectType", v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="self">Self Portal</SelectItem><SelectItem value="custom">Custom URL</SelectItem><SelectItem value="none">No Redirect</SelectItem></SelectContent></Select></div>
              <div className="space-y-2"><Label htmlFor="pgRedirectUrl">Redirect URL</Label><Input id="pgRedirectUrl" value={form.pgRedirectUrl} onChange={(e) => set("pgRedirectUrl", e.target.value)} className="font-mono text-xs" /></div>
            </div>
          </SectionCard>
          <SectionCard title="Account & Server" description="Account number format and server settings">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2"><Label htmlFor="accountPrefix">Account Number Prefix</Label><Input id="accountPrefix" maxLength="2" value={form.accountPrefix} onChange={(e) => set("accountPrefix", e.target.value)} /></div>
              <div className="space-y-2"><Label htmlFor="accountPre">Account Number Length</Label><Input id="accountPre" type="number" min="6" max="12" value={form.accountPre} onChange={(e) => set("accountPre", e.target.value)} /></div>
              <div className="space-y-2"><Label htmlFor="httpdPort">HTTPD Port</Label><Input id="httpdPort" type="number" value={form.httpdPort} onChange={(e) => set("httpdPort", e.target.value)} /></div>
            </div>
          </SectionCard>
        </div>
        <div className="mt-4 flex justify-end">
          <Button type="submit"><Save className="mr-2 h-4 w-4" /> Save Configuration</Button>
        </div>
      </form>
    </div>
  );
}

/* ===================================================================== *
 *  CAPTIVE PORTAL — Real functional pages (9 grandchildren)
 * ===================================================================== */

/* --- Client Page (manage client login templates) --- */
function CpClientPagePage({ moduleId, childId, grandchildId }: ViewProps) {
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const [templates, setTemplates] = React.useState([
    { id: 1, name: "Standard Login", type: "PPPoE", status: "Active", lastModified: "01 Oct 2026" },
    { id: 2, name: "Hotspot Login", type: "Hotspot", status: "Active", lastModified: "28 Sep 2026" },
    { id: 3, name: "Leased Line Login", type: "Leased Line", status: "Active", lastModified: "15 Sep 2026" },
    { id: 4, name: "Mobile Login", type: "Mobile", status: "Inactive", lastModified: "10 Sep 2026" },
  ]);
  const [filter, setFilter] = React.useState("all");

  const filtered = templates.filter((t) => filter === "all" || t.type === filter);

  return (
    <div className="space-y-6">
      <PageHeader title="Client Page" description="Manage client login page templates for different user types." breadcrumb={breadcrumb} icon={<Plug className="h-5 w-5" />} />
      <ActionBar>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="h-8 w-[140px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="PPPoE">PPPoE</SelectItem>
            <SelectItem value="Hotspot">Hotspot</SelectItem>
            <SelectItem value="Leased Line">Leased Line</SelectItem>
            <SelectItem value="Mobile">Mobile</SelectItem>
          </SelectContent>
        </Select>
        <Button size="sm" onClick={() => toast({ title: "Import template", description: "Upload a template file" })}><Upload className="mr-2 h-3.5 w-3.5" /> Import Template</Button>
        <Button size="sm" onClick={() => toast({ title: "Create template", description: "Open template editor" })}><Plus className="mr-2 h-3.5 w-3.5" /> New Template</Button>
      </ActionBar>
      <SectionCard title="Login Page Templates" description={`${filtered.length} templates`}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t) => (
            <div key={t.id} className="rounded-lg border border-border bg-card p-4">
              <div className="mb-3 flex aspect-video items-center justify-center rounded-md bg-muted/30">
                <Plug className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.type} · {t.lastModified}</p>
                </div>
                <Badge variant={t.status === "Active" ? "default" : "secondary"} className={t.status === "Active" ? "bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400" : ""}>{t.status}</Badge>
              </div>
              <div className="mt-3 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => toast({ title: "Edit template", description: t.name })}><Pencil className="mr-1 h-3 w-3" /> Edit</Button>
                <Button variant="outline" size="sm" className="flex-1" onClick={() => toast({ title: "Preview", description: t.name })}><FileText className="mr-1 h-3 w-3" /> Preview</Button>
                <Button variant="ghost" size="sm" className="text-primary" onClick={() => { setTemplates(templates.filter((x) => x.id !== t.id)); toast({ title: "Template deleted", description: t.name }); }}><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

/* --- Portal Networks (template-zone relation) --- */
function PortalNetworksPage({ moduleId, childId, grandchildId }: ViewProps) {
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const [pools, setPools] = React.useState([
    { id: 1, pool: "Pool-Bhiwani0", zone: "Bhiwani-Core", preLogin: "Standard Login", postLogin: "My Account", buyPkgPg: true, changePassword: true, getPassword: false },
    { id: 2, pool: "Pool-Bhiwani1", zone: "Bhiwani-Core", preLogin: "Standard Login", postLogin: "My Account", buyPkgPg: true, changePassword: true, getPassword: false },
    { id: 3, pool: "Pool-Bhiwani2", zone: "Bhiwani-North", preLogin: "Hotspot Login", postLogin: "My Account", buyPkgPg: false, changePassword: true, getPassword: true },
    { id: 4, pool: "Pool-Bhiwani3", zone: "Bhiwani-South", preLogin: "Standard Login", postLogin: "My Account", buyPkgPg: true, changePassword: false, getPassword: false },
  ]);

  return (
    <div className="space-y-6">
      <PageHeader title="Portal Networks" description="Map login page templates to IP pools and zones." breadcrumb={breadcrumb} icon={<Plug className="h-5 w-5" />} />
      <SectionCard title="Template-Pool Mapping" description="Assign pre-login and post-login templates to each IP pool">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Pool</TableHead><TableHead>Zone</TableHead><TableHead>Pre-Login Template</TableHead><TableHead>Post-Login Template</TableHead><TableHead>Buy Pkg</TableHead><TableHead>Change Pwd</TableHead><TableHead>Get Pwd</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {pools.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.pool}</TableCell>
                  <TableCell className="text-muted-foreground">{p.zone}</TableCell>
                  <TableCell>
                    <Select value={p.preLogin} onValueChange={(v) => setPools((arr) => arr.map((x) => x.id === p.id ? { ...x, preLogin: v } : x))}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="Standard Login">Standard Login</SelectItem><SelectItem value="Hotspot Login">Hotspot Login</SelectItem><SelectItem value="Leased Line Login">Leased Line Login</SelectItem><SelectItem value="Mobile Login">Mobile Login</SelectItem></SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select value={p.postLogin} onValueChange={(v) => setPools((arr) => arr.map((x) => x.id === p.id ? { ...x, postLogin: v } : x))}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="My Account">My Account</SelectItem><SelectItem value="Custom Page">Custom Page</SelectItem></SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell><Checkbox checked={p.buyPkgPg} onCheckedChange={(v) => setPools((arr) => arr.map((x) => x.id === p.id ? { ...x, buyPkgPg: !!v } : x))} /></TableCell>
                  <TableCell><Checkbox checked={p.changePassword} onCheckedChange={(v) => setPools((arr) => arr.map((x) => x.id === p.id ? { ...x, changePassword: !!v } : x))} /></TableCell>
                  <TableCell><Checkbox checked={p.getPassword} onCheckedChange={(v) => setPools((arr) => arr.map((x) => x.id === p.id ? { ...x, getPassword: !!v } : x))} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>
      <div className="flex justify-end">
        <Button onClick={() => toast({ title: "Mapping saved", description: "Portal network template mapping updated." })}><Save className="mr-2 h-4 w-4" /> Save Mapping</Button>
      </div>
    </div>
  );
}

/* --- Leased Line Page Config --- */
function LeasedLinePageConfigPage({ moduleId, childId, grandchildId }: ViewProps) {
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const [pools, setPools] = React.useState([
    { id: 1, pool: "Pool-Bhiwani0", zone: "Bhiwani-Core", leasedLinePage: "LL-Standard", status: "Active" },
    { id: 2, pool: "Pool-Bhiwani1", zone: "Bhiwani-Core", leasedLinePage: "LL-Standard", status: "Active" },
    { id: 3, pool: "Pool-Bhiwani2", zone: "Bhiwani-North", leasedLinePage: "LL-Custom-1", status: "Active" },
    { id: 4, pool: "Pool-Bhiwani3", zone: "Bhiwani-South", leasedLinePage: "None", status: "Inactive" },
  ]);

  return (
    <div className="space-y-6">
      <PageHeader title="Leased Line Page" description="Assign leased line user login page templates to IP pools." breadcrumb={breadcrumb} icon={<Plug className="h-5 w-5" />} />
      <SectionCard title="Leased Line Page Assignment" description="Each pool can have a different leased line login page">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Pool</TableHead><TableHead>Zone</TableHead><TableHead>Leased Line Page</TableHead><TableHead>Status</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {pools.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.pool}</TableCell>
                  <TableCell className="text-muted-foreground">{p.zone}</TableCell>
                  <TableCell>
                    <Select value={p.leasedLinePage} onValueChange={(v) => setPools((arr) => arr.map((x) => x.id === p.id ? { ...x, leasedLinePage: v } : x))}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="None">None</SelectItem><SelectItem value="LL-Standard">LL-Standard</SelectItem><SelectItem value="LL-Custom-1">LL-Custom-1</SelectItem><SelectItem value="LL-Custom-2">LL-Custom-2</SelectItem></SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell><StatusBadge status={p.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>
      <div className="flex justify-end">
        <Button onClick={() => toast({ title: "Saved", description: "Leased line page assignment updated." })}><Save className="mr-2 h-4 w-4" /> Save</Button>
      </div>
    </div>
  );
}

/* --- Portal Messages --- */
function PortalMessagesPage({ moduleId, childId, grandchildId }: ViewProps) {
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const [messages, setMessages] = React.useState([
    { id: 1, key: "login_success", title: "Login Success", text: "You have been successfully logged in. Enjoy your internet session!", type: "success" },
    { id: 2, key: "login_fail", title: "Login Failed", text: "Login failed. Please check your username and password.", type: "error" },
    { id: 3, key: "session_expired", title: "Session Expired", text: "Your session has expired. Please log in again.", type: "warning" },
    { id: 4, key: "account_suspended", title: "Account Suspended", text: "Your account has been suspended. Please contact support.", type: "error" },
    { id: 5, key: "data_limit", title: "Data Limit Reached", text: "You have reached your data transfer limit.", type: "warning" },
    { id: 6, key: "renewal_reminder", title: "Renewal Reminder", text: "Your plan expires soon. Please renew to avoid interruption.", type: "info" },
  ]);

  return (
    <div className="space-y-6">
      <PageHeader title="Portal Messages" description="Customize messages displayed on the captive portal." breadcrumb={breadcrumb} icon={<Plug className="h-5 w-5" />} />
      <SectionCard title="Message Templates" description="Edit the text for each portal message type">
        <div className="space-y-4">
          {messages.map((m) => (
            <div key={m.id} className="rounded-lg border border-border bg-card p-4">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px]">{m.type}</Badge>
                  <Label className="font-medium">{m.title}</Label>
                </div>
              </div>
              <Textarea value={m.text} onChange={(e) => setMessages((arr) => arr.map((x) => x.id === m.id ? { ...x, text: e.target.value } : x))} rows={2} className="text-sm" />
            </div>
          ))}
        </div>
      </SectionCard>
      <div className="flex justify-end">
        <Button onClick={() => toast({ title: "Messages saved", description: `${messages.length} portal messages updated.` })}><Save className="mr-2 h-4 w-4" /> Save All Messages</Button>
      </div>
    </div>
  );
}

/* --- Portal Config --- */
function PortalConfigPage({ moduleId, childId, grandchildId }: ViewProps) {
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const [form, setForm] = React.useState({
    authenticate: "local",
    encryptionKey: "cp_enc_2026",
    sessionTimeout: "30",
    idleTimeout: "10",
    concurrentLogin: false,
    macBinding: true,
    httpsOnly: true,
    favicon: "favicon.ico",
    allowPackagePin: true,
    allowWalkinPin: false,
    allowValuePin: true,
  });
  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="space-y-6">
      <PageHeader title="Portal Configuration" description="General captive portal configuration settings." breadcrumb={breadcrumb} icon={<Plug className="h-5 w-5" />} />
      <form onSubmit={(e) => { e.preventDefault(); toast({ title: "Portal config saved", description: "Portal configuration updated." }); }}>
        <div className="space-y-6">
          <SectionCard title="Authentication" description="Authentication method and security">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2"><Label>Authentication Method</Label><Select value={form.authenticate} onValueChange={(v) => set("authenticate", v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="local">Local (RADIUS)</SelectItem><SelectItem value="ldap">LDAP</SelectItem><SelectItem value="ad">Active Directory</SelectItem></SelectContent></Select></div>
              <div className="space-y-2"><Label htmlFor="encryptionKey">Encryption Key</Label><Input id="encryptionKey" value={form.encryptionKey} onChange={(e) => set("encryptionKey", e.target.value)} className="font-mono text-xs" /></div>
              <div className="space-y-2"><Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label><Input id="sessionTimeout" type="number" value={form.sessionTimeout} onChange={(e) => set("sessionTimeout", e.target.value)} /></div>
              <div className="space-y-2"><Label htmlFor="idleTimeout">Idle Timeout (minutes)</Label><Input id="idleTimeout" type="number" value={form.idleTimeout} onChange={(e) => set("idleTimeout", e.target.value)} /></div>
              <div className="flex items-center gap-3"><Switch checked={form.httpsOnly} onCheckedChange={(v) => set("httpsOnly", v)} /><Label>HTTPS Only</Label></div>
              <div className="flex items-center gap-3"><Switch checked={form.concurrentLogin} onCheckedChange={(v) => set("concurrentLogin", v)} /><Label>Allow Concurrent Login</Label></div>
              <div className="flex items-center gap-3"><Switch checked={form.macBinding} onCheckedChange={(v) => set("macBinding", v)} /><Label>MAC Binding</Label></div>
            </div>
          </SectionCard>
          <SectionCard title="PIN Registration" description="Control which PIN types users can use for self-registration">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="flex items-center gap-3"><Switch checked={form.allowPackagePin} onCheckedChange={(v) => set("allowPackagePin", v)} /><Label>Allow Package PIN</Label></div>
              <div className="flex items-center gap-3"><Switch checked={form.allowWalkinPin} onCheckedChange={(v) => set("allowWalkinPin", v)} /><Label>Allow Walk-in PIN</Label></div>
              <div className="flex items-center gap-3"><Switch checked={form.allowValuePin} onCheckedChange={(v) => set("allowValuePin", v)} /><Label>Allow Value PIN</Label></div>
            </div>
          </SectionCard>
        </div>
        <div className="mt-4 flex justify-end"><Button type="submit"><Save className="mr-2 h-4 w-4" /> Save Configuration</Button></div>
      </form>
    </div>
  );
}

/* --- Configure Profile --- */
function ConfigureProfilePage({ moduleId, childId, grandchildId }: ViewProps) {
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const [profiles, setProfiles] = React.useState([
    { id: 1, name: "Default Profile", realm: "cryptsk.com", realmOrder: "suffix", usernameCase: "lower", css: "body { background: #fff; }", status: "Active" },
    { id: 2, name: "Hotel Profile", realm: "hotel.cryptsk.com", realmOrder: "prefix", usernameCase: "preserve", css: "body { background: #f0f0f0; }", status: "Active" },
    { id: 3, name: "Guest Profile", realm: "guest.cryptsk.com", realmOrder: "suffix", usernameCase: "lower", css: "body { background: #fafafa; }", status: "Inactive" },
  ]);
  const [showForm, setShowForm] = React.useState(false);
  const [form, setForm] = React.useState({ name: "", realm: "", realmOrder: "suffix", usernameCase: "lower", css: "" });

  return (
    <div className="space-y-6">
      <PageHeader title="Configure Profile" description="Create and manage CP (Captive Portal) profiles with realm and CSS customization." breadcrumb={breadcrumb} icon={<Plug className="h-5 w-5" />} />
      <ActionBar>
        <Button size="sm" onClick={() => setShowForm(!showForm)}><Plus className="mr-2 h-3.5 w-3.5" /> {showForm ? "Cancel" : "Create Profile"}</Button>
      </ActionBar>
      {showForm && (
        <SectionCard title="Create New Profile" description="Configure a new captive portal profile">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2"><Label>Profile Name</Label><Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. VIP Profile" /></div>
            <div className="space-y-2"><Label>Realm</Label><Input value={form.realm} onChange={(e) => setForm((f) => ({ ...f, realm: e.target.value }))} placeholder="e.g. vip.cryptsk.com" /></div>
            <div className="space-y-2"><Label>Realm Order</Label><Select value={form.realmOrder} onValueChange={(v) => setForm((f) => ({ ...f, realmOrder: v }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="suffix">Suffix (user@realm)</SelectItem><SelectItem value="prefix">Prefix (realm\\user)</SelectItem></SelectContent></Select></div>
            <div className="space-y-2"><Label>Username Case</Label><Select value={form.usernameCase} onValueChange={(v) => setForm((f) => ({ ...f, usernameCase: v }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="lower">Lowercase</SelectItem><SelectItem value="upper">Uppercase</SelectItem><SelectItem value="preserve">Preserve</SelectItem></SelectContent></Select></div>
            <div className="space-y-2 md:col-span-2"><Label>CSS Elements</Label><Textarea value={form.css} onChange={(e) => setForm((f) => ({ ...f, css: e.target.value }))} rows={4} placeholder="body { background: #fff; }" className="font-mono text-xs" /></div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button onClick={() => {
              setProfiles((arr) => [...arr, { id: Math.max(...arr.map((x) => x.id)) + 1, name: form.name, realm: form.realm, realmOrder: form.realmOrder, usernameCase: form.usernameCase, css: form.css, status: "Active" }]);
              setShowForm(false); setForm({ name: "", realm: "", realmOrder: "suffix", usernameCase: "lower", css: "" });
              toast({ title: "Profile created", description: form.name });
            }}><Save className="mr-2 h-4 w-4" /> Create</Button>
          </div>
        </SectionCard>
      )}
      <SectionCard title="CP Profiles" description={`${profiles.length} profiles`}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Name</TableHead><TableHead>Realm</TableHead><TableHead>Realm Order</TableHead><TableHead>Username Case</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {profiles.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell className="font-mono text-xs">{p.realm}</TableCell>
                  <TableCell className="text-xs">{p.realmOrder}</TableCell>
                  <TableCell className="text-xs">{p.usernameCase}</TableCell>
                  <TableCell><StatusBadge status={p.status} /></TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => toast({ title: "Edit profile", description: p.name })}><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="sm" className="text-primary" onClick={() => { setProfiles(profiles.filter((x) => x.id !== p.id)); toast({ title: "Profile deleted", description: p.name }); }}><Trash2 className="h-3.5 w-3.5" /></Button>
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

/* --- CP Security Config --- */
function CpSecurityConfigPage({ moduleId, childId, grandchildId }: ViewProps) {
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const [form, setForm] = React.useState({
    httpsEnabled: true,
    sslCertPath: "/etc/ssl/cryptsk.crt",
    sslKeyPath: "/etc/ssl/cryptsk.key",
    csrfProtection: true,
    xssProtection: true,
    sessionCookieSecure: true,
    maxLoginAttempts: "5",
    lockoutDuration: "15",
    ipWhitelist: "",
    ipBlacklist: "",
  });
  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="space-y-6">
      <PageHeader title="Security Configuration" description="Security settings for the captive portal." breadcrumb={breadcrumb} icon={<ShieldCheck className="h-5 w-5" />} />
      <form onSubmit={(e) => { e.preventDefault(); toast({ title: "Security config saved", description: "Portal security settings updated." }); }}>
        <div className="space-y-6">
          <SectionCard title="HTTPS & SSL" description="Secure the portal with HTTPS">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex items-center gap-3 md:col-span-2"><Switch checked={form.httpsEnabled} onCheckedChange={(v) => set("httpsEnabled", v)} /><Label>Enable HTTPS</Label></div>
              <div className="space-y-2"><Label>SSL Certificate Path</Label><Input value={form.sslCertPath} onChange={(e) => set("sslCertPath", e.target.value)} className="font-mono text-xs" /></div>
              <div className="space-y-2"><Label>SSL Key Path</Label><Input value={form.sslKeyPath} onChange={(e) => set("sslKeyPath", e.target.value)} className="font-mono text-xs" /></div>
            </div>
          </SectionCard>
          <SectionCard title="Web Security" description="Protection against common web attacks">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex items-center gap-3"><Switch checked={form.csrfProtection} onCheckedChange={(v) => set("csrfProtection", v)} /><Label>CSRF Protection</Label></div>
              <div className="flex items-center gap-3"><Switch checked={form.xssProtection} onCheckedChange={(v) => set("xssProtection", v)} /><Label>XSS Protection</Label></div>
              <div className="flex items-center gap-3"><Switch checked={form.sessionCookieSecure} onCheckedChange={(v) => set("sessionCookieSecure", v)} /><Label>Secure Session Cookies</Label></div>
            </div>
          </SectionCard>
          <SectionCard title="Brute Force Protection" description="Limit login attempts and lock out attackers">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2"><Label htmlFor="maxLoginAttempts">Max Login Attempts</Label><Input id="maxLoginAttempts" type="number" min="1" value={form.maxLoginAttempts} onChange={(e) => set("maxLoginAttempts", e.target.value)} /></div>
              <div className="space-y-2"><Label htmlFor="lockoutDuration">Lockout Duration (minutes)</Label><Input id="lockoutDuration" type="number" min="1" value={form.lockoutDuration} onChange={(e) => set("lockoutDuration", e.target.value)} /></div>
            </div>
          </SectionCard>
          <SectionCard title="IP Filtering" description="Allow or block specific IP addresses">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2"><Label htmlFor="ipWhitelist">IP Whitelist (comma-separated)</Label><Textarea id="ipWhitelist" value={form.ipWhitelist} onChange={(e) => set("ipWhitelist", e.target.value)} rows={3} placeholder="192.168.1.0/24, 10.0.0.5" className="font-mono text-xs" /></div>
              <div className="space-y-2"><Label htmlFor="ipBlacklist">IP Blacklist (comma-separated)</Label><Textarea id="ipBlacklist" value={form.ipBlacklist} onChange={(e) => set("ipBlacklist", e.target.value)} rows={3} placeholder="203.0.113.5" className="font-mono text-xs" /></div>
            </div>
          </SectionCard>
        </div>
        <div className="mt-4 flex justify-end"><Button type="submit"><Save className="mr-2 h-4 w-4" /> Save Security Configuration</Button></div>
      </form>
    </div>
  );
}

/* --- Social Media Config --- */
function SocialMediaConfigPage({ moduleId, childId, grandchildId }: ViewProps) {
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const [platforms, setPlatforms] = React.useState([
    { id: "facebook", name: "Facebook", enabled: true, clientId: "fb_123456789", clientSecret: "••••••••", scope: "email" },
    { id: "google", name: "Google", enabled: true, clientId: "google_987654321.apps.googleusercontent.com", clientSecret: "••••••••", scope: "email profile" },
    { id: "twitter", name: "Twitter/X", enabled: false, clientId: "", clientSecret: "", scope: "" },
  ]);

  return (
    <div className="space-y-6">
      <PageHeader title="Social Media Configuration" description="Enable social media login for the captive portal." breadcrumb={breadcrumb} icon={<Plug className="h-5 w-5" />} />
      <div className="space-y-4">
        {platforms.map((p) => (
          <SectionCard key={p.id} title={p.name} description={`OAuth 2.0 configuration for ${p.name} login`}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex items-center gap-3 md:col-span-2">
                <Switch checked={p.enabled} onCheckedChange={(v) => setPlatforms((arr) => arr.map((x) => x.id === p.id ? { ...x, enabled: v } : x))} />
                <Label>Enable {p.name} Login</Label>
              </div>
              <div className="space-y-2"><Label>Client ID / API Key</Label><Input value={p.clientId} onChange={(e) => setPlatforms((arr) => arr.map((x) => x.id === p.id ? { ...x, clientId: e.target.value } : x))} className="font-mono text-xs" /></div>
              <div className="space-y-2"><Label>Client Secret</Label><Input type="password" value={p.clientSecret} onChange={(e) => setPlatforms((arr) => arr.map((x) => x.id === p.id ? { ...x, clientSecret: e.target.value } : x))} /></div>
              <div className="space-y-2 md:col-span-2"><Label>Scope</Label><Input value={p.scope} onChange={(e) => setPlatforms((arr) => arr.map((x) => x.id === p.id ? { ...x, scope: e.target.value } : x))} className="font-mono text-xs" /></div>
            </div>
          </SectionCard>
        ))}
      </div>
      <div className="flex justify-end">
        <Button onClick={() => toast({ title: "Social media config saved", description: `${platforms.filter((p) => p.enabled).length} platforms enabled.` })}><Save className="mr-2 h-4 w-4" /> Save All</Button>
      </div>
    </div>
  );
}

/* --- CP Registration Policy --- */
function CpRegistrationPolicyPage({ moduleId, childId, grandchildId }: ViewProps) {
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const [form, setForm] = React.useState({
    allowSelfReg: true,
    requireEmail: true,
    requirePhone: true,
    emailVerification: true,
    phoneOtp: false,
    allowedDomains: "gmail.com, yahoo.com, outlook.com",
    blockedDomains: "",
    defaultPackage: "unlimited hours 30 days",
    defaultZone: "Bhiwani-Core",
    maxAccountsPerEmail: "1",
    rebind: false,
  });
  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="space-y-6">
      <PageHeader title="CP Registration Policy" description="Control how users can self-register through the captive portal." breadcrumb={breadcrumb} icon={<Plug className="h-5 w-5" />} />
      <form onSubmit={(e) => { e.preventDefault(); toast({ title: "Registration policy saved", description: "CP registration policy updated." }); }}>
        <div className="space-y-6">
          <SectionCard title="Registration Settings" description="Enable and configure self-registration">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex items-center gap-3 md:col-span-2"><Switch checked={form.allowSelfReg} onCheckedChange={(v) => set("allowSelfReg", v)} /><Label>Allow Self-Registration</Label></div>
              <div className="flex items-center gap-3"><Switch checked={form.requireEmail} onCheckedChange={(v) => set("requireEmail", v)} /><Label>Require Email</Label></div>
              <div className="flex items-center gap-3"><Switch checked={form.requirePhone} onCheckedChange={(v) => set("requirePhone", v)} /><Label>Require Phone</Label></div>
              <div className="flex items-center gap-3"><Switch checked={form.emailVerification} onCheckedChange={(v) => set("emailVerification", v)} /><Label>Email Verification (OTP)</Label></div>
              <div className="flex items-center gap-3"><Switch checked={form.phoneOtp} onCheckedChange={(v) => set("phoneOtp", v)} /><Label>Phone OTP Verification</Label></div>
              <div className="flex items-center gap-3"><Switch checked={form.rebind} onCheckedChange={(v) => set("rebind", v)} /><Label>Allow Rebind MAC</Label></div>
            </div>
          </SectionCard>
          <SectionCard title="Domain Filtering" description="Control which email domains can register">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2"><Label htmlFor="allowedDomains">Allowed Domains (comma-separated)</Label><Textarea id="allowedDomains" value={form.allowedDomains} onChange={(e) => set("allowedDomains", e.target.value)} rows={2} className="font-mono text-xs" /></div>
              <div className="space-y-2"><Label htmlFor="blockedDomains">Blocked Domains (comma-separated)</Label><Textarea id="blockedDomains" value={form.blockedDomains} onChange={(e) => set("blockedDomains", e.target.value)} rows={2} className="font-mono text-xs" /></div>
            </div>
          </SectionCard>
          <SectionCard title="Default Assignment" description="Package and zone assigned to new self-registered users">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="space-y-2"><Label>Default Package</Label><Select value={form.defaultPackage} onValueChange={(v) => set("defaultPackage", v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="unlimited hours 1 day">Unlimited 1 day</SelectItem><SelectItem value="unlimited hours 7 days">Unlimited 7 days</SelectItem><SelectItem value="unlimited hours 30 days">Unlimited 30 days</SelectItem></SelectContent></Select></div>
              <div className="space-y-2"><Label>Default Zone</Label><Select value={form.defaultZone} onValueChange={(v) => set("defaultZone", v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Bhiwani-Core">Bhiwani-Core</SelectItem><SelectItem value="Bhiwani-North">Bhiwani-North</SelectItem><SelectItem value="Bhiwani-South">Bhiwani-South</SelectItem></SelectContent></Select></div>
              <div className="space-y-2"><Label htmlFor="maxAccountsPerEmail">Max Accounts per Email</Label><Input id="maxAccountsPerEmail" type="number" min="1" value={form.maxAccountsPerEmail} onChange={(e) => set("maxAccountsPerEmail", e.target.value)} /></div>
            </div>
          </SectionCard>
        </div>
        <div className="mt-4 flex justify-end"><Button type="submit"><Save className="mr-2 h-4 w-4" /> Save Policy</Button></div>
      </form>
    </div>
  );
}

/* ===================================================================== *
 *  NAS MANAGEMENT — Real functional pages (6 grandchildren)
 * ===================================================================== */

/* --- Radius Config --- */
function RadiusConfigPage({ moduleId, childId, grandchildId }: ViewProps) {
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const [form, setForm] = React.useState({
    authPort: "1812",
    acctPort: "1813",
    coaPort: "3799",
    timeout: "5",
    retries: "3",
    secret: "••••••••••••",
    deadTime: "10",
    maxConnections: "16",
    enableAccounting: true,
    enableCoA: true,
    interimUpdate: "300",
  });
  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="space-y-6">
      <PageHeader title="RADIUS Configuration" description="Global RADIUS server settings for authentication and accounting." breadcrumb={breadcrumb} icon={<HardDrive className="h-5 w-5" />} />
      <form onSubmit={(e) => { e.preventDefault(); toast({ title: "RADIUS config saved", description: "Global RADIUS settings updated." }); }}>
        <div className="space-y-6">
          <SectionCard title="Server Ports" description="RADIUS authentication, accounting and CoA ports">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="space-y-2"><Label htmlFor="authPort">Authentication Port</Label><Input id="authPort" type="number" value={form.authPort} onChange={(e) => set("authPort", e.target.value)} /></div>
              <div className="space-y-2"><Label htmlFor="acctPort">Accounting Port</Label><Input id="acctPort" type="number" value={form.acctPort} onChange={(e) => set("acctPort", e.target.value)} /></div>
              <div className="space-y-2"><Label htmlFor="coaPort">CoA Port</Label><Input id="coaPort" type="number" value={form.coaPort} onChange={(e) => set("coaPort", e.target.value)} /></div>
            </div>
          </SectionCard>
          <SectionCard title="Connection Settings" description="Timeout, retries and connection pool">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2"><Label htmlFor="timeout">Timeout (seconds)</Label><Input id="timeout" type="number" value={form.timeout} onChange={(e) => set("timeout", e.target.value)} /></div>
              <div className="space-y-2"><Label htmlFor="retries">Retries</Label><Input id="retries" type="number" value={form.retries} onChange={(e) => set("retries", e.target.value)} /></div>
              <div className="space-y-2"><Label htmlFor="deadTime">Dead Time (minutes)</Label><Input id="deadTime" type="number" value={form.deadTime} onChange={(e) => set("deadTime", e.target.value)} /></div>
              <div className="space-y-2"><Label htmlFor="maxConnections">Max Connections</Label><Input id="maxConnections" type="number" value={form.maxConnections} onChange={(e) => set("maxConnections", e.target.value)} /></div>
              <div className="space-y-2"><Label htmlFor="interimUpdate">Interim Update Interval (seconds)</Label><Input id="interimUpdate" type="number" value={form.interimUpdate} onChange={(e) => set("interimUpdate", e.target.value)} /></div>
              <div className="space-y-2"><Label htmlFor="secret">Shared Secret</Label><Input id="secret" type="password" value={form.secret} onChange={(e) => set("secret", e.target.value)} /></div>
            </div>
          </SectionCard>
          <SectionCard title="Features" description="Enable/disable RADIUS features">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex items-center gap-3"><Switch checked={form.enableAccounting} onCheckedChange={(v) => set("enableAccounting", v)} /><Label>Enable Accounting</Label></div>
              <div className="flex items-center gap-3"><Switch checked={form.enableCoA} onCheckedChange={(v) => set("enableCoA", v)} /><Label>Enable Change of Authorization (CoA)</Label></div>
            </div>
          </SectionCard>
        </div>
        <div className="mt-4 flex justify-end"><Button type="submit"><Save className="mr-2 h-4 w-4" /> Save RADIUS Configuration</Button></div>
      </form>
    </div>
  );
}

/* --- NAS Configuration --- */
function NasConfigurationPage({ moduleId, childId, grandchildId }: ViewProps) {
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const [configs, setConfigs] = React.useState([
    { id: 1, name: "sms-core-01", nasType: "24online SMS", identifier: "sms-core-01", secret: "••••••••", authType: "PAP", status: "Active" },
    { id: 2, name: "sms-core-02", nasType: "24online SMS", identifier: "sms-core-02", secret: "••••••••", authType: "CHAP", status: "Active" },
    { id: 3, name: "br-5000-edge", nasType: "BRAS", identifier: "br-5000", secret: "••••••••", authType: "MS-CHAPv2", status: "Active" },
  ]);

  return (
    <div className="space-y-6">
      <PageHeader title="NAS Configuration" description="Configure NAS device settings including type, identifier, and authentication." breadcrumb={breadcrumb} icon={<HardDrive className="h-5 w-5" />} />
      <ActionBar>
        <Button size="sm" onClick={() => toast({ title: "Add NAS config", description: "Open create form" })}><Plus className="mr-2 h-3.5 w-3.5" /> Add Configuration</Button>
      </ActionBar>
      <SectionCard title="NAS Configurations" description={`${configs.length} configurations`}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Name</TableHead><TableHead>NAS Type</TableHead><TableHead>Identifier</TableHead><TableHead>Auth Type</TableHead><TableHead>Secret</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {configs.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell><Badge variant="outline" className="text-[10px]">{c.nasType}</Badge></TableCell>
                  <TableCell className="font-mono text-xs">{c.identifier}</TableCell>
                  <TableCell className="text-xs">{c.authType}</TableCell>
                  <TableCell className="font-mono text-xs">{c.secret}</TableCell>
                  <TableCell><StatusBadge status={c.status} /></TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => toast({ title: "Edit config", description: c.name })}><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="sm" className="text-primary" onClick={() => { setConfigs(configs.filter((x) => x.id !== c.id)); toast({ title: "Config deleted", description: c.name }); }}><Trash2 className="h-3.5 w-3.5" /></Button>
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

/* --- NAS Preferences --- */
function NasPreferencesPage({ moduleId, childId, grandchildId }: ViewProps) {
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const [form, setForm] = React.useState({
    sessionTimeout: "86400",
    idleTimeout: "600",
    interimInterval: "300",
    acctDelay: "0",
    coaEnabled: true,
    coaPort: "3799",
    disconnectOnExpire: true,
    reauthOnCoA: false,
    nasIdentifier: "cryptsk-sms",
    nasType: "24online",
  });
  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="space-y-6">
      <PageHeader title="NAS Preferences" description="Global preferences applied to all NAS connections." breadcrumb={breadcrumb} icon={<HardDrive className="h-5 w-5" />} />
      <form onSubmit={(e) => { e.preventDefault(); toast({ title: "Preferences saved", description: "NAS preferences updated." }); }}>
        <div className="space-y-6">
          <SectionCard title="Session Timers" description="Default timeout values for user sessions">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2"><Label htmlFor="sessionTimeout">Session Timeout (seconds)</Label><Input id="sessionTimeout" type="number" value={form.sessionTimeout} onChange={(e) => set("sessionTimeout", e.target.value)} /></div>
              <div className="space-y-2"><Label htmlFor="idleTimeout">Idle Timeout (seconds)</Label><Input id="idleTimeout" type="number" value={form.idleTimeout} onChange={(e) => set("idleTimeout", e.target.value)} /></div>
              <div className="space-y-2"><Label htmlFor="interimInterval">Interim Update Interval (seconds)</Label><Input id="interimInterval" type="number" value={form.interimInterval} onChange={(e) => set("interimInterval", e.target.value)} /></div>
              <div className="space-y-2"><Label htmlFor="acctDelay">Accounting Delay (seconds)</Label><Input id="acctDelay" type="number" value={form.acctDelay} onChange={(e) => set("acctDelay", e.target.value)} /></div>
            </div>
          </SectionCard>
          <SectionCard title="CoA Settings" description="Change of Authorization for disconnecting/modifying live sessions">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex items-center gap-3"><Switch checked={form.coaEnabled} onCheckedChange={(v) => set("coaEnabled", v)} /><Label>Enable CoA</Label></div>
              <div className="space-y-2"><Label htmlFor="coaPort">CoA Port</Label><Input id="coaPort" type="number" value={form.coaPort} onChange={(e) => set("coaPort", e.target.value)} /></div>
              <div className="flex items-center gap-3"><Switch checked={form.disconnectOnExpire} onCheckedChange={(v) => set("disconnectOnExpire", v)} /><Label>Disconnect on Expiry</Label></div>
              <div className="flex items-center gap-3"><Switch checked={form.reauthOnCoA} onCheckedChange={(v) => set("reauthOnCoA", v)} /><Label>Re-authenticate on CoA</Label></div>
            </div>
          </SectionCard>
          <SectionCard title="NAS Identity" description="Default NAS identifier sent in RADIUS packets">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2"><Label htmlFor="nasIdentifier">NAS Identifier</Label><Input id="nasIdentifier" value={form.nasIdentifier} onChange={(e) => set("nasIdentifier", e.target.value)} /></div>
              <div className="space-y-2"><Label>NAS Type</Label><Select value={form.nasType} onValueChange={(v) => set("nasType", v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="24online">24online SMS</SelectItem><SelectItem value="BRAS">BRAS</SelectItem><SelectItem value="Hotspot">Hotspot Gateway</SelectItem><SelectItem value="Mikrotik">Mikrotik</SelectItem></SelectContent></Select></div>
            </div>
          </SectionCard>
        </div>
        <div className="mt-4 flex justify-end"><Button type="submit"><Save className="mr-2 h-4 w-4" /> Save Preferences</Button></div>
      </form>
    </div>
  );
}

/* --- NAS Connectivity --- */
function NasConnectivityPage({ moduleId, childId, grandchildId }: ViewProps) {
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const [devices, setDevices] = React.useState([
    { id: 1, name: "sms-core-01", ip: "172.16.16.16", port: "1812", status: "Online", latency: "2ms", lastConnected: "Just now", sessions: 612 },
    { id: 2, name: "sms-core-02", ip: "172.16.16.17", port: "1812", status: "Online", latency: "3ms", lastConnected: "Just now", sessions: 187 },
    { id: 3, name: "br-5000-edge", ip: "103.205.148.26", port: "1812", status: "Online", latency: "5ms", lastConnected: "1 min ago", sessions: 0 },
    { id: 4, name: "hotspot-gw-01", ip: "10.10.5.1", port: "1812", status: "Offline", latency: "—", lastConnected: "2 hours ago", sessions: 0 },
  ]);

  return (
    <div className="space-y-6">
      <PageHeader title="NAS Connectivity" description="Monitor real-time connectivity status of all NAS devices." breadcrumb={breadcrumb} icon={<HardDrive className="h-5 w-5" />} />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard label="Total NAS" value={String(devices.length)} icon={<HardDrive className="h-4 w-4" />} accent />
        <KpiCard label="Online" value={String(devices.filter((d) => d.status === "Online").length)} icon={<Activity className="h-4 w-4" />} />
        <KpiCard label="Offline" value={String(devices.filter((d) => d.status === "Offline").length)} icon={<AlertTriangle className="h-4 w-4" />} />
        <KpiCard label="Total Sessions" value={String(devices.reduce((a, d) => a + d.sessions, 0))} icon={<Wifi className="h-4 w-4" />} />
      </div>
      <SectionCard title="NAS Connectivity Status" description="Real-time status of all configured NAS devices">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Name</TableHead><TableHead>IP Address</TableHead><TableHead>Port</TableHead><TableHead>Status</TableHead><TableHead>Latency</TableHead><TableHead>Last Connected</TableHead><TableHead>Sessions</TableHead><TableHead className="text-right">Actions</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {devices.map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="font-medium">{d.name}</TableCell>
                  <TableCell className="font-mono text-xs">{d.ip}</TableCell>
                  <TableCell className="font-mono text-xs">{d.port}</TableCell>
                  <TableCell><StatusBadge status={d.status} /></TableCell>
                  <TableCell className="font-mono text-xs">{d.latency}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{d.lastConnected}</TableCell>
                  <TableCell>{d.sessions}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => toast({ title: "Test connection", description: `Pinging ${d.name} (${d.ip})…` })}><Activity className="h-3.5 w-3.5" /></Button>
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

/* --- NAS Client Config --- */
function NasClientConfigPage({ moduleId, childId, grandchildId }: ViewProps) {
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const [clients, setClients] = React.useState([
    { id: 1, name: "sms-core-01", ip: "172.16.16.16", secret: "secret123", nasType: "24online SMS", status: "Active" },
    { id: 2, name: "sms-core-02", ip: "172.16.16.17", secret: "secret456", nasType: "24online SMS", status: "Active" },
    { id: 3, name: "br-5000-edge", ip: "103.205.148.26", secret: "bras789", nasType: "BRAS", status: "Active" },
    { id: 4, name: "hotspot-gw-01", ip: "10.10.5.1", secret: "hotspot000", nasType: "Hotspot", status: "Inactive" },
  ]);
  const [showForm, setShowForm] = React.useState(false);
  const [form, setForm] = React.useState({ name: "", ip: "", secret: "", nasType: "24online SMS" });

  return (
    <div className="space-y-6">
      <PageHeader title="NAS Client Configuration" description="Configure RADIUS clients (NAS devices that send auth requests)." breadcrumb={breadcrumb} icon={<HardDrive className="h-5 w-5" />} />
      <ActionBar>
        <Button size="sm" onClick={() => setShowForm(!showForm)}><Plus className="mr-2 h-3.5 w-3.5" /> {showForm ? "Cancel" : "Add Client"}</Button>
      </ActionBar>
      {showForm && (
        <SectionCard title="Add RADIUS Client" description="Register a new NAS device as a RADIUS client">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2"><Label>Client Name</Label><Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. mikrotik-01" /></div>
            <div className="space-y-2"><Label>IP Address</Label><Input value={form.ip} onChange={(e) => setForm((f) => ({ ...f, ip: e.target.value }))} placeholder="e.g. 10.10.5.2" /></div>
            <div className="space-y-2"><Label>Shared Secret</Label><Input type="password" value={form.secret} onChange={(e) => setForm((f) => ({ ...f, secret: e.target.value }))} /></div>
            <div className="space-y-2"><Label>NAS Type</Label><Select value={form.nasType} onValueChange={(v) => setForm((f) => ({ ...f, nasType: v }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="24online SMS">24online SMS</SelectItem><SelectItem value="BRAS">BRAS</SelectItem><SelectItem value="Hotspot">Hotspot</SelectItem><SelectItem value="Mikrotik">Mikrotik</SelectItem></SelectContent></Select></div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button onClick={() => {
              setClients((arr) => [...arr, { id: Math.max(...arr.map((x) => x.id)) + 1, name: form.name, ip: form.ip, secret: form.secret, nasType: form.nasType, status: "Active" }]);
              setShowForm(false); setForm({ name: "", ip: "", secret: "", nasType: "24online SMS" });
              toast({ title: "Client added", description: `${form.name} (${form.ip})` });
            }}><Save className="mr-2 h-4 w-4" /> Add Client</Button>
          </div>
        </SectionCard>
      )}
      <SectionCard title="RADIUS Clients" description={`${clients.length} clients`}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Name</TableHead><TableHead>IP Address</TableHead><TableHead>Secret</TableHead><TableHead>NAS Type</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {clients.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell className="font-mono text-xs">{c.ip}</TableCell>
                  <TableCell className="font-mono text-xs">••••••••</TableCell>
                  <TableCell><Badge variant="outline" className="text-[10px]">{c.nasType}</Badge></TableCell>
                  <TableCell><StatusBadge status={c.status} /></TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => toast({ title: "Edit client", description: c.name })}><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="sm" className="text-primary" onClick={() => { setClients(clients.filter((x) => x.id !== c.id)); toast({ title: "Client deleted", description: c.name }); }}><Trash2 className="h-3.5 w-3.5" /></Button>
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

/* --- Attribute Mapping --- */
function AttributeMappingPage({ moduleId, childId, grandchildId }: ViewProps) {
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const [mappings, setMappings] = React.useState([
    { id: 1, radiusAttr: "User-Name", vendorAttr: "Cryptsk-Username", vendor: "Cryptsk", op: ":=", status: "Active" },
    { id: 2, radiusAttr: "Framed-IP-Address", vendorAttr: "Cryptsk-IP", vendor: "Cryptsk", op: ":=", status: "Active" },
    { id: 3, radiusAttr: "Session-Timeout", vendorAttr: "Cryptsk-Session-Timeout", vendor: "Cryptsk", op: ":=", status: "Active" },
    { id: 4, radiusAttr: "Acct-Interim-Interval", vendorAttr: "Cryptsk-Interim", vendor: "Cryptsk", op: ":=", status: "Active" },
    { id: 5, radiusAttr: "Mikrotik-Rate-Limit", vendorAttr: "Cryptsk-Bandwidth", vendor: "Mikrotik", op: ":=", status: "Active" },
  ]);
  const [showForm, setShowForm] = React.useState(false);
  const [form, setForm] = React.useState({ radiusAttr: "", vendorAttr: "", vendor: "Cryptsk", op: ":=" });

  return (
    <div className="space-y-6">
      <PageHeader title="Attribute Mapping" description="Map standard RADIUS attributes to vendor-specific attributes." breadcrumb={breadcrumb} icon={<HardDrive className="h-5 w-5" />} />
      <ActionBar>
        <Button size="sm" onClick={() => setShowForm(!showForm)}><Plus className="mr-2 h-3.5 w-3.5" /> {showForm ? "Cancel" : "Add Mapping"}</Button>
      </ActionBar>
      {showForm && (
        <SectionCard title="Add Attribute Mapping" description="Create a new RADIUS-to-vendor attribute mapping">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2"><Label>RADIUS Attribute</Label><Input value={form.radiusAttr} onChange={(e) => setForm((f) => ({ ...f, radiusAttr: e.target.value }))} placeholder="e.g. User-Name" /></div>
            <div className="space-y-2"><Label>Vendor Attribute</Label><Input value={form.vendorAttr} onChange={(e) => setForm((f) => ({ ...f, vendorAttr: e.target.value }))} placeholder="e.g. Cryptsk-Username" /></div>
            <div className="space-y-2"><Label>Vendor</Label><Select value={form.vendor} onValueChange={(v) => setForm((f) => ({ ...f, vendor: v }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Cryptsk">Cryptsk</SelectItem><SelectItem value="Mikrotik">Mikrotik</SelectItem><SelectItem value="Cisco">Cisco</SelectItem><SelectItem value="Juniper">Juniper</SelectItem></SelectContent></Select></div>
            <div className="space-y-2"><Label>Operator</Label><Select value={form.op} onValueChange={(v) => setForm((f) => ({ ...f, op: v }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value=":=">:= (Assign)</SelectItem><SelectItem value="==">== (Equal)</SelectItem><SelectItem value="+=">+= (Append)</SelectItem></SelectContent></Select></div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button onClick={() => {
              setMappings((arr) => [...arr, { id: Math.max(...arr.map((x) => x.id)) + 1, ...form, status: "Active" }]);
              setShowForm(false); setForm({ radiusAttr: "", vendorAttr: "", vendor: "Cryptsk", op: ":=" });
              toast({ title: "Mapping added", description: `${form.radiusAttr} → ${form.vendorAttr}` });
            }}><Save className="mr-2 h-4 w-4" /> Add Mapping</Button>
          </div>
        </SectionCard>
      )}
      <SectionCard title="Attribute Mappings" description={`${mappings.length} mappings`}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader><TableRow>
              <TableHead>RADIUS Attribute</TableHead><TableHead>Vendor Attribute</TableHead><TableHead>Vendor</TableHead><TableHead>Operator</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {mappings.map((m) => (
                <TableRow key={m.id}>
                  <TableCell className="font-mono text-xs font-medium">{m.radiusAttr}</TableCell>
                  <TableCell className="font-mono text-xs">{m.vendorAttr}</TableCell>
                  <TableCell><Badge variant="outline" className="text-[10px]">{m.vendor}</Badge></TableCell>
                  <TableCell className="font-mono text-xs">{m.op}</TableCell>
                  <TableCell><StatusBadge status={m.status} /></TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => toast({ title: "Edit mapping", description: m.radiusAttr })}><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="sm" className="text-primary" onClick={() => { setMappings(mappings.filter((x) => x.id !== m.id)); toast({ title: "Mapping deleted", description: m.radiusAttr }); }}><Trash2 className="h-3.5 w-3.5" /></Button>
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

/* --- Priorities (Network) --- */
function PrioritiesPage({ moduleId, childId, grandchildId }: ViewProps) {
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const [priorities, setPriorities] = React.useState([
    { id: 1, name: "WAN-1-Primary", gateway: "103.205.148.25", interface: "eth12", weight: 100, status: "Active" },
    { id: 2, name: "WAN-2-Backup", gateway: "103.205.151.1", interface: "eth13", weight: 50, status: "Active" },
    { id: 3, name: "WAN-3-Failover", gateway: "10.10.5.1", interface: "eth4", weight: 10, status: "Inactive" },
  ]);
  const [showForm, setShowForm] = React.useState(false);
  const [form, setForm] = React.useState({ name: "", gateway: "", interface: "eth0", weight: "100" });

  return (
    <div className="space-y-6">
      <PageHeader title="Priorities" description="Manage traffic prioritization across multiple WAN interfaces." breadcrumb={breadcrumb} icon={<Settings2 className="h-5 w-5" />} />
      <ActionBar>
        <Button size="sm" onClick={() => setShowForm(!showForm)}><Plus className="mr-2 h-3.5 w-3.5" /> {showForm ? "Cancel" : "Add Priority"}</Button>
      </ActionBar>
      {showForm && (
        <SectionCard title="Add Priority" description="Create a new WAN traffic priority rule">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2"><Label>Priority Name</Label><Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. WAN-1-Primary" /></div>
            <div className="space-y-2"><Label>Gateway IP</Label><Input value={form.gateway} onChange={(e) => setForm((f) => ({ ...f, gateway: e.target.value }))} placeholder="e.g. 103.205.148.25" /></div>
            <div className="space-y-2"><Label>Interface</Label><Select value={form.interface} onValueChange={(v) => setForm((f) => ({ ...f, interface: v }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="eth0">eth0</SelectItem><SelectItem value="eth12">eth12 (WAN-1)</SelectItem><SelectItem value="eth13">eth13 (WAN-2)</SelectItem><SelectItem value="eth4">eth4 (WAN-3)</SelectItem></SelectContent></Select></div>
            <div className="space-y-2"><Label>Weight</Label><Input type="number" min="1" max="100" value={form.weight} onChange={(e) => setForm((f) => ({ ...f, weight: e.target.value }))} /></div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button onClick={() => {
              setPriorities((arr) => [...arr, { id: Math.max(...arr.map((x) => x.id)) + 1, name: form.name, gateway: form.gateway, interface: form.interface, weight: Number(form.weight), status: "Active" }]);
              setShowForm(false); setForm({ name: "", gateway: "", interface: "eth0", weight: "100" });
              toast({ title: "Priority added", description: form.name });
            }}><Save className="mr-2 h-4 w-4" /> Add</Button>
          </div>
        </SectionCard>
      )}
      <SectionCard title="Traffic Priorities" description={`${priorities.length} priorities configured`}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Name</TableHead><TableHead>Gateway</TableHead><TableHead>Interface</TableHead><TableHead>Weight</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {priorities.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell className="font-mono text-xs">{p.gateway}</TableCell>
                  <TableCell className="font-mono text-xs">{p.interface}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                        <div className="h-full bg-primary" style={{ width: `${p.weight}%` }} />
                      </div>
                      <span className="text-xs">{p.weight}</span>
                    </div>
                  </TableCell>
                  <TableCell><StatusBadge status={p.status} /></TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => toast({ title: "Edit priority", description: p.name })}><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="sm" className="text-primary" onClick={() => { setPriorities(priorities.filter((x) => x.id !== p.id)); toast({ title: "Priority deleted", description: p.name }); }}><Trash2 className="h-3.5 w-3.5" /></Button>
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

/* --- Manage PPPoE --- */
function ManagePppoePage({ moduleId, childId, grandchildId }: ViewProps) {
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const [form, setForm] = React.useState({
    pppoeEnabled: true,
    interface: "eth0",
    authType: "PAP",
    mppe: false,
    mtu: "1492",
    mru: "1492",
    idleTimeout: "0",
    sessionTimeout: "0",
    maxSessions: "500",
    dns1: "8.8.8.8",
    dns2: "8.8.4.4",
    wins: "",
  });
  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="space-y-6">
      <PageHeader title="Manage PPPoE" description="Configure the PPPoE server settings for user connections." breadcrumb={breadcrumb} icon={<Settings2 className="h-5 w-5" />} />
      <form onSubmit={(e) => { e.preventDefault(); toast({ title: "PPPoE config saved", description: "PPPoE server settings updated." }); }}>
        <div className="space-y-6">
          <SectionCard title="PPPoE Server" description="Enable and configure the PPPoE server">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex items-center gap-3 md:col-span-2"><Switch checked={form.pppoeEnabled} onCheckedChange={(v) => set("pppoeEnabled", v)} /><Label>Enable PPPoE Server</Label></div>
              <div className="space-y-2"><Label>Interface</Label><Select value={form.interface} onValueChange={(v) => set("interface", v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="eth0">eth0 (LAN)</SelectItem><SelectItem value="eth2">eth2 (MGMT)</SelectItem><SelectItem value="eth3">eth3 (Zone-1)</SelectItem></SelectContent></Select></div>
              <div className="space-y-2"><Label>Authentication Type</Label><Select value={form.authType} onValueChange={(v) => set("authType", v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="PAP">PAP</SelectItem><SelectItem value="CHAP">CHAP</SelectItem><SelectItem value="MS-CHAPv2">MS-CHAPv2</SelectItem></SelectContent></Select></div>
              <div className="flex items-center gap-3"><Switch checked={form.mppe} onCheckedChange={(v) => set("mppe", v)} /><Label>Enable MPPE Encryption</Label></div>
              <div className="space-y-2"><Label htmlFor="maxSessions">Max Sessions</Label><Input id="maxSessions" type="number" value={form.maxSessions} onChange={(e) => set("maxSessions", e.target.value)} /></div>
            </div>
          </SectionCard>
          <SectionCard title="MTU / MRU" description="Maximum Transmission / Receive Unit sizes">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2"><Label htmlFor="mtu">MTU</Label><Input id="mtu" type="number" value={form.mtu} onChange={(e) => set("mtu", e.target.value)} /></div>
              <div className="space-y-2"><Label htmlFor="mru">MRU</Label><Input id="mru" type="number" value={form.mru} onChange={(e) => set("mru", e.target.value)} /></div>
            </div>
          </SectionCard>
          <SectionCard title="Timeouts" description="Session and idle timeout values">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2"><Label htmlFor="idleTimeout">Idle Timeout (seconds, 0=no timeout)</Label><Input id="idleTimeout" type="number" value={form.idleTimeout} onChange={(e) => set("idleTimeout", e.target.value)} /></div>
              <div className="space-y-2"><Label htmlFor="sessionTimeout">Session Timeout (seconds, 0=no timeout)</Label><Input id="sessionTimeout" type="number" value={form.sessionTimeout} onChange={(e) => set("sessionTimeout", e.target.value)} /></div>
            </div>
          </SectionCard>
          <SectionCard title="DNS / WINS" description="DNS and WINS servers pushed to PPPoE clients">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="space-y-2"><Label htmlFor="dns1">Primary DNS</Label><Input id="dns1" value={form.dns1} onChange={(e) => set("dns1", e.target.value)} className="font-mono text-xs" /></div>
              <div className="space-y-2"><Label htmlFor="dns2">Secondary DNS</Label><Input id="dns2" value={form.dns2} onChange={(e) => set("dns2", e.target.value)} className="font-mono text-xs" /></div>
              <div className="space-y-2"><Label htmlFor="wins">WINS Server</Label><Input id="wins" value={form.wins} onChange={(e) => set("wins", e.target.value)} className="font-mono text-xs" placeholder="Optional" /></div>
            </div>
          </SectionCard>
        </div>
        <div className="mt-4 flex justify-end"><Button type="submit"><Save className="mr-2 h-4 w-4" /> Save PPPoE Configuration</Button></div>
      </form>
    </div>
  );
}
