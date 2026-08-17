const express = require("express");
const router = express.Router();
const sql = require("../db");

router.get("/home-premium", async (_req, res) => {
  try {
    const result = await sql`
      select *
      from public.vw_home_premium
      limit 1
    `;
    res.json(result[0] || {});
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

router.get("/home-executive-summary", async (_req, res) => {
  try {
    const result = await sql`
      select *
      from public.vw_home_executive_summary
      limit 1
    `;
    res.json(result[0] || {});
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

router.get("/business-insights", async (_req, res) => {
  try {
    const result = await sql`
      select *
      from public.vw_business_insights
      order by domain, rule_id
    `;
    res.json(result);
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

router.get("/business-insights/top", async (_req, res) => {
  try {
    const result = await sql`
      select *
      from public.vw_priority_engine
      where calculated_priority > 0
      order by calculated_priority desc
      limit 3
    `;
    res.json(result);
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

module.exports = router;