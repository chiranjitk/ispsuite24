"use client";

import * as React from "react";
import { ViewProps, useModuleHeader, useViewRouter, ChildOverview, LeafPlaceholder } from "./_shared";
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Monitor,
  DownloadCloud,
  RefreshCw,
  KeySquare,
  FileText,
  Info,
  Save,
  Search,
  CheckCircle2,
  ShieldCheck,
  Cpu,
  Server,
  Database,
  Cloud,
  Apple,
  MonitorDown,
  X,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { MODULE_LICENSES, DOC_SECTIONS } from "@/lib/mock-data";
import type { DocBlock } from "@/lib/mock-data";

export function HelpView({ moduleId, childId, grandchildId }: ViewProps) {
  const router = useViewRouter(moduleId, childId, grandchildId);

  if (router.state === "loading") return null;
  if (router.state === "module-overview") return <HelpOverview moduleId={moduleId} />;
  if (router.state === "child-overview")
    return <ChildOverview moduleId={moduleId} childId={router.childId} />;

  if (router.state === "grandchild") {
    // Register sub-pages
    if (childId === "register" && grandchildId === "online-registration")
      return <OnlineRegistrationPage moduleId={moduleId} childId={childId} grandchildId={grandchildId} />;
    if (childId === "register" && grandchildId === "module-license")
      return <ModuleLicensePage moduleId={moduleId} childId={childId} grandchildId={grandchildId} />;

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
    case "company-info":
      return <CompanyInfo moduleId={moduleId} childId={childId} />;
    case "client":
      return <ClientApp moduleId={moduleId} childId={childId} />;
    case "upgrade":
      return <UpgradeVersion moduleId={moduleId} childId={childId} />;
    case "customization":
      return <ManageCustomization moduleId={moduleId} childId={childId} />;
    case "documentation":
      return <Documentation moduleId={moduleId} childId={childId} />;
    case "about":
      return <About moduleId={moduleId} childId={childId} />;
    default:
      return <HelpOverview moduleId={moduleId} />;
  }
}

/* ---------------- Shared helpers ---------------- */

function useBreadcrumb(moduleId: string, childId: string, grandchildId?: string) {
  const { mod, child, grandchild } = useModuleHeader(moduleId, childId, grandchildId);
  const setActive = useAppStore((s) => s.setActive);
  return [
    { label: "Cryptsk" },
    { label: mod?.label ?? "Help", onClick: () => setActive(moduleId, "", "") },
    { label: child?.label ?? childId, onClick: () => setActive(moduleId, childId, "") },
    ...(grandchild ? [{ label: grandchild.label }] : []),
  ];
}

/* ---------------- Overview ---------------- */

