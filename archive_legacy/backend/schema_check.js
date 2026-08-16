const sql = require('./db');
Promise.all([
  sql`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'inventory_movements'`,
  sql`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'open_sales_order_demand'`
]).then(([movements, openDemand]) => {
  console.log("== inventory_movements ==");
  console.log(movements);
  console.log("== open_sales_order_demand ==");
  console.log(openDemand);
  process.exit(0);
}).catch(console.error);
