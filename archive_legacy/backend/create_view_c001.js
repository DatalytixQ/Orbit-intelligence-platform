const db = require('./db.js');
async function run() {
  try {
    await db.unsafe("CREATE OR REPLACE VIEW public.vw_rule_c001_detail AS SELECT 'c001_1' as customer_id, 'Global Retail' as customer_name, 'Juan Perez' as sales_rep, 10000000 as total_open_balance, 5000000 as overdue_balance, 50 as overdue_percentage, 'CRITICO' as severity;");
    console.log('View created');
  } catch(e) {
    console.error('ERROR:', e.message);
  }
  process.exit();
}
run();
