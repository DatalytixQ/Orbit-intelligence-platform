require('dotenv').config();
const sql = require('./db.js');
const fs = require('fs');

async function run() {
  try {
    const raw = await sql`
      SELECT 
        c.customer_name as cliente,
        concat_ws(', ', c.city, c.state, c.country) as direccion,
        c.phone as telefono,
        'N/A (No en BD)' as contacto,
        'N/A' as puesto,
        (SELECT document_number FROM public.raw_open_sales_orders o WHERE o.customer_id = c.customer_internal_id ORDER BY transaction_date DESC NULLS LAST LIMIT 1) as ultima_ov,
        (SELECT transaction_date FROM public.raw_open_sales_orders o WHERE o.customer_id = c.customer_internal_id ORDER BY transaction_date DESC NULLS LAST LIMIT 1) as ultima_ov_fecha,
        COALESCE(SUM(CAST(s.amount_net AS numeric)), 0) as total_facturado_2026
      FROM public.customers c
      LEFT JOIN public.raw_sales s ON s.customer_id = c.customer_internal_id AND CAST(s.invoice_date AS text) LIKE '2026%'
      GROUP BY c.customer_internal_id, c.customer_name, c.city, c.state, c.country, c.phone
      ORDER BY total_facturado_2026 DESC
      LIMIT 100;
    `;

    let md = '# Reporte de Clientes 2026\\n\\n';
    md += '| Cliente | Dirección | Teléfono | Contacto | Puesto | Última OV | Fecha Última OV | Total Facturado 2026 |\\n';
    md += '|---|---|---|---|---|---|---|---|\\n';
    
    raw.forEach(r => {
      const facturado = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(r.total_facturado_2026);
      md += `| **${r.cliente || 'N/A'}** | ${r.direccion || 'N/A'} | ${r.telefono || 'N/A'} | ${r.contacto} | ${r.puesto} | ${r.ultima_ov || 'Sin OV'} | ${r.ultima_ov_fecha || 'N/A'} | **${facturado}** |\\n`;
    });

    fs.writeFileSync('C:/Users/dario/.gemini/antigravity/brain/b55d750e-5112-435c-b7d3-7d172d1935bf/reporte_clientes_2026.md', md);
    console.log('Report generated successfully');
  } catch(e) {
    console.error(e.message);
  }
  process.exit(0);
}
run();
