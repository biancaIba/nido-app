"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Settings, ChevronDown, School } from "lucide-react";

import siteConfig from "@/config/site-navigation.json";
import { cn } from "@/lib/utils";

// Map icon strings to components
const iconMap = {
  Home,
  School,
  Settings,
};

type NavItem = {
  id: string;
  label: string;
  path?: string;
  icon?: string;
  action?: string;
  description?: string;
  roles?: string[];
  children?: NavItem[];
};

type SidebarNavProps = {
  className?: string;
  collapsed?: boolean;
};

export function SidebarNav({ className, collapsed = false }: SidebarNavProps) {
  const pathname = usePathname();

  const mainNavItems = siteConfig.navigation.mainNav;

  /**
   * Determines if a navigation item should be marked as active.
   * Handles both exact matches and hierarchical routes (parent stays active in child routes).
   */
  const isActive = (path?: string) => {
    if (!path || !pathname) return false;
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  const renderNavItem = (
    item: NavItem,
    isChild: boolean = false,
    level: number = 0
  ) => {
    const hasChildren = item.children && item.children.length > 0;
    const IconComponent = item.icon
      ? iconMap[item.icon as keyof typeof iconMap]
      : null;

    return (
      <li key={item.id} className={cn("relative", isChild ? "ml-4" : "")}>
        <div className="flex items-center">
          {item.path ? (
            <Link
              href={item.path}
              className={cn(
                "flex items-center h-10 px-3 rounded-lg text-sm font-medium leading-none transition-colors w-full",
                collapsed ? "gap-0" : "gap-2",
                isActive(item.path)
                  ? "bg-blue-violet-500 text-white shadow-xs"
                  : "text-shark-gray-600 hover:text-shark-gray-800 hover:bg-shark-gray-100"
              )}
              onClick={
                hasChildren
                  ? (e) => {
                      if (!isChild) {
                        e.preventDefault();
                      }
                    }
                  : isChild
                  ? undefined
                  : undefined
              }
            >
              {IconComponent && (
                <IconComponent
                  className={cn(
                    "h-4 w-4 shrink-0",
                    isActive(item.path) ? "text-white" : ""
                  )}
                />
              )}
              {!collapsed && <span>{item.label}</span>}
              {hasChildren && !isChild && !collapsed && (
                <ChevronDown className="h-4 w-4 ml-auto transition-transform" />
              )}
            </Link>
          ) : (
            <button
              className={cn(
                "flex items-center h-10 px-3 rounded-lg text-sm font-medium leading-none transition-colors w-full",
                collapsed ? "gap-0" : "gap-2",
                "text-shark-gray-600 hover:text-shark-gray-800 hover:bg-shark-gray-100"
              )}
            >
              {IconComponent && <IconComponent className="h-4 w-4" />}
              {!collapsed && <span>{item.label}</span>}
              {hasChildren && !collapsed && (
                <ChevronDown className="h-4 w-4 ml-auto transition-transform" />
              )}
            </button>
          )}
        </div>

        {hasChildren && item.children && !collapsed && (
          <div className="relative hidden">
            <ul className="mt-1 ml-2 space-y-1">
              {item.children.map((child) =>
                renderNavItem(child, true, level + 1)
              )}
            </ul>
          </div>
        )}
      </li>
    );
  };

  return (
    <aside
      className={cn(
        "flex flex-col h-full bg-[#FEFCFB] dark:bg-shark-gray-900 border-r border-shark-gray-200",
        collapsed ? "w-16" : "w-64",
        "transition-all duration-300 ease-in-out",
        className
      )}
    >
      {/* Main navigation */}
      <nav className="flex-1 flex flex-col justify-between overflow-y-auto py-4 px-3">
        <ul className="space-y-1">
          {mainNavItems.map((item) => renderNavItem(item))}
        </ul>
      </nav>
    </aside>
  );
}
