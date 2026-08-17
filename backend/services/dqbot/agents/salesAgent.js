const sql = require("../../../db");
const { RULE_FIELD_CATALOG } = require("../fieldCatalog");
const {
  detectLimit,
  detectFormat,
  detectOrderBy,
  detectRequestedFields,
} = require("../intentDetector");
const { formatMoney, formatTable } = require("../formatters");
const dict = require("../dictionaries/sales.json");
const generalDict = require("../dictionaries/general.json");

async function handleSalesQuery(intent, question) {
  if (intent === "V001") return await handleV001(question);
  if (intent === "V002") return await handleV002(question);
  if (intent === "V003") return await handleV003(question);
  if (intent === "V004") return await handleV004(question);
  return null;
}

async function handleV001(question) {
  const catalog = RULE_FIELD_CATALOG.V001;
  const limit = detectLimit(question, catalog.defaultLimit);
  const format = detectFormat(question);
  const orderBy = detectOrderBy(question, catalog);
  const fields = detectRequestedFields(question, catalog);

  const queryFields = fields.includes("cumplimiento_pct")
    ? fields
    : [...fields, "cumplimiento_pct"];

  if (format === "grouped") {
    const rows = await sql.unsafe(`
      select
        vendedor,
        count(*) as items,
        sum(forecast) as forecast_total,
        sum(real) as real_total,
        avg(cumplimiento_pct) as cumplimiento_promedio
      from ${catalog.source}
      group by vendedor
      order by cumplimiento_promedio asc
      limit ${limit}
    `);

    return {
      answer: "He agrupado el cumplimiento comercial por representante, priorizado por el menor porcentaje de avance.",
      data: rows,
      suggestedQuestions: [
        "Mostrar el detalle de items del vendedor con menor cumplimiento",
        "Ordenar items por forecast original",
        "Mostrar sku, nombre, forecast y real en tabla",
      ],
    };
  }

  const rows = await sql.unsafe(`
    select *
    from ${catalog.source}
    order by ${orderBy} asc
    limit ${limit}
  `);

  const table = format === "table" ? `\n\n${formatTable(rows, fields)}` : "";

  // MD Table logic
  const mdTable = `| Vendedor | Cliente | Desempeño (%) | Forecast |
|---|---|---|---|
${rows.slice(0, 15).map(r => {
  return `| ${r.sales_rep || 'N/A'} | ${r.item_name || 'N/A'} | ${Number(r.cumplimiento_pct || 0).toFixed(1)}% | ${formatMoney(r.forecast_amount)} |`;
}).join("\n")}`;

  const topCustomer = rows[0]?.item_name || "Principal";
  const participation = (100 - Number(rows[0]?.cumplimiento_pct || 0)).toFixed(1);

  let answerText = "";
  if (format === "summary") {
    answerText = dict.v001_summary
      .replace("{{customer_name}}", topCustomer)
      .replace("{{participation_pct}}", participation) 
      + `\n\n${generalDict.connectors.list_intro}\n\n${mdTable}\n\n${generalDict.connectors.action_prompt}`;
  } else {
    answerText = `He detectado ${rows.length} registros con bajo cumplimiento en Ventas. Orden aplicado: ${orderBy}.${table}`;
  }

  return {
    answer: answerText,
    data: rows,
    suggestedQuestions: [
      "Mostrar los 40 items con menor cumplimiento",
      "Agrupar desempeño por vendedor",
      "Ordenar items por forecast original",
      "Mostrar sku, nombre, cumplimiento y riesgo en tabla",
    ],
  };
}

