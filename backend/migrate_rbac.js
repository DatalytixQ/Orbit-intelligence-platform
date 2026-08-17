require('dotenv').config({path: '../.env'});
const sql = require('./db');

async function up() {
  console.log("Starting RBAC migration...");
  
  // 1. Create app_areas table
  await sql`
    CREATE TABLE IF NOT EXISTS public.app_areas (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      client_id TEXT NOT NULL,
      name TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `;
  console.log("Created app_areas");

  // 2. Create app_roles table
  await sql`
    CREATE TABLE IF NOT EXISTS public.app_roles (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      area_id UUID NOT NULL REFERENCES public.app_areas(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      is_admin BOOLEAN DEFAULT false,
      permissions JSONB DEFAULT '[]'::jsonb,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `;
  console.log("Created app_roles");

  // 3. Add columns to app_users (allow null temporarily for migration)
  await sql`
    ALTER TABLE public.app_users 
    ADD COLUMN IF NOT EXISTS area_id UUID REFERENCES public.app_areas(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS role_id UUID REFERENCES public.app_roles(id) ON DELETE SET NULL
  `;
  console.log("Altered app_users");

  // 4. Migrate existing users (admin@vonderk.com)
  const users = await sql`SELECT * FROM public.app_users`;
  for (const user of users) {
    if (!user.area_id) {
      // Create area
      const area = await sql`
        INSERT INTO public.app_areas (client_id, name)
        VALUES (${user.client_id}, 'Directorio')
        RETURNING id
      `;
      const areaId = area[0].id;

      // Create role
      const role = await sql`
        INSERT INTO public.app_roles (area_id, name, is_admin, permissions)
        VALUES (${areaId}, 'SuperAdministrador', true, '["home", "inventory", "sales", "finance", "supply", "insights", "dso", "admin"]')
        RETURNING id
      `;
      const roleId = role[0].id;

      // Update user
      await sql`
        UPDATE public.app_users
        SET area_id = ${areaId}, role_id = ${roleId}
        WHERE id = ${user.id}
      `;
      console.log(`Migrated user ${user.email}`);
    }
  }

  // 5. Drop old role column
  try {
    await sql`ALTER TABLE public.app_users DROP COLUMN role`;
    console.log("Dropped old role column");
  } catch (e) {
    console.log("Old role column might not exist or already dropped.");
  }

  console.log("Migration complete.");
  process.exit(0);
}

up().catch(e => {
  console.error("Migration failed", e);
  process.exit(1);
});
