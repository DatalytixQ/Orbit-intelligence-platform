"use client";

import { useMemo, useState } from "react";

type CriticalItem = {
  item_id: string;
  item_name: string;
  item_class: string;
  stock_available: number;
  quantity_inbound?: number;
  quantity_pending?: number;
  net_stock?: number;
  avg_monthly_qty_3m: number;
  lead_time_days: number;
  target_coverage_months: number;
  stock_coverage_months: number;
  coverage_ratio: number;
  inventory_value: number;
  coverage_status: string;
};

type SlowItem = {
  item_id: string;
  item_name: string;
  item_class: string;
  stock_available: number;
  inventory_value: number;
};

function formatMillions(val?: number | string) {
  if (val === undefined || val === null || val === "") return "-";
  const value = Number(val);
  if (Number.isNaN(value)) return "-";
  if (Math.abs(value) >= 1_000_000) return `$ ${(value / 1_000_000).toFixed(1)} M`;
  if (Math.abs(value) >= 1_000) return `$ ${(value / 1_000).toFixed(0)} K`;
  return `$ ${value.toFixed(0)}`;
}

function shortText(value?: string, max = 34) {
  if (!value) return "-";
  return value.length > max ? `${value.slice(0, max)}…` : value;
}

export default function InventoryDetailTable({ 
  criticalItems,
  slowMovingItems,
  totalSlowMovingUnits
}: { 
  criticalItems: CriticalItem[],
  slowMovingItems: SlowItem[],
  totalSlowMovingUnits: number
}) {
  const [activeTab, setActiveTab] = useState<"CRITICAL" | "SLOW">("CRITICAL");
  const [criticalFilter, setCriticalFilter] = useState("ALL");

  const filteredCriticalItems = useMemo(() => {
    return criticalItems.filter((item) => {
      if (criticalFilter === "ALL") return true;
      if (criticalFilter === "QUIEBRE") return item.coverage_status === "Quiebre Inminente (OV)";
      if (criticalFilter === "ALTA") return item.avg_monthly_qty_3m >= 20 && item.coverage_status !== "Quiebre Inminente (OV)";
      return true;
    }).sort((a, b) => {
      const aDemand = a.avg_monthly_qty_3m >= 20 ? 1 : a.avg_monthly_qty_3m >= 5 ? 2 : 3;
      const bDemand = b.avg_monthly_qty_3m >= 20 ? 1 : b.avg_monthly_qty_3m >= 5 ? 2 : 3;
      if (aDemand !== bDemand) return aDemand - bDemand;
      return (b.inventory_value || 0) - (a.inventory_value || 0);
    });
  }, [criticalItems, criticalFilter]);

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      
      {/* Master Tabs */}
      <div className="flex border-b border-slate-200 bg-slate-50/50">
        <button 
          onClick={() => setActiveTab("CRITICAL")}
          className={`flex-1 py-4 text-sm font-bold tracking-wide transition-colors ${activeTab === "CRITICAL" ? "text-indigo-600 border-b-2 border-indigo-600 bg-white" : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"}`}
        >
          Top Críticos (Riesgo Quiebre)
        </button>
        <button 
          onClick={() => setActiveTab("SLOW")}
          className={`flex-1 py-4 text-sm font-bold tracking-wide transition-colors ${activeTab === "SLOW" ? "text-amber-600 border-b-2 border-amber-600 bg-white" : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"}`}
        >
          Top Inmovilizados (Sin Demanda)
        </button>
      </div>

      {/* Critical Tab Header */}
      {activeTab === "CRITICAL" && (
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <p className="text-sm text-slate-500 font-medium">Universo completo priorizado por quiebres reales y valor</p>
          <div className="flex gap-2">
            <button onClick={() => setCriticalFilter("ALL")} className={`px-3 py-1 rounded-full text-xs font-semibold ${criticalFilter === "ALL" ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>Todos</button>
            <button onClick={() => setCriticalFilter("QUIEBRE")} className={`px-3 py-1 rounded-full text-xs font-semibold ${criticalFilter === "QUIEBRE" ? "bg-rose-600 text-white" : "bg-rose-50 text-rose-600 hover:bg-rose-100"}`}>Quiebres</button>
            <button onClick={() => setCriticalFilter("ALTA")} className={`px-3 py-1 rounded-full text-xs font-semibold ${criticalFilter === "ALTA" ? "bg-amber-500 text-white" : "bg-amber-50 text-amber-600 hover:bg-amber-100"}`}>Alta Demanda</button>
          </div>
        </div>
      )}

      {/* Slow Moving Tab Header */}
      {activeTab === "SLOW" && (
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <p className="text-sm text-slate-500 font-medium">Capital retenido sin salidas físicas en &gt;6 meses</p>
        </div>
      )}

      {/* Tables Container */}
      <div className="flex-1 overflow-auto max-h-[400px]">
        {activeTab === "CRITICAL" ? (
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="px-6 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wider">Ítem / SKU</th>
                <th className="px-6 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wider text-center">Prioridad</th>
                <th className="px-6 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wider text-right">Inbound / OV</th>
                <th className="px-6 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wider text-right">Valor en Riesgo</th>
                <th className="px-6 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wider text-center">Cobertura</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCriticalItems.map((item) => {
                const isHighDemand = item.avg_monthly_qty_3m >= 20;
                const isMediumDemand = item.avg_monthly_qty_3m >= 5 && !isHighDemand;
                return (
                  <tr key={item.item_id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-slate-900">{shortText(item.item_name, 40)}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{item.item_class || "Sin categoría"}</p>
                    </td>
                    
                    <td className="px-6 py-4 text-center">
                      {item.coverage_status === "Quiebre Inminente (OV)" ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-100 px-2 py-1 rounded-md border border-rose-200">
                          🚨 Quiebre OV
                        </span>
                      ) : isHighDemand ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-orange-700 bg-orange-100 px-2 py-1 rounded-md">
                          🔥 Alta Demanda
                        </span>
                      ) : isMediumDemand ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-1 rounded-md">
                          Media Demanda
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-600 bg-slate-100 px-2 py-1 rounded-md">
                          Baja Demanda
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <p className="text-xs font-semibold text-emerald-600">+{Number(item.quantity_inbound || 0).toFixed(0)} Inb.</p>
                      <p className="text-xs font-semibold text-rose-600 mt-0.5">-{Number(item.quantity_pending || 0).toFixed(0)} OV</p>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <p className="text-sm font-bold text-slate-900">{formatMillions(item.inventory_value)}</p>
                      <p className="text-xs text-slate-500 mt-0.5">Stock Neto: {Number(item.net_stock).toFixed(0)} un.</p>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center justify-center font-bold px-2.5 py-1 rounded-full text-xs ${
                        item.coverage_status === "Quiebre Inminente (OV)" ? "bg-rose-600 text-white" :
                        item.coverage_status === "Crítico" ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"
                      }`}>
                        {Number(item.stock_coverage_months).toFixed(1)} meses
                      </span>
                    </td>
                  </tr>
                );
              })}
              {filteredCriticalItems.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    No hay ítems críticos en esta vista.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        ) : (
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="px-6 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wider">Ítem / SKU</th>
                <th className="px-6 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wider text-right">Unidades Inmovilizadas</th>
                <th className="px-6 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wider w-48">Participación %</th>
                <th className="px-6 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wider text-right">Valor Inmovilizado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {slowMovingItems.map((item) => {
                const ratio = totalSlowMovingUnits > 0 ? (item.stock_available / totalSlowMovingUnits) * 100 : 0;
                return (
                  <tr key={item.item_id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-slate-900">{shortText(item.item_name, 40)}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{item.item_class || "Sin categoría"}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="text-sm font-bold text-slate-900">{Number(item.stock_available).toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-500 rounded-full" style={{ width: `${Math.min(ratio, 100)}%` }}></div>
                        </div>
                        <span className="text-xs font-semibold text-slate-600 w-10 text-right">{ratio.toFixed(1)}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="text-sm font-bold text-slate-900">{formatMillions(item.inventory_value)}</p>
                    </td>
                  </tr>
                );
              })}
              {slowMovingItems.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                    No hay inventario inmovilizado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
