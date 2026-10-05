import { NextRequest, NextResponse } from "next/server";

/**
 * Policy API — handles all Policy module sub-pages.
 * Source: accsium PolicyManager, BandwidthPolicyManager, DataTransferPolicyManager,
 *         FAPDetailsManager, ScheduleManager servlets.
 *
 * Sub-modules: surfingPolicies, accessPolicies, bandwidthPolicies, schedules,
 *              dataTransferPolicies, fapDetails
 */

const g = globalThis as any;

if (!g.__polData) {
  g.__polData = {
    surfingPolicies: [
      { id: 1, policyName: "Unlimited Surfing", policyType: "Unlimited", timeAllowed: "Unlimited", expirationDuration: "30", sessionPulse: "0", description: "Unlimited surfing policy", status: "Active" },
      { id: 2, policyName: "1 Hour Daily", policyType: "Time-based", timeAllowed: "01:00", expirationDuration: "1", sessionPulse: "30", description: "1 hour per day", status: "Active" },
      { id: 3, policyName: "4 Hours Monthly", policyType: "Time-based", timeAllowed: "04:00", expirationDuration: "30", sessionPulse: "15", description: "4 hours per month", status: "Active" },
    ],
    accessPolicies: [
      { id: 1, policyName: "Allow All", defaultStrategy: "Allow", description: "Allow access at all times", status: "Active" },
      { id: 2, policyName: "Business Hours", defaultStrategy: "Allow", description: "Allow 9am-6pm only", status: "Active" },
      { id: 3, policyName: "Night Block", defaultStrategy: "Deny", description: "Deny 10pm-6am", status: "Active" },
    ],
    bandwidthPolicies: [
      { id: 1, policyName: "Default PoolBase Policy", policyBasedOn: "Pool", totalBandwidth: "512/10240", uploadBandwidth: "256/5120", downloadBandwidth: "256/5120", priority: 3, scheduleType: "Always", status: "Active" },
      { id: 2, policyName: "User based Strict Individual Policy", policyBasedOn: "User", totalBandwidth: "1024/20480", uploadBandwidth: "512/10240", downloadBandwidth: "512/10240", priority: 5, scheduleType: "Always", status: "Active" },
      { id: 3, policyName: "512KBPS", policyBasedOn: "User", totalBandwidth: "256/512", uploadBandwidth: "128/256", downloadBandwidth: "128/256", priority: 1, scheduleType: "Always", status: "Active" },
      { id: 4, policyName: "20MBPS", policyBasedOn: "User", totalBandwidth: "10240/20480", uploadBandwidth: "5120/10240", downloadBandwidth: "5120/10240", priority: 2, scheduleType: "Always", status: "Active" },
      { id: 5, policyName: "15MBPS", policyBasedOn: "User", totalBandwidth: "7680/15360", uploadBandwidth: "3840/7680", downloadBandwidth: "3840/7680", priority: 4, scheduleType: "Always", status: "Active" },
      { id: 6, policyName: "10MBPS Night Boost", policyBasedOn: "User", totalBandwidth: "5120/10240", uploadBandwidth: "2560/5120", downloadBandwidth: "2560/5120", priority: 6, scheduleType: "All Days 21:00 PM to 9:00 AM", status: "Active" },
    ],
    schedules: [
      { id: 1, scheduleName: "All Days 9:00 AM to 21:00 PM", description: "Business hours — all days" },
      { id: 2, scheduleName: "All Days 21:00 PM to 9:00 AM", description: "Night hours — all days" },
      { id: 3, scheduleName: "Weekend Only", description: "Saturday-Sunday only" },
    ],
    dataTransferPolicies: [
      { id: 1, policyName: "Total 100 MB prepaid policy", scheme: "Absolute", uploadLimit: "100 MB", downloadLimit: "100 MB", totalLimit: "100 MB", description: "100MB total data transfer", status: "Active" },
      { id: 2, policyName: "Unlimited DT Policy", scheme: "Ratebased", uploadLimit: "Unlimited", downloadLimit: "Unlimited", totalLimit: "Unlimited", description: "No data transfer limit", status: "Active" },
      { id: 3, policyName: "50GB Monthly", scheme: "Absolute", uploadLimit: "25 GB", downloadLimit: "25 GB", totalLimit: "50 GB", description: "50GB per month", status: "Active" },
      { id: 4, policyName: "10GB Daily", scheme: "Absolute", uploadLimit: "5 GB", downloadLimit: "5 GB", totalLimit: "10 GB", description: "10GB per day", status: "Active" },
    ],
    fapDetails: [
      { id: 1, fapName: "Default FAP", resetType: "Monthly", resetCycleMultiplier: "1", dataTransferType: "Total", dataTransferLimit: "100 GB", switchoverBwPolicy: "512KBPS", resetTime: "00:00:00", status: "Active" },
      { id: 2, fapName: "50GB FAP", resetType: "Monthly", resetCycleMultiplier: "1", dataTransferType: "Total", dataTransferLimit: "50 GB", switchoverBwPolicy: "256KBPS", resetTime: "00:00:00", status: "Active" },
      { id: 3, fapName: "Daily 5GB FAP", resetType: "Daily", resetCycleMultiplier: "1", dataTransferType: "Total", dataTransferLimit: "5 GB", switchoverBwPolicy: "128KBPS", resetTime: "00:00:00", status: "Active" },
    ],
    nextIds: {} as Record<string, number>,
  };
  for (const key of Object.keys(g.__polData)) {
    if (Array.isArray(g.__polData[key]) && g.__polData[key].length > 0 && g.__polData[key][0]?.id != null) {
      g.__polData.nextIds[key] = Math.max(...g.__polData[key].map((x: any) => x.id)) + 1;
    }
  }
}
const D = g.__polData;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sub = searchParams.get("sub") ?? "surfingPolicies";
  const search = searchParams.get("search")?.toLowerCase() ?? "";
  let data: any[] = D[sub] ?? [];
  if (search) data = data.filter((item) => JSON.stringify(item).toLowerCase().includes(search));
  return NextResponse.json({ responseCode: "0", responseMsg: "Success", sub, data, total: data.length });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { sub, action } = body;
  if (!sub || !D[sub]) return NextResponse.json({ responseCode: "100", responseMsg: `Unknown: ${sub}` }, { status: 400 });
  const arr = D[sub] as any[];
  const nextId = D.nextIds[sub] ?? 1;
  if (action === "create") {
    const newItem = { ...body, id: nextId };
    delete newItem.action; delete newItem.sub;
    arr.push(newItem);
    D.nextIds[sub] = nextId + 1;
    return NextResponse.json({ responseCode: "0", responseMsg: "Created", data: newItem });
  }
  if (action === "delete") {
    const idx = arr.findIndex((x: any) => x.id === body.id);
    if (idx === -1) return NextResponse.json({ responseCode: "102", responseMsg: "Not found" }, { status: 404 });
    arr.splice(idx, 1);
    return NextResponse.json({ responseCode: "0", responseMsg: "Deleted" });
  }
  if (action === "update") {
    const idx = arr.findIndex((x: any) => x.id === body.id);
    if (idx === -1) return NextResponse.json({ responseCode: "102", responseMsg: "Not found" }, { status: 404 });
    const updated = { ...arr[idx], ...body };
    delete updated.action; delete updated.sub;
    arr[idx] = updated;
    return NextResponse.json({ responseCode: "0", responseMsg: "Updated", data: updated });
  }
  return NextResponse.json({ responseCode: "999", responseMsg: "Unknown action" }, { status: 400 });
}
