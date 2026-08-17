import React from "react";
import { motion } from "framer-motion";
import { WidgetConfig } from "@/lib/engines/WidgetEngine";
import { AlertTriangle, AlertCircle, Info, Sparkles } from "lucide-react";
import DQBotTrigger from "@/components/DQBotTrigger";

export default function InsightWidget({ config, data }: { config: WidgetConfig; data: any }) {
  const insights = Array.isArray(data) ? data : [];

  if (insights.length === 0) {
    return (
      <div className="h-full flex flex-col p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 justify-center items-center shadow-sm">
        <Sparkles className="w-8 h-8 text-slate-300 dark:text-slate-600 mb-3" />
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{config.title}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Todo funciona correctamente. No hay alertas activas.</p>
      </div>
    );
  }

  const getSeverityStyles = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case "crítico":
      case "critical":
        return { 
          badge: "text-rose-600 bg-rose-50 dark:bg-rose-500/10 dark:text-rose-400", 
          border: "border-rose-200 dark:border-rose-900", 
          marker: "bg-rose-500" 
        };
      case "alerta":
      case "warning":
        return { 
          badge: "text-amber-700 bg-amber-50 dark:bg-amber-500/10 dark:text-amber-400", 
          border: "border-amber-200 dark:border-amber-900", 
          marker: "bg-amber-500" 
        };
      case "normal":
      default:
        return { 
          badge: "text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 dark:text-indigo-400", 
          border: "border-indigo-200 dark:border-indigo-900", 
          marker: "bg-indigo-500" 
        };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="h-full flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden"
    >
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/20">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{config.title}</h3>
          {config.subtitle && <p className="text-sm text-slate-500 dark:text-slate-400">{config.subtitle}</p>}
        </div>
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-100 text-xs font-bold text-rose-600 dark:bg-rose-500/20 dark:text-rose-400 shadow-sm">
          {insights.length}
        </span>
      </div>

      <div className="flex-1 p-6 bg-slate-50/30 dark:bg-slate-900/50 overflow-y-auto space-y-4 max-h-[500px] custom-scrollbar">
        {insights.map((insight: any, idx: number) => {
          const styles = getSeverityStyles(insight.priority || insight.severity);
          const title = insight.title || insight.regla || `Alerta ${insight.rule_id}`;
          const desc = insight.description || insight.recomendacion || "";
          const ruleId = insight.rule_id || "BOT-01";
          
          return (
            <motion.div
              key={insight.id || idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`bg-white dark:bg-slate-900 border rounded-xl p-4 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow ${styles.border}`}
            >
              <div className={`absolute top-0 left-0 w-1 h-full ${styles.marker}`}></div>
              
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded ${styles.badge}`}>
                  {insight.priority || insight.severity || 'Atención'}
                </span>
                <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wide">
                  Recomendación IA
                </span>
              </div>
              
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2 leading-tight">
                {title}
              </h4>
              
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 leading-relaxed font-medium">
                {desc}
              </p>
              
              <DQBotTrigger
                contextItem={{ rule_id: ruleId, domain: "Workspace", titulo: title }}
                label="Resolver con IA →"
                className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 px-3 py-1.5 rounded-full transition-colors inline-flex items-center justify-center w-full sm:w-auto"
              />
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
