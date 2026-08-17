export type FinanceDiagnosticsInput = {
    overdue_ratio_pct: number;
    max_days_overdue: number;
    aging_total: number;
    overdue_90_balance: number;
};

export function buildFinanceDiagnostics(input: FinanceDiagnosticsInput) {
    const overdueRatio = Number(input.overdue_ratio_pct || 0);
    const maxDays = Number(input.max_days_overdue || 0);
    const over90 = Number(input.overdue_90_balance || 0);

    return {
        status:
            overdueRatio >= 35 || over90 > 0
                ? "Atención requerida"
                : "Controlado",
        summary:
            overdueRatio >= 35
                ? "La cartera vencida muestra un nivel relevante y requiere seguimiento prioritario."
                : "La cartera vencida se mantiene en niveles controlados, con focos específicos a gestionar.",
        overdue_ratio_pct: overdueRatio,
        max_days_overdue: maxDays,
        overdue_90_balance: over90,
    };
}