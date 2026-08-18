const express = require("express");
const router = express.Router();
const sql = require("../db");
const { requireAuth } = require("../middleware/auth");

router.use(requireAuth);

// TODO: Add client_id filter to queries when dm views expose client_id
// ========================================
// SALES PIPELINE DASHBOARD API
// ========================================

// 1. Core KPIs
router.get("/kpi/pipeline/summary", async (req, res) => {
  try {
    const result = await sql`
      WITH stats AS (
        SELECT 
          COUNT(DISTINCT transaction_id) FILTER (WHERE opportunity_status NOT IN ('Closed Lost', 'Closed Won')) AS open_opportunities,
          SUM(amount_base) FILTER (WHERE opportunity_status NOT IN ('Closed Lost', 'Closed Won')) AS gross_pipeline,
          SUM(weighted_amount_base) FILTER (WHERE opportunity_status NOT IN ('Closed Lost', 'Closed Won')) AS weighted_pipeline,
          COUNT(DISTINCT transaction_id) FILTER (WHERE opportunity_status = 'Closed Won') AS won_opportunities,
          COUNT(DISTINCT transaction_id) FILTER (WHERE opportunity_status = 'Closed Lost') AS lost_opportunities
        FROM public.dm_fact_pipeline
      )
      SELECT
        open_opportunities,
        gross_pipeline,
        weighted_pipeline,
        won_opportunities,
        lost_opportunities,
        (won_opportunities::NUMERIC / NULLIF(won_opportunities + lost_opportunities, 0)) AS win_rate
      FROM stats
    `;
    res.json(result[0] || {});
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// 2. Funnel (Embudo por Etapa)
router.get("/kpi/pipeline/funnel", async (req, res) => {
  try {
    const result = await sql`
      SELECT 
        COALESCE(opportunity_status, 'Nueva') as stage,
        COUNT(DISTINCT transaction_id) as opp_count,
        SUM(amount_base) as total_amount
      FROM public.dm_fact_pipeline
      WHERE opportunity_status NOT IN ('Closed Lost', 'Closed Won')
      GROUP BY opportunity_status
      ORDER BY total_amount DESC
    `;
    res.json(result);
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// 3. Pipeline by Rep
router.get("/kpi/pipeline/by-rep", async (req, res) => {
  try {
    const result = await sql`
      SELECT 
        COALESCE(r.rep_full_name, 'Sin Asignar') as rep_name,
        SUM(f.amount_base) as gross_pipeline,
        SUM(f.weighted_amount_base) as weighted_pipeline
      FROM public.dm_fact_pipeline f
      LEFT JOIN public.dm_dim_sales_reps r ON f.salesrep_id = r.salesrep_id
      WHERE f.opportunity_status NOT IN ('Closed Lost', 'Closed Won')
      GROUP BY r.rep_full_name
      ORDER BY gross_pipeline DESC
    `;
    res.json(result);
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

module.exports = router;
