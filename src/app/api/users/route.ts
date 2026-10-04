import { NextRequest, NextResponse } from "next/server";

/**
 * Users API — mirrors the accsium UserService REST endpoints.
 * Source: com/cryptsk/restfulws/service/UserService.java
 *   POST /UserService/createUser
 *   POST /UserService/updateUserInfo
 *   POST /UserService/changeStatus
 *   POST /UserService/searchUser (via SubscriberHelper)
 *
 * Business logic: com/cryptsk/restfulws/helper/SubscriberHelper.java
 * Entity: accsium/corporate/user/pojo/Tbluser.java
 *
 * Validation rules extracted from SubscriberHelper.sendCreateUserReqMap():
 *   - username (required, unique)
 *   - customerName/name (required)
 *   - password (required)
 *   - packageName (required)
 *   - userType (required): User | Administrator | Manager | Operator | PopManager | Zone Manager | Zone Operator | Leased Line
 *   - loginRestrictionType: Open | Individual | Pool | Vlan | Network
 *   - bindToMacStatus: Yes | No
 *   - invoiceGenerateStatus: Yes | No
 *   - multipleLoginLimit: integer > 0 (not for Leased Line)
 *   - nasIdentifier: required for Leased Line
 */

export interface User {
  userid: number;
  username: string;
  name: string; // customer name
  password: string;
  emailid: string;
  active: "Y" | "D" | "N"; // Y=active, D=deactive, N=suspended
  groupid: number;
  packageName: string;
  zoneName: string;
  poolName: string;
  userType: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  country: string;
  zip: string;
  macaddress: string;
  ipaddress: string;
  bindToMacStatus: "Yes" | "No";
  loginRestrictionType: "Open" | "Individual" | "Pool" | "Vlan" | "Network";
  invoiceGenerateStatus: "Yes" | "No";
  multipleLoginLimit: number;
  nasIdentifier: string;
  vlanTag: number;
  birthdate: string;
  createdate: string;
  expiredate: string;
  accountid: string;
}

// In-memory store seeded with real data from the DB dump (tbluser)
const SEED_USERS: User[] = [
  {
    userid: 4,
    username: "guestprofile",
    name: "Guest User Profile",
    password: "guest123",
    emailid: "",
    active: "Y",
    groupid: 1,
    packageName: "Zero hours Zero days",
    zoneName: "Default",
    poolName: "Default",
    userType: "User",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    country: "India",
    zip: "",
    macaddress: "",
    ipaddress: "",
    bindToMacStatus: "No",
    loginRestrictionType: "Open",
    invoiceGenerateStatus: "No",
    multipleLoginLimit: 1,
    nasIdentifier: "",
    vlanTag: 1,
    birthdate: "",
    createdate: "2024-01-01 00:00:00",
    expiredate: "",
    accountid: "A000000004",
  },
  {
    userid: 2,
    username: "manager",
    name: "manager",
    password: "manager123",
    emailid: "manager@cryptsk.com",
    active: "D",
    groupid: 1,
    packageName: "Zero hours Zero days",
    zoneName: "Default",
    poolName: "Default",
    userType: "Manager",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    country: "India",
    zip: "",
    macaddress: "",
    ipaddress: "",
    bindToMacStatus: "No",
    loginRestrictionType: "Open",
    invoiceGenerateStatus: "No",
    multipleLoginLimit: 1,
    nasIdentifier: "",
    vlanTag: 1,
    birthdate: "",
    createdate: "2024-01-01 00:00:00",
    expiredate: "",
    accountid: "A000000002",
  },
  {
    userid: 3,
    username: "operator",
    name: "operator",
    password: "operator123",
    emailid: "operator@cryptsk.com",
    active: "D",
    groupid: 1,
    packageName: "Zero hours Zero days",
    zoneName: "Default",
    poolName: "Default",
    userType: "Operator",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    country: "India",
    zip: "",
    macaddress: "",
    ipaddress: "",
    bindToMacStatus: "No",
    loginRestrictionType: "Open",
    invoiceGenerateStatus: "No",
    multipleLoginLimit: 1,
    nasIdentifier: "",
    vlanTag: 1,
    birthdate: "",
    createdate: "2024-01-01 00:00:00",
    expiredate: "",
    accountid: "A000000003",
  },
  {
    userid: 1,
    username: "administrator",
    name: "administrator",
    password: "Link$gui33",
    emailid: "admin@cryptsk.com",
    active: "Y",
    groupid: 1,
    packageName: "Zero hours Zero days",
    zoneName: "Default",
    poolName: "Default",
    userType: "Administrator",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    country: "India",
    zip: "",
    macaddress: "",
    ipaddress: "",
    bindToMacStatus: "No",
    loginRestrictionType: "Open",
    invoiceGenerateStatus: "No",
    multipleLoginLimit: 1,
    nasIdentifier: "",
    vlanTag: 1,
    birthdate: "",
    createdate: "2024-01-01 00:00:00",
    expiredate: "",
    accountid: "A000000001",
  },
  // Additional sample subscriber users (representing real ISP subscribers)
  ...Array.from({ length: 12 }, (_, i) => ({
    userid: 100 + i,
    username: `user${String(i + 1).padStart(3, "0")}`,
    name: `Subscriber ${i + 1}`,
    password: "pass123",
    emailid: `user${i + 1}@example.com`,
    active: (["Y", "Y", "Y", "Y", "Y", "Y", "Y", "D", "Y", "N", "Y", "Y"] as const)[i],
    groupid: [3, 4, 6, 8, 9, 10, 12, 3, 6, 9, 10, 4][i],
    packageName: ["1 hour 1 day", "3 hours 1 day", "unlimited hours 1 day", "unlimited hours 3 days", "unlimited hours 7 days", "unlimited hours 30 days", "1 hour", "1 hour 1 day", "unlimited hours 1 day", "unlimited hours 7 days", "unlimited hours 30 days", "3 hours 1 day"][i],
    zoneName: ["Bhiwani-Core", "Bhiwani-North", "Bhiwani-South", "Bhiwani-East", "Bhiwani-West"][i % 5],
    poolName: `Pool-Bhiwani${i % 6}`,
    userType: i === 5 ? "Leased Line" : "User",
    phone: `+91-98xxxxxx${String(10 + i).padStart(2, "0")}`,
    address1: `House ${i + 1}, Street ${i + 2}`,
    address2: "",
    city: "Bhiwani",
    state: "Haryana",
    country: "India",
    zip: "127021",
    macaddress: `C0:2B:56:07:D8:${String(10 + i).padStart(2, "0")}`,
    ipaddress: `10.172.${i % 4}.${100 + i}`,
    bindToMacStatus: i % 3 === 0 ? "Yes" : ("No" as const),
    loginRestrictionType: (["Open", "Individual", "Pool", "Vlan", "Network"] as const)[i % 5],
    invoiceGenerateStatus: i % 2 === 0 ? "Yes" : ("No" as const),
    multipleLoginLimit: 1,
    nasIdentifier: i === 5 ? "sms-core-01" : "",
    vlanTag: 1,
    birthdate: "",
    createdate: `2024-0${(i % 9) + 1}-15 10:00:00`,
    expiredate: `2026-1${(i % 2) + 1}-15 10:00:00`,
    accountid: `A${String(100 + i).padStart(8, "0")}`,
  })),
];

