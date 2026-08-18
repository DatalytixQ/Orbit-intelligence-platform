/**
 * DQ Orbit — Dashboard Renderer
 * 
 * The master component that ties all engines together.
 * Takes a DashboardConfig JSON and renders a fully interactive dashboard.
 * 
 * This replaces hardcoded page.tsx files with a single, reusable renderer.
 */
"use client";

import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LayoutEngine from "@/lib/engines/LayoutEngine";
import { RenderWidget, type DashboardConfig, type WidgetConfig } from "@/lib/engines/WidgetEngine";
import { useFilterEngine, type ActiveFilter } from "@/lib/engines/FilterEngine";
import { X, Filter, RotateCcw } from "lucide-react";
import { fetchFromApiClient } from "@/lib/api.client";

type DashboardRendererProps = {
  config: DashboardConfig;
  initialData: Record<string, unknown>;
  editable?: boolean;
};

export default function DashboardRenderer({
  config,
  initialData,
  editable = false,
}: DashboardRendererProps) {
  const { filters, clearAllFilters, removeFilter } = useFilterEngine();
  const [widgetData, setWidgetData] = useState<Record<string, unknown>>(initialData);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Re-fetch widget data when filters change
  const refreshData = useCallback(async () => {
    if (filters.length === 0) {
      setWidgetData(initialData);
      return;
    }

    setIsRefreshing(true);
    try {
      // Build filter query params
      const filterParams = new URLSearchParams();
      filters.forEach((f) => {
        if (f.value !== null && f.value !== undefined) {
          filterParams.set(f.dimension, String(f.value));
        }
      });
      const qs = filterParams.toString();

      // Fetch all widget data in parallel with filters applied
      const entries = await Promise.all(
        config.widgets.map(async (w) => {
          try {
            const separator = w.metric.includes("?") ? "&" : "?";
            const url = `${w.metric}${qs ? `${separator}${qs}` : ""}`;
            const data = await fetchFromApiClient(url, {
              cache: "no-store",
            });
            return [w.id, data] as const;
          } catch {
            return [w.id, null] as const;
          }
        })
      );

      const newData: Record<string, unknown> = {};
      entries.forEach(([id, data]) => {
        newData[id] = data;
      });
      setWidgetData(newData);
    } catch (err) {
      console.error("Error refreshing dashboard data:", err);
    } finally {
      setIsRefreshing(false);
    }
  }, [filters, initialData, config.widgets]);

  useEffect(() => {
    if (filters.length > 0) {
      refreshData();
    } else {
      setWidgetData(initialData);
    }
  }, [filters, refreshData, initialData]);

  return (
    <div className="space-y-4">
      {/* Active Filters Bar */}
      <AnimatePresence>
        {filters.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 flex-wrap rounded-xl border border-border bg-card/50 backdrop-blur-sm px-4 py-3"
          >
            <Filter size={14} className="text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider mr-2">
              Filtros activos
            </span>

            {filters.map((f: ActiveFilter) => (
              <motion.button
                key={f.dimension}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => removeFilter(f.dimension)}
                className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
              >
                <span className="capitalize">{f.dimension}:</span>
                <span className="font-semibold">{f.label}</span>
                <X size={12} />
              </motion.button>
            ))}

            <button
              onClick={clearAllFilters}
              className="ml-auto inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <RotateCcw size={12} />
              Limpiar todo
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading overlay */}
      {isRefreshing && (
        <div className="fixed top-0 left-0 right-0 z-50 h-1">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.5 }}
          />
        </div>
      )}

      {/* Widget Grid */}
      <LayoutEngine
        dashboardId={config.id}
        widgets={config.widgets}
        editable={editable}
        columns={config.layout?.columns || 4}
        gap={config.layout?.gap || 16}
      >
        {(widget: WidgetConfig) => (
          <RenderWidget
            config={widget}
            data={widgetData[widget.id] ?? initialData[widget.id] ?? null}
          />
        )}
      </LayoutEngine>
    </div>
  );
}
