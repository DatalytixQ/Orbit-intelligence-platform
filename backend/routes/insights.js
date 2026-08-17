const express = require("express");
const router = express.Router();
const sql = require("../db");

router.post("/insights/generate", async (_req, res) => {
  try {
    await sql`select public.generate_insights_snapshot()`;
    res.json({ ok: true, message: "Insights generados correctamente" });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

router.get("/insights/current", async (_req, res) => {
  try {
    const result = await sql`
      select
        id, insight_key, insight_type, title, description, severity,
        action_suggested, metric_name, metric_value, previous_metric_value,
        delta_value, trend_status, status, context_json, detected_at
      from public.insights_log
      where status = 'activo'
      order by
        case severity
          when 'critico' then 1
          when 'alerta' then 2
          else 3
        end,
        detected_at desc
    `;
    res.json(result);
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

router.get("/insights/evolution", async (_req, res) => {
  try {
    const result = await sql`
      select
        id, insight_key, snapshot_at, metric_value,
        previous_metric_value, delta_value, trend_status, context_json
      from public.insight_evolution
      order by snapshot_at desc
      limit 100
    `;
    res.json(result);
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

router.get("/insights/actions", async (_req, res) => {
  try {
    const result = await sql`
      select
        id, insight_key, insight_id, action_title, action_description,
        owner_name, status, created_at, due_date, completed_at, result_note
      from public.actions_log
      order by created_at desc
      limit 100
    `;
    res.json(result);
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

router.get("/insights/:id", async (req, res) => {
  try {
    const result = await sql`
      select *
      from public.insights_log
      where id = ${req.params.id}
    `;
    if (result.length === 0) return res.status(404).json({ ok: false, error: "Insight not found" });
    res.json(result[0]);
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

router.post("/insights/actions/:id/status", async (req, res) => {
  try {
    const actionId = Number(req.params.id);
    const { status, owner_name, result_note } = req.body;

    const result = await sql`
      update public.actions_log
      set
        status = ${status},
        owner_name = coalesce(${owner_name}, owner_name),
        result_note = coalesce(${result_note}, result_note),
        completed_at = case
          when ${status} = 'completada' then now()
          else completed_at
        end
      where id = ${actionId}
      returning *
    `;

    res.json(result[0] || {});
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

module.exports = router;