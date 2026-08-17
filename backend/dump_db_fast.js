const sql = require('./db');
const fs = require('fs');

async function run() {
  try {
    const res = await sql`
      SELECT 
        c.table_name,
        t.table_type,
        json_agg(json_build_object('column_name', c.column_name, 'data_type', c.data_type)) as columns
      FROM information_schema.columns c
      JOIN information_schema.tables t ON c.table_name = t.table_name AND c.table_schema = t.table_schema
      WHERE c.table_schema = 'public'
      GROUP BY c.table_name, t.table_type
      ORDER BY t.table_type, c.table_name
    `;

    let output = "# Database Structure Dump\n\n";

    for (let row of res) {
      output += `## ${row.table_type}: ${row.table_name}\n`;
      for (let c of row.columns) {
        output += `- ${c.column_name} (${c.data_type})\n`;
      }
      output += '\n';
    }

    fs.writeFileSync('db_dump.md', output);
    console.log("Database dump saved to db_dump.md");
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
run();
