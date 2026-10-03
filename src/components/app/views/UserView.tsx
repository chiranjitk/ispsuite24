"use client";

import * as React from "react";
import { ViewProps } from "./_shared";
import { useModuleHeader } from "./_shared";
import { PageHeader, ActionBar, KpiCard, SectionCard, EmptyState } from "@/components/app/shared";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Search,
  Send,
  Power,
  UserPlus,
  Filter,
  Download,
  MapPin,
  Network,
  Database,
  Server,
  RefreshCw,
} from "lucide-react";
import {
  LIVE_USERS,
  LIVE_USERS_TOTAL,
  ZONES,
  POOLS,
} from "@/lib/mock-data";

export function UserView({ moduleId, childId }: ViewProps) {
  const { mod } = useModuleHeader(moduleId, childId);
  if (!mod) return null;

  if (!childId) return <UserOverview moduleId={moduleId} />;
  switch (childId) {
    case "manage-users":
      return <ManageUsers moduleId={moduleId} childId={childId} />;
    case "live-users":
      return <LiveUsers moduleId={moduleId} childId={childId} />;
    case "zone":
      return <ZoneManagement moduleId={moduleId} childId={childId} />;
    case "pool":
      return <PoolManagement moduleId={moduleId} childId={childId} />;
    case "customers":
      return <ManageCustomers moduleId={moduleId} childId={childId} />;
    case "dynamize":
      return <ComingSoonPage moduleId={moduleId} childId={childId} />;
    case "demographic":
      return <ComingSoonPage moduleId={moduleId} childId={childId} />;
    default:
      return <ComingSoonPage moduleId={moduleId} childId={childId} />;
  }
}

