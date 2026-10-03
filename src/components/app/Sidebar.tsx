"use client";

import * as React from "react";
import { NAV_MODULES } from "@/lib/nav";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { ChevronDown, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const activeModule = useAppStore((s) => s.activeModule);
  const activeChild = useAppStore((s) => s.activeChild);
  const setActive = useAppStore((s) => s.setActive);
  const [query, setQuery] = React.useState("");

  const filtered = React.useMemo(() => {
    if (!query.trim()) return NAV_MODULES;
    const q = query.toLowerCase();
    return NAV_MODULES.map((m) => ({
      ...m,
      children: m.children.filter(
        (c) =>
          c.label.toLowerCase().includes(q) || m.label.toLowerCase().includes(q)
      ),
    })).filter((m) => m.children.length > 0 || m.label.toLowerCase().includes(q));
  }, [query]);

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-transform duration-300 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand header */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-sidebar-border px-4">
          <button
            onClick={() => {
              setActive("dashboard");
              onClose();
            }}
            className="flex items-center gap-2.5"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <span className="text-lg font-black">C</span>
            </div>
            <div className="text-left">
              <p className="text-base font-bold leading-none text-foreground">
                Cryptsk
              </p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                ISP Gateway Suite
              </p>
            </div>
          </button>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-sidebar-accent lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search */}
        <div className="border-b border-sidebar-border p-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search modules…"
              className="h-9 bg-background pl-8 text-sm"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Nav */}
        <ScrollArea className="flex-1 px-2 py-2">
          <nav className="space-y-1">
            {filtered.map((m) => {
              const isActiveMod = activeModule === m.id;
              const openByDefault = isActiveMod || !!query;
              return (
                <Collapsible key={m.id} defaultOpen={openByDefault}>
                  <CollapsibleTrigger asChild>
                    <button
                      onClick={() => setActive(m.id, "")}
                      className={cn(
                        "group flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-sm font-medium transition-colors",
                        isActiveMod && !activeChild
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : isActiveMod
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      )}
                    >
                      <m.icon className="h-4 w-4 shrink-0" />
                      <span className="flex-1 truncate text-left">{m.label}</span>
                      <ChevronDown className="h-4 w-4 shrink-0 transition-transform group-data-[state=open]:rotate-180" />
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="ml-3 mt-1 space-y-0.5 border-l border-sidebar-border pl-3">
                    {m.children.map((c) => {
                      const isActive = isActiveMod && activeChild === c.id;
                      return (
                        <button
                          key={c.id}
                          onClick={() => {
                            setActive(m.id, c.id);
                            onClose();
                          }}
                          className={cn(
                            "flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-[13px] transition-colors",
                            isActive
                              ? "bg-primary/10 font-medium text-primary"
                              : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
                          )}
                        >
                          <span
                            className={cn(
                              "h-1.5 w-1.5 shrink-0 rounded-full",
                              isActive ? "bg-primary" : "bg-border"
                            )}
                          />
                          <span className="truncate">{c.label}</span>
                        </button>
                      );
                    })}
                  </CollapsibleContent>
                </Collapsible>
              );
            })}
            {filtered.length === 0 && (
              <p className="px-3 py-6 text-center text-xs text-muted-foreground">
                No modules match “{query}”.
              </p>
            )}
          </nav>
        </ScrollArea>

        {/* Footer status */}
        <div className="border-t border-sidebar-border p-3">
          <div className="rounded-lg bg-sidebar-accent/60 p-3">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <p className="text-xs font-medium text-foreground">
                System healthy
              </p>
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">
              All services running · 799 live sessions
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
