const sql = require('./db.js');
async function run() {
  const result = await sql`
    SELECT routine_definition, routine_name
    FROM information_schema.routines 
    WHERE routine_schema = 'public' 
      AND routine_definition LIKE '%INSERT INTO%sales_lines%'
  `;
  console.log('Routines inserting to sales_lines:', result.map(r => r.routine_name));
  process.exit(0);
}
run();
