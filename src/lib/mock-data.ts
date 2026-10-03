/**
 * Mock data for Cryptsk UI — simulates DB rows that will later come
 * from the PostgreSQL dump. All numbers are illustrative.
 */

export interface LiveUser {
  sr: number;
  accountNo: string;
  userName: string;
  userType: "PPPoE" | "Leased Line" | "Hotspot";
  connectedFrom: string;
  publicIp: string;
  mac: string;
  startTime: string;
  duration: string;
  upload: string;
  download: string;
  bandwidth: string;
  deviceType: string;
}

const NAMES = [
  "aakash080198", "aakash111091", "abhimanyu090692", "abhishek031094",
  "aditya120895", "ajay230488", "akash150993", "amit070791",
  "anil290369", "arun140596", "ashish011290", "avinash180494",
  "bhavya210997", "chandan060790", "deepak120393", "devansh250898",
  "gaurav090277", "gopal140691", "harsh160995", "hemant230489",
  "imran030884", "ishan190697", "jatin250792", "karan010187",
  "kapil130893", "lokesh210594", "manish080192", "mohit170396",
  "naveen260990", "nitin040685", "om150398", "pankaj220789",
  "pradeep110991", "prashant280376", "rahul050194", "rajat190897",
  "rakesh021273", "ravi130686", "rohit240995", "sachin071190",
  "sahil160497", "sameer290388", "sandeep030692", "sanjay140979",
  "santosh210568", "saurabh080994", "shubham250797", "siddharth110393",
  "suresh030381", "tarun190691", "umesh270485", "varun140996",
  "vijay010289", "vivek230793", "yash050198", "yogesh160890",
];

const POOL_NAMES = ["Pool-Core", "Pool-North", "Pool-South", "Pool-East", "Pool-West"];

function rand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
function pad(n: number, len: number) {
  return String(n).padStart(len, "0");
}
function mac() {
  const hex = "0123456789ABCDEF";
  let s = "";
  for (let i = 0; i < 6; i++) {
    s += hex[Math.floor(Math.random() * 16)] + hex[Math.floor(Math.random() * 16)];
    if (i < 5) s += ":";
  }
  return s;
}

export const LIVE_USERS: LiveUser[] = Array.from({ length: 42 }, (_, i) => {
  const name = NAMES[i % NAMES.length];
  const daysAgo = Math.floor(Math.random() * 6);
  const hour = Math.floor(Math.random() * 24);
  const min = Math.floor(Math.random() * 60);
  const durH = Math.floor(Math.random() * 140);
  const durM = Math.floor(Math.random() * 60);
  const up = (Math.random() * 9000 + 100).toFixed(2);
  const down = (Math.random() * 300000 + 5000).toFixed(2);
  const bw = (Math.random() * 8 + 0.2).toFixed(2);
  const oct = () => Math.floor(Math.random() * 254) + 1;
  const pubOct = () => Math.floor(Math.random() * 254) + 1;
  return {
    sr: i + 1,
    accountNo: `A${pad(3561 - i * 7, 8)}`,
    userName: name,
    userType: rand(["PPPoE", "PPPoE", "PPPoE", "Leased Line", "Hotspot"] as const),
    connectedFrom: `10.172.${rand([0, 1, 2, 3])}.${oct()} / ${rand(POOL_NAMES)}`,
    publicIp: `103.205.15${pubOct() % 4}.${pubOct()}`,
    mac: mac(),
    startTime: `Sun, Oct ${4 - daysAgo}, ${pad(hour, 2)}:${pad(min, 2)} ${hour < 12 ? "AM" : "PM"}`,
    duration: `${durH}:${pad(durM, 2)}`,
    upload: `${up} MB`,
    download: `${down} MB`,
    bandwidth: `${bw} M`,
    deviceType: rand(["Router", "Router", "Mobile", "CPE", "N/A"]),
  };
});

export const LIVE_USERS_TOTAL = 799;

/* ---------------- Dashboard ---------------- */

export interface KpiStat {
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down" | "flat";
}

export const DASHBOARD_KPIS: KpiStat[] = [
  { label: "Active Users", value: "1,017", delta: "+4.2%", trend: "up" },
  { label: "Live Sessions", value: "799", delta: "+1.1%", trend: "up" },
  { label: "Suspended", value: "6", delta: "-2", trend: "down" },
  { label: "Deactive", value: "2,643", delta: "+0.3%", trend: "flat" },
  { label: "PPPoE Users", value: "768", delta: "+12", trend: "up" },
  { label: "Leased Line", value: "30", delta: "+1", trend: "up" },
];

export interface PackageUser {
  name: string;
  users: number;
}

export const PACKAGE_WISE_USERS: PackageUser[] = [
  { name: "PR HULC 500", users: 411 },
  { name: "WL PR L4D OUL 800", users: 277 },
  { name: "PR OULC 500", users: 260 },
  { name: "WL PR L4D OUL 500", users: 243 },
  { name: "link4data HUL 100", users: 167 },
  { name: "PR HULC 400", users: 156 },
  { name: "PR HULC 508.50", users: 136 },
  { name: "WL PR L4D HUL 500", users: 132 },
  { name: "PO HULC 500", users: 132 },
  { name: "PO OULC 500", users: 123 },
];

export interface InterfaceInfo {
  name: string;
  type: "Internal" | "External";
  ip: string;
}

export const INTERFACES: InterfaceInfo[] = [
  { name: "eth0(A)", type: "Internal", ip: "172.16.16.16/255.255.255.0" },
  { name: "eth1(B)", type: "Internal", ip: "1.1.1.1/255.255.255.0" },
  { name: "eth10(K)", type: "Internal", ip: "172.20.20.1/255.255.254.0" },
  { name: "eth11(L)", type: "Internal", ip: "11.11.12.1/255.255.255.128" },
  { name: "eth12(M)", type: "External", ip: "103.205.148.26/255.255.255.252" },
  { name: "eth13(N)", type: "External", ip: "103.205.151.129/255.255.255.128" },
  { name: "eth2(C)", type: "Internal", ip: "172.31.31.2/255.255.255.0" },
  { name: "eth3(D)", type: "Internal", ip: "10.10.3.1/255.255.255.0" },
  { name: "eth4(E)", type: "Internal", ip: "10.10.4.1/255.255.255.0" },
  { name: "eth5(F)", type: "Internal", ip: "10.10.5.1/255.255.255.0" },
];

export interface LoginTrend {
  date: string;
  count: number;
}

export const LOGIN_TREND: LoginTrend[] = [
  { date: "29-09", count: 2 },
  { date: "30-09", count: 20 },
  { date: "01-10", count: 10 },
  { date: "02-10", count: 3 },
  { date: "03-10", count: 20 },
  { date: "04-10", count: 14 },
  { date: "05-10", count: 6 },
  { date: "06-10", count: 3 },
  { date: "07-10", count: 10 },
  { date: "08-10", count: 6 },
  { date: "09-10", count: 8 },
];

export interface StatusBreakdown {
  status: string;
  users: number;
  color: string;
}

export const STATUS_BREAKDOWN: StatusBreakdown[] = [
  { status: "Active", users: 1017, color: "var(--chart-2)" },
  { status: "Archived", users: 8, color: "var(--chart-4)" },
  { status: "Deactive", users: 2643, color: "var(--chart-3)" },
  { status: "Suspended", users: 6, color: "var(--chart-1)" },
];

export interface TopBandwidthUser {
  accountId: string;
  userName: string;
  bandwidth: string;
  ip: string;
}

export const TOP_BANDWIDTH_USERS: TopBandwidthUser[] = [
  { accountId: "A000002959", userName: "shubham270597", bandwidth: "10.57 M", ip: "10.172.0.30" },
  { accountId: "A000003537", userName: "rajesh130773", bandwidth: "9.73 M", ip: "10.172.13.166" },
  { accountId: "A000001743", userName: "suresh030381", bandwidth: "8.61 M", ip: "10.172.1.24" },
  { accountId: "A000003572", userName: "sweety250397", bandwidth: "7.40 M", ip: "10.172.9.55" },
  { accountId: "A000002055", userName: "manish080192", bandwidth: "6.92 M", ip: "10.172.4.110" },
  { accountId: "A000002884", userName: "ravi130686", bandwidth: "6.31 M", ip: "10.172.2.88" },
  { accountId: "A000003011", userName: "amit070791", bandwidth: "5.88 M", ip: "10.172.7.142" },
  { accountId: "A000001965", userName: "jatin250792", bandwidth: "5.42 M", ip: "10.172.11.9" },
];

export interface InvoiceSummary {
  packageName: string;
  invoices: number;
  amount: string;
}

export const INVOICE_SUMMARY: InvoiceSummary[] = [
  { packageName: "LINK4DATA HUL 200", invoices: 0, amount: "51000.00" },
  { packageName: "PR CM 500", invoices: 6, amount: "129100.00" },
  { packageName: "LINK4DATA OUL 300", invoices: 0, amount: "817400.00" },
  { packageName: "LINK4DATA OFAPS 150", invoices: 0, amount: "34500.00" },
  { packageName: "PRC 540 OTT", invoices: 1, amount: "ST137020.00" },
  { packageName: "PO OUL C 2500", invoices: 2, amount: "561854.84" },
  { packageName: "PR FUPH50Mbps-4000", invoices: 0, amount: "0.00" },
];

/* ---------------- Packages ---------------- */

