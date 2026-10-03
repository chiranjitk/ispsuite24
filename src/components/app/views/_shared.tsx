"use client";

import * as React from "react";
import { findModule, findChild, findGrandchild } from "@/lib/nav";
import { useAppStore } from "@/lib/store";
import { PageHeader, EmptyState, SectionCard } from "@/components/app/shared";
import { Construction, FileText, ArrowRight } from "lucide-react";

export interface ViewProps {
  moduleId: string;
  childId: string;
  grandchildId?: string;
}

/**
 * Resolves the module / child / grandchild for the current view.
 * Returns `{ mod, child, grandchild }`.
 */
export function useModuleHeader(
  moduleId: string,
  childId?: string,
  grandchildId?: string
) {
  const mod = findModule(moduleId);
  const child = childId ? findChild(moduleId, childId) : undefined;
  const grandchild =
    childId && grandchildId
      ? findGrandchild(moduleId, childId, grandchildId)
      : undefined;
  return { mod, child, grandchild };
}

/**
 * A "leaf page placeholder" that renders a sensible, good-looking page for any
 * grandchild (or leaf child) that doesn't yet have bespoke content. It shows
 * the page header with the full 3-level breadcrumb, a description, a small
 * "what this page does" card, and a "reference URL" link, so the UI feels
 * complete even before every single page gets bespoke content.
 */
export function LeafPlaceholder({
  moduleId,
  childId,
  grandchildId,
}: {
  moduleId: string;
  childId: string;
  grandchildId?: string;
}) {
  const { mod, child, grandchild } = useModuleHeader(
    moduleId,
    childId,
    grandchildId
  );
  const setActive = useAppStore((s) => s.setActive);
  if (!mod || !child) return null;

  const title = grandchild?.label ?? child.label;
  const desc = grandchild?.desc ?? child.desc;
  const refUrl = grandchild?.refUrl ?? child.refUrl;
  const breadcrumb = [
    { label: "Cryptsk" },
    { label: mod.label },
    { label: child.label },
    ...(grandchild ? [{ label: grandchild.label }] : []),
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={title}
        description={desc}
        icon={<mod.icon className="h-5 w-5" />}
        breadcrumb={breadcrumb}
      />

      <SectionCard
        title="Page Overview"
        description="This sub-page is part of the Cryptsk module structure."
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-border bg-muted/20 p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <FileText className="h-4 w-4 text-primary" />
              What this page does
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {desc}. This is a{" "}
              <span className="font-medium text-foreground">
                {grandchild ? "sub-section" : "section"}
              </span>{" "}
              within <span className="font-medium">{child.label}</span> of the{" "}
              <span className="font-medium">{mod.label}</span> module. Use the
              controls here to manage its configuration.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-muted/20 p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Construction className="h-4 w-4 text-primary" />
              Implementation status
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              The page structure is in place. Bespoke forms and live data
              binding will be added once the source code + DB dump are imported.
              The reference 24online URL for this page is:
            </p>
            {refUrl && (
              <code className="mt-2 block truncate rounded bg-background px-2 py-1 text-xs text-muted-foreground">
                {refUrl}
              </code>
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActive(moduleId, childId, "")}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
          >
            <ArrowRight className="h-3 w-3 rotate-180" />
            Back to {child.label}
          </button>
          <button
            onClick={() => setActive(moduleId, "", "")}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
          >
            <ArrowRight className="h-3 w-3 rotate-180" />
            Back to {mod.label} overview
          </button>
        </div>
      </SectionCard>
    </div>
  );
}

/**
 * Backwards-compatible ComingSoon — renders LeafPlaceholder.
 */
export function ComingSoon({
  moduleId,
  childId,
  grandchildId,
}: ViewProps & { grandchildId?: string }) {
  return (
    <LeafPlaceholder
      moduleId={moduleId}
      childId={childId}
      grandchildId={grandchildId}
    />
  );
}
