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
  ShieldCheck,
  Plus,
  Trash2,
  Save,
  X,
  Search,
  Loader2,
  AlertCircle,
  RefreshCw,
  Clock,
  Gauge,
  Database,
  Zap,
} from "lucide-react";
import { policyApi } from "@/lib/api";

export function PolicyView({ moduleId, childId, grandchildId }: ViewProps) {
  const router = useViewRouter(moduleId, childId, grandchildId);

  if (router.state === "loading") return null;
  if (router.state === "module-overview")
    return <PolicyOverview moduleId={moduleId} />;
  if (router.state === "child-overview")
    return <ChildOverview moduleId={moduleId} childId={router.childId} />;

  if (router.state === "grandchild") {
    // Surfing Quota
    if (childId === "surfing-quota" && grandchildId === "create")
      return <SurfCreatePage {...{ moduleId, childId, grandchildId }} />;
    if (childId === "surfing-quota" && grandchildId === "manage")
      return <SurfManagePage {...{ moduleId, childId, grandchildId }} />;

    // Access Time
    if (childId === "access-time" && grandchildId === "create")
      return <AccessCreatePage {...{ moduleId, childId, grandchildId }} />;
    if (childId === "access-time" && grandchildId === "manage")
      return <AccessManagePage {...{ moduleId, childId, grandchildId }} />;

    // Bandwidth
    if (childId === "bandwidth" && grandchildId === "create")
      return <BwCreatePage {...{ moduleId, childId, grandchildId }} />;
    if (childId === "bandwidth" && grandchildId === "manage")
      return <BwManagePage {...{ moduleId, childId, grandchildId }} />;
    if (childId === "bandwidth" && grandchildId === "schedule")
      return <BwSchedulePage {...{ moduleId, childId, grandchildId }} />;

    // Data Transfer
    if (childId === "data-transfer" && grandchildId === "create")
      return <DtCreatePage {...{ moduleId, childId, grandchildId }} />;
    if (childId === "data-transfer" && grandchildId === "manage")
      return <DtManagePage {...{ moduleId, childId, grandchildId }} />;

    // FAP
    if (childId === "fap" && grandchildId === "create-fap")
      return <FapCreatePage {...{ moduleId, childId, grandchildId }} />;
    if (childId === "fap" && grandchildId === "manage-fap")
      return <FapManagePage {...{ moduleId, childId, grandchildId }} />;

    // QoS
    if (childId === "qos" && grandchildId === "create-cache")
      return <QosCreatePage {...{ moduleId, childId, grandchildId }} />;
    if (childId === "qos" && grandchildId === "manage-cache")
      return <QosManagePage {...{ moduleId, childId, grandchildId }} />;

    return (
      <LeafPlaceholder
        moduleId={moduleId}
        childId={router.childId}
        grandchildId={router.grandchildId}
      />
    );
  }

  return <PolicyOverview moduleId={moduleId} />;
}

/* ================ Shared helpers ================ */

function useBreadcrumb(moduleId: string, childId: string, grandchildId?: string) {
  const { mod, child, grandchild } = useModuleHeader(moduleId, childId, grandchildId);
  const setActive = useAppStore((s) => s.setActive);
  return [
    { label: "Cryptsk" },
    { label: mod?.label ?? "Policy", onClick: () => setActive(moduleId, "", "") },
    { label: child?.label ?? childId, onClick: () => setActive(moduleId, childId, "") },
    ...(grandchild ? [{ label: grandchild.label }] : []),
  ];
}

function PageLoader() {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  );
}

function DeleteDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onConfirm: () => void;
  title: string;
  description: string;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => onOpenChange(false)}>
      <div className="rounded-lg bg-card p-6 shadow-xl max-w-sm" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button variant="destructive" onClick={() => { onConfirm(); onOpenChange(false); }}>
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ================ Overview ================ */

