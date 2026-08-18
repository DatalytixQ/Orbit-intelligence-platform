const express = require("express");
const router = express.Router();
const sql = require("../db");
const { requireAuth } = require("../middleware/auth");

router.use(requireAuth);

const getFilterConditions = (query, dateColumn = 'sale_date') => {
  const { subsidiary_id, currency_id, channel, rep_id, startDate, endDate } = query;
  let conditions = [];
  
  // TODO: Add client_id filter when dm views expose client_id
  
  if (subsidiary_id && subsidiary_id !== 'all') conditions.push(sql`subsidiary_id = ANY(get_subsidiary_tree(${subsidiary_id}))`);
  if (currency_id && currency_id !== 'all') conditions.push(sql`currency_id = ${currency_id}`);
  if (channel && channel !== 'all') conditions.push(sql`COALESCE(sales_channel_id, 'Directo (Default)') = ${channel}`);
  if (rep_id && rep_id !== 'all') conditions.push(sql`salesrep_id = ${rep_id}`);
  if (startDate) conditions.push(sql`${sql(dateColumn)} >= ${startDate}::DATE`);
  if (endDate) conditions.push(sql`${sql(dateColumn)} <= ${endDate}::DATE`);
  
  return conditions.length > 0 ? sql`WHERE ${conditions.reduce((acc, condition) => sql`${acc} AND ${condition}`)}` : sql``;
};

