"use client";

import { useState } from "react";

type AgingBarDatum = {
  label: string;
  value: number;
  pct: number;
  docs?: number;
  color: string;
  textColor: string;
  borderColor: string;
  bgColor: string;
};

function formatMillions(value?: number) {
  if (value === undefined || value === null || Number.isNaN(Number(value))) {
    return "-";
  }
  return `${(Number(value) / 1_000_000).toFixed(1)} M`;
}

export default function FinanceAgingBarChart({
  data,
}: {
  data: AgingBarDatum[];
}) {
  const [hovered, setHovered] = useState<number | null>(null);

  const total = data.reduce((sum, t) => sum + Number(t.value || 0), 0);
  const overdue = data.slice(1).reduce((sum, t) => sum + Number(t.value || 0), 0);
  const overduePct = total > 0 ? (overdue / total) * 100 : 0;

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4 flex flex-wrap gap-x-4 gap-y-1.5">
        {data.map((t) => (
          <div key={t.label} className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-sm" style={{ background: t.color }} />
            <span className="text-xs font-medium text-slate-500">
              {t.label} <span className="text-slate-400 font-normal ml-1">{t.pct.toFixed(1)}%</span>
            </span>
          </div>
        ))}
      </div>

      <div className="mb-6 flex h-14 overflow-hidden rounded-xl bg-slate-100">
        {data.map((t, i) => (
          <div
            key={t.label}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            className="flex items-center justify-center transition-all cursor-default"
            style={{
              width: `${Math.max(t.pct, t.value > 0 ? 2 : 0)}%`,
              background: t.color,
              filter: hovered !== null && hovered !== i ? "brightness(0.9) opacity(0.8)" : "none",
            }}
          >
            {t.pct > 8 && (
              <span className="text-xs font-bold text-white drop-shadow-sm">
                {t.pct.toFixed(1)}%
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {data.map((t, i) => (
          <div
            key={t.label}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            className="rounded-xl border-t border-r border-b border-l-[3px] px-3 py-4 transition-colors"
            style={{
              background: hovered === i ? t.bgColor : "transparent",
              borderTopColor: hovered === i ? t.borderColor : "#F1F5F9",
              borderRightColor: hovered === i ? t.borderColor : "#F1F5F9",
              borderBottomColor: hovered === i ? t.borderColor : "#F1F5F9",
              borderLeftColor: t.color,
            }}
          >
            <div className="mb-1 text-[10px] uppercase tracking-wider font-semibold text-slate-500">
              {t.label}
            </div>
            <div className="text-xl font-bold" style={{ color: i === 0 ? "#0F172A" : t.textColor }}>
              $ {formatMillions(t.value)}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">{t.docs ?? 0} documentos</div>
          </div>
        ))}
      </div>

      <div className="mt-auto flex justify-between gap-3 border-t border-slate-100 pt-4">
        <div className="text-sm font-medium text-slate-500">
          Saldo vencido:{" "}
          <span className="font-bold text-rose-600">
            $ {formatMillions(overdue)}
          </span>{" "}
          <span className="text-xs text-slate-400 ml-1">({overduePct.toFixed(1)}% de $ {formatMillions(total)})</span>
        </div>
      </div>
    </div>
  );
}