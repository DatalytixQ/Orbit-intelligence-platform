const sql = require('./db.js'); 
async function run() { 
  try { 
    console.log("All tables:", (await sql`select table_name from information_schema.tables where table_schema='public' and table_type='BASE TABLE'`).map(c => c.table_name)); 
  } catch(e) { 
    console.error(e); 
  } finally { 
    process.exit(0); 
  } 
} 
run();
