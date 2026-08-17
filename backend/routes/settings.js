const express = require("express");
const sql = require("../db");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

// Middleware to ensure user is admin
async function requireAdmin(req, res, next) {
  try {
    const role = await sql`
      SELECT is_admin FROM public.app_roles WHERE id = ${req.user.role_id}
    `;
    if (!role || role.length === 0 || !role[0].is_admin) {
      return res.status(403).json({ ok: false, error: "Acceso denegado. Requiere privilegios de administrador." });
    }
    next();
  } catch (error) {
    res.status(500).json({ ok: false, error: "Error verificando permisos" });
  }
}

// GET /api/settings
router.get("/", requireAdmin, async (req, res) => {
  try {
    const settings = await sql`
      SELECT category, policy_key, policy_value, description
      FROM public.app_settings
      WHERE client_id = ${req.user.client_id}
      ORDER BY category ASC, policy_key ASC
    `;
    res.json({ ok: true, data: settings });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// PUT /api/settings
router.put("/", requireAdmin, async (req, res) => {
  const { policies } = req.body;
  if (!policies || !Array.isArray(policies)) {
    return res.status(400).json({ ok: false, error: "Array de policies requerido" });
  }

  try {
    await sql.begin(async (tx) => {
      for (const p of policies) {
        await tx`
          UPDATE public.app_settings
          SET policy_value = ${p.policy_value}, updated_at = NOW()
          WHERE client_id = ${req.user.client_id} AND policy_key = ${p.policy_key}
        `;
      }
    });

    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

module.exports = router;
