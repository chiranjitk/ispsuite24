import { NextRequest, NextResponse } from "next/server";

/**
 * Packages API — mirrors the accsium PackageService REST endpoints.
 * Source: com/cryptsk/restfulws/service/PackageService.java
 *   POST /PackageService/createPackage
 *   POST /PackageService/getPackageList
 *   POST /PackageService/updatePackage
 *   POST /PackageService/deletePackage
 *
 * Business logic: com/cryptsk/restfulws/helper/PackageHelper.java
 * Entity: accsium/corporate/policy/entity/Tblgroup.java
 *
 * Until PostgreSQL is wired, this uses an in-memory store seeded from
 * the real dump data (tblgroup rows). When PG is ready, swap the store
 * for Prisma queries.
 */

// --- Types matching the Java PackageObject / Tblgroup entity ---

export interface Package {
  groupid: number;
  groupname: string;
  price: number;
  billingScheme: "PREPAID" | "POSTPAID";
  connectionType: "User" | "Leased Line";
  cycleType: "Weekly" | "Monthly";
  cyclemultiplier: number;
  billingDate_Day: number;
  billDuration: number;
  billCycleAmtBasedOn: number;
  countAmtBasedOn: number;
  bodAccountableValue: number;
  idleTimeout: number;
  idleTimeoutType: "NO_IDLE_TIMEOUT" | "LIVE_REQUEST" | "INTERNET_DATA";
  onlinePurchase: "Y" | "N";
  groupstatus: "Y" | "N";
  packagetype: number;
  poolid: number;
  accesspolicyid: number;
  bwpolicyid: number;
  securitypolicyid: number;
  datatransferpolicyid: number;
  surfingPolicyName: string;
  bandwidthPolicyName: string;
  accessTimePolicyName: string;
  dataTransferPolicyName: string;
  fairAccessPolicyName: string;
  description: string;
  isbindtomac: "Y" | "N";
  multipleLoginLimit: number;
}

// --- In-memory store seeded from the real DB dump (tblgroup) ---

