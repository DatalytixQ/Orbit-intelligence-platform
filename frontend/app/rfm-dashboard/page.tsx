"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Activity, AlertTriangle, Moon } from "lucide-react";
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from "recharts";
import DynamicSidebar from "@/components/layout/DynamicSidebar";
import UnifiedDashboardHeader from "@/components/layout/UnifiedDashboardHeader";
import { fetchFromApiClient } from "@/lib/api.client";

export default function RFMDashboard() {
  const [summary, setSummary] = useState<any>(null);
  const [scatter, setScatter] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      fetchFromApiClient('/api/kpi/rfm/summary'),
      fetchFromApiClient('/api/kpi/rfm/scatter')
    ]).then(([sum, scat]) => {
      setSummary(sum);
      setScatter(scat);
    }).catch(console.error);
  }, []);

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 overflow-hidden font-sans">
      <DynamicSidebar />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <UnifiedDashboardHeader title="Customers & RFM" activeTab="rfm" tabs={[{ id: 'rfm', label: 'RFM Matrix' }]} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { title: "Total Customers", value: summary?.total_customers, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
                { title: "Active Customers", value: summary?.active_customers, icon: Activity, color: "text-emerald-500", bg: "bg-emerald-500/10" },
                { title: "At Risk", value: summary?.at_risk_customers, icon: AlertTriangle, color: "text-rose-500", bg: "bg-rose-500/10" },
                { title: "Dormant", value: summary?.dormant_customers, icon: Moon, color: "text-slate-500", bg: "bg-slate-500/10" }
              ].map((kpi, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-semibold text-slate-500">{kpi.title}</h3>
                    <div className={`p-2 rounded-lg ${kpi.bg} ${kpi.color}`}>
                      <kpi.icon className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold">{kpi.value || "..."}</div>
                </motion.div>
              ))}
            </div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">RFM Scatter Plot (Recency vs Frequency)</h3>
              <div className="h-[500px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                    <XAxis type="number" dataKey="recency" name="Recency (days)" axisLine={false} tickLine={false} reversed />
                    <YAxis type="number" dataKey="frequency" name="Frequency" axisLine={false} tickLine={false} />
                    <ZAxis type="number" dataKey="monetary" range={[50, 400]} name="Monetary Value" />
                    <RechartsTooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ borderRadius: '8px', background: '#1e293b', border: 'none', color: '#fff' }} />
                    <Scatter name="Customers" data={scatter} fill="#6366f1" opacity={0.7}>
                      {scatter.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.recency < 30 ? '#10b981' : entry.recency > 90 ? '#ef4444' : '#6366f1'} />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
