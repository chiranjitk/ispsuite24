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
import { CkEditorField } from "@/components/app/CkEditorField";

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
  const { grandchild } = useModuleHeader(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);

  // Attack types from 24online reference (SYN/UDP/TCP/ICMP Flood)
  const attacks = [
    { id: 1, name: "SYN Flood" },
    { id: 2, name: "UDP Flood" },
    { id: 3, name: "TCP Flood" },
    { id: 4, name: "ICMP Flood" },
  ];

  // State mirrors the 24online form fields exactly:
  // txtSrc1-4, chkSrc1-4, txtDst1-8, chkDst1-8, mode (hidden)
  const [srcRates, setSrcRates] = React.useState<string[]>(["", "", "", ""]);
  const [srcFlags, setSrcFlags] = React.useState<boolean[]>([false, false, false, false]);
  const [dstRates, setDstRates] = React.useState<string[]>(Array(8).fill(""));
  const [dstFlags, setDstFlags] = React.useState<boolean[]>(Array(8).fill(false));
  const [saving, setSaving] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    setSaving(false);
    toast({
      title: "DoS settings updated",
      description: "GeneralRuleManager: DoS protection rules saved successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={grandchild?.label ?? "DoS Settings"}
        description="Configure per-attack-type source/destination packet rate thresholds and traffic drop rules."
        icon={<ShieldAlert className="h-5 w-5" />}
        breadcrumb={breadcrumb}
      />
      <form onSubmit={handleSubmit} action="GeneralRuleManager">
        {/* hidden mode field as required by 24online */}
        <input type="hidden" name="mode" value="dosSettings" />
        <SectionCard
          title="DoS Attack Protection"
          description="3 attack types with source rate / source traffic dropped / destination traffic dropped thresholds"
          actions={
            <Button type="submit" disabled={saving}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Update
            </Button>
          }
        >
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Attack Type</TableHead>
                  <TableHead>Source Packet Rate (packets/minute)</TableHead>
                  <TableHead>Apply Flag</TableHead>
                  <TableHead>Source Traffic Dropped</TableHead>
                  <TableHead>Apply Flag</TableHead>
                  <TableHead>Destination Traffic Dropped</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attacks.map((a, i) => {
                  const dstSrcIdx = i * 2; // index for "Source Traffic Dropped" rate
                  const dstDstIdx = i * 2 + 1; // index for "Destination Traffic Dropped" rate
                  return (
                    <TableRow key={a.id}>
                      <TableCell className="font-medium">{a.name}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          name={`txtSrc${i + 1}`}
                          value={srcRates[i]}
                          onChange={(e) => {
                            const v = [...srcRates];
                            v[i] = e.target.value;
                            setSrcRates(v);
                          }}
                          placeholder="0"
                          className="h-8 w-32 font-mono text-xs"
                        />
                      </TableCell>
                      <TableCell>
                        <Checkbox
                          name={`chkSrc${i + 1}`}
                          checked={srcFlags[i]}
                          onCheckedChange={(c) => {
                            const v = [...srcFlags];
                            v[i] = !!c;
                            setSrcFlags(v);
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          name={`txtDst${dstSrcIdx + 1}`}
                          value={dstRates[dstSrcIdx]}
                          onChange={(e) => {
                            const v = [...dstRates];
                            v[dstSrcIdx] = e.target.value;
                            setDstRates(v);
                          }}
                          placeholder="0"
                          className="h-8 w-32 font-mono text-xs"
                        />
                      </TableCell>
                      <TableCell>
                        <Checkbox
                          name={`chkDst${dstSrcIdx + 1}`}
                          checked={dstFlags[dstSrcIdx]}
                          onCheckedChange={(c) => {
                            const v = [...dstFlags];
                            v[dstSrcIdx] = !!c;
                            setDstFlags(v);
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            name={`txtDst${dstDstIdx + 1}`}
                            value={dstRates[dstDstIdx]}
                            onChange={(e) => {
                              const v = [...dstRates];
                              v[dstDstIdx] = e.target.value;
                              setDstRates(v);
                            }}
                            placeholder="0"
                            className="h-8 w-32 font-mono text-xs"
                          />
                          <Checkbox
                            name={`chkDst${dstDstIdx + 1}`}
                            checked={dstFlags[dstDstIdx]}
                            onCheckedChange={(c) => {
                              const v = [...dstFlags];
                              v[dstDstIdx] = !!c;
                              setDstFlags(v);
                            }}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Tick the <span className="font-medium text-foreground">Apply Flag</span> checkbox to apply the corresponding packet rate / drop threshold for that attack type and direction.
          </p>
        </SectionCard>
      </form>
    </div>
  );
}

/* ---------- DoS Bypass ---------- */

function DosBypassPage({ moduleId, childId, grandchildId }: ViewProps) {
  const { grandchild } = useModuleHeader(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);

  // 24online DoS Bypass — table columns:
  // Source | Source Port | Destination | Destination Port | Protocol | Del(checkbox)
  // Buttons: Create, Delete
  // Form action: GeneralRuleManager
  // Has chkSelectAll checkbox in the Del column header
  const [rows, setRows] = React.useState<any[]>([
    { id: 1, source: "*", sourcePort: "*", destination: "127.0.0.1", destinationPort: "1812", protocol: "UDP", selected: false },
    { id: 2, source: "192.168.1.0/24", sourcePort: "*", destination: "*", destinationPort: "53", protocol: "UDP", selected: false },
    { id: 3, source: "10.10.0.0/16", sourcePort: "123", destination: "10.10.5.1", destinationPort: "*", protocol: "UDP", selected: false },
  ]);
  const [showForm, setShowForm] = React.useState(false);
  const [form, setForm] = React.useState({ source: "", sourcePort: "*", destination: "", destinationPort: "*", protocol: "UDP" });
  const [saving, setSaving] = React.useState(false);

  const allSelected = rows.length > 0 && rows.every((r) => r.selected);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.source && !form.destination) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 300));
    setSaving(false);
    setRows([...rows, { id: Date.now(), ...form, selected: false }]);
    toast({ title: "Bypass rule created", description: `${form.source || "*"} → ${form.destination || "*"}` });
    setForm({ source: "", sourcePort: "*", destination: "", destinationPort: "*", protocol: "UDP" });
    setShowForm(false);
  };

  const toggleSel = (id: number) => {
    setRows(rows.map((r) => (r.id === id ? { ...r, selected: !r.selected } : r)));
  };
  const toggleAll = () => {
    setRows(rows.map((r) => ({ ...r, selected: !allSelected })));
  };
  const handleDelete = () => {
    const sel = rows.filter((r) => r.selected);
    if (sel.length === 0) {
      toast({ title: "No selection", description: "Select at least one rule to delete." });
      return;
    }
    setRows(rows.filter((r) => !r.selected));
    toast({ title: "Bypass rules deleted", description: `${sel.length} rule(s) removed.` });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={grandchild?.label ?? "DoS Bypass"}
        description="Create rules to bypass DoS protection for specific traffic (Source, Destination, Port, Protocol)."
        icon={<ShieldAlert className="h-5 w-5" />}
        breadcrumb={breadcrumb}
      />
      <form action="GeneralRuleManager">
        <ActionBar>
          <Button type="button" size="sm" onClick={() => setShowForm(!showForm)}>
            <Plus className="mr-2 h-3.5 w-3.5" /> {showForm ? "Cancel" : "Create"}
          </Button>
          <Button type="button" size="sm" variant="destructive" onClick={handleDelete}>
            <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete
          </Button>
        </ActionBar>

        {showForm && (
          <SectionCard title="Create Bypass Rule" description="Traffic matching this rule will bypass DoS protection">
            <form onSubmit={handleAdd} className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Source *</Label>
                <Input value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} placeholder="* for all or IP/Network" required />
              </div>
              <div className="space-y-2">
                <Label>Source Port</Label>
                <Input value={form.sourcePort} onChange={(e) => setForm({ ...form, sourcePort: e.target.value })} placeholder="* for all" />
              </div>
              <div className="space-y-2">
                <Label>Protocol</Label>
                <Select value={form.protocol} onValueChange={(v) => setForm({ ...form, protocol: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TCP">TCP</SelectItem>
                    <SelectItem value="UDP">UDP</SelectItem>
                    <SelectItem value="ICMP">ICMP</SelectItem>
                    <SelectItem value="ANY">Any</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Destination *</Label>
                <Input value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} placeholder="* for all or IP/Network" required />
              </div>
              <div className="space-y-2">
                <Label>Destination Port</Label>
                <Input value={form.destinationPort} onChange={(e) => setForm({ ...form, destinationPort: e.target.value })} placeholder="* for all" />
              </div>
              <div className="flex items-end">
                <Button type="submit" disabled={saving} className="w-full">
                  {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                  Create
                </Button>
              </div>
            </form>
          </SectionCard>
        )}

        <SectionCard title="Manage DoS Bypass Rules" description={`${rows.length} rules`}>
          {rows.length === 0 ? (
            <EmptyState icon={<ShieldCheck className="h-5 w-5" />} title="No bypass rules" description="Create a rule to bypass DoS protection for specific traffic." />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Source</TableHead>
                    <TableHead>Source Port</TableHead>
                    <TableHead>Destination</TableHead>
                    <TableHead>Destination Port</TableHead>
                    <TableHead>Protocol</TableHead>
                    <TableHead className="text-center">
                      <Checkbox
                        name="chkSelectAll"
                        checked={allSelected}
                        onCheckedChange={toggleAll}
                        aria-label="Select all"
                      />
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-mono text-xs">{r.source || "*"}</TableCell>
                      <TableCell className="font-mono text-xs">{r.sourcePort || "*"}</TableCell>
                      <TableCell className="font-mono text-xs">{r.destination || "*"}</TableCell>
                      <TableCell className="font-mono text-xs">{r.destinationPort || "*"}</TableCell>
                      <TableCell><Badge variant="outline" className="text-[10px]">{r.protocol}</Badge></TableCell>
                      <TableCell className="text-center">
                        <Checkbox
                          checked={r.selected}
                          onCheckedChange={() => toggleSel(r.id)}
                          aria-label={`Select ${r.source || "*"} → ${r.destination || "*"}`}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </SectionCard>
      </form>
    </div>
  );
}

/* ---------- Free Sites ---------- */

function FreeSitesPage({ moduleId, childId, grandchildId }: ViewProps) {
  const { grandchild } = useModuleHeader(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);

  // 24online FreeSitesManager — fields: sitename (text), add (submit)
  const [rows, setRows] = React.useState<{ id: number; siteName: string }[]>([
    { id: 1, siteName: "google.com" },
    { id: 2, siteName: "facebook.com" },
    { id: 3, siteName: "whatsapp.com" },
  ]);
  const [sitename, setSitename] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sitename.trim()) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 300));
    setSaving(false);
    setRows([...rows, { id: Date.now(), siteName: sitename.trim() }]);
    toast({ title: "Free site added", description: sitename.trim() });
    setSitename("");
  };

  const handleDelete = (id: number, siteName: string) => {
    setRows(rows.filter((r) => r.id !== id));
    toast({ title: "Free site removed", description: siteName });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={grandchild?.label ?? "Free Sites"}
        description="Add zero-rated sites (these sites are accessible without authentication)."
        icon={<Globe className="h-5 w-5" />}
        breadcrumb={breadcrumb}
      />
      <form onSubmit={handleAdd} action="FreeSitesManager">
        <SectionCard
          title="Add Free Site"
          description="Enter a site name (URL) to add it to the free-sites list"
          actions={
            <Button type="submit" disabled={saving || !sitename.trim()}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
              Add
            </Button>
          }
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="sitename">Site Name</Label>
              <Input
                id="sitename"
                name="sitename"
                value={sitename}
                onChange={(e) => setSitename(e.target.value)}
                placeholder="e.g. example.com"
                required
              />
            </div>
            <div className="flex items-end">
              <p className="text-xs text-muted-foreground">
                Enter the URL without <code className="rounded bg-muted px-1">http://</code>. The site will be accessible without authentication.
              </p>
            </div>
          </div>
        </SectionCard>
      </form>
      <SectionCard title="Free Sites List" description={`${rows.length} sites`}>
        {rows.length === 0 ? (
          <EmptyState icon={<Globe className="h-5 w-5" />} title="No free sites" description="Add your first free site using the form above." />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Site Name</TableHead>
                  <TableHead className="text-right">Delete</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-mono text-xs">{r.siteName}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-primary hover:text-primary"
                        onClick={() => handleDelete(r.id, r.siteName)}
                      >
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
  const { grandchild } = useModuleHeader(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);

  // 24online DHCPManager — fields per row:
  // mode, dhcpinterface, servername, actionname, page, chgstatus, chgstartup
  // Buttons: Start/Stop (chgstatus) + Autostart toggle (chgstartup)
  // Table: Interface | Interface IP | Net Mask | Network Type | DHCP Enabled | Interface Description
  const [rows, setRows] = React.useState<any[]>([
    { id: 1, iface: "eth0", ip: "192.168.1.1", netmask: "255.255.255.0", netType: "LAN", dhcpEnabled: "Enabled", desc: "Internal LAN", running: true, autostart: true },
    { id: 2, iface: "eth1", ip: "203.0.113.5", netmask: "255.255.255.252", netType: "WAN", dhcpEnabled: "Disabled", desc: "External WAN uplink", running: false, autostart: false },
    { id: 3, iface: "wlan0", ip: "10.10.10.1", netmask: "255.255.255.0", netType: "WLAN", dhcpEnabled: "Enabled", desc: "WiFi access network", running: true, autostart: true },
  ]);
  const [busyId, setBusyId] = React.useState<number | null>(null);

  const handleStartStop = async (r: any) => {
    setBusyId(r.id);
    await new Promise((res) => setTimeout(res, 400));
    setBusyId(null);
    const newRunning = !r.running;
    const newEnabled = newRunning ? "Enabled" : "Disabled";
    setRows(rows.map((x) => (x.id === r.id ? { ...x, running: newRunning, dhcpEnabled: newEnabled } : x)));
    toast({
      title: newRunning ? "DHCP service started" : "DHCP service stopped",
      description: `${r.iface}: DHCP ${newRunning ? "started" : "stopped"}.`,
    });
  };

  const handleAutostart = async (r: any) => {
    setRows(rows.map((x) => (x.id === r.id ? { ...x, autostart: !x.autostart } : x)));
    toast({
      title: "Autostart updated",
      description: `${r.iface}: autostart ${r.autostart ? "disabled" : "enabled"}.`,
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={grandchild?.label ?? "Manage DHCP"}
        description="Start, stop, and enable autostart for DHCP servers running on each network interface."
        icon={<Wifi className="h-5 w-5" />}
        breadcrumb={breadcrumb}
      />
      <form action="DHCPManager">
        {/* hidden fields as required by 24online */}
        <input type="hidden" name="mode" value="manageDhcp" />
        <input type="hidden" name="page" value="manageDhcp" />
        <SectionCard title="DHCP Servers" description={`${rows.length} interfaces`}>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Interface</TableHead>
                  <TableHead>Interface IP</TableHead>
                  <TableHead>Net Mask</TableHead>
                  <TableHead>Network Type</TableHead>
                  <TableHead>DHCP Enabled</TableHead>
                  <TableHead>Interface Description</TableHead>
                  <TableHead>Autostart</TableHead>
                  <TableHead className="text-right">Start / Stop</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-mono text-xs font-semibold">{r.iface}</TableCell>
                    <TableCell className="font-mono text-xs">{r.ip}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{r.netmask}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={r.netType === "WAN"
                          ? "border-amber-500/30 text-amber-700 dark:text-amber-400"
                          : "border-emerald-500/30 text-emerald-700 dark:text-emerald-400"}
                      >
                        {r.netType}
                      </Badge>
                    </TableCell>
                    <TableCell><StatusBadge status={r.dhcpEnabled} /></TableCell>
                    <TableCell className="text-xs">{r.desc}</TableCell>
                    <TableCell>
                      <Switch
                        checked={!!r.autostart}
                        onCheckedChange={() => handleAutostart(r)}
                        aria-label="Toggle autostart"
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <input type="hidden" name={`dhcpinterface_${r.id}`} value={r.iface} />
                      <input type="hidden" name={`servername_${r.id}`} value={`dhcpd_${r.iface}`} />
                      {busyId === r.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Button
                          type="button"
                          size="sm"
                          variant={r.running ? "destructive" : "default"}
                          onClick={() => handleStartStop(r)}
                        >
                          {r.running ? (
                            <><Square className="mr-1.5 h-3.5 w-3.5" /> Stop</>
                          ) : (
                            <><Play className="mr-1.5 h-3.5 w-3.5" /> Start</>
                          )}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </SectionCard>
      </form>
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
  const { grandchild } = useModuleHeader(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);

  // 24online IP Leasing Report — form fields:
  // dhcpinterface (select), ipaddress (text), macaddress (text),
  // clienthostname (text), vci (text), state (select), getdetail (submit)
  const [form, setForm] = React.useState({
    dhcpinterface: "all",
    ipaddress: "",
    macaddress: "",
    clienthostname: "",
    vci: "",
    state: "all",
  });
  const [loading, setLoading] = React.useState(false);
  const [rows, setRows] = React.useState<any[]>([]);

  const allLeases: any[] = [
    { id: 1, dhcpInterface: "eth0", ip: "192.168.1.10", mac: "AA:BB:CC:00:00:01", host: "client-01", vci: "MSFT 5.0", leaseStart: "2026-01-15 08:30:00", leaseExpiry: "2026-01-16 08:30:00", state: "Active" },
    { id: 2, dhcpInterface: "eth0", ip: "192.168.1.11", mac: "AA:BB:CC:00:00:02", host: "client-02", vci: "android-dhcp", leaseStart: "2026-01-15 09:15:00", leaseExpiry: "2026-01-16 09:15:00", state: "Active" },
    { id: 3, dhcpInterface: "wlan0", ip: "10.10.10.25", mac: "AA:BB:CC:00:00:03", host: "iphone-x", vci: "dhcp-client-1.0", leaseStart: "2026-01-15 07:00:00", leaseExpiry: "2026-01-15 19:00:00", state: "Expired" },
    { id: 4, dhcpInterface: "wlan0", ip: "10.10.10.26", mac: "AA:BB:CC:00:00:04", host: "android-pixel", vci: "android-dhcp", leaseStart: "2026-01-15 11:45:00", leaseExpiry: "2026-01-16 11:45:00", state: "Active" },
    { id: 5, dhcpInterface: "eth1", ip: "203.0.113.10", mac: "AA:BB:CC:00:00:05", host: "router-uplink", vci: "router-os", leaseStart: "2026-01-14 22:00:00", leaseExpiry: "2026-01-21 22:00:00", state: "Released" },
  ];

  const handleGetDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    setLoading(false);
    const filtered = allLeases.filter((r) => {
      if (form.dhcpinterface !== "all" && r.dhcpInterface !== form.dhcpinterface) return false;
      if (form.ipaddress && !r.ip.includes(form.ipaddress)) return false;
      if (form.macaddress && !r.mac.toLowerCase().includes(form.macaddress.toLowerCase())) return false;
      if (form.clienthostname && !r.host.toLowerCase().includes(form.clienthostname.toLowerCase())) return false;
      if (form.vci && !r.vci.toLowerCase().includes(form.vci.toLowerCase())) return false;
      if (form.state !== "all" && r.state !== form.state) return false;
      return true;
    });
    setRows(filtered);
    toast({
      title: "Lease details retrieved",
      description: `${filtered.length} matching DHCP leases.`,
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={grandchild?.label ?? "IP Leasing Report"}
        description="View DHCP IP leasing details by interface, IP, MAC, hostname, VCI, or lease state."
        icon={<Wifi className="h-5 w-5" />}
        breadcrumb={breadcrumb}
      />
      <form onSubmit={handleGetDetails}>
        <SectionCard
          title="Filter Leases"
          description="Use any combination of filters — leave blank to retrieve all leases"
          actions={
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
              Get Details
            </Button>
          }
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="dhcpinterface">DHCP Interface</Label>
              <Select value={form.dhcpinterface} onValueChange={(v) => setForm({ ...form, dhcpinterface: v })}>
                <SelectTrigger id="dhcpinterface"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All interfaces</SelectItem>
                  <SelectItem value="eth0">eth0</SelectItem>
                  <SelectItem value="eth1">eth1</SelectItem>
                  <SelectItem value="wlan0">wlan0</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ipaddress">IP Address</Label>
              <Input id="ipaddress" name="ipaddress" value={form.ipaddress} onChange={(e) => setForm({ ...form, ipaddress: e.target.value })} placeholder="192.168.1.10" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="macaddress">MAC Address</Label>
              <Input id="macaddress" name="macaddress" value={form.macaddress} onChange={(e) => setForm({ ...form, macaddress: e.target.value })} placeholder="AA:BB:CC:DD:EE:FF" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clienthostname">Client Hostname</Label>
              <Input id="clienthostname" name="clienthostname" value={form.clienthostname} onChange={(e) => setForm({ ...form, clienthostname: e.target.value })} placeholder="client-01" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vci">VCI</Label>
              <Input id="vci" name="vci" value={form.vci} onChange={(e) => setForm({ ...form, vci: e.target.value })} placeholder="MSFT 5.0" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Select value={form.state} onValueChange={(v) => setForm({ ...form, state: v })}>
                <SelectTrigger id="state"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All states</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Expired">Expired</SelectItem>
                  <SelectItem value="Released">Released</SelectItem>
                  <SelectItem value="Abandoned">Abandoned</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </SectionCard>
      </form>
      <SectionCard title="DHCP Leases" description={`${rows.length} leases`}>
        {rows.length === 0 ? (
          <EmptyState icon={<Wifi className="h-5 w-5" />} title="No leases retrieved" description="Click Get Details to retrieve DHCP leases." />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>DHCP Interface</TableHead>
                  <TableHead>Leased IP Address</TableHead>
                  <TableHead>MAC Address</TableHead>
                  <TableHead>Client Hostname</TableHead>
                  <TableHead>VCI</TableHead>
                  <TableHead>Lease Start Time</TableHead>
                  <TableHead>Lease Expiry Time</TableHead>
                  <TableHead>State</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-mono text-xs font-semibold">{r.dhcpInterface}</TableCell>
                    <TableCell className="font-mono text-xs">{r.ip}</TableCell>
                    <TableCell className="font-mono text-xs">{r.mac}</TableCell>
                    <TableCell className="text-xs">{r.host}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{r.vci}</TableCell>
                    <TableCell className="text-xs">{r.leaseStart}</TableCell>
                    <TableCell className="text-xs">{r.leaseExpiry}</TableCell>
                    <TableCell><StatusBadge status={r.state} /></TableCell>
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

  // 24online Services — buttons per service:
  // btndhcpserver/btndns/btnpppoed/btndynamicdns/btnrestart/btnshutdown
  // chgdhcpserver/chgdns/chgpppoed/chgdynamicdns (autostart toggles)
  // Table columns: Service Name | Status | Commands
  // Services: DHCP Server, DNS, Server (Web), PPPoE, Dynamic DNS
  const [rows, setRows] = React.useState<any[]>([
    { id: "dhcpd", name: "DHCP Server", btnField: "btndhcpserver", chgField: "chgdhcpserver", status: "Running", autostart: true },
    { id: "named", name: "DNS", btnField: "btndns", chgField: "chgdns", status: "Running", autostart: true },
    { id: "web", name: "Server (Web)", btnField: "btnrestart", chgField: "chgdns", status: "Running", autostart: true },
    { id: "pppoe", name: "PPPoE", btnField: "btnpppoed", chgField: "chgpppoed", status: "Stopped", autostart: false },
    { id: "ddns", name: "Dynamic DNS", btnField: "btndynamicdns", chgField: "chgdynamicdns", status: "Running", autostart: false },
  ]);
  const [busyId, setBusyId] = React.useState<string | null>(null);
  const [busyGlobal, setBusyGlobal] = React.useState<"" | "restart" | "shutdown" | null>(null);

  if (!mod || !child) return null;

  const handleStartStop = async (r: any) => {
    setBusyId(r.id);
    await new Promise((res) => setTimeout(res, 400));
    setBusyId(null);
    setRows(rows.map((x) => (x.id === r.id ? { ...x, status: x.status === "Running" ? "Stopped" : "Running" } : x)));
    toast({
      title: r.status === "Running" ? "Service stopped" : "Service started",
      description: `${r.name}: ${r.status === "Running" ? "stop" : "start"} command issued.`,
    });
  };

  const handleAutostart = async (r: any) => {
    setRows(rows.map((x) => (x.id === r.id ? { ...x, autostart: !x.autostart } : x)));
    toast({
      title: "Autostart updated",
      description: `${r.name}: autostart ${r.autostart ? "disabled" : "enabled"}.`,
    });
  };

  const handleGlobal = async (cmd: "restart" | "shutdown") => {
    setBusyGlobal(cmd);
    await new Promise((res) => setTimeout(res, 700));
    setBusyGlobal(null);
    if (cmd === "shutdown") {
      setRows(rows.map((x) => ({ ...x, status: "Stopped" })));
    }
    toast({
      title: cmd === "restart" ? "All services restarted" : "All services shut down",
      description: cmd === "restart" ? "Restart command sent to all services." : "Shutdown command sent to all services.",
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={child.label}
        description={child.desc}
        icon={<mod.icon className="h-5 w-5" />}
        breadcrumb={[{ label: "Cryptsk" }, { label: mod.label }, { label: child.label }]}
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => handleGlobal("restart")} disabled={!!busyGlobal}>
              {busyGlobal === "restart" ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="mr-2 h-3.5 w-3.5" />}
              Restart All
            </Button>
            <Button variant="destructive" size="sm" onClick={() => handleGlobal("shutdown")} disabled={!!busyGlobal}>
              {busyGlobal === "shutdown" ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> : <Power className="mr-2 h-3.5 w-3.5" />}
              Shutdown
            </Button>
          </>
        }
      />
      <SectionCard title="System Services" description={`${rows.length} services`}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Autostart</TableHead>
                <TableHead className="text-right">Commands</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.name}</TableCell>
                  <TableCell><StatusBadge status={r.status} /></TableCell>
                  <TableCell>
                    <Switch
                      checked={!!r.autostart}
                      onCheckedChange={() => handleAutostart(r)}
                      aria-label={`Toggle autostart for ${r.name}`}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <input type="hidden" name={`servername_${r.id}`} value={r.id} />
                    {busyId === r.id ? (
                      <Loader2 className="ml-auto h-4 w-4 animate-spin" />
                    ) : (
                      <Button
                        type="button"
                        size="sm"
                        variant={r.status === "Running" ? "destructive" : "default"}
                        onClick={() => handleStartStop(r)}
                      >
                        {r.status === "Running" ? (
                          <><Square className="mr-1.5 h-3.5 w-3.5" /> Stop</>
                        ) : (
                          <><Play className="mr-1.5 h-3.5 w-3.5" /> Start</>
                        )}
                      </Button>
                    )}
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
 *  CONSOLE (leaf child)
 * ===================================================================== */

function ConsolePage({ moduleId, childId }: ViewProps) {
  const { mod, child } = useModuleHeader(moduleId, childId);
  const { toast } = useToast();
  const [saving, setSaving] = React.useState(false);
  const [showOld, setShowOld] = React.useState(false);
  const [showNew, setShowNew] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);

  // 24online Console — form fields:
  // guiadminpass (password), newconsolepass (password),
  // newconsolepass1 (password), submitme (submit)
  // Labels: GUI Administrator Password*, New Console Password*, Confirm New Console Password*
  const [form, setForm] = React.useState({
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
    toast({ title: "Console password changed", description: "Console credentials updated successfully." });
    setForm({ guiadminpass: "", newconsolepass: "", newconsolepass1: "" });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={child.label}
        description={child.desc}
        icon={<mod.icon className="h-5 w-5" />}
        breadcrumb={[{ label: "Cryptsk" }, { label: mod.label }, { label: child.label }]}
      />
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <SectionCard title="Reset Console Password" description="Update the console administrator credentials.">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="guiadminpass">
                GUI Administrator Password <span className="text-primary">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="guiadminpass"
                  name="guiadminpass"
                  type={showOld ? "text" : "password"}
                  value={form.guiadminpass}
                  onChange={(e) => setForm({ ...form, guiadminpass: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowOld((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                >
                  {showOld ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="newconsolepass">
                New Console Password <span className="text-primary">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="newconsolepass"
                  name="newconsolepass"
                  type={showNew ? "text" : "password"}
                  value={form.newconsolepass}
                  onChange={(e) => setForm({ ...form, newconsolepass: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNew((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                >
                  {showNew ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="newconsolepass1">
                Confirm New Console Password <span className="text-primary">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="newconsolepass1"
                  name="newconsolepass1"
                  type={showConfirm ? "text" : "password"}
                  value={form.newconsolepass1}
                  onChange={(e) => setForm({ ...form, newconsolepass1: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
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
        <div className="flex items-center justify-end">
          <Button type="submit" name="submitme" disabled={saving}>
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <KeyRound className="mr-2 h-4 w-4" />}
            Submit
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
  const { grandchild } = useModuleHeader(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);

  // 24online Backup — fields:
  // btnbackup (button), startmonth/endmonth (selects), btnusersessionbackup (button),
  // btnrrdbackup (button), displaystartdate/displayenddate (text),
  // btnwebsurfingbackup (button)
  // Sections: "Take Backup of System Data till date",
  //   "Backup User Session" (with month selects),
  //   "Backup RRD", "Backup logs (in CSV Format)" (with date range)
  const [busy, setBusy] = React.useState<string | null>(null);
  const [startmonth, setStartmonth] = React.useState("01");
  const [endmonth, setEndmonth] = React.useState("01");
  const [displaystartdate, setDisplaystartdate] = React.useState("");
  const [displayenddate, setDisplayenddate] = React.useState("");

  const months = [
    { v: "01", l: "January" }, { v: "02", l: "February" }, { v: "03", l: "March" },
    { v: "04", l: "April" }, { v: "05", l: "May" }, { v: "06", l: "June" },
    { v: "07", l: "July" }, { v: "08", l: "August" }, { v: "09", l: "September" },
    { v: "10", l: "October" }, { v: "11", l: "November" }, { v: "12", l: "December" },
  ];

  const run = async (key: string, label: string) => {
    setBusy(key);
    await new Promise((r) => setTimeout(r, 600));
    setBusy(null);
    toast({ title: `${label} completed`, description: "Backup file generated successfully." });
  };

  const download = (label: string) => {
    toast({ title: "Download started", description: label });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={grandchild?.label ?? "Backup"}
        description="Trigger backups for system data, user sessions, RRD files, and web surfing logs."
        icon={<Database className="h-5 w-5" />}
        breadcrumb={breadcrumb}
      />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SectionCard title="Take Backup of System Data till date" description="Generate a full system backup of all data up to today">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              Generates a complete backup of all system data including configuration, users, packages, and billing history.
            </p>
            <div className="flex gap-2">
              <Button name="btnbackup" onClick={() => run("btnbackup", "System data backup")} disabled={!!busy}>
                {busy === "btnbackup" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                Backup
              </Button>
              <Button variant="outline" onClick={() => download("System data backup")} disabled={busy === "btnbackup"}>
                <Download className="mr-2 h-4 w-4" /> Download
              </Button>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Backup User Session" description="Generate a backup of user session data for the selected month range">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="startmonth">Start Month</Label>
                <Select value={startmonth} onValueChange={setStartmonth}>
                  <SelectTrigger id="startmonth"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {months.map((m) => <SelectItem key={m.v} value={m.v}>{m.l}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="endmonth">End Month</Label>
                <Select value={endmonth} onValueChange={setEndmonth}>
                  <SelectTrigger id="endmonth"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {months.map((m) => <SelectItem key={m.v} value={m.v}>{m.l}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button name="btnusersessionbackup" onClick={() => run("btnusersessionbackup", "User session backup")} disabled={!!busy}>
                {busy === "btnusersessionbackup" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                Backup
              </Button>
              <Button variant="outline" onClick={() => download("User session backup")} disabled={busy === "btnusersessionbackup"}>
                <Download className="mr-2 h-4 w-4" /> Download
              </Button>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Backup RRD" description="Generate a backup of Round Robin Database files (used for graphs)">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              RRD files contain historical traffic and usage data used for graphing and reports.
            </p>
            <div className="flex gap-2">
              <Button name="btnrrdbackup" onClick={() => run("btnrrdbackup", "RRD backup")} disabled={!!busy}>
                {busy === "btnrrdbackup" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                Backup
              </Button>
              <Button variant="outline" onClick={() => download("RRD backup")} disabled={busy === "btnrrdbackup"}>
                <Download className="mr-2 h-4 w-4" /> Download
              </Button>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Backup logs (in CSV Format)" description="Export web surfing logs within a date range as a CSV file">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="displaystartdate">Start Date</Label>
                <Input
                  id="displaystartdate"
                  name="displaystartdate"
                  type="date"
                  value={displaystartdate}
                  onChange={(e) => setDisplaystartdate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="displayenddate">End Date</Label>
                <Input
                  id="displayenddate"
                  name="displayenddate"
                  type="date"
                  value={displayenddate}
                  onChange={(e) => setDisplayenddate(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button name="btnwebsurfingbackup" onClick={() => run("btnwebsurfingbackup", "Web surfing logs CSV")} disabled={!!busy}>
                {busy === "btnwebsurfingbackup" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                Backup
              </Button>
              <Button variant="outline" onClick={() => download("Web surfing logs CSV")} disabled={busy === "btnwebsurfingbackup"}>
                <Download className="mr-2 h-4 w-4" /> Download
              </Button>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

/* ---------- Backup Schedule ---------- */

function BackupSchedulePage({ moduleId, childId, grandchildId }: ViewProps) {
  const { grandchild } = useModuleHeader(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);

  // 24online Backup Schedule — fields:
  // mailinterval (radio: Daily/Weekly/Monthly/Never), sendtype (radio: FTP/Mail),
  // mailid (text), ftpserver (text), ftpuser (text), ftppassword (password),
  // usersessioninterval (radio), logchecks (checkboxes),
  // mailloginterval (radio), mailrrdinterval (radio)
  // Sections: Backup frequency Details*, Notify By*, To*, FTP Server*, User Name*,
  //   Password*, User session backup, Backup of RRD Files
  const [mailinterval, setMailinterval] = React.useState("Daily");
  const [sendtype, setSendtype] = React.useState("Mail");
  const [mailid, setMailid] = React.useState("");
  const [ftpserver, setFtpserver] = React.useState("");
  const [ftpuser, setFtpuser] = React.useState("");
  const [ftppassword, setFtppassword] = React.useState("");
  const [usersessioninterval, setUsersessioninterval] = React.useState("Never");
  const [logChecks, setLogChecks] = React.useState({
    authLog: false, userLog: false, auditLog: false, adminLog: false,
  });
  const [mailloginterval, setMailloginterval] = React.useState("Never");
  const [mailrrdinterval, setMailrrdinterval] = React.useState("Never");
  const [saving, setSaving] = React.useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    setSaving(false);
    toast({ title: "Backup schedule saved", description: "Your backup schedule configuration has been saved." });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={grandchild?.label ?? "Backup Schedule"}
        description="Configure automatic backup frequency, delivery method (FTP or Email), and notification settings."
        icon={<CalendarClock className="h-5 w-5" />}
        breadcrumb={breadcrumb}
      />
      <form onSubmit={handleSave} className="space-y-6">
        <SectionCard title="Backup frequency Details *" description="How often the system data backup should be generated">
          <div className="flex flex-wrap gap-4">
            {["Daily", "Weekly", "Monthly", "Never"].map((opt) => (
              <label key={opt} className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="mailinterval"
                  value={opt}
                  checked={mailinterval === opt}
                  onChange={() => setMailinterval(opt)}
                  className="h-4 w-4 accent-primary"
                />
                {opt}
              </label>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Notify By *" description="Select how the backup file should be delivered">
          <div className="flex flex-wrap gap-6">
            {["FTP", "Mail"].map((opt) => (
              <label key={opt} className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="sendtype"
                  value={opt}
                  checked={sendtype === opt}
                  onChange={() => setSendtype(opt)}
                  className="h-4 w-4 accent-primary"
                />
                {opt}
              </label>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="To *" description="Email address that will receive the backup notification">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="mailid">Email ID</Label>
              <Input
                id="mailid"
                name="mailid"
                type="email"
                value={mailid}
                onChange={(e) => setMailid(e.target.value)}
                placeholder="admin@example.com"
              />
            </div>
          </div>
        </SectionCard>

        <SectionCard title="FTP Server *" description="FTP delivery configuration (used when Notify By = FTP)">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="ftpserver">FTP Server *</Label>
              <Input
                id="ftpserver"
                name="ftpserver"
                value={ftpserver}
                onChange={(e) => setFtpserver(e.target.value)}
                placeholder="ftp.example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ftpuser">User Name *</Label>
              <Input
                id="ftpuser"
                name="ftpuser"
                value={ftpuser}
                onChange={(e) => setFtpuser(e.target.value)}
                placeholder="ftpuser"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ftppassword">Password *</Label>
              <Input
                id="ftppassword"
                name="ftppassword"
                type="password"
                value={ftppassword}
                onChange={(e) => setFtppassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </div>
        </SectionCard>

        <SectionCard title="User session backup" description="Frequency for user session data backup">
          <div className="flex flex-wrap gap-4">
            {["Daily", "Weekly", "Monthly", "Never"].map((opt) => (
              <label key={opt} className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="usersessioninterval"
                  value={opt}
                  checked={usersessioninterval === opt}
                  onChange={() => setUsersessioninterval(opt)}
                  className="h-4 w-4 accent-primary"
                />
                {opt}
              </label>
            ))}
          </div>
          <div className="mt-4 space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Log Checks (select logs to include in backup)</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[
                { k: "authLog", l: "Auth Log" },
                { k: "userLog", l: "User Log" },
                { k: "auditLog", l: "Audit Log" },
                { k: "adminLog", l: "Admin Log" },
              ].map((c) => (
                <label key={c.k} className="flex items-center gap-2 text-sm cursor-pointer">
                  <Checkbox
                    checked={logChecks[c.k as keyof typeof logChecks]}
                    onCheckedChange={(v) => setLogChecks({ ...logChecks, [c.k]: !!v })}
                  />
                  {c.l}
                </label>
              ))}
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Backup of RRD Files" description="Frequency for RRD files backup, sent by mail">
          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">Mail Log Interval</p>
              <div className="flex flex-wrap gap-4">
                {["Daily", "Weekly", "Monthly", "Never"].map((opt) => (
                  <label key={opt} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="mailloginterval"
                      value={opt}
                      checked={mailloginterval === opt}
                      onChange={() => setMailloginterval(opt)}
                      className="h-4 w-4 accent-primary"
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">Mail RRD Interval</p>
              <div className="flex flex-wrap gap-4">
                {["Daily", "Weekly", "Monthly", "Never"].map((opt) => (
                  <label key={opt} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="mailrrdinterval"
                      value={opt}
                      checked={mailrrdinterval === opt}
                      onChange={() => setMailrrdinterval(opt)}
                      className="h-4 w-4 accent-primary"
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </SectionCard>

        <div className="flex items-center justify-end">
          <Button type="submit" disabled={saving}>
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save
          </Button>
        </div>
      </form>
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
  const { grandchild } = useModuleHeader(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);

  // 24online Restore — fields:
  // filename (file), usersessionfilename (file), rrdfilename (file), btnrrdupload (button)
  // Sections: "Upload Backup", "Upload User Session Backup", "Upload RRD Backup"
  // Buttons: Upload (x3)
  const [busy, setBusy] = React.useState<string | null>(null);
  const [filename, setFilename] = React.useState("");
  const [usersessionfilename, setUsersessionfilename] = React.useState("");
  const [rrdfilename, setRrdfilename] = React.useState("");

  const upload = async (key: string, file: string, label: string) => {
    if (!file) return;
    setBusy(key);
    await new Promise((r) => setTimeout(r, 600));
    setBusy(null);
    toast({ title: `${label} uploaded`, description: `Restoring from ${file}.` });
  };

  const uploadCard = (
    title: string,
    description: string,
    id: string,
    label: string,
    value: string,
    set: (v: string) => void,
    busyKey: string,
    btnName: string
  ) => (
    <SectionCard title={title} description={description}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:items-end">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor={id}>{label}</Label>
          <Input
            id={id}
            name={id}
            type="file"
            onChange={(e) => set(e.target.files?.[0]?.name ?? "")}
          />
        </div>
        <Button
          type="button"
          name={btnName}
          disabled={!value || !!busy}
          onClick={() => upload(busyKey, value, label)}
        >
          {busy === busyKey ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
          Upload
        </Button>
      </div>
    </SectionCard>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title={grandchild?.label ?? "Restore"}
        description="Restore system data, user sessions, or RRD files from previously uploaded backup files."
        icon={<RefreshCw className="h-5 w-5" />}
        breadcrumb={breadcrumb}
      />
      <div className="rounded-md border border-amber-500/30 bg-amber-500/5 p-3 text-xs text-amber-700 dark:text-amber-400">
        <AlertTriangle className="inline h-3.5 w-3.5 mr-1" />
        Restoring will overwrite current data. This action cannot be undone.
      </div>
      {uploadCard("Upload Backup", "Restore complete system data from a backup file", "filename", "Backup File", filename, setFilename, "filename", "btnbackupupload")}
      {uploadCard("Upload User Session Backup", "Restore user session data from a backup file", "usersessionfilename", "User Session Backup File", usersessionfilename, setUsersessionfilename, "usersessionfilename", "btnusersessionupload")}
      {uploadCard("Upload RRD Backup", "Restore RRD files from a backup file", "rrdfilename", "RRD Backup File", rrdfilename, setRrdfilename, "rrdfilename", "btnrrdupload")}
    </div>
  );
}

/* ---------- Auto Purge ---------- */

function AutoPurgePage({ moduleId, childId, grandchildId }: ViewProps) {
  const { grandchild } = useModuleHeader(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);

  // 24online Auto Purge — many fields, 3 Save buttons covering the sections:
  // accesslogvalue (days), archiveuservalue, daysfromlastlogin, deactiveExpiredUser (radio),
  // nasintegrationlog, txtKeepInvDelUsr, txtKeepInvActUsr, txtKeepInvDeactUsr, txtKeepAuditLog,
  // txtKeepSMSLog, txtKeepRenHstryLog, txtDelArchiveUsr, txtKeepExpiredPins, txtKeepHistoryLogs,
  // txtauthmessages, txtDelAcquisitedUsr, purgeusersafter, txtDelSocialMediaUsr, devicecount
  // Sections (Save #1 — Purge Frequency + Notification + Invoice + Audit + SMS + Renewal):
  //   "Purge Frequency", "Purge Notification", "Auto Purge Invoice",
  //   "Auto Purge Audit Log", "Auto Purge SMS Log", "Auto Purge Renewal History Log"
  // Sections (Save #2):
  //   "Auto Purge Archive Users", "Auto Purge Expired Pins", "Auto Purge Pin History",
  //   "Auto Purge Auth Messages", "Auto purge for Acquisited Users",
  //   "Auto purge for SMPP users", "Auto purge for Social Media Users"
  // Sections (Save #3): Purge Frequency / days from last login / device count
  const [s1, setS1] = React.useState({
    accesslogvalue: "30",
    purgeusersafter: "90",
    deactiveExpiredUser: "Yes",
    nasintegrationlog: "60",
  });
  const [s2, setS2] = React.useState({
    txtKeepInvDelUsr: "180",
    txtKeepInvActUsr: "180",
    txtKeepInvDeactUsr: "180",
    txtKeepAuditLog: "120",
    txtKeepSMSLog: "90",
    txtKeepRenHstryLog: "365",
  });
  const [s3, setS3] = React.useState({
    txtDelArchiveUsr: "365",
    txtKeepExpiredPins: "120",
    txtKeepHistoryLogs: "180",
    txtauthmessages: "60",
    txtDelAcquisitedUsr: "365",
    txtDelSocialMediaUsr: "365",
    daysfromlastlogin: "120",
    devicecount: "5",
  });
  const [busy, setBusy] = React.useState<number | null>(null);

  const save = async (key: number, label: string) => {
    setBusy(key);
    await new Promise((r) => setTimeout(r, 400));
    setBusy(null);
    toast({ title: `${label} saved`, description: "Auto purge settings updated successfully." });
  };

  const numField = (
    name: string,
    label: string,
    value: string,
    set: (v: string) => void,
    suffix = "days"
  ) => (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <div className="flex items-center gap-2">
        <Input
          id={name}
          name={name}
          type="number"
          min="0"
          value={value}
          onChange={(e) => set(e.target.value)}
          className="font-mono text-sm"
        />
        <span className="text-xs text-muted-foreground whitespace-nowrap">{suffix}</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title={grandchild?.label ?? "Auto Purge"}
        description="Configure retention / purge intervals for system logs, user data, invoices, audit trails, and other historical records."
        icon={<Trash2 className="h-5 w-5" />}
        breadcrumb={breadcrumb}
      />

      {/* Save group 1 */}
      <SectionCard
        title="Purge Frequency / Notification / Invoice / Audit / SMS / Renewal"
        description="First group of auto-purge retention intervals"
        actions={
          <Button size="sm" onClick={() => save(1, "Purge group 1")} disabled={!!busy}>
            {busy === 1 ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> : <Save className="mr-2 h-3.5 w-3.5" />}
            Save
          </Button>
        }
      >
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">Purge Frequency</h4>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {numField("accesslogvalue", "Access Log (days)", s1.accesslogvalue, (v) => setS1({ ...s1, accesslogvalue: v }))}
              {numField("purgeusersafter", "Purge Users After (days)", s1.purgeusersafter, (v) => setS1({ ...s1, purgeusersafter: v }))}
              {numField("nasintegrationlog", "NAS Integration Log (days)", s1.nasintegrationlog, (v) => setS1({ ...s1, nasintegrationlog: v }))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">Purge Notification — Deactivate Expired Users</h4>
            <div className="flex flex-wrap gap-4">
              {["Yes", "No"].map((opt) => (
                <label key={opt} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="deactiveExpiredUser"
                    value={opt}
                    checked={s1.deactiveExpiredUser === opt}
                    onChange={() => setS1({ ...s1, deactiveExpiredUser: opt })}
                    className="h-4 w-4 accent-primary"
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">Auto Purge Invoice</h4>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {numField("txtKeepInvDelUsr", "Keep Deleted User Invoices (days)", s2.txtKeepInvDelUsr, (v) => setS2({ ...s2, txtKeepInvDelUsr: v }))}
              {numField("txtKeepInvActUsr", "Keep Active User Invoices (days)", s2.txtKeepInvActUsr, (v) => setS2({ ...s2, txtKeepInvActUsr: v }))}
              {numField("txtKeepInvDeactUsr", "Keep Deactivated User Invoices (days)", s2.txtKeepInvDeactUsr, (v) => setS2({ ...s2, txtKeepInvDeactUsr: v }))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">Auto Purge Audit Log</h4>
            {numField("txtKeepAuditLog", "Keep Audit Log (days)", s2.txtKeepAuditLog, (v) => setS2({ ...s2, txtKeepAuditLog: v }))}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">Auto Purge SMS Log</h4>
            {numField("txtKeepSMSLog", "Keep SMS Log (days)", s2.txtKeepSMSLog, (v) => setS2({ ...s2, txtKeepSMSLog: v }))}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">Auto Purge Renewal History Log</h4>
            {numField("txtKeepRenHstryLog", "Keep Renewal History Log (days)", s2.txtKeepRenHstryLog, (v) => setS2({ ...s2, txtKeepRenHstryLog: v }))}
          </div>
        </div>
      </SectionCard>

      {/* Save group 2 */}
      <SectionCard
        title="Archive Users / Expired Pins / Auth Messages / Acquisited / SMPP / Social Media"
        description="Second group of auto-purge retention intervals"
        actions={
          <Button size="sm" onClick={() => save(2, "Purge group 2")} disabled={!!busy}>
            {busy === 2 ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> : <Save className="mr-2 h-3.5 w-3.5" />}
            Save
          </Button>
        }
      >
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">Auto Purge Archive Users</h4>
            {numField("txtDelArchiveUsr", "Delete Archived Users After (days)", s3.txtDelArchiveUsr, (v) => setS3({ ...s3, txtDelArchiveUsr: v }))}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">Auto Purge Expired Pins</h4>
            {numField("txtKeepExpiredPins", "Keep Expired Pins (days)", s3.txtKeepExpiredPins, (v) => setS3({ ...s3, txtKeepExpiredPins: v }))}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">Auto Purge Pin History</h4>
            {numField("txtKeepHistoryLogs", "Keep Pin History Logs (days)", s3.txtKeepHistoryLogs, (v) => setS3({ ...s3, txtKeepHistoryLogs: v }))}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">Auto Purge Auth Messages</h4>
            {numField("txtauthmessages", "Keep Auth Messages (days)", s3.txtauthmessages, (v) => setS3({ ...s3, txtauthmessages: v }))}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">Auto Purge for Acquisited Users</h4>
            {numField("txtDelAcquisitedUsr", "Delete Acquisited Users After (days)", s3.txtDelAcquisitedUsr, (v) => setS3({ ...s3, txtDelAcquisitedUsr: v }))}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">Auto Purge for SMPP Users</h4>
            <p className="text-xs text-muted-foreground">SMPP users follow the same retention as Acquisited users.</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">Auto Purge for Social Media Users</h4>
            {numField("txtDelSocialMediaUsr", "Delete Social Media Users After (days)", s3.txtDelSocialMediaUsr, (v) => setS3({ ...s3, txtDelSocialMediaUsr: v }))}
          </div>
        </div>
      </SectionCard>

      {/* Save group 3 */}
      <SectionCard
        title="Last Login / Device Count"
        description="User inactivity and device-count purge settings"
        actions={
          <Button size="sm" onClick={() => save(3, "Purge group 3")} disabled={!!busy}>
            {busy === 3 ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> : <Save className="mr-2 h-3.5 w-3.5" />}
            Save
          </Button>
        }
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {numField("daysfromlastlogin", "Days From Last Login (purge inactive users)", s3.daysfromlastlogin, (v) => setS3({ ...s3, daysfromlastlogin: v }))}
          {numField("devicecount", "Device Count (max devices per user)", s3.devicecount, (v) => setS3({ ...s3, devicecount: v }), "")}
        </div>
      </SectionCard>
    </div>
  );
}

/* ---------- Manual Purge ---------- */

function ManualPurgePage({ moduleId, childId, grandchildId }: ViewProps) {
  const { grandchild } = useModuleHeader(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);

  // 24online Manual Purge — fields:
  // mode (radio: Web Surfing Logs / User Session Logs / Audit Logs / Archive Users / NAS Integration Log)
  // usertype (checkbox)
  // displaydate (text date picker)
  // Buttons: Purge
  // Sections: "Logs" (radio options), "Users" (radio + checkbox), "Purge Data" (date picker)
  const [mode, setMode] = React.useState("Web Surfing Logs");
  const [userMode, setUserMode] = React.useState("Archive Users");
  const [usertype, setUsertype] = React.useState({
    active: false, expired: false, deactivated: false, locked: false,
  });
  const [displaydate, setDisplaydate] = React.useState("");
  const [purging, setPurging] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  const handlePurge = async () => {
    setPurging(true);
    await new Promise((r) => setTimeout(r, 700));
    setPurging(false);
    setConfirmOpen(false);
    toast({
      title: "Purge complete",
      description: `${mode} up to ${displaydate || "today"} has been purged.`,
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={grandchild?.label ?? "Manual Purge"}
        description="Manually purge system logs, user sessions, archived users, or NAS integration data older than a chosen date."
        icon={<Trash2 className="h-5 w-5" />}
        breadcrumb={breadcrumb}
      />
      <div className="rounded-md border border-amber-500/30 bg-amber-500/5 p-3 text-xs text-amber-700 dark:text-amber-400">
        <AlertTriangle className="inline h-3.5 w-3.5 mr-1" />
        Manual purge is irreversible. Make sure you have a backup before proceeding.
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SectionCard title="Logs" description="Select which log type to purge">
          <div className="space-y-2">
            {[
              "Web Surfing Logs",
              "User Session Logs",
              "Audit Logs",
              "NAS Integration Log",
            ].map((opt) => (
              <label key={opt} className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="mode"
                  value={opt}
                  checked={mode === opt}
                  onChange={() => setMode(opt)}
                  className="h-4 w-4 accent-primary"
                />
                {opt}
              </label>
            ))}
          </div>
        </SectionCard>
        <SectionCard title="Users" description="Select user data to purge (radio + checkbox)">
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                name="userMode"
                value="Archive Users"
                checked={userMode === "Archive Users"}
                onChange={() => setUserMode("Archive Users")}
                className="h-4 w-4 accent-primary"
              />
              Archive Users
            </label>
            <div className="ml-6 grid grid-cols-2 gap-2">
              {[
                { k: "active", l: "Active Users" },
                { k: "expired", l: "Expired Users" },
                { k: "deactivated", l: "Deactivated Users" },
                { k: "locked", l: "Locked Users" },
              ].map((c) => (
                <label key={c.k} className="flex items-center gap-2 text-xs cursor-pointer">
                  <Checkbox
                    name={`usertype_${c.k}`}
                    checked={usertype[c.k as keyof typeof usertype]}
                    onCheckedChange={(v) => setUsertype({ ...usertype, [c.k]: !!v })}
                  />
                  {c.l}
                </label>
              ))}
            </div>
          </div>
        </SectionCard>
      </div>
      <SectionCard title="Purge Data" description="Pick the cut-off date — data older than this date will be purged">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-end">
          <div className="space-y-2">
            <Label htmlFor="displaydate">Purge Data Before</Label>
            <Input
              id="displaydate"
              name="displaydate"
              type="date"
              value={displaydate}
              onChange={(e) => setDisplaydate(e.target.value)}
            />
          </div>
          <div className="flex md:justify-end">
            <Button variant="destructive" onClick={() => setConfirmOpen(true)} disabled={purging || !displaydate}>
              {purging ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
              Purge
            </Button>
          </div>
        </div>
      </SectionCard>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Manual Purge</DialogTitle>
            <DialogDescription>
              This will permanently delete <span className="font-medium text-foreground">{mode}</span> records
              {displaydate && ` older than ${displaydate}`}. This action cannot be undone.
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
  const { grandchild } = useModuleHeader(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);

  // 24online Migrate User — fields:
  // csvfiletype (hidden), mode (hidden), file (file)
  // Buttons: "Upload file"
  // Text: "Upload data file to migrate users"
  // Form action: getcsv.do
  const [fileName, setFileName] = React.useState("");
  const [uploading, setUploading] = React.useState(false);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName) return;
    setUploading(true);
    await new Promise((r) => setTimeout(r, 800));
    setUploading(false);
    toast({
      title: "CSV file uploaded",
      description: `${fileName} uploaded successfully. Migration will start shortly.`,
    });
    setFileName("");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={grandchild?.label ?? "Migrate User"}
        description="Upload data file to migrate users"
        icon={<Upload className="h-5 w-5" />}
        breadcrumb={breadcrumb}
      />
      <form onSubmit={handleUpload} action="getcsv.do">
        <input type="hidden" name="csvfiletype" value="migrateuser" />
        <input type="hidden" name="mode" value="migrate" />
        <SectionCard
          title="Upload data file to migrate users"
          description="Choose a CSV file containing user records to migrate"
          actions={
            <Button type="submit" disabled={!fileName || uploading}>
              {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
              Upload file
            </Button>
          }
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="file">Data File (CSV)</Label>
              <Input
                id="file"
                name="file"
                type="file"
                accept=".csv"
                onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
              />
            </div>
            <div className="flex items-end">
              <p className="text-xs text-muted-foreground">
                The CSV file must include the required headers (username, target_zone, target_package, etc.).
                Once uploaded, the migration job runs in the background.
              </p>
            </div>
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
  const { grandchild } = useModuleHeader(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);

  // 24online Auth Logs — Buttons: Download (x4), Live View
  // Sections: "Download User Authentication Logs", "Live view of User Authentication Logs"
  const [live, setLive] = React.useState(false);
  const [liveRows, setLiveRows] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (!live) return;
    const id = setInterval(() => {
      const r = {
        id: Date.now(),
        timestamp: new Date().toLocaleString(),
        username: `user_${Math.floor(Math.random() * 9999)}`,
        ip: `10.10.${Math.floor(Math.random() * 5)}.${Math.floor(Math.random() * 254) + 1}`,
        nas: `sms-core-0${(Math.floor(Math.random() * 2) + 1)}`,
        result: Math.random() > 0.25 ? "Accept" : "Reject",
      };
      setLiveRows((prev) => [r, ...prev].slice(0, 30));
    }, 1500);
    return () => clearInterval(id);
  }, [live]);

  const download = (label: string) => {
    toast({ title: "Download started", description: label });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={grandchild?.label ?? "Authentication Logs"}
        description="Download user authentication logs as CSV files (per log type) or open a live view of authentication attempts."
        icon={<KeyRound className="h-5 w-5" />}
        breadcrumb={breadcrumb}
      />

      <SectionCard title="Download User Authentication Logs" description="Download each authentication log type as a CSV file">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {[
            "Accept Logs (CSV)",
            "Reject Logs (CSV)",
            "All Authentication Logs (CSV)",
            "Authentication Logs (Date Range CSV)",
          ].map((label) => (
            <div key={label} className="flex items-center justify-between gap-4 rounded-lg border border-border bg-muted/20 p-4">
              <div>
                <p className="text-sm font-medium text-foreground">{label}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">Click Download to export the file.</p>
              </div>
              <Button size="sm" onClick={() => download(label)}>
                <Download className="mr-1.5 h-3.5 w-3.5" /> Download
              </Button>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Live view of User Authentication Logs"
        description="Real-time authentication attempts (auto-refresh every 1.5s)"
        actions={
          <Button
            size="sm"
            variant={live ? "destructive" : "default"}
            onClick={() => {
              setLive(!live);
              if (live) setLiveRows([]);
            }}
          >
            <Activity className="mr-1.5 h-3.5 w-3.5" /> {live ? "Stop Live View" : "Live View"}
          </Button>
        }
      >
        {!live ? (
          <EmptyState
            icon={<Activity className="h-5 w-5" />}
            title="Live view is not running"
            description="Click Live View to start streaming authentication attempts in real time."
          />
        ) : liveRows.length === 0 ? (
          <PageLoader />
        ) : (
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
                {liveRows.map((r) => (
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
        )}
      </SectionCard>
    </div>
  );
}

/* ===================================================================== *
 *  CLIENT SERVICES — Parameters
 * ===================================================================== */

function ClientServicesParametersPage({ moduleId, childId, grandchildId }: ViewProps) {
  const { grandchild } = useModuleHeader(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);

  // 24online Client Services — Parameters — fields:
  // servicekey, servicevalue (text), openurlinnewwindow (radio), addcache (submit),
  // gracedays (radio), additionalday (text)
  // Buttons: Update (many)
  // Sections: "Customize Client Preferences", "Site to be opened after client logs on",
  //   "No. of Records to Display Per Page", "Byte Reducer", "No. of days to reset"
  const [kv, setKv] = React.useState<{ key: string; value: string }[]>([
    { key: "LoginPageLogo", value: "/images/logo.png" },
    { key: "LogoutPageMsg", value: "Thank you for using our service." },
  ]);
  const [newKey, setNewKey] = React.useState("");
  const [newValue, setNewValue] = React.useState("");
  const [openurlinnewwindow, setOpenurlinnewwindow] = React.useState("Yes");
  const [postLoginUrl, setPostLoginUrl] = React.useState("http://www.example.com");
  const [recordsPerPage, setRecordsPerPage] = React.useState("20");
  const [byteReducer, setByteReducer] = React.useState("Enabled");
  const [gracedays, setGracedays] = React.useState("0");
  const [additionalday, setAdditionalday] = React.useState("1");
  const [busy, setBusy] = React.useState<string | null>(null);

  const update = async (key: string, label: string) => {
    setBusy(key);
    await new Promise((r) => setTimeout(r, 400));
    setBusy(null);
    toast({ title: `${label} updated`, description: "Client preferences saved successfully." });
  };

  const addKv = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey.trim()) return;
    setBusy("addcache");
    await new Promise((r) => setTimeout(r, 300));
    setBusy(null);
    setKv([...kv, { key: newKey.trim(), value: newValue.trim() }]);
    toast({ title: "Preference added", description: `${newKey} = ${newValue}` });
    setNewKey("");
    setNewValue("");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={grandchild?.label ?? "Parameters"}
        description="Customize client-side preferences, post-login landing page, list page sizes, byte reducer, and grace-day policies."
        icon={<SlidersHorizontal className="h-5 w-5" />}
        breadcrumb={breadcrumb}
      />

      <SectionCard
        title="Customize Client Preferences"
        description="Add / update service key-value pairs (servicekey + servicevalue)"
        actions={
          <Button size="sm" type="submit" form="kvForm" disabled={busy === "addcache" || !newKey.trim()}>
            {busy === "addcache" ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> : <Plus className="mr-2 h-3.5 w-3.5" />}
            Add
          </Button>
        }
      >
        <form id="kvForm" onSubmit={addKv} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="servicekey">Service Key</Label>
              <Input
                id="servicekey"
                name="servicekey"
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                placeholder="e.g. LoginpageTitle"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="servicevalue">Service Value</Label>
              <Input
                id="servicevalue"
                name="servicevalue"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                placeholder="e.g. Welcome to Cryptsk"
              />
            </div>
          </div>
          {kv.length > 0 && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service Key</TableHead>
                    <TableHead>Service Value</TableHead>
                    <TableHead className="text-right">Update</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {kv.map((r, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-mono text-xs">{r.key}</TableCell>
                      <TableCell className="text-xs">{r.value}</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline" onClick={() => update(`kv_${i}`, r.key)} disabled={!!busy}>
                          {busy === `kv_${i}` ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </form>
      </SectionCard>

      <SectionCard
        title="Site to be opened after client logs on"
        description="URL opened after a client successfully logs in (openurlinnewwindow radio)"
        actions={
          <Button size="sm" onClick={() => update("postlogin", "Post-login URL")} disabled={!!busy}>
            {busy === "postlogin" ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> : <Save className="mr-2 h-3.5 w-3.5" />}
            Update
          </Button>
        }
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="postloginurl">URL</Label>
            <Input
              id="postloginurl"
              value={postLoginUrl}
              onChange={(e) => setPostLoginUrl(e.target.value)}
              placeholder="http://www.example.com"
            />
          </div>
          <div className="space-y-2">
            <Label>Open URL in New Window</Label>
            <div className="flex gap-6">
              {["Yes", "No"].map((opt) => (
                <label key={opt} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="openurlinnewwindow"
                    value={opt}
                    checked={openurlinnewwindow === opt}
                    onChange={() => setOpenurlinnewwindow(opt)}
                    className="h-4 w-4 accent-primary"
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="No. of Records to Display Per Page"
        description="Default page size for client-side lists"
        actions={
          <Button size="sm" onClick={() => update("records", "Records per page")} disabled={!!busy}>
            {busy === "records" ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> : <Save className="mr-2 h-3.5 w-3.5" />}
            Update
          </Button>
        }
      >
        <div className="space-y-2 max-w-xs">
          <Label htmlFor="recordsperpage">Records per page</Label>
          <Input
            id="recordsperpage"
            type="number"
            min="5"
            value={recordsPerPage}
            onChange={(e) => setRecordsPerPage(e.target.value)}
          />
        </div>
      </SectionCard>

      <SectionCard
        title="Byte Reducer"
        description="Enable/disable byte-reducer (compression of HTTP responses)"
        actions={
          <Button size="sm" onClick={() => update("byte", "Byte Reducer")} disabled={!!busy}>
            {busy === "byte" ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> : <Save className="mr-2 h-3.5 w-3.5" />}
            Update
          </Button>
        }
      >
        <div className="flex gap-6">
          {["Enabled", "Disabled"].map((opt) => (
            <label key={opt} className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                name="byteReducer"
                value={opt}
                checked={byteReducer === opt}
                onChange={() => setByteReducer(opt)}
                className="h-4 w-4 accent-primary"
              />
              {opt}
            </label>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="No. of days to reset"
        description="Grace days before data is reset, plus additional day count (gracedays radio + additionalday text)"
        actions={
          <Button size="sm" onClick={() => update("reset", "Days to reset")} disabled={!!busy}>
            {busy === "reset" ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> : <Save className="mr-2 h-3.5 w-3.5" />}
            Update
          </Button>
        }
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Grace Days</Label>
            <div className="flex flex-wrap gap-4">
              {["0", "1", "2", "3"].map((opt) => (
                <label key={opt} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="gracedays"
                    value={opt}
                    checked={gracedays === opt}
                    onChange={() => setGracedays(opt)}
                    className="h-4 w-4 accent-primary"
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="additionalday">Additional Day</Label>
            <Input
              id="additionalday"
              name="additionalday"
              type="number"
              min="0"
              value={additionalday}
              onChange={(e) => setAdditionalday(e.target.value)}
            />
          </div>
        </div>
      </SectionCard>
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
  const { grandchild } = useModuleHeader(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);

  // 24online Access Control — fields:
  // securitylevelid (select)
  // Form action: ACLManager
  // Matrix of modules vs user types with checkboxes for View/Create/Update/Delete permissions
  const [securitylevelid, setSecuritylevelid] = React.useState("2");
  // For each (module, user-type) cell, store a permission object {view, create, update, delete}
  const modules = [
    "System", "Policy", "Package", "Payment Gateway", "User",
    "Ticket Management", "Sales Management", "Inventory", "Alert",
    "Ott Service", "Payment Tracking", "Web Surfing Logger",
    "Net Kapture", "Reports", "Help",
  ];
  const userTypes = ["Administrator", "Manager", "Operator", "User", "Leased Line", "Walkin User"];
  const [matrix, setMatrix] = React.useState<Record<string, Record<string, { v: boolean; c: boolean; u: boolean; d: boolean }>>>(() => {
    const m: Record<string, Record<string, { v: boolean; c: boolean; u: boolean; d: boolean }>> = {};
    modules.forEach((modName) => {
      m[modName] = {};
      userTypes.forEach((ut) => {
        m[modName][ut] = { v: ut === "Administrator", c: ut === "Administrator", u: ut === "Administrator", d: ut === "Administrator" };
      });
    });
    return m;
  });
  const [saving, setSaving] = React.useState(false);

  const togglePerm = (modName: string, ut: string, key: "v" | "c" | "u" | "d") => {
    setMatrix((prev) => ({
      ...prev,
      [modName]: {
        ...prev[modName],
        [ut]: { ...prev[modName][ut], [key]: !prev[modName][ut][key] },
      },
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    setSaving(false);
    toast({ title: "Access control saved", description: "ACL matrix updated successfully." });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={grandchild?.label ?? "Access Control"}
        description="Configure per-module View / Create / Update / Delete permissions for each user type."
        icon={<Lock className="h-5 w-5" />}
        breadcrumb={breadcrumb}
      />
      <form onSubmit={handleSave} action="ACLManager">
        <SectionCard
          title="Access Control Matrix"
          description="Modules × User Types — tick the permission checkboxes"
          actions={
            <Button type="submit" disabled={saving}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save Permissions
            </Button>
          }
        >
          <div className="space-y-4">
            <div className="max-w-xs">
              <Label htmlFor="securitylevelid">Security Level</Label>
              <Select value={securitylevelid} onValueChange={setSecuritylevelid}>
                <SelectTrigger id="securitylevelid"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Level 1 (Full Access)</SelectItem>
                  <SelectItem value="2">Level 2 (Standard)</SelectItem>
                  <SelectItem value="3">Level 3 (Restricted)</SelectItem>
                  <SelectItem value="4">Level 4 (Read Only)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="sticky left-0 bg-card">Module</TableHead>
                    {userTypes.map((ut) => (
                      <TableHead key={ut} className="text-center">{ut}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {modules.map((modName) => (
                    <TableRow key={modName}>
                      <TableCell className="font-medium sticky left-0 bg-card">{modName}</TableCell>
                      {userTypes.map((ut) => {
                        const p = matrix[modName][ut];
                        return (
                          <TableCell key={ut} className="text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <Checkbox checked={p.v} onCheckedChange={() => togglePerm(modName, ut, "v")} aria-label="View" />
                              <Checkbox checked={p.c} onCheckedChange={() => togglePerm(modName, ut, "c")} aria-label="Create" />
                              <Checkbox checked={p.u} onCheckedChange={() => togglePerm(modName, ut, "u")} aria-label="Update" />
                              <Checkbox checked={p.d} onCheckedChange={() => togglePerm(modName, ut, "d")} aria-label="Delete" />
                            </div>
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <p className="text-xs text-muted-foreground">
              Each cell has 4 checkboxes (left to right): <span className="font-medium text-foreground">View / Create / Update / Delete</span>.
            </p>
          </div>
        </SectionCard>
      </form>
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
  const { grandchild } = useModuleHeader(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);

  // 24online User Type — fields:
  // userstatusadministrator (select), select (checkbox),
  // userstatususer, userstatusLeasedLine, userstatusWalkinuser,
  // userstatusmanager, userstatusoperator
  // Buttons: Create, Delete, "Change Registration Status"
  // Table columns: User Type | Description | User Registration Status | Select
  const [rows, setRows] = React.useState<any[]>([
    { id: 1, name: "User", desc: "Standard internet subscriber", regStatus: "Enabled", selected: false },
    { id: 2, name: "Leased Line", desc: "Leased-line business customer", regStatus: "Enabled", selected: false },
    { id: 3, name: "Walkin User", desc: "Walk-in / voucher-based customer", regStatus: "Disabled", selected: false },
    { id: 4, name: "Manager", desc: "Console manager role", regStatus: "Enabled", selected: false },
    { id: 5, name: "Operator", desc: "Console operator role", regStatus: "Enabled", selected: false },
  ]);
  const [adminStatus, setAdminStatus] = React.useState("Enabled");

  const toggleSel = (id: number) => {
    setRows(rows.map((r) => (r.id === id ? { ...r, selected: !r.selected } : r)));
  };

  const handleCreate = async () => {
    await new Promise((r) => setTimeout(r, 300));
    toast({ title: "User type form opened", description: "Configure a new user type." });
  };

  const handleDelete = async () => {
    const sel = rows.filter((r) => r.selected);
    if (sel.length === 0) {
      toast({ title: "No selection", description: "Select at least one user type to delete." });
      return;
    }
    setRows(rows.filter((r) => !r.selected));
    toast({ title: "User types deleted", description: `${sel.length} user type(s) removed.` });
  };

  const handleChangeStatus = async () => {
    const sel = rows.filter((r) => r.selected);
    if (sel.length === 0) {
      toast({ title: "No selection", description: "Select at least one user type." });
      return;
    }
    setRows(rows.map((r) => (r.selected ? { ...r, regStatus: r.regStatus === "Enabled" ? "Disabled" : "Enabled" } : r)));
    toast({ title: "Registration status changed", description: `${sel.length} user type(s) updated.` });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={grandchild?.label ?? "User Type"}
        description="Create / delete user types and toggle their self-registration status."
        icon={<UserCog className="h-5 w-5" />}
        breadcrumb={breadcrumb}
      />
      <ActionBar>
        <Button size="sm" onClick={handleCreate}>
          <Plus className="mr-2 h-3.5 w-3.5" /> Create
        </Button>
        <Button size="sm" variant="destructive" onClick={handleDelete}>
          <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete
        </Button>
        <Button size="sm" variant="outline" onClick={handleChangeStatus}>
          <RefreshCw className="mr-2 h-3.5 w-3.5" /> Change Registration Status
        </Button>
        <div className="ml-auto flex items-center gap-2">
          <Label htmlFor="userstatusadministrator" className="text-xs text-muted-foreground">Administrator Status</Label>
          <Select value={adminStatus} onValueChange={setAdminStatus}>
            <SelectTrigger id="userstatusadministrator" className="h-8 w-[140px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Enabled">Enabled</SelectItem>
              <SelectItem value="Disabled">Disabled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </ActionBar>
      <SectionCard title="User Types" description={`${rows.length} types`}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>User Registration Status</TableHead>
                <TableHead className="text-center">Select</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.name}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{r.desc}</TableCell>
                  <TableCell><StatusBadge status={r.regStatus} /></TableCell>
                  <TableCell className="text-center">
                    <Checkbox
                      name={`select_${r.id}`}
                      checked={r.selected}
                      onCheckedChange={() => toggleSel(r.id)}
                    />
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
  const { grandchild } = useModuleHeader(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);

  // 24online User Access — fields:
  // securityenabled (radio), configsave (button),
  // telnetipallowfrom (radio), telnetIPList (select-multiple),
  // addip (button), removeip (button), removeallip (button)
  // Buttons: Save, Add, Remove, Remove All, Cancel
  // Sections: "Access Configuration", "Access Restriction", "Console Access",
  //   "SSH Access / Web Console Access", "Web Access" — each with IP allow/deny lists
  const [securityenabled, setSecurityenabled] = React.useState("Yes");
  const [allowIp, setAllowIp] = React.useState("Anywhere");
  const [allowLists, setAllowLists] = React.useState<Record<string, string[]>>({
    "Access Restriction": ["10.172.0.0/24", "10.10.3.0/24"],
    "Console Access": ["127.0.0.1"],
    "SSH Access / Web Console Access": ["10.10.3.0/24"],
    "Web Access": ["0.0.0.0/0"],
  });
  const [newIps, setNewIps] = React.useState<Record<string, string>>({
    "Access Restriction": "",
    "Console Access": "",
    "SSH Access / Web Console Access": "",
    "Web Access": "",
  });

  const sections = ["Access Restriction", "Console Access", "SSH Access / Web Console Access", "Web Access"];

  const handleSave = async () => {
    await new Promise((r) => setTimeout(r, 400));
    toast({ title: "Access configuration saved", description: "IP allow lists updated successfully." });
  };

  const addIp = (section: string) => {
    const ip = newIps[section].trim();
    if (!ip) return;
    setAllowLists({ ...allowLists, [section]: [...allowLists[section], ip] });
    setNewIps({ ...newIps, [section]: "" });
  };
  const removeIp = (section: string, ip: string) => {
    setAllowLists({ ...allowLists, [section]: allowLists[section].filter((x) => x !== ip) });
  };
  const removeAll = (section: string) => {
    setAllowLists({ ...allowLists, [section]: [] });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={grandchild?.label ?? "User Access"}
        description="Configure access security, IP allow-lists for console, SSH, and web access."
        icon={<Lock className="h-5 w-5" />}
        breadcrumb={breadcrumb}
      />
      <SectionCard title="Access Configuration" description="Enable / disable the security-enabled flag (securityenabled radio)">
        <div className="space-y-4">
          <div>
            <Label className="block mb-2">Security Enabled</Label>
            <div className="flex gap-6">
              {["Yes", "No"].map((opt) => (
                <label key={opt} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="securityenabled"
                    value={opt}
                    checked={securityenabled === opt}
                    onChange={() => setSecurityenabled(opt)}
                    className="h-4 w-4 accent-primary"
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>
          <div className="max-w-sm space-y-2">
            <Label htmlFor="telnetipallowfrom">Telnet IP Allow From</Label>
            <Select value={allowIp} onValueChange={setAllowIp}>
              <SelectTrigger id="telnetipallowfrom"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Anywhere">Anywhere</SelectItem>
                <SelectItem value="IP List">IP List (allow list below)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end">
            <Button name="configsave" onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" /> Save
            </Button>
          </div>
        </div>
      </SectionCard>

      {sections.map((section) => (
        <SectionCard key={section} title={section} description={`IP allow-list for ${section.toLowerCase()}`}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={`newip_${section}`}>Add IP / CIDR</Label>
              <div className="flex gap-2">
                <Input
                  id={`newip_${section}`}
                  value={newIps[section]}
                  onChange={(e) => setNewIps({ ...newIps, [section]: e.target.value })}
                  placeholder="10.0.0.0/24"
                />
                <Button size="sm" onClick={() => addIp(section)}>
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Allowed IPs</Label>
              <select
                name={`telnetIPList_${section}`}
                multiple
                size={4}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs font-mono"
              >
                {allowLists[section].length === 0 ? (
                  <option disabled>No IPs in allow-list</option>
                ) : (
                  allowLists[section].map((ip) => (
                    <option key={ip} value={ip} onDoubleClick={() => removeIp(section, ip)}>
                      {ip}
                    </option>
                  ))
                )}
              </select>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => {
                  const sel = allowLists[section];
                  if (sel.length > 0) removeIp(section, sel[sel.length - 1]);
                }}>
                  <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Remove
                </Button>
                <Button size="sm" variant="outline" onClick={() => removeAll(section)}>
                  <X className="mr-1.5 h-3.5 w-3.5" /> Remove All
                </Button>
              </div>
            </div>
          </div>
        </SectionCard>
      ))}
    </div>
  );
}

/* ---------- Console ACL ---------- */

function ConsoleAclPage({ moduleId, childId, grandchildId }: ViewProps) {
  const { grandchild } = useModuleHeader(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);

  // 24online Console ACL — fields:
  // menuid, menuname, securitylevelid (select)
  // Shows menu items with per-user-type access level dropdowns
  const menuItems = [
    { id: 1, name: "Dashboard" },
    { id: 2, name: "System → Network → Interface" },
    { id: 3, name: "System → Network → Gateway" },
    { id: 4, name: "System → Network → DNS" },
    { id: 5, name: "System → Firewall → Manage Rules" },
    { id: 6, name: "System → DHCP → Manage DHCP" },
    { id: 7, name: "User → Add User" },
    { id: 8, name: "User → Manage Users" },
    { id: 9, name: "Package → Add Package" },
    { id: 10, name: "Reports → User Reports" },
  ];
  const userTypes = ["Administrator", "Manager", "Operator", "User", "Leased Line", "Walkin User"];
  const [matrix, setMatrix] = React.useState<Record<number, Record<string, string>>>(() => {
    const m: Record<number, Record<string, string>> = {};
    menuItems.forEach((mi) => {
      m[mi.id] = {};
      userTypes.forEach((ut) => {
        m[mi.id][ut] = ut === "Administrator" ? "Full Access" : ut === "Manager" ? "View Only" : "No Access";
      });
    });
    return m;
  });
  const [saving, setSaving] = React.useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 400));
    setSaving(false);
    toast({ title: "Console ACL saved", description: "Menu access levels updated." });
  };

  const setAccess = (menuId: number, ut: string, v: string) => {
    setMatrix((prev) => ({
      ...prev,
      [menuId]: { ...prev[menuId], [ut]: v },
    }));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={grandchild?.label ?? "Console ACL"}
        description="Per-menu access level for each console user type (menuid + menuname + securitylevelid)."
        icon={<Lock className="h-5 w-5" />}
        breadcrumb={breadcrumb}
        actions={
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save ACL
          </Button>
        }
      />
      <SectionCard title="Menu Access Levels" description={`${menuItems.length} menu items × ${userTypes.length} user types`}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Menu Item</TableHead>
                {userTypes.map((ut) => (
                  <TableHead key={ut} className="text-center">{ut}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {menuItems.map((mi) => (
                <TableRow key={mi.id}>
                  <TableCell className="font-medium">
                    <input type="hidden" name={`menuid_${mi.id}`} value={mi.id} />
                    <input type="hidden" name={`menuname_${mi.id}`} value={mi.name} />
                    {mi.name}
                  </TableCell>
                  {userTypes.map((ut) => (
                    <TableCell key={ut} className="text-center">
                      <Select
                        value={matrix[mi.id][ut]}
                        onValueChange={(v) => setAccess(mi.id, ut, v)}
                      >
                        <SelectTrigger className="h-8 mx-auto w-[130px]" aria-label={`${mi.name} - ${ut}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="No Access">No Access</SelectItem>
                          <SelectItem value="View Only">View Only</SelectItem>
                          <SelectItem value="Full Access">Full Access</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  ))}
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
 *  DYNAMIC DNS
 * ===================================================================== */

/* ---------- Register Host ---------- */

function DdnsRegisterPage({ moduleId, childId, grandchildId }: ViewProps) {
  const { grandchild } = useModuleHeader(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);

  // 24online DDNS Register — fields:
  // servicename (select), checkinterval (text), loginname (text), password (password),
  // hostname (text), description (textarea), usemethod (radio)
  // Buttons: Add
  // Sections: "Service Information", "Login Information", "IP Obtaining Method",
  //   "External Interface Information"
  const [form, setForm] = React.useState({
    servicename: "dyndns",
    checkinterval: "10",
    loginname: "",
    password: "",
    hostname: "",
    description: "",
    usemethod: "External Interface",
    externalInterface: "eth1",
  });
  const [saving, setSaving] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    setSaving(false);
    toast({ title: "DDNS host added", description: `${form.hostname} will be tracked via ${form.servicename}.` });
    setForm({ ...form, loginname: "", password: "", hostname: "", description: "" });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={grandchild?.label ?? "Register Host"}
        description="Register a new dynamic DNS host. Configure the DDNS service, login credentials, IP detection method, and external interface."
        icon={<Globe className="h-5 w-5" />}
        breadcrumb={breadcrumb}
      />
      <form onSubmit={handleSubmit} className="space-y-6">
        <SectionCard title="Service Information" description="Pick a DDNS provider and check interval">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="servicename">Service Name</Label>
              <Select value={form.servicename} onValueChange={(v) => setForm({ ...form, servicename: v })}>
                <SelectTrigger id="servicename"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="dyndns">DynDNS</SelectItem>
                  <SelectItem value="noip">No-IP</SelectItem>
                  <SelectItem value="freedns">FreeDNS</SelectItem>
                  <SelectItem value="duckdns">DuckDNS</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="checkinterval">Check Interval (minutes)</Label>
              <Input
                id="checkinterval"
                name="checkinterval"
                type="number"
                min="1"
                value={form.checkinterval}
                onChange={(e) => setForm({ ...form, checkinterval: e.target.value })}
              />
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Login Information" description="Credentials for the DDNS service account">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="loginname">Login Name</Label>
              <Input
                id="loginname"
                name="loginname"
                value={form.loginname}
                onChange={(e) => setForm({ ...form, loginname: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hostname">Host Name</Label>
              <Input
                id="hostname"
                name="hostname"
                value={form.hostname}
                onChange={(e) => setForm({ ...form, hostname: e.target.value })}
                placeholder="myhost.dyndns.org"
                required
              />
            </div>
            <div className="space-y-2 md:col-span-3">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                rows={2}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Optional description / notes for this DDNS entry"
              />
            </div>
          </div>
        </SectionCard>

        <SectionCard title="IP Obtaining Method" description="How the WAN IP is determined (usemethod radio)">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-6">
              {["External Interface", "Web Page"].map((opt) => (
                <label key={opt} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="usemethod"
                    value={opt}
                    checked={form.usemethod === opt}
                    onChange={() => setForm({ ...form, usemethod: opt })}
                    className="h-4 w-4 accent-primary"
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>
        </SectionCard>

        <SectionCard title="External Interface Information" description="Pick the external interface whose IP will be reported to the DDNS provider">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="externalInterface">External Interface</Label>
              <Select value={form.externalInterface} onValueChange={(v) => setForm({ ...form, externalInterface: v })}>
                <SelectTrigger id="externalInterface"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="eth0">eth0</SelectItem>
                  <SelectItem value="eth1">eth1</SelectItem>
                  <SelectItem value="pppoe0">pppoe0</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </SectionCard>

        <div className="flex items-center justify-end">
          <Button type="submit" disabled={saving}>
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
            Add
          </Button>
        </div>
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
  const { grandchild } = useModuleHeader(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);

  // 24online Manage DDNS Hosts — table columns:
  // Service Name | Login Name | Host Name | Method | Interface |
  //   Check Interval (minutes) | Change Status | Select
  const [rows, setRows] = React.useState<any[]>([
    { id: 1, service: "DynDNS", login: "admin1", host: "bhiwani-gw.dyndns.org", method: "External Interface", iface: "eth1", checkInterval: "10", status: "Active", selected: false },
    { id: 2, service: "No-IP", login: "noc", host: "hisar-gw.ddns.net", method: "Web Page", iface: "—", checkInterval: "15", status: "Active", selected: false },
    { id: 3, service: "DuckDNS", login: "ops", host: "rohtak-gw.duckdns.org", method: "External Interface", iface: "pppoe0", checkInterval: "5", status: "Inactive", selected: false },
  ]);

  const toggleStatus = (id: number) => {
    setRows(rows.map((r) => (r.id === id ? { ...r, status: r.status === "Active" ? "Inactive" : "Active" } : r)));
    const r = rows.find((x) => x.id === id);
    toast({ title: "Status changed", description: `${r?.host} is now ${r?.status === "Active" ? "Inactive" : "Active"}.` });
  };
  const toggleSel = (id: number) => {
    setRows(rows.map((r) => (r.id === id ? { ...r, selected: !r.selected } : r)));
  };
  const handleDelete = () => {
    const sel = rows.filter((r) => r.selected);
    if (sel.length === 0) {
      toast({ title: "No selection", description: "Select at least one host to delete." });
      return;
    }
    setRows(rows.filter((r) => !r.selected));
    toast({ title: "Hosts deleted", description: `${sel.length} host(s) removed.` });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={grandchild?.label ?? "Manage Hosts"}
        description="View, change status, and delete dynamic DNS hosts."
        icon={<Globe className="h-5 w-5" />}
        breadcrumb={breadcrumb}
        actions={
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete Selected
          </Button>
        }
      />
      <SectionCard title="DDNS Hosts" description={`${rows.length} hosts`}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service Name</TableHead>
                <TableHead>Login Name</TableHead>
                <TableHead>Host Name</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Interface</TableHead>
                <TableHead>Check Interval (minutes)</TableHead>
                <TableHead>Change Status</TableHead>
                <TableHead className="text-center">Select</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.service}</TableCell>
                  <TableCell className="font-mono text-xs">{r.login}</TableCell>
                  <TableCell className="font-mono text-xs">{r.host}</TableCell>
                  <TableCell className="text-xs">{r.method}</TableCell>
                  <TableCell className="font-mono text-xs">{r.iface}</TableCell>
                  <TableCell className="font-mono text-xs">{r.checkInterval}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <button onClick={() => toggleStatus(r.id)}>
                        <StatusBadge status={r.status} />
                      </button>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Checkbox checked={r.selected} onCheckedChange={() => toggleSel(r.id)} />
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
  const setActive = useAppStore((s) => s.setActive);
  const [saving, setSaving] = React.useState(false);
  const [form, setForm] = React.useState({
    templatename: "",
    authtype: "4",
    templatetype: "0",
  });
  const [editorData, setEditorData] = React.useState("");

  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.templatename.trim()) {
      toast({ title: "Template name required", variant: "destructive" });
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    setSaving(false);
    toast({ title: "Template created", description: `${form.templatename} — saved with WYSIWYG content (${editorData.length} chars)` });
    setActive(moduleId, "captive-portal", "manage");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={grandchild?.label ?? "Create Client Login Template"}
        description="Create a new captive portal login page template with WYSIWYG editor (same as 24online CKEditor)."
        icon={<Settings2 className="h-5 w-5" />}
        breadcrumb={breadcrumb}
      />
      <form onSubmit={handleSubmit}>
        <SectionCard title="Template Details" description="Basic template configuration">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Template Name <span className="text-primary">*</span></Label>
              <Input value={form.templatename} onChange={(e) => setForm({ ...form, templatename: e.target.value })} placeholder="e.g. Hotel Premium Login" required />
            </div>
            <div className="space-y-2">
              <Label>Authentication Type</Label>
              <Select value={form.authtype} onValueChange={(v) => setForm({ ...form, authtype: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Open (No Auth)</SelectItem>
                  <SelectItem value="1">User Based</SelectItem>
                  <SelectItem value="2">PIN Based</SelectItem>
                  <SelectItem value="3">MAC Based</SelectItem>
                  <SelectItem value="4">User + PIN</SelectItem>
                  <SelectItem value="5">Hotel (Room+OTP)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Template Type</Label>
              <Select value={form.templatetype} onValueChange={(v) => setForm({ ...form, templatetype: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Pre Login Page</SelectItem>
                  <SelectItem value="1">Post Login Page</SelectItem>
                  <SelectItem value="2">Default Template</SelectItem>
                  <SelectItem value="3">Customizable Page</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="WYSIWYG Editor" description="Design the login page HTML (same CKEditor as 24online — Source, Bold, Italic, Links, Images, Tables, Colors, Forms, etc.)">
          <CkEditorField value={editorData} onChange={setEditorData} />
        </SectionCard>

        <div className="flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => setActive(moduleId, "captive-portal", "manage")}>
            <X className="mr-2 h-4 w-4" /> Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Create Template
          </Button>
        </div>
      </form>
    </div>
  );
}

function CaptiveManagePage({ moduleId, childId, grandchildId }: ViewProps) {
  const { mod, child, grandchild } = useModuleHeader(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const setActive = useAppStore((s) => s.setActive);
  const [rows, setRows] = React.useState([
    { id: 1, name: "Default Template", type: "Pre Login Page", authType: "User + PIN", isDefault: true, status: "Active" },
    { id: 2, name: "@DefaultLeasedLineWelcomePage@", type: "Pre Login Page", authType: "MAC Based", isDefault: true, status: "Active" },
    { id: 3, name: "Self Registration", type: "Pre Login Page", authType: "Open", isDefault: false, status: "Active" },
    { id: 4, name: "REGISTER USING PIN (Default)", type: "Pre Login Page", authType: "PIN Based", isDefault: true, status: "Active" },
    { id: 5, name: "Change Password on Login", type: "Post Login Page", authType: "User Based", isDefault: false, status: "Active" },
    { id: 6, name: "Forgot Password", type: "Pre Login Page", authType: "User Based", isDefault: false, status: "Active" },
    { id: 7, name: "BUY PKG/PIN USING PG (Default)", type: "Pre Login Page", authType: "User + PIN", isDefault: true, status: "Active" },
    { id: 8, name: "RENEW ACC USING PG (Default)", type: "Pre Login Page", authType: "User + PIN", isDefault: true, status: "Active" },
    { id: 9, name: "MY ACC LOGIN PAGE (Default)", type: "Pre Login Page", authType: "User Based", isDefault: true, status: "Active" },
    { id: 10, name: "PG PURCHASE CONFIRM (Default)", type: "Post Login Page", authType: "User Based", isDefault: true, status: "Active" },
    { id: 11, name: "RENEW ACC USING PIN (Default)", type: "Pre Login Page", authType: "PIN Based", isDefault: true, status: "Active" },
    { id: 12, name: "PG REDIRECTION PAGE (Default)", type: "Post Login Page", authType: "Open", isDefault: true, status: "Active" },
  ]);
  const [editing, setEditing] = React.useState<any | null>(null);
  const [editorData, setEditorData] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);

  const filtered = rows.filter((r) => r.name.toLowerCase().includes(search.toLowerCase()));

  const handleEdit = (r: any) => {
    setEditing(r);
    setEditorData(`<h1>${r.name}</h1>\n<p>Login page content for ${r.name}</p>\n<form>\n  <input type="text" placeholder="Username" />\n  <input type="password" placeholder="Password" />\n  <button type="submit">Login</button>\n</form>`);
  };

  const handleSaveEdit = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    setSaving(false);
    toast({ title: "Template updated", description: `${editing.name} — WYSIWYG content saved (${editorData.length} chars)` });
    setEditing(null);
    setEditorData("");
  };

  const handleDelete = (r: any) => {
    setRows(rows.filter((x) => x.id !== r.id));
    toast({ title: "Template deleted", description: r.name });
  };

  const handleExport = (r: any) => {
    toast({ title: "Exporting template", description: `${r.name}.zip` });
  };

  const handlePreview = (r: any) => {
    toast({ title: "Preview", description: `Opening preview for ${r.name}` });
  };

  // If editing a template, show the WYSIWYG editor page
  if (editing) {
    return (
      <div className="space-y-6">
        <PageHeader
          title={`Edit: ${editing.name}`}
          description="Edit the template HTML with the WYSIWYG editor (same CKEditor as 24online)."
          icon={<Settings2 className="h-5 w-5" />}
          breadcrumb={[
            ...breadcrumb.slice(0, -1),
            { label: "Manage", onClick: () => setEditing(null) },
            { label: editing.name },
          ]}
        />
        <SectionCard title="Template Properties">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Template Name</Label>
              <Input value={editing.name} readOnly className="bg-muted/50" />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Input value={editing.type} readOnly className="bg-muted/50" />
            </div>
            <div className="space-y-2">
              <Label>Auth Type</Label>
              <Input value={editing.authType} readOnly className="bg-muted/50" />
            </div>
          </div>
        </SectionCard>
        <SectionCard title="WYSIWYG Editor" description="Full CKEditor with Source, Bold, Italic, Links, Images, Tables, Colors, Forms, etc.">
          <CkEditorField value={editorData} onChange={setEditorData} />
        </SectionCard>
        <div className="flex items-center justify-end gap-3">
          <Button variant="outline" onClick={() => setEditing(null)}><X className="mr-2 h-4 w-4" /> Cancel</Button>
          <Button variant="outline" onClick={() => toast({ title: "Preview", description: "Opening template preview…" })}><FileText className="mr-2 h-4 w-4" /> Preview</Button>
          <Button onClick={handleSaveEdit} disabled={saving}>
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Update Template
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={grandchild?.label ?? "Manage Client Login Templates"}
        description={`${rows.length} templates — click a template name to open the WYSIWYG editor.`}
        icon={<Settings2 className="h-5 w-5" />}
        breadcrumb={breadcrumb}
        actions={<Button onClick={() => setActive(moduleId, "captive-portal", "create")}><Plus className="mr-2 h-4 w-4" /> Create Template</Button>}
      />
      <ActionBar>
        <div className="relative flex-1 max-w-xs">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search templates…" className="h-8 pl-8 text-xs" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Button size="sm" variant="outline" onClick={() => toast({ title: "Import template", description: "Upload a .zip template file" })}>
          <Upload className="mr-2 h-3.5 w-3.5" /> Import Template
        </Button>
        <Button size="sm" variant="outline" onClick={() => toast({ title: "Export all", description: "Exporting all templates as .zip" })}>
          <Download className="mr-2 h-3.5 w-3.5" /> Export All
        </Button>
      </ActionBar>
      <SectionCard title="Client Login Templates" description={`${filtered.length} of ${rows.length} templates`}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Template Name</TableHead>
                <TableHead>Template Type</TableHead>
                <TableHead>Authentication Type</TableHead>
                <TableHead>Default</TableHead>
                <TableHead>Preview</TableHead>
                <TableHead className="text-right">Export / Delete</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>
                    <button className="font-medium text-primary hover:underline" onClick={() => handleEdit(r)}>
                      {r.name}
                    </button>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{r.type}</TableCell>
                  <TableCell><Badge variant="outline" className="text-[10px]">{r.authType}</Badge></TableCell>
                  <TableCell>
                    {r.isDefault ? <Badge className="bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400">Default</Badge> : <span className="text-muted-foreground">—</span>}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => handlePreview(r)}>
                      <FileText className="h-3.5 w-3.5" />
                    </Button>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm" onClick={() => handleExport(r)}>
                        <Download className="h-3.5 w-3.5" />
                      </Button>
                      {!r.isDefault && (
                        <Button variant="ghost" size="sm" className="text-primary hover:text-primary" onClick={() => handleDelete(r)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
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
 *  NAS MANAGEMENT — NAS IP Configuration
 * ===================================================================== */

function NasIpConfigPage({ moduleId, childId, grandchildId }: ViewProps) {
  const { grandchild } = useModuleHeader(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);

  // 24online NAS IP Configuration — fields:
  // nasipaddress, calledstationid, nasidentifier, rejectreasonip, rejectreasonippoollimit,
  // naserror, userlicenseover, zonelicenseover, btnsave (submit)
  // Buttons: Update
  // Form action: NASGUIManager
  const [form, setForm] = React.useState({
    nasipaddress: "203.0.113.5",
    calledstationid: "00:1A:2B:3C:4D:5E",
    nasidentifier: "sms-core-01",
    rejectreasonip: "Invalid NAS IP",
    rejectreasonippoollimit: "IP pool exhausted",
    naserror: "RADIUS auth timeout",
    userlicenseover: "User license limit exceeded",
    zonelicenseover: "Zone license limit exceeded",
  });
  const [saving, setSaving] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    setSaving(false);
    toast({ title: "NAS IP configuration updated", description: "NASGUIManager: settings saved successfully." });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={grandchild?.label ?? "NAS IP Configuration"}
        description="Configure NAS identification and the various reject-reason / error messages shown to users."
        icon={<HardDrive className="h-5 w-5" />}
        breadcrumb={breadcrumb}
      />
      <form onSubmit={handleSubmit} action="NASGUIManager">
        <SectionCard
          title="NAS IP & Identification"
          description="NAS IP, called-station ID, and NAS identifier"
          actions={
            <Button type="submit" name="btnsave" disabled={saving}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Update
            </Button>
          }
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="nasipaddress">NAS IP Address</Label>
              <Input id="nasipaddress" name="nasipaddress" value={form.nasipaddress} onChange={(e) => setForm({ ...form, nasipaddress: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="calledstationid">Called Station ID</Label>
              <Input id="calledstationid" name="calledstationid" value={form.calledstationid} onChange={(e) => setForm({ ...form, calledstationid: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nasidentifier">NAS Identifier</Label>
              <Input id="nasidentifier" name="nasidentifier" value={form.nasidentifier} onChange={(e) => setForm({ ...form, nasidentifier: e.target.value })} />
            </div>
          </div>
        </SectionCard>
        <SectionCard title="Reject Reason Messages" description="Customize the messages shown for various reject reasons">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="rejectreasonip">Reject Reason (Invalid IP)</Label>
              <Input id="rejectreasonip" name="rejectreasonip" value={form.rejectreasonip} onChange={(e) => setForm({ ...form, rejectreasonip: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rejectreasonippoollimit">Reject Reason (IP Pool Limit)</Label>
              <Input id="rejectreasonippoollimit" name="rejectreasonippoollimit" value={form.rejectreasonippoollimit} onChange={(e) => setForm({ ...form, rejectreasonippoollimit: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="naserror">NAS Error</Label>
              <Input id="naserror" name="naserror" value={form.naserror} onChange={(e) => setForm({ ...form, naserror: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="userlicenseover">User License Over</Label>
              <Input id="userlicenseover" name="userlicenseover" value={form.userlicenseover} onChange={(e) => setForm({ ...form, userlicenseover: e.target.value })} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="zonelicenseover">Zone License Over</Label>
              <Input id="zonelicenseover" name="zonelicenseover" value={form.zonelicenseover} onChange={(e) => setForm({ ...form, zonelicenseover: e.target.value })} />
            </div>
          </div>
        </SectionCard>
      </form>
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
  const { grandchild } = useModuleHeader(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);

  // 24online Manage Devices — table columns:
  // IPv4 Address | Description | Comments | Status | Select
  // Buttons: Add, Delete
  // Form action: DevicesManager
  const [rows, setRows] = React.useState<any[]>([
    { id: 1, ip: "192.168.1.10", desc: "Core Switch", comments: "Main distribution switch", status: "Online", selected: false },
    { id: 2, ip: "192.168.1.11", desc: "Edge Router", comments: "BGP edge router", status: "Online", selected: false },
    { id: 3, ip: "192.168.1.20", desc: "OLT Bhiwani", comments: "GPON OLT for Bhiwani zone", status: "Warning", selected: false },
    { id: 4, ip: "192.168.1.21", desc: "OLT Hisar", comments: "GPON OLT for Hisar zone", status: "Offline", selected: false },
  ]);
  const [showForm, setShowForm] = React.useState(false);
  const [form, setForm] = React.useState({ ip: "", desc: "", comments: "" });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setRows([...rows, { id: Date.now(), ip: form.ip, desc: form.desc, comments: form.comments, status: "Online", selected: false }]);
    toast({ title: "Device added", description: `${form.desc} (${form.ip})` });
    setForm({ ip: "", desc: "", comments: "" });
    setShowForm(false);
  };

  const handleDelete = () => {
    const sel = rows.filter((r) => r.selected);
    if (sel.length === 0) {
      toast({ title: "No selection", description: "Select at least one device to delete." });
      return;
    }
    setRows(rows.filter((r) => !r.selected));
    toast({ title: "Devices deleted", description: `${sel.length} device(s) removed.` });
  };

  const toggleSel = (id: number) => {
    setRows(rows.map((r) => (r.id === id ? { ...r, selected: !r.selected } : r)));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={grandchild?.label ?? "Manage Devices"}
        description="Track IPv4 devices (switches, routers, OLTs) for status monitoring."
        icon={<Cpu className="h-5 w-5" />}
        breadcrumb={breadcrumb}
      />
      <form action="DevicesManager">
        <ActionBar>
          <Button type="button" size="sm" onClick={() => setShowForm(!showForm)}>
            <Plus className="mr-2 h-3.5 w-3.5" /> Add
          </Button>
          <Button type="button" size="sm" variant="destructive" onClick={handleDelete}>
            <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete
          </Button>
        </ActionBar>

        {showForm && (
          <SectionCard title="Add Device" description="Register a new device for monitoring">
            <form onSubmit={handleAdd} className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="devip">IPv4 Address</Label>
                <Input id="devip" type="text" value={form.ip} onChange={(e) => setForm({ ...form, ip: e.target.value })} placeholder="192.168.1.10" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="devdesc">Description</Label>
                <Input id="devdesc" value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} placeholder="Core Switch" required />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="devcomments">Comments</Label>
                <Input id="devcomments" value={form.comments} onChange={(e) => setForm({ ...form, comments: e.target.value })} placeholder="Optional notes" />
              </div>
              <div className="md:col-span-4 flex justify-end">
                <Button type="submit" size="sm">
                  <Plus className="mr-2 h-3.5 w-3.5" /> Add Device
                </Button>
              </div>
            </form>
          </SectionCard>
        )}

        <SectionCard title="Devices" description={`${rows.length} devices`}>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>IPv4 Address</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Comments</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Select</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-xs text-muted-foreground py-8">
                      No devices tracked. Click Add to register a device.
                    </TableCell>
                  </TableRow>
                ) : rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-mono text-xs">{r.ip}</TableCell>
                    <TableCell className="font-medium">{r.desc}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{r.comments}</TableCell>
                    <TableCell><StatusBadge status={r.status} /></TableCell>
                    <TableCell className="text-center">
                      <Checkbox checked={r.selected} onCheckedChange={() => toggleSel(r.id)} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </SectionCard>
      </form>
    </div>
  );
}

/* ---------- Device Logs ---------- */

function DeviceLogsPage({ moduleId, childId, grandchildId }: ViewProps) {
  const { grandchild } = useModuleHeader(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);

  // 24online Device Logs — fields:
  // displaystartdate (text), displayenddate (text), newstatus (select),
  // deviceip (text), search (submit)
  // Buttons: "Get Device Log Details"
  // Form action: devicelogdetails.jsp
  const [form, setForm] = React.useState({
    displaystartdate: "",
    displayenddate: "",
    newstatus: "all",
    deviceip: "",
  });
  const [loading, setLoading] = React.useState(false);
  const [rows, setRows] = React.useState<any[]>([]);

  const allLogs: any[] = [
    { id: 1, timestamp: "2026-01-15 14:32:11", deviceIp: "192.168.1.10", level: "INFO", message: "Device reachable via SNMP" },
    { id: 2, timestamp: "2026-01-15 14:25:08", deviceIp: "192.168.1.20", level: "WARN", message: "Interface utilization above 80%" },
    { id: 3, timestamp: "2026-01-15 14:18:42", deviceIp: "192.168.1.21", level: "ERROR", message: "SNMP timeout - device offline" },
    { id: 4, timestamp: "2026-01-15 14:10:15", deviceIp: "192.168.1.11", level: "INFO", message: "BGP session established" },
    { id: 5, timestamp: "2026-01-15 14:00:00", deviceIp: "192.168.1.20", level: "WARN", message: "High CPU usage detected" },
  ];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    setLoading(false);
    const filtered = allLogs.filter((r) => {
      if (form.newstatus !== "all" && r.level !== form.newstatus) return false;
      if (form.deviceip && !r.deviceIp.includes(form.deviceip)) return false;
      return true;
    });
    setRows(filtered);
    toast({
      title: "Device log details retrieved",
      description: `${filtered.length} matching log entries.`,
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={grandchild?.label ?? "Device Logs"}
        description="Search and view status-tracker device logs by date range, status, and device IP."
        icon={<FileText className="h-5 w-5" />}
        breadcrumb={breadcrumb}
      />
      <form onSubmit={handleSearch} action="devicelogdetails.jsp">
        <SectionCard
          title="Filter Device Logs"
          description="Filter by date range, log status, and device IP"
          actions={
            <Button type="submit" name="search" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
              Get Device Log Details
            </Button>
          }
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="displaystartdate">Start Date</Label>
              <Input id="displaystartdate" name="displaystartdate" type="date" value={form.displaystartdate} onChange={(e) => setForm({ ...form, displaystartdate: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="displayenddate">End Date</Label>
              <Input id="displayenddate" name="displayenddate" type="date" value={form.displayenddate} onChange={(e) => setForm({ ...form, displayenddate: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newstatus">Status</Label>
              <Select value={form.newstatus} onValueChange={(v) => setForm({ ...form, newstatus: v })}>
                <SelectTrigger id="newstatus"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="INFO">INFO</SelectItem>
                  <SelectItem value="WARN">WARN</SelectItem>
                  <SelectItem value="ERROR">ERROR</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="deviceip">Device IP</Label>
              <Input id="deviceip" name="deviceip" value={form.deviceip} onChange={(e) => setForm({ ...form, deviceip: e.target.value })} placeholder="192.168.1.10" />
            </div>
          </div>
        </SectionCard>
      </form>
      <SectionCard title="Device Log Details" description={`${rows.length} entries`}>
        {rows.length === 0 ? (
          <EmptyState icon={<FileText className="h-5 w-5" />} title="No logs retrieved" description="Click Get Device Log Details to retrieve logs." />
        ) : (
          <div className="max-h-96 overflow-y-auto scrollbar-thin">
            <Table>
              <TableHeader className="sticky top-0 bg-card z-10">
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Device IP</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Message</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-mono text-xs text-muted-foreground whitespace-nowrap">{r.timestamp}</TableCell>
                    <TableCell className="font-mono text-xs">{r.deviceIp}</TableCell>
                    <TableCell><LevelBadge level={r.level} /></TableCell>
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

  // 24online Customized Images — fields:
  // topfilename (file), bottomfilename (file), preViewT (button),
  // topleftcornerfilename (file), preViewTL (button), upLoad (button)
  // Buttons: Preview, Upload File
  const [topfilename, setTopfilename] = React.useState("");
  const [bottomfilename, setBottomfilename] = React.useState("");
  const [topleftcornerfilename, setTopleftcornerfilename] = React.useState("");
  const [uploading, setUploading] = React.useState(false);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    await new Promise((r) => setTimeout(r, 600));
    setUploading(false);
    toast({
      title: "Images uploaded",
      description: "Customized images uploaded successfully.",
    });
  };

  const renderFileField = (
    id: string,
    label: string,
    previewBtn: string,
    value: string,
    set: (v: string) => void
  ) => (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-[2fr_1fr] md:items-end">
      <div className="space-y-2">
        <Label htmlFor={id}>{label}</Label>
        <Input
          id={id}
          name={id}
          type="file"
          accept="image/*"
          onChange={(e) => set(e.target.files?.[0]?.name ?? "")}
        />
      </div>
      <Button
        type="button"
        variant="outline"
        name={previewBtn}
        disabled={!value}
        onClick={() => toast({ title: "Preview", description: `Previewing ${value}` })}
      >
        <FileText className="mr-2 h-4 w-4" /> Preview
      </Button>
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customized Images"
        description="Upload custom images for the top banner, bottom banner, and top-left corner of the client portal."
        breadcrumb={breadcrumb}
        icon={<SlidersHorizontal className="h-5 w-5" />}
      />
      <form onSubmit={handleUpload}>
        <SectionCard
          title="Upload Customized Images"
          description="Choose image files (PNG / JPG / GIF) — max 500 KB each"
          actions={
            <Button type="submit" name="upLoad" disabled={uploading}>
              {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
              Upload File
            </Button>
          }
        >
          <div className="space-y-6">
            {renderFileField("topfilename", "Top Banner Image", "preViewT", topfilename, setTopfilename)}
            {renderFileField("bottomfilename", "Bottom Banner Image", "preViewB", bottomfilename, setBottomfilename)}
            {renderFileField("topleftcornerfilename", "Top Left Corner Image", "preViewTL", topleftcornerfilename, setTopleftcornerfilename)}
          </div>
        </SectionCard>
      </form>
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
  // 24online Client GUI URLs — fields:
  // radiuslocation (radio) + txtregusingpinurl, txtrenewusingpinurl, txttopupusingpinurl,
  // txtmyaccounturl, txtbuypkgusingpgwayurl, txtrenewusingpgwayurl, txtbuypkgusingsmswayurl,
  // txtrenewpkgusingsmswayurl, txtchangebodurl, txtresetpasswordurl, txtcoupondetailsurl,
  // txtregwithoutusingpinurl, txtpackageplansurl, txtrecoverpasswdurl
  // Buttons: Update
  const [radiuslocation, setRadiuslocation] = React.useState("Local");
  const [urls, setUrls] = React.useState([
    { id: "txtregusingpinurl", label: "Registration using PIN URL", value: "https://portal.cryptsk.com/register?mode=pin" },
    { id: "txtrenewusingpinurl", label: "Renew using PIN URL", value: "https://portal.cryptsk.com/renew?mode=pin" },
    { id: "txttopupusingpinurl", label: "Top-up using PIN URL", value: "https://portal.cryptsk.com/topup?mode=pin" },
    { id: "txtmyaccounturl", label: "My Account URL", value: "https://portal.cryptsk.com/myaccount" },
    { id: "txtbuypkgusingpgwayurl", label: "Buy Package using Payment Gateway URL", value: "https://portal.cryptsk.com/buy?mode=pg" },
    { id: "txtrenewusingpgwayurl", label: "Renew using Payment Gateway URL", value: "https://portal.cryptsk.com/renew?mode=pg" },
    { id: "txtbuypkgusingsmswayurl", label: "Buy Package using SMS URL", value: "https://portal.cryptsk.com/buy?mode=sms" },
    { id: "txtrenewpkgusingsmswayurl", label: "Renew Package using SMS URL", value: "https://portal.cryptsk.com/renew?mode=sms" },
    { id: "txtchangebodurl", label: "Change BOD URL", value: "https://portal.cryptsk.com/bod" },
    { id: "txtresetpasswordurl", label: "Reset Password URL", value: "https://portal.cryptsk.com/reset" },
    { id: "txtcoupondetailsurl", label: "Coupon Details URL", value: "https://portal.cryptsk.com/coupon" },
    { id: "txtregwithoutusingpinurl", label: "Registration without using PIN URL", value: "https://portal.cryptsk.com/register" },
    { id: "txtpackageplansurl", label: "Package Plans URL", value: "https://portal.cryptsk.com/plans" },
    { id: "txtrecoverpasswdurl", label: "Recover Password URL", value: "https://portal.cryptsk.com/recover" },
  ]);
  const [saving, setSaving] = React.useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 400));
    setSaving(false);
    toast({ title: "Client GUI URLs updated", description: `${urls.length} URLs saved.` });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Client GUI URLs"
        description="Configure the URLs used by the client GUI / self-service portal for registration, renewal, top-up, password recovery, etc."
        breadcrumb={breadcrumb}
        icon={<Globe className="h-5 w-5" />}
      />
      <form onSubmit={handleUpdate}>
        <SectionCard title="RADIUS Location" description="Choose where RADIUS authentication is performed (radiuslocation radio)">
          <div className="flex flex-wrap gap-6">
            {["Local", "Remote"].map((opt) => (
              <label key={opt} className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="radiuslocation"
                  value={opt}
                  checked={radiuslocation === opt}
                  onChange={() => setRadiuslocation(opt)}
                  className="h-4 w-4 accent-primary"
                />
                {opt}
              </label>
            ))}
          </div>
        </SectionCard>
        <SectionCard
          title="Portal URLs"
          description="URLs used for client login redirects and self-service actions"
          actions={
            <Button type="submit" disabled={saving}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Update
            </Button>
          }
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {urls.map((u) => (
              <div key={u.id} className="space-y-2">
                <Label htmlFor={u.id}>{u.label}</Label>
                <Input
                  id={u.id}
                  name={u.id}
                  value={u.value}
                  onChange={(e) => setUrls((arr) => arr.map((x) => x.id === u.id ? { ...x, value: e.target.value } : x))}
                  className="font-mono text-xs"
                />
              </div>
            ))}
          </div>
        </SectionCard>
      </form>
    </div>
  );
}

/* --- Webservice Config --- */
function WebserviceConfigPage({ moduleId, childId, grandchildId }: ViewProps) {
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);
  const { toast } = useToast();

  // 24online Webservice Config — fields:
  // restrictionvalue, packageid (select), ipallocation (radio), poolid (select),
  // bindtomac (radio), generateinvoice (radio)
  // Buttons: Update
  // Sections: "Configure Web Service Parameters", "Default User Creation Template",
  //   "Service Related Parameters"
  const [restrictionvalue, setRestrictionvalue] = React.useState("0");
  const [packageid, setPackageid] = React.useState("1");
  const [ipallocation, setIpallocation] = React.useState("Dynamic");
  const [poolid, setPoolid] = React.useState("1");
  const [bindtomac, setBindtomac] = React.useState("No");
  const [generateinvoice, setGenerateinvoice] = React.useState("Yes");
  const [saving, setSaving] = React.useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 400));
    setSaving(false);
    toast({ title: "Webservice configuration updated", description: "Web service parameters saved successfully." });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Webservice Configuration"
        description="Configure web-service parameters, default user creation template, and service-related parameters."
        breadcrumb={breadcrumb}
        icon={<SlidersHorizontal className="h-5 w-5" />}
      />
      <form onSubmit={handleUpdate} className="space-y-6">
        <SectionCard
          title="Configure Web Service Parameters"
          description="Restriction value applied to web-service-created users"
          actions={
            <Button type="submit" disabled={saving}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Update
            </Button>
          }
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="restrictionvalue">Restriction Value</Label>
              <Input
                id="restrictionvalue"
                name="restrictionvalue"
                value={restrictionvalue}
                onChange={(e) => setRestrictionvalue(e.target.value)}
              />
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Default User Creation Template" description="Default package, IP allocation, and pool for new users">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="packageid">Package</Label>
              <Select value={packageid} onValueChange={setPackageid}>
                <SelectTrigger id="packageid"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Basic 10 Mbps — 30 days</SelectItem>
                  <SelectItem value="2">Standard 25 Mbps — 30 days</SelectItem>
                  <SelectItem value="3">Premium 50 Mbps — 30 days</SelectItem>
                  <SelectItem value="4">Unlimited 100 Mbps — 30 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>IP Allocation</Label>
              <div className="flex flex-wrap gap-4">
                {["Dynamic", "Static", "Pool"].map((opt) => (
                  <label key={opt} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="ipallocation"
                      value={opt}
                      checked={ipallocation === opt}
                      onChange={() => setIpallocation(opt)}
                      className="h-4 w-4 accent-primary"
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="poolid">IP Pool</Label>
              <Select value={poolid} onValueChange={setPoolid}>
                <SelectTrigger id="poolid"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">LAN-Pool-A (192.168.1.0/24)</SelectItem>
                  <SelectItem value="2">LAN-Pool-B (192.168.2.0/24)</SelectItem>
                  <SelectItem value="3">WLAN-Pool (10.10.10.0/24)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Service Related Parameters" description="Bind to MAC and invoice generation toggles">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Bind to MAC</Label>
              <div className="flex gap-6">
                {["Yes", "No"].map((opt) => (
                  <label key={opt} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="bindtomac"
                      value={opt}
                      checked={bindtomac === opt}
                      onChange={() => setBindtomac(opt)}
                      className="h-4 w-4 accent-primary"
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Generate Invoice</Label>
              <div className="flex gap-6">
                {["Yes", "No"].map((opt) => (
                  <label key={opt} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="generateinvoice"
                      value={opt}
                      checked={generateinvoice === opt}
                      onChange={() => setGenerateinvoice(opt)}
                      className="h-4 w-4 accent-primary"
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </SectionCard>
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

  // 24online Radius Config — table columns:
  // Realm Name | Remote Server IP | Auth Remote Port | Acct Remote Port | Options | Del
  // Buttons: Add, Delete
  // Form action: NASGUIManager
  const [rows, setRows] = React.useState<any[]>([
    { id: 1, realm: "cryptsk.local", remoteIp: "203.0.113.5", authPort: "1812", acctPort: "1813", options: "Auth+Acct", selected: false },
    { id: 2, realm: "rohtak.cryptsk", remoteIp: "103.205.151.10", authPort: "1812", acctPort: "1813", options: "Auth Only", selected: false },
    { id: 3, realm: "hisar.cryptsk", remoteIp: "103.205.151.20", authPort: "1812", acctPort: "1813", options: "Acct Only", selected: false },
  ]);
  const [showForm, setShowForm] = React.useState(false);
  const [form, setForm] = React.useState({ realm: "", remoteIp: "", authPort: "1812", acctPort: "1813", options: "Auth+Acct" });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setRows([...rows, { id: Date.now(), ...form, selected: false }]);
    toast({ title: "Realm added", description: `${form.realm} → ${form.remoteIp}` });
    setForm({ realm: "", remoteIp: "", authPort: "1812", acctPort: "1813", options: "Auth+Acct" });
    setShowForm(false);
  };

  const handleDelete = () => {
    const sel = rows.filter((r) => r.selected);
    if (sel.length === 0) {
      toast({ title: "No selection", description: "Select at least one realm to delete." });
      return;
    }
    setRows(rows.filter((r) => !r.selected));
    toast({ title: "Realms deleted", description: `${sel.length} realm(s) removed.` });
  };

  const toggleSel = (id: number) => {
    setRows(rows.map((r) => (r.id === id ? { ...r, selected: !r.selected } : r)));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="RADIUS Configuration"
        description="Configure RADIUS realms — remote server IP, auth/acct remote ports, and options."
        breadcrumb={breadcrumb}
        icon={<HardDrive className="h-5 w-5" />}
      />
      <form action="NASGUIManager">
        <ActionBar>
          <Button type="button" size="sm" onClick={() => setShowForm(!showForm)}>
            <Plus className="mr-2 h-3.5 w-3.5" /> Add
          </Button>
          <Button type="button" size="sm" variant="destructive" onClick={handleDelete}>
            <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete
          </Button>
        </ActionBar>

        {showForm && (
          <SectionCard title="Add Realm" description="Configure a new RADIUS realm">
            <form onSubmit={handleAdd} className="grid grid-cols-1 gap-4 md:grid-cols-5">
              <div className="space-y-2">
                <Label htmlFor="realm">Realm Name</Label>
                <Input id="realm" value={form.realm} onChange={(e) => setForm({ ...form, realm: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="remoteIp">Remote Server IP</Label>
                <Input id="remoteIp" value={form.remoteIp} onChange={(e) => setForm({ ...form, remoteIp: e.target.value })} placeholder="203.0.113.5" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="authPort">Auth Remote Port</Label>
                <Input id="authPort" type="number" value={form.authPort} onChange={(e) => setForm({ ...form, authPort: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="acctPort">Acct Remote Port</Label>
                <Input id="acctPort" type="number" value={form.acctPort} onChange={(e) => setForm({ ...form, acctPort: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="options">Options</Label>
                <Select value={form.options} onValueChange={(v) => setForm({ ...form, options: v })}>
                  <SelectTrigger id="options"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Auth+Acct">Auth + Acct</SelectItem>
                    <SelectItem value="Auth Only">Auth Only</SelectItem>
                    <SelectItem value="Acct Only">Acct Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-5 flex justify-end">
                <Button type="submit" size="sm">
                  <Plus className="mr-2 h-3.5 w-3.5" /> Add Realm
                </Button>
              </div>
            </form>
          </SectionCard>
        )}

        <SectionCard title="RADIUS Realms" description={`${rows.length} realms`}>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Realm Name</TableHead>
                  <TableHead>Remote Server IP</TableHead>
                  <TableHead>Auth Remote Port</TableHead>
                  <TableHead>Acct Remote Port</TableHead>
                  <TableHead>Options</TableHead>
                  <TableHead className="text-center">Del</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-xs text-muted-foreground py-8">
                      No realms configured.
                    </TableCell>
                  </TableRow>
                ) : rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-mono text-xs font-semibold">{r.realm}</TableCell>
                    <TableCell className="font-mono text-xs">{r.remoteIp}</TableCell>
                    <TableCell className="font-mono text-xs">{r.authPort}</TableCell>
                    <TableCell className="font-mono text-xs">{r.acctPort}</TableCell>
                    <TableCell><Badge variant="outline" className="text-[10px]">{r.options}</Badge></TableCell>
                    <TableCell className="text-center">
                      <Checkbox checked={r.selected} onCheckedChange={() => toggleSel(r.id)} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </SectionCard>
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

  // 24online NAS Connectivity — table columns:
  // NAS IPAddress | NAS ID | Last Interaction Time | 24online Info NAS | No of Live users
  // Read-only monitoring page
  const rows = [
    { id: 1, nasIp: "172.16.16.16", nasId: "sms-core-01", lastInteraction: "2026-01-15 14:32:11", is24onlineInfo: "Yes", liveUsers: 612 },
    { id: 2, nasIp: "172.16.16.17", nasId: "sms-core-02", lastInteraction: "2026-01-15 14:31:58", is24onlineInfo: "Yes", liveUsers: 187 },
    { id: 3, nasIp: "103.205.148.26", nasId: "br-5000-edge", lastInteraction: "2026-01-15 14:30:22", is24onlineInfo: "No", liveUsers: 0 },
    { id: 4, nasIp: "10.10.5.1", nasId: "hotspot-gw-01", lastInteraction: "2026-01-15 12:11:09", is24onlineInfo: "No", liveUsers: 0 },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="NAS Connectivity"
        description="Real-time monitoring of NAS connectivity, last interaction time, and live user counts. Read-only."
        breadcrumb={breadcrumb}
        icon={<Activity className="h-5 w-5" />}
      />
      <SectionCard title="NAS Connectivity Status" description={`${rows.length} NAS devices`}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>NAS IPAddress</TableHead>
                <TableHead>NAS ID</TableHead>
                <TableHead>Last Interaction Time</TableHead>
                <TableHead>24online Info NAS</TableHead>
                <TableHead>No of Live users</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-mono text-xs">{r.nasIp}</TableCell>
                  <TableCell className="font-medium">{r.nasId}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{r.lastInteraction}</TableCell>
                  <TableCell>
                    {r.is24onlineInfo === "Yes" ? (
                      <Badge variant="outline" className="border-emerald-500/30 text-emerald-700 dark:text-emerald-400">Yes</Badge>
                    ) : (
                      <Badge variant="outline" className="border-amber-500/30 text-amber-700 dark:text-amber-400">No</Badge>
                    )}
                  </TableCell>
                  <TableCell className="font-mono text-sm font-semibold">{r.liveUsers}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          This is a read-only monitoring page. To add or remove NAS devices, use the NAS Client Configuration page.
        </p>
      </SectionCard>
    </div>
  );
}

/* --- NAS Client Config --- */
function NasClientConfigPage({ moduleId, childId, grandchildId }: ViewProps) {
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);
  const { toast } = useToast();

  // 24online NAS Client Config — table columns:
  // Client IP Address | NAS Identifier | Secret Key | Del
  // Buttons: Add, Delete
  // Form action: NASGUIManager
  const [rows, setRows] = React.useState<any[]>([
    { id: 1, clientIp: "172.16.16.16", nasIdentifier: "sms-core-01", secretKey: "secret123", selected: false },
    { id: 2, clientIp: "172.16.16.17", nasIdentifier: "sms-core-02", secretKey: "secret456", selected: false },
    { id: 3, clientIp: "103.205.148.26", nasIdentifier: "br-5000-edge", secretKey: "bras789", selected: false },
    { id: 4, clientIp: "10.10.5.1", nasIdentifier: "hotspot-gw-01", secretKey: "hotspot000", selected: false },
  ]);
  const [showForm, setShowForm] = React.useState(false);
  const [form, setForm] = React.useState({ clientIp: "", nasIdentifier: "", secretKey: "" });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setRows([...rows, { id: Date.now(), ...form, selected: false }]);
    toast({ title: "Client added", description: `${form.nasIdentifier} (${form.clientIp})` });
    setForm({ clientIp: "", nasIdentifier: "", secretKey: "" });
    setShowForm(false);
  };

  const handleDelete = () => {
    const sel = rows.filter((r) => r.selected);
    if (sel.length === 0) {
      toast({ title: "No selection", description: "Select at least one client to delete." });
      return;
    }
    setRows(rows.filter((r) => !r.selected));
    toast({ title: "Clients deleted", description: `${sel.length} client(s) removed.` });
  };

  const toggleSel = (id: number) => {
    setRows(rows.map((r) => (r.id === id ? { ...r, selected: !r.selected } : r)));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="NAS Client Configuration"
        description="Configure RADIUS clients — Client IP, NAS Identifier, and Secret Key."
        breadcrumb={breadcrumb}
        icon={<HardDrive className="h-5 w-5" />}
      />
      <form action="NASGUIManager">
        <ActionBar>
          <Button type="button" size="sm" onClick={() => setShowForm(!showForm)}>
            <Plus className="mr-2 h-3.5 w-3.5" /> Add
          </Button>
          <Button type="button" size="sm" variant="destructive" onClick={handleDelete}>
            <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete
          </Button>
        </ActionBar>

        {showForm && (
          <SectionCard title="Add RADIUS Client" description="Register a new NAS device as a RADIUS client">
            <form onSubmit={handleAdd} className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="clientIp">Client IP Address</Label>
                <Input id="clientIp" value={form.clientIp} onChange={(e) => setForm({ ...form, clientIp: e.target.value })} placeholder="10.10.5.2" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nasIdentifier">NAS Identifier</Label>
                <Input id="nasIdentifier" value={form.nasIdentifier} onChange={(e) => setForm({ ...form, nasIdentifier: e.target.value })} placeholder="mikrotik-01" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="secretKey">Secret Key</Label>
                <Input id="secretKey" type="password" value={form.secretKey} onChange={(e) => setForm({ ...form, secretKey: e.target.value })} required />
              </div>
              <div className="flex items-end">
                <Button type="submit" size="sm" className="w-full">
                  <Plus className="mr-2 h-3.5 w-3.5" /> Add Client
                </Button>
              </div>
            </form>
          </SectionCard>
        )}

        <SectionCard title="RADIUS Clients" description={`${rows.length} clients`}>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client IP Address</TableHead>
                  <TableHead>NAS Identifier</TableHead>
                  <TableHead>Secret Key</TableHead>
                  <TableHead className="text-center">Del</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-xs text-muted-foreground py-8">
                      No RADIUS clients configured.
                    </TableCell>
                  </TableRow>
                ) : rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-mono text-xs">{r.clientIp}</TableCell>
                    <TableCell className="font-medium">{r.nasIdentifier}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">••••••••</TableCell>
                    <TableCell className="text-center">
                      <Checkbox checked={r.selected} onCheckedChange={() => toggleSel(r.id)} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </SectionCard>
      </form>
    </div>
  );
}

/* --- Attribute Mapping --- */
function AttributeMappingPage({ moduleId, childId, grandchildId }: ViewProps) {
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);
  const { toast } = useToast();

  // 24online Attribute Mapping — multiple "Packet Mapping List" sections,
  // each with Name, Description columns. Buttons: Create, Delete per section.
  // Form action: PacketMappingConfigManager
  const sections = [
    { id: "access", title: "Access-Request Packet Mapping List", rows: [
      { id: 1, name: "User-Name", desc: "Mapped from HTTP-Username header" },
      { id: 2, name: "User-Password", desc: "PAP password from form field" },
      { id: 3, name: "NAS-IP-Address", desc: "Source IP of RADIUS client" },
    ]},
    { id: "accounting", title: "Accounting-Request Packet Mapping List", rows: [
      { id: 4, name: "Acct-Status-Type", desc: "Start / Stop / Interim" },
      { id: 5, name: "Acct-Session-Id", desc: "Unique session identifier" },
    ]},
    { id: "coa", title: "CoA-Request Packet Mapping List", rows: [
      { id: 6, name: "Acct-Session-Id", desc: "Identifies the session to disconnect" },
    ]},
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attribute Mapping"
        description="Configure packet-mapping lists for Access-Request, Accounting-Request, and CoA-Request RADIUS packets."
        breadcrumb={breadcrumb}
        icon={<HardDrive className="h-5 w-5" />}
      />
      <form action="PacketMappingConfigManager" className="space-y-6">
        {sections.map((sec) => (
          <SectionCard
            key={sec.id}
            title={sec.title}
            description={`${sec.rows.length} attribute mappings`}
            actions={
              <>
                <Button type="button" size="sm" onClick={() => toast({ title: "Create mapping", description: `New mapping in ${sec.title}` })}>
                  <Plus className="mr-2 h-3.5 w-3.5" /> Create
                </Button>
                <Button type="button" size="sm" variant="destructive" onClick={() => toast({ title: "Delete mapping", description: `Selected mappings in ${sec.title} removed.` })}>
                  <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete
                </Button>
              </>
            }
          >
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-center">Select</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sec.rows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-xs text-muted-foreground py-6">
                        No mappings in this list.
                      </TableCell>
                    </TableRow>
                  ) : sec.rows.map((m) => (
                    <TableRow key={m.id}>
                      <TableCell className="font-mono text-xs font-medium">{m.name}</TableCell>
                      <TableCell className="text-xs">{m.desc}</TableCell>
                      <TableCell className="text-center">
                        <Checkbox name={`select_${sec.id}_${m.id}`} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </SectionCard>
        ))}
      </form>
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
