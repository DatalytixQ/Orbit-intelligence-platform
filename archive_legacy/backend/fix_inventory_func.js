require('dotenv').config();
const sql = require('./db.js');

async function run() {
  try {
    await sql`
      CREATE OR REPLACE FUNCTION public.refresh_inventory_supply_snapshot(p_snapshot_date date DEFAULT CURRENT_DATE)
       RETURNS void
       LANGUAGE plpgsql
      AS $function$
      begin
        delete from public.inventory_supply_snapshot_daily
        where snapshot_date = p_snapshot_date;

        insert into public.inventory_supply_snapshot_daily
        select
          p_snapshot_date as snapshot_date,
          *
        from public.vw_inventory_coverage_semantic;
      end;
      $function$
    `;
    console.log("Function updated successfully.");
  } catch(e) {
    console.error(e);
  }
  process.exit(0);
}
run();
