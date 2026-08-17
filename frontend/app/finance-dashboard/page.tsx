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
  MessageSquare,
  Sparkles,
  TrendingUp,
  TrendingDown,
  ChevronDown,
  ChevronRight,
  Filter,
  DollarSign,
  Download,
  Maximize2
} from "lucide-react";
import Link from "next/link";
import ReactECharts from "echarts-for-react";

// Mock Data
const KPIS = [
  { title: "Ingresos", value: "$24.747", prev: "$23.014", yoy: "+8%", isPositive: true },
  { title: "Margen Bruto", value: "$12.049", prev: "$10.891", yoy: "+11%", isPositive: true },
  { title: "EBITDA", value: "$1.706", prev: "($37)", yoy: "+4666%", isPositive: true },
  { title: "Resultado del Ejercicio", value: "$1.614", prev: "($1.120)", yoy: "+244%", isPositive: true },
];

const EERR_DATA = [
  { id: "1", name: "Ingresos Operacionales", pct: "100,0%", real: "$24.747", prev: "$23.014", var: "8%", isPositive: true, children: [
    { id: "1.1", name: "Ventas", pct: "100,0%", real: "$24.747", prev: "$23.014", var: "8%", isPositive: true }
  ]},
  { id: "2", name: "Costos Operacionales", pct: "-51,3%", real: "($12.698)", prev: "($12.123)", var: "5%", isPositive: false, children: [
    { id: "2.1", name: "Costo De Ventas", pct: "-51,3%", real: "($12.698)", prev: "($12.123)", var: "5%", isPositive: false },
    { id: "2.2", name: "Costos de Producción", pct: "0,0%", real: "$0", prev: "$0", var: "0%", isPositive: true }
  ]},
  { id: "3", name: "Margen Bruto", pct: "48,7%", real: "$12.049", prev: "$10.891", var: "11%", isPositive: true, isTotal: true },
  { id: "4", name: "Gastos Operacionales", pct: "-41,8%", real: "($10.343)", prev: "($10.928)", var: "-5%", isPositive: true, children: [
    { id: "4.1", name: "Gasto Transporte", pct: "-0,2%", real: "($58)", prev: "($77)", var: "-25%", isPositive: true },
    { id: "4.2", name: "Gastos Administración", pct: "-8,0%", real: "($1.982)", prev: "($1.740)", var: "14%", isPositive: false },
    { id: "4.3", name: "Gastos de Mantenimiento", pct: "-0,1%", real: "($33)", prev: "($45)", var: "-26%", isPositive: true },
    { id: "4.4", name: "Gastos de Operación", pct: "-11,4%", real: "($2.815)", prev: "($3.051)", var: "-8%", isPositive: true },
    { id: "4.5", name: "Gastos Marketing", pct: "-0,3%", real: "($68)", prev: "($99)", var: "-31%", isPositive: true },
    { id: "4.6", name: "Gastos Ventas", pct: "-6,8%", real: "($1.685)", prev: "($1.247)", var: "35%", isPositive: false },
    { id: "4.7", name: "Remuneraciones", pct: "-14,1%", real: "($3.501)", prev: "($4.582)", var: "-24%", isPositive: true },
  ]},
  { id: "5", name: "EBITDA", pct: "6,9%", real: "$1.706", prev: "($37)", var: "4666%", isPositive: true, isTotal: true },
  { id: "6", name: "Otros Ingresos", pct: "0,1%", real: "$15", prev: "$49", var: "-69%", isPositive: false },
  { id: "7", name: "Otros Gastos", pct: "-0,4%", real: "($107)", prev: "($1.132)", var: "-91%", isPositive: true },
  { id: "8", name: "Utilidad del Ejercicio", pct: "6,5%", real: "$1.614", prev: "($1.120)", var: "244%", isPositive: true, isTotal: true },
];

