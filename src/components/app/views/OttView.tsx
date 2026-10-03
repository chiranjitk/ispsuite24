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
import {
  Tv,
  KeyRound,
  Link2,
  Layers,
  Plug,
  Plus,
  Settings2,
  RefreshCw,
  Trash2,
} from "lucide-react";
import {
  OTT_PLATFORMS,
  OTT_UTILITIES,
  OTT_PLATFORM_UTILITY_RELATIONS,
  OTT_PARTNER_KEYS,
  OTT_BINDINGS,
} from "@/lib/mock-data";

export function OttView({ moduleId, childId }: ViewProps) {
  const { mod } = useModuleHeader(moduleId, childId);
  if (!mod) return null;

  if (!childId) return <OttOverview moduleId={moduleId} />;
  switch (childId) {
    case "platforms":
      return <Platforms moduleId={moduleId} childId={childId} />;
    case "platform-utility":
      return <PlatformUtility moduleId={moduleId} childId={childId} />;
    case "platform-utility-relation":
      return <PlatformUtilityRelation moduleId={moduleId} childId={childId} />;
    case "partner-key":
      return <PartnerKey moduleId={moduleId} childId={childId} />;
    case "bind-ott":
      return <BindOtt moduleId={moduleId} childId={childId} />;
    default:
      return <OttOverview moduleId={moduleId} />;
  }
}

/* ---------------- Overview ---------------- */

