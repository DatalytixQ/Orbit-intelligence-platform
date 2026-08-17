"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

type CoverageItem = {
  coverage_status: string;
  items: number;
  inventory_value: number;
};

const STATUS_COLORS: Record<string, string> = {
  "Crítico": "#E11D48", // rose-600
  "Riesgo": "#F59E0B",  // amber-500
  "Saludable": "#10B981", // emerald-500
  "Sin demanda reciente": "#94A3B8", // slate-400
};

function formatMillions(value: number) {
  return `$${(value / 1_000_000).toFixed(1)} M`;
}

export default function InventoryCoverageChart({ data }: { data: CoverageItem[] }) {
  const chartData = data.map((d) => ({
    name: d.coverage_status === "Sin demanda reciente" ? "Inmovilizado" : d.coverage_status,
    value: Number(d.inventory_value || 0),
    items: Number(d.items || 0),
    color: STATUS_COLORS[d.coverage_status] || "#CBD5E1",
  }));

  const totalValue = chartData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col mb-2">
        <h3 className="text-base font-semibold text-slate-900">Estado de Cobertura</h3>
        <p className="text-sm text-slate-500">Distribución del capital según demanda vs lead time</p>
      </div>

      <div className="flex flex-row items-center w-full h-full min-h-[220px]">
        {/* Gráfico a la izquierda */}
        <div className="w-1/2 h-full flex flex-col items-center justify-center relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={95}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: any) => formatMillions(Number(value))}
                contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)" }}
                itemStyle={{ color: "#0F172A", fontWeight: 600 }}
              />
            </PieChart>
          </ResponsiveContainer>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total</span>
            <span className="text-xl font-bold text-slate-900">{formatMillions(totalValue)}</span>
          </div>
        </div>

        {/* Leyenda vertical densa a la derecha */}
        <div className="w-1/2 flex flex-col justify-center space-y-3 pl-4">
          {chartData.map((d) => (
            <div key={d.name} className="flex flex-col">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }}></div>
                <p className="text-sm font-semibold text-slate-700">{d.name === "Sin demanda reciente" ? "Sin Ventas Directas" : d.name}</p>
              </div>
              <div className="text-[11px] text-slate-500 ml-5">
                {formatMillions(d.value)} ({((d.value / totalValue) * 100).toFixed(1)}%) • {d.items} SKUs
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
