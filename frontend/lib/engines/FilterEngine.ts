/**
 * DQ Orbit — Filter Engine
 * 
 * Global cross-filtering state store using Zustand.
 * All widgets subscribe to this store and react to filter changes.
 * 
 * When a user clicks on "Chile" in a chart, ALL widgets update:
 * sales, finance, inventory, supply — everything filters simultaneously.
 */
import { create } from "zustand";

export type FilterDimension =
  | "country"
  | "customer"
  | "sales_rep"
  | "item_class"
  | "location"
  | "period"
  | "subsidiary"
  | string; // extensible

export type FilterValue = string | number | Date | null;

export type ActiveFilter = {
  dimension: FilterDimension;
  value: FilterValue;
  label: string;         // Human-readable label for UI display
  source?: string;       // Widget ID that triggered this filter
};

export type DrillLevel = {
  dimension: string;
  value: FilterValue;
  label: string;
};

type FilterState = {
  // Active cross-filters (shared across all widgets)
  filters: ActiveFilter[];
  
  // Drill-down breadcrumb stack
  drillStack: DrillLevel[];
  
  // Date range (global time filter)
  dateFrom: string | null;
  dateTo: string | null;
  
  // Actions
  setFilter: (filter: ActiveFilter) => void;
  removeFilter: (dimension: FilterDimension) => void;
  clearAllFilters: () => void;
  toggleFilter: (filter: ActiveFilter) => void;
  
  // Drill actions
  drillDown: (level: DrillLevel) => void;
  drillUp: () => void;
  resetDrill: () => void;
  
  // Date range
  setDateRange: (from: string | null, to: string | null) => void;
  
  // Query builder: builds query params from active state
  buildQueryParams: () => Record<string, string>;
};

export const useFilterEngine = create<FilterState>((set, get) => ({
  filters: [],
  drillStack: [],
  dateFrom: null,
  dateTo: null,
  
  setFilter: (filter) =>
    set((state) => ({
      filters: [
        ...state.filters.filter((f) => f.dimension !== filter.dimension),
        filter,
      ],
    })),
  
  removeFilter: (dimension) =>
    set((state) => ({
      filters: state.filters.filter((f) => f.dimension !== dimension),
    })),
  
  clearAllFilters: () =>
    set({ filters: [], drillStack: [], dateFrom: null, dateTo: null }),
  
  toggleFilter: (filter) =>
    set((state) => {
      const exists = state.filters.find(
        (f) => f.dimension === filter.dimension && f.value === filter.value
      );
      if (exists) {
        return { filters: state.filters.filter((f) => f.dimension !== filter.dimension) };
      }
      return {
        filters: [
          ...state.filters.filter((f) => f.dimension !== filter.dimension),
          filter,
        ],
      };
    }),
  
  drillDown: (level) =>
    set((state) => ({
      drillStack: [...state.drillStack, level],
    })),
  
  drillUp: () =>
    set((state) => ({
      drillStack: state.drillStack.slice(0, -1),
    })),
  
  resetDrill: () => set({ drillStack: [] }),
  
  setDateRange: (from, to) => set({ dateFrom: from, dateTo: to }),
  
  buildQueryParams: () => {
    const state = get();
    const params: Record<string, string> = {};
    
    state.filters.forEach((f) => {
      if (f.value !== null && f.value !== undefined) {
        params[f.dimension] = String(f.value);
      }
    });
    
    if (state.dateFrom) params["date_from"] = state.dateFrom;
    if (state.dateTo) params["date_to"] = state.dateTo;
    
    // Add drill context
    if (state.drillStack.length > 0) {
      const current = state.drillStack[state.drillStack.length - 1];
      params["drill_dimension"] = current.dimension;
      params["drill_value"] = String(current.value);
    }
    
    return params;
  },
}));
