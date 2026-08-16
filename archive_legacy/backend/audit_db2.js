require('dotenv').config();
const sql = require('./db.js');
const fs = require('fs');

async function run() {
  try {
    const data = {};

    // Tables
    const tables = await sql`
      SELECT t.table_name, t.table_type, 
             (SELECT count(*) FROM information_schema.columns c WHERE c.table_name = t.table_name) as cols
      FROM information_schema.tables t
      WHERE t.table_schema = 'public' 
      ORDER BY t.table_name
    `;
    data.tables = tables;

    // Mat Views
    const matviews = await sql`SELECT matviewname FROM pg_matviews WHERE schemaname = 'public'`;
    data.matviews = matviews;

    // Policies (RLS)
    const policies = await sql`
      SELECT tablename, policyname, cmd, roles, qual, with_check 
      FROM pg_policies 
      WHERE schemaname = 'public'
    `;
    data.policies = policies;

    // Triggers
    const triggers = await sql`
      SELECT event_object_table, trigger_name, event_manipulation, action_statement
      FROM information_schema.triggers
      WHERE trigger_schema = 'public'
    `;
    data.triggers = triggers;

    // Functions (Exclude pgTap stuff if too many, but let's grab them all first)
    const funcs = await sql`
      SELECT routine_name 
      FROM information_schema.routines 
      WHERE routine_schema = 'public' AND routine_type = 'FUNCTION'
    `;
    data.funcs = funcs;

    fs.writeFileSync('db_audit.json', JSON.stringify(data, null, 2));
    console.log('Saved db_audit.json');

  } catch(e) {
    console.error(e.message);
  }
  process.exit(0);
}
run();
