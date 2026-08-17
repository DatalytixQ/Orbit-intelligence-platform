require("dotenv").config();
const sql = require("./db");
const bcrypt = require("bcryptjs");

async function seed() {
  try {
    console.log("Limpiando tablas antiguas...");
    await sql`DROP TABLE IF EXISTS public.app_users CASCADE`;
    await sql`DROP TABLE IF EXISTS public.app_role_reports CASCADE`;
    await sql`DROP TABLE IF EXISTS public.app_reports CASCADE`;
    await sql`DROP TABLE IF EXISTS public.app_roles CASCADE`;
    await sql`DROP TABLE IF EXISTS public.app_areas CASCADE`;
    await sql`DROP TABLE IF EXISTS public.clients CASCADE`;

    console.log("Creando nuevas tablas (Estructura Relacional)...");
    
    await sql`
      CREATE TABLE public.clients (
        client_id VARCHAR(50) PRIMARY KEY,
        client_name VARCHAR(100) NOT NULL,
        is_active BOOLEAN DEFAULT true
      );
    `;

    await sql`
      CREATE TABLE public.app_areas (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100) NOT NULL,
        icon VARCHAR(50) DEFAULT 'Folder',
        sort_order INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true
      );
    `;

    await sql`
      CREATE TABLE public.app_reports (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        area_id UUID REFERENCES public.app_areas(id) ON DELETE CASCADE,
        name VARCHAR(100) NOT NULL,
        path VARCHAR(255) NOT NULL,
        is_active BOOLEAN DEFAULT true
      );
    `;

    await sql`
      CREATE TABLE public.app_roles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100) NOT NULL,
        is_admin BOOLEAN DEFAULT false,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE public.app_role_reports (
        role_id UUID REFERENCES public.app_roles(id) ON DELETE CASCADE,
        report_id UUID REFERENCES public.app_reports(id) ON DELETE CASCADE,
        can_update BOOLEAN DEFAULT false,
        PRIMARY KEY (role_id, report_id)
      );
    `;

    await sql`
      CREATE TABLE public.app_users (
        id SERIAL PRIMARY KEY,
        client_id VARCHAR(50) REFERENCES public.clients(client_id),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        full_name VARCHAR(100),
        role_id UUID REFERENCES public.app_roles(id),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;

    console.log("Insertando datos iniciales...");
    
    // 1. Cliente
    await sql`INSERT INTO public.clients (client_id, client_name) VALUES ('vonderk', 'Vonderk Corp')`;

    // 2. Áreas
    const areas = await sql`
      INSERT INTO public.app_areas (name, icon, sort_order) VALUES 
      ('Directorio Chile', 'Briefcase', 1),
      ('Directorio Argentina', 'Briefcase', 2),
      ('Marketing', 'BarChart', 3)
      RETURNING id, name
    `;

    const getAreaId = (name) => areas.find(a => a.name === name).id;

    // 3. Reportes
    const reports = await sql`
      INSERT INTO public.app_reports (area_id, name, path) VALUES 
      (${getAreaId('Directorio Chile')}, 'Directorio', '/mock-home'),
      (${getAreaId('Directorio Chile')}, 'Comercial', '/commercial-dashboard'),
      (${getAreaId('Directorio Chile')}, 'Finanzas', '/finance-dashboard'),
      (${getAreaId('Directorio Chile')}, 'Inventario', '/inventory-dashboard'),
      (${getAreaId('Directorio Chile')}, 'Tesorería', '/treasury-dashboard'),
      (${getAreaId('Directorio Chile')}, 'CRM & Oportunidades', '/crm-dashboard'),
      
      (${getAreaId('Directorio Argentina')}, 'Comercial', '/under-construction'),
      (${getAreaId('Directorio Argentina')}, 'Finanzas', '/under-construction'),

      (${getAreaId('Marketing')}, 'Performance', '/under-construction')
      RETURNING id, name
    `;

    // 4. Roles
    const roles = await sql`
      INSERT INTO public.app_roles (name, is_admin) VALUES 
      ('CEO / Administrador', true),
      ('Gerencia Comercial', false),
      ('Analista Financiero', false)
      RETURNING id, name
    `;

    const ceoRoleId = roles.find(r => r.name === 'CEO / Administrador').id;
    const comercialRoleId = roles.find(r => r.name === 'Gerencia Comercial').id;
    const financieroRoleId = roles.find(r => r.name === 'Analista Financiero').id;

    // 5. Asignar Reportes a Rol Comercial (ejemplo parcial)
    const comercialReportNames = ['Comercial', 'CRM & Oportunidades', 'Performance'];
    const comercialReportIds = reports.filter(r => comercialReportNames.includes(r.name)).map(r => r.id);
    
    for (const rid of comercialReportIds) {
      await sql`INSERT INTO public.app_role_reports (role_id, report_id, can_update) VALUES (${comercialRoleId}, ${rid}, true)`;
    }

    // Financiero
    const finanzasReportNames = ['Finanzas', 'Tesorería', 'Directorio'];
    const finanzasReportIds = reports.filter(r => finanzasReportNames.includes(r.name)).map(r => r.id);
    for (const rid of finanzasReportIds) {
      await sql`INSERT INTO public.app_role_reports (role_id, report_id, can_update) VALUES (${financieroRoleId}, ${rid}, false)`;
    }

    // 6. Usuarios
    const hash = await bcrypt.hash("Admin1234!", 10);
    await sql`
      INSERT INTO public.app_users (client_id, email, password_hash, full_name, role_id) VALUES 
      ('vonderk', 'darioquintas@yahoo.com', ${hash}, 'Darío Quintas (CEO)', ${ceoRoleId}),
      ('vonderk', 'darioquintas92@hotmail.com', ${hash}, 'Darío Comercial', ${comercialRoleId})
    `;

    console.log("¡Seed V2 Exitoso! Entorno relacional inicializado.");
    process.exit(0);

  } catch (error) {
    console.error("Error en seed V2:", error);
    process.exit(1);
  }
}

seed();
