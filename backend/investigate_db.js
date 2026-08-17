require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });
const postgres = require('postgres');
const sql = postgres(process.env.DATABASE_URL);

(async () => {
  try {
    // 1. Check if stg_customers_clean is a view or table
    const isView = await sql`
      SELECT table_name FROM information_schema.views 
      WHERE table_name = 'stg_customers_clean' AND table_schema = 'public'`;
    console.log('stg_customers_clean is a VIEW:', isView.length > 0);

    // 2. Columns of stg_customers_clean
    const cols = await sql`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'stg_customers_clean' AND table_schema = 'public'`;
    console.log('stg_customers_clean columns:', cols.map(r => r.column_name));

    // 3. Find all views that reference raw_netsuite_customers
    const refs = await sql`
      SELECT table_name, view_definition 
      FROM information_schema.views 
      WHERE table_schema = 'public' 
        AND view_definition ILIKE '%raw_netsuite_customers%'`;
    console.log('Views using raw_netsuite_customers:', refs.map(r => r.table_name));

    // 4. Find all views that reference stg_customers_clean
    const stgRefs = await sql`
      SELECT table_name FROM information_schema.views 
      WHERE table_schema = 'public' 
        AND view_definition ILIKE '%stg_customers_clean%'`;
    console.log('Views using stg_customers_clean:', stgRefs.map(r => r.table_name));

    // 5. List Spanish views
    const spanishViews = await sql`
      SELECT table_name FROM information_schema.views 
      WHERE table_schema = 'public' 
        AND (
          table_name LIKE '%ventas%' OR table_name LIKE '%clientes%' OR 
          table_name LIKE '%facturas%' OR table_name LIKE '%subsidiaria%' OR 
          table_name LIKE '%stock%' OR table_name LIKE '%valorizacion%' OR
          table_name LIKE '%inventario%'
        ) ORDER BY table_name`;
    console.log('\nSPANISH VIEWS:', JSON.stringify(spanishViews.map(r => r.table_name)));

    // 6. Check which tables are empty (0 rows)
    const emptyTables = await sql`
      SELECT relname as table_name, reltuples::bigint as rows
      FROM pg_class 
      WHERE relkind = 'r' 
        AND relnamespace = 'public'::regnamespace
        AND reltuples = 0
      ORDER BY relname`;
    console.log('\nEMPTY TABLES (0 rows):', emptyTables.map(r => r.table_name));

    // 7. Sales table columns
    const salesCols = await sql`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'sales' AND table_schema = 'public' ORDER BY ordinal_position`;
    console.log('\nSALES table columns:', salesCols.map(r => r.column_name));

  } catch(e) {
    console.error('ERROR:', e.message);
  } finally {
    await sql.end();
  }
})();
