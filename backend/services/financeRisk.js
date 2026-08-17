const sql = require("../db");

let financeRiskBundleCache = null;
let financeRiskBundleCacheAt = 0;
const FINANCE_RISK_CACHE_TTL_MS = 5 * 60 * 1000;

async function getFinanceRiskBundle() {
  const now = Date.now();

  if (
    financeRiskBundleCache &&
    now - financeRiskBundleCacheAt < FINANCE_RISK_CACHE_TTL_MS
  ) {
    return {
      ...financeRiskBundleCache,
      cache: true,
      cache_age_seconds: Math.round((now - financeRiskBundleCacheAt) / 1000),
    };
  }

  const result = await sql`
    with base as materialized (
      select *
      from public.kpi_finance_customer_risk
    )
    select json_build_object(
      'riskCustomers',
      (
        select coalesce(json_agg(t), '[]'::json)
        from (
          select *
          from base
          where overdue_balance > 0
          order by risk_score desc, overdue_90_balance desc, overdue_balance desc
          limit 20
        ) t
      ),
      'riskSummary',
      (
        select coalesce(json_agg(s), '[]'::json)
        from (
          select
            risk_segment,
            count(*) as customers,
            round(sum(open_balance), 2) as open_balance,
            round(sum(overdue_balance), 2) as overdue_balance,
            round(sum(overdue_90_balance), 2) as overdue_90_balance,
            round(avg(risk_score), 1) as avg_risk_score
          from base
          group by risk_segment
        ) s
      )
    ) as data
  `;

  const payload = result[0]?.data || {
    riskCustomers: [],
    riskSummary: [],
  };

  financeRiskBundleCache = payload;
  financeRiskBundleCacheAt = Date.now();

  return {
    ...payload,
    cache: false,
    cache_age_seconds: 0,
  };
}

module.exports = { getFinanceRiskBundle };