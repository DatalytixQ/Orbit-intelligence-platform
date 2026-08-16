const lowerHeaders = [
  '"source_system',
  'client_id',
  'snapshot_ts',
  'invoice_internal_id',
  'document_number',
  'customer_id',
  'invoice_date',
  'due_date',
  'document_type',
  'document_status',
  'payment_terms',
  'currency',
  'exchange_rate',
  'subsidiary_id',
  'amount_total',
  'amount_paid',
  'open_balance"'
];

const required_cols = ['source_system','client_id','snapshot_ts','invoice_internal_id','customer_id','open_balance'];
const missingCols = [];

for (const reqCol of required_cols) {
  let sourceCol = reqCol;
  
  if (['source_system', 'client_id', 'snapshot_ts'].includes(sourceCol)) continue;

  if (!lowerHeaders.includes(sourceCol.toLowerCase()) && !lowerHeaders.includes(`"${sourceCol.toLowerCase()}`)) {
    let found = false;
    for (const h of lowerHeaders) {
       if (h.replace(/"/g, '') === sourceCol.toLowerCase()) {
          found = true; break;
       }
    }
    if (!found) {
       missingCols.push(sourceCol);
    }
  }
}

console.log('Missing:', missingCols);
