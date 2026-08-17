const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sql = require("../db");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();
console.log("AUTH ROUTES CARGADAS");

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";

router.get("/test", (_req, res) => {
  res.json({ ok: true, route: "auth-test" });
});

router.post("/bootstrap-admin", async (req, res) => {
  try {
    const { client_id, client_name, email, password, full_name } = req.body;

    if (!client_id || !client_name || !email || !password) {
      return res.status(400).json({
        ok: false,
        error: "client_id, client_name, email y password son obligatorios",
      });
    }

    const existingUsers = await sql`
      select count(*)::int as total
      from public.app_users
    `;

    if (existingUsers[0].total > 0) {
      return res.status(403).json({
        ok: false,
        error: "Bootstrap bloqueado: ya existen usuarios",
      });
    }

    await sql`
      insert into public.clients (client_id, client_name, is_active)
      values (${client_id}, ${client_name}, true)
      on conflict (client_id) do nothing
    `;

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await sql`
      insert into public.app_users (
        client_id,
        email,
        password_hash,
        full_name,
        role,
        is_active
      )
      values (
        ${client_id},
        ${email},
        ${passwordHash},
        ${full_name || "Admin"},
        'admin_cliente',
        true
      )
      returning id, client_id, email, full_name, role, is_active
    `;

    res.json({ ok: true, user: user[0] });
  } catch (e) {
    console.error("ERROR bootstrap-admin:", e.message);
    res.status(500).json({ ok: false, error: e.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        ok: false,
        error: "email y password son obligatorios",
      });
    }

    const users = await sql`
      select
        u.id,
        u.client_id,
        u.email,
        u.password_hash,
        u.full_name,
        u.role_id,
        u.is_active,
        c.client_name,
        c.is_active as client_active,
        r.is_admin
      from public.app_users u
      join public.clients c on c.client_id = u.client_id
      left join public.app_roles r on r.id = u.role_id
      where lower(u.email) = lower(${email})
      limit 1
    `;

    const user = users[0];

    if (!user || !user.is_active || !user.client_active) {
      return res.status(401).json({ ok: false, error: "Credenciales inválidas" });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      return res.status(401).json({ ok: false, error: "Credenciales inválidas" });
    }

    // Obtener los permisos (report_ids) desde app_role_reports
    const permissionsRows = await sql`
      SELECT report_id FROM public.app_role_reports WHERE role_id = ${user.role_id}
    `;
    const permissions = permissionsRows.map(r => r.report_id);

    const token = jwt.sign(
      {
        user_id: user.id,
        client_id: user.client_id,
        email: user.email,
        role_id: user.role_id,
        is_admin: user.is_admin || false
      },
      JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({
      ok: true,
      token,
      user: {
        id: user.id,
        client_id: user.client_id,
        client_name: user.client_name,
        email: user.email,
        full_name: user.full_name,
        role_id: user.role_id,
        permissions: permissions,
        is_admin: user.is_admin || false
      },
    });
  } catch (e) {
    console.error("ERROR login:", e.message);
    res.status(500).json({ ok: false, error: e.message });
  }
});

router.patch("/change-password", requireAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        ok: false,
        error: "Contraseña actual y nueva contraseña son obligatorias",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        ok: false,
        error: "La nueva contraseña debe tener al menos 8 caracteres",
      });
    }

    const users = await sql`
      select id, password_hash
      from public.app_users
      where id = ${req.user.user_id}
      and is_active = true
      limit 1
    `;

    const user = users[0];

    if (!user) {
      return res.status(404).json({ ok: false, error: "Usuario no encontrado" });
    }

    const validPassword = await bcrypt.compare(currentPassword, user.password_hash);

    if (!validPassword) {
      return res.status(401).json({
        ok: false,
        error: "La contraseña actual no es correcta",
      });
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    await sql`
      update public.app_users
      set password_hash = ${newPasswordHash}
      where id = ${req.user.user_id}
    `;

    res.json({ ok: true, message: "Contraseña actualizada correctamente" });
  } catch (e) {
    console.error("ERROR change-password:", e.message);
    res.status(500).json({ ok: false, error: e.message });
  }
});