function HelpOverview({ moduleId }: { moduleId: string }) {
  const { mod } = useModuleHeader(moduleId);
  const setActive = useAppStore((s) => s.setActive);
  if (!mod) return null;
  const cards = [
    { label: "Company Info", desc: "Company details & logo", icon: Building2, child: "company-info" },
    { label: "Cryptsk Client", desc: "Desktop client downloads", icon: Monitor, child: "client" },
    { label: "Upgrade Version", desc: "Check & install upgrades", icon: DownloadCloud, child: "upgrade" },
    { label: "Register Cryptsk", desc: "Product registration", icon: KeySquare, child: "register" },
    { label: "Manage Customization", desc: "Module licenses", icon: ShieldCheck, child: "customization" },
    { label: "Documentation", desc: "User documentation", icon: FileText, child: "documentation" },
    { label: "About", desc: "About Cryptsk", icon: Info, child: "about" },
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

/* ---------------- Company Info ---------------- */

function CompanyInfo({ moduleId, childId }: ViewProps) {
  const { toast } = useToast();
  const [company, setCompany] = React.useState("Cryptsk Networks Pvt. Ltd.");
  const [address, setAddress] = React.useState("1, Cyber Park, Bhiwani, Haryana — 127021, India");
  const [contact, setContact] = React.useState("+91-98xxxxxx00");
  const [email, setEmail] = React.useState("hello@cryptsk.net");
  const [website, setWebsite] = React.useState("https://cryptsk.net");
  const [gst, setGst] = React.useState("06AABCC1234D1Z5");
  return (
    <div className="space-y-6">
      <ChildHeader moduleId={moduleId} childId={childId} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <SectionCard title="Company Information" description="Editable company profile" className="lg:col-span-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="cn">Company Name</Label>
              <Input id="cn" value={company} onChange={(e) => setCompany(e.target.value)} />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="ad">Address</Label>
              <Textarea id="ad" value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="co">Contact</Label>
              <Input id="co" value={contact} onChange={(e) => setContact(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="em">Email</Label>
              <Input id="em" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ws">Website</Label>
              <Input id="ws" value={website} onChange={(e) => setWebsite(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="gst">GST Number</Label>
              <Input id="gst" value={gst} onChange={(e) => setGst(e.target.value)} className="font-mono text-xs" />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button onClick={() => toast({ title: "Company information saved" })}>
              <Save className="mr-1.5 h-4 w-4" /> Save Changes
            </Button>
          </div>
        </SectionCard>
        <SectionCard title="Company Logo" description="Square image, max 1 MB">
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-32 w-32 items-center justify-center rounded-xl border border-dashed border-border bg-muted/40">
              <Building2 className="h-12 w-12 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground">PNG / SVG · 1:1 recommended</p>
            <Button variant="outline" className="w-full" onClick={() => toast({ title: "Upload", description: "Logo upload dialog opened." })}>
              <DownloadCloud className="mr-1.5 h-4 w-4" /> Upload Logo
            </Button>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

/* ---------------- Cryptsk Client ---------------- */

function ClientApp({ moduleId, childId }: ViewProps) {
  const { toast } = useToast();
  const systemMeta = useAppStore((s) => s.systemMeta);
  const downloads = [
    { os: "Windows", icon: Monitor, size: "82.4 MB", file: "CryptskClient-Setup.exe", req: "Windows 10 or later" },
    { os: "macOS", icon: Apple, size: "76.1 MB", file: "CryptskClient.dmg", req: "macOS 11 Big Sur or later" },
    { os: "Linux", icon: MonitorDown, size: "68.9 MB", file: "CryptskClient.AppImage", req: "Ubuntu 20.04+, Fedora 35+" },
  ];
  return (
    <div className="space-y-6">
      <ChildHeader moduleId={moduleId} childId={childId} />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <KpiCard label="Client Version" value="8.3.8" icon={<Monitor className="h-4 w-4" />} accent />
        <KpiCard label="Build" value="3.0" icon={<Cpu className="h-4 w-4" />} />
        <KpiCard label="Supported OS" value="3" icon={<MonitorDown className="h-4 w-4" />} />
      </div>
      <SectionCard title="Download Cryptsk Client" description="Connect securely to your Cryptsk gateway from any desktop">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {downloads.map((d) => (
            <div key={d.os} className="flex flex-col items-start gap-2 rounded-lg border border-border bg-muted/30 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <d.icon className="h-5 w-5" />
              </div>
              <p className="font-medium">{d.os}</p>
              <p className="text-xs text-muted-foreground">{d.req}</p>
              <p className="font-mono text-xs text-muted-foreground">{d.file} · {d.size}</p>
              <Button size="sm" className="mt-1 w-full" onClick={() => toast({ title: "Download started", description: `${d.file} is downloading.` })}>
                <DownloadCloud className="mr-1.5 h-3.5 w-3.5" /> Download
              </Button>
            </div>
          ))}
        </div>
      </SectionCard>
      <SectionCard title="Release Notes" description={`Cryptsk Client v${systemMeta.version} build ${systemMeta.build}`}>
        <div className="space-y-3 text-sm">
          <div>
            <p className="font-medium">v8.3.8 — 04 Oct 2026</p>
            <ul className="ml-4 list-disc text-xs text-muted-foreground">
              <li>Added dark mode for the desktop client UI</li>
              <li>Improved reconnection logic for flaky links</li>
              <li>Fixed data usage counter overflow on long sessions</li>
            </ul>
          </div>
          <div>
            <p className="font-medium">v8.3.7 — 18 Sep 2026</p>
            <ul className="ml-4 list-disc text-xs text-muted-foreground">
              <li>Added native Apple Silicon builds</li>
              <li>Auto-update check on launch</li>
            </ul>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

/* ---------------- Upgrade Version ---------------- */

function UpgradeVersion({ moduleId, childId }: ViewProps) {
  const { toast } = useToast();
  const systemMeta = useAppStore((s) => s.systemMeta);
  const changelog = [
    { version: "8.3.9", date: "Pending release", notes: ["RADIUS performance improvements", "New OTT platform connectors", "Security patches"] },
    { version: "8.3.8", date: "04 Oct 2026 (current)", notes: ["Dashboard widget redesign", "FAP scheduling bug fix"] },
    { version: "8.3.7", date: "18 Sep 2026", notes: ["Captive portal template gallery", "Backup integrity check"] },
  ];
  return (
    <div className="space-y-6">
      <ChildHeader moduleId={moduleId} childId={childId} />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <KpiCard label="Current Version" value={`${systemMeta.version} build ${systemMeta.build}`} icon={<Cpu className="h-4 w-4" />} accent />
        <KpiCard label="Latest Available" value="8.3.9" icon={<DownloadCloud className="h-4 w-4" />} />
        <KpiCard label="Status" value="Up to date" icon={<CheckCircle2 className="h-4 w-4" />} />
      </div>
      <SectionCard title="Upgrade" description="Check for newer Cryptsk builds">
        <div className="flex flex-col gap-3 rounded-lg border border-border bg-muted/40 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-medium">You are running Cryptsk {systemMeta.version} build {systemMeta.build}</p>
            <p className="text-xs text-muted-foreground">Last check: 04 Oct 2026, 09:48 AM · Model {systemMeta.model}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => toast({ title: "Checking for updates", description: "Latest version: 8.3.9" })}>
              <RefreshCw className="mr-1.5 h-4 w-4" /> Check for Updates
            </Button>
            <Button onClick={() => toast({ title: "Download started", description: "Cryptsk-8.3.9.bundle is downloading." })}>
              <DownloadCloud className="mr-1.5 h-4 w-4" /> Download 8.3.9
            </Button>
          </div>
        </div>
      </SectionCard>
      <SectionCard title="Upgrade Path" description="Recommended sequence">
        <ol className="ml-4 list-decimal space-y-1 text-sm text-muted-foreground">
          <li>Take a full backup from System → Manage Data → Backup</li>
          <li>Download the 8.3.9 bundle from above</li>
          <li>Stop all services via System → Services → Control Services</li>
          <li>Upload & install the bundle through the upgrade wizard</li>
          <li>Run the post-upgrade database migration (automatic)</li>
          <li>Restart services and verify with the dashboard widgets</li>
        </ol>
      </SectionCard>
      <SectionCard title="Changelog" description="Recent Cryptsk releases">
        <div className="space-y-4">
          {changelog.map((c) => (
            <div key={c.version} className="rounded-lg border border-border p-3">
              <div className="flex items-center justify-between">
                <p className="font-medium">v{c.version}</p>
                <Badge variant="outline" className="text-[10px]">{c.date}</Badge>
              </div>
              <ul className="ml-4 mt-1 list-disc text-xs text-muted-foreground">
                {c.notes.map((n) => <li key={n}>{n}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

/* ---------------- Register ---------------- */

function RegisterProduct({ moduleId, childId }: ViewProps) {
  const { toast } = useToast();
  const [licenseKey, setLicenseKey] = React.useState("");
  const [customerName, setCustomerName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [contact, setContact] = React.useState("");
  const register = () => {
    if (!licenseKey.trim() || !customerName.trim() || !email.trim()) {
      toast({ title: "Missing fields", description: "License key, customer name and email are required.", variant: "destructive" });
      return;
    }
    toast({ title: "Product registered", description: `Cryptsk registered to ${customerName}.` });
    setLicenseKey("");
    setCustomerName("");
    setEmail("");
    setContact("");
  };
  return (
    <div className="space-y-6">
      <ChildHeader moduleId={moduleId} childId={childId} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <SectionCard title="Product Registration" description="Enter your license key & customer details" className="lg:col-span-3">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="lk">License Key</Label>
              <Input id="lk" placeholder="XXXX-XXXX-XXXX-XXXX-XXXX" value={licenseKey} onChange={(e) => setLicenseKey(e.target.value)} className="font-mono text-xs" />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="cn">Customer Name</Label>
                <Input id="cn" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ce">Email</Label>
                <Input id="ce" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cc">Contact Number</Label>
              <Input id="cc" value={contact} onChange={(e) => setContact(e.target.value)} />
            </div>
            <Button className="w-full sm:w-auto" onClick={register}>
              <KeySquare className="mr-1.5 h-4 w-4" /> Register Product
            </Button>
          </div>
        </SectionCard>
        <SectionCard title="Why Register?" description="Benefits of registering your Cryptsk deployment" className="lg:col-span-2">
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-500" /> Unlock premium module licenses</li>
            <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-500" /> Receive automatic upgrade notifications</li>
            <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-500" /> Priority support from Cryptsk Networks</li>
            <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-500" /> Cloud-sync of configuration backups</li>
          </ul>
        </SectionCard>
      </div>
    </div>
  );
}

/* ---------------- Manage Customization ---------------- */

function ManageCustomization({ moduleId, childId }: ViewProps) {
  const { toast } = useToast();
  return (
    <div className="space-y-6">
      <ChildHeader moduleId={moduleId} childId={childId} />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <KpiCard label="Total Modules" value={String(MODULE_LICENSES.length)} icon={<ShieldCheck className="h-4 w-4" />} accent />
        <KpiCard label="Licensed" value={String(MODULE_LICENSES.filter((m) => m.licensed).length)} icon={<CheckCircle2 className="h-4 w-4" />} />
        <KpiCard label="Expired / Trial" value={String(MODULE_LICENSES.filter((m) => m.status !== "Active").length)} icon={<KeySquare className="h-4 w-4" />} />
      </div>
      <SectionCard title="Module Licenses" description={`${MODULE_LICENSES.length} modules`}>
        <div className="overflow-x-auto scrollbar-thin">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Module</TableHead>
                <TableHead>Licensed</TableHead>
                <TableHead>Expiry</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MODULE_LICENSES.map((m) => (
                <TableRow key={m.id}>
                  <TableCell className="font-medium">{m.name}</TableCell>
                  <TableCell>
                    {m.licensed ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <span className="text-xs text-muted-foreground">No</span>
                    )}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{m.expiry}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        m.status === "Active"
                          ? "bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400"
                          : m.status === "Trial"
                          ? "bg-amber-500/10 text-amber-700 hover:bg-amber-500/10 dark:text-amber-400"
                          : "bg-primary/10 text-primary hover:bg-primary/10"
                      }
                    >
                      {m.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toast({ title: "Renew license", description: `Renewal form opened for ${m.name}.` })}
                    >
                      <RefreshCw className="mr-1 h-3.5 w-3.5" /> Renew
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

/* ---------------- Documentation ---------------- */

function DocBlockRenderer({ block }: { block: DocBlock }) {
  switch (block.type) {
    case "h1":
      return <h1 className="text-xl font-semibold tracking-tight text-foreground">{block.text}</h1>;
    case "h2":
      return <h2 className="mt-4 text-base font-semibold text-foreground">{block.text}</h2>;
    case "p":
      return <p className="text-sm leading-relaxed text-muted-foreground">{block.text}</p>;
    case "ul":
      return (
        <ul className="ml-5 list-disc space-y-1 text-sm text-muted-foreground">
          {block.items?.map((i, idx) => <li key={idx}>{i}</li>)}
        </ul>
      );
    case "code":
      return (
        <pre className="overflow-x-auto rounded-md border border-border bg-muted/60 p-3 font-mono text-xs text-foreground scrollbar-thin">
          <code>{block.text}</code>
        </pre>
      );
    default:
      return null;
  }
}

function Documentation({ moduleId, childId }: ViewProps) {
  const { toast } = useToast();
  const [activeId, setActiveId] = React.useState(DOC_SECTIONS[0].id);
  const [query, setQuery] = React.useState("");
  const filtered = DOC_SECTIONS.filter((s) =>
    !query.trim()
      ? true
      : s.title.toLowerCase().includes(query.toLowerCase()) ||
        s.content.some((b) => (b.text ?? "").toLowerCase().includes(query.toLowerCase()))
  );
  const active = DOC_SECTIONS.find((s) => s.id === activeId) ?? DOC_SECTIONS[0];

  return (
    <div className="space-y-6">
      <ChildHeader moduleId={moduleId} childId={childId} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <SectionCard title="Sections" description={`${DOC_SECTIONS.length} articles`} className="lg:col-span-1">
          <div className="relative mb-3">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search docs…" className="h-8 pl-8 text-xs" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1">
            {filtered.length === 0 ? (
              <EmptyState icon={<Search className="h-4 w-4" />} title="No results" />
            ) : (
              filtered.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveId(s.id)}
                  className={
                    "flex items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors " +
                    (activeId === s.id
                      ? "bg-primary/10 font-medium text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground")
                  }
                >
                  <FileText className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{s.title}</span>
                </button>
              ))
            )}
          </div>
        </SectionCard>
        <SectionCard
          title={active.title}
          description={active.category}
          className="lg:col-span-4"
          actions={
            <Button variant="outline" size="sm" onClick={() => toast({ title: "Exported", description: `${active.title}.pdf download started.` })}>
              <DownloadCloud className="mr-1.5 h-3.5 w-3.5" /> Export PDF
            </Button>
          }
        >
          <div className="space-y-3">
            {active.content.map((b, i) => <DocBlockRenderer key={i} block={b} />)}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

/* ---------------- About ---------------- */

function About({ moduleId, childId }: ViewProps) {
  const systemMeta = useAppStore((s) => s.systemMeta);
  const stack = [
    { label: "Frontend", value: "Next.js 16 · TypeScript", icon: Monitor },
    { label: "Backend", value: "Node.js · Prisma ORM", icon: Server },
    { label: "Database", value: "PostgreSQL (built from source)", icon: Database },
    { label: "Cloud", value: "Self-hosted · Mini services", icon: Cloud },
  ];
  return (
    <div className="space-y-6">
      <ChildHeader moduleId={moduleId} childId={childId} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <SectionCard className="lg:col-span-1">
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
              <ShieldCheck className="h-10 w-10" />
            </div>
            <div>
              <p className="text-lg font-semibold">Cryptsk</p>
              <p className="text-xs text-muted-foreground">ISP Billing & Gateway Suite</p>
            </div>
            <div className="mt-2 w-full space-y-1.5 rounded-lg border border-border bg-muted/40 p-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Version</span><span className="font-medium">{systemMeta.version}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Build</span><span className="font-medium">{systemMeta.build}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Model</span><span className="font-mono text-xs">{systemMeta.model}</span></div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Technology Stack" description="What powers Cryptsk" className="lg:col-span-2">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {stack.map((s) => (
              <div key={s.label} className="flex items-start gap-3 rounded-lg border border-border bg-muted/30 p-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <s.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{s.label}</p>
                  <p className="text-sm font-medium">{s.value}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Credits" description="Built with the open-source community" className="lg:col-span-3">
          <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
            {["Next.js", "Tailwind CSS", "shadcn/ui", "Prisma", "Lucide Icons", "Radix UI", "Recharts", "Zustand"].map((c) => (
              <div key={c} className="rounded-lg border border-border bg-muted/30 px-3 py-2 text-center font-medium text-foreground">{c}</div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="rounded-xl border border-border bg-card p-4 text-center text-xs text-muted-foreground shadow-sm">
        <p className="font-medium text-foreground">Powered by Cryptsk Networks</p>
        <p className="mt-1">Copyright © 2026 Cryptsk Networks · All Rights Reserved</p>
      </div>
    </div>
  );
}

/* ============================================================
 * REGISTER — Online Registration (grandchild)
 * ============================================================ */

function OnlineRegistrationPage({ moduleId, childId, grandchildId }: ViewProps) {
  const { mod, grandchild } = useModuleHeader(moduleId, childId, grandchildId);
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);
  const setActive = useAppStore((s) => s.setActive);
  const { toast } = useToast();
  const [saving, setSaving] = React.useState(false);

  const [form, setForm] = React.useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    licenseKey: "",
  });
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.companyName.trim() || !form.contactPerson.trim() || !form.email.trim() || !form.licenseKey.trim()) {
      toast({
        title: "Missing required fields",
        description: "Company name, contact person, email and license key are required.",
        variant: "destructive",
      });
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
      toast({ title: "Invalid email", description: "Please enter a valid email address.", variant: "destructive" });
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    toast({
      title: "Registration submitted",
      description: `Cryptsk registered to ${form.companyName}. A confirmation email was sent to ${form.email}.`,
    });
    setActive(moduleId, childId, "module-license");
  };

  if (!mod) return null;

  return (
    <div className="space-y-6">
      <PageHeader
        title={grandchild?.label ?? "Online Registration"}
        description="Register your Cryptsk deployment online to unlock module licenses and upgrades."
        icon={<KeySquare className="h-5 w-5" />}
        breadcrumb={breadcrumb}
        actions={
          <Button variant="outline" onClick={() => setActive(moduleId, childId, "module-license")}>
            <X className="mr-2 h-4 w-4" /> Cancel
          </Button>
        }
      />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <form onSubmit={handleSubmit} className="space-y-6 lg:col-span-3">
          <SectionCard title="Company Information" description="Registered company and primary contact">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="cn">Company Name <span className="text-primary">*</span></Label>
                <Input id="cn" value={form.companyName} onChange={(e) => set("companyName", e.target.value)}
                  placeholder="e.g. Cryptsk Networks Pvt. Ltd." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cp">Contact Person <span className="text-primary">*</span></Label>
                <Input id="cp" value={form.contactPerson} onChange={(e) => set("contactPerson", e.target.value)}
                  placeholder="e.g. Rajesh Kumar" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ce">Email <span className="text-primary">*</span></Label>
                <Input id="ce" type="email" value={form.email} onChange={(e) => set("email", e.target.value)}
                  placeholder="admin@cryptsk.net" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cph">Phone</Label>
                <Input id="cph" value={form.phone} onChange={(e) => set("phone", e.target.value)}
                  placeholder="+91-98xxxxxx00" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="ca">Address</Label>
                <Textarea id="ca" rows={2} value={form.address} onChange={(e) => set("address", e.target.value)}
                  placeholder="Registered business address" />
              </div>
            </div>
          </SectionCard>
          <SectionCard title="License Key" description="Enter the license key issued by Cryptsk Networks">
            <div className="space-y-2">
              <Label htmlFor="lk">License Key <span className="text-primary">*</span></Label>
              <Input id="lk" value={form.licenseKey} onChange={(e) => set("licenseKey", e.target.value)}
                placeholder="XXXX-XXXX-XXXX-XXXX-XXXX" className="font-mono text-xs" />
              <p className="text-xs text-muted-foreground">
                <KeySquare className="mr-1 inline h-3 w-3" />
                The license key is delivered with your purchase confirmation email.
              </p>
            </div>
          </SectionCard>
          <div className="flex items-center justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setActive(moduleId, childId, "module-license")}>Cancel</Button>
            <Button type="submit" disabled={saving}>
              {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Registering…</> : <><Save className="mr-2 h-4 w-4" /> Register</>}
            </Button>
          </div>
        </form>
        <SectionCard title="Why Register?" description="Benefits of registering your Cryptsk deployment" className="lg:col-span-2">
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-500" /> Unlock premium module licenses</li>
            <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-500" /> Receive automatic upgrade notifications</li>
            <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-500" /> Priority support from Cryptsk Networks</li>
            <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-500" /> Cloud-sync of configuration backups</li>
            <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-500" /> Access to the reseller partner portal</li>
            <li className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-500" /> Annual compliance & audit reports</li>
          </ul>
          <div className="mt-4 rounded-lg border border-primary/30 bg-primary/5 p-3 text-xs text-primary">
            <AlertCircle className="mr-1 inline h-3.5 w-3.5" />
            Your license key is validated online against the Cryptsk licensing server.
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

/* ============================================================
 * REGISTER — Module License (grandchild)
 * ============================================================ */

function ModuleLicensePage({ moduleId, childId, grandchildId }: ViewProps) {
  const { mod, grandchild } = useModuleHeader(moduleId, childId, grandchildId);
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);
  const setActive = useAppStore((s) => s.setActive);
  const { toast } = useToast();
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [renewing, setRenewing] = React.useState<string | null>(null);

  const filtered = MODULE_LICENSES.filter((m) => {
    if (statusFilter !== "all" && m.status !== statusFilter) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return m.name.toLowerCase().includes(q) || m.id.toLowerCase().includes(q);
  });

  const handleRenew = async (name: string) => {
    setRenewing(name);
    await new Promise((r) => setTimeout(r, 700));
    setRenewing(null);
    toast({ title: "Renewal requested", description: `Renewal form opened for ${name}. Our team will contact you within 24 hours.` });
  };

  const statusBadge = (status: string) => {
    if (status === "Active")
      return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400">{status}</Badge>;
    if (status === "Trial")
      return <Badge variant="outline" className="bg-amber-500/10 text-amber-700 hover:bg-amber-500/10 dark:text-amber-400">{status}</Badge>;
    return <Badge variant="outline" className="bg-primary/10 text-primary hover:bg-primary/10">{status}</Badge>;
  };

  if (!mod) return null;

  return (
    <div className="space-y-6">
      <PageHeader
        title={grandchild?.label ?? "Module License"}
        description="View and manage license status for all 15 Cryptsk modules."
        icon={<ShieldCheck className="h-5 w-5" />}
        breadcrumb={breadcrumb}
        actions={
          <Button variant="outline" onClick={() => setActive(moduleId, childId, "online-registration")}>
            <KeySquare className="mr-2 h-4 w-4" /> Register
          </Button>
        }
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard label="Total Modules" value={String(MODULE_LICENSES.length)} icon={<ShieldCheck className="h-4 w-4" />} accent />
        <KpiCard label="Licensed" value={String(MODULE_LICENSES.filter((m) => m.licensed).length)} icon={<CheckCircle2 className="h-4 w-4" />} />
        <KpiCard label="Active" value={String(MODULE_LICENSES.filter((m) => m.status === "Active").length)} icon={<ShieldCheck className="h-4 w-4" />} />
        <KpiCard label="Expired / Trial" value={String(MODULE_LICENSES.filter((m) => m.status !== "Active").length)} icon={<AlertCircle className="h-4 w-4" />} />
      </div>
      <SectionCard title="Module Licenses" description={`${filtered.length} of ${MODULE_LICENSES.length} modules`}>
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search modules…" className="pl-9" value={search}
              onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="sm:w-[180px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Trial">Trial</SelectItem>
              <SelectItem value="Expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {filtered.length === 0 ? (
          <EmptyState icon={<ShieldCheck className="h-5 w-5" />} title="No modules match" description="Adjust filters to see modules." />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Module</TableHead>
                  <TableHead>Licensed</TableHead>
                  <TableHead>Expiry</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell>
                      <p className="font-medium text-foreground">{m.name}</p>
                      <p className="font-mono text-[10px] text-muted-foreground">{m.id}</p>
                    </TableCell>
                    <TableCell>
                      {m.licensed ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <span className="text-xs text-muted-foreground">No</span>
                      )}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{m.expiry}</TableCell>
                    <TableCell>{statusBadge(m.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleRenew(m.name)} disabled={renewing === m.name}>
                        {renewing === m.name ? (
                          <><Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" /> Renewing…</>
                        ) : (
                          <><RefreshCw className="mr-1 h-3.5 w-3.5" /> Renew</>
                        )}
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
