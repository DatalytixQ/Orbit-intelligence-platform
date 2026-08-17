const sql = require("../../../db");
const { RULE_FIELD_CATALOG } = require("../fieldCatalog");
const { detectLimit, detectFormat } = require("../intentDetector");
const { formatMoney, formatTable } = require("../formatters");
const dict = require("../dictionaries/inventory.json");
const generalDict = require("../dictionaries/general.json");

async function handleInventoryQuery(intent, question) {
  if (intent === "I001") return await handleI001(question);
  if (intent === "I002") return await handleI002(question);
  if (intent === "I003") return await handleI003(question);
  if (intent === "I004") return await handleI004(question);
  return null;
}

// ============================================================
// I001 — Quiebre Inminente de Stock
// Fuente: kpi_inventory_top_critical_items
// Lógica: stock disponible < demanda mensual × lead_time
// ============================================================
async function handleI001(question) {
  const limit = detectLimit(question, 20);

  const rows = await sql.unsafe(`
    WITH c_data AS (
      SELECT
        c.item_id,
        c.item_name,
        c.item_class,
        c.stock_available,
        c.avg_monthly_qty_3m,
        c.net_coverage_months,
        c.lead_time_days,
        c.inventory_value,
        c.coverage_status
      FROM public.vw_inventory_executive_coverage c
      WHERE c.coverage_status IN ('Crítico', 'Riesgo', 'Quiebre Inminente (OV)')
    )
    SELECT
      c.*,
      (SELECT COUNT(*) FROM c_data) as total_items,
      (SELECT COUNT(*) FROM c_data WHERE coverage_status = 'Crítico' OR coverage_status = 'Quiebre Inminente (OV)') as total_critical
    FROM c_data c
    ORDER BY
      CASE c.coverage_status 
        WHEN 'Quiebre Inminente (OV)' THEN 1 
        WHEN 'Crítico' THEN 2 
        ELSE 3 
      END,
      c.inventory_value DESC
    LIMIT ${limit}
  `);


  if (!rows || rows.length === 0) {
    return {
      answer: "✅ Revisé el estado del inventario y **no encontré ítems con riesgo inminente de quiebre de stock** en este momento. Los niveles de cobertura están dentro de los rangos seguros para todos los productos de alta demanda.",
      data: [],
      suggestedQuestions: [
        "Mostrar inventario con capital inmovilizado",
        "Revisar stock por categoría",
        "Analizar demanda de los últimos 3 meses",
      ],
    };
  }

  const totalItems = rows[0].total_items || rows.length;
  const totalCritical = rows[0].total_critical || 0;
  const totalValue = rows.reduce((acc, r) => acc + Number(r.inventory_value || 0), 0);
  const minCoverage = Math.min(...rows.map(r => Number(r.net_coverage_months || 0))).toFixed(1);

  const mdTable = `| Producto | Stock Disp. | Demanda/Mes | Cobertura Actual | Lead Time | Valor Riesgo | Estado |
|---|---|---|---|---|---|---|
${rows.map(r => {
  const coverage = Number(r.net_coverage_months || 0).toFixed(1);
  const statusIcon = r.coverage_status === "Quiebre Inminente (OV)" ? "🔥 OV en Riesgo" : r.coverage_status === "Crítico" ? "🔴 Crítico" : "🟡 Riesgo";
  return `| ${(r.item_name || "Producto").substring(0, 30)} | ${r.stock_available} und. | ${Number(r.avg_monthly_qty_3m || 0).toFixed(0)} und./mes | **${coverage} meses** | ${r.lead_time_days} días | ${formatMoney(r.inventory_value)} | ${statusIcon} |`;
}).join("\n")}`;

  const answerText = `He analizado el riesgo de quiebre de stock. El dashboard reporta **${totalItems} ítems** con cobertura insuficiente, comprometiendo un valor significativo de inventario.\n\nEl ítem más crítico en este listado tiene solo ${minCoverage} meses de cobertura frente a su lead time. Si no se activa una reposición urgente, habrá ruptura de stock.\n\nA continuación, te detallo los registros más afectados (Top ${rows.length}), priorizados por nivel de criticidad:\n\n${mdTable}\n\n`
    + (totalCritical > 0
      ? `> ⚠️ **${totalCritical} ítem(s) en todo el catálogo están en estado CRÍTICO** — requieren acción inmediata (ej. coordinar con abastecimiento o evaluar suministro alternativo).\n\n`
      : "")
    + `${generalDict.connectors.action_prompt}`;

  return {
    answer: answerText,
    data: rows,
    suggestedQuestions: [
      "¿Cuáles son las OV que no se pueden cumplir para estos ítems?",
      "Mostrar los 40 ítems en riesgo de quiebre",
      "¿Cuáles ítems tienen menos de 1 mes de cobertura?",
      "Mostrar embarques en tránsito para estos ítems",
      "Mostrar capital inmovilizado en bodega",
    ],
  };
}

