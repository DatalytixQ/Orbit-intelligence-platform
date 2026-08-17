const SCHEMA = {
  inventory: {
    raw_table: 'raw_inventory',
    stg_table: 'stg_inventory_clean',
    required_cols: ['source_system','client_id','snapshot_ts','item_id','quantity_on_hand','quantity_available'],
    optional_cols: ['location','subsidiary','stock_status','average_cost'],
    col_remap: { item_internal_id: 'item_id', item_name: 'item_name' },
    refreshes: ['kpi_inventory_item_snapshot', 'kpi_inventory_coverage']
  },
  sales: {
    raw_table: 'raw_sales',
    stg_table: 'stg_sales_clean',
    required_cols: ['source_system','client_id','snapshot_ts','invoice_internal_id','customer_id','invoice_date'],
    optional_cols: ['document_number','due_date','posting_period','document_type','document_status','currency_id','exchange_rate','subsidiary_id','payment_terms','amount_total','amount_tax','amount_net','amount_paid','open_balance','last_modified_ts','imported_at'],
    col_remap: {},
    refreshes: ['kpi_sales_summary']
  },
  sales_lines: {
    raw_table: 'raw_sales_lines',
    stg_table: 'stg_sales_lines_clean',
    required_cols: ['source_system','client_id','snapshot_ts','invoice_id','item_id','quantity','line_net_amount'],
    optional_cols: ['document_number','line_id','invoice_date','posting_period','transaction_type','customer_id','subsidiary_id','location_id','exchange_rate','unit_price','unit_price_net','line_discount_amount','line_tax_amount','line_total_amount','line_net_amount_consolidated','sales_order_ref','currency_id','currency','last_modified_ts','line_estimated_cost','imported_at'],
    col_remap: {},
    refreshes: []
  },
  ar_open_items: {
    raw_table: 'raw_ar_open_items',
    stg_table: 'stg_ar_open_items_clean',
    required_cols: ['source_system','client_id','snapshot_ts','invoice_internal_id','customer_id','open_balance'],
    optional_cols: ['document_number','invoice_date','due_date','document_type','document_status','currency','exchange_rate','subsidiary_id','payment_terms','amount_total','amount_paid','days_overdue','last_modified_ts'],
    col_remap: {},
    refreshes: ['vw_rule_c001_detail']
  },
  inbound_shipments: {
    raw_table: 'raw_inbound_shipments',
    stg_table: 'stg_inbound_shipments_clean',
    required_cols: ['source_system','client_id','snapshot_ts','po_number','inbound_shipment_number','item_internal_id'],
    optional_cols: ['po_internal_id','vendor_id','inbound_shipment_status','quantity_inbound','expected_shipping_date','actual_shipping_date','expected_delivery_date','actual_delivery_date','available_for_sale_date','location_id'],
    col_remap: {},
    refreshes: ['inbound_shipments_normalized']
  },
  open_sales_orders: {
    raw_table: 'raw_open_sales_orders',
    stg_table: null,
    required_cols: ['source_system','client_id','snapshot_ts','order_internal_id','customer_id','item_internal_id'],
    optional_cols: ['document_number','transaction_date','expected_ship_date','location_id','subsidiary_id','quantity_ordered','quantity_committed','quantity_fulfilled','quantity_pending','unit_price_net','line_net_amount','estimated_total_cost','estimated_margin'],
    col_remap: { location: 'location_id', estimated_unit_cost: 'estimated_total_cost' },
    refreshes: ['kpi_inventory_coverage']
  },
  customer_payments: {
    raw_table: 'raw_customer_payments',
    stg_table: 'stg_customer_payments_clean',
    required_cols: ['source_system','client_id','snapshot_ts','payment_internal_id','customer_id','payment_amount'],
    optional_cols: ['payment_date','posting_period','payment_document_number','currency_id','exchange_rate','subsidiary_id','applied_invoice_internal_id','applied_amount','created_from','last_modified_ts'],
    col_remap: {},
    refreshes: []
  },
  inventory_transactions: {
    raw_table: 'raw_inventory_transactions',
    stg_table: 'stg_inventory_transactions_clean',
    required_cols: ['source_system','client_id','snapshot_ts','transaction_id','item_id','quantity'],
    optional_cols: ['transaction_line_id','transaction_date','transaction_type','document_number','location_id','subsidiary_id','quantity_signed','created_from_id','memo','load_ts'],
    col_remap: {},
    refreshes: []
  },
  items_master: {
    raw_table: 'raw_items_master',
    stg_table: 'stg_items_master_clean',
    required_cols: ['source_system','client_id','snapshot_ts','item_id','item_name'],
    optional_cols: ['item_sku','item_type','item_class','is_commercial','is_active','lead_time_days','item_category','item_subcategory','subsidiary_id','is_inventory_item','is_sellable','is_component','is_bom_parent','standard_cost','average_cost','purchase_unit','sales_unit','stock_unit','last_update_ts','subsidiary_name'],
    col_remap: {},
    refreshes: ['items_master_v']
  },
  customers: {
    raw_table: 'raw_customers',
    stg_table: 'stg_customers_clean',
    required_cols: ['source_system','client_id','snapshot_ts','customer_internal_id','customer_name'],
    optional_cols: ['customer_code','email','phone','is_inactive','subsidiary','currency','sales_rep','created_at','updated_at','country','state','city','subsidiary_id','currency_id','payment_terms_id','credit_limit','customer_status','last_update_ts'],
    col_remap: {},
    refreshes: []
  },
  collections: {
    raw_table: 'raw_collections',
    stg_table: null,
    required_cols: ['source_system','client_id','snapshot_ts','payment_id','customer_internal_id','applied_amount'],
    optional_cols: ['payment_date','customer_name','invoice_internal_id','document_number','currency','exchange_rate','subsidiary','payment_method','bank_account','last_update_ts'],
    col_remap: {},
    refreshes: []
  },
  fx_rates: {
    raw_table: 'raw_fx_rates',
    stg_table: null,
    required_cols: ['source_system','client_id','snapshot_ts','currency','rate'],
    optional_cols: ['date','target_currency'],
    col_remap: {},
    refreshes: []
  },
  invoices: {
    raw_table: 'raw_invoices',
    stg_table: null,
    required_cols: ['invoice_internal_id','invoice_number','customer_internal_id'],
    optional_cols: ['id','imported_at','invoice_date','posting_date','customer_name','subsidiary','status','currency','exchange_rate','amount_transaction_currency','amount_local_book','amount_usd_book','sales_order_internal_id','sales_order_number','last_modified_date'],
    col_remap: {},
    refreshes: []
  },
  item_bom: {
    raw_table: 'raw_item_bom',
    stg_table: null,
    required_cols: ['source_system','client_id','snapshot_ts','parent_item_id','component_item_id','component_qty_per_parent'],
    optional_cols: ['parent_item_name','component_item_name','bom_id','bom_revision_id','is_active','effective_start_date','effective_end_date'],
    col_remap: {},
    refreshes: []
  },
  items: {
    raw_table: 'raw_items',
    stg_table: null,
    required_cols: ['item_internal_id','item_name'],
    optional_cols: ['id','imported_at','item_display_name','item_type','item_category','is_inactive','base_unit','subsidiary','last_modified_date'],
    col_remap: {},
    refreshes: []
  },
  locations: {
    raw_table: 'raw_locations',
    stg_table: null,
    required_cols: ['location_internal_id','name'],
    optional_cols: ['subsidiary_id','is_inactive'],
    col_remap: {},
    refreshes: []
  },
  netsuite_customers: {
    raw_table: 'raw_netsuite_customers',
    stg_table: null,
    required_cols: ['internal_id','company_name'],
    optional_cols: [],
    col_remap: {},
    refreshes: []
  },
  sales_orders: {
    raw_table: 'raw_sales_orders',
    stg_table: null,
    required_cols: ['order_internal_id','document_number'],
    optional_cols: [],
    col_remap: {},
    refreshes: []
  },
  subsidiaries: {
    raw_table: 'raw_subsidiaries',
    stg_table: null,
    required_cols: ['source_system','client_id','snapshot_ts','subsidiary_id','name'],
    optional_cols: ['parent_id','currency','country'],
    col_remap: {},
    refreshes: []
  },
};

module.exports = { SCHEMA };
