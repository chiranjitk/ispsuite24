"use client";

import { useAppStore } from "@/lib/store";
import { LoginPage } from "@/components/app/LoginPage";
import { AppShell } from "@/components/app/AppShell";

export default function Page() {
  const user = useAppStore((s) => s.user);

  if (!user) {
    return <LoginPage />;
  }
  return <AppShell />;
}