function OttOverview({ moduleId }: { moduleId: string }) {
  const { mod } = useModuleHeader(moduleId);
  const setActive = useAppStore((s) => s.setActive);
  if (!mod) return null;
  const cards = [
    { label: "Platforms", desc: `${OTT_PLATFORMS.length} OTT platforms`, icon: Tv, child: "platforms" },
    { label: "Platform Utility", desc: `${OTT_UTILITIES.length} utilities`, icon: Layers, child: "platform-utility" },
    { label: "Platform Utility Relation", desc: `${OTT_PLATFORM_UTILITY_RELATIONS.length} mappings`, icon: Link2, child: "platform-utility-relation" },
    { label: "Add Partner Key", desc: `${OTT_PARTNER_KEYS.length} keys`, icon: KeyRound, child: "partner-key" },
    { label: "Bind OTT Name", desc: `${OTT_BINDINGS.length} bindings`, icon: Plug, child: "bind-ott" },
  ];
  return (
    <div className="space-y-6">
      <PageHeader
        title={mod.label}
        description={mod.desc}
        icon={<mod.icon className="h-5 w-5" />}
      />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <KpiCard
          label="Platforms Integrated"
          value={String(OTT_PLATFORMS.filter((p) => p.status === "Active").length)}
          icon={<Tv className="h-4 w-4" />}
          accent
        />
        <KpiCard
          label="Active Bindings"
          value={String(OTT_BINDINGS.filter((b) => b.status === "Active").length)}
          icon={<Plug className="h-4 w-4" />}
        />
        <KpiCard
          label="Partner Keys"
          value={String(OTT_PARTNER_KEYS.length)}
          icon={<KeyRound className="h-4 w-4" />}
        />
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

/* ---------------- Platforms ---------------- */

function Platforms({ moduleId, childId }: ViewProps) {
  const { toast } = useToast();
  return (
    <div className="space-y-6">
      <ChildHeader moduleId={moduleId} childId={childId} />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard label="Total Platforms" value={String(OTT_PLATFORMS.length)} icon={<Tv className="h-4 w-4" />} accent />
        <KpiCard label="Active" value={String(OTT_PLATFORMS.filter((p) => p.status === "Active").length)} icon={<Plug className="h-4 w-4" />} />
        <KpiCard label="Total Subscribers" value={OTT_PLATFORMS.reduce((s, p) => s + p.activeSubscribers, 0).toLocaleString()} icon={<Tv className="h-4 w-4" />} />
        <KpiCard label="Categories" value={String(new Set(OTT_PLATFORMS.map((p) => p.category)).size)} icon={<Layers className="h-4 w-4" />} />
      </div>
      <SectionCard
        title="OTT Platforms"
        description={`${OTT_PLATFORMS.length} platforms integrated`}
        actions={
          <Button size="sm" onClick={() => toast({ title: "Add platform", description: "Platform onboarding form will open." })}>
            <Plus className="mr-1.5 h-3.5 w-3.5" /> Add Platform
          </Button>
        }
      >
        <div className="overflow-x-auto scrollbar-thin">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Platform</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Partner</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Active Subscribers</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {OTT_PLATFORMS.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium text-primary">{p.name}</TableCell>
                  <TableCell className="text-muted-foreground">{p.category}</TableCell>
                  <TableCell className="text-muted-foreground">{p.partner}</TableCell>
                  <TableCell>
                    <Badge
                      variant={p.status === "Active" ? "default" : "secondary"}
                      className={
                        p.status === "Active"
                          ? "bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400"
                          : "bg-muted text-muted-foreground hover:bg-muted"
                      }
                    >
                      {p.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{p.activeSubscribers.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toast({ title: "Configure platform", description: `Opening ${p.name} configuration.` })}
                    >
                      <Settings2 className="mr-1.5 h-3.5 w-3.5" /> Configure
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

/* ---------------- Platform Utility ---------------- */

function PlatformUtility({ moduleId, childId }: ViewProps) {
  const { toast } = useToast();
  return (
    <div className="space-y-6">
      <ChildHeader moduleId={moduleId} childId={childId} />
      <SectionCard
        title="Platform Utilities"
        description={`${OTT_UTILITIES.length} utilities`}
        actions={
          <Button size="sm" onClick={() => toast({ title: "Add utility", description: "Utility creation form will open." })}>
            <Plus className="mr-1.5 h-3.5 w-3.5" /> Add Utility
          </Button>
        }
      >
        <div className="overflow-x-auto scrollbar-thin">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Utility</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {OTT_UTILITIES.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px]">{u.type}</Badge>
                  </TableCell>
                  <TableCell className="max-w-[360px] text-muted-foreground">{u.description}</TableCell>
                  <TableCell>
                    <Badge
                      variant={u.status === "Active" ? "default" : "secondary"}
                      className={
                        u.status === "Active"
                          ? "bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400"
                          : "bg-muted text-muted-foreground hover:bg-muted"
                      }
                    >
                      {u.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => toast({ title: "Edit utility", description: u.name })}>
                      Edit
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

/* ---------------- Platform Utility Relation ---------------- */

function PlatformUtilityRelation({ moduleId, childId }: ViewProps) {
  const { toast } = useToast();
  return (
    <div className="space-y-6">
      <ChildHeader moduleId={moduleId} childId={childId} />
      <SectionCard
        title="Platform → Utility Relations"
        description={`${OTT_PLATFORM_UTILITY_RELATIONS.length} mappings`}
        actions={
          <Button size="sm" onClick={() => toast({ title: "Add relation", description: "Map a platform to a utility." })}>
            <Link2 className="mr-1.5 h-3.5 w-3.5" /> Add Relation
          </Button>
        }
      >
        <div className="overflow-x-auto scrollbar-thin">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Platform</TableHead>
                <TableHead>Utility</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {OTT_PLATFORM_UTILITY_RELATIONS.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium text-primary">{r.platform}</TableCell>
                  <TableCell className="text-muted-foreground">{r.utility}</TableCell>
                  <TableCell>
                    <Badge
                      variant={r.status === "Active" ? "default" : "secondary"}
                      className={
                        r.status === "Active"
                          ? "bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400"
                          : "bg-muted text-muted-foreground hover:bg-muted"
                      }
                    >
                      {r.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => toast({ title: "Edit relation", description: `${r.platform} → ${r.utility}` })}>
                      Edit
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

/* ---------------- Partner Key ---------------- */

function PartnerKey({ moduleId, childId }: ViewProps) {
  const { toast } = useToast();
  const [partner, setPartner] = React.useState("");
  const [apiKey, setApiKey] = React.useState("");
  const [secret, setSecret] = React.useState("");

  const submit = () => {
    if (!partner || !apiKey || !secret) {
      toast({ title: "Missing fields", description: "All fields are required.", variant: "destructive" });
      return;
    }
    toast({ title: "Partner key added", description: `Key stored for ${partner}.` });
    setPartner("");
    setApiKey("");
    setSecret("");
  };

  return (
    <div className="space-y-6">
      <ChildHeader moduleId={moduleId} childId={childId} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <SectionCard title="Add Partner Key" description="Store API credentials for an OTT partner" className="lg:col-span-2">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="partner">Partner</Label>
              <Select value={partner} onValueChange={setPartner}>
                <SelectTrigger id="partner">
                  <SelectValue placeholder="Select partner" />
                </SelectTrigger>
                <SelectContent>
                  {OTT_PLATFORMS.map((p) => (
                    <SelectItem key={p.id} value={p.partner}>{p.partner}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="api-key">API Key</Label>
              <Input id="api-key" placeholder="Enter API key" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="secret">Secret</Label>
              <Input id="secret" type="password" placeholder="Enter secret" value={secret} onChange={(e) => setSecret(e.target.value)} />
            </div>
            <Button className="w-full" onClick={submit}>
              <Plus className="mr-1.5 h-4 w-4" /> Add Key
            </Button>
          </div>
        </SectionCard>

        <SectionCard
          title="Partner Keys"
          description={`${OTT_PARTNER_KEYS.length} keys stored`}
          className="lg:col-span-3"
          actions={
            <Button variant="outline" size="sm" onClick={() => toast({ title: "Refreshed", description: "Keys reloaded." })}>
              <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Refresh
            </Button>
          }
        >
          <div className="overflow-x-auto scrollbar-thin">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Partner</TableHead>
                  <TableHead>API Key</TableHead>
                  <TableHead>Secret</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {OTT_PARTNER_KEYS.map((k) => (
                  <TableRow key={k.id}>
                    <TableCell className="font-medium">{k.partner}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{k.apiKeyMasked}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{k.secretMasked}</TableCell>
                    <TableCell>
                      <Badge
                        variant={k.status === "Active" ? "default" : "secondary"}
                        className={
                          k.status === "Active"
                            ? "bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400"
                            : "bg-muted text-muted-foreground hover:bg-muted"
                        }
                      >
                        {k.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{k.created}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toast({ title: "Revoke key", description: `Key for ${k.partner} will be revoked.`, variant: "destructive" })}
                      >
                        <Trash2 className="mr-1 h-3.5 w-3.5" /> Revoke
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

/* ---------------- Bind OTT ---------------- */

function BindOtt({ moduleId, childId }: ViewProps) {
  const { toast } = useToast();
  const [platform, setPlatform] = React.useState("");
  const [internal, setInternal] = React.useState("");
  const [display, setDisplay] = React.useState("");

  const bind = () => {
    if (!platform || !internal || !display) {
      toast({ title: "Missing fields", description: "All fields are required.", variant: "destructive" });
      return;
    }
    toast({ title: "OTT bound", description: `${display} bound to ${platform}.` });
    setPlatform("");
    setInternal("");
    setDisplay("");
  };

  return (
    <div className="space-y-6">
      <ChildHeader moduleId={moduleId} childId={childId} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <SectionCard title="Bind OTT Name" description="Map an OTT platform to an internal name & display label" className="lg:col-span-2">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="b-platform">OTT Platform</Label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger id="b-platform">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  {OTT_PLATFORMS.map((p) => (
                    <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="b-internal">Internal Name</Label>
              <Input id="b-internal" placeholder="e.g. nf_primary" value={internal} onChange={(e) => setInternal(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="b-display">Display Name</Label>
              <Input id="b-display" placeholder="e.g. Netflix — Primary Bundle" value={display} onChange={(e) => setDisplay(e.target.value)} />
            </div>
            <Button className="w-full" onClick={bind}>
              <Link2 className="mr-1.5 h-4 w-4" /> Bind
            </Button>
          </div>
        </SectionCard>

        <SectionCard title="Existing Bindings" description={`${OTT_BINDINGS.length} bindings`} className="lg:col-span-3">
          <div className="overflow-x-auto scrollbar-thin">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Platform</TableHead>
                  <TableHead>Internal Name</TableHead>
                  <TableHead>Display Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {OTT_BINDINGS.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell className="font-medium text-primary">{b.platform}</TableCell>
                    <TableCell className="font-mono text-xs">{b.internalName}</TableCell>
                    <TableCell className="text-muted-foreground">{b.displayName}</TableCell>
                    <TableCell>
                      <Badge
                        variant={b.status === "Active" ? "default" : "secondary"}
                        className={
                          b.status === "Active"
                            ? "bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400"
                            : "bg-muted text-muted-foreground hover:bg-muted"
                        }
                      >
                        {b.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => toast({ title: "Unbind", description: `Binding ${b.internalName} removed.`, variant: "destructive" })}>
                        <Trash2 className="mr-1 h-3.5 w-3.5" /> Unbind
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
