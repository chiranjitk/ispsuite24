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

export interface NavGrandchild {
  id: string;
  label: string;
  /** JSP/Action URL on the reference 24online site (for documentation) */
  refUrl?: string;
  desc?: string;
}

export interface NavChild {
  id: string;
  label: string;
  desc: string;
  /** reference URL on 24online site */
  refUrl?: string;
  /** third-level sub-pages (sub-submenus). Empty array = leaf. */
  grandchildren?: NavGrandchild[];
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
 * with ALL THREE LEVELS:
 *   - 15 top-level modules
 *   - 67 submenus (level 2)
 *   - 139 sub-submenus (level 3)
 *
 * Each leaf (level-2 without grandchildren, or level-3 grandchild) is a
 * navigable page. refUrl is the original 24online URL for future reference.
 */
export const NAV_MODULES: NavModule[] = [
  {
    id: "system",
    label: "System",
    icon: Settings2,
    desc: "Network, firewall, DHCP, PPPoE, NAS, captive portal and system settings.",
    children: [
      {
        id: "network", label: "Network", desc: "Interfaces, gateways, DNS, routes, priorities",
        refUrl: "/24online/system/interfaceconfiguration.do",
        grandchildren: [
          { id: "interface", label: "Interface", refUrl: "/24online/system/interfaceconfiguration.do", desc: "View & configure network interfaces" },
          { id: "gateway", label: "Gateway", refUrl: "/24online/system/managegateway.do", desc: "Manage gateways" },
          { id: "priorities", label: "Priorities", refUrl: "/24online/webpages/sysmgt/managepriorities.jsp", desc: "Traffic priorities" },
          { id: "dns", label: "DNS", refUrl: "/24online/webpages/sysmgt/configuredns.jsp", desc: "DNS configuration" },
          { id: "static-route", label: "Static Route", refUrl: "/24online/webpages/sysmgt/routeconfig/addroute.jsp", desc: "Static routes" },
        ],
      },
      {
        id: "firewall", label: "Firewall", desc: "Create & manage rules, DoS, free sites",
        grandchildren: [
          { id: "create", label: "Create", refUrl: "/24online/webpages/sysmgt/createfirewall.jsp", desc: "Create firewall rule" },
          { id: "manage", label: "Manage", refUrl: "/24online/webpages/sysmgt/managefirewall.jsp", desc: "Manage firewall rules" },
          { id: "dos-settings", label: "DoS Settings", refUrl: "/24online/webpages/sysmgt/dosattacksconfiguration.jsp", desc: "DoS protection settings" },
          { id: "dos-bypass", label: "DoS Bypass", refUrl: "/24online/webpages/sysmgt/dosattacksbypassmgt.jsp", desc: "DoS bypass hosts" },
          { id: "free-sites", label: "Free Sites", refUrl: "/24online/webpages/sysmgt/managefreesites.jsp", desc: "Zero-rated sites" },
        ],
      },
      {
        id: "dhcp", label: "DHCP", desc: "Manage DHCP scopes and IP leasing reports",
        grandchildren: [
          { id: "manage-dhcp", label: "Manage DHCP", refUrl: "/24online/webpages/sysmgt/managedhcp.jsp", desc: "DHCP scopes" },
          { id: "ip-leasing", label: "IP Leasing Report", refUrl: "/24online/webpages/sysmgt/dhcpleasereport.jsp", desc: "IP lease report" },
        ],
      },
      { id: "services", label: "Services", desc: "Control running system services", refUrl: "/24online/webpages/sysmgt/controlservices.jsp" },
      {
        id: "pppoe", label: "PPPoE", desc: "Manage PPPoE configuration",
        grandchildren: [
          { id: "manage-pppoe", label: "Manage PPPoE", refUrl: "/24online/webpages/sysmgt/managepppoe.jsp", desc: "PPPoE config" },
        ],
      },
      { id: "console", label: "Console", desc: "Reset console password", refUrl: "/24online/webpages/sysmgt/resetconsolepass.jsp" },
      {
        id: "manage-data", label: "Manage Data", desc: "Backup, restore, purge, migration, auth logs",
        grandchildren: [
          { id: "backup", label: "Backup", refUrl: "/24online/webpages/sysmgt/backupdata.jsp", desc: "Backup data" },
          { id: "backup-schedule", label: "Backup Schedule", refUrl: "/24online/webpages/sysmgt/backupschedule.jsp", desc: "Schedule backups" },
          { id: "restore", label: "Restore", refUrl: "/24online/webpages/sysmgt/restoredata.jsp", desc: "Restore data" },
          { id: "auto-purge", label: "Auto Purge", refUrl: "/24online/webpages/sysmgt/autopurge.jsp", desc: "Auto purge config" },
          { id: "manual-purge", label: "Manual Purge", refUrl: "/24online/webpages/sysmgt/purgedata.jsp", desc: "Manual purge" },
          { id: "migrate-user", label: "Migrate User", refUrl: "/24online/webpages/sysmgt/migrateuser.jsp", desc: "Migrate users" },
          { id: "auth-logs", label: "Authentication Logs", refUrl: "/24online/webpages/sysmgt/radiusauthlog.jsp", desc: "RADIUS auth logs" },
        ],
      },
      {
        id: "client-services", label: "Client Services", desc: "Client GUI, web service, password config",
        grandchildren: [
          { id: "parameters", label: "Parameters", refUrl: "/24online/webpages/sysmgt/clientservices.jsp", desc: "Client service parameters" },
          { id: "customized-images", label: "Customized Images", refUrl: "/24online/webpages/sysmgt/myaccountimages.jsp", desc: "Custom images" },
          { id: "forgot-password", label: "Forgot Password", refUrl: "/24online/webpages/usermgt/forgotpassword.jsp", desc: "Forgot password config" },
          { id: "clientgui-urls", label: "ClientGUI URLs", refUrl: "/24online/webpages/sysmgt/manageclientguiurls.jsp", desc: "Client GUI URLs" },
          { id: "webservice-config", label: "Webservice Config", refUrl: "/24online/webpages/sysmgt/webserviceconfig.jsp", desc: "Web service config" },
          { id: "password-config", label: "Password Config", refUrl: "/24online/webpages/sysmgt/passwordconfig.jsp", desc: "Password policy" },
          { id: "configuration", label: "Configuration", refUrl: "/24online/webpages/sysmgt/clientconfiguration.jsp", desc: "Client configuration" },
        ],
      },
      {
        id: "acl", label: "ACL", desc: "Access control, user types, console ACL",
        grandchildren: [
          { id: "access-control", label: "Access Control", refUrl: "/24online/webpages/sysmgt/aclmoduledetail.jsp", desc: "Module access control" },
          { id: "user-type", label: "User Type", refUrl: "/24online/webpages/sysmgt/aclrolemgt.jsp", desc: "User types/roles" },
          { id: "user-access", label: "User Access", refUrl: "/24online/webpages/sysmgt/aclsecuritymgt.jsp", desc: "User access rights" },
          { id: "console-acl", label: "Console ACL", refUrl: "/24online/webpages/sysmgt/consoleacl.jsp", desc: "Console ACL" },
        ],
      },
      {
        id: "dynamic-dns", label: "Dynamic DNS", desc: "Register & manage dynamic DNS hosts",
        grandchildren: [
          { id: "register-host", label: "Register Host", refUrl: "/24online/webpages/sysmgt/adddynamicdnsservice.jsp", desc: "Register DDNS host" },
          { id: "manage-hosts", label: "Manage Hosts", refUrl: "/24online/webpages/sysmgt/managedynamicdnsservices.jsp", desc: "Manage DDNS hosts" },
        ],
      },
      {
        id: "captive-portal", label: "Captive Portal", desc: "Client login, templates, portal config",
        grandchildren: [
          { id: "create", label: "Create", refUrl: "/24online/webpages/sysmgt/createclientlogin.jsp", desc: "Create client login template" },
          { id: "manage", label: "Manage", refUrl: "/24online/webpages/sysmgt/manageclientlogin.jsp", desc: "Manage client login templates" },
          { id: "client-page", label: "Client Page", refUrl: "/24online/webpages/sysmgt/clientpage.jsp", desc: "Client page design" },
          { id: "portal-networks", label: "Portal Networks", refUrl: "/24online/webpages/sysmgt/templatezonerel.jsp", desc: "Template-zone relation" },
          { id: "leased-line-page", label: "Leased Line Page", refUrl: "/24online/webpages/sysmgt/leasedlineusertemplate.jsp", desc: "Leased line template" },
          { id: "messages", label: "Messages", refUrl: "/24online/webpages/sysmgt/cpMessages.jsp", desc: "Portal messages" },
          { id: "portal-config", label: "Portal Config", refUrl: "/24online/webpages/sysmgt/portalconfig.jsp", desc: "Portal configuration" },
          { id: "configure-profile", label: "Configure Profile", refUrl: "/24online/webpages/sysmgt/configureprofile.jsp", desc: "Profile configuration" },
          { id: "security-config", label: "Security Configuration", refUrl: "/24online/webpages/sysmgt/cpsecurityconfig.jsp", desc: "Security config" },
          { id: "social-media", label: "Social Media Config", refUrl: "/24online/webpages/sysmgt/cpsocialmedia.jsp", desc: "Social media login" },
          { id: "cp-registration", label: "CP Registration Policy", refUrl: "/24online/webpages/sysmgt/cpregistrationpolicy.jsp", desc: "Registration policy" },
        ],
      },
      {
        id: "nas", label: "NAS Management", desc: "RADIUS clients, attribute mapping, connectivity",
        grandchildren: [
          { id: "nas-ip-config", label: "NAS IP Configuration", refUrl: "/24online/webpages/sysmgt/createnasconfig.jsp", desc: "NAS IP config" },
          { id: "radius-config", label: "Radius Configuration", refUrl: "/24online/webpages/sysmgt/manageglobalradiusconfig.jsp", desc: "Global RADIUS config" },
          { id: "nas-configuration", label: "NAS Configuration", refUrl: "/24online/webpages/sysmgt/nasconfiguration.jsp", desc: "NAS configuration" },
          { id: "preferences", label: "Preferences", refUrl: "/24online/webpages/sysmgt/naspreferences.jsp", desc: "NAS preferences" },
          { id: "connectivity", label: "Connectivity", refUrl: "/24online/webpages/sysmgt/managenasconnectivity.jsp", desc: "NAS connectivity" },
          { id: "nas-client-config", label: "NAS Client Config", refUrl: "/24online/webpages/sysmgt/managenasclientconfig.jsp", desc: "NAS client config" },
          { id: "attribute-mapping", label: "Attribute Mapping", refUrl: "/24online/webpages/sysmgt/attributemapping.jsp", desc: "RADIUS attribute mapping" },
        ],
      },
      {
        id: "status-tracker", label: "Status Tracker", desc: "Devices, logs, packet capture",
        grandchildren: [
          { id: "add-device", label: "Add Device", refUrl: "/24online/webpages/sysmgt/adddevice.jsp", desc: "Add tracked device" },
          { id: "manage-devices", label: "Manage Devices", refUrl: "/24online/webpages/sysmgt/managedevices.jsp", desc: "Manage devices" },
          { id: "device-logs", label: "Device Logs Details", refUrl: "/24online/webpages/sysmgt/devicelogs.jsp", desc: "Device log details" },
        ],
      },
      { id: "system-settings", label: "System Settings", desc: "Proactive reports, GUI preferences", refUrl: "/24online/webpages/sysmgt/manageproactivereports.jsp" },
      { id: "dashboard-conf", label: "Dashboard Conf", desc: "Configure dashboard layouts", refUrl: "/24online/webpages/sysmgt/dashboardconfig.jsp" },
      {
        id: "system-tools", label: "System Tools", desc: "Diagnostics and utilities",
        grandchildren: [
          { id: "packet-capture", label: "Packet Capture", refUrl: "/24online/webpages/sysmgt/packetcapture.jsp", desc: "Packet capture tool" },
        ],
      },
    ],
  },
  {
    id: "policy",
    label: "Policy",
    icon: ShieldCheck,
    desc: "Surfing, access, bandwidth, data transfer, FAP and QoS policies.",
    children: [
      {
        id: "surfing-quota", label: "Surfing Quota", desc: "Create & manage surfing quota policies",
        grandchildren: [
          { id: "create", label: "Create", refUrl: "/24online/webpages/polmgt/createsurfpolicy.jsp", desc: "Create surf policy" },
          { id: "manage", label: "Manage", refUrl: "/24online/webpages/polmgt/managesurfpolicy.jsp", desc: "Manage surf policies" },
        ],
      },
      {
        id: "access-time", label: "Access Time", desc: "Time-based access policies",
        grandchildren: [
          { id: "create", label: "Create", refUrl: "/24online/webpages/polmgt/createaccesspolicy.jsp", desc: "Create access policy" },
          { id: "manage", label: "Manage", refUrl: "/24online/webpages/polmgt/manageaccesspolicy.jsp", desc: "Manage access policies" },
        ],
      },
      {
        id: "bandwidth", label: "Bandwidth", desc: "Bandwidth restriction policies",
        grandchildren: [
          { id: "create", label: "Create", refUrl: "/24online/webpages/polmgt/createbandwidthrestriction.jsp", desc: "Create bandwidth policy" },
          { id: "manage", label: "Manage", refUrl: "/24online/webpages/polmgt/managebandwidthpolicy.jsp", desc: "Manage bandwidth policies" },
          { id: "schedule", label: "Schedule", refUrl: "/24online/webpages/polmgt/manageschedule.jsp", desc: "Bandwidth schedules" },
        ],
      },
      {
        id: "data-transfer", label: "Data Transfer Policy", desc: "Data transfer quotas",
        grandchildren: [
          { id: "create", label: "Create", refUrl: "/24online/webpages/polmgt/createdatatransferpolicy.jsp", desc: "Create data transfer policy" },
          { id: "manage", label: "Manage", refUrl: "/24online/webpages/polmgt/managedatatransferpolicy.jsp", desc: "Manage data transfer policies" },
        ],
      },
      {
        id: "fap", label: "Fair Access Policy", desc: "FAP rules and thresholds",
        grandchildren: [
          { id: "create-fap", label: "Create FAP Details", refUrl: "/24online/webpages/fap/createfapdetails.jsp", desc: "Create FAP" },
          { id: "manage-fap", label: "Manage FAP Details", refUrl: "/24online/webpages/fap/managefapdetails.jsp", desc: "Manage FAP" },
        ],
      },
      {
        id: "qos", label: "QoS Policy", desc: "Cache & QoS scheduling",
        grandchildren: [
          { id: "create-cache", label: "Create Cache Policy", refUrl: "/24online/webpages/polmgt/createcachepolicy.jsp", desc: "Create cache policy" },
          { id: "manage-cache", label: "Manage Cache Policy", refUrl: "/24online/webpages/polmgt/managecachepolicy.jsp", desc: "Manage cache policies" },
        ],
      },
    ],
  },
  {
    id: "package",
    label: "Package",
    icon: Boxes,
    desc: "Plans, invoices, templates, ancillary services and tax.",
    children: [
      {
        id: "package", label: "Package", desc: "Create & manage billing plans",
        grandchildren: [
          { id: "create", label: "Create", refUrl: "/24online/webpages/grpmgt/addupdategroup.jsp", desc: "Create plan" },
          { id: "manage", label: "Manage", refUrl: "/24online/webpages/grpmgt/managegroups.jsp", desc: "Manage plans" },
        ],
      },
      {
        id: "invoice", label: "Invoice", desc: "Invoice front page, purge, reports, zone invoice",
        grandchildren: [
          { id: "custom-invoice", label: "Custom Invoice", refUrl: "/24online/webpages/grpmgt/custominvoice.jsp", desc: "Custom invoices" },
          { id: "purge-invoice", label: "Purge Invoice", refUrl: "/24online/webpages/grpmgt/purgeinvoice.jsp", desc: "Purge invoices" },
          { id: "invoice-reports", label: "Invoice Reports", refUrl: "/24online/webpages/grpmgt/invoicefrontpage.jsp?mode=reports", desc: "Invoice reports" },
          { id: "create-invoice", label: "Create Invoice", refUrl: "/24online/webpages/grpmgt/createinvoice.jsp", desc: "Create invoice" },
          { id: "configuration", label: "Configuration", refUrl: "/24online/webpages/grpmgt/invoiceconfiguration.jsp", desc: "Invoice configuration" },
          { id: "zone-invoice", label: "Zone Invoice", refUrl: "/24online/webpages/grpmgt/zoneinvoice.jsp", desc: "Zone-wise invoices" },
        ],
      },
      {
        id: "invoice-template", label: "Invoice Template", desc: "Invoice template designer",
        grandchildren: [
          { id: "create", label: "Create", refUrl: "/24online/webpages/grpmgt/createinvoicetemplate.jsp", desc: "Create template" },
          { id: "manage", label: "Manage", refUrl: "/24online/webpages/grpmgt/manageinvoicetemplate.jsp", desc: "Manage templates" },
        ],
      },
      {
        id: "ancillary", label: "Ancillary Service", desc: "Add-on services",
        grandchildren: [
          { id: "add-service", label: "Add Service", refUrl: "/24online/webpages/grpmgt/createancillaryservice.jsp", desc: "Add ancillary service" },
          { id: "manage-service", label: "Manage Service", refUrl: "/24online/webpages/grpmgt/manageancillaryservice.jsp", desc: "Manage ancillary services" },
          { id: "default-service", label: "Default Service", refUrl: "/24online/webpages/grpmgt/configureancservice.jsp", desc: "Default ancillary services" },
        ],
      },
      {
        id: "tax", label: "Tax Information", desc: "Tax configuration",
        grandchildren: [
          { id: "add", label: "Add", refUrl: "/24online/webpages/grpmgt/createtaxinfo.jsp", desc: "Add tax" },
          { id: "manage", label: "Manage", refUrl: "/24online/webpages/grpmgt/managetaxinfo.jsp", desc: "Manage taxes" },
          { id: "default-tax", label: "Default Tax", refUrl: "/24online/webpages/grpmgt/configuretaxinfo.jsp", desc: "Default tax config" },
        ],
      },
    ],
  },
  {
    id: "payment-gateway",
    label: "Payment Gateway",
    icon: CreditCard,
    desc: "Configure online payment gateways and merchants.",
    children: [
      { id: "configure", label: "Configure", desc: "Gateway configuration", refUrl: "/24online/webpages/paymentgateway/configure.jsp" },
      {
        id: "merchant", label: "Merchant", desc: "Merchant accounts",
        grandchildren: [
          { id: "create", label: "Create", refUrl: "/24online/webpages/paymentgateway/createmerchant.jsp", desc: "Create merchant" },
          { id: "manage", label: "Manage", refUrl: "/24online/webpages/paymentgateway/managemerchant.jsp", desc: "Manage merchants" },
        ],
      },
      { id: "search-transactions", label: "Search Transactions", desc: "Search gateway transactions", refUrl: "/24online/webpages/paymentgateway/searchtransactions.jsp" },
    ],
  },
  {
    id: "user",
    label: "User",
    icon: Users,
    desc: "Subscribers, live sessions, zones, pools, customers.",
    children: [
      {
        id: "manage-users", label: "Manage Users", desc: "Add, search, advance search, leased line users",
        grandchildren: [
          { id: "add-user", label: "Add User", refUrl: "/24online/webpages/usermgt/registration.jsp", desc: "Register new user" },
          { id: "search-user", label: "Search User", refUrl: "/24online/webpages/usermgt/searchuser.jsp", desc: "Search users" },
          { id: "advance-search", label: "Advance Search User", refUrl: "/24online/webpages/usermgt/advancesearchuser.jsp", desc: "Advanced user search" },
          { id: "leased-line-users", label: "Leased Line Users", refUrl: "/24online/webpages/usermgt/reloginleasedlineusers.jsp", desc: "Leased line users" },
        ],
      },
      {
        id: "live-users", label: "Live Users", desc: "Active sessions and bandwidth",
        grandchildren: [
          { id: "manage-live-users", label: "Manage Live Users", refUrl: "/24online/webpages/usermgt/liveusers.jsp", desc: "Manage live sessions" },
          { id: "search-live-users", label: "Search Live Users", refUrl: "/24online/webpages/usermgt/searchliveusers.jsp", desc: "Search live sessions" },
        ],
      },
      {
        id: "zone", label: "Zone Management", desc: "Network zones",
        grandchildren: [
          { id: "create-zone", label: "Create Zone", refUrl: "/24online/webpages/usermgt/createzone.jsp", desc: "Create zone" },
          { id: "manage-zone", label: "Manage Zone", refUrl: "/24online/webpages/usermgt/managezone.jsp", desc: "Manage zones" },
          { id: "search-zone-admin", label: "Search Zone Admin", refUrl: "/24online/webpages/usermgt/searchzone.jsp", desc: "Search zone admins" },
        ],
      },
      {
        id: "pool", label: "Pool Management", desc: "IP pools",
        grandchildren: [
          { id: "create-pool", label: "Create Pool", refUrl: "/24online/webpages/usermgt/createpool.jsp", desc: "Create IP pool" },
          { id: "manage-pool", label: "Manage Pool", refUrl: "/24online/webpages/usermgt/managepool.jsp", desc: "Manage IP pools" },
          { id: "search-node", label: "Search Node", refUrl: "/24online/webpages/usermgt/searchnode.jsp", desc: "Search nodes" },
          { id: "search-network", label: "Search Network", refUrl: "/24online/webpages/usermgt/searchnetwork.jsp", desc: "Search networks" },
        ],
      },
      {
        id: "customers", label: "Manage Customers", desc: "Customer accounts",
        grandchildren: [
          { id: "edit-customers", label: "Edit Customers", refUrl: "/24online/webpages/usermgt/editcustomer.jsp", desc: "Edit customers" },
          { id: "purge-customers", label: "Purge Customers", refUrl: "/24online/webpages/usermgt/purgecustomer.jsp", desc: "Purge customers" },
        ],
      },
      { id: "dynamize", label: "Dynamize Fields", desc: "Dynamic user fields", refUrl: "/24online/webpages/usermgt/dynamizefields.jsp" },
      { id: "demographic", label: "Demographic Fields", desc: "Demographic field config", refUrl: "/24online/webpages/usermgt/demographicfields.jsp" },
    ],
  },
  {
    id: "ticket",
    label: "Ticket Management",
    icon: Ticket,
    desc: "Support ticket search and creation.",
    children: [
      { id: "search-ticket", label: "Search Ticket", desc: "Find and manage tickets", refUrl: "/24online/webpages/ticketmgt/searchticket.jsp" },
      { id: "create-ticket", label: "Create Ticket", desc: "Open a new support ticket", refUrl: "/24online/webpages/ticketmgt/createticket.jsp" },
    ],
  },
  {
    id: "sales",
    label: "Sales Management",
    icon: ShoppingCart,
    desc: "Leads and service requests.",
    children: [
      {
        id: "lead", label: "Lead Management", desc: "Sales leads pipeline",
        grandchildren: [
          { id: "create", label: "Create", refUrl: "/24online/webpages/salesmgt/createlead.jsp", desc: "Create lead" },
          { id: "manage", label: "Manage", refUrl: "/24online/webpages/salesmgt/managelead.jsp", desc: "Manage leads" },
        ],
      },
      {
        id: "service-request", label: "Service Request", desc: "Customer service requests",
        grandchildren: [
          { id: "manage", label: "Manage", refUrl: "/24online/webpages/salesmgt/manageservicerequest.jsp", desc: "Manage service requests" },
        ],
      },
    ],
  },
  {
    id: "inventory",
    label: "Inventory",
    icon: PackageSearch,
    desc: "Stock transactions and master items.",
    children: [
      {
        id: "transaction", label: "Transaction", desc: "Indent, PO, receipt, issue, transfers, returns",
        grandchildren: [
          { id: "indent", label: "Indent", refUrl: "/24online/webpages/inventorymgt/indent.jsp", desc: "Indents" },
          { id: "purchase-order", label: "Purchase Order", refUrl: "/24online/webpages/inventorymgt/purchaseorder.jsp", desc: "Purchase orders" },
          { id: "receipt", label: "Receipt", refUrl: "/24online/webpages/inventorymgt/receipt.jsp", desc: "Goods receipt" },
          { id: "issue", label: "Issue", refUrl: "/24online/webpages/inventorymgt/issue.jsp", desc: "Stock issue" },
          { id: "stock-transfer", label: "Stock Transfer", refUrl: "/24online/webpages/inventorymgt/stocktransfer.jsp", desc: "Stock transfers" },
          { id: "customer-return", label: "Customer Return", refUrl: "/24online/webpages/inventorymgt/customerreturn.jsp", desc: "Customer returns" },
          { id: "supplier-return", label: "Supplier Return", refUrl: "/24online/webpages/inventorymgt/supplierreturn.jsp", desc: "Supplier returns" },
        ],
      },
      {
        id: "master", label: "Master", desc: "Item, warehouse, vendor, UOM, stock view",
        grandchildren: [
          { id: "item-master", label: "Item Master", refUrl: "/24online/webpages/inventorymgt/itemmaster.jsp", desc: "Item master" },
          { id: "ware-house", label: "Ware House", refUrl: "/24online/webpages/inventorymgt/warehouse.jsp", desc: "Warehouses" },
          { id: "vendor", label: "Vendor", refUrl: "/24online/webpages/inventorymgt/vendor.jsp", desc: "Vendors" },
          { id: "uom", label: "Unit of Measure", refUrl: "/24online/webpages/inventorymgt/uom.jsp", desc: "Units of measure" },
          { id: "view-stock", label: "View Stock", refUrl: "/24online/webpages/inventorymgt/viewstock.jsp", desc: "View stock" },
          { id: "emi-master", label: "EMI Master", refUrl: "/24online/webpages/inventorymgt/emimaster.jsp", desc: "EMI master" },
        ],
      },
    ],
  },
  {
    id: "alert",
    label: "Alert",
    icon: BellRing,
    desc: "SMS gateway, email and alert configuration.",
    children: [
      {
        id: "sms-gateway", label: "SMS Gateway", desc: "SMS logs and bulk SMS",
        grandchildren: [
          { id: "manage", label: "Manage", refUrl: "/24online/webpages/smsgateway/managesmsgateway.jsp", desc: "Manage SMS gateway" },
          { id: "configure-details", label: "Configure Details", refUrl: "/24online/webpages/smsgateway/configuredetails.jsp", desc: "Configure SMS gateway" },
          { id: "bulk-sms", label: "Bulk SMS", refUrl: "/24online/webpages/smsgateway/searchcriteriaforbulksms.jsp", desc: "Bulk SMS" },
          { id: "sms-log-report", label: "SMS Log Report", refUrl: "/24online/webpages/smsgateway/smslogreport.jsp", desc: "SMS log report" },
          { id: "purge-sms-logs", label: "Purge SMS Logs", refUrl: "/24online/webpages/smsgateway/purgesmslogs.jsp", desc: "Purge SMS logs" },
        ],
      },
      {
        id: "email", label: "Email Management", desc: "SMTP configuration and templates",
        grandchildren: [
          { id: "create-template", label: "Create Template", refUrl: "/24online/webpages/alert/createemailtemplate.jsp", desc: "Create email template" },
          { id: "manage-template", label: "Manage Template", refUrl: "/24online/webpages/alert/manageemailtemplate.jsp", desc: "Manage email templates" },
          { id: "configure", label: "Configure", refUrl: "/24online/webpages/alert/configureemail.jsp", desc: "Configure email" },
          { id: "proactive-reports", label: "Proactive Reports", refUrl: "/24online/webpages/alert/proactivereports.jsp", desc: "Proactive reports" },
          { id: "smtp-configuration", label: "SMTP Configuration", refUrl: "/24online/webpages/alert/smtpconfiguration.jsp", desc: "SMTP configuration" },
          { id: "system-alerts", label: "System Alerts", refUrl: "/24online/webpages/alert/systemalerts.jsp", desc: "System alerts" },
        ],
      },
      { id: "alert-config", label: "Alert Configuration", desc: "Alert rules and triggers", refUrl: "/24online/webpages/alert/alertconfiguration.jsp" },
    ],
  },
  {
    id: "ott",
    label: "OTT Service",
    icon: Tv,
    desc: "OTT platforms, utilities and partner keys.",
    children: [
      { id: "platforms", label: "Platforms", desc: "OTT platforms", refUrl: "/24online/webpages/usermgt/ottplatform.jsp" },
      { id: "platform-utility", label: "Platform Utility", desc: "Utility mappings" },
      { id: "platform-utility-relation", label: "Platform Utility Relation", desc: "Relations" },
      { id: "partner-key", label: "Add Partner Key", desc: "Partner API keys" },
      { id: "bind-ott", label: "Bind OTT Name", desc: "Bind OTT names", refUrl: "/24online/webpages/usermgt/ottplayboxtv.jsp" },
    ],
  },
  {
    id: "payment-tracking",
    label: "Payment Tracking",
    icon: Wallet,
    desc: "Manual payment tracking and reconciliation.",
    children: [
      {
        id: "manage-accounts", label: "Manage Accounts", desc: "Customer & zone accounts",
        grandchildren: [
          { id: "customers", label: "Customers", refUrl: "/24online/webpages/paymenttracking/managecustomeraccounts.jsp", desc: "Customer accounts" },
          { id: "zone", label: "Zone", refUrl: "/24online/webpages/paymenttracking/managezoneaccounts.jsp", desc: "Zone accounts" },
        ],
      },
      {
        id: "search-accounts", label: "Search Accounts", desc: "Search customer & franchise accounts",
        grandchildren: [
          { id: "customer", label: "Customer", refUrl: "/24online/webpages/paymenttracking/searchcustomeraccounts.jsp", desc: "Search customer accounts" },
          { id: "zone", label: "Zone", refUrl: "/24online/webpages/paymenttracking/searchfranchiseaccounts.jsp", desc: "Search zone accounts" },
        ],
      },
      {
        id: "payment-details", label: "Payment Details", desc: "Payment history & modes",
        grandchildren: [
          { id: "search-details", label: "Search Details", refUrl: "/24online/webpages/paymenttracking/searchcustomerpaymentdetails.jsp", desc: "Search payment details" },
          { id: "payment-mode", label: "Payment Mode", refUrl: "/24online/webpages/paymenttracking/paymentmode.jsp", desc: "Payment modes" },
        ],
      },
      {
        id: "reverse", label: "Reverse Transactions", desc: "Reverse payments",
        grandchildren: [
          { id: "customer", label: "Customer", refUrl: "/24online/webpages/paymenttracking/searchcustomerpaymentdetails.jsp?reversetransaction=Y", desc: "Reverse customer txn" },
          { id: "zone", label: "Zone", refUrl: "/24online/webpages/paymenttracking/searchfranchiseaccounts.jsp?reversetransaction=Y", desc: "Reverse zone txn" },
        ],
      },
      {
        id: "settle", label: "Settle Transactions", desc: "Settle transactions",
        grandchildren: [
          { id: "customers", label: "Customers", refUrl: "/24online/webpages/paymenttracking/searchcustomerpaymentdetails.jsp?searchmode=Y", desc: "Settle customer txn" },
        ],
      },
    ],
  },
  {
    id: "web-surfing",
    label: "Web Surfing Logger",
    icon: Globe,
    desc: "Web surfing log management.",
    children: [
      { id: "manage-logger", label: "Manage Logger", desc: "Configure web surfing logger", refUrl: "/24online/webpages/websurfinglogger/managewebsurflogger.jsp" },
    ],
  },
  {
    id: "net-kapture",
    label: "Net Kapture",
    icon: Radar,
    desc: "Network packet capture service.",
    children: [
      { id: "manage-service", label: "Manage Service", desc: "Configure net kapture", refUrl: "/24online/webpages/netkapture/managenetkapture.jsp" },
    ],
  },
  {
    id: "reports",
    label: "Reports",
    icon: BarChart3,
    desc: "Reports launcher and FTP report configuration.",
    children: [
      { id: "reports", label: "Reports", desc: "Report launcher", refUrl: "/24online/webpages/reports/intermediate.jsp" },
      { id: "ftp-report", label: "FTP Report Configuration", desc: "Scheduled FTP reports", refUrl: "/24online/webpages/sysmgt/manageproactivereports.jsp" },
    ],
  },
  {
    id: "help",
    label: "Help",
    icon: HelpCircle,
    desc: "Company info, docs, modules and about.",
    children: [
      { id: "company-info", label: "Company Info", desc: "Company details", refUrl: "/24online/webpages/help/companyinfo.jsp" },
      { id: "client", label: "Cryptsk Client", desc: "Client app info", refUrl: "/24online/webpages/help/24onlineclient.jsp" },
      { id: "upgrade", label: "Upgrade Version", desc: "Version upgrades", refUrl: "/24online/webpages/help/upgrade.jsp" },
      {
        id: "register", label: "Register Cryptsk", desc: "Product registration & module license",
        grandchildren: [
          { id: "online-registration", label: "Online Registration", refUrl: "/24online/webpages/help/onlineregistration.jsp", desc: "Online registration" },
          { id: "module-license", label: "Module License", refUrl: "/24online/webpages/help/modulelicense.jsp", desc: "Module licenses" },
        ],
      },
      { id: "customization", label: "Manage Customization", desc: "Module licenses", refUrl: "/24online/webpages/help/managecustomization.jsp" },
      { id: "documentation", label: "Documentation", desc: "User documentation", refUrl: "/24online/webpages/help/dochelp.jsp" },
      { id: "about", label: "About", desc: "About Cryptsk", refUrl: "/24online/webpages/help/about.jsp" },
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

export function findGrandchild(
  moduleId: string,
  childId: string,
  grandchildId: string
): NavGrandchild | undefined {
  return findChild(moduleId, childId)?.grandchildren?.find(
    (g) => g.id === grandchildId
  );
}

/** Count all leaf pages (level-2 without grandchildren + all level-3 grandchildren) */
export function countLeafPages(): number {
  let count = 0;
  for (const m of NAV_MODULES) {
    for (const c of m.children) {
      if (!c.grandchildren || c.grandchildren.length === 0) count += 1;
      else count += c.grandchildren.length;
    }
  }
  return count;
}
