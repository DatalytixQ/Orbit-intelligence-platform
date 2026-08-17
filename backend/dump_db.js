const sql = require('./db');
const fs = require('fs');

async function run() {
  try {
    const tablesRes = await sql`
      SELECT table_name, table_type 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_type, table_name
    `;

    let output = "# Database Structure Dump\n\n";

    for (let t of tablesRes) {
      output += `## ${t.table_type}: ${t.table_name}\n`;
      const cols = await sql`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = ${t.table_name}
      `;
      output += cols.map(c => `- ${c.column_name} (${c.data_type})`).join('\n') + '\n\n';
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
