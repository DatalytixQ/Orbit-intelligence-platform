"use client";

import DQBotTrigger from "./DQBotTrigger";

type ActionItem = {
  id: string;
  priority: string;
  title: string;
  description: string;
  domain: string;
};

export default function InventoryActionPanel({
  highDemandCritical,
  criticalItemsTotal,
  slowMovingValue,
}: {
  highDemandCritical: number;
  criticalItemsTotal: number;
  slowMovingValue: number;
}) {
  const actions: ActionItem[] = [];

  if (highDemandCritical > 0) {
    actions.push({
      id: "inv_01",
      priority: "HIGH PRIORITY",
      domain: "Quiebre de Stock",
      title: "Riesgo inminente por Órdenes de Venta abiertas",
      description: `Existen ítems donde el stock disponible no cubre las Órdenes de Venta (OV) pendientes de despacho. Riesgo real de retraso con clientes.`,
    });
  }

  if (slowMovingValue > 0) {
    actions.push({
      id: "inv_02",
      priority: "MEDIUM PRIORITY",
      domain: "Capital Inmovilizado",
      title: "Stock sin salidas físicas recientes",
      description: `Hay capital inmovilizado en ítems sin salidas por ventas ni ensamble (BOM) en más de 6 meses. Evaluar liquidación u optimización.`,
    });
  }

  if (actions.length === 0) {
    actions.push({
      id: "inv_ok",
      priority: "LOW PRIORITY",
      domain: "Salud del Inventario",
      title: "Cobertura Controlada",
      description: "No se detectan quiebres críticos inminentes en ítems de alta prioridad.",
    });
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden h-full">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div>
          <h3 className="text-base font-semibold text-slate-900">Puntos de Atención Prioritaria</h3>
          <p className="text-sm text-slate-500">¿Qué debo resolver hoy?</p>
        </div>
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-100 text-xs font-bold text-rose-600">
          {actions.filter(a => a.priority === "HIGH PRIORITY").length}
        </span>
      </div>
      
      <div className="p-6 space-y-4 flex-1 bg-slate-50/30 overflow-y-auto max-h-[400px]">
        {actions.map((action) => (
          <div key={action.id} className="bg-white border border-rose-100 rounded-xl p-4 shadow-sm relative overflow-hidden group">
            <div className={`absolute top-0 left-0 w-1 h-full ${action.priority === 'HIGH PRIORITY' ? 'bg-rose-500' : 'bg-amber-500'}`}></div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded ${action.priority === 'HIGH PRIORITY' ? 'text-rose-600 bg-rose-50' : 'text-amber-600 bg-amber-50'}`}>
                {action.priority}
              </span>
              <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wide">
                {action.domain}
              </span>
            </div>
            <h4 className="text-sm font-semibold text-slate-900 mb-1">{action.title}</h4>
            <p className="text-xs text-slate-600 leading-relaxed">{action.description}</p>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-slate-100 bg-white">
        <DQBotTrigger 
            contextItem={actions.map(a => ({
              ...a,
              titulo: a.id === "inv_01" ? "¿Cuáles son las Órdenes de Venta abiertas con riesgo de quiebre inminente?" : a.title,
              rule_id: a.id === "inv_01" ? "DYNAMIC_SQL" : a.id === "inv_02" ? "I003" : a.id
            }))}
            className="w-full text-center py-2 text-sm font-medium text-indigo-600 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
        />
      </div>
    </div>
  );
}
