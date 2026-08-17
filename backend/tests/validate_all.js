const sql = require('../db.js');

async function run() {
  console.log("=== INVENTORY VALIDATION ===");

  try {
    // 1. Count and Value check: raw_inventory vs stg_inventory_clean
    const rawRes = await sql`SELECT SUM(CAST(quantity_on_hand AS NUMERIC)) as raw_qty FROM raw_inventory`;
    const stgRes = await sql`SELECT SUM(quantity_on_hand) as stg_qty FROM stg_inventory_clean`;
    
    console.log(`Raw Quantity: ${rawRes[0].raw_qty}`);
    console.log(`Stg Quantity: ${stgRes[0].stg_qty}`);
    console.log(`Match? ${rawRes[0].raw_qty == stgRes[0].stg_qty ? 'YES' : 'NO'}`);

    // 2. Orphan check
    // 2. Orphan check
    const orphans = await sql`
      SELECT COUNT(*) as orphan_count 
      FROM stg_inventory_clean stg
      LEFT JOIN items_master im ON stg.item_internal_id = im.item_id
      WHERE im.item_id IS NULL
    `;
    console.log(`Orphan items in inventory: ${orphans[0].orphan_count}`);

    console.log("\n=== ACCOUNTS RECEIVABLE VALIDATION ===");
    // Finance AR validation
    const rawAr = await sql`SELECT SUM(CAST(open_balance AS NUMERIC)) as raw_balance FROM raw_ar_open_items`;
    const stgAr = await sql`SELECT SUM(open_balance) as stg_balance FROM stg_ar_open_items_clean`;
    const finalAr = await sql`SELECT SUM(open_balance) as final_balance FROM finance_ar_open_items`;

    console.log(`Raw Open Balance: ${rawAr[0].raw_balance}`);
    console.log(`Stg Open Balance: ${stgAr[0].stg_balance}`);
    console.log(`Final Open Balance: ${finalAr[0].final_balance}`);

    // Finance Orphan check
    const orphansAr = await sql`
      SELECT COUNT(*) as orphan_count 
      FROM stg_ar_open_items_clean stg
      LEFT JOIN customers c ON stg.customer_id = c.customer_internal_id
      WHERE c.customer_internal_id IS NULL AND stg.customer_id IS NOT NULL
    `;
    console.log(`Orphan customers in AR: ${orphansAr[0].orphan_count}`);

  } catch(e) {
    console.error("Validation error:", e);
  }
  process.exit(0);
}
run();