const globalForUsers = globalThis as unknown as { __users?: User[] };
if (!globalForUsers.__users) {
  globalForUsers.__users = [...SEED_USERS];
}
const STORE = globalForUsers.__users!;
let nextId = Math.max(...STORE.map((u) => u.userid)) + 1;

// --- Validation (mirrors SubscriberHelper.sendCreateUserReqMap) ---

const VALID_USER_TYPES = [
  "User",
  "Administrator",
  "Manager",
  "Operator",
  "PopManager",
  "Zone Manager",
  "Zone Operator",
  "Leased Line",
];

const VALID_LOGIN_RESTRICTION = ["Open", "Individual", "Pool", "Vlan", "Network"];

interface ValidationResult {
  ok: boolean;
  errors: Record<string, string>;
}

function validateUser(data: Partial<User>, isCreate: boolean): ValidationResult {
  const errors: Record<string, string> = {};

  if (isCreate) {
    if (!data.username?.trim()) {
      errors.username = "Username is required";
    }
    if (!data.name?.trim()) {
      errors.name = "Customer name is required";
    }
    if (!data.password?.trim()) {
      errors.password = "Password is required";
    }
    if (!data.packageName?.trim()) {
      errors.packageName = "Package name is required";
    }
    if (!data.userType) {
      errors.userType = "User type is required";
    } else if (!VALID_USER_TYPES.includes(data.userType)) {
      errors.userType = `User type must be one of: ${VALID_USER_TYPES.join(", ")}`;
    }
  }

  if (data.loginRestrictionType && !VALID_LOGIN_RESTRICTION.includes(data.loginRestrictionType)) {
    errors.loginRestrictionType = `Login restriction must be one of: ${VALID_LOGIN_RESTRICTION.join(", ")}`;
  }

  if (data.bindToMacStatus && !["Yes", "No"].includes(data.bindToMacStatus)) {
    errors.bindToMacStatus = "Bind to MAC must be 'Yes' or 'No'";
  }

  if (data.userType === "Leased Line") {
    if (!data.nasIdentifier?.trim()) {
      errors.nasIdentifier = "NAS Identifier is required for Leased Line users";
    }
    if (data.multipleLoginLimit && data.multipleLoginLimit > 0) {
      errors.multipleLoginLimit = "Multiple login limit cannot be set for Leased Line users";
    }
  }

  if (
    data.multipleLoginLimit != null &&
    data.multipleLoginLimit <= 0 &&
    data.userType !== "Leased Line"
  ) {
    errors.multipleLoginLimit = "Multiple login limit must be greater than 0";
  }

  return { ok: Object.keys(errors).length === 0, errors };
}

