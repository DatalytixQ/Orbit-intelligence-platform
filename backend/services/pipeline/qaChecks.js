/**
 * Runs QA checks on the parsed data based on the entity
 * Returns { ok, errors }
 */
function runQAChecks(entity, data) {
  const errors = [];
  
  data.forEach((row, idx) => {
    const rowNum = idx + 2; // +1 for 0-index, +1 for header
    
    // Global checks (all entities)
    if (!row.source_system) errors.push({ row: rowNum, msg: 'Missing source_system', col: 'source_system' });
    if (!row.client_id) errors.push({ row: rowNum, msg: 'Missing client_id', col: 'client_id' });
    if (!row.snapshot_ts) errors.push({ row: rowNum, msg: 'Missing snapshot_ts', col: 'snapshot_ts' });

    // Entity specific checks
    if (entity === 'inventory') {
      if (!row.item_id) errors.push({ row: rowNum, msg: 'Missing item_id', col: 'item_id' });
    }
    
    else if (entity === 'sales') {
      if (!row.invoice_internal_id) errors.push({ row: rowNum, msg: 'Missing invoice_internal_id', col: 'invoice_internal_id' });
      if (!row.customer_id) errors.push({ row: rowNum, msg: 'Missing customer_id', col: 'customer_id' });
    }

    else if (entity === 'inbound_shipments') {
      if (!row.po_number) errors.push({ row: rowNum, msg: 'Missing po_number', col: 'po_number' });
    }
    
    // We only record first 50 errors to prevent flooding log tables
    if (errors.length >= 50) return;
  });

  return {
    ok: errors.length === 0,
    errors: errors.slice(0, 50)
  };
}

module.exports = { runQAChecks };
