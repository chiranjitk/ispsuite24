"use client";

import * as React from "react";
import { ViewProps, useModuleHeader, useViewRouter, ChildOverview, LeafPlaceholder } from "./_shared";
import { PageHeader, KpiCard, SectionCard, EmptyState, ActionBar } from "@/components/app/shared";
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
} from "@/components/ui/dialog";
import {
  Users as UsersIcon,
  Network,
  MapPin,
  Database,
  Filter,
  UserPlus,
  Search,
  Send,
  Power,
  Download,
  Pencil,
  Trash2,
  Save,
  X,
  AlertCircle,
  Loader2,
  RefreshCw,
  Activity,
} from "lucide-react";
import { usersApi, liveUsersApi, zonesApi, type User, type LiveUser, type Zone } from "@/lib/api";
import { ZONES, POOLS } from "@/lib/mock-data";

export function UserView({ moduleId, childId, grandchildId }: ViewProps) {
  const router = useViewRouter(moduleId, childId, grandchildId);

  if (router.state === "loading") return null;
  if (router.state === "module-overview") return <UserOverview moduleId={moduleId} />;
  if (router.state === "child-overview")
    return <ChildOverview moduleId={moduleId} childId={router.childId} />;

  if (router.state === "grandchild") {
    // Bespoke grandchild handlers for the User module
    if (childId === "manage-users" && grandchildId === "add-user")
      return <AddUserPage moduleId={moduleId} childId={childId} grandchildId={grandchildId} />;
    if (childId === "manage-users" && grandchildId === "search-user")
      return <SearchUserPage moduleId={moduleId} childId={childId} grandchildId={grandchildId} />;
    if (childId === "manage-users" && grandchildId === "advance-search")
      return <SearchUserPage moduleId={moduleId} childId={childId} grandchildId={grandchildId} />;
    if (childId === "live-users" && grandchildId === "manage-live-users")
      return <ManageLiveUsersPage moduleId={moduleId} childId={childId} grandchildId={grandchildId} />;
    if (childId === "live-users" && grandchildId === "search-live-users")
      return <SearchLiveUsersPage moduleId={moduleId} childId={childId} grandchildId={grandchildId} />;
    if (childId === "zone" && grandchildId === "create-zone")
      return <CreateZonePage moduleId={moduleId} childId={childId} grandchildId={grandchildId} />;
    if (childId === "zone" && grandchildId === "manage-zone")
      return <ManageZonesPage moduleId={moduleId} childId={childId} grandchildId={grandchildId} />;
    if (childId === "zone" && grandchildId === "search-zone-admin")
      return <ManageZonesPage moduleId={moduleId} childId={childId} grandchildId={grandchildId} />;

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
    case "zone":
      return <ZoneManagement moduleId={moduleId} childId={childId} />;
    case "pool":
      return <PoolManagement moduleId={moduleId} childId={childId} />;
    case "customers":
      return <ManageCustomers moduleId={moduleId} childId={childId} />;
    default:
      return <UserOverview moduleId={moduleId} />;
  }
}

/* ---------------- Overview ---------------- */

