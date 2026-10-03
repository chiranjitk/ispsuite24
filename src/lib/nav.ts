import type { LucideIcon } from "lucide-react";
import {
  Settings2,
  ShieldCheck,
  Boxes,
  CreditCard,
  Users,
  Ticket,
  ShoppingCart,
  PackageSearch,
  BellRing,
  Tv,
  Wallet,
  Globe,
  Radar,
  BarChart3,
  HelpCircle,
  LayoutDashboard,
  type Icon,
} from "lucide-react";

export interface NavChild {
  id: string;
  label: string;
  /** short description shown in help/docs */
  desc: string;
}

export interface NavModule {
  id: string;
  label: string;
  icon: LucideIcon;
  desc: string;
  children: NavChild[];
}

/**
 * Full Cryptsk navigation tree — mirrors the 24online module structure
 * (15 modules) with sensible sub-pages per module.
 */
export const NAV_MODULES: NavModule[] = [
  {
    id: "system",
    label: "System",
    icon: Settings2,
    desc: "Network, firewall, DHCP, PPPoE, NAS, captive portal and system settings.",
    children: [
      { id: "network", label: "Network", desc: "Interfaces, gateways, DNS, routes, priorities" },
      { id: "firewall", label: "Firewall", desc: "Create & manage rules, DoS, free sites" },
      { id: "dhcp", label: "DHCP", desc: "Manage DHCP scopes and IP leasing reports" },
      { id: "services", label: "Services", desc: "Control running system services" },
      { id: "pppoe", label: "PPPoE", desc: "Manage PPPoE configuration" },
      { id: "console", label: "Console", desc: "Reset console password" },
      { id: "manage-data", label: "Manage Data", desc: "Backup, restore, purge, RADIUS logs" },
      { id: "client-services", label: "Client Services", desc: "Client GUI, web service config" },
      { id: "acl", label: "ACL", desc: "Roles, modules, security, console ACL" },
      { id: "dynamic-dns", label: "Dynamic DNS", desc: "Add & manage dynamic DNS services" },
      { id: "captive-portal", label: "Captive Portal", desc: "Client login, templates, deny network" },
      { id: "nas", label: "NAS Management", desc: "RADIUS clients, attribute mapping" },
      { id: "status-tracker", label: "Status Tracker", desc: "Devices, logs, packet capture" },
      { id: "system-settings", label: "System Settings", desc: "Proactive reports, GUI preferences" },
      { id: "dashboard-conf", label: "Dashboard Conf", desc: "Configure dashboard layouts" },
      { id: "system-tools", label: "System Tools", desc: "Diagnostics and utilities" },
    ],
  },
  {
    id: "policy",
    label: "Policy",
    icon: ShieldCheck,
    desc: "Surfing, access, bandwidth, data transfer, FAP and QoS policies.",
    children: [
      { id: "surfing-quota", label: "Surfing Quota", desc: "Create & manage surfing quota policies" },
      { id: "access-time", label: "Access Time", desc: "Time-based access policies" },
      { id: "bandwidth", label: "Bandwidth", desc: "Bandwidth restriction policies" },
      { id: "data-transfer", label: "Data Transfer Policy", desc: "Data transfer quotas" },
      { id: "fap", label: "Fair Access Policy", desc: "FAP rules and thresholds" },
      { id: "qos", label: "QoS Policy", desc: "Cache & QoS scheduling" },
    ],
  },
  {
    id: "package",
    label: "Package",
    icon: Boxes,
    desc: "Plans, invoices, templates, ancillary services and tax.",
    children: [
      { id: "package", label: "Package", desc: "Create & manage billing plans" },
      { id: "invoice", label: "Invoice", desc: "Invoice front page and purge" },
      { id: "invoice-template", label: "Invoice Template", desc: "Invoice template designer" },
      { id: "ancillary", label: "Ancillary Service", desc: "Add-on services" },
      { id: "tax", label: "Tax Information", desc: "Tax configuration" },
    ],
  },
  {
    id: "payment-gateway",
    label: "Payment Gateway",
    icon: CreditCard,
    desc: "Configure online payment gateways and merchants.",
    children: [
      { id: "configure", label: "Configure", desc: "Gateway configuration" },
      { id: "merchant", label: "Merchant", desc: "Merchant accounts" },
      { id: "search-transactions", label: "Search Transactions", desc: "Search gateway transactions" },
    ],
  },
  {
    id: "user",
    label: "User",
    icon: Users,
    desc: "Subscribers, live sessions, zones, pools, customers.",
    children: [
      { id: "manage-users", label: "Manage Users", desc: "Search & register subscribers" },
      { id: "live-users", label: "Live Users", desc: "Active sessions and bandwidth" },
      { id: "zone", label: "Zone Management", desc: "Network zones" },
      { id: "pool", label: "Pool Management", desc: "IP pools" },
      { id: "customers", label: "Manage Customers", desc: "Customer accounts" },
      { id: "dynamize", label: "Dynamize Fields", desc: "Dynamic user fields" },
      { id: "demographic", label: "Demographic Fields", desc: "Demographic field config" },
    ],
  },
  {
    id: "ticket",
    label: "Ticket Management",
    icon: Ticket,
    desc: "Support ticket search and creation.",
    children: [
      { id: "search-ticket", label: "Search Ticket", desc: "Find and manage tickets" },
      { id: "create-ticket", label: "Create Ticket", desc: "Open a new support ticket" },
    ],
  },
  {
    id: "sales",
    label: "Sales Management",
    icon: ShoppingCart,
    desc: "Leads and service requests.",
    children: [
      { id: "lead", label: "Lead Management", desc: "Sales leads pipeline" },
      { id: "service-request", label: "Service Request", desc: "Customer service requests" },
    ],
  },
  {
    id: "inventory",
    label: "Inventory",
    icon: PackageSearch,
    desc: "Stock transactions and master items.",
    children: [
      { id: "transaction", label: "Transaction", desc: "Stock in/out transactions" },
      { id: "master", label: "Master", desc: "Inventory master items" },
    ],
  },
  {
    id: "alert",
    label: "Alert",
    icon: BellRing,
    desc: "SMS gateway, email and alert configuration.",
    children: [
      { id: "sms-gateway", label: "SMS Gateway", desc: "SMS logs and bulk SMS" },
      { id: "email", label: "Email Management", desc: "SMTP configuration" },
      { id: "alert-config", label: "Alert Configuration", desc: "Alert rules and triggers" },
    ],
  },
  {
    id: "ott",
    label: "OTT Service",
    icon: Tv,
    desc: "OTT platforms, utilities and partner keys.",
    children: [
      { id: "platforms", label: "Platforms", desc: "OTT platforms" },
      { id: "platform-utility", label: "Platform Utility", desc: "Utility mappings" },
      { id: "platform-utility-relation", label: "Platform Utility Relation", desc: "Relations" },
      { id: "partner-key", label: "Add Partner Key", desc: "Partner API keys" },
      { id: "bind-ott", label: "Bind OTT Name", desc: "Bind OTT names" },
    ],
  },
  {
    id: "payment-tracking",
    label: "Payment Tracking",
    icon: Wallet,
    desc: "Manual payment tracking and reconciliation.",
    children: [
      { id: "manage-accounts", label: "Manage Accounts", desc: "Payment modes" },
      { id: "search-accounts", label: "Search Accounts", desc: "Customer & franchise accounts" },
      { id: "payment-details", label: "Payment Details", desc: "Payment history" },
      { id: "reverse", label: "Reverse Transactions", desc: "Reverse payments" },
      { id: "settle", label: "Settle Transactions", desc: "Settle transactions" },
    ],
  },
  {
    id: "web-surfing",
    label: "Web Surfing Logger",
    icon: Globe,
    desc: "Web surfing log management.",
    children: [
      { id: "manage-logger", label: "Manage Logger", desc: "Configure web surfing logger" },
    ],
  },
  {
    id: "net-kapture",
    label: "Net Kapture",
    icon: Radar,
    desc: "Network packet capture service.",
    children: [
      { id: "manage-service", label: "Manage Service", desc: "Configure net kapture" },
    ],
  },
  {
    id: "reports",
    label: "Reports",
    icon: BarChart3,
    desc: "Reports launcher and FTP report configuration.",
    children: [
      { id: "reports", label: "Reports", desc: "Report launcher" },
      { id: "ftp-report", label: "FTP Report Configuration", desc: "Scheduled FTP reports" },
    ],
  },
  {
    id: "help",
    label: "Help",
    icon: HelpCircle,
    desc: "Company info, docs, modules and about.",
    children: [
      { id: "company-info", label: "Company Info", desc: "Company details" },
      { id: "client", label: "Cryptsk Client", desc: "Client app info" },
      { id: "upgrade", label: "Upgrade Version", desc: "Version upgrades" },
      { id: "register", label: "Register Cryptsk", desc: "Product registration" },
      { id: "customization", label: "Manage Customization", desc: "Module licenses" },
      { id: "documentation", label: "Documentation", desc: "User documentation" },
      { id: "about", label: "About", desc: "About Cryptsk" },
    ],
  },
];

/** Special top-level views (not part of the 15 modules) */
export interface TopLink {
  id: string;
  label: string;
  icon: Icon;
}

export const TOP_LINKS: TopLink[] = [
  { id: "home", label: "Home", icon: LayoutDashboard },
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
];

export function findModule(moduleId: string): NavModule | undefined {
  return NAV_MODULES.find((m) => m.id === moduleId);
}

export function findChild(moduleId: string, childId: string): NavChild | undefined {
  return findModule(moduleId)?.children.find((c) => c.id === childId);
}
