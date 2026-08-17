require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });
const postgres = require('postgres');
const sql = postgres(process.env.DATABASE_URL);
const fs = require('fs');

(async () => {
  try {
    const tables = await sql`
      SELECT 
        t.table_name,
        pg_size_pretty(pg_total_relation_size(quote_ident(t.table_schema)||'.'||quote_ident(t.table_name))) as total_size,
        COALESCE((SELECT reltuples::bigint FROM pg_class WHERE relname = t.table_name AND relkind = 'r'), 0) as estimated_rows
      FROM information_schema.tables t
      WHERE t.table_schema = 'public'
        AND t.table_type = 'BASE TABLE'
      ORDER BY t.table_name
    `;

    const views = await sql`
      SELECT table_name as view_name
      FROM information_schema.views
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;

    const columns = await sql`
      SELECT table_name, column_name, data_type
      FROM information_schema.columns
      WHERE table_schema = 'public'
      ORDER BY table_name, ordinal_position
    `;

    const fks = await sql`
      SELECT
        tc.table_name AS from_table,
        kcu.column_name AS from_col,
        ccu.table_name AS to_table,
        ccu.column_name AS to_col
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name AND tc.table_schema = kcu.table_schema
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name AND ccu.table_schema = tc.table_schema
      WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_schema = 'public'
    `;

    const result = { tables, views, columns, fks };
    fs.writeFileSync('audit_raw.json', JSON.stringify(result, null, 2), 'utf8');
    console.log('Audit written to audit_raw.json');
    console.log('TABLES:', tables.length, '| VIEWS:', views.length, '| FKs:', fks.length);
    
    // Print table list for quick review
    console.log('\n=== BASE TABLES ===');
    tables.forEach(t => console.log(`  ${t.table_name.padEnd(50)} | ${t.estimated_rows.toString().padStart(8)} rows | ${t.total_size}`));
    console.log('\n=== VIEWS ===');
    views.forEach(v => console.log(`  ${v.view_name}`));
  } catch (e) {
    console.error('ERROR:', e.message);
  } finally {
    await sql.end();
  }
})();
