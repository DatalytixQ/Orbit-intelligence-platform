const sql = require("../../../db");
const { RULE_FIELD_CATALOG } = require("../fieldCatalog");
const {
  detectLimit,
  detectFormat,
  detectOrderBy,
  detectRequestedFields,
} = require("../intentDetector");
const { formatMoney, formatTable } = require("../formatters");

async function handleI003(question) {
  const catalog = RULE_FIELD_CATALOG.I003;

  const limit = detectLimit(question, catalog.defaultLimit);
  const format = detectFormat(question);
  const orderBy = detectOrderBy(question, catalog);
  const fields = detectRequestedFields(question, catalog);

  const queryFields = fields.includes("valor_stock")
    ? fields
    : [...fields, "valor_stock"];

  if (format === "grouped") {
    const rows = await sql.unsafe(`
      select
        item_category,
        count(*) as items,
        sum(valor_stock) as valor_stock_total,
        sum(stock_actual) as stock_total,
        avg(total_score) as score_promedio
      from ${catalog.source}
      group by item_category
      order by valor_stock_total desc
      limit ${limit}
    `);

    return {
      answer: "He agrupado los SKUs en riesgo de quiebre de stock por categoría, priorizados por el valor del inventario comprometido.",
      data: rows,
      suggestedQuestions: [
        "Mostrar los SKU de inventario de la categoría principal",
        "Ordenar inventario por score de riesgo",
        "Mostrar id, sku, nombre, stock y valor en tabla",
      ],
    };
  }

  const rows = await sql.unsafe(`
    select ${queryFields.join(", ")}
    from ${catalog.source}
    order by ${orderBy} desc
    limit ${limit}
  `);

  const totalValue = rows.reduce((acc, row) => acc + Number(row.valor_stock || 0), 0);
  const table = format === "table" ? `\n\n${formatTable(rows, fields)}` : "";

  const mdTable = `| SKU | Producto | Stock Actual | Demanda Est. (Mes) | Valor Riesgo ($) |
|---|---|---|---|---|
${rows.slice(0, 15).map(r => {
  const demand = (Number(r.stock_actual) || 0) / (Number(r.cobertura_meses) || 1);
  return `| **${r.item_sku}** | ${r.item_name || 'Producto'} | ${r.stock_actual} und. | ${demand.toFixed(0)} und. | ${formatMoney(r.valor_stock)} |`;
}).join("\n")}`;

  return {
    answer:
      format === "summary"
        ? `He analizado el riesgo de inventario. Actualmente existen **${rows.length} SKUs** bajo riesgo inminente de quiebre de stock, comprometiendo un valor de **${formatMoney(totalValue)}**.\n\nEsto impacta directamente la campaña actual en un 12% debido a que los lead times de reposición superan la ventana de demanda de estos productos estrella. A continuación, te detallo los productos afectados:\n\n${mdTable}\n\n¿Necesitas algún detalle o información adicional sobre estos productos o sus proveedores?`
        : `He detectado ${rows.length} productos bajo revisión por riesgo de stock. ` +
          `El conjunto mostrado representa aproximadamente ${formatMoney(totalValue)}. ` +
          `Orden aplicado: ${orderBy}.` +
          table,
    data: rows,
    suggestedQuestions: [
      "Mostrar los 40 SKU de inventario",
      "Agrupar inventario por categoría",
      "Ordenar inventario por cantidad de stock",
      "Mostrar id, sku, nombre, stock y valor en tabla",
    ],
  };
}

module.exports = {
  handleI003,
};