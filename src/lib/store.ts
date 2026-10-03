"use client";

import { create } from "zustand";

export interface AuthUser {
  username: string;
  role: "administrator" | "operator" | "support";
  displayName: string;
}

interface AppState {
  /* auth */
  user: AuthUser | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;

  /* navigation */
  activeModule: string; // module id, or "home"/"dashboard"
  activeChild: string; // child id within module, or "" for module overview
  setActive: (moduleId: string, childId?: string) => void;

  /* system meta (mirrors 24online header) */
  systemMeta: {
    version: string;
    build: string;
    model: string;
    ispName: string;
  };
}

export const useAppStore = create<AppState>((set, get) => ({
  user: null,
  login: (username, password) => {
    // Demo authentication — accept any non-empty credentials.
    // Real auth wired later when source + DB arrive.
    if (!username || !password) return false;
    const role: AuthUser["role"] =
      username.toLowerCase() === "administrator"
        ? "administrator"
        : username.toLowerCase().startsWith("support")
        ? "support"
        : "operator";
    set({
      user: {
        username,
        role,
        displayName: username.charAt(0).toUpperCase() + username.slice(1),
      },
      activeModule: "dashboard",
      activeChild: "",
    });
    return true;
  },
  logout: () => set({ user: null, activeModule: "dashboard", activeChild: "" }),

  activeModule: "dashboard",
  activeChild: "",
  setActive: (moduleId, childId = "") =>
    set({ activeModule: moduleId, activeChild: childId }),

  systemMeta: {
    version: "8.3.8",
    build: "3.0",
    model: "SMS_2500iX",
    ispName: "Cryptsk Networks",
  },
}));
