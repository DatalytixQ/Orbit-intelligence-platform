const fs = require('fs').promises;
const path = require('path');
const { processFile } = require('../services/pipeline/csvIngestor');

const INBOUND_DIR = path.join(__dirname, '../../inbound');

const FILE_MAPPING = {
  'inventario jun8.csv': 'inventory_20260608.csv',
  'sales jun8.csv': 'sales_20260608.csv',
  'sales lines jun8.csv': 'sales_lines_20260608.csv',
  'ar open items jun8 real.csv': 'ar_open_items_20260608.csv',
  'envios pendientes jun8.csv': 'inbound_shipments_20260608.csv',
  'demanda comprometida jun8.csv': 'open_sales_orders_20260608.csv',
  'pagos clientes csv jun8.csv': 'customer_payments_20260608.csv',
  'transacciones inventario jun8.csv': 'inventory_transactions_20260608.csv'
};

async function run() {
  console.log("=== Normalizing and Processing Inbound Files ===");
  try {
    const files = await fs.readdir(INBOUND_DIR);
    
    // 1. Rename files
    for (const file of files) {
      if (FILE_MAPPING[file]) {
        const oldPath = path.join(INBOUND_DIR, file);
        const newPath = path.join(INBOUND_DIR, FILE_MAPPING[file]);
        await fs.rename(oldPath, newPath);
        console.log(`Renamed: '${file}' -> '${FILE_MAPPING[file]}'`);
      }
    }

    // 2. Process all .csv files in inbound
    const updatedFiles = await fs.readdir(INBOUND_DIR);
    for (const file of updatedFiles) {
      if (file.endsWith('.csv')) {
        console.log(`\nProcessing: ${file}...`);
        const result = await processFile(file);
        console.log(`Result for ${file}:`, result);
      }
    }
    
    console.log("\n=== Finished Processing ===");
  } catch(e) {
    console.error("ERROR:", e);
  }
  process.exit();
}

run();