// ============================================================
// I003 — Capital Inmovilizado / Slow Moving
// Fuente: vw_rule_e003_detail
// Lógica: ítems con stock alto y sin rotación relevante
// ============================================================
async function handleI003(question) {
  const limit = detectLimit(question, 20);

  const rows = await sql.unsafe(`
    select
      item_id,
      item_name,
      capital_inmovilizado,
      severidad,
      recomendacion
    from public.vw_rule_e003_detail
    order by capital_inmovilizado desc
    limit ${limit}
  `);

  if (!rows || rows.length === 0) {
    return {
      answer: "✅ No se detectó capital inmovilizado significativo en este momento. Los ítems en bodega presentan rotación normal.",
      data: [],
      suggestedQuestions: [
        "Mostrar ítems con quiebre inminente de stock",
        "Revisar inventario por categoría",
      ],
    };
  }

  const totalCapital = rows.reduce((acc, r) => acc + Number(r.capital_inmovilizado || 0), 0);

  const mdTable = `| Producto | Capital Inmovilizado | Nivel de Riesgo | Acción Sugerida |
|---|---|---|---|
${rows.slice(0, 20).map(r => {
  const riskIcon = r.severidad === "critico" ? "🔴" : "🟡";
  return `| ${(r.item_name || "Producto").substring(0, 30)} | **${formatMoney(r.capital_inmovilizado)}** | ${riskIcon} ${r.severidad} | ${(r.recomendacion || "Evaluar liquidación").substring(0, 60)} |`;
}).join("\n")}`;

  const answerText = dict.i003_summary
    .replace("{{count}}", rows.length)
    .replace("{{total_capital}}", formatMoney(totalCapital))
    + `\n\n${generalDict.connectors.list_intro}\n\n${mdTable}\n\n${generalDict.connectors.action_prompt}`;

  return {
    answer: answerText,
    data: rows,
    suggestedQuestions: [
      "Mostrar los 40 ítems con mayor capital inmovilizado",
      "¿Qué productos tienen más de 12 meses sin rotación?",
      "Mostrar ítems en quiebre inminente",
    ],
  };
}


async function handleI002(question) {
  const rows = await sql.unsafe(`
    WITH coverage_data AS (
      SELECT item_id, item_name, item_class, stock_available, in_transit_qty,
             stock_coverage_months, lead_time_days, inventory_value
      FROM public.kpi_inventory_coverage
      WHERE stock_coverage_months * 30 < lead_time_days
    )
    SELECT 
      c.*,
      (SELECT COUNT(*) FROM coverage_data) as total_critical_items,
      b.parent_item_id,
      (SELECT SUM(CAST(o.quantity_pending AS NUMERIC)) FROM public.raw_open_sales_orders o WHERE o.item_internal_id = COALESCE(b.parent_item_id, c.item_id)) as impacted_ov_qty
    FROM coverage_data c
    LEFT JOIN public.raw_item_bom b ON c.item_id = b.component_item_id
    ORDER BY c.inventory_value DESC
    LIMIT 10
  `);

  if (!rows || rows.length === 0) {
    return { answer: "✅ No hay ítems donde la cobertura sea menor al lead time.", data: [], suggestedQuestions: [] };
  }

  const total = rows[0].total_critical_items || rows.length;
  const mdTable = `| Producto | Tipo | Stock | En Tránsito (OC) | Cobertura (Mes) | ETA (Días) | Impacto OV |\n|---|---|---|---|---|---|---|\n${rows.map(r => `| ${r.item_name} | ${r.item_class} | ${r.stock_available} | ${r.in_transit_qty} | ${Number(r.stock_coverage_months).toFixed(1)} | ${r.lead_time_days} | ${r.impacted_ov_qty ? r.impacted_ov_qty + ' unds' : '0'} |`).join("\n")}`;

  return {
    answer: `El dashboard reporta **${total} ítems** con problemas de cobertura vs lead time. Alerta: Hay componentes con stock crítico que pueden impactar órdenes de venta pendientes para productos terminados.\n\n` + mdTable,
    data: rows,
    suggestedQuestions: ["¿Cuáles ítems tienen impacto en OV pendientes?", "Capital inmovilizado", "Ver clientes críticos con deudas"],
  };
}

async function handleI004(question) {
  const rows = await sql.unsafe(`
    SELECT item_name, capital_inmovilizado, severidad
    FROM public.vw_rule_e003_detail
    WHERE capital_inmovilizado > 0
    ORDER BY capital_inmovilizado DESC
    LIMIT 5
  `);

  if (!rows || rows.length === 0) {
    return { answer: "✅ No hay capital inmovilizado significativo.", data: [], suggestedQuestions: [] };
  }

  const mdTable = `| Producto | Capital Parado | Severidad |\n|---|---|---|\n${rows.map(r => `| ${r.item_name} | ${formatMoney(r.capital_inmovilizado)} | ${r.severidad} |`).join("\n")}`;

  return {
    answer: "Top ítems con capital inmovilizado (>180 días sin rotación) frente a la demanda retenida (Lost Sales). Oportunidad de liquidar o financiar.\n\n" + mdTable,
    data: rows,
    suggestedQuestions: ["Ver detalle de I003", "Ver quiebres de stock"],
  };
}

module.exports = {
  handleInventoryQuery,
};
