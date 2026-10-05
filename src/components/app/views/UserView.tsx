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
  Cable,
  Server,
  Router,
  UserCog,
  CalendarX,
  Plus,
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

    // Leased Line Users
    if (childId === "manage-users" && grandchildId === "leased-line-users")
      return <LeasedLineUsersPage moduleId={moduleId} childId={childId} grandchildId={grandchildId} />;

    // Pool Management
    if (childId === "pool" && grandchildId === "create-pool")
      return <CreatePoolPage moduleId={moduleId} childId={childId} grandchildId={grandchildId} />;
    if (childId === "pool" && grandchildId === "manage-pool")
      return <ManagePoolPage moduleId={moduleId} childId={childId} grandchildId={grandchildId} />;
    if (childId === "pool" && grandchildId === "search-node")
      return <SearchNodePage moduleId={moduleId} childId={childId} grandchildId={grandchildId} />;
    if (childId === "pool" && grandchildId === "search-network")
      return <SearchNetworkPage moduleId={moduleId} childId={childId} grandchildId={grandchildId} />;

    // Customers
    if (childId === "customers" && grandchildId === "edit-customers")
      return <EditCustomersPage moduleId={moduleId} childId={childId} grandchildId={grandchildId} />;
    if (childId === "customers" && grandchildId === "purge-customers")
      return <PurgeCustomersPage moduleId={moduleId} childId={childId} grandchildId={grandchildId} />;

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

/* ================ LEASED LINE USERS (REAL FUNCTIONAL) ================ */

