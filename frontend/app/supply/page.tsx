import fs from "fs";
import path from "path";
import { fetchFromApi } from "@/lib/api";
import AppShell from "@/components/layout/AppShell";
import { DashboardConfig } from "@/lib/engines/WidgetEngine";
import DashboardRenderer from "@/lib/engines/DashboardRenderer";

export const dynamic = 'force-dynamic';

export default async function SupplyPage() {
  const configPath = path.join(process.cwd(), "dashboards", "supply.json");
  const configContent = fs.readFileSync(configPath, "utf-8");
  const config: DashboardConfig = JSON.parse(configContent);

  const initialData: Record<string, any> = {};

  try {
    const [summary, pipelineVsSupply, riskByCustomer, inboundTimeline, insightsRaw] = await Promise.all([
      fetchFromApi(`/api/supply/pipeline-summary`).catch(() => ({})),
      fetchFromApi(`/api/supply/pipeline-vs-supply`).catch(() => []),
      fetchFromApi(`/api/supply/risk-by-customer`).catch(() => []),
      fetchFromApi(`/api/supply/inbound-timeline`).catch(() => []),
      fetchFromApi(`/api/supply/insights`).catch(() => [])
    ]);

    initialData["supply-kpi-pipeline"] = { value: summary.pipeline_revenue || 0, delta: 0 };
    initialData["supply-kpi-deliverable"] = { value: summary.deliverable_revenue || 0, delta: 0 };
    initialData["supply-kpi-risk"] = { value: summary.revenue_at_supply_risk || 0, delta: 0 };
    initialData["supply-kpi-margin-risk"] = { value: summary.pipeline_margin || 0, delta: 0 };
    
    initialData["supply-pipeline-chart"] = pipelineVsSupply;
    initialData["supply-risk-table"] = riskByCustomer;
    initialData["supply-inbound-timeline"] = inboundTimeline;
    
    // Map raw insights to the expected format
    initialData["supply-insights"] = (insightsRaw || []).map((insight: any, i: number) => ({
      id: `sup-ins-${i}`,
      domain: "Abastecimiento",
      priority: insight.severidad === 'critico' ? "CRÍTICO" : "ALERTA",
      title: insight.regla || "Riesgo de Abastecimiento",
      description: insight.recomendacion || "",
      rule_id: insight.rule_id || "S001"
    }));

  } catch (error) {
    console.error("Failed to load initial dashboard data", error);
  }

  return (
    <AppShell>
      <div className="min-h-screen bg-slate-50/50 pb-12 pt-6">
        <div className="mx-auto w-full px-4">
          <div className="mb-6 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 className="text-xl font-semibold text-slate-800 tracking-tight">
                {config.name}
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                {config.description}
              </p>
            </div>
          </div>

          <DashboardRenderer config={config} initialData={initialData} />
        </div>
      </div>
    </AppShell>
  );
}