const SEED_PACKAGES: Package[] = [
  { groupid: 2, groupname: "Zero hours Zero days", price: 0, billingScheme: "PREPAID", connectionType: "User", cycleType: "Weekly", cyclemultiplier: 1, billingDate_Day: 1, billDuration: 0, billCycleAmtBasedOn: 1, countAmtBasedOn: 2, bodAccountableValue: 0, idleTimeout: -11, idleTimeoutType: "LIVE_REQUEST", onlinePurchase: "N", groupstatus: "Y", packagetype: 38, poolid: 0, accesspolicyid: 0, bwpolicyid: 0, securitypolicyid: 0, datatransferpolicyid: 0, surfingPolicyName: "Default Surfing", bandwidthPolicyName: "Default BW", accessTimePolicyName: "Default Access", dataTransferPolicyName: "Default DT", fairAccessPolicyName: "Default FAP", description: "Zero hours Zero days plan", isbindtomac: "N", multipleLoginLimit: 1 },
  { groupid: 3, groupname: "1 hour 1 day", price: 30, billingScheme: "PREPAID", connectionType: "User", cycleType: "Weekly", cyclemultiplier: 1, billingDate_Day: 1, billDuration: 1, billCycleAmtBasedOn: 1, countAmtBasedOn: 3, bodAccountableValue: 0, idleTimeout: -11, idleTimeoutType: "LIVE_REQUEST", onlinePurchase: "N", groupstatus: "Y", packagetype: 38, poolid: 0, accesspolicyid: 0, bwpolicyid: 0, securitypolicyid: 0, datatransferpolicyid: 0, surfingPolicyName: "Default Surfing", bandwidthPolicyName: "Default BW", accessTimePolicyName: "Default Access", dataTransferPolicyName: "Default DT", fairAccessPolicyName: "Default FAP", description: "1 hour validity, 1 day plan", isbindtomac: "N", multipleLoginLimit: 1 },
  { groupid: 4, groupname: "3 hours 1 day", price: 45, billingScheme: "PREPAID", connectionType: "User", cycleType: "Weekly", cyclemultiplier: 1, billingDate_Day: 1, billDuration: 3, billCycleAmtBasedOn: 1, countAmtBasedOn: 3, bodAccountableValue: 0, idleTimeout: -11, idleTimeoutType: "LIVE_REQUEST", onlinePurchase: "N", groupstatus: "Y", packagetype: 38, poolid: 0, accesspolicyid: 0, bwpolicyid: 0, securitypolicyid: 0, datatransferpolicyid: 0, surfingPolicyName: "Default Surfing", bandwidthPolicyName: "Default BW", accessTimePolicyName: "Default Access", dataTransferPolicyName: "Default DT", fairAccessPolicyName: "Default FAP", description: "3 hours validity, 1 day plan", isbindtomac: "N", multipleLoginLimit: 1 },
  { groupid: 6, groupname: "unlimited hours 1 day", price: 75, billingScheme: "PREPAID", connectionType: "User", cycleType: "Weekly", cyclemultiplier: 1, billingDate_Day: 1, billDuration: 24, billCycleAmtBasedOn: 1, countAmtBasedOn: 2, bodAccountableValue: 0, idleTimeout: -11, idleTimeoutType: "LIVE_REQUEST", onlinePurchase: "N", groupstatus: "Y", packagetype: 38, poolid: 0, accesspolicyid: 0, bwpolicyid: 0, securitypolicyid: 0, datatransferpolicyid: 0, surfingPolicyName: "Default Surfing", bandwidthPolicyName: "Default BW", accessTimePolicyName: "Default Access", dataTransferPolicyName: "Default DT", fairAccessPolicyName: "Default FAP", description: "Unlimited hours, 1 day plan", isbindtomac: "N", multipleLoginLimit: 1 },
  { groupid: 8, groupname: "unlimited hours 3 days", price: 225, billingScheme: "PREPAID", connectionType: "User", cycleType: "Weekly", cyclemultiplier: 3, billingDate_Day: 1, billDuration: 72, billCycleAmtBasedOn: 1, countAmtBasedOn: 2, bodAccountableValue: 0, idleTimeout: -11, idleTimeoutType: "LIVE_REQUEST", onlinePurchase: "N", groupstatus: "Y", packagetype: 38, poolid: 0, accesspolicyid: 0, bwpolicyid: 0, securitypolicyid: 0, datatransferpolicyid: 0, surfingPolicyName: "Default Surfing", bandwidthPolicyName: "Default BW", accessTimePolicyName: "Default Access", dataTransferPolicyName: "Default DT", fairAccessPolicyName: "Default FAP", description: "Unlimited hours, 3 days plan", isbindtomac: "N", multipleLoginLimit: 1 },
  { groupid: 9, groupname: "unlimited hours 7 days", price: 450, billingScheme: "PREPAID", connectionType: "User", cycleType: "Weekly", cyclemultiplier: 7, billingDate_Day: 1, billDuration: 168, billCycleAmtBasedOn: 1, countAmtBasedOn: 2, bodAccountableValue: 0, idleTimeout: -11, idleTimeoutType: "LIVE_REQUEST", onlinePurchase: "N", groupstatus: "Y", packagetype: 38, poolid: 0, accesspolicyid: 0, bwpolicyid: 0, securitypolicyid: 0, datatransferpolicyid: 0, surfingPolicyName: "Default Surfing", bandwidthPolicyName: "Default BW", accessTimePolicyName: "Default Access", dataTransferPolicyName: "Default DT", fairAccessPolicyName: "Default FAP", description: "Unlimited hours, 7 days plan", isbindtomac: "N", multipleLoginLimit: 1 },
  { groupid: 10, groupname: "unlimited hours 30 days", price: 1400, billingScheme: "PREPAID", connectionType: "User", cycleType: "Monthly", cyclemultiplier: 1, billingDate_Day: 1, billDuration: 720, billCycleAmtBasedOn: 1, countAmtBasedOn: 2, bodAccountableValue: 0, idleTimeout: -11, idleTimeoutType: "LIVE_REQUEST", onlinePurchase: "N", groupstatus: "Y", packagetype: 38, poolid: 0, accesspolicyid: 0, bwpolicyid: 0, securitypolicyid: 0, datatransferpolicyid: 0, surfingPolicyName: "Default Surfing", bandwidthPolicyName: "Default BW", accessTimePolicyName: "Default Access", dataTransferPolicyName: "Default DT", fairAccessPolicyName: "Default FAP", description: "Unlimited hours, 30 days plan", isbindtomac: "N", multipleLoginLimit: 1 },
  { groupid: 12, groupname: "1 hour", price: 30, billingScheme: "PREPAID", connectionType: "User", cycleType: "Weekly", cyclemultiplier: 1, billingDate_Day: 1, billDuration: 1, billCycleAmtBasedOn: 1, countAmtBasedOn: 3, bodAccountableValue: 0, idleTimeout: -11, idleTimeoutType: "LIVE_REQUEST", onlinePurchase: "N", groupstatus: "Y", packagetype: 38, poolid: 0, accesspolicyid: 0, bwpolicyid: 0, securitypolicyid: 0, datatransferpolicyid: 0, surfingPolicyName: "Default Surfing", bandwidthPolicyName: "Default BW", accessTimePolicyName: "Default Access", dataTransferPolicyName: "Default DT", fairAccessPolicyName: "Default FAP", description: "1 hour plan", isbindtomac: "N", multipleLoginLimit: 1 },
];

