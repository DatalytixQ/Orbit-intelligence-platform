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
  PackageX,
  TrendingUp,
  History
} from "lucide-react";
import Link from "next/link";
import ReactECharts from "echarts-for-react";

type Tab = 'stock' | 'evolutivo' | 'cobertura' | 'inmovilizados';

// --- OPTIONS: COBERTURA ---
const COBERTURA_DONUT_OPTION = {
  tooltip: { trigger: 'item' },
  legend: { top: '0%', left: 'center', icon: 'circle', itemWidth: 8, itemHeight: 8, textStyle: { fontSize: 10 } },
  series: [
    {
      name: 'Composición de Stock',
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['50%', '60%'],
      avoidLabelOverlap: false,
      itemStyle: { borderColor: '#fff', borderWidth: 2 },
      label: { show: true, position: 'outside', formatter: '{d}%', fontSize: 10, color: '#64748b' },
      labelLine: { show: true, length: 10, length2: 10 },
      data: [
        { value: 19, name: 'Sobrestock', itemStyle: { color: '#8b5cf6' } },
        { value: 8, name: 'Stock Sin Venta', itemStyle: { color: '#cbd5e1' } },
        { value: 20, name: 'Quiebre Stock', itemStyle: { color: '#ef4444' } },
        { value: 26, name: 'Con Stock', itemStyle: { color: '#0ea5e9' } },
        { value: 27, name: 'Por Reponer', itemStyle: { color: '#eab308' } }
      ]
    }
  ]
};

// --- OPTIONS: INMOVILIZADOS ---
const INMOVILIZADOS_DONUT_OPTION = {
  tooltip: { trigger: 'item' },
  legend: { top: '0%', left: 'center', icon: 'circle', itemWidth: 8, itemHeight: 8, textStyle: { fontSize: 10 } },
  series: [
    {
      name: '% Artículos Inmovilizados',
      type: 'pie',
      radius: ['50%', '70%'],
      center: ['50%', '60%'],
      avoidLabelOverlap: false,
      itemStyle: { borderColor: '#fff', borderWidth: 2 },
      label: { show: true, position: 'outside', formatter: '{d}%', fontSize: 10, color: '#64748b' },
      labelLine: { show: true, length: 10, length2: 10 },
      data: [
        { value: 95, name: '0 meses', itemStyle: { color: '#334155' } },
        { value: 4, name: '1 a 3 meses', itemStyle: { color: '#2563eb' } },
        { value: 1, name: '4 a 6 meses', itemStyle: { color: '#d946ef' } },
      ]
    }
  ]
};

const INMOVILIZADOS_BAR_OPTION = {
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  legend: { top: '0%', left: 'center', icon: 'circle', itemWidth: 8, itemHeight: 8, textStyle: { fontSize: 10 } },
  grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  xAxis: { type: 'value', max: 30, axisLabel: { formatter: '{value}%', fontSize: 10 }, splitLine: { lineStyle: { type: 'dashed' } } },
  yAxis: { 
    type: 'category', 
    data: ['Viña Del Mar', 'La Serena', 'Antofagasta', 'Temuco', 'Iquique', 'Rancagua', 'Puerto Montt', 'Concepción', 'Matta', 'Centro Distribución', 'Importado'],
    axisLabel: { fontSize: 9 }
  },
  series: [
    { name: '0 meses', type: 'bar', stack: 'total', itemStyle: { color: '#334155' }, data: [2, 3, 3, 3, 3, 3, 3, 4, 10, 18, 26] },
    { name: '1 a 3 meses', type: 'bar', stack: 'total', itemStyle: { color: '#2563eb' }, data: [0, 0, 0, 0, 0, 0, 0, 0, 0.5, 2, 2] },
    { name: '4 a 6 meses', type: 'bar', stack: 'total', itemStyle: { color: '#d946ef' }, data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0.5, 0.5] }
  ]
};

