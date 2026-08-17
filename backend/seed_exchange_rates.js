require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });
const postgres = require('postgres');
const sql = postgres(process.env.DATABASE_URL);
(async () => {
  try {
    await sql`DELETE FROM raw_ns_exchange_rates`;
    const rates = [
      { id: '1', name: 'Peso Argentino', symbol: 'ARS', rate: 1.0 },
      { id: '2', name: 'US Dollar',      symbol: 'USD', rate: 1520.0 },
      { id: '3', name: 'Canadian Dollar',symbol: 'CAD', rate: 1075.49 },
      { id: '4', name: 'Euro',           symbol: 'EUR', rate: 1728.71 },
      { id: '5', name: 'Peso Uruguayo',  symbol: 'UYU', rate: 37.21 },
      { id: '6', name: 'Yuan',           symbol: 'CNY', rate: 159.25 }
    ];
    for (const r of rates) {
      await sql`INSERT INTO raw_ns_exchange_rates 
        (id, currency_name, currency_symbol, exchangerate, source_system, client_id, snapshot_ts)
        VALUES (${r.id}, ${r.name}, ${r.symbol}, ${r.rate}, 'netsuite', 'vonderk', NOW())`;
    }
    const check = await sql`SELECT currency_symbol, exchangerate FROM raw_ns_exchange_rates ORDER BY currency_symbol`;
    console.log('Exchange rates cargados:');
    check.forEach(r => console.log('  ' + r.currency_symbol + ': ' + r.exchangerate));
  } catch(e) {
    console.error('ERROR:', e.message);
  } finally {
    await sql.end();
  }
})();
