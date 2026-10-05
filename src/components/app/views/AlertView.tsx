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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
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
  AlertCircle,
  Save,
  Search,
  RefreshCw,
  Download,
  Loader2,
  Activity,
  Inbox,
} from "lucide-react";
import {
  SMS_LOGS,
  EMAIL_TEMPLATES,
  ALERT_RULES,
  type SmsLog,
  type AlertRule,
} from "@/lib/mock-data";

export function AlertView({ moduleId, childId, grandchildId }: ViewProps) {
  const router = useViewRouter(moduleId, childId, grandchildId);

  if (router.state === "loading") return null;
  if (router.state === "module-overview")
    return <AlertOverview moduleId={moduleId} />;
  if (router.state === "child-overview")
    return <ChildOverview moduleId={moduleId} childId={router.childId} />;

  if (router.state === "grandchild") {
    // SMS Gateway sub-pages
    if (childId === "sms-gateway" && grandchildId === "manage")
      return <SmsManagePage {...{ moduleId, childId, grandchildId }} />;
    if (childId === "sms-gateway" && grandchildId === "configure-details")
      return <SmsConfigDetailsPage {...{ moduleId, childId, grandchildId }} />;
    if (childId === "sms-gateway" && grandchildId === "bulk-sms")
      return <BulkSmsPage {...{ moduleId, childId, grandchildId }} />;
    if (childId === "sms-gateway" && grandchildId === "sms-log-report")
      return <SmsLogReportPage {...{ moduleId, childId, grandchildId }} />;
    if (childId === "sms-gateway" && grandchildId === "purge-sms-logs")
      return <PurgeSmsLogsPage {...{ moduleId, childId, grandchildId }} />;

    // Email Management sub-pages
    if (childId === "email" && grandchildId === "create-template")
      return <CreateEmailTemplatePage {...{ moduleId, childId, grandchildId }} />;
    if (childId === "email" && grandchildId === "manage-template")
      return <ManageEmailTemplatePage {...{ moduleId, childId, grandchildId }} />;
    if (childId === "email" && grandchildId === "configure")
      return <EmailConfigurePage {...{ moduleId, childId, grandchildId }} />;
    if (childId === "email" && grandchildId === "proactive-reports")
      return <ProactiveReportsPage {...{ moduleId, childId, grandchildId }} />;
    if (childId === "email" && grandchildId === "smtp-configuration")
      return <SmtpConfigPage {...{ moduleId, childId, grandchildId }} />;
    if (childId === "email" && grandchildId === "system-alerts")
      return <SystemAlertsPage {...{ moduleId, childId, grandchildId }} />;

    return (
      <LeafPlaceholder
        moduleId={moduleId}
        childId={router.childId}
        grandchildId={router.grandchildId}
      />
    );
  }

  // Child without grandchildren (alert-config)
  if (router.state === "child" && router.childId === "alert-config") {
    return <AlertConfigPage moduleId={moduleId} childId={router.childId} />;
  }

  return <AlertOverview moduleId={moduleId} />;
}

/* ================ Shared helpers ================ */

function useBreadcrumb(moduleId: string, childId: string, grandchildId?: string) {
  const { mod, child, grandchild } = useModuleHeader(moduleId, childId, grandchildId);
  const setActive = useAppStore((s) => s.setActive);
  return [
    { label: "Cryptsk" },
    { label: mod?.label ?? "Alert", onClick: () => setActive(moduleId, "", "") },
    { label: child?.label ?? childId, onClick: () => setActive(moduleId, childId, "") },
    ...(grandchild ? [{ label: grandchild.label }] : []),
  ];
}

const SMS_STATUS_BADGE: Record<SmsLog["status"], string> = {
  Sent: "bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400",
  Failed: "bg-primary/10 text-primary hover:bg-primary/10",
  Queued: "bg-amber-500/10 text-amber-700 hover:bg-amber-500/10 dark:text-amber-400",
};

const SMS_TEMPLATES = ["Renewal", "Due Reminder", "OTP", "Outage", "Welcome", "Suspension"];

/* ================ Overview ================ */

