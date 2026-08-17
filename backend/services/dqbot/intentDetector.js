function normalize(text = "") {
  return String(text)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function detectRule(question = "") {
  const q = normalize(question);

  // === SHORT CIRCUIT PARA PREGUNTAS ESPECÍFICAS O DYNAMIC SQL ===
  if (
    q.includes("ordenes de venta abiertas") ||
    q.includes("ov en riesgo")
  ) {
    return null; // Forzar Semantic Router / Dynamic SQL
  }

  // === INVENTARIO ===
  // I001: Quiebre inminente
  if (
    q.includes("i001") ||
    q.includes("quiebre") ||
    q.includes("ruptura") ||
    q.includes("agotamiento") ||
    q.includes("stock insuficiente") ||
    q.includes("cobertura insuficiente") ||
    q.includes("riesgo inminente")
  ) {
    return "I001";
  }

  // I002: Cobertura vs Lead Time
  if (
    q.includes("i002") ||
    q.includes("cobertura vs lead time") ||
    q.includes("arribo de compras") ||
    q.includes("llegara a tiempo la oc") ||
    q.includes("retraso de oc")
  ) {
    return "I002";
  }

  // I003: Capital inmovilizado / slow moving
  if (
    q.includes("i003") ||
    q.includes("inmovilizado") ||
    q.includes("slow moving") ||
    q.includes("sin rotacion") ||
    q.includes("capital inmovilizado") ||
    q.includes("sin salidas") ||
    q.includes("inventario parado")
  ) {
    return "I003";
  }

  // I004 & I005: Capital Inmovilizado y Lost Sales
  if (
    q.includes("i004") ||
    q.includes("i005") ||
    q.includes("ventas perdidas") ||
    q.includes("lost sales") ||
    q.includes("demanda retenida") ||
    q.includes("oportunidad de financiar")
  ) {
    return "I004";
  }

  // Inventario general (sku, stock, cobertura)
  if (
    q.includes("sku") ||
    q.includes("inventario") ||
    q.includes("stock") ||
    q.includes("cobertura") ||
    q.includes("rotacion") ||
    q.includes("categoria")
  ) {
    return "I001";
  }

  // === VENTAS ===
  if (q.includes("v001") || q.includes("cumplimiento") || q.includes("logro") || q.includes("representante") || q.includes("cliente top")) return "V001";
  
  // V003: Tendencia y Estacionalidad (evaluar antes que V002 por keyword 'venta')
  if (q.includes("v003") || q.includes("tendencia") || q.includes("desaceleracion") || q.includes("estacionalidad") || q.includes("caidas atipicas")) return "V003";

  if (q.includes("v002") || q.includes("desviacion") || q.includes("forecast") || (q.includes("venta") && !q.includes("ordenes de venta") && !q.includes("perdidas") && !q.includes("tendencia")) || q.includes("comercial") || q.includes("margen") || q.includes("caida") || q.includes("proyeccion")) return "V002";
  

  // V004 & V005: Concentracion Estructural Pareto
  if (q.includes("v004") || q.includes("v005") || q.includes("concentracion") || q.includes("pareto") || q.includes("dependencia de clientes") || q.includes("concentracion de catalogo")) return "V004";

  // === FINANZAS ===
  if (q.includes("c002") || q.includes("deterioro de dso") || q.includes("cliente empeorando pagos") || q.includes("tendencia de pago")) return "C002";
  if (q.includes("c003") || q.includes("c004") || q.includes("forecast de cobranza") || q.includes("flujo de caja proyectado") || q.includes("cuanto vamos a cobrar")) return "C003";
  if (q.includes("c005") || q.includes("facturas criticas") || q.includes("a quien llamar hoy") || q.includes("prioridad de cobranza")) return "C005";
  if (q.includes("c001") || q.includes("clientes criticos") || q.includes("cliente critico") || q.includes("dso") || q.includes("cobranza") || q.includes("cxc") || q.includes("vencido") || q.includes("mora") || q.includes("crediticia") || q.includes("saldo critico") || q.includes("regularizacion") || q.includes("concentracion de deuda") || q.includes("exposicion de saldo") || q.includes("deterioro") || (q.includes("deuda") && !q.includes("deuda supply") && !q.includes("cliente deudor"))) return "C001";


  // === ABASTECIMIENTO ===
  // E002: Riesgo por cliente deudor en supply
  if (
    q.includes("e002") ||
    q.includes("riesgo por cliente") ||
    q.includes("cliente deudor") ||
    q.includes("deuda supply") ||
    q.includes("bloqueo despacho") ||
    q.includes("bloquear")
  ) {
    return "E002";
  }

  // S001: Embarques, cronograma, OCs en tránsito
  if (
    q.includes("s001") ||
    q.includes("abastecimiento") ||
    q.includes("lead time") ||
    q.includes("proveedor") ||
    q.includes("embarque") ||
    q.includes("cronograma") ||
    q.includes("arribo") ||
    q.includes("en transito") ||
    q.includes("orden de compra") ||
    q.includes("oc ")
  ) {
    return "S001";
  }

  return null;
}

function detectLimit(question = "", defaultLimit = 20) {
  const q = normalize(question);
  if (q.includes("todos") || q.includes("completo")) return 100;

  const match = q.match(/\b(\d{1,3})\b/);
  if (match) return Math.min(Number(match[1]), 100);

  return defaultLimit;
}

function detectFormat(question = "") {
  const q = normalize(question);
  if (q.startsWith("explorar:") || q.startsWith("explorar alerta") || q.startsWith("analizar")) return "summary";
  if (q.includes("tabla") || q.includes("tabular")) return "table";
  if (q.includes("agrupa") || q.includes("categoria") || q.includes("vendedor") || q.includes("riesgo") || q.includes("cliente")) return "grouped";
  return "summary";
}

function detectOrderBy(question = "", catalog) {
  const q = normalize(question);

  if (q.includes("cantidad") || q.includes("stock")) return catalog.fields.stock || catalog.defaultOrderBy;
  if (q.includes("score") || q.includes("riesgo")) return catalog.fields.score || catalog.fields.riesgo || catalog.defaultOrderBy;
  if (q.includes("categoria")) return catalog.fields.categoria || catalog.defaultOrderBy;
  if (q.includes("valor") || q.includes("monto") || q.includes("saldo")) return catalog.fields.valor || catalog.fields.saldo_vencido || catalog.defaultOrderBy;
  if (q.includes("cumplimiento")) return catalog.fields.cumplimiento_pct || catalog.defaultOrderBy;
  if (q.includes("desviacion")) return catalog.fields.desviacion || catalog.defaultOrderBy;
  if (q.includes("forecast")) return catalog.fields.forecast || catalog.defaultOrderBy;
  if (q.includes("real")) return catalog.fields.real || catalog.defaultOrderBy;
  if (q.includes("vencido") || q.includes("mora")) return catalog.fields.saldo_vencido || catalog.fields.porcentaje_vencido || catalog.defaultOrderBy;
  if (q.includes("capital") || q.includes("inmovilizado")) return catalog.fields.capital || catalog.defaultOrderBy;

  return catalog.defaultOrderBy;
}

function detectRequestedFields(question = "", catalog) {
  const q = normalize(question);
  const selected = [];

  Object.entries(catalog.fields).forEach(([alias, column]) => {
    if (q.includes(alias) && !selected.includes(column)) {
      selected.push(column);
    }
  });

  if (selected.length > 0) return selected;

  return Object.values(catalog.fields).filter(Boolean);
}

module.exports = {
  detectRule,
  detectLimit,
  detectFormat,
  detectOrderBy,
  detectRequestedFields,
};