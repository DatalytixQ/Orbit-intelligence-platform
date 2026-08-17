import type { FinanceRiskCustomer } from "./actions";

export function buildFinanceDrivers(customers: FinanceRiskCustomer[]) {
    const totalOverdue = customers.reduce(
        (acc, c) => acc + Number(c.overdue_balance || 0),
        0
    );

    const totalOver90 = customers.reduce(
        (acc, c) => acc + Number(c.overdue_90_balance || 0),
        0
    );

    const topCustomer = [...customers].sort(
        (a, b) => Number(b.overdue_balance || 0) - Number(a.overdue_balance || 0)
    )[0];

    return {
        total_overdue: totalOverdue,
        total_overdue_90: totalOver90,
        main_driver: topCustomer
            ? `El principal foco de exposición vencida es ${topCustomer.customer_name}.`
            : "No se detecta concentración relevante.",
    };
}