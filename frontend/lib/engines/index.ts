/**
 * DQ Orbit — Dashboard Framework
 * 
 * Central export for all engines.
 * Import from '@/lib/engines' to access any engine.
 */

// Core Engines
export { useFilterEngine } from "./FilterEngine";
export type { ActiveFilter, FilterDimension, FilterValue } from "./FilterEngine";

export { applyTheme, getChartPalette, DEFAULT_THEME, LIGHT_THEME } from "./ThemeEngine";
export type { DQOrbitTheme } from "./ThemeEngine";

export { DRILL_CONFIGS, getNextDrillLevel, getDrillBreadcrumb, buildDrillThroughAiPrompt } from "./DrillEngine";
export type { DrillConfig, DrillLevel, DrillThroughConfig, DrillThroughTarget } from "./DrillEngine";

export { RenderWidget, getWidgetGridClass } from "./WidgetEngine";
export type { WidgetConfig, WidgetType, WidgetSize, DashboardConfig } from "./WidgetEngine";

export { generateDefaultLayout, saveLayout, loadLayout, saveLayoutToServer } from "./LayoutEngine";
export type { LayoutItem } from "./LayoutEngine";
export { default as LayoutEngine } from "./LayoutEngine";

export { default as DashboardRenderer } from "./DashboardRenderer";