function UserOverview({ moduleId }: { moduleId: string }) {
  const { mod } = useModuleHeader(moduleId);
  const setActive = useAppStore((s) => s.setActive);
  const [userCount, setUserCount] = React.useState<number | null>(null);
  const [liveCount, setLiveCount] = React.useState<number | null>(null);

  React.useEffect(() => {
    usersApi.list().then((res) => setUserCount(res.data?.length ?? 0));
    liveUsersApi.list().then((res) => setLiveCount(res.total ?? 0));
  }, []);

  if (!mod) return null;
  const cards = [
    { label: "Manage Users", desc: "Add, search & manage subscribers", icon: UsersIcon, child: "manage-users" },
    { label: "Live Users", desc: `${liveCount ?? "…"} live sessions`, icon: Network, child: "live-users" },
    { label: "Zone Management", desc: `${ZONES.length} zones configured`, icon: MapPin, child: "zone" },
    { label: "Pool Management", desc: `${POOLS.length} IP pools`, icon: Database, child: "pool" },
    { label: "Manage Customers", desc: "Customer accounts", icon: UsersIcon, child: "customers" },
    { label: "Dynamize Fields", desc: "Dynamic user fields", icon: Filter, child: "dynamize" },
    { label: "Demographic Fields", desc: "Demographic config", icon: Filter, child: "demographic" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title={mod.label} description={mod.desc} icon={<mod.icon className="h-5 w-5" />} />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard label="Total Users" value={userCount == null ? "…" : String(userCount)} icon={<UsersIcon className="h-4 w-4" />} accent />
        <KpiCard label="Live Sessions" value={liveCount == null ? "…" : String(liveCount)} icon={<Activity className="h-4 w-4" />} />
        <KpiCard label="Zones" value={String(ZONES.length)} icon={<MapPin className="h-4 w-4" />} />
        <KpiCard label="IP Pools" value={String(POOLS.length)} icon={<Database className="h-4 w-4" />} />
      </div>
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
              <p className="font-medium text-foreground">{c.label}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{c.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ================ ADD USER (REAL FUNCTIONAL) ================ */

function AddUserPage({ moduleId, childId, grandchildId }: ViewProps) {
  const { mod, child, grandchild } = useModuleHeader(moduleId, childId, grandchildId);
  const setActive = useAppStore((s) => s.setActive);
  const { toast } = useToast();
  const [saving, setSaving] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  // Form state — mirrors SubscriberHelper.sendCreateUserReqMap fields
  const [form, setForm] = React.useState({
    username: "",
    name: "",
    password: "",
    emailid: "",
    phone: "",
    userType: "User",
    packageName: "unlimited hours 30 days",
    zoneName: "Bhiwani-Core",
    poolName: "Pool-Bhiwani0",
    address1: "",
    address2: "",
    city: "",
    state: "",
    country: "India",
    zip: "",
    macaddress: "",
    ipaddress: "",
    bindToMacStatus: "No" as "Yes" | "No",
    loginRestrictionType: "Open" as "Open" | "Individual" | "Pool" | "Vlan" | "Network",
    invoiceGenerateStatus: "No" as "Yes" | "No",
    multipleLoginLimit: "1",
    nasIdentifier: "",
    vlanTag: "1",
    birthdate: "",
  });

  const set = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => { const n = { ...e }; delete n[field]; return n; });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});

    const res = await usersApi.create({
      ...form,
      multipleLoginLimit: Number(form.multipleLoginLimit),
      vlanTag: Number(form.vlanTag),
    });

    setSaving(false);

    if (res.responseCode === "0") {
      toast({
        title: "User created",
        description: `Subscriber "${form.username}" has been created successfully.`,
      });
      setActive(moduleId, "manage-users", "search-user");
    } else {
      if (res.errors) setErrors(res.errors);
      toast({
        title: "Failed to create user",
        description: res.responseMsg,
        variant: "destructive",
      });
    }
  };

  if (!mod || !child) return null;

  return (
    <div className="space-y-6">
      <PageHeader
        title={grandchild?.label ?? "Add User"}
        description="Register a new subscriber. Fields mirror the accsium UserService.createUser API."
        icon={<mod.icon className="h-5 w-5" />}
        breadcrumb={[
          { label: "Cryptsk" },
          { label: mod.label, onClick: () => setActive(moduleId, "", "") },
          { label: child.label, onClick: () => setActive(moduleId, childId, "") },
          { label: grandchild?.label ?? "Add User" },
        ]}
        actions={
          <Button variant="outline" onClick={() => setActive(moduleId, "manage-users", "search-user")}>
            <X className="mr-2 h-4 w-4" /> Cancel
          </Button>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Account Information */}
        <SectionCard title="Account Information" description="Login credentials and user type">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="username">
                Username <span className="text-primary">*</span>
              </Label>
              <Input
                id="username"
                value={form.username}
                onChange={(e) => set("username", e.target.value)}
                placeholder="e.g. john.doe"
                className={errors.username ? "border-primary" : ""}
              />
              {errors.username && (
                <p className="text-xs text-primary flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.username}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">
                Password <span className="text-primary">*</span>
              </Label>
              <Input
                id="password"
                type="password"
                value={form.password}
                onChange={(e) => set("password", e.target.value)}
                placeholder="••••••••"
                className={errors.password ? "border-primary" : ""}
              />
              {errors.password && (
                <p className="text-xs text-primary flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.password}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">
                Customer Name <span className="text-primary">*</span>
              </Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="Full name"
                className={errors.name ? "border-primary" : ""}
              />
              {errors.name && (
                <p className="text-xs text-primary flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.name}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>
                User Type <span className="text-primary">*</span>
              </Label>
              <Select value={form.userType} onValueChange={(v) => set("userType", v)}>
                <SelectTrigger className={errors.userType ? "border-primary" : ""}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="User">User (Normal)</SelectItem>
                  <SelectItem value="Administrator">Administrator</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="Operator">Operator</SelectItem>
                  <SelectItem value="PopManager">POP Manager</SelectItem>
                  <SelectItem value="Zone Manager">Zone Manager</SelectItem>
                  <SelectItem value="Zone Operator">Zone Operator</SelectItem>
                  <SelectItem value="Leased Line">Leased Line</SelectItem>
                </SelectContent>
              </Select>
              {errors.userType && (
                <p className="text-xs text-primary">{errors.userType}</p>
              )}
            </div>
          </div>
        </SectionCard>

        {/* Package & Zone */}
        <SectionCard title="Package & Zone" description="Billing plan and network assignment">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>
                Package <span className="text-primary">*</span>
              </Label>
              <Select value={form.packageName} onValueChange={(v) => set("packageName", v)}>
                <SelectTrigger className={errors.packageName ? "border-primary" : ""}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Zero hours Zero days">Zero hours Zero days</SelectItem>
                  <SelectItem value="1 hour 1 day">1 hour 1 day</SelectItem>
                  <SelectItem value="3 hours 1 day">3 hours 1 day</SelectItem>
                  <SelectItem value="unlimited hours 1 day">Unlimited hours 1 day</SelectItem>
                  <SelectItem value="unlimited hours 3 days">Unlimited hours 3 days</SelectItem>
                  <SelectItem value="unlimited hours 7 days">Unlimited hours 7 days</SelectItem>
                  <SelectItem value="unlimited hours 30 days">Unlimited hours 30 days</SelectItem>
                  <SelectItem value="1 hour">1 hour</SelectItem>
                </SelectContent>
              </Select>
              {errors.packageName && (
                <p className="text-xs text-primary">{errors.packageName}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Zone</Label>
              <Select value={form.zoneName} onValueChange={(v) => set("zoneName", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ZONES.map((z) => (
                    <SelectItem key={z.id} value={z.name}>{z.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>IP Pool</Label>
              <Select value={form.poolName} onValueChange={(v) => set("poolName", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {POOLS.map((p) => (
                    <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Login Restriction</Label>
              <Select value={form.loginRestrictionType} onValueChange={(v) => set("loginRestrictionType", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="Individual">Individual (IP)</SelectItem>
                  <SelectItem value="Pool">Pool</SelectItem>
                  <SelectItem value="Vlan">VLAN</SelectItem>
                  <SelectItem value="Network">Network</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </SectionCard>

        {/* Contact Information */}
        <SectionCard title="Contact Information" description="Subscriber contact details">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="emailid">Email</Label>
              <Input id="emailid" type="email" value={form.emailid} onChange={(e) => set("emailid", e.target.value)} placeholder="user@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+91-98xxxxxxxx" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address1">Address Line 1</Label>
              <Input id="address1" value={form.address1} onChange={(e) => set("address1", e.target.value)} placeholder="House no, Street" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" value={form.city} onChange={(e) => set("city", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input id="state" value={form.state} onChange={(e) => set("state", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zip">ZIP / Postal Code</Label>
              <Input id="zip" value={form.zip} onChange={(e) => set("zip", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input id="country" value={form.country} onChange={(e) => set("country", e.target.value)} />
            </div>
          </div>
        </SectionCard>

        {/* Network & Session */}
        <SectionCard title="Network & Session" description="MAC, IP, and login settings">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="macaddress">MAC Address</Label>
              <Input id="macaddress" value={form.macaddress} onChange={(e) => set("macaddress", e.target.value)} placeholder="00:1A:2B:3C:4D:5E" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ipaddress">IP Address</Label>
              <Input id="ipaddress" value={form.ipaddress} onChange={(e) => set("ipaddress", e.target.value)} placeholder="10.172.0.x" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="multipleLoginLimit">Multiple Login Limit</Label>
              <Input
                id="multipleLoginLimit"
                type="number"
                min="1"
                value={form.multipleLoginLimit}
                onChange={(e) => set("multipleLoginLimit", e.target.value)}
                disabled={form.userType === "Leased Line"}
                className={errors.multipleLoginLimit ? "border-primary" : ""}
              />
              {errors.multipleLoginLimit && (
                <p className="text-xs text-primary">{errors.multipleLoginLimit}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="nasIdentifier">NAS Identifier</Label>
              <Input
                id="nasIdentifier"
                value={form.nasIdentifier}
                onChange={(e) => set("nasIdentifier", e.target.value)}
                placeholder={form.userType === "Leased Line" ? "Required for Leased Line" : "Optional"}
                className={errors.nasIdentifier ? "border-primary" : ""}
              />
              {errors.nasIdentifier && (
                <p className="text-xs text-primary">{errors.nasIdentifier}</p>
              )}
            </div>
            <div className="flex items-center gap-3 md:col-span-2">
              <Switch
                id="bindToMac"
                checked={form.bindToMacStatus === "Yes"}
                onCheckedChange={(v) => set("bindToMacStatus", v ? "Yes" : "No")}
              />
              <div>
                <Label htmlFor="bindToMac" className="cursor-pointer">Bind to MAC</Label>
                <p className="text-xs text-muted-foreground">Require user to connect from the specified MAC address</p>
              </div>
            </div>
            <div className="flex items-center gap-3 md:col-span-2">
              <Switch
                id="invoiceGen"
                checked={form.invoiceGenerateStatus === "Yes"}
                onCheckedChange={(v) => set("invoiceGenerateStatus", v ? "Yes" : "No")}
              />
              <div>
                <Label htmlFor="invoiceGen" className="cursor-pointer">Generate Invoice on Creation</Label>
                <p className="text-xs text-muted-foreground">Automatically create an invoice when the user is created</p>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => setActive(moduleId, "manage-users", "search-user")}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating…</>
            ) : (
              <><Save className="mr-2 h-4 w-4" /> Create User</>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

/* ================ SEARCH USER (REAL FUNCTIONAL) ================ */

function SearchUserPage({ moduleId, childId, grandchildId }: ViewProps) {
  const { mod, child, grandchild } = useModuleHeader(moduleId, childId, grandchildId);
  const setActive = useAppStore((s) => s.setActive);
  const { toast } = useToast();
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [userTypeFilter, setUserTypeFilter] = React.useState("all");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [selected, setSelected] = React.useState<Set<number>>(new Set());
  const [deleteTarget, setDeleteTarget] = React.useState<User | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  const load = React.useCallback(() => {
    setLoading(true);
    usersApi
      .list({
        search: search || undefined,
        userType: userTypeFilter !== "all" ? userTypeFilter : undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
      })
      .then((res) => {
        setUsers(res.data ?? []);
        setLoading(false);
      });
  }, [search, userTypeFilter, statusFilter]);

  React.useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  const toggleAll = () => {
    if (selected.size === users.length) setSelected(new Set());
    else setSelected(new Set(users.map((u) => u.userid)));
  };
  const toggleOne = (id: number) => {
    setSelected((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  };

  const handleStatusChange = async (newStatus: "Y" | "D" | "N") => {
    if (selected.size === 0) return;
    const res = await usersApi.changeStatus(Array.from(selected), newStatus);
    if (res.responseCode === "0") {
      toast({ title: "Status updated", description: res.responseMsg });
      setSelected(new Set());
      load();
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const res = await usersApi.delete(deleteTarget.userid);
    setDeleting(false);
    if (res.responseCode === "0") {
      toast({ title: "User deleted", description: `"${deleteTarget.username}" was deleted.` });
      setDeleteTarget(null);
      load();
    } else {
      toast({ title: "Delete failed", description: res.responseMsg, variant: "destructive" });
    }
  };

  if (!mod || !child) return null;

  return (
    <div className="space-y-6">
      <PageHeader
        title={grandchild?.label ?? "Search User"}
        description="Search subscribers by username, account number, name, mobile, IP or MAC. Data is backed by the users API."
        icon={<mod.icon className="h-5 w-5" />}
        breadcrumb={[
          { label: "Cryptsk" },
          { label: mod.label, onClick: () => setActive(moduleId, "", "") },
          { label: child.label, onClick: () => setActive(moduleId, childId, "") },
          { label: grandchild?.label ?? "Search" },
        ]}
        actions={
          <Button onClick={() => setActive(moduleId, "manage-users", "add-user")}>
            <UserPlus className="mr-2 h-4 w-4" /> Add User
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard label="Total Users" value={String(users.length)} icon={<UsersIcon className="h-4 w-4" />} accent />
        <KpiCard label="Active" value={String(users.filter((u) => u.active === "Y").length)} icon={<Activity className="h-4 w-4" />} />
        <KpiCard label="Deactive" value={String(users.filter((u) => u.active === "D").length)} icon={<UsersIcon className="h-4 w-4" />} />
        <KpiCard label="Selected" value={String(selected.size)} icon={<Filter className="h-4 w-4" />} />
      </div>

      <ActionBar>
        <div className="relative flex-1 max-w-xs">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search username, name, IP, MAC…"
            className="h-8 pl-8 text-xs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={userTypeFilter} onValueChange={setUserTypeFilter}>
          <SelectTrigger className="h-8 w-[140px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="User">User</SelectItem>
            <SelectItem value="Administrator">Administrator</SelectItem>
            <SelectItem value="Manager">Manager</SelectItem>
            <SelectItem value="Operator">Operator</SelectItem>
            <SelectItem value="Leased Line">Leased Line</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-8 w-[120px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All status</SelectItem>
            <SelectItem value="Y">Active</SelectItem>
            <SelectItem value="D">Deactive</SelectItem>
            <SelectItem value="N">Suspended</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" className="h-8" onClick={load}>
          <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Refresh
        </Button>
        {selected.size > 0 && (
          <>
            <Button size="sm" className="h-8" onClick={() => handleStatusChange("Y")}>
              <Power className="mr-1.5 h-3.5 w-3.5" /> Activate
            </Button>
            <Button size="sm" variant="destructive" className="h-8" onClick={() => handleStatusChange("N")}>
              <Power className="mr-1.5 h-3.5 w-3.5" /> Suspend
            </Button>
          </>
        )}
      </ActionBar>

      <SectionCard>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : users.length === 0 ? (
          <EmptyState
            icon={<Search className="h-5 w-5" />}
            title="No users found"
            description="Try adjusting your search or filters."
            action={<Button onClick={() => setActive(moduleId, "manage-users", "add-user")}><UserPlus className="mr-2 h-4 w-4" /> Add User</Button>}
          />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-8">
                    <Checkbox checked={users.length > 0 && selected.size === users.length} onCheckedChange={toggleAll} />
                  </TableHead>
                  <TableHead>Account No</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Package</TableHead>
                  <TableHead>Zone</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.userid} data-state={selected.has(u.userid) ? "selected" : undefined}>
                    <TableCell><Checkbox checked={selected.has(u.userid)} onCheckedChange={() => toggleOne(u.userid)} /></TableCell>
                    <TableCell className="font-mono text-xs">{u.accountid}</TableCell>
                    <TableCell className="font-medium text-primary">{u.username}</TableCell>
                    <TableCell>{u.name}</TableCell>
                    <TableCell><Badge variant="outline" className="text-[10px]">{u.userType}</Badge></TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-[140px] truncate">{u.packageName}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{u.zoneName}</TableCell>
                    <TableCell className="text-xs">
                      <div>{u.emailid || "—"}</div>
                      <div className="text-muted-foreground">{u.phone || "—"}</div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={u.active === "Y" ? "default" : u.active === "D" ? "secondary" : "destructive"}
                        className={
                          u.active === "Y"
                            ? "bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400"
                            : u.active === "N"
                            ? "bg-primary/10 text-primary hover:bg-primary/10"
                            : ""
                        }
                      >
                        {u.active === "Y" ? "Active" : u.active === "D" ? "Deactive" : "Suspended"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => toast({ title: "Edit user", description: `Editing ${u.username}` })}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-primary hover:text-primary" onClick={() => setDeleteTarget(u)}>
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

      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete User</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete <span className="font-medium text-foreground">{deleteTarget?.username}</span> ({deleteTarget?.name})? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)} disabled={deleting}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting…</> : <><Trash2 className="mr-2 h-4 w-4" /> Delete</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ================ MANAGE LIVE USERS (REAL FUNCTIONAL) ================ */

function ManageLiveUsersPage({ moduleId, childId, grandchildId }: ViewProps) {
  const { mod, child, grandchild } = useModuleHeader(moduleId, childId, grandchildId);
  const setActive = useAppStore((s) => s.setActive);
  const { toast } = useToast();
  const [users, setUsers] = React.useState<LiveUser[]>([]);
  const [totalConnected, setTotalConnected] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState("all");
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const [messageOpen, setMessageOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [sending, setSending] = React.useState(false);

  const load = React.useCallback(() => {
    setLoading(true);
    liveUsersApi
      .list({ search: search || undefined, type: typeFilter !== "all" ? typeFilter : undefined })
      .then((res) => {
        setUsers(res.data ?? []);
        setTotalConnected(res.totalConnected ?? 0);
        setLoading(false);
      });
  }, [search, typeFilter]);

  React.useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  const toggleAll = () => {
    if (selected.size === users.length) setSelected(new Set());
    else setSelected(new Set(users.map((u) => u.sessionid)));
  };
  const toggleOne = (sid: string) => {
    setSelected((s) => {
      const n = new Set(s);
      if (n.has(sid)) n.delete(sid);
      else n.add(sid);
      return n;
    });
  };

  const handleDisconnect = async () => {
    if (selected.size === 0) return;
    const res = await liveUsersApi.disconnect(Array.from(selected));
    if (res.responseCode === "0") {
      toast({ title: "Users disconnected", description: res.responseMsg, variant: "destructive" });
      setSelected(new Set());
      load();
    }
  };

  const handleSendMessage = async () => {
    setSending(true);
    const res = await liveUsersApi.sendMessage(Array.from(selected), message);
    setSending(false);
    if (res.responseCode === "0") {
      toast({ title: "Message sent", description: res.responseMsg });
      setMessageOpen(false);
      setMessage("");
    }
  };

  if (!mod || !child) return null;

  return (
    <div className="space-y-6">
      <PageHeader
        title={grandchild?.label ?? "Manage Live Users"}
        description={`Total users connected: ${totalConnected} · Current system time: ${new Date().toLocaleString()}`}
        icon={<mod.icon className="h-5 w-5" />}
        breadcrumb={[
          { label: "Cryptsk" },
          { label: mod.label, onClick: () => setActive(moduleId, "", "") },
          { label: child.label, onClick: () => setActive(moduleId, childId, "") },
          { label: grandchild?.label ?? "Manage" },
        ]}
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard label="Live Sessions" value={String(totalConnected)} icon={<Network className="h-4 w-4" />} accent />
        <KpiCard label="Showing" value={String(users.length)} icon={<Activity className="h-4 w-4" />} />
        <KpiCard label="PPPoE" value={String(users.filter((u) => u.userType === "PPPoE").length)} icon={<Network className="h-4 w-4" />} />
        <KpiCard label="Selected" value={String(selected.size)} icon={<UsersIcon className="h-4 w-4" />} />
      </div>

      <ActionBar>
        <Button size="sm" onClick={() => setMessageOpen(true)}>
          <Send className="mr-2 h-3.5 w-3.5" /> Send Message to All
        </Button>
        <Button size="sm" variant="destructive" disabled={!selected.size} onClick={handleDisconnect}>
          <Power className="mr-2 h-3.5 w-3.5" /> Disconnect ({selected.size})
        </Button>
        <div className="ml-auto flex items-center gap-2">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="h-8 w-[140px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="PPPoE">PPPoE</SelectItem>
              <SelectItem value="Leased Line">Leased Line</SelectItem>
              <SelectItem value="Hotspot">Hotspot</SelectItem>
            </SelectContent>
          </Select>
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search user / IP / MAC" className="h-8 w-[220px] pl-8 text-xs" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={load}>
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
        </div>
      </ActionBar>

      <SectionCard>
        {loading ? (
          <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
        ) : users.length === 0 ? (
          <EmptyState icon={<Search className="h-5 w-5" />} title="No live users match your filters" />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-8"><Checkbox checked={users.length > 0 && selected.size === users.length} onCheckedChange={toggleAll} /></TableHead>
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
                {users.map((u) => (
                  <TableRow key={u.sr} data-state={selected.has(u.sessionid) ? "selected" : undefined}>
                    <TableCell><Checkbox checked={selected.has(u.sessionid)} onCheckedChange={() => toggleOne(u.sessionid)} /></TableCell>
                    <TableCell className="text-muted-foreground">{u.sr}</TableCell>
                    <TableCell className="font-mono text-xs">{u.accountNo}</TableCell>
                    <TableCell className="font-medium text-primary">{u.userName}</TableCell>
                    <TableCell><Badge variant="outline" className="text-[10px]">{u.userType}</Badge></TableCell>
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
        )}
        <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
          <span>Showing {users.length} of {totalConnected} live users</span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <span>Page 1 / {Math.ceil(totalConnected / 250)}</span>
            <Button variant="outline" size="sm">Next »</Button>
          </div>
        </div>
      </SectionCard>

      {/* Send Message Dialog */}
      <Dialog open={messageOpen} onOpenChange={setMessageOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Send Message to Live Users</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">
            {selected.size > 0
              ? `Sending to ${selected.size} selected user(s).`
              : `Sending to all ${totalConnected} live users.`}
          </p>
          <Textarea
            placeholder="Type your message…"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setMessageOpen(false)}>Cancel</Button>
            <Button onClick={handleSendMessage} disabled={sending || !message.trim()}>
              {sending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending…</> : <><Send className="mr-2 h-4 w-4" /> Send</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ================ SEARCH LIVE USERS (REAL FUNCTIONAL - same data, search-focused) ================ */

function SearchLiveUsersPage({ moduleId, childId, grandchildId }: ViewProps) {
  const { mod, child, grandchild } = useModuleHeader(moduleId, childId, grandchildId);
  const setActive = useAppStore((s) => s.setActive);
  const [users, setUsers] = React.useState<LiveUser[]>([]);
  const [totalConnected, setTotalConnected] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");

  const load = React.useCallback(() => {
    setLoading(true);
    liveUsersApi.list({ search: search || undefined }).then((res) => {
      setUsers(res.data ?? []);
      setTotalConnected(res.totalConnected ?? 0);
      setLoading(false);
    });
  }, [search]);

  React.useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  if (!mod || !child) return null;

  return (
    <div className="space-y-6">
      <PageHeader
        title={grandchild?.label ?? "Search Live Users"}
        description="Search active sessions by username, IP, or MAC address."
        icon={<mod.icon className="h-5 w-5" />}
        breadcrumb={[
          { label: "Cryptsk" },
          { label: mod.label, onClick: () => setActive(moduleId, "", "") },
          { label: child.label, onClick: () => setActive(moduleId, childId, "") },
          { label: grandchild?.label ?? "Search" },
        ]}
      />

      <SectionCard title="Search Criteria" description="Enter username, IP, or MAC to find live sessions">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Enter username, IP address, or MAC address"
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button onClick={load}><Search className="mr-2 h-4 w-4" /> Search</Button>
        </div>
      </SectionCard>

      <SectionCard title="Search Results" description={`${users.length} live session(s) found`}>
        {loading ? (
          <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
        ) : users.length === 0 ? (
          <EmptyState icon={<Search className="h-5 w-5" />} title="No live sessions found" description="Enter a search term above." />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account No</TableHead>
                  <TableHead>User Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Public IP</TableHead>
                  <TableHead>MAC Address</TableHead>
                  <TableHead>Start Time</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Bandwidth</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.sr}>
                    <TableCell className="font-mono text-xs">{u.accountNo}</TableCell>
                    <TableCell className="font-medium text-primary">{u.userName}</TableCell>
                    <TableCell><Badge variant="outline" className="text-[10px]">{u.userType}</Badge></TableCell>
                    <TableCell className="font-mono text-xs">{u.publicIp}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{u.mac}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{u.startTime}</TableCell>
                    <TableCell className="font-mono text-xs">{u.duration}</TableCell>
                    <TableCell className="font-mono text-xs font-semibold text-primary">{u.bandwidth}</TableCell>
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

/* ================ Zone Management (existing, uses mock) ================ */

function ZoneManagement({ moduleId, childId }: ViewProps) {
  // Delegate to the real ManageZonesPage (legacy entry point)
  return <ManageZonesPage moduleId={moduleId} childId={childId} grandchildId="" />;
}

/* ================ CREATE ZONE (REAL FUNCTIONAL) ================ */

function CreateZonePage({ moduleId, childId, grandchildId }: ViewProps) {
  const { mod, child, grandchild } = useModuleHeader(moduleId, childId, grandchildId);
  const setActive = useAppStore((s) => s.setActive);
  const { toast } = useToast();
  const [saving, setSaving] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const [form, setForm] = React.useState({
    zonename: "",
    description: "",
    billingname: "",
    maxconcurrentusers: "500",
    pindiscount: "0",
    packagediscount: "0",
    discounton: "TOTAL" as "TOTAL" | "PACKAGE" | "PIN",
    popname: "Bhiwani-POP1",
    mincreditbalance: "0",
    taxondiscount: "N" as "Y" | "N",
    bandwidth: "100 Mbps",
    status: "Y" as "Y" | "N",
  });

  const set = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => { const n = { ...e }; delete n[field]; return n; });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    const res = await zonesApi.create({
      ...form,
      maxconcurrentusers: Number(form.maxconcurrentusers),
      pindiscount: Number(form.pindiscount),
      packagediscount: Number(form.packagediscount),
      mincreditbalance: Number(form.mincreditbalance),
    });
    setSaving(false);
    if (res.responseCode === "0") {
      toast({ title: "Zone created", description: `"${form.zonename}" has been created successfully.` });
      setActive(moduleId, "zone", "manage-zone");
    } else {
      if (res.errors) setErrors(res.errors);
      toast({ title: "Failed to create zone", description: res.responseMsg, variant: "destructive" });
    }
  };

  if (!mod || !child) return null;

  return (
    <div className="space-y-6">
      <PageHeader
        title={grandchild?.label ?? "Create Zone"}
        description="Create a new network zone. Fields mirror the accsium ZoneService.createZone API."
        icon={<mod.icon className="h-5 w-5" />}
        breadcrumb={[
          { label: "Cryptsk" },
          { label: mod.label, onClick: () => setActive(moduleId, "", "") },
          { label: child.label, onClick: () => setActive(moduleId, childId, "") },
          { label: grandchild?.label ?? "Create" },
        ]}
        actions={<Button variant="outline" onClick={() => setActive(moduleId, "zone", "manage-zone")}><X className="mr-2 h-4 w-4" /> Cancel</Button>}
      />
      <form onSubmit={handleSubmit} className="space-y-6">
        <SectionCard title="Zone Information" description="Name and description">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="zonename">Zone Name <span className="text-primary">*</span></Label>
              <Input id="zonename" value={form.zonename} onChange={(e) => set("zonename", e.target.value)} placeholder="e.g. Bhiwani-North" className={errors.zonename ? "border-primary" : ""} />
              {errors.zonename && <p className="text-xs text-primary flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {errors.zonename}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="billingname">Billing Name</Label>
              <Input id="billingname" value={form.billingname} onChange={(e) => set("billingname", e.target.value)} placeholder="Name for invoices" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Zone description…" rows={2} />
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Capacity & Bandwidth" description="Concurrent user limits and bandwidth">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="maxconcurrentusers">Max Concurrent Users</Label>
              <Input id="maxconcurrentusers" type="number" min="0" value={form.maxconcurrentusers} onChange={(e) => set("maxconcurrentusers", e.target.value)} className={errors.maxconcurrentusers ? "border-primary" : ""} />
              {errors.maxconcurrentusers && <p className="text-xs text-primary">{errors.maxconcurrentusers}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="bandwidth">Bandwidth</Label>
              <Input id="bandwidth" value={form.bandwidth} onChange={(e) => set("bandwidth", e.target.value)} placeholder="e.g. 1 Gbps" />
            </div>
            <div className="space-y-2">
              <Label>POP (Point of Presence)</Label>
              <Select value={form.popname} onValueChange={(v) => set("popname", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bhiwani-POP1">Bhiwani-POP1</SelectItem>
                  <SelectItem value="Bhiwani-POP2">Bhiwani-POP2</SelectItem>
                  <SelectItem value="Bhiwani-POP3">Bhiwani-POP3</SelectItem>
                  <SelectItem value="Rohtak-POP1">Rohtak-POP1</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={form.status} onValueChange={(v) => set("status", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Y">Active</SelectItem>
                  <SelectItem value="N">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Discount & Billing" description="Pin/package discounts and credit settings">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="pindiscount">Pin Discount (%)</Label>
              <Input id="pindiscount" type="number" step="0.01" min="0" value={form.pindiscount} onChange={(e) => set("pindiscount", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="packagediscount">Package Discount (%)</Label>
              <Input id="packagediscount" type="number" step="0.01" min="0" value={form.packagediscount} onChange={(e) => set("packagediscount", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Discount On</Label>
              <Select value={form.discounton} onValueChange={(v) => set("discounton", v)}>
                <SelectTrigger className={errors.discounton ? "border-primary" : ""}><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="TOTAL">Total Amount</SelectItem>
                  <SelectItem value="PACKAGE">Package</SelectItem>
                  <SelectItem value="PIN">Pin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="mincreditbalance">Min Credit Balance</Label>
              <Input id="mincreditbalance" type="number" step="0.01" min="0" value={form.mincreditbalance} onChange={(e) => set("mincreditbalance", e.target.value)} />
            </div>
            <div className="flex items-center gap-3 md:col-span-2">
              <Switch id="taxondiscount" checked={form.taxondiscount === "Y"} onCheckedChange={(v) => set("taxondiscount", v ? "Y" : "N")} />
              <div>
                <Label htmlFor="taxondiscount" className="cursor-pointer">Tax on Discount</Label>
                <p className="text-xs text-muted-foreground">Apply tax on the discounted amount</p>
              </div>
            </div>
          </div>
        </SectionCard>

        <div className="flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => setActive(moduleId, "zone", "manage-zone")}>Cancel</Button>
          <Button type="submit" disabled={saving}>
            {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating…</> : <><Save className="mr-2 h-4 w-4" /> Create Zone</>}
          </Button>
        </div>
      </form>
    </div>
  );
}

/* ================ MANAGE ZONES (REAL FUNCTIONAL) ================ */

function ManageZonesPage({ moduleId, childId, grandchildId }: ViewProps) {
  const { mod, child, grandchild } = useModuleHeader(moduleId, childId, grandchildId);
  const setActive = useAppStore((s) => s.setActive);
  const { toast } = useToast();
  const [zones, setZones] = React.useState<Zone[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [deleteTarget, setDeleteTarget] = React.useState<Zone | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  const load = React.useCallback(() => {
    setLoading(true);
    zonesApi.list({ search: search || undefined }).then((res) => {
      setZones(res.data ?? []);
      setLoading(false);
    });
  }, [search]);

  React.useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const res = await zonesApi.delete(deleteTarget.zoneid);
    setDeleting(false);
    if (res.responseCode === "0") {
      toast({ title: "Zone deleted", description: `"${deleteTarget.zonename}" was deleted.` });
      setDeleteTarget(null);
      load();
    } else {
      toast({ title: "Delete failed", description: res.responseMsg, variant: "destructive" });
    }
  };

  if (!mod || !child) return null;

  return (
    <div className="space-y-6">
      <PageHeader
        title={grandchild?.label ?? "Manage Zones"}
        description="View, search and manage all network zones. Data is backed by the zones API."
        icon={<mod.icon className="h-5 w-5" />}
        breadcrumb={[
          { label: "Cryptsk" },
          { label: mod.label, onClick: () => setActive(moduleId, "", "") },
          { label: child.label, onClick: () => setActive(moduleId, childId, "") },
          { label: grandchild?.label ?? "Manage" },
        ]}
        actions={<Button onClick={() => setActive(moduleId, "zone", "create-zone")}><MapPin className="mr-2 h-4 w-4" /> Create Zone</Button>}
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard label="Total Zones" value={String(zones.length)} icon={<MapPin className="h-4 w-4" />} accent />
        <KpiCard label="Active" value={String(zones.filter((z) => z.status === "Y").length)} icon={<Activity className="h-4 w-4" />} />
        <KpiCard label="Total Users" value={String(zones.reduce((a, z) => a + z.users, 0))} icon={<UsersIcon className="h-4 w-4" />} />
        <KpiCard label="Max Capacity" value={String(zones.reduce((a, z) => a + z.maxconcurrentusers, 0))} icon={<Network className="h-4 w-4" />} />
      </div>

      <ActionBar>
        <div className="relative flex-1 max-w-xs">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search zones…" className="h-8 pl-8 text-xs" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Button variant="outline" size="sm" className="h-8" onClick={load}><RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Refresh</Button>
      </ActionBar>

      <SectionCard>
        {loading ? (
          <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
        ) : zones.length === 0 ? (
          <EmptyState icon={<MapPin className="h-5 w-5" />} title="No zones found" description="Create your first zone to get started."
            action={<Button onClick={() => setActive(moduleId, "zone", "create-zone")}><MapPin className="mr-2 h-4 w-4" /> Create Zone</Button>} />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader><TableRow>
                <TableHead>ID</TableHead><TableHead>Zone Name</TableHead><TableHead>Description</TableHead>
                <TableHead>POP</TableHead><TableHead>Users</TableHead><TableHead>Max Capacity</TableHead>
                <TableHead>Bandwidth</TableHead><TableHead>Discount</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {zones.map((z) => (
                  <TableRow key={z.zoneid}>
                    <TableCell className="font-mono text-xs">{z.zoneid}</TableCell>
                    <TableCell>
                      <p className="font-medium">{z.zonename}</p>
                      <p className="text-xs text-muted-foreground">{z.billingname}</p>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{z.description}</TableCell>
                    <TableCell className="text-xs">{z.popname}</TableCell>
                    <TableCell>{z.users}</TableCell>
                    <TableCell>{z.maxconcurrentusers}</TableCell>
                    <TableCell className="font-mono text-xs">{z.bandwidth}</TableCell>
                    <TableCell className="text-xs">
                      {z.pindiscount > 0 && <Badge variant="secondary" className="mr-1 text-[10px]">Pin {z.pindiscount}%</Badge>}
                      {z.packagediscount > 0 && <Badge variant="secondary" className="text-[10px]">Pkg {z.packagediscount}%</Badge>}
                      {z.pindiscount === 0 && z.packagediscount === 0 && <span className="text-muted-foreground">—</span>}
                    </TableCell>
                    <TableCell><Badge variant={z.status === "Y" ? "default" : "secondary"} className={z.status === "Y" ? "bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400" : ""}>{z.status === "Y" ? "Active" : "Inactive"}</Badge></TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => toast({ title: "Edit zone", description: z.zonename })}><Pencil className="h-3.5 w-3.5" /></Button>
                        <Button variant="ghost" size="sm" className="text-primary hover:text-primary" onClick={() => setDeleteTarget(z)}><Trash2 className="h-3.5 w-3.5" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </SectionCard>

      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete Zone</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Are you sure you want to delete <span className="font-medium text-foreground">{deleteTarget?.zonename}</span>? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)} disabled={deleting}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting…</> : <><Trash2 className="mr-2 h-4 w-4" /> Delete</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function PoolManagement({ moduleId, childId }: ViewProps) {
  const { mod, child } = useModuleHeader(moduleId, childId);
  const { toast } = useToast();
  if (!mod || !child) return null;
  return (
    <div className="space-y-6">
      <PageHeader title={child.label} description={child.desc} icon={<mod.icon className="h-5 w-5" />}
        breadcrumb={[{ label: "Cryptsk" }, { label: mod.label }, { label: child.label }]}
        actions={<Button onClick={() => toast({ title: "Create pool" })}><Database className="mr-2 h-4 w-4" /> Create Pool</Button>} />
      <SectionCard title="IP Pools" description={`${POOLS.length} pools`}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader><TableRow>
              <TableHead>ID</TableHead><TableHead>Pool Name</TableHead><TableHead>Zone</TableHead>
              <TableHead>Subnet</TableHead><TableHead>Gateway</TableHead><TableHead>Utilization</TableHead><TableHead className="text-right">Actions</TableHead>
            </TableRow></TableHeader>
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
                    <TableCell className="text-right"><Button variant="ghost" size="sm" onClick={() => toast({ title: "Edit pool", description: p.name })}>Edit</Button></TableCell>
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

function ManageCustomers({ moduleId, childId }: ViewProps) {
  const { mod, child } = useModuleHeader(moduleId, childId);
  if (!mod || !child) return null;
  const customers = [
    { id: "CUST001", name: "Shubham Kumar", mobile: "+91-98xxxxxx12", email: "shubham@example.com", area: "Bhiwani-Core", accounts: 1, status: "Active" },
    { id: "CUST002", name: "Rajesh Verma", mobile: "+91-99xxxxxx87", email: "rajesh@example.com", area: "Bhiwani-North", accounts: 2, status: "Active" },
    { id: "CUST003", name: "Suresh Yadav", mobile: "+91-97xxxxxx45", email: "suresh@example.com", area: "Bhiwani-South", accounts: 1, status: "Active" },
    { id: "CUST004", name: "Sweety Devi", mobile: "+91-96xxxxxx33", email: "sweety@example.com", area: "Bhiwani-East", accounts: 1, status: "Suspended" },
    { id: "CUST005", name: "Manish Sharma", mobile: "+91-90xxxxxx19", email: "manish@example.com", area: "Bhiwani-West", accounts: 3, status: "Active" },
  ];
  return (
    <div className="space-y-6">
      <PageHeader title={child.label} description={child.desc} icon={<mod.icon className="h-5 w-5" />}
        breadcrumb={[{ label: "Cryptsk" }, { label: mod.label }, { label: child.label }]} />
      <SectionCard title="Customers" description={`${customers.length} customers`}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader><TableRow>
              <TableHead>ID</TableHead><TableHead>Name</TableHead><TableHead>Mobile</TableHead>
              <TableHead>Email</TableHead><TableHead>Area</TableHead><TableHead>Accounts</TableHead><TableHead>Status</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {customers.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-mono text-xs">{c.id}</TableCell>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell className="text-muted-foreground">{c.mobile}</TableCell>
                  <TableCell className="text-muted-foreground">{c.email}</TableCell>
                  <TableCell className="text-muted-foreground">{c.area}</TableCell>
                  <TableCell>{c.accounts}</TableCell>
                  <TableCell><Badge variant={c.status === "Active" ? "default" : "secondary"} className={c.status === "Active" ? "bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400" : "bg-primary/10 text-primary hover:bg-primary/10"}>{c.status}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>
    </div>
  );
}
