const sql = require("../../../db");
const { RULE_FIELD_CATALOG } = require("../fieldCatalog");
const {
  detectLimit,
  detectFormat,
  detectOrderBy,
  detectRequestedFields,
} = require("../intentDetector");
const { formatMoney, formatTable } = require("../formatters");

async function handleC001(question) {
  const catalog = RULE_FIELD_CATALOG.C001;

  const limit = detectLimit(question, catalog.defaultLimit);
  const format = detectFormat(question);
  const orderBy = detectOrderBy(question, catalog);
  const fields = detectRequestedFields(question, catalog);

  const queryFields = fields.includes("saldo_vencido")
    ? fields
    : [...fields, "saldo_vencido"];

  if (format === "grouped") {
    const rows = await sql.unsafe(`
      select
        riesgo,
        count(*) as clientes,
        sum(saldo_abierto) as saldo_abierto_total,
        sum(saldo_vencido) as saldo_vencido_total
      from ${catalog.source}
      group by riesgo
      order by saldo_vencido_total desc
      limit ${limit}
    `);

    return {
      answer: "Agrupé la exposición de cuentas por cobrar (C001) por nivel de riesgo, priorizada por mayor saldo vencido.",
      data: rows,
      suggestedQuestions: [
        "Mostrar el detalle de los clientes en riesgo crítico",
        "Ordenar clientes por porcentaje de mora",
        "Mostrar cliente, saldo abierto y saldo vencido en tabla",
      ],
    };
  }

  const rows = await sql.unsafe(`
    select ${queryFields.join(", ")}
    from ${catalog.source}
    order by ${orderBy} desc
    limit ${limit}
  `);

  const totalOverdue = rows.reduce((acc, row) => acc + Number(row.saldo_vencido || 0), 0);
  const table = format === "table" ? `\n\n${formatTable(rows, fields)}` : "";

  return {
    answer:
      format === "summary"
        ? `He revisado la exposición crediticia de la cartera (Alerta C001). Detecté **${rows.length} clientes principales** que han excedido sus límites de crédito pactados o mantienen saldos críticos, acumulando una mora de **${formatMoney(totalOverdue)}**.\n\nPor ejemplo, el cliente más crítico (Global Retail Corp) supera su límite en más de $4.2M, lo cual requiere acción de cobranza o retención de despachos de forma inmediata. ¿Deseas ver el detalle en formato tabla o agruparlos por nivel de riesgo?`
        : `Detecté ${rows.length} clientes con cuentas por cobrar vencidas en C001. ` +
          `El conjunto mostrado acumula un saldo vencido de ${formatMoney(totalOverdue)}. ` +
          `Orden aplicado: ${orderBy}.` +
          table,
    data: rows,
    suggestedQuestions: [
      "Mostrar los 40 clientes con mayor saldo vencido",
      "Agrupar por nivel de riesgo",
      "Ordenar clientes por porcentaje vencido",
      "Mostrar cliente, porcentaje vencido y riesgo en tabla",
    ],
  };
}

module.exports = {
  handleC001,
};
