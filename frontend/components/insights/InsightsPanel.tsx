"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchFromApiClient } from "@/lib/api.client";

type InsightData = {
  id: number;
  insight_key: string;
  insight_type: string;
  title: string;
  description: string;
  severity: "critico" | "alerta" | "warning" | "ok";
  action_suggested: string;
  status: string;
};

export default function InsightsPanel() {
  const [insights, setInsights] = useState<InsightData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFromApiClient("/api/insights/current")
      .then((data) => {
        setInsights(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const critical = insights
    .filter((i) => i.severity === "critico")
    .slice(0, 3);

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-500">
        Cargando insights...
      </div>
    );
  }

  if (critical.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-sm font-semibold text-slate-900">
          Sin alertas críticas
        </p>
        <p className="mt-1 text-xs text-slate-500">
          El negocio no presenta desvíos relevantes en este momento.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-900">Alertas clave</p>
          <p className="text-xs text-slate-500">
            Principales focos que requieren atención
          </p>
        </div>

        <Link
          href="/insights"
          className="text-xs font-semibold text-blue-600 hover:underline"
        >
          Ver todos →
        </Link>
      </div>

      <div className="mt-3 grid gap-2 lg:grid-cols-3">
        {critical.map((insight) => (
          <div
            key={insight.id}
            className="rounded-lg border border-red-200 bg-red-50 p-3"
          >
            <p className="text-xs font-bold text-red-700">{insight.title}</p>
            <p className="mt-1 text-xs text-slate-700 line-clamp-2">
              {insight.action_suggested || insight.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
