import { NextRequest, NextResponse } from "next/server";

/**
 * System API — handles all System module sub-pages.
 * Source: accsium.corporate.springmvc.controllers.NetworkController,
 *         FirewallController, DhcpController, etc.
 *
 * Sub-modules: interfaces, gateways, dns, routes, firewall, dhcp, services,
 *              backup, devices, nas, captive-portal, acl, dynamic-dns
 */

// ============= TYPES =============

export interface NetworkInterface {
  id: number;
  port: string;        // A, B, C...
  deviceName: string;  // eth0, eth1...
  ipAddress: string;
  netmask: string;
  interfaceType: "Internal" | "External";
  description: string;
  ipv6Address?: string;
  status: "Up" | "Down";
}

export interface Gateway {
  id: number;
  priorityName: string;
  priorityDesc: string;
  effectiveGateway: string;
  ipVersion: "IPv4" | "IPv6";
  isDefault: boolean;
  network: string;
  status: "Active" | "Inactive";
}

export interface DnsConfig {
  id: number;
  dnsServers: string;
  domainName: string;
  isEnabled: boolean;
  nxdomainIp: string;
  nxdomainUrl: string;
  reverseIp: string;
}

export interface StaticRoute {
  id: number;
  destinationIp: string;
  netmask: string;
  gateway: string;
  interface: string;
  status: "Active" | "Inactive";
}

export interface FirewallRule {
  id: number;
  source: string;
  destination: string;
  sourcePort: string;
  destPort: string;
  protocol: "TCP" | "UDP" | "ICMP" | "ANY";
  action: "Allow" | "Deny" | "Drop";
  description: string;
  bandwidth: string;
  startDate: string;
  endDate: string;
  position: number;
  enabled: boolean;
  srcPortType: "Include" | "Exclude";
  dstPortType: "Include" | "Exclude";
}

export interface DosSetting {
  id: number;
  attackType: string;
  protocol: string;
  threshold: string;
  status: "Enabled" | "Disabled";
}

export interface FreeSite {
  id: number;
  siteName: string;
  url: string;
  status: "Active" | "Inactive";
}

export interface DhcpScope {
  id: number;
  interface: string;
  startIp: string;
  endIp: string;
  netmask: string;
  gateway: string;
  dns: string;
  leaseTime: string;
  status: "Active" | "Inactive";
}

export interface DhcpLease {
  ip: string;
  mac: string;
  host: string;
  pool: string;
  leaseStart: string;
  leaseEnd: string;
  status: "Active" | "Expired" | "Released";
}

export interface SystemService {
  id: string;
  name: string;
  description: string;
  status: "Running" | "Stopped";
  autoStart: boolean;
}

export interface BackupRecord {
  id: number;
  type: "Full" | "Audit Log" | "RRD" | "User Session" | "Web Surfing";
  filename: string;
  size: string;
  date: string;
  status: "Completed" | "Failed" | "In Progress";
}

export interface BackupSchedule {
  id: number;
  type: string;
  frequency: "Daily" | "Weekly" | "Monthly";
  time: string;
  retention: string;
  enabled: boolean;
}

export interface NasDevice {
  id: number;
  name: string;
  ip: string;
  type: string;
  secret: string;
  status: "Online" | "Offline";
  sessions: number;
}

export interface ManagedDevice {
  id: number;
  name: string;
  ip: string;
  type: string;
  status: "Online" | "Offline" | "Warning";
  lastSeen: string;
}

export interface DeviceLog {
  id: number;
  timestamp: string;
  level: "INFO" | "WARN" | "ERROR";
  device: string;
  message: string;
}

// ============= SEED DATA =============

const g = globalThis as any;

if (!g.__sysData) {
  g.__sysData = {
    interfaces: [
      { id: 1, port: "A", deviceName: "eth0", ipAddress: "172.16.16.16", netmask: "255.255.255.0", interfaceType: "Internal", description: "LAN", status: "Up" },
      { id: 2, port: "B", deviceName: "eth1", ipAddress: "1.1.1.1", netmask: "255.255.255.0", interfaceType: "Internal", description: "DMZ", status: "Up" },
      { id: 3, port: "C", deviceName: "eth2", ipAddress: "172.31.31.2", netmask: "255.255.255.0", interfaceType: "Internal", description: "MGMT", status: "Up" },
      { id: 4, port: "D", deviceName: "eth3", ipAddress: "10.10.3.1", netmask: "255.255.255.0", interfaceType: "Internal", description: "Zone-1", status: "Up" },
      { id: 5, port: "E", deviceName: "eth4", ipAddress: "10.10.4.1", netmask: "255.255.255.0", interfaceType: "Internal", description: "Zone-2", status: "Up" },
      { id: 6, port: "M", deviceName: "eth12", ipAddress: "103.205.148.26", netmask: "255.255.255.252", interfaceType: "External", description: "WAN-1 ISP", status: "Up" },
      { id: 7, port: "N", deviceName: "eth13", ipAddress: "103.205.151.129", netmask: "255.255.255.128", interfaceType: "External", description: "WAN-2 ISP", status: "Up" },
    ] as NetworkInterface[],
    gateways: [
      { id: 1, priorityName: "WAN-1-Primary", priorityDesc: "Primary ISP route", effectiveGateway: "103.205.148.25", ipVersion: "IPv4", isDefault: true, network: "0.0.0.0/0", status: "Active" },
      { id: 2, priorityName: "WAN-2-Backup", priorityDesc: "Backup ISP route", effectiveGateway: "103.205.151.1", ipVersion: "IPv4", isDefault: false, network: "0.0.0.0/0", status: "Active" },
    ] as Gateway[],
    dns: [
      { id: 1, dnsServers: "8.8.8.8, 8.8.4.4", domainName: "cryptsk.local", isEnabled: true, nxdomainIp: "10.172.0.1", nxdomainUrl: "portal.cryptsk.com", reverseIp: "10.172.0.x" },
    ] as DnsConfig[],
    routes: [
      { id: 1, destinationIp: "10.172.0.0", netmask: "255.255.255.0", gateway: "172.16.16.1", interface: "eth0", status: "Active" },
      { id: 2, destinationIp: "10.172.1.0", netmask: "255.255.255.0", gateway: "172.16.16.1", interface: "eth0", status: "Active" },
      { id: 3, destinationIp: "10.172.2.0", netmask: "255.255.255.0", gateway: "172.31.31.1", interface: "eth2", status: "Active" },
    ] as StaticRoute[],
    firewallRules: [
      { id: 1, source: "*", destination: "*", sourcePort: "*", destPort: "*", protocol: "ANY", action: "Allow", description: "Allow all LAN to WAN", bandwidth: "", startDate: "", endDate: "", position: 1, enabled: true, srcPortType: "Include", dstPortType: "Include" },
      { id: 2, source: "LAN", destination: "WAN", sourcePort: "*", destPort: "6881-6999", protocol: "TCP", action: "Deny", description: "Block torrent", bandwidth: "", startDate: "", endDate: "", position: 2, enabled: true, srcPortType: "Include", dstPortType: "Include" },
      { id: 3, source: "*", destination: "*", sourcePort: "*", destPort: "*", protocol: "ANY", action: "Drop", description: "Drop malformed", bandwidth: "", startDate: "", endDate: "", position: 3, enabled: true, srcPortType: "Include", dstPortType: "Include" },
      { id: 4, source: "LAN", destination: "*", sourcePort: "*", destPort: "53", protocol: "UDP", action: "Allow", description: "Allow DNS", bandwidth: "", startDate: "", endDate: "", position: 4, enabled: true, srcPortType: "Include", dstPortType: "Include" },
      { id: 5, source: "LAN", destination: "127.0.0.1", sourcePort: "*", destPort: "1812", protocol: "UDP", action: "Allow", description: "Allow RADIUS", bandwidth: "", startDate: "", endDate: "", position: 5, enabled: true, srcPortType: "Include", dstPortType: "Include" },
      { id: 6, source: "LAN", destination: "WAN", sourcePort: "*", destPort: "80,443", protocol: "TCP", action: "Allow", description: "Allow HTTP/HTTPS", bandwidth: "10M", startDate: "", endDate: "", position: 6, enabled: false, srcPortType: "Include", dstPortType: "Include" },
    ] as FirewallRule[],
    dosSettings: [
      { id: 1, attackType: "SYN Flood", protocol: "TCP", threshold: "100/sec", status: "Enabled" },
      { id: 2, attackType: "ICMP Flood", protocol: "ICMP", threshold: "50/sec", status: "Enabled" },
      { id: 3, attackType: "Port Scan", protocol: "TCP/UDP", threshold: "20/sec", status: "Disabled" },
      { id: 4, attackType: "UDP Flood", protocol: "UDP", threshold: "100/sec", status: "Enabled" },
    ] as DosSetting[],
    freeSites: [
      { id: 1, siteName: "Google", url: "google.com", status: "Active" },
      { id: 2, siteName: "WhatsApp", url: "whatsapp.com", status: "Active" },
      { id: 3, siteName: "Facebook", url: "facebook.com", status: "Inactive" },
    ] as FreeSite[],
    dhcpScopes: [
      { id: 1, interface: "eth0", startIp: "10.172.0.10", endIp: "10.172.0.250", netmask: "255.255.255.0", gateway: "10.172.0.1", dns: "10.172.0.1", leaseTime: "24h", status: "Active" },
      { id: 2, interface: "eth3", startIp: "10.10.3.10", endIp: "10.10.3.250", netmask: "255.255.255.0", gateway: "10.10.3.1", dns: "10.10.3.1", leaseTime: "12h", status: "Active" },
    ] as DhcpScope[],
    dhcpLeases: [
      { ip: "10.172.0.30", mac: "C0:2B:56:07:D8:18", host: "shubham-pc", pool: "eth0", leaseStart: "04 Oct 00:12", leaseEnd: "05 Oct 00:12", status: "Active" },
      { ip: "10.172.0.201", mac: "98:9D:B2:08:60:D0", host: "aakash-router", pool: "eth0", leaseStart: "03 Oct 15:37", leaseEnd: "04 Oct 15:37", status: "Active" },
      { ip: "10.172.1.55", mac: "A8:E2:07:9D:CB:78", host: "abhimanyu-cpe", pool: "eth0", leaseStart: "03 Oct 11:22", leaseEnd: "04 Oct 11:22", status: "Active" },
      { ip: "10.10.3.36", mac: "18:A6:F7:7A:D7:1F", host: "abhishek-ont", pool: "eth3", leaseStart: "02 Oct 20:00", leaseEnd: "03 Oct 20:00", status: "Expired" },
    ] as DhcpLease[],
    services: [
      { id: "dhcp", name: "DHCP Server", description: "Dynamic Host Configuration Protocol", status: "Running", autoStart: true },
      { id: "dns", name: "DNS Server", description: "Domain Name System resolver", status: "Running", autoStart: true },
      { id: "pppoe", name: "PPPoE Server", description: "Point-to-Point Protocol over Ethernet", status: "Running", autoStart: true },
      { id: "radius", name: "RADIUS Server", description: "Authentication, Authorization, Accounting", status: "Running", autoStart: true },
      { id: "captive", name: "Captive Portal", description: "Web portal for authentication", status: "Running", autoStart: true },
      { id: "web", name: "Web Server", description: "Admin GUI + API", status: "Running", autoStart: true },
      { id: "dynDns", name: "Dynamic DNS", description: "Dynamic DNS service", status: "Stopped", autoStart: false },
      { id: "mail", name: "Mail Server", description: "SMTP for alerts", status: "Stopped", autoStart: false },
    ] as SystemService[],
    backups: [
      { id: 1, type: "Full", filename: "backup_20261004_0100.tar.gz", size: "45.2 MB", date: "04 Oct 2026 01:00", status: "Completed" },
      { id: 2, type: "Audit Log", filename: "auditlog_20261003_0200.tar.gz", size: "12.1 MB", date: "03 Oct 2026 02:00", status: "Completed" },
      { id: 3, type: "Full", filename: "backup_20261003_0100.tar.gz", size: "44.8 MB", date: "03 Oct 2026 01:00", status: "Completed" },
      { id: 4, type: "RRD", filename: "rrd_20261002_0200.tar.gz", size: "8.5 MB", date: "02 Oct 2026 02:00", status: "Completed" },
      { id: 5, type: "Full", filename: "backup_20261002_0100.tar.gz", size: "44.3 MB", date: "02 Oct 2026 01:00", status: "Failed" },
    ] as BackupRecord[],
    backupSchedules: [
      { id: 1, type: "Full Backup", frequency: "Daily", time: "01:00", retention: "7 days", enabled: true },
      { id: 2, type: "Audit Log", frequency: "Daily", time: "02:00", retention: "30 days", enabled: true },
      { id: 3, type: "RRD", frequency: "Weekly", time: "02:00", retention: "90 days", enabled: true },
    ] as BackupSchedule[],
    nasDevices: [
      { id: 1, name: "sms-core-01", ip: "172.16.16.16", type: "24online SMS", secret: "••••••••", status: "Online", sessions: 612 },
      { id: 2, name: "sms-core-02", ip: "172.16.16.17", type: "24online SMS", secret: "••••••••", status: "Online", sessions: 187 },
      { id: 3, name: "br-5000-edge", ip: "103.205.148.26", type: "BRAS", secret: "••••••••", status: "Online", sessions: 0 },
      { id: 4, name: "hotspot-gw-01", ip: "10.10.5.1", type: "Hotspot", secret: "••••••••", status: "Offline", sessions: 0 },
    ] as NasDevice[],
    managedDevices: [
      { id: 1, name: "Core-Switch-01", ip: "172.16.16.2", type: "Switch", status: "Online", lastSeen: "2 sec ago" },
      { id: 2, name: "Edge-Router-01", ip: "103.205.148.25", type: "Router", status: "Online", lastSeen: "5 sec ago" },
      { id: 3, name: "OLT-01", ip: "10.10.3.2", type: "OLT", status: "Warning", lastSeen: "1 min ago" },
      { id: 4, name: "OLT-02", ip: "10.10.4.2", type: "OLT", status: "Online", lastSeen: "3 sec ago" },
    ] as ManagedDevice[],
    deviceLogs: [
      { id: 1, timestamp: "04 Oct 01:05:22", level: "INFO", device: "sms-core-01", message: "User authenticated: aakash080198" },
      { id: 2, timestamp: "04 Oct 01:04:58", level: "WARN", device: "OLT-01", message: "Optical power low on port 3" },
      { id: 3, timestamp: "04 Oct 01:03:15", level: "ERROR", device: "hotspot-gw-01", message: "Connection timeout — device offline" },
      { id: 4, timestamp: "04 Oct 01:02:00", level: "INFO", device: "Core-Switch-01", message: "Port eth1 link up" },
      { id: 5, timestamp: "04 Oct 01:01:30", level: "WARN", device: "sms-core-02", message: "High CPU usage: 85%" },
      { id: 6, timestamp: "04 Oct 01:00:00", level: "INFO", device: "Edge-Router-01", message: "BGP session established with ISP-1" },
    ] as DeviceLog[],
    nextIds: {} as Record<string, number>,
  };
  // Initialize next IDs
  for (const key of Object.keys(g.__sysData)) {
    if (Array.isArray(g.__sysData[key]) && g.__sysData[key].length > 0 && g.__sysData[key][0]?.id != null) {
      g.__sysData.nextIds[key] = Math.max(...g.__sysData[key].map((x: any) => x.id)) + 1;
    }
  }
}
const D = g.__sysData;

// ============= ROUTE HANDLER =============

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sub = searchParams.get("sub") ?? "interfaces";
  const search = searchParams.get("search")?.toLowerCase() ?? "";

  let data: any[] = D[sub] ?? [];
  if (search && Array.isArray(data)) {
    data = data.filter((item: any) =>
      JSON.stringify(item).toLowerCase().includes(search)
    );
  }

  return NextResponse.json({
    responseCode: "0",
    responseMsg: "Success",
    sub,
    data,
    total: data.length,
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { sub, action } = body;

  if (!sub || !D[sub]) {
    return NextResponse.json(
      { responseCode: "100", responseMsg: `Unknown sub-module: ${sub}` },
      { status: 400 }
    );
  }

  const arr = D[sub] as any[];
  const nextId = (D.nextIds[sub] ?? 1);

  if (action === "create") {
    const newItem = { ...body, id: nextId };
    delete newItem.action;
    delete newItem.sub;
    arr.push(newItem);
    D.nextIds[sub] = nextId + 1;
    return NextResponse.json({
      responseCode: "0",
      responseMsg: "Created successfully",
      data: newItem,
    });
  }

  if (action === "update") {
    const idx = arr.findIndex((x: any) => x.id === body.id);
    if (idx === -1)
      return NextResponse.json({ responseCode: "102", responseMsg: "Not found" }, { status: 404 });
    const updated = { ...arr[idx], ...body };
    delete updated.action;
    delete updated.sub;
    arr[idx] = updated;
    return NextResponse.json({ responseCode: "0", responseMsg: "Updated successfully", data: updated });
  }

  if (action === "delete") {
    const idx = arr.findIndex((x: any) => x.id === body.id);
    if (idx === -1)
      return NextResponse.json({ responseCode: "102", responseMsg: "Not found" }, { status: 404 });
    arr.splice(idx, 1);
    return NextResponse.json({ responseCode: "0", responseMsg: "Deleted successfully" });
  }

  if (action === "toggle") {
    // For firewall rules: toggle enabled
    // For services: toggle status/autostart
    const idx = arr.findIndex((x: any) => x.id === body.id);
    if (idx === -1)
      return NextResponse.json({ responseCode: "102", responseMsg: "Not found" }, { status: 404 });
    if (body.field === "enabled") arr[idx].enabled = !arr[idx].enabled;
    if (body.field === "status") arr[idx].status = arr[idx].status === "Running" ? "Stopped" : arr[idx].status === "Stopped" ? "Running" : arr[idx].status === "Active" ? "Inactive" : arr[idx].status === "Inactive" ? "Active" : arr[idx].status;
    if (body.field === "autoStart") arr[idx].autoStart = !arr[idx].autoStart;
    return NextResponse.json({ responseCode: "0", responseMsg: "Toggled successfully", data: arr[idx] });
  }

  if (action === "serviceControl") {
    // Start/stop/restart services
    const idx = arr.findIndex((x: any) => x.id === body.id);
    if (idx === -1)
      return NextResponse.json({ responseCode: "102", responseMsg: "Service not found" }, { status: 404 });
    if (body.command === "start") arr[idx].status = "Running";
    if (body.command === "stop") arr[idx].status = "Stopped";
    if (body.command === "restart") arr[idx].status = "Running";
    return NextResponse.json({ responseCode: "0", responseMsg: `Service ${body.command}: ${arr[idx].name}`, data: arr[idx] });
  }

  return NextResponse.json(
    { responseCode: "999", responseMsg: "Unknown action" },
    { status: 400 }
  );
}
