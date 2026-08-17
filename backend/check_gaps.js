const sql = require('./db.js');
async function run() {
  const res = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND (
    table_name ILIKE '%loan%' OR 
    table_name ILIKE '%debt%' OR 
    table_name ILIKE '%crm%' OR 
    table_name ILIKE '%opportunit%' OR 
    table_name ILIKE '%pipeline%' OR 
    table_name ILIKE '%ap_%' OR 
    table_name ILIKE '%payables%'
  )`;
  console.log(res);
  process.exit(0);
}
run();
