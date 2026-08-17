const fs = require('fs');
const path = require('path');
const sql = require('./db');

async function run() {
  try {
    const sqlContent = fs.readFileSync(path.join(__dirname, '../sql/n044_multitenant_hardening_apply.sql'), 'utf8');
    await sql.unsafe(sqlContent);
    console.log('Successfully applied n044');
    
    // Check if _migrations table has it, if not insert it so it doesn't run again.
    try {
        await sql`INSERT INTO _migrations (name) VALUES ('n044_multitenant_hardening_apply.sql') ON CONFLICT DO NOTHING`;
    } catch(e) { }
  } catch (err) {
    console.error('Error applying n044:', err);
  } finally {
    sql.end();
  }
}
run();