function PolicyOverview({ moduleId }: { moduleId: string }) {
  const { mod } = useModuleHeader(moduleId);
  const setActive = useAppStore((s) => s.setActive);
  if (!mod) return null;
  const cards = [
    { label: "Surfing Quota", desc: "Create & manage surfing quota policies", icon: Clock, child: "surfing-quota" },
    { label: "Access Time", desc: "Time-based access policies", icon: ShieldCheck, child: "access-time" },
    { label: "Bandwidth", desc: "Bandwidth restriction policies", icon: Gauge, child: "bandwidth" },
    { label: "Data Transfer Policy", desc: "Data transfer quotas", icon: Database, child: "data-transfer" },
    { label: "Fair Access Policy", desc: "FAP rules and thresholds", icon: ShieldCheck, child: "fap" },
    { label: "QoS Policy", desc: "Cache & QoS scheduling", icon: Zap, child: "qos" },
  ];
  return (
    <div className="space-y-6">
      <PageHeader title={mod.label} description={mod.desc} icon={<mod.icon className="h-5 w-5" />} />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <button key={c.child} onClick={() => setActive(moduleId, c.child, "")}
            className="group flex items-start gap-3 rounded-xl border border-border bg-card p-4 text-left shadow-sm transition-all hover:border-primary/40 hover:shadow-md">
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

/* ================ SURFING QUOTA ================ */

function SurfCreatePage({ moduleId, childId, grandchildId }: ViewProps) {
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const setActive = useAppStore((s) => s.setActive);
  const [saving, setSaving] = React.useState(false);
  const [form, setForm] = React.useState({
    policyName: "",
    policyType: "Time-based",
    allotedhrs: "1",
    allotedmin: "00",
    unlimitedtime: false,
    sessionpulse: "0",
    setexpireallotedhrs: "0",
    setexpireallotedmin: "00",
    setexpirealloteddays: "30",
    unlimitedvalue: false,
    cycletype: "Daily",
    cycleallotedhrs: "0",
    cycleallotedmin: "00",
    description: "",
  });
  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.policyName.trim()) { toast({ title: "Policy name required", variant: "destructive" }); return; }
    setSaving(true);
    await policyApi.create("surfingPolicies", {
      policyName: form.policyName,
      policyType: form.policyType,
      timeAllowed: form.unlimitedtime ? "Unlimited" : `${form.allotedhrs}:${form.allotedmin}`,
      expirationDuration: form.unlimitedvalue ? "Unlimited" : form.setexpirealloteddays,
      sessionPulse: form.sessionpulse,
      description: form.description,
      status: "Active",
    });
    setSaving(false);
    toast({ title: "Surfing policy created", description: form.policyName });
    setActive(moduleId, "surfing-quota", "manage");
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Create Surfing Quota Policy" description="Create a new surfing quota policy (PolicyManager servlet)." icon={<ShieldCheck className="h-5 w-5" />} breadcrumb={breadcrumb}
        actions={<Button variant="outline" onClick={() => setActive(moduleId, "surfing-quota", "manage")}><X className="mr-2 h-4 w-4" /> Cancel</Button>} />
      <form onSubmit={handleSubmit} className="space-y-6">
        <SectionCard title="Create Policy" description="Surfing quota policy details">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Policy Name <span className="text-primary">*</span></Label>
              <Input value={form.policyName} onChange={(e) => set("policyName", e.target.value)} placeholder="e.g. 1 Hour Daily" required />
            </div>
            <div className="space-y-2">
              <Label>Policy Type <span className="text-primary">*</span></Label>
              <Select value={form.policyType} onValueChange={(v) => set("policyType", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="Time-based">Time-based</SelectItem><SelectItem value="Unlimited">Unlimited</SelectItem></SelectContent>
              </Select>
            </div>
            {!form.unlimitedtime && form.policyType === "Time-based" && (
              <>
                <div className="space-y-2">
                  <Label>Time Allowed (Hours)</Label>
                  <Input type="number" min="0" value={form.allotedhrs} onChange={(e) => set("allotedhrs", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Time Allowed (Minutes)</Label>
                  <Select value={form.allotedmin} onValueChange={(v) => set("allotedmin", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{Array.from({ length: 60 }, (_, i) => <SelectItem key={i} value={String(i).padStart(2, "0")}>{String(i).padStart(2, "0")}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </>
            )}
            <div className="flex items-center gap-3">
              <Switch checked={form.unlimitedtime} onCheckedChange={(v) => set("unlimitedtime", v)} />
              <Label>Unlimited Time</Label>
            </div>
            <div className="space-y-2">
              <Label>Session Pulse (minutes)</Label>
              <Input type="number" min="0" value={form.sessionpulse} onChange={(e) => set("sessionpulse", e.target.value)} />
            </div>
          </div>
        </SectionCard>
        <SectionCard title="Expiration Duration" description="When does the policy expire">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2"><Label>Expiration (Days)</Label><Input type="number" value={form.setexpirealloteddays} onChange={(e) => set("setexpirealloteddays", e.target.value)} disabled={form.unlimitedvalue} /></div>
            <div className="space-y-2"><Label>Expiration (Hours)</Label><Input type="number" value={form.setexpireallotedhrs} onChange={(e) => set("setexpireallotedhrs", e.target.value)} disabled={form.unlimitedvalue} /></div>
            <div className="flex items-center gap-3"><Switch checked={form.unlimitedvalue} onCheckedChange={(v) => set("unlimitedvalue", v)} /><Label>Unlimited Expiration</Label></div>
          </div>
        </SectionCard>
        <SectionCard title="Cycle Settings" description="Reset cycle for the policy">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Cycle Type</Label>
              <Select value={form.cycletype} onValueChange={(v) => set("cycletype", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="Daily">Daily</SelectItem><SelectItem value="Weekly">Weekly</SelectItem><SelectItem value="Monthly">Monthly</SelectItem><SelectItem value="Never">Never</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Cycle Hours</Label><Input type="number" value={form.cycleallotedhrs} onChange={(e) => set("cycleallotedhrs", e.target.value)} /></div>
            <div className="space-y-2">
              <Label>Cycle Minutes</Label>
              <Select value={form.cycleallotedmin} onValueChange={(v) => set("cycleallotedmin", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{Array.from({ length: 60 }, (_, i) => <SelectItem key={i} value={String(i).padStart(2, "0")}>{String(i).padStart(2, "0")}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-3"><Label>Description</Label><Textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={2} placeholder="Policy description…" /></div>
          </div>
        </SectionCard>
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => setActive(moduleId, "surfing-quota", "manage")}>Cancel</Button>
          <Button type="submit" disabled={saving}>{saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />} Create</Button>
        </div>
      </form>
    </div>
  );
}

function SurfManagePage({ moduleId, childId, grandchildId }: ViewProps) {
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const setActive = useAppStore((s) => s.setActive);
  const [rows, setRows] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selected, setSelected] = React.useState<Set<number>>(new Set());

  const load = React.useCallback(() => {
    setLoading(true);
    policyApi.list("surfingPolicies").then((res) => { setRows(res.data ?? []); setLoading(false); });
  }, []);
  React.useEffect(() => { load(); }, [load]);

  const handleDelete = async () => {
    for (const id of selected) await policyApi.delete("surfingPolicies", id);
    toast({ title: "Policies deleted", description: `${selected.size} policy(s) deleted.` });
    setSelected(new Set());
    load();
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Manage Surfing Quota Policy" description="View, and delete surfing quota policies." icon={<ShieldCheck className="h-5 w-5" />} breadcrumb={breadcrumb}
        actions={<Button onClick={() => setActive(moduleId, "surfing-quota", "create")}><Plus className="mr-2 h-4 w-4" /> Create</Button>} />
      {loading ? <PageLoader /> : (
        <SectionCard title="Surfing Quota Policies" description={`${rows.length} policies`}>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader><TableRow>
                <TableHead>Policy Name</TableHead><TableHead>Policy Type</TableHead><TableHead>Time Allowed (HH:mm)</TableHead>
                <TableHead>Expiration Duration (days)</TableHead><TableHead>Session Pulse (minutes)</TableHead><TableHead>Description</TableHead><TableHead>Del</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.policyName}</TableCell>
                    <TableCell><Badge variant="outline" className="text-[10px]">{r.policyType}</Badge></TableCell>
                    <TableCell className="font-mono text-xs">{r.timeAllowed}</TableCell>
                    <TableCell>{r.expirationDuration}</TableCell>
                    <TableCell>{r.sessionPulse}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{r.description || "—"}</TableCell>
                    <TableCell><Checkbox checked={selected.has(r.id)} onCheckedChange={() => { const n = new Set(selected); if (n.has(r.id)) n.delete(r.id); else n.add(r.id); setSelected(n); }} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {selected.size > 0 && <div className="mt-3 flex justify-end"><Button variant="destructive" size="sm" onClick={handleDelete}><Trash2 className="mr-2 h-3.5 w-3.5" /> Delete Policy ({selected.size})</Button></div>}
        </SectionCard>
      )}
    </div>
  );
}

/* ================ ACCESS TIME ================ */

function AccessCreatePage({ moduleId, childId, grandchildId }: ViewProps) {
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const setActive = useAppStore((s) => s.setActive);
  const [saving, setSaving] = React.useState(false);
  const [form, setForm] = React.useState({ policyName: "", defaultStrategy: "Allow", description: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.policyName.trim()) { toast({ title: "Policy name required", variant: "destructive" }); return; }
    setSaving(true);
    await policyApi.create("accessPolicies", { ...form, status: "Active" });
    setSaving(false);
    toast({ title: "Access policy created", description: form.policyName });
    setActive(moduleId, "access-time", "manage");
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Create Access Time Policy" description="Create a new access time policy (PolicyManager servlet)." icon={<ShieldCheck className="h-5 w-5" />} breadcrumb={breadcrumb}
        actions={<Button variant="outline" onClick={() => setActive(moduleId, "access-time", "manage")}><X className="mr-2 h-4 w-4" /> Cancel</Button>} />
      <form onSubmit={handleSubmit}>
        <SectionCard title="Access Time Policy Details" description="Configure access time policy">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Name <span className="text-primary">*</span></Label>
              <Input value={form.policyName} onChange={(e) => setForm({ ...form, policyName: e.target.value })} placeholder="e.g. Business Hours" required />
            </div>
            <div className="space-y-2">
              <Label>Default Strategy <span className="text-primary">*</span></Label>
              <Select value={form.defaultStrategy} onValueChange={(v) => setForm({ ...form, defaultStrategy: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="Allow">Allow</SelectItem><SelectItem value="Deny">Deny</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} placeholder="Policy description…" />
            </div>
          </div>
        </SectionCard>
        <div className="mt-4 flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => setActive(moduleId, "access-time", "manage")}>Cancel</Button>
          <Button type="submit" disabled={saving}>{saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />} Create</Button>
        </div>
      </form>
    </div>
  );
}

function AccessManagePage({ moduleId, childId, grandchildId }: ViewProps) {
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const setActive = useAppStore((s) => s.setActive);
  const [rows, setRows] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selected, setSelected] = React.useState<Set<number>>(new Set());

  const load = React.useCallback(() => { setLoading(true); policyApi.list("accessPolicies").then((res) => { setRows(res.data ?? []); setLoading(false); }); }, []);
  React.useEffect(() => { load(); }, [load]);

  const handleDelete = async () => { for (const id of selected) await policyApi.delete("accessPolicies", id); toast({ title: "Policies deleted" }); setSelected(new Set()); load(); };

  return (
    <div className="space-y-6">
      <PageHeader title="Manage Access Time Policy" description="View and delete access time policies." icon={<ShieldCheck className="h-5 w-5" />} breadcrumb={breadcrumb}
        actions={<Button onClick={() => setActive(moduleId, "access-time", "create")}><Plus className="mr-2 h-4 w-4" /> Create</Button>} />
      {loading ? <PageLoader /> : (
        <SectionCard title="Access Time Policies" description={`${rows.length} policies`}>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader><TableRow><TableHead>Access Time Policy Name</TableHead><TableHead>Default Strategy</TableHead><TableHead>Description</TableHead><TableHead>Del</TableHead></TableRow></TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.policyName}</TableCell>
                    <TableCell><Badge variant={r.defaultStrategy === "Allow" ? "default" : "destructive"} className={r.defaultStrategy === "Allow" ? "bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400" : ""}>{r.defaultStrategy}</Badge></TableCell>
                    <TableCell className="text-xs text-muted-foreground">{r.description || "—"}</TableCell>
                    <TableCell><Checkbox checked={selected.has(r.id)} onCheckedChange={() => { const n = new Set(selected); if (n.has(r.id)) n.delete(r.id); else n.add(r.id); setSelected(n); }} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {selected.size > 0 && <div className="mt-3 flex justify-end"><Button variant="destructive" size="sm" onClick={handleDelete}><Trash2 className="mr-2 h-3.5 w-3.5" /> Delete Policy ({selected.size})</Button></div>}
        </SectionCard>
      )}
    </div>
  );
}

/* ================ BANDWIDTH ================ */

function BwCreatePage({ moduleId, childId, grandchildId }: ViewProps) {
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const setActive = useAppStore((s) => s.setActive);
  const [saving, setSaving] = React.useState(false);
  const [form, setForm] = React.useState({
    policyName: "", polbase: "User", policytype: "Strict", implementationtype: "Individual",
    sttotbandwidth: "1024", stexclupbandwidth: "512", stexcldownbandwidth: "512",
    comtotgrntdbandwidth: "", comtotburstbandwidth: "", comexclgrntdupbandwidth: "",
    selectpriority: "3", scheduleType: "Always",
  });
  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.policyName.trim()) { toast({ title: "Policy name required", variant: "destructive" }); return; }
    setSaving(true);
    await policyApi.create("bandwidthPolicies", {
      policyName: form.policyName, policyBasedOn: form.polbase,
      totalBandwidth: form.sttotbandwidth, uploadBandwidth: form.stexclupbandwidth,
      downloadBandwidth: form.stexcldownbandwidth, priority: Number(form.selectpriority),
      scheduleType: form.scheduleType, status: "Active",
    });
    setSaving(false);
    toast({ title: "Bandwidth policy created", description: form.policyName });
    setActive(moduleId, "bandwidth", "manage");
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Create Bandwidth Policy" description="Create a new bandwidth restriction policy (BandwidthPolicyManager servlet)." icon={<Gauge className="h-5 w-5" />} breadcrumb={breadcrumb}
        actions={<Button variant="outline" onClick={() => setActive(moduleId, "bandwidth", "manage")}><X className="mr-2 h-4 w-4" /> Cancel</Button>} />
      <form onSubmit={handleSubmit} className="space-y-6">
        <SectionCard title="Bandwidth Policy Details" description="Basic policy configuration">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2"><Label>Policy Name <span className="text-primary">*</span></Label><Input value={form.policyName} onChange={(e) => set("policyName", e.target.value)} placeholder="e.g. 10MBPS Plan" required /></div>
            <div className="space-y-2"><Label>Policy For</Label><Select value={form.polbase} onValueChange={(v) => set("polbase", v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="User">User Based</SelectItem><SelectItem value="Pool">Pool Based</SelectItem></SelectContent></Select></div>
            <div className="space-y-2"><Label>Policy Type</Label><Select value={form.policytype} onValueChange={(v) => set("policytype", v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Strict">Strict</SelectItem><SelectItem value="Shared">Shared</SelectItem></SelectContent></Select></div>
            <div className="space-y-2"><Label>Implementation Type</Label><Select value={form.implementationtype} onValueChange={(v) => set("implementationtype", v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Individual">Individual</SelectItem><SelectItem value="Pool">Pool</SelectItem></SelectContent></Select></div>
            <div className="space-y-2"><Label>Priority</Label><Select value={form.selectpriority} onValueChange={(v) => set("selectpriority", v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{[0,1,2,3,4,5,6,7].map((p) => <SelectItem key={p} value={String(p)}>{p}</SelectItem>)}</SelectContent></Select></div>
            <div className="space-y-2"><Label>Schedule Type</Label><Select value={form.scheduleType} onValueChange={(v) => set("scheduleType", v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Always">Always</SelectItem><SelectItem value="All Days 9:00 AM to 21:00 PM">All Days 9:00 AM to 21:00 PM</SelectItem><SelectItem value="All Days 21:00 PM to 9:00 AM">All Days 21:00 PM to 9:00 AM</SelectItem><SelectItem value="Weekend Only">Weekend Only</SelectItem></SelectContent></Select></div>
          </div>
        </SectionCard>
        <SectionCard title="Bandwidth Limits (Kbit/s)" description="Upload, Download and Total bandwidth limits">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2"><Label>Total Bandwidth (Kbit/s)</Label><Input type="number" value={form.sttotbandwidth} onChange={(e) => set("sttotbandwidth", e.target.value)} /></div>
            <div className="space-y-2"><Label>Upload Bandwidth (Kbit/s)</Label><Input type="number" value={form.stexclupbandwidth} onChange={(e) => set("stexclupbandwidth", e.target.value)} /></div>
            <div className="space-y-2"><Label>Download Bandwidth (Kbit/s)</Label><Input type="number" value={form.stexcldownbandwidth} onChange={(e) => set("stexcldownbandwidth", e.target.value)} /></div>
          </div>
        </SectionCard>
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => setActive(moduleId, "bandwidth", "manage")}>Cancel</Button>
          <Button type="submit" disabled={saving}>{saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />} Create</Button>
        </div>
      </form>
    </div>
  );
}

function BwManagePage({ moduleId, childId, grandchildId }: ViewProps) {
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const setActive = useAppStore((s) => s.setActive);
  const [rows, setRows] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selected, setSelected] = React.useState<Set<number>>(new Set());

  const load = React.useCallback(() => { setLoading(true); policyApi.list("bandwidthPolicies").then((res) => { setRows(res.data ?? []); setLoading(false); }); }, []);
  React.useEffect(() => { load(); }, [load]);

  const handleDelete = async () => { for (const id of selected) await policyApi.delete("bandwidthPolicies", id); toast({ title: "Policies deleted" }); setSelected(new Set()); load(); };

  return (
    <div className="space-y-6">
      <PageHeader title="Manage Bandwidth Policy" description="View and delete bandwidth policies." icon={<Gauge className="h-5 w-5" />} breadcrumb={breadcrumb}
        actions={<Button onClick={() => setActive(moduleId, "bandwidth", "create")}><Plus className="mr-2 h-4 w-4" /> Create</Button>} />
      {loading ? <PageLoader /> : (
        <SectionCard title="Bandwidth Policies" description={`${rows.length} policies`}>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader><TableRow>
                <TableHead>Policy Name</TableHead><TableHead>Policy Based on</TableHead>
                <TableHead>Total Bandwidth (Kbit/s)(Min/Max)</TableHead><TableHead>Upload Bandwidth (Kbit/s)(Min/Max)</TableHead>
                <TableHead>Download Bandwidth (Kbit/s)(Min/Max)</TableHead><TableHead>Priority</TableHead><TableHead>Schedule Type</TableHead><TableHead>Del</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.policyName}</TableCell>
                    <TableCell><Badge variant="outline" className="text-[10px]">{r.policyBasedOn}</Badge></TableCell>
                    <TableCell className="font-mono text-xs">{r.totalBandwidth}</TableCell>
                    <TableCell className="font-mono text-xs">{r.uploadBandwidth}</TableCell>
                    <TableCell className="font-mono text-xs">{r.downloadBandwidth}</TableCell>
                    <TableCell>{r.priority}</TableCell>
                    <TableCell className="text-xs">{r.scheduleType}</TableCell>
                    <TableCell><Checkbox checked={selected.has(r.id)} onCheckedChange={() => { const n = new Set(selected); if (n.has(r.id)) n.delete(r.id); else n.add(r.id); setSelected(n); }} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {selected.size > 0 && <div className="mt-3 flex justify-end"><Button variant="destructive" size="sm" onClick={handleDelete}><Trash2 className="mr-2 h-3.5 w-3.5" /> Delete ({selected.size})</Button></div>}
        </SectionCard>
      )}
    </div>
  );
}

function BwSchedulePage({ moduleId, childId, grandchildId }: ViewProps) {
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const [rows, setRows] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [showForm, setShowForm] = React.useState(false);
  const [form, setForm] = React.useState({ scheduleName: "", description: "" });

  const load = React.useCallback(() => { setLoading(true); policyApi.list("schedules").then((res) => { setRows(res.data ?? []); setLoading(false); }); }, []);
  React.useEffect(() => { load(); }, [load]);

  const handleCreate = async () => {
    if (!form.scheduleName.trim()) return;
    await policyApi.create("schedules", form);
    toast({ title: "Schedule created", description: form.scheduleName });
    setForm({ scheduleName: "", description: "" }); setShowForm(false); load();
  };
  const handleDelete = async (r: any) => { await policyApi.delete("schedules", r.id); toast({ title: "Schedule deleted", description: r.scheduleName }); load(); };

  return (
    <div className="space-y-6">
      <PageHeader title="Manage Schedule" description="Create and manage bandwidth schedules (ScheduleManager servlet)." icon={<Clock className="h-5 w-5" />} breadcrumb={breadcrumb} />
      <ActionBar>
        <Button size="sm" onClick={() => setShowForm(!showForm)}><Plus className="mr-2 h-3.5 w-3.5" /> {showForm ? "Cancel" : "Create Schedule"}</Button>
      </ActionBar>
      {showForm && (
        <SectionCard title="Create Schedule" description="Define a new bandwidth schedule">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2"><Label>Schedule Name <span className="text-primary">*</span></Label><Input value={form.scheduleName} onChange={(e) => setForm({ ...form, scheduleName: e.target.value })} placeholder="e.g. All Days 9:00 AM to 21:00 PM" /></div>
            <div className="space-y-2"><Label>Description</Label><Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Schedule description" /></div>
          </div>
          <div className="mt-4 flex justify-end"><Button onClick={handleCreate}><Save className="mr-2 h-4 w-4" /> Create</Button></div>
        </SectionCard>
      )}
      {loading ? <PageLoader /> : (
        <SectionCard title="Schedules" description={`${rows.length} schedules`}>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader><TableRow><TableHead>Schedule Name</TableHead><TableHead>Description</TableHead><TableHead>Del</TableHead></TableRow></TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.scheduleName}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{r.description || "—"}</TableCell>
                    <TableCell><Button variant="ghost" size="sm" className="text-primary" onClick={() => handleDelete(r)}><Trash2 className="h-3.5 w-3.5" /></Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </SectionCard>
      )}
    </div>
  );
}

/* ================ DATA TRANSFER ================ */

function DtCreatePage({ moduleId, childId, grandchildId }: ViewProps) {
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const setActive = useAppStore((s) => s.setActive);
  const [saving, setSaving] = React.useState(false);
  const [form, setForm] = React.useState({
    policyName: "", scheme: "Absolute", restriction: "Both", cycletype: "Monthly",
    cycletotallimit: "", cycleuploadlimit: "", chk_cycleuploadlimit: false,
    cycledownloadlimit: "", chk_cycledownloadlimit: false,
    uploadlimit: "", chk_uploadlimit: false, downloadlimit: "", chk_downloadlimit: false,
    description: "",
  });
  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.policyName.trim()) { toast({ title: "Policy name required", variant: "destructive" }); return; }
    setSaving(true);
    await policyApi.create("dataTransferPolicies", {
      policyName: form.policyName, scheme: form.scheme,
      uploadLimit: form.chk_uploadlimit ? "Unlimited" : `${form.uploadlimit} MB`,
      downloadLimit: form.chk_downloadlimit ? "Unlimited" : `${form.downloadlimit} MB`,
      totalLimit: form.cycletotallimit ? `${form.cycletotallimit} MB` : "Unlimited",
      description: form.description, status: "Active",
    });
    setSaving(false);
    toast({ title: "Data transfer policy created", description: form.policyName });
    setActive(moduleId, "data-transfer", "manage");
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Create Data Transfer Policy" description="Create a new data transfer policy (DataTransferPolicyManager servlet)." icon={<Database className="h-5 w-5" />} breadcrumb={breadcrumb}
        actions={<Button variant="outline" onClick={() => setActive(moduleId, "data-transfer", "manage")}><X className="mr-2 h-4 w-4" /> Cancel</Button>} />
      <form onSubmit={handleSubmit} className="space-y-6">
        <SectionCard title="Data Transfer Policy Details" description="Basic policy configuration">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2"><Label>Policy Name <span className="text-primary">*</span></Label><Input value={form.policyName} onChange={(e) => set("policyName", e.target.value)} placeholder="e.g. 100MB Policy" required /></div>
            <div className="space-y-2"><Label>Scheme <span className="text-primary">*</span></Label><Select value={form.scheme} onValueChange={(v) => set("scheme", v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Absolute">Absolute</SelectItem><SelectItem value="Ratebased">Rate based</SelectItem></SelectContent></Select></div>
            <div className="space-y-2"><Label>Restriction</Label><Select value={form.restriction} onValueChange={(v) => set("restriction", v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Both">Both (Upload + Download)</SelectItem><SelectItem value="Upload">Upload Only</SelectItem><SelectItem value="Download">Download Only</SelectItem></SelectContent></Select></div>
            <div className="space-y-2"><Label>Cycle Type <span className="text-primary">*</span></Label><Select value={form.cycletype} onValueChange={(v) => set("cycletype", v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Daily">Daily</SelectItem><SelectItem value="Weekly">Weekly</SelectItem><SelectItem value="Monthly">Monthly</SelectItem><SelectItem value="Never">Never</SelectItem></SelectContent></Select></div>
          </div>
        </SectionCard>
        <SectionCard title="Cycle Limits" description="Data transfer limits per cycle">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2"><Label>Cycle Total Data Limit (MB) <span className="text-primary">*</span></Label><Input type="number" value={form.cycletotallimit} onChange={(e) => set("cycletotallimit", e.target.value)} placeholder="100" /></div>
            <div className="space-y-2"><Label>Cycle Upload Data Limit (MB)</Label><Input type="number" value={form.cycleuploadlimit} onChange={(e) => set("cycleuploadlimit", e.target.value)} disabled={form.chk_cycleuploadlimit} /></div>
            <div className="flex items-center gap-3"><Switch checked={form.chk_cycleuploadlimit} onCheckedChange={(v) => set("chk_cycleuploadlimit", v)} /><Label>Unlimited Cycle Upload</Label></div>
            <div className="space-y-2"><Label>Cycle Download Data Limit (MB)</Label><Input type="number" value={form.cycledownloadlimit} onChange={(e) => set("cycledownloadlimit", e.target.value)} disabled={form.chk_cycledownloadlimit} /></div>
            <div className="flex items-center gap-3"><Switch checked={form.chk_cycledownloadlimit} onCheckedChange={(v) => set("chk_cycledownloadlimit", v)} /><Label>Unlimited Cycle Download</Label></div>
          </div>
        </SectionCard>
        <SectionCard title="Restriction Details" description="Upload and download limits">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2"><Label>Upload Limit (MB)</Label><Input type="number" value={form.uploadlimit} onChange={(e) => set("uploadlimit", e.target.value)} disabled={form.chk_uploadlimit} /></div>
            <div className="flex items-center gap-3"><Switch checked={form.chk_uploadlimit} onCheckedChange={(v) => set("chk_uploadlimit", v)} /><Label>Unlimited Upload</Label></div>
            <div className="space-y-2"><Label>Download Limit (MB)</Label><Input type="number" value={form.downloadlimit} onChange={(e) => set("downloadlimit", e.target.value)} disabled={form.chk_downloadlimit} /></div>
            <div className="flex items-center gap-3"><Switch checked={form.chk_downloadlimit} onCheckedChange={(v) => set("chk_downloadlimit", v)} /><Label>Unlimited Download</Label></div>
            <div className="space-y-2 md:col-span-2"><Label>Description</Label><Textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={2} placeholder="Policy description…" /></div>
          </div>
        </SectionCard>
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => setActive(moduleId, "data-transfer", "manage")}>Cancel</Button>
          <Button type="submit" disabled={saving}>{saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />} Create</Button>
        </div>
      </form>
    </div>
  );
}

function DtManagePage({ moduleId, childId, grandchildId }: ViewProps) {
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const setActive = useAppStore((s) => s.setActive);
  const [rows, setRows] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selected, setSelected] = React.useState<Set<number>>(new Set());

  const load = React.useCallback(() => { setLoading(true); policyApi.list("dataTransferPolicies").then((res) => { setRows(res.data ?? []); setLoading(false); }); }, []);
  React.useEffect(() => { load(); }, [load]);

  const handleDelete = async () => { for (const id of selected) await policyApi.delete("dataTransferPolicies", id); toast({ title: "Policies deleted" }); setSelected(new Set()); load(); };

  return (
    <div className="space-y-6">
      <PageHeader title="Manage Data Transfer Policy" description="View and delete data transfer policies." icon={<Database className="h-5 w-5" />} breadcrumb={breadcrumb}
        actions={<Button onClick={() => setActive(moduleId, "data-transfer", "create")}><Plus className="mr-2 h-4 w-4" /> Create</Button>} />
      {loading ? <PageLoader /> : (
        <SectionCard title="Data Transfer Policies" description={`${rows.length} policies`}>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader><TableRow><TableHead>Policy Name</TableHead><TableHead>Scheme</TableHead><TableHead>Upload Limit</TableHead><TableHead>Download Limit</TableHead><TableHead>Total Limit</TableHead><TableHead>Description</TableHead><TableHead>Del</TableHead></TableRow></TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.policyName}</TableCell>
                    <TableCell><Badge variant="outline" className="text-[10px]">{r.scheme}</Badge></TableCell>
                    <TableCell className="font-mono text-xs">{r.uploadLimit}</TableCell>
                    <TableCell className="font-mono text-xs">{r.downloadLimit}</TableCell>
                    <TableCell className="font-mono text-xs">{r.totalLimit}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{r.description || "—"}</TableCell>
                    <TableCell><Checkbox checked={selected.has(r.id)} onCheckedChange={() => { const n = new Set(selected); if (n.has(r.id)) n.delete(r.id); else n.add(r.id); setSelected(n); }} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {selected.size > 0 && <div className="mt-3 flex justify-end"><Button variant="destructive" size="sm" onClick={handleDelete}><Trash2 className="mr-2 h-3.5 w-3.5" /> Delete ({selected.size})</Button></div>}
        </SectionCard>
      )}
    </div>
  );
}

/* ================ FAP (Fair Access Policy) ================ */

function FapCreatePage({ moduleId, childId, grandchildId }: ViewProps) {
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const setActive = useAppStore((s) => s.setActive);
  const [saving, setSaving] = React.useState(false);
  const [form, setForm] = React.useState({
    fapName: "", fapType: "Time", cycletype: "Monthly", multiplier: "1",
    hours: "00", minutes: "00", seconds: "00",
    dataTransferType: "Total", dataTransferLimit: "", limittype: "GB",
    switchoverbwpolicyid: "512KBPS",
  });
  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fapName.trim()) { toast({ title: "FAP name required", variant: "destructive" }); return; }
    setSaving(true);
    await policyApi.create("fapDetails", {
      fapName: form.fapName, resetType: form.fapType === "Time" ? form.cycletype : "Data",
      resetCycleMultiplier: form.multiplier, dataTransferType: form.dataTransferType,
      dataTransferLimit: `${form.dataTransferLimit} ${form.limittype}`,
      switchoverBwPolicy: form.switchoverbwpolicyid,
      resetTime: `${form.hours}:${form.minutes}:${form.seconds}`, status: "Active",
    });
    setSaving(false);
    toast({ title: "FAP created", description: form.fapName });
    setActive(moduleId, "fap", "manage-fap");
  };

  const bwPolicies = ["Select Here", "User based Strict Individual Policy", "Default", "512KBPS", "20MBPS", "15MBPS", "10MBPS", "256KBPS", "128KBPS"];

  return (
    <div className="space-y-6">
      <PageHeader title="Create FAP Details" description="Create a new Fair Access Policy (FAPDetailsManager servlet)." icon={<ShieldCheck className="h-5 w-5" />} breadcrumb={breadcrumb}
        actions={<Button variant="outline" onClick={() => setActive(moduleId, "fap", "manage-fap")}><X className="mr-2 h-4 w-4" /> Cancel</Button>} />
      <form onSubmit={handleSubmit} className="space-y-6">
        <SectionCard title="Create FAP Details" description="FAP configuration">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2"><Label>FAP Name <span className="text-primary">*</span></Label><Input value={form.fapName} onChange={(e) => set("fapName", e.target.value)} placeholder="e.g. Default FAP" required /></div>
            <div className="space-y-2"><Label>FAP Type <span className="text-primary">*</span></Label><Select value={form.fapType} onValueChange={(v) => set("fapType", v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Time">Time Based</SelectItem><SelectItem value="Data">Data Based</SelectItem></SelectContent></Select></div>
            <div className="space-y-2"><Label>Reset Cycle Multiplier <span className="text-primary">*</span></Label><Input type="number" min="1" value={form.multiplier} onChange={(e) => set("multiplier", e.target.value)} /></div>
            <div className="space-y-2"><Label>Cycle Type</Label><Select value={form.cycletype} onValueChange={(v) => set("cycletype", v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Daily">Daily</SelectItem><SelectItem value="Weekly">Weekly</SelectItem><SelectItem value="Monthly">Monthly</SelectItem></SelectContent></Select></div>
          </div>
        </SectionCard>
        <SectionCard title="Reset Time" description="When the FAP counter resets">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2"><Label>Hours</Label><Select value={form.hours} onValueChange={(v) => set("hours", v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{Array.from({ length: 24 }, (_, i) => <SelectItem key={i} value={String(i).padStart(2, "0")}>{String(i).padStart(2, "0")}</SelectItem>)}</SelectContent></Select></div>
            <div className="space-y-2"><Label>Minutes</Label><Select value={form.minutes} onValueChange={(v) => set("minutes", v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{Array.from({ length: 60 }, (_, i) => <SelectItem key={i} value={String(i).padStart(2, "0")}>{String(i).padStart(2, "0")}</SelectItem>)}</SelectContent></Select></div>
            <div className="space-y-2"><Label>Seconds</Label><Select value={form.seconds} onValueChange={(v) => set("seconds", v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{Array.from({ length: 60 }, (_, i) => <SelectItem key={i} value={String(i).padStart(2, "0")}>{String(i).padStart(2, "0")}</SelectItem>)}</SelectContent></Select></div>
          </div>
        </SectionCard>
        <SectionCard title="Data Transfer Limit" description="When data transfer exceeds this limit, switch to lower bandwidth">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2"><Label>Data Transfer Type</Label><Select value={form.dataTransferType} onValueChange={(v) => set("dataTransferType", v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Total">Total</SelectItem><SelectItem value="Upload">Upload</SelectItem><SelectItem value="Download">Download</SelectItem></SelectContent></Select></div>
            <div className="space-y-2"><Label>Data Transfer Limit <span className="text-primary">*</span></Label><Input type="number" value={form.dataTransferLimit} onChange={(e) => set("dataTransferLimit", e.target.value)} placeholder="100" required /></div>
            <div className="space-y-2"><Label>Limit Type</Label><Select value={form.limittype} onValueChange={(v) => set("limittype", v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="MB">MB</SelectItem><SelectItem value="GB">GB</SelectItem><SelectItem value="TB">TB</SelectItem></SelectContent></Select></div>
          </div>
        </SectionCard>
        <SectionCard title="Switch Over Bandwidth Policy" description="The bandwidth policy applied when FAP limit is reached">
          <div className="space-y-2">
            <Label>Switch Over Bandwidth Policy <span className="text-primary">*</span></Label>
            <Select value={form.switchoverbwpolicyid} onValueChange={(v) => set("switchoverbwpolicyid", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{bwPolicies.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </SectionCard>
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => setActive(moduleId, "fap", "manage-fap")}>Cancel</Button>
          <Button type="submit" disabled={saving}>{saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />} Create</Button>
        </div>
      </form>
    </div>
  );
}

function FapManagePage({ moduleId, childId, grandchildId }: ViewProps) {
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const setActive = useAppStore((s) => s.setActive);
  const [rows, setRows] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selected, setSelected] = React.useState<Set<number>>(new Set());

  const load = React.useCallback(() => { setLoading(true); policyApi.list("fapDetails").then((res) => { setRows(res.data ?? []); setLoading(false); }); }, []);
  React.useEffect(() => { load(); }, [load]);

  const handleDelete = async () => { for (const id of selected) await policyApi.delete("fapDetails", id); toast({ title: "FAP deleted" }); setSelected(new Set()); load(); };

  return (
    <div className="space-y-6">
      <PageHeader title="Manage FAP Details" description="View and delete Fair Access Policy details." icon={<ShieldCheck className="h-5 w-5" />} breadcrumb={breadcrumb}
        actions={<Button onClick={() => setActive(moduleId, "fap", "create-fap")}><Plus className="mr-2 h-4 w-4" /> Create FAP</Button>} />
      {loading ? <PageLoader /> : (
        <SectionCard title="FAP Details" description={`${rows.length} entries`}>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader><TableRow>
                <TableHead>FAP Name</TableHead><TableHead>Reset Type</TableHead><TableHead>Reset Cycle Multiplier</TableHead>
                <TableHead>Data Transfer Type</TableHead><TableHead>Data Transfer Limit</TableHead><TableHead>Switch Over Bandwidth Policy</TableHead>
                <TableHead>Reset Time (HH:MM:SS)</TableHead><TableHead>Del</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.fapName}</TableCell>
                    <TableCell><Badge variant="outline" className="text-[10px]">{r.resetType}</Badge></TableCell>
                    <TableCell>{r.resetCycleMultiplier}</TableCell>
                    <TableCell className="text-xs">{r.dataTransferType}</TableCell>
                    <TableCell className="font-mono text-xs">{r.dataTransferLimit}</TableCell>
                    <TableCell className="text-xs">{r.switchoverBwPolicy}</TableCell>
                    <TableCell className="font-mono text-xs">{r.resetTime}</TableCell>
                    <TableCell><Checkbox checked={selected.has(r.id)} onCheckedChange={() => { const n = new Set(selected); if (n.has(r.id)) n.delete(r.id); else n.add(r.id); setSelected(n); }} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {selected.size > 0 && <div className="mt-3 flex justify-end"><Button variant="destructive" size="sm" onClick={handleDelete}><Trash2 className="mr-2 h-3.5 w-3.5" /> Delete ({selected.size})</Button></div>}
        </SectionCard>
      )}
    </div>
  );
}

/* ================ QoS POLICY ================ */

function QosCreatePage({ moduleId, childId, grandchildId }: ViewProps) {
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const [saving, setSaving] = React.useState(false);
  const [form, setForm] = React.useState({ policyName: "", cacheType: "Enable", description: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.policyName.trim()) { toast({ title: "Policy name required", variant: "destructive" }); return; }
    setSaving(true);
    await policyApi.create("qosPolicies", { ...form, status: "Active" });
    setSaving(false);
    toast({ title: "Cache policy created", description: form.policyName });
    setForm({ policyName: "", cacheType: "Enable", description: "" });
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Create Cache Policy" description="Create a new QoS cache policy." icon={<Zap className="h-5 w-5" />} breadcrumb={breadcrumb} />
      <form onSubmit={handleSubmit}>
        <SectionCard title="Cache Policy Details">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2"><Label>Policy Name <span className="text-primary">*</span></Label><Input value={form.policyName} onChange={(e) => setForm({ ...form, policyName: e.target.value })} required /></div>
            <div className="space-y-2"><Label>Cache Type</Label><Select value={form.cacheType} onValueChange={(v) => setForm({ ...form, cacheType: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Enable">Enable</SelectItem><SelectItem value="Disable">Disable</SelectItem></SelectContent></Select></div>
            <div className="space-y-2 md:col-span-2"><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} /></div>
          </div>
        </SectionCard>
        <div className="mt-4 flex justify-end"><Button type="submit" disabled={saving}>{saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />} Create</Button></div>
      </form>
    </div>
  );
}

function QosManagePage({ moduleId, childId, grandchildId }: ViewProps) {
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const [rows, setRows] = React.useState<any[]>([
    { id: 1, policyName: "Default Cache", cacheType: "Enable", description: "Default caching policy", status: "Active" },
    { id: 2, policyName: "No Cache", cacheType: "Disable", description: "Caching disabled", status: "Active" },
  ]);

  const handleDelete = (r: any) => { setRows(rows.filter((x) => x.id !== r.id)); toast({ title: "Policy deleted", description: r.policyName }); };

  return (
    <div className="space-y-6">
      <PageHeader title="Manage Cache Policy" description="View and delete QoS cache policies." icon={<Zap className="h-5 w-5" />} breadcrumb={breadcrumb} />
      <SectionCard title="Cache Policies" description={`${rows.length} policies`}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader><TableRow><TableHead>Policy Name</TableHead><TableHead>Cache Type</TableHead><TableHead>Description</TableHead><TableHead className="text-right">Delete</TableHead></TableRow></TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.policyName}</TableCell>
                  <TableCell><Badge variant={r.cacheType === "Enable" ? "default" : "secondary"} className={r.cacheType === "Enable" ? "bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400" : ""}>{r.cacheType}</Badge></TableCell>
                  <TableCell className="text-xs text-muted-foreground">{r.description || "—"}</TableCell>
                  <TableCell className="text-right"><Button variant="ghost" size="sm" className="text-primary" onClick={() => handleDelete(r)}><Trash2 className="h-3.5 w-3.5" /></Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>
    </div>
  );
}
