const fs = require('fs');
const path = require('path');
const sql = require('./db');

async function runMigrations() {
  console.log('Starting migration runner...');
  const sqlDir = path.join(__dirname, '../sql');
  const files = fs.readdirSync(sqlDir)
    .filter(f => f.endsWith('_apply.sql'))
    .sort();

  await sql`CREATE TABLE IF NOT EXISTS _migrations (name TEXT PRIMARY KEY, applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`;

  const applied = await sql`SELECT name FROM _migrations`;
  const appliedSet = new Set(applied.map(m => m.name));

  // If table is empty but database has tables (e.g. ar_settings), assume already migrated
  const existingTables = await sql`SELECT tablename FROM pg_tables WHERE schemaname='public'`;
  if (appliedSet.size === 0 && existingTables.length > 0) {
    for (const file of files) {
      await sql`INSERT INTO _migrations (name) VALUES (${file})`;
      appliedSet.add(file);
    }
  }

  for (const file of files) {
    if (!appliedSet.has(file)) {
      console.log(`Applying migration: ${file}`);
      const content = fs.readFileSync(path.join(sqlDir, file), 'utf8');
      
      try {
        await sql.unsafe(content);
        await sql`INSERT INTO _migrations (name) VALUES (${file})`;
        console.log(`Successfully applied ${file}`);
      } catch (err) {
        console.error(`Error applying migration ${file}:`, err);
        process.exit(1);
      }
    } else {
      console.log(`Skipping applied migration: ${file}`);
    }
  }

  console.log('All migrations applied successfully.');
  process.exit(0);
}

runMigrations().catch(err => {
  console.error('Migration runner failed:', err);
  process.exit(1);
});
