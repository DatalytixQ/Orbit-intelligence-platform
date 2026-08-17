require('dotenv').config();
const sql = require('../db.js');

async function validateSales() {
  try {
    console.log('=== Inciando Validación de Integridad de Ventas ===\n');

    // 1. Count & Value Check por Mes
    console.log('--- 1. Validación de Montos y Conteos por Mes (RAW vs STG vs FINAL) ---');
    
    // RAW Sales (raw_sales)
    const rawSales = await sql`
      SELECT 
        posting_period,
        COUNT(DISTINCT invoice_internal_id) as raw_count,
        SUM(CAST(amount_net AS NUMERIC)) as raw_amount_net
      FROM raw_sales
      WHERE amount_net IS NOT NULL AND amount_net != ''
      GROUP BY posting_period
      ORDER BY posting_period
    `;
    
    // STG Sales (stg_sales_clean)
    const stgSales = await sql`
      SELECT 
        posting_period,
        COUNT(DISTINCT invoice_internal_id) as stg_count,
        SUM(amount_net) as stg_amount_net
      FROM stg_sales_clean
      GROUP BY posting_period
      ORDER BY posting_period
    `;
    
    // FINAL Sales (sales) - joined with date dimension if needed, or just grouping by invoice_date
    const finalSales = await sql`
      SELECT 
        TO_CHAR(fecha, 'Mon YYYY') as month,
        COUNT(DISTINCT invoice_internal_id) as final_count,
        SUM(amount_net) as final_amount_net
      FROM sales
      GROUP BY TO_CHAR(fecha, 'Mon YYYY')
      ORDER BY month
    `;
    
    console.log('\n[RAW Data]:');
    console.table(rawSales);
    
    console.log('\n[STG Data]:');
    console.table(stgSales);
    
    console.log('\n[FINAL Data]:');
    console.table(finalSales);

    // 2. Orphan Check (Sales vs Sales Lines)
    console.log('\n--- 2. Validación de Integridad Relacional (Orphan Check) ---');
    const orphanLines = await sql`
      SELECT COUNT(*) as orphan_lines
      FROM sales_lines sl
      LEFT JOIN sales s ON sl.invoice_id = s.invoice_internal_id
      WHERE s.invoice_internal_id IS NULL
    `;
    
    const orphanInvoices = await sql`
      SELECT COUNT(*) as orphan_invoices
      FROM sales s
      LEFT JOIN sales_lines sl ON s.invoice_internal_id = sl.invoice_id
      WHERE sl.invoice_id IS NULL
    `;

    console.log(`Líneas de venta sin factura asociada: ${orphanLines[0].orphan_lines}`);
    console.log(`Facturas sin líneas de detalle asociadas: ${orphanInvoices[0].orphan_invoices}`);

    // 3. Ventas por Representante (Top 5 Representantes)
    console.log('\n--- 3. Top 5 Representantes de Venta (Volumen ARS) ---');
    const topReps = await sql`
      SELECT 
        c.sales_rep,
        SUM(s.amount_ars) as total_ventas
      FROM sales s
      JOIN customers c ON s.customer_internal_id = c.customer_internal_id
      GROUP BY c.sales_rep
      ORDER BY total_ventas DESC
      LIMIT 10
    `;
    
    console.table(topReps);

    console.log('\n=== Validación Completada ===');

  } catch (error) {
    console.error('Error durante la validación:', error);
  } finally {
    process.exit(0);
  }
}

validateSales();