// Use global to persist across hot reloads
const globalForPackages = globalThis as unknown as { __packages?: Package[] };
if (!globalForPackages.__packages) {
  globalForPackages.__packages = [...SEED_PACKAGES];
}
const STORE = globalForPackages.__packages!;

let nextId = Math.max(...STORE.map((p) => p.groupid)) + 1;

// --- Validation (mirrors PackageHelper.sendcreatePackageReqMap) ---

interface ValidationResult {
  ok: boolean;
  errors: Record<string, string>;
}

function validatePackage(
  data: Partial<Package>,
  isCreate: boolean
): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.groupname?.trim()) {
    errors.groupname = "Package name is required";
  }

  if (isCreate) {
    if (!data.billingScheme || !["PREPAID", "POSTPAID"].includes(data.billingScheme)) {
      errors.billingScheme = "Billing scheme must be PREPAID or POSTPAID";
    }
    if (!data.connectionType || !["User", "Leased Line"].includes(data.connectionType)) {
      errors.connectionType = "Connection type must be 'User' or 'Leased Line'";
    }
    if (!data.cycleType || !["Weekly", "Monthly"].includes(data.cycleType)) {
      errors.cycleType = "Cycle type must be 'Weekly' or 'Monthly'";
    }
    if (data.price == null || isNaN(data.price) || data.price < 0) {
      errors.price = "Price is required and must be >= 0";
    }
    if (!data.idleTimeoutType || !["NO_IDLE_TIMEOUT", "LIVE_REQUEST", "INTERNET_DATA"].includes(data.idleTimeoutType)) {
      errors.idleTimeoutType = "Idle timeout type is required";
    }
    if (!data.isbindtomac || !["Y", "N"].includes(data.isbindtomac)) {
      errors.isbindtomac = "Bind to MAC is required (Y/N)";
    }
  }

  return { ok: Object.keys(errors).length === 0, errors };
}

