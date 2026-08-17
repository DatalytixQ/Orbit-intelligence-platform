import fs from "fs";
import path from "path";
import { fetchFromApi } from "@/lib/api";
import AppShell from "@/components/layout/AppShell";
import { DashboardConfig } from "@/lib/engines/WidgetEngine";
import DashboardRenderer from "@/lib/engines/DashboardRenderer";

function formatCompactCurrency(value?: number) {
    if (value === undefined || value === null || Number.isNaN(value)) return "-";
    if (Math.abs(value) >= 1_000_000) return `$ ${(value / 1_000_000).toFixed(1)} M`;
    if (Math.abs(value) >= 1_000) return `$ ${(value / 1_000).toFixed(0)} K`;

    return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 0,
    }).format(value);
}

export default async function InventoryPage() {
    const configPath = path.join(process.cwd(), "dashboards", "inventory.json");
    const configContent = fs.readFileSync(configPath, "utf-8");
    const config: DashboardConfig = JSON.parse(configContent);

    const initialData: Record<string, any> = {};

    try {
        const [
            coverage,
            criticalItemsCount,
            criticalValue,
            slowSummary,
            criticalDemandMix,
            topCritical
        ] = await Promise.all([
            fetchFromApi("/api/kpi/inventory/coverage").catch(() => []),
            fetchFromApi("/api/kpi/inventory/critical-items-count").catch(() => ({ critical_items: 0 })),
            fetchFromApi("/api/kpi/inventory/critical-value").catch(() => ({ critical_inventory_value: 0 })),
            fetchFromApi("/api/kpi/inventory/slow-moving-summary").catch(() => ({ slow_moving_value: 0, slow_moving_items: 0 })),
            fetchFromApi("/api/kpi/inventory/critical-demand-mix").catch(() => []),
            fetchFromApi("/api/kpi/inventory/top-critical").catch(() => [])
        ]);

        const criticalTotal = criticalItemsCount?.critical_items ?? 0;
        const criticalValueTotal = criticalValue?.critical_inventory_value ?? 0;
        const slowValueTotal = slowSummary?.slow_moving_value ?? 0;
        const highDemandCritical = criticalDemandMix?.find((d: any) => d.demand_segment === "Alta demanda")?.items ?? 0;

        initialData["inventory-kpi-critical-count"] = { value: criticalTotal, delta: 0 };
        initialData["inventory-kpi-critical-value"] = { value: criticalValueTotal, delta: 0 };
        initialData["inventory-kpi-slow-moving"] = { value: slowValueTotal, delta: 0 };
        
        initialData["inventory-coverage-chart"] = coverage;
        initialData["inventory-critical-table"] = topCritical;
        
        // Generate insights based on the fetched data
        const insights = [];
        
        if (criticalTotal > 0) {
            insights.push({
                id: "inv-ins-1",
                domain: "Inventario",
                priority: "CRÍTICO",
                title: "Riesgo de Quiebre de Stock",
                description: `Existen ${criticalTotal} ítems en estado crítico o riesgo de quiebre inminente. ${highDemandCritical} de ellos son de alta demanda.`,
                rule_id: "INV-001"
            });
        }
        
        if (slowValueTotal > 0) {
            insights.push({
                id: "inv-ins-2",
                domain: "Inventario",
                priority: "ALERTA",
                title: "Capital Inmovilizado",
                description: `Se detectaron ${formatCompactCurrency(slowValueTotal)} en inventario inmovilizado sin salida en los últimos 6 meses.`,
                rule_id: "INV-002"
            });
        }
        
        initialData["inventory-insights"] = insights;

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