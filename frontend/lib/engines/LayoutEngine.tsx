/**
 * DQ Orbit — Layout Engine
 * 
 * Wraps React Grid Layout to provide drag-and-drop dashboard layouts.
 * Users can reorganize widgets and save their preferred arrangement.
 */
"use client";

import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import type { WidgetConfig, WidgetSize } from "./WidgetEngine";
import { fetchFromApiClient } from "@/lib/api.client";

// Grid layout position type
export type LayoutItem = {
  i: string;     // Widget ID
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
  static?: boolean;
};

// Size to grid dimensions mapping
const SIZE_TO_GRID: Record<WidgetSize, { w: number; h: number; minW: number; minH: number }> = {
  sm:   { w: 1, h: 2, minW: 1, minH: 2 },
  md:   { w: 2, h: 3, minW: 1, minH: 2 },
  lg:   { w: 3, h: 3, minW: 2, minH: 2 },
  xl:   { w: 4, h: 4, minW: 2, minH: 3 },
  full: { w: 4, h: 3, minW: 4, minH: 2 },
};

/**
 * Generate default grid layout from widget configs.
 * Auto-positions widgets in a 4-column grid, flowing left-to-right.
 */
export function generateDefaultLayout(widgets: WidgetConfig[], columns: number = 4): LayoutItem[] {
  let currentX = 0;
  let currentY = 0;
  let maxHeightInRow = 0;

  return widgets.map((widget) => {
    const gridDims = widget.gridPosition
      ? { w: widget.gridPosition.w, h: widget.gridPosition.h, minW: 1, minH: 2 }
      : SIZE_TO_GRID[widget.size] || SIZE_TO_GRID.md;

    // If widget doesn't fit in current row, move to next row
    if (currentX + gridDims.w > columns) {
      currentX = 0;
      currentY += maxHeightInRow;
      maxHeightInRow = 0;
    }

    const item: LayoutItem = {
      i: widget.id,
      x: widget.gridPosition?.x ?? currentX,
      y: widget.gridPosition?.y ?? currentY,
      w: gridDims.w,
      h: gridDims.h,
      minW: gridDims.minW,
      minH: gridDims.minH,
    };

    currentX += gridDims.w;
    maxHeightInRow = Math.max(maxHeightInRow, gridDims.h);

    return item;
  });
}

/**
 * Persist layout to localStorage (temporary) and optionally to DB.
 */
export function saveLayout(dashboardId: string, layout: LayoutItem[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(`dqorbit_layout_${dashboardId}`, JSON.stringify(layout));
}

/**
 * Load persisted layout from localStorage.
 */
export function loadLayout(dashboardId: string): LayoutItem[] | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(`dqorbit_layout_${dashboardId}`);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

/**
 * Save layout to the backend API (DB persistence).
 * Will be called when user explicitly saves their arrangement.
 */
export async function saveLayoutToServer(
  dashboardId: string, 
  layout: LayoutItem[]
): Promise<boolean> {
  try {
    const data = await fetchFromApiClient("/api/settings/dashboard-layout", {
      method: "POST",
      body: JSON.stringify({ dashboard_id: dashboardId, layout }),
    });
    return !!data;
  } catch {
    return false;
  }
}

// ─── Layout Container Component ─────────────────────────────────

type LayoutEngineProps = {
  dashboardId: string;
  widgets: WidgetConfig[];
  children: (widget: WidgetConfig, index: number) => React.ReactNode;
  editable?: boolean;
  columns?: number;
  rowHeight?: number;
  gap?: number;
};

export default function LayoutEngine({
  dashboardId,
  widgets,
  children,
  editable = false,
  columns = 4,
  gap = 16,
}: LayoutEngineProps) {
  // Load persisted layout or generate default
  const [layout, setLayout] = useState<LayoutItem[]>(() => {
    return loadLayout(dashboardId) || generateDefaultLayout(widgets, columns);
  });

  const handleLayoutChange = useCallback(
    (newLayout: LayoutItem[]) => {
      setLayout(newLayout);
      if (editable) {
        saveLayout(dashboardId, newLayout);
      }
    },
    [dashboardId, editable]
  );

  // For now, render in a CSS grid. React Grid Layout drag-drop
  // will be activated when editable mode is toggled.
  return (
    <div
      className="grid gap-4"
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gap: `${gap}px`,
      }}
    >
      {widgets.map((widget, index) => {
        const item = layout.find((l) => l.i === widget.id);
        const colSpan = item?.w || SIZE_TO_GRID[widget.size]?.w || 2;

        return (
          <motion.div
            key={widget.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            style={{
              gridColumn: `span ${Math.min(colSpan, columns)}`,
            }}
          >
            {children(widget, index)}
          </motion.div>
        );
      })}
    </div>
  );
}