// --- Route handlers ---

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search")?.toLowerCase() ?? "";
  const scheme = searchParams.get("scheme"); // PREPAID | POSTPAID
  const status = searchParams.get("status"); // Y | N

  let results = [...STORE];
  if (search) {
    results = results.filter(
      (p) =>
        p.groupname.toLowerCase().includes(search) ||
        p.description.toLowerCase().includes(search)
    );
  }
  if (scheme) {
    results = results.filter((p) => p.billingScheme === scheme);
  }
  if (status) {
    results = results.filter((p) => p.groupstatus === status);
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
    const validation = validatePackage(body, true);
    if (!validation.ok) {
      return NextResponse.json(
        {
          responseCode: "100",
          responseMsg: "Validation failed",
          errors: validation.errors,
        },
        { status: 400 }
      );
    }

    // Check duplicate name
    if (STORE.some((p) => p.groupname.toLowerCase() === body.groupname.toLowerCase())) {
      return NextResponse.json(
        {
          responseCode: "101",
          responseMsg: "Package name already exists",
          errors: { groupname: "A package with this name already exists" },
        },
        { status: 409 }
      );
    }

    const newPkg: Package = {
      groupid: nextId++,
      groupname: body.groupname.trim(),
      price: Number(body.price),
      billingScheme: body.billingScheme,
      connectionType: body.connectionType,
      cycleType: body.cycleType,
      cyclemultiplier: Number(body.cyclemultiplier) || 1,
      billingDate_Day: Number(body.billingDate_Day) || 1,
      billDuration: Number(body.billDuration) || 0,
      billCycleAmtBasedOn: Number(body.billCycleAmtBasedOn) || 1,
      countAmtBasedOn: Number(body.countAmtBasedOn) || 2,
      bodAccountableValue: Number(body.bodAccountableValue) || 0,
      idleTimeout: Number(body.idleTimeout) || -11,
      idleTimeoutType: body.idleTimeoutType,
      onlinePurchase: body.onlinePurchase ?? "N",
      groupstatus: body.groupstatus ?? "Y",
      packagetype: 38,
      poolid: Number(body.poolid) || 0,
      accesspolicyid: Number(body.accesspolicyid) || 0,
      bwpolicyid: Number(body.bwpolicyid) || 0,
      securitypolicyid: Number(body.securitypolicyid) || 0,
      datatransferpolicyid: Number(body.datatransferpolicyid) || 0,
      surfingPolicyName: body.surfingPolicyName ?? "Default Surfing",
      bandwidthPolicyName: body.bandwidthPolicyName ?? "Default BW",
      accessTimePolicyName: body.accessTimePolicyName ?? "Default Access",
      dataTransferPolicyName: body.dataTransferPolicyName ?? "Default DT",
      fairAccessPolicyName: body.fairAccessPolicyName ?? "Default FAP",
      description: body.description ?? "",
      isbindtomac: body.isbindtomac,
      multipleLoginLimit: Number(body.multipleLoginLimit) || 1,
    };

    STORE.push(newPkg);
    return NextResponse.json({
      responseCode: "0",
      responseMsg: "Package created successfully",
      data: newPkg,
    });
  }

  if (action === "delete") {
    const groupid = Number(body.groupid);
    const idx = STORE.findIndex((p) => p.groupid === groupid);
    if (idx === -1) {
      return NextResponse.json(
        { responseCode: "102", responseMsg: "Package not found" },
        { status: 404 }
      );
    }
    STORE.splice(idx, 1);
    return NextResponse.json({
      responseCode: "0",
      responseMsg: "Package deleted successfully",
    });
  }

  if (action === "update") {
    const groupid = Number(body.groupid);
    const idx = STORE.findIndex((p) => p.groupid === groupid);
    if (idx === -1) {
      return NextResponse.json(
        { responseCode: "102", responseMsg: "Package not found" },
        { status: 404 }
      );
    }
    const validation = validatePackage(body, false);
    if (!validation.ok) {
      return NextResponse.json(
        {
          responseCode: "100",
          responseMsg: "Validation failed",
          errors: validation.errors,
        },
        { status: 400 }
      );
    }
    STORE[idx] = { ...STORE[idx], ...body, groupid };
    return NextResponse.json({
      responseCode: "0",
      responseMsg: "Package updated successfully",
      data: STORE[idx],
    });
  }

  return NextResponse.json(
    { responseCode: "999", responseMsg: "Unknown action" },
    { status: 400 }
  );
}
