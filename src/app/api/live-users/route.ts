import { NextRequest, NextResponse } from "next/server";

/**
 * Live Users API — mirrors the accsium live users data.
 * Source: accsium/corporate/modes/SearchLiveUsers.java
 *   Queries tblliveuser + tblliveuserdetail tables.
 *
 * Columns (from the 24online live users page):
 *   Sr.No, Account No, User Name, User Type, Connected From, Public IP,
 *   MAC Address, StartTime, Time(hh:mm), Upload Data Transfer,
 *   Download Data Transfer, Bandwidth(bits/sec), Device Type
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
  sessionid: string;
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
];

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

// Generate stable live users (seeded random per session)
const globalForLive = globalThis as unknown as { __liveUsers?: LiveUser[] };
if (!globalForLive.__liveUsers) {
  globalForLive.__liveUsers = Array.from({ length: 28 }, (_, i) => {
    const name = NAMES[i % NAMES.length];
    const daysAgo = Math.floor(Math.random() * 4);
    const hour = Math.floor(Math.random() * 24);
    const min = Math.floor(Math.random() * 60);
    const durH = Math.floor(Math.random() * 80);
    const durM = Math.floor(Math.random() * 60);
    const up = (Math.random() * 8000 + 100).toFixed(2);
    const down = (Math.random() * 200000 + 5000).toFixed(2);
    const bw = (Math.random() * 8 + 0.2).toFixed(2);
    const oct = () => Math.floor(Math.random() * 254) + 1;
    return {
      sr: i + 1,
      accountNo: `A${pad(3561 - i * 7, 8)}`,
      userName: name,
      userType: rand(["PPPoE", "PPPoE", "PPPoE", "Leased Line", "Hotspot"] as const),
      connectedFrom: `10.172.${rand([0, 1, 2, 3])}.${oct()} / Pool-Bhiwani${i % 6}`,
      publicIp: `103.205.15${oct() % 4}.${oct()}`,
      mac: mac(),
      startTime: `Sun, Oct ${4 - daysAgo}, ${pad(hour, 2)}:${pad(min, 2)} ${hour < 12 ? "AM" : "PM"}`,
      duration: `${durH}:${pad(durM, 2)}`,
      upload: `${up} MB`,
      download: `${down} MB`,
      bandwidth: `${bw} M`,
      deviceType: rand(["Router", "Router", "Mobile", "CPE", "N/A"]),
      sessionid: `sess-${pad(i + 1, 6)}`,
    };
  });
}
const STORE = globalForLive.__liveUsers!;

export const LIVE_USERS_TOTAL = 799;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search")?.toLowerCase() ?? "";
  const type = searchParams.get("type"); // PPPoE | Leased Line | Hotspot

  let results = [...STORE];
  if (search) {
    results = results.filter(
      (u) =>
        u.userName.toLowerCase().includes(search) ||
        u.accountNo.toLowerCase().includes(search) ||
        u.publicIp.includes(search) ||
        u.mac.toLowerCase().includes(search)
    );
  }
  if (type && type !== "all") {
    results = results.filter((u) => u.userType === type);
  }

  return NextResponse.json({
    responseCode: "0",
    responseMsg: "Success",
    data: results,
    total: results.length,
    totalConnected: LIVE_USERS_TOTAL,
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const action = body.action;

  if (action === "disconnect") {
    const sessionids: string[] = body.sessionids ?? [];
    let disconnected = 0;
    for (const sid of sessionids) {
      const idx = STORE.findIndex((u) => u.sessionid === sid);
      if (idx !== -1) {
        STORE.splice(idx, 1);
        disconnected++;
      }
    }
    return NextResponse.json({
      responseCode: "0",
      responseMsg: `${disconnected} user(s) disconnected`,
      disconnected,
    });
  }

  if (action === "sendMessage") {
    const sessionids: string[] = body.sessionids ?? [];
    const message = body.message ?? "";
    return NextResponse.json({
      responseCode: "0",
      responseMsg: `Message sent to ${sessionids.length || LIVE_USERS_TOTAL} user(s)`,
    });
  }

  return NextResponse.json(
    { responseCode: "999", responseMsg: "Unknown action" },
    { status: 400 }
  );
}
