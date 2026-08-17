/**
 * DQ Orbit — Widget Engine
 * 
 * Core rendering engine that interprets dashboard JSON configurations
 * and renders the corresponding widgets. This is the heart of the framework.
 * 
 * Instead of coding dashboards in JSX:
 *   <SalesChart /> <CustomerChart /> <ForecastChart />
 * 
 * Each dashboard is a JSON config that the Widget Engine interprets.
 */
"use client";

import React, { Suspense, lazy } from "react";

// ─── Widget Type Definitions ────────────────────────────────────

export type WidgetType =
  | "kpi"
  | "line-chart"
  | "bar-chart"
  | "pie-chart"
  | "radar-chart"
  | "heatmap"
  | "sankey"
  | "treemap"
  | "table"
  | "insight"
  | "ai-panel"
  | "narrative"
  | "gauge"
  | "funnel";

export type WidgetSize = "sm" | "md" | "lg" | "xl" | "full";

export type WidgetConfig = {
  id: string;
  type: WidgetType;
  title: string;
  subtitle?: string;
  
  // Data binding
  metric: string;              // API endpoint path or metric key
  params?: Record<string, string>; // Additional query params
  
  // Layout hints (used by LayoutEngine)
  size: WidgetSize;
  gridPosition?: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  
  // Drill configuration reference
  drillConfig?: string;        // Key in DRILL_CONFIGS (e.g., "fecha")
  drillThrough?: {
    type: "route" | "ai";
    target: string;
  };
  
  // Cross-filter: which dimension does clicking on this widget filter?
  filterDimension?: string;
  
  // Visual config
  chartConfig?: {
    xField?: string;
    yField?: string;
    seriesField?: string;
    colorField?: string;
    valueField?: string;
    labelField?: string;
    stacked?: boolean;
    smooth?: boolean;
    showLegend?: boolean;
    orientation?: "horizontal" | "vertical";
  };
  
  // KPI-specific
  kpiConfig?: {
    format: "currency" | "percent" | "number" | "days";
    currency?: string;
    trend?: {
      field: string;
      format: "percent" | "absolute";
    };
    narrative?: string;        // Storytelling template
    severity?: "success" | "warning" | "danger" | "neutral";
  };
  
  // Table-specific
  tableConfig?: {
    columns: {
      key: string;
      label: string;
      format?: "currency" | "percent" | "number" | "date" | "text";
      sortable?: boolean;
      width?: string;
    }[];
    groupBy?: string;
    expandable?: boolean;
    maxRows?: number;
    virtualScroll?: boolean;
  };
};

export type DashboardConfig = {
  id: string;
  name: string;
  description: string;
  domain: string;              // "sales" | "finance" | "inventory" | "supply" | "home"
  version: string;
  
  // Widgets to render
  widgets: WidgetConfig[];
  
  // Global dashboard-level filters
  defaultFilters?: Record<string, string>;
  
  // Dashboard-level drill configuration
  drillConfigs?: string[];
  
  // Layout: responsive breakpoints
  layout?: {
    columns: number;
    rowHeight: number;
    gap: number;
  };
};

// ─── Widget Registry ────────────────────────────────────────────

// Lazy-load widgets for code splitting
const KpiWidget = lazy(() => import("@/lib/widgets/KpiWidget"));
const ChartWidget = lazy(() => import("@/lib/widgets/ChartWidget"));
const TableWidget = lazy(() => import("@/lib/widgets/TableWidget"));
const InsightWidget = lazy(() => import("@/lib/widgets/InsightWidget"));

const WIDGET_REGISTRY: Record<WidgetType, React.LazyExoticComponent<React.ComponentType<{ config: WidgetConfig; data: unknown }>>> = {
  "kpi": KpiWidget,
  "line-chart": ChartWidget,
  "bar-chart": ChartWidget,
  "pie-chart": ChartWidget,
  "radar-chart": ChartWidget,
  "heatmap": ChartWidget,
  "sankey": ChartWidget,
  "treemap": ChartWidget,
  "gauge": ChartWidget,
  "funnel": ChartWidget,
  "table": TableWidget,
  "insight": InsightWidget,
  "ai-panel": InsightWidget,  // Will be replaced with dedicated AiWidget
  "narrative": InsightWidget,
};

// ─── Widget Loading Skeleton ────────────────────────────────────

function WidgetSkeleton({ config }: { config: WidgetConfig }) {
  const sizeClasses: Record<WidgetSize, string> = {
    sm: "col-span-1",
    md: "col-span-1 md:col-span-2",
    lg: "col-span-1 md:col-span-2 lg:col-span-3",
    xl: "col-span-1 md:col-span-2 lg:col-span-4",
    full: "col-span-full",
  };

  return (
    <div className={`${sizeClasses[config.size]} rounded-xl border border-border bg-card p-6 animate-pulse`}>
      <div className="h-4 w-1/3 rounded bg-muted mb-4" />
      <div className="h-32 rounded bg-muted" />
    </div>
  );
}

// ─── Single Widget Renderer ─────────────────────────────────────

export function RenderWidget({ config, data }: { config: WidgetConfig; data: unknown }) {
  const WidgetComponent = WIDGET_REGISTRY[config.type];
  
  if (!WidgetComponent) {
    return (
      <div className="rounded-xl border border-destructive/50 bg-card p-6">
        <p className="text-sm text-destructive">Widget type &quot;{config.type}&quot; not registered</p>
      </div>
    );
  }
  
  return (
    <Suspense fallback={<WidgetSkeleton config={config} />}>
      <WidgetComponent config={config} data={data} />
    </Suspense>
  );
}

// ─── Size Mapping ───────────────────────────────────────────────

export function getWidgetGridClass(size: WidgetSize): string {
  const map: Record<WidgetSize, string> = {
    sm: "col-span-1",
    md: "col-span-1 md:col-span-2",
    lg: "col-span-1 md:col-span-2 lg:col-span-3",
    xl: "col-span-1 md:col-span-2 lg:col-span-4",
    full: "col-span-full",
  };
  return map[size] || map.md;
}
