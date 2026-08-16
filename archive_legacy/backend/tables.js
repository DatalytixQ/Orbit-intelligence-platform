const sql = require('./db');
sql`SELECT table_name FROM information_schema.tables WHERE table_schema='public'`.then(res => {
  console.log(res.map(r => r.table_name).join('\n'));
  process.exit(0);
}).catch(console.error);
