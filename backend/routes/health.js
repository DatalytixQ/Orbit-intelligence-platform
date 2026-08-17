const express = require("express");
const sql = require("../db");

const router = express.Router();

router.get("/health", async (_req, res) => {
  try {
    await sql`select 1`;
    res.json({ ok: true, service: "datalytix-api" });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

router.get("/test", (_req, res) => {
  res.json({ ok: true, route: "test" });
});

module.exports = router;