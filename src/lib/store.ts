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

  /* navigation — 3 levels: module > child > grandchild */
  activeModule: string; // module id, or "home"/"dashboard"
  activeChild: string; // child id within module, or "" for module overview
  activeGrandchild: string; // grandchild id within child, or "" for child overview
  setActive: (moduleId: string, childId?: string, grandchildId?: string) => void;

  /* system meta (mirrors 24online header) */
  systemMeta: {
    version: string;
    build: string;
    model: string;
    ispName: string;
  };
}

export const useAppStore = create<AppState>((set) => ({
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
      activeGrandchild: "",
    });
    return true;
  },
  logout: () =>
    set({
      user: null,
      activeModule: "dashboard",
      activeChild: "",
      activeGrandchild: "",
    }),

  activeModule: "dashboard",
  activeChild: "",
  activeGrandchild: "",
  setActive: (moduleId, childId = "", grandchildId = "") =>
    set({
      activeModule: moduleId,
      activeChild: childId,
      activeGrandchild: grandchildId,
    }),

  systemMeta: {
    version: "8.3.8",
    build: "3.0",
    model: "SMS_2500iX",
    ispName: "Cryptsk Networks",
  },
}));