export interface Plan {
  id: string;
  name: string;
  type: "Prepaid" | "Postpaid";
  bandwidthUp: string;
  bandwidthDown: string;
  dataLimit: string;
  validity: string;
  price: string;
  tax: string;
  activeUsers: number;
  status: "Active" | "Inactive";
}

export const PLANS: Plan[] = [
  { id: "P001", name: "PR HULC 500", type: "Prepaid", bandwidthUp: "5 Mbps", bandwidthDown: "500 Mbps", dataLimit: "Unlimited", validity: "30 days", price: "599.00", tax: "107.82", activeUsers: 411, status: "Active" },
  { id: "P002", name: "WL PR L4D OUL 800", type: "Prepaid", bandwidthUp: "8 Mbps", bandwidthDown: "800 Mbps", dataLimit: "Unlimited", validity: "30 days", price: "899.00", tax: "161.82", activeUsers: 277, status: "Active" },
  { id: "P003", name: "PR OULC 500", type: "Prepaid", bandwidthUp: "5 Mbps", bandwidthDown: "500 Mbps", dataLimit: "Unlimited", validity: "30 days", price: "599.00", tax: "107.82", activeUsers: 260, status: "Active" },
  { id: "P004", name: "WL PR L4D OUL 500", type: "Prepaid", bandwidthUp: "5 Mbps", bandwidthDown: "500 Mbps", dataLimit: "Unlimited", validity: "30 days", price: "649.00", tax: "116.82", activeUsers: 243, status: "Active" },
  { id: "P005", name: "link4data HUL 100", type: "Prepaid", bandwidthUp: "1 Mbps", bandwidthDown: "100 Mbps", dataLimit: "Unlimited", validity: "30 days", price: "299.00", tax: "53.82", activeUsers: 167, status: "Active" },
  { id: "P006", name: "PR HULC 400", type: "Prepaid", bandwidthUp: "4 Mbps", bandwidthDown: "400 Mbps", dataLimit: "Unlimited", validity: "30 days", price: "499.00", tax: "89.82", activeUsers: 156, status: "Active" },
  { id: "P007", name: "PR HULC 508.50", type: "Prepaid", bandwidthUp: "5 Mbps", bandwidthDown: "508 Mbps", dataLimit: "Unlimited", validity: "30 days", price: "649.00", tax: "116.82", activeUsers: 136, status: "Active" },
  { id: "P008", name: "WL PR L4D HUL 500", type: "Prepaid", bandwidthUp: "5 Mbps", bandwidthDown: "500 Mbps", dataLimit: "Unlimited", validity: "30 days", price: "699.00", tax: "125.82", activeUsers: 132, status: "Active" },
  { id: "P009", name: "PO HULC 500", type: "Postpaid", bandwidthUp: "5 Mbps", bandwidthDown: "500 Mbps", dataLimit: "Unlimited", validity: "Monthly", price: "599.00", tax: "107.82", activeUsers: 132, status: "Active" },
  { id: "P010", name: "PO OULC 500", type: "Postpaid", bandwidthUp: "5 Mbps", bandwidthDown: "500 Mbps", dataLimit: "Unlimited", validity: "Monthly", price: "599.00", tax: "107.82", activeUsers: 123, status: "Active" },
  { id: "P011", name: "LL 100M Symmetric", type: "Postpaid", bandwidthUp: "100 Mbps", bandwidthDown: "100 Mbps", dataLimit: "Unlimited", validity: "Monthly", price: "4999.00", tax: "899.82", activeUsers: 30, status: "Active" },
  { id: "P012", name: "Hotspot 50M Day", type: "Prepaid", bandwidthUp: "2 Mbps", bandwidthDown: "50 Mbps", dataLimit: "10 GB", validity: "7 days", price: "99.00", tax: "17.82", activeUsers: 0, status: "Inactive" },
];

/* ---------------- Tickets ---------------- */

export interface Ticket {
  id: string;
  subject: string;
  customer: string;
  category: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  status: "Open" | "In Progress" | "Resolved" | "Closed";
  assignee: string;
  created: string;
  updated: string;
}

export const TICKETS: Ticket[] = [
  { id: "TKT-2041", subject: "No internet since morning", customer: "shubham270597", category: "Connectivity", priority: "High", status: "Open", assignee: "Field Team A", created: "04 Oct 09:12", updated: "04 Oct 09:30" },
  { id: "TKT-2040", subject: "Slow speed on PR HULC 500", customer: "aakash080198", category: "Speed", priority: "Medium", status: "In Progress", assignee: "NOC L1", created: "04 Oct 08:45", updated: "04 Oct 08:50" },
  { id: "TKT-2039", subject: "Bill not generated", customer: "rajesh130773", category: "Billing", priority: "Medium", status: "Open", assignee: "Billing Team", created: "03 Oct 22:10", updated: "03 Oct 22:15" },
  { id: "TKT-2038", subject: "Request plan upgrade", customer: "suresh030381", category: "Plan Change", priority: "Low", status: "Resolved", assignee: "Sales", created: "03 Oct 18:22", updated: "03 Oct 19:00" },
  { id: "TKT-2037", subject: "CPE device replacement", customer: "amit070791", category: "Hardware", priority: "High", status: "In Progress", assignee: "Field Team B", created: "03 Oct 14:05", updated: "03 Oct 16:40" },
  { id: "TKT-2036", subject: "OTP not received", customer: "jatin250792", category: "Authentication", priority: "Critical", status: "Open", assignee: "NOC L2", created: "03 Oct 11:33", updated: "03 Oct 11:35" },
  { id: "TKT-2035", subject: "MAC binding request", customer: "manish080192", category: "Configuration", priority: "Low", status: "Closed", assignee: "NOC L1", created: "02 Oct 17:50", updated: "02 Oct 18:10" },
  { id: "TKT-2034", subject: "FUP reset query", customer: "ravi130686", category: "Billing", priority: "Medium", status: "Resolved", assignee: "Billing Team", created: "02 Oct 10:18", updated: "02 Oct 10:45" },
];

/* ---------------- Zones & Pools ---------------- */

export interface Zone {
  id: string;
  name: string;
  description: string;
  users: number;
  bandwidth: string;
  status: "Active" | "Inactive";
}

export const ZONES: Zone[] = [
  { id: "Z01", name: "Bhiwani-Core", description: "Central Bhiwani POP", users: 1240, bandwidth: "2 Gbps", status: "Active" },
  { id: "Z02", name: "Bhiwani-North", description: "Northern sector", users: 580, bandwidth: "1 Gbps", status: "Active" },
  { id: "Z03", name: "Bhiwani-South", description: "Southern sector", users: 720, bandwidth: "1 Gbps", status: "Active" },
  { id: "Z04", name: "Bhiwani-East", description: "Eastern sector", users: 410, bandwidth: "500 Mbps", status: "Active" },
  { id: "Z05", name: "Bhiwani-West", description: "Western sector", users: 350, bandwidth: "500 Mbps", status: "Active" },
  { id: "Z06", name: "Rohtak-Edge", description: "Rohtak edge node", users: 188, bandwidth: "300 Mbps", status: "Inactive" },
];

export interface Pool {
  id: string;
  name: string;
  zone: string;
  subnet: string;
  gateway: string;
  used: number;
  total: number;
}

export const POOLS: Pool[] = [
  { id: "PL01", name: "Pool-Bhiwani0", zone: "Bhiwani-Core", subnet: "10.172.0.0/24", gateway: "10.172.0.1", used: 198, total: 254 },
  { id: "PL02", name: "Pool-Bhiwani1", zone: "Bhiwani-Core", subnet: "10.172.1.0/24", gateway: "10.172.1.1", used: 211, total: 254 },
  { id: "PL03", name: "Pool-Bhiwani2", zone: "Bhiwani-North", subnet: "10.172.2.0/24", gateway: "10.172.2.1", used: 144, total: 254 },
  { id: "PL04", name: "Pool-Bhiwani3", zone: "Bhiwani-South", subnet: "10.172.3.0/24", gateway: "10.172.3.1", used: 167, total: 254 },
  { id: "PL05", name: "Pool-Bhiwani4", zone: "Bhiwani-East", subnet: "10.172.4.0/24", gateway: "10.172.4.1", used: 88, total: 254 },
  { id: "PL06", name: "Pool-Bhiwani5", zone: "Bhiwani-West", subnet: "10.172.5.0/24", gateway: "10.172.5.1", used: 102, total: 254 },
];

/* ---------------- Firewall rules ---------------- */

export interface FirewallRule {
  id: string;
  name: string;
  src: string;
  dst: string;
  service: string;
  action: "Allow" | "Deny" | "Drop";
  position: number;
  enabled: boolean;
}

export const FIREWALL_RULES: FirewallRule[] = [
  { id: "FW001", name: "Allow LAN to WAN", src: "LAN", dst: "WAN", service: "Any", action: "Allow", position: 1, enabled: true },
  { id: "FW002", name: "Block social media", src: "LAN", dst: "WAN", service: "HTTP/HTTPS", action: "Deny", position: 2, enabled: false },
  { id: "FW003", name: "Drop malformed packets", src: "Any", dst: "Any", service: "Any", action: "Drop", position: 3, enabled: true },
  { id: "FW004", name: "Allow DNS", src: "LAN", dst: "Any", service: "DNS(53)", action: "Allow", position: 4, enabled: true },
  { id: "FW005", name: "Allow RADIUS", src: "LAN", dst: "127.0.0.1", service: "RADIUS(1812)", action: "Allow", position: 5, enabled: true },
  { id: "FW006", name: "Block torrent trackers", src: "LAN", dst: "WAN", service: "TCP 6881-6999", action: "Deny", position: 6, enabled: true },
];

