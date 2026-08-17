import { fetchFromApi } from "@/lib/api";
import AppShell from "@/components/layout/AppShell";
import NetworkGraph from "@/components/supply/NetworkGraph";
import Link from "next/link";
import DQBotTrigger from "@/components/DQBotTrigger";

export default async function SupplyNetworkPage() {
  const { nodes, edges } = await fetchFromApi("/api/supply/network");

  return (
    <AppShell>
      <div className="mb-6 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Red de Abastecimiento</h1>
          <p className="mt-1 text-sm text-slate-500">Grafo de flujos desde Proveedores hasta Bodegas.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/supply" className="px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded shadow-sm hover:bg-slate-50 transition-colors">
            Volver a Abastecimiento
          </Link>
          <DQBotTrigger contextItem="supply_network" />
        </div>
      </div>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Total Proveedores</h3>
                <p className="text-2xl font-semibold text-emerald-600">{nodes.filter((n: any) => n.group === 'vendor').length}</p>
            </div>
            <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Items en Tránsito</h3>
                <p className="text-2xl font-semibold text-indigo-600">{nodes.filter((n: any) => n.group === 'item').length}</p>
            </div>
            <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Bodegas Destino</h3>
                <p className="text-2xl font-semibold text-amber-600">{nodes.filter((n: any) => n.group === 'location').length}</p>
            </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Flujo de Inventario (Grafo)</h2>
            <NetworkGraph nodes={nodes} edges={edges} />
        </div>
      </div>
    </AppShell>
  );
}
