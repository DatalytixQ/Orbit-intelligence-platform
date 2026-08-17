const sql = require("../db");
const { getFinanceRiskBundle } = require("./financeRisk");

function toNumber(value) {
  const n = Number(value);
  return Number.isNaN(n) ? 0 : n;
}

function formatMillions(value) {
  return (toNumber(value) / 1000000).toFixed(1);
}

function buildFinanceAnalysis({ current, aging, riskCustomers }) {
  const overdueRatio = toNumber(current?.overdue_ratio_pct);
  const maxDays = toNumber(current?.max_days_overdue);

  const over90Bucket = aging.find((x) => x.aging_bucket === "Vencido +90");
  const over90Balance = toNumber(over90Bucket?.open_balance);

  const criticalCustomers = riskCustomers.filter(
    (c) => c.risk_segment === "Crítico" || toNumber(c.overdue_90_balance) > 0
  );

  const topExposure = [...riskCustomers].sort(
    (a, b) => toNumber(b.overdue_balance) - toNumber(a.overdue_balance)
  )[0];

  return {
    diagnostics: {
      status: overdueRatio >= 30 || over90Balance > 0 ? "Atención requerida" : "Controlado",
      summary:
        overdueRatio >= 30
          ? "La cartera vencida requiere seguimiento ejecutivo por nivel de exposición."
          : "La cartera se mantiene controlada, con focos específicos de riesgo.",
      overdue_ratio_pct: overdueRatio,
      max_days_overdue: maxDays,
      overdue_90_balance: over90Balance,
    },
    alerts: [
      ...(criticalCustomers.length > 0
        ? [{
            level: "critical",
            title: "Clientes críticos detectados",
            message: `${criticalCustomers.length} clientes presentan riesgo crítico o cartera +90.`,
          }]
        : []),
    ],
    drivers: {
      main_driver: topExposure
        ? `${topExposure.customer_name} concentra la mayor exposición vencida: $${formatMillions(topExposure.overdue_balance)}M.`
        : "No se detecta concentración relevante de exposición vencida.",
    },
    actions: riskCustomers.slice(0, 8).map((c) => ({
      customer_id: c.customer_id,
      customer_name: c.customer_name,
      risk_score: toNumber(c.risk_score),
      overdue_balance: toNumber(c.overdue_balance),
      overdue_90_balance: toNumber(c.overdue_90_balance),
      priority:
        toNumber(c.overdue_90_balance) > 0 || toNumber(c.risk_score) >= 80
          ? "Crítica"
          : toNumber(c.risk_score) >= 60
            ? "Alta"
            : "Media",
      action:
        toNumber(c.overdue_90_balance) > 0
          ? "Escalar hoy con compromiso de pago."
          : "Definir seguimiento preventivo.",
    })),
  };
}

async function buildExecutiveAnalytics() {
  const [
    financeCurrent,
    aging,
    financeBundle,
    salesMonthly,
    salesTopCustomers,
    inventoryCriticalItems,
    inventorySlowMoving,
  ] = await Promise.all([
    sql`select * from public.kpi_finance_current_snapshot`,
    sql`select * from public.kpi_finance_ar_aging_summary`,
    getFinanceRiskBundle(),
    sql`select * from public.kpi_ventas_mensuales`,
    sql`select * from public.kpi_top_clientes limit 10`,
    sql`select * from public.kpi_inventory_top_critical_items`,
    sql`select * from public.kpi_inventory_top_slow_moving`,
  ]);

  const riskCustomers = financeBundle.riskCustomers || [];

  const finance = buildFinanceAnalysis({
    current: financeCurrent[0] || {},
    aging,
    riskCustomers,
  });

  const lastSales = salesMonthly[salesMonthly.length - 1];
  const previousSales = salesMonthly[salesMonthly.length - 2];

  const lastSalesAmount = toNumber(
    lastSales?.total_sales ||
    lastSales?.sales_amount ||
    lastSales?.ventas ||
    lastSales?.amount
  );

  const previousSalesAmount = toNumber(
    previousSales?.total_sales ||
    previousSales?.sales_amount ||
    previousSales?.ventas ||
    previousSales?.amount
  );

  const salesDeltaPct =
    previousSalesAmount > 0
      ? ((lastSalesAmount - previousSalesAmount) / previousSalesAmount) * 100
      : 0;

  const sales = {
    diagnostics: {
      status: salesDeltaPct < -5 ? "Atención comercial" : "Evolución controlada",
      summary:
        salesDeltaPct < -5
          ? `Las ventas muestran una caída de ${salesDeltaPct.toFixed(1)}% respecto al período anterior.`
          : "Las ventas se mantienen estables o en crecimiento frente al período anterior.",
      delta_pct: Number(salesDeltaPct.toFixed(1)),
    },
    alerts: [],
    drivers: {
      main_driver:
        salesTopCustomers.length > 0
          ? `Cliente principal actual: ${salesTopCustomers[0].customer_name || salesTopCustomers[0].cliente || "N/D"}.`
          : "Sin clientes principales disponibles.",
    },
    actions: [
      {
        priority: salesDeltaPct < -5 ? "Alta" : "Media",
        action:
          salesDeltaPct < -5
            ? "Analizar caída por cliente, canal y ticket promedio."
            : "Monitorear evolución comercial y concentración de ventas.",
      },
    ],
  };

  const criticalItemsCount = inventoryCriticalItems.length;
  const slowMovingCount = inventorySlowMoving.length;

  const inventory = {
    diagnostics: {
      status: criticalItemsCount > 0 ? "Atención requerida" : "Controlado",
      summary:
        criticalItemsCount > 0
          ? `Inventario presenta ${criticalItemsCount} productos críticos que requieren revisión.`
          : "Inventario sin señales críticas relevantes.",
    },
    alerts: [],
    drivers: {
      main_driver:
        criticalItemsCount > 0
          ? "El principal driver es la existencia de productos críticos de cobertura."
          : "No se detecta driver crítico de inventario.",
    },
    actions: [
      ...(criticalItemsCount > 0
        ? [{
            priority: "Alta",
            action: "Revisar cobertura de productos críticos y validar reposición sugerida.",
          }]
        : []),
      ...(slowMovingCount > 0
        ? [{
            priority: "Media",
            action: "Analizar slow moving para liberar capital inmovilizado.",
          }]
        : []),
    ],
  };

  return {
    generated_at: new Date().toISOString(),
    finance,
    sales,
    inventory,
    executive_summary: [
      finance.diagnostics.summary,
      sales.diagnostics.summary,
      inventory.diagnostics.summary,
    ],
    next_best_actions: [
      ...(finance.actions || []).slice(0, 3).map((a) => ({
        domain: "Finanzas",
        priority: a.priority,
        action: a.action,
        reference: a.customer_name,
      })),
      ...(sales.actions || []).map((a) => ({
        domain: "Comercial",
        priority: a.priority,
        action: a.action,
        reference: null,
      })),
      ...(inventory.actions || []).map((a) => ({
        domain: "Inventario",
        priority: a.priority,
        action: a.action,
        reference: null,
      })),
    ],
  };
}

module.exports = {
  toNumber,
  formatMillions,
  buildFinanceAnalysis,
  buildExecutiveAnalytics,
};