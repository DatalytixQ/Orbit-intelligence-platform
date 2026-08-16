const sql = require('./db');

async function main() {
  const tables = await sql`
    SELECT table_name, table_type 
    FROM information_schema.tables 
    WHERE table_schema='public'
  `;
  console.log('TABLES/VIEWS:');
  tables.forEach(t => console.log(`${t.table_type}: ${t.table_name}`));
  process.exit(0);
}
main();
