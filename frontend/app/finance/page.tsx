import fs from "fs";
import path from "path";
import { fetchFromApi } from "@/lib/api";
import AppShell from "@/components/layout/AppShell";
import { DashboardConfig } from "@/lib/engines/WidgetEngine";
import DashboardRenderer from "@/lib/engines/DashboardRenderer";

export default async function FinancePage() {
  const configPath = path.join(process.cwd(), "dashboards", "finance.json");
  const configContent = fs.readFileSync(configPath, "utf-8");
  const config: DashboardConfig = JSON.parse(configContent);

  const initialData: Record<string, any> = {};

  try {
    const [dsoExecutive, arAging, topRisk, riskSummary] = await Promise.all([
      fetchFromApi("/api/kpi/finance/dso-executive").catch(() => null),
      fetchFromApi("/api/kpi/finance/ar-aging-summary").catch(() => []),
      fetchFromApi("/api/kpi/finance/top-risk-customers").catch(() => []),
      fetchFromApi("/api/kpi/finance/risk-summary").catch(() => [])
    ]);

    const summary = dsoExecutive?.summary || {};
    const insights = dsoExecutive?.insights || [];
    const criticalCustomers = riskSummary?.find((r: any) => r.risk_segment === "Crítico")?.customers || 0;

    initialData["finance-kpi-dso"] = { value: summary.current_dso || 0, delta: 0 };
    initialData["finance-kpi-overdue"] = { value: summary.current_overdue_balance || 0, delta: 0 };
    initialData["finance-kpi-critical"] = { value: summary.current_critical_balance || 0, delta: 0 };
    initialData["finance-kpi-customers"] = { value: criticalCustomers, delta: 0 };
    
    initialData["finance-aging-chart"] = arAging;
    initialData["finance-risk-table"] = topRisk;
    
    initialData["finance-insights"] = insights.map((insight: any, i: number) => ({
      id: `fin-ins-${i}`,
      domain: "Finanzas",
      priority: insight.type === "critical" ? "CRÍTICO" : "ALERTA",
      title: insight.title,
      description: insight.description,
      rule_id: insight.rule_id || "FIN-01"
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
            <div className="text-xs font-medium text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full">
              ARS (Millones) • Datos Consolidados
            </div>
          </div>

          <DashboardRenderer config={config} initialData={initialData} />
        </div>
      </div>
    </AppShell>
  );
}