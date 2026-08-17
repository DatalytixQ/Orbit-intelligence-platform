import React, { useMemo } from "react";
import { motion } from "framer-motion";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";
import { WidgetConfig } from "@/lib/engines/WidgetEngine";
import { useFilterEngine } from "@/lib/engines/FilterEngine";
import { getChartPalette, DEFAULT_THEME } from "@/lib/engines/ThemeEngine";
import { BarChart3 } from "lucide-react";

export default function ChartWidget({ config, data }: { config: WidgetConfig; data: any }) {
  const toggleFilter = useFilterEngine((state) => state.toggleFilter);
  const palette = getChartPalette ? getChartPalette(DEFAULT_THEME) : undefined;

  const onChartClick = (params: any) => {
    if (config.filterDimension) {
      toggleFilter({
        dimension: config.filterDimension,
        value: params.name || params.value,
        label: params.name || String(params.value),
        source: config.id,
      });
    }
  };

  const options = useMemo(() => {
    if (!data || !Array.isArray(data) || data.length === 0) return null;
    
    const ch = config.chartConfig || {};
    const typeMap: Record<string, string> = {
      "line-chart": "line",
      "bar-chart": "bar",
      "pie-chart": "pie",
      "radar-chart": "radar",
      "heatmap": "heatmap",
      "sankey": "sankey",
      "treemap": "treemap",
      "gauge": "gauge",
      "funnel": "funnel",
    };
    
    const eType = typeMap[config.type] || "bar";
    
    const baseOption: any = {
      color: palette,
      tooltip: {
        trigger: eType === "pie" || eType === "treemap" || eType === "sankey" || eType === "gauge" ? "item" : "axis",
        backgroundColor: "rgba(15, 23, 42, 0.9)", // slate-900
        textStyle: { color: "#f8fafc" }, // slate-50
        borderWidth: 1,
        borderColor: "rgba(51, 65, 85, 0.5)", // slate-700
        borderRadius: 8,
        padding: [8, 12],
      },
      legend: ch.showLegend !== false ? { 
        show: true, 
        bottom: 0,
        textStyle: { color: "#64748b" }, // slate-500
        icon: "circle"
      } : { show: false },
      grid: {
        top: 20,
        right: 20,
        bottom: ch.showLegend !== false ? 40 : 20,
        left: 20,
        containLabel: true
      }
    };

    if (["line", "bar"].includes(eType)) {
      const isHoriz = ch.orientation === "horizontal";
      const catAxis = {
        type: "category",
        data: data.map(d => d[ch.xField || "name"]),
        axisLabel: { color: "#64748b" },
        axisLine: { lineStyle: { color: "#e2e8f0" } }, // slate-200
        axisTick: { show: false },
      };
      const valAxis = {
        type: "value",
        axisLabel: { color: "#64748b" },
        splitLine: { lineStyle: { color: "#f1f5f9", type: "dashed" } }, // slate-100
      };

      baseOption.xAxis = isHoriz ? valAxis : catAxis;
      baseOption.yAxis = isHoriz ? catAxis : valAxis;
      
      const seriesField = ch.seriesField;
      if (seriesField) {
        const seriesNames = Array.from(new Set(data.map(d => d[seriesField])));
        baseOption.series = seriesNames.map(s => ({
          name: s,
          type: eType,
          stack: ch.stacked ? "total" : undefined,
          smooth: ch.smooth,
          showSymbol: false,
          data: data.filter(d => d[seriesField] === s).map(d => d[ch.yField || "value"]),
        }));
      } else {
        baseOption.series = [{
          type: eType,
          smooth: ch.smooth,
          showSymbol: false,
          itemStyle: eType === "bar" ? { borderRadius: [4, 4, 0, 0] } : undefined,
          areaStyle: eType === "line" && ch.stacked ? { opacity: 0.1 } : undefined,
          data: data.map(d => d[ch.yField || "value"]),
        }];
      }
    } else if (eType === "pie") {
      baseOption.series = [{
        type: "pie",
        radius: ["50%", "70%"],
        itemStyle: {
          borderRadius: 4,
          borderColor: '#ffffff',
          borderWidth: 2
        },
        data: data.map(d => ({ name: d[ch.labelField || "name"], value: d[ch.valueField || "value"] })),
        label: { color: "#64748b" }
      }];
    } else {
      baseOption.series = [{
        type: eType,
        data: data
      }];
    }
    
    return baseOption;
  }, [config, data, palette]);

  const handleEvents = {
    click: onChartClick
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="h-full flex flex-col p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{config.title}</h3>
          {config.subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{config.subtitle}</p>}
        </div>
        <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400">
          <BarChart3 className="w-4 h-4" />
        </div>
      </div>
      
      <div className="flex-grow w-full min-h-[300px] relative">
        {!options ? (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-slate-400">
            Sin datos disponibles
          </div>
        ) : (
          <ReactECharts
            echarts={echarts}
            option={options}
            style={{ height: "100%", width: "100%" }}
            onEvents={handleEvents}
            opts={{ renderer: "svg" }}
          />
        )}
      </div>
    </motion.div>
  );
}
