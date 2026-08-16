const { Client } = require('pg'); 
const c = new Client('postgresql://postgres:postgres@localhost:54322/postgres'); 
c.connect()
  .then(() => c.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE';"))
  .then(r => console.log('TABLES:\n' + r.rows.map(x=>x.table_name).join('\n')))
  .then(() => c.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_type='VIEW';"))
  .then(r => console.log('VIEWS:\n' + r.rows.map(x=>x.table_name).join('\n')))
  .catch(console.error)
  .finally(()=>c.end());
