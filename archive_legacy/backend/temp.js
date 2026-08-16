const sql = require('./db');
sql`select definition from pg_views where viewname = 'kpi_inventory_critical_stock'`.then(res => {
  console.log(res[0] ? res[0].definition : "View not found");
  process.exit(0);
}).catch(console.error);
