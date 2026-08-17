"use client";

import { useState } from "react";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";

type SalesTrendItem = {
    month: number;
    month_label: string;
    venta_actual: number | null;
    venta_anterior: number | null;
    volumen_actual: number | null;
    volumen_anterior: number | null;
    forecast_ars: number | null;
};

type Props = {
    data: SalesTrendItem[];
};

function formatMillions(value?: number | null) {
    if (value === undefined || value === null || Number.isNaN(value)) return "-";
    return `$ ${(value / 1_000_000).toFixed(1)}M`;
}

function formatUnits(value?: number | null) {
    if (value === undefined || value === null || Number.isNaN(value)) return "-";
    return Number(value).toLocaleString("es-AR");
}

export default function SalesTrendChart({ data }: Props) {
    const [mode, setMode] = useState<"venta" | "volumen">("venta");

    const currentKey = mode === "venta" ? "venta_actual" : "volumen_actual";
    const previousKey = mode === "venta" ? "venta_anterior" : "volumen_anterior";

    return (
        <div className="flex flex-col w-full">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                    <h3 className="text-base font-semibold text-slate-900">Evolución de Ventas (Mensual)</h3>
                    <p className="text-sm text-slate-500">
                        ¿Cuál es la tendencia histórica de crecimiento?
                    </p>
                </div>

                <div className="flex bg-slate-100 rounded-lg p-1">
                    <button
                        onClick={() => setMode("venta")}
                        className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                            mode === "venta" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                        }`}
                    >
                        💵 Venta
                    </button>

                    <button
                        onClick={() => setMode("volumen")}
                        className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                            mode === "volumen" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                        }`}
                    >
                        📦 Volumen
                    </button>
                </div>
            </div>

            <div className="p-6 h-[280px] w-full flex flex-col">
                <div className="mb-4 flex items-center justify-between">
                    <div className="flex gap-4 text-xs">
                        <span className="font-semibold text-cyan-500">● Actual</span>
                        <span className="text-slate-400">● Año anterior</span>
                        {mode === "venta" && (
                            <span className="font-semibold text-amber-500">● Forecast</span>
                        )}
                    </div>
                </div>
                <div className="flex-1 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data} margin={{ top: 12, right: 18, left: 8, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="2 4" vertical={false} stroke="#E2E8F0" />

                            <XAxis dataKey="month_label" tick={{ fontSize: 10, fill: "#64748B" }} axisLine={false} tickLine={false} />

                            <YAxis
                                tickFormatter={(value) => mode === "venta" ? formatMillions(value) : formatUnits(value)}
                                tick={{ fontSize: 10, fill: "#64748B" }}
                                width={54}
                                axisLine={false}
                                tickLine={false}
                            />

                            <Tooltip
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                formatter={(value: any, name: any) => {
                                    if (name === "forecast_ars") return [formatMillions(value), "Forecast"];
                                    const label = name === currentKey ? "Actual" : "Año anterior";
                                    return [mode === "venta" ? formatMillions(value) : formatUnits(value), label];
                                }}
                            />

                            <Line type="monotone" dataKey={previousKey} stroke="#CBD5E1" strokeWidth={2} dot={{ r: 3, fill: "#CBD5E1", strokeWidth: 0 }} />

                            <Line type="monotone" dataKey={currentKey} stroke="#06B6D4" strokeWidth={2.5} dot={{ r: 3, fill: "#06B6D4", strokeWidth: 0 }} activeDot={{ r: 5 }} />

                            {mode === "venta" && (
                                <Line
                                    type="monotone"
                                    dataKey="forecast_ars"
                                    stroke="#F59E0B"
                                    strokeWidth={2}
                                    strokeDasharray="6 4"
                                    dot={{ r: 3, fill: "#F59E0B", strokeWidth: 0 }}
                                />
                            )}
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}