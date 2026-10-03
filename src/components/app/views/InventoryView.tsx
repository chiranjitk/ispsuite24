"use client";

import * as React from "react";
import { ViewProps, useModuleHeader } from "./_shared";
import {
  PageHeader,
  ActionBar,
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  PackageSearch,
  Plus,
  ArrowDownToLine,
  ArrowUpFromLine,
  AlertTriangle,
  PackageX,
  Boxes,
  DollarSign,
  Search,
  RefreshCw,
  Download,
} from "lucide-react";
import {
  INVENTORY_ITEMS,
  INVENTORY_TXNS,
  type InventoryItem,
  type InventoryTxn,
} from "@/lib/mock-data";

export function InventoryView({ moduleId, childId }: ViewProps) {
  const { mod } = useModuleHeader(moduleId, childId);
  if (!mod) return null;

  if (!childId) return <InventoryOverview moduleId={moduleId} />;
  switch (childId) {
    case "transaction":
      return <TransactionPage moduleId={moduleId} childId={childId} />;
    case "master":
      return <MasterPage moduleId={moduleId} childId={childId} />;
    default:
      return <InventoryOverview moduleId={moduleId} />;
  }
}

/* ---------------- Overview ---------------- */

function InventoryOverview({ moduleId }: { moduleId: string }) {
  const { mod } = useModuleHeader(moduleId);
  const setActive = useAppStore((s) => s.setActive);
  if (!mod) return null;

  const lowStock = INVENTORY_ITEMS.filter((i) => i.stock < i.minStock).length;
  const stockValue = INVENTORY_ITEMS.reduce(
    (sum, i) => sum + i.stock * parseFloat(i.unitPrice),
    0
  ).toLocaleString("en-IN", { maximumFractionDigits: 0 });

  const cards = [
    { label: "Transaction", desc: `${INVENTORY_TXNS.length} stock movements`, icon: ArrowDownToLine, child: "transaction" },
    { label: "Master", desc: `${INVENTORY_ITEMS.length} inventory items`, icon: Boxes, child: "master" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={mod.label}
        description={mod.desc}
        icon={<mod.icon className="h-5 w-5" />}
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <KpiCard label="Total SKUs" value={String(INVENTORY_ITEMS.length)} icon={<Boxes className="h-4 w-4" />} accent />
        <KpiCard label="Stock Value" value={`₹${stockValue}`} icon={<DollarSign className="h-4 w-4" />} />
        <KpiCard label="Low Stock Alerts" value={String(lowStock)} icon={<AlertTriangle className="h-4 w-4" />} />
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

/* ---------------- Transactions ---------------- */

const TXN_BADGE: Record<InventoryTxn["type"], string> = {
  IN: "bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400",
  OUT: "bg-primary/10 text-primary hover:bg-primary/10",
};

function TransactionPage({ moduleId, childId }: ViewProps) {
  const { mod, child } = useModuleHeader(moduleId, childId);
  const { toast } = useToast();
  const [typeFilter, setTypeFilter] = React.useState("all");
  const [itemFilter, setItemFilter] = React.useState("all");
  const [dateSearch, setDateSearch] = React.useState("");
  if (!mod) return null;

  const items = Array.from(new Set(INVENTORY_TXNS.map((t) => t.item)));

  const filtered = INVENTORY_TXNS.filter((t) => {
    if (typeFilter !== "all" && t.type !== typeFilter) return false;
    if (itemFilter !== "all" && t.item !== itemFilter) return false;
    if (!dateSearch.trim()) return true;
    return t.date.toLowerCase().includes(dateSearch.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title={child!.label}
        description="Track stock in/out movements for all inventory items."
        icon={<mod.icon className="h-5 w-5" />}
        breadcrumb={[{ label: "Cryptsk" }, { label: mod.label }, { label: child!.label }]}
        actions={
          <Button onClick={() => toast({ title: "New Transaction", description: "Stock in/out form will open." })}>
            <Plus className="mr-2 h-4 w-4" /> New Transaction
          </Button>
        }
      />

      <ActionBar>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="h-8 w-[120px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="IN">IN</SelectItem>
            <SelectItem value="OUT">OUT</SelectItem>
          </SelectContent>
        </Select>
        <Select value={itemFilter} onValueChange={setItemFilter}>
          <SelectTrigger className="h-8 w-[180px]">
            <SelectValue placeholder="Item" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All items</SelectItem>
            {items.map((i) => (
              <SelectItem key={i} value={i}>{i}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="relative ml-auto">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by date (e.g. 04 Oct)"
            className="h-8 w-[200px] pl-8 text-xs"
            value={dateSearch}
            onChange={(e) => setDateSearch(e.target.value)}
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          className="h-8"
          onClick={() => toast({ title: "Export started", description: `Exporting ${filtered.length} transaction(s).` })}
        >
          <Download className="mr-1.5 h-3.5 w-3.5" /> Export
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => {
            setTypeFilter("all");
            setItemFilter("all");
            setDateSearch("");
            toast({ title: "Filters cleared" });
          }}
        >
          <RefreshCw className="h-3.5 w-3.5" />
        </Button>
      </ActionBar>

      <SectionCard title="Stock Transactions" description={`${filtered.length} transaction(s)`}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>From / To</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Note</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-mono text-xs text-primary">{t.id}</TableCell>
                  <TableCell className="font-medium">{t.item}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={TXN_BADGE[t.type]}>
                      {t.type === "IN" ? <ArrowDownToLine className="mr-1 h-3 w-3" /> : <ArrowUpFromLine className="mr-1 h-3 w-3" />}
                      {t.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono">{t.quantity}</TableCell>
                  <TableCell className="text-muted-foreground">{t.fromTo}</TableCell>
                  <TableCell className="whitespace-nowrap text-xs text-muted-foreground">{t.date}</TableCell>
                  <TableCell className="text-muted-foreground">{t.note}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {filtered.length === 0 && (
          <EmptyState icon={<Search className="h-5 w-5" />} title="No transactions match your filters" />
        )}
      </SectionCard>
    </div>
  );
}

/* ---------------- Master ---------------- */

function MasterPage({ moduleId, childId }: ViewProps) {
  const { mod, child } = useModuleHeader(moduleId, childId);
  const { toast } = useToast();
  const [search, setSearch] = React.useState("");
  if (!mod) return null;

  const filtered = INVENTORY_ITEMS.filter((i) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      i.id.toLowerCase().includes(q) ||
      i.name.toLowerCase().includes(q) ||
      i.category.toLowerCase().includes(q) ||
      i.vendor.toLowerCase().includes(q) ||
      i.model.toLowerCase().includes(q)
    );
  });

  const totalItems = INVENTORY_ITEMS.length;
  const lowStock = INVENTORY_ITEMS.filter((i) => i.stock < i.minStock).length;
  const outOfStock = INVENTORY_ITEMS.filter((i) => i.stock === 0).length;
  const stockValue = INVENTORY_ITEMS.reduce(
    (sum, i) => sum + i.stock * parseFloat(i.unitPrice),
    0
  ).toLocaleString("en-IN", { maximumFractionDigits: 0 });

  return (
    <div className="space-y-6">
      <PageHeader
        title={child!.label}
        description="Inventory master items with stock levels, vendors and valuations."
        icon={<mod.icon className="h-5 w-5" />}
        breadcrumb={[{ label: "Cryptsk" }, { label: mod.label }, { label: child!.label }]}
        actions={
          <Button onClick={() => toast({ title: "Add Item", description: "New inventory item form will open." })}>
            <Plus className="mr-2 h-4 w-4" /> Add Item
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard label="Total Items" value={String(totalItems)} icon={<Boxes className="h-4 w-4" />} accent />
        <KpiCard label="Stock Value" value={`₹${stockValue}`} icon={<DollarSign className="h-4 w-4" />} />
        <KpiCard label="Low Stock" value={String(lowStock)} icon={<AlertTriangle className="h-4 w-4" />} />
        <KpiCard label="Out of Stock" value={String(outOfStock)} icon={<PackageX className="h-4 w-4" />} />
      </div>

      <ActionBar>
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, category, vendor or model"
            className="h-8 w-[280px] pl-8 text-xs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto h-8"
          onClick={() => toast({ title: "Export started", description: `Exporting ${filtered.length} item(s).` })}
        >
          <Download className="mr-1.5 h-3.5 w-3.5" /> Export
        </Button>
      </ActionBar>

      <SectionCard title="Inventory Items" description={`${filtered.length} item(s)`}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Min Stock</TableHead>
                <TableHead>Unit Price</TableHead>
                <TableHead>Total Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((i) => {
                const low = i.stock < i.minStock;
                const totalValue = (i.stock * parseFloat(i.unitPrice)).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                return (
                  <TableRow key={i.id} className={low ? "bg-amber-500/5" : undefined}>
                    <TableCell className="font-mono text-xs text-primary">{i.id}</TableCell>
                    <TableCell className="font-medium">{i.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px]">{i.category}</Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{i.model}</TableCell>
                    <TableCell className="text-muted-foreground">{i.vendor}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={low ? "font-semibold text-amber-600 dark:text-amber-400" : ""}>{i.stock}</span>
                        {low && (
                          <Badge variant="outline" className="bg-amber-500/10 text-amber-700 hover:bg-amber-500/10 dark:text-amber-400">
                            <AlertTriangle className="mr-1 h-3 w-3" /> Low
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{i.minStock}</TableCell>
                    <TableCell className="font-mono text-xs">₹{i.unitPrice}</TableCell>
                    <TableCell className="font-mono text-xs font-semibold">₹{totalValue}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        {filtered.length === 0 && (
          <EmptyState icon={<PackageSearch className="h-5 w-5" />} title="No items match your search" />
        )}
      </SectionCard>
    </div>
  );
}
