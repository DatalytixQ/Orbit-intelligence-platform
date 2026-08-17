const express = require("express");
const router = express.Router();
const sql = require("../db");
const {
  buildFinanceAnalysis,
  buildExecutiveAnalytics,
} = require("../services/analyticsEngine");
const { getFinanceRiskBundle } = require("../services/financeRisk");

router.get("/analytics/finance", async (_req, res) => {
  try {
    const current = await sql`select * from public.kpi_finance_current_snapshot`;
    const aging = await sql`select * from public.kpi_finance_ar_aging_summary`;
    const bundle = await getFinanceRiskBundle();

    res.json(
      buildFinanceAnalysis({
        current: current[0] || {},
        aging,
        riskCustomers: bundle.riskCustomers || [],
      })
    );
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

router.get("/analytics/sales", async (_req, res) => {
  try {
    const monthly = await sql`select * from public.kpi_ventas_mensuales`;
    const topCustomers = await sql`select * from public.kpi_top_clientes limit 10`;
    const byCategory = await sql`select * from public.kpi_sales_category_monthly`;

    res.json({
      diagnostics: {
        status: "Base comercial disponible",
        summary: "Análisis comercial inicial preparado con ventas mensuales, clientes principales y categorías.",
      },
      alerts: [],
      drivers: {
        monthly_points: monthly.length,
        top_customers: topCustomers.length,
        category_points: byCategory.length,
      },
      actions: [
        {
          priority: "Media",
          action: "Validar variación mensual y principales clientes antes de generar drivers automáticos.",
        },
      ],
      data: {
        monthly,
        topCustomers,
        byCategory,
      },
    });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

router.get("/analytics/inventory", async (_req, res) => {
  try {
    const commercialStock = await sql`select * from public.kpi_inventory_commercial_stock`;
    const valuation = await sql`select * from public.kpi_inventory_total_valuation`;
    const criticalItems = await sql`select * from public.kpi_inventory_top_critical_items`;
    const slowMoving = await sql`select * from public.kpi_inventory_top_slow_moving`;

    res.json({
      diagnostics: {
        status: criticalItems.length > 0 ? "Atención requerida" : "Controlado",
        summary:
          criticalItems.length > 0
            ? "Existen productos críticos que requieren revisión de reposición o cobertura."
            : "No se detectan productos críticos relevantes.",
      },
      alerts: [],
      drivers: {
        critical_items: criticalItems.length,
        slow_moving_items: slowMoving.length,
      },
      actions: [
        {
          priority: "Alta",
          action: "Revisar cobertura de productos críticos y validar reposición sugerida.",
        },
        {
          priority: "Media",
          action: "Analizar slow moving para liberar capital inmovilizado.",
        },
      ],
      data: {
        commercialStock: commercialStock[0] || {},
        valuation: valuation[0] || {},
        criticalItems,
        slowMoving,
      },
    });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

router.get("/analytics/executive", async (_req, res) => {
  try {
    const data = await buildExecutiveAnalytics();
    res.json(data);
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

module.exports = router;