const sql = require('./db');
sql`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'inbound_shipments'`.then(res => {
  console.log("== inbound_shipments ==");
  console.log(res);
  process.exit(0);
}).catch(console.error);
