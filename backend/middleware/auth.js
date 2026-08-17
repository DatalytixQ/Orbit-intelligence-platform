/**
 * backend/middleware/auth.js
 *
 * Shared authentication middleware for all protected routes.
 *
 * Task:    T002 — Extract requireAuth to shared middleware module
 * Wave:    0 — Security Emergency
 * Purpose: Single source of truth for JWT verification. All protected routes
 *          must import requireAuth from this module, not define it locally.
 *
 * Usage:
 *   const { requireAuth } = require("../middleware/auth");
 *   router.get("/protected", requireAuth, handler);
 *
 * After verification, req.user is populated with the decoded JWT payload:
 *   {
 *     user_id:   string,
 *     client_id: string,   ← use this for all tenant-scoped queries
 *     email:     string,
 *     role:      string
 *   }
 */

const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * requireAuth — Express middleware that validates a Bearer JWT token.
 *
 * On success: sets req.user to decoded payload and calls next().
 * On failure: returns 401 with { ok: false, error: string }.
 *
 * @param {import("express").Request}  req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ ok: false, error: "Token requerido" });
  }

  try {
    const token = authHeader.replace("Bearer ", "");
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ ok: false, error: "Token inválido" });
  }
}

module.exports = { requireAuth };
