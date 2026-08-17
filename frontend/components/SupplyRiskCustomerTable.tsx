"use client";

import { useState } from "react";
import SlideOver from "./ui/SlideOver";

type CustomerRisk = {
  customer_id: string;
  customer_name: string;
  revenue_at_supply_risk: number;
  affected_orders?: number;
  earliest_ship_date?: string;
};

export default function SupplyRiskCustomerTable({ data }: { data: CustomerRisk[] }) {
  const [selectedCust, setSelectedCust] = useState<CustomerRisk | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 py-10">
        <svg className="w-12 h-12 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p>No hay clientes con riesgo de abastecimiento</p>
      </div>
    );
  }

  const formatCurrency = (val: number) => new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0
  }).format(val);

  return (
    <>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-border">
        <thead className="bg-muted sticky top-0 z-10">
          <tr>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider bg-muted">
              Cliente
            </th>
            <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider bg-muted">
              Ingreso en Riesgo
            </th>
            <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider bg-muted">
              Estado
            </th>
          </tr>
        </thead>
        <tbody className="bg-card divide-y divide-border">
          {data.map((row, idx) => {
            const custName = row.customer_name || `Cliente ${row.customer_id || 'Desconocido'}`;
            return (
            <tr 
              key={idx} 
              className="hover:bg-muted transition-colors cursor-pointer"
              onClick={() => setSelectedCust(row)}
            >
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-medium text-xs">
                      {custName.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-foreground truncate max-w-[200px]">
                      {custName}
                    </p>
                    {row.earliest_ship_date && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Compromiso: {new Intl.DateTimeFormat('es-AR', { day: 'numeric', month: 'short' }).format(new Date(row.earliest_ship_date))}
                      </p>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium text-red-600">
                {formatCurrency(row.revenue_at_supply_risk)}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-center">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-500/10 text-red-600">
                  Crítico
                </span>
              </td>
            </tr>
            );
          })}
        </tbody>
      </table>
    </div>

    <SlideOver
      isOpen={!!selectedCust}
      onClose={() => setSelectedCust(null)}
      title={selectedCust?.customer_name || "Detalle del Cliente"}
      subtitle="Análisis de riesgo por desabastecimiento"
    >
      {selectedCust && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
              <div className="bg-rose-50 p-4 rounded-xl border border-rose-100">
                  <p className="text-xs text-rose-500 mb-1">Ingreso en Riesgo</p>
                  <p className="text-lg font-bold text-rose-700">{formatCurrency(selectedCust.revenue_at_supply_risk)}</p>
              </div>
          </div>

          <div className="pt-4 mt-6 border-t border-slate-100 flex justify-end gap-3">
              <button 
                  className="px-4 py-2 bg-white border border-slate-300 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
                  onClick={() => setSelectedCust(null)}
              >
                  Cerrar
              </button>
              <button 
                  className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                  onClick={() => {
                      window.dispatchEvent(new CustomEvent('open-dqbot', { 
                          detail: { context: { rule_id: 'I003', domain: 'Abastecimiento' } } 
                      }));
                  }}
              >
                  Profundizar con DQBot
              </button>
          </div>
        </div>
      )}
    </SlideOver>
    </>
  );
}
