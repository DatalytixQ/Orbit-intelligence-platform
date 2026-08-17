const sql = require('./db');
async function run() {
  try {
    const s1 = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`;
    console.log("tables:", s1.map(x=>x.table_name).filter(name => name.includes('vendor') || name.includes('prov') || name.includes('loc')));
  } finally {
    sql.end();
  }
}
run();
