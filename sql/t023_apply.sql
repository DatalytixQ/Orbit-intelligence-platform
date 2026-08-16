-- T023 Apply: Create vw_collection_efficiency semantic view

CREATE OR REPLACE VIEW vw_collection_efficiency AS
WITH monthly_payments AS (
    SELECT 
        customer_id,
        date_trunc('month', payment_date) as month,
        sum(amount) as collected_amount
    FROM customer_payments
    GROUP BY customer_id, date_trunc('month', payment_date)
),
monthly_sales AS (
    SELECT 
        customer_id,
        date_trunc('month', invoice_date) as month,
        sum(line_net_amount) as billed_amount
    FROM sales_lines
    GROUP BY customer_id, date_trunc('month', invoice_date)
)
SELECT 
    COALESCE(p.customer_id, s.customer_id) as customer_id,
    COALESCE(p.month, s.month) as month,
    COALESCE(p.collected_amount, 0) as collected_amount,
    COALESCE(s.billed_amount, 0) as billed_amount,
    CASE 
        WHEN COALESCE(s.billed_amount, 0) > 0 THEN 
            ROUND((COALESCE(p.collected_amount, 0) / s.billed_amount) * 100, 2)
        ELSE NULL
    END as collection_efficiency_percentage
FROM monthly_payments p
FULL OUTER JOIN monthly_sales s 
    ON p.customer_id = s.customer_id AND p.month = s.month;

-- GRANT SELECT ON vw_collection_efficiency TO authenticated;