/* ---------------- Policies ---------------- */

export interface Policy {
  id: string;
  name: string;
  type: "Surfing" | "Access Time" | "Bandwidth" | "Data Transfer" | "FAP" | "QoS";
  schedule: string;
  appliesTo: string;
  status: "Active" | "Inactive";
}

export const POLICIES: Policy[] = [
  { id: "POL001", name: "Default Surf Quota", type: "Surfing", schedule: "Always", appliesTo: "All Users", status: "Active" },
  { id: "POL002", name: "Night Unlimited", type: "Access Time", schedule: "22:00-06:00", appliesTo: "PR HULC 500", status: "Active" },
  { id: "POL003", name: "Peak Hour Cap 5M", type: "Bandwidth", schedule: "19:00-23:00", appliesTo: "All Prepaid", status: "Active" },
  { id: "POL004", name: "100GB FAP Reset", type: "FAP", schedule: "Monthly", appliesTo: "Hotspot Plans", status: "Active" },
  { id: "POL005", name: "Business Hours QoS", type: "QoS", schedule: "09:00-18:00", appliesTo: "Leased Line", status: "Active" },
  { id: "POL006", name: "Weekend Boost", type: "Bandwidth", schedule: "Sat-Sun All Day", appliesTo: "PR OULC 500", status: "Inactive" },
];

/* ---------------- Inventory ---------------- */

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  model: string;
  vendor: string;
  stock: number;
  minStock: number;
  unitPrice: string;
}

export const INVENTORY_ITEMS: InventoryItem[] = [
  { id: "INV001", name: "ONT GPON", category: "CPE", model: "HG8245H5", vendor: "Huawei", stock: 84, minStock: 20, unitPrice: "1800.00" },
  { id: "INV002", name: "WiFi Router", category: "CPE", model: "ARCHER-C60", vendor: "TP-Link", stock: 47, minStock: 15, unitPrice: "1100.00" },
  { id: "INV003", name: "Fiber Patch Cord", category: "Cable", model: "LC-UPC 1m", vendor: "OFS", stock: 320, minStock: 100, unitPrice: "45.00" },
  { id: "INV004", name: "SFP Module", category: "Optics", model: "SFP-1G-LX", vendor: "Cisco", stock: 12, minStock: 25, unitPrice: "2400.00" },
  { id: "INV005", name: "RJ45 Connector", category: "Connector", model: "Cat6 8P8C", vendor: "Generic", stock: 1500, minStock: 500, unitPrice: "3.50" },
  { id: "INV006", name: "PoE Injector", category: "Power", model: "POE-INJ-48V", vendor: "Ubiquiti", stock: 28, minStock: 10, unitPrice: "650.00" },
];

/* ---------------- Payment Tracking ---------------- */

export interface PaymentTxn {
  id: string;
  account: string;
  customer: string;
  mode: "Cash" | "UPI" | "Card" | "Cheque" | "Bank Transfer";
  amount: string;
  date: string;
  status: "Settled" | "Pending" | "Reversed";
  collectedBy: string;
}

export const PAYMENT_TXNS: PaymentTxn[] = [
  { id: "PT000912", account: "A000002959", customer: "shubham270597", mode: "UPI", amount: "599.00", date: "04 Oct 2026", status: "Settled", collectedBy: "Online" },
  { id: "PT000911", account: "A000003537", customer: "rajesh130773", mode: "Cash", amount: "899.00", date: "04 Oct 2026", status: "Pending", collectedBy: "Franchise-12" },
  { id: "PT000910", account: "A000001743", customer: "suresh030381", mode: "Card", amount: "599.00", date: "03 Oct 2026", status: "Settled", collectedBy: "Online" },
  { id: "PT000909", account: "A000003572", customer: "sweety250397", mode: "UPI", amount: "649.00", date: "03 Oct 2026", status: "Settled", collectedBy: "Online" },
  { id: "PT000908", account: "A000002055", customer: "manish080192", mode: "Cheque", amount: "1797.00", date: "03 Oct 2026", status: "Reversed", collectedBy: "Franchise-12" },
  { id: "PT000907", account: "A000002884", customer: "ravi130686", mode: "Bank Transfer", amount: "4999.00", date: "02 Oct 2026", status: "Settled", collectedBy: "Online" },
];

/* ---------------- Leads ---------------- */

export interface Lead {
  id: string;
  name: string;
  contact: string;
  area: string;
  plan: string;
  stage: "New" | "Contacted" | "Survey Done" | "Converted" | "Lost";
  source: string;
  owner: string;
  created: string;
}

export const LEADS: Lead[] = [
  { id: "LD0451", name: "Rohit Sharma", contact: "+91-98xxxxxx12", area: "Bhiwani-North", plan: "PR HULC 500", stage: "New", source: "Walk-in", owner: "Sales-A", created: "04 Oct 2026" },
  { id: "LD0450", name: "Priya Verma", contact: "+91-99xxxxxx87", area: "Bhiwani-South", plan: "LL 100M Symmetric", stage: "Survey Done", source: "Referral", owner: "Sales-B", created: "03 Oct 2026" },
  { id: "LD0449", name: "Aman Gupta", contact: "+91-97xxxxxx45", area: "Bhiwani-Core", plan: "PR OULC 500", stage: "Contacted", source: "Facebook", owner: "Sales-A", created: "03 Oct 2026" },
  { id: "LD0448", name: "Nisha Kumari", contact: "+91-96xxxxxx33", area: "Rohtak-Edge", plan: "link4data HUL 100", stage: "Converted", source: "Cold Call", owner: "Sales-C", created: "02 Oct 2026" },
  { id: "LD0447", name: "Vikas Jain", contact: "+91-90xxxxxx19", area: "Bhiwani-East", plan: "PR HULC 400", stage: "Lost", source: "Walk-in", owner: "Sales-B", created: "01 Oct 2026" },
];

/* ---------------- SMS / Alerts ---------------- */

export interface SmsLog {
  id: string;
  mobile: string;
  message: string;
  template: string;
  status: "Sent" | "Failed" | "Queued";
  sentAt: string;
}

export const SMS_LOGS: SmsLog[] = [
  { id: "SMS23910", mobile: "+91-98xxxxxx12", message: "Your plan renewed for PR HULC 500", template: "Renewal", status: "Sent", sentAt: "04 Oct 09:14" },
  { id: "SMS23909", mobile: "+91-99xxxxxx87", message: "Outstanding bill 899.00 due on 10 Oct", template: "Due Reminder", status: "Sent", sentAt: "04 Oct 08:30" },
  { id: "SMS23908", mobile: "+91-97xxxxxx45", message: "OTP 4421 valid for 5 minutes", template: "OTP", status: "Sent", sentAt: "04 Oct 08:12" },
  { id: "SMS23907", mobile: "+91-96xxxxxx33", message: "Outage in your area, ETA 1 hour", template: "Outage", status: "Failed", sentAt: "03 Oct 22:45" },
  { id: "SMS23906", mobile: "+91-90xxxxxx19", message: "Welcome to Cryptsk Networks", template: "Welcome", status: "Queued", sentAt: "03 Oct 18:00" },
];

/* ---------------- Reports catalog ---------------- */

export interface ReportItem {
  id: string;
  name: string;
  category: string;
  description: string;
  format: "HTML" | "PDF" | "CSV" | "XLS";
}

export const REPORTS: ReportItem[] = [
  { id: "RPT001", name: "User Login Report", category: "User", description: "Login/logout history per user or zone", format: "HTML" },
  { id: "RPT002", name: "Bandwidth Usage Report", category: "User", description: "Upload/download usage over time", format: "PDF" },
  { id: "RPT003", name: "Invoice Report", category: "Billing", description: "Generated invoices with amounts", format: "XLS" },
  { id: "RPT004", name: "Payment Collection Report", category: "Billing", description: "Daily/monthly collections by mode", format: "PDF" },
  { id: "RPT005", name: "Online Payment Report", category: "Billing", description: "Gateway transactions", format: "CSV" },
  { id: "RPT006", name: "Active User Report", category: "User", description: "Currently active subscribers", format: "HTML" },
  { id: "RPT007", name: "Suspended User Report", category: "User", description: "Users suspended for non-payment", format: "PDF" },
  { id: "RPT008", name: "Plan-wise Revenue Report", category: "Billing", description: "Revenue breakdown per package", format: "XLS" },
  { id: "RPT009", name: "Ticket SLA Report", category: "Support", description: "Ticket resolution time vs SLA", format: "PDF" },
  { id: "RPT010", name: "Device Status Report", category: "System", description: "NAS and device health", format: "HTML" },
  { id: "RPT011", name: "SMS Log Report", category: "Alert", description: "All SMS sent/failed", format: "CSV" },
  { id: "RPT012", name: "FAP Hit Report", category: "Policy", description: "Users hitting FAP limits", format: "PDF" },
];

/* ---------------- NAS Devices ---------------- */

export interface NasDevice {
  id: string;
  name: string;
  ip: string;
  type: string;
  secret: string;
  status: "Online" | "Offline";
  sessions: number;
}

