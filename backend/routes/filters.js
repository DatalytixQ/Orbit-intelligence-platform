const express = require("express");
const router = express.Router();
const sql = require("../db");
const { requireAuth } = require("../middleware/auth");

router.use(requireAuth);

router.get("/kpi/filters", async (req, res) => {
  try {
    // Subsidiaries — full list ordered alphabetically with hierarchy
    const subsidiaries = await sql`
      SELECT subsidiary_id as id, subsidiary_name as name, parent_id, full_name
      FROM dm_dim_subsidiaries 
      ORDER BY full_name ASC
    `;
    
    // Currencies — only those actually operated in transactions (+ USD always available)
    const currencies = await sql`
      SELECT DISTINCT c.currency_id as id, c.currency_name as name, c.currency_symbol as symbol
      FROM dm_dim_currencies c
      WHERE c.currency_id IN (
        SELECT DISTINCT currency_id FROM dm_fact_sales WHERE currency_id IS NOT NULL
      )
      OR c.currency_id = '2'
      ORDER BY c.currency_name ASC
    `;
    
    // Sales Reps — use COALESCE to handle null rep_full_name, fall back to rep_entityid
    const reps = await sql`
      SELECT salesrep_id as id, COALESCE(rep_full_name, rep_entityid, firstname) as name
      FROM dm_dim_sales_reps
      WHERE COALESCE(rep_full_name, rep_entityid, firstname) IS NOT NULL
      ORDER BY COALESCE(rep_full_name, rep_entityid, firstname) ASC
    `;
    
    // Channels — extract unique channels from fact table
    const channels = await sql`
      SELECT DISTINCT COALESCE(sales_channel_id, 'Directo') as name
      FROM dm_fact_sales
      WHERE sales_channel_id IS NOT NULL AND sales_channel_id <> ''
      ORDER BY name ASC
    `;

    res.json({
      subsidiaries,
      currencies,
      reps,
      channels: channels.map(c => ({ id: c.name, name: c.name }))
    });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// ETL Data Freshness — return the actual last sync timestamp
router.get("/kpi/system/etl-status", async (req, res) => {
  try {
    const result = await sql`
      SELECT 
        MAX(sale_date) as last_transaction_date,
        (SELECT MAX(created_at) FROM raw_ns_transactions) as last_etl_sync
    FROM dm_fact_sales
    `;
    
    res.json({
      last_transaction_date: result[0]?.last_transaction_date || null,
      last_etl_sync: result[0]?.last_etl_sync || null
    });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

module.exports = router;
