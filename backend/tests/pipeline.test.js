const fs = require('fs');
const path = require('path');
const { processFile } = require('../services/pipeline/csvIngestor');

async function runTest() {
  console.log("=== Testing Pipeline ===");
  
  const inboundDir = path.join(__dirname, '../../inbound');
  
  // Create a copy of one of the current files to simulate a new drop
  // We use "inventario jun8.csv" but renamed to "inventory_20260608.csv"
  const sourceFile = path.join(inboundDir, 'inventario jun8.csv');
  const testFile = 'inventory_20260608.csv';
  const testFilePath = path.join(inboundDir, testFile);
  
  if (!fs.existsSync(sourceFile)) {
    console.error(`Source file not found: ${sourceFile}`);
    process.exit(1);
  }

  // Copy file for testing
  fs.copyFileSync(sourceFile, testFilePath);
  console.log(`Copied test file: ${testFile}`);

  console.log("Running processFile...");
  const result = await processFile(testFile);
  
  console.log("Result:");
  console.log(JSON.stringify(result, null, 2));

  // Check if file moved
  const processedDir = path.join(__dirname, '../../processed/20260608');
  const movedFilePath = path.join(processedDir, testFile);
  if (fs.existsSync(movedFilePath)) {
    console.log(`Success: File was moved to ${movedFilePath}`);
  } else {
    console.error(`Failed: File was NOT moved to ${movedFilePath}`);
  }

  process.exit(0);
}

runTest();
