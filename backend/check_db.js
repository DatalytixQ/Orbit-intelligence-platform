const sql = require('./db');
async function run() {
  try {
    const areas = await sql`
      SELECT 
        a.id, a.name, a.created_at,
        (SELECT COUNT(DISTINCT user_id) FROM public.app_user_areas u WHERE u.area_id = a.id) as users_count
      FROM public.app_areas a
      WHERE a.client_id = 'test'
      ORDER BY a.name ASC
    `;
    console.log('areas:', areas);
  } catch (e) {
    console.error(e);
  } finally {
    sql.end();
  }
}
run();
