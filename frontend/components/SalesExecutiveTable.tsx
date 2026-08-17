"use client";

import { useState } from "react";
import SlideOver from "./ui/SlideOver";

type TopCustomerItem = {
  customer_internal_id: string;
  customer_name: string;
  customer_sales_ars: number;
  participation_pct: number;
};

type TopRepItem = {
  sales_rep: string;
  rep_sales_ars: number;
  participation_pct: number;
};

type Props = {
  topCustomers: TopCustomerItem[];
  topReps?: TopRepItem[];
};

// Local formatter in case it's not exported globally
function formatCurrency(value?: number) {
  if (value === undefined || value === null || Number.isNaN(value)) return "-";
  if (Math.abs(value) >= 1_000_000) return `$ ${(value / 1_000_000).toFixed(1)} M`;
  if (Math.abs(value) >= 1_000) return `$ ${(value / 1_000).toFixed(0)} K`;

  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function SalesExecutiveTable({ topCustomers, topReps = [] }: Props) {
  const [viewMode, setViewMode] = useState<"clientes" | "representantes">("clientes");
  const [selectedItem, setSelectedItem] = useState<{ id: string, name: string, sales: number, pct: number } | null>(null);

  const realReps = topReps.map((r, i) => ({
    id: `rep_${i}`,
    name: r.sales_rep,
    sales: r.rep_sales_ars,
    pct: Number(r.participation_pct)
  }));

  const currentData = viewMode === "clientes" 
    ? topCustomers.map(c => ({ id: c.customer_internal_id, name: c.customer_name, sales: c.customer_sales_ars, pct: Number(c.participation_pct) }))
    : realReps;

  return (
    <>
    <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            {viewMode === "clientes" ? "Top 5 (YTD)" : "Top 5 Representantes (YTD)"}
          </h3>
          <p className="text-sm text-slate-500">
            ¿Quiénes concentran la mayor participación en los ingresos?
          </p>
        </div>
        
        {/* Dimension Toggle */}
        <div className="flex bg-slate-100 rounded-lg p-1">
          <button 
            onClick={() => setViewMode("clientes")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${viewMode === "clientes" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            Clientes
          </button>
          <button 
            onClick={() => setViewMode("representantes")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${viewMode === "representantes" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            Representantes
          </button>
        </div>
      </div>
      <div className="flex-1 p-0">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50/50">
            <tr>
              <th className="px-6 py-4 font-medium">Posición</th>
              <th className="px-6 py-4 font-medium">{viewMode === "clientes" ? "Cliente" : "Representante"}</th>
              <th className="px-6 py-4 font-medium text-right">Volumen (ARS)</th>
              <th className="px-6 py-4 font-medium text-right">Participación</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {currentData.map((item, index) => (
              <tr 
                key={item.id} 
                className="hover:bg-slate-50 transition-colors cursor-pointer"
                onClick={() => setSelectedItem(item)}
              >
                <td className="px-6 py-4 font-semibold text-slate-900">#{index + 1}</td>
                <td className="px-6 py-4 font-medium text-slate-700">{item.name}</td>
                <td className="px-6 py-4 font-semibold text-slate-900 text-right">{formatCurrency(item.sales)}</td>
                <td className="px-6 py-4 text-right">
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                    item.pct >= 15 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {item.pct.toFixed(1)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    <SlideOver
      isOpen={!!selectedItem}
      onClose={() => setSelectedItem(null)}
      title={selectedItem?.name || "Detalle"}
      subtitle={`Análisis profundo de ${viewMode === 'clientes' ? 'Cliente' : 'Representante'}`}
    >
      {selectedItem && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-xs text-slate-500 mb-1">Volumen YTD</p>
                  <p className="text-lg font-bold text-slate-900">{formatCurrency(selectedItem.sales)}</p>
              </div>
              <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                  <p className="text-xs text-amber-500 mb-1">Participación</p>
                  <p className="text-lg font-bold text-amber-700">{selectedItem.pct.toFixed(1)}%</p>
              </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
              <button 
                  className="px-4 py-2 bg-white border border-slate-300 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
                  onClick={() => setSelectedItem(null)}
              >
                  Cerrar
              </button>
              <button 
                  className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                  onClick={() => {
                      window.dispatchEvent(new CustomEvent('open-dqbot', { 
                          detail: { context: { rule_id: viewMode === 'clientes' ? 'V002' : 'V001', domain: 'Ventas' } } 
                      }));
                  }}
              >
                  Preguntar a DQBot
              </button>
          </div>
        </div>
      )}
    </SlideOver>
    </>
  );
}
