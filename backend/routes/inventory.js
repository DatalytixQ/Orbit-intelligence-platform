const express = require("express");
const router = express.Router();
const sql = require("../db");

// ========================================
// INVENTARIO
// ========================================

router.get("/kpi/inventory/commercial-stock", async (_req, res) => {
  try {
    const result = await sql`select * from public.kpi_inventory_commercial_stock`;
    res.json(result[0] || {});
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

router.get("/kpi/inventory/commercial-valuation", async (_req, res) => {
  try {
    const result = await sql`select * from public.kpi_inventory_commercial_valuation`;
    res.json(result[0] || {});
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

router.get("/kpi/inventory/critical-demand-mix", async (_req, res) => {
  try {
    const result = await sql`
      SELECT 
        CASE 
          WHEN avg_monthly_qty_3m >= 20 THEN 'Alta demanda'
          WHEN avg_monthly_qty_3m >= 5 THEN 'Demanda media'
          ELSE 'Demanda baja'
        END as demand_segment,
        COUNT(*) as items,
        SUM(inventory_value) as inventory_value
      FROM public.vw_inventory_executive_coverage
      WHERE coverage_status IN ('Crítico', 'Riesgo', 'Quiebre Inminente (OV)')
      GROUP BY 1
      ORDER BY MAX(avg_monthly_qty_3m) DESC
    `;
    res.json(result);
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

router.get("/kpi/inventory/critical-stock", async (_req, res) => {
  try {
    const result = await sql`
      select * from public.kpi_inventory_critical_stock
      limit 50
    `;
    res.json(result);
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

router.get("/kpi/inventory/by-class", async (_req, res) => {
  try {
    const result = await sql`select * from public.kpi_inventory_stock_by_class`;
    res.json(result);
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

router.get("/kpi/inventory/total-valuation", async (_req, res) => {
  try {
    const result = await sql`select * from public.kpi_inventory_total_valuation`;
    res.json(result[0] || {});
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

router.get("/kpi/inventory/coverage", async (_req, res) => {
  try {
    const result = await sql`
      select
        coverage_status,
        count(*) as items,
        sum(inventory_value) as inventory_value
      from public.vw_inventory_executive_coverage
      group by coverage_status
      order by items desc
    `;
    res.json(result);
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

router.get("/kpi/inventory/top-critical", async (_req, res) => {
  try {
    const result = await sql`
      SELECT item_id,
        item_name,
        item_class,
        stock_available,
        quantity_inbound,
        quantity_pending,
        net_stock,
        avg_monthly_qty_3m,
        lead_time_days,
        target_coverage_months,
        net_coverage_months as stock_coverage_months,
        inventory_value,
        coverage_status
       FROM public.vw_inventory_executive_coverage
      WHERE coverage_status IN ('Crítico', 'Riesgo', 'Quiebre Inminente (OV)')
      ORDER BY
            CASE
                WHEN coverage_status = 'Quiebre Inminente (OV)' THEN 0
                WHEN avg_monthly_qty_3m >= 20 THEN 1
                WHEN avg_monthly_qty_3m >= 5 THEN 2
                ELSE 3
            END ASC, inventory_value DESC
    `;
    res.json(result);
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

router.get("/kpi/inventory/slow-moving", async (_req, res) => {
  try {
    const result = await sql`
      SELECT 
        item_id,
        item_name,
        item_class,
        stock_available,
        inventory_value
      FROM public.vw_inventory_executive_coverage
      WHERE coverage_status = 'Sin demanda reciente'
      ORDER BY stock_available DESC
    `;
    res.json(result);
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

router.get("/kpi/inventory/slow-moving-summary", async (_req, res) => {
  try {
    const result = await sql`
      SELECT 
        SUM(inventory_value) as slow_moving_value,
        COUNT(*) as slow_moving_items,
        SUM(stock_available) as slow_moving_units
      FROM public.vw_inventory_executive_coverage
      WHERE coverage_status = 'Sin demanda reciente'
    `;
    res.json(result[0] || {});
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

router.get("/kpi/inventory/critical-items-count", async (_req, res) => {
  try {
    const result = await sql`
      SELECT COUNT(*) as critical_items 
      FROM public.vw_inventory_executive_coverage
      WHERE coverage_status IN ('Crítico', 'Riesgo', 'Quiebre Inminente (OV)')
    `;
    res.json(result[0] || {});
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

router.get("/kpi/inventory/critical-value", async (_req, res) => {
  try {
    const result = await sql`
      SELECT SUM(inventory_value) as critical_inventory_value
      FROM public.vw_inventory_executive_coverage
      WHERE coverage_status IN ('Crítico', 'Riesgo', 'Quiebre Inminente (OV)')
    `;
    res.json(result[0] || {});
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

module.exports = router;