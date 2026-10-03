"use client";

import * as React from "react";
import { findModule, findChild, type NavChild } from "@/lib/nav";
import { useAppStore } from "@/lib/store";
import { PageHeader, SectionCard } from "@/components/app/shared";
import { ArrowRight, ChevronRight } from "lucide-react";

interface ChildOverviewProps {
  moduleId: string;
  childId: string;
}

/**
 * Renders a grid of a child's grandchildren (3rd-level menu items).
 * Shown when a child that has grandchildren is selected but no specific
 * grandchild is active. Mirrors the ModuleOverview card-grid pattern.
 */
export function ChildOverview({ moduleId, childId }: ChildOverviewProps) {
  const mod = findModule(moduleId);
  const child = findChild(moduleId, childId);
  const setActive = useAppStore((s) => s.setActive);

  if (!mod || !child) return null;

  const grandchildren = child.grandchildren ?? [];
  const breadcrumb = [
    { label: "Cryptsk" },
    { label: mod.label, onClick: () => setActive(moduleId, "", "") },
    { label: child.label },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={child.label}
        description={child.desc}
        icon={<mod.icon className="h-5 w-5" />}
        breadcrumb={breadcrumb}
      />

      {grandchildren.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {grandchildren.map((g) => (
            <button
              key={g.id}
              onClick={() => setActive(moduleId, childId, g.id)}
              className="group flex items-start gap-3 rounded-xl border border-border bg-card p-4 text-left shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <mod.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium text-foreground">{g.label}</p>
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {g.desc ?? "Sub-section"}
                </p>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <SectionCard title={child.label} description={child.desc}>
          <p className="text-sm text-muted-foreground">
            This section has no sub-pages. Content will be displayed here.
          </p>
        </SectionCard>
      )}

      {child.refUrl && (
        <SectionCard title="Reference">
          <p className="text-sm text-muted-foreground">
            Corresponds to the 24online page:
          </p>
          <code className="mt-2 block truncate rounded bg-muted px-2 py-1 text-xs text-muted-foreground">
            {child.refUrl}
          </code>
        </SectionCard>
      )}
    </div>
  );
}

/** Convenience: does a child have grandchildren? */
export function childHasGrandchildren(child?: NavChild): boolean {
  return !!child && !!child.grandchildren && child.grandchildren.length > 0;
}
