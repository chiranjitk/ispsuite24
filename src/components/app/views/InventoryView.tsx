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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
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
  Save,
  X,
  Pencil,
  Trash2,
  Truck,
  Warehouse,
  Ruler,
  ClipboardList,
  ArrowLeftRight,
  Undo2,
  CreditCard,
  Loader2,
} from "lucide-react";
import {
  INVENTORY_ITEMS,
  type InventoryItem,
} from "@/lib/mock-data";

export function InventoryView({ moduleId, childId, grandchildId }: ViewProps) {
  const router = useViewRouter(moduleId, childId, grandchildId);

  if (router.state === "loading") return null;
  if (router.state === "module-overview")
    return <InventoryOverview moduleId={moduleId} />;
  if (router.state === "child-overview")
    return <ChildOverview moduleId={moduleId} childId={router.childId} />;

  if (router.state === "grandchild") {
    // Transaction sub-pages
    if (childId === "transaction" && grandchildId === "indent")
      return <IndentPage {...{ moduleId, childId, grandchildId }} />;
    if (childId === "transaction" && grandchildId === "purchase-order")
      return <PurchaseOrderPage {...{ moduleId, childId, grandchildId }} />;
    if (childId === "transaction" && grandchildId === "receipt")
      return <ReceiptPage {...{ moduleId, childId, grandchildId }} />;
    if (childId === "transaction" && grandchildId === "issue")
      return <IssuePage {...{ moduleId, childId, grandchildId }} />;
    if (childId === "transaction" && grandchildId === "stock-transfer")
      return <StockTransferPage {...{ moduleId, childId, grandchildId }} />;
    if (childId === "transaction" && grandchildId === "customer-return")
      return <CustomerReturnPage {...{ moduleId, childId, grandchildId }} />;
    if (childId === "transaction" && grandchildId === "supplier-return")
      return <SupplierReturnPage {...{ moduleId, childId, grandchildId }} />;

    // Master sub-pages
    if (childId === "master" && grandchildId === "item-master")
      return <ItemMasterPage {...{ moduleId, childId, grandchildId }} />;
    if (childId === "master" && grandchildId === "ware-house")
      return <WarehousePage {...{ moduleId, childId, grandchildId }} />;
    if (childId === "master" && grandchildId === "vendor")
      return <VendorPage {...{ moduleId, childId, grandchildId }} />;
    if (childId === "master" && grandchildId === "uom")
      return <UomPage {...{ moduleId, childId, grandchildId }} />;
    if (childId === "master" && grandchildId === "view-stock")
      return <ViewStockPage {...{ moduleId, childId, grandchildId }} />;
    if (childId === "master" && grandchildId === "emi-master")
      return <EmiMasterPage {...{ moduleId, childId, grandchildId }} />;

    return (
      <LeafPlaceholder
        moduleId={moduleId}
        childId={router.childId}
        grandchildId={router.grandchildId}
      />
    );
  }

  return <InventoryOverview moduleId={moduleId} />;
}

/* ================ Shared helpers ================ */

function useBreadcrumb(moduleId: string, childId: string, grandchildId?: string) {
  const { mod, child, grandchild } = useModuleHeader(moduleId, childId, grandchildId);
  const setActive = useAppStore((s) => s.setActive);
  return [
    { label: "Cryptsk" },
    { label: mod?.label ?? "Inventory", onClick: () => setActive(moduleId, "", "") },
    { label: child?.label ?? childId, onClick: () => setActive(moduleId, childId, "") },
    ...(grandchild ? [{ label: grandchild.label }] : []),
  ];
}

const STATUS_BADGE: Record<string, string> = {
  Open: "bg-amber-500/10 text-amber-700 hover:bg-amber-500/10 dark:text-amber-400",
  Approved: "bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400",
  Rejected: "bg-primary/10 text-primary hover:bg-primary/10",
  Closed: "bg-muted text-muted-foreground hover:bg-muted",
  Pending: "bg-amber-500/10 text-amber-700 hover:bg-amber-500/10 dark:text-amber-400",
  Received: "bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400",
  Issued: "bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400",
  Transferred: "bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400",
  Returned: "bg-primary/10 text-primary hover:bg-primary/10",
  Active: "bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400",
  Inactive: "bg-muted text-muted-foreground hover:bg-muted",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <Badge variant="outline" className={`text-[10px] ${STATUS_BADGE[status] ?? ""}`}>
      {status}
    </Badge>
  );
}

interface FormDrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
}

function FormDrawer({ open, onClose, title, description, children }: FormDrawerProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end bg-black/40 sm:items-center sm:justify-center" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-t-lg bg-card p-6 shadow-xl sm:rounded-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-2 border-b border-border pb-3">
          <div>
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="pt-4">{children}</div>
      </div>
    </div>
  );
}

function PageLoader() {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  );
}

