require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });
const postgres = require('postgres');
const sql = postgres(process.env.DATABASE_URL);

(async () => {
  try {
    // Actual row counts (force accurate count for raw_ns_ tables)
    const rawTables = [
      'raw_ns_accounts', 'raw_ns_currencies', 'raw_ns_exchange_rates',
      'raw_ns_subsidiaries', 'raw_ns_locations', 'raw_ns_items',
      'raw_ns_customers', 'raw_ns_transactions', 'raw_ns_transaction_lines',
      'raw_ns_ap_open_items', 'raw_ns_journal_entries', 'raw_ns_sales_reps',
      // Legacy raw tables
      'raw_ar_open_items', 'raw_customer_payments', 'raw_inventory',
      'raw_inventory_transactions', 'raw_items_master', 'raw_item_bom',
      'raw_inbound_shipments',
      // STG
      'stg_ar_open_items_clean', 'stg_customer_payments_clean',
      'stg_customers_clean', 'stg_inventory_clean', 'stg_items_master_clean',
      'stg_sales_clean', 'stg_sales_lines_clean',
      // DM / Business
      'sales', 'sales_lines', 'sales_semantic_current'
    ];

    console.log('\n=== RAW TABLES STATUS (actual row counts) ===');
    for (const tbl of rawTables) {
      try {
        const res = await sql`SELECT COUNT(*) as cnt FROM ${sql(tbl)}`;
        const cnt = parseInt(res[0].cnt);
        const status = cnt > 0 ? 'POPULATED' : 'EMPTY';
        console.log(`  ${tbl.padEnd(40)} | ${cnt.toString().padStart(8)} rows | ${status}`);
      } catch(e) {
        console.log(`  ${tbl.padEnd(40)} | TABLE NOT FOUND`);
      }
    }

    // DM views check
    console.log('\n=== DM DIMENSION VIEWS ===');
    const dmViews = [
      'dm_dim_accounts', 'dm_dim_currencies', 'dm_dim_exchange_rates',
      'dm_dim_locations', 'dm_dim_subsidiaries', 'dm_dim_items',
      'dm_dim_customers', 'dm_dim_employees', 'dm_dim_sales_reps'
    ];
    for (const v of dmViews) {
      try {
        const res = await sql`SELECT COUNT(*) as cnt FROM ${sql(v)}`;
        console.log(`  ${v.padEnd(35)} | ${res[0].cnt.toString().padStart(8)} rows`);
      } catch(e) {
        console.log(`  ${v.padEnd(35)} | ERROR: ${e.message.slice(0,50)}`);
      }
    }

  } catch(e) {
    console.error('ERROR:', e.message);
  } finally {
    await sql.end();
  }
})();
