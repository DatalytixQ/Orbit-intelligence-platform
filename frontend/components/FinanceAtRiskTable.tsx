"use client";

type RiskCustomer = {
  customer_id: string;
  customer_name: string;
  overdue_documents: number;
  critical_documents: number;
  open_balance: number;
  overdue_balance: number;
  overdue_90_balance: number;
  max_days_overdue: number;
  risk_score: number;
  risk_segment: string;
};

type Props = {
  topCustomers: RiskCustomer[];
};

function formatMillions(value?: number) {
  if (value === undefined || value === null || Number.isNaN(Number(value))) return "-";
  return `$ ${(Number(value) / 1_000_000).toFixed(1)} M`;
}

export default function FinanceAtRiskTable({ topCustomers }: Props) {
  return (
    <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-900">Top 5 Clientes Críticos (Riesgo de Cobro)</h3>
          <p className="text-sm text-slate-500">
            Principales deudores ordenados por Score de Riesgo
          </p>
        </div>
      </div>
      <div className="flex-1 p-0 overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50/50">
            <tr>
              <th className="px-6 py-4 font-medium">Cliente</th>
              <th className="px-6 py-4 font-medium text-right">Saldo Abierto</th>
              <th className="px-6 py-4 font-medium text-right text-rose-600">Vencido +90</th>
              <th className="px-6 py-4 font-medium text-right">Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {topCustomers.map((customer) => (
              <tr key={customer.customer_id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-semibold text-slate-900">{customer.customer_name}</div>
                  <div className="text-xs text-slate-500 mt-1">Máx. {customer.max_days_overdue} días de atraso</div>
                </td>
                <td className="px-6 py-4 font-semibold text-slate-900 text-right">
                  {formatMillions(customer.open_balance)}
                </td>
                <td className="px-6 py-4 font-bold text-rose-600 text-right">
                  {formatMillions(customer.overdue_90_balance)}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                      customer.risk_score >= 80 ? 'bg-rose-100 text-rose-800' : 
                      customer.risk_score >= 50 ? 'bg-amber-100 text-amber-800' : 
                      'bg-emerald-100 text-emerald-800'
                    }`}>
                      {customer.risk_segment}
                    </span>
                    <span className="font-bold text-slate-700 w-8 text-right">{customer.risk_score}</span>
                  </div>
                </td>
              </tr>
            ))}
            {topCustomers.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                  No hay clientes en riesgo crítico reportados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
