const sql = require('./db');

async function checkFilters() {
  try {
    console.log('=== SUBSIDIARIES ===');
    const subs = await sql`SELECT * FROM dm_dim_subsidiaries LIMIT 10`;
    console.log(JSON.stringify(subs, null, 2));
    
    console.log('\n=== CURRENCIES ===');
    const curr = await sql`SELECT * FROM dm_dim_currencies LIMIT 10`;
    console.log(JSON.stringify(curr, null, 2));
    
    console.log('\n=== SALES REPS ===');
    const reps = await sql`SELECT * FROM dm_dim_sales_reps LIMIT 20`;
    console.log(JSON.stringify(reps, null, 2));
    
    console.log('\n=== CHANNELS ===');
    const channels = await sql`SELECT DISTINCT COALESCE(sales_channel_id, 'Directo') as ch FROM dm_fact_sales WHERE sales_channel_id IS NOT NULL LIMIT 10`;
    console.log(JSON.stringify(channels, null, 2));

    console.log('\n=== CURRENCIES FROM TRANSACTIONS (operated) ===');
    const opCurr = await sql`SELECT DISTINCT currency_id FROM dm_fact_sales WHERE currency_id IS NOT NULL LIMIT 20`;
    console.log(JSON.stringify(opCurr, null, 2));

    console.log('\n=== LATEST SALE DATE (ETL freshness) ===');
    const latest = await sql`SELECT MAX(sale_date) as last_date, MAX(created_at) as last_etl FROM dm_fact_sales`;
    console.log(JSON.stringify(latest, null, 2));

    console.log('\n=== RAW TRANSACTIONS LATEST ===');
    const rawLatest = await sql`SELECT MAX(created_at) as last_sync FROM raw_ns_transactions`;
    console.log(JSON.stringify(rawLatest, null, 2));

  } catch (e) {
    console.error('ERROR:', e.message);
  }
  process.exit(0);
}

checkFilters();