function ConfirmDialog({
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
    { label: "Transaction", desc: "Indents, POs, receipts, issues, transfers & returns", icon: ArrowDownToLine, child: "transaction" },
    { label: "Master", desc: "Item, warehouse, vendor, UOM & stock view", icon: Boxes, child: "master" },
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

/* ================ TRANSACTION: INDENT ================ */

interface IndentRow {
  id: string;
  item: string;
  quantity: number;
  department: string;
  date: string;
  status: "Open" | "Approved" | "Rejected" | "Closed";
}

const INITIAL_INDENTS: IndentRow[] = [
  { id: "IND-2041", item: "ONT GPON", quantity: 30, department: "Field Team A", date: "04 Oct 2026", status: "Open" },
  { id: "IND-2040", item: "WiFi Router", quantity: 15, department: "Field Team B", date: "04 Oct 2026", status: "Approved" },
  { id: "IND-2039", item: "Fiber Patch Cord", quantity: 100, department: "Survey Team", date: "03 Oct 2026", status: "Closed" },
  { id: "IND-2038", item: "SFP Module", quantity: 8, department: "NOC L1", date: "03 Oct 2026", status: "Approved" },
  { id: "IND-2037", item: "RJ45 Connector", quantity: 500, department: "Franchise-12", date: "02 Oct 2026", status: "Rejected" },
];

function IndentPage({ moduleId, childId, grandchildId }: ViewProps) {
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const [rows, setRows] = React.useState<IndentRow[]>(INITIAL_INDENTS);
  const [showForm, setShowForm] = React.useState(false);
  const [form, setForm] = React.useState({ item: "", quantity: "1", department: "", date: "", status: "Open" });

  const submit = () => {
    if (!form.item.trim() || !form.department.trim()) {
      toast({ title: "Missing fields", description: "Item and department are required.", variant: "destructive" });
      return;
    }
    const id = `IND-${2042 + rows.length - INITIAL_INDENTS.length}`;
    const newRow: IndentRow = {
      id,
      item: form.item,
      quantity: Number(form.quantity) || 1,
      department: form.department,
      date: form.date || new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      status: form.status as IndentRow["status"],
    };
    setRows([newRow, ...rows]);
    toast({ title: "Indent created", description: `${id} for ${form.item}.` });
    setForm({ item: "", quantity: "1", department: "", date: "", status: "Open" });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Indent"
        description="Material indents raised by departments for procurement."
        icon={<ClipboardList className="h-5 w-5" />}
        breadcrumb={breadcrumb}
        actions={
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" /> Create Indent
          </Button>
        }
      />
      <SectionCard title="Indents" description={`${rows.length} indent(s)`}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-mono text-xs text-primary">{r.id}</TableCell>
                  <TableCell className="font-medium">{r.item}</TableCell>
                  <TableCell className="font-mono">{r.quantity}</TableCell>
                  <TableCell className="text-muted-foreground">{r.department}</TableCell>
                  <TableCell className="whitespace-nowrap text-xs text-muted-foreground">{r.date}</TableCell>
                  <TableCell><StatusBadge status={r.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {rows.length === 0 && <EmptyState icon={<ClipboardList className="h-5 w-5" />} title="No indents yet" />}
      </SectionCard>

      <FormDrawer open={showForm} onClose={() => setShowForm(false)} title="Create Indent" description="Raise a material indent for a department">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Item <span className="text-primary">*</span></Label>
            <Select value={form.item} onValueChange={(v) => setForm({ ...form, item: v })}>
              <SelectTrigger><SelectValue placeholder="Select item" /></SelectTrigger>
              <SelectContent>
                {INVENTORY_ITEMS.map((i) => (
                  <SelectItem key={i.id} value={i.name}>{i.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Quantity</Label>
            <Input type="number" min="1" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Department <span className="text-primary">*</span></Label>
            <Input placeholder="e.g. Field Team A" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Date</Label>
            <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          <Button onClick={submit}><Save className="mr-2 h-4 w-4" /> Save</Button>
        </div>
      </FormDrawer>
    </div>
  );
}

/* ================ TRANSACTION: PURCHASE ORDER ================ */

interface PORow {
  id: string;
  vendor: string;
  items: number;
  total: string;
  date: string;
  status: "Open" | "Approved" | "Received" | "Closed";
}

const INITIAL_POS: PORow[] = [
  { id: "PO-3091", vendor: "Huawei", items: 50, total: "90,000.00", date: "04 Oct 2026", status: "Open" },
  { id: "PO-3090", vendor: "TP-Link", items: 25, total: "27,500.00", date: "03 Oct 2026", status: "Approved" },
  { id: "PO-3089", vendor: "Cisco", items: 10, total: "24,000.00", date: "02 Oct 2026", status: "Received" },
  { id: "PO-3088", vendor: "OFS", items: 300, total: "13,500.00", date: "01 Oct 2026", status: "Closed" },
];

function PurchaseOrderPage({ moduleId, childId, grandchildId }: ViewProps) {
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const [rows, setRows] = React.useState<PORow[]>(INITIAL_POS);
  const [showForm, setShowForm] = React.useState(false);
  const [form, setForm] = React.useState({ vendor: "", items: "1", total: "", date: "", status: "Open" });

  const submit = () => {
    if (!form.vendor.trim() || !form.total.trim()) {
      toast({ title: "Missing fields", description: "Vendor and total are required.", variant: "destructive" });
      return;
    }
    const id = `PO-${3092 + rows.length - INITIAL_POS.length}`;
    setRows([{ id, vendor: form.vendor, items: Number(form.items) || 1, total: form.total, date: form.date || new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }), status: form.status as PORow["status"] }, ...rows]);
    toast({ title: "Purchase order created", description: `${id} → ${form.vendor}.` });
    setForm({ vendor: "", items: "1", total: "", date: "", status: "Open" });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Purchase Order" description="Purchase orders raised against vendors for procurement." icon={<Truck className="h-5 w-5" />} breadcrumb={breadcrumb}
        actions={<Button onClick={() => setShowForm(true)}><Plus className="mr-2 h-4 w-4" /> Create PO</Button>} />
      <SectionCard title="Purchase Orders" description={`${rows.length} order(s)`}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead><TableHead>Vendor</TableHead><TableHead>Items</TableHead><TableHead>Total (₹)</TableHead><TableHead>Date</TableHead><TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-mono text-xs text-primary">{r.id}</TableCell>
                  <TableCell className="font-medium">{r.vendor}</TableCell>
                  <TableCell className="font-mono">{r.items}</TableCell>
                  <TableCell className="font-mono text-xs">₹{r.total}</TableCell>
                  <TableCell className="whitespace-nowrap text-xs text-muted-foreground">{r.date}</TableCell>
                  <TableCell><StatusBadge status={r.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {rows.length === 0 && <EmptyState icon={<Truck className="h-5 w-5" />} title="No purchase orders" />}
      </SectionCard>

      <FormDrawer open={showForm} onClose={() => setShowForm(false)} title="Create Purchase Order" description="Raise a new PO against a vendor">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Vendor <span className="text-primary">*</span></Label>
            <Input placeholder="e.g. Huawei" value={form.vendor} onChange={(e) => setForm({ ...form, vendor: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Items</Label>
            <Input type="number" min="1" value={form.items} onChange={(e) => setForm({ ...form, items: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Total (₹) <span className="text-primary">*</span></Label>
            <Input type="number" step="0.01" placeholder="90000.00" value={form.total} onChange={(e) => setForm({ ...form, total: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Date</Label>
            <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Open">Open</SelectItem><SelectItem value="Approved">Approved</SelectItem><SelectItem value="Received">Received</SelectItem><SelectItem value="Closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          <Button onClick={submit}><Save className="mr-2 h-4 w-4" /> Save</Button>
        </div>
      </FormDrawer>
    </div>
  );
}

/* ================ TRANSACTION: RECEIPT ================ */

interface ReceiptRow { id: string; po: string; item: string; qtyReceived: number; date: string; }

const INITIAL_RECEIPTS: ReceiptRow[] = [
  { id: "GR-5012", po: "PO-3089", item: "SFP Module", qtyReceived: 10, date: "03 Oct 2026" },
  { id: "GR-5011", po: "PO-3088", item: "Fiber Patch Cord", qtyReceived: 300, date: "01 Oct 2026" },
  { id: "GR-5010", po: "PO-3085", item: "ONT GPON", qtyReceived: 50, date: "28 Sep 2026" },
];

function ReceiptPage({ moduleId, childId, grandchildId }: ViewProps) {
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const [rows, setRows] = React.useState<ReceiptRow[]>(INITIAL_RECEIPTS);
  const [showForm, setShowForm] = React.useState(false);
  const [form, setForm] = React.useState({ po: "", item: "", qtyReceived: "1", date: "" });

  const submit = () => {
    if (!form.po.trim() || !form.item.trim()) {
      toast({ title: "Missing fields", description: "PO and item are required.", variant: "destructive" });
      return;
    }
    const id = `GR-${5013 + rows.length - INITIAL_RECEIPTS.length}`;
    setRows([{ id, po: form.po, item: form.item, qtyReceived: Number(form.qtyReceived) || 1, date: form.date || new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) }, ...rows]);
    toast({ title: "Goods receipt recorded", description: `${id} for ${form.item}.` });
    setForm({ po: "", item: "", qtyReceived: "1", date: "" });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Receipt" description="Goods received against purchase orders." icon={<ArrowDownToLine className="h-5 w-5" />} breadcrumb={breadcrumb}
        actions={<Button onClick={() => setShowForm(true)}><Plus className="mr-2 h-4 w-4" /> New Receipt</Button>} />
      <SectionCard title="Goods Receipts" description={`${rows.length} receipt(s)`}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow><TableHead>ID</TableHead><TableHead>PO</TableHead><TableHead>Item</TableHead><TableHead>Qty Received</TableHead><TableHead>Date</TableHead></TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-mono text-xs text-primary">{r.id}</TableCell>
                  <TableCell className="font-mono text-xs">{r.po}</TableCell>
                  <TableCell className="font-medium">{r.item}</TableCell>
                  <TableCell className="font-mono">{r.qtyReceived}</TableCell>
                  <TableCell className="whitespace-nowrap text-xs text-muted-foreground">{r.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {rows.length === 0 && <EmptyState icon={<ArrowDownToLine className="h-5 w-5" />} title="No receipts" />}
      </SectionCard>

      <FormDrawer open={showForm} onClose={() => setShowForm(false)} title="New Goods Receipt" description="Record items received against a purchase order">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2"><Label>PO Reference <span className="text-primary">*</span></Label><Input placeholder="e.g. PO-3090" value={form.po} onChange={(e) => setForm({ ...form, po: e.target.value })} /></div>
          <div className="space-y-2">
            <Label>Item <span className="text-primary">*</span></Label>
            <Select value={form.item} onValueChange={(v) => setForm({ ...form, item: v })}>
              <SelectTrigger><SelectValue placeholder="Select item" /></SelectTrigger>
              <SelectContent>{INVENTORY_ITEMS.map((i) => <SelectItem key={i.id} value={i.name}>{i.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-2"><Label>Qty Received</Label><Input type="number" min="1" value={form.qtyReceived} onChange={(e) => setForm({ ...form, qtyReceived: e.target.value })} /></div>
          <div className="space-y-2"><Label>Date</Label><Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          <Button onClick={submit}><Save className="mr-2 h-4 w-4" /> Save</Button>
        </div>
      </FormDrawer>
    </div>
  );
}

/* ================ TRANSACTION: ISSUE ================ */

interface IssueRow { id: string; item: string; qty: number; issuedTo: string; date: string; }

const INITIAL_ISSUES: IssueRow[] = [
  { id: "IS-7204", item: "WiFi Router", qty: 3, issuedTo: "Field Team A", date: "04 Oct 2026" },
  { id: "IS-7203", item: "Fiber Patch Cord", qty: 20, issuedTo: "Field Team B", date: "03 Oct 2026" },
  { id: "IS-7202", item: "RJ45 Connector", qty: 200, issuedTo: "Franchise-12", date: "03 Oct 2026" },
  { id: "IS-7201", item: "PoE Injector", qty: 2, issuedTo: "NOC L1", date: "02 Oct 2026" },
];

function IssuePage({ moduleId, childId, grandchildId }: ViewProps) {
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const [rows, setRows] = React.useState<IssueRow[]>(INITIAL_ISSUES);
  const [showForm, setShowForm] = React.useState(false);
  const [form, setForm] = React.useState({ item: "", qty: "1", issuedTo: "", date: "" });

  const submit = () => {
    if (!form.item || !form.issuedTo.trim()) {
      toast({ title: "Missing fields", description: "Item and recipient are required.", variant: "destructive" });
      return;
    }
    const id = `IS-${7205 + rows.length - INITIAL_ISSUES.length}`;
    setRows([{ id, item: form.item, qty: Number(form.qty) || 1, issuedTo: form.issuedTo, date: form.date || new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) }, ...rows]);
    toast({ title: "Stock issued", description: `${id}: ${form.qty} × ${form.item} → ${form.issuedTo}.` });
    setForm({ item: "", qty: "1", issuedTo: "", date: "" });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Issue" description="Stock issued to field teams, franchises or departments." icon={<ArrowUpFromLine className="h-5 w-5" />} breadcrumb={breadcrumb}
        actions={<Button onClick={() => setShowForm(true)}><Plus className="mr-2 h-4 w-4" /> New Issue</Button>} />
      <SectionCard title="Stock Issues" description={`${rows.length} issue(s)`}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow><TableHead>ID</TableHead><TableHead>Item</TableHead><TableHead>Qty</TableHead><TableHead>Issued To</TableHead><TableHead>Date</TableHead></TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-mono text-xs text-primary">{r.id}</TableCell>
                  <TableCell className="font-medium">{r.item}</TableCell>
                  <TableCell className="font-mono">{r.qty}</TableCell>
                  <TableCell className="text-muted-foreground">{r.issuedTo}</TableCell>
                  <TableCell className="whitespace-nowrap text-xs text-muted-foreground">{r.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {rows.length === 0 && <EmptyState icon={<ArrowUpFromLine className="h-5 w-5" />} title="No issues recorded" />}
      </SectionCard>

      <FormDrawer open={showForm} onClose={() => setShowForm(false)} title="New Stock Issue" description="Issue stock from inventory to a team / franchise">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Item <span className="text-primary">*</span></Label>
            <Select value={form.item} onValueChange={(v) => setForm({ ...form, item: v })}>
              <SelectTrigger><SelectValue placeholder="Select item" /></SelectTrigger>
              <SelectContent>{INVENTORY_ITEMS.map((i) => <SelectItem key={i.id} value={i.name}>{i.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-2"><Label>Quantity</Label><Input type="number" min="1" value={form.qty} onChange={(e) => setForm({ ...form, qty: e.target.value })} /></div>
          <div className="space-y-2"><Label>Issued To <span className="text-primary">*</span></Label><Input placeholder="e.g. Field Team A" value={form.issuedTo} onChange={(e) => setForm({ ...form, issuedTo: e.target.value })} /></div>
          <div className="space-y-2"><Label>Date</Label><Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          <Button onClick={submit}><Save className="mr-2 h-4 w-4" /> Save</Button>
        </div>
      </FormDrawer>
    </div>
  );
}

/* ================ TRANSACTION: STOCK TRANSFER ================ */

interface TransferRow { id: string; fromWarehouse: string; toWarehouse: string; item: string; qty: number; date: string; }

const INITIAL_TRANSFERS: TransferRow[] = [
  { id: "ST-1102", fromWarehouse: "WH-Central", toWarehouse: "WH-North", item: "ONT GPON", qty: 10, date: "04 Oct 2026" },
  { id: "ST-1101", fromWarehouse: "WH-South", toWarehouse: "WH-Central", item: "WiFi Router", qty: 5, date: "03 Oct 2026" },
  { id: "ST-1100", fromWarehouse: "WH-Central", toWarehouse: "WH-East", item: "Fiber Patch Cord", qty: 50, date: "02 Oct 2026" },
];

const WAREHOUSES = ["WH-Central", "WH-North", "WH-South", "WH-East", "WH-West"];

function StockTransferPage({ moduleId, childId, grandchildId }: ViewProps) {
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const [rows, setRows] = React.useState<TransferRow[]>(INITIAL_TRANSFERS);
  const [showForm, setShowForm] = React.useState(false);
  const [form, setForm] = React.useState({ fromWarehouse: "", toWarehouse: "", item: "", qty: "1", date: "" });

  const submit = () => {
    if (!form.fromWarehouse || !form.toWarehouse || !form.item) {
      toast({ title: "Missing fields", description: "From, To and Item are required.", variant: "destructive" });
      return;
    }
    if (form.fromWarehouse === form.toWarehouse) {
      toast({ title: "Invalid transfer", description: "Source and destination must differ.", variant: "destructive" });
      return;
    }
    const id = `ST-${1103 + rows.length - INITIAL_TRANSFERS.length}`;
    setRows([{ id, fromWarehouse: form.fromWarehouse, toWarehouse: form.toWarehouse, item: form.item, qty: Number(form.qty) || 1, date: form.date || new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) }, ...rows]);
    toast({ title: "Transfer recorded", description: `${id}: ${form.qty} × ${form.item}.` });
    setForm({ fromWarehouse: "", toWarehouse: "", item: "", qty: "1", date: "" });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Stock Transfer" description="Inter-warehouse stock movements." icon={<ArrowLeftRight className="h-5 w-5" />} breadcrumb={breadcrumb}
        actions={<Button onClick={() => setShowForm(true)}><Plus className="mr-2 h-4 w-4" /> New Transfer</Button>} />
      <SectionCard title="Stock Transfers" description={`${rows.length} transfer(s)`}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow><TableHead>ID</TableHead><TableHead>From Warehouse</TableHead><TableHead>To Warehouse</TableHead><TableHead>Item</TableHead><TableHead>Qty</TableHead><TableHead>Date</TableHead></TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-mono text-xs text-primary">{r.id}</TableCell>
                  <TableCell className="text-muted-foreground">{r.fromWarehouse}</TableCell>
                  <TableCell className="text-muted-foreground">{r.toWarehouse}</TableCell>
                  <TableCell className="font-medium">{r.item}</TableCell>
                  <TableCell className="font-mono">{r.qty}</TableCell>
                  <TableCell className="whitespace-nowrap text-xs text-muted-foreground">{r.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {rows.length === 0 && <EmptyState icon={<ArrowLeftRight className="h-5 w-5" />} title="No transfers recorded" />}
      </SectionCard>

      <FormDrawer open={showForm} onClose={() => setShowForm(false)} title="New Stock Transfer" description="Move stock between warehouses">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>From Warehouse <span className="text-primary">*</span></Label>
            <Select value={form.fromWarehouse} onValueChange={(v) => setForm({ ...form, fromWarehouse: v })}>
              <SelectTrigger><SelectValue placeholder="Select source" /></SelectTrigger>
              <SelectContent>{WAREHOUSES.map((w) => <SelectItem key={w} value={w}>{w}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>To Warehouse <span className="text-primary">*</span></Label>
            <Select value={form.toWarehouse} onValueChange={(v) => setForm({ ...form, toWarehouse: v })}>
              <SelectTrigger><SelectValue placeholder="Select destination" /></SelectTrigger>
              <SelectContent>{WAREHOUSES.map((w) => <SelectItem key={w} value={w}>{w}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Item <span className="text-primary">*</span></Label>
            <Select value={form.item} onValueChange={(v) => setForm({ ...form, item: v })}>
              <SelectTrigger><SelectValue placeholder="Select item" /></SelectTrigger>
              <SelectContent>{INVENTORY_ITEMS.map((i) => <SelectItem key={i.id} value={i.name}>{i.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-2"><Label>Quantity</Label><Input type="number" min="1" value={form.qty} onChange={(e) => setForm({ ...form, qty: e.target.value })} /></div>
          <div className="space-y-2 sm:col-span-2"><Label>Date</Label><Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          <Button onClick={submit}><Save className="mr-2 h-4 w-4" /> Save</Button>
        </div>
      </FormDrawer>
    </div>
  );
}

/* ================ TRANSACTION: CUSTOMER RETURN ================ */

interface CustReturnRow { id: string; customer: string; item: string; qty: number; reason: string; date: string; }

const INITIAL_CUST_RETURNS: CustReturnRow[] = [
  { id: "CR-088", customer: "shubham270597", item: "ONT GPON", qty: 1, reason: "Faulty unit", date: "04 Oct 2026" },
  { id: "CR-087", customer: "rajesh130773", item: "WiFi Router", qty: 1, reason: "Plan upgrade", date: "02 Oct 2026" },
  { id: "CR-086", customer: "suresh030381", item: "SFP Module", qty: 1, reason: "Wrong model supplied", date: "01 Oct 2026" },
];

const RETURN_REASONS = ["Faulty unit", "Wrong model supplied", "Plan upgrade", "Customer request", "Damage in transit", "Other"];

function CustomerReturnPage({ moduleId, childId, grandchildId }: ViewProps) {
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const [rows, setRows] = React.useState<CustReturnRow[]>(INITIAL_CUST_RETURNS);
  const [showForm, setShowForm] = React.useState(false);
  const [form, setForm] = React.useState({ customer: "", item: "", qty: "1", reason: "", date: "" });

  const submit = () => {
    if (!form.customer.trim() || !form.item || !form.reason) {
      toast({ title: "Missing fields", description: "Customer, item and reason are required.", variant: "destructive" });
      return;
    }
    const id = `CR-${89 + rows.length - INITIAL_CUST_RETURNS.length}`;
    setRows([{ id, customer: form.customer, item: form.item, qty: Number(form.qty) || 1, reason: form.reason, date: form.date || new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) }, ...rows]);
    toast({ title: "Customer return recorded", description: `${id}: ${form.item} from ${form.customer}.` });
    setForm({ customer: "", item: "", qty: "1", reason: "", date: "" });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Customer Return" description="Items returned by customers." icon={<Undo2 className="h-5 w-5" />} breadcrumb={breadcrumb}
        actions={<Button onClick={() => setShowForm(true)}><Plus className="mr-2 h-4 w-4" /> New Return</Button>} />
      <SectionCard title="Customer Returns" description={`${rows.length} return(s)`}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow><TableHead>ID</TableHead><TableHead>Customer</TableHead><TableHead>Item</TableHead><TableHead>Qty</TableHead><TableHead>Reason</TableHead><TableHead>Date</TableHead></TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-mono text-xs text-primary">{r.id}</TableCell>
                  <TableCell className="font-medium">{r.customer}</TableCell>
                  <TableCell>{r.item}</TableCell>
                  <TableCell className="font-mono">{r.qty}</TableCell>
                  <TableCell className="text-muted-foreground">{r.reason}</TableCell>
                  <TableCell className="whitespace-nowrap text-xs text-muted-foreground">{r.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {rows.length === 0 && <EmptyState icon={<Undo2 className="h-5 w-5" />} title="No customer returns" />}
      </SectionCard>

      <FormDrawer open={showForm} onClose={() => setShowForm(false)} title="New Customer Return" description="Record an item returned by a customer">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2"><Label>Customer <span className="text-primary">*</span></Label><Input placeholder="Account / username" value={form.customer} onChange={(e) => setForm({ ...form, customer: e.target.value })} /></div>
          <div className="space-y-2">
            <Label>Item <span className="text-primary">*</span></Label>
            <Select value={form.item} onValueChange={(v) => setForm({ ...form, item: v })}>
              <SelectTrigger><SelectValue placeholder="Select item" /></SelectTrigger>
              <SelectContent>{INVENTORY_ITEMS.map((i) => <SelectItem key={i.id} value={i.name}>{i.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-2"><Label>Quantity</Label><Input type="number" min="1" value={form.qty} onChange={(e) => setForm({ ...form, qty: e.target.value })} /></div>
          <div className="space-y-2">
            <Label>Reason <span className="text-primary">*</span></Label>
            <Select value={form.reason} onValueChange={(v) => setForm({ ...form, reason: v })}>
              <SelectTrigger><SelectValue placeholder="Select reason" /></SelectTrigger>
              <SelectContent>{RETURN_REASONS.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-2 sm:col-span-2"><Label>Date</Label><Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          <Button onClick={submit}><Save className="mr-2 h-4 w-4" /> Save</Button>
        </div>
      </FormDrawer>
    </div>
  );
}

/* ================ TRANSACTION: SUPPLIER RETURN ================ */

interface SuppReturnRow { id: string; supplier: string; item: string; qty: number; reason: string; date: string; }

const INITIAL_SUPP_RETURNS: SuppReturnRow[] = [
  { id: "SR-045", supplier: "Huawei", item: "ONT GPON", qty: 2, reason: "Faulty batch", date: "03 Oct 2026" },
  { id: "SR-044", supplier: "TP-Link", item: "WiFi Router", qty: 1, reason: "Wrong model supplied", date: "01 Oct 2026" },
];

function SupplierReturnPage({ moduleId, childId, grandchildId }: ViewProps) {
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const [rows, setRows] = React.useState<SuppReturnRow[]>(INITIAL_SUPP_RETURNS);
  const [showForm, setShowForm] = React.useState(false);
  const [form, setForm] = React.useState({ supplier: "", item: "", qty: "1", reason: "", date: "" });

  const submit = () => {
    if (!form.supplier.trim() || !form.item || !form.reason) {
      toast({ title: "Missing fields", description: "Supplier, item and reason are required.", variant: "destructive" });
      return;
    }
    const id = `SR-${46 + rows.length - INITIAL_SUPP_RETURNS.length}`;
    setRows([{ id, supplier: form.supplier, item: form.item, qty: Number(form.qty) || 1, reason: form.reason, date: form.date || new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) }, ...rows]);
    toast({ title: "Supplier return recorded", description: `${id}: ${form.item} → ${form.supplier}.` });
    setForm({ supplier: "", item: "", qty: "1", reason: "", date: "" });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Supplier Return" description="Items returned to suppliers (defective / wrong supply)." icon={<Truck className="h-5 w-5 rotate-180" />} breadcrumb={breadcrumb}
        actions={<Button onClick={() => setShowForm(true)}><Plus className="mr-2 h-4 w-4" /> New Return</Button>} />
      <SectionCard title="Supplier Returns" description={`${rows.length} return(s)`}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow><TableHead>ID</TableHead><TableHead>Supplier</TableHead><TableHead>Item</TableHead><TableHead>Qty</TableHead><TableHead>Reason</TableHead><TableHead>Date</TableHead></TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-mono text-xs text-primary">{r.id}</TableCell>
                  <TableCell className="font-medium">{r.supplier}</TableCell>
                  <TableCell>{r.item}</TableCell>
                  <TableCell className="font-mono">{r.qty}</TableCell>
                  <TableCell className="text-muted-foreground">{r.reason}</TableCell>
                  <TableCell className="whitespace-nowrap text-xs text-muted-foreground">{r.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {rows.length === 0 && <EmptyState icon={<Truck className="h-5 w-5" />} title="No supplier returns" />}
      </SectionCard>

      <FormDrawer open={showForm} onClose={() => setShowForm(false)} title="New Supplier Return" description="Record an item returned to a supplier">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2"><Label>Supplier <span className="text-primary">*</span></Label><Input placeholder="e.g. Huawei" value={form.supplier} onChange={(e) => setForm({ ...form, supplier: e.target.value })} /></div>
          <div className="space-y-2">
            <Label>Item <span className="text-primary">*</span></Label>
            <Select value={form.item} onValueChange={(v) => setForm({ ...form, item: v })}>
              <SelectTrigger><SelectValue placeholder="Select item" /></SelectTrigger>
              <SelectContent>{INVENTORY_ITEMS.map((i) => <SelectItem key={i.id} value={i.name}>{i.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-2"><Label>Quantity</Label><Input type="number" min="1" value={form.qty} onChange={(e) => setForm({ ...form, qty: e.target.value })} /></div>
          <div className="space-y-2">
            <Label>Reason <span className="text-primary">*</span></Label>
            <Select value={form.reason} onValueChange={(v) => setForm({ ...form, reason: v })}>
              <SelectTrigger><SelectValue placeholder="Select reason" /></SelectTrigger>
              <SelectContent>{RETURN_REASONS.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-2 sm:col-span-2"><Label>Date</Label><Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          <Button onClick={submit}><Save className="mr-2 h-4 w-4" /> Save</Button>
        </div>
      </FormDrawer>
    </div>
  );
}

/* ================ MASTER: ITEM MASTER ================ */

function ItemMasterPage({ moduleId, childId, grandchildId }: ViewProps) {
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const [rows, setRows] = React.useState<InventoryItem[]>(INVENTORY_ITEMS);
  const [showForm, setShowForm] = React.useState(false);
  const [editId, setEditId] = React.useState<string | null>(null);
  const [delId, setDelId] = React.useState<string | null>(null);
  const [form, setForm] = React.useState({ id: "", name: "", category: "", model: "", vendor: "", stock: "0", minStock: "0", unitPrice: "0.00" });

  const openCreate = () => {
    setEditId(null);
    setForm({ id: `INV${String(rows.length + 1).padStart(3, "0")}`, name: "", category: "", model: "", vendor: "", stock: "0", minStock: "0", unitPrice: "0.00" });
    setShowForm(true);
  };

  const openEdit = (r: InventoryItem) => {
    setEditId(r.id);
    setForm({ id: r.id, name: r.name, category: r.category, model: r.model, vendor: r.vendor, stock: String(r.stock), minStock: String(r.minStock), unitPrice: r.unitPrice });
    setShowForm(true);
  };

  const submit = () => {
    if (!form.name.trim() || !form.category.trim()) {
      toast({ title: "Missing fields", description: "Name and category are required.", variant: "destructive" });
      return;
    }
    const item: InventoryItem = {
      id: form.id,
      name: form.name,
      category: form.category,
      model: form.model,
      vendor: form.vendor,
      stock: Number(form.stock) || 0,
      minStock: Number(form.minStock) || 0,
      unitPrice: form.unitPrice,
    };
    if (editId) {
      setRows(rows.map((r) => (r.id === editId ? item : r)));
      toast({ title: "Item updated", description: item.name });
    } else {
      setRows([item, ...rows]);
      toast({ title: "Item created", description: item.name });
    }
    setShowForm(false);
  };

  const confirmDelete = () => {
    if (!delId) return;
    const item = rows.find((r) => r.id === delId);
    setRows(rows.filter((r) => r.id !== delId));
    toast({ title: "Item deleted", description: item?.name ?? delId, variant: "destructive" });
    setDelId(null);
  };

  const totalValue = rows.reduce((s, r) => s + r.stock * parseFloat(r.unitPrice), 0);

  return (
    <div className="space-y-6">
      <PageHeader title="Item Master" description="Master list of inventory items with stock, vendor & valuation." icon={<Boxes className="h-5 w-5" />} breadcrumb={breadcrumb}
        actions={<Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" /> Add Item</Button>} />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard label="Total Items" value={String(rows.length)} icon={<Boxes className="h-4 w-4" />} accent />
        <KpiCard label="Stock Value" value={`₹${totalValue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`} icon={<DollarSign className="h-4 w-4" />} />
        <KpiCard label="Low Stock" value={String(rows.filter((r) => r.stock < r.minStock).length)} icon={<AlertTriangle className="h-4 w-4" />} />
        <KpiCard label="Out of Stock" value={String(rows.filter((r) => r.stock === 0).length)} icon={<PackageX className="h-4 w-4" />} />
      </div>
      <SectionCard title="Items" description={`${rows.length} item(s)`}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow><TableHead>ID</TableHead><TableHead>Name</TableHead><TableHead>Category</TableHead><TableHead>Model</TableHead><TableHead>Vendor</TableHead><TableHead>Unit Price</TableHead><TableHead>Stock</TableHead><TableHead className="text-right">Actions</TableHead></TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => {
                const low = r.stock < r.minStock;
                return (
                  <TableRow key={r.id} className={low ? "bg-amber-500/5" : undefined}>
                    <TableCell className="font-mono text-xs text-primary">{r.id}</TableCell>
                    <TableCell className="font-medium">{r.name}</TableCell>
                    <TableCell><Badge variant="outline" className="text-[10px]">{r.category}</Badge></TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{r.model}</TableCell>
                    <TableCell className="text-muted-foreground">{r.vendor}</TableCell>
                    <TableCell className="font-mono text-xs">₹{r.unitPrice}</TableCell>
                    <TableCell className={low ? "font-semibold text-amber-600 dark:text-amber-400" : ""}>{r.stock}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => openEdit(r)}><Pencil className="mr-1.5 h-3.5 w-3.5" /> Edit</Button>
                        <Button variant="ghost" size="sm" className="text-primary" onClick={() => setDelId(r.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        {rows.length === 0 && <EmptyState icon={<PackageSearch className="h-5 w-5" />} title="No items" />}
      </SectionCard>

      <FormDrawer open={showForm} onClose={() => setShowForm(false)} title={editId ? "Edit Item" : "Add Item"} description={editId ? `Editing ${editId}` : "Create a new inventory item"}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2"><Label>ID</Label><Input value={form.id} disabled /></div>
          <div className="space-y-2"><Label>Name <span className="text-primary">*</span></Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div className="space-y-2"><Label>Category <span className="text-primary">*</span></Label><Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></div>
          <div className="space-y-2"><Label>Model</Label><Input value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} /></div>
          <div className="space-y-2"><Label>Vendor</Label><Input value={form.vendor} onChange={(e) => setForm({ ...form, vendor: e.target.value })} /></div>
          <div className="space-y-2"><Label>Unit Price (₹)</Label><Input type="number" step="0.01" value={form.unitPrice} onChange={(e) => setForm({ ...form, unitPrice: e.target.value })} /></div>
          <div className="space-y-2"><Label>Stock</Label><Input type="number" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} /></div>
          <div className="space-y-2"><Label>Min Stock</Label><Input type="number" min="0" value={form.minStock} onChange={(e) => setForm({ ...form, minStock: e.target.value })} /></div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          <Button onClick={submit}><Save className="mr-2 h-4 w-4" /> {editId ? "Update" : "Create"}</Button>
        </div>
      </FormDrawer>

      <ConfirmDialog open={!!delId} onOpenChange={(o) => !o && setDelId(null)} onConfirm={confirmDelete} title="Delete item?" description="This action cannot be undone." />
    </div>
  );
}

/* ================ MASTER: WAREHOUSE ================ */

interface WarehouseRow { id: string; name: string; location: string; description: string; }

const INITIAL_WAREHOUSES: WarehouseRow[] = [
  { id: "WH01", name: "WH-Central", location: "Bhiwani-Core", description: "Main central warehouse" },
  { id: "WH02", name: "WH-North", location: "Bhiwani-North", description: "North zone warehouse" },
  { id: "WH03", name: "WH-South", location: "Bhiwani-South", description: "South zone warehouse" },
  { id: "WH04", name: "WH-East", location: "Bhiwani-East", description: "East zone warehouse" },
];

function WarehousePage({ moduleId, childId, grandchildId }: ViewProps) {
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const [rows, setRows] = React.useState<WarehouseRow[]>(INITIAL_WAREHOUSES);
  const [showForm, setShowForm] = React.useState(false);
  const [editId, setEditId] = React.useState<string | null>(null);
  const [delId, setDelId] = React.useState<string | null>(null);
  const [form, setForm] = React.useState({ id: "", name: "", location: "", description: "" });

  const openCreate = () => {
    setEditId(null);
    setForm({ id: `WH${String(rows.length + 1).padStart(2, "0")}`, name: "", location: "", description: "" });
    setShowForm(true);
  };
  const openEdit = (r: WarehouseRow) => {
    setEditId(r.id);
    setForm({ id: r.id, name: r.name, location: r.location, description: r.description });
    setShowForm(true);
  };
  const submit = () => {
    if (!form.name.trim() || !form.location.trim()) {
      toast({ title: "Missing fields", description: "Name and location are required.", variant: "destructive" });
      return;
    }
    const item: WarehouseRow = { ...form };
    if (editId) {
      setRows(rows.map((r) => (r.id === editId ? item : r)));
      toast({ title: "Warehouse updated", description: item.name });
    } else {
      setRows([item, ...rows]);
      toast({ title: "Warehouse created", description: item.name });
    }
    setShowForm(false);
  };
  const confirmDelete = () => {
    if (!delId) return;
    setRows(rows.filter((r) => r.id !== delId));
    toast({ title: "Warehouse deleted", description: delId, variant: "destructive" });
    setDelId(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Ware House" description="Manage warehouse master records." icon={<Warehouse className="h-5 w-5" />} breadcrumb={breadcrumb}
        actions={<Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" /> Add Warehouse</Button>} />
      <SectionCard title="Warehouses" description={`${rows.length} warehouse(s)`}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader><TableRow><TableHead>ID</TableHead><TableHead>Name</TableHead><TableHead>Location</TableHead><TableHead>Description</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-mono text-xs text-primary">{r.id}</TableCell>
                  <TableCell className="font-medium">{r.name}</TableCell>
                  <TableCell className="text-muted-foreground">{r.location}</TableCell>
                  <TableCell className="text-muted-foreground">{r.description}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(r)}><Pencil className="mr-1.5 h-3.5 w-3.5" /> Edit</Button>
                      <Button variant="ghost" size="sm" className="text-primary" onClick={() => setDelId(r.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {rows.length === 0 && <EmptyState icon={<Warehouse className="h-5 w-5" />} title="No warehouses" />}
      </SectionCard>

      <FormDrawer open={showForm} onClose={() => setShowForm(false)} title={editId ? "Edit Warehouse" : "Add Warehouse"}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2"><Label>ID</Label><Input value={form.id} disabled /></div>
          <div className="space-y-2"><Label>Name <span className="text-primary">*</span></Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div className="space-y-2"><Label>Location <span className="text-primary">*</span></Label><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
          <div className="space-y-2 sm:col-span-2"><Label>Description</Label><Textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          <Button onClick={submit}><Save className="mr-2 h-4 w-4" /> {editId ? "Update" : "Create"}</Button>
        </div>
      </FormDrawer>

      <ConfirmDialog open={!!delId} onOpenChange={(o) => !o && setDelId(null)} onConfirm={confirmDelete} title="Delete warehouse?" description="This action cannot be undone." />
    </div>
  );
}

/* ================ MASTER: VENDOR ================ */

interface VendorRow { id: string; name: string; contact: string; email: string; phone: string; address: string; }

const INITIAL_VENDORS: VendorRow[] = [
  { id: "V01", name: "Huawei", contact: "Rajeev Menon", email: "sales@huawei-india.com", phone: "+91-11-4098-0000", address: "Gurgaon, Haryana" },
  { id: "V02", name: "TP-Link", contact: "Priya Sharma", email: "b2b@tp-link.com", phone: "+91-80-6789-1234", address: "Bengaluru, Karnataka" },
  { id: "V03", name: "Cisco", contact: "Anand Iyer", email: "partners@cisco.com", phone: "+91-22-6677-8900", address: "Mumbai, Maharashtra" },
  { id: "V04", name: "OFS", contact: "Sandeep Kulkarni", email: "apac@ofsoptics.com", phone: "+91-80-2345-6789", address: "Pune, Maharashtra" },
];

function VendorPage({ moduleId, childId, grandchildId }: ViewProps) {
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const [rows, setRows] = React.useState<VendorRow[]>(INITIAL_VENDORS);
  const [showForm, setShowForm] = React.useState(false);
  const [editId, setEditId] = React.useState<string | null>(null);
  const [delId, setDelId] = React.useState<string | null>(null);
  const [form, setForm] = React.useState({ id: "", name: "", contact: "", email: "", phone: "", address: "" });

  const openCreate = () => {
    setEditId(null);
    setForm({ id: `V${String(rows.length + 1).padStart(2, "0")}`, name: "", contact: "", email: "", phone: "", address: "" });
    setShowForm(true);
  };
  const openEdit = (r: VendorRow) => {
    setEditId(r.id);
    setForm({ ...r });
    setShowForm(true);
  };
  const submit = () => {
    if (!form.name.trim() || !form.contact.trim()) {
      toast({ title: "Missing fields", description: "Name and contact are required.", variant: "destructive" });
      return;
    }
    const item: VendorRow = { ...form };
    if (editId) {
      setRows(rows.map((r) => (r.id === editId ? item : r)));
      toast({ title: "Vendor updated", description: item.name });
    } else {
      setRows([item, ...rows]);
      toast({ title: "Vendor created", description: item.name });
    }
    setShowForm(false);
  };
  const confirmDelete = () => {
    if (!delId) return;
    setRows(rows.filter((r) => r.id !== delId));
    toast({ title: "Vendor deleted", description: delId, variant: "destructive" });
    setDelId(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Vendor" description="Vendor / supplier master records." icon={<Truck className="h-5 w-5" />} breadcrumb={breadcrumb}
        actions={<Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" /> Add Vendor</Button>} />
      <SectionCard title="Vendors" description={`${rows.length} vendor(s)`}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader><TableRow><TableHead>ID</TableHead><TableHead>Name</TableHead><TableHead>Contact</TableHead><TableHead>Email</TableHead><TableHead>Phone</TableHead><TableHead>Address</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-mono text-xs text-primary">{r.id}</TableCell>
                  <TableCell className="font-medium">{r.name}</TableCell>
                  <TableCell className="text-muted-foreground">{r.contact}</TableCell>
                  <TableCell className="text-muted-foreground">{r.email}</TableCell>
                  <TableCell className="whitespace-nowrap font-mono text-xs">{r.phone}</TableCell>
                  <TableCell className="text-muted-foreground">{r.address}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(r)}><Pencil className="mr-1.5 h-3.5 w-3.5" /> Edit</Button>
                      <Button variant="ghost" size="sm" className="text-primary" onClick={() => setDelId(r.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {rows.length === 0 && <EmptyState icon={<Truck className="h-5 w-5" />} title="No vendors" />}
      </SectionCard>

      <FormDrawer open={showForm} onClose={() => setShowForm(false)} title={editId ? "Edit Vendor" : "Add Vendor"}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2"><Label>ID</Label><Input value={form.id} disabled /></div>
          <div className="space-y-2"><Label>Name <span className="text-primary">*</span></Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div className="space-y-2"><Label>Contact Person <span className="text-primary">*</span></Label><Input value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} /></div>
          <div className="space-y-2"><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
          <div className="space-y-2"><Label>Phone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
          <div className="space-y-2 sm:col-span-2"><Label>Address</Label><Textarea rows={2} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          <Button onClick={submit}><Save className="mr-2 h-4 w-4" /> {editId ? "Update" : "Create"}</Button>
        </div>
      </FormDrawer>

      <ConfirmDialog open={!!delId} onOpenChange={(o) => !o && setDelId(null)} onConfirm={confirmDelete} title="Delete vendor?" description="This action cannot be undone." />
    </div>
  );
}

/* ================ MASTER: UOM ================ */

interface UomRow { id: string; name: string; description: string; }

const INITIAL_UOMS: UomRow[] = [
  { id: "U01", name: "Piece", description: "Single unit" },
  { id: "U02", name: "Box", description: "Box of 10 pieces" },
  { id: "U03", name: "Meter", description: "Length in meters" },
  { id: "U04", name: "Roll", description: "Roll of 305 m" },
  { id: "U05", name: "Set", description: "Combo set" },
];

function UomPage({ moduleId, childId, grandchildId }: ViewProps) {
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const [rows, setRows] = React.useState<UomRow[]>(INITIAL_UOMS);
  const [showForm, setShowForm] = React.useState(false);
  const [editId, setEditId] = React.useState<string | null>(null);
  const [delId, setDelId] = React.useState<string | null>(null);
  const [form, setForm] = React.useState({ id: "", name: "", description: "" });

  const openCreate = () => {
    setEditId(null);
    setForm({ id: `U${String(rows.length + 1).padStart(2, "0")}`, name: "", description: "" });
    setShowForm(true);
  };
  const openEdit = (r: UomRow) => {
    setEditId(r.id);
    setForm({ ...r });
    setShowForm(true);
  };
  const submit = () => {
    if (!form.name.trim()) {
      toast({ title: "Missing fields", description: "Name is required.", variant: "destructive" });
      return;
    }
    const item: UomRow = { ...form };
    if (editId) {
      setRows(rows.map((r) => (r.id === editId ? item : r)));
      toast({ title: "UOM updated", description: item.name });
    } else {
      setRows([item, ...rows]);
      toast({ title: "UOM created", description: item.name });
    }
    setShowForm(false);
  };
  const confirmDelete = () => {
    if (!delId) return;
    setRows(rows.filter((r) => r.id !== delId));
    toast({ title: "UOM deleted", description: delId, variant: "destructive" });
    setDelId(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Unit of Measure" description="Units of measure master." icon={<Ruler className="h-5 w-5" />} breadcrumb={breadcrumb}
        actions={<Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" /> Add UOM</Button>} />
      <SectionCard title="Units of Measure" description={`${rows.length} unit(s)`}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader><TableRow><TableHead>ID</TableHead><TableHead>Name</TableHead><TableHead>Description</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-mono text-xs text-primary">{r.id}</TableCell>
                  <TableCell className="font-medium">{r.name}</TableCell>
                  <TableCell className="text-muted-foreground">{r.description}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(r)}><Pencil className="mr-1.5 h-3.5 w-3.5" /> Edit</Button>
                      <Button variant="ghost" size="sm" className="text-primary" onClick={() => setDelId(r.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {rows.length === 0 && <EmptyState icon={<Ruler className="h-5 w-5" />} title="No UOMs" />}
      </SectionCard>

      <FormDrawer open={showForm} onClose={() => setShowForm(false)} title={editId ? "Edit UOM" : "Add UOM"}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2"><Label>ID</Label><Input value={form.id} disabled /></div>
          <div className="space-y-2"><Label>Name <span className="text-primary">*</span></Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div className="space-y-2 sm:col-span-2"><Label>Description</Label><Textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          <Button onClick={submit}><Save className="mr-2 h-4 w-4" /> {editId ? "Update" : "Create"}</Button>
        </div>
      </FormDrawer>

      <ConfirmDialog open={!!delId} onOpenChange={(o) => !o && setDelId(null)} onConfirm={confirmDelete} title="Delete UOM?" description="This action cannot be undone." />
    </div>
  );
}

/* ================ MASTER: VIEW STOCK ================ */

function ViewStockPage({ moduleId, childId, grandchildId }: ViewProps) {
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const [search, setSearch] = React.useState("");
  const [whFilter, setWhFilter] = React.useState("all");

  // Compute stock rows from INVENTORY_ITEMS × warehouses
  const stockRows = React.useMemo(() => {
    const out: { item: string; warehouse: string; qty: number; minStock: number; value: string }[] = [];
    INVENTORY_ITEMS.forEach((i) => {
      WAREHOUSES.forEach((w, idx) => {
        // simulate distribution: most stock at central
        const qty = idx === 0 ? i.stock : Math.floor(i.stock / (WAREHOUSES.length - idx));
        out.push({ item: i.name, warehouse: w, qty, minStock: i.minStock, value: (qty * parseFloat(i.unitPrice)).toFixed(2) });
      });
    });
    return out;
  }, []);

  const filtered = stockRows.filter((r) => {
    if (whFilter !== "all" && r.warehouse !== whFilter) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return r.item.toLowerCase().includes(q) || r.warehouse.toLowerCase().includes(q);
  });

  const totalValue = filtered.reduce((s, r) => s + parseFloat(r.value), 0);

  return (
    <div className="space-y-6">
      <PageHeader title="View Stock" description="Current stock levels across warehouses (read-only)." icon={<PackageSearch className="h-5 w-5" />} breadcrumb={breadcrumb}
        actions={
          <Button variant="outline" onClick={() => toast({ title: "Export started", description: `Exporting ${filtered.length} row(s).` })}>
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
        } />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <KpiCard label="Total Rows" value={String(filtered.length)} icon={<PackageSearch className="h-4 w-4" />} accent />
        <KpiCard label="Stock Value" value={`₹${totalValue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`} icon={<DollarSign className="h-4 w-4" />} />
        <KpiCard label="Low Stock" value={String(filtered.filter((r) => r.qty < r.minStock).length)} icon={<AlertTriangle className="h-4 w-4" />} />
      </div>
      <ActionBar>
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search item or warehouse" className="h-8 w-[280px] pl-8 text-xs" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={whFilter} onValueChange={setWhFilter}>
          <SelectTrigger className="h-8 w-[160px]"><SelectValue placeholder="Warehouse" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All warehouses</SelectItem>
            {WAREHOUSES.map((w) => <SelectItem key={w} value={w}>{w}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" className="ml-auto h-8 w-8 p-0" onClick={() => { setSearch(""); setWhFilter("all"); toast({ title: "Filters cleared" }); }}>
          <RefreshCw className="h-3.5 w-3.5" />
        </Button>
      </ActionBar>
      <SectionCard title="Stock Levels" description={`${filtered.length} row(s)`}>
        <div className="max-h-96 overflow-y-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-card">
              <TableRow><TableHead>Item</TableHead><TableHead>Warehouse</TableHead><TableHead>Quantity</TableHead><TableHead>Min Stock</TableHead><TableHead>Value (₹)</TableHead></TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((r, i) => {
                const low = r.qty < r.minStock;
                return (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{r.item}</TableCell>
                    <TableCell className="text-muted-foreground">{r.warehouse}</TableCell>
                    <TableCell className={low ? "font-semibold text-amber-600 dark:text-amber-400" : ""}>{r.qty}</TableCell>
                    <TableCell className="text-muted-foreground">{r.minStock}</TableCell>
                    <TableCell className="font-mono text-xs">{r.value}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        {filtered.length === 0 && <EmptyState icon={<PackageSearch className="h-5 w-5" />} title="No stock rows match your filters" />}
      </SectionCard>
    </div>
  );
}

/* ================ MASTER: EMI MASTER ================ */

interface EmiRow { id: string; name: string; duration: string; interestRate: string; status: "Active" | "Inactive"; }

const INITIAL_EMIS: EmiRow[] = [
  { id: "EMI01", name: "3-Month No-Cost", duration: "3 months", interestRate: "0%", status: "Active" },
  { id: "EMI02", name: "6-Month Standard", duration: "6 months", interestRate: "12%", status: "Active" },
  { id: "EMI03", name: "9-Month Standard", duration: "9 months", interestRate: "14%", status: "Active" },
  { id: "EMI04", name: "12-Month Long", duration: "12 months", interestRate: "15%", status: "Inactive" },
];

function EmiMasterPage({ moduleId, childId, grandchildId }: ViewProps) {
  const breadcrumb = useBreadcrumb(moduleId, childId, grandchildId);
  const { toast } = useToast();
  const [rows, setRows] = React.useState<EmiRow[]>(INITIAL_EMIS);
  const [showForm, setShowForm] = React.useState(false);
  const [editId, setEditId] = React.useState<string | null>(null);
  const [delId, setDelId] = React.useState<string | null>(null);
  const [form, setForm] = React.useState({ id: "", name: "", duration: "", interestRate: "", status: "Active" as EmiRow["status"] });

  const openCreate = () => {
    setEditId(null);
    setForm({ id: `EMI${String(rows.length + 1).padStart(2, "0")}`, name: "", duration: "", interestRate: "0%", status: "Active" });
    setShowForm(true);
  };
  const openEdit = (r: EmiRow) => {
    setEditId(r.id);
    setForm({ ...r });
    setShowForm(true);
  };
  const submit = () => {
    if (!form.name.trim() || !form.duration.trim()) {
      toast({ title: "Missing fields", description: "Name and duration are required.", variant: "destructive" });
      return;
    }
    const item: EmiRow = { ...form };
    if (editId) {
      setRows(rows.map((r) => (r.id === editId ? item : r)));
      toast({ title: "EMI plan updated", description: item.name });
    } else {
      setRows([item, ...rows]);
      toast({ title: "EMI plan created", description: item.name });
    }
    setShowForm(false);
  };
  const confirmDelete = () => {
    if (!delId) return;
    setRows(rows.filter((r) => r.id !== delId));
    toast({ title: "EMI plan deleted", description: delId, variant: "destructive" });
    setDelId(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="EMI Master" description="EMI plan master records for equipment financing." icon={<CreditCard className="h-5 w-5" />} breadcrumb={breadcrumb}
        actions={<Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" /> Add Plan</Button>} />
      <SectionCard title="EMI Plans" description={`${rows.length} plan(s)`}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader><TableRow><TableHead>ID</TableHead><TableHead>Name</TableHead><TableHead>Duration</TableHead><TableHead>Interest Rate</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-mono text-xs text-primary">{r.id}</TableCell>
                  <TableCell className="font-medium">{r.name}</TableCell>
                  <TableCell className="text-muted-foreground">{r.duration}</TableCell>
                  <TableCell className="font-mono text-xs">{r.interestRate}</TableCell>
                  <TableCell><StatusBadge status={r.status} /></TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(r)}><Pencil className="mr-1.5 h-3.5 w-3.5" /> Edit</Button>
                      <Button variant="ghost" size="sm" className="text-primary" onClick={() => setDelId(r.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {rows.length === 0 && <EmptyState icon={<CreditCard className="h-5 w-5" />} title="No EMI plans" />}
      </SectionCard>

      <FormDrawer open={showForm} onClose={() => setShowForm(false)} title={editId ? "Edit EMI Plan" : "Add EMI Plan"}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2"><Label>ID</Label><Input value={form.id} disabled /></div>
          <div className="space-y-2"><Label>Name <span className="text-primary">*</span></Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div className="space-y-2"><Label>Duration <span className="text-primary">*</span></Label><Input placeholder="e.g. 6 months" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} /></div>
          <div className="space-y-2"><Label>Interest Rate</Label><Input placeholder="e.g. 12%" value={form.interestRate} onChange={(e) => setForm({ ...form, interestRate: e.target.value })} /></div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as EmiRow["status"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="Active">Active</SelectItem><SelectItem value="Inactive">Inactive</SelectItem></SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          <Button onClick={submit}><Save className="mr-2 h-4 w-4" /> {editId ? "Update" : "Create"}</Button>
        </div>
      </FormDrawer>

      <ConfirmDialog open={!!delId} onOpenChange={(o) => !o && setDelId(null)} onConfirm={confirmDelete} title="Delete EMI plan?" description="This action cannot be undone." />
    </div>
  );
}
