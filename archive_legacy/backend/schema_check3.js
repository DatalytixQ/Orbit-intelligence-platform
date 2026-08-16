const sql = require('./db');
sql`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'kpi_inventory_coverage'`.then(res => {
  console.log("== kpi_inventory_coverage ==");
  console.log(res);
  process.exit(0);
}).catch(console.error);
