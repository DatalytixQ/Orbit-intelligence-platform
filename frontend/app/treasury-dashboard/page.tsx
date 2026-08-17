"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Briefcase,
  Package,
  Wallet,
  Settings,
  Bot,
  Bell,
  Search,
  Filter,
  Download,
  Sparkles,
  ChevronDown,
  DollarSign,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Landmark,
  ShieldAlert,
  ArrowRightLeft
} from "lucide-react";
import Link from "next/link";
import ReactECharts from "echarts-for-react";

type Tab = 'liquidez' | 'cobros' | 'bancos' | 'riesgo';

// --- OPTIONS: LIQUIDEZ (WATERFALL) ---
const LIQUIDEZ_WATERFALL_OPTION = {
  tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'shadow' },
    formatter: function (params: any) {
      let tar = params[1];
      return tar.name + '<br/>' + tar.seriesName + ' : $' + tar.value + 'M';
    }
  },
  grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  xAxis: { type: 'category', splitLine: { show: false }, data: ['Saldo Inicial', 'Cobros (AR)', 'Pagos (AP)', 'Impuestos', 'Nómina', 'Capex', 'Saldo Final'] },
  yAxis: { type: 'value', axisLabel: { formatter: '${value}M' } },
  series: [
    {
      name: 'Placeholder',
      type: 'bar',
      stack: 'Total',
      itemStyle: { borderColor: 'transparent', color: 'transparent' },
      emphasis: { itemStyle: { borderColor: 'transparent', color: 'transparent' } },
      data: [0, 150, 100, 80, 50, 30, 0]
    },
    {
      name: 'Flujo',
      type: 'bar',
      stack: 'Total',
      label: { show: true, position: 'inside', formatter: '${c}M' },
      data: [
        { value: 150, itemStyle: { color: '#64748b' } }, // Inicial
        { value: 80, itemStyle: { color: '#10b981' } },  // Cobros (+)
        { value: 50, itemStyle: { color: '#ef4444' } },  // Pagos (-)
        { value: 20, itemStyle: { color: '#ef4444' } },  // Impuestos (-)
        { value: 30, itemStyle: { color: '#ef4444' } },  // Nómina (-)
        { value: 20, itemStyle: { color: '#ef4444' } },  // Capex (-)
        { value: 110, itemStyle: { color: '#3b82f6' } }  // Final
      ]
    }
  ]
};

