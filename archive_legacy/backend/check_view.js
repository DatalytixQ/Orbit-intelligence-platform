const sql = require('./db.js');

async function run() {
  try {
    const views = await sql`
      SELECT table_name, view_definition 
      FROM information_schema.views 
      WHERE table_schema = 'public' 
        AND table_name LIKE '%kpi_ventas_mensuales%'
    `;
    console.log(views);
    
    // Also check materialized views
    const matViews = await sql`
      SELECT matviewname, definition 
      FROM pg_matviews 
      WHERE schemaname = 'public'
    `;
    console.log('Materialized Views:', matViews.map(v => v.matviewname));
    
  } catch(e) {
    console.error(e);
  }
  process.exit();
}
run();
