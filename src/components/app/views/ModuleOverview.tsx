"use client";

import { findModule } from "@/lib/nav";
import { useAppStore } from "@/lib/store";
import { PageHeader, SectionCard, EmptyState } from "@/components/app/shared";
import { ArrowRight } from "lucide-react";

interface ViewProps {
  moduleId: string;
  childId: string;
}

export function ModuleOverview({ moduleId }: ViewProps) {
  const mod = findModule(moduleId);
  const setActive = useAppStore((s) => s.setActive);

  if (!mod) {
    return (
      <EmptyState
        title="Module not found"
        description="The selected module does not exist."
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={mod.label}
        description={mod.desc}
        icon={<mod.icon className="h-5 w-5" />}
        breadcrumb={[
          { label: "Cryptsk" },
          { label: mod.label },
        ]}
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {mod.children.map((c) => (
          <button
            key={c.id}
            onClick={() => setActive(mod.id, c.id)}
            className="group flex items-start gap-3 rounded-xl border border-border bg-card p-4 text-left shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <mod.icon className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium text-foreground">{c.label}</p>
                <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">{c.desc}</p>
            </div>
          </button>
        ))}
      </div>

      <SectionCard title="About this module" description={mod.label}>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {mod.desc} This module is part of the Cryptsk ISP Gateway Suite. Select
          a sub-section above to manage its configuration. All data shown is
          illustrative and will be wired to the live PostgreSQL database once the
          source code and DB dump are imported.
        </p>
      </SectionCard>
    </div>
  );
}

export type { ViewProps };
