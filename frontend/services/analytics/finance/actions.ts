export type FinanceRiskCustomer = {
    customer_id?: string;
    customer_name: string;
    risk_score: number;
    overdue_balance: number;
    overdue_90_balance: number;
    max_days_overdue?: number;
    risk_segment?: string;
};

export type FinanceActionPriority = "Crítica" | "Alta" | "Media" | "Baja";

export type FinanceActionRecommendation = {
    customer_id?: string;
    customer_name: string;
    risk_score: number;
    overdue_balance: number;
    overdue_90_balance: number;
    priority_score: number;
    priority: FinanceActionPriority;
    action: string;
    reason: string;
    color: string;
};

const PRIORITY_COLOR: Record<FinanceActionPriority, string> = {
    Crítica: "#DC2626",
    Alta: "#F97316",
    Media: "#F59E0B",
    Baja: "#10B981",
};

function computePriorityScore(customer: FinanceRiskCustomer) {
    const riskScore = Number(customer.risk_score || 0);
    const overdue = Number(customer.overdue_balance || 0);
    const over90 = Number(customer.overdue_90_balance || 0);
    const maxDays = Number(customer.max_days_overdue || 0);

    return (
        riskScore * 0.5 +
        (overdue > 0 ? 20 : 0) +
        (over90 > 0 ? 35 : 0) +
        (maxDays > 120 ? 10 : 0)
    );
}

function getPriority(score: number): FinanceActionPriority {
    if (score >= 95) return "Crítica";
    if (score >= 70) return "Alta";
    if (score >= 40) return "Media";
    return "Baja";
}

function getAction(priority: FinanceActionPriority) {
    if (priority === "Crítica") return "Escalar hoy con compromiso de pago y revisión de exposición.";
    if (priority === "Alta") return "Definir acuerdo de pago y seguimiento en 48 horas.";
    if (priority === "Media") return "Activar seguimiento preventivo antes de deterioro.";
    return "Mantener monitoreo sin acción inmediata.";
}

function getReason(customer: FinanceRiskCustomer, priority: FinanceActionPriority) {
    const over90 = Number(customer.overdue_90_balance || 0);
    const overdue = Number(customer.overdue_balance || 0);
    const maxDays = Number(customer.max_days_overdue || 0);

    if (priority === "Crítica") {
        return `Alta criticidad por score elevado, saldo vencido relevante y ${over90 > 0 ? "cartera +90 activa" : "antigüedad significativa"}.`;
    }

    if (priority === "Alta") {
        return `Riesgo alto por exposición vencida y posibilidad de deterioro si no se gestiona en el corto plazo.`;
    }

    if (priority === "Media") {
        return `Mora existente con impacto moderado; requiere prevención para evitar escalamiento.`;
    }

    return `Sin señales críticas actuales; mantener control periódico.`;
}

export function buildFinanceActions(
    customers: FinanceRiskCustomer[],
    limit = 8
): FinanceActionRecommendation[] {
    return customers
        .map((customer) => {
            const priorityScore = computePriorityScore(customer);
            const priority = getPriority(priorityScore);

            return {
                customer_id: customer.customer_id,
                customer_name: customer.customer_name,
                risk_score: Number(customer.risk_score || 0),
                overdue_balance: Number(customer.overdue_balance || 0),
                overdue_90_balance: Number(customer.overdue_90_balance || 0),
                priority_score: priorityScore,
                priority,
                action: getAction(priority),
                reason: getReason(customer, priority),
                color: PRIORITY_COLOR[priority],
            };
        })
        .sort((a, b) => b.priority_score - a.priority_score)
        .slice(0, limit);
}