function AlertOverview({ moduleId }: { moduleId: string }) {
  const { mod } = useModuleHeader(moduleId);
  const setActive = useAppStore((s) => s.setActive);
  if (!mod) return null;

  const smsSentToday = SMS_LOGS.filter((s) => s.status === "Sent").length;

  const cards = [
    { label: "SMS Gateway", desc: "Configure provider, bulk SMS, logs & purge", icon: MessageSquare, child: "sms-gateway" },
    { label: "Email Management", desc: "SMTP, templates & proactive reports", icon: Mail, child: "email" },
    { label: "Alert Configuration", desc: "Automated alert rules & triggers", icon: ShieldCheck, child: "alert-config" },
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
        <KpiCard label="Email Templates" value={String(EMAIL_TEMPLATES.length)} icon={<Inbox className="h-4 w-4" />} />
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

/* ================ SMS GATEWAY: MANAGE ================ */

function SmsManagePage({ moduleId, childId, grandchildId }: ViewProps) {
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const [provider, setProvider] = React.useState("msg91");
  const [apiUrl, setApiUrl] = React.useState("https://api.msg91.com/api/v5/flow/");
  const [apiKey, setApiKey] = React.useState("•••••••••••••••");
  const [senderId, setSenderId] = React.useState("CRYPTK");
  const [enabled, setEnabled] = React.useState(true);

  const save = () => {
    toast({ title: "SMS gateway saved", description: `Provider: ${provider.toUpperCase()}, Sender: ${senderId}.` });
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Manage SMS Gateway" description="Configure the SMS gateway provider, API credentials and sender ID." icon={<MessageSquare className="h-5 w-5" />} breadcrumb={breadcrumb} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SectionCard title="Gateway Settings" description="Provider credentials">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Provider</Label>
                <Select value={provider} onValueChange={setProvider}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="msg91">MSG91</SelectItem>
                    <SelectItem value="twilio">Twilio</SelectItem>
                    <SelectItem value="textlocal">TextLocal</SelectItem>
                    <SelectItem value="gupshup">Gupshup</SelectItem>
                    <SelectItem value="kaleyra">Kaleyra</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>API URL</Label><Input value={apiUrl} onChange={(e) => setApiUrl(e.target.value)} /></div>
              <div className="space-y-2"><Label>API Key</Label><Input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} /></div>
              <div className="space-y-2"><Label>Sender ID</Label><Input value={senderId} onChange={(e) => setSenderId(e.target.value)} maxLength={6} /></div>
              <div className="flex items-center gap-3 sm:col-span-2">
                <Switch checked={enabled} onCheckedChange={setEnabled} />
                <Label>Gateway enabled</Label>
              </div>
            </div>
            <div className="mt-5 flex justify-end">
              <Button onClick={save}><Save className="mr-2 h-4 w-4" /> Save Configuration</Button>
            </div>
          </SectionCard>
        </div>
        <div>
          <SectionCard title="Status" description="Quick overview">
            <div className="space-y-1">
              <InfoRow label="Provider" value={<span className="font-mono text-xs">{provider}</span>} />
              <InfoRow label="Sender ID" value={<Badge variant="outline" className="text-[10px]">{senderId}</Badge>} />
              <InfoRow label="Enabled" value={enabled ? <Badge className="bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400">Yes</Badge> : <Badge className="bg-muted text-muted-foreground hover:bg-muted">No</Badge>} />
              <InfoRow label="Sent Today" value={String(SMS_LOGS.filter((s) => s.status === "Sent").length)} />
              <InfoRow label="Failed" value={String(SMS_LOGS.filter((s) => s.status === "Failed").length)} />
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}

/* ================ SMS GATEWAY: CONFIGURE DETAILS ================ */

function SmsConfigDetailsPage({ moduleId, childId, grandchildId }: ViewProps) {
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const [gatewayUrl, setGatewayUrl] = React.useState("https://api.msg91.com/api/v5/flow/");
  const [port, setPort] = React.useState("443");
  const [username, setUsername] = React.useState("cryptsk_sms");
  const [password, setPassword] = React.useState("");
  const [senderId, setSenderId] = React.useState("CRYPTK");
  const [dltTemplateId, setDltTemplateId] = React.useState("DLT-1107-XXXX");

  const save = () => {
    toast({ title: "SMS configuration saved", description: `Connected to ${gatewayUrl}:${port}.` });
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Configure SMS Gateway Details" description="Detailed gateway configuration (URL, port, auth, DLT template)." icon={<Server className="h-5 w-5" />} breadcrumb={breadcrumb} />
      <SectionCard title="Connection Details" description="Gateway endpoint & authentication">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2"><Label>Gateway URL</Label><Input value={gatewayUrl} onChange={(e) => setGatewayUrl(e.target.value)} /></div>
          <div className="space-y-2"><Label>Port</Label><Input value={port} onChange={(e) => setPort(e.target.value)} /></div>
          <div className="space-y-2"><Label>Username</Label><Input value={username} onChange={(e) => setUsername(e.target.value)} /></div>
          <div className="space-y-2"><Label>Password</Label><Input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
          <div className="space-y-2"><Label>Sender ID</Label><Input value={senderId} onChange={(e) => setSenderId(e.target.value)} maxLength={6} /></div>
          <div className="space-y-2"><Label>DLT Template ID</Label><Input value={dltTemplateId} onChange={(e) => setDltTemplateId(e.target.value)} /></div>
        </div>
        <div className="mt-5 flex justify-end">
          <Button onClick={save}><Save className="mr-2 h-4 w-4" /> Save</Button>
        </div>
      </SectionCard>
    </div>
  );
}

/* ================ SMS GATEWAY: BULK SMS ================ */

function BulkSmsPage({ moduleId, childId, grandchildId }: ViewProps) {
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const [template, setTemplate] = React.useState("");
  const [recipientType, setRecipientType] = React.useState("all");
  const [recipient, setRecipient] = React.useState("");
  const [message, setMessage] = React.useState("");

  const send = () => {
    if (!message.trim()) {
      toast({ title: "Message required", description: "Type a message before sending.", variant: "destructive" });
      return;
    }
    const count = recipient ? recipient.split(",").length : recipientType === "all" ? 4250 : 0;
    toast({ title: "Bulk SMS queued", description: `${count} recipient(s) will receive this message.` });
    setRecipient(""); setMessage(""); setTemplate("");
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Bulk SMS" description="Send SMS to all customers, a zone or a specific group." icon={<Send className="h-5 w-5" />} breadcrumb={breadcrumb} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SectionCard title="Compose" description="Choose recipients and message">
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Template</Label>
                  <Select value={template} onValueChange={(v) => { setTemplate(v); const found = SMS_LOGS.find((s) => s.template === v); if (found) setMessage(found.message); }}>
                    <SelectTrigger><SelectValue placeholder="Select template" /></SelectTrigger>
                    <SelectContent>{SMS_TEMPLATES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Recipient Type</Label>
                  <Select value={recipientType} onValueChange={setRecipientType}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Customers</SelectItem>
                      <SelectItem value="zone">Specific Zone</SelectItem>
                      <SelectItem value="group">Specific Group</SelectItem>
                      <SelectItem value="manual">Manual List</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {recipientType !== "all" && (
                <div className="space-y-2">
                  <Label>{recipientType === "zone" ? "Zone" : recipientType === "group" ? "Group" : "Mobile numbers (comma separated)"}</Label>
                  <Input placeholder={recipientType === "zone" ? "e.g. Bhiwani-North" : recipientType === "group" ? "e.g. Prepaid-Users" : "9876543210, 9123456780"} value={recipient} onChange={(e) => setRecipient(e.target.value)} />
                </div>
              )}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Message</Label>
                  <span className="text-xs text-muted-foreground">{message.length} / 160</span>
                </div>
                <Textarea rows={5} placeholder="Type your SMS message..." value={message} onChange={(e) => setMessage(e.target.value)} />
                <p className="text-xs text-muted-foreground">{message.length > 160 ? "Message will be split into multiple SMS." : "Standard SMS length is 160 characters."}</p>
              </div>
              <Button onClick={send}><Send className="mr-2 h-4 w-4" /> Send SMS</Button>
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
              <InfoRow label="Recipients" value={recipient ? recipient.split(",").length : recipientType === "all" ? "4,250" : "0"} />
              <InfoRow label="Segments" value={String(Math.max(1, Math.ceil(message.length / 160)))} />
              <InfoRow label="Template" value={template || "—"} />
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}

/* ================ SMS GATEWAY: SMS LOG REPORT ================ */

function SmsLogReportPage({ moduleId, childId, grandchildId }: ViewProps) {
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const [fromDate, setFromDate] = React.useState("");
  const [toDate, setToDate] = React.useState("");
  const [mobile, setMobile] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");

  const filtered = SMS_LOGS.filter((s) => {
    if (statusFilter !== "all" && s.status !== statusFilter) return false;
    if (mobile.trim() && !s.mobile.includes(mobile.trim())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <PageHeader title="SMS Log Report" description="Filter & view SMS delivery logs." icon={<MessageSquare className="h-5 w-5" />} breadcrumb={breadcrumb} />
      <SectionCard title="Filters" description="Filter by date, mobile, status">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div className="space-y-2"><Label>From Date</Label><Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} /></div>
          <div className="space-y-2"><Label>To Date</Label><Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} /></div>
          <div className="space-y-2"><Label>Mobile</Label><Input placeholder="9876543210" value={mobile} onChange={(e) => setMobile(e.target.value)} /></div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="all">All</SelectItem><SelectItem value="Sent">Sent</SelectItem><SelectItem value="Failed">Failed</SelectItem><SelectItem value="Queued">Queued</SelectItem></SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => { setFromDate(""); setToDate(""); setMobile(""); setStatusFilter("all"); toast({ title: "Filters cleared" }); }}>
            <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Reset
          </Button>
          <Button variant="outline" size="sm" onClick={() => toast({ title: "Export started", description: `Exporting ${filtered.length} log(s).` })}>
            <Download className="mr-1.5 h-3.5 w-3.5" /> Export
          </Button>
        </div>
      </SectionCard>
      <SectionCard title="SMS Logs" description={`${filtered.length} log(s)`}>
        <div className="max-h-96 overflow-y-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-card">
              <TableRow><TableHead>ID</TableHead><TableHead>Mobile</TableHead><TableHead>Message</TableHead><TableHead>Template</TableHead><TableHead>Status</TableHead><TableHead>Sent At</TableHead></TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-mono text-xs text-primary">{s.id}</TableCell>
                  <TableCell className="font-mono text-xs">{s.mobile}</TableCell>
                  <TableCell className="max-w-[260px] truncate text-muted-foreground">{s.message}</TableCell>
                  <TableCell><Badge variant="outline" className="text-[10px]">{s.template}</Badge></TableCell>
                  <TableCell><Badge variant="outline" className={SMS_STATUS_BADGE[s.status]}>{s.status}</Badge></TableCell>
                  <TableCell className="whitespace-nowrap text-xs text-muted-foreground">{s.sentAt}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {filtered.length === 0 && <EmptyState icon={<MessageSquare className="h-5 w-5" />} title="No SMS logs match your filters" />}
      </SectionCard>
    </div>
  );
}

/* ================ SMS GATEWAY: PURGE SMS LOGS ================ */

function PurgeSmsLogsPage({ moduleId, childId, grandchildId }: ViewProps) {
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const [fromDate, setFromDate] = React.useState("");
  const [toDate, setToDate] = React.useState("");
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  const purge = () => {
    toast({ title: "Purge started", description: `SMS logs between ${fromDate || "—"} and ${toDate || "—"} will be purged.`, variant: "destructive" });
    setFromDate(""); setToDate("");
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Purge SMS Logs" description="Permanently delete SMS log entries within a date range." icon={<Trash2 className="h-5 w-5" />} breadcrumb={breadcrumb} />
      <SectionCard title="Purge Range" description="Select a date range">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="space-y-2"><Label>From Date</Label><Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} /></div>
          <div className="space-y-2"><Label>To Date</Label><Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} /></div>
          <div className="flex items-end">
            <Button variant="destructive" className="w-full" disabled={!fromDate || !toDate} onClick={() => setConfirmOpen(true)}>
              <Trash2 className="mr-2 h-4 w-4" /> Purge Logs
            </Button>
          </div>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">This action cannot be undone. A backup of purged logs will be generated for audit purposes before deletion.</p>
      </SectionCard>

      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setConfirmOpen(false)}>
          <div className="rounded-lg bg-card p-6 shadow-xl max-w-sm" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold">Confirm Purge</h3>
            <p className="mt-2 text-sm text-muted-foreground">All SMS logs between <span className="font-medium text-foreground">{fromDate}</span> and <span className="font-medium text-foreground">{toDate}</span> will be permanently deleted.</p>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setConfirmOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={() => { purge(); setConfirmOpen(false); }}><Trash2 className="mr-2 h-4 w-4" /> Purge</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================ EMAIL: CREATE TEMPLATE ================ */

function CreateEmailTemplatePage({ moduleId, childId, grandchildId }: ViewProps) {
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const setActive = useAppStore((s) => s.setActive);
  const [saving, setSaving] = React.useState(false);
  const [form, setForm] = React.useState({ name: "", subject: "", body: "", variables: "" });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.subject.trim()) {
      toast({ title: "Missing fields", description: "Name and subject are required.", variant: "destructive" });
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 400));
    setSaving(false);
    toast({ title: "Email template created", description: form.name });
    setActive(moduleId, "email", "manage-template");
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Create Email Template" description="Create a reusable email template." icon={<Mail className="h-5 w-5" />} breadcrumb={breadcrumb}
        actions={<Button variant="outline" onClick={() => setActive(moduleId, "email", "manage-template")}><RefreshCw className="mr-2 h-4 w-4 rotate-180" /> Back</Button>} />
      <form onSubmit={submit}>
        <SectionCard title="Template Details" description="Name, subject & body">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2"><Label>Name <span className="text-primary">*</span></Label><Input placeholder="e.g. Welcome" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
            <div className="space-y-2"><Label>Subject <span className="text-primary">*</span></Label><Input placeholder="e.g. Welcome to Cryptsk Networks" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required /></div>
            <div className="space-y-2"><Label>Body</Label><Textarea rows={8} placeholder="Use {{customer_name}}, {{plan_name}}, {{amount}} as placeholders…" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} /></div>
            <div className="space-y-2"><Label>Variables (comma separated)</Label><Input placeholder="customer_name, plan_name, amount" value={form.variables} onChange={(e) => setForm({ ...form, variables: e.target.value })} /></div>
          </div>
        </SectionCard>
        <div className="mt-4 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => setActive(moduleId, "email", "manage-template")}>Cancel</Button>
          <Button type="submit" disabled={saving}>{saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />} Create</Button>
        </div>
      </form>
    </div>
  );
}

