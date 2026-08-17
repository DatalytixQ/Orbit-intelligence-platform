const sql = require("../../../db");
const { RULE_FIELD_CATALOG } = require("../fieldCatalog");
const {
  detectLimit,
  detectFormat,
  detectOrderBy,
  detectRequestedFields,
} = require("../intentDetector");
const { formatMoney, formatTable } = require("../formatters");

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
      answer: "Agrupé el cumplimiento de forecast V001 por vendedor, priorizado por el menor cumplimiento promedio.",
      data: rows,
      suggestedQuestions: [
        "Mostrar el detalle de items del vendedor con menor cumplimiento",
        "Ordenar items por forecast original",
        "Mostrar sku, nombre, forecast y real en tabla",
      ],
    };
  }

  const rows = await sql.unsafe(`
    select ${queryFields.join(", ")}
    from ${catalog.source}
    order by ${orderBy} asc
    limit ${limit}
  `);

  const totalForecast = rows.reduce((acc, row) => acc + Number(row.forecast || 0), 0);
  const table = format === "table" ? `\n\n${formatTable(rows, fields)}` : "";

  return {
    answer:
      `Detecté ${rows.length} registros para revisión de cumplimiento en V001. ` +
      `El conjunto mostrado representa un forecast de ${formatMoney(totalForecast)}. ` +
      `Orden aplicado: ${orderBy} (ascendente).` +
      table,
    data: rows,
    suggestedQuestions: [
      "Mostrar los 40 items con menor cumplimiento",
      "Agrupar cumplimiento por vendedor",
      "Ordenar items por cantidad de stock",
      "Mostrar sku, nombre, cumplimiento y riesgo en tabla",
    ],
  };
}

module.exports = {
  handleV001,
};
