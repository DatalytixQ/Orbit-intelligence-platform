require('dotenv').config();
const { Client } = require('pg');

async function run() {
  console.log("🚀 Iniciando Simulación de Captura ETL (NetSuite -> Supabase DB)...");

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log("Conectado a la base de datos.");

    // 1. Creación de tablas crudas (raw)
    console.log("1. Creando tablas crudas de Tesorería...");
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS raw_gl_transactions (
          id SERIAL PRIMARY KEY,
          client_id TEXT,
          transaction_id TEXT,
          account_type TEXT,
          amount NUMERIC,
          transaction_date DATE,
          cashflow_category TEXT,
          source_system TEXT
      );
      CREATE TABLE IF NOT EXISTS raw_bank_balances (
          id SERIAL PRIMARY KEY,
          client_id TEXT,
          account_name TEXT,
          currency TEXT,
          balance NUMERIC,
          snapshot_date DATE,
          source_system TEXT
      );
      CREATE TABLE IF NOT EXISTS raw_ap_open_items (
          id SERIAL PRIMARY KEY,
          client_id TEXT,
          vendor_name TEXT,
          document_number TEXT,
          due_date DATE,
          amount_remaining NUMERIC,
          currency TEXT,
          source_system TEXT
      );
    `);

    console.log("✅ Tablas creadas/verificadas correctamente.");

    // 2. Limpiando datos viejos
    await client.query("DELETE FROM raw_bank_balances WHERE client_id = 'vonderk'");
    await client.query("DELETE FROM raw_gl_transactions WHERE client_id = 'vonderk'");

    // 3. Insertando Data Realista
    console.log("2. Capturando e insertando datos reales de NetSuite (Simulado)...");
    
    // Bank Balances
    const insertBank = `
      INSERT INTO raw_bank_balances (client_id, account_name, currency, balance, snapshot_date, source_system)
      VALUES 
      ('vonderk', 'Santander Corriente', 'ARS', 45.1, '2024-05-31', 'NetSuite'),
      ('vonderk', 'Galicia Recaudadora', 'ARS', 32.0, '2024-05-31', 'NetSuite'),
      ('vonderk', 'Citi NY Inversiones', 'USD', 58.0, '2024-05-31', 'NetSuite');
    `;
    await client.query(insertBank);
    console.log("✅ Saldos bancarios guardados.");

    // GL Transactions
    const insertGL = `
      INSERT INTO raw_gl_transactions (client_id, transaction_id, account_type, amount, transaction_date, cashflow_category, source_system)
      VALUES 
      ('vonderk', 'JE-101', 'Income', 150.2, '2024-05-15', 'CFO', 'NetSuite'),
      ('vonderk', 'JE-102', 'Expense', -105.0, '2024-05-20', 'CFO', 'NetSuite'),
      ('vonderk', 'JE-103', 'Asset', -18.5, '2024-05-10', 'CAPEX', 'NetSuite'),
      ('vonderk', 'JE-104', 'Liability', -12.0, '2024-05-25', 'CFF', 'NetSuite');
    `;
    await client.query(insertGL);
    console.log("✅ Transacciones GL guardadas.");

  } catch (error) {
    console.error("Error ejecutando queries:", error);
  } finally {
    await client.end();
    console.log("🏁 Proceso de Captura ETL (Simulado) completado.");
  }
}

run();
