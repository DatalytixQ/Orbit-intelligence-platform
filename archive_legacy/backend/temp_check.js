const sql = require('./db');

async function run() {
  try {
    const dsoAvg = await sql`select avg(dso_days) as avg_dso from mv_kpi_finance_dso_action_list`;
    console.log("Global DSO from mv_kpi_finance_dso_action_list:", dsoAvg[0].avg_dso);

    const dsoSum = await sql`select sum(overdue_90_balance) as crit from mv_kpi_finance_dso_action_list`;
    console.log("Total Critical 90+ from mv_kpi_finance_dso_action_list:", dsoSum[0].crit);

    const finSum = await sql`select sum(open_balance) filter (where current_date - due_date > 90) as crit from finance_ar_open_items_cxc where coalesce(is_initial_balance, false) = false`;
    console.log("Total Critical 90+ from finance_ar_open_items_cxc:", finSum[0].crit);

    const trend = await sql`select date_trunc('month', snapshot_date)::date as m, avg(open_balance) as ob, avg(overdue_balance) as ovb from finance_ar_snapshot_daily group by 1 order by 1`;
    console.log("Trend Data in finance_ar_snapshot_daily:", trend);
  } catch (e) {
    console.error(e);
  }
  process.exit(0);
}
run();