export const NAS_DEVICES: NasDevice[] = [
  { id: "NAS01", name: "sms-core-01", ip: "172.16.16.16", type: "24online SMS", secret: "••••••••", status: "Online", sessions: 612 },
  { id: "NAS02", name: "sms-core-02", ip: "172.16.16.17", type: "24online SMS", secret: "••••••••", status: "Online", sessions: 187 },
  { id: "NAS03", name: "br-5000-edge", ip: "103.205.148.26", type: "BRAS", secret: "••••••••", status: "Online", sessions: 0 },
  { id: "NAS04", name: "hotspot-gw-01", ip: "10.10.5.1", type: "Hotspot", secret: "••••••••", status: "Offline", sessions: 0 },
];

/* ---------------- DHCP Leases ---------------- */

export interface DhcpLease {
  ip: string;
  mac: string;
  host: string;
  pool: string;
  leaseStart: string;
  leaseEnd: string;
  status: "Active" | "Expired" | "Released";
}

export const DHCP_LEASES: DhcpLease[] = [
  { ip: "10.172.0.30", mac: "C0:2B:56:07:D8:18", host: "shubham-pc", pool: "Pool-Bhiwani0", leaseStart: "04 Oct 00:12", leaseEnd: "05 Oct 00:12", status: "Active" },
  { ip: "10.172.0.201", mac: "98:9D:B2:08:60:D0", host: "aakash-router", pool: "Pool-Bhiwani0", leaseStart: "03 Oct 15:37", leaseEnd: "04 Oct 15:37", status: "Active" },
  { ip: "10.172.1.55", mac: "A8:E2:07:9D:CB:78", host: "abhimanyu-cpe", pool: "Pool-Bhiwani1", leaseStart: "03 Oct 11:22", leaseEnd: "04 Oct 11:22", status: "Active" },
  { ip: "10.172.3.36", mac: "18:A6:F7:7A:D7:1F", host: "abhishek-ont", pool: "Pool-Bhiwani3", leaseStart: "02 Oct 20:00", leaseEnd: "03 Oct 20:00", status: "Expired" },
  { ip: "10.172.4.110", mac: "F4:5C:89:62:0A:33", host: "manish-pc", pool: "Pool-Bhiwani4", leaseStart: "03 Oct 09:00", leaseEnd: "04 Oct 09:00", status: "Active" },
];

/* ---------------- System Services ---------------- */

export interface SystemService {
  id: string;
  name: string;
  description: string;
  port: string;
  running: boolean;
  autoStart: boolean;
  uptime: string;
}

export const SYSTEM_SERVICES: SystemService[] = [
  { id: "svc-radius", name: "RADIUS Server", description: "FreeRADIUS — authentication & accounting", port: "1812/1813", running: true, autoStart: true, uptime: "12d 04h 11m" },
  { id: "svc-dhcp", name: "DHCP Server", description: "ISC DHCP — IP leasing", port: "67", running: true, autoStart: true, uptime: "12d 04h 11m" },
  { id: "svc-dns", name: "DNS Server", description: "BIND — recursive & authoritative", port: "53", running: true, autoStart: true, uptime: "12d 04h 11m" },
  { id: "svc-pppoe", name: "PPPoE Concentrator", description: "RP-PPPoE — session management", port: "—", running: true, autoStart: true, uptime: "05d 19h 22m" },
  { id: "svc-captive", name: "Captive Portal", description: "HTTP redirect / login portal", port: "8080", running: true, autoStart: true, uptime: "12d 04h 11m" },
  { id: "svc-web", name: "Web Server", description: "Apache — admin GUI + client portal", port: "443", running: true, autoStart: true, uptime: "12d 04h 11m" },
  { id: "svc-ntp", name: "NTP Daemon", description: "Time sync (chrony)", port: "123", running: false, autoStart: false, uptime: "—" },
];

/* ---------------- ACL Roles ---------------- */

export interface AclRole {
  id: string;
  name: string;
  description: string;
  users: number;
  permissions: number;
  status: "Active" | "Inactive";
}

export const ACL_ROLES: AclRole[] = [
  { id: "ROLE01", name: "Super Admin", description: "Full system access", users: 2, permissions: 156, status: "Active" },
  { id: "ROLE02", name: "NOC Operator", description: "Live users, tickets, monitoring", users: 8, permissions: 64, status: "Active" },
  { id: "ROLE03", name: "Billing Team", description: "Invoices, payments, plans", users: 4, permissions: 38, status: "Active" },
  { id: "ROLE04", name: "Field Engineer", description: "On-site installs & CPE config", users: 12, permissions: 24, status: "Active" },
  { id: "ROLE05", name: "Read-only Auditor", description: "Reports only", users: 1, permissions: 18, status: "Inactive" },
];

/* ---------------- Dynamic DNS ---------------- */

export interface DynamicDns {
  id: string;
  host: string;
  provider: string;
  currentIp: string;
  lastUpdate: string;
  status: "Active" | "Inactive";
}

export const DYNAMIC_DNS: DynamicDns[] = [
  { id: "DDNS01", host: "cryptsk-bhiwani.ddns.net", provider: "Dynu", currentIp: "103.205.148.26", lastUpdate: "04 Oct 09:01", status: "Active" },
  { id: "DDNS02", host: "noc.cryptsk.in", provider: "Cloudflare", currentIp: "103.205.151.129", lastUpdate: "04 Oct 06:14", status: "Active" },
  { id: "DDNS03", host: "edge.cryptsk.in", provider: "No-IP", currentIp: "—", lastUpdate: "30 Sep 22:48", status: "Inactive" },
];

/* ---------------- Captive Portal ---------------- */

export interface CaptiveTemplate {
  id: string;
  name: string;
  type: "Login" | "Leased Line";
  zone: string;
  lastEdited: string;
  status: "Active" | "Inactive";
}

export const CAPTIVE_TEMPLATES: CaptiveTemplate[] = [
  { id: "TPL01", name: "Default Login Page", type: "Login", zone: "All", lastEdited: "28 Sep 2026", status: "Active" },
  { id: "TPL02", name: "Hotspot Voucher", type: "Login", zone: "Bhiwani-East", lastEdited: "22 Sep 2026", status: "Active" },
  { id: "TPL03", name: "Leased Line — LL100", type: "Leased Line", zone: "Bhiwani-Core", lastEdited: "10 Sep 2026", status: "Active" },
];

export interface DenyNetwork {
  id: string;
  network: string;
  mask: string;
  reason: string;
  addedBy: string;
}

export const DENY_NETWORK: DenyNetwork[] = [
  { id: "DN01", network: "192.168.50.0", mask: "255.255.255.0", reason: "Quarantine VLAN", addedBy: "administrator" },
  { id: "DN02", network: "10.99.99.0", mask: "255.255.255.0", reason: "Test lab isolation", addedBy: "noc-lead" },
  { id: "DN03", network: "203.0.113.5", mask: "255.255.255.255", reason: "Repeat offender", addedBy: "abuse-team" },
];

/* ---------------- Status Tracker ---------------- */

export interface DeviceLog {
  timestamp: string;
  level: "INFO" | "WARN" | "ERROR";
  device: string;
  message: string;
}

export const DEVICE_LOGS: DeviceLog[] = [
  { timestamp: "04 Oct 09:14:22", level: "INFO", device: "sms-core-01", message: "RADIUS auth OK for user shubham270597" },
  { timestamp: "04 Oct 09:14:18", level: "WARN", device: "sms-core-02", message: "High CPU 82% sustained 5m" },
  { timestamp: "04 Oct 09:13:55", level: "ERROR", device: "hotspot-gw-01", message: "Connection refused on port 1812" },
  { timestamp: "04 Oct 09:13:11", level: "INFO", device: "br-5000-edge", message: "Session limit reset for zone Bhiwani-East" },
  { timestamp: "04 Oct 09:12:30", level: "WARN", device: "sms-core-01", message: "DHCP pool Pool-Bhiwani1 > 80% full" },
  { timestamp: "04 Oct 09:11:02", level: "INFO", device: "sms-core-02", message: "Backup snapshot completed (412 MB)" },
  { timestamp: "04 Oct 09:09:48", level: "ERROR", device: "hotspot-gw-01", message: "NAS marked offline after 3 missed keepalives" },
];

export interface ManagedDevice {
  id: string;
  name: string;
  ip: string;
  model: string;
  role: string;
  status: "Online" | "Offline";
  lastSeen: string;
}

export const MANAGED_DEVICES: ManagedDevice[] = [
  { id: "DEV01", name: "sms-core-01", ip: "172.16.16.16", model: "SMS 2500iX", role: "Core NAS", status: "Online", lastSeen: "04 Oct 09:14" },
  { id: "DEV02", name: "sms-core-02", ip: "172.16.16.17", model: "SMS 2500iX", role: "Core NAS", status: "Online", lastSeen: "04 Oct 09:14" },
  { id: "DEV03", name: "br-5000-edge", ip: "103.205.148.26", model: "BRAS-5000", role: "Edge BRAS", status: "Online", lastSeen: "04 Oct 09:13" },
  { id: "DEV04", name: "hotspot-gw-01", ip: "10.10.5.1", model: "Mikrotik CCR", role: "Hotspot GW", status: "Offline", lastSeen: "03 Oct 22:11" },
  { id: "DEV05", name: "sw-dist-01", ip: "10.10.0.2", model: "Cisco C9300", role: "Distribution Switch", status: "Online", lastSeen: "04 Oct 09:14" },
];

/* ---------------- Dashboard layouts ---------------- */

