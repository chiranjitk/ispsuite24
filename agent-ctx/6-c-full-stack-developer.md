# Task 6-c — Module Views Build Record

**Agent:** full-stack-developer
**Task ID:** 6-c
**Scope:** Build out 6 module view files (OTT, Payment Tracking, Web Surfing, Net Kapture, Reports, Help) replacing existing ComingSoon stubs, following the UserView.tsx pattern.

## Files Built / Modified

1. **src/lib/mock-data.ts** (appended ~430 lines of new typed mock data)
   - OTT_PLATFORMS, OTT_UTILITIES, OTT_PLATFORM_UTILITY_RELATIONS, OTT_PARTNER_KEYS, OTT_BINDINGS
   - PAYMENT_MODES, FRANCHISE_ACCOUNTS, ACCOUNT_SEARCH_RESULTS
   - WEB_LOG_URLS, NET_KAPTURE_SESSIONS
   - FTP_REPORT_SCHEDULES, MODULE_LICENSES, DOC_SECTIONS + DocBlock interface
   - All inserted cleanly after the existing DHCP_LEASES array; existing exports (Service Requests, Alert Rules, Email Templates, Access Time Policies etc.) left untouched.

2. **src/components/app/views/OttView.tsx** — overview + 5 children (Platforms, Platform Utility, Platform Utility Relation, Partner Key, Bind OTT)
3. **src/components/app/views/PaymentTrackingView.tsx** — overview + 5 children (Manage Accounts, Search Accounts, Payment Details, Reverse, Settle)
4. **src/components/app/views/WebSurfingView.tsx** — overview + 1 child (Manage Logger)
5. **src/components/app/views/NetKaptureView.tsx** — overview + 1 child (Manage Service)
6. **src/components/app/views/ReportsView.tsx** — overview + 2 children (Reports launcher, FTP Report config)
7. **src/components/app/views/HelpView.tsx** — overview + 7 children (Company Info, Client, Upgrade, Register, Customization, Documentation, About)

## Patterns Followed (from UserView.tsx)
- `"use client"` directive at top
- `ViewProps` + `useModuleHeader` imported from `./_shared`
- `PageHeader` / `KpiCard` / `SectionCard` / `ActionBar` / `EmptyState` from `@/components/app/shared`
- `useAppStore` for `setActive(moduleId, childId)` navigation in overview card grids
- `useToast` for ALL button clicks (no button left without a handler)
- Standard breadcrumb `[Cryptsk / Module / Child]`
- Status badge colour convention: emerald=success, primary(red)=danger, amber=warning, muted=neutral
- shadcn/ui components: Table, Badge, Button, Input, Select, Checkbox, Switch, Textarea, Label — no custom UI primitives created
- `overflow-x-auto scrollbar-thin` on every scrollable table; `max-h-96 overflow-y-auto` on long log tables with sticky `bg-card` headers

## Validation
- `bun run lint` → 0 errors, 1 warning (pre-existing ternary in UserView.tsx, out of scope)
- dev.log → only a single transient 500 during the mid-write of mock-data.ts; hundreds of subsequent `✓ Compiled` + `GET / 200` entries confirm the app compiles cleanly under Next.js 16 Turbopack on port 3000.

## Notes for Future Agents
- mock-data.ts already contained content beyond DHCP_LEASES (Service Requests, Alert Rules, Email Templates, Access Time Policies) that wasn't fully visible in a 494-line Read snapshot. My Edit was applied at the DHCP_LEASES closing `];` boundary — all pre-existing content after that boundary is preserved.
- Two new mock-data interfaces are exported: `DocBlock` and `DocSection` — used by the Help → Documentation page renderer.
- `useAppStore` is the canonical hook name (no `_useAppStore` alias — consolidated).
- For the `Reports` launcher category sidebar, I used a button-group approach inside a SectionCard rather than the shadcn Tabs primitive so that each category shows a count badge; switching to Tabs is a future option.
- The Help → About page intentionally reuses `useAppStore(s => s.systemMeta)` for version/build/model so it stays in sync with the Topbar.
