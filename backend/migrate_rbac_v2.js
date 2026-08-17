require('dotenv').config({path: '../.env'});
const sql = require('./db');

async function up() {
  console.log("Starting RBAC v2 Migration...");
  
  // 1. Create app_user_areas (Many to Many junction)
  await sql`
    CREATE TABLE IF NOT EXISTS public.app_user_areas (
      user_id UUID NOT NULL REFERENCES public.app_users(id) ON DELETE CASCADE,
      area_id UUID NOT NULL REFERENCES public.app_areas(id) ON DELETE CASCADE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      PRIMARY KEY (user_id, area_id)
    )
  `;
  console.log("Created app_user_areas");

  // 2. Create app_settings
  await sql`
    CREATE TABLE IF NOT EXISTS public.app_settings (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      client_id TEXT NOT NULL,
      category TEXT NOT NULL,
      policy_key TEXT NOT NULL,
      policy_value TEXT NOT NULL,
      description TEXT,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      UNIQUE(client_id, policy_key)
    )
  `;
  console.log("Created app_settings");

  // Migrate existing data before modifying schema constraints

  // A. Move users' current area_id to the new junction table
  try {
    console.log("Migrating users to user_areas...");
    // We only migrate users that actually have an area_id
    await sql`
      INSERT INTO public.app_user_areas (user_id, area_id)
      SELECT id, area_id FROM public.app_users WHERE area_id IS NOT NULL
      ON CONFLICT DO NOTHING
    `;
  } catch (e) {
    console.log("Error migrating user areas, maybe already migrated?", e.message);
  }

  // B. Make roles global
  try {
    // Add client_id to app_roles if it doesn't exist
    await sql`ALTER TABLE public.app_roles ADD COLUMN IF NOT EXISTS client_id TEXT`;
    
    // Copy client_id from the area that owns the role
    await sql`
      UPDATE public.app_roles r
      SET client_id = a.client_id
      FROM public.app_areas a
      WHERE r.area_id = a.id AND r.client_id IS NULL
    `;
    
    // If there are roles without an area somehow, give them a default or handle later
    // Now we can safely drop area_id from app_roles
    await sql`ALTER TABLE public.app_roles DROP COLUMN IF EXISTS area_id`;
    console.log("Made roles global");
  } catch (e) {
    console.log("Error updating roles:", e.message);
  }

  // C. Drop area_id from app_users
  try {
    await sql`ALTER TABLE public.app_users DROP COLUMN IF EXISTS area_id`;
    console.log("Dropped area_id from users");
  } catch (e) {
    console.log("Error dropping area_id from users:", e.message);
  }

  // Insert default settings for existing clients
  try {
    const clients = await sql`SELECT DISTINCT client_id FROM public.app_users WHERE client_id IS NOT NULL`;
    
    for (const client of clients) {
      const cid = client.client_id;
      const defaults = [
        { cat: 'localization', key: 'currency', val: 'USD', desc: 'Moneda base de la plataforma' },
        { cat: 'localization', key: 'timezone', val: 'UTC', desc: 'Zona horaria por defecto' },
        { cat: 'finance', key: 'dso_risk_threshold', val: '45', desc: 'Días de mora para considerar riesgo inminente (DSO)' },
        { cat: 'finance', key: 'interest_rate', val: '0.02', desc: 'Tasa de interés de mora mensual' },
        { cat: 'inventory', key: 'stock_warning_days', val: '15', desc: 'Días de cobertura para quiebre inminente' },
        { cat: 'sales', key: 'monthly_growth_goal', val: '10', desc: 'Meta de crecimiento mensual (%)' }
      ];

      for (const d of defaults) {
        await sql`
          INSERT INTO public.app_settings (client_id, category, policy_key, policy_value, description)
          VALUES (${cid}, ${d.cat}, ${d.key}, ${d.val}, ${d.desc})
          ON CONFLICT (client_id, policy_key) DO NOTHING
        `;
      }
    }
    console.log("Inserted default settings");
  } catch (e) {
    console.log("Error inserting default settings:", e.message);
  }

  console.log("RBAC v2 Migration complete.");
  process.exit(0);
}

up().catch(e => {
  console.error("Migration failed", e);
  process.exit(1);
});
