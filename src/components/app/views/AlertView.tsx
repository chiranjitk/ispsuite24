"use client";

import * as React from "react";
import { ViewProps, useModuleHeader } from "./_shared";
import {
  PageHeader,
  KpiCard,
  SectionCard,
  EmptyState,
  InfoRow,
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  BellRing,
  MessageSquare,
  Mail,
  Send,
  Trash2,
  Plus,
  Pencil,
  CheckCircle2,
  XCircle,
  Percent,
  ShieldCheck,
  Server,
} from "lucide-react";
import { SMS_LOGS, ALERT_RULES, EMAIL_TEMPLATES, type SmsLog, type AlertRule } from "@/lib/mock-data";

export function AlertView({ moduleId, childId }: ViewProps) {
  const { mod } = useModuleHeader(moduleId, childId);
  if (!mod) return null;

  if (!childId) return <AlertOverview moduleId={moduleId} />;
  switch (childId) {
    case "sms-gateway":
      return <SmsGateway moduleId={moduleId} childId={childId} />;
    case "email":
      return <EmailManagement moduleId={moduleId} childId={childId} />;
    case "alert-config":
      return <AlertConfig moduleId={moduleId} childId={childId} />;
    default:
      return <AlertOverview moduleId={moduleId} />;
  }
}

/* ---------------- Overview ---------------- */

function AlertOverview({ moduleId }: { moduleId: string }) {
  const { mod } = useModuleHeader(moduleId);
  const setActive = useAppStore((s) => s.setActive);
  if (!mod) return null;

  const smsSentToday = SMS_LOGS.filter((s) => s.status === "Sent").length;
  const activeRules = ALERT_RULES.filter((r) => r.enabled).length;

  const cards = [
    { label: "SMS Gateway", desc: `${SMS_LOGS.length} logs · bulk SMS`, icon: MessageSquare, child: "sms-gateway" },
    { label: "Email Management", desc: "SMTP config & templates", icon: Mail, child: "email" },
    { label: "Alert Configuration", desc: `${activeRules} active rules`, icon: ShieldCheck, child: "alert-config" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={mod.label}
        description={mod.desc}
        icon={<mod.icon className="h-5 w-5" />}
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <KpiCard label="SMS Sent Today" value={String(smsSentToday)} icon={<MessageSquare className="h-4 w-4" />} accent />
        <KpiCard label="Emails Sent" value="142" icon={<Mail className="h-4 w-4" />} />
        <KpiCard label="Active Rules" value={String(activeRules)} icon={<ShieldCheck className="h-4 w-4" />} />
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

/* ---------------- SMS Gateway ---------------- */

const SMS_STATUS_BADGE: Record<SmsLog["status"], string> = {
  Sent: "bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400",
  Failed: "bg-primary/10 text-primary hover:bg-primary/10",
  Queued: "bg-amber-500/10 text-amber-700 hover:bg-amber-500/10 dark:text-amber-400",
};

const SMS_TEMPLATES = ["Renewal", "Due Reminder", "OTP", "Outage", "Welcome", "Suspension"];

function SmsGateway({ moduleId, childId }: ViewProps) {
  const { mod, child } = useModuleHeader(moduleId, childId);
  const { toast } = useToast();
  const [template, setTemplate] = React.useState("");
  const [recipient, setRecipient] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [purgeFrom, setPurgeFrom] = React.useState("");
  const [purgeTo, setPurgeTo] = React.useState("");
  if (!mod) return null;

  const sentToday = SMS_LOGS.filter((s) => s.status === "Sent").length;
  const failed = SMS_LOGS.filter((s) => s.status === "Failed").length;
  const deliveryRate = Math.round((sentToday / SMS_LOGS.length) * 100);

  const sendBulk = () => {
    if (!recipient || !message) {
      toast({ title: "Missing fields", description: "Recipient and message are required.", variant: "destructive" });
      return;
    }
    toast({ title: "Bulk SMS queued", description: `Message will be sent to ${recipient}.` });
    setRecipient("");
    setMessage("");
    setTemplate("");
  };

  const purge = () => {
    toast({ title: "Purge started", description: `SMS logs between ${purgeFrom || "—"} and ${purgeTo || "—"} will be purged.`, variant: "destructive" });
    setPurgeFrom("");
    setPurgeTo("");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={child!.label}
        description="SMS gateway logs, bulk SMS composition and log purge tools."
        icon={<mod.icon className="h-5 w-5" />}
        breadcrumb={[{ label: "Cryptsk" }, { label: mod.label }, { label: child!.label }]}
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <KpiCard label="Sent Today" value={String(sentToday)} icon={<CheckCircle2 className="h-4 w-4" />} accent />
        <KpiCard label="Failed" value={String(failed)} icon={<XCircle className="h-4 w-4" />} />
        <KpiCard label="Delivery Rate" value={`${deliveryRate}%`} icon={<Percent className="h-4 w-4" />} />
      </div>

      <Tabs defaultValue="logs">
        <TabsList>
          <TabsTrigger value="logs"><MessageSquare className="mr-1.5 h-3.5 w-3.5" /> SMS Logs</TabsTrigger>
          <TabsTrigger value="bulk"><Send className="mr-1.5 h-3.5 w-3.5" /> Bulk SMS</TabsTrigger>
          <TabsTrigger value="purge"><Trash2 className="mr-1.5 h-3.5 w-3.5" /> Purge Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="logs">
          <SectionCard title="SMS Log Report" description={`${SMS_LOGS.length} message(s)`}>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Mobile</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Template</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Sent At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {SMS_LOGS.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-mono text-xs text-primary">{s.id}</TableCell>
                      <TableCell className="font-mono text-xs">{s.mobile}</TableCell>
                      <TableCell className="max-w-[260px] truncate text-muted-foreground">{s.message}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px]">{s.template}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={SMS_STATUS_BADGE[s.status]}>{s.status}</Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-xs text-muted-foreground">{s.sentAt}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {SMS_LOGS.length === 0 && (
              <EmptyState icon={<MessageSquare className="h-5 w-5" />} title="No SMS logs" />
            )}
          </SectionCard>
        </TabsContent>

        <TabsContent value="bulk">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <SectionCard title="Compose Bulk SMS" description="Send an SMS to one or many recipients">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="bulk-template">Template</Label>
                      <Select value={template} onValueChange={(v) => {
                        setTemplate(v);
                        const found = SMS_LOGS.find((s) => s.template === v);
                        if (found) setMessage(found.message);
                      }}>
                        <SelectTrigger><SelectValue placeholder="Select template" /></SelectTrigger>
                        <SelectContent>
                          {SMS_TEMPLATES.map((t) => (
                            <SelectItem key={t} value={t}>{t}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="bulk-recipient">Recipient(s) *</Label>
                      <Input
                        id="bulk-recipient"
                        placeholder="Mobile numbers, comma separated"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="bulk-message">Message *</Label>
                      <span className="text-xs text-muted-foreground">{message.length} / 160</span>
                    </div>
                    <Textarea
                      id="bulk-message"
                      rows={5}
                      placeholder="Type your SMS message here..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      {message.length > 160 ? "Message will be split into multiple SMS." : "Standard SMS length is 160 characters."}
                    </p>
                  </div>
                  <Button onClick={sendBulk}>
                    <Send className="mr-2 h-4 w-4" /> Send SMS
                  </Button>
                </div>
              </SectionCard>
            </div>

            <div>
              <SectionCard title="Preview" description="How your message will appear">
                <div className="rounded-lg border border-border bg-muted/30 p-3">
                  <div className="rounded-lg bg-card p-3 shadow-sm">
                    <p className="text-xs font-medium text-muted-foreground">Cryptsk Networks</p>
                    <p className="mt-1 text-sm text-foreground">{message || <span className="text-muted-foreground/60">Your message preview…</span>}</p>
                    <p className="mt-2 text-right text-[10px] text-muted-foreground">{new Date().toLocaleTimeString()}</p>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <InfoRow label="Recipients" value={recipient ? recipient.split(",").length : "0"} />
                  <InfoRow label="Segments" value={String(Math.max(1, Math.ceil(message.length / 160)))} />
                  <InfoRow label="Template" value={template || "—"} />
                </div>
              </SectionCard>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="purge">
          <SectionCard title="Purge SMS Logs" description="Permanently delete SMS log entries older than the selected range">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor="purge-from">From Date</Label>
                <Input
                  id="purge-from"
                  type="date"
                  value={purgeFrom}
                  onChange={(e) => setPurgeFrom(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="purge-to">To Date</Label>
                <Input
                  id="purge-to"
                  type="date"
                  value={purgeTo}
                  onChange={(e) => setPurgeTo(e.target.value)}
                />
              </div>
              <div className="flex items-end">
                <Button variant="destructive" className="w-full" onClick={purge}>
                  <Trash2 className="mr-2 h-4 w-4" /> Purge Logs
                </Button>
              </div>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              This action cannot be undone. A backup of purged logs will be generated for audit purposes before deletion.
            </p>
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ---------------- Email Management ---------------- */

function EmailManagement({ moduleId, childId }: ViewProps) {
  const { mod, child } = useModuleHeader(moduleId, childId);
  const { toast } = useToast();
  const [server, setServer] = React.useState("smtp.cryptsk.net");
  const [port, setPort] = React.useState("587");
  const [encryption, setEncryption] = React.useState("TLS");
  const [username, setUsername] = React.useState("alerts@cryptsk.net");
  const [password, setPassword] = React.useState("");
  const [fromEmail, setFromEmail] = React.useState("alerts@cryptsk.net");
  const [fromName, setFromName] = React.useState("Cryptsk Alerts");
  if (!mod) return null;

  const save = () => {
    toast({ title: "SMTP settings saved", description: `Connected to ${server}:${port} via ${encryption}.` });
  };
  const testEmail = () => {
    toast({ title: "Test email sent", description: `A test message has been sent to ${fromEmail}.` });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={child!.label}
        description="SMTP configuration and email template management."
        icon={<mod.icon className="h-5 w-5" />}
        breadcrumb={[{ label: "Cryptsk" }, { label: mod.label }, { label: child!.label }]}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SectionCard title="SMTP Configuration" description="Outgoing mail server settings" actions={<Server className="h-4 w-4 text-muted-foreground" />}>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="smtp-server">SMTP Server</Label>
                  <Input id="smtp-server" value={server} onChange={(e) => setServer(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="smtp-port">Port</Label>
                  <Input id="smtp-port" value={port} onChange={(e) => setPort(e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Encryption</Label>
                  <Select value={encryption} onValueChange={setEncryption}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SSL">SSL</SelectItem>
                      <SelectItem value="TLS">TLS</SelectItem>
                      <SelectItem value="None">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="smtp-user">Username</Label>
                  <Input id="smtp-user" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="smtp-pass">Password</Label>
                  <Input id="smtp-pass" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="smtp-from">From Email</Label>
                  <Input id="smtp-from" type="email" value={fromEmail} onChange={(e) => setFromEmail(e.target.value)} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="smtp-fromname">From Name</Label>
                <Input id="smtp-fromname" value={fromName} onChange={(e) => setFromName(e.target.value)} />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button onClick={save}><CheckCircle2 className="mr-2 h-4 w-4" /> Save Configuration</Button>
                <Button variant="outline" onClick={testEmail}><Send className="mr-2 h-4 w-4" /> Send Test Email</Button>
              </div>
            </div>
          </SectionCard>
        </div>

        <div>
          <SectionCard title="Connection Summary" description="Quick overview">
            <div className="space-y-1">
              <InfoRow label="Server" value={<span className="font-mono text-xs">{server || "—"}</span>} />
              <InfoRow label="Port" value={<span className="font-mono text-xs">{port || "—"}</span>} />
              <InfoRow label="Encryption" value={<Badge variant="outline" className="text-[10px]">{encryption}</Badge>} />
              <InfoRow label="Username" value={<span className="font-mono text-xs">{username || "—"}</span>} />
              <InfoRow label="From" value={<span className="font-mono text-xs">{fromEmail || "—"}</span>} />
              <InfoRow label="Status" value={<Badge variant="outline" className="bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400">Connected</Badge>} />
            </div>
          </SectionCard>
        </div>
      </div>

      <SectionCard title="Email Templates" description={`${EMAIL_TEMPLATES.length} template(s)`}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Template</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Last Edited</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {EMAIL_TEMPLATES.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-mono text-xs text-primary">{t.id}</TableCell>
                  <TableCell className="font-medium">{t.name}</TableCell>
                  <TableCell className="text-muted-foreground">{t.subject}</TableCell>
                  <TableCell className="whitespace-nowrap text-xs text-muted-foreground">{t.lastEdited}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toast({ title: "Edit template", description: `${t.name} template editor will open.` })}
                    >
                      <Pencil className="mr-1.5 h-3.5 w-3.5" /> Edit
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

/* ---------------- Alert Configuration ---------------- */

const CHANNEL_BADGE: Record<AlertRule["channel"], string> = {
  SMS: "bg-sky-500/10 text-sky-700 hover:bg-sky-500/10 dark:text-sky-400",
  Email: "bg-violet-500/10 text-violet-700 hover:bg-violet-500/10 dark:text-violet-400",
  Both: "bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400",
};

function AlertConfig({ moduleId, childId }: ViewProps) {
  const { mod, child } = useModuleHeader(moduleId, childId);
  const { toast } = useToast();
  const [rules, setRules] = React.useState<AlertRule[]>(ALERT_RULES);
  if (!mod) return null;

  const toggle = (id: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
    const r = rules.find((x) => x.id === id);
    toast({
      title: r?.enabled ? "Rule disabled" : "Rule enabled",
      description: `${r?.event} alerts ${r?.enabled ? "stopped" : "activated"}.`,
    });
  };

  const active = rules.filter((r) => r.enabled).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title={child!.label}
        description="Configure automated alert rules for user lifecycle events."
        icon={<mod.icon className="h-5 w-5" />}
        breadcrumb={[{ label: "Cryptsk" }, { label: mod.label }, { label: child!.label }]}
        actions={
          <Button onClick={() => toast({ title: "Add Rule", description: "New alert rule form will open." })}>
            <Plus className="mr-2 h-4 w-4" /> Add Rule
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <KpiCard label="Total Rules" value={String(rules.length)} icon={<ShieldCheck className="h-4 w-4" />} accent />
        <KpiCard label="Active" value={String(active)} icon={<CheckCircle2 className="h-4 w-4" />} />
        <KpiCard label="Disabled" value={String(rules.length - active)} icon={<XCircle className="h-4 w-4" />} />
      </div>

      <SectionCard title="Alert Rules" description={`${rules.length} rule(s)`}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead>Template</TableHead>
                <TableHead>Recipients</TableHead>
                <TableHead>Enabled</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rules.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-mono text-xs text-primary">{r.id}</TableCell>
                  <TableCell className="font-medium">{r.event}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={CHANNEL_BADGE[r.channel]}>{r.channel}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{r.template}</TableCell>
                  <TableCell className="text-muted-foreground">{r.recipients}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch checked={r.enabled} onCheckedChange={() => toggle(r.id)} />
                      <span className={`text-xs ${r.enabled ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`}>
                        {r.enabled ? "On" : "Off"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toast({ title: "Edit rule", description: `${r.event} rule editor will open.` })}
                    >
                      <Pencil className="mr-1.5 h-3.5 w-3.5" /> Edit
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