// --- Route handlers ---

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search")?.toLowerCase() ?? "";
  const userType = searchParams.get("userType");
  const status = searchParams.get("status"); // Y | D | N

  let results = [...STORE];
  if (search) {
    results = results.filter(
      (u) =>
        u.username.toLowerCase().includes(search) ||
        u.name.toLowerCase().includes(search) ||
        u.emailid.toLowerCase().includes(search) ||
        u.accountid.toLowerCase().includes(search) ||
        u.phone.includes(search) ||
        u.ipaddress.includes(search) ||
        u.macaddress.toLowerCase().includes(search)
    );
  }
  if (userType && userType !== "all") {
    results = results.filter((u) => u.userType === userType);
  }
  if (status) {
    results = results.filter((u) => u.active === status);
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
    const validation = validateUser(body, true);
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

    // Check duplicate username
    if (STORE.some((u) => u.username.toLowerCase() === body.username.toLowerCase())) {
      return NextResponse.json(
        {
          responseCode: "101",
          responseMsg: "Username already exists",
          errors: { username: "A user with this username already exists" },
        },
        { status: 409 }
      );
    }

    const newUser: User = {
      userid: nextId++,
      username: body.username.trim(),
      name: body.name.trim(),
      password: body.password,
      emailid: body.emailid ?? "",
      active: body.active ?? "Y",
      groupid: Number(body.groupid) || 1,
      packageName: body.packageName,
      zoneName: body.zoneName ?? "Default",
      poolName: body.poolName ?? "Default",
      userType: body.userType,
      phone: body.phone ?? "",
      address1: body.address1 ?? "",
      address2: body.address2 ?? "",
      city: body.city ?? "",
      state: body.state ?? "",
      country: body.country ?? "India",
      zip: body.zip ?? "",
      macaddress: body.macaddress ?? "",
      ipaddress: body.ipaddress ?? "",
      bindToMacStatus: body.bindToMacStatus ?? "No",
      loginRestrictionType: body.loginRestrictionType ?? "Open",
      invoiceGenerateStatus: body.invoiceGenerateStatus ?? "No",
      multipleLoginLimit: Number(body.multipleLoginLimit) || 1,
      nasIdentifier: body.nasIdentifier ?? "",
      vlanTag: Number(body.vlanTag) || 1,
      birthdate: body.birthdate ?? "",
      createdate: new Date().toISOString().replace("T", " ").slice(0, 19),
      expiredate: body.expiredate ?? "",
      accountid: body.accountid ?? `A${String(nextId - 1).padStart(8, "0")}`,
    };

    STORE.push(newUser);
    return NextResponse.json({
      responseCode: "0",
      responseMsg: "User created successfully",
      data: newUser,
    });
  }

  if (action === "update") {
    const userid = Number(body.userid);
    const idx = STORE.findIndex((u) => u.userid === userid);
    if (idx === -1) {
      return NextResponse.json(
        { responseCode: "102", responseMsg: "User not found" },
        { status: 404 }
      );
    }
    const validation = validateUser(body, false);
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
    STORE[idx] = { ...STORE[idx], ...body, userid };
    return NextResponse.json({
      responseCode: "0",
      responseMsg: "User updated successfully",
      data: STORE[idx],
    });
  }

  if (action === "changeStatus") {
    const userids: number[] = body.userids ?? [];
    const newStatus = body.active; // Y | D | N
    if (!["Y", "D", "N"].includes(newStatus)) {
      return NextResponse.json(
        { responseCode: "100", responseMsg: "Invalid status. Must be Y, D, or N" },
        { status: 400 }
      );
    }
    let updated = 0;
    for (const id of userids) {
      const idx = STORE.findIndex((u) => u.userid === id);
      if (idx !== -1) {
        STORE[idx].active = newStatus;
        updated++;
      }
    }
    return NextResponse.json({
      responseCode: "0",
      responseMsg: `${updated} user(s) status changed to ${newStatus}`,
      updated,
    });
  }

  if (action === "delete") {
    const userid = Number(body.userid);
    const idx = STORE.findIndex((u) => u.userid === userid);
    if (idx === -1) {
      return NextResponse.json(
        { responseCode: "102", responseMsg: "User not found" },
        { status: 404 }
      );
    }
    STORE.splice(idx, 1);
    return NextResponse.json({
      responseCode: "0",
      responseMsg: "User deleted successfully",
    });
  }

  return NextResponse.json(
    { responseCode: "999", responseMsg: "Unknown action" },
    { status: 400 }
  );
}