// --- OPTIONS: STOCK ---
const STOCK_CATEGORY_BAR_OPTION = {
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  legend: { top: '0%', left: 'center', icon: 'circle', itemWidth: 8, itemHeight: 8, textStyle: { fontSize: 10 } },
  grid: { left: '3%', right: '4%', bottom: '5%', containLabel: true },
  xAxis: { type: 'category', data: ['Electrónica', 'Mobiliario', 'Accesorios', 'Herramientas', 'Insumos'], axisLabel: { fontSize: 9 } },
  yAxis: [
    { type: 'value', name: 'Unidades (k)', axisLabel: { formatter: '{value}k', fontSize: 9 }, splitLine: { lineStyle: { type: 'dashed' } } },
    { type: 'value', name: 'Valor (M$)', axisLabel: { formatter: '${value}M', fontSize: 9 }, splitLine: { show: false } }
  ],
  series: [
    { name: 'Unidades', type: 'bar', data: [120, 85, 210, 45, 300], itemStyle: { color: '#3b82f6', borderRadius: [4, 4, 0, 0] } },
    { name: 'Valor', type: 'line', yAxisIndex: 1, data: [8.5, 6.2, 3.1, 4.5, 1.2], itemStyle: { color: '#10b981' }, lineStyle: { width: 3 }, symbol: 'circle', symbolSize: 6 }
  ]
};

const STOCK_WAREHOUSE_DONUT_OPTION = {
  tooltip: { trigger: 'item' },
  legend: { bottom: '0%', left: 'center', icon: 'circle', itemWidth: 8, itemHeight: 8, textStyle: { fontSize: 10 } },
  series: [
    {
      name: 'Distribución por Almacén (Valor)',
      type: 'pie',
      radius: ['45%', '75%'],
      center: ['50%', '45%'],
      avoidLabelOverlap: false,
      itemStyle: { borderColor: '#fff', borderWidth: 2 },
      label: { show: false },
      data: [
        { value: 45, name: 'Centro Distribución', itemStyle: { color: '#0ea5e9' } },
        { value: 25, name: 'Tienda Matriz', itemStyle: { color: '#f59e0b' } },
        { value: 15, name: 'E-Commerce', itemStyle: { color: '#8b5cf6' } },
        { value: 15, name: 'Regiones', itemStyle: { color: '#94a3b8' } }
      ]
    }
  ]
};

