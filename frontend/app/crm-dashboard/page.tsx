"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Target, Trophy, XOctagon, Briefcase } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import DynamicSidebar from "@/components/layout/DynamicSidebar";
import UnifiedDashboardHeader from "@/components/layout/UnifiedDashboardHeader";

export default function PipelineDashboard() {
  const [summary, setSummary] = useState<any>(null);
  const [funnel, setFunnel] = useState<any[]>([]);

  useEffect(() => {
    const token = 'dummy-token';
    const headers = { 'Authorization': `Bearer ${token}` };

    Promise.all([
      fetch('http://localhost:3000/api/kpi/pipeline/summary', { headers }).then(res => res.json()),
      fetch('http://localhost:3000/api/kpi/pipeline/funnel', { headers }).then(res => res.json())
    ]).then(([sum, fun]) => {
      setSummary(sum);
      setFunnel(fun);
    }).catch(console.error);
  }, []);

  const FUNNEL_COLORS = ['#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef'];

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 overflow-hidden font-sans">
      <DynamicSidebar />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <UnifiedDashboardHeader title="Sales Pipeline" activeTab="pipeline" tabs={[{ id: 'pipeline', label: 'Pipeline' }]} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { title: "Open Opportunities", value: summary?.open_opportunities, icon: Briefcase },
                { title: "Gross Pipeline", value: summary?.gross_pipeline, icon: Target },
                { title: "Won Opportunities", value: summary?.won_opportunities, icon: Trophy },
                { title: "Win Rate", value: `${summary?.win_rate || 0}%`, icon: XOctagon }
              ].map((kpi, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-semibold text-slate-500">{kpi.title}</h3>
                    <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600 group-hover:scale-110 transition-transform">
                      <kpi.icon className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold">{kpi.value || "..."}</div>
                </motion.div>
              ))}
            </div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Pipeline Funnel</h3>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={funnel} layout="vertical" margin={{ left: 50 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#334155" opacity={0.2} />
                    <XAxis type="number" axisLine={false} tickLine={false} />
                    <YAxis dataKey="stage" type="category" axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: '#334155', opacity: 0.1 }} contentStyle={{ borderRadius: '8px', background: '#1e293b', border: 'none', color: '#fff' }} />
                    <Bar dataKey="total_amount" radius={[0, 4, 4, 0]} barSize={40}>
                      {funnel.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={FUNNEL_COLORS[index % FUNNEL_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
