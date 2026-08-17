const express = require("express");
const router = express.Router();
const sql = require("../db");

// GET /api/executive/health-score
router.get("/health-score", async (req, res) => {
  try {
    const result = await sql`SELECT * FROM public.vw_business_health_score`;
    if (result.length === 0) {
      return res.json({
        overall_score: 0,
        health_band: 'Critical',
        dimensions: []
      });
    }
    
    // Asynchronously take a snapshot for historical trend
    sql`SELECT public.take_daily_health_snapshot()`.catch(err => {
      console.error("Error taking health snapshot:", err);
    });

    res.json(result[0]);
  } catch (e) {
    console.error("Error fetching health score:", e);
    res.status(500).json({ ok: false, error: e.message });
  }
});

// GET /api/executive/health-trend
router.get("/health-trend", async (req, res) => {
  try {
    const result = await sql`
      SELECT 
        snapshot_date, 
        overall_score, 
        health_band 
      FROM public.executive_health_snapshot
      ORDER BY snapshot_date ASC
      LIMIT 30
    `;
    res.json(result);
  } catch (e) {
    console.error("Error fetching health trend:", e);
    res.status(500).json({ ok: false, error: e.message });
  }
});

module.exports = router;
