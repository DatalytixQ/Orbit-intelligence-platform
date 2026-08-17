"use client";

import type { FinanceRiskCustomer } from "@/services/analytics/finance";

type FinanceCurrentSnapshot = {
  overdue_ratio_pct?: number;
  max_days_overdue: number;
};

type FinanceAgingItem = {
  aging_bucket: string;
  documents: number;
  open_balance: number;
};

type FinanceTrendRow = {
  open_balance?: number | string;
  overdue_balance?: number | string;
};

type FinanceTrend = {
  comparison?: string;
  current?: FinanceTrendRow | null;
  previous?: FinanceTrendRow | null;
  delta?: { overdue_ratio_pct?: number } | null;
};

function n(value: unknown) {
  const x = Number(value);
  return Number.isFinite(x) ? x : 0;
}

export default function FinanceIntelligenceSummary({
  aging,
  customers,
  trend,
}: {
  current: FinanceCurrentSnapshot;
  aging: FinanceAgingItem[];
  customers: FinanceRiskCustomer[];
  trend?: FinanceTrend;
}) {
  const severe = n(
    aging.find((x) => x.aging_bucket === "Vencido +90")?.open_balance
  );

  const criticalCustomers = customers.filter(
    (c) => (c.risk_segment || "") === "Crítico"
  ).length;

  const topOver90Amount = [...customers]
    .filter((c) => n(c.overdue_90_balance) > 0)
    .sort((a, b) => n(b.overdue_90_balance) - n(a.overdue_90_balance))
    .slice(0, 3)
    .reduce((acc, c) => acc + n(c.overdue_90_balance), 0);

  const concentrationPct = severe > 0 ? (topOver90Amount / severe) * 100 : 0;

  const delta = trend?.delta?.overdue_ratio_pct;

  return (
    <div className="flex flex-col gap-3">
      {/* 1. At-Risk Customers Action */}
      {criticalCustomers > 0 ? (
        <div className="flex items-start gap-3 p-3 rounded-lg bg-rose-50 border border-rose-100">
          <span className="text-rose-500 mt-0.5">⚠️</span>
          <div>
            <p className="text-sm font-semibold text-slate-900">Requiere Regularización Inmediata</p>
            <p className="text-xs text-slate-600 mt-1">
              Existen {criticalCustomers} clientes críticos con score elevado. Priorizar cobranza antes de ampliar exposición crediticia.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-3 p-3 rounded-lg bg-emerald-50 border border-emerald-100">
          <span className="text-emerald-500 mt-0.5">✅</span>
          <div>
            <p className="text-sm font-semibold text-slate-900">Cartera Crítica Controlada</p>
            <p className="text-xs text-slate-600 mt-1">
              No se detectan clientes en estado crítico actualmente. Mantener seguimiento preventivo.
            </p>
          </div>
        </div>
      )}

      {/* 2. Concentration */}
      {concentrationPct > 40 && (
        <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 border border-amber-100">
          <span className="text-amber-500 mt-0.5">🎯</span>
          <div>
            <p className="text-sm font-semibold text-slate-900">Alta Concentración de Deuda &gt;90</p>
            <p className="text-xs text-slate-600 mt-1">
              Solo 3 clientes concentran el {concentrationPct.toFixed(0)}% del total vencido mayor a 90 días.
            </p>
          </div>
        </div>
      )}

      {/* 3. Trend */}
      {delta !== undefined && delta !== null && delta > 0 && (
        <div className="flex items-start gap-3 p-3 rounded-lg bg-rose-50 border border-rose-100">
          <span className="text-rose-500 mt-0.5">📉</span>
          <div>
            <p className="text-sm font-semibold text-slate-900">Deterioro en la Mora</p>
            <p className="text-xs text-slate-600 mt-1">
              La proporción de cartera vencida aumentó {Math.abs(delta).toFixed(1)} pp respecto a la {trend?.comparison || "semana anterior"}.
            </p>
          </div>
        </div>
      )}
      
      {delta !== undefined && delta !== null && delta <= 0 && (
        <div className="flex items-start gap-3 p-3 rounded-lg bg-emerald-50 border border-emerald-100">
          <span className="text-emerald-500 mt-0.5">📈</span>
          <div>
            <p className="text-sm font-semibold text-slate-900">Mora Estable o Mejorando</p>
            <p className="text-xs text-slate-600 mt-1">
              La proporción de cartera vencida mejoró {Math.abs(delta).toFixed(1)} pp respecto a la {trend?.comparison || "semana anterior"}.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}