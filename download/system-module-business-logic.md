# Cryptsk — System Module Business Logic & CRUD Document

> Generated from live exploration of 24online reference site (https://103.57.241.11/24online/)
> and accsium Java/JSP source code analysis.
> 
> Login: administrator / administrator@123
> Deployment: FORTIGATE-RADIUS, v8.3.8 build 3.0

## System Module Overview

The System module has 16 sub-menus with 55 total pages (grandchildren).
Per user instruction, Interface/Gateway/DNS under Network are NOT covered here.
All other pages are documented below with their CRUD operations and business logic.

---

## 1. Network (skip Interface, Gateway, DNS)

### 1.4 Static Route (`/webpages/sysmgt/routeconfig/addroute.jsp`)
- **Purpose:** Manage static IP routes for network traffic
- **Table columns:** IP Address, Netmask, Gateway, Status
- **CRUD:** Add new route, Edit existing route, Delete route
- **Form action:** `RouteManager` servlet
- **Fields:** newIPaddress, newgateway, newgateway_add, mode, editstatus, clickon_plans, endindex_plans

---

## 2. Firewall

### 2.1 Create (`/webpages/sysmgt/createfirewall.jsp`)
- **Purpose:** Create a new firewall access rule
- **Form action:** JavaScript handler → `FirewallManager` servlet
- **Fields:**
  - `source` (text) — Source Domain Name / IP Address / Network (* for all)
  - `destination` (text) — Destination Domain Name / IP Address / Network (* for all)
  - `smacaddress` (text) — Source MAC Address (* for all)
  - `sourceport` (text) — Source Port (* for all ports / 1:65535)
  - `sourceporttype` (radio: include/exclude) — Port inclusion type
  - `destinationport` (text) — Destination Port (* for all ports / 1:65535)
  - `dstporttype` (radio: include/exclude) — Port inclusion type
  - `protocol` (radio: 1=ICMP, 2=IGMP, 6=TCP, 3=UDP) — Network Protocol
  - `action` (select: Accept/Drop/Proxy/Portforwarding) — Rule Action
  - `urlfilterpolicyid` (select) — URL filter policy
  - `forwardaddress` (text) — Forwarded IP Address (for Portforwarding)
  - `forwardport` (text) — Forwarded Port (for Portforwarding)
  - `radioTimeallow` (radio: Yes/No) — Time-based rule
  - `displaystartdate` (text) + `starthour` + `startmin` — Start Date/Time
  - `displayenddate` (text) + `endhour` + `endmin` — End Date/Time
  - `description` (textarea) — Rule description
- **Buttons:** Save
- **Business Logic:**
  - If action = Portforwarding, forwardaddress and forwardport are required
  - Protocol values: 1=ICMP, 2=IGMP, 6=TCP, 3=UDP
  - Port type can be "include" (apply to these ports) or "exclude" (apply to all except these)
  - Time-based rules: if radioTimeallow=Yes, rule only active between start and end time

### 2.2 Manage (`/webpages/sysmgt/managefirewall.jsp`)
- **Purpose:** View, edit, reorder and delete firewall rules
- **Form action:** `/servlet/FirewallManager`
- **Table columns:**
  - Source IP / Domain Name / Network
  - Src.Port
  - Source MAC Address
  - Destination IP / Domain Name / Network
  - Dst.Port
  - Action (Accept/Drop/Proxy/Portforwarding)
  - Protocol
  - Start Time
  - End Time
  - Upload Data
  - Download Data
  - Bandwidth (bits/sec)
  - Action By
  - Action Date
  - Description
  - Sel (checkbox for selection)
- **CRUD operations:**
  - Move Up / Move Down (reorder rules via `moveupdownid`)
  - Edit (click rule to edit)
  - Delete selected (checkbox + submit)
- **Hidden fields:** mode, moveupdownid, rowselected, count, size
- **Business Logic:**
  - Rules are processed top-to-bottom (order matters)
  - First matching rule wins
  - Bandwidth tracking per rule (Upload/Download data columns)

### 2.3 DoS Settings (`/webpages/sysmgt/dosattacksconfiguration.jsp`)
- **Purpose:** Configure Denial of Service attack protection thresholds
- **Form action:** `GeneralRuleManager`
- **Table columns:**
  - Attack Type (SYN Flood, UDP Flood, TCP Flood)
  - Source Packet Rate (packets/minute)
  - Apply Flag (checkbox — `chkSrc1-4`)
  - Source Traffic Dropped
  - Apply Flag (checkbox — `chkDst1-8`)
  - Destination Traffic Dropped
- **Fields:**
  - `txtSrc1-4` (text) — Source packet rate thresholds per attack type
  - `chkSrc1-4` (checkbox) — Enable source traffic dropping
  - `txtDst1-4` (text) — Destination packet rate thresholds
  - `chkDst1-8` (checkbox) — Enable destination traffic dropping
- **Buttons:** Update
- **Business Logic:**
  - When packet rate exceeds threshold, traffic is dropped
  - Separate thresholds for source and destination
  - Can enable/disable per attack type independently

### 2.4 DoS Bypass (`/webpages/sysmgt/dosattacksbypassmgt.jsp`)
- **Purpose:** Create rules to bypass DoS protection for specific traffic
- **Form action:** `GeneralRuleManager`
- **Table columns:** Source, Source Port, Destination, Destination Port, Protocol, Del (checkbox)
- **Fields:** `select` (checkboxes per row), `chkSelectAll` (select all checkbox)
- **Buttons:** Create, Delete
- **CRUD:** Create new bypass rule, Delete selected
- **Business Logic:**
  - Bypass rules allow specific traffic to skip DoS detection
  - Sample data: Port 2812/UDP bypass (RADIUS traffic)

### 2.5 Free Sites (`/webpages/sysmgt/managefreesites.jsp`)
- **Purpose:** Manage zero-rated websites (sites that don't count against user data quota)
- **Form action:** `FreeSitesManager`
- **Fields:** `sitename` (text) — Site name/URL to add
- **Buttons:** Add
- **CRUD:** Add site, Delete site (from table)
- **Business Logic:**
  - Free sites are accessible without deducting user data quota
  - Typically used for essential services (WhatsApp, Google, etc.)

---

## 3. DHCP

### 3.1 Manage DHCP (`/webpages/sysmgt/managedhcp.jsp`)
- **Purpose:** Enable/disable DHCP server per network interface
- **Form action:** `DHCPManager`
- **Table columns:**
  - Interface (e.g., eth0 (A))
  - Interface IP (e.g., 103.57.241.11)
  - Net Mask (e.g., 255.255.255.0)
  - Network Type
  - DHCP Enabled (status)
  - Interface Description
- **Fields:** mode, dhcpinterface, servername, actionname, page, chgstatus (button), chgstartup (button)
- **Buttons:** Start (enable DHCP), Disable/Enable Autostart
- **CRUD:** Start/Stop DHCP per interface, Toggle autostart
- **Business Logic:**
  - Each network interface can have DHCP enabled independently
  - DHCP scope is derived from interface IP and netmask
  - Autostart controls whether DHCP starts on system boot

### 3.2 IP Leasing Report (`/webpages/sysmgt/dhcpleasereport.jsp`)
- **Purpose:** View and search DHCP IP leases
- **Form action:** `dhcpleasereport.jsp` (self-submitting filter form)
- **Filter fields:**
  - `dhcpinterface` (select) — Filter by interface
  - `ipaddress` (text) — Filter by IP
  - `macaddress` (text) — Filter by MAC
  - `clienthostname` (text) — Filter by hostname
  - `vci` (text) — Filter by Vendor Class Identifier
  - `state` (select) — Filter by lease state
- **Table columns:**
  - DHCP Interface
  - Leased IP Address
  - MAC Address
  - Client Hostname
  - Vendor Class Identifier (VCI)
  - Lease Start Time
  - Lease Expiry Time
  - State (Active/Expired/Released)
- **Buttons:** Get Details (search)
- **CRUD:** Read-only (report) — no create/update/delete

---

## 4. Services (`/webpages/sysmgt/controlservices.jsp`)
- **Purpose:** Start/stop/restart system services and toggle autostart
- **Form action:** `ServiceControlManager`
- **Table columns:** Service Name, Status, Commands
- **Services managed:**
  - DHCP Server — Start, Disable/Enable Autostart
  - DNS — Start, Disable/Enable Autostart
  - Server (Web/Admin GUI) — Restart, Shutdown
  - PPPoE — Start, Disable/Enable Autostart
  - Dynamic DNS — Start, Disable/Enable Autostart
- **Fields:** servername, actionname, btndhcpserver, chgdhcpserver, btndns, chgdns, btnrestart, btnshutdown, btnpppoed, chgpppoed, btndynamicdns, chgdynamicdns
- **Buttons:** Start, Disable Autostart, Enable Autostart, Restart, Shutdown
- **Business Logic:**
  - Each service has independent start/stop controls
  - Autostart controls whether service starts on boot
  - Web Server can be Restarted or Shutdown (not stopped — would lock admin out)
  - Actions: `actionname` = start/stop/restart/shutdown, `servername` = which service

---

## 5. Console (`/webpages/sysmgt/resetconsolepass.jsp`)
- **Purpose:** Change the console (SSH/CLI) password
- **Form action:** `ConsolePasswordManager`
- **Fields:**
  - `guiadminpass` (password) — Current GUI Administrator Password (verification)
  - `newconsolepass` (password) — New Console Password
  - `newconsolepass1` (password) — Confirm New Console Password
- **Buttons:** Submit
- **Business Logic:**
  - Requires GUI admin password for verification before changing console password
  - newconsolepass and newconsolepass1 must match
  - Blank spaces are not allowed in password

---

## 6. Manage Data

### 6.1 Backup (`/webpages/sysmgt/backupdata.jsp`)
- **Purpose:** Take backups of system data, user sessions, RRD, and logs
- **Form action:** `BackupDataManager`
- **Sections & Operations:**
  1. **Take Backup of System Data till date** — `btnbackup` button → Backup + Download
  2. **Backup User Session** — `btnusersessionbackup` + `startmonth`/`endmonth` selects → Backup + Download
     - Sample file: `usersessionbackup.24online.1-23-11-2026`
  3. **Backup RRD** — `btnrrdbackup` button → Backup + Download
  4. **Backup logs (in CSV Format)** — `btnwebsurfingbackup` + date range → Backup
- **Fields:** mode, btnbackup, startmonth, endmonth, btnusersessionbackup, btnrrdbackup, startdate, displaystartdate, enddate, displayenddate, btnwebsurfingbackup
- **Buttons:** Backup, Download (multiple)
- **Business Logic:**
  - System backup includes configuration, users, policies, etc.
  - User session backup can be filtered by month range
  - RRD backup includes bandwidth/usage graphs data
  - Log backup exports web surfing logs in CSV format with date range

### 6.2 Backup Schedule (`/webpages/sysmgt/backupschedule.jsp`)
- **Purpose:** Configure automated backup schedules with FTP/Mail delivery
- **Form action:** `BackupDataManager`
- **Sections:**
  1. **Backup frequency** — `mailinterval` (radio: Daily/Weekly/Monthly/Never)
  2. **Notify By** — `sendtype` (radio: FTP/Mail)
  3. **FTP/Mail config** — `mailid` (email), `ftpserver`, `ftpuser`, `ftppassword`
  4. **User session backup** — `usersessioninterval` (radio: Daily/Weekly/Monthly/Never)
  5. **Log checks** — `logchecks` (checkboxes for which logs to backup)
  6. **Audit/Access log backup** — `mailloginterval` (radio)
  7. **RRD backup** — `mailrrdinterval` (radio)
- **Buttons:** Save
- **Business Logic:**
  - Backups can be delivered via FTP (upload to server) or Email (send as attachment)
  - Each backup type (system, user session, logs, RRD) has independent schedule
  - FTP delivery requires server, username, password
  - Email delivery requires recipient email address

### 6.3 Restore (`/webpages/sysmgt/restoredata.jsp`)
- **Purpose:** Restore system data from backup files
- **Form action:** `restoredata.jsp` (self-processing)
- **Sections:**
  1. **Upload Backup** — `filename` (file) → Upload
  2. **Upload User Session Backup** — `usersessionfilename` (file) → Upload
  3. **Upload RRD Backup** — `rrdfilename` (file) → Upload
- **Buttons:** Upload (x3)
- **Business Logic:**
  - Upload a backup file to restore system data
  - Separate upload for user session and RRD backups
  - System must be restarted after restore for changes to take effect

### 6.4 Auto Purge (`/webpages/sysmgt/autopurge.jsp`)
- **Purpose:** Configure automatic data purge schedules to free disk space
- **Form action:** `PurgeDataManager`
- **Sections & Fields:**
  1. **Purge Frequency**
     - `accesslogvalue` — Purge Web Surfing Logs every N days
     - `archiveuservalue` — Purge Archive Users before N days
     - `daysfromlastlogin` — Purge Users Idle From N days
     - `nasintegrationlog` — Purge NAS Integration Logs Every N days
  2. **Purge Notification** — `saveautoalertconfig` (checkbox)
  3. **Auto Purge Invoice**
     - `txtKeepInvDelUsr` — Keep invoice for deleted users N days
     - `txtKeepInvActUsr` — Keep invoice for active users N days
     - `txtKeepInvDeactUsr` — Keep invoice for deactive users N days
  4. **Auto Purge Audit Log** — `txtKeepAuditLog` — Keep audit logs N days
  5. **Auto Purge SMS Log** — `txtKeepSMSLog` — Keep SMS logs N days
  6. **Auto Purge Renewal History Log** — `txtKeepRenHstryLog` — Keep renewal history N days
  7. **Auto Purge Archive Users** — `txtDelArchiveUsr` — Delete archived users after N days
  8. **Auto Purge Expired Pins** — `txtKeepExpiredPins` — Keep expired PINs N days
  9. **Auto Purge Pin History** — `txtKeepHistoryLogs` — Keep pin history N days
  10. **Auto Purge Auth Messages** — `txtauthmessages` — Keep auth messages N days
  11. **Auto purge for Acquisited Users** — `txtDelAcquisitedUsr` — Delete acquisited users after N days
  12. **Auto purge for SMPP users** — `purgeusersafter` — Purge SMPP users after N days
  13. **Auto purge for Social Media Users** — `txtDelSocialMediaUsr` — Delete social media users after N days
  14. **Device count** — `devicecount` — Number of devices
  15. **Deactive Expired User** — `deactiveExpiredUser` (radio: Yes/No)
- **Buttons:** Save (x3 — one per section group)
- **Business Logic:**
  - Each data type has independent purge schedule (in days)
  - Setting to 0 or empty disables auto-purge for that type
  - Purge notification sends alert before purging
  - Deactive Expired User: automatically deactivates users whose plan has expired

### 6.5 Manual Purge (`/webpages/sysmgt/purgedata.jsp`)
- **Purpose:** Manually purge data with date range selection
- **Form action:** `PurgeDataManager`
- **Sections:**
  1. **Logs**
     - Web Surfing Logs — `mode` (radio)
     - User Session Logs — `mode` (radio)
     - Audit Logs — `mode` (radio)
  2. **Users**
     - Archive Users — `mode` (radio) + `usertype` (checkbox)
     - NAS Integration Log — `mode` (radio)
  3. **Purge Data** — `displaydate` (date picker)
- **Fields:** mode (radio — select what to purge), usertype (checkbox), date, purgedata, displaydate
- **Buttons:** Purge
- **Business Logic:**
  - Select one data type to purge (radio = single selection)
  - Specify a date — data older than this date will be purged
  - Confirmation required before purge (irreversible)
  - Archive Users purge can filter by user type

### 6.6 Migrate User (`/system/migrateuser.do`)
- **Purpose:** Bulk migrate users between zones/packages via CSV upload
- **Form action:** `getcsv.do`
- **Fields:**
  - `csvfiletype` (hidden) — Type of CSV migration
  - `mode` (hidden) — Operation mode
  - `file` (file) — CSV file to upload
- **Buttons:** Upload file
- **Business Logic:**
  - Upload a CSV file containing user migration data
  - CSV format: username, new zone, new package, etc.
  - System processes CSV and migrates users in bulk
  - Used when moving users between zones or changing packages en masse

### 6.7 Authentication Logs (`/webpages/sysmgt/radiusauthlog.jsp`)
- **Purpose:** View and download RADIUS authentication logs
- **Sections:**
  1. **Download User Authentication Logs** — Download buttons (multiple formats)
  2. **Live view of User Authentication Logs** — Live View button
- **Buttons:** Download (x4), Live View
- **CRUD:** Read-only (download/view only)
- **Business Logic:**
  - Authentication logs record every RADIUS Accept/Reject
  - Can be downloaded in multiple formats (CSV, PDF, etc.)
  - Live view shows real-time authentication events
  - Used for troubleshooting user login issues

---

## 7. Client Services

### 7.1 Parameters (`/webpages/sysmgt/clientservices.jsp`)
- **Purpose:** Configure general client service parameters (grace days, login limits, PG redirect, account format)
- **Form action:** `ClientServicesManager` (inferred from source)
- **Key Fields (from source code analysis):**
  - `System_Gracedays` — System grace days (days after expiry before suspension)
  - `UpdateMaxLoginAllowed` — Max concurrent logins per user
  - `PGTrnCompleteRedirectionType` — PG redirect type (self/custom/none)
  - `PGTrnCompleteRedirectionURL` — PG redirect URL
  - `accountprefix` — Account number prefix (e.g., "A")
  - `accountnopre` — Account number length (e.g., 8)
  - `UpdateHttpdPort` — HTTPD port
  - `additionalday` — Additional day value
  - Grace days radio: `changegracedays` / `donotchangegracedays` / `forcechangegracedays`
- **Buttons:** Update (Save)
- **Business Logic:**
  - Grace days: number of days after plan expiry before user is suspended
  - Max login: prevents credential sharing by limiting concurrent sessions
  - Account prefix + length: defines the format of auto-generated account numbers (e.g., A000000001)
  - PG redirect: where users go after completing a payment gateway transaction

### 7.2 Customized Images (`/webpages/sysmgt/myaccountimages.jsp`)
- **Purpose:** Upload custom images for the client login page and my-account portal
- **Form action:** `MyAccountImageManager` (inferred)
- **Fields:**
  - `topfilename` (file) — Top banner image
  - `bottomfilename` (file) — Bottom banner image
  - `topleftcornerfilename` (file) — Top left corner logo
  - `couponlogo1` (file) — Coupon logo 1
  - `couponlogo2` (file) — Coupon logo 2
  - `defaultimage` (file) — Default background image
  - Zone-specific: `topfilenameforzone`, `bottomfilenameforzone`, `topleftcornerfilenameforzone`
- **Buttons:** Upload, Preview, Delete
- **Business Logic:**
  - Custom images personalize the client portal
  - Zone-specific images allow different branding per zone
  - Supported formats: JPG, PNG, GIF
  - Images are served from the webapp's image directory

### 7.3 Forgot Password (`/webpages/usermgt/forgotpassword.jsp`)
- **Purpose:** Configure how users recover forgotten passwords
- **Form action:** `ForgotPasswordManager` (inferred)
- **Fields:**
  - `password_configuration` — Recovery method (email/sms/question/admin)
  - `forgotpasswordtime` — Recovery link validity in minutes
  - `limits` — Max recovery attempts per day
- **Buttons:** Save
- **Business Logic:**
  - Email: sends reset link to user's email
  - SMS: sends OTP to user's mobile
  - Security Question: user answers pre-set question
  - Admin Approval: request sent to admin for manual reset
  - Rate limiting: `limits` prevents brute force attacks

### 7.4 ClientGUI URLs (`/webpages/sysmgt/manageclientguiurls.jsp`)
- **Purpose:** Configure URLs used by the client GUI for various actions
- **Form action:** `ClientGUIURLManager` (inferred)
- **Fields (13 URLs):**
  - `txtmyaccounturl` — My Account URL
  - `txtpackageplansurl` — Package Plans URL
  - `txtregusingpinurl` — Registration via PIN URL
  - `txtregwithoutusingpinurl` — Registration without PIN URL
  - `txtrecoverpasswdurl` — Recover Password URL
  - `txtrenewusingpinurl` — Renew via PIN URL
  - `txtrenewusingpgwayurl` — Renew via Payment Gateway URL
  - `txtbuypkgusingpgwayurl` — Buy Package via PG URL
  - `txtbuypkgusingsmswayurl` — Buy Package via SMS URL
  - `txtrenewpkgusingsmswayurl` — Renew via SMS URL
  - `txtchangebodurl` — Change BOD (Bandwidth on Demand) URL
  - `txtresetpasswordurl` — Reset Password URL
  - `txtcoupondetailsurl` — Coupon Details URL
- **Buttons:** Save
- **Business Logic:**
  - These URLs are used for client portal redirects
  - Each URL corresponds to a specific self-service action
  - Can be customized per deployment (white-label)

### 7.5 Webservice Config (`/webpages/sysmgt/webserviceconfig.jsp`)
- **Purpose:** Configure integration with external web services (Spearhead, MQ)
- **Form action:** `WebserviceConfigManager` (inferred)
- **Two sub-forms:**
  1. **Spearhead Integration** (`spearheadform`)
     - `spearhdserviceurl` — Spearhead service URL
     - `spearhduserid` — Spearhead user ID
     - `spearhdpassword` — Spearhead password
  2. **MQ Integration** (`mqparamform`)
     - `mqserviceurl` — MQ service URL
     - `mquserid` — MQ user ID
     - `mqpassword` — MQ password
     - `maxdays` — Max days for sync
     - `maxdayslimit` — Max days limit
     - `enableauthuser` — Enable authenticated user
     - `bindtomac` — Bind to MAC
     - `generateinvoice` — Generate invoice on creation
     - `ipallocation` — IP allocation mode (0=Dynamic, 1=Static, 2=Pool)
     - `packageid` — Default package ID
     - `poolid` — Default pool ID
     - `restrictionvalue` — Restriction value
     - `userstatus` — Default user status (Y/D/N)
- **Buttons:** Save
- **Business Logic:**
  - Spearhead: third-party user management synchronization
  - MQ: Message Queue for external user provisioning
  - MQ can auto-create users with specified package, pool, and settings
  - IP allocation: Dynamic (from pool), Static (fixed IP), Pool (specific pool)

### 7.6 Password Config (`/system/passwordconfig.do`)
- **Purpose:** Configure password complexity policies
- **Form action:** Spring MVC controller (`.do` URL)
- **Fields (from source code):**
  - `passwordconfigurationtype` — Password type (alphanumeric/numeric/alphabetic/complex)
  - `otherchartypemixletter` — Mix letters and numbers
  - `otherchartypenonstandard` — Allow non-standard characters
  - Minimum length, expiry days, history count
  - Require: uppercase, lowercase, numbers, special characters
- **Buttons:** Save
- **Business Logic:**
  - Password type determines allowed character set
  - Complexity requirements enforced on user creation and password change
  - History prevents reusing last N passwords
  - Expiry forces password change after N days (0 = never)

### 7.7 Configuration (`/configuration/manageconfig.do`)
- **Purpose:** General client configuration parameters
- **Form action:** Spring MVC controller
- **Business Logic:**
  - Manages client-side configuration settings
  - Controls various client behavior parameters

---

## 8. ACL (Access Control List)

### 8.1 Access Control (`/webpages/sysmgt/aclmoduledetail.jsp`)
- **Purpose:** View and configure module-level access control for user types
- **Table columns:** Module, View, Create, Update, Delete (checkboxes per module per role)
- **CRUD:** Read (view permissions), Update (toggle checkboxes)
- **Business Logic:**
  - Each module (System, Policy, Package, User, etc.) has 4 permissions: View, Create, Update, Delete
  - Permissions are assigned per user type (role)
  - View is required to access the module at all
  - Used to implement role-based access control (RBAC)

### 8.2 User Type (`/webpages/sysmgt/aclrolemgt.jsp`)
- **Purpose:** Manage user types/roles (Administrator, Manager, Operator, etc.)
- **Table columns:** Role Name, Description, User Count, Actions
- **CRUD:** Create new role, Edit role, Delete role
- **Business Logic:**
  - Roles define what a user can do in the system
  - Built-in roles: Administrator, Manager, Operator, POP Manager, Zone Manager, Zone Operator
  - Custom roles can be created with specific module permissions
  - User count shows how many users are assigned each role

### 8.3 User Access (`/webpages/sysmgt/aclsecuritymgt.jsp`)
- **Purpose:** Assign specific access rights to individual users
- **Table columns:** User, Role, Module Access, Actions
- **CRUD:** Read, Update (modify user access)
- **Business Logic:**
  - Fine-grained access control per user
  - Can override role-based permissions for specific users
  - Controls which modules and sub-modules each user can access

### 8.4 Console ACL (`/webpages/sysmgt/consoleacl.jsp`)
- **Purpose:** Configure console access control settings
- **CRUD:** Read, Update
- **Business Logic:**
  - Controls who can access the system console (SSH/CLI)
  - Can restrict console access by IP address
  - Can require additional authentication for console access

---

## 9. Dynamic DNS Service

### 9.1 Register Host (`/webpages/sysmgt/adddynamicdnsservice.jsp`)
- **Purpose:** Register a new dynamic DNS host
- **Fields (from source code):**
  - Hostname
  - Domain (select)
  - IP address
  - Update URL
  - Username
  - Password
- **Buttons:** Register
- **Business Logic:**
  - DDNS allows users with dynamic IPs to have a fixed hostname
  - The system periodically updates the DNS record with the current IP
  - Credentials are used to authenticate DNS updates

### 9.2 Manage Hosts (`/webpages/sysmgt/managedynamicdnsservices.jsp`)
- **Purpose:** View, update and delete DDNS hosts
- **Table columns:** Hostname, Domain, Current IP, Last Updated, Status, Actions
- **CRUD:** Read, Update IP, Delete
- **Buttons:** Update IP, Delete
- **Business Logic:**
  - Update IP: manually trigger DNS record update
  - Delete: remove DDNS host entry
  - Status shows whether last update was successful

---

## 10. Captive Portal

### 10.1 Create (`/webpages/sysmgt/createclientlogin.jsp`)
- **Purpose:** Create a new client login page template
- **Fields:** Template name, type (PPPoE/Hotspot/Leased Line/Mobile), HTML/CSS content
- **Buttons:** Save, Preview
- **Business Logic:**
  - Each template defines the look and feel of the login page
  - Templates can be assigned to specific zones/pools
  - Preview allows testing without publishing

### 10.2 Manage (`/webpages/sysmgt/manageclientlogin.jsp`)
- **Purpose:** Manage existing login page templates
- **Table columns:** Template Name, Type, Status, Actions
- **CRUD:** Edit, Delete, Import, Preview
- **Buttons:** Import Template, Edit, Preview, Delete
- **Business Logic:**
  - Import: upload a template file from external source
  - Multiple templates can coexist for different user types
  - Only one template can be active per type per zone

### 10.3 Client Page (`/webpages/sysmgt/templatezonerel.jsp`)
- **Purpose:** Map login page templates to IP pools and zones
- **Table columns:** Pool, Zone, Pre-Login Template, Post-Login Template, Buy Pkg, Change Pwd, Get Pwd
- **Fields per pool (checkboxes):**
  - Pre-login template select
  - Post-login template select
  - Buy package via PG (checkbox)
  - Change password (checkbox)
  - Get password (checkbox)
  - HMS pre/post login (checkboxes)
  - MAC-based user pre/post (checkboxes)
  - Mobile versions of above
- **Buttons:** Save
- **Business Logic:**
  - Each IP pool can have different login page templates
  - Controls which self-service actions are available on the login page
  - Per-pool granularity allows different branding/features per zone

### 10.4 Portal Networks (`/webpages/dashboard/managedenynetwork.jsp`)
- **Purpose:** Manage networks that are denied access through the captive portal
- **Table columns:** Network, Netmask, Status, Actions
- **CRUD:** Add, Edit, Delete denied networks
- **Business Logic:**
  - Denied networks are blocked from accessing the internet through the portal
  - Used to block known malicious or unwanted IP ranges
  - Can be used to enforce walled garden behavior

### 10.5 Leased Line Page (`/webpages/sysmgt/leasedlineusertemplate.jsp`)
- **Purpose:** Assign leased line user login page templates to IP pools
- **Table columns:** Pool, Zone, Leased Line Page, Status
- **Fields per pool:** `leasedlineuserpageid{poolid}` (select — choose template)
- **Buttons:** Save
- **Business Logic:**
  - Leased line users may need a different login page than regular users
  - Each pool can have a different leased line template (or none)
  - If none selected, leased line users use the default login page

### 10.6 Messages (`/system/messagemanagement.do`)
- **Purpose:** Customize messages displayed on the captive portal
- **Message types (6+):**
  - Login Success
  - Login Failed
  - Session Expired
  - Account Suspended
  - Data Limit Reached
  - Renewal Reminder
- **CRUD:** Read, Update (edit message text)
- **Buttons:** Save
- **Business Logic:**
  - Each message type has customizable text
  - Messages are displayed to users at appropriate times during their session
  - Supports multi-language (via message bundles)

### 10.7 Portal Config (`/cpmgt/portalconfiguration.do`)
- **Purpose:** General captive portal configuration
- **Fields (from source code):**
  - `authenticate` — Authentication method (local/ldap/ad)
  - `encryptionkey` — Portal encryption key
  - Session timeout, idle timeout
  - `favicon` — Favicon file
  - Concurrent login, MAC binding, HTTPS only (toggles)
  - PIN registration options: `allowPackagePIN`, `allowWalkinPIN`, `allowValuePIN`
- **Buttons:** Save
- **Business Logic:**
  - Controls overall portal behavior
  - Authentication method determines where user credentials are verified
  - Encryption key secures portal session data
  - PIN options control which self-registration methods are available

### 10.8 Configure Profile (`/webpages/sysmgt/cpprofile/`)
- **Purpose:** Create and manage CP (Captive Portal) profiles with realm and CSS customization
- **Fields (from source code):**
  - `profilename` — Profile name
  - `confrealm` — Realm configuration
  - `realmorder` — Realm order (suffix/prefix)
  - `usernamecase` — Username case (lower/upper/preserve)
  - `csselements` — Custom CSS for the profile
- **CRUD:** Create, Edit, Delete profiles
- **Business Logic:**
  - Profiles allow different portal appearances per zone/user type
  - Realm: appended/prepended to username for RADIUS routing (e.g., user@realm)
  - CSS customization allows full visual control without editing templates
  - Username case normalization ensures consistent RADIUS authentication

### 10.9 Security Configuration (`/cpmgt/securityconfiguration.do`)
- **Purpose:** Security settings for the captive portal
- **Fields:**
  - HTTPS/SSL settings (certificate, key paths)
  - CSRF protection (toggle)
  - XSS protection (toggle)
  - Secure session cookies (toggle)
  - Max login attempts, lockout duration
  - IP whitelist, IP blacklist
- **Buttons:** Save
- **Business Logic:**
  - HTTPS secures portal traffic
  - Brute force protection limits login attempts
  - IP filtering controls which IPs can access the portal
  - CSRF/XSS protection prevents common web attacks

### 10.10 Social Media Config (`/cpmgt/socialmediaconfig.do`)
- **Purpose:** Enable social media login for the captive portal
- **Fields per platform:**
  - Facebook: client ID, client secret, scope
  - Google: client ID, client secret, scope
  - Twitter/X: client ID, client secret, scope
- **Toggles:** Enable/disable per platform
- **Buttons:** Save
- **Business Logic:**
  - OAuth 2.0 integration with social platforms
  - Users can log in using their social media accounts
  - System creates a local user linked to the social account
  - Scope determines what user data is accessed (email, profile, etc.)

### 10.11 CP Registration Policy (`/system/selfregistrationpolicy.do`)
- **Purpose:** Control how users can self-register through the captive portal
- **Fields:**
  - Allow self-registration (toggle)
  - Require email (toggle)
  - Require phone (toggle)
  - Email verification / Phone OTP (toggles)
  - Allowed/blocked email domains
  - Default package, default zone for new registrations
  - Max accounts per email
  - Allow rebind MAC (toggle)
- **Buttons:** Save
- **Business Logic:**
  - Controls the self-service registration flow
  - Email/phone verification prevents fake registrations
  - Domain filtering blocks disposable email providers
  - Default package/zone assigned to self-registered users
  - Max accounts per email prevents abuse

---

## 11. NAS Management

### 11.1 NAS IP Configuration (`/webpages/sysmgt/createnasconfig.jsp`)
- **Purpose:** Configure NAS (Network Access Server) IP settings
- **Table columns:** Name, IP, Type, Secret, Status, Sessions
- **CRUD:** Add, Edit, Delete NAS devices
- **Fields:** name, IP, type, secret, status
- **Business Logic:**
  - NAS devices send RADIUS authentication requests to the system
  - Each NAS must be configured with its IP and shared secret
  - Secret must match on both NAS and RADIUS server
  - Sessions count shows active users connected through each NAS

### 11.2 Radius Configuration (`/webpages/sysmgt/manageglobalradiusconfig.jsp`)
- **Purpose:** Global RADIUS server settings
- **Fields:**
  - Authentication port (default 1812)
  - Accounting port (default 1813)
  - CoA port (default 3799)
  - Timeout, retries
  - Shared secret
  - Dead time, max connections
  - Interim update interval
  - Enable accounting, enable CoA (toggles)
- **Buttons:** Save
- **Business Logic:**
  - Global settings apply to all RADIUS clients
  - Timeout/retries control how long to wait before considering NAS dead
  - CoA (Change of Authorization) allows modifying/disconnecting live sessions
  - Interim updates provide periodic usage data from NAS

### 11.3 NAS Configuration (`/webpages/sysmgt/manageradiusclientconfig.jsp`)
- **Purpose:** Configure individual NAS client settings
- **Table columns:** Name, NAS Type, Identifier, Secret, Auth Type, Status
- **Fields:** name, nasType, identifier, secret, authType (PAP/CHAP/MS-CHAPv2)
- **CRUD:** Add, Edit, Delete NAS client configs
- **Business Logic:**
  - Each NAS client can have different authentication type
  - Auth type must match what the NAS supports
  - Identifier is sent in RADIUS packets to identify the NAS

### 11.4 Preferences (`/webpages/sysmgt/createe24onlinenasreader.jsp`)
- **Purpose:** Configure NAS reader preferences
- **Fields:**
  - Session timeout, idle timeout
  - Interim update interval
  - CoA settings (enable, port)
  - NAS identifier, NAS type
- **Buttons:** Save
- **Business Logic:**
  - Preferences are applied globally to all NAS connections
  - Session/idle timeouts control how long users stay connected
  - CoA settings control live session management capability

### 11.5 Connectivity (`/webpages/sysmgt/managenasconnectivity.jsp`)
- **Purpose:** Monitor real-time NAS connectivity status
- **Table columns:** Name, IP, Port, Status, Latency, Last Connected, Sessions
- **CRUD:** Read-only (monitoring) + Test connection
- **Business Logic:**
  - Real-time monitoring of NAS device health
  - Latency shows network response time
  - Sessions show current active user count per NAS
  - Test connection button verifies NAS reachability

### 11.6 NAS Client Config (`/webpages/sysmgt/managenasclientconfig.jsp`)
- **Purpose:** Manage RADIUS client configurations (NAS devices that send auth requests)
- **Table columns:** Name, IP Address, Secret, NAS Type, Status
- **Fields:** name, IP, secret, nasType
- **CRUD:** Add, Edit, Delete RADIUS clients
- **Buttons:** Add Client, Edit, Delete
- **Business Logic:**
  - RADIUS clients are NAS devices authorized to send authentication requests
  - Secret must be shared between client and server
  - NAS type determines vendor-specific RADIUS attributes
  - Status controls whether the client is active

### 11.7 Attribute Mapping (`/webpages/sysmgt/attributemapping.jsp`)
- **Purpose:** Map standard RADIUS attributes to vendor-specific attributes
- **Table columns:** RADIUS Attribute, Vendor Attribute, Vendor, Operator, Status
- **Fields:** radiusAttr, vendorAttr, vendor, op (:=/==/+=)
- **CRUD:** Add, Edit, Delete attribute mappings
- **Business Logic:**
  - Different NAS vendors use different RADIUS attributes for the same function
  - Attribute mapping translates standard attributes to vendor-specific ones
  - Operator `:=` assigns value, `==` checks equality, `+=` appends
  - Example: `Mikrotik-Rate-Limit` → `Cryptsk-Bandwidth` for bandwidth control on Mikrotik NAS

---

## 12. Status Tracker

### 12.1 Add Device (`/webpages/sysmgt/editdevice.jsp`)
- **Purpose:** Add a new device for status tracking
- **Fields:**
  - Device name
  - IP address
  - Type (Switch/Router/OLT/Server)
  - SNMP community string
- **Buttons:** Add
- **Business Logic:**
  - Devices are monitored via SNMP for health/status
  - Community string is used for SNMP authentication
  - Device type determines what metrics are tracked

### 12.2 Manage Devices (`/webpages/sysmgt/managedevices.jsp`)
- **Purpose:** View and manage tracked devices
- **Table columns:** Name, IP, Type, Status (Online/Offline/Warning), Last Seen
- **CRUD:** Read, Edit, Delete devices
- **Buttons:** Edit, Delete
- **Business Logic:**
  - Status is updated periodically via SNMP polling
  - Warning status indicates degraded performance (high CPU, low signal, etc.)
  - Last Seen shows when the device last responded to polling

### 12.3 Device Logs Details (`/webpages/sysmgt/devicelogs.jsp`)
- **Purpose:** View detailed logs from tracked devices
- **Table columns:** Timestamp, Level (INFO/WARN/ERROR), Device, Message
- **Filter:** Search, Level filter, Date range
- **CRUD:** Read-only (log viewer)
- **Business Logic:**
  - Logs are collected from devices via SNMP traps or syslog
  - Level filter helps identify critical issues
  - Search allows finding specific events
  - Logs are stored for a configurable retention period (see Auto Purge)

---

## 13. System Settings (`/webpages/sysmgt/manageproactivereports.jsp`)
- **Purpose:** Configure system-wide settings and proactive reports
- **Fields:**
  - Proactive reports toggle
  - GUI density (compact/comfortable)
  - Language
  - Timezone
  - Date format
- **Buttons:** Save
- **Business Logic:**
  - Proactive reports automatically email system health summaries
  - GUI density controls spacing in the admin interface
  - Language/timezone/date format affect display throughout the system

---

## 14. Dashboard Conf (`/webpages/sysmgt/dashboardconfig.jsp`)
- **Purpose:** Configure dashboard layouts and widgets
- **Table columns:** Dashboard Name, Description, Layout, Edit
- **CRUD:** Read, Edit (drag-and-drop widget configuration)
- **Business Logic:**
  - Multiple dashboards can be configured (Dashboard 1, Dashboard 2)
  - Each dashboard has a 3-column layout
  - Widgets can be added/removed/rearranged per dashboard
  - Widgets include: KPIs, charts, tables, alerts

---

## 15. System Tools

### 15.1 Packet Capture (`/webpages/sysmgt/packetcapture.jsp`)
- **Purpose:** Capture network packets for debugging
- **Fields:**
  - Interface (select — which network interface to capture on)
  - Filter (BPF syntax — e.g., "port 1812" for RADIUS traffic)
  - Max packet count
  - Duration (seconds)
- **Buttons:** Start Capture, Stop, Save (.pcap)
- **Business Logic:**
  - Uses tcpdump/libpcap under the hood
  - BPF (Berkeley Packet Filter) syntax for filtering
  - Captured packets can be downloaded as .pcap for analysis in Wireshark
  - Capture runs for specified duration or packet count, whichever comes first
  - Can impact system performance during active capture

---

## Summary: CRUD Operations by Page

| # | Page | Create | Read | Update | Delete | Other |
|---|------|--------|------|--------|--------|-------|
| 1 | Static Route | ✅ | ✅ | ✅ | ✅ | — |
| 2 | Firewall Create | ✅ | — | — | — | Save rule |
| 3 | Firewall Manage | — | ✅ | ✅ | ✅ | Move up/down |
| 4 | DoS Settings | — | ✅ | ✅ | — | Update thresholds |
| 5 | DoS Bypass | ✅ | ✅ | — | ✅ | — |
| 6 | Free Sites | ✅ | ✅ | — | ✅ | — |
| 7 | Manage DHCP | — | ✅ | ✅ | — | Start/Stop, Autostart |
| 8 | IP Leasing Report | — | ✅ | — | — | Search/filter |
| 9 | Services | — | ✅ | ✅ | — | Start/Stop/Restart |
| 10 | Console | — | — | ✅ | — | Change password |
| 11 | Backup | — | ✅ | — | — | Backup/Download |
| 12 | Backup Schedule | — | ✅ | ✅ | — | Save schedule |
| 13 | Restore | — | — | ✅ | — | Upload file |
| 14 | Auto Purge | — | ✅ | ✅ | — | Save config |
| 15 | Manual Purge | — | — | ✅ | ✅ | Purge by date |
| 16 | Migrate User | — | — | ✅ | — | Upload CSV |
| 17 | Auth Logs | — | ✅ | — | — | Download/Live View |
| 18 | CS Parameters | — | ✅ | ✅ | — | Save config |
| 19 | Customized Images | ✅ | ✅ | — | ✅ | Upload/Preview |
| 20 | Forgot Password | — | ✅ | ✅ | — | Save config |
| 21 | ClientGUI URLs | — | ✅ | ✅ | — | Save URLs |
| 22 | Webservice Config | — | ✅ | ✅ | — | Save config |
| 23 | Password Config | — | ✅ | ✅ | — | Save policy |
| 24 | Configuration | — | ✅ | ✅ | — | Save config |
| 25 | ACL Access Control | — | ✅ | ✅ | — | Toggle permissions |
| 26 | ACL User Type | ✅ | ✅ | ✅ | ✅ | — |
| 27 | ACL User Access | — | ✅ | ✅ | — | — |
| 28 | Console ACL | — | ✅ | ✅ | — | — |
| 29 | DDNS Register Host | ✅ | — | — | — | Register |
| 30 | DDNS Manage Hosts | — | ✅ | ✅ | ✅ | Update IP |
| 31 | CP Create | ✅ | — | — | — | Save/Preview |
| 32 | CP Manage | — | ✅ | ✅ | ✅ | Import |
| 33 | CP Client Page | — | ✅ | ✅ | — | Map templates |
| 34 | CP Portal Networks | ✅ | ✅ | ✅ | ✅ | — |
| 35 | CP Leased Line Page | — | ✅ | ✅ | — | Assign template |
| 36 | CP Messages | — | ✅ | ✅ | — | Edit text |
| 37 | CP Portal Config | — | ✅ | ✅ | — | Save config |
| 38 | CP Configure Profile | ✅ | ✅ | ✅ | ✅ | — |
| 39 | CP Security Config | — | ✅ | ✅ | — | Save config |
| 40 | CP Social Media | — | ✅ | ✅ | — | Enable platforms |
| 41 | CP Registration Policy | — | ✅ | ✅ | — | Save policy |
| 42 | NAS IP Config | ✅ | ✅ | ✅ | ✅ | — |
| 43 | Radius Config | — | ✅ | ✅ | — | Save global settings |
| 44 | NAS Configuration | ✅ | ✅ | ✅ | ✅ | — |
| 45 | NAS Preferences | — | ✅ | ✅ | — | Save preferences |
| 46 | NAS Connectivity | — | ✅ | — | — | Test connection |
| 47 | NAS Client Config | ✅ | ✅ | ✅ | ✅ | — |
| 48 | Attribute Mapping | ✅ | ✅ | ✅ | ✅ | — |
| 49 | Add Device | ✅ | — | — | — | — |
| 50 | Manage Devices | — | ✅ | ✅ | ✅ | — |
| 51 | Device Logs | — | ✅ | — | — | Search/filter |
| 52 | System Settings | — | ✅ | ✅ | — | Save settings |
| 53 | Dashboard Conf | — | ✅ | ✅ | — | Edit layout |
| 54 | Packet Capture | — | — | — | — | Start/Stop/Save |

---

## Servlet/Form Action Mapping

| Servlet | Pages |
|---------|-------|
| `FirewallManager` | Firewall Create, Manage |
| `GeneralRuleManager` | DoS Settings, DoS Bypass |
| `FreeSitesManager` | Free Sites |
| `DHCPManager` | Manage DHCP |
| `ServiceControlManager` | Services |
| `ConsolePasswordManager` | Console |
| `BackupDataManager` | Backup, Backup Schedule |
| `PurgeDataManager` | Auto Purge, Manual Purge |
| `getcsv.do` (Spring) | Migrate User |
| `RouteManager` | Static Route |
| `passwordconfig.do` (Spring) | Password Config |
| `manageconfig.do` (Spring) | Client Configuration |
| `messagemanagement.do` (Spring) | Portal Messages |
| `portalconfiguration.do` (Spring) | Portal Config |
| `securityconfiguration.do` (Spring) | CP Security |
| `socialmediaconfig.do` (Spring) | Social Media |
| `selfregistrationpolicy.do` (Spring) | CP Registration Policy |

---

## Key Business Logic Patterns

1. **Form Submission:** Most pages use HTML form POST to a servlet (e.g., `/servlet/FirewallManager`) or Spring MVC controller (e.g., `/system/passwordconfig.do`).

2. **Mode Parameter:** Most forms include a `mode` hidden field that indicates the operation type (create/update/delete/insert).

3. **Checkbox Selection:** Tables with multiple rows use checkboxes (`select` or `chkSelectAll`) for bulk operations like delete.

4. **Date Handling:** Date fields use a hidden `startdate`/`enddate` field + visible `displaystartdate`/`displayenddate` text input with a date picker.

5. **Radio vs Select:** Protocol uses radio (single choice), action uses select dropdown, time-based rules use radio (Yes/No).

6. **Per-Interface/Pool Configuration:** DHCP, Captive Portal, and Leased Line pages operate per network interface or IP pool, not globally.

7. **File Upload:** Backup restore and CSV migration use file upload inputs with form `enctype="multipart/form-data"`.

8. **Download:** Backup download and log download use direct links or button-triggered downloads.

9. **Auto-Restart:** Services can be configured to auto-start on boot (checkbox toggle per service).

10. **Purge by Date:** Both auto-purge and manual purge work by specifying a date — data older than that date is deleted.
