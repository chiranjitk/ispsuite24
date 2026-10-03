"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  breadcrumb?: { label: string; onClick?: () => void }[];
}

export function PageHeader({
  title,
  description,
  icon,
  actions,
  breadcrumb,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        {icon && (
          <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary sm:flex">
            {icon}
          </div>
        )}
        <div>
          {breadcrumb && breadcrumb.length > 0 && (
            <nav className="mb-1 flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
              {breadcrumb.map((b, i) => (
                <React.Fragment key={i}>
                  {b.onClick ? (
                    <button
                      onClick={b.onClick}
                      className="transition-colors hover:text-primary"
                    >
                      {b.label}
                    </button>
                  ) : (
                    <span className="text-foreground/70">{b.label}</span>
                  )}
                  {i < breadcrumb.length - 1 && <span>/</span>}
                </React.Fragment>
              ))}
            </nav>
          )}
          <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            {title}
          </h1>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      {actions && (
        <div className="flex flex-wrap items-center gap-2">{actions}</div>
      )}
    </div>
  );
}

interface KpiCardProps {
  label: string;
  value: string;
  delta?: string;
  trend?: "up" | "down" | "flat";
  icon?: React.ReactNode;
  accent?: boolean;
}

export function KpiCard({
  label,
  value,
  delta,
  trend,
  icon,
  accent,
}: KpiCardProps) {
  const trendColor =
    trend === "up"
      ? "text-emerald-600"
      : trend === "down"
      ? "text-primary"
      : "text-muted-foreground";
  const trendIcon = trend === "up" ? "▲" : trend === "down" ? "▼" : "■";
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md",
        accent && "border-primary/30 bg-primary/5"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </p>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
            {value}
          </p>
        </div>
        {icon && (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>
        )}
      </div>
      {delta && (
        <p className={cn("mt-2 text-xs font-medium", trendColor)}>
          <span className="mr-1">{trendIcon}</span>
          {delta}
        </p>
      )}
    </div>
  );
}

interface ActionBarProps {
  children: React.ReactNode;
  className?: string;
}

export function ActionBar({ children, className }: ActionBarProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 rounded-lg border border-border bg-muted/40 p-2",
        className
      )}
    >
      {children}
    </div>
  );
}

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-muted/20 px-6 py-16 text-center">
      {icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          {icon}
        </div>
      )}
      <div>
        <p className="font-medium text-foreground">{title}</p>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

interface SectionCardProps {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function SectionCard({
  title,
  description,
  actions,
  children,
  className,
}: SectionCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card shadow-sm",
        className
      )}
    >
      {(title || actions) && (
        <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-3">
          <div>
            {title && (
              <h3 className="text-sm font-semibold text-foreground">{title}</h3>
            )}
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
}

interface InfoRowProps {
  label: string;
  value: React.ReactNode;
}

export function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium text-foreground">{value}</span>
    </div>
  );
}
