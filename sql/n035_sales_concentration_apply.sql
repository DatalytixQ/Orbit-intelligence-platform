-- N035 Apply: Sales Concentration KPIs

CREATE OR REPLACE VIEW kpi_sales_concentration_category AS
WITH category_totals AS (
    SELECT 
        COALESCE(i.item_class, 'Sin Categoría') as category,
        SUM(sl.line_net_amount) as total_sales
    FROM sales_lines sl
    LEFT JOIN items_master i ON sl.item_id = i.item_id
    WHERE sl.invoice_date >= date_trunc('year', CURRENT_DATE)
    GROUP BY i.item_class
),
total_sales AS (
    SELECT SUM(total_sales) as grand_total FROM category_totals
)
SELECT 
    ct.category,
    ROUND(ct.total_sales, 2) as sales_amount,
    ROUND((ct.total_sales / ts.grand_total) * 100, 2) as participation_pct
FROM category_totals ct, total_sales ts
ORDER BY ct.total_sales DESC;

CREATE OR REPLACE VIEW kpi_sales_concentration_customer AS
WITH customer_totals AS (
    SELECT 
        c.customer_name as customer,
        SUM(sl.line_net_amount) as total_sales
    FROM sales_lines sl
    JOIN customers c ON sl.customer_id = c.customer_internal_id
    WHERE sl.invoice_date >= date_trunc('year', CURRENT_DATE)
    GROUP BY c.customer_name
),
total_sales AS (
    SELECT SUM(total_sales) as grand_total FROM customer_totals
)
SELECT 
    ct.customer,
    ROUND(ct.total_sales, 2) as sales_amount,
    ROUND((ct.total_sales / ts.grand_total) * 100, 2) as participation_pct
FROM customer_totals ct, total_sales ts
ORDER BY ct.total_sales DESC
LIMIT 20;
