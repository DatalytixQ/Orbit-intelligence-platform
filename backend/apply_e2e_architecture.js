const sql = require('./db.js');

async function run() {
  console.log("Dropping old tables...");
  await sql`DROP TABLE IF EXISTS public.raw_sales_lines CASCADE`;
  await sql`DROP TABLE IF EXISTS public.raw_open_sales_orders CASCADE`;
  await sql`DROP TABLE IF EXISTS public.raw_customers CASCADE`;
  await sql`DROP TABLE IF EXISTS public.raw_sales CASCADE`; // Just in case

  console.log("Creating new RAW_NS_CUSTOMERS...");
  await sql`
    CREATE TABLE public.raw_ns_customers (
      customer_id TEXT PRIMARY KEY,
      companyname TEXT,
      subsidiary_id TEXT,
      last_modified_ts TIMESTAMP,
      snapshot_ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      source_system TEXT,
      client_id TEXT
    );
  `;

  console.log("Creating new RAW_NS_TRANSACTIONS...");
  await sql`
    CREATE TABLE public.raw_ns_transactions (
      transaction_id TEXT PRIMARY KEY,
      tranid TEXT,
      trandate DATE,
      posting_period_id TEXT,
      type TEXT,
      status TEXT,
      entity_id TEXT,
      subsidiary_id TEXT,
      currency_id TEXT,
      exchange_rate NUMERIC,
      last_modified_ts TIMESTAMP,
      snapshot_ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      source_system TEXT,
      client_id TEXT
    );
  `;

  console.log("Creating new RAW_NS_TRANSACTION_LINES...");
  await sql`
    CREATE TABLE public.raw_ns_transaction_lines (
      transaction_id TEXT,
      line_id TEXT,
      item_id TEXT,
      account_id TEXT,
      department_id TEXT,
      class_id TEXT,
      location_id TEXT,
      quantity NUMERIC,
      rate NUMERIC,
      netamount NUMERIC,
      last_modified_ts TIMESTAMP,
      snapshot_ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      source_system TEXT,
      client_id TEXT,
      PRIMARY KEY (transaction_id, line_id)
    );
  `;

  console.log("Database E2E architecture created successfully.");
  process.exit(0);
}
run();
