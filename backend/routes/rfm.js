const express = require("express");
const router = express.Router();
const sql = require("../db");
const { requireAuth } = require("../middleware/auth");

router.use(requireAuth);

// ========================================
// CUSTOMERS & RFM DASHBOARD API
// ========================================

router.get("/kpi/rfm/summary", async (req, res) => {
  try {
    const result = await sql`
      WITH segments AS (
        SELECT 
          customer_id,
          recency_days,
          CASE 
            WHEN recency_days <= 30 THEN 'New / Active'
            WHEN recency_days <= 90 THEN 'Regular'
            WHEN recency_days <= 180 THEN 'At-Risk'
            ELSE 'Dormant'
          END AS segment,
          frequency,
          monetary_total_base
        FROM public.dm_fact_rfm
      )
      SELECT 
        COUNT(DISTINCT customer_id) AS total_customers,
        COUNT(DISTINCT customer_id) FILTER (WHERE segment IN ('New / Active', 'Regular')) AS active_customers,
        COUNT(DISTINCT customer_id) FILTER (WHERE segment = 'At-Risk') AS at_risk_customers,
        COUNT(DISTINCT customer_id) FILTER (WHERE segment = 'Dormant') AS dormant_customers,
        AVG(frequency) AS avg_frequency,
        (SUM(monetary_total_base) / NULLIF(SUM(frequency), 0)) AS avg_ticket
      FROM segments
    `;
    res.json(result[0] || {});
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

router.get("/kpi/rfm/segments", async (req, res) => {
  try {
    const result = await sql`
      WITH segments AS (
        SELECT 
          customer_id,
          CASE 
            WHEN recency_days <= 30 THEN 'New / Active'
            WHEN recency_days <= 90 THEN 'Regular'
            WHEN recency_days <= 180 THEN 'At-Risk'
            ELSE 'Dormant'
          END AS segment,
          frequency,
          monetary_total_base
        FROM public.dm_fact_rfm
      )
      SELECT 
        segment,
        COUNT(DISTINCT customer_id) AS customer_count,
        SUM(monetary_total_base) AS total_revenue
      FROM segments
      GROUP BY segment
      ORDER BY total_revenue DESC
    `;
    res.json(result);
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

router.get("/kpi/rfm/scatter", async (req, res) => {
  try {
    // Para el gráfico de matriz Recency vs Frequency
    const result = await sql`
      SELECT 
        customer_id,
        recency_days as recency,
        frequency,
        monetary_total_base as monetary
      FROM public.dm_fact_rfm
      WHERE recency_days IS NOT NULL
      ORDER BY monetary DESC
      LIMIT 500
    `;
    res.json(result);
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

module.exports = router;
