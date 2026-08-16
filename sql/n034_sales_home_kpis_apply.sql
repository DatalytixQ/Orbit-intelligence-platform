-- N034 Apply: Create views for Home Sales KPIs to replace inline SQL

CREATE OR REPLACE VIEW kpi_home_commercial_summary AS
SELECT
    extract(year from invoice_date)::int as year,
    round(sum(quantity), 2) as invoiced_units,
    round(sum(line_net_amount), 2) as net_revenue,
    round(sum(line_tax_amount), 2) as tax_amount,
    round(sum(line_total_amount), 2) as gross_revenue,
    count(distinct invoice_id) as invoices,
    count(distinct customer_id) as customers,
    count(distinct item_id) as items
FROM public.sales_lines
WHERE invoice_date is not null
GROUP BY extract(year from invoice_date)
ORDER BY year desc;

CREATE OR REPLACE VIEW kpi_home_sales_vs_last_year AS
SELECT
    extract(year from invoice_date)::int as year,
    extract(month from invoice_date)::int as month,
    date_trunc('month', invoice_date)::date as month_date,
    round(sum(line_net_amount), 2) as net_revenue,
    round(sum(quantity), 2) as invoiced_units
FROM public.sales_lines
WHERE invoice_date is not null
GROUP BY
    extract(year from invoice_date),
    extract(month from invoice_date),
    date_trunc('month', invoice_date)
ORDER BY year, month;