export interface DashboardLayout {
  id: string;
  name: string;
  columns: number;
  widgets: number;
  lastEdited: string;
}

export const DASHBOARD_LAYOUTS: DashboardLayout[] = [
  { id: "DASH1", name: "Dashboard 1", columns: 3, widgets: 6, lastEdited: "20 Sep 2026" },
  { id: "DASH2", name: "Dashboard 2", columns: 3, widgets: 4, lastEdited: "01 Oct 2026" },
];

/* ---------------- Packages: invoices / templates / ancillary / tax ---------------- */

export interface Invoice {
  id: string;
  customer: string;
  account: string;
  packageName: string;
  amount: string;
  tax: string;
  total: string;
  date: string;
  status: "Paid" | "Due" | "Overdue";
}

export const INVOICES: Invoice[] = [
  { id: "INV-2026-10042", customer: "shubham270597", account: "A000002959", packageName: "PR HULC 500", amount: "599.00", tax: "107.82", total: "706.82", date: "01 Oct 2026", status: "Paid" },
  { id: "INV-2026-10041", customer: "rajesh130773", account: "A000003537", packageName: "WL PR L4D OUL 800", amount: "899.00", tax: "161.82", total: "1060.82", date: "01 Oct 2026", status: "Due" },
  { id: "INV-2026-10040", customer: "suresh030381", account: "A000001743", packageName: "PR OULC 500", amount: "599.00", tax: "107.82", total: "706.82", date: "28 Sep 2026", status: "Overdue" },
  { id: "INV-2026-10039", customer: "sweety250397", account: "A000003572", packageName: "WL PR L4D HUL 500", amount: "699.00", tax: "125.82", total: "824.82", date: "01 Oct 2026", status: "Paid" },
  { id: "INV-2026-10038", customer: "manish080192", account: "A000002055", packageName: "LL 100M Symmetric", amount: "4999.00", tax: "899.82", total: "5898.82", date: "01 Oct 2026", status: "Due" },
  { id: "INV-2026-10037", customer: "ravi130686", account: "A000002884", packageName: "PR HULC 400", amount: "499.00", tax: "89.82", total: "588.82", date: "27 Sep 2026", status: "Paid" },
  { id: "INV-2026-10036", customer: "amit070791", account: "A000003011", packageName: "link4data HUL 100", amount: "299.00", tax: "53.82", total: "352.82", date: "01 Oct 2026", status: "Due" },
  { id: "INV-2026-10035", customer: "jatin250792", account: "A000001965", packageName: "PO HULC 500", amount: "599.00", tax: "107.82", total: "706.82", date: "01 Oct 2026", status: "Overdue" },
];

export interface InvoiceTemplate {
  id: string;
  name: string;
  description: string;
  columns: number;
  lastEdited: string;
}

export const INVOICE_TEMPLATES: InvoiceTemplate[] = [
  { id: "ITPL01", name: "Standard", description: "Default invoice with summary, tax split and payment terms", columns: 6, lastEdited: "12 Aug 2026" },
  { id: "ITPL02", name: "Detailed", description: "Itemized breakdown including per-day usage and discounts", columns: 9, lastEdited: "29 Sep 2026" },
  { id: "ITPL03", name: "Minimal", description: "Compact receipt-style invoice for prepaid renewals", columns: 3, lastEdited: "03 Oct 2026" },
];

export interface AncillaryService {
  id: string;
  name: string;
  description: string;
  price: string;
  tax: string;
  status: "Active" | "Inactive";
}

export const ANCILLARY_SERVICES: AncillaryService[] = [
  { id: "ANC01", name: "Static IP", description: "Single static public IPv4 address", price: "250.00", tax: "45.00", status: "Active" },
  { id: "ANC02", name: "Public IP Block", description: "/29 public IP block (5 usable)", price: "1200.00", tax: "216.00", status: "Active" },
  { id: "ANC03", name: "Extra Data 50GB", description: "One-time 50 GB top-up", price: "99.00", tax: "17.82", status: "Active" },
  { id: "ANC04", name: "Speed Boost 1Gbps", description: "24-hour 1 Gbps boost add-on", price: "49.00", tax: "8.82", status: "Inactive" },
];

export interface TaxInfo {
  id: string;
  name: string;
  rate: string;
  type: "Inclusive" | "Exclusive";
  appliesTo: string;
  status: "Active" | "Inactive";
}

export const TAX_INFO: TaxInfo[] = [
  { id: "TAX01", name: "GST", rate: "18%", type: "Exclusive", appliesTo: "All services", status: "Active" },
  { id: "TAX02", name: "CGST", rate: "9%", type: "Exclusive", appliesTo: "Intra-state", status: "Active" },
  { id: "TAX03", name: "SGST", rate: "9%", type: "Exclusive", appliesTo: "Intra-state", status: "Active" },
  { id: "TAX04", name: "IGST", rate: "18%", type: "Exclusive", appliesTo: "Inter-state", status: "Active" },
];

/* ---------------- Payment Gateway ---------------- */

export interface Merchant {
  id: string;
  name: string;
  provider: "Razorpay" | "PayU" | "Stripe" | "Cashfree";
  merchantId: string;
  isDefault: boolean;
  status: "Active" | "Inactive";
}

export const MERCHANTS: Merchant[] = [
  { id: "M01", name: "Cryptsk Primary", provider: "Razorpay", merchantId: "rzp_live_BHIWANI", isDefault: true, status: "Active" },
  { id: "M02", name: "Cryptsk Backup", provider: "PayU", merchantId: "PAYU_BHIWANI_02", isDefault: false, status: "Active" },
  { id: "M03", name: "OTT Subscriptions", provider: "Cashfree", merchantId: "CF_OTT_5102", isDefault: false, status: "Inactive" },
];

export interface GatewayTxn {
  id: string;
  customer: string;
  account: string;
  amount: string;
  gateway: string;
  status: "Success" | "Failed" | "Refunded" | "Pending";
  date: string;
}

export const GATEWAY_TXNS: GatewayTxn[] = [
  { id: "GT202610012", customer: "shubham270597", account: "A000002959", amount: "706.82", gateway: "Razorpay", status: "Success", date: "01 Oct 2026 09:14" },
  { id: "GT202610011", customer: "rajesh130773", account: "A000003537", amount: "1060.82", gateway: "Razorpay", status: "Failed", date: "01 Oct 2026 08:50" },
  { id: "GT202610010", customer: "suresh030381", account: "A000001743", amount: "706.82", gateway: "PayU", status: "Success", date: "30 Sep 2026 19:32" },
  { id: "GT202610009", customer: "sweety250397", account: "A000003572", amount: "824.82", gateway: "Razorpay", status: "Refunded", date: "29 Sep 2026 14:11" },
  { id: "GT202610008", customer: "manish080192", account: "A000002055", amount: "5898.82", gateway: "Stripe", status: "Success", date: "28 Sep 2026 16:09" },
  { id: "GT202610007", customer: "ravi130686", account: "A000002884", amount: "588.82", gateway: "Razorpay", status: "Pending", date: "28 Sep 2026 12:48" },
  { id: "GT202610006", customer: "amit070791", account: "A000003011", amount: "352.82", gateway: "Cashfree", status: "Success", date: "27 Sep 2026 21:01" },
  { id: "GT202610005", customer: "jatin250792", account: "A000001965", amount: "706.82", gateway: "PayU", status: "Failed", date: "27 Sep 2026 10:33" },
];

/* ---------------- Policies: bandwidth / data transfer / FAP ---------------- */

export interface BandwidthPolicy {
  id: string;
  name: string;
  upMbps: number;
  downMbps: number;
  appliesTo: string;
  schedule: string;
  status: "Active" | "Inactive";
}

export const BANDWIDTH_POLICIES: BandwidthPolicy[] = [
  { id: "BP001", name: "Peak Hour Cap 5M", upMbps: 1, downMbps: 5, appliesTo: "All Prepaid", schedule: "19:00-23:00", status: "Active" },
  { id: "BP002", name: "Weekend Boost", upMbps: 8, downMbps: 800, appliesTo: "PR OULC 500", schedule: "Sat-Sun All Day", status: "Inactive" },
  { id: "BP003", name: "FUP Slow Lane", upMbps: 1, downMbps: 2, appliesTo: "FAP-triggered", schedule: "Always", status: "Active" },
  { id: "BP004", name: "LL Symmetric 100M", upMbps: 100, downMbps: 100, appliesTo: "Leased Line", schedule: "Always", status: "Active" },
];

export interface DataTransferPolicy {
  id: string;
  name: string;
  quotaGb: number;
  resetPeriod: string;
  appliesTo: string;
  status: "Active" | "Inactive";
}

export const DATA_TRANSFER_POLICIES: DataTransferPolicy[] = [
  { id: "DTP001", name: "Hotspot 10GB Cap", quotaGb: 10, resetPeriod: "Weekly", appliesTo: "Hotspot Plans", status: "Active" },
  { id: "DTP002", name: "FUP Soft Cap 1000GB", quotaGb: 1000, resetPeriod: "Monthly", appliesTo: "All Unlimited", status: "Active" },
  { id: "DTP003", name: "LL Uncapped", quotaGb: 0, resetPeriod: "—", appliesTo: "Leased Line", status: "Active" },
];

export interface FapPolicy {
  id: string;
  name: string;
  thresholdGb: number;
  resetPeriod: string;
  throttleDown: string;
  appliesTo: string;
  status: "Active" | "Inactive";
}

