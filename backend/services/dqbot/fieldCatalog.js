const RULE_FIELD_CATALOG = {
  // === INVENTARIO ===
  // I001: Quiebre Inminente de Stock (stock < demanda × lead_time)
  I001: {
    source: "public.kpi_inventory_top_critical_items",
    defaultLimit: 20,
    defaultOrderBy: "inventory_value",
    fields: {
      id: "item_id",
      nombre: "item_name",
      categoria: "item_class",
      stock: "stock_available",
      demanda: "avg_monthly_qty_3m",
      cobertura: "stock_coverage_months",
      lead_time: "lead_time_days",
      valor: "inventory_value",
      estado: "coverage_status",
    },
  },

  // I003: Capital Inmovilizado / Slow Moving
  I003: {
    source: "public.vw_rule_e003_detail",
    defaultLimit: 20,
    defaultOrderBy: "capital_inmovilizado",
    fields: {
      id: "item_id",
      nombre: "item_name",
      capital: "capital_inmovilizado",
      riesgo: "severidad",
      accion: "recomendacion",
    },
  },

  // === VENTAS ===
  V002: {
    source: "public.vw_rule_v002_detail",
    defaultLimit: 20,
    defaultOrderBy: "gap_amount",
    fields: {
      id: "client_id",
      sku: "client_id",
      nombre: "client_id",
      vendedor: "client_id",
      forecast: "forecast_ars",
      real: "sales_actual",
      desviacion: "gap_amount",
      desviacion_pct: "gap_pct",
      riesgo: "risk_level",
    },
  },
  V001: {
    source: "public.vw_rule_v001_detail",
    defaultLimit: 20,
    defaultOrderBy: "cumplimiento_pct",
    fields: {
      id: "item_id",
      sku: "item_sku",
      nombre: "item_name",
      vendedor: "sales_rep",
      forecast: "forecast_amount",
      real: "actual_amount",
      cumplimiento_pct: "cumplimiento_pct",
      riesgo: "risk_level",
    },
  },

  // === FINANZAS / CxC ===
  C001: {
    source: "public.vw_rule_c001_detail",
    defaultLimit: 20,
    defaultOrderBy: "overdue_balance",
    fields: {
      id: "customer_id",
      cliente: "customer_name",
      vendedor: "sales_rep",
      saldo_abierto: "total_open_balance",
      saldo_vencido: "overdue_balance",
      porcentaje_vencido: "overdue_percentage",
      riesgo: "severity",
    },
  },

  // === ABASTECIMIENTO ===
  // E002: Riesgo por Cliente Deudor (impacto en supply chain)
  E002: {
    source: "public.vw_rule_e002_detail",
    defaultLimit: 20,
    defaultOrderBy: "deuda_vencida",
    fields: {
      cliente: "cliente",
      deuda: "deuda_vencida",
      riesgo: "severidad",
      accion: "recomendacion",
    },
  },

  // S001: Cronograma de Embarques / Inbound
  S001: {
    source: "public.inbound_shipments_normalized",
    defaultLimit: 20,
    defaultOrderBy: "po_number",
    fields: {
      oc: "po_number",
      embarque: "inbound_shipment_number",
      estado: "inbound_shipment_status",
      cantidad: "quantity_inbound",
      fecha_envio: "expected_shipping_date",
      fecha_entrega: "expected_delivery_date",
    },
  },
};

module.exports = {
  RULE_FIELD_CATALOG,
};