"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Users, ShoppingCart, DollarSign, Package, Percent } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import DynamicSidebar from "@/components/layout/DynamicSidebar";
import UnifiedDashboardHeader from "@/components/layout/UnifiedDashboardHeader";

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#14b8a6', '#f59e0b'];

export default function SalesDashboard() {
  const [summary, setSummary] = useState<any>(null);
  const [monthlyTrend, setMonthlyTrend] = useState<any[]>([]);
  const [byCategory, setByCategory] = useState<any[]>([]);
  
  useEffect(() => {
    const token = 'dummy-token'; // Replace with actual auth logic
    const headers = { 'Authorization': `Bearer ${token}` };
    
    Promise.all([
      fetch('http://localhost:3000/api/kpi/sales/summary', { headers }).then(res => res.json()),
      fetch('http://localhost:3000/api/kpi/sales/monthly-trend', { headers }).then(res => res.json()),
      fetch('http://localhost:3000/api/kpi/sales/by-category', { headers }).then(res => res.json())
    ]).then(([sum, trend, cat]) => {
      setSummary(sum);
      setMonthlyTrend(trend);
      setByCategory(cat);
    }).catch(console.error);
  }, []);

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 overflow-hidden font-sans">
      <DynamicSidebar />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <UnifiedDashboardHeader title="Sales & Profitability" activeTab="sales" tabs={[{ id: 'sales', label: 'Overview' }]} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { title: "Net Sales", value: summary?.net_sales, icon: DollarSign },
                { title: "Gross Profit", value: summary?.gross_profit, icon: TrendingUp },
                { title: "Total Orders", value: summary?.total_orders, icon: ShoppingCart },
                { title: "Gross Margin", value: `${summary?.gross_margin_pct || 0}%`, icon: Percent }
              ].map((kpi, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-semibold text-slate-500">{kpi.title}</h3>
                    <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600">
                      <kpi.icon className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold">{kpi.value || "..."}</div>
                </motion.div>
              ))}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Trend */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Monthly Trend</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyTrend}>
                      <defs>
                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ borderRadius: '8px', background: '#1e293b', border: 'none', color: '#fff' }} />
                      <Area type="monotone" dataKey="total_sales" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* By Category */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Sales By Category</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={byCategory} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#334155" opacity={0.2} />
                      <XAxis type="number" axisLine={false} tickLine={false} />
                      <YAxis dataKey="category" type="category" axisLine={false} tickLine={false} width={100} />
                      <Tooltip cursor={{ fill: '#334155', opacity: 0.1 }} contentStyle={{ borderRadius: '8px', background: '#1e293b', border: 'none', color: '#fff' }} />
                      <Bar dataKey="total_sales" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}