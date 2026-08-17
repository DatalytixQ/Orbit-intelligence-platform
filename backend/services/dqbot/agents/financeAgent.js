const sql = require("../../../db");
const { RULE_FIELD_CATALOG } = require("../fieldCatalog");
const { detectLimit, detectFormat } = require("../intentDetector");
const { formatMoney } = require("../formatters");
const dict = require("../dictionaries/finance.json");
const generalDict = require("../dictionaries/general.json");

async function handleFinanceQuery(intent, question) {
  if (intent === "C001") return await handleC001(question);
  if (intent === "C002") return await handleC002(question);
  if (intent === "C003" || intent === "C004") return await handleC003(question);
  if (intent === "C005") return await handleC005(question);
  return null;
}

async function handleC001(question) {
  const catalog = RULE_FIELD_CATALOG.C001;
  const limit = detectLimit(question, catalog.defaultLimit);

  const rows = await sql.unsafe(`
    WITH c_data AS (
      select
        customer_id,
        customer_name,
        avg_ar_balance,
        sales_amount,
        dso_days,
        overdue_balance,
        overdue_90_balance,
        max_days_overdue,
        risk_segment
      from public.kpi_finance_dso_by_customer_v5
      where overdue_balance > 0
    )
    SELECT
      c.*,
      (SELECT COUNT(*) FROM c_data) as total_debtors,
      (SELECT COUNT(*) FROM c_data WHERE LOWER(risk_segment) = 'crítico') as total_critical
    FROM c_data c
    order by overdue_balance desc, dso_days desc
    limit ${limit}
  `);

  if (!rows || rows.length === 0) {
    return {
      answer: "✅ No se detectaron cuentas por cobrar con saldo vencido en este momento.",
      data: [],
      suggestedQuestions: [
        "Revisar exposición financiera por segmento",
      ],
    };
  }

  const totalDebtors = rows[0].total_debtors || rows.length;
  const totalCritical = rows[0].total_critical || 0;

  const mdTable = `| Cliente | Ventas 90d | DSO | Saldo Total | Vencido | >90 Días | Riesgo |
|---|---|---|---|---|---|---|
${rows.map(r => {
  const riskIcon = (r.risk_segment || "").toLowerCase() === "crítico" ? "🔴" :
                   (r.risk_segment || "").toLowerCase() === "riesgo" ? "🟡" : "🟢";
  return `| **${r.customer_name || "N/A"}** | ${formatMoney(r.sales_amount)} | ${Number(r.dso_days || 0).toFixed(1)} | ${formatMoney(r.avg_ar_balance)} | **${formatMoney(r.overdue_balance)}** | ${formatMoney(r.overdue_90_balance)} | ${riskIcon} ${r.risk_segment || "N/A"} |`;
}).join("\n")}`;

  const answerText = `El dashboard reporta **${totalDebtors} clientes** con deuda vencida, de los cuales **${totalCritical} están en estado CRÍTICO**. A continuación se muestra la lista de los más relevantes ordenados por riesgo y monto vencido.\n\n`
    + mdTable + `\n\n${dict.c001_action}`
    + (totalCritical > 0
      ? `> 🚨 **${totalCritical} cliente(s) en estado CRÍTICO** — se recomienda priorizar la gestión de cobranza y evaluar el bloqueo de nuevos despachos.\n\n`
      : "")
    + `${generalDict.connectors.action_prompt}`;

  return {
    answer: answerText,
    data: rows,
    suggestedQuestions: [
      "Mostrar los 40 clientes con mayor saldo vencido",
      "Agrupar saldo por nivel de riesgo",
      "Ordenar clientes por porcentaje de mora",
      "Mostrar clientes con deuda >90 días",
    ],
  };
}

async function handleC002(question) {
  const rows = await sql.unsafe(`
    SELECT month_date, month_name, actual_dso
    FROM public.vw_kpi_finance_dso_trend
    ORDER BY month_date DESC
    LIMIT 6
  `);

  if (!rows || rows.length === 0) {
    return { answer: "✅ No hay datos históricos de DSO disponibles.", data: [], suggestedQuestions: [] };
  }

  const sortedRows = rows.sort((a, b) => new Date(a.month_date) - new Date(b.month_date));

  const mdTable = `| Mes | DSO |\n|---|---|\n${sortedRows.map(r => `| ${r.month_name} | ${Number(r.actual_dso).toFixed(1)} |`).join("\n")}`;

  return {
    answer: "Histórico de DSO de los últimos 6 meses. Revisa si existe un deterioro progresivo (>15%) en los últimos períodos.\n\n" + mdTable,
    data: sortedRows,
    suggestedQuestions: ["Analizar C001", "Forecast de cobranza"],
  };
}

async function handleC003(question) {
  const rows = await sql.unsafe(`
    SELECT collection_week, expected_collection
    FROM public.vw_cash_collection_forecast
    ORDER BY collection_week ASC
    LIMIT 4
  `);

  if (!rows || rows.length === 0) {
    return { answer: "✅ No hay forecast de cobranza proyectado para las próximas semanas.", data: [], suggestedQuestions: [] };
  }

  const mdTable = `| Semana | Flujo Proyectado |\n|---|---|\n${rows.map(r => `| Semana ${r.collection_week || '?'} | ${formatMoney(r.expected_collection)} |`).join("\n")}`;

  return {
    answer: "Flujo de caja proyectado para las próximas 4 semanas. Identifica si >40% depende de clientes críticos.\n\n" + mdTable,
    data: rows,
    suggestedQuestions: ["Revisar facturas críticas", "Ver clientes morosos"],
  };
}

async function handleC005(question) {
  const limit = detectLimit(question, 10);
  const rows = await sql.unsafe(`
    SELECT
      i.customer_id,
      c.customer_name,
      i.document_number,
      i.invoice_date,
      i.due_date,
      i.open_balance,
      i.calculated_days_overdue
    FROM public.vw_ar_open_sales_invoices_base i
    LEFT JOIN public.customers c ON i.customer_id = c.customer_internal_id
    WHERE i.open_balance > 0 AND i.calculated_days_overdue > 0
    ORDER BY i.open_balance DESC, i.calculated_days_overdue DESC
    LIMIT ${limit}
  `);

  if (!rows || rows.length === 0) {
    return { answer: "✅ No hay facturas críticas vencidas para llamar hoy.", data: [], suggestedQuestions: [] };
  }

  const mdTable = `| Cliente | Factura | Vencimiento | Días Mora | Saldo |\n|---|---|---|---|---|\n${rows.map(r => `| **${r.customer_name || 'N/A'}** | ${r.document_number} | ${r.due_date ? new Date(r.due_date).toLocaleDateString() : 'N/A'} | ${r.calculated_days_overdue} | **${formatMoney(r.open_balance)}** |`).join("\n")}`;

  return {
    answer: "Top 10 Facturas Críticas. Entregar formato de Call-List sugiriendo acciones de cobranza hoy.\n\n" + mdTable,
    data: rows,
    suggestedQuestions: ["Ver clientes con más riesgo", "Ver forecast de cobranza"],
  };
}

module.exports = {
  handleFinanceQuery,
};
