"use client";

import { SidebarNav } from "./sidebar-nav";
import { useState } from "react";

type NavigationProps = {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
};

export function Navigation({ collapsed = false }: NavigationProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(collapsed);

  // Update internal state when props change
  if (sidebarCollapsed !== collapsed) {
    setSidebarCollapsed(collapsed);
  }

  return <SidebarNav collapsed={sidebarCollapsed} />;
}

export { SidebarNav } from "./sidebar-nav";
