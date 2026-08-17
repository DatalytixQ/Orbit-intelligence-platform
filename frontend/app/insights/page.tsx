import TopNav from "@/components/TopNav";
import BrandHeader from "@/components/BrandHeader";
import ExecutiveInsightsPanel from "@/components/ExecutiveInsightsPanel";
import InsightsPanel from "@/components/insights/InsightsPanel";
import { fetchFromApi } from "@/lib/api";
import AppShell from "@/components/layout/AppShell";

export default async function InsightsPage() {
    const executiveAnalytics = await fetchFromApi("/api/analytics/executive");

    return (
      <AppShell>
        <div className="mx-auto max-w-7xl px-4 py-8">
            <section className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900">Control de Insights</h1>
                <p className="mt-1 text-sm text-slate-500">
                    Visión ejecutiva y monitoreo de alertas clave de negocio.
                </p>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <ExecutiveInsightsPanel data={executiveAnalytics} />
                </div>
                <div className="lg:col-span-1">
                    <InsightsPanel />
                </div>
            </div>
        </div>
      </AppShell>
    );
}