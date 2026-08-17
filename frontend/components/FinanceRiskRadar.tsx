type RiskSummaryItem = {
    risk_segment: string;
    customers: number;
    overdue_balance: number;
    overdue_90_balance: number;
    avg_risk_score: number;
};

const ORDER = ["Crítico", "En riesgo", "Atención", "Controlado"];

const STYLE: Record<string, { color: string; textColor: string; bgColor: string }> = {
    Crítico: { color: "#E11D48", textColor: "#9F1239", bgColor: "#FFE4E6" },
    "En riesgo": { color: "#EA580C", textColor: "#9A3412", bgColor: "#FFEDD5" },
    Atención: { color: "#F59E0B", textColor: "#92400E", bgColor: "#FEF3C7" },
    Controlado: { color: "#10B981", textColor: "#065F46", bgColor: "#D1FAE5" },
};

function formatMillions(value?: number) {
    if (value === undefined || value === null || Number.isNaN(Number(value))) return "-";
    return (Number(value) / 1_000_000).toFixed(1);
}

export default function FinanceRiskRadar({ data }: { data: RiskSummaryItem[] }) {
    const ordered = ORDER.map((segment) => {
        const found = data.find((x) => x.risk_segment === segment);

        return {
            segment,
            customers: Number(found?.customers || 0),
            overdue: Number(found?.overdue_balance || 0),
            over90: Number(found?.overdue_90_balance || 0),
            score: Number(found?.avg_risk_score || 0),
            style: STYLE[segment],
        };
    });

    return (
        <div className="flex flex-col h-full">
            <div className="overflow-hidden rounded-xl border border-slate-200">
                <table className="w-full border-collapse text-sm text-left">
                    <thead className="bg-slate-50/50 text-slate-500 uppercase text-xs">
                        <tr>
                            <th className="px-4 py-3 font-medium">Estado</th>
                            <th className="px-4 py-3 font-medium text-center">Clientes</th>
                            <th className="px-4 py-3 font-medium text-center">Score</th>
                            <th className="px-4 py-3 font-medium text-right">Vencido</th>
                            <th className="px-4 py-3 font-medium text-right text-rose-600">+90</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {ordered.map((r) => (
                            <tr key={r.segment} className="hover:bg-slate-50 transition-colors">
                                <td className="px-4 py-3 font-semibold flex items-center gap-2" style={{ color: r.style.textColor }}>
                                    <span
                                        className="inline-block h-2 w-2 rounded-sm"
                                        style={{ background: r.style.color }}
                                    />
                                    {r.segment}
                                </td>

                                <td className="px-4 py-3 text-center font-semibold text-slate-900">
                                    {r.customers}
                                </td>

                                <td className="px-4 py-3 text-center text-slate-500">
                                    <span className="inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-bold" style={{ backgroundColor: r.style.bgColor, color: r.style.textColor }}>
                                        {r.score.toFixed(1)}
                                    </span>
                                </td>

                                <td className="px-4 py-3 text-right font-bold text-slate-900">
                                    $ {formatMillions(r.overdue)}
                                </td>

                                <td className="px-4 py-3 text-right font-bold" style={{ color: r.style.textColor }}>
                                    $ {formatMillions(r.over90)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-auto pt-4 text-xs text-slate-500">
                Score basado en mora, antigüedad y exposición de saldo.
            </div>
        </div>
    );
}