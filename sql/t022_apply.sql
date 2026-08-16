-- T022 Apply: Create vw_ar_dso semantic view

CREATE OR REPLACE VIEW vw_ar_dso AS
WITH customer_sales AS (
    SELECT 
        customer_id, 
        sum(line_net_amount) as sales_last_90_days
    FROM sales_lines
    WHERE invoice_date >= current_date - interval '90 days'
    GROUP BY customer_id
),
customer_ar AS (
    SELECT 
        customer_id,
        sum(open_amount) as total_ar
    FROM stg_ar_open_items_clean
    GROUP BY customer_id
)
SELECT 
    a.customer_id,
    c.customer_name,
    a.total_ar,
    COALESCE(s.sales_last_90_days, 0) as sales_last_90_days,
    CASE 
        WHEN COALESCE(s.sales_last_90_days, 0) > 0 THEN 
            ROUND((a.total_ar / s.sales_last_90_days) * 90, 2)
        ELSE NULL -- Impossible to calculate DSO without sales
    END as dso_90_days
FROM customer_ar a
LEFT JOIN customer_sales s ON a.customer_id = s.customer_id
LEFT JOIN stg_customers_clean c ON a.customer_id = c.customer_id;

-- Grant permissions if necessary
-- GRANT SELECT ON vw_ar_dso TO authenticated;