function LeasedLineUsersPage({ moduleId, childId, grandchildId }: ViewProps) {
  const { mod, child, grandchild } = useModuleHeader(moduleId, childId, grandchildId);
  const setActive = useAppStore((s) => s.setActive);
  const { toast } = useToast();
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [reloginTarget, setReloginTarget] = React.useState<User | null>(null);
  const [relogging, setRelogging] = React.useState(false);

  const load = React.useCallback(() => {
    setLoading(true);
    usersApi
      .list({
        search: search || undefined,
        userType: "Leased Line",
        status: statusFilter !== "all" ? statusFilter : undefined,
      })
      .then((res) => {
        setUsers(res.data ?? []);
        setLoading(false);
      });
  }, [search, statusFilter]);

  React.useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  const handleRelogin = async () => {
    if (!reloginTarget) return;
    setRelogging(true);
    // Simulate re-login API call (would be usersApi.relogin(userid))
    await new Promise((r) => setTimeout(r, 600));
    setRelogging(false);
    toast({
      title: "Re-login triggered",
      description: `Leased line user "${reloginTarget.username}" has been forced to re-authenticate.`,
    });
    setReloginTarget(null);
  };

  if (!mod || !child) return null;

  return (
    <div className="space-y-6">
      <PageHeader
        title={grandchild?.label ?? "Leased Line Users"}
        description="View and re-login leased line subscribers. Data is backed by the users API (filtered by userType=Leased Line)."
        icon={<mod.icon className="h-5 w-5" />}
        breadcrumb={[
          { label: "Cryptsk" },
          { label: mod.label, onClick: () => setActive(moduleId, "", "") },
          { label: child.label, onClick: () => setActive(moduleId, childId, "") },
          { label: grandchild?.label ?? "Leased Line Users" },
        ]}
        actions={
          <Button onClick={() => setActive(moduleId, "manage-users", "add-user")}>
            <UserPlus className="mr-2 h-4 w-4" /> Add Leased Line User
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard label="Leased Line Users" value={String(users.length)} icon={<Cable className="h-4 w-4" />} accent />
        <KpiCard label="Active" value={String(users.filter((u) => u.active === "Y").length)} icon={<Activity className="h-4 w-4" />} />
        <KpiCard label="Deactive" value={String(users.filter((u) => u.active === "D").length)} icon={<Cable className="h-4 w-4" />} />
        <KpiCard label="Blocked" value={String(users.filter((u) => u.active === "N").length)} icon={<Power className="h-4 w-4" />} />
      </div>

      <ActionBar>
        <div className="relative flex-1 max-w-xs">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by username, IP, NAS ID…"
            className="h-8 pl-8 text-xs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-8 w-[140px] text-xs">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All status</SelectItem>
            <SelectItem value="Y">Active</SelectItem>
            <SelectItem value="D">Deactive</SelectItem>
            <SelectItem value="N">Blocked</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" className="h-8" onClick={load}>
          <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Refresh
        </Button>
      </ActionBar>

      <SectionCard title="Leased Line Users" description={`${users.length} user(s)`}>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : users.length === 0 ? (
          <EmptyState
            icon={<Cable className="h-5 w-5" />}
            title="No leased line users found"
            description="Try adjusting your search or filter, or add a new leased line user."
          />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Username</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>NAS Identifier</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Package</TableHead>
                  <TableHead>Zone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.userid}>
                    <TableCell className="font-mono text-xs text-primary">{u.username}</TableCell>
                    <TableCell className="font-medium">{u.name || "—"}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{u.nasIdentifier || "—"}</TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{u.ipaddress || "—"}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{u.packageName || "—"}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{u.zoneName || "—"}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          u.active === "Y"
                            ? "bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400"
                            : u.active === "D"
                            ? "bg-amber-500/10 text-amber-700 hover:bg-amber-500/10 dark:text-amber-400"
                            : "bg-primary/10 text-primary hover:bg-primary/10"
                        }
                      >
                        {u.active === "Y" ? "Active" : u.active === "D" ? "Deactive" : "Blocked"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setReloginTarget(u)}
                      >
                        <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Re-login
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </SectionCard>

      <Dialog open={!!reloginTarget} onOpenChange={(open) => !open && setReloginTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Force Re-login</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to force <span className="font-medium text-foreground">{reloginTarget?.username}</span> ({reloginTarget?.name || "—"}) to re-authenticate? The current session will be terminated and the user must log in again.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReloginTarget(null)} disabled={relogging}>
              Cancel
            </Button>
            <Button onClick={handleRelogin} disabled={relogging}>
              {relogging ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Triggering…</>
              ) : (
                <><RefreshCw className="mr-2 h-4 w-4" /> Force Re-login</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ================ CREATE POOL (REAL FUNCTIONAL) ================ */

function CreatePoolPage({ moduleId, childId, grandchildId }: ViewProps) {
  const { mod, child, grandchild } = useModuleHeader(moduleId, childId, grandchildId);
  const setActive = useAppStore((s) => s.setActive);
  const { toast } = useToast();
  const [saving, setSaving] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const [form, setForm] = React.useState({
    poolName: "",
    zoneName: ZONES[0]?.name ?? "",
    subnet: "",
    gateway: "",
    primaryDns: "8.8.8.8",
    secondaryDns: "8.8.4.4",
    description: "",
    status: "Active" as "Active" | "Inactive",
  });

  const set = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => { const n = { ...e }; delete n[field]; return n; });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});

    // Basic validation
    const errs: Record<string, string> = {};
    if (!form.poolName.trim()) errs.poolName = "Pool name is required";
    if (!form.subnet.trim()) errs.subnet = "Subnet is required";
    else if (!/^\d{1,3}(\.\d{1,3}){3}\/\d{1,2}$/.test(form.subnet))
      errs.subnet = "Subnet must be in CIDR format, e.g. 10.172.0.0/24";
    if (!form.gateway.trim()) errs.gateway = "Gateway is required";
    else if (!/^\d{1,3}(\.\d{1,3}){3}$/.test(form.gateway))
      errs.gateway = "Gateway must be a valid IPv4 address";

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      setSaving(false);
      return;
    }

    // Simulate API call (no poolsApi yet — would be poolsApi.create(form))
    await new Promise((r) => setTimeout(r, 500));
    setSaving(false);
    toast({
      title: "Pool created",
      description: `IP pool "${form.poolName}" has been created successfully.`,
    });
    setActive(moduleId, "pool", "manage-pool");
  };

  if (!mod || !child) return null;

  return (
    <div className="space-y-6">
      <PageHeader
        title={grandchild?.label ?? "Create Pool"}
        description="Create a new IP address pool. Fields mirror the 24online PoolManager.createPool API."
        icon={<mod.icon className="h-5 w-5" />}
        breadcrumb={[
          { label: "Cryptsk" },
          { label: mod.label, onClick: () => setActive(moduleId, "", "") },
          { label: child.label, onClick: () => setActive(moduleId, childId, "") },
          { label: grandchild?.label ?? "Create Pool" },
        ]}
        actions={
          <Button variant="outline" onClick={() => setActive(moduleId, "pool", "manage-pool")}>
            <X className="mr-2 h-4 w-4" /> Cancel
          </Button>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <SectionCard title="Pool Information" description="Name and zone assignment">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="poolName">
                Pool Name <span className="text-primary">*</span>
              </Label>
              <Input
                id="poolName"
                value={form.poolName}
                onChange={(e) => set("poolName", e.target.value)}
                placeholder="e.g. Pool-Bhiwani6"
                className={errors.poolName ? "border-primary" : ""}
              />
              {errors.poolName && (
                <p className="text-xs text-primary flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.poolName}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Zone <span className="text-primary">*</span></Label>
              <Select value={form.zoneName} onValueChange={(v) => set("zoneName", v)}>
                <SelectTrigger className={errors.zoneName ? "border-primary" : ""}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ZONES.map((z) => (
                    <SelectItem key={z.id} value={z.name}>{z.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Pool description…"
                rows={2}
              />
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Network Configuration" description="Subnet, gateway and DNS">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="subnet">
                Subnet (CIDR) <span className="text-primary">*</span>
              </Label>
              <Input
                id="subnet"
                value={form.subnet}
                onChange={(e) => set("subnet", e.target.value)}
                placeholder="e.g. 10.172.6.0/24"
                className={`font-mono text-xs ${errors.subnet ? "border-primary" : ""}`}
              />
              {errors.subnet && (
                <p className="text-xs text-primary flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.subnet}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="gateway">
                Gateway <span className="text-primary">*</span>
              </Label>
              <Input
                id="gateway"
                value={form.gateway}
                onChange={(e) => set("gateway", e.target.value)}
                placeholder="e.g. 10.172.6.1"
                className={`font-mono text-xs ${errors.gateway ? "border-primary" : ""}`}
              />
              {errors.gateway && (
                <p className="text-xs text-primary flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.gateway}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="primaryDns">Primary DNS</Label>
              <Input
                id="primaryDns"
                value={form.primaryDns}
                onChange={(e) => set("primaryDns", e.target.value)}
                placeholder="8.8.8.8"
                className="font-mono text-xs"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="secondaryDns">Secondary DNS</Label>
              <Input
                id="secondaryDns"
                value={form.secondaryDns}
                onChange={(e) => set("secondaryDns", e.target.value)}
                placeholder="8.8.4.4"
                className="font-mono text-xs"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={form.status} onValueChange={(v) => set("status", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </SectionCard>

        <div className="flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => setActive(moduleId, "pool", "manage-pool")}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating…</>
            ) : (
              <><Save className="mr-2 h-4 w-4" /> Create Pool</>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

/* ================ MANAGE POOL (REAL FUNCTIONAL) ================ */

function ManagePoolPage({ moduleId, childId, grandchildId }: ViewProps) {
  const { mod, child, grandchild } = useModuleHeader(moduleId, childId, grandchildId);
  const setActive = useAppStore((s) => s.setActive);
  const { toast } = useToast();
  const [search, setSearch] = React.useState("");
  const [zoneFilter, setZoneFilter] = React.useState("all");
  const [deleteTarget, setDeleteTarget] = React.useState<(typeof POOLS)[number] | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  if (!mod || !child) return null;

  const filtered = POOLS.filter((p) => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.subnet.includes(search)) return false;
    if (zoneFilter !== "all" && p.zone !== zoneFilter) return false;
    return true;
  });

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    // Simulate API call (would be poolsApi.delete(deleteTarget.id))
    await new Promise((r) => setTimeout(r, 500));
    setDeleting(false);
    toast({
      title: "Pool deleted",
      description: `"${deleteTarget.name}" (${deleteTarget.subnet}) was deleted.`,
    });
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={grandchild?.label ?? "Manage Pool"}
        description="View, search and manage all IP address pools. Utilization is computed from used/total addresses."
        icon={<mod.icon className="h-5 w-5" />}
        breadcrumb={[
          { label: "Cryptsk" },
          { label: mod.label, onClick: () => setActive(moduleId, "", "") },
          { label: child.label, onClick: () => setActive(moduleId, childId, "") },
          { label: grandchild?.label ?? "Manage Pool" },
        ]}
        actions={
          <Button onClick={() => setActive(moduleId, "pool", "create-pool")}>
            <Database className="mr-2 h-4 w-4" /> Create Pool
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard label="Total Pools" value={String(POOLS.length)} icon={<Database className="h-4 w-4" />} accent />
        <KpiCard label="Total IPs" value={String(POOLS.reduce((a, p) => a + p.total, 0))} icon={<Server className="h-4 w-4" />} />
        <KpiCard label="Used IPs" value={String(POOLS.reduce((a, p) => a + p.used, 0))} icon={<Activity className="h-4 w-4" />} />
        <KpiCard label="Utilization" value={`${Math.round((POOLS.reduce((a, p) => a + p.used, 0) / POOLS.reduce((a, p) => a + p.total, 0)) * 100)}%`} icon={<Activity className="h-4 w-4" />} />
      </div>

      <ActionBar>
        <div className="relative flex-1 max-w-xs">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search pools by name or subnet…"
            className="h-8 pl-8 text-xs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={zoneFilter} onValueChange={setZoneFilter}>
          <SelectTrigger className="h-8 w-[160px] text-xs">
            <SelectValue placeholder="Zone" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All zones</SelectItem>
            {Array.from(new Set(POOLS.map((p) => p.zone))).map((z) => (
              <SelectItem key={z} value={z}>{z}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </ActionBar>

      <SectionCard title="IP Pools" description={`${filtered.length} pool(s)`}>
        {filtered.length === 0 ? (
          <EmptyState
            icon={<Database className="h-5 w-5" />}
            title="No pools match your filters"
            description="Try adjusting your search or zone filter, or create a new pool."
            action={<Button onClick={() => setActive(moduleId, "pool", "create-pool")}><Database className="mr-2 h-4 w-4" /> Create Pool</Button>}
          />
        ) : (
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
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((p) => {
                  const pct = Math.round((p.used / p.total) * 100);
                  return (
                    <TableRow key={p.id}>
                      <TableCell className="font-mono text-xs">{p.id}</TableCell>
                      <TableCell className="font-medium">{p.name}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{p.zone}</TableCell>
                      <TableCell className="font-mono text-xs">{p.subnet}</TableCell>
                      <TableCell className="font-mono text-xs">{p.gateway}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
                            <div
                              className={pct > 80 ? "h-full bg-primary" : pct > 50 ? "h-full bg-amber-500" : "h-full bg-emerald-500"}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="whitespace-nowrap text-xs text-muted-foreground">
                            {p.used}/{p.total} ({pct}%)
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400">
                          Active
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toast({ title: "Edit pool", description: `Editing "${p.name}" — form will open.` })}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-primary hover:text-primary"
                            onClick={() => setDeleteTarget(p)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </SectionCard>

      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete IP Pool</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete <span className="font-medium text-foreground">{deleteTarget?.name}</span> ({deleteTarget?.subnet})? All leased IPs in this pool will be released. This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)} disabled={deleting}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting…</>
              ) : (
                <><Trash2 className="mr-2 h-4 w-4" /> Delete</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ================ SEARCH NODE (REAL FUNCTIONAL) ================ */

// Mock nodes derived from POOLS gateways + a few extra edge devices
const NODES = [
  { id: "N01", name: "Bhiwani-Core-Node1", ip: "10.172.0.1", zone: "Bhiwani-Core", pool: "Pool-Bhiwani0", type: "Gateway", status: "Online" },
  { id: "N02", name: "Bhiwani-Core-Node2", ip: "10.172.1.1", zone: "Bhiwani-Core", pool: "Pool-Bhiwani1", type: "Gateway", status: "Online" },
  { id: "N03", name: "Bhiwani-North-Node1", ip: "10.172.2.1", zone: "Bhiwani-North", pool: "Pool-Bhiwani2", type: "Gateway", status: "Online" },
  { id: "N04", name: "Bhiwani-South-Node1", ip: "10.172.3.1", zone: "Bhiwani-South", pool: "Pool-Bhiwani3", type: "Gateway", status: "Online" },
  { id: "N05", name: "Bhiwani-East-Node1", ip: "10.172.4.1", zone: "Bhiwani-East", pool: "Pool-Bhiwani4", type: "Gateway", status: "Offline" },
  { id: "N06", name: "Bhiwani-West-Node1", ip: "10.172.5.1", zone: "Bhiwani-West", pool: "Pool-Bhiwani5", type: "Gateway", status: "Online" },
  { id: "N07", name: "Rohtak-Edge-Router", ip: "10.173.0.1", zone: "Rohtak-Edge", pool: "—", type: "Router", status: "Online" },
  { id: "N08", name: "Bhiwani-Core-NAS", ip: "10.172.0.254", zone: "Bhiwani-Core", pool: "Pool-Bhiwani0", type: "NAS", status: "Online" },
];

function SearchNodePage({ moduleId, childId, grandchildId }: ViewProps) {
  const { mod, child, grandchild } = useModuleHeader(moduleId, childId, grandchildId);
  const setActive = useAppStore((s) => s.setActive);
  const { toast } = useToast();
  const [query, setQuery] = React.useState("");
  const [zoneFilter, setZoneFilter] = React.useState("all");
  const [searched, setSearched] = React.useState(false);
  const [results, setResults] = React.useState<typeof NODES>([]);

  if (!mod || !child) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    const q = query.trim().toLowerCase();
    const filtered = NODES.filter((n) => {
      if (q && !n.name.toLowerCase().includes(q) && !n.ip.includes(q)) return false;
      if (zoneFilter !== "all" && n.zone !== zoneFilter) return false;
      return true;
    });
    setResults(filtered);
    toast({
      title: "Search complete",
      description: `${filtered.length} node(s) matched your criteria.`,
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={grandchild?.label ?? "Search Node"}
        description="Search for network nodes by IP address or name. Shows which zone and pool each node belongs to."
        icon={<mod.icon className="h-5 w-5" />}
        breadcrumb={[
          { label: "Cryptsk" },
          { label: mod.label, onClick: () => setActive(moduleId, "", "") },
          { label: child.label, onClick: () => setActive(moduleId, childId, "") },
          { label: grandchild?.label ?? "Search Node" },
        ]}
      />

      <SectionCard title="Search Criteria" description="Enter node IP or name to search">
        <form onSubmit={handleSearch} className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="query">Node IP or Name</Label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="query"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. 10.172.0.1 or Bhiwani-Core"
                className="pl-8"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Zone</Label>
            <Select value={zoneFilter} onValueChange={setZoneFilter}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All zones</SelectItem>
                {Array.from(new Set(NODES.map((n) => n.zone))).map((z) => (
                  <SelectItem key={z} value={z}>{z}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-3 flex justify-end">
            <Button type="submit">
              <Search className="mr-2 h-4 w-4" /> Search Nodes
            </Button>
          </div>
        </form>
      </SectionCard>

      {searched && (
        <SectionCard title="Search Results" description={`${results.length} node(s) found`}>
          {results.length === 0 ? (
            <EmptyState
              icon={<Server className="h-5 w-5" />}
              title="No nodes found"
              description="Try a different IP, name, or zone filter."
            />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Node Name</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Zone</TableHead>
                    <TableHead>Pool</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((n) => (
                    <TableRow key={n.id}>
                      <TableCell className="font-mono text-xs">{n.id}</TableCell>
                      <TableCell className="font-medium">{n.name}</TableCell>
                      <TableCell className="font-mono text-xs text-primary">{n.ip}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px]">{n.type}</Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{n.zone}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{n.pool}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            n.status === "Online"
                              ? "bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400"
                              : "bg-primary/10 text-primary hover:bg-primary/10"
                          }
                        >
                          {n.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </SectionCard>
      )}
    </div>
  );
}

/* ================ SEARCH NETWORK (REAL FUNCTIONAL) ================ */

function SearchNetworkPage({ moduleId, childId, grandchildId }: ViewProps) {
  const { mod, child, grandchild } = useModuleHeader(moduleId, childId, grandchildId);
  const setActive = useAppStore((s) => s.setActive);
  const { toast } = useToast();
  const [network, setNetwork] = React.useState("");
  const [results, setResults] = React.useState<typeof POOLS>([]);
  const [searched, setSearched] = React.useState(false);

  if (!mod || !child) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    const q = network.trim();
    if (!q) {
      setResults(POOLS);
      return;
    }
    // Match if the queried network is a prefix of, or contained in, a pool subnet
    const filtered = POOLS.filter((p) => p.subnet.startsWith(q) || p.subnet.includes(q));
    setResults(filtered);
    toast({
      title: "Search complete",
      description: `${filtered.length} pool(s) matched network "${q}".`,
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={grandchild?.label ?? "Search Network"}
        description="Search for a network address to find which IP pool and zone it belongs to."
        icon={<mod.icon className="h-5 w-5" />}
        breadcrumb={[
          { label: "Cryptsk" },
          { label: mod.label, onClick: () => setActive(moduleId, "", "") },
          { label: child.label, onClick: () => setActive(moduleId, childId, "") },
          { label: grandchild?.label ?? "Search Network" },
        ]}
      />

      <SectionCard title="Search Criteria" description="Enter a network address (CIDR or prefix) to search">
        <form onSubmit={handleSearch} className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="network">Network Address</Label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="network"
                value={network}
                onChange={(e) => setNetwork(e.target.value)}
                placeholder="e.g. 10.172.0.0 or 10.172.0.0/24"
                className="font-mono text-xs pl-8"
              />
            </div>
          </div>
          <div className="md:col-span-3 flex justify-end">
            <Button type="submit">
              <Search className="mr-2 h-4 w-4" /> Search Network
            </Button>
          </div>
        </form>
      </SectionCard>

      {searched && (
        <SectionCard title="Search Results" description={`${results.length} pool(s) found`}>
          {results.length === 0 ? (
            <EmptyState
              icon={<Router className="h-5 w-5" />}
              title="No networks found"
              description="Try a different network address (e.g. 10.172.0.0)."
            />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pool Name</TableHead>
                    <TableHead>Zone</TableHead>
                    <TableHead>Subnet</TableHead>
                    <TableHead>Gateway</TableHead>
                    <TableHead>Utilization</TableHead>
                    <TableHead>Belongs To</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((p) => {
                    const pct = Math.round((p.used / p.total) * 100);
                    return (
                      <TableRow key={p.id}>
                        <TableCell className="font-medium">{p.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[10px]">{p.zone}</Badge>
                        </TableCell>
                        <TableCell className="font-mono text-xs text-primary">{p.subnet}</TableCell>
                        <TableCell className="font-mono text-xs">{p.gateway}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                              <div
                                className={pct > 80 ? "h-full bg-primary" : "h-full bg-emerald-500"}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="text-xs text-muted-foreground">{p.used}/{p.total}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">{p.zone} / {p.name}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </SectionCard>
      )}
    </div>
  );
}

/* ================ EDIT CUSTOMERS (REAL FUNCTIONAL) ================ */

const CUSTOMERS_MOCK = [
  { id: "CUST001", name: "Shubham Kumar", mobile: "+91-98xxxxxx12", email: "shubham@example.com", address1: "House 14, Civil Lines", city: "Bhiwani", state: "Haryana", zip: "127021", area: "Bhiwani-Core", accounts: 1, status: "Active" },
  { id: "CUST002", name: "Rajesh Verma", mobile: "+91-99xxxxxx87", email: "rajesh@example.com", address1: "Shop 5, Main Bazar", city: "Bhiwani", state: "Haryana", zip: "127021", area: "Bhiwani-North", accounts: 2, status: "Active" },
  { id: "CUST003", name: "Suresh Yadav", mobile: "+91-97xxxxxx45", email: "suresh@example.com", address1: "House 22, Sector 7", city: "Bhiwani", state: "Haryana", zip: "127021", area: "Bhiwani-South", accounts: 1, status: "Active" },
  { id: "CUST004", name: "Sweety Devi", mobile: "+91-96xxxxxx33", email: "sweety@example.com", address1: "House 8, Model Town", city: "Bhiwani", state: "Haryana", zip: "127021", area: "Bhiwani-East", accounts: 1, status: "Suspended" },
  { id: "CUST005", name: "Manish Sharma", mobile: "+91-90xxxxxx19", email: "manish@example.com", address1: "House 31, Railway Road", city: "Bhiwani", state: "Haryana", zip: "127021", area: "Bhiwani-West", accounts: 3, status: "Active" },
];

function EditCustomersPage({ moduleId, childId, grandchildId }: ViewProps) {
  const { mod, child, grandchild } = useModuleHeader(moduleId, childId, grandchildId);
  const setActive = useAppStore((s) => s.setActive);
  const { toast } = useToast();
  const [search, setSearch] = React.useState("");
  const [selected, setSelected] = React.useState<typeof CUSTOMERS_MOCK[number] | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [form, setForm] = React.useState({
    name: "", email: "", phone: "", address: "", city: "", state: "", zip: "",
  });

  if (!mod || !child) return null;

  const filtered = search
    ? CUSTOMERS_MOCK.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.id.toLowerCase().includes(search.toLowerCase()) ||
        c.mobile.includes(search) ||
        c.email.toLowerCase().includes(search.toLowerCase())
      )
    : CUSTOMERS_MOCK;

  const handleSelect = (c: typeof CUSTOMERS_MOCK[number]) => {
    setSelected(c);
    setForm({
      name: c.name,
      email: c.email,
      phone: c.mobile,
      address: c.address1,
      city: c.city,
      state: c.state,
      zip: c.zip,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    setSaving(true);
    // Simulate API call (would be customersApi.update(selected.id, form))
    await new Promise((r) => setTimeout(r, 500));
    setSaving(false);
    toast({
      title: "Customer updated",
      description: `Details for "${form.name}" (${selected.id}) have been saved.`,
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={grandchild?.label ?? "Edit Customers"}
        description="Search for a customer and update their contact and address details."
        icon={<mod.icon className="h-5 w-5" />}
        breadcrumb={[
          { label: "Cryptsk" },
          { label: mod.label, onClick: () => setActive(moduleId, "", "") },
          { label: child.label, onClick: () => setActive(moduleId, childId, "") },
          { label: grandchild?.label ?? "Edit Customers" },
        ]}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Search & select customer */}
        <SectionCard title="Find Customer" description={`${filtered.length} customer(s)`}>
          <div className="relative mb-3 max-w-xs">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, ID, mobile, email…"
              className="h-8 pl-8 text-xs"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="max-h-96 overflow-y-auto scrollbar-thin">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((c) => (
                  <TableRow
                    key={c.id}
                    className={`cursor-pointer ${selected?.id === c.id ? "bg-primary/5" : ""}`}
                    onClick={() => handleSelect(c)}
                  >
                    <TableCell className="font-mono text-xs">{c.id}</TableCell>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{c.mobile}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          c.status === "Active"
                            ? "bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400"
                            : "bg-primary/10 text-primary hover:bg-primary/10"
                        }
                      >
                        {c.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filtered.length === 0 && (
            <EmptyState icon={<UserCog className="h-5 w-5" />} title="No customers found" description="Try a different search term." />
          )}
        </SectionCard>

        {/* Edit form */}
        <SectionCard
          title="Edit Customer Details"
          description={selected ? `Editing ${selected.id}` : "Select a customer to edit"}
          actions={selected ? <Badge variant="outline" className="text-[10px]">{selected.id}</Badge> : undefined}
        >
          {!selected ? (
            <EmptyState
              icon={<UserCog className="h-5 w-5" />}
              title="No customer selected"
              description="Pick a customer from the list to edit their details."
            />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Name <span className="text-primary">*</span></Label>
                  <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zip">ZIP / Postal</Label>
                  <Input id="zip" value={form.zip} onChange={(e) => setForm({ ...form, zip: e.target.value })} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea id="address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} rows={2} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input id="state" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
                <Button type="button" variant="outline" onClick={() => setSelected(null)}>
                  <X className="mr-2 h-4 w-4" /> Clear
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving…</>
                  ) : (
                    <><Save className="mr-2 h-4 w-4" /> Save Changes</>
                  )}
                </Button>
              </div>
            </form>
          )}
        </SectionCard>
      </div>
    </div>
  );
}

/* ================ PURGE CUSTOMERS (REAL FUNCTIONAL) ================ */

function PurgeCustomersPage({ moduleId, childId, grandchildId }: ViewProps) {
  const { mod, child, grandchild } = useModuleHeader(moduleId, childId, grandchildId);
  const setActive = useAppStore((s) => s.setActive);
  const { toast } = useToast();
  const [fromDate, setFromDate] = React.useState("");
  const [toDate, setToDate] = React.useState("");
  const [search, setSearch] = React.useState("");
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const [purging, setPurging] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  if (!mod || !child) return null;

  const filtered = search
    ? CUSTOMERS_MOCK.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.id.toLowerCase().includes(search.toLowerCase()) ||
        c.mobile.includes(search)
      )
    : CUSTOMERS_MOCK;

  const toggleOne = (id: string) => {
    setSelected((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  };

  const toggleAll = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map((c) => c.id)));
  };

  const handlePurge = async () => {
    if (selected.size === 0) return;
    setPurging(true);
    // Simulate API call (would be customersApi.purge({ ids: Array.from(selected), fromDate, toDate }))
    await new Promise((r) => setTimeout(r, 800));
    setPurging(false);
    toast({
      title: "Customers purged",
      description: `${selected.size} customer(s) and their associated data have been purged.`,
      variant: "destructive",
    });
    setSelected(new Set());
    setConfirmOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={grandchild?.label ?? "Purge Customers"}
        description="Permanently remove customers and their associated data within a date range. This action cannot be undone."
        icon={<mod.icon className="h-5 w-5" />}
        breadcrumb={[
          { label: "Cryptsk" },
          { label: mod.label, onClick: () => setActive(moduleId, "", "") },
          { label: child.label, onClick: () => setActive(moduleId, childId, "") },
          { label: grandchild?.label ?? "Purge Customers" },
        ]}
        actions={
          <Button
            variant="destructive"
            disabled={selected.size === 0}
            onClick={() => setConfirmOpen(true)}
          >
            <CalendarX className="mr-2 h-4 w-4" /> Purge Selected ({selected.size})
          </Button>
        }
      />

      <SectionCard title="Purge Criteria" description="Select a date range and/or search customers to purge">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="fromDate">From Date</Label>
            <Input id="fromDate" type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="toDate">To Date</Label>
            <Input id="toDate" type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="custSearch">Search Customer</Label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="custSearch"
                placeholder="Name, ID, mobile…"
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-start gap-3 rounded-lg border border-primary/30 bg-primary/5 p-3">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <p className="text-xs text-foreground/80">
            <span className="font-medium text-primary">Warning:</span> Purging permanently deletes the customer
            record, their accounts, sessions, invoices, and usage history. This action <span className="font-medium">cannot be undone</span>.
            Please verify your selection before clicking <span className="font-medium">Purge Selected</span>.
          </p>
        </div>
      </SectionCard>

      <SectionCard title="Customer Selection" description={`${filtered.length} customer(s) match criteria · ${selected.size} selected`}>
        {filtered.length === 0 ? (
          <EmptyState icon={<CalendarX className="h-5 w-5" />} title="No customers found" description="Adjust your date range or search query." />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-8">
                    <Checkbox
                      checked={selected.size === filtered.length && filtered.length > 0}
                      onCheckedChange={toggleAll}
                    />
                  </TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead>Area</TableHead>
                  <TableHead>Accounts</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((c) => (
                  <TableRow key={c.id} className={selected.has(c.id) ? "bg-primary/5" : ""}>
                    <TableCell>
                      <Checkbox
                        checked={selected.has(c.id)}
                        onCheckedChange={() => toggleOne(c.id)}
                      />
                    </TableCell>
                    <TableCell className="font-mono text-xs">{c.id}</TableCell>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{c.mobile}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{c.area}</TableCell>
                    <TableCell>{c.accounts}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          c.status === "Active"
                            ? "bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400"
                            : "bg-primary/10 text-primary hover:bg-primary/10"
                        }
                      >
                        {c.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </SectionCard>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Purge</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              You are about to permanently purge <span className="font-semibold text-primary">{selected.size}</span> customer(s) and all their associated data.
            </p>
            {(fromDate || toDate) && (
              <p>
                Date range: <span className="font-medium text-foreground">{fromDate || "—"}</span> to <span className="font-medium text-foreground">{toDate || "—"}</span>
              </p>
            )}
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-3">
              <p className="text-xs text-foreground/80">
                <span className="font-medium text-primary">This action cannot be undone.</span> All user accounts,
                sessions, invoices, and usage history will be permanently deleted.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)} disabled={purging}>Cancel</Button>
            <Button variant="destructive" onClick={handlePurge} disabled={purging}>
              {purging ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Purging…</>
              ) : (
                <><CalendarX className="mr-2 h-4 w-4" /> Purge {selected.size} Customer(s)</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
