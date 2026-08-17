import React from "react";
import { motion } from "framer-motion";
import { WidgetConfig } from "@/lib/engines/WidgetEngine";
import { useFilterEngine } from "@/lib/engines/FilterEngine";
import { ArrowDownIcon, ArrowUpIcon, Activity } from "lucide-react";

export default function KpiWidget({ config, data }: { config: WidgetConfig; data: any }) {
  const toggleFilter = useFilterEngine((state) => state.toggleFilter);

  const handleClick = () => {
    if (config.filterDimension && data) {
      toggleFilter({
        dimension: config.filterDimension,
        value: data.value,
        label: config.title,
        source: config.id,
      });
    }
  };

  const formatValue = (value: number, format?: string, currencyStr?: string) => {
    if (value === null || value === undefined) return "--";
    switch (format) {
      case "currency":
        let val = value;
        let suffix = "";
        if (Math.abs(value) >= 1000000) {
          val = value / 1000000;
          suffix = " M";
        } else if (Math.abs(value) >= 1000) {
          val = value / 1000;
          suffix = " K";
        }
        return `${currencyStr || "$"}${val.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}${suffix}`;
      case "percent":
        return `${value.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`;
      case "days":
        return `${Math.round(value)} días`;
      case "number":
      default:
        return value.toLocaleString();
    }
  };

  const val = data?.value ?? null;
  const trendVal = data?.trend ?? null;
  
  const kpi = config.kpiConfig || { format: "number", severity: "neutral" };
  
  const severityStyles = {
    success: {
      text: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
      border: "border-emerald-100 dark:border-emerald-800/30",
      glow: "shadow-emerald-500/10",
      icon: "text-emerald-500"
    },
    warning: {
      text: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-900/20",
      border: "border-amber-100 dark:border-amber-800/30",
      glow: "shadow-amber-500/10",
      icon: "text-amber-500"
    },
    critical: {
      text: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-50 dark:bg-rose-900/20",
      border: "border-rose-100 dark:border-rose-800/30",
      glow: "shadow-rose-500/10",
      icon: "text-rose-500"
    },
    danger: {
      text: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-50 dark:bg-rose-900/20",
      border: "border-rose-100 dark:border-rose-800/30",
      glow: "shadow-rose-500/10",
      icon: "text-rose-500"
    },
    neutral: {
      text: "text-slate-900 dark:text-slate-50",
      bg: "bg-white dark:bg-slate-900",
      border: "border-slate-200 dark:border-slate-800",
      glow: "shadow-slate-500/5",
      icon: "text-slate-400"
    },
  };
  
  const style = severityStyles[(kpi.severity as keyof typeof severityStyles) || "neutral"];

  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`h-full flex flex-col justify-between p-6 rounded-2xl border shadow-sm transition-all duration-300 ${style.bg} ${style.border} hover:shadow-md hover:${style.glow} ${config.filterDimension ? 'cursor-pointer' : ''}`}
      onClick={handleClick}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{config.title}</h3>
        <div className={`p-2 rounded-xl bg-white/50 dark:bg-black/20 ${style.icon}`}>
          <Activity className="w-4 h-4" />
        </div>
      </div>
      
      <div>
        <div className="flex items-baseline space-x-2">
          <span className={`text-4xl md:text-5xl font-extrabold tracking-tight ${style.text}`}>
            {formatValue(val, kpi.format, kpi.currency)}
          </span>
        </div>
        
        {trendVal !== null && trendVal !== undefined && (
          <div className="mt-3 flex items-center gap-2">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${trendVal >= 0 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400" : "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400"}`}>
              {trendVal >= 0 ? <ArrowUpIcon className="w-3 h-3 mr-1" /> : <ArrowDownIcon className="w-3 h-3 mr-1" />}
              {kpi.trend?.format === "absolute" ? formatValue(Math.abs(trendVal), kpi.format, kpi.currency) : `${Math.abs(trendVal).toFixed(1)}%`}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">vs mes anterior</span>
          </div>
        )}
        
        {config.subtitle && !trendVal && (
          <p className="mt-3 text-xs font-medium text-slate-500 dark:text-slate-400">{config.subtitle}</p>
        )}
        
        {kpi.narrative && (
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            {kpi.narrative}
          </p>
        )}
      </div>
    </motion.div>
  );
}
