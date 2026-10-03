"use client";

import * as React from "react";
import {
  Users,
  Activity,
  Wifi,
  TrendingUp,
  Server,
  Network,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Upload,
  Gauge,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  DASHBOARD_KPIS,
  PACKAGE_WISE_USERS,
  INTERFACES,
  LOGIN_TREND,
  STATUS_BREAKDOWN,
  TOP_BANDWIDTH_USERS,
  INVOICE_SUMMARY,
} from "@/lib/mock-data";
import { KpiCard, SectionCard } from "@/components/app/shared";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/store";

const KPI_ICONS = [Users, Activity, Wifi, Users, Wifi, Server];

export function DashboardView() {
  const setActive = useAppStore((s) => s.setActive);

  return (
    <div className="space-y-6">
      {/* KPI grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {DASHBOARD_KPIS.map((kpi, i) => (
          <KpiCard
            key={kpi.label}
            label={kpi.label}
            value={kpi.value}
            delta={kpi.delta}
            trend={kpi.trend}
            icon={React.createElement(KPI_ICONS[i], { className: "h-4 w-4" })}
            accent={i === 0}
          />
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Login trend */}
        <SectionCard
          title="Login Trend"
          description="Logins per day (last 11 days)"
          className="lg:col-span-2"
          actions={
            <Badge variant="secondary" className="gap-1">
              <TrendingUp className="h-3 w-3" /> +18% WoW
            </Badge>
          }
        >
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={LOGIN_TREND}>
              <defs>
                <linearGradient id="loginGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--chart-1)"
                    stopOpacity={0.35}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--chart-1)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border)"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--background)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="var(--chart-1)"
                strokeWidth={2}
                fill="url(#loginGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </SectionCard>

        {/* Status breakdown */}
        <SectionCard
          title="User Status"
          description="Subscriber distribution"
        >
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="55%" height={200}>
              <PieChart>
                <Pie
                  data={STATUS_BREAKDOWN}
                  dataKey="users"
                  nameKey="status"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={2}
                >
                  {STATUS_BREAKDOWN.map((s) => (
                    <Cell key={s.status} fill={s.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "var(--background)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {STATUS_BREAKDOWN.map((s) => (
                <div key={s.status} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ background: s.color }}
                    />
                    <span className="text-sm text-muted-foreground">
                      {s.status}
                    </span>
                  </div>
                  <span className="text-sm font-semibold">{s.users}</span>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>
      </div>

      {/* Package + Top bandwidth */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SectionCard
          title="Package-wise Users"
          description="Top 10 plans by active subscribers"
          actions={
            <button
              onClick={() => setActive("package", "package")}
              className="text-xs font-medium text-primary hover:underline"
            >
              View all →
            </button>
          }
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={PACKAGE_WISE_USERS}
              layout="vertical"
              margin={{ left: 20, right: 20 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border)"
                horizontal={false}
              />
              <XAxis
                type="number"
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={130}
                tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--background)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Bar
                dataKey="users"
                fill="var(--chart-1)"
                radius={[0, 4, 4, 0]}
                barSize={14}
              />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard
          title="Top Bandwidth Users"
          description="Highest bandwidth consumers right now"
          actions={
            <button
              onClick={() => setActive("user", "live-users")}
              className="text-xs font-medium text-primary hover:underline"
            >
              Live users →
            </button>
          }
        >
          <div className="space-y-2">
            {TOP_BANDWIDTH_USERS.map((u, i) => (
              <div
                key={u.accountId}
                className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {u.userName}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {u.accountId} · {u.ip}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-sm font-semibold text-primary">
                  <Gauge className="h-3.5 w-3.5" />
                  {u.bandwidth}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Interfaces + Invoices */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SectionCard
          title="Interface Information"
          description="Network interfaces and IP assignments"
          actions={
            <button
              onClick={() => setActive("system", "network")}
              className="text-xs font-medium text-primary hover:underline"
            >
              Manage →
            </button>
          }
        >
          <div className="max-h-72 overflow-y-auto scrollbar-thin">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>IP Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {INTERFACES.map((i) => (
                  <TableRow key={i.name}>
                    <TableCell className="font-mono text-xs font-medium">
                      {i.name}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={i.type === "External" ? "default" : "secondary"}
                        className={
                          i.type === "External"
                            ? "bg-primary/10 text-primary hover:bg-primary/10"
                            : ""
                        }
                      >
                        {i.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {i.ip}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </SectionCard>

        <SectionCard
          title="Invoice Summary"
          description="Recent invoice totals by package"
          actions={
            <button
              onClick={() => setActive("package", "invoice")}
              className="text-xs font-medium text-primary hover:underline"
            >
              Invoices →
            </button>
          }
        >
          <div className="space-y-2">
            {INVOICE_SUMMARY.slice(0, 6).map((inv) => (
              <div
                key={inv.packageName}
                className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {inv.packageName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {inv.invoices} invoice{inv.invoices !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="text-right">
                  <p className="flex items-center justify-end gap-1 text-sm font-semibold text-foreground">
                    <DollarSign className="h-3 w-3" />
                    {inv.amount}
                  </p>
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                    INR
                  </p>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Add User", icon: Users, mod: "user", child: "manage-users" },
          { label: "Create Ticket", icon: Activity, mod: "ticket", child: "create-ticket" },
          { label: "New Plan", icon: Network, mod: "package", child: "package" },
          { label: "Reports", icon: TrendingUp, mod: "reports", child: "reports" },
        ].map((q) => (
          <button
            key={q.label}
            onClick={() => setActive(q.mod, q.child)}
            className="group flex flex-col items-start gap-2 rounded-xl border border-border bg-card p-4 text-left shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <q.icon className="h-4 w-4" />
            </div>
            <span className="text-sm font-medium text-foreground">{q.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
