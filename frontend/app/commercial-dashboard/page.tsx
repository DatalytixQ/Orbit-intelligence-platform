"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Bot,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Users,
  Activity
} from "lucide-react";
import ReactECharts from "echarts-for-react";
import DynamicSidebar from "@/components/layout/DynamicSidebar";
import UnifiedDashboardHeader from "@/components/layout/UnifiedDashboardHeader";
import { useTranslations } from "next-intl";
import SlideOver from "@/components/ui/SlideOver";

export default function CommercialDashboardPage() {
  const t = useTranslations('Commercial');
  const [activeTab, setActiveTab] = useState('resumen');
  
  // Filter States
  const [selectedEmpresa, setSelectedEmpresa] = useState('all');
  const [selectedMoneda, setSelectedMoneda] = useState('all');
  const [selectedChannel, setSelectedChannel] = useState('all');
  const [selectedRep, setSelectedRep] = useState('all');
  const currentYear = new Date().getFullYear();
  const [startDate, setStartDate] = useState(`${currentYear}-01-01`);
  const [endDate, setEndDate] = useState('');
  const [metricMode, setMetricMode] = useState<'monto' | 'cantidad'>('monto');
  const [isTransactionsOpen, setIsTransactionsOpen] = useState(false);
  
  // Data States
  const [summary, setSummary] = useState<any>({});
  const [salesMonthly, setSalesMonthly] = useState<any[]>([]);
  const [salesByCategory, setSalesByCategory] = useState<any[]>([]);
  const [salesByChannel, setSalesByChannel] = useState<any[]>([]);
  const [salesByRep, setSalesByRep] = useState<any[]>([]);
  const [customerPareto, setCustomerPareto] = useState<any[]>([]);
  const [topCustomersList, setTopCustomersList] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [transactionPage, setTransactionPage] = useState(0);
  const [transactionTotal, setTransactionTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingTx, setLoadingTx] = useState(false);

  // Re-fetch when any filter changes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
        const token = localStorage.getItem('datalytixq_token'); 
        const headers = { 'Authorization': `Bearer ${token}` };
        
        const params = new URLSearchParams();
        if (selectedEmpresa !== 'all') params.append('subsidiary_id', selectedEmpresa);
        if (selectedMoneda !== 'all') params.append('currency_id', selectedMoneda);
        if (selectedChannel !== 'all') params.append('channel', selectedChannel);
        if (selectedRep !== 'all') params.append('rep_id', selectedRep);
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        
        const qs = params.toString() ? `?${params.toString()}` : '';

        const [sumRes, trendRes, catRes, chanRes, repRes, paretoRes, topCustRes] = await Promise.all([
          fetch(`${baseUrl}/api/kpi/sales/summary${qs}`, { headers }),
          fetch(`${baseUrl}/api/kpi/sales/monthly-trend-yoy${qs}`, { headers }),
          fetch(`${baseUrl}/api/kpi/sales/by-category${qs}`, { headers }),
          fetch(`${baseUrl}/api/kpi/sales/by-channel${qs}`, { headers }),
          fetch(`${baseUrl}/api/kpi/sales/by-rep${qs}`, { headers }),
          fetch(`${baseUrl}/api/kpi/sales/customer-pareto${qs}`, { headers }),
          fetch(`${baseUrl}/api/kpi/sales/top-customers${qs}`, { headers })
        ]);

        if (sumRes.ok) setSummary(await sumRes.json());
        if (trendRes.ok) setSalesMonthly(await trendRes.json());
        if (catRes.ok) setSalesByCategory(await catRes.json());
        if (chanRes.ok) setSalesByChannel(await chanRes.json());
        if (repRes.ok) setSalesByRep(await repRes.json());
        if (paretoRes.ok) setCustomerPareto(await paretoRes.json());
        if (topCustRes.ok) setTopCustomersList(await topCustRes.json());
      } catch (error) {
        console.error("Error fetching sales data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedEmpresa, selectedMoneda, selectedChannel, selectedRep, startDate, endDate]);

  useEffect(() => {
    if (activeTab !== 'transacciones') return;
    
    const fetchTransactions = async () => {
      setLoadingTx(true);
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
        const token = localStorage.getItem('datalytixq_token'); 
        const headers = { 'Authorization': `Bearer ${token}` };
        
        const params = new URLSearchParams();
        if (selectedEmpresa !== 'all') params.append('subsidiary_id', selectedEmpresa);
        if (selectedMoneda !== 'all') params.append('currency_id', selectedMoneda);
        if (selectedChannel !== 'all') params.append('channel', selectedChannel);
        if (selectedRep !== 'all') params.append('rep_id', selectedRep);
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        params.append('limit', '20');
        params.append('offset', (transactionPage * 20).toString());
        
        const qs = params.toString() ? `?${params.toString()}` : '';
        const res = await fetch(`${baseUrl}/api/kpi/sales/transactions${qs}`, { headers });
        if (res.ok) {
          const data = await res.json();
          setTransactions(data.data);
          setTransactionTotal(data.pagination.total);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoadingTx(false);
      }
    };
    
    fetchTransactions();
  }, [selectedEmpresa, selectedMoneda, selectedChannel, selectedRep, startDate, endDate, transactionPage, activeTab]);

  const kpiData = [
    { title: t('net_sales'), value: `$${((summary.net_sales || 0) / 1000000).toFixed(2)}M`, isPositive: true },
    { title: t('units_sold'), value: (summary.units_sold || 0).toLocaleString(), isPositive: true },
    { title: t('gross_margin'), value: `$${((summary.gross_profit || 0) / 1000000).toFixed(2)}M`, isPositive: true },
    { title: t('margin_pct'), value: `${Math.round((summary.gross_margin_pct || 0) * 100)}%`, isPositive: true },
    { title: t('avg_ticket'), value: `$${((summary.average_ticket || 0) / 1000).toFixed(2)}K`, isPositive: true },
    { title: t('orders'), value: (summary.total_orders || 0).toLocaleString(), isPositive: true }
  ];

  // ECharts Options
  const dynamicSalesTrendOption = {
    tooltip: { trigger: 'axis' },
    grid: { top: 40, left: 60, right: 20, bottom: 30 },
    xAxis: { type: 'category', data: salesMonthly.map(m => m.month_num) },
    yAxis: { type: 'value', axisLabel: { formatter: metricMode === 'monto' ? '${value}' : '{value}' } },
    series: [
      { 
        name: 'Año Actual',
        type: 'line', 
        smooth: true,
        data: salesMonthly.map(m => metricMode === 'monto' ? parseFloat(m.current_sales) : parseFloat(m.current_sales)), 
        itemStyle: { color: '#4f46e5' },
        areaStyle: {
          color: {
            type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [{ offset: 0, color: 'rgba(79, 70, 229, 0.4)' }, { offset: 1, color: 'rgba(79, 70, 229, 0.05)' }]
          }
        }
      },
      { 
        name: 'Año Anterior',
        type: 'line', 
        smooth: true,
        lineStyle: { type: 'dashed' },
        data: salesMonthly.map(m => metricMode === 'monto' ? parseFloat(m.prev_sales) : parseFloat(m.prev_sales)), 
        itemStyle: { color: '#94a3b8' }
      }
    ]
  };

  const dynamicSalesByCategoryOption = {
    tooltip: { trigger: 'item' },
    legend: { orient: 'vertical', left: 'left' },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      data: salesByCategory.map(c => ({
        name: c.category,
        value: metricMode === 'monto' ? parseFloat(c.total_sales) : parseFloat(c.units)
      })),
      emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' } }
    }]
  };

  const dynamicRepConcentrationOption = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { top: 10, bottom: 30, left: 100, right: 20 },
    xAxis: { type: 'value' },
    yAxis: { type: 'category', data: salesByRep.map(r => r.rep_name).reverse() },
    series: [{
      type: 'bar',
      data: salesByRep.map(r => metricMode === 'monto' ? parseFloat(r.total_sales) : parseFloat(r.units)).reverse(),
      itemStyle: { color: '#6366f1', borderRadius: [0, 4, 4, 0] }
    }]
  };

  const paretoOption = {
    tooltip: { trigger: 'axis' },
    grid: { top: 40, left: 60, right: 60, bottom: 30 },
    xAxis: { type: 'category', data: customerPareto.map((_, i) => `Cliente ${i+1}`), show: false },
    yAxis: [
      { type: 'value', name: 'Monto' },
      { type: 'value', name: '% Acum', min: 0, max: 100, axisLabel: { formatter: '{value} %' } }
    ],
    series: [
      { type: 'bar', name: 'Monto Venta', data: customerPareto.map(p => parseFloat(p.total_sales)), yAxisIndex: 0, itemStyle: { color: '#94a3b8' } },
      { type: 'line', name: '% Acumulado', data: customerPareto.map(p => parseFloat(p.cumulative_pct)), yAxisIndex: 1, itemStyle: { color: '#4f46e5' }, smooth: true }
    ]
  };

  const tabs = [
    { id: 'resumen', label: 'Resumen Ejecutivo' },
    { id: 'categoria', label: 'Categorías y Productos' },
    { id: 'equipo', label: 'Equipo Comercial' },
    { id: 'clientes', label: 'Clientes y Concentración' }
  ];

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 overflow-hidden font-sans">
      <DynamicSidebar />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <UnifiedDashboardHeader 
          title={t('title')}
          activeTab={activeTab}
          tabs={tabs}
          onTabChange={setActiveTab}
          selectedEmpresa={selectedEmpresa}
          setSelectedEmpresa={setSelectedEmpresa}
          selectedMoneda={selectedMoneda}
          setSelectedMoneda={setSelectedMoneda}
          selectedChannel={selectedChannel}
          setSelectedChannel={setSelectedChannel}
          selectedRep={selectedRep}
          setSelectedRep={setSelectedRep}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          metricMode={metricMode}
          setMetricMode={setMetricMode}
        />
        <div className="absolute top-4 right-6 z-10">
          <button 
            onClick={() => setIsTransactionsOpen(true)}
            className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-slate-700 transition"
          >
            <Activity className="w-4 h-4" /> Ver Transacciones
          </button>
        </div>

        <main className="flex-1 overflow-y-auto p-6 bg-slate-50/50 dark:bg-slate-950/50">
          <div className="w-full max-w-full space-y-6">
            
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-indigo-50/50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-xl p-4 flex items-start gap-4">
              <div className="bg-indigo-100 dark:bg-indigo-500/20 p-2 rounded-lg">
                <Bot className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-indigo-900 dark:text-indigo-300 mb-1">{t('dqbot_title')}</h4>
                <p className="text-sm text-indigo-800/80 dark:text-indigo-200/80">
                  {t('dqbot_msg_pre')} <strong className="text-emerald-600 dark:text-emerald-400">${((summary.net_sales || 0) / 1000000).toFixed(2)}M</strong>. 
                  {t('dqbot_msg_post')}
                </p>
              </div>
            </motion.div>

            {/* TAB: RESUMEN */}
            {activeTab === 'resumen' && (
              <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {kpiData.map((kpi, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col relative">
                      <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">{kpi.title}</h3>
                      <div className="text-2xl font-bold text-slate-800 dark:text-white mb-2">{loading ? "..." : kpi.value}</div>
                    </div>
                  ))}
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
                  <h3 className="font-bold text-slate-800 dark:text-white mb-4 text-sm flex items-center gap-2">
                    <Activity className="w-4 h-4 text-indigo-500" /> {t('monthly_evolution')}
                  </h3>
                  <div className="h-[300px] w-full">
                    {!loading && <ReactECharts option={dynamicSalesTrendOption} style={{ height: '100%', width: '100%' }} />}
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB: CATEGORIAS */}
            {activeTab === 'categoria' && (
              <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
                  <h3 className="font-bold text-slate-800 dark:text-white mb-4 text-sm flex items-center gap-2">
                    <PieChart className="w-4 h-4 text-indigo-500" /> {t('category_share')}
                  </h3>
                  <div className="h-[400px] w-full">
                    {!loading && <ReactECharts option={dynamicSalesByCategoryOption} style={{ height: '100%', width: '100%' }} />}
                  </div>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 overflow-auto max-h-[500px]">
                  <h3 className="font-bold text-slate-800 dark:text-white mb-4 text-sm">{t('category_detail')}</h3>
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500">
                        <th className="py-2">Categoría</th>
                        <th className="py-2">Ventas</th>
                        <th className="py-2">% Margen</th>
                      </tr>
                    </thead>
                    <tbody>
                      {salesByCategory.map((c, i) => (
                        <tr key={i} className="border-b border-slate-100">
                          <td className="py-2">{c.category}</td>
                          <td className="py-2">${(parseFloat(c.total_sales)/1000).toFixed(2)}K</td>
                          <td className="py-2 text-emerald-600 font-bold">{Math.round(c.gross_margin_pct*100)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* TAB: EQUIPO COMERCIAL */}
            {activeTab === 'equipo' && (
              <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
                  <h3 className="font-bold text-slate-800 dark:text-white mb-4 text-sm flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-indigo-500" /> {t('channel_detail')}
                  </h3>
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500">
                        <th className="py-2">Canal</th>
                        <th className="py-2">Ventas Netas</th>
                        <th className="py-2">% Margen Bruto</th>
                      </tr>
                    </thead>
                    <tbody>
                      {salesByChannel.map((ch, idx) => (
                        <tr key={idx} className="border-b border-slate-100">
                          <td className="py-3 font-medium">{ch.channel}</td>
                          <td className="py-3">${(parseFloat(ch.total_sales)/1000).toFixed(2)}K</td>
                          <td className="py-3 text-emerald-600 font-bold">{Math.round(ch.gross_margin_pct * 100)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
                  <h3 className="font-bold text-slate-800 dark:text-white mb-4 text-sm flex items-center gap-2">
                    <Users className="w-4 h-4 text-indigo-500" /> {t('rep_concentration')}
                  </h3>
                  <div className="h-[400px] w-full">
                    {!loading && <ReactECharts option={dynamicRepConcentrationOption} style={{ height: '100%', width: '100%' }} />}
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB: CLIENTES Y CONCENTRACION */}
            {activeTab === 'clientes' && (
              <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
                <h3 className="font-bold text-slate-800 dark:text-white mb-4 text-sm flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-indigo-500" /> {t('pareto_title')}
                </h3>
                <div className="h-[400px] w-full">
                  {!loading && <ReactECharts option={paretoOption} style={{ height: '100%', width: '100%' }} />}
                </div>
              </motion.div>
            )}

            {/* TAB: TRANSACCIONES */}
            <SlideOver isOpen={isTransactionsOpen} onClose={() => setIsTransactionsOpen(false)} title="Auditoría de Transacciones">

              <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
                <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                  <h3 className="font-bold text-slate-800 dark:text-white text-sm flex items-center gap-2">
                    <Activity className="w-4 h-4 text-indigo-500" /> {t('transactions_title')}
                  </h3>
                  <div className="text-xs text-slate-500 font-semibold bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                    Total: {transactionTotal.toLocaleString()} {t('records')}
                  </div>
                </div>
                
                <div className="overflow-x-auto relative">
                  {loadingTx && (
                    <div className="absolute inset-0 bg-white/50 dark:bg-slate-900/50 flex items-center justify-center z-10 backdrop-blur-[1px]">
                      <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                  <table className="w-full text-xs text-left whitespace-nowrap">
                    <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 uppercase tracking-wider">
                      <tr>
                        <th className="px-4 py-3 font-semibold">Fecha</th>
                        <th className="px-4 py-3 font-semibold">Documento</th>
                        <th className="px-4 py-3 font-semibold">Cliente ID</th>
                        <th className="px-4 py-3 font-semibold">Vendedor</th>
                        <th className="px-4 py-3 font-semibold">Categoría</th>
                        <th className="px-4 py-3 font-semibold text-right">Cant.</th>
                        <th className="px-4 py-3 font-semibold text-right">Venta Neta</th>
                        <th className="px-4 py-3 font-semibold text-right">Margen Bruto</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {transactions.length === 0 && !loadingTx ? (
                        <tr>
                          <td colSpan={8} className="px-4 py-8 text-center text-slate-500">{t('no_transactions')}</td>
                        </tr>
                      ) : transactions.map((tx, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{new Date(tx.sale_date).toLocaleDateString()}</td>
                          <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{tx.tranid}</td>
                          <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{tx.customer_id}</td>
                          <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{tx.rep_name}</td>
                          <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                            <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-[10px]">{tx.category}</span>
                          </td>
                          <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300 font-medium">{tx.quantity}</td>
                          <td className="px-4 py-3 text-right text-slate-900 dark:text-white font-bold">${parseFloat(tx.net_amount_base).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                          <td className="px-4 py-3 text-right text-emerald-600 dark:text-emerald-400 font-bold">${parseFloat(tx.gross_profit).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50 rounded-b-xl">
                  <span className="text-xs text-slate-500">
                    {t('showing')} {(transactionPage * 20) + (transactions.length > 0 ? 1 : 0)} {t('to')} {(transactionPage * 20) + transactions.length} {t('of')} {transactionTotal}
                  </span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setTransactionPage(p => Math.max(0, p - 1))}
                      disabled={transactionPage === 0 || loadingTx}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {t('previous')}
                    </button>
                    <button 
                      onClick={() => setTransactionPage(p => p + 1)}
                      disabled={((transactionPage + 1) * 20) >= transactionTotal || loadingTx}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 border border-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {t('next')}
                    </button>
                  </div>
                </div>
              </motion.div>
            </SlideOver>

          </div>
        </main>
      </div>
    </div>
  );
}
