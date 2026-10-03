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
