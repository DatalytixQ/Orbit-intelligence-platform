const express = require("express");
const router = express.Router();
const sql = require("../db");

// GET /api/supply/pipeline-summary
router.get("/pipeline-summary", async (req, res) => {
  try {
    const d = req.query.date || new Date().toISOString().split('T')[0];
    const result = await sql`
      WITH pvs AS (
        SELECT * FROM public.fn_sales_pipeline_vs_supply(${d}::date)
      )
      SELECT 
        SUM(pending_revenue) AS pipeline_revenue,
        SUM(deliverable_revenue) AS deliverable_revenue,
        SUM(revenue_at_supply_risk) AS revenue_at_supply_risk,
        SUM(pending_margin) AS pipeline_margin,
        CASE WHEN SUM(pending_revenue) > 0 THEN (SUM(deliverable_revenue) / SUM(pending_revenue)) * 100 ELSE 0 END AS deliverable_pct,
        CASE WHEN SUM(pending_revenue) > 0 THEN (SUM(revenue_at_supply_risk) / SUM(pending_revenue)) * 100 ELSE 0 END AS supply_risk_pct
      FROM pvs
    `;
    res.json(result[0] || {
      pipeline_revenue: 0,
      deliverable_revenue: 0,
      revenue_at_supply_risk: 0,
      deliverable_pct: 0,
      supply_risk_pct: 0
    });
  } catch (e) {
    console.error("Error fetching pipeline summary:", e);
    res.status(500).json({ ok: false, error: e.message });
  }
});

// GET /api/supply/pipeline-vs-supply
router.get("/pipeline-vs-supply", async (req, res) => {
  try {
    const d = req.query.date || new Date().toISOString().split('T')[0];
    const result = await sql`SELECT * FROM public.fn_sales_pipeline_vs_supply(${d}::date) ORDER BY revenue_at_supply_risk DESC NULLS LAST LIMIT 100`;
    res.json(result);
  } catch (e) {
    console.error("Error fetching pipeline vs supply:", e);
    res.status(500).json({ ok: false, error: e.message });
  }
});

// GET /api/supply/risk-by-customer
router.get("/risk-by-customer", async (req, res) => {
  try {
    const d = req.query.date || new Date().toISOString().split('T')[0];
    const result = await sql`
      WITH pvs AS (
        SELECT * FROM public.fn_sales_pipeline_vs_supply(${d}::date)
      )
      SELECT 
        c.customer_internal_id AS customer_id,
        c.customer_name,
        COUNT(DISTINCT pvs.document_number) AS orders_affected,
        SUM(pvs.revenue_at_supply_risk) AS revenue_at_supply_risk,
        MIN(pvs.expected_ship_date) AS earliest_compromise_date,
        CASE 
          WHEN SUM(pvs.revenue_at_supply_risk) > 50000 THEN 'Crítico'
          ELSE 'Riesgo'
        END AS risk_status
      FROM pvs
      JOIN public.stg_customers_clean c ON c.customer_internal_id = pvs.customer_id
      WHERE pvs.revenue_at_supply_risk > 0
      GROUP BY c.customer_internal_id, c.customer_name
      ORDER BY revenue_at_supply_risk DESC NULLS LAST
    `;
    res.json(result);
  } catch (e) {
    console.error("Error fetching supply risk by customer:", e);
    res.status(500).json({ ok: false, error: e.message });
  }
});

// GET /api/supply/inbound-timeline
router.get("/inbound-timeline", async (req, res) => {
  try {
    const d = req.query.date || new Date().toISOString().split('T')[0];
    
    const criticalItems = await sql`
        SELECT DISTINCT item_id 
        FROM public.fn_sales_pipeline_vs_supply(${d}::date) 
        WHERE revenue_at_supply_risk > 0
    `;
    
    const hasRiskItems = criticalItems.length > 0;
    const itemIds = criticalItems.map(i => i.item_id);
    
    let result = [];
    if (hasRiskItems) {
      result = await sql`
        SELECT 
          COALESCE(po_number, inbound_shipment_number, po_internal_id) as shipment_id,
          MAX(inbound_shipment_status) as status,
          SUM(quantity_inbound) as inbound_qty,
          MIN(expected_delivery_date) as next_expected_date,
          true as is_critical
        FROM public.stg_inbound_shipments_clean
        WHERE item_internal_id = ANY(${itemIds}) AND quantity_inbound > 0
        GROUP BY COALESCE(po_number, inbound_shipment_number, po_internal_id)
        ORDER BY next_expected_date ASC NULLS LAST
      `;
    }
    
    if (!hasRiskItems || result.length === 0) {
      result = await sql`
        SELECT 
          COALESCE(po_number, inbound_shipment_number, po_internal_id) as shipment_id,
          MAX(inbound_shipment_status) as status,
          SUM(quantity_inbound) as inbound_qty,
          MIN(expected_delivery_date) as next_expected_date,
          false as is_critical
        FROM public.stg_inbound_shipments_clean
        WHERE quantity_inbound > 0
        GROUP BY COALESCE(po_number, inbound_shipment_number, po_internal_id)
        ORDER BY next_expected_date ASC NULLS LAST
        LIMIT 5
      `;
    }

    const mappedResult = result.map(r => ({
      item_id: r.shipment_id || 'N/A',
      item_name: `OC / Embarque: ${r.shipment_id || 'N/A'} (${r.status || 'En Tránsito'})`,
      inbound_qty: r.inbound_qty,
      next_expected_date: r.next_expected_date,
      is_critical: r.is_critical
    }));

    res.json(mappedResult);
  } catch (e) {
    console.error("Error fetching inbound timeline:", e);
    res.status(500).json({ ok: false, error: e.message });
  }
});

