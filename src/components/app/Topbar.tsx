"use client";

import * as React from "react";
import { useAppStore } from "@/lib/store";
import { findModule, findChild, findGrandchild } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";
import {
  Menu,
  Home,
  LayoutDashboard,
  TerminalSquare,
  LifeBuoy,
  LogOut,
  Bell,
  Search,
  Sun,
  Moon,
  ChevronRight,
  UserCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface TopbarProps {
  onMenuClick: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const user = useAppStore((s) => s.user);
  const meta = useAppStore((s) => s.systemMeta);
  const activeModule = useAppStore((s) => s.activeModule);
  const activeChild = useAppStore((s) => s.activeChild);
  const activeGrandchild = useAppStore((s) => s.activeGrandchild);
  const setActive = useAppStore((s) => s.setActive);
  const logout = useAppStore((s) => s.logout);
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  const mod = findModule(activeModule);
  const child = activeChild ? findChild(activeModule, activeChild) : undefined;
  const grandchild =
    activeChild && activeGrandchild
      ? findGrandchild(activeModule, activeChild, activeGrandchild)
      : undefined;

  const topActions = [
    { id: "home", label: "Home", icon: Home, onClick: () => setActive("home") },
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      onClick: () => setActive("dashboard"),
    },
    {
      id: "console",
      label: "Console",
      icon: TerminalSquare,
      onClick: () =>
        toast({
          title: "Console",
          description: "SSH/console access is wired in the next phase.",
        }),
    },
    {
      id: "support",
      label: "Support",
      icon: LifeBuoy,
      onClick: () => setActive("help", "documentation"),
    },
  ];

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <button
        onClick={onMenuClick}
        className="rounded-md p-2 text-muted-foreground hover:bg-muted lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Breadcrumb */}
      <div className="hidden min-w-0 items-center gap-1.5 text-sm md:flex">
        <span className="text-muted-foreground">Cryptsk</span>
        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />
        {mod ? (
          <>
            <button
              onClick={() => setActive(activeModule, "")}
              className="truncate text-muted-foreground hover:text-foreground"
            >
              {mod.label}
            </button>
            {child && (
              <>
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />
                <button
                  onClick={() => setActive(activeModule, activeChild, "")}
                  className={
                    grandchild
                      ? "truncate text-muted-foreground hover:text-foreground"
                      : "truncate font-medium text-foreground"
                  }
                >
                  {child.label}
                </button>
              </>
            )}
            {grandchild && (
              <>
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />
                <span className="truncate font-medium text-foreground">
                  {grandchild.label}
                </span>
              </>
            )}
          </>
        ) : (
          <span className="truncate font-medium capitalize text-foreground">
            {activeModule}
          </span>
        )}
      </div>

      {/* Search (center, desktop) */}
      <div className="ml-auto hidden flex-1 justify-center px-4 lg:flex lg:max-w-md">
        <div className="relative w-full">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search users, tickets, plans…"
            className="h-9 bg-muted/50 pl-9"
            onFocus={() => toast({ title: "Global search", description: "Coming soon — will search across modules." })}
          />
        </div>
      </div>

      {/* Quick actions */}
      <div className="ml-auto flex items-center gap-1 lg:ml-0">
        {topActions.map((a) => (
          <Button
            key={a.id}
            variant="ghost"
            size="sm"
            className="hidden h-9 gap-1.5 px-2.5 sm:flex"
            onClick={a.onClick}
            title={a.label}
          >
            <a.icon className="h-4 w-4" />
            <span className="hidden lg:inline">{a.label}</span>
          </Button>
        ))}

        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          onClick={() =>
            toast({
              title: "No new notifications",
              description: "You're all caught up.",
            })
          }
        >
          <Bell className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          title="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="ml-1 flex h-9 items-center gap-2 rounded-full border border-border bg-background px-1.5 pr-3 text-sm transition-colors hover:bg-muted">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {user?.displayName?.[0] ?? "A"}
              </span>
              <span className="hidden text-left sm:block">
                <span className="block text-xs font-medium leading-none text-foreground">
                  {user?.displayName}
                </span>
                <span className="block text-[10px] capitalize leading-none text-muted-foreground">
                  {user?.role}
                </span>
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>{user?.displayName}</span>
                <span className="text-xs font-normal text-muted-foreground">
                  {user?.username} · {user?.role}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2">
              <UserCircle2 className="h-4 w-4" /> My Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              className="gap-2"
              onClick={() => setActive("system", "system-settings")}
            >
              <LayoutDashboard className="h-4 w-4" /> Preferences
            </DropdownMenuItem>
            <DropdownMenuItem
              className="gap-2"
              onClick={() => setActive("help", "about")}
            >
              <LifeBuoy className="h-4 w-4" /> About Cryptsk
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <div className="px-2 py-1.5 text-[11px] text-muted-foreground">
              v{meta.version} build {meta.build} · {meta.model}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 text-primary focus:text-primary"
              onClick={() => {
                logout();
                toast({ title: "Signed out", description: "Session ended." });
              }}
            >
              <LogOut className="h-4 w-4" /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