async function handleV002(question) {
  const catalog = RULE_FIELD_CATALOG.V002;
  const limit = detectLimit(question, catalog.defaultLimit);
  const format = detectFormat(question);
  const orderBy = detectOrderBy(question, catalog);
  const fields = detectRequestedFields(question, catalog);

  const queryFields = fields.includes("desviacion")
    ? fields
    : [...fields, "desviacion"];

  if (format === "grouped") {
    const rows = await sql.unsafe(`
      select
        vendedor,
        count(*) as items,
        sum(desviacion) as desviacion_total
      from ${catalog.source}
      group by vendedor
      order by desviacion_total desc
      limit ${limit}
    `);

    return {
      answer: "He agrupado las desviaciones de margen por vendedor, destacando aquellos con mayor impacto negativo.",
      data: rows,
      suggestedQuestions: [
        "Mostrar el detalle de items del peor vendedor",
        "Ordenar desviaciones por porcentaje",
        "Mostrar sku, nombre, forecast y real en tabla",
      ],
    };
  }

  const rows = await sql.unsafe(`
    select *
    from ${catalog.source}
    order by ${orderBy} desc
    limit ${limit}
  `);

  const totalDeviation = rows.reduce((acc, row) => acc + Number(row.gap_amount || 0), 0);
  const table = format === "table" ? `\n\n${formatTable(rows, fields)}` : "";

  const mdTable = `| Cliente | Desvío ($) | Riesgo | Recomendación |
|---|---|---|---|
${rows.slice(0, 15).map(r => {
  return `| **${r.client_id}** | ${formatMoney(r.gap_amount)} | ${r.risk_level || 'N/A'} | ${r.recommended_action || '-'} |`;
}).join("\n")}`;

  let answerText = "";
  if (format === "summary") {
    answerText = dict.v002_summary
      .replace("{{count}}", rows.length)
      .replace("{{total_deviation}}", formatMoney(totalDeviation))
      + `\n\n${generalDict.connectors.list_intro}\n\n${mdTable}\n\n${generalDict.connectors.action_prompt}`;
  } else {
    answerText = `He detectado ${rows.length} registros con desviación significativa. Impacto acumulado: ${formatMoney(totalDeviation)}. Orden aplicado: ${orderBy}.${table}`;
  }

  return {
    answer: answerText,
    data: rows,
    suggestedQuestions: [
      "Mostrar los 40 items con mayor desviación",
      "Agrupar desviación por vendedor",
      "Ordenar items por forecast original",
      "Mostrar sku, nombre, desviación y riesgo en tabla",
    ],
  };
}


async function handleV003(question) {
  const rows = await sql.unsafe(`
    SELECT mes, ventas_ars, ventas_usd
    FROM public.vw_sales_monthly
    ORDER BY mes DESC
    LIMIT 12
  `);

  if (!rows || rows.length === 0) {
    return { answer: "✅ No hay datos históricos de ventas para evaluar la tendencia.", data: [], suggestedQuestions: [] };
  }

  const sorted = rows.sort((a, b) => new Date(a.mes) - new Date(b.mes));
  const mdTable = `| Mes | Ventas (USD) |\n|---|---|\n${sorted.map(r => `| ${r.mes} | ${formatMoney(r.ventas_usd)} |`).join("\n")}`;

  return {
    answer: "Histórico de ventas (12 meses). Evaluar si existen caídas atípicas que superen la desviación estándar e impacten el margen global.\n\n" + mdTable,
    data: sorted,
    suggestedQuestions: ["Ver desviación comercial", "Revisar forecast general"],
  };
}

async function handleV004(question) {
  const rows = await sql.unsafe(`
    SELECT customer, sales_amount, participation_pct
    FROM public.kpi_sales_concentration_customer
    ORDER BY participation_pct DESC
    LIMIT 5
  `);

  if (!rows || rows.length === 0) {
    return { answer: "✅ No hay datos de concentración de clientes disponibles.", data: [], suggestedQuestions: [] };
  }

  const top5Pct = rows.reduce((acc, row) => acc + Number(row.participation_pct || 0), 0);
  const mdTable = `| Cliente | Ventas | Participación (%) |\n|---|---|---|\n${rows.map(r => `| ${r.customer} | ${formatMoney(r.sales_amount)} | ${Number(r.participation_pct).toFixed(1)}% |`).join("\n")}`;

  return {
    answer: `Top 5 Clientes concentran el ${top5Pct.toFixed(1)}% de los ingresos. Evaluar Alto Riesgo de Dependencia y calcular impacto ante churn del 10%.\n\n` + mdTable,
    data: rows,
    suggestedQuestions: ["Ver todos los clientes top", "Ver concentración por categoría"],
  };
}

module.exports = {
  handleSalesQuery
};
