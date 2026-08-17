import type { FinanceRiskCustomer } from "./actions";

export function buildFinanceAlerts(customers: FinanceRiskCustomer[]) {
    const critical = customers.filter(
        (c) => c.risk_segment === "Crítico" || Number(c.overdue_90_balance || 0) > 0
    );

    const highExposure = customers.filter(
        (c) => Number(c.overdue_balance || 0) > 0 && Number(c.risk_score || 0) >= 70
    );

    return [
        ...(critical.length > 0
            ? [{
                level: "critical",
                title: "Clientes con cartera crítica",
                message: `${critical.length} clientes presentan riesgo crítico o saldo vencido +90.`,
            }]
            : []),

        ...(highExposure.length > 0
            ? [{
                level: "warning",
                title: "Exposición vencida relevante",
                message: `${highExposure.length} clientes combinan exposición vencida y score elevado.`,
            }]
            : []),
    ];
}