/* ================ EMAIL: MANAGE TEMPLATE ================ */

interface EmailTemplateRow { id: string; name: string; subject: string; lastModified: string; status: "Active" | "Inactive"; }

const INITIAL_TEMPLATES: EmailTemplateRow[] = EMAIL_TEMPLATES.map((t, i) => ({
  id: t.id,
  name: t.name,
  subject: t.subject,
  lastModified: t.lastEdited,
  status: i < 4 ? "Active" : "Inactive",
}));

function ManageEmailTemplatePage({ moduleId, childId, grandchildId }: ViewProps) {
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const setActive = useAppStore((s) => s.setActive);
  const [rows, setRows] = React.useState<EmailTemplateRow[]>(INITIAL_TEMPLATES);
  const [delId, setDelId] = React.useState<string | null>(null);

  const toggleStatus = (id: string) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status: r.status === "Active" ? "Inactive" : "Active" } : r)));
    toast({ title: "Template status toggled" });
  };

  const confirmDelete = () => {
    if (!delId) return;
    setRows((prev) => prev.filter((r) => r.id !== delId));
    toast({ title: "Template deleted", description: delId, variant: "destructive" });
    setDelId(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Manage Email Templates" description="View, edit and delete email templates." icon={<Mail className="h-5 w-5" />} breadcrumb={breadcrumb}
        actions={<Button onClick={() => setActive(moduleId, "email", "create-template")}><Plus className="mr-2 h-4 w-4" /> Create</Button>} />
      <SectionCard title="Templates" description={`${rows.length} template(s)`}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader><TableRow><TableHead>ID</TableHead><TableHead>Name</TableHead><TableHead>Subject</TableHead><TableHead>Last Modified</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-mono text-xs text-primary">{r.id}</TableCell>
                  <TableCell className="font-medium">{r.name}</TableCell>
                  <TableCell className="text-muted-foreground">{r.subject}</TableCell>
                  <TableCell className="whitespace-nowrap text-xs text-muted-foreground">{r.lastModified}</TableCell>
                  <TableCell>
                    <button onClick={() => toggleStatus(r.id)}>
                      <Badge variant="outline" className={r.status === "Active" ? "bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400" : "bg-muted text-muted-foreground hover:bg-muted"}>{r.status}</Badge>
                    </button>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="sm" onClick={() => toast({ title: "Edit template", description: r.name })}><Pencil className="mr-1.5 h-3.5 w-3.5" /> Edit</Button>
                      <Button variant="ghost" size="sm" className="text-primary" onClick={() => setDelId(r.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {rows.length === 0 && <EmptyState icon={<Mail className="h-5 w-5" />} title="No templates" />}
      </SectionCard>

      {delId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setDelId(null)}>
          <div className="rounded-lg bg-card p-6 shadow-xl max-w-sm" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold">Delete template?</h3>
            <p className="mt-2 text-sm text-muted-foreground">This action cannot be undone.</p>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDelId(null)}>Cancel</Button>
              <Button variant="destructive" onClick={confirmDelete}><Trash2 className="mr-2 h-4 w-4" /> Delete</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================ EMAIL: CONFIGURE ================ */

function EmailConfigurePage({ moduleId, childId, grandchildId }: ViewProps) {
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const [server, setServer] = React.useState("smtp.cryptsk.net");
  const [port, setPort] = React.useState("587");
  const [encryption, setEncryption] = React.useState("TLS");
  const [username, setUsername] = React.useState("alerts@cryptsk.net");
  const [password, setPassword] = React.useState("");
  const [fromEmail, setFromEmail] = React.useState("alerts@cryptsk.net");
  const [fromName, setFromName] = React.useState("Cryptsk Alerts");

  const save = () => toast({ title: "Email settings saved", description: `Connected to ${server}:${port} via ${encryption}.` });
  const testEmail = () => toast({ title: "Test email sent", description: `A test message has been sent to ${fromEmail}.` });

  return (
    <div className="space-y-6">
      <PageHeader title="Configure Email" description="Outgoing mail server (SMTP) configuration." icon={<Mail className="h-5 w-5" />} breadcrumb={breadcrumb} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SectionCard title="SMTP Settings" description="Server, port, encryption, auth" actions={<Server className="h-4 w-4 text-muted-foreground" />}>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2"><Label>SMTP Server</Label><Input value={server} onChange={(e) => setServer(e.target.value)} /></div>
                <div className="space-y-2"><Label>Port</Label><Input value={port} onChange={(e) => setPort(e.target.value)} /></div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Encryption</Label>
                  <Select value={encryption} onValueChange={setEncryption}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="SSL">SSL</SelectItem><SelectItem value="TLS">TLS</SelectItem><SelectItem value="None">None</SelectItem></SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label>Username</Label><Input value={username} onChange={(e) => setUsername(e.target.value)} /></div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2"><Label>Password</Label><Input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
                <div className="space-y-2"><Label>From Email</Label><Input type="email" value={fromEmail} onChange={(e) => setFromEmail(e.target.value)} /></div>
              </div>
              <div className="space-y-2"><Label>From Name</Label><Input value={fromName} onChange={(e) => setFromName(e.target.value)} /></div>
              <div className="flex flex-wrap items-center gap-2">
                <Button onClick={save}><Save className="mr-2 h-4 w-4" /> Save</Button>
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
    </div>
  );
}

/* ================ EMAIL: PROACTIVE REPORTS ================ */

const REPORT_TYPES = [
  { id: "daily-summary", label: "Daily Summary" },
  { id: "new-users", label: "New Users" },
  { id: "expiring-users", label: "Expiring Users" },
  { id: "unpaid-invoices", label: "Unpaid Invoices" },
  { id: "fap-hits", label: "FAP Hits" },
  { id: "online-users", label: "Online Users" },
];

function ProactiveReportsPage({ moduleId, childId, grandchildId }: ViewProps) {
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const [recipients, setRecipients] = React.useState("noc@cryptsk.net, billing@cryptsk.net");
  const [frequency, setFrequency] = React.useState("Daily");
  const [selected, setSelected] = React.useState<Set<string>>(new Set(["daily-summary"]));

  const toggle = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelected(next);
  };

  const save = () => {
    if (selected.size === 0) {
      toast({ title: "No report types selected", description: "Select at least one report type.", variant: "destructive" });
      return;
    }
    toast({ title: "Proactive reports saved", description: `${frequency} · ${selected.size} report(s) → ${recipients}.` });
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Proactive Reports" description="Schedule automated report emails." icon={<Activity className="h-5 w-5" />} breadcrumb={breadcrumb} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SectionCard title="Report Schedule" description="Configure recipients, frequency & report types">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Email Recipients (comma separated)</Label>
                <Textarea rows={2} value={recipients} onChange={(e) => setRecipients(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Report Frequency</Label>
                <Select value={frequency} onValueChange={setFrequency}>
                  <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="Daily">Daily</SelectItem><SelectItem value="Weekly">Weekly</SelectItem><SelectItem value="Monthly">Monthly</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Report Types</Label>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {REPORT_TYPES.map((r) => (
                    <label key={r.id} className="flex items-center gap-3 rounded-lg border border-border bg-background p-3 text-sm cursor-pointer hover:bg-muted/40">
                      <Checkbox checked={selected.has(r.id)} onCheckedChange={() => toggle(r.id)} />
                      <span>{r.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <Button onClick={save}><Save className="mr-2 h-4 w-4" /> Save Schedule</Button>
            </div>
          </SectionCard>
        </div>
        <div>
          <SectionCard title="Current Schedule" description="Summary">
            <div className="space-y-1">
              <InfoRow label="Recipients" value={recipients.split(",").filter(Boolean).length} />
              <InfoRow label="Frequency" value={<Badge variant="outline" className="text-[10px]">{frequency}</Badge>} />
              <InfoRow label="Report Types" value={String(selected.size)} />
              <InfoRow label="Status" value={<Badge variant="outline" className="bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400">Active</Badge>} />
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}

/* ================ EMAIL: SMTP CONFIGURATION ================ */

function SmtpConfigPage({ moduleId, childId, grandchildId }: ViewProps) {
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const [host, setHost] = React.useState("smtp.cryptsk.net");
  const [port, setPort] = React.useState("587");
  const [authType, setAuthType] = React.useState("LOGIN");
  const [username, setUsername] = React.useState("alerts@cryptsk.net");
  const [password, setPassword] = React.useState("");
  const [tls, setTls] = React.useState(true);

  const save = () => toast({ title: "SMTP config saved", description: `${host}:${port} (${authType}, TLS ${tls ? "on" : "off"}).` });
  const test = () => toast({ title: "Test email sent", description: `A test message has been sent to ${username}.` });

  return (
    <div className="space-y-6">
      <PageHeader title="SMTP Configuration" description="Detailed SMTP transport settings." icon={<Server className="h-5 w-5" />} breadcrumb={breadcrumb} />
      <SectionCard title="SMTP Transport" description="Host, port, auth & TLS">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2"><Label>SMTP Host</Label><Input value={host} onChange={(e) => setHost(e.target.value)} /></div>
          <div className="space-y-2"><Label>Port</Label><Input value={port} onChange={(e) => setPort(e.target.value)} /></div>
          <div className="space-y-2">
            <Label>Auth Type</Label>
            <Select value={authType} onValueChange={setAuthType}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="LOGIN">LOGIN</SelectItem><SelectItem value="PLAIN">PLAIN</SelectItem><SelectItem value="CRAM-MD5">CRAM-MD5</SelectItem><SelectItem value="None">None</SelectItem></SelectContent>
            </Select>
          </div>
          <div className="space-y-2"><Label>Username</Label><Input value={username} onChange={(e) => setUsername(e.target.value)} /></div>
          <div className="space-y-2"><Label>Password</Label><Input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
          <div className="flex items-end">
            <div className="flex items-center gap-3">
              <Switch checked={tls} onCheckedChange={setTls} />
              <Label>Use TLS</Label>
            </div>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <Button onClick={save}><Save className="mr-2 h-4 w-4" /> Save</Button>
          <Button variant="outline" onClick={test}><Send className="mr-2 h-4 w-4" /> Send Test Email</Button>
        </div>
      </SectionCard>
    </div>
  );
}

/* ================ EMAIL: SYSTEM ALERTS ================ */

interface SystemAlert {
  id: string; time: string; level: "Info" | "Warning" | "Error"; module: string; message: string; status: "New" | "Acknowledged" | "Resolved";
}

const INITIAL_ALERTS: SystemAlert[] = [
  { id: "SA-1042", time: "04 Oct 2026 14:32", level: "Error", module: "RADIUS", message: "Auth failure rate above 5% for 10 min", status: "New" },
  { id: "SA-1041", time: "04 Oct 2026 13:18", level: "Warning", module: "DHCP", message: "Pool Z03 utilization at 88%", status: "New" },
  { id: "SA-1040", time: "04 Oct 2026 11:55", level: "Info", module: "System", message: "Scheduled backup completed", status: "Resolved" },
  { id: "SA-1039", time: "03 Oct 2026 22:11", level: "Warning", module: "Gateway", message: "Gateway latency spike on eth0", status: "Acknowledged" },
  { id: "SA-1038", time: "03 Oct 2026 18:42", level: "Error", module: "DB", message: "Replication lag exceeded 30s", status: "Resolved" },
  { id: "SA-1037", time: "03 Oct 2026 09:00", level: "Info", module: "Alert", message: "SMS gateway provider switched to MSG91", status: "Resolved" },
];

const LEVEL_BADGE: Record<SystemAlert["level"], string> = {
  Info: "bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400",
  Warning: "bg-amber-500/10 text-amber-700 hover:bg-amber-500/10 dark:text-amber-400",
  Error: "bg-primary/10 text-primary hover:bg-primary/10",
};

const ALERT_STATUS_BADGE: Record<SystemAlert["status"], string> = {
  New: "bg-primary/10 text-primary hover:bg-primary/10",
  Acknowledged: "bg-amber-500/10 text-amber-700 hover:bg-amber-500/10 dark:text-amber-400",
  Resolved: "bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400",
};

function SystemAlertsPage({ moduleId, childId, grandchildId }: ViewProps) {
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const [levelFilter, setLevelFilter] = React.useState("all");
  const [rows, setRows] = React.useState<SystemAlert[]>(INITIAL_ALERTS);

  const filtered = rows.filter((r) => levelFilter === "all" || r.level === levelFilter);
  const ack = (id: string) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status: "Acknowledged" } : r)));
    toast({ title: "Alert acknowledged", description: id });
  };
  const resolve = (id: string) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status: "Resolved" } : r)));
    toast({ title: "Alert resolved", description: id });
  };

  return (
    <div className="space-y-6">
      <PageHeader title="System Alerts" description="Operational alerts across modules with severity & status." icon={<AlertCircle className="h-5 w-5" />} breadcrumb={breadcrumb} />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard label="Total" value={String(rows.length)} icon={<AlertCircle className="h-4 w-4" />} accent />
        <KpiCard label="New" value={String(rows.filter((r) => r.status === "New").length)} icon={<XCircle className="h-4 w-4" />} />
        <KpiCard label="Acknowledged" value={String(rows.filter((r) => r.status === "Acknowledged").length)} icon={<Percent className="h-4 w-4" />} />
        <KpiCard label="Resolved" value={String(rows.filter((r) => r.status === "Resolved").length)} icon={<CheckCircle2 className="h-4 w-4" />} />
      </div>
      <ActionBar>
        <Select value={levelFilter} onValueChange={setLevelFilter}>
          <SelectTrigger className="h-8 w-[140px]"><SelectValue placeholder="Level" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All levels</SelectItem>
            <SelectItem value="Info">Info</SelectItem>
            <SelectItem value="Warning">Warning</SelectItem>
            <SelectItem value="Error">Error</SelectItem>
          </SelectContent>
        </Select>
      </ActionBar>
      <SectionCard title="Alerts" description={`${filtered.length} alert(s)`}>
        <div className="max-h-96 overflow-y-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-card">
              <TableRow><TableHead>Time</TableHead><TableHead>Level</TableHead><TableHead>Module</TableHead><TableHead>Message</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="whitespace-nowrap text-xs text-muted-foreground">{r.time}</TableCell>
                  <TableCell><Badge variant="outline" className={`text-[10px] ${LEVEL_BADGE[r.level]}`}>{r.level}</Badge></TableCell>
                  <TableCell><Badge variant="outline" className="text-[10px]">{r.module}</Badge></TableCell>
                  <TableCell className="text-muted-foreground">{r.message}</TableCell>
                  <TableCell><Badge variant="outline" className={`text-[10px] ${ALERT_STATUS_BADGE[r.status]}`}>{r.status}</Badge></TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {r.status === "New" && <Button variant="ghost" size="sm" onClick={() => ack(r.id)}>Ack</Button>}
                      {r.status !== "Resolved" && <Button variant="ghost" size="sm" className="text-emerald-600" onClick={() => resolve(r.id)}>Resolve</Button>}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {filtered.length === 0 && <EmptyState icon={<AlertCircle className="h-5 w-5" />} title="No alerts match the filter" />}
      </SectionCard>
    </div>
  );
}

