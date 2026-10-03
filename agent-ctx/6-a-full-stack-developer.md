# Task 6-a — Build System, Policy, Package, Payment Gateway module views

**Agent:** full-stack-developer
**Date:** 3 Oct 2026
**Parent task:** Cryptsk UI clone (24online ISP billing platform)

## Scope
Built out 4 module view files (System, Policy, Package, Payment Gateway) in detail,
replacing the previous `ComingSoon` stubs. Followed the established `UserView.tsx`
pattern: `PageHeader` + breadcrumb + `KpiCard`s + `SectionCard` + `Table` +
`useToast` for actions + `useAppStore.setActive` for overview navigation.

## Files modified
1. **`src/lib/mock-data.ts`** — appended ~340 lines of new mock data:
   - `SYSTEM_SERVICES` (7 entries: RADIUS, DHCP, DNS, PPPoE, Captive Portal, Web, NTP)
   - `ACL_ROLES` (5 roles), `DYNAMIC_DNS` (3 services)
   - `CAPTIVE_TEMPLATES` (3), `DENY_NETWORK` (3)
   - `DEVICE_LOGS` (7), `MANAGED_DEVICES` (5)
   - `DASHBOARD_LAYOUTS` (2)
   - `INVOICES` (8), `INVOICE_TEMPLATES` (3), `ANCILLARY_SERVICES` (4), `TAX_INFO` (4)
   - `MERCHANTS` (3), `GATEWAY_TXNS` (8)
   - `SURFING_POLICIES` (3), `ACCESS_TIME_POLICIES` (3), `BANDWIDTH_POLICIES` (4),
     `DATA_TRANSFER_POLICIES` (3), `FAP_POLICIES` (3), `QOS_POLICIES` (4)
2. **`src/components/app/views/SystemView.tsx`** — 16 children + overview
3. **`src/components/app/views/PolicyView.tsx`** — 6 children + overview (incl. weekly 7×24 visual schedule grid)
4. **`src/components/app/views/PackageView.tsx`** — 5 children + overview with KPI summary
5. **`src/components/app/views/PaymentGatewayView.tsx`** — 3 children + overview with KPIs

## Per-child implementation notes

### SystemView (16 children)
- `network` — INTERFACES table + 4 KPIs + Add Interface button
- `firewall` — FIREWALL_RULES table with enable/disable Checkbox toggle, position column
  with grip icon, color-coded action badges (Allow=emerald, Deny=primary red, Drop=amber)
- `dhcp` — Tabs (Manage DHCP / IP Leasing Report), DHCP_LEASES table with status badges
- `services` — SYSTEM_SERVICES cards with Switch toggle + Start/Stop/Restart buttons +
  Auto-start Checkbox
- `pppoe` — Form with auth-mode Select, IP pool Select, session timeout Input, MPPE/PAP/CHAP
  Checkbox group
- `console` — Reset password form (3 inputs) with per-field show/hide Eye toggle + validation
  toast (mismatch/empty)
- `manage-data` — 4 Tabs: Backup (download + schedule), Restore (upload dropzone), Purge
  (date range + table checkboxes), RADIUS Auth Log (table)
- `client-services` — Client GUI URLs table + Web Service Config form + Forgot Password Config
- `acl` — 4 Tabs: Module Detail (permissions matrix), Role Management (ACL_ROLES table),
  Security Management (toggle list), Console ACL (network rules table)
- `dynamic-dns` — DYNAMIC_DNS table with status badges
- `captive-portal` — Client login templates table + Deny Network table + Leased Line template form
- `nas` — NAS_DEVICES table + KPIs + RADIUS Client Config form + Attribute Mapping table
- `status-tracker` — Device logs (max-h-96 scroll) with INFO/WARN/ERROR badges + Managed
  Devices table + Packet Capture config form
- `system-settings` — Proactive Reports config + GUI Preferences (theme/density/toggles)
- `dashboard-conf` — Dashboard layouts cards with visual widget grid + Edit buttons
- `system-tools` — 4 diagnostic tools (ping/traceroute/dns/conn) with target input + run
  button + output pre area

### PolicyView (6 children)
- `surfing-quota` — SURFING_POLICIES table + create form
- `access-time` — Interactive 7×24 weekly schedule grid (click to toggle cell) + policies table
- `bandwidth` — BANDWIDTH_POLICIES table with Up/Down Mbps columns + create form
- `data-transfer` — DATA_TRANSFER_POLICIES table with GB quota column
- `fap` — FAP_POLICIES table with threshold + reset + throttle-down columns
- `qos` — QOS_POLICIES table with type/priority badges + Manage Schedule form

### PackageView (5 children)
- `package` — PLANS table with all 12 columns (ID/Name/Type/Up/Down/Data/Validity/Price/Tax/
  Users/Status/Actions) + filter & search; row click opens toast detail
- `invoice` — INVOICES table with Paid/Due/Overdue color badges + summary table by package +
  Generate/Purge buttons
- `invoice-template` — 3 template cards with visual preview mockup + Edit/Preview buttons
- `ancillary` — ANCILLARY_SERVICES table + create form
- `tax` — TAX_INFO table + create slab form
- Overview — 6 KPI summary (Total Plans, Active Plans, Active Users, Est. MRR, Invoices, Tax Slabs)

### PaymentGatewayView (3 children)
- `configure` — Provider select (Razorpay/PayU/Stripe/Cashfree), Merchant ID, Secret Key
  with show/hide, Callback URL, Currency select, Settlement cycle, Test Mode switch
- `merchant` — MERCHANTS table with default Checkbox toggle + status click-toggle badge
- `search-transactions` — Filter form (date range + status + gateway + text search) +
  results table with status badges + Refund button for Success transactions; 8 mock rows
- Overview — 3 KPIs (Total Transactions, Success Rate, Refunded)

## Key decisions
- All 4 views use the same `_shared` `useModuleHeader` hook and `ViewProps` interface as
  `UserView.tsx`.
- Brand colors respected: red (primary) for danger/suspended/Leased Line, emerald for
  success/Active, amber for warning/Pending, slate-muted for neutral/Inactive. No raw
  red/blue/indigo classes.
- All buttons wired to `useToast` (no dead buttons).
- Tables are responsive with `overflow-x-auto`; long logs use `max-h-96 overflow-y-auto
  scrollbar-thin`.
- The 7×24 access-time grid is a real interactive component (click to toggle), not just
  a static visual.
- New mock data appended at the end of `src/lib/mock-data.ts`; existing exports untouched
  except where new interfaces were added in a clearly delimited block.

## Verification
- `bun run lint` → 0 errors, 1 pre-existing warning in `UserView.tsx` (not my file).
- `curl http://localhost:3000/` → 200 OK.
- `tail /home/z/my-project/dev.log` → all "✓ Compiled" entries, no compile errors after
  each view file was written.

## Issues remaining
- None for this task. All 4 views compile and render. The sibling view files (Sales,
  Ticket, Inventory, Alert, Reports, etc.) remain as `ComingSoon` stubs — those belong
  to other agents.
