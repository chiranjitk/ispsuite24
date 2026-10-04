"use client";

/**
 * API client for Cryptsk — wraps fetch calls to our Next.js API routes.
 * Mirrors the accsium REST service response format:
 * { responseCode: "0"|"100"|..., responseMsg: string, data?: any, errors?: {} }
 */

export interface ApiResponse<T = any> {
  responseCode: string;
  responseMsg: string;
  data?: T;
  errors?: Record<string, string>;
  total?: number;
}

async function request<T>(
  url: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
  const json = await res.json().catch(() => ({
    responseCode: "500",
    responseMsg: "Invalid JSON response",
  }));
  return { ...json, httpStatus: res.status } as ApiResponse<T> & {
    httpStatus: number;
  };
}

/* --- Packages --- */

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

export const packagesApi = {
  list: (params?: { search?: string; scheme?: string; status?: string }) => {
    const q = new URLSearchParams();
    if (params?.search) q.set("search", params.search);
    if (params?.scheme) q.set("scheme", params.scheme);
    if (params?.status) q.set("status", params.status);
    return request<Package[]>(`/api/packages?${q.toString()}`);
  },
  create: (data: Partial<Package>) =>
    request<Package>("/api/packages", {
      method: "POST",
      body: JSON.stringify({ action: "create", ...data }),
    }),
  update: (data: Partial<Package> & { groupid: number }) =>
    request<Package>("/api/packages", {
      method: "POST",
      body: JSON.stringify({ action: "update", ...data }),
    }),
  delete: (groupid: number) =>
    request<void>("/api/packages", {
      method: "POST",
      body: JSON.stringify({ action: "delete", groupid }),
    }),
};

/* --- Users --- */

export interface User {
  userid: number;
  username: string;
  name: string;
  password: string;
  emailid: string;
  active: "Y" | "D" | "N";
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

export const usersApi = {
  list: (params?: { search?: string; userType?: string; status?: string }) => {
    const q = new URLSearchParams();
    if (params?.search) q.set("search", params.search);
    if (params?.userType) q.set("userType", params.userType);
    if (params?.status) q.set("status", params.status);
    return request<User[]>(`/api/users?${q.toString()}`);
  },
  create: (data: Partial<User>) =>
    request<User>("/api/users", {
      method: "POST",
      body: JSON.stringify({ action: "create", ...data }),
    }),
  update: (data: Partial<User> & { userid: number }) =>
    request<User>("/api/users", {
      method: "POST",
      body: JSON.stringify({ action: "update", ...data }),
    }),
  delete: (userid: number) =>
    request<void>("/api/users", {
      method: "POST",
      body: JSON.stringify({ action: "delete", userid }),
    }),
  changeStatus: (userids: number[], active: "Y" | "D" | "N") =>
    request<void>("/api/users", {
      method: "POST",
      body: JSON.stringify({ action: "changeStatus", userids, active }),
    }),
};

/* --- Live Users --- */

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

export const liveUsersApi = {
  list: (params?: { search?: string; type?: string }) => {
    const q = new URLSearchParams();
    if (params?.search) q.set("search", params.search);
    if (params?.type) q.set("type", params.type);
    return request<LiveUser[]>(`/api/live-users?${q.toString()}`);
  },
  disconnect: (sessionids: string[]) =>
    request<void>("/api/live-users", {
      method: "POST",
      body: JSON.stringify({ action: "disconnect", sessionids }),
    }),
  sendMessage: (sessionids: string[], message: string) =>
    request<void>("/api/live-users", {
      method: "POST",
      body: JSON.stringify({ action: "sendMessage", sessionids, message }),
    }),
};

/* --- Zones --- */

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

export const zonesApi = {
  list: (params?: { search?: string; status?: string }) => {
    const q = new URLSearchParams();
    if (params?.search) q.set("search", params.search);
    if (params?.status) q.set("status", params.status);
    return request<Zone[]>(`/api/zones?${q.toString()}`);
  },
  create: (data: Partial<Zone>) =>
    request<Zone>("/api/zones", {
      method: "POST",
      body: JSON.stringify({ action: "create", ...data }),
    }),
  update: (data: Partial<Zone> & { zoneid: number }) =>
    request<Zone>("/api/zones", {
      method: "POST",
      body: JSON.stringify({ action: "update", ...data }),
    }),
  delete: (zoneid: number) =>
    request<void>("/api/zones", {
      method: "POST",
      body: JSON.stringify({ action: "delete", zoneid }),
    }),
};
