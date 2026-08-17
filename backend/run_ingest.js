const fs = require('fs');
const path = require('path');
const { processFile } = require('./services/pipeline/csvIngestor');

async function run() {
  const inboundDir = path.join(__dirname, '../inbound');
  const files = fs.readdirSync(inboundDir);
  
  console.log(`Found ${files.length} files to ingest.`);
  
  for (const file of files) {
    if (file.endsWith('.csv')) {
      console.log(`\nProcessing ${file}...`);
      const result = await processFile(file);
      console.log(`Result for ${file}:`, result);
    }
  }
  
  console.log('\nAll files processed.');
  process.exit(0);
}

run();
