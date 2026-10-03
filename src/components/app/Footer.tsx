"use client";

import { useAppStore } from "@/lib/store";
import { Heart } from "lucide-react";

export function Footer() {
  const meta = useAppStore((s) => s.systemMeta);
  return (
    <footer className="mt-auto border-t border-border bg-background/95 px-4 py-3 backdrop-blur">
      <div className="flex flex-col items-center justify-between gap-2 text-xs text-muted-foreground sm:flex-row">
        <div className="flex items-center gap-1.5">
          <span className="font-medium text-foreground">Cryptsk</span>
          <span>·</span>
          <span>{meta.ispName}</span>
          <span className="hidden sm:inline">·</span>
          <span className="hidden sm:inline">
            v{meta.version} build {meta.build} · {meta.model}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span>Powered by</span>
          <Heart className="h-3 w-3 fill-primary text-primary" />
          <span>Cryptsk Networks</span>
          <span>·</span>
          <span>© 2026 All Rights Reserved</span>
        </div>
      </div>
    </footer>
  );
}
