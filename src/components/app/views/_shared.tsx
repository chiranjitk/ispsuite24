"use client";

import * as React from "react";
import { findModule } from "@/lib/nav";
import { PageHeader, EmptyState } from "@/components/app/shared";
import { Construction } from "lucide-react";

export interface ViewProps {
  moduleId: string;
  childId: string;
}

/**
 * Helper that renders the module header + an "under construction" placeholder
 * for sub-pages that haven't been built out yet.
 */
export function useModuleHeader(moduleId: string, childId?: string) {
  const mod = findModule(moduleId);
  const child = childId ? mod?.children.find((c) => c.id === childId) : undefined;
  return { mod, child };
}

export function ComingSoon({
  moduleId,
  childId,
}: {
  moduleId: string;
  childId: string;
}) {
  const { mod, child } = useModuleHeader(moduleId, childId);
  if (!mod) return null;
  return (
    <div className="space-y-6">
      <PageHeader
        title={child?.label ?? mod.label}
        description={child?.desc ?? mod.desc}
        icon={<mod.icon className="h-5 w-5" />}
        breadcrumb={[{ label: "Cryptsk" }, { label: mod.label }, { label: child?.label ?? "" }]}
      />
      <EmptyState
        icon={<Construction className="h-6 w-6" />}
        title="This page is being wired up"
        description={`${child?.label ?? mod.label} UI scaffolding is in progress. The structure is ready and data mapping will be completed when the source code + DB dump are imported.`}
      />
    </div>
  );
}
