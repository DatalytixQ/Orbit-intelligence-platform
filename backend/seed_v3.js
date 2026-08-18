require("dotenv").config();
const sql = require("./db");
const bcrypt = require("bcryptjs");

async function seed() {
  try {
    console.log("Limpiando tablas antiguas...");
    await sql`DROP TABLE IF EXISTS public.app_role_reports CASCADE`;
    await sql`DROP TABLE IF EXISTS public.app_user_areas CASCADE`;
    await sql`DROP TABLE IF EXISTS public.app_reports CASCADE`;
    await sql`DROP TABLE IF EXISTS public.app_areas CASCADE`;
    await sql`DROP TABLE IF EXISTS public.app_users CASCADE`;
    await sql`DROP TABLE IF EXISTS public.app_roles CASCADE`;
    await sql`DROP TABLE IF EXISTS public.app_settings CASCADE`;
    await sql`DROP TABLE IF EXISTS public.clients CASCADE`;

    console.log("Creando nuevas tablas (Estructura Relacional)...");
    
    await sql`
      CREATE TABLE public.clients (
        client_id VARCHAR(50) PRIMARY KEY,
        client_name VARCHAR(100) NOT NULL,
        is_active BOOLEAN DEFAULT true,
        default_language VARCHAR(5) DEFAULT 'es',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE public.app_settings (
        id SERIAL PRIMARY KEY,
        client_id VARCHAR(50) REFERENCES public.clients(client_id) ON DELETE CASCADE,
        setting_key VARCHAR(100) NOT NULL,
        setting_value JSONB NOT NULL,
        UNIQUE(client_id, setting_key)
      );
    `;

    await sql`
      CREATE TABLE public.app_areas (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        client_id VARCHAR(50) REFERENCES public.clients(client_id) ON DELETE CASCADE,
        name VARCHAR(100) NOT NULL,
        icon VARCHAR(50) DEFAULT 'Folder',
        sort_order INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true
      );
    `;

    await sql`
      CREATE TABLE public.app_reports (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        client_id VARCHAR(50) REFERENCES public.clients(client_id) ON DELETE CASCADE,
        area_id UUID REFERENCES public.app_areas(id) ON DELETE CASCADE,
        name VARCHAR(100) NOT NULL,
        path VARCHAR(255) NOT NULL,
        is_active BOOLEAN DEFAULT true
      );
    `;

    await sql`
      CREATE TABLE public.app_roles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        client_id VARCHAR(50) REFERENCES public.clients(client_id) ON DELETE CASCADE,
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
        client_id VARCHAR(50) REFERENCES public.clients(client_id) ON DELETE CASCADE,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        full_name VARCHAR(100),
        role_id UUID REFERENCES public.app_roles(id),
        language_preference VARCHAR(5) DEFAULT 'es',
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;

    console.log("Insertando datos iniciales...");
    
    // 1. Cliente
    await sql`INSERT INTO public.clients (client_id, client_name, is_active, default_language) VALUES ('vonderk', 'Vonderk Group', true, 'es')`;

    // 2. Áreas
    const areas = await sql`
      INSERT INTO public.app_areas (client_id, name, icon, sort_order) VALUES 
      ('vonderk', 'Directorio Chile', 'Briefcase', 1),
      ('vonderk', 'Directorio Argentina', 'Briefcase', 2),
      ('vonderk', 'Marketing', 'BarChart', 3)
      RETURNING id, name
    `;

    const getAreaId = (name) => areas.find(a => a.name === name).id;

    // 3. Reportes
    const reports = await sql`
      INSERT INTO public.app_reports (client_id, area_id, name, path) VALUES 
      ('vonderk', ${getAreaId('Directorio Chile')}, 'Directorio', '/mock-home'),
      ('vonderk', ${getAreaId('Directorio Chile')}, 'Comercial', '/commercial-dashboard'),
      ('vonderk', ${getAreaId('Directorio Chile')}, 'Finanzas', '/finance-dashboard'),
      ('vonderk', ${getAreaId('Directorio Chile')}, 'Inventario', '/inventory-dashboard'),
      ('vonderk', ${getAreaId('Directorio Chile')}, 'Tesorería', '/treasury-dashboard'),
      ('vonderk', ${getAreaId('Directorio Chile')}, 'CRM & Oportunidades', '/crm-dashboard'),
      
      ('vonderk', ${getAreaId('Directorio Argentina')}, 'Comercial', '/under-construction'),
      ('vonderk', ${getAreaId('Directorio Argentina')}, 'Finanzas', '/under-construction'),

      ('vonderk', ${getAreaId('Marketing')}, 'Performance', '/under-construction')
      RETURNING id, name
    `;

    // 4. Roles
    const roles = await sql`
      INSERT INTO public.app_roles (client_id, name, is_admin) VALUES 
      ('vonderk', 'CEO / Administrador', true),
      ('vonderk', 'Gerencia Comercial', false),
      ('vonderk', 'Analista Financiero', false)
      RETURNING id, name
    `;

    const ceoRoleId = roles.find(r => r.name === 'CEO / Administrador').id;
    const comercialRoleId = roles.find(r => r.name === 'Gerencia Comercial').id;
    const financieroRoleId = roles.find(r => r.name === 'Analista Financiero').id;

    // 5. Asignar Reportes
    // CEO obtiene todos los reportes
    for (const report of reports) {
      await sql`INSERT INTO public.app_role_reports (role_id, report_id, can_update) VALUES (${ceoRoleId}, ${report.id}, true)`;
    }

    // Comercial obtiene Comercial + CRM (de cualquier área)
    const comercialReportNames = ['Comercial', 'CRM & Oportunidades'];
    const comercialReportIds = reports.filter(r => comercialReportNames.includes(r.name)).map(r => r.id);
    for (const rid of comercialReportIds) {
      await sql`INSERT INTO public.app_role_reports (role_id, report_id, can_update) VALUES (${comercialRoleId}, ${rid}, true)`;
    }

    // Financiero obtiene Finanzas + Tesorería + Directorio
    const finanzasReportNames = ['Finanzas', 'Tesorería', 'Directorio'];
    const finanzasReportIds = reports.filter(r => finanzasReportNames.includes(r.name)).map(r => r.id);
    for (const rid of finanzasReportIds) {
      await sql`INSERT INTO public.app_role_reports (role_id, report_id, can_update) VALUES (${financieroRoleId}, ${rid}, false)`;
    }

    // 6. Usuarios
    const hash = await bcrypt.hash("Admin1234!", 10);
    await sql`
      INSERT INTO public.app_users (client_id, email, password_hash, full_name, role_id) VALUES 
      ('vonderk', 'darioquintas@yahoo.com', ${hash}, 'Darío Quintas', ${ceoRoleId}),
      ('vonderk', 'darioquintas92@hotmail.com', ${hash}, 'Darío Comercial', ${comercialRoleId})
    `;

    console.log("¡Seed V3 Exitoso! Entorno relacional inicializado.");
    process.exit(0);

  } catch (error) {
    console.error("Error en seed V3:", error);
    process.exit(1);
  }
}

seed();
