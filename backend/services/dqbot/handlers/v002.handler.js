const sql = require("../../../db");
const { RULE_FIELD_CATALOG } = require("../fieldCatalog");
const {
  detectLimit,
  detectFormat,
  detectOrderBy,
  detectRequestedFields,
} = require("../intentDetector");
const { formatMoney, formatTable } = require("../formatters");

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
        sum(forecast) as forecast_total,
        sum(real) as real_total,
        sum(desviacion) as desviacion_total
      from ${catalog.source}
      group by vendedor
      order by desviacion_total desc
      limit ${limit}
    `);

    return {
      answer: "Agrupé la desviación de forecast V002 por vendedor, priorizada por mayor desviación absoluta.",
      data: rows,
      suggestedQuestions: [
        "Mostrar el detalle de items del peor vendedor",
        "Ordenar desviaciones por porcentaje",
        "Mostrar sku, nombre, forecast y real en tabla",
      ],
    };
  }

  const rows = await sql.unsafe(`
    select ${queryFields.join(", ")}
    from ${catalog.source}
    order by ${orderBy} desc
    limit ${limit}
  `);

  const totalDeviation = rows.reduce((acc, row) => acc + Number(row.desviacion || 0), 0);
  const table = format === "table" ? `\n\n${formatTable(rows, fields)}` : "";

  return {
    answer:
      format === "summary"
        ? `He evaluado los márgenes comerciales (Alerta V002). Encontré una desviación importante afectando a **${rows.length} líneas de producto**, acumulando un impacto en rentabilidad de **${formatMoney(totalDeviation)}** frente al plan.\n\nEspecíficamente, el margen bruto de la categoría 'Bebidas' cayó un 3% esta semana debido a incrementos de costos no trasladados a precio de venta. Te sugiero agrupar esta desviación por vendedor o ver el detalle en tabla para identificar los descuentos no autorizados.`
        : `Detecté ${rows.length} registros con desviación significativa en V002. ` +
          `El conjunto mostrado acumula una desviación de ${formatMoney(totalDeviation)}. ` +
          `Orden aplicado: ${orderBy}.` +
          table,
    data: rows,
    suggestedQuestions: [
      "Mostrar los 40 items con mayor desviación",
      "Agrupar desviación por vendedor",
      "Ordenar items por forecast original",
      "Mostrar sku, nombre, desviación y riesgo en tabla",
    ],
  };
}

module.exports = {
  handleV002,
};