function UserOverview({ moduleId }: { moduleId: string }) {
  const { mod } = useModuleHeader(moduleId);
  const setActive = useAppStore((s) => s.setActive);
  if (!mod) return null;
  const cards = [
    { label: "Manage Users", desc: "Search & register subscribers", icon: Users, child: "manage-users" },
    { label: "Live Users", desc: `${LIVE_USERS_TOTAL} active sessions`, icon: Network, child: "live-users" },
    { label: "Zone Management", desc: `${ZONES.length} zones configured`, icon: MapPin, child: "zone" },
    { label: "Pool Management", desc: `${POOLS.length} IP pools`, icon: Database, child: "pool" },
    { label: "Manage Customers", desc: "Customer accounts", icon: Users, child: "customers" },
    { label: "Dynamize Fields", desc: "Dynamic user fields", icon: Filter, child: "dynamize" },
    { label: "Demographic Fields", desc: "Demographic config", icon: Filter, child: "demographic" },
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

function ComingSoonPage({ moduleId, childId }: ViewProps) {
  const { mod, child } = useModuleHeader(moduleId, childId);
  if (!mod) return null;
  return (
    <div className="space-y-6">
      <PageHeader title={child?.label ?? mod.label} description={child?.desc} icon={<mod.icon className="h-5 w-5" />} breadcrumb={[{ label: "Cryptsk" }, { label: mod.label }, { label: child?.label ?? "" }]} />
      <EmptyState title="Coming soon" description="This sub-page is being wired up." />
    </div>
  );
}

/* ---------------- Manage Users ---------------- */

function ManageUsers({ moduleId, childId }: ViewProps) {
  const { mod, child } = useModuleHeader(moduleId, childId);
  const [query, setQuery] = React.useState("");
  const { toast } = useToast();
  if (!mod) return null;

  const demoResults = [
    { account: "A000002959", name: "shubham270597", plan: "PR HULC 500", status: "Active", mobile: "+91-98xxxxxx12", ip: "10.172.0.30" },
    { account: "A000003537", name: "rajesh130773", plan: "WL PR L4D OUL 800", status: "Active", mobile: "+91-99xxxxxx87", ip: "10.172.13.166" },
    { account: "A000001743", name: "suresh030381", plan: "PR OULC 500", status: "Active", mobile: "+91-97xxxxxx45", ip: "10.172.1.24" },
    { account: "A000003572", name: "sweety250397", plan: "WL PR L4D HUL 500", status: "Suspended", mobile: "+91-96xxxxxx33", ip: "10.172.9.55" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={child!.label}
        description="Search subscribers by username, account number, customer name, mobile, IP or MAC address."
        icon={<mod.icon className="h-5 w-5" />}
        breadcrumb={[{ label: "Cryptsk" }, { label: mod.label }, { label: child!.label }]}
        actions={
          <Button onClick={() => toast({ title: "New user", description: "Registration form will open here." })}>
            <UserPlus className="mr-2 h-4 w-4" /> Register User
          </Button>
        }
      />

      <SectionCard>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Enter username, Account No, customer name, mobile no, IP address or MAC address"
              className="pl-9"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="demo-field" />
            <label htmlFor="demo-field" className="text-xs text-muted-foreground">
              Demographic field search
            </label>
          </div>
          <Button>
            <Search className="mr-2 h-4 w-4" /> Search
          </Button>
        </div>
      </SectionCard>

      <SectionCard
        title="Search Results"
        description={`${demoResults.length} subscriber(s) found`}
        actions={
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-3.5 w-3.5" /> Export
          </Button>
        }
      >
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Account No</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Mobile</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {demoResults.map((u) => (
                <TableRow key={u.account}>
                  <TableCell className="font-mono text-xs">{u.account}</TableCell>
                  <TableCell className="font-medium">{u.name}</TableCell>
                  <TableCell className="text-muted-foreground">{u.plan}</TableCell>
                  <TableCell className="text-muted-foreground">{u.mobile}</TableCell>
                  <TableCell className="font-mono text-xs">{u.ip}</TableCell>
                  <TableCell>
                    <Badge
                      variant={u.status === "Active" ? "default" : "secondary"}
                      className={
                        u.status === "Active"
                          ? "bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400"
                          : "bg-primary/10 text-primary hover:bg-primary/10"
                      }
                    >
                      {u.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toast({ title: "View user", description: `Opening ${u.name}'s profile` })}
                    >
                      View
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

/* ---------------- Live Users ---------------- */

function LiveUsers({ moduleId, childId }: ViewProps) {
  const { mod, child } = useModuleHeader(moduleId, childId);
  const { toast } = useToast();
  const [search, setSearch] = React.useState("");
  const [selected, setSelected] = React.useState<Set<number>>(new Set());
  const [typeFilter, setTypeFilter] = React.useState("all");

  if (!mod) return null;

  const filtered = LIVE_USERS.filter((u) => {
    if (typeFilter !== "all" && u.userType !== typeFilter) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      u.userName.toLowerCase().includes(q) ||
      u.accountNo.toLowerCase().includes(q) ||
      u.publicIp.includes(q) ||
      u.mac.toLowerCase().includes(q)
    );
  });

  const toggleAll = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map((u) => u.sr)));
  };
  const toggleOne = (sr: number) => {
    const next = new Set(selected);
    if (next.has(sr)) next.delete(sr);
    else next.add(sr);
    setSelected(next);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={child!.label}
        description={`Total users connected: ${LIVE_USERS_TOTAL} · Current system time: Sun, Oct 4, 01:06 AM`}
        icon={<mod.icon className="h-5 w-5" />}
        breadcrumb={[{ label: "Cryptsk" }, { label: mod.label }, { label: child!.label }]}
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard label="Live Sessions" value={String(LIVE_USERS_TOTAL)} icon={<Network className="h-4 w-4" />} accent />
        <KpiCard label="PPPoE" value="768" icon={<Server className="h-4 w-4" />} />
        <KpiCard label="Leased Line" value="30" icon={<Network className="h-4 w-4" />} />
        <KpiCard label="Selected" value={String(selected.size)} icon={<Users className="h-4 w-4" />} />
      </div>

      <ActionBar>
        <Button
          size="sm"
          onClick={() =>
            toast({
              title: "Send message",
              description: selected.size
                ? `Message box opened for ${selected.size} user(s).`
                : "Message box opened for all live users.",
            })
          }
        >
          <Send className="mr-2 h-3.5 w-3.5" /> Send Message to All
        </Button>
        <Button
          size="sm"
          variant="destructive"
          disabled={!selected.size}
          onClick={() => {
            toast({
              title: "Disconnect",
              description: `${selected.size} user(s) will be disconnected.`,
              variant: "destructive",
            });
            setSelected(new Set());
          }}
        >
          <Power className="mr-2 h-3.5 w-3.5" /> Disconnect
        </Button>
        <div className="ml-auto flex items-center gap-2">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="h-8 w-[140px]">
              <SelectValue placeholder="User type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="PPPoE">PPPoE</SelectItem>
              <SelectItem value="Leased Line">Leased Line</SelectItem>
              <SelectItem value="Hotspot">Hotspot</SelectItem>
            </SelectContent>
          </Select>
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search user / IP / MAC"
              className="h-8 w-[220px] pl-8 text-xs"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm" className="h-8">
            <Filter className="mr-1.5 h-3.5 w-3.5" /> Advance
          </Button>
          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
        </div>
      </ActionBar>

      <SectionCard>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8">
                  <Checkbox
                    checked={filtered.length > 0 && selected.size === filtered.length}
                    onCheckedChange={toggleAll}
                  />
                </TableHead>
                <TableHead className="w-12">Sr.</TableHead>
                <TableHead>Account No</TableHead>
                <TableHead>User Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Connected From</TableHead>
                <TableHead>Public IP</TableHead>
                <TableHead>MAC Address</TableHead>
                <TableHead>Start Time</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Upload</TableHead>
                <TableHead>Download</TableHead>
                <TableHead>Bandwidth</TableHead>
                <TableHead>Device</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((u) => (
                <TableRow key={u.sr} data-state={selected.has(u.sr) ? "selected" : undefined}>
                  <TableCell>
                    <Checkbox
                      checked={selected.has(u.sr)}
                      onCheckedChange={() => toggleOne(u.sr)}
                    />
                  </TableCell>
                  <TableCell className="text-muted-foreground">{u.sr}</TableCell>
                  <TableCell className="font-mono text-xs">{u.accountNo}</TableCell>
                  <TableCell className="font-medium text-primary">{u.userName}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px]">{u.userType}</Badge>
                  </TableCell>
                  <TableCell className="max-w-[180px] truncate font-mono text-xs text-muted-foreground">{u.connectedFrom}</TableCell>
                  <TableCell className="font-mono text-xs">{u.publicIp}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{u.mac}</TableCell>
                  <TableCell className="whitespace-nowrap text-xs text-muted-foreground">{u.startTime}</TableCell>
                  <TableCell className="font-mono text-xs">{u.duration}</TableCell>
                  <TableCell className="text-xs">{u.upload}</TableCell>
                  <TableCell className="text-xs">{u.download}</TableCell>
                  <TableCell className="font-mono text-xs font-semibold text-primary">{u.bandwidth}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{u.deviceType}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {filtered.length === 0 && (
          <EmptyState icon={<Search className="h-5 w-5" />} title="No live users match your filters" />
        )}
        <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
          <span>Showing {filtered.length} of {LIVE_USERS_TOTAL} live users</span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <span>Page 1 / 4</span>
            <Button variant="outline" size="sm">Next »</Button>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

/* ---------------- Zone Management ---------------- */

function ZoneManagement({ moduleId, childId }: ViewProps) {
  const { mod, child } = useModuleHeader(moduleId, childId);
  const { toast } = useToast();
  if (!mod) return null;
  return (
    <div className="space-y-6">
      <PageHeader
        title={child!.label}
        description="Manage network zones and their bandwidth allocations."
        icon={<mod.icon className="h-5 w-5" />}
        breadcrumb={[{ label: "Cryptsk" }, { label: mod.label }, { label: child!.label }]}
        actions={<Button onClick={() => toast({ title: "Create zone", description: "Zone creation form will open." })}><MapPin className="mr-2 h-4 w-4" /> Create Zone</Button>}
      />
      <SectionCard title="Zones" description={`${ZONES.length} zones`}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Zone Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Users</TableHead>
                <TableHead>Bandwidth</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ZONES.map((z) => (
                <TableRow key={z.id}>
                  <TableCell className="font-mono text-xs">{z.id}</TableCell>
                  <TableCell className="font-medium">{z.name}</TableCell>
                  <TableCell className="text-muted-foreground">{z.description}</TableCell>
                  <TableCell>{z.users}</TableCell>
                  <TableCell className="font-mono text-xs">{z.bandwidth}</TableCell>
                  <TableCell>
                    <Badge variant={z.status === "Active" ? "default" : "secondary"} className={z.status === "Active" ? "bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400" : ""}>{z.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => toast({ title: "Edit zone", description: z.name })}>Edit</Button>
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

/* ---------------- Pool Management ---------------- */

function PoolManagement({ moduleId, childId }: ViewProps) {
  const { mod, child } = useModuleHeader(moduleId, childId);
  const { toast } = useToast();
  if (!mod) return null;
  return (
    <div className="space-y-6">
      <PageHeader
        title={child!.label}
        description="Manage IP address pools assigned to zones."
        icon={<mod.icon className="h-5 w-5" />}
        breadcrumb={[{ label: "Cryptsk" }, { label: mod.label }, { label: child!.label }]}
        actions={<Button onClick={() => toast({ title: "Create pool" })}><Database className="mr-2 h-4 w-4" /> Create Pool</Button>}
      />
      <SectionCard title="IP Pools" description={`${POOLS.length} pools`}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Pool Name</TableHead>
                <TableHead>Zone</TableHead>
                <TableHead>Subnet</TableHead>
                <TableHead>Gateway</TableHead>
                <TableHead>Utilization</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {POOLS.map((p) => {
                const pct = Math.round((p.used / p.total) * 100);
                return (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono text-xs">{p.id}</TableCell>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell className="text-muted-foreground">{p.zone}</TableCell>
                    <TableCell className="font-mono text-xs">{p.subnet}</TableCell>
                    <TableCell className="font-mono text-xs">{p.gateway}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                          <div className={pct > 80 ? "h-full bg-primary" : "h-full bg-emerald-500"} style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs text-muted-foreground">{p.used}/{p.total}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => toast({ title: "Edit pool", description: p.name })}>Edit</Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </SectionCard>
    </div>
  );
}

/* ---------------- Manage Customers ---------------- */

function ManageCustomers({ moduleId, childId }: ViewProps) {
  const { mod, child } = useModuleHeader(moduleId, childId);
  if (!mod) return null;
  const customers = [
    { id: "CUST001", name: "Shubham Kumar", mobile: "+91-98xxxxxx12", email: "shubham@example.com", area: "Bhiwani-Core", accounts: 1, status: "Active" },
    { id: "CUST002", name: "Rajesh Verma", mobile: "+91-99xxxxxx87", email: "rajesh@example.com", area: "Bhiwani-North", accounts: 2, status: "Active" },
    { id: "CUST003", name: "Suresh Yadav", mobile: "+91-97xxxxxx45", email: "suresh@example.com", area: "Bhiwani-South", accounts: 1, status: "Active" },
    { id: "CUST004", name: "Sweety Devi", mobile: "+91-96xxxxxx33", email: "sweety@example.com", area: "Bhiwani-East", accounts: 1, status: "Suspended" },
    { id: "CUST005", name: "Manish Sharma", mobile: "+91-90xxxxxx19", email: "manish@example.com", area: "Bhiwani-West", accounts: 3, status: "Active" },
  ];
  return (
    <div className="space-y-6">
      <PageHeader
        title={child!.label}
        description="Customer accounts and their linked subscriber profiles."
        icon={<mod.icon className="h-5 w-5" />}
        breadcrumb={[{ label: "Cryptsk" }, { label: mod.label }, { label: child!.label }]}
      />
      <SectionCard title="Customers" description={`${customers.length} customers`}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Mobile</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Area</TableHead>
                <TableHead>Accounts</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-mono text-xs">{c.id}</TableCell>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell className="text-muted-foreground">{c.mobile}</TableCell>
                  <TableCell className="text-muted-foreground">{c.email}</TableCell>
                  <TableCell className="text-muted-foreground">{c.area}</TableCell>
                  <TableCell>{c.accounts}</TableCell>
                  <TableCell>
                    <Badge variant={c.status === "Active" ? "default" : "secondary"} className={c.status === "Active" ? "bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400" : "bg-primary/10 text-primary hover:bg-primary/10"}>{c.status}</Badge>
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
