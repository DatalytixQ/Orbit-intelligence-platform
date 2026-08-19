const express = require("express");
const { requireAuth } = require("../middleware/auth");
const sql = require("../db");
const bcrypt = require("bcryptjs");

const router = express.Router();

// Middleware para verificar admin
const checkAdmin = (req, res, next) => {
  if (!req.user.is_admin) return res.status(403).json({ ok: false, error: "No autorizado" });
  next();
};

// ==========================================
// USUARIOS
// ==========================================
router.get("/users", requireAuth, async (req, res) => {
  try {
    const users = await sql`
      SELECT u.id, u.email, u.full_name, u.is_active, r.name as role_name 
      FROM public.app_users u
      JOIN public.app_roles r ON u.role_id = r.id
      WHERE u.client_id = ${req.user.client_id}
      ORDER BY u.id DESC
    `;
    res.json({ ok: true, users });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

router.post("/users", requireAuth, checkAdmin, async (req, res) => {
  try {
    const { email, full_name, role_id, password } = req.body;
    if (!email || !full_name || !role_id || !password) {
      return res.status(400).json({ ok: false, error: "Todos los campos son obligatorios" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const result = await sql`
      INSERT INTO public.app_users (client_id, email, password_hash, full_name, role_id)
      VALUES (${req.user.client_id}, ${email}, ${passwordHash}, ${full_name}, ${role_id}::uuid)
      RETURNING id, email, full_name
    `;

    res.json({ ok: true, user: result[0] });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

router.put("/users/:id", requireAuth, checkAdmin, async (req, res) => {
  try {
    const { email, full_name, role_id, is_active } = req.body;
    const result = await sql`
      UPDATE public.app_users 
      SET email = COALESCE(${email}, email),
          full_name = COALESCE(${full_name}, full_name),
          role_id = COALESCE(${role_id}::uuid, role_id),
          is_active = COALESCE(${is_active}, is_active)
      WHERE id = ${req.params.id} AND client_id = ${req.user.client_id}
      RETURNING id, email, full_name
    `;
    res.json({ ok: true, user: result[0] });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

router.delete("/users/:id", requireAuth, checkAdmin, async (req, res) => {
  try {
    await sql`
      UPDATE public.app_users 
      SET is_active = false 
      WHERE id = ${req.params.id} AND client_id = ${req.user.client_id}
    `;
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ==========================================
// ÁREAS Y REPORTES
// ==========================================
router.get("/areas", requireAuth, async (req, res) => {
  try {
    const areas = await sql`SELECT * FROM public.app_areas WHERE is_active = true AND client_id = ${req.user.client_id} ORDER BY sort_order ASC`;
    res.json({ ok: true, areas });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

router.post("/areas", requireAuth, checkAdmin, async (req, res) => {
  try {
    const { name, icon, sort_order } = req.body;
    const result = await sql`
      INSERT INTO public.app_areas (client_id, name, icon, sort_order)
      VALUES (${req.user.client_id}, ${name}, ${icon}, ${sort_order})
      RETURNING *
    `;
    res.json({ ok: true, area: result[0] });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

router.put("/areas/:id", requireAuth, checkAdmin, async (req, res) => {
  try {
    const { name, icon, sort_order, is_active } = req.body;
    const result = await sql`
      UPDATE public.app_areas 
      SET name = COALESCE(${name}, name),
          icon = COALESCE(${icon}, icon),
          sort_order = COALESCE(${sort_order}, sort_order),
          is_active = COALESCE(${is_active}, is_active)
      WHERE id = ${req.params.id} AND client_id = ${req.user.client_id}
      RETURNING *
    `;
    res.json({ ok: true, area: result[0] });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

router.delete("/areas/:id", requireAuth, checkAdmin, async (req, res) => {
  try {
    await sql`UPDATE public.app_areas SET is_active = false WHERE id = ${req.params.id} AND client_id = ${req.user.client_id}`;
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

router.get("/reports", requireAuth, async (req, res) => {
  try {
    const reports = await sql`
      SELECT r.*, a.name as area_name 
      FROM public.app_reports r 
      JOIN public.app_areas a ON r.area_id = a.id 
      WHERE r.is_active = true AND r.client_id = ${req.user.client_id}
      ORDER BY a.sort_order ASC, r.name ASC
    `;
    res.json({ ok: true, reports });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

router.post("/reports", requireAuth, checkAdmin, async (req, res) => {
  try {
    const { area_id, name, path, icon, is_dashboard } = req.body;
    const result = await sql`
      INSERT INTO public.app_reports (client_id, area_id, name, path, icon, is_dashboard)
      VALUES (${req.user.client_id}, ${area_id}::uuid, ${name}, ${path}, ${icon}, ${is_dashboard})
      RETURNING *
    `;
    res.json({ ok: true, report: result[0] });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

router.put("/reports/:id", requireAuth, checkAdmin, async (req, res) => {
  try {
    const { area_id, name, path, icon, is_dashboard, is_active } = req.body;
    const result = await sql`
      UPDATE public.app_reports 
      SET area_id = COALESCE(${area_id}::uuid, area_id),
          name = COALESCE(${name}, name),
          path = COALESCE(${path}, path),
          icon = COALESCE(${icon}, icon),
          is_dashboard = COALESCE(${is_dashboard}, is_dashboard),
          is_active = COALESCE(${is_active}, is_active)
      WHERE id = ${req.params.id} AND client_id = ${req.user.client_id}
      RETURNING *
    `;
    res.json({ ok: true, report: result[0] });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

router.delete("/reports/:id", requireAuth, checkAdmin, async (req, res) => {
  try {
    await sql`UPDATE public.app_reports SET is_active = false WHERE id = ${req.params.id} AND client_id = ${req.user.client_id}`;
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ==========================================
// ROLES
// ==========================================
router.get("/roles", requireAuth, async (req, res) => {
  try {
    const roles = await sql`SELECT id, name, is_admin, is_active FROM public.app_roles WHERE is_active = true AND client_id = ${req.user.client_id} ORDER BY created_at DESC`;
    
    // Adjuntar los reportes a cada rol
    for (let role of roles) {
      const reports = await sql`
        SELECT report_id, can_update 
        FROM public.app_role_reports 
        WHERE role_id = ${role.id}
      `;
      role.reports = reports;
    }
    
    res.json({ ok: true, roles });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

router.post("/roles", requireAuth, checkAdmin, async (req, res) => {
  try {
    const { name, is_admin, reports } = req.body;
    if (!name) return res.status(400).json({ ok: false, error: "Nombre es obligatorio" });

    // 1. Crear el rol
    const result = await sql`
      INSERT INTO public.app_roles (client_id, name, is_admin) 
      VALUES (${req.user.client_id}, ${name}, ${is_admin || false}) 
      RETURNING id, name, is_admin
    `;
    
    const newRoleId = result[0].id;

    // 2. Insertar los reportes asignados
    if (reports && Array.isArray(reports) && reports.length > 0) {
      for (const rep of reports) {
        await sql`
          INSERT INTO public.app_role_reports (role_id, report_id, can_update) 
          VALUES (${newRoleId}, ${rep.report_id}::uuid, ${rep.can_update || false})
        `;
      }
    }

    res.json({ ok: true, role: result[0] });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

router.put("/roles/:id", requireAuth, checkAdmin, async (req, res) => {
  try {
    const { name, is_admin, is_active, reports } = req.body;
    const roleResult = await sql`
      UPDATE public.app_roles 
      SET name = COALESCE(${name}, name),
          is_admin = COALESCE(${is_admin}, is_admin),
          is_active = COALESCE(${is_active}, is_active)
      WHERE id = ${req.params.id} AND client_id = ${req.user.client_id}
      RETURNING *
    `;
    
    if (reports && Array.isArray(reports)) {
      await sql`DELETE FROM public.app_role_reports WHERE role_id = ${req.params.id}`;
      for (const rep of reports) {
        await sql`
          INSERT INTO public.app_role_reports (role_id, report_id, can_update) 
          VALUES (${req.params.id}, ${rep.report_id}::uuid, ${rep.can_update || false})
        `;
      }
    }
    res.json({ ok: true, role: roleResult[0] });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

router.delete("/roles/:id", requireAuth, checkAdmin, async (req, res) => {
  try {
    await sql`UPDATE public.app_roles SET is_active = false WHERE id = ${req.params.id} AND client_id = ${req.user.client_id}`;
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

module.exports = router;