router.post("/refresh-token", requireAuth, async (req, res) => {
  try {
    const { user_id, client_id, email, role } = req.user;

    const users = await sql`
      select u.is_active, c.is_active as client_active
      from public.app_users u
      join public.clients c on c.client_id = u.client_id
      where u.id = ${user_id}
      limit 1
    `;

    const user = users[0];

    if (!user || !user.is_active || !user.client_active) {
      return res.status(401).json({ ok: false, error: "Usuario inactivo o cliente inactivo" });
    }

    const token = jwt.sign(
      {
        user_id,
        client_id,
        email,
        role,
      },
      JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({ ok: true, token });
  } catch (e) {
    console.error("ERROR refresh-token:", e.message);
    res.status(500).json({ ok: false, error: e.message });
  }
});

router.post("/logout", requireAuth, (req, res) => {
  // Stateless logout. The client must discard the JWT.
  // In a future architectural iteration, a token_blacklist table or Redis cache can be introduced here.
  res.json({ ok: true, message: "Logged out successfully" });
});

router.post("/change-password", requireAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ ok: false, error: "Contraseñas requeridas" });
    }
    
    const user = await sql`SELECT password_hash FROM public.app_users WHERE id = ${req.user.user_id}`;
    if (!user || user.length === 0) {
      return res.status(404).json({ ok: false, error: "Usuario no encontrado" });
    }

    const validPassword = await bcrypt.compare(currentPassword, user[0].password_hash);
    if (!validPassword) {
      return res.status(401).json({ ok: false, error: "Contraseña actual incorrecta" });
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await sql`UPDATE public.app_users SET password_hash = ${newHash} WHERE id = ${req.user.user_id}`;

    res.json({ ok: true, message: "Contraseña actualizada exitosamente" });
  } catch (err) {
    res.status(500).json({ ok: false, error: "Error cambiando contraseña" });
  }
});

// ========================================================
// Profile endpoints — any authenticated user
// ========================================================

// GET /api/auth/profile — returns user info, role, permissions, and language
router.get("/profile", requireAuth, async (req, res) => {
  try {
    const users = await sql`
      SELECT 
        u.id, u.client_id, u.email, u.full_name, u.role_id, u.language_preference, u.is_active, u.created_at,
        c.client_name, c.default_language,
        r.name as role_name, r.is_admin
      FROM public.app_users u
      JOIN public.clients c ON c.client_id = u.client_id
      LEFT JOIN public.app_roles r ON r.id = u.role_id
      WHERE u.id = ${req.user.user_id}
      LIMIT 1
    `;

    const user = users[0];
    if (!user) {
      return res.status(404).json({ ok: false, error: "Usuario no encontrado" });
    }

    // Get permissions (reports this role can access)
    const permRows = await sql`
      SELECT rr.report_id, rr.can_update, ar.name as report_name, ar.area_id
      FROM public.app_role_reports rr
      LEFT JOIN public.app_reports ar ON ar.id = rr.report_id
      WHERE rr.role_id = ${user.role_id}
    `;

    // Effective language: user preference > tenant default > 'es'
    const effectiveLanguage = user.language_preference || user.default_language || 'es';

    res.json({
      ok: true,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role_name: user.role_name,
        is_admin: user.is_admin || false,
        language_preference: user.language_preference,
        effective_language: effectiveLanguage,
        client_name: user.client_name,
        client_default_language: user.default_language,
        created_at: user.created_at
      },
      permissions: permRows.map(p => ({
        report_id: p.report_id,
        report_name: p.report_name,
        can_update: p.can_update
      }))
    });
  } catch (e) {
    console.error("ERROR profile:", e.message);
    res.status(500).json({ ok: false, error: e.message });
  }
});

// PUT /api/auth/profile/language — update user language preference
router.put("/profile/language", requireAuth, async (req, res) => {
  try {
    const { language } = req.body;
    if (!language || !['es', 'en'].includes(language)) {
      return res.status(400).json({ ok: false, error: "Idioma debe ser 'es' o 'en'" });
    }

    await sql`
      UPDATE public.app_users 
      SET language_preference = ${language}
      WHERE id = ${req.user.user_id}
    `;

    res.json({ ok: true, language });
  } catch (e) {
    console.error("ERROR profile/language:", e.message);
    res.status(500).json({ ok: false, error: e.message });
  }
});

module.exports = router;