/* ================ ALERT CONFIG (child without grandchildren) ================ */

const CHANNEL_BADGE: Record<AlertRule["channel"], string> = {
  SMS: "bg-sky-500/10 text-sky-700 hover:bg-sky-500/10 dark:text-sky-400",
  Email: "bg-violet-500/10 text-violet-700 hover:bg-violet-500/10 dark:text-violet-400",
  Both: "bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400",
};

function AlertConfigPage({ moduleId, childId }: ViewProps) {
  const { mod, child } = useModuleHeader(moduleId, childId);
  const { toast } = useToast();
  const [rules, setRules] = React.useState<AlertRule[]>(ALERT_RULES);
  if (!mod || !child) return null;

  const toggle = (id: string) => {
    setRules((prev) => prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)));
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
        title={child.label}
        description="Configure automated alert rules for user lifecycle events."
        icon={<mod.icon className="h-5 w-5" />}
        breadcrumb={[{ label: "Cryptsk" }, { label: mod.label }, { label: child.label }]}
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
                <TableHead>ID</TableHead><TableHead>Event</TableHead><TableHead>Channel</TableHead><TableHead>Template</TableHead><TableHead>Recipients</TableHead><TableHead>Enabled</TableHead><TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rules.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-mono text-xs text-primary">{r.id}</TableCell>
                  <TableCell className="font-medium">{r.event}</TableCell>
                  <TableCell><Badge variant="outline" className={CHANNEL_BADGE[r.channel]}>{r.channel}</Badge></TableCell>
                  <TableCell className="text-muted-foreground">{r.template}</TableCell>
                  <TableCell className="text-muted-foreground">{r.recipients}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch checked={r.enabled} onCheckedChange={() => toggle(r.id)} />
                      <span className={`text-xs ${r.enabled ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`}>{r.enabled ? "On" : "Off"}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => toast({ title: "Edit rule", description: `${r.event} rule editor will open.` })}>
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
