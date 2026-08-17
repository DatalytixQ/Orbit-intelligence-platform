const sql = require("../../../db");
const { detectLimit } = require("../intentDetector");
const { formatMoney } = require("../formatters");
const dict = require("../dictionaries/supply.json");
const generalDict = require("../dictionaries/general.json");

async function handleSupplyQuery(intent, question) {
  if (intent === "E002") return await handleE002(question);
  if (intent === "S001") return await handleS001(question);
  return null;
}

// ============================================================
// E002 — Riesgo por Cliente Deudor (impacto en supply chain)
// Fuente: vw_rule_e002_detail
// ============================================================
async function handleE002(question) {
  const limit = detectLimit(question, 20);

  const rows = await sql.unsafe(`
    select
      cliente,
      deuda_vencida,
      severidad,
      recomendacion
    from public.vw_rule_e002_detail
    order by deuda_vencida desc
    limit ${limit}
  `);

  if (!rows || rows.length === 0) {
    return {
      answer: "✅ No se detectaron clientes con deuda vencida de impacto crítico en el supply chain en este momento.",
      data: [],
      suggestedQuestions: [
        "Mostrar cronograma de embarques",
        "Revisar riesgo de abastecimiento general",
      ],
    };
  }

  const totalDeuda = rows.reduce((acc, r) => acc + Number(r.deuda_vencida || 0), 0);

  const mdTable = `| Cliente | Deuda Vencida | Nivel de Riesgo | Acción Recomendada |
|---|---|---|---|
${rows.map(r => {
  const riskIcon = r.severidad === "critico" ? "🔴" : "🟡";
  return `| **${r.cliente}** | ${formatMoney(r.deuda_vencida)} | ${riskIcon} ${r.severidad} | ${(r.recomendacion || "-").substring(0, 60)} |`;
}).join("\n")}`;

  const answerText = dict.e002_summary
    .replace("{{count}}", rows.length)
    .replace("{{total_deuda}}", formatMoney(totalDeuda))
    + `\n\n${generalDict.connectors.list_intro}\n\n${mdTable}\n\n`
    + `> 💡 **Próximo paso sugerido:** Coordinar con el equipo de Cobranzas (CxC) para gestionar estas cuentas y definir si se continúan o suspenden los despachos pendientes.\n\n`
    + `${generalDict.connectors.action_prompt}`;

  return {
    answer: answerText,
    data: rows,
    suggestedQuestions: [
      "¿Cuántos despachos tiene bloqueados el cliente con mayor deuda?",
      "Mostrar cronograma de embarques pendientes",
      "Revisar exposición financiera en CxC",
    ],
  };
}

// ============================================================
// S001 — Cronograma de Embarques / OCs en Tránsito
// Fuente: inbound_shipments_normalized
// ============================================================
async function handleS001(question) {
  const limit = detectLimit(question, 25);

  // Get shipments with item names
  const rows = await sql.unsafe(`
    select
      s.po_number,
      s.inbound_shipment_number,
      s.inbound_shipment_status,
      s.quantity_inbound,
      s.expected_shipping_date,
      s.expected_delivery_date,
      s.available_for_sale_date,
      i.item_name
    from public.inbound_shipments_normalized s
    left join public.items_master_v i on i.item_id::text = s.item_id::text
    order by
      case
        when s.expected_delivery_date is null then 2
        else 1
      end,
      s.expected_delivery_date asc
    limit ${limit}
  `);

  if (!rows || rows.length === 0) {
    return {
      answer: "✅ No hay embarques pendientes registrados en este momento. El cronograma de arribo está sin OCs activas.",
      data: [],
      suggestedQuestions: [
        "Mostrar riesgo de quiebre de stock",
        "Revisar riesgo por cliente deudor",
      ],
    };
  }

  // Count by status
  const sinFecha = rows.filter(r => !r.expected_delivery_date).length;
  const totalQty = rows.reduce((acc, r) => acc + Number(r.quantity_inbound || 0), 0);

  // Format dates
  function fmtDate(d) {
    if (!d) return "⚠️ Sin fecha confirmada";
    const date = new Date(d);
    return date.toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric" });
  }

  const mdTable = `| OC | Embarque | Estado | Ítem | Cantidad | Fecha Entrega Est. | Disp. para Venta |
|---|---|---|---|---|---|---|
${rows.map(r => {
  const statusIcon = r.inbound_shipment_status?.toLowerCase().includes("transito") ? "🚢" :
                     r.inbound_shipment_status?.toLowerCase().includes("enviar") ? "📦" :
                     r.inbound_shipment_status?.toLowerCase().includes("aduana") ? "🛃" : "📋";
  return `| ${r.po_number} | ${r.inbound_shipment_number} | ${statusIcon} ${r.inbound_shipment_status || "-"} | ${(r.item_name || r.item_id || "N/A").substring(0, 25)} | ${r.quantity_inbound} und. | ${fmtDate(r.expected_delivery_date)} | ${fmtDate(r.available_for_sale_date)} |`;
}).join("\n")}`;

  const answerText = dict.s001_summary
    .replace("{{count}}", rows.length)
    .replace("{{total_qty}}", totalQty.toLocaleString("es-AR"))
    + `\n\n${generalDict.connectors.list_intro}\n\n${mdTable}\n\n`
    + (sinFecha > 0
      ? `> ⚠️ **${sinFecha} embarque(s) sin fecha de entrega confirmada.** Recomiendo contactar directamente al proveedor para obtener una fecha firme antes de comprometer stock con clientes.\n\n`
      : `> ✅ Todos los embarques tienen fecha de entrega confirmada.\n\n`)
    + `${generalDict.connectors.action_prompt}`;

  return {
    answer: answerText,
    data: rows,
    suggestedQuestions: [
      "¿Qué OCs están en riesgo de no llegar a tiempo?",
      "Mostrar solo embarques sin fecha confirmada",
      "Revisar quiebre de stock por ítem",
      "Mostrar riesgo por cliente deudor",
    ],
  };
}

module.exports = {
  handleSupplyQuery,
};