const LIQUIDEZ_LINE_OPTION = {
  tooltip: { trigger: 'axis' },
  legend: { top: '0%', left: 'center', icon: 'circle', itemWidth: 8, itemHeight: 8, textStyle: { fontSize: 10 } },
  grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  xAxis: { type: 'category', boundaryGap: false, data: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4', 'Semana 5 (F)', 'Semana 6 (F)', 'Semana 7 (F)', 'Semana 8 (F)'] },
  yAxis: { type: 'value', axisLabel: { formatter: '${value}M' } },
  series: [
    { name: 'Saldo Consolidado', type: 'line', data: [120, 132, 101, 150, null, null, null, null], itemStyle: { color: '#3b82f6' }, lineStyle: { width: 3 }, areaStyle: { opacity: 0.1 } },
    { name: 'Forecast', type: 'line', data: [null, null, null, 150, 140, 160, 155, 170], itemStyle: { color: '#10b981' }, lineStyle: { width: 3, type: 'dashed' } },
    { name: 'Límite Mínimo', type: 'line', data: [80, 80, 80, 80, 80, 80, 80, 80], itemStyle: { color: '#ef4444' }, markLine: { data: [{ type: 'average', name: 'Mínimo' }] } }
  ]
};

// --- OPTIONS: COBROS Y PAGOS (AGING) ---
const COBROS_AGING_OPTION = {
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  legend: { top: '0%', left: 'center', icon: 'circle', itemWidth: 8, itemHeight: 8, textStyle: { fontSize: 10 } },
  grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  xAxis: { type: 'value', axisLabel: { formatter: '${value}M' } },
  yAxis: { type: 'category', data: ['Cuentas por Pagar (AP)', 'Cuentas por Cobrar (AR)'] },
  series: [
    { name: 'No Vencido', type: 'bar', stack: 'total', itemStyle: { color: '#10b981' }, data: [45, 80] },
    { name: '1-30 Días', type: 'bar', stack: 'total', itemStyle: { color: '#f59e0b' }, data: [20, 35] },
    { name: '31-60 Días', type: 'bar', stack: 'total', itemStyle: { color: '#f97316' }, data: [10, 15] },
    { name: '61-90 Días', type: 'bar', stack: 'total', itemStyle: { color: '#ef4444' }, data: [5, 8] },
    { name: '>90 Días', type: 'bar', stack: 'total', itemStyle: { color: '#991b1b' }, data: [2, 5] }
  ]
};

// --- OPTIONS: BANCOS Y CONCILIACIÓN ---
const BANCOS_DONUT_OPTION = {
  tooltip: { trigger: 'item' },
  legend: { bottom: '0%', left: 'center', icon: 'circle', itemWidth: 8, itemHeight: 8, textStyle: { fontSize: 10 } },
  series: [
    {
      name: 'Estado de Conciliación',
      type: 'pie',
      radius: ['45%', '75%'],
      center: ['50%', '45%'],
      avoidLabelOverlap: false,
      itemStyle: { borderColor: '#fff', borderWidth: 2 },
      label: { show: false },
      data: [
        { value: 85, name: 'Conciliado', itemStyle: { color: '#10b981' } },
        { value: 10, name: 'Pendiente', itemStyle: { color: '#f59e0b' } },
        { value: 5, name: 'Diferencia / Error', itemStyle: { color: '#ef4444' } }
      ]
    }
  ]
};

// --- OPTIONS: RIESGO Y CAPITAL ---
const RIESGO_RADAR_OPTION = {
  tooltip: {},
  radar: {
    indicator: [
      { name: 'Riesgo Liquidez', max: 100 },
      { name: 'Riesgo FX', max: 100 },
      { name: 'Covenants', max: 100 },
      { name: 'Riesgo Tasa', max: 100 },
      { name: 'Concentración AR', max: 100 }
    ],
    radius: 80,
    axisName: { color: '#64748b', fontSize: 10 }
  },
  series: [{
    name: 'Perfil de Riesgo',
    type: 'radar',
    data: [
      { value: [30, 70, 20, 50, 40], name: 'Actual', itemStyle: { color: '#3b82f6' }, areaStyle: { opacity: 0.3 } },
      { value: [50, 50, 50, 50, 50], name: 'Límite Política', itemStyle: { color: '#ef4444' }, lineStyle: { type: 'dashed' } }
    ]
  }]
};

import DynamicSidebar from "@/components/layout/DynamicSidebar";

export default function TreasuryDashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>('liquidez');
  
  // OrbitGen State
  const [isOrbitGenMode, setIsOrbitGenMode] = useState(false);
  const [selectedWidgets, setSelectedWidgets] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<string | null>(null);
  
  const toggleWidgetSelection = (widgetId: string) => {
    if (!isOrbitGenMode) return;
    setSelectedWidgets(prev => 
      prev.includes(widgetId) ? prev.filter(id => id !== widgetId) : [...prev, widgetId]
    );
  };

  const handleGenerateReport = () => {
    setIsGenerating(true);
    // Simulate AI Generation delay
    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedReport(`## Reporte Ejecutivo: Comité de Tesorería\n\n**Contexto Analizado:**\nSe analizaron ${selectedWidgets.length} métricas clave de liquidez y riesgo.\n\n**Hallazgos Principales:**\n- La caja disponible se mantiene saludable en $150.4M, superando el límite mínimo requerido.\n- Existe una alerta crítica de exposición FX (USD 1.2M) que debe cubrirse antes del cierre de mes.\n\n**Recomendación OrbitGen:**\nEjecutar forwards de cobertura para la posición en dólares y renegociar las facturas críticas mayores a 60 días para mejorar el DSO.`);
      setIsOrbitGenMode(false);
      setSelectedWidgets([]);
    }, 2500);
  };

  // Helper function to wrap widgets with selection logic
  const renderWidget = (id: string, children: React.ReactNode) => {
    const isSelected = selectedWidgets.includes(id);
    return (
      <div 
        onClick={() => toggleWidgetSelection(id)}
        className={`relative transition-all duration-200 h-full ${
          isOrbitGenMode ? 'cursor-pointer hover:ring-2 hover:ring-indigo-300 ring-offset-2' : ''
        } ${isSelected ? 'ring-4 ring-indigo-500 ring-offset-2 scale-[0.98]' : ''}`}
      >
        {isOrbitGenMode && (
          <div className="absolute inset-0 z-50 bg-indigo-500/5 rounded-xl flex items-start justify-end p-2 pointer-events-none">
            {isSelected && (
              <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg">
                <Sparkles className="w-3 h-3" />
              </div>
            )}
          </div>
        )}
        {children}
      </div>
    );
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 overflow-hidden font-sans">
      
      <DynamicSidebar />

      {/* 2. MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* Top Navigation & Filters */}
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-10 flex flex-col">
          {/* Top Bar */}
          <div className="h-14 flex items-center justify-between px-6 border-b border-slate-100 dark:border-slate-800">
             <div className="flex items-center gap-4">
               <h1 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                 Tesorería (AR/AP)
               </h1>
             </div>
             
             {/* Central Tabs */}
             <div className="hidden lg:flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                <TabButton label="Liquidez" active={activeTab === 'liquidez'} onClick={() => setActiveTab('liquidez')} />
                <TabButton label="Cobros y Pagos" active={activeTab === 'cobros'} onClick={() => setActiveTab('cobros')} />
                <TabButton label="Bancos y Conciliación" active={activeTab === 'bancos'} onClick={() => setActiveTab('bancos')} />
                <TabButton label="Riesgo y Capital" active={activeTab === 'riesgo'} onClick={() => setActiveTab('riesgo')} />
             </div>

             <div className="flex items-center gap-4 text-sm">
               <span className="text-slate-400 text-xs hidden xl:block">Última actualización: Hoy, 09:15 AM</span>
               <button 
                 onClick={() => setIsOrbitGenMode(!isOrbitGenMode)}
                 className={`flex items-center gap-2 text-sm font-medium px-4 py-1.5 rounded-full transition-all shadow-sm ${
                   isOrbitGenMode 
                    ? 'bg-indigo-600 text-white ring-2 ring-indigo-300 ring-offset-1' 
                    : 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100'
                 }`}
               >
                 <Bot className="w-4 h-4" /> {isOrbitGenMode ? 'Modo Selección...' : 'OrbitGen'}
               </button>
               <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-blue-500 text-white flex items-center justify-center text-xs font-bold cursor-pointer">
                 LW
               </div>
             </div>
          </div>
          
          {/* Global Filters Bar */}
          <div className="py-3 px-6 flex flex-col gap-2 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400 overflow-x-auto no-scrollbar">
               <FilterSelect label="Entidad Legal" />
               <FilterSelect label="Moneda" />
               <FilterSelect label="Banco" />
               <FilterSelect label="Cuenta" />
               <FilterSelect label="Tipo de Flujo" />
            </div>
          </div>
        </header>

        {/* Dashboard Canvas */}
        <main className="flex-1 overflow-y-auto bg-slate-100 dark:bg-slate-950 p-4 md:p-6">
          <div className="w-full max-w-[1600px] mx-auto flex flex-col gap-4">

            {/* --- ORBITGEN FLOATING PANEL --- */}
            {isOrbitGenMode && (
              <motion.div 
                initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
                className="fixed bottom-6 right-6 w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-indigo-200 dark:border-indigo-800 z-50 overflow-hidden flex flex-col"
              >
                <div className="bg-indigo-600 p-4 text-white flex justify-between items-center">
                  <div className="flex items-center gap-2 font-bold">
                    <Bot className="w-5 h-5" /> OrbitGen Report Builder
                  </div>
                  <div className="bg-indigo-800 text-xs px-2 py-1 rounded font-mono">{selectedWidgets.length} selec.</div>
                </div>
                
                <div className="p-4 flex-1 flex flex-col gap-4">
                  {!generatedReport ? (
                    <>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Haz clic en los gráficos o KPIs del dashboard que quieras incluir en tu reporte.
                      </p>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Contexto del reporte (Opcional):</label>
                        <input type="text" placeholder="Ej: Comité mensual de directorio..." className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                      </div>
                      <button 
                        onClick={handleGenerateReport}
                        disabled={selectedWidgets.length === 0 || isGenerating}
                        className={`w-full py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                          selectedWidgets.length === 0 ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg'
                        }`}
                      >
                        {isGenerating ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Sparkles className="w-4 h-4" />}
                        {isGenerating ? 'Analizando data...' : 'Generar Reporte'}
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-sm text-slate-800 dark:text-slate-200 prose prose-sm dark:prose-invert">
                        <div dangerouslySetInnerHTML={{__html: generatedReport.replace(/\n/g, '<br/>')}} />
                      </div>
                      <button onClick={() => {setGeneratedReport(null); setIsOrbitGenMode(false); setSelectedWidgets([]);}} className="text-indigo-600 text-sm font-bold hover:underline">
                        Cerrar
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* --- VISTA: LIQUIDEZ --- */}
            {activeTab === 'liquidez' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4">
                
                {/* KPIs */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {renderWidget('kpi_caja', <KpiCard title="Caja Disponible (Consolidado)" value="$150.4M" type="positive" />)}
                  {renderWidget('kpi_days', <KpiCard title="Days Cash on Hand" value="45 Días" type="positive" />)}
                  {renderWidget('kpi_brecha', <KpiCard title="Brecha Forecast (30 días)" value="+$12.5M" type="positive" />)}
                  {renderWidget('kpi_flujo', <KpiCard title="Flujo de Caja Neto (MTD)" value="-$5.2M" type="negative" />)}
                </div>

                {/* Gráficos */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {renderWidget('chart_waterfall', (
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 flex flex-col h-full">
                      <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Cascada de Cash Flow (MTD)</h3>
                      <div className="flex-1 min-h-[300px]">
                        <ReactECharts option={LIQUIDEZ_WATERFALL_OPTION} style={{ height: '100%', width: '100%' }} />
                      </div>
                    </div>
                  ))}
                  {renderWidget('chart_forecast', (
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 flex flex-col h-full">
                      <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Proyección de Liquidez (Forecast 8 Semanas)</h3>
                      <div className="flex-1 min-h-[300px]">
                        <ReactECharts option={LIQUIDEZ_LINE_OPTION} style={{ height: '100%', width: '100%' }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tabla de Cuentas */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 overflow-x-auto">
                  <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                    <Landmark className="w-4 h-4 text-indigo-500" /> Posición Consolidada por Banco
                  </h3>
                  <table className="w-full text-[11px] text-left text-slate-600 dark:text-slate-400">
                    <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-semibold border-b border-slate-200">
                      <tr><th className="py-2 px-2">Entidad / Banco</th><th className="py-2 px-2">Moneda</th><th className="py-2 px-2 text-right">Saldo Contable</th><th className="py-2 px-2 text-right">Saldo Disponible</th><th className="py-2 px-2 text-center">Estado</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr><td className="py-2 px-2 font-medium">Santander - Cta Corriente</td><td className="py-2 px-2 text-slate-500">CLP</td><td className="py-2 px-2 text-right">$45.000.000</td><td className="py-2 px-2 text-right font-bold text-slate-800 dark:text-white">$45.000.000</td><td className="py-2 px-2 text-center"><span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">Saludable</span></td></tr>
                      <tr><td className="py-2 px-2 font-medium">Banco Chile - Pago Proveedores</td><td className="py-2 px-2 text-slate-500">CLP</td><td className="py-2 px-2 text-right">$12.500.000</td><td className="py-2 px-2 text-right font-bold text-slate-800 dark:text-white">$10.200.000</td><td className="py-2 px-2 text-center"><span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">Saludable</span></td></tr>
                      <tr><td className="py-2 px-2 font-medium">Citi - Cta Exportaciones</td><td className="py-2 px-2 text-slate-500">USD</td><td className="py-2 px-2 text-right">USD 150.000</td><td className="py-2 px-2 text-right font-bold text-slate-800 dark:text-white">USD 145.000</td><td className="py-2 px-2 text-center"><span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded">Bajo Mínimo</span></td></tr>
                    </tbody>
                  </table>
                </div>

              </motion.div>
            )}

            {/* --- VISTA: COBROS Y PAGOS --- */}
            {activeTab === 'cobros' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4">
                
                {/* KPIs */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <KpiCard title="DSO (Días de Cobro)" value="42 Días" type="negative" />
                  <KpiCard title="DPO (Días de Pago)" value="35 Días" type="neutral" />
                  <KpiCard title="AR Total (Por Cobrar)" value="$143.0M" type="neutral" />
                  <KpiCard title="AP Total (Por Pagar)" value="$82.0M" type="neutral" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {/* Aging Chart */}
                  <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 flex flex-col col-span-2">
                    <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Aging de Cuentas (AR vs AP)</h3>
                    <div className="flex-1 min-h-[300px]">
                      <ReactECharts option={COBROS_AGING_OPTION} style={{ height: '100%', width: '100%' }} />
                    </div>
                  </div>
                  
                  {/* Alertas Críticas */}
                  <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 flex flex-col">
                    <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-500" /> Facturas Críticas (&gt;60 días)
                    </h3>
                    <div className="flex flex-col gap-3 flex-1 overflow-y-auto">
                      <div className="p-3 bg-rose-50 dark:bg-rose-900/10 rounded-lg border border-rose-100 dark:border-rose-900/30">
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-xs font-bold text-rose-700 dark:text-rose-400">Cliente A - F1092</span>
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">$4.5M</span>
                        </div>
                        <div className="text-[10px] text-rose-600 dark:text-rose-300">Vencida hace 92 días</div>
                      </div>
                      <div className="p-3 bg-rose-50 dark:bg-rose-900/10 rounded-lg border border-rose-100 dark:border-rose-900/30">
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-xs font-bold text-rose-700 dark:text-rose-400">Cliente B - F2031</span>
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">$2.1M</span>
                        </div>
                        <div className="text-[10px] text-rose-600 dark:text-rose-300">Vencida hace 75 días</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tabla Detalle AR/AP */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 overflow-x-auto">
                  <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                    <ArrowRightLeft className="w-4 h-4 text-indigo-500" /> Flujo de Cobros y Pagos (Próximos 15 días)
                  </h3>
                  <table className="w-full text-[11px] text-left text-slate-600 dark:text-slate-400">
                    <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-semibold border-b border-slate-200">
                      <tr><th className="py-2 px-2">Tipo</th><th className="py-2 px-2">Socio de Negocio</th><th className="py-2 px-2">Documento</th><th className="py-2 px-2 text-right">Vencimiento</th><th className="py-2 px-2 text-right">Monto</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr><td className="py-2 px-2 font-medium text-emerald-600">Cobro (AR)</td><td className="py-2 px-2">Supermercados XYZ</td><td className="py-2 px-2">INV-99012</td><td className="py-2 px-2 text-right">Mañana</td><td className="py-2 px-2 text-right font-bold text-slate-800 dark:text-white">$12.500.000</td></tr>
                      <tr><td className="py-2 px-2 font-medium text-rose-600">Pago (AP)</td><td className="py-2 px-2">Logística Global SA</td><td className="py-2 px-2">FAC-4412</td><td className="py-2 px-2 text-right">En 3 días</td><td className="py-2 px-2 text-right font-bold text-slate-800 dark:text-white">$3.200.000</td></tr>
                      <tr><td className="py-2 px-2 font-medium text-emerald-600">Cobro (AR)</td><td className="py-2 px-2">TechStore LTDA</td><td className="py-2 px-2">INV-99045</td><td className="py-2 px-2 text-right">En 5 días</td><td className="py-2 px-2 text-right font-bold text-slate-800 dark:text-white">$8.400.000</td></tr>
                    </tbody>
                  </table>
                </div>

              </motion.div>
            )}

            {/* --- VISTA: BANCOS Y CONCILIACIÓN --- */}
            {activeTab === 'bancos' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4">
                
                {/* KPIs */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <KpiCard title="Cuentas Bancarias Activas" value="12" type="neutral" />
                  <KpiCard title="Partidas No Conciliadas" value="45" type="negative" />
                  <KpiCard title="Tiempo Prom. Conciliación" value="1.2 Días" type="positive" />
                  <KpiCard title="Diferencia Total" value="-$1.5M" type="danger" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {/* Dona Estado */}
                  <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 flex flex-col">
                    <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Estado de Conciliación (Volumen)</h3>
                    <div className="flex-1 min-h-[250px]">
                      <ReactECharts option={BANCOS_DONUT_OPTION} style={{ height: '100%', width: '100%' }} />
                    </div>
                  </div>
                  
                  {/* Tabla Diferencias */}
                  <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 flex flex-col col-span-2 overflow-x-auto">
                    <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-amber-500" /> Comparativo Real vs Extracto Bancario
                    </h3>
                    <table className="w-full text-[11px] text-left text-slate-600 dark:text-slate-400">
                      <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-semibold border-b border-slate-200">
                        <tr><th className="py-2 px-2">Banco / Cuenta</th><th className="py-2 px-2 text-right">Saldo Libro (ERP)</th><th className="py-2 px-2 text-right">Saldo Banco (Extracto)</th><th className="py-2 px-2 text-right">Diferencia</th><th className="py-2 px-2 text-center">Acción</th></tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        <tr><td className="py-2 px-2 font-medium">Santander - Cta Corriente</td><td className="py-2 px-2 text-right">$45.000.000</td><td className="py-2 px-2 text-right">$45.000.000</td><td className="py-2 px-2 text-right font-bold text-emerald-600">$0</td><td className="py-2 px-2 text-center"><span className="text-emerald-600 font-bold">OK</span></td></tr>
                        <tr className="bg-amber-50/30"><td className="py-2 px-2 font-medium">Banco Chile - Pagos</td><td className="py-2 px-2 text-right">$12.500.000</td><td className="py-2 px-2 text-right">$11.000.000</td><td className="py-2 px-2 text-right font-bold text-rose-600">-$1.500.000</td><td className="py-2 px-2 text-center"><button className="text-indigo-600 hover:underline">Revisar</button></td></tr>
                        <tr><td className="py-2 px-2 font-medium">Scotiabank - Recaudación</td><td className="py-2 px-2 text-right">$8.200.000</td><td className="py-2 px-2 text-right">$8.200.000</td><td className="py-2 px-2 text-right font-bold text-emerald-600">$0</td><td className="py-2 px-2 text-center"><span className="text-emerald-600 font-bold">OK</span></td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>

              </motion.div>
            )}

            {/* --- VISTA: RIESGO Y CAPITAL --- */}
            {activeTab === 'riesgo' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4">
                
                {/* KPIs */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <KpiCard title="Exposición FX (Abierta)" value="USD 1.2M" type="negative" />
                  <KpiCard title="Cash Conversion Cycle" value="38 Días" type="positive" />
                  <KpiCard title="Deuda Corto Plazo" value="$45.0M" type="neutral" />
                  <KpiCard title="Cumplimiento Covenants" value="OK" type="positive" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 flex flex-col">
                    <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Radar de Riesgo Financiero</h3>
                    <div className="flex-1 min-h-[350px]">
                      <ReactECharts option={RIESGO_RADAR_OPTION} style={{ height: '100%', width: '100%' }} />
                    </div>
                  </div>
                  <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 flex flex-col">
                    <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-indigo-500" /> Vencimientos Críticos de Deuda
                    </h3>
                    <div className="flex flex-col gap-3 flex-1 overflow-y-auto">
                      <div className="p-3 border border-slate-200 dark:border-slate-700 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Crédito Capital de Trabajo - Santander</span>
                          <span className="text-sm font-bold text-rose-600">$15.0M</span>
                        </div>
                        <div className="flex justify-between text-[11px] text-slate-500">
                          <span>Vencimiento: 15 Octubre 2026</span>
                          <span>Tasa: 7.5% Anual</span>
                        </div>
                      </div>
                      <div className="p-3 border border-slate-200 dark:border-slate-700 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Leasing Maquinaria - BCI</span>
                          <span className="text-sm font-bold text-amber-600">$4.2M</span>
                        </div>
                        <div className="flex justify-between text-[11px] text-slate-500">
                          <span>Vencimiento: 30 Noviembre 2026</span>
                          <span>Tasa: 6.8% Anual</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </motion.div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}

// Helpers
function NavItem({ icon, label, active = false, link = "#", isDark = false }: { icon: React.ReactNode, label: string, active?: boolean, link?: string, isDark?: boolean }) {
  const activeClass = isDark 
    ? 'bg-indigo-600/20 text-indigo-400 border-l-2 border-indigo-500 rounded-l-none' 
    : 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400';
    
  const hoverClass = isDark
    ? 'text-slate-400 hover:bg-slate-800 hover:text-white'
    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200';

  return (
    <Link href={link}>
      <button className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all ${active ? activeClass : hoverClass}`}>
        {React.cloneElement(icon as React.ReactElement, { className: 'w-5 h-5 shrink-0' })}
        <span className="hidden md:block truncate">{label}</span>
      </button>
    </Link>
  );
}

function TabButton({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${
        active 
          ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-white shadow-sm' 
          : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
      }`}
    >
      {label}
    </button>
  );
}

function FilterSelect({ label }: { label: string }) {
  return (
    <div className="flex flex-col gap-1 min-w-[120px] shrink-0">
      <label className="font-semibold text-[10px] text-slate-500 flex items-center gap-1">{label}</label>
      <select className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded p-1.5 w-full focus:outline-none text-slate-600 font-medium">
        <option>Todas</option>
      </select>
    </div>
  );
}

function KpiCard({ title, value, type }: { title: string, value: string, type: 'positive' | 'negative' | 'neutral' | 'danger' }) {
  const colorMap = {
    positive: 'text-emerald-600',
    negative: 'text-amber-600',
    neutral: 'text-slate-800 dark:text-white',
    danger: 'text-rose-600'
  };
  
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 flex flex-col justify-center relative overflow-hidden">
      <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">{title}</h3>
      <div className={`text-2xl font-bold ${colorMap[type]}`}>
        {value}
      </div>
    </div>
  );
}
