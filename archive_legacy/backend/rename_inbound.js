const fs = require('fs');
const path = require('path');

const inboundDir = path.join(__dirname, '../inbound');
const suffix = '_20260720';

const files = fs.readdirSync(inboundDir);

const mappings = {
  'demanda comprometida.csv': 'open_sales_orders',
  'envios pendientes.csv': 'inbound_shipments'
};

for (const file of files) {
  if (file.endsWith('.csv') && !file.includes('_20260720')) {
    let baseName = file.replace('.csv', '');
    
    // Check if it's in Spanish mappings
    if (mappings[file]) {
      baseName = mappings[file];
    } else {
      // Just replace spaces
      baseName = baseName.replace(' ', '_');
    }
    
    const newName = `${baseName}${suffix}.csv`;
    
    fs.renameSync(path.join(inboundDir, file), path.join(inboundDir, newName));
    console.log(`Renamed "${file}" to "${newName}"`);
  }
}
