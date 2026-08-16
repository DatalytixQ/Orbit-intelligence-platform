const sql = require('./db');

async function updateViews() {
    try {
        console.log("Actualizando vw_kpi_finance_dso_trend...");
        await sql`
            CREATE OR REPLACE VIEW vw_kpi_finance_dso_trend AS
            WITH current_metrics AS (
                SELECT avg(dso_days) AS base_dso
                FROM mv_kpi_finance_dso_action_list
            ), current_balance AS (
                SELECT sum(open_balance) AS current_ob
                FROM finance_ar_open_items_cxc
                WHERE COALESCE(is_initial_balance, false) = false
            ), monthly_snapshots AS (
                SELECT date_trunc('month', snapshot_date::timestamp with time zone)::date AS month_date,
                       avg(open_balance) AS open_balance
                FROM finance_ar_snapshot_daily
                GROUP BY date_trunc('month', snapshot_date::timestamp with time zone)::date
            )
            SELECT m.month_date,
                   to_char(m.month_date::timestamp with time zone, 'Mon YYYY') AS month_name,
                   round((c.base_dso * (m.open_balance / GREATEST(cb.current_ob, 1::numeric))), 1) AS actual_dso,
                   get_policy_value(1, 'finance', 'best_possible_dso', '30')::numeric AS best_possible_dso
            FROM monthly_snapshots m
            CROSS JOIN current_metrics c
            CROSS JOIN current_balance cb
            ORDER BY m.month_date;
        `;

        console.log("Actualizando vw_kpi_finance_dso_offenders...");
        await sql`
            CREATE OR REPLACE VIEW vw_kpi_finance_dso_offenders AS
            SELECT customer_id,
                   customer_name,
                   round(dso_days, 1) AS dso_days,
                   round(dso_days - get_policy_value(1, 'finance', 'best_possible_dso', '30')::numeric, 1) AS dso_gap,
                   round(overdue_balance, 2) AS critical_balance
            FROM mv_kpi_finance_dso_action_list
            WHERE dso_days > get_policy_value(1, 'finance', 'dso_gap_critical_threshold', '45')::numeric
            ORDER BY round(dso_days - get_policy_value(1, 'finance', 'best_possible_dso', '30')::numeric, 1) DESC
            LIMIT 20;
        `;
        
        console.log("Vistas actualizadas exitosamente.");
    } catch(err) {
        console.error(err);
    } finally {
        process.exit(0);
    }
}

updateViews();
