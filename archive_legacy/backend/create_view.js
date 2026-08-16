const db = require('./db.js');
async function run() {
  try {
    await db.unsafe("CREATE OR REPLACE VIEW public.vw_rule_v001_detail AS SELECT 'VK-500' as item_sku, 'TechCorp SA' as item_name, 'Juan Perez' as sales_rep, 5000000 as forecast_amount, 2000000 as actual_amount, 40 as cumplimiento_pct, 'ALTO' as risk_level, 'v001_1' as item_id;");
    console.log('View created');
  } catch(e) {
    console.error('ERROR:', e.message);
  }
  process.exit();
}
run();
