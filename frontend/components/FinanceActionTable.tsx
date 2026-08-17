"use client";

import {
    buildFinanceActions,
    type FinanceRiskCustomer,
} from "@/services/analytics/finance";
import { useState } from "react";
import SlideOver from "./ui/SlideOver";

function formatMillions(value?: number) {
    if (value === undefined || value === null || Number.isNaN(Number(value))) return "-";
    return (Number(value) / 1_000_000).toFixed(1);
}

export default function FinanceActionTable({ data }: { data: FinanceRiskCustomer[] }) {
    const enriched = buildFinanceActions(data, 8);
    const [selectedCustomer, setSelectedCustomer] = useState<ReturnType<typeof buildFinanceActions>[0] | null>(null);

    return (
        <>
        <section className="mt-3 rounded-xl border border-border bg-card shadow-sm">
            <div className="px-7 py-6">
                <div className="mb-5">
                    <h2 className="m-0 text-[15px] font-bold text-foreground">
                        Prioridades de acción
                    </h2>
                    <p className="mt-1 text-xs text-muted-foreground">
                        Clientes priorizados por impacto financiero y riesgo
                    </p>
                </div>

                <div className="overflow-hidden rounded-[10px] border border-border">
                    <table className="w-full border-collapse text-[11px]">
                        <thead className="bg-muted text-muted-foreground">
                            <tr>
                                <th className="px-2 py-2.5 text-center">Estado</th>
                                <th className="px-2 py-2.5 text-left">Cliente</th>
                                <th className="px-2 py-2.5 text-center">Score</th>
                                <th className="px-2 py-2.5 text-right">Exposición</th>
                                <th className="px-2 py-2.5 text-right">+90</th>
                                <th className="px-2 py-2.5 text-center">Prioridad</th>
                                <th className="px-2 py-2.5 text-left">Motivo</th>
                                <th className="px-2 py-2.5 text-left">Acción</th>
                            </tr>
                        </thead>

                        <tbody>
                            {enriched.map((r) => (
                                <tr 
                                    key={r.customer_id ?? r.customer_name} 
                                    className="border-t border-border hover:bg-muted/50 cursor-pointer transition-colors"
                                    onClick={() => setSelectedCustomer(r)}
                                >
                                    <td className="px-2 py-3.5 text-center">
                                        <span
                                            style={{
                                                width: 9,
                                                height: 9,
                                                borderRadius: 2,
                                                display: "inline-block",
                                                background: r.color,
                                            }}
                                        />
                                    </td>

                                    <td className="px-2 py-3.5 font-bold text-foreground">
                                        {r.customer_name}
                                    </td>

                                    <td className="px-2 py-3.5 text-center">
                                        {r.risk_score.toFixed(1)}
                                    </td>

                                    <td className="px-2 py-3.5 text-right font-bold text-foreground">
                                        $ {formatMillions(r.overdue_balance)}
                                    </td>

                                    <td className="px-2 py-3.5 text-right font-bold" style={{ color: r.color }}>
                                        $ {formatMillions(r.overdue_90_balance)}
                                    </td>

                                    <td className="px-2 py-3.5 text-center font-bold" style={{ color: r.color }}>
                                        {r.priority}
                                    </td>

                                    <td className="px-2 py-3.5 text-muted-foreground">
                                        {r.reason}
                                    </td>

                                    <td className="px-2 py-3.5 text-muted-foreground">
                                        {r.action}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-3.5 text-[10px] text-muted-foreground">
                    Ranking dinámico basado en riesgo, mora, antigüedad y exposición financiera.
                </div>
            </div>
        </section>

        <SlideOver
            isOpen={!!selectedCustomer}
            onClose={() => setSelectedCustomer(null)}
            title={selectedCustomer?.customer_name || "Detalle del Cliente"}
            subtitle="Análisis de deuda y recomendaciones heurísticas"
        >
            {selectedCustomer && (
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <p className="text-xs text-slate-500 mb-1">Deuda Vencida Total</p>
                            <p className="text-lg font-bold text-slate-900">$ {formatMillions(selectedCustomer.overdue_balance)}M</p>
                        </div>
                        <div className="bg-rose-50 p-4 rounded-xl border border-rose-100">
                            <p className="text-xs text-rose-500 mb-1">Mora Crítica {'>'} 90 Días</p>
                            <p className="text-lg font-bold text-rose-700">$ {formatMillions(selectedCustomer.overdue_90_balance)}M</p>
                        </div>
                    </div>
                    
                    <div>
                        <h3 className="text-sm font-semibold text-slate-800 mb-2">Motivo de Riesgo</h3>
                        <div className="p-3 bg-slate-50 rounded-lg text-sm text-slate-700 border border-slate-200">
                            {selectedCustomer.reason}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-slate-800 mb-2">Acción Recomendada</h3>
                        <div className="p-3 bg-indigo-50 rounded-lg text-sm font-medium text-indigo-700 border border-indigo-200">
                            {selectedCustomer.action}
                        </div>
                    </div>

                    <div className="pt-4 mt-6 border-t border-slate-100 flex justify-end gap-3">
                        <button 
                            className="px-4 py-2 bg-white border border-slate-300 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
                            onClick={() => setSelectedCustomer(null)}
                        >
                            Cerrar
                        </button>
                        <button 
                            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                            onClick={() => {
                                window.dispatchEvent(new CustomEvent('open-dqbot', { 
                                    detail: { context: { rule_id: 'C001', domain: 'Finanzas' } } 
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