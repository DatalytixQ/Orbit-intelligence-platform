"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bot, Funnel, Users, AlertCircle } from 'lucide-react';
import ReactECharts from 'echarts-for-react';
import DynamicSidebar from "@/components/layout/DynamicSidebar";
import UnifiedDashboardHeader, { FilterDropdown } from "@/components/layout/UnifiedDashboardHeader";

export default function FlujoVentasDashboardPage() {
  const [selectedEmpresa, setSelectedEmpresa] = useState('Consolidado');
  const [selectedMoneda, setSelectedMoneda] = useState('USD (Convertido)');
  const [metricMode, setMetricMode] = useState<'monto' | 'cantidad'>('monto');
  const [pipelineData, setPipelineData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setPipelineData([
        { id: 'OP-1001', stage: 'Prospección', amount: 500000, probability: 10, rep: 'Ana G.', client: 'Tech Corp S.A.' },
        { id: 'OP-1002', stage: 'Calificación', amount: 1200000, probability: 30, rep: 'Carlos M.', client: 'Industrias ACME' },
        { id: 'OP-1003', stage: 'Cotización (Estimate)', amount: 850000, probability: 50, rep: 'Roberto L.', client: 'Global Retail' },
        { id: 'OP-1004', stage: 'Cotización (Estimate)', amount: 320000, probability: 50, rep: 'Ana G.', client: 'Importadora Sur' },
        { id: 'OP-1005', stage: 'Negociación', amount: 2100000, probability: 75, rep: 'María P.', client: 'Constructora Mega' },
        { id: 'OP-1006', stage: 'Orden Abierta (OV)', amount: 450000, probability: 90, rep: 'Juan D.', client: 'Hospital Central' },
        { id: 'OP-1007', stage: 'Orden Abierta (OV)', amount: 750000, probability: 90, rep: 'Carlos M.', client: 'Logística Express' }
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const totalAmount = pipelineData.reduce((acc, curr) => acc + curr.amount, 0);
  const totalCount = pipelineData.length;

  const funnelData = [
    { value: metricMode === 'monto' ? 500 : 1, name: 'Prospección' },
    { value: metricMode === 'monto' ? 1200 : 1, name: 'Calificación' },
    { value: metricMode === 'monto' ? 1170 : 2, name: 'Cotización (Estimate)' },
    { value: metricMode === 'monto' ? 2100 : 1, name: 'Negociación' },
    { value: metricMode === 'monto' ? 1200 : 2, name: 'Orden Abierta (OV)' }
  ];

  const PIPELINE_FUNNEL_OPTION = {
    tooltip: { trigger: 'item', formatter: metricMode === 'monto' ? '{b}: ${c}K' : '{b}: {c} Oportunidades' },
    series: [
      {
        name: 'Pipeline', type: 'funnel', left: '10%', top: 20, bottom: 20, width: '80%',
        min: 0, max: 2500, minSize: '0%', maxSize: '100%', sort: 'descending', gap: 2,
        label: { show: true, position: 'inside' },
        itemStyle: { borderColor: '#fff', borderWidth: 1 },
        data: funnelData
      }
    ]
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 overflow-hidden font-sans">
      <DynamicSidebar />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <UnifiedDashboardHeader 
          title="Flujo de Ventas (Pipeline ERP)"
          activeTab="pipeline"
          tabs={[{ id: 'pipeline', label: 'Pipeline Consolidado' }]}
          onTabChange={() => {}}
          selectedEmpresa={selectedEmpresa}
          setSelectedEmpresa={setSelectedEmpresa}
          selectedMoneda={selectedMoneda}
          setSelectedMoneda={setSelectedMoneda}
          metricMode={metricMode}
          setMetricMode={setMetricMode}
          additionalFilters={
            <>
              <FilterDropdown label="Fuente" value="ERP (Sin CRM)" />
              <FilterDropdown label="Probabilidad" value="Todas" />
            </>
          }
        />

        <main className="flex-1 overflow-y-auto p-6 bg-slate-50/50 dark:bg-slate-950/50">
          <div className="w-full max-w-full space-y-6">
            
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-amber-50/50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 rounded-xl p-4 flex items-start gap-4">
              <div className="bg-amber-100 dark:bg-amber-500/20 p-2 rounded-lg">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-amber-900 dark:text-amber-300 mb-1">Aviso Arquitectónico (Multi-tenant)</h4>
                <p className="text-sm text-amber-800/80 dark:text-amber-200/80">
                  El tenant actual (<strong>Vonderk</strong>) no tiene un CRM conectado. Este pipeline está construido heurísticamente a partir de transacciones abiertas del ERP (Cotizaciones y Órdenes de Venta pendientes de facturar). Las etapas tempranas (Prospección/Calificación) son ingresadas manualmente como estimaciones.
                </p>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center">
                <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">Valor de Pipeline Bruto</h3>
                <div className="text-3xl font-bold text-slate-800 dark:text-white">${(totalAmount / 1000000).toFixed(2)}M</div>
              </div>
              <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center">
                <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">Oportunidades Abiertas</h3>
                <div className="text-3xl font-bold text-indigo-600">{totalCount}</div>
              </div>
              <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center">
                <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">Forecast Comprometido (>80%)</h3>
                <div className="text-3xl font-bold text-emerald-600">$1.20M</div>
              </div>
              <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center">
                <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">Win Rate (Histórico)</h3>
                <div className="text-3xl font-bold text-slate-800 dark:text-white">35%</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
                <h3 className="font-bold text-slate-800 dark:text-white mb-4 text-sm flex items-center gap-2">
                  <Funnel className="w-4 h-4 text-indigo-500" /> Embudo de Ventas (Pipeline ERP)
                </h3>
                <div className="h-[350px]">
                  <ReactECharts option={PIPELINE_FUNNEL_OPTION} style={{height: '100%'}} />
                </div>
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
                <h3 className="font-bold text-slate-800 dark:text-white mb-4 text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-500" /> Próximos Cierres Clave (OV Pendientes)
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500">
                        <th className="py-2">Cliente / Oportunidad</th>
                        <th className="py-2">Monto</th>
                        <th className="py-2">Probabilidad</th>
                        <th className="py-2">Vendedor</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pipelineData.slice(4,7).map((opp) => (
                        <tr key={opp.id} className="border-b border-slate-100 dark:border-slate-800/50">
                          <td className="py-3 font-medium">{opp.client}</td>
                          <td className="py-3">${(opp.amount / 1000).toFixed(0)}K</td>
                          <td className="py-3 text-emerald-600 font-bold">{opp.probability}%</td>
                          <td className="py-3">{opp.rep}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
