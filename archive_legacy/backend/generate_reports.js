require('dotenv').config();
const sql = require('./db.js');
const fs = require('fs');

async function generateReports() {
  try {
    // Reporte 1: Totales por Mes
    const byMonth = await sql`
      SELECT 
        TO_CHAR(invoice_date, 'YYYY-MM') as month,
        COUNT(DISTINCT invoice_internal_id) as total_invoices,
        SUM(amount_net) as amount_net_total
      FROM stg_sales_clean
      GROUP BY TO_CHAR(invoice_date, 'YYYY-MM')
      ORDER BY month DESC
    `;
    
    // Reporte 2: Totales por Mes y Cliente
    const byMonthClient = await sql`
      SELECT 
        TO_CHAR(s.invoice_date, 'YYYY-MM') as month,
        c.customer_name,
        COUNT(DISTINCT s.invoice_internal_id) as total_invoices,
        SUM(s.amount_net) as amount_net_total
      FROM stg_sales_clean s
      LEFT JOIN customers c ON s.customer_id = c.customer_internal_id
      GROUP BY TO_CHAR(s.invoice_date, 'YYYY-MM'), c.customer_name
      ORDER BY month DESC, amount_net_total DESC
    `;

    console.log("=== Reporte Mensual ===");
    console.table(byMonth);
    
    console.log("\n=== Reporte Mensual por Cliente (Primeros 20) ===");
    console.table(byMonthClient.slice(0, 20));

    // Generar SQL para Supabase
    const supabaseSql = `
-- Reporte 1: Ventas Totales por Mes (desde tabla stg_sales_clean)
SELECT 
    TO_CHAR(invoice_date, 'YYYY-MM') as month,
    COUNT(DISTINCT invoice_internal_id) as total_invoices,
    SUM(amount_net) as amount_net_total
FROM public.stg_sales_clean
GROUP BY TO_CHAR(invoice_date, 'YYYY-MM')
ORDER BY month DESC;

-- Reporte 2: Ventas Totales por Mes y Cliente (desde tabla stg_sales_clean)
SELECT 
    TO_CHAR(s.invoice_date, 'YYYY-MM') as month,
    c.customer_name,
    COUNT(DISTINCT s.invoice_internal_id) as total_invoices,
    SUM(s.amount_net) as amount_net_total
FROM public.stg_sales_clean s
LEFT JOIN public.customers c ON s.customer_id = c.customer_internal_id
GROUP BY TO_CHAR(s.invoice_date, 'YYYY-MM'), c.customer_name
ORDER BY month DESC, amount_net_total DESC;
`;

    fs.writeFileSync('reporte_ventas.md', supabaseSql);
    console.log('SQL commands written to reporte_ventas.md');

  } catch(e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
}
generateReports();