export const FAP_POLICIES: FapPolicy[] = [
  { id: "FAP001", name: "100GB FAP Reset", thresholdGb: 100, resetPeriod: "Monthly", throttleDown: "2 Mbps", appliesTo: "Hotspot Plans", status: "Active" },
  { id: "FAP002", name: "Heavy User FAP", thresholdGb: 1500, resetPeriod: "Monthly", throttleDown: "10 Mbps", appliesTo: "PR HULC 500", status: "Active" },
  { id: "FAP003", name: "LL No FAP", thresholdGb: 0, resetPeriod: "—", throttleDown: "—", appliesTo: "Leased Line", status: "Inactive" },
];

export interface QosPolicy {
  id: string;
  name: string;
  type: "Cache" | "QoS";
  schedule: string;
  appliesTo: string;
  priority: "High" | "Medium" | "Low";
  status: "Active" | "Inactive";
}

export const QOS_POLICIES: QosPolicy[] = [
  { id: "QOS001", name: "Business Hours QoS", type: "QoS", schedule: "09:00-18:00", appliesTo: "Leased Line", priority: "High", status: "Active" },
  { id: "QOS002", name: "YouTube Cache", type: "Cache", schedule: "Always", appliesTo: "All Users", priority: "Medium", status: "Active" },
  { id: "QOS003", name: "Netflix Cache", type: "Cache", schedule: "18:00-23:00", appliesTo: "All Users", priority: "Medium", status: "Active" },
  { id: "QOS004", name: "VoIP Priority", type: "QoS", schedule: "Always", appliesTo: "All Users", priority: "High", status: "Inactive" },
];

export interface SurfingPolicy {
  id: string;
  name: string;
  quotaMb: number;
  resetPeriod: string;
  appliesTo: string;
  status: "Active" | "Inactive";
}

export const SURFING_POLICIES: SurfingPolicy[] = [
  { id: "SP001", name: "Default Surf Quota", quotaMb: 5000, resetPeriod: "Daily", appliesTo: "All Users", status: "Active" },
  { id: "SP002", name: "Night Free Surf", quotaMb: 0, resetPeriod: "22:00-06:00", appliesTo: "PR HULC 500", status: "Active" },
  { id: "SP003", name: "Heavy Surfer Cap", quotaMb: 20000, resetPeriod: "Monthly", appliesTo: "Hotspot Plans", status: "Inactive" },
];

export interface AccessTimePolicy {
  id: string;
  name: string;
  allowedFrom: string;
  allowedTo: string;
  days: string;
  appliesTo: string;
  status: "Active" | "Inactive";
}

export const ACCESS_TIME_POLICIES: AccessTimePolicy[] = [
  { id: "ATP001", name: "Night Unlimited", allowedFrom: "22:00", allowedTo: "06:00", days: "Mon-Sun", appliesTo: "PR HULC 500", status: "Active" },
  { id: "ATP002", name: "Office Hours", allowedFrom: "09:00", allowedTo: "18:00", days: "Mon-Fri", appliesTo: "Leased Line", status: "Active" },
  { id: "ATP003", name: "Weekend All Day", allowedFrom: "00:00", allowedTo: "23:59", days: "Sat-Sun", appliesTo: "Hotspot Plans", status: "Inactive" },
];

/* ---------------- OTT Service ---------------- */

export interface OttPlatform {
  id: string;
  name: string;
  category: string;
  partner: string;
  status: "Active" | "Inactive";
  activeSubscribers: number;
}

export const OTT_PLATFORMS: OttPlatform[] = [
  { id: "OTT01", name: "Netflix", category: "Video Streaming", partner: "Netflix India", status: "Active", activeSubscribers: 412 },
  { id: "OTT02", name: "Amazon Prime", category: "Video Streaming", partner: "Amazon India", status: "Active", activeSubscribers: 388 },
  { id: "OTT03", name: "Disney+ Hotstar", category: "Video Streaming", partner: "Star India", status: "Active", activeSubscribers: 504 },
  { id: "OTT04", name: "SonyLIV", category: "Video Streaming", partner: "Sony Pictures", status: "Active", activeSubscribers: 156 },
  { id: "OTT05", name: "ZEE5", category: "Video Streaming", partner: "Zee Entertainment", status: "Active", activeSubscribers: 247 },
  { id: "OTT06", name: "YouTube Premium", category: "Video Sharing", partner: "Google India", status: "Inactive", activeSubscribers: 0 },
];

export interface OttUtility {
  id: string;
  name: string;
  type: "Authentication" | "Billing" | "Content" | "Reporting";
  description: string;
  status: "Active" | "Inactive";
}

export const OTT_UTILITIES: OttUtility[] = [
  { id: "UTL01", name: "SSO Auth", type: "Authentication", description: "Single sign-on with OTT provider", status: "Active" },
  { id: "UTL02", name: "Subscription Sync", type: "Billing", description: "Sync subscription state with OTT billing", status: "Active" },
  { id: "UTL03", name: "Content Catalog", type: "Content", description: "Fetch latest content catalog", status: "Active" },
  { id: "UTL04", name: "Usage Report", type: "Reporting", description: "Aggregate usage metrics per platform", status: "Inactive" },
  { id: "UTL05", name: "Token Refresh", type: "Authentication", description: "Auto refresh access tokens", status: "Active" },
];

export interface OttPlatformUtilityRelation {
  id: string;
  platform: string;
  utility: string;
  status: "Active" | "Inactive";
}

export const OTT_PLATFORM_UTILITY_RELATIONS: OttPlatformUtilityRelation[] = [
  { id: "REL01", platform: "Netflix", utility: "SSO Auth", status: "Active" },
  { id: "REL02", platform: "Netflix", utility: "Subscription Sync", status: "Active" },
  { id: "REL03", platform: "Amazon Prime", utility: "SSO Auth", status: "Active" },
  { id: "REL04", platform: "Disney+ Hotstar", utility: "Content Catalog", status: "Active" },
  { id: "REL05", platform: "SonyLIV", utility: "Token Refresh", status: "Active" },
  { id: "REL06", platform: "ZEE5", utility: "Usage Report", status: "Inactive" },
];

export interface OttPartnerKey {
  id: string;
  partner: string;
  apiKeyMasked: string;
  secretMasked: string;
  status: "Active" | "Inactive";
  created: string;
}

export const OTT_PARTNER_KEYS: OttPartnerKey[] = [
  { id: "PK01", partner: "Netflix India", apiKeyMasked: "nf_********************8a3f", secretMasked: "••••••••••••••••", status: "Active", created: "12 Aug 2026" },
  { id: "PK02", partner: "Amazon India", apiKeyMasked: "amz_****************c21d", secretMasked: "••••••••••••••••", status: "Active", created: "18 Aug 2026" },
  { id: "PK03", partner: "Star India", apiKeyMasked: "hs_********************9b17", secretMasked: "••••••••••••••••", status: "Active", created: "21 Aug 2026" },
  { id: "PK04", partner: "Sony Pictures", apiKeyMasked: "sn_********************2e8c", secretMasked: "••••••••••••••••", status: "Inactive", created: "02 Sep 2026" },
];

export interface OttBinding {
  id: string;
  platform: string;
  internalName: string;
  displayName: string;
  status: "Active" | "Inactive";
}

export const OTT_BINDINGS: OttBinding[] = [
  { id: "BND01", platform: "Netflix", internalName: "nf_primary", displayName: "Netflix — Primary Bundle", status: "Active" },
  { id: "BND02", platform: "Amazon Prime", internalName: "ap_primary", displayName: "Prime — Default", status: "Active" },
  { id: "BND03", platform: "Disney+ Hotstar", internalName: "hs_vip", displayName: "Hotstar VIP", status: "Active" },
  { id: "BND04", platform: "SonyLIV", internalName: "sl_premium", displayName: "SonyLIV Premium", status: "Inactive" },
];

/* ---------------- Payment Tracking extras ---------------- */

export interface PaymentMode {
  id: string;
  name: "Cash" | "UPI" | "Card" | "Cheque" | "Bank Transfer";
  enabled: boolean;
  isDefault: boolean;
}

export const PAYMENT_MODES: PaymentMode[] = [
  { id: "PM01", name: "Cash", enabled: true, isDefault: true },
  { id: "PM02", name: "UPI", enabled: true, isDefault: false },
  { id: "PM03", name: "Card", enabled: true, isDefault: false },
  { id: "PM04", name: "Cheque", enabled: true, isDefault: false },
  { id: "PM05", name: "Bank Transfer", enabled: false, isDefault: false },
];

export interface FranchiseAccount {
  id: string;
  name: string;
  type: "Customer" | "Franchise";
  balance: string;
  status: "Active" | "Suspended";
}

export const FRANCHISE_ACCOUNTS: FranchiseAccount[] = [
  { id: "FA01", name: "Franchise-12 Bhiwani", type: "Franchise", balance: "24,510.00", status: "Active" },
  { id: "FA02", name: "Franchise-09 Rohtak", type: "Franchise", balance: "9,820.00", status: "Active" },
  { id: "FA03", name: "Franchise-14 Hisar", type: "Franchise", balance: "-1,205.00", status: "Suspended" },
  { id: "FA04", name: "Franchise-21 Jhajjar", type: "Franchise", balance: "15,330.00", status: "Active" },
  { id: "FA05", name: "Franchise-03 Charkhi", type: "Franchise", balance: "3,210.00", status: "Active" },
  { id: "FA06", name: "Franchise-07 Loharu", type: "Franchise", balance: "870.00", status: "Active" },
];

