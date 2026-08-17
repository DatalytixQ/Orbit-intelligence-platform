const sql = require('../db.js');

async function executeRefresh(fnName) {
  const start = Date.now();
  try {
    console.log(`Executing ${fnName}...`);
    await sql.unsafe(`SELECT ${fnName}()`);
    const duration = Date.now() - start;
    console.log(`✔ ${fnName} completed in ${duration}ms`);
    return { step: fnName, status: 'SUCCESS', durationMs: duration };
  } catch(e) {
    const duration = Date.now() - start;
    console.error(`✖ ${fnName} failed in ${duration}ms:`, e.message);
    return { step: fnName, status: 'ERROR', error: e.message, durationMs: duration };
  }
}

async function run() {
  console.log("=== Starting Full Data Warehouse Normalization Pipeline ===\n");
  const report = [];

  const functionsToRun = [
    // 1. Refresh Staging Tables (Raw -> Stg)
    'refresh_stg_items_master_clean',
    'refresh_stg_sales_clean',
    'refresh_stg_sales_lines_clean',
    'refresh_stg_inventory_clean',
    'refresh_stg_inventory_transactions_clean',
    'refresh_stg_inbound_shipments_clean',
    'refresh_stg_ar_open_items_clean',
    'refresh_stg_customer_payments_clean',
    
    // 2. Refresh Fact/Dimension Tables (Stg -> Final)
    'refresh_sales_actuals',
    'refresh_ar_actuals',
    'refresh_open_sales_order_demand',
    
    // 3. Refresh Snapshots / Intelligence
    'refresh_inventory_supply_snapshot',
    'refresh_inventory_supply_intelligence',
    'refresh_finance_snapshots'
  ];

  for (const fn of functionsToRun) {
    const result = await executeRefresh(fn);
    report.push(result);
  }

  console.log("\n=== Normalization Pipeline Report ===");
  console.table(report.map(r => ({
    Step: r.step,
    Status: r.status,
    'Duration (ms)': r.durationMs,
    Error: r.error || '-'
  })));

  process.exit(0);
}

run();
