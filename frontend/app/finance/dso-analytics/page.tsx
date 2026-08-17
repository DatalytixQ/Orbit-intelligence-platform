"use client";

import { useEffect, useState } from "react";
import { fetchFromApiClient } from "@/lib/api.client";
import AppShell from "@/components/layout/AppShell";
import Link from "next/link";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

function formatMillions(v: any) {
  const n = Number(v);
  if (v === undefined || v === null || Number.isNaN(n) || n === 0) return "-";
  const m = n / 1_000_000;
  if (Math.abs(m) < 0.1) return "<0.1 M";
  return `${m.toFixed(1)} M`;
}

function formatDays(v: any) {
  const n = Number(v);
  if (v === undefined || v === null || Number.isNaN(n)) return "-";
  return `${n.toFixed(1)}`;
}

export default function DsoExecutivePage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchFromApiClient(`/api/kpi/finance/dso-executive`).then(setData);
  }, []);

  if (!data) {
    return (
      <AppShell>
        <div className="p-6 text-sm text-slate-500">Cargando DSO Analytics Executive...</div>
      </AppShell>
    );
  }

  const { summary, trend, insights, action_list } = data;

  const currentDso = Number(summary.current_dso) || 0;
  
  const bpdso = 30; // Hardcoded best possible DSO
  const dsoGap = currentDso - bpdso;
  
  // Calculate historical trend delta
  const previousDso = trend && trend.length > 1 ? Number(trend[trend.length - 2].actual_dso) : currentDso;
  const isDsoBetter = currentDso <= previousDso;
  const dsoDeltaText = isDsoBetter ? "Mejora vs mes anterior" : "Deterioro vs mes anterior";

  // Financial impact of the gap (assuming average daily sales of $1.5M for the MVP showcase)
  const avgDailySales = 1500000;
  const cashTrapped = Math.max(0, dsoGap * avgDailySales);

  return (
    <AppShell>
      <main className="w-full mx-auto py-6 sm:px-6 lg:px-8 space-y-6">
        <header className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Executive DSO Analytics
          </h1>
          <p className="text-muted-foreground">
            Dashboard directivo de capital de trabajo: Eficiencia de cobranza y tendencias.
          </p>
        </header>

        {/* Nivel 1: KPIs Ejecutivos de Eficiencia */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card p-4 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-sm font-medium text-slate-500 mb-1">DSO Global (Días)</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-slate-900">{formatDays(currentDso)}</span>
            </div>
            <p className={`text-xs font-semibold mt-2 ${isDsoBetter ? 'text-emerald-600' : 'text-rose-600'}`}>
              {isDsoBetter ? '▼' : '▲'} {dsoDeltaText}
            </p>
          </div>
          
          <div className="bg-card p-4 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-sm font-medium text-slate-500 mb-1">Best Possible DSO</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-slate-900">{bpdso}</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">Días de cobro ideal según políticas</p>
          </div>

          <div className="bg-card p-4 rounded-xl shadow-sm border border-slate-200 border-l-4 border-l-amber-500">
            <h3 className="text-sm font-medium text-slate-500 mb-1">Brecha de Ineficiencia</h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-amber-600">{formatDays(dsoGap)} días</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">Atraso sistémico promedio (DSO - BPDSO)</p>
          </div>
          {/* KPI 4 */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-center">
            <h3 className="text-sm font-medium text-slate-500 mb-1">Capital Crítico (+90 días)</h3>
            <div className="text-3xl font-bold text-red-600 mb-2">
              $ {(summary.current_critical_balance / 1000000).toFixed(1)} M
            </div>
            <p className="text-xs text-slate-400">Total vencido en riesgo de incobrabilidad</p>
          </div>
        </section>

        {/* Nivel 2: Gráfico de Tendencia Histórica DSO vs BPDSO */}
        <section className="bg-card p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
          <h3 className="text-lg font-medium text-slate-900 mb-4">Evolución del DSO (Últimos Meses)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month_name" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis domain={['auto', 'auto']} tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ stroke: '#cbd5e1', strokeWidth: 1 }}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }}/>
                <Line type="monotone" name="DSO Real" dataKey="actual_dso" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" name="Best Possible DSO" dataKey="best_possible_dso" stroke="#10b981" strokeWidth={3} strokeDasharray="5 5" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Nivel 3: Insights y Top Offenders */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Smart Insights */}
          <div className="flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-base font-semibold text-slate-900">Puntos de Atención Prioritaria</h3>
                <p className="text-sm text-slate-500">¿Qué debo resolver hoy?</p>
              </div>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-100 text-xs font-bold text-rose-600">
                !
              </span>
            </div>
            <div className="p-6 space-y-4 flex-1 bg-slate-50/30 overflow-y-auto max-h-[400px]">
              {insights && insights.length > 0 ? insights.map((insight: any, idx: number) => (
                <div 
                  key={idx} 
                  className={`bg-white border rounded-xl p-4 shadow-sm relative overflow-hidden group ${insight.type === 'critical' ? 'border-rose-100' : 'border-amber-100'}`}
                >
                  <div className={`absolute top-0 left-0 w-1 h-full ${insight.type === 'critical' ? 'bg-rose-500' : 'bg-amber-500'}`}></div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded ${insight.type === 'critical' ? 'text-rose-600 bg-rose-50' : 'text-amber-600 bg-amber-50'}`}>
                      {insight.type === 'critical' ? 'CRÍTICO' : 'ALERTA'}
                    </span>
                    <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wide">AI INSIGHT</span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-900 mb-1">{insight.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed mb-2">{insight.description}</p>
                  <p className="text-xs text-slate-500 italic">Recomendación: {insight.recommendation}</p>
                </div>
              )) : (
                <div className="text-sm text-slate-400 p-4 text-center">El comportamiento de cobro de los clientes está alineado con la política.</div>
              )}
            </div>
            <div className="p-4 border-t border-slate-100 bg-white">
              <Link
                href="#"
                className="inline-flex items-center justify-center w-full bg-slate-50 hover:bg-slate-100 text-indigo-600 font-medium text-xs py-2 rounded-lg transition-colors border border-slate-200"
              >
                Revisar con DQBot
              </Link>
            </div>
          </div>

          {/* Top DSO Offenders (Drill-down Ejecutivo) */}
          <div className="flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-slate-900">Top DSO Offenders</h3>
                <p className="text-sm text-slate-500">Clientes que más desvían el promedio de cobro.</p>
              </div>
            </div>
            
            <div className="overflow-auto max-h-[350px]">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50/80 backdrop-blur-sm sticky top-0 z-10 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 font-semibold text-slate-500 text-xs">CLIENTE</th>
                    <th className="px-4 py-3 font-semibold text-slate-500 text-xs text-right">DSO CLIENTE</th>
                    <th className="px-4 py-3 font-semibold text-slate-500 text-xs text-right">DSO GAP (ATRASO)</th>
                    <th className="px-4 py-3 font-semibold text-slate-500 text-xs text-right">SALDO RETENIDO</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {action_list && action_list.length > 0 ? action_list.slice(0, 10).map((row: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-slate-800">{row.customer_name}</td>
                      <td className="px-4 py-3 text-slate-600 text-right">{row.dso_days}</td>
                      <td className="px-4 py-3 font-medium text-red-600 text-right">
                        + {row.dso_gap} días
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-800 text-right">
                        $ {(Number(row.critical_balance)/1000000).toFixed(1)} M
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} className="px-4 py-4 text-center text-xs text-slate-500">Sin desviaciones</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </section>
      </main>
    </AppShell>
  );
}