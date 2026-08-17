import { fetchFromApi } from "@/lib/api";
import AppShell from "@/components/layout/AppShell";
import Link from "next/link";
import DQBotTrigger from "@/components/DQBotTrigger";

type RepItem = {
  sales_rep: string;
  total_sales: number;
  target_sales: number;
  distinct_customers: number;
};

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

export default async function RepresentativesPage() {
  const repsData: RepItem[] = await fetchFromApi("/api/kpi/sales/representatives");

  return (
    <AppShell>
      <div className="mb-6 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Rendimiento de Representantes Comerciales</h1>
          <p className="mt-1 text-sm text-slate-500">Monitoreo de metas y cuotas de ventas por vendedor.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/sales" className="px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded shadow-sm hover:bg-slate-50 transition-colors">
            Volver a Ventas
          </Link>
          <DQBotTrigger contextItem="sales_reps" />
        </div>
      </div>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Total Representantes</h3>
                <p className="text-2xl font-semibold text-indigo-700">{repsData.length}</p>
            </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
            <h2 className="text-sm font-semibold text-slate-700">Rendimiento por Representante</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-medium">Representante</th>
                  <th className="px-4 py-3 font-medium text-right">Ventas Totales</th>
                  <th className="px-4 py-3 font-medium text-right">Meta (Target)</th>
                  <th className="px-4 py-3 font-medium text-right">% Cumplimiento</th>
                  <th className="px-4 py-3 font-medium text-right">Clientes Únicos</th>
                  <th className="px-4 py-3 font-medium text-center">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {repsData.length > 0 ? repsData.map((rep, idx) => {
                  const perc = rep.target_sales > 0 ? (rep.total_sales / rep.target_sales) * 100 : 0;
                  const isSuccess = perc >= 100;
                  const isWarning = perc >= 75 && perc < 100;
                  const isDanger = perc < 75;

                  return (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-slate-900">{rep.sales_rep}</td>
                      <td className="px-4 py-3 text-right font-semibold text-slate-900">{formatCompactCurrency(rep.total_sales)}</td>
                      <td className="px-4 py-3 text-right text-slate-500">{formatCompactCurrency(rep.target_sales)}</td>
                      <td className="px-4 py-3 text-right">
                         <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${isSuccess ? 'bg-emerald-100 text-emerald-800' : isWarning ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'}`}>
                           {perc.toFixed(1)}%
                         </span>
                      </td>
                      <td className="px-4 py-3 text-right text-slate-600">{rep.distinct_customers}</td>
                      <td className="px-4 py-3 text-center">
                         {isSuccess && <span className="text-emerald-500 font-medium">Logrado</span>}
                         {isWarning && <span className="text-amber-500 font-medium">Cerca</span>}
                         {isDanger && <span className="text-rose-500 font-medium">En Riesgo</span>}
                      </td>
                    </tr>
                  )
                }) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                      No se encontraron datos de representantes de ventas.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