// GET /api/supply/insights
router.get("/insights", async (req, res) => {
  try {
    const d = req.query.date || new Date().toISOString().split('T')[0];
    const insights = [];
    
    const pipeline = await sql`SELECT * FROM public.fn_sales_pipeline_vs_supply(${d}::date)`;
    
    const totalRisk = pipeline.reduce((sum, row) => sum + Number(row.revenue_at_supply_risk || 0), 0);
    const totalMarginRisk = pipeline.reduce((sum, row) => sum + (Number(row.revenue_at_supply_risk || 0) > 0 ? Number(row.pending_margin || 0) : 0), 0);
    
    const pastOrders = pipeline.filter(r => new Date(r.expected_ship_date) < new Date(d));
    const totalBacklog = pastOrders.reduce((sum, row) => sum + Number(row.pending_revenue || 0), 0);
    
    if (totalRisk > 0) {
      const items = {};
      pipeline.forEach(r => {
        if (Number(r.revenue_at_supply_risk) > 0) {
          items[r.item_name] = (items[r.item_name] || 0) + Number(r.revenue_at_supply_risk);
        }
      });
      const topItem = Object.entries(items).sort((a,b) => b[1] - a[1])[0];
      const pct = Math.round((topItem[1] / totalRisk) * 100);
      
      insights.push({
        rule_id: 'E001',
        severidad: 'critico',
        regla: 'Riesgo de Abastecimiento',
        recomendacion: `El ${pct}% del riesgo (${new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(totalRisk)}) proviene del ítem "${topItem[0]}". Acción: Acelerar entregas de OCs en tránsito o buscar suministro local de emergencia.`,
      });
    }
    
    if (totalMarginRisk > 0) {
      insights.push({
        rule_id: 'E002',
        severidad: 'alerta',
        regla: 'Margen Comprometido',
        recomendacion: `Rentabilidad en riesgo por ${new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(totalMarginRisk)}. Acción: Evaluar proveedores alternativos para proteger el margen de las órdenes afectadas.`,
      });
    }
    
    if (totalBacklog > 0) {
      insights.push({
        rule_id: 'S001',
        severidad: 'alerta',
        regla: 'Backlog Vencido',
        recomendacion: `Existen ${pastOrders.length} órdenes vencidas previas a la fecha de proyección. Acción: Sincronizar nuevas fechas de entrega con el equipo de Ventas.`,
      });
    }
    
    res.json(insights);
  } catch (e) {
    console.error("Error fetching supply insights:", e);
    res.status(500).json({ ok: false, error: e.message });
  }
});
// GET /api/supply/network
router.get("/network", async (req, res) => {
  try {
    const client_id = req.user?.client_id;
    // We will build nodes and edges from stg_inbound_shipments_clean
    const shipments = await sql`
      SELECT 
        vendor_id, 
        item_internal_id, 
        location_id, 
        SUM(quantity_inbound) as total_qty 
      FROM stg_inbound_shipments_clean 
      ${client_id ? sql`WHERE client_id = ${client_id}` : sql``}
      GROUP BY vendor_id, item_internal_id, location_id
    `;
    
    const items = await sql`
      SELECT item_id, item_name 
      FROM stg_items_master_clean
      ${client_id ? sql`WHERE client_id = ${client_id}` : sql``}
    `;
    const itemMap = {};
    items.forEach(i => itemMap[i.item_id] = i.item_name);

    const nodes = [];
    const edges = [];
    const addedNodes = new Set();

    shipments.forEach(s => {
      const vendorNodeId = `vendor_${s.vendor_id || 'unknown'}`;
      const itemNodeId = `item_${s.item_internal_id}`;
      const locationNodeId = `loc_${s.location_id || 'unknown'}`;

      if (!addedNodes.has(vendorNodeId)) {
        nodes.push({ id: vendorNodeId, group: "vendor", label: `Proveedor ${s.vendor_id || 'Desconocido'}` });
        addedNodes.add(vendorNodeId);
      }
      if (!addedNodes.has(itemNodeId)) {
        nodes.push({ id: itemNodeId, group: "item", label: itemMap[s.item_internal_id] || `Item ${s.item_internal_id}` });
        addedNodes.add(itemNodeId);
      }
      if (!addedNodes.has(locationNodeId)) {
        nodes.push({ id: locationNodeId, group: "location", label: `Bodega ${s.location_id || 'Principal'}` });
        addedNodes.add(locationNodeId);
      }

      edges.push({ source: vendorNodeId, target: itemNodeId, value: Number(s.total_qty) });
      edges.push({ source: itemNodeId, target: locationNodeId, value: Number(s.total_qty) });
    });

    res.json({ nodes, edges });
  } catch (e) {
    console.error("Error fetching supply network:", e);
    res.status(500).json({ ok: false, error: e.message });
  }
});

module.exports = router;
