import {
    buildFinanceActions,
    type FinanceRiskCustomer,
    type FinanceActionRecommendation,
    type FinanceActionPriority,
} from "./actions";

import { buildFinanceDiagnostics } from "./diagnostics";
import { buildFinanceAlerts } from "./alerts";
import { buildFinanceDrivers } from "./drivers";

export type FinanceAnalysisInput = {
    current: {
        overdue_ratio_pct: number;
        max_days_overdue: number;
    };
    aging: {
        aging_bucket: string;
        documents: number;
        open_balance: number;
    }[];
    customers: FinanceRiskCustomer[];
};

export function buildFinanceAnalysis(input: FinanceAnalysisInput) {
    const overdue90 = input.aging.find((x) => x.aging_bucket === "Vencido +90");
    const agingTotal = input.aging.reduce(
        (acc, x) => acc + Number(x.open_balance || 0),
        0
    );

    return {
        diagnostics: buildFinanceDiagnostics({
            overdue_ratio_pct: input.current.overdue_ratio_pct,
            max_days_overdue: input.current.max_days_overdue,
            aging_total: agingTotal,
            overdue_90_balance: Number(overdue90?.open_balance || 0),
        }),
        alerts: buildFinanceAlerts(input.customers),
        drivers: buildFinanceDrivers(input.customers),
        actions: buildFinanceActions(input.customers, 8),
    };
}

export {
    buildFinanceActions,
    buildFinanceDiagnostics,
    buildFinanceAlerts,
    buildFinanceDrivers,
    type FinanceRiskCustomer,
    type FinanceActionRecommendation,
    type FinanceActionPriority,
};