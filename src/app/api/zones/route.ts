import { NextRequest, NextResponse } from "next/server";

/**
 * Zones API — mirrors the accsium ZoneService REST endpoints.
 * Source: com/cryptsk/restfulws/service/ZoneService.java
 *   createZone, updateZone, deleteZone, getZoneDetailList
 *
 * Business logic: com/cryptsk/restfulws/helper/ZoneRestHelper.java
 * Entity: accsium/corporate/user/entity/Tblzone.java
 *
 * Fields (from ZoneRestHelper.createZone):
 *   zonename (required), description, maxconcurrentusers, pindiscount,
 *   packagediscount, discounton, popname, mincreditbalance, taxondiscount
 */

export interface Zone {
  zoneid: number;
  zonename: string;
  description: string;
  maxconcurrentusers: number;
  pindiscount: number;
  packagediscount: number;
  discounton: "TOTAL" | "PACKAGE" | "PIN";
  popid: number;
  popname: string;
  billingname: string;
  mincreditbalance: number;
  taxondiscount: "Y" | "N";
  bandwidth: string;
  users: number;
  status: "Y" | "N";
}

const SEED_ZONES: Zone[] = [
  { zoneid: 1, zonename: "Bhiwani-Core", description: "Central Bhiwani POP", maxconcurrentusers: 1500, pindiscount: 0, packagediscount: 0, discounton: "TOTAL", popid: 1, popname: "Bhiwani-POP1", billingname: "Bhiwani Core", mincreditbalance: 0, taxondiscount: "N", bandwidth: "2 Gbps", users: 1240, status: "Y" },
  { zoneid: 2, zonename: "Bhiwani-North", description: "Northern sector", maxconcurrentusers: 800, pindiscount: 5, packagediscount: 0, discounton: "PIN", popid: 1, popname: "Bhiwani-POP1", billingname: "Bhiwani North", mincreditbalance: 100, taxondiscount: "N", bandwidth: "1 Gbps", users: 580, status: "Y" },
  { zoneid: 3, zonename: "Bhiwani-South", description: "Southern sector", maxconcurrentusers: 800, pindiscount: 0, packagediscount: 10, discounton: "PACKAGE", popid: 2, popname: "Bhiwani-POP2", billingname: "Bhiwani South", mincreditbalance: 0, taxondiscount: "Y", bandwidth: "1 Gbps", users: 720, status: "Y" },
  { zoneid: 4, zonename: "Bhiwani-East", description: "Eastern sector", maxconcurrentusers: 500, pindiscount: 0, packagediscount: 0, discounton: "TOTAL", popid: 2, popname: "Bhiwani-POP2", billingname: "Bhiwani East", mincreditbalance: 0, taxondiscount: "N", bandwidth: "500 Mbps", users: 410, status: "Y" },
  { zoneid: 5, zonename: "Bhiwani-West", description: "Western sector", maxconcurrentusers: 500, pindiscount: 0, packagediscount: 0, discounton: "TOTAL", popid: 3, popname: "Bhiwani-POP3", billingname: "Bhiwani West", mincreditbalance: 50, taxondiscount: "N", bandwidth: "500 Mbps", users: 350, status: "Y" },
  { zoneid: 6, zonename: "Rohtak-Edge", description: "Rohtak edge node", maxconcurrentusers: 300, pindiscount: 0, packagediscount: 0, discounton: "TOTAL", popid: 4, popname: "Rohtak-POP1", billingname: "Rohtak Edge", mincreditbalance: 0, taxondiscount: "N", bandwidth: "300 Mbps", users: 188, status: "N" },
];

const globalForZones = globalThis as unknown as { __zones?: Zone[] };
if (!globalForZones.__zones) {
  globalForZones.__zones = [...SEED_ZONES];
}
const STORE = globalForZones.__zones!;
let nextId = Math.max(...STORE.map((z) => z.zoneid)) + 1;

interface ValidationResult {
  ok: boolean;
  errors: Record<string, string>;
}

function validateZone(data: Partial<Zone>, isCreate: boolean): ValidationResult {
  const errors: Record<string, string> = {};
  if (isCreate && !data.zonename?.trim()) {
    errors.zonename = "Zone name is required";
  }
  if (data.discounton && !["TOTAL", "PACKAGE", "PIN"].includes(data.discounton)) {
    errors.discounton = "Discount on must be TOTAL, PACKAGE, or PIN";
  }
  if (data.maxconcurrentusers != null && data.maxconcurrentusers < 0) {
    errors.maxconcurrentusers = "Max concurrent users must be >= 0";
  }
  return { ok: Object.keys(errors).length === 0, errors };
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search")?.toLowerCase() ?? "";
  const status = searchParams.get("status");

  let results = [...STORE];
  if (search) {
    results = results.filter(
      (z) =>
        z.zonename.toLowerCase().includes(search) ||
        z.description.toLowerCase().includes(search) ||
        z.billingname.toLowerCase().includes(search)
    );
  }
  if (status) {
    results = results.filter((z) => z.status === status);
  }

  return NextResponse.json({
    responseCode: "0",
    responseMsg: "Success",
    data: results,
    total: results.length,
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const action = body.action ?? "create";

  if (action === "create") {
    const validation = validateZone(body, true);
    if (!validation.ok) {
      return NextResponse.json(
        { responseCode: "100", responseMsg: "Validation failed", errors: validation.errors },
        { status: 400 }
      );
    }
    if (STORE.some((z) => z.zonename.toLowerCase() === body.zonename.toLowerCase())) {
      return NextResponse.json(
        { responseCode: "101", responseMsg: "Zone name already exists", errors: { zonename: "A zone with this name already exists" } },
        { status: 409 }
      );
    }
    const newZone: Zone = {
      zoneid: nextId++,
      zonename: body.zonename.trim(),
      description: body.description ?? "",
      maxconcurrentusers: Number(body.maxconcurrentusers) || 0,
      pindiscount: Number(body.pindiscount) || 0,
      packagediscount: Number(body.packagediscount) || 0,
      discounton: body.discounton ?? "TOTAL",
      popid: Number(body.popid) || 0,
      popname: body.popname ?? "",
      billingname: body.billingname ?? body.zonename,
      mincreditbalance: Number(body.mincreditbalance) || 0,
      taxondiscount: body.taxondiscount ?? "N",
      bandwidth: body.bandwidth ?? "100 Mbps",
      users: 0,
      status: body.status ?? "Y",
    };
    STORE.push(newZone);
    return NextResponse.json({ responseCode: "0", responseMsg: "Zone created successfully", data: newZone });
  }

  if (action === "update") {
    const zoneid = Number(body.zoneid);
    const idx = STORE.findIndex((z) => z.zoneid === zoneid);
    if (idx === -1) {
      return NextResponse.json({ responseCode: "102", responseMsg: "Zone not found" }, { status: 404 });
    }
    const validation = validateZone(body, false);
    if (!validation.ok) {
      return NextResponse.json({ responseCode: "100", responseMsg: "Validation failed", errors: validation.errors }, { status: 400 });
    }
    STORE[idx] = { ...STORE[idx], ...body, zoneid };
    return NextResponse.json({ responseCode: "0", responseMsg: "Zone updated successfully", data: STORE[idx] });
  }

  if (action === "delete") {
    const zoneid = Number(body.zoneid);
    const idx = STORE.findIndex((z) => z.zoneid === zoneid);
    if (idx === -1) {
      return NextResponse.json({ responseCode: "102", responseMsg: "Zone not found" }, { status: 404 });
    }
    STORE.splice(idx, 1);
    return NextResponse.json({ responseCode: "0", responseMsg: "Zone deleted successfully" });
  }

  return NextResponse.json({ responseCode: "999", responseMsg: "Unknown action" }, { status: 400 });
}
