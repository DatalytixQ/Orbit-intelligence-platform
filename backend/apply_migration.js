const sql = require('./db');
async function run() {
  try {
    await sql`ALTER TABLE public.app_users ADD COLUMN IF NOT EXISTS language_preference VARCHAR(5) DEFAULT NULL`;
    console.log('✅ app_users.language_preference added');
    
    await sql`ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS default_language VARCHAR(5) DEFAULT 'es'`;
    console.log('✅ clients.default_language added');
    
    await sql`UPDATE public.clients SET default_language = 'es' WHERE client_id = 'vonderk'`;
    console.log('✅ vonderk default_language set to es');
    
  } catch(e) { console.error('ERROR:', e.message); }
  process.exit(0);
}
run();