const LINE_CHART_OPTION = {
  tooltip: { trigger: 'axis', backgroundColor: '#ffffff', textStyle: { color: '#0f172a' }, borderColor: '#e2e8f0', padding: 12 },
  grid: { top: 30, left: 50, right: 20, bottom: 30 },
  legend: { data: ['Año Actual', 'Año Anterior'], left: 0, top: 0, icon: 'diamond', itemWidth: 10, itemHeight: 10, textStyle: { color: '#64748b' } },
  xAxis: { type: 'category', data: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sept', 'Oct', 'Nov', 'Dic'], axisLine: { lineStyle: { color: '#cbd5e1' } }, axisTick: { show: false } },
  yAxis: { type: 'value', axisLabel: { formatter: '${value}' }, splitLine: { lineStyle: { type: 'dashed', color: '#f1f5f9' } } },
  series: [
    { name: 'Año Actual', type: 'line', smooth: true, symbol: 'circle', symbolSize: 6, lineStyle: { width: 3, color: '#1e3a8a' }, itemStyle: { color: '#1e3a8a' }, data: [1900, 2000, 2800, 1950, 2050, 1900, 2300, 2800, 1800, 2400, 2200, 1700] },
    { name: 'Año Anterior', type: 'line', smooth: true, symbol: 'circle', symbolSize: 6, lineStyle: { width: 2, color: '#60a5fa' }, itemStyle: { color: '#60a5fa' }, data: [1700, 1750, 2400, 1800, 1900, 1850, 2100, 2500, 1750, 2100, 2250, 1800] }
  ]
};

const WATERFALL_CHART_OPTION = {
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  grid: { top: 30, left: 60, right: 20, bottom: 30 },
  legend: { data: ['Aumento', 'Disminución', 'Total'], left: 0, top: 0, icon: 'circle', itemWidth: 10, itemHeight: 10 },
  xAxis: { type: 'category', data: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sept', 'Oct', 'Nov', 'Dic', 'Total'], axisLine: { lineStyle: { color: '#cbd5e1' } }, axisTick: { show: false } },
  yAxis: { type: 'value', axisLabel: { formatter: '${value} mill.' }, splitLine: { lineStyle: { type: 'dashed', color: '#f1f5f9' } } },
  series: [
    { name: 'Ayuda', type: 'bar', stack: 'Total', itemStyle: { borderColor: 'transparent', color: 'transparent' }, emphasis: { itemStyle: { borderColor: 'transparent', color: 'transparent' } }, data: [0, 41, 90, 246, 342, 415, 467, 848, 526, 763, 763, 1614, 0] },
    { name: 'Aumento', type: 'bar', stack: 'Total', itemStyle: { color: '#22c55e' }, data: [41, 49, 156, 96, 73, 52, 381, 0, 237, 0, 851, 0, 0] },
    { name: 'Disminución', type: 'bar', stack: 'Total', itemStyle: { color: '#ef4444' }, data: [0, 0, 0, 0, 0, 0, 0, -322, 0, -0, 0, -0, 0] },
    { name: 'Total', type: 'bar', stack: 'Total', itemStyle: { color: '#3b82f6' }, data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1614] }
  ]
};

// Balance Mock Data
const BALANCE_ACTIVOS = [
  { id: '1', name: 'Activos', y22: '$20.909.776.485', y23: '$20.436.393.591', y24: '$20.863.997.207', isBold: true, children: [
    { id: '1.1', name: 'Circulante', y22: '$20.736.347.799', y23: '$20.287.880.395', y24: '$20.707.490.622', isBold: true, children: [
      { id: '1.1.1', name: 'Deudores Por Venta', y22: '$4.699.292.656', y23: '$4.469.465.326', y24: '$4.912.784.009' },
      { id: '1.1.2', name: 'Deudores Varios', y22: '$40.536.182', y23: '$40.282.184', y24: '$42.532.173' },
      { id: '1.1.3', name: 'Disponible', y22: '$595.202.246', y23: '$486.479.803', y24: '$545.959.546' },
      { id: '1.1.4', name: 'Documentos Por Cobrar', y22: '$39.197.869', y23: '$25.447.869', y24: '$0' },
      { id: '1.1.5', name: 'Existencias', y22: '$14.299.258.698', y23: '$14.594.288.507', y24: '$14.287.206.574' },
      { id: '1.1.6', name: 'Impuestos Por Recuperar', y22: '$841.127.174', y23: '$639.808.633', y24: '$882.449.209' },
      { id: '1.1.7', name: 'Inversiones', y22: '$221.732.974', y23: '$32.108.073', y24: '$36.559.111' },
    ]},
    { id: '1.2', name: 'Fijos', y22: '$58.507.221', y23: '$33.591.731', y24: '$41.585.120', isBold: true, children: [
      { id: '1.2.1', name: 'Construc. Obras Infraestructura', y22: '$73.923.473', y23: '$74.550.565', y24: '$75.061.714' },
      { id: '1.2.2', name: 'Depreciacion Acumulada', y22: '($1.158.085.276)', y23: '($1.192.267.037)', y24: '($1.247.304.314)' },
      { id: '1.2.3', name: 'Informática', y22: '$142.097.202', y23: '$149.401.127', y24: '$166.674.616' },
      { id: '1.2.4', name: 'Maquinaria Y Equipos', y22: '$277.253.142', y23: '$277.742.076', y24: '$280.515.083' },
      { id: '1.2.5', name: 'Otros Activos Fijos', y22: '$723.318.680', y23: '$724.165.000', y24: '$766.638.021' },
    ]},
    { id: '1.3', name: 'Otros', y22: '$114.921.465', y23: '$114.921.465', y24: '$114.921.465', isBold: true, children: [
      { id: '1.3.1', name: 'Retiros', y22: '$114.921.465', y23: '$114.921.465', y24: '$114.921.465' }
    ]}
  ]}
];

const BALANCE_PASIVOS = [
  { id: '2', name: 'Pasivos', y22: '($1.394.809.824)', y23: '($732.619.875)', y24: '$743.452.607', isBold: true, children: [
    { id: '2.1', name: 'Circulante', y22: '($1.394.809.824)', y23: '($732.619.875)', y24: '$743.452.607', isBold: true, children: [
      { id: '2.1.1', name: 'Ctas Por Pagar', y22: '($988.321.276)', y23: '($360.144.080)', y24: '$1.316.079.614' },
      { id: '2.1.2', name: 'Documentos Por Pagar', y22: '$127.675', y23: '$74.978.862', y24: '($120.052.526)' },
      { id: '2.1.3', name: 'Impuestos Por Pagar', y22: '$0', y23: '($7.471)', y24: '($217.204.096)' },
      { id: '2.1.4', name: 'Provisiones Y Retenciones', y22: '($406.616.223)', y23: '($447.447.186)', y24: '($235.370.385)' },
    ]}
  ]},
  { id: '3', name: 'Patrimonio', y22: '($19.514.966.661)', y23: '($19.703.773.716)', y24: '($21.607.449.814)', isBold: true, children: [
    { id: '3.1', name: 'Patrimonio', y22: '($20.624.086.937)', y23: '($20.450.636.405)', y24: '($20.531.332.211)', isBold: true, children: [
      { id: '3.1.1', name: 'Capital', y22: '($9.820.286.455)', y23: '($10.756.956.825)', y24: '($11.584.515.321)' },
      { id: '3.1.2', name: 'Resultado Del Ejercicio Anterior', y22: '$0', y23: '$0', y24: '$746.862.690' },
      { id: '3.1.3', name: 'Utilidad', y22: '($10.803.800.482)', y23: '($9.693.679.580)', y24: '($9.693.679.580)' },
    ]},
    { id: '3.2', name: 'Resultado del Ejercicio', y22: '$1.109.120.276', y23: '$746.862.689', y24: '($1.076.117.603)', isBold: true, children: [
      { id: '3.2.1', name: 'Resultado del Ejercicio', y22: '$1.109.120.276', y23: '$746.862.689', y24: '($1.076.117.603)' }
    ]}
  ]}
];

// Cashflow Mock Data
const CASHFLOW_WATERFALL_OPTION = {
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  grid: { top: 30, left: 60, right: 20, bottom: 30 },
  xAxis: { type: 'category', data: ['Saldo Inicial', 'CFO', 'CFI', 'CFF', 'Saldo Final'], axisLine: { lineStyle: { color: '#cbd5e1' } }, axisTick: { show: false } },
  yAxis: { type: 'value', axisLabel: { formatter: '${value}M' }, splitLine: { lineStyle: { type: 'dashed', color: '#f1f5f9' } } },
  series: [
    { name: 'Ayuda', type: 'bar', stack: 'Total', itemStyle: { borderColor: 'transparent', color: 'transparent' }, data: [0, 120.4, 147.1, 135.1, 0] },
    { name: 'Aumento', type: 'bar', stack: 'Total', itemStyle: { color: '#22c55e' }, data: [120.4, 45.2, 0, 0, 135.1] },
    { name: 'Disminución', type: 'bar', stack: 'Total', itemStyle: { color: '#ef4444' }, data: [0, 0, -18.5, -12.0, 0] }
  ]
};

const CASHFLOW_TREND_OPTION = {
  tooltip: { trigger: 'axis' },
  grid: { top: 30, left: 50, right: 20, bottom: 30 },
  xAxis: { type: 'category', data: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'], axisLine: { lineStyle: { color: '#cbd5e1' } } },
  yAxis: { type: 'value', axisLabel: { formatter: '${value}M' }, splitLine: { lineStyle: { type: 'dashed', color: '#f1f5f9' } } },
  series: [
    { name: 'Saldo de Caja', type: 'line', smooth: true, areaStyle: { color: 'rgba(99, 102, 241, 0.1)' }, lineStyle: { width: 3, color: '#6366f1' }, itemStyle: { color: '#6366f1' }, data: [85.2, 90.1, 88.5, 95.0, 105.2, 110.5, 108.0, 115.4, 120.1, 118.5, 125.0, 135.1] }
  ]
};

const CASHFLOW_FORECAST_OPTION = {
  tooltip: { trigger: 'axis' },
  grid: { top: 30, left: 50, right: 20, bottom: 30 },
  xAxis: { type: 'category', data: ['Hoy', '+7 días', '+15 días', '+30 días', '+60 días', '+90 días'], axisLine: { lineStyle: { color: '#cbd5e1' } } },
  yAxis: { type: 'value', axisLabel: { formatter: '${value}M' }, splitLine: { lineStyle: { type: 'dashed', color: '#f1f5f9' } }, scale: true },
  series: [
    { name: 'Límite Superior', type: 'line', smooth: true, lineStyle: { opacity: 0 }, stack: 'confidence', areaStyle: { color: 'rgba(99, 102, 241, 0.1)' }, symbol: 'none', data: [0, 2.5, 5.0, 8.5, 15.0, 22.0] },
    { name: 'Límite Inferior', type: 'line', smooth: true, lineStyle: { opacity: 0 }, stack: 'confidence', areaStyle: { color: 'rgba(99, 102, 241, 0.1)' }, symbol: 'none', data: [135.1, 132.0, 128.5, 120.0, 105.0, 95.0] },
    { name: 'Proyección Esperada', type: 'line', smooth: true, lineStyle: { width: 3, color: '#6366f1', type: 'dashed' }, itemStyle: { color: '#6366f1' }, data: [135.1, 134.5, 133.5, 128.5, 120.0, 117.0] },
    { name: 'Real', type: 'line', smooth: true, lineStyle: { width: 3, color: '#1e293b' }, itemStyle: { color: '#1e293b' }, data: [135.1, null, null, null, null, null] }
  ]
};

// Working Capital Mock Data
const WORKING_CAPITAL_AGING_OPTION = {
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  legend: { data: ['Cuentas por Cobrar (AR)', 'Cuentas por Pagar (AP)'], bottom: 0 },
  grid: { top: 30, left: 50, right: 20, bottom: 40, containLabel: true },
  xAxis: { type: 'value', axisLabel: { formatter: (val: number) => `$${Math.abs(val)}M` }, splitLine: { lineStyle: { type: 'dashed', color: '#f1f5f9' } } },
  yAxis: { type: 'category', data: ['0-30 días', '31-60 días', '61-90 días', '+90 días'], axisLine: { show: false }, axisTick: { show: false } },
  series: [
    { name: 'Cuentas por Cobrar (AR)', type: 'bar', stack: 'Total', label: { show: true, position: 'right', formatter: (p: any) => `$${p.value}M` }, itemStyle: { color: '#3b82f6', borderRadius: [0, 4, 4, 0] }, data: [120.5, 45.2, 18.0, 12.5] },
    { name: 'Cuentas por Pagar (AP)', type: 'bar', stack: 'Total', label: { show: true, position: 'left', formatter: (p: any) => `$${Math.abs(p.value)}M` }, itemStyle: { color: '#ef4444', borderRadius: [4, 0, 0, 4] }, data: [-85.0, -32.5, -15.2, -5.0] }
  ]
};

const WORKING_CAPITAL_FORECAST_OPTION = {
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  legend: { data: ['Cobros Esperados', 'Pagos Comprometidos'], bottom: 0 },
  grid: { top: 30, left: 50, right: 20, bottom: 40, containLabel: true },
  xAxis: { type: 'category', data: ['Próximos 30 días', '31-60 días', '61-90 días'], axisLine: { lineStyle: { color: '#cbd5e1' } } },
  yAxis: { type: 'value', axisLabel: { formatter: '${value}M' }, splitLine: { lineStyle: { type: 'dashed', color: '#f1f5f9' } } },
  series: [
    { name: 'Cobros Esperados', type: 'bar', barGap: 0, itemStyle: { color: '#10b981', borderRadius: [4, 4, 0, 0] }, data: [115.0, 42.0, 15.0] },
    { name: 'Pagos Comprometidos', type: 'bar', itemStyle: { color: '#f59e0b', borderRadius: [4, 4, 0, 0] }, data: [82.0, 35.0, 10.0] }
  ]
};

// Profitability Mock Data
const PROFITABILITY_WATERFALL_OPTION = {
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, formatter: function (params: any) {
      let tar = params[1];
      return tar.name + '<br/>' + tar.seriesName + ' : $' + tar.value + 'M';
  }},
  grid: { top: 30, left: 50, right: 20, bottom: 30 },
  xAxis: { type: 'category', data: ['Ventas Netas', 'Costos (COGS)', 'Margen Bruto', 'OPEX', 'EBITDA'] },
  yAxis: { type: 'value', axisLabel: { formatter: '${value}M' } },
  series: [
    {
      name: 'Base', type: 'bar', stack: 'Total',
      itemStyle: { borderColor: 'transparent', color: 'transparent' },
      data: [0, 150, 0, 85, 0] 
    },
    {
      name: 'Valor', type: 'bar', stack: 'Total',
      label: { show: true, position: 'top', formatter: (p: any) => `$${Math.abs(p.value)}M` },
      itemStyle: {
        color: (p: any) => (p.dataIndex === 1 || p.dataIndex === 3) ? '#ef4444' : '#4f46e5'
      },
      data: [250, 100, 150, 65, 85]
    }
  ]
};

const PROFITABILITY_TREEMAP_OPTION = {
  tooltip: { formatter: '{b}: ${c}M' },
  series: [{
    type: 'treemap',
    width: '100%', height: '100%',
    roam: false,
    nodeClick: false,
    breadcrumb: { show: false },
    itemStyle: { borderColor: '#fff', borderWidth: 2 },
    data: [
      { name: 'Smartphones (MB: 15%)', value: 80, itemStyle: { color: '#f59e0b' } },
      { name: 'Computadoras (MB: 35%)', value: 120, itemStyle: { color: '#10b981' } },
      { name: 'Accesorios (MB: 45%)', value: 50, itemStyle: { color: '#059669' } },
      { name: 'Tablets (MB: 8%)', value: 30, itemStyle: { color: '#ef4444' } }
    ]
  }]
};

// Financial Risk Mock Data
const RISK_MATURITY_OPTION = {
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  legend: { data: ['Amortización Capital', 'Intereses'], bottom: 0 },
  grid: { top: 30, left: 50, right: 20, bottom: 40, containLabel: true },
  xAxis: { type: 'category', data: ['Q3 2024', 'Q4 2024', 'Q1 2025', 'Q2 2025', '2026+'], axisLine: { lineStyle: { color: '#cbd5e1' } } },
  yAxis: { type: 'value', axisLabel: { formatter: '${value}M' }, splitLine: { lineStyle: { type: 'dashed', color: '#f1f5f9' } } },
  series: [
    { name: 'Amortización Capital', type: 'bar', stack: 'Total', itemStyle: { color: '#ef4444' }, data: [20, 5, 5, 8, 45] },
    { name: 'Intereses', type: 'bar', stack: 'Total', itemStyle: { color: '#f87171', borderRadius: [4, 4, 0, 0] }, data: [5, 2, 2, 3, 15] }
  ]
};

const RISK_RADAR_OPTION = {
  tooltip: { trigger: 'item' },
  legend: { data: ['Métricas Actuales', 'Límite Covenant Bancario'], bottom: 0, textStyle: { fontSize: 10 } },
  radar: {
    indicator: [
      { name: 'Liquidez (Current Ratio)', max: 3 },
      { name: 'Solvencia (D/E Ratio)', max: 4 },
      { name: 'Cobertura Intereses', max: 8 },
      { name: 'Rentabilidad (ROA)', max: 20 },
      { name: 'Eficiencia (CCC)', max: 100 }
    ],
    splitArea: { areaStyle: { color: ['#f8fafc', '#f1f5f9', '#e2e8f0', '#cbd5e1', '#94a3b8'].reverse() } }
  },
  series: [{
    type: 'radar',
    data: [
      { value: [1.5, 2.5, 2.5, 8.5, 65], name: 'Métricas Actuales', itemStyle: { color: '#4f46e5' }, lineStyle: { width: 3 }, areaStyle: { color: 'rgba(79, 70, 229, 0.2)' } },
      { value: [1.2, 3.0, 2.0, 5.0, 80], name: 'Límite Covenant Bancario', itemStyle: { color: '#ef4444' }, lineStyle: { width: 2, type: 'dashed' }, areaStyle: { opacity: 0 } }
    ]
  }]
};

import DynamicSidebar from "@/components/layout/DynamicSidebar";
import UnifiedDashboardHeader, { FilterDropdown } from "@/components/layout/UnifiedDashboardHeader";

export default function FinanceDashboardPage() {
  const [activeTab, setActiveTab] = useState<'eerr' | 'balance' | 'cashflow' | 'working_capital' | 'profitability' | 'risk'>('eerr');
  const [cashflowView, setCashflowView] = useState<'historical' | 'forecast'>('historical');
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({'1': true, '2': true, '4': true});
  const [balanceExpanded, setBalanceExpanded] = useState<Record<string, boolean>>({'1': true, '1.1': true, '1.2': false, '1.3': false, '2': true, '2.1': true, '3': true, '3.1': true, '3.2': false});
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);

  // Dynamic Filters State
  const [selectedEmpresa, setSelectedEmpresa] = useState('Consolidado');
  const [selectedMoneda, setSelectedMoneda] = useState('ARS (Nominal)');

  const getTabTitle = () => {
    switch (activeTab) {
      case 'eerr': return 'Estado de Resultados';
      case 'balance': return 'Balance Contable';
      case 'cashflow': return 'Caja y Liquidez';
      case 'working_capital': return 'Capital de Trabajo';
      case 'profitability': return 'Rentabilidad';
      case 'risk': return 'Riesgo Financiero';
      default: return 'Finanzas';
    }
  };

  const tabs = [
    { id: 'eerr', label: 'Estado de Resultados' },
    { id: 'balance', label: 'Balance Contable' },
    { id: 'cashflow', label: 'Caja y Liquidez' },
    { id: 'working_capital', label: 'Capital de Trabajo' },
    { id: 'profitability', label: 'Rentabilidad' },
    { id: 'risk', label: 'Riesgo Financiero' }
  ];

  const toggleRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleBalanceRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBalanceExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAccountClick = (id: string) => {
    if (selectedAccount === id) {
      setSelectedAccount(null); // Deselect
    } else {
      setSelectedAccount(id);
    }
  };

  // Derived state based on selected account
  const isAccountSelected = selectedAccount !== null;
  const selectedAccountName = isAccountSelected ? 
    EERR_DATA.flatMap(r => [r, ...(r.children || [])]).find(r => r.id === selectedAccount)?.name : null;

  // Filtered Data
  const waterfallData = isAccountSelected 
    ? [0, 10, 5, 20, 15, 8, 12, 0, 5, 0, 18, 0, 93] // Mock isolated expense
    : WATERFALL_CHART_OPTION.series[1].data; 

  const dynamicWaterfallOption = {
    ...WATERFALL_CHART_OPTION,
    series: [
      WATERFALL_CHART_OPTION.series[0],
      { ...WATERFALL_CHART_OPTION.series[1], data: waterfallData },
      WATERFALL_CHART_OPTION.series[2],
      WATERFALL_CHART_OPTION.series[3]
    ]
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 overflow-hidden font-sans">
      
      <DynamicSidebar />

      {/* 3. MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        
        <UnifiedDashboardHeader 
          title={getTabTitle()}
          activeTab={activeTab}
          tabs={tabs}
          onTabChange={(id) => setActiveTab(id as any)}
          selectedEmpresa={selectedEmpresa}
          setSelectedEmpresa={setSelectedEmpresa}
          selectedMoneda={selectedMoneda}
          setSelectedMoneda={setSelectedMoneda}
          additionalFilters={
            <>
              <FilterDropdown label="Canal" value="Todas" />
              <FilterDropdown label="Subcanal" value="Todas" />
              {activeTab !== 'cashflow' || (activeTab === 'cashflow' && cashflowView === 'historical') ? (
                <>
                  <FilterDropdown label="Año" value="2024" />
                  <FilterDropdown label="Mes" value="1 - 12" />
                </>
              ) : null}
            </>
          }
        />

        <main className="flex-1 overflow-y-auto p-6 bg-slate-50/50 dark:bg-slate-950/50">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {activeTab === 'eerr' && (
              <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="flex flex-col gap-6">
                {/* KPIs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {KPIS.map((kpi, i) => (
                    <div 
                      key={i} 
                      className={`bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center relative group transition-opacity ${isAccountSelected ? 'opacity-20' : 'opacity-100'}`}
                    >
                      {!isAccountSelected && (
                        <>
                          <div className="absolute top-4 left-4 text-emerald-500/20 group-hover:text-emerald-500/40 transition-colors">
                            <TrendingUp className="w-8 h-8" />
                          </div>
                          <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2 z-10">{kpi.title}</h3>
                          <div className="text-3xl font-bold text-slate-800 dark:text-white mb-2 z-10">{kpi.value}</div>
                          <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 z-10">
                            Año anterior: {kpi.prev} 
                            <span className={`flex items-center font-bold ${kpi.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                              ({kpi.yoy})
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>

                {/* Main Visuals Row */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  
                  {/* EERR Pivot Table */}
                  <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden max-h-[550px]">
                    <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/20">
                      <h3 className="font-bold text-slate-800 dark:text-white">Estado de Resultados</h3>
                      {isAccountSelected && (
                        <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded font-bold">Filtrando: {selectedAccountName}</span>
                      )}
                      <div className="flex gap-2">
                        <button className="p-1.5 text-slate-400 hover:bg-slate-100 rounded"><Filter className="w-4 h-4"/></button>
                        <button className="p-1.5 text-slate-400 hover:bg-slate-100 rounded"><Maximize2 className="w-4 h-4"/></button>
                      </div>
                    </div>
                    
                    <div className="flex-1 overflow-auto">
                      <table className="w-full text-sm text-left whitespace-nowrap">
                        <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-semibold sticky top-0 z-10 text-xs shadow-sm">
                          <tr>
                            <th className="px-4 py-3">Agrupación Cuenta Contable</th>
                            <th className="px-4 py-3 text-right">% Vta</th>
                            <th className="px-4 py-3 text-right">Real</th>
                            <th className="px-4 py-3 text-right">Año Anterior</th>
                            <th className="px-4 py-3 text-center">% Var</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 cursor-pointer">
                          {EERR_DATA.map((row) => (
                            <React.Fragment key={row.id}>
                              <tr 
                                onClick={() => handleAccountClick(row.id)}
                                className={`hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors ${row.isTotal ? 'font-bold bg-slate-50/50 dark:bg-slate-800/30' : 'font-medium'} ${selectedAccount === row.id ? 'bg-indigo-50 dark:bg-indigo-900/40 border-l-4 border-indigo-500' : 'border-l-4 border-transparent'}`}
                              >
                                <td className="px-4 py-2 flex items-center gap-2">
                                  {row.children ? (
                                    <button onClick={(e) => toggleRow(row.id, e)} className="w-4 h-4 rounded border border-slate-300 flex items-center justify-center bg-white text-slate-500 hover:border-indigo-400">
                                      {expandedRows[row.id] ? <span className="block w-2 h-0.5 bg-current"></span> : <span className="block text-xs leading-none">+</span>}
                                    </button>
                                  ) : (
                                    <span className="w-4 h-4"></span>
                                  )}
                                  <span className="text-slate-800 dark:text-slate-200">{row.name}</span>
                                </td>
                                <td className="px-4 py-2 text-right text-slate-600 dark:text-slate-400">{row.pct}</td>
                                <td className="px-4 py-2 text-right text-slate-900 dark:text-white">{row.real}</td>
                                <td className="px-4 py-2 text-right text-slate-500">{row.prev}</td>
                                <td className="px-4 py-2 text-center">
                                  <span className={`inline-flex items-center justify-center w-8 h-5 rounded text-xs font-bold ${row.isPositive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                    {row.var}
                                  </span>
                                </td>
                              </tr>
                              {row.children && expandedRows[row.id] && row.children.map(child => (
                                <tr 
                                  key={child.id} 
                                  onClick={() => handleAccountClick(child.id)}
                                  className={`hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors text-slate-600 dark:text-slate-400 ${selectedAccount === child.id ? 'bg-indigo-50 dark:bg-indigo-900/40 border-l-4 border-indigo-500' : 'border-l-4 border-transparent'}`}
                                >
                                  <td className="px-4 py-2 pl-12 flex items-center gap-2 text-xs">
                                    <span className="w-3 h-3 rounded-sm border border-slate-200 bg-slate-50"></span>
                                    {child.name}
                                  </td>
                                  <td className="px-4 py-2 text-right text-xs">{child.pct}</td>
                                  <td className="px-4 py-2 text-right font-medium text-slate-800 dark:text-slate-300 text-xs">{child.real}</td>
                                  <td className="px-4 py-2 text-right text-xs">{child.prev}</td>
                                  <td className="px-4 py-2 text-center">
                                    <span className={`inline-block px-1 rounded text-[10px] font-bold ${child.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                                      {child.var}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </React.Fragment>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Charts Column */}
                  <div className="flex flex-col gap-6">
                    
                    {/* Line Chart */}
                    <div className={`bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 flex-1 transition-opacity ${isAccountSelected ? 'opacity-20' : 'opacity-100'}`}>
                      {!isAccountSelected && (
                        <>
                          <h3 className="font-bold text-slate-800 dark:text-white mb-2 text-sm">Ingresos reales vs año anterior por mes</h3>
                          <div className="h-[200px] w-full">
                            <ReactECharts option={LINE_CHART_OPTION} style={{ height: '100%', width: '100%' }} />
                          </div>
                        </>
                      )}
                    </div>

                    {/* Waterfall Chart */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 flex-1 relative">
                      <h3 className="font-bold text-slate-800 dark:text-white mb-2 text-sm">
                        {isAccountSelected ? `Resultado por Mes: ${selectedAccountName}` : 'Resultado por Mes'}
                      </h3>
                      <div className="h-[200px] w-full">
                        <ReactECharts option={dynamicWaterfallOption} style={{ height: '100%', width: '100%' }} notMerge={true} />
                      </div>
                    </div>
                    
                  </div>
                </div>

                {/* Bottom Table: Detalle Comprobantes */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 flex flex-col">
                   <h3 className="font-bold text-slate-800 dark:text-white mb-4 text-sm flex items-center justify-between">
                     Detalle Comprobantes Contables {isAccountSelected && <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded ml-2">Filtrado</span>}
                     <button className="text-xs text-indigo-600 font-medium hover:underline flex items-center gap-1">Ver todos <ChevronRight className="w-3 h-3"/></button>
                   </h3>
                   <div className="overflow-x-auto">
                     <table className="w-full text-sm text-left text-slate-600 dark:text-slate-400">
                       <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-800/50">
                         <tr>
                           <th className="px-4 py-2 rounded-l-lg">ID Asiento</th>
                           <th className="px-4 py-2">Fecha</th>
                           <th className="px-4 py-2">Cuenta Contable</th>
                           <th className="px-4 py-2 text-right">Débito</th>
                           <th className="px-4 py-2 text-right">Crédito</th>
                           <th className="px-4 py-2 rounded-r-lg">Centro de Costo</th>
                         </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                         {(!isAccountSelected || selectedAccount === '1.1') && (
                           <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                             <td className="px-4 py-3 font-medium text-indigo-600">JE-9982</td>
                             <td className="px-4 py-3">2024-12-15</td>
                             <td className="px-4 py-3">410100 - Ventas Nacionales</td>
                             <td className="px-4 py-3 text-right">$0</td>
                             <td className="px-4 py-3 text-right">$4,500.00</td>
                             <td className="px-4 py-3 text-slate-500">Comercial Z1</td>
                           </tr>
                         )}
                         {(!isAccountSelected || selectedAccount === '4.1') && (
                           <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                             <td className="px-4 py-3 font-medium text-indigo-600">JE-9983</td>
                             <td className="px-4 py-3">2024-12-16</td>
                             <td className="px-4 py-3">510200 - Gasto Transporte</td>
                             <td className="px-4 py-3 text-right">$120.00</td>
                             <td className="px-4 py-3 text-right">$0</td>
                             <td className="px-4 py-3 text-slate-500">Logística</td>
                           </tr>
                         )}
                       </tbody>
                     </table>
                   </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'balance' && (
              <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="flex flex-col gap-6">
                
                {/* Balance Summary KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center relative items-center text-center">
                    <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">Activos</h3>
                    <div className="text-2xl font-bold text-emerald-600 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600"><DollarSign className="w-4 h-4"/></div>
                      $62.210 mill.
                    </div>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center relative items-center text-center">
                    <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">Pasivo</h3>
                    <div className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600"><Briefcase className="w-4 h-4"/></div>
                      ($1.384 mill.)
                    </div>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center relative items-center text-center">
                    <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">Patrimonio</h3>
                    <div className="text-2xl font-bold text-emerald-600 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600"><Package className="w-4 h-4"/></div>
                      ($60.826 mill.)
                    </div>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center relative items-center text-center">
                    <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">Ec. Contable</h3>
                    <div className="text-2xl font-bold text-slate-500 dark:text-slate-400 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center"><Wallet className="w-4 h-4"/></div>
                      $0
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Activos Table */}
                  <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden max-h-[600px]">
                    <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 font-bold text-slate-800 dark:text-white">
                      Activos
                    </div>
                    <div className="flex-1 overflow-auto">
                      <table className="w-full text-[11px] text-left whitespace-nowrap">
                        <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-semibold sticky top-0 z-10 shadow-sm">
                          <tr>
                            <th className="px-4 py-2">Agrupación Contable</th>
                            <th className="px-4 py-2 text-right">2022</th>
                            <th className="px-4 py-2 text-right">2023</th>
                            <th className="px-4 py-2 text-right">2024</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {BALANCE_ACTIVOS.map(row => renderBalanceRows(row, balanceExpanded, toggleBalanceRow, 0))}
                          <tr className="bg-slate-50 dark:bg-slate-800/50 font-bold text-slate-800 dark:text-white">
                            <td className="px-4 py-3">Total</td>
                            <td className="px-4 py-3 text-right">$20.909.776.485</td>
                            <td className="px-4 py-3 text-right">$20.436.393.591</td>
                            <td className="px-4 py-3 text-right">$20.863.997.207</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Pasivo + Patrimonio Table */}
                  <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden max-h-[600px]">
                    <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 font-bold text-slate-800 dark:text-white">
                      Pasivo + Patrimonio
                    </div>
                    <div className="flex-1 overflow-auto">
                      <table className="w-full text-[11px] text-left whitespace-nowrap">
                        <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-semibold sticky top-0 z-10 shadow-sm">
                          <tr>
                            <th className="px-4 py-2">Agrupación Contable</th>
                            <th className="px-4 py-2 text-right">2022</th>
                            <th className="px-4 py-2 text-right">2023</th>
                            <th className="px-4 py-2 text-right">2024</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {BALANCE_PASIVOS.map(row => renderBalanceRows(row, balanceExpanded, toggleBalanceRow, 0))}
                          <tr className="bg-slate-50 dark:bg-slate-800/50 font-bold text-slate-800 dark:text-white">
                            <td className="px-4 py-3">Total</td>
                            <td className="px-4 py-3 text-right">($20.909.776.485)</td>
                            <td className="px-4 py-3 text-right">($20.436.393.591)</td>
                            <td className="px-4 py-3 text-right">($20.863.997.207)</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

              </motion.div>
            )}

            {activeTab === 'cashflow' && (
              <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="flex flex-col gap-6">
                
                {/* Cashflow View Toggle */}
                <div className="flex bg-slate-200/50 dark:bg-slate-800/50 p-1 rounded-lg self-start">
                  <button 
                    onClick={() => setCashflowView('historical')}
                    className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${cashflowView === 'historical' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                  >
                    Vista A: Histórico
                  </button>
                  <button 
                    onClick={() => setCashflowView('forecast')}
                    className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${cashflowView === 'forecast' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                  >
                    Vista B: Forecast & Liquidez
                  </button>
                </div>

                {/* DQBot Insight for Cashflow */}
                <div className="bg-indigo-50/80 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50 rounded-xl p-4 flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white shrink-0 mt-1">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-2">DQBot Insight <Sparkles className="w-4 h-4 text-amber-500"/></h4>
                    <p className="text-sm text-indigo-800/80 dark:text-indigo-200/80 mt-1 leading-relaxed">
                      El Free Cash Flow (CFO-Capex) del último trimestre fue positivo en <strong className="text-emerald-600 dark:text-emerald-400">$26.7M ARS</strong>, logrando absorber los compromisos financieros (CFF). Sin embargo, el <strong>Days Cash on Hand a 30 días</strong> presenta una alerta <strong className="text-amber-500">amarilla (45 días)</strong>.
                    </p>
                  </div>
                </div>

                {cashflowView === 'historical' && (
                  <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} className="flex flex-col gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm col-span-1 md:col-span-2 flex flex-col justify-center">
                        <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Saldo Inicial</h3>
                        <div className="text-2xl font-bold text-slate-800 dark:text-white">$120.4M</div>
                      </div>
                      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm col-span-1 flex flex-col justify-center">
                        <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">CFO</h3>
                        <div className="text-xl font-bold text-emerald-600">+$45.2M</div>
                      </div>
                      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm col-span-1 flex flex-col justify-center">
                        <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">CFI</h3>
                        <div className="text-xl font-bold text-rose-600">-$18.5M</div>
                      </div>
                      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm col-span-1 flex flex-col justify-center">
                        <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">CFF</h3>
                        <div className="text-xl font-bold text-rose-600">-$12.0M</div>
                      </div>
                      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-indigo-200 dark:border-indigo-800 shadow-sm col-span-1 bg-indigo-50/30 dark:bg-indigo-900/10 flex flex-col justify-center">
                        <h3 className="text-xs font-bold text-indigo-500 dark:text-indigo-400 mb-1 uppercase tracking-wider">FCF (CFO-Capex)</h3>
                        <div className="text-xl font-bold text-emerald-600">+$26.7M</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
                        <h3 className="font-bold text-slate-800 dark:text-white mb-4 text-sm">Variación de Efectivo (YTD)</h3>
                        <div className="h-[300px]">
                          <ReactECharts option={CASHFLOW_WATERFALL_OPTION} style={{height: '100%'}} />
                        </div>
                      </div>
                      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
                        <h3 className="font-bold text-slate-800 dark:text-white mb-4 text-sm">Tendencia Mensual del Saldo de Caja</h3>
                        <div className="h-[300px]">
                          <ReactECharts option={CASHFLOW_TREND_OPTION} style={{height: '100%'}} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {cashflowView === 'forecast' && (
                  <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} className="flex flex-col gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col relative items-center text-center">
                        <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">Caja Disponible Hoy</h3>
                        <div className="text-3xl font-bold text-slate-800 dark:text-white mb-2">$135.1M</div>
                        <span className="text-xs text-slate-400">Total consolidado</span>
                      </div>
                      <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-amber-200 dark:border-amber-800/50 bg-amber-50/30 dark:bg-amber-900/10 shadow-sm flex flex-col relative items-center text-center">
                        <h3 className="text-sm font-semibold text-amber-700 dark:text-amber-500 mb-1">Days Cash on Hand</h3>
                        <div className="text-3xl font-bold text-amber-600 mb-2">45 días</div>
                        <span className="text-xs text-amber-600/70 font-medium">Requiere atención (Umbral: 60)</span>
                      </div>
                      <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-emerald-200 dark:border-emerald-800/50 bg-emerald-50/30 dark:bg-emerald-900/10 shadow-sm flex flex-col relative items-center text-center">
                        <h3 className="text-sm font-semibold text-emerald-700 dark:text-emerald-500 mb-1">Brecha Forecast</h3>
                        <div className="text-3xl font-bold text-emerald-600 mb-2">2.5%</div>
                        <span className="text-xs text-emerald-600/70 font-medium">Real vs Proyectada</span>
                      </div>
                      <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col relative items-center text-center">
                        <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">Liquidez por Horizonte</h3>
                        <div className="flex items-center gap-3 mt-1">
                          <div className="flex flex-col items-center"><div className="w-4 h-4 rounded-full bg-emerald-500 mb-1"></div><span className="text-[10px] font-bold text-slate-500">7D</span></div>
                          <div className="flex flex-col items-center"><div className="w-4 h-4 rounded-full bg-emerald-500 mb-1"></div><span className="text-[10px] font-bold text-slate-500">15D</span></div>
                          <div className="flex flex-col items-center"><div className="w-4 h-4 rounded-full bg-amber-500 mb-1"></div><span className="text-[10px] font-bold text-slate-500">30D</span></div>
                          <div className="flex flex-col items-center"><div className="w-4 h-4 rounded-full bg-rose-500 mb-1"></div><span className="text-[10px] font-bold text-slate-500">90D</span></div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 col-span-2">
                        <h3 className="font-bold text-slate-800 dark:text-white mb-4 text-sm">Proyección de Liquidez y Banda de Confianza (90 días)</h3>
                        <div className="h-[300px]">
                          <ReactECharts option={CASHFLOW_FORECAST_OPTION} style={{height: '100%'}} />
                        </div>
                      </div>
                      
                      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 flex flex-col">
                        <h3 className="font-bold text-slate-800 dark:text-white mb-4 text-sm">Posición Consolidada de Caja</h3>
                        <div className="flex-1 overflow-auto">
                          <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs">
                              <tr>
                                <th className="px-3 py-2 rounded-l-lg">Cuenta</th>
                                <th className="px-3 py-2">Moneda</th>
                                <th className="px-3 py-2 text-right rounded-r-lg">Saldo (ARS)</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                                <td className="px-3 py-3 font-medium text-slate-800 dark:text-slate-200">Santander Corriente</td>
                                <td className="px-3 py-3 text-slate-500">ARS</td>
                                <td className="px-3 py-3 text-right font-medium">$45.1M</td>
                              </tr>
                              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                                <td className="px-3 py-3 font-medium text-slate-800 dark:text-slate-200">Galicia Recaudadora</td>
                                <td className="px-3 py-3 text-slate-500">ARS</td>
                                <td className="px-3 py-3 text-right font-medium">$32.0M</td>
                              </tr>
                              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                                <td className="px-3 py-3 font-medium text-slate-800 dark:text-slate-200">Citi NY Inversiones</td>
                                <td className="px-3 py-3 text-slate-500">USD</td>
                                <td className="px-3 py-3 text-right font-medium text-indigo-600">$58.0M</td>
                              </tr>
                            </tbody>
                            <tfoot className="bg-slate-50 dark:bg-slate-800/50 font-bold">
                              <tr>
                                <td className="px-3 py-3" colSpan={2}>Total Consolidado</td>
                                <td className="px-3 py-3 text-right text-emerald-600">$135.1M</td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

              </motion.div>
            )}

            {activeTab === 'working_capital' && (
              <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="flex flex-col gap-6">
                
                {/* DQBot Insight */}
                <div className="bg-indigo-50/80 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50 rounded-xl p-4 flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white shrink-0 mt-1">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-2">DQBot Insight <Sparkles className="w-4 h-4 text-amber-500"/></h4>
                    <p className="text-sm text-indigo-800/80 dark:text-indigo-200/80 mt-1 leading-relaxed">
                      El Ciclo de Conversión de Efectivo (CCC) <strong className="text-rose-600 dark:text-rose-400">empeoró 9 días</strong> frente al trimestre anterior, impulsado por un aumento del DSO (45 días) y una reducción en el plazo de pago a proveedores (DPO de 30 días). La Tasa de Mora presenta una alerta amarilla (8.2%).
                    </p>
                  </div>
                </div>

                {/* Hero KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-rose-200 dark:border-rose-800/50 bg-rose-50/30 dark:bg-rose-900/10 shadow-sm col-span-1 md:col-span-2 flex flex-col relative items-center text-center justify-center">
                    <h3 className="text-sm font-bold text-rose-700 dark:text-rose-400 mb-1">CCC (Hero KPI)</h3>
                    <div className="text-4xl font-extrabold text-rose-600 mb-1">65 días</div>
                    <span className="text-xs font-semibold text-rose-700/80 dark:text-rose-400/80">Ciclo de Conversión (+9 días vs ant.)</span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center">
                    <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">DSO (Cobros)</h3>
                    <div className="text-2xl font-bold text-slate-800 dark:text-white">45 días</div>
                    <span className="text-xs text-amber-500 font-medium">Alerta media</span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center">
                    <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">DIO (Inventario)</h3>
                    <div className="text-2xl font-bold text-slate-800 dark:text-white">50 días</div>
                    <span className="text-xs text-emerald-500 font-medium">Saludable</span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center">
                    <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">DPO (Pagos)</h3>
                    <div className="text-2xl font-bold text-slate-800 dark:text-white">30 días</div>
                    <span className="text-xs text-rose-500 font-medium">Bajo (Desfavorable)</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-amber-200 dark:border-amber-800/50 shadow-sm flex items-center justify-between col-span-1 md:col-span-2">
                    <div>
                      <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400">Tasa de Mora (&gt;30 días)</h3>
                      <p className="text-xs text-slate-400 mt-1">Cartera Vencida / Cartera Total</p>
                    </div>
                    <div className="text-2xl font-bold text-amber-500">8.2%</div>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between col-span-1 md:col-span-2">
                    <div>
                      <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400">Net Working Capital</h3>
                      <p className="text-xs text-slate-400 mt-1">Activo Corriente - Pasivo Corriente</p>
                    </div>
                    <div className="text-2xl font-bold text-emerald-600">$142.5M</div>
                  </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
                    <h3 className="font-bold text-slate-800 dark:text-white mb-1 text-sm">Aging: Cobros (AR) vs Pagos (AP)</h3>
                    <p className="text-xs text-slate-500 mb-4">Cartera vencida por bloques temporales</p>
                    <div className="h-[350px]">
                      <ReactECharts option={WORKING_CAPITAL_AGING_OPTION} style={{height: '100%'}} />
                    </div>
                  </div>
                  <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
                    <h3 className="font-bold text-slate-800 dark:text-white mb-1 text-sm">Cobros Esperados vs Pagos Comprometidos</h3>
                    <p className="text-xs text-slate-500 mb-4">Proyección a corto plazo</p>
                    <div className="h-[350px]">
                      <ReactECharts option={WORKING_CAPITAL_FORECAST_OPTION} style={{height: '100%'}} />
                    </div>
                  </div>
                </div>

              </motion.div>
            )}

            {activeTab === 'profitability' && (
              <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="flex flex-col gap-6">
                
                {/* DQBot Insight */}
                <div className="bg-indigo-50/80 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50 rounded-xl p-4 flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white shrink-0 mt-1">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-2">DQBot Insight <Sparkles className="w-4 h-4 text-amber-500"/></h4>
                    <p className="text-sm text-indigo-800/80 dark:text-indigo-200/80 mt-1 leading-relaxed">
                      El margen EBITDA se ubica en <strong className="text-indigo-600 dark:text-indigo-400">34% ($85M)</strong>, 2% por debajo de la meta. La caída es impulsada principalmente por un aumento anómalo del OPEX en la familia &quot;Smartphones&quot; (que representa $80M en Ventas Netas con un MB bajo del 15%).
                    </p>
                  </div>
                </div>

                {/* Hero KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-indigo-200 dark:border-indigo-800/50 bg-indigo-50/30 dark:bg-indigo-900/10 shadow-sm col-span-1 md:col-span-2 flex flex-col justify-center">
                    <h3 className="text-sm font-bold text-indigo-700 dark:text-indigo-400 mb-1">Margen Bruto (%)</h3>
                    <div className="text-4xl font-extrabold text-indigo-600 mb-1">60.0%</div>
                    <span className="text-xs font-semibold text-indigo-700/80 dark:text-indigo-400/80">$150.0M Netos vs Presupuesto (62.0%)</span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center">
                    <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Margen EBITDA (%)</h3>
                    <div className="text-2xl font-bold text-slate-800 dark:text-white">34.0%</div>
                    <span className="text-xs text-amber-500 font-medium">-2% vs M-1</span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center">
                    <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">OPEX Ratio</h3>
                    <div className="text-2xl font-bold text-slate-800 dark:text-white">26.0%</div>
                    <span className="text-xs text-rose-500 font-medium">Alto (Alerta)</span>
                  </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
                    <h3 className="font-bold text-slate-800 dark:text-white mb-1 text-sm">Cascada de Márgenes (Ventas a EBITDA)</h3>
                    <p className="text-xs text-slate-500 mb-4">¿Dónde se diluye la ganancia operativa?</p>
                    <div className="h-[350px]">
                      <ReactECharts option={PROFITABILITY_WATERFALL_OPTION} style={{height: '100%'}} />
                    </div>
                  </div>
                  <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
                    <h3 className="font-bold text-slate-800 dark:text-white mb-1 text-sm">Composición de Ventas por Familia (MB)</h3>
                    <p className="text-xs text-slate-500 mb-4">Tamaño = Volumen de Ventas, Color = Margen Bruto</p>
                    <div className="h-[350px]">
                      <ReactECharts option={PROFITABILITY_TREEMAP_OPTION} style={{height: '100%'}} />
                    </div>
                  </div>
                </div>

              </motion.div>
            )}

            {activeTab === 'risk' && (
              <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="flex flex-col gap-6">
                
                {/* DQBot Insight */}
                <div className="bg-amber-50/80 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-xl p-4 flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-white shrink-0 mt-1">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-2">DQBot Warning <Sparkles className="w-4 h-4 text-amber-500"/></h4>
                    <p className="text-sm text-amber-800/80 dark:text-amber-200/80 mt-1 leading-relaxed">
                      El perfil de vencimientos muestra un pico de pagos de <strong className="text-rose-600 dark:text-rose-400">$25M en el Q3 2024</strong>. El ratio de cobertura de intereses cayó a 2.5x, acercándose al covenant bancario (2.0x). Se recomienda refinanciar la deuda de corto plazo.
                    </p>
                  </div>
                </div>

                {/* Hero KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-rose-200 dark:border-rose-800/50 bg-rose-50/30 dark:bg-rose-900/10 shadow-sm col-span-1 md:col-span-2 flex flex-col justify-center">
                    <h3 className="text-sm font-bold text-rose-700 dark:text-rose-400 mb-1">Debt-to-Equity (Apalancamiento)</h3>
                    <div className="text-4xl font-extrabold text-rose-600 mb-1">2.5x</div>
                    <span className="text-xs font-semibold text-rose-700/80 dark:text-rose-400/80">Deuda Total $108M / Capital $43.2M</span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center">
                    <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Cobertura de Intereses</h3>
                    <div className="text-2xl font-bold text-amber-600 dark:text-amber-500">2.5x</div>
                    <span className="text-xs text-amber-500 font-medium">Cerca del Límite (2.0x)</span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center">
                    <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Altman Z-Score</h3>
                    <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-500">3.2</div>
                    <span className="text-xs text-emerald-500 font-medium">Zona Segura (&gt;2.99)</span>
                  </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
                    <h3 className="font-bold text-slate-800 dark:text-white mb-1 text-sm">Perfil de Vencimiento de Deuda</h3>
                    <p className="text-xs text-slate-500 mb-4">Capital e intereses a pagar (Próximos 24 meses)</p>
                    <div className="h-[350px]">
                      <ReactECharts option={RISK_MATURITY_OPTION} style={{height: '100%'}} />
                    </div>
                  </div>
                  <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
                    <h3 className="font-bold text-slate-800 dark:text-white mb-1 text-sm">Radar de Salud Financiera vs Covenants</h3>
                    <p className="text-xs text-slate-500 mb-4">¿Estamos rompiendo algún límite impuesto por los bancos?</p>
                    <div className="h-[350px]">
                      <ReactECharts option={RISK_RADAR_OPTION} style={{height: '100%'}} />
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
const renderBalanceRows = (node: any, expandedState: any, toggleFn: any, depth: number) => {
  const isExpanded = expandedState[node.id];
  const hasChildren = node.children && node.children.length > 0;
  
  return (
    <React.Fragment key={node.id}>
      <tr 
        onClick={(e) => hasChildren ? toggleFn(node.id, e) : null}
        className={`hover:bg-slate-50 dark:hover:bg-slate-800/30 ${hasChildren ? 'cursor-pointer' : ''} ${node.isBold ? 'font-bold text-slate-800 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}
      >
        <td className="px-4 py-2 flex items-center gap-2" style={{ paddingLeft: `${depth * 1 + 1}rem` }}>
          {hasChildren ? (
            <span className="w-4 h-4 rounded border border-slate-300 flex items-center justify-center bg-white text-slate-500 shrink-0 hover:border-indigo-400 text-xs">
              {isExpanded ? '-' : '+'}
            </span>
          ) : (
            <span className="w-4 h-4 shrink-0"></span>
          )}
          <span className="truncate">{node.name}</span>
        </td>
        <td className="px-4 py-2 text-right">{node.y22}</td>
        <td className="px-4 py-2 text-right">{node.y23}</td>
        <td className="px-4 py-2 text-right">{node.y24}</td>
      </tr>
      {hasChildren && isExpanded && node.children.map((child: any) => renderBalanceRows(child, expandedState, toggleFn, depth + 1))}
    </React.Fragment>
  );
};

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

function SubNavItem({ label, active = false }: { label: string, active?: boolean }) {
  return (
    <button className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
      active ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
    }`}>
      {label}
    </button>
  );
}

