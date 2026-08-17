require("dotenv").config();
const sql = require("./db");
const bcrypt = require("bcryptjs");

async function seed() {
  try {
    console.log("Creando tablas de Auth si no existen...");
    await sql`
      CREATE TABLE IF NOT EXISTS public.clients (
        client_id VARCHAR(50) PRIMARY KEY,
        client_name VARCHAR(100) NOT NULL,
        is_active BOOLEAN DEFAULT true
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS public.app_roles (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        permissions JSONB DEFAULT '[]',
        is_admin BOOLEAN DEFAULT false
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS public.app_users (
        id SERIAL PRIMARY KEY,
        client_id VARCHAR(50) REFERENCES public.clients(client_id),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        full_name VARCHAR(100),
        role_id VARCHAR(50) REFERENCES public.app_roles(id),
        is_active BOOLEAN DEFAULT true
      );
    `;

    console.log("Insertando Cliente Vonderk...");
    await sql`
      INSERT INTO public.clients (client_id, client_name) 
      VALUES ('vonderk', 'Vonderk Corp')
      ON CONFLICT DO NOTHING;
    `;

    console.log("Insertando Roles...");
    const adminPermissions = JSON.stringify(['home', 'ventas', 'inventario', 'finanzas', 'tesoreria', 'crm', 'admin']);
    const comercialPermissions = JSON.stringify(['home', 'ventas', 'inventario']);
    const finanzasPermissions = JSON.stringify(['home', 'finanzas', 'tesoreria']);

    const adminRoleId = '11111111-1111-1111-1111-111111111111';
    const comercialRoleId = '22222222-2222-2222-2222-222222222222';
    const finanzasRoleId = '33333333-3333-3333-3333-333333333333';

    await sql`
      INSERT INTO public.app_roles (id, name, permissions, is_admin) VALUES 
      (${adminRoleId}::uuid, 'CEO / Administrador', ${adminPermissions}::jsonb, true),
      (${comercialRoleId}::uuid, 'Comercial', ${comercialPermissions}::jsonb, false),
      (${finanzasRoleId}::uuid, 'Finanzas', ${finanzasPermissions}::jsonb, false)
      ON CONFLICT (id) DO UPDATE SET permissions = EXCLUDED.permissions, is_admin = EXCLUDED.is_admin;
    `;

    console.log("Insertando Usuarios...");
    const ceoHash = await bcrypt.hash("Admin1234!", 10);
    const comHash = await bcrypt.hash("Comercial1234!", 10);

    // Darío CEO
    await sql`
      INSERT INTO public.app_users (client_id, email, password_hash, full_name, role_id)
      VALUES ('vonderk', 'darioquintas@yahoo.com', ${ceoHash}, 'Darío Quintas (CEO)', ${adminRoleId}::uuid)
      ON CONFLICT (email) DO UPDATE SET role_id = ${adminRoleId}::uuid, password_hash = ${ceoHash};
    `;

    // Darío Comercial
    await sql`
      INSERT INTO public.app_users (client_id, email, password_hash, full_name, role_id)
      VALUES ('vonderk', 'darioquintas92@hotmail.com', ${comHash}, 'Darío Quintas (Comercial)', ${comercialRoleId}::uuid)
      ON CONFLICT (email) DO UPDATE SET role_id = ${comercialRoleId}::uuid, password_hash = ${comHash};
    `;

    console.log("¡Seed exitoso! Usuarios creados con contraseña por defecto.");
    process.exit(0);
  } catch (error) {
    console.error("Error en seed:", error);
    process.exit(1);
  }
}

seed();