// --- OPTIONS: EVOLUTIVO ---
const EVOLUTIVO_LINE_OPTION = {
  tooltip: { trigger: 'axis' },
  legend: { top: '0%', left: 'center', icon: 'circle', itemWidth: 8, itemHeight: 8, textStyle: { fontSize: 10 } },
  grid: { left: '3%', right: '4%', bottom: '5%', containLabel: true },
  xAxis: { type: 'category', boundaryGap: false, data: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'] },
  yAxis: { type: 'value', axisLabel: { formatter: '{value}k', fontSize: 9 }, splitLine: { lineStyle: { type: 'dashed' } } },
  series: [
    { name: 'Stock Total', type: 'line', smooth: true, data: [120, 132, 101, 134, 90, 230, 210, 220, 180, 190, 210, 250], itemStyle: { color: '#6366f1' }, lineStyle: { width: 2 }, areaStyle: { opacity: 0.1 } },
    { name: 'Compras (Ingresos)', type: 'line', step: 'middle', data: [20, 30, 15, 45, 10, 150, 40, 50, 30, 40, 60, 80], itemStyle: { color: '#10b981' }, lineStyle: { type: 'dashed' } },
    { name: 'Consumo (Salidas)', type: 'line', data: [15, 25, 30, 25, 40, 45, 50, 40, 55, 60, 50, 70], itemStyle: { color: '#ef4444' }, lineStyle: { width: 2 } }
  ]
};

const EVOLUTIVO_COBERTURA_OPTION = {
  tooltip: { trigger: 'axis' },
  grid: { left: '3%', right: '4%', bottom: '5%', containLabel: true },
  xAxis: { type: 'category', data: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'] },
  yAxis: { type: 'value', name: 'Días Cobertura', splitLine: { lineStyle: { type: 'dashed' } } },
  series: [
    { name: 'Días Cobertura', type: 'bar', data: [65, 60, 45, 55, 30, 85, 75, 70, 60, 50, 55, 60], itemStyle: { color: '#3b82f6', borderRadius: [4, 4, 0, 0] } },
    { name: 'Meta', type: 'line', data: [45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45], itemStyle: { color: '#ef4444' }, markLine: { data: [{ type: 'average', name: 'Meta (45 días)' }] } }
  ]
};

import DynamicSidebar from "@/components/layout/DynamicSidebar";

export default function InventoryDashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>('stock');

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
                 Inventario (S&OP)
               </h1>
             </div>
             
             {/* Central Tabs */}
             <div className="hidden lg:flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                <TabButton label="Inventario Stock" active={activeTab === 'stock'} onClick={() => setActiveTab('stock')} />
                <TabButton label="Evolutivo" active={activeTab === 'evolutivo'} onClick={() => setActiveTab('evolutivo')} />
                <TabButton label="Cobertura" active={activeTab === 'cobertura'} onClick={() => setActiveTab('cobertura')} />
                <TabButton label="Inmovilizados" active={activeTab === 'inmovilizados'} onClick={() => setActiveTab('inmovilizados')} />
             </div>

             <div className="flex items-center gap-4 text-sm">
               <span className="text-slate-400 text-xs hidden xl:block">Última actualización: Hoy, 08:30 AM (SAP B1)</span>
               <button className="flex items-center gap-2 text-sm font-medium text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 px-4 py-1.5 rounded-full hover:bg-indigo-100 transition-colors">
                 <Bot className="w-4 h-4" /> OrbitGen
               </button>
               <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-blue-500 text-white flex items-center justify-center text-xs font-bold cursor-pointer">
                 LW
               </div>
             </div>
          </div>
          
          {/* Global Filters Bar */}
          <div className="py-3 px-6 flex flex-col gap-2 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400 overflow-x-auto no-scrollbar">
               <FilterSelect label="Almacén" />
               <FilterSelect label="Categoría" />
               <FilterSelect label="Subcategoría" />
               <FilterSelect label="Marca" />
               <FilterSelect label="SKU" />
               <FilterSelect label="Producto" />
            </div>
          </div>
        </header>

        {/* Dashboard Canvas */}
        <main className="flex-1 overflow-y-auto bg-slate-100 dark:bg-slate-950 p-4 md:p-6">
          <div className="w-full max-w-[1600px] mx-auto flex flex-col gap-4">

            {/* --- VISTA: STOCK --- */}
            {activeTab === 'stock' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4">
                
                {/* Top KPIs (Image 1 style) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-600">
                        <DollarSign className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400">Stock ($)</h3>
                        <div className="text-2xl font-bold text-slate-800 dark:text-white">$23.857.182.403</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600">
                        <Package className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400">Stock (Q)</h3>
                        <div className="text-2xl font-bold text-slate-800 dark:text-white">35.562.624</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-600">
                        <PackageX className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400"># SKUs distintos</h3>
                        <div className="text-2xl font-bold text-slate-800 dark:text-white">8.842</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3-Column Layout (Image 1) */}
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
                  
                  {/* LEFT COLUMN: Charts */}
                  <div className="xl:col-span-1 flex flex-col gap-4">
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 flex flex-col">
                      <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">¿Cómo se distribuye el stock por almacen?</h3>
                      <div className="flex-1 min-h-[220px]">
                        <ReactECharts option={STOCK_WAREHOUSE_DONUT_OPTION} style={{ height: '100%', width: '100%' }} />
                      </div>
                    </div>
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 flex flex-col flex-1">
                      <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Stock Por Categoría (Valorizado)</h3>
                      <div className="flex-1 min-h-[250px]">
                        <ReactECharts option={{
                           ...STOCK_CATEGORY_BAR_OPTION,
                           tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, formatter: '{b}: ${c}M' },
                           xAxis: { type: 'value', name: 'Valor en Millones ($)', nameLocation: 'middle', nameGap: 25, splitLine: { lineStyle: { type: 'dashed' } }, axisLabel: { formatter: '${value}M', fontSize: 9 } },
                           yAxis: { type: 'category', data: ['Tablets', 'TV y Video', 'Smart Home', 'Gaming', 'Smartphones', 'Componentes PC', 'Fotografía', 'Computadores', 'Audio', 'Accesorios'].reverse(), axisLabel: { fontSize: 9, width: 80, overflow: 'truncate' } },
                           series: [{ name: 'Valor', type: 'bar', data: [2.07, 2.25, 2.25, 2.29, 2.32, 2.33, 2.36, 2.42, 6.66, 23.19].reverse(), itemStyle: { color: '#3b82f6' }, label: { show: true, position: 'right', formatter: '${c}M', fontSize: 9, color: '#64748b' } }]
                        }} style={{ height: '100%', width: '100%' }} />
                      </div>
                    </div>
                  </div>

                  {/* CENTER COLUMN: Stock Articulos Table */}
                  <div className="xl:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 flex flex-col overflow-hidden">
                    <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Stock Artículos</h3>
                    <div className="flex-1 overflow-auto">
                      <table className="w-full text-[10px] text-left text-slate-600 dark:text-slate-400 whitespace-nowrap">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-semibold border-b border-slate-200 sticky top-0 z-10">
                          <tr>
                            <th className="py-2 px-2">SKU</th>
                            <th className="py-2 px-2">Nombre Artículo</th>
                            <th className="py-2 px-2 text-right">Stock Q</th>
                            <th className="py-2 px-2 text-right">Stock $</th>
                            <th className="py-2 px-2 text-right">Entradas Q</th>
                            <th className="py-2 px-2 text-right">Salidas Q</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {Array.from({length: 15}).map((_, i) => (
                            <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                              <td className="py-1.5 px-2 font-medium">TECH-{3862 + i}-10{i}</td>
                              <td className="py-1.5 px-2 truncate max-w-[150px]">Producto Tecnológico Premium {i+1}</td>
                              <td className="py-1.5 px-2 text-right">{(25000 - i * 1500).toLocaleString()}</td>
                              <td className="py-1.5 px-2 text-right bg-blue-50/50 text-blue-700 font-medium">${(136560303 - i * 3000000).toLocaleString()}</td>
                              <td className="py-1.5 px-2 text-right bg-emerald-50/30 text-emerald-700">{(1765529 - i * 50000).toLocaleString()}</td>
                              <td className="py-1.5 px-2 text-right bg-rose-50/30 text-rose-700">{(1742069 - i * 45000).toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-slate-50 dark:bg-slate-800/50 font-bold sticky bottom-0 border-t border-slate-200">
                          <tr>
                            <td colSpan={2} className="py-2 px-2">Total</td>
                            <td className="py-2 px-2 text-right">35.562.624</td>
                            <td className="py-2 px-2 text-right">$23.857.182.403</td>
                            <td className="py-2 px-2 text-right">4.697.591.674</td>
                            <td className="py-2 px-2 text-right">4.662.029.051</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>

                  {/* RIGHT COLUMN: Stock Por Almacen y Marca */}
                  <div className="xl:col-span-1 flex flex-col gap-4">
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 flex-1 overflow-auto">
                      <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Stock Por Almacen y Marca</h3>
                      <table className="w-full text-[10px] text-left text-slate-600 dark:text-slate-400 whitespace-nowrap">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-semibold border-b border-slate-200">
                          <tr>
                            <th className="py-2 px-2">Almacen</th>
                            <th className="py-2 px-2 text-right">Stock ($)</th>
                            <th className="py-2 px-2 text-right">Stock (Q)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          <tr><td className="py-1.5 px-2 font-medium flex items-center gap-1"><span className="w-2 h-2 rounded bg-orange-500"></span> Centro Distribución</td><td className="py-1.5 px-2 text-right">19.669.612</td><td className="py-1.5 px-2 text-right">14.782.643.357</td></tr>
                          <tr><td className="py-1.5 px-2 font-medium flex items-center gap-1"><span className="w-2 h-2 rounded bg-sky-500"></span> Tienda</td><td className="py-1.5 px-2 text-right">14.180.622</td><td className="py-1.5 px-2 text-right">8.319.046.017</td></tr>
                          <tr><td className="py-1.5 px-2 font-medium flex items-center gap-1"><span className="w-2 h-2 rounded bg-blue-500"></span> E-Commerce/B2B</td><td className="py-1.5 px-2 text-right">1.316.947</td><td className="py-1.5 px-2 text-right">478.499.108</td></tr>
                          <tr><td className="py-1.5 px-2 font-medium flex items-center gap-1"><span className="w-2 h-2 rounded bg-emerald-500"></span> Traspaso</td><td className="py-1.5 px-2 text-right">348.525</td><td className="py-1.5 px-2 text-right">134.630.335</td></tr>
                          <tr><td className="py-1.5 px-2 font-medium flex items-center gap-1"><span className="w-2 h-2 rounded bg-rose-500"></span> Operaciones</td><td className="py-1.5 px-2 text-right">19.158</td><td className="py-1.5 px-2 text-right">64.562.908</td></tr>
                          <tr><td className="py-1.5 px-2 font-medium flex items-center gap-1"><span className="w-2 h-2 rounded bg-purple-500"></span> Liquidación</td><td className="py-1.5 px-2 text-right">24.473</td><td className="py-1.5 px-2 text-right">59.566.965</td></tr>
                          <tr className="font-bold bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200">
                            <td className="py-2 px-2 text-slate-800 dark:text-white">Total</td>
                            <td className="py-2 px-2 text-right text-slate-800 dark:text-white">35.562.624</td>
                            <td className="py-2 px-2 text-right text-slate-800 dark:text-white">$23.857.182.403</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              </motion.div>
            )}

            {/* --- VISTA: EVOLUTIVO --- */}
            {activeTab === 'evolutivo' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4">
                
                {/* KPIs */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <KpiCard title="Rotación Promedio (Mensual)" value="2.4x" type="positive" />
                  <KpiCard title="Variación Stock vs Mes Ant." value="+5.2%" type="neutral" />
                  <KpiCard title="Ingresos (Compras) YTD" value="480K und." type="neutral" />
                  <KpiCard title="Salidas (Consumo) YTD" value="495K und." type="positive" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Evolucion Histórica */}
                  <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 flex flex-col">
                    <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                      <History className="w-4 h-4 text-indigo-500" /> Línea de Tiempo: Stock vs Entradas/Salidas
                    </h3>
                    <div className="flex-1 min-h-[300px]">
                      <ReactECharts option={EVOLUTIVO_LINE_OPTION} style={{ height: '100%', width: '100%' }} />
                    </div>
                  </div>

                  {/* Evolucion Cobertura */}
                  <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 flex flex-col">
                    <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                      <Package className="w-4 h-4 text-indigo-500" /> Evolución de Cobertura Global (Días)
                    </h3>
                    <div className="flex-1 min-h-[300px]">
                      <ReactECharts option={EVOLUTIVO_COBERTURA_OPTION} style={{ height: '100%', width: '100%' }} />
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 overflow-x-auto">
                  <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Tabla Histórica de Variación</h3>
                  <table className="w-full text-[11px] text-left text-slate-600 dark:text-slate-400">
                    <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-semibold border-b border-slate-200">
                      <tr><th className="py-2 px-2">Mes</th><th className="py-2 px-2 text-right">Inventario Inicial</th><th className="py-2 px-2 text-right">Entradas (Compras)</th><th className="py-2 px-2 text-right">Salidas (Consumo)</th><th className="py-2 px-2 text-right">Inventario Final</th><th className="py-2 px-2 text-center">Variación %</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr><td className="py-2 px-2 font-medium">Agosto 2025</td><td className="py-2 px-2 text-right">210,000</td><td className="py-2 px-2 text-right text-emerald-600">+50,000</td><td className="py-2 px-2 text-right text-rose-600">-40,000</td><td className="py-2 px-2 text-right font-bold">220,000</td><td className="py-2 px-2 text-center text-emerald-600">+4.7%</td></tr>
                      <tr><td className="py-2 px-2 font-medium">Julio 2025</td><td className="py-2 px-2 text-right">230,000</td><td className="py-2 px-2 text-right text-emerald-600">+30,000</td><td className="py-2 px-2 text-right text-rose-600">-50,000</td><td className="py-2 px-2 text-right font-bold">210,000</td><td className="py-2 px-2 text-center text-rose-600">-8.6%</td></tr>
                      <tr><td className="py-2 px-2 font-medium">Junio 2025</td><td className="py-2 px-2 text-right">125,000</td><td className="py-2 px-2 text-right text-emerald-600">+150,000</td><td className="py-2 px-2 text-right text-rose-600">-45,000</td><td className="py-2 px-2 text-right font-bold">230,000</td><td className="py-2 px-2 text-center text-emerald-600">+84.0%</td></tr>
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* --- VISTA: COBERTURA --- */}
            {activeTab === 'cobertura' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {/* Resumen por Almacen */}
                  <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 col-span-2 overflow-x-auto">
                    <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Resumen por almacén</h3>
                    <table className="w-full text-[11px] text-left text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
                        <tr>
                          <th className="py-2 px-2">Almacén</th>
                          <th className="py-2 px-2 text-right">Con Stock</th>
                          <th className="py-2 px-2 text-right">Por Reponer</th>
                          <th className="py-2 px-2 text-right">Quiebre Stock</th>
                          <th className="py-2 px-2 text-right">Sobrestock</th>
                          <th className="py-2 px-2 text-right">Stock Sin Venta</th>
                          <th className="py-2 px-2 text-right">$ Stock Total</th>
                          <th className="py-2 px-2 text-right">$ Sobrestock</th>
                          <th className="py-2 px-2 text-right">% Costo Sobrestock</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                          <td className="py-2 px-2 font-medium flex items-center gap-2"><span className="w-2 h-2 rounded bg-rose-500"></span> Tienda</td>
                          <td className="py-2 px-2 text-right bg-blue-50/50 text-blue-700 font-medium">35%</td>
                          <td className="py-2 px-2 text-right bg-yellow-50/50 text-yellow-700 font-medium">25%</td>
                          <td className="py-2 px-2 text-right bg-rose-50/50 text-rose-700 font-medium">66%</td>
                          <td className="py-2 px-2 text-right bg-purple-50/50 text-purple-700 font-medium">47%</td>
                          <td className="py-2 px-2 text-right">33%</td>
                          <td className="py-2 px-2 text-right">$7.721.791.365</td>
                          <td className="py-2 px-2 text-right text-purple-600">$1.633.313.747</td>
                          <td className="py-2 px-2 text-right bg-pink-50/50 text-pink-700 font-medium">21%</td>
                        </tr>
                        <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                          <td className="py-2 px-2 font-medium flex items-center gap-2"><span className="w-2 h-2 rounded bg-orange-500"></span> Centro Distribución</td>
                          <td className="py-2 px-2 text-right bg-blue-50/50 text-blue-700 font-medium">14%</td>
                          <td className="py-2 px-2 text-right bg-yellow-50/50 text-yellow-700 font-medium">6%</td>
                          <td className="py-2 px-2 text-right bg-rose-50/50 text-rose-700 font-medium">13%</td>
                          <td className="py-2 px-2 text-right bg-purple-50/50 text-purple-700 font-medium">22%</td>
                          <td className="py-2 px-2 text-right">82%</td>
                          <td className="py-2 px-2 text-right">$17.580.070.486</td>
                          <td className="py-2 px-2 text-right text-purple-600">$677.776.353</td>
                          <td className="py-2 px-2 text-right bg-pink-50/50 text-pink-700 font-medium">4%</td>
                        </tr>
                        <tr className="font-bold bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200">
                          <td className="py-2 px-2 text-slate-800 dark:text-white">Total</td>
                          <td className="py-2 px-2 text-right text-slate-800 dark:text-white">27%</td>
                          <td className="py-2 px-2 text-right text-slate-800 dark:text-white">20%</td>
                          <td className="py-2 px-2 text-right text-slate-800 dark:text-white">57%</td>
                          <td className="py-2 px-2 text-right text-slate-800 dark:text-white">38%</td>
                          <td className="py-2 px-2 text-right text-slate-800 dark:text-white">70%</td>
                          <td className="py-2 px-2 text-right text-slate-800 dark:text-white">$25.732.648.393</td>
                          <td className="py-2 px-2 text-right text-purple-700">$2.419.601.543</td>
                          <td className="py-2 px-2 text-right text-pink-700">9%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Composición de Stock (Donut) */}
                  <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 col-span-1 flex flex-col">
                    <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Composición de stock</h3>
                    <div className="flex-1 min-h-[220px]">
                      <ReactECharts option={COBERTURA_DONUT_OPTION} style={{ height: '100%', width: '100%' }} />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                  {/* Detalle Inventario y Cobertura */}
                  <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 col-span-2 overflow-x-auto">
                    <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Detalle Movimientos y Cobertura</h3>
                    <table className="w-full text-[10px] text-left text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
                        <tr>
                          <th className="py-2 px-2">SKU</th>
                          <th className="py-2 px-2 text-right">Stock Traspaso</th>
                          <th className="py-2 px-2 text-right">En Tránsito Almacén</th>
                          <th className="py-2 px-2 text-right">En Tránsito Traspaso</th>
                          <th className="py-2 px-2 text-right">Comprom. Almacén</th>
                          <th className="py-2 px-2 text-right">Stock Final</th>
                          <th className="py-2 px-2 text-right bg-emerald-50/50">Venta Promedio 6M</th>
                          <th className="py-2 px-2 text-right">Meses Cobertura</th>
                          <th className="py-2 px-2 text-right">Cobertura Estado</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {Array.from({length: 5}).map((_, i) => (
                          <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                            <td className="py-2 px-2 font-medium">TECH-{(39544 + i).toString()}-12</td>
                            <td className="py-2 px-2 text-right">100,0</td>
                            <td className="py-2 px-2 text-right">2.010.000,0</td>
                            <td className="py-2 px-2 text-right">0,0</td>
                            <td className="py-2 px-2 text-right">1.700,0</td>
                            <td className="py-2 px-2 text-right font-bold text-slate-800 dark:text-white">{2008400 - (i*500000)}</td>
                            <td className="py-2 px-2 text-right bg-emerald-50/30 font-medium">0,0</td>
                            <td className="py-2 px-2 text-right">-</td>
                            <td className="py-2 px-2 text-right text-slate-400 font-medium">Stock Sin Venta</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex flex-col gap-4 col-span-1">
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 overflow-x-auto">
                      <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center justify-between">
                        Venta perdida por quiebre
                        <AlertTriangle className="w-4 h-4 text-rose-500" />
                      </h3>
                      <table className="w-full text-[10px] text-left text-slate-600 dark:text-slate-400">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-semibold border-b border-slate-200">
                          <tr><th className="py-1 px-1">Producto</th><th className="py-1 px-1">SKU</th><th className="py-1 px-1 text-right">Venta Perdida</th></tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          <tr className="bg-rose-50/50"><td className="py-1.5 px-1 truncate max-w-[120px]">Kingston Drones Pro</td><td className="py-1.5 px-1">TECH-39544-712</td><td className="py-1.5 px-1 text-right text-rose-700 font-bold">$140.523.057</td></tr>
                          <tr><td className="py-1.5 px-1 truncate max-w-[120px]">AMD Streaming Devices</td><td className="py-1.5 px-1">TECH-39578-224</td><td className="py-1.5 px-1 text-right text-rose-600 font-medium">$107.222.207</td></tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* --- VISTA: INMOVILIZADOS --- */}
            {activeTab === 'inmovilizados' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-4">
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 overflow-x-auto">
                      <table className="w-full text-[11px] text-left text-slate-600 dark:text-slate-400 whitespace-nowrap">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-semibold border-b border-slate-200">
                          <tr><th className="py-2 px-2">Rango Inmovilización</th><th className="py-2 px-2 text-right">Stock $</th><th className="py-2 px-2 text-right">% Stock $</th><th className="py-2 px-2 text-right">Stock Q</th><th className="py-2 px-2 text-right">% Stock Q</th></tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          <tr className="bg-slate-50/50">
                            <td className="py-2 px-2 font-medium flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-700"></span> 0 meses</td>
                            <td className="py-2 px-2 text-right font-medium text-slate-800">$21.342.865.582</td><td className="py-2 px-2 text-right font-bold text-slate-700">89%</td><td className="py-2 px-2 text-right">14.914.374</td><td className="py-2 px-2 text-right">99%</td>
                          </tr>
                          <tr>
                            <td className="py-2 px-2 font-medium flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-600"></span> 1 a 3 meses</td>
                            <td className="py-2 px-2 text-right text-slate-600">$1.507.580.308</td><td className="py-2 px-2 text-right">6%</td><td className="py-2 px-2 text-right">77.816</td><td className="py-2 px-2 text-right">1%</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 flex flex-col">
                      <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Porcentaje de artículos inmovilizados</h3>
                      <div className="flex-1 min-h-[200px]"><ReactECharts option={INMOVILIZADOS_DONUT_OPTION} style={{ height: '100%', width: '100%' }} /></div>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 col-span-1 flex flex-col">
                    <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Porcentaje de artículos inmovilizados por almacén</h3>
                    <div className="flex-1 min-h-[400px]"><ReactECharts option={INMOVILIZADOS_BAR_OPTION} style={{ height: '100%', width: '100%' }} /></div>
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
