"use client";

import * as React from "react";
import { ViewProps, useModuleHeader } from "./_shared";
import {
  PageHeader,
  ActionBar,
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Ticket as TicketIcon,
  Search,
  Plus,
  Download,
  Filter,
  RefreshCw,
  Upload,
  Send,
  ClipboardList,
  CheckCircle2,
  Clock,
  Archive,
  AlertTriangle,
} from "lucide-react";
import { TICKETS, type Ticket } from "@/lib/mock-data";

export function TicketView({ moduleId, childId }: ViewProps) {
  const { mod } = useModuleHeader(moduleId, childId);
  if (!mod) return null;

  if (!childId) return <TicketOverview moduleId={moduleId} />;
  switch (childId) {
    case "search-ticket":
      return <SearchTicket moduleId={moduleId} childId={childId} />;
    case "create-ticket":
      return <CreateTicket moduleId={moduleId} childId={childId} />;
    default:
      return <TicketOverview moduleId={moduleId} />;
  }
}

/* ---------------- Overview ---------------- */

function TicketOverview({ moduleId }: { moduleId: string }) {
  const { mod } = useModuleHeader(moduleId);
  const setActive = useAppStore((s) => s.setActive);
  if (!mod) return null;

  const open = TICKETS.filter((t) => t.status === "Open").length;
  const resolved = TICKETS.filter((t) => t.status === "Resolved").length;

  const cards = [
    { label: "Search Ticket", desc: "Find and manage support tickets", icon: Search, child: "search-ticket" },
    { label: "Create Ticket", desc: "Open a new support ticket", icon: Plus, child: "create-ticket" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={mod.label}
        description={mod.desc}
        icon={<mod.icon className="h-5 w-5" />}
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard label="Total Tickets" value={String(TICKETS.length)} icon={<TicketIcon className="h-4 w-4" />} accent />
        <KpiCard label="Open" value={String(open)} icon={<AlertTriangle className="h-4 w-4" />} />
        <KpiCard label="Resolved Today" value={String(resolved)} icon={<CheckCircle2 className="h-4 w-4" />} />
        <KpiCard label="Avg Resolution" value="4h 12m" icon={<Clock className="h-4 w-4" />} />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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

/* ---------------- Search Ticket ---------------- */

const PRIORITY_BADGE: Record<Ticket["priority"], string> = {
  Low: "bg-slate-500/10 text-slate-600 hover:bg-slate-500/10 dark:text-slate-300",
  Medium: "bg-sky-500/10 text-sky-700 hover:bg-sky-500/10 dark:text-sky-400",
  High: "bg-amber-500/10 text-amber-700 hover:bg-amber-500/10 dark:text-amber-400",
  Critical: "bg-primary/10 text-primary hover:bg-primary/10",
};

const STATUS_BADGE: Record<Ticket["status"], string> = {
  Open: "bg-primary/10 text-primary hover:bg-primary/10",
  "In Progress": "bg-amber-500/10 text-amber-700 hover:bg-amber-500/10 dark:text-amber-400",
  Resolved: "bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400",
  Closed: "bg-slate-500/10 text-slate-600 hover:bg-slate-500/10 dark:text-slate-300",
};

function SearchTicket({ moduleId, childId }: ViewProps) {
  const { mod, child } = useModuleHeader(moduleId, childId);
  const { toast } = useToast();
  const [status, setStatus] = React.useState("all");
  const [priority, setPriority] = React.useState("all");
  const [category, setCategory] = React.useState("all");
  const [search, setSearch] = React.useState("");
  if (!mod) return null;

  const open = TICKETS.filter((t) => t.status === "Open").length;
  const inProgress = TICKETS.filter((t) => t.status === "In Progress").length;
  const resolved = TICKETS.filter((t) => t.status === "Resolved").length;
  const closed = TICKETS.filter((t) => t.status === "Closed").length;

  const filtered = TICKETS.filter((t) => {
    if (status !== "all" && t.status !== status) return false;
    if (priority !== "all" && t.priority !== priority) return false;
    if (category !== "all" && t.category !== category) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      t.id.toLowerCase().includes(q) ||
      t.subject.toLowerCase().includes(q) ||
      t.customer.toLowerCase().includes(q) ||
      t.assignee.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title={child!.label}
        description="Find and manage support tickets raised by customers and operators."
        icon={<mod.icon className="h-5 w-5" />}
        breadcrumb={[{ label: "Cryptsk" }, { label: mod.label }, { label: child!.label }]}
        actions={
          <Button variant="outline" onClick={() => toast({ title: "Export started", description: `Exporting ${filtered.length} ticket(s) to CSV.` })}>
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard label="Open" value={String(open)} icon={<AlertTriangle className="h-4 w-4" />} accent />
        <KpiCard label="In Progress" value={String(inProgress)} icon={<Clock className="h-4 w-4" />} />
        <KpiCard label="Resolved" value={String(resolved)} icon={<CheckCircle2 className="h-4 w-4" />} />
        <KpiCard label="Closed" value={String(closed)} icon={<Archive className="h-4 w-4" />} />
      </div>

      <ActionBar>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="h-8 w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All status</SelectItem>
            <SelectItem value="Open">Open</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Resolved">Resolved</SelectItem>
            <SelectItem value="Closed">Closed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priority} onValueChange={setPriority}>
          <SelectTrigger className="h-8 w-[140px]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All priority</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="High">High</SelectItem>
            <SelectItem value="Critical">Critical</SelectItem>
          </SelectContent>
        </Select>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="h-8 w-[160px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            <SelectItem value="Connectivity">Connectivity</SelectItem>
            <SelectItem value="Speed">Speed</SelectItem>
            <SelectItem value="Billing">Billing</SelectItem>
            <SelectItem value="Plan Change">Plan Change</SelectItem>
            <SelectItem value="Hardware">Hardware</SelectItem>
            <SelectItem value="Authentication">Authentication</SelectItem>
            <SelectItem value="Configuration">Configuration</SelectItem>
          </SelectContent>
        </Select>
        <div className="ml-auto flex items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search ticket / customer / assignee"
              className="h-8 w-[240px] pl-8 text-xs"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => {
              setStatus("all");
              setPriority("all");
              setCategory("all");
              setSearch("");
              toast({ title: "Filters cleared" });
            }}
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
        </div>
      </ActionBar>

      <SectionCard
        title="Tickets"
        description={`${filtered.length} ticket(s) found`}
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast({ title: "Advance search", description: "Advanced filter panel will open." })}
          >
            <Filter className="mr-1.5 h-3.5 w-3.5" /> Advance
          </Button>
        }
      >
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assignee</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((t) => (
                <TableRow
                  key={t.id}
                  className="cursor-pointer"
                  onClick={() => toast({ title: `Opening ${t.id}`, description: t.subject })}
                >
                  <TableCell className="font-mono text-xs text-primary">{t.id}</TableCell>
                  <TableCell className="max-w-[220px] truncate font-medium">{t.subject}</TableCell>
                  <TableCell className="text-muted-foreground">{t.customer}</TableCell>
                  <TableCell className="text-muted-foreground">{t.category}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={PRIORITY_BADGE[t.priority]}>{t.priority}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={STATUS_BADGE[t.status]}>{t.status}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{t.assignee}</TableCell>
                  <TableCell className="whitespace-nowrap text-xs text-muted-foreground">{t.created}</TableCell>
                  <TableCell className="whitespace-nowrap text-xs text-muted-foreground">{t.updated}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {filtered.length === 0 && (
          <EmptyState icon={<Search className="h-5 w-5" />} title="No tickets match your filters" description="Try adjusting the status, priority, category or search query." />
        )}
      </SectionCard>
    </div>
  );
}

/* ---------------- Create Ticket ---------------- */

const CATEGORIES = ["Connectivity", "Speed", "Billing", "Plan Change", "Hardware", "Authentication", "Configuration"] as const;
const PRIORITIES = ["Low", "Medium", "High", "Critical"] as const;
const ASSIGNEES = ["Field Team A", "Field Team B", "NOC L1", "NOC L2", "Billing Team", "Sales"];

function CreateTicket({ moduleId, childId }: ViewProps) {
  const { mod, child } = useModuleHeader(moduleId, childId);
  const { toast } = useToast();
  const [customer, setCustomer] = React.useState("");
  const [subject, setSubject] = React.useState("");
  const [category, setCategory] = React.useState<string>("");
  const [priority, setPriority] = React.useState<string>("Medium");
  const [assignee, setAssignee] = React.useState<string>("");
  const [description, setDescription] = React.useState("");
  if (!mod) return null;

  const submit = () => {
    if (!customer || !subject || !category || !assignee) {
      toast({ title: "Missing fields", description: "Please fill in customer, subject, category and assignee.", variant: "destructive" });
      return;
    }
    toast({
      title: "Ticket created",
      description: `TKT-${Math.floor(2042 + Math.random() * 100)} raised for ${customer}.`,
    });
    setCustomer("");
    setSubject("");
    setCategory("");
    setAssignee("");
    setDescription("");
    setPriority("Medium");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={child!.label}
        description="Open a new support ticket. Required fields are marked with *."
        icon={<mod.icon className="h-5 w-5" />}
        breadcrumb={[{ label: "Cryptsk" }, { label: mod.label }, { label: child!.label }]}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: form */}
        <div className="lg:col-span-2">
          <SectionCard title="Ticket Details" description="Capture customer issue details">
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="tk-customer">Customer *</Label>
                  <Input
                    id="tk-customer"
                    placeholder="Search customer (username / account no)"
                    value={customer}
                    onChange={(e) => setCustomer(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="tk-subject">Subject *</Label>
                  <Input
                    id="tk-subject"
                    placeholder="Brief issue summary"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Category *</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Assignee *</Label>
                  <Select value={assignee} onValueChange={setAssignee}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select assignee" />
                    </SelectTrigger>
                    <SelectContent>
                      {ASSIGNEES.map((a) => (
                        <SelectItem key={a} value={a}>{a}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Priority</Label>
                <RadioGroup
                  value={priority}
                  onValueChange={setPriority}
                  className="grid grid-cols-2 gap-2 sm:grid-cols-4"
                >
                  {PRIORITIES.map((p) => (
                    <Label
                      key={p}
                      className="flex cursor-pointer items-center gap-2 rounded-md border border-border p-2 text-sm transition-colors hover:bg-muted/40 data-[state=checked]:border-primary"
                    >
                      <RadioGroupItem value={p} />
                      <span>{p}</span>
                    </Label>
                  ))}
                </RadioGroup>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="tk-desc">Description</Label>
                <Textarea
                  id="tk-desc"
                  rows={5}
                  placeholder="Describe the issue in detail, including any troubleshooting already attempted..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label>Attachments</Label>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => toast({ title: "Attachment", description: "File picker would open here." })}
                  >
                    <Upload className="mr-2 h-3.5 w-3.5" /> Upload file
                  </Button>
                  <span className="text-xs text-muted-foreground">PNG, JPG, PDF up to 5MB</span>
                </div>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* Right: summary */}
        <div className="space-y-4">
          <SectionCard title="Ticket Summary" description="Preview before submission">
            <div className="space-y-1">
              <InfoRow label="Customer" value={customer || <span className="text-muted-foreground/60">—</span>} />
              <InfoRow label="Subject" value={subject || <span className="text-muted-foreground/60">—</span>} />
              <InfoRow label="Category" value={category || <span className="text-muted-foreground/60">—</span>} />
              <InfoRow
                label="Priority"
                value={
                  priority ? (
                    <Badge variant="outline" className={PRIORITY_BADGE[priority as Ticket["priority"]]}>{priority}</Badge>
                  ) : (
                    <span className="text-muted-foreground/60">—</span>
                  )
                }
              />
              <InfoRow label="Assignee" value={assignee || <span className="text-muted-foreground/60">—</span>} />
              <InfoRow label="Status" value={<Badge variant="outline" className={STATUS_BADGE.Open}>Open</Badge>} />
              <div className="pt-2">
                <p className="text-xs font-medium text-muted-foreground">Description</p>
                <p className="mt-1 text-sm text-foreground">{description || <span className="text-muted-foreground/60">No description provided</span>}</p>
              </div>
            </div>
          </SectionCard>

          <div className="flex flex-col gap-2">
            <Button onClick={submit}>
              <Send className="mr-2 h-4 w-4" /> Submit Ticket
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setCustomer("");
                setSubject("");
                setCategory("");
                setAssignee("");
                setDescription("");
                setPriority("Medium");
                toast({ title: "Form cleared" });
              }}
            >
              <ClipboardList className="mr-2 h-4 w-4" /> Clear Form
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