export interface AccountSearchResult {
  id: string;
  account: string;
  customer: string;
  balance: string;
  lastPayment: string;
  status: "Active" | "Suspended";
}

export const ACCOUNT_SEARCH_RESULTS: AccountSearchResult[] = [
  { id: "AS01", account: "A000002959", customer: "shubham270597", balance: "0.00", lastPayment: "04 Oct 2026 — UPI 599.00", status: "Active" },
  { id: "AS02", account: "A000003537", customer: "rajesh130773", balance: "899.00", lastPayment: "01 Oct 2026 — Cash 899.00", status: "Active" },
  { id: "AS03", account: "A000001743", customer: "suresh030381", balance: "0.00", lastPayment: "03 Oct 2026 — Card 599.00", status: "Active" },
  { id: "AS04", account: "A000003572", customer: "sweety250397", balance: "1,298.00", lastPayment: "27 Sep 2026 — UPI 649.00", status: "Suspended" },
];

/* ---------------- Web Surfing Logger ---------------- */

export interface WebLogUrl {
  id: string;
  timestamp: string;
  user: string;
  url: string;
  category: string;
  action: "Allowed" | "Blocked";
}

export const WEB_LOG_URLS: WebLogUrl[] = [
  { id: "WU01", timestamp: "04 Oct 09:42:18", user: "shubham270597", url: "https://www.netflix.com/browse", category: "Streaming", action: "Allowed" },
  { id: "WU02", timestamp: "04 Oct 09:41:55", user: "aakash080198", url: "https://torrent-proxy.example/track", category: "P2P", action: "Blocked" },
  { id: "WU03", timestamp: "04 Oct 09:41:30", user: "rajesh130773", url: "https://www.primevideo.com", category: "Streaming", action: "Allowed" },
  { id: "WU04", timestamp: "04 Oct 09:41:12", user: "suresh030381", url: "https://www.hotstar.com", category: "Streaming", action: "Allowed" },
  { id: "WU05", timestamp: "04 Oct 09:40:48", user: "sweety250397", url: "https://social-media.example/game", category: "Social", action: "Blocked" },
  { id: "WU06", timestamp: "04 Oct 09:40:22", user: "manish080192", url: "https://www.google.com/search", category: "Search", action: "Allowed" },
  { id: "WU07", timestamp: "04 Oct 09:39:58", user: "ravi130686", url: "https://www.zee5.com", category: "Streaming", action: "Allowed" },
  { id: "WU08", timestamp: "04 Oct 09:39:31", user: "amit070791", url: "https://ads.example/tracker", category: "Ads", action: "Blocked" },
];

/* ---------------- Net Kapture ---------------- */

export interface NetKaptureSession {
  id: string;
  interface: string;
  filter: string;
  packets: number;
  size: string;
  duration: string;
  status: "Running" | "Completed" | "Stopped";
  started: string;
}

export const NET_KAPTURE_SESSIONS: NetKaptureSession[] = [
  { id: "NK01", interface: "eth12(M)", filter: "port 80 or port 443", packets: 184230, size: "82.4 MB", duration: "00:14:21", status: "Completed", started: "04 Oct 09:25" },
  { id: "NK02", interface: "eth13(N)", filter: "host 103.205.148.26", packets: 9451, size: "4.1 MB", duration: "00:02:08", status: "Stopped", started: "04 Oct 08:55" },
  { id: "NK03", interface: "eth0(A)", filter: "udp port 53", packets: 4219, size: "1.2 MB", duration: "00:00:42", status: "Completed", started: "04 Oct 08:12" },
  { id: "NK04", interface: "eth12(M)", filter: "tcp and port 1812", packets: 0, size: "0 KB", duration: "00:00:00", status: "Running", started: "04 Oct 09:48" },
  { id: "NK05", interface: "eth1(B)", filter: "icmp", packets: 612, size: "0.3 MB", duration: "00:01:11", status: "Completed", started: "03 Oct 22:30" },
];

/* ---------------- FTP Report schedules ---------------- */

export interface FtpReportSchedule {
  id: string;
  reportName: string;
  ftpServer: string;
  path: string;
  schedule: "Daily" | "Weekly" | "Monthly";
  format: "HTML" | "PDF" | "CSV" | "XLS";
  lastRun: string;
  nextRun: string;
  enabled: boolean;
}

export const FTP_REPORT_SCHEDULES: FtpReportSchedule[] = [
  { id: "FTP01", reportName: "Daily Collection Report", ftpServer: "ftp.cryptsk.net", path: "/reports/billing/", schedule: "Daily", format: "PDF", lastRun: "04 Oct 09:00", nextRun: "05 Oct 09:00", enabled: true },
  { id: "FTP02", reportName: "Weekly User Login", ftpServer: "ftp.cryptsk.net", path: "/reports/user/", schedule: "Weekly", format: "XLS", lastRun: "03 Oct 23:00", nextRun: "10 Oct 23:00", enabled: true },
  { id: "FTP03", reportName: "Monthly Revenue Summary", ftpServer: "ftp.cryptsk.net", path: "/reports/billing/", schedule: "Monthly", format: "PDF", lastRun: "01 Oct 00:00", nextRun: "01 Nov 00:00", enabled: true },
  { id: "FTP04", reportName: "Daily SMS Log", ftpServer: "ftp.cryptsk.net", path: "/reports/alert/", schedule: "Daily", format: "CSV", lastRun: "04 Oct 09:00", nextRun: "05 Oct 09:00", enabled: false },
  { id: "FTP05", reportName: "Weekly Device Status", ftpServer: "ftp.cryptsk.net", path: "/reports/system/", schedule: "Weekly", format: "HTML", lastRun: "03 Oct 23:00", nextRun: "10 Oct 23:00", enabled: true },
];

/* ---------------- Help: module licenses ---------------- */

export interface ModuleLicense {
  id: string;
  name: string;
  licensed: boolean;
  expiry: string;
  status: "Active" | "Expired" | "Trial";
}

export const MODULE_LICENSES: ModuleLicense[] = [
  { id: "LIC01", name: "User Management", licensed: true, expiry: "31 Dec 2026", status: "Active" },
  { id: "LIC02", name: "Billing & Invoice", licensed: true, expiry: "31 Dec 2026", status: "Active" },
  { id: "LIC03", name: "Policy Manager", licensed: true, expiry: "31 Dec 2026", status: "Active" },
  { id: "LIC04", name: "Ticket Management", licensed: true, expiry: "31 Dec 2026", status: "Active" },
  { id: "LIC05", name: "Sales & CRM", licensed: true, expiry: "31 Dec 2026", status: "Active" },
  { id: "LIC06", name: "Inventory", licensed: true, expiry: "31 Dec 2026", status: "Active" },
  { id: "LIC07", name: "Alert & SMS Gateway", licensed: true, expiry: "31 Dec 2026", status: "Active" },
  { id: "LIC08", name: "OTT Service", licensed: true, expiry: "31 Dec 2026", status: "Active" },
  { id: "LIC09", name: "Payment Tracking", licensed: true, expiry: "31 Dec 2026", status: "Active" },
  { id: "LIC10", name: "Web Surfing Logger", licensed: false, expiry: "—", status: "Trial" },
  { id: "LIC11", name: "Net Kapture", licensed: false, expiry: "—", status: "Trial" },
  { id: "LIC12", name: "Reports Pro", licensed: true, expiry: "30 Sep 2026", status: "Expired" },
  { id: "LIC13", name: "Payment Gateway", licensed: true, expiry: "31 Dec 2026", status: "Active" },
  { id: "LIC14", name: "Hotspot Manager", licensed: true, expiry: "31 Dec 2026", status: "Active" },
  { id: "LIC15", name: "Captive Portal Pro", licensed: true, expiry: "31 Dec 2026", status: "Active" },
];

/* ---------------- Help: documentation ---------------- */

export interface DocSection {
  id: string;
  title: string;
  category: string;
  content: DocBlock[];
}

export interface DocBlock {
  type: "h1" | "h2" | "p" | "ul" | "code";
  text?: string;
  items?: string[];
}

