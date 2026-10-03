"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAppStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Lock, User, ShieldCheck, Activity, Globe } from "lucide-react";

export function LoginPage() {
  const router = useRouter();
  const login = useAppStore((s) => s.login);
  const { toast } = useToast();
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [show, setShow] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [remember, setRemember] = React.useState(true);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast({
        title: "Missing credentials",
        description: "Please enter both username and password.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    // simulate network latency
    setTimeout(() => {
      const ok = login(username, password);
      setLoading(false);
      if (ok) {
        toast({
          title: "Welcome to Cryptsk",
          description: `Signed in as ${username}`,
        });
        router.refresh();
      } else {
        toast({
          title: "Sign-in failed",
          description: "Invalid credentials.",
          variant: "destructive",
        });
      }
    }, 600);
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left brand panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-primary p-10 text-primary-foreground lg:flex">
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.5) 0, transparent 40%), radial-gradient(circle at 80% 60%, rgba(255,255,255,0.3) 0, transparent 35%)",
          }}
        />
        <div className="relative">
          <div className="flex items-center gap-2">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
              <span className="text-2xl font-black">C</span>
            </div>
            <div>
              <p className="text-lg font-bold leading-none">Cryptsk</p>
              <p className="text-xs text-white/80">ISP Gateway Suite</p>
            </div>
          </div>
        </div>

        <div className="relative space-y-6">
          <h2 className="max-w-md text-3xl font-bold leading-tight">
            Manage your ISP, billing & subscribers — all in one console.
          </h2>
          <p className="max-w-md text-sm text-white/85">
            Cryptsk brings together subscriber management, PPPoE & RADIUS,
            bandwidth policies, billing, tickets and real-time monitoring into
            a single, modern control plane.
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { icon: Activity, label: "Live monitoring" },
              { icon: ShieldCheck, label: "Policy & FAP" },
              { icon: Globe, label: "Multi-zone" },
            ].map((f) => (
              <div
                key={f.label}
                className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 backdrop-blur"
              >
                <f.icon className="h-4 w-4" />
                <span className="text-xs font-medium">{f.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative text-xs text-white/70">
          © 2026 Cryptsk Networks. All rights reserved.
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex items-center justify-center bg-background p-6 sm:p-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <span className="text-xl font-black">C</span>
            </div>
            <div>
              <p className="text-base font-bold leading-none">Cryptsk</p>
              <p className="text-xs text-muted-foreground">ISP Gateway Suite</p>
            </div>
          </div>

          <div className="mb-6">
            <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Enter your administrator credentials to access the console.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="username"
                  autoComplete="username"
                  placeholder="administrator"
                  className="pl-9"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <button
                  type="button"
                  className="text-xs text-primary hover:underline"
                  onClick={() =>
                    toast({
                      title: "Password reset",
                      description: "Contact your system administrator.",
                    })
                  }
                >
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={show ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="pl-9 pr-9"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={show ? "Hide password" : "Show password"}
                >
                  {show ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="remember"
                checked={remember}
                onCheckedChange={(v) => setRemember(!!v)}
              />
              <Label htmlFor="remember" className="text-sm font-normal">
                Keep me signed in
              </Label>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          <div className="mt-6 rounded-lg border border-border bg-muted/30 p-3 text-xs text-muted-foreground">
            <p className="font-medium text-foreground">Demo access</p>
            <p className="mt-1">
              Any username/password works. Try{" "}
              <code className="rounded bg-background px-1 py-0.5">
                administrator
              </code>{" "}
              to unlock the admin role.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
