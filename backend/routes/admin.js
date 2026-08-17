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

// ==========================================
// ÁREAS Y REPORTES
// ==========================================
router.get("/areas", requireAuth, async (req, res) => {
  try {
    const areas = await sql`SELECT * FROM public.app_areas WHERE is_active = true ORDER BY sort_order ASC`;
    res.json({ ok: true, areas });
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
      WHERE r.is_active = true 
      ORDER BY a.sort_order ASC, r.name ASC
    `;
    res.json({ ok: true, reports });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ==========================================
// ROLES
// ==========================================
router.get("/roles", requireAuth, async (req, res) => {
  try {
    const roles = await sql`SELECT id, name, is_admin, is_active FROM public.app_roles WHERE is_active = true ORDER BY created_at DESC`;
    
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
      INSERT INTO public.app_roles (name, is_admin) 
      VALUES (${name}, ${is_admin || false}) 
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

module.exports = router;
