"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/custom";
import { Button, Footer } from "@/components/ui";
import { Navigation } from "@/components/navigation";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Detect if we're on mobile screen size
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const isLargeScreen = useMediaQuery("(min-width: 1280px)");

  // Handle resizing effects
  useEffect(() => {
    if (isDesktop) {
      // Auto-collapse sidebar on medium screens
      setSidebarOpen(isLargeScreen);
    } else {
      // Always close mobile sidebar when switching to mobile view
      setMobileSidebarOpen(false);
    }
  }, [isDesktop, isLargeScreen]);

  // Auto-collapse sidebar on Settings pages
  useEffect(() => {
    if (!isDesktop) return;
    // Match both /settings and /orgs/[org_slug]/settings patterns
    const isSettingsPage = pathname.includes("/settings");
    if (isSettingsPage) {
      setSidebarOpen(false);
    }
  }, [pathname, isDesktop]);

  // Close mobile sidebar on navigation
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex flex-col min-h-screen h-screen overflow-hidden">
      {/* Mobile top navigation for collapsed view */}
      {mounted && !isDesktop && (
        <div className="border-b border-shark-gray-200 bg-[#FEFCFB] dark:bg-shark-gray-900 sticky top-0 z-30">
          <div className="flex h-16 items-center px-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden mr-2"
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex-1 flex justify-center">
              <h1 className="text-lg font-semibold">Nido</h1>
            </div>
            <div className="w-10"></div> {/* Spacer for balance */}
          </div>
        </div>
      )}

      {/* Main layout with sidebar and content area */}
      <div className="flex flex-1 overflow-hidden h-[calc(100vh-4rem)] md:h-screen">
        {/* Sidebar - hidden on mobile until toggled, conditional rendering based on screens */}
        <div
          className={cn(
            isDesktop ? "relative" : "fixed inset-y-0 left-0 z-40",
            !isDesktop && !mobileSidebarOpen && "hidden",
            "h-full"
          )}
        >
          <Navigation
            collapsed={isDesktop && !sidebarOpen}
            onToggleCollapse={() => setSidebarOpen(!sidebarOpen)}
          />
        </div>

        {/* Mobile overlay backdrop */}
        {!isDesktop && mobileSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}

        {/* Main content area */}
        <div className="flex flex-col flex-1 overflow-auto w-full bg-subtle-gradient">
          <main className="flex-1 h-full min-h-0 overflow-y-auto m-10 flex items-center justify-center">
            <div className="w-full max-w-full">{children}</div>
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
}
