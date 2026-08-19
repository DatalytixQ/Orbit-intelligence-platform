require("dotenv").config();
const sql = require("./db");

async function checkDates() {
  try {
    console.log("Checking database dates...");
    
    const [rawTx] = await sql`
      SELECT 
        MAX(trandate) as max_transaction_date,
        MAX(created_at) as last_db_insert_ts,
        MAX(last_modified_ts) as max_netsuite_modified_ts,
        COUNT(*) as total_rows
      FROM raw_ns_transactions;
    `;
    
    console.log("--- raw_ns_transactions ---");
    console.log(rawTx);

    const [factSales] = await sql`
      SELECT MAX(sale_date) as last_invoice_date 
      FROM dm_fact_sales;
    `;
    
    console.log("--- dm_fact_sales (Invoices) ---");
    console.log(factSales);

    const [factPipeline] = await sql`
      SELECT MAX(order_date) as last_sales_order_date 
      FROM dm_fact_pipeline;
    `;
    
    console.log("--- dm_fact_pipeline (Sales Orders) ---");
    console.log(factPipeline);

    const auditLog = await sql`
      SELECT module, entity, status, start_time, end_time, records_loaded, error_message
      FROM sys_etl_audit_log
      ORDER BY start_time DESC
      LIMIT 5;
    `;

    console.log("--- sys_etl_audit_log (Last 5 runs) ---");
    console.table(auditLog);

  } catch (err) {
    console.error("Error querying database:", err);
  } finally {
    process.exit(0);
  }
}

checkDates();