router.get("/kpi/sales/summary", async (req, res) => {
  try {
    const filters = getFilterConditions(req.query, 'sale_date');
    const result = await sql`
      WITH base AS (
        SELECT 
          SUM(net_amount_base) AS net_sales,
          SUM(cogs_base) AS total_cogs,
          COUNT(DISTINCT transaction_id) AS total_orders,
          COUNT(DISTINCT customer_id) AS total_customers,
          SUM(quantity) AS units_sold
        FROM public.dm_fact_sales
        ${filters}
      )
      SELECT 
        net_sales,
        total_orders,
        total_customers,
        units_sold,
        (net_sales / NULLIF(total_orders, 0)) AS average_ticket,
        (net_sales - total_cogs) AS gross_profit,
        ((net_sales - total_cogs) / NULLIF(net_sales, 0)) AS gross_margin_pct
      FROM base
    `;
    res.json(result[0] || {});
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

router.get("/kpi/sales/monthly-trend", async (req, res) => {
  try {
    const filters = getFilterConditions(req.query, 'sale_date');
    const result = await sql`
      SELECT 
        TO_CHAR(sale_month, 'YYYY-MM') as month,
        SUM(net_amount_base) as total_sales,
        SUM(quantity) as units
      FROM public.dm_fact_sales
      ${filters}
      GROUP BY 1
      ORDER BY 1 ASC
    `;
    res.json(result);
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

router.get("/kpi/sales/monthly-trend-yoy", async (req, res) => {
  try {
    const filters = getFilterConditions(req.query, 'sale_date');
    const result = await sql`
      WITH actual_year AS (
        SELECT 
          EXTRACT(MONTH FROM sale_date) as month_num,
          SUM(net_amount_base) as current_sales,
          SUM(estimated_gross_profit) as current_margin
        FROM public.dm_fact_sales
        ${filters}
        GROUP BY 1
      ),
      prev_year AS (
        SELECT 
          EXTRACT(MONTH FROM sale_date) as month_num,
          SUM(net_amount_base) as prev_sales
        FROM public.dm_fact_sales
        WHERE EXTRACT(YEAR FROM sale_date) = EXTRACT(YEAR FROM CURRENT_DATE) - 1
          -- We ideally want to pass the exact same filters here, but shifted by 1 year.
          -- For simplicity in this endpoint, we'll assume the main filters apply.
          -- A more robust approach modifies the dates in getFilterConditions.
        GROUP BY 1
      ),
      forecast AS (
        SELECT 
          month as month_num,
          SUM(amount) as forecast_sales
        FROM public.app_sales_forecast
        WHERE year = EXTRACT(YEAR FROM CURRENT_DATE)
        GROUP BY 1
      )
      SELECT 
        COALESCE(a.month_num, p.month_num, f.month_num) as month_num,
        COALESCE(a.current_sales, 0) as current_sales,
        COALESCE(p.prev_sales, 0) as prev_sales,
        COALESCE(f.forecast_sales, 0) as forecast_sales,
        COALESCE(a.current_margin, 0) as current_margin
      FROM actual_year a
      FULL OUTER JOIN prev_year p ON a.month_num = p.month_num
      FULL OUTER JOIN forecast f ON COALESCE(a.month_num, p.month_num) = f.month_num
      ORDER BY month_num ASC
    `;
    res.json(result);
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

router.get("/kpi/sales/top-customers", async (req, res) => {
  try {
    const filters = getFilterConditions(req.query, 'sale_date');
    const result = await sql`
      SELECT 
        customer_name,
        SUM(net_amount_base) as total_sales,
        SUM(estimated_gross_profit) as gross_profit,
        COUNT(DISTINCT transaction_id) as total_orders
      FROM public.dm_fact_sales
      ${filters}
      GROUP BY 1
      ORDER BY 2 DESC
      LIMIT 20
    `;
    res.json(result);
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

router.get("/kpi/sales/products-by-category", async (req, res) => {
  try {
    const filters = getFilterConditions(req.query, 'sale_date');
    const { class_id } = req.query;
    
    // Si envían class_id, filtramos por jerarquía de clase
    const classFilter = class_id ? sql`AND class_id = ANY(get_classification_tree(${class_id}))` : sql``;
    
    const result = await sql`
      SELECT 
        item_name,
        SUM(net_amount_base) as total_sales,
        SUM(quantity) as units_sold
      FROM public.dm_fact_sales
      ${filters}
      ${classFilter}
      GROUP BY 1
      ORDER BY 2 DESC
      LIMIT 50
    `;
    res.json(result);
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

router.get("/kpi/sales/rep-detail", async (req, res) => {
  try {
    const filters = getFilterConditions(req.query, 'sale_date');
    const { rep_id } = req.query;
    if (!rep_id) return res.status(400).json({ error: "rep_id is required" });
    
    const result = await sql`
      SELECT 
        customer_name,
        item_name,
        SUM(net_amount_base) as total_sales,
        SUM(estimated_gross_profit) as gross_profit
      FROM public.dm_fact_sales
      ${filters}
      AND salesrep_id = ${rep_id}
      GROUP BY 1, 2
      ORDER BY 1, 3 DESC
    `;
    res.json(result);
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

router.get("/kpi/sales/by-category", async (req, res) => {
  try {
    const filters = getFilterConditions(req.query, 'sale_date');
    const result = await sql`
      SELECT 
        COALESCE(c.class_name, 'Sin Categoría') as category,
        SUM(f.net_amount_base) as total_sales,
        SUM(f.quantity) as units,
        SUM(f.net_amount_base - f.cogs_base) as gross_profit,
        (SUM(f.net_amount_base - f.cogs_base) / NULLIF(SUM(f.net_amount_base), 0)) as gross_margin_pct
      FROM public.dm_fact_sales f
      LEFT JOIN public.dm_dim_classifications c ON f.class_id = c.class_id
      ${filters}
      GROUP BY c.class_name
      ORDER BY total_sales DESC
    `;
    res.json(result);
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

router.get("/kpi/sales/by-channel", async (req, res) => {
  try {
    const filters = getFilterConditions(req.query, 'sale_date');
    const result = await sql`
      SELECT 
        COALESCE(sales_channel_id, 'Directo (Default)') as channel,
        SUM(net_amount_base) as total_sales,
        SUM(quantity) as units,
        (SUM(net_amount_base - cogs_base) / NULLIF(SUM(net_amount_base), 0)) as gross_margin_pct
      FROM public.dm_fact_sales
      ${filters}
      GROUP BY sales_channel_id
      ORDER BY total_sales DESC
    `;
    res.json(result);
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

router.get("/kpi/sales/by-rep", async (req, res) => {
  try {
    const filters = getFilterConditions(req.query, 'sale_date');
    const result = await sql`
      SELECT 
        COALESCE(r.rep_full_name, 'Sin Asignar') as rep_name,
        SUM(f.net_amount_base) as total_sales,
        SUM(f.quantity) as units,
        COUNT(DISTINCT f.transaction_id) as total_orders
      FROM public.dm_fact_sales f
      LEFT JOIN public.dm_dim_sales_reps r ON f.salesrep_id = r.salesrep_id
      ${filters}
      GROUP BY r.rep_full_name
      ORDER BY total_sales DESC
    `;
    res.json(result);
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

router.get("/kpi/sales/customer-pareto", async (req, res) => {
  try {
    const filters = getFilterConditions(req.query, 'sale_date');
    const result = await sql`
      WITH RankedCustomers AS (
        SELECT 
          customer_id,
          SUM(net_amount_base) as total_sales
        FROM public.dm_fact_sales
        ${filters}
        GROUP BY customer_id
        ORDER BY total_sales DESC
      ),
      TotalSales AS (
        SELECT SUM(net_amount_base) as grand_total FROM public.dm_fact_sales ${filters}
      )
      SELECT 
        r.customer_id,
        r.total_sales,
        SUM(r.total_sales) OVER (ORDER BY r.total_sales DESC) as cumulative_sales,
        (SUM(r.total_sales) OVER (ORDER BY r.total_sales DESC) / NULLIF((SELECT grand_total FROM TotalSales), 0)) * 100 as cumulative_pct
      FROM RankedCustomers r
      LIMIT 100
    `;
    res.json(result);
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

router.get("/kpi/sales/transactions", async (req, res) => {
  try {
    const filters = getFilterConditions(req.query, 'sale_date');
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;
    
    const countResult = await sql`
      SELECT COUNT(*) as total
      FROM public.dm_fact_sales
      ${filters}
    `;
    const total = countResult[0].total;

    const result = await sql`
      SELECT 
        f.transaction_id,
        f.tranid,
        f.sale_date,
        f.customer_id,
        COALESCE(r.rep_full_name, 'Sin Asignar') as rep_name,
        COALESCE(c.class_name, 'Sin Categoría') as category,
        f.quantity,
        f.net_amount_base,
        f.cogs_base,
        (f.net_amount_base - f.cogs_base) as gross_profit
      FROM public.dm_fact_sales f
      LEFT JOIN public.dm_dim_sales_reps r ON f.salesrep_id = r.salesrep_id
      LEFT JOIN public.dm_dim_classifications c ON f.class_id = c.class_id
      ${filters}
      ORDER BY f.sale_date DESC, f.tranid DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    res.json({
      data: result,
      pagination: {
        total: parseInt(total),
        limit,
        offset
      }
    });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

module.exports = router;