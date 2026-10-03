"use client";

import * as React from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { Footer } from "./Footer";
import { useAppStore } from "@/lib/store";
import { findChild } from "@/lib/nav";
import { DashboardView } from "./views/DashboardView";
import { SystemView } from "./views/SystemView";
import { PolicyView } from "./views/PolicyView";
import { PackageView } from "./views/PackageView";
import { PaymentGatewayView } from "./views/PaymentGatewayView";
import { UserView } from "./views/UserView";
import { TicketView } from "./views/TicketView";
import { SalesView } from "./views/SalesView";
import { InventoryView } from "./views/InventoryView";
import { AlertView } from "./views/AlertView";
import { OttView } from "./views/OttView";
import { PaymentTrackingView } from "./views/PaymentTrackingView";
import { WebSurfingView } from "./views/WebSurfingView";
import { NetKaptureView } from "./views/NetKaptureView";
import { ReportsView } from "./views/ReportsView";
import { HelpView } from "./views/HelpView";
import { ModuleOverview } from "./views/ModuleOverview";
import { ChildOverview } from "./views/ChildOverview";
import { LeafPlaceholder } from "./views/_shared";

export function AppShell() {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const activeModule = useAppStore((s) => s.activeModule);
  const activeChild = useAppStore((s) => s.activeChild);
  const activeGrandchild = useAppStore((s) => s.activeGrandchild);

  const renderView = () => {
    if (activeModule === "home" || activeModule === "dashboard") {
      return <DashboardView />;
    }

    const viewProps = {
      moduleId: activeModule,
      childId: activeChild,
      grandchildId: activeGrandchild,
    };

    // ── 3-level routing ──────────────────────────────────────────────
    // If a child is selected AND that child has grandchildren, the
    // grandchildren are routed centrally here (ChildOverview / LeafPlaceholder)
    // so individual module views don't each need to handle grandchildren.
    if (activeChild) {
      const child = findChild(activeModule, activeChild);
      if (child && child.grandchildren && child.grandchildren.length > 0) {
        if (!activeGrandchild) {
          return <ChildOverview moduleId={activeModule} childId={activeChild} />;
        }
        return (
          <LeafPlaceholder
            moduleId={activeModule}
            childId={activeChild}
            grandchildId={activeGrandchild}
          />
        );
      }
    }

    // Otherwise delegate to the module view (handles module overview +
    // children WITHOUT grandchildren).
    switch (activeModule) {
      case "system":
        return <SystemView {...viewProps} />;
      case "policy":
        return <PolicyView {...viewProps} />;
      case "package":
        return <PackageView {...viewProps} />;
      case "payment-gateway":
        return <PaymentGatewayView {...viewProps} />;
      case "user":
        return <UserView {...viewProps} />;
      case "ticket":
        return <TicketView {...viewProps} />;
      case "sales":
        return <SalesView {...viewProps} />;
      case "inventory":
        return <InventoryView {...viewProps} />;
      case "alert":
        return <AlertView {...viewProps} />;
      case "ott":
        return <OttView {...viewProps} />;
      case "payment-tracking":
        return <PaymentTrackingView {...viewProps} />;
      case "web-surfing":
        return <WebSurfingView {...viewProps} />;
      case "net-kapture":
        return <NetKaptureView {...viewProps} />;
      case "reports":
        return <ReportsView {...viewProps} />;
      case "help":
        return <HelpView {...viewProps} />;
      default:
        return <ModuleOverview {...viewProps} />;
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-muted/20">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-1 flex-col lg:pl-72">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1600px]">{renderView()}</div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
