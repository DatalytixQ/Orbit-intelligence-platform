const fs = require('fs');
const path = require('path');
const sql = require('./db');

async function run() {
  try {
    const file = path.join(__dirname, '../sql/n042_dso_executive_analytics_fix.sql');
    const content = fs.readFileSync(file, 'utf8');
    
    // Split by statement and execute
    const statements = content.split(';').map(s => s.trim()).filter(s => s.length > 0);
    
    for (const stmt of statements) {
      console.log("Executing:", stmt.substring(0, 50) + "...");
      await sql.unsafe(stmt);
    }
    console.log("SQL Fix Apply Successful");
  } catch(e) { 
    console.error(e); 
  }
  process.exit(0);
}
run();