export const DOC_SECTIONS: DocSection[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    category: "Getting Started",
    content: [
      { type: "h1", text: "Getting Started with Cryptsk" },
      { type: "p", text: "Cryptsk is a complete ISP billing and gateway management platform. This guide walks you through the initial setup so you can start managing subscribers, plans, payments and network services in minutes." },
      { type: "h2", text: "1. Login" },
      { type: "p", text: "Open the Cryptsk web UI in your browser. Use the administrator credentials provided by your deployment to access the full suite of modules." },
      { type: "h2", text: "2. Configure Network" },
      { type: "p", text: "Head to the System module and configure your interfaces, gateway, DNS and static routes before bringing subscribers online." },
      { type: "h2", text: "3. Create Plans" },
      { type: "p", text: "Use the Package module to create billing plans with bandwidth, data limits and validity. Plans are then assigned to subscribers during registration." },
      { type: "ul", items: [
        "Define bandwidth up/down per plan",
        "Choose prepaid or postpaid billing",
        "Attach tax information",
        "Map ancillary services if required",
      ] },
      { type: "h2", text: "4. Register Users" },
      { type: "p", text: "Use the User module to register subscribers. Assign them a plan, zone and IP pool. Cryptsk will start RADIUS accounting automatically once the user connects." },
    ],
  },
  {
    id: "user-mgmt",
    title: "User Management",
    category: "User Management",
    content: [
      { type: "h1", text: "Managing Subscribers" },
      { type: "p", text: "The User module is the heart of Cryptsk. From here you search subscribers, manage live sessions, organise zones and pools, and maintain customer records." },
      { type: "h2", text: "Searching Users" },
      { type: "p", text: "Use the Manage Users page to search by username, account number, customer name, mobile, IP or MAC address. Demographic field search is also supported." },
      { type: "h2", text: "Live Sessions" },
      { type: "p", text: "The Live Users page lists every currently connected subscriber with bandwidth, duration and device type. Use the toolbar to send messages or disconnect sessions in bulk." },
      { type: "ul", items: [
        "Send a popup message to all live users",
        "Advance filter by user type",
        "Disconnect one or many sessions",
        "Export the live user list",
      ] },
    ],
  },
  {
    id: "billing",
    title: "Billing & Invoices",
    category: "Billing",
    content: [
      { type: "h1", text: "Billing and Invoicing" },
      { type: "p", text: "Cryptsk generates invoices automatically based on the plan assigned to each subscriber. The Billing module lets you design invoice templates, apply tax, and track collections." },
      { type: "h2", text: "Invoice Templates" },
      { type: "p", text: "Create branded invoice templates with your logo, colours and footer text. Templates are versioned so historical invoices always render with their original layout." },
      { type: "h2", text: "Tax Information" },
      { type: "p", text: "Configure GST, service tax or any custom tax slab. Each plan can reference one or more tax entries that are auto-applied during invoice generation." },
    ],
  },
  {
    id: "policies",
    title: "Policies",
    category: "Policies",
    content: [
      { type: "h1", text: "Policies Overview" },
      { type: "p", text: "Cryptsk policies let you enforce surfing quotas, time-based access, bandwidth caps, data transfer limits, fair access thresholds and QoS priorities." },
      { type: "h2", text: "Surfing Quota" },
      { type: "p", text: "Limit the time a user can spend on the web per day or per week. Quota resets are configurable." },
      { type: "h2", text: "Fair Access Policy (FAP)" },
      { type: "p", text: "When a user crosses a configured data threshold, bandwidth is throttled until the next reset cycle. FAP is ideal for managing peak network load." },
      { type: "ul", items: [
        "Soft FAP — warn user only",
        "Hard FAP — throttle bandwidth",
        "Schedule-based reset (daily / weekly / monthly)",
      ] },
    ],
  },
  {
    id: "system",
    title: "System Administration",
    category: "System",
    content: [
      { type: "h1", text: "System Administration" },
      { type: "p", text: "The System module exposes network, firewall, DHCP, PPPoE, NAS and captive portal configuration. It also covers backups, ACL, dynamic DNS and dashboard configuration." },
      { type: "h2", text: "Backups" },
      { type: "p", text: "Schedule daily backups and download restore bundles. Always verify a backup before running an upgrade." },
      { type: "h2", text: "Access Control (ACL)" },
      { type: "p", text: "Use the ACL sub-module to create roles and grant them per-module permissions. Operators can be limited to read-only access on sensitive screens." },
    ],
  },
  {
    id: "api-reference",
    title: "API Reference",
    category: "API Reference",
    content: [
      { type: "h1", text: "Cryptsk REST API" },
      { type: "p", text: "Cryptsk ships with a REST API for integrating subscriber management, billing and reporting with external CRMs and ERPs." },
      { type: "h2", text: "Authentication" },
      { type: "p", text: "All API calls require a bearer token issued from the ACL → Security Management page." },
      { type: "code", text: "curl -H 'Authorization: Bearer <token>' \\\n  https://cryptsk.example/api/v1/users" },
      { type: "h2", text: "Endpoints" },
      { type: "ul", items: [
        "GET /api/v1/users — list subscribers",
        "POST /api/v1/users — create subscriber",
        "GET /api/v1/invoices — list invoices",
        "POST /api/v1/payments — record payment",
      ] },
    ],
  },
];

/* ---------------- Service Requests ---------------- */

export interface ServiceRequest {
  id: string;
  customer: string;
  type: "Installation" | "Relocation" | "Plan Change" | "Termination";
  scheduledDate: string;
  technician: string;
  status: "Pending" | "Scheduled" | "In Progress" | "Completed" | "Cancelled";
  priority: "Low" | "Medium" | "High";
}

export const SERVICE_REQUESTS: ServiceRequest[] = [
  { id: "SR-318", customer: "Rohit Sharma", type: "Installation", scheduledDate: "05 Oct 2026, 10:00", technician: "Field Team A", status: "Scheduled", priority: "High" },
  { id: "SR-317", customer: "Priya Verma", type: "Relocation", scheduledDate: "05 Oct 2026, 14:30", technician: "Field Team B", status: "Pending", priority: "Medium" },
  { id: "SR-316", customer: "Aman Gupta", type: "Plan Change", scheduledDate: "04 Oct 2026, 16:00", technician: "Sales-A", status: "Completed", priority: "Low" },
  { id: "SR-315", customer: "Nisha Kumari", type: "Termination", scheduledDate: "06 Oct 2026, 11:00", technician: "Field Team A", status: "In Progress", priority: "Medium" },
  { id: "SR-314", customer: "Vikas Jain", type: "Installation", scheduledDate: "04 Oct 2026, 09:00", technician: "Field Team C", status: "Cancelled", priority: "Low" },
  { id: "SR-313", customer: "Suresh Yadav", type: "Relocation", scheduledDate: "07 Oct 2026, 12:30", technician: "Field Team B", status: "Pending", priority: "High" },
];

/* ---------------- Inventory Transactions ---------------- */

export interface InventoryTxn {
  id: string;
  item: string;
  type: "IN" | "OUT";
  quantity: number;
  fromTo: string;
  date: string;
  note: string;
}

export const INVENTORY_TXNS: InventoryTxn[] = [
  { id: "TX-1042", item: "ONT GPON", type: "IN", quantity: 50, fromTo: "Vendor: Huawei", date: "04 Oct 2026", note: "Quarterly restock" },
  { id: "TX-1041", item: "WiFi Router", type: "OUT", quantity: 3, fromTo: "Field Team A", date: "04 Oct 2026", note: "Installation SR-318" },
  { id: "TX-1040", item: "Fiber Patch Cord", type: "OUT", quantity: 20, fromTo: "Field Team B", date: "03 Oct 2026", note: "Survey kit" },
  { id: "TX-1039", item: "SFP Module", type: "IN", quantity: 10, fromTo: "Vendor: Cisco", date: "03 Oct 2026", note: "Replenishment" },
  { id: "TX-1038", item: "RJ45 Connector", type: "OUT", quantity: 200, fromTo: "Franchise-12", date: "03 Oct 2026", note: "Bulk deployment" },
  { id: "TX-1037", item: "PoE Injector", type: "OUT", quantity: 2, fromTo: "NOC L1", date: "02 Oct 2026", note: "Hotspot AP install" },
  { id: "TX-1036", item: "WiFi Router", type: "IN", quantity: 25, fromTo: "Vendor: TP-Link", date: "02 Oct 2026", note: "Monthly restock" },
  { id: "TX-1035", item: "ONT GPON", type: "OUT", quantity: 5, fromTo: "Field Team C", date: "02 Oct 2026", note: "CPE replacement" },
];

/* ---------------- Alert Rules ---------------- */

export interface AlertRule {
  id: string;
  event: "User Login" | "User Logout" | "User Expiry" | "User Suspension" | "User Renewal" | "FAP Hit";
  channel: "SMS" | "Email" | "Both";
  template: string;
  enabled: boolean;
  recipients: string;
}

export const ALERT_RULES: AlertRule[] = [
  { id: "AR-01", event: "User Expiry", channel: "Both", template: "Expiry Reminder", enabled: true, recipients: "Customer + Owner" },
  { id: "AR-02", event: "User Suspension", channel: "SMS", template: "Suspension Notice", enabled: true, recipients: "Customer" },
  { id: "AR-03", event: "User Renewal", channel: "Both", template: "Renewal", enabled: true, recipients: "Customer + Billing" },
  { id: "AR-04", event: "FAP Hit", channel: "Email", template: "FAP Notification", enabled: true, recipients: "Customer + NOC" },
  { id: "AR-05", event: "User Login", channel: "SMS", template: "Login OTP", enabled: false, recipients: "Customer" },
  { id: "AR-06", event: "User Logout", channel: "Email", template: "Session Summary", enabled: false, recipients: "Customer" },
];

/* ---------------- Email Templates ---------------- */

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  lastEdited: string;
}

export const EMAIL_TEMPLATES: EmailTemplate[] = [
  { id: "ET-01", name: "Welcome", subject: "Welcome to Cryptsk Networks", lastEdited: "01 Oct 2026" },
  { id: "ET-02", name: "Renewal", subject: "Your plan has been renewed", lastEdited: "28 Sep 2026" },
  { id: "ET-03", name: "Due Reminder", subject: "Outstanding bill reminder", lastEdited: "29 Sep 2026" },
  { id: "ET-04", name: "Outage", subject: "Scheduled network outage notice", lastEdited: "30 Sep 2026" },
  { id: "ET-05", name: "Suspension", subject: "Account suspended — please action", lastEdited: "27 Sep 2026" },
];
