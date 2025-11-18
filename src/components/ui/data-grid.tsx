"use client";

import { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { AgGridReact, AgGridReactProps } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import type { GridReadyEvent as GridReadyEventCommunity } from "ag-grid-community";

import { cn } from "@/lib/utils";
import { skriftGridTheme, skriftGridThemeDark } from "@/lib/ag-grid-theme";

// Register all AG Grid community modules
ModuleRegistry.registerModules([AllCommunityModule]);

interface DataGridProps {
  columnDefs: Record<string, unknown>[];
  rowData: Record<string, unknown>[];
  className?: string;
  pagination?: boolean;
  defaultColDef?: Record<string, unknown>;
  onRowClicked?: (event: { data: Record<string, unknown> }) => void;
  height?: string | number;
  onGridReady?: (params: GridReadyEventCommunity) => void;
  getRowHeight?: (params: { data: Record<string, unknown> }) => number;
  /** Optional empty state node to render when there are no rows */
  emptyState?: React.ReactNode;
  /** Whether the data is currently loading */
  isLoading?: boolean;
}

/**
 * Data Grid component using AG Grid
 *
 * @param columnDefs - Column definitions for the grid
 * @param rowData - Data to display in the grid
 * @param className - Additional CSS classes
 * @param pagination - Whether to show pagination controls
 * @param defaultColDef - Default column configuration
 * @param height - Optional height for the grid (default is 500px)
 * @param getRowHeight - Optional function to determine row height
 * @param isLoading - Whether the data is currently loading
 * @param skeletonConfig - Custom skeleton configuration
 */
export function DataGrid({
  columnDefs,
  rowData,
  className,
  pagination = false,
  defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  },
  onRowClicked,
  height = "500px",
  getRowHeight,
  emptyState,
  ...props
}: DataGridProps & AgGridReactProps) {
  // State to handle client-side rendering
  const [isClient, setIsClient] = useState(false);
  // Theme state - only use after client is ready
  const { resolvedTheme } = useTheme();
  const isDarkTheme = isClient && resolvedTheme === "dark";
  // Reference to the grid container
  const gridContainerRef = useRef<HTMLDivElement>(null);

  // This ensures AG Grid only renders on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Ensure AG Grid doesn't enforce a 150px min-height on short datasets
  useEffect(() => {
    if (typeof document === "undefined") return;
    const id = "skrift-aggrid-minheight-override";
    if (!document.getElementById(id)) {
      const style = document.createElement("style");
      style.id = id;
      style.innerHTML = `
        .ag-center-cols-viewport { min-height: 0 !important; }
        .ag-center-cols-container { min-height: 0 !important; }
        .ag-paging-panel { padding-top: 12px !important; padding-bottom: 12px !important; min-height: 48px !important; }
      `;
      document.head.appendChild(style);
    }
  }, []);

  // Only render AG Grid on the client
  if (!isClient) {
    return (
      <div
        className={cn(
          "w-full flex items-center justify-center bg-muted",
          className
        )}
        style={{ height }}
      >
        Loading data grid...
      </div>
    );
  }

  // Render a shared empty state when there are no rows and an emptyState is provided
  const isEmpty = !rowData || rowData.length === 0;
  if (isEmpty && emptyState) {
    return (
      <div
        className={cn("w-full flex-1 rounded-md overflow-hidden", className)}
        style={{ minHeight: height }}
      >
        <div className="h-full w-full flex items-center justify-center">
          {emptyState}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={gridContainerRef}
      className={cn("w-full flex-1 rounded-md overflow-hidden", className)}
      style={{ minHeight: height }}
    >
      <AgGridReact
        columnDefs={columnDefs}
        rowData={rowData}
        defaultColDef={defaultColDef}
        pagination={pagination}
        onRowClicked={onRowClicked}
        animateRows={true}
        suppressMovableColumns={false}
        suppressCellFocus={true}
        domLayout="autoHeight"
        enableCellTextSelection={true}
        theme={isDarkTheme ? skriftGridThemeDark : skriftGridTheme}
        getRowHeight={getRowHeight}
        {...props}
      />
    </div>
  );
}
