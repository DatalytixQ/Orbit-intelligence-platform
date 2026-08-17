const sql = require('./db');
async function run() {
  try {
    const cols = await sql`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = 'app_users'
      ORDER BY ordinal_position
    `;
    console.log('=== APP_USERS COLUMNS ===');
    console.log(JSON.stringify(cols, null, 2));

    const roles = await sql`SELECT * FROM public.app_roles`;
    console.log('\n=== APP_ROLES ===');
    console.log(JSON.stringify(roles, null, 2));

    const users = await sql`SELECT id, client_id, email, full_name, role_id, is_active FROM public.app_users`;
    console.log('\n=== APP_USERS ===');
    console.log(JSON.stringify(users, null, 2));

    const roleReports = await sql`SELECT * FROM public.app_role_reports LIMIT 20`;
    console.log('\n=== APP_ROLE_REPORTS ===');
    console.log(JSON.stringify(roleReports, null, 2));

    const clients = await sql`SELECT * FROM public.clients`;
    console.log('\n=== CLIENTS ===');
    console.log(JSON.stringify(clients, null, 2));

  } catch(e) { console.error('ERROR:', e.message); }
  process.exit(0);
}
run();
