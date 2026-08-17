"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  LineChart,
  Briefcase,
  Package,
  Wallet,
  Settings,
  Bot,
  Bell,
  Search,
  MessageSquare,
  Sparkles,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  X,
  Send,
} from "lucide-react";
import ReactECharts from "echarts-for-react";
import Link from "next/link";

// Mock Data for the Financial Dashboard
const MOCK_KPIS = [
  { title: "Margen Bruto", value: "42.8%", trend: "+2.4%", isPositive: true },
  { title: "EBITDA", value: "$1.2M", trend: "+5.1%", isPositive: true },
  { title: "Gastos Op.", value: "$450K", trend: "-1.2%", isPositive: false },
  { title: "Flujo Caja", value: "$850K", trend: "+8.9%", isPositive: true },
];

const MOCK_CHART_OPTION = {
  tooltip: { trigger: 'axis', backgroundColor: '#1e293b', textStyle: { color: '#f8fafc' }, border: 'none' },
  grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  xAxis: { type: 'category', boundaryGap: false, data: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'], axisLine: { lineStyle: { color: '#cbd5e1' } } },
  yAxis: { type: 'value', axisLine: { show: false }, splitLine: { lineStyle: { type: 'dashed', color: '#e2e8f0' } } },
  series: [
    {
      name: 'Real', type: 'line', smooth: true,
      lineStyle: { width: 3, color: '#4f46e5' },
      areaStyle: {
        color: {
          type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [{ offset: 0, color: 'rgba(79, 70, 229, 0.4)' }, { offset: 1, color: 'rgba(79, 70, 229, 0)' }]
        }
      },
      data: [120, 132, 101, 134, 90, 230]
    },
    {
      name: 'Presupuesto', type: 'line', smooth: true,
      lineStyle: { width: 2, color: '#94a3b8', type: 'dashed' },
      data: [110, 120, 115, 140, 110, 210]
    }
  ]
};

export default function MockConceptPage() {
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: 'ai', text: '¡Hola! Soy tu asistente financiero DQBot. He notado un desvío del 15% en los gastos operativos del Q2. ¿Quieres que analicemos las causas por centro de costo?' }
  ]);
  const [inputMsg, setInputMsg] = useState("");

  const handleSendMessage = () => {
    if (!inputMsg.trim()) return;
    setChatMessages([...chatMessages, { role: 'user', text: inputMsg }]);
    setInputMsg("");
    // Simulate AI response
    setTimeout(() => {
      setChatMessages(prev => [...prev, { 
        role: 'ai', 
        text: 'Analizando... El desvío proviene de la Unidad de Negocio Sur. Los costos de logística aumentaron un 22% debido a tarifas de flete. Sugiero revisar el contrato con el Proveedor X.' 
      }]);
    }, 1500);
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 overflow-hidden font-sans">
      
      {/* 1. SIDEBAR (Datawalt style white-label navigation) */}
      <div className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col z-20">
        <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xl tracking-tight">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            DQOrbit
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-1">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2">Workspaces</div>
          <NavItem icon={<LayoutDashboard />} label="Directorio (Home)" link="/mock-home" />
          <NavItem icon={<Briefcase />} label="Comercial (Ventas)" link="#" />
          <NavItem icon={<Wallet />} label="Financiero (P&L)" active link="/mock-concept" />
          <NavItem icon={<Package />} label="Inventario (S&OP)" link="#" />
          
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-8 mb-2 px-2">Comités</div>
          <NavItem icon={<MessageSquare />} label="Comité Ventas Q3" link="#" />
          <NavItem icon={<MessageSquare />} label="Revisión Presupuesto" link="#" />
        </div>
        
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <NavItem icon={<Settings />} label="Configuración" link="#" />
        </div>
      </div>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* Topbar */}
        <header className="h-16 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 z-10">
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-slate-400">
            Tablero Financiero Consolidado
          </h1>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 border-2 border-white dark:border-slate-800 cursor-pointer"></div>
          </div>
        </header>

        {/* Dashboard Canvas */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="w-full space-y-8">
            
            {/* Action Bar */}
            <div className="flex justify-between items-center">
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Última actualización: Hoy, 10:45 AM. Sincronizado con Universal Data Model.
              </p>
              <button 
                onClick={() => setIsCopilotOpen(!isCopilotOpen)}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-all shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20"
              >
                <Bot className="w-4 h-4" />
                {isCopilotOpen ? "Cerrar Copilot" : "Analizar con IA (Wave)"}
              </button>
            </div>

            {/* KPIs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {MOCK_KPIS.map((kpi, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={i} 
                  className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative group cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-700 transition-all"
                >
                  <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">{kpi.title}</div>
                  <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{kpi.value}</div>
                  <div className={`flex items-center gap-1 text-sm font-medium ${kpi.isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {kpi.isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    {kpi.trend} vs mes anterior
                  </div>
                  
                  {/* Generative AI Trigger Overlay */}
                  <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/5 dark:group-hover:bg-indigo-400/5 rounded-2xl flex items-center justify-end px-4 opacity-0 group-hover:opacity-100 transition-all">
                     <button 
                       onClick={(e) => { e.stopPropagation(); setIsCopilotOpen(true); }}
                       className="bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 p-2 rounded-full shadow-md hover:scale-110 transition-transform"
                       title="Profundizar con IA"
                     >
                       <Sparkles className="w-4 h-4" />
                     </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Main Chart */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-semibold text-slate-900 dark:text-white">Evolución EBITDA vs Presupuesto</h3>
                  <button className="text-xs font-medium text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-full">Nivel 1</button>
                </div>
                <div className="h-[300px] w-full">
                  <ReactECharts option={MOCK_CHART_OPTION} style={{ height: '100%', width: '100%' }} />
                </div>
              </motion.div>

              {/* Transactional Drill-down Table Mock */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-semibold text-slate-900 dark:text-white">Top Gastos Operativos (Nivel 4)</h3>
                </div>
                <div className="flex-1 flex flex-col gap-3">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 cursor-pointer hover:border-indigo-300 transition-colors">
                    <div>
                      <div className="text-sm font-semibold">Contratos Internet (Web)</div>
                      <div className="text-xs text-slate-500">ID: FAC-88912</div>
                    </div>
                    <div className="font-bold text-rose-500">$41,000</div>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 cursor-pointer hover:border-indigo-300 transition-colors">
                    <div>
                      <div className="text-sm font-semibold">Licencias Software</div>
                      <div className="text-xs text-slate-500">ID: FAC-10294</div>
                    </div>
                    <div className="font-bold text-rose-500">$28,500</div>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 cursor-pointer hover:border-indigo-300 transition-colors">
                    <div>
                      <div className="text-sm font-semibold">Asesoría Legal</div>
                      <div className="text-xs text-slate-500">ID: FAC-99822</div>
                    </div>
                    <div className="font-bold text-rose-500">$15,200</div>
                  </div>
                  <button className="mt-auto text-sm text-indigo-600 font-medium hover:underline flex items-center justify-center gap-1">
                    Ver transaccional Nivel 5 <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            </div>
            
          </div>
        </main>
      </div>

      {/* 3. AI COPILOT SIDE PANEL (Wave / Waltibot) */}
      <AnimatePresence>
        {isCopilotOpen && (
          <motion.div 
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="w-[400px] border-l border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl flex flex-col z-30 absolute right-0 top-0 bottom-0"
          >
            <div className="h-16 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 bg-white dark:bg-slate-900">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">DQBot Copilot</div>
                  <div className="text-[10px] text-emerald-500 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Claude 3.5 Sonnet
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsCopilotOpen(false)}
                className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                    msg.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-tr-sm' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-tl-sm border border-slate-200 dark:border-slate-700'
                  }`}>
                    {msg.role === 'ai' && <Sparkles className="w-3 h-3 text-indigo-500 mb-1 inline-block mr-1" />}
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="relative flex items-center">
                <input 
                  type="text" 
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ej: Genera un gráfico de torta de gastos..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full py-3 pl-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900 dark:text-white"
                />
                <button 
                  onClick={handleSendMessage}
                  className="absolute right-2 p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <div className="flex gap-2 mt-3 overflow-x-auto pb-1 no-scrollbar">
                <button className="whitespace-nowrap text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
                  Simular Escenario de Compras
                </button>
                <button className="whitespace-nowrap text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
                  Resumir Comité Ventas
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Nav Item Helper
function NavItem({ icon, label, active = false, link = "#" }: { icon: React.ReactNode, label: string, active?: boolean, link?: string }) {
  return (
    <Link href={link}>
      <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
        active 
          ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' 
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
      }`}>
        {React.cloneElement(icon as React.ReactElement, { className: 'w-5 h-5' })}
        {label}
      </button>
    </Link>
  );
}
