const express = require("express");
const router = express.Router();
const sql = require("../db");
const { getFinanceRiskBundle } = require("../services/financeRisk");
const { requireAuth } = require("../middleware/auth");

router.use(requireAuth);

// TODO: Add client_id filter to queries when dm views expose client_id

router.get("/kpi/finance/current", async (_req, res) => {
  try {
    const result = await sql`select * from public.kpi_finance_current_snapshot where client_id = ${req.user.client_id}`;
    res.json(result[0] || {});
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

router.get("/kpi/finance/ar-aging-summary", async (_req, res) => {
  try {
    const result = await sql`select * from public.kpi_finance_ar_aging_summary where client_id = ${req.user.client_id}`;
    res.json(result);
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

router.get("/kpi/finance/ar-open-items", async (_req, res) => {
  try {
    const result = await sql`
      select
        invoice_internal_id,
        document_number,
        customer_internal_id as customer_id,
        coalesce(master_customer_name, customer_name, customer_internal_id) as customer_name,
        country,
        state,
        city,
        fecha as invoice_date,
        due_date,
        tipo_transaccion as document_type,
        currency,
        exchange_rate,
        subsidiary_id,
        payment_terms,
        amount_total,
        amount_paid,
        open_balance,
        case
          when due_date is not null and current_date > due_date
          then current_date - due_date
          else 0
        end as days_overdue
      from public.finance_ar_open_items_cxc
      where client_id = ${req.user.client_id} and coalesce(is_initial_balance, false) = false
      order by days_overdue desc, open_balance desc
      limit 300
    `;
    res.json(result);
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

router.get("/kpi/finance/special-receivables", async (_req, res) => {
  try {
    const result = await sql`
      select *
      from public.kpi_finance_special_receivables
      where client_id = ${req.user.client_id}
    `;
    res.json(result);
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

router.get("/kpi/finance/special-receivables-detail", async (_req, res) => {
  try {
    const result = await sql`
      select *
      from public.kpi_finance_special_receivables_detail
      where client_id = ${req.user.client_id}
    `;
    res.json(result);
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

router.get("/kpi/finance/test", (_req, res) => {
  res.json({ ok: true, route: "finance-test" });
});

router.get("/kpi/finance/top-risk-customers", async (_req, res) => {
  try {
    const result = await sql`
      select *
      from public.kpi_finance_customer_risk
      where client_id = ${req.user.client_id} and overdue_balance > 0
      order by risk_score desc, overdue_90_balance desc, overdue_balance desc
      limit 20
    `;
    res.json(result);
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

router.get("/kpi/finance/risk-summary", async (_req, res) => {
  try {
    const result = await sql`
      select
        risk_segment,
        count(*) as customers,
        round(sum(open_balance), 2) as open_balance,
        round(sum(overdue_balance), 2) as overdue_balance,
        round(sum(overdue_90_balance), 2) as overdue_90_balance,
        round(avg(risk_score), 1) as avg_risk_score
      from public.kpi_finance_customer_risk
      where client_id = ${req.user.client_id}
      group by risk_segment
    `;
    res.json(result);
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

router.get("/kpi/finance/risk-bundle", async (_req, res) => {
  try {
    const payload = await getFinanceRiskBundle();
    res.json(payload);
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

router.get("/kpi/finance/dso-analytics", async (req, res) => {
  try {
    const segment = req.query.segment || "ALL";
    const customerId = req.query.customerId || "ALL";
    const onlyCritical = req.query.onlyCritical === "true";

    const { getPolicies } = require("../services/policies");
    const p = await getPolicies(1, 'finance');
    const minBalance = Number(p.critical_balance_minimum || 100000);
    const criticalDays = Number(p.critical_aging_days || 90);

    const limitRows = segment === "ALL" && customerId === "ALL" ? 10 : 500;

    const [portfolio, byCustomer, bySegment] = await Promise.all([
      sql`
        select
          ${criticalDays}::numeric as period_days,
          round(avg(dso_days),1) as dso_days,
          round(sum(overdue_balance),2) as overdue_balance,
          round(sum(overdue_90_balance),2) as overdue_90_balance,
          count(*) filter (where overdue_90_balance > ${minBalance}) as action_customers
        from public.mv_kpi_finance_dso_action_list
        where client_id = ${req.user.client_id}
      `,
      sql`
        select *
        from public.mv_kpi_finance_dso_action_list
        where client_id = ${req.user.client_id}
          and (${segment} = 'ALL' or risk_segment = ${segment})
          and (${customerId} = 'ALL' or customer_id::text = ${customerId})
          and (${onlyCritical} = false or overdue_90_balance > ${minBalance})
        order by
          case when overdue_90_balance > ${minBalance} then 1 else 0 end desc,
          overdue_90_balance desc,
          dso_days desc nulls last
        limit ${limitRows}
      `,
      sql`
        select
          risk_segment,
          count(*) as customers,
          round(avg(dso_days),1) as dso_days
        from public.mv_kpi_finance_dso_action_list
        where client_id = ${req.user.client_id}
        group by risk_segment
        order by dso_days desc nulls last
      `,
    ]);

    res.json({
      summary: portfolio[0] || {},
      portfolio: portfolio[0] || {},
      byCustomer,
      bySegment,
    });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

router.get("/kpi/finance/dso-customers", async (_req, res) => {
  try {
    const result = await sql`
      select distinct customer_id, customer_name
      from public.mv_kpi_finance_dso_action_list
      where client_id = ${req.user.client_id} and customer_name is not null
      order by customer_name
    `;
    res.json(result);
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

router.get("/kpi/finance/dso-executive", async (_req, res) => {
  try {
    // 1. Current KPI Summary
    // DSO Global de la vista accionable, pero totales de la tabla principal para consistencia 100% con Finanzas
    const { getPolicies } = require("../services/policies");
    const p = await getPolicies(1, 'finance');
    const minBalance = Number(p.critical_balance_minimum || 100000);
    const criticalDays = Number(p.critical_aging_days || 90);
    const bestDso = Number(p.best_possible_dso || 30);

    const dsoAvg = await sql`
      select round(avg(dso_days), 1) as current_dso
      from public.mv_kpi_finance_dso_action_list
      where client_id = ${req.user.client_id}
    `;
    
    const totals = await sql`
      select
        round(sum(open_balance) filter (where due_date is not null and current_date > due_date), 2) as current_overdue_balance,
        round(sum(open_balance) filter (where due_date is not null and current_date - due_date > ${criticalDays}), 2) as current_critical_balance
      from public.finance_ar_open_items_cxc
      where client_id = ${req.user.client_id} and coalesce(is_initial_balance, false) = false
    `;

    const summary = {
      current_dso: dsoAvg[0]?.current_dso || 0,
      current_overdue_balance: totals[0]?.current_overdue_balance || 0,
      current_critical_balance: totals[0]?.current_critical_balance || 0
    };

    // 2. Trend Histórico de DSO vs BPDSO (Corregido matemáticamente)
    const trend = await sql`
      select *
      from public.vw_kpi_finance_dso_trend
      where client_id = ${req.user.client_id}
      order by month_date asc
    `;

    // 3. Top DSO Offenders
    const offenders = await sql`
      select *
      from public.vw_kpi_finance_dso_offenders
      where client_id = ${req.user.client_id}
    `;
    
    // Insights generados basados en los offenders
    const insights = [];
    
    if (offenders.length > 0) {
      const topOffender = offenders[0];
      if (Number(topOffender.dso_gap) > (bestDso)) {
        insights.push({
          type: 'warning',
          title: 'Cliente Estructuralmente Lento',
          description: `El cliente ${topOffender.customer_name} presenta un DSO crítico de ${topOffender.dso_days} días, reteniendo fuertemente el ciclo de caja por un valor de $ ${(Number(topOffender.critical_balance)/1000000).toFixed(1)} M.`,
          recommendation: 'Renegociar contrato a condición de Pago Anticipado o reducir los días de crédito permitidos.',
          rule_id: 'DSO_STRUCTURAL_LATE'
        });
      }
      
      const totalCritical = Number(summary.current_critical_balance);
      if (totalCritical > minBalance) {
        insights.push({
          type: 'critical',
          title: 'Fuga de Working Capital',
          description: `La compañía presenta $ ${(totalCritical/1000000).toFixed(1)}M en mora crítica global (+${criticalDays} días) originada por ineficiencias de cobro.`,
          recommendation: 'Activar comité de cobranzas ejecutivo. Estas demoras están afectando severamente el ciclo de caja operativo.',
          rule_id: 'DSO_CASH_LEAK'
        });
      }
    }

    res.json({
      ok: true,
      summary,
      trend,
      insights,
      action_list: offenders
    });

  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});



router.get("/kpi/finance/risk-trend", async (_req, res) => {
  try {
    const rows = await sql`
      with current_snapshot as (
        select max(snapshot_date) as snapshot_date
        from public.finance_customer_risk_snapshot
      ),
      weekly_snapshot as (
        select snapshot_date
        from public.finance_customer_risk_snapshot
        where snapshot_date <= (select snapshot_date from current_snapshot) - interval '7 days'
        order by snapshot_date desc
        limit 1
      ),
      fallback_snapshot as (
        select snapshot_date
        from public.finance_customer_risk_snapshot
        where snapshot_date < (select snapshot_date from current_snapshot)
        order by snapshot_date desc
        limit 1
      ),
      previous_snapshot as (
        select coalesce(
          (select snapshot_date from weekly_snapshot),
          (select snapshot_date from fallback_snapshot)
        ) as snapshot_date
      ),
      dates as (
        select snapshot_date from current_snapshot
        union all
        select snapshot_date from previous_snapshot where snapshot_date is not null
      ),
      agg as (
        select
          snapshot_date,
          round(sum(open_balance), 2) as open_balance,
          round(sum(overdue_balance), 2) as overdue_balance,
          round(sum(overdue_90_balance), 2) as overdue_90_balance,
          round(avg(risk_score), 1) as avg_risk_score,
          count(*) as total_customers,
          count(*) filter (where risk_segment = 'Crítico') as critical_customers,
          count(*) filter (where risk_segment in ('Crítico', 'En riesgo')) as risk_customers
        from public.finance_customer_risk_snapshot
        where snapshot_date in (select snapshot_date from dates)
        group by snapshot_date
      )
      select *
      from agg
      order by snapshot_date desc
    `;

    const current = rows[0] || null;
    const previous = rows[1] || null;

    const n = (v) => Number.isFinite(Number(v)) ? Number(v) : 0;
    const pct = (r) => n(r?.open_balance) > 0 ? (n(r.overdue_balance) / n(r.open_balance)) * 100 : 0;

    res.json({
      current,
      previous,
      comparison: previous ? "vs período anterior" : "sin comparación",
      delta: previous ? {
        overdue_ratio_pct: pct(current) - pct(previous),
        overdue_balance: n(current.overdue_balance) - n(previous.overdue_balance),
        overdue_90_balance: n(current.overdue_90_balance) - n(previous.overdue_90_balance),
        critical_customers: n(current.critical_customers) - n(previous.critical_customers),
        risk_customers: n(current.risk_customers) - n(previous.risk_customers),
        avg_risk_score: n(current.avg_risk_score) - n(previous.avg_risk_score),
      } : null,
    });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

router.post("/admin/finance/refresh-snapshots", async (req, res) => {
  try {
    const adminToken = req.headers["x-admin-token"];

    if (!process.env.ADMIN_REFRESH_TOKEN) {
      return res.status(500).json({
        ok: false,
        error: "ADMIN_REFRESH_TOKEN not configured",
      });
    }

    if (adminToken !== process.env.ADMIN_REFRESH_TOKEN) {
      return res.status(401).json({
        ok: false,
        error: "Unauthorized",
      });
    }

    const snapshotDate =
      req.body?.snapshot_date || new Date().toISOString().slice(0, 10);

    await sql`
      select public.refresh_finance_snapshots(${snapshotDate}::date)
    `;

    const snapshot = await sql`
      select *
      from public.finance_ar_snapshot_daily
      where snapshot_date = ${snapshotDate}::date
      limit 1
    `;

    res.json({
      ok: true,
      snapshot_date: snapshotDate,
      message: "Finance snapshots refreshed successfully",
      snapshot: snapshot[0] || null,
    });
  } catch (e) {
    res.status(500).json({
      ok: false,
      error: e.message,
    });
  }
});

router.get("/kpi/customers/health-summary", async (_req, res) => {
  try {
    const result = await sql`
      select *
      from public.kpi_customer_health_summary
      where client_id = ${req.user.client_id}
      order by
        case health_status
          when 'Crítico' then 1
          when 'Riesgo financiero' then 2
          when 'En observación' then 3
          when 'Enfriado' then 4
          when 'Saludable' then 5
          else 6
        end
    `;
    res.json(result);
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

router.get("/kpi/customers/health-detail", async (_req, res) => {
  try {
    const result = await sql`
      select *
      from public.kpi_customer_health_classified
      where client_id = ${req.user.client_id}
      order by
        overdue_balance desc nulls last,
        max_days_overdue desc nulls last,
        total_sales desc nulls last
      limit 100
    `;
    res.json(result);
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

module.exports = router;