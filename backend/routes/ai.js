/**
 * backend/routes/ai.js
 *
 * Task:    T001 — Extract clientId from JWT in routes/ai.js
 * Wave:    0 — Security Emergency
 * Change:  Route is now protected by requireAuth middleware.
 *          clientId is read from req.user.client_id (JWT payload).
 *          Hardcoded tenant fallback has been removed.
 */

const express = require("express");
const router = express.Router();

const sql = require("../db");
const { requireAuth } = require("../middleware/auth");
const { generateDQBotResponse } = require("../services/dqbotRouter");

// helper costo estimado
function estimateCost({ inputTokens, outputTokens }) {
  const inputCostPer1M = 0.25;
  const outputCostPer1M = 2.0;

  const cost =
    (inputTokens / 1_000_000) * inputCostPer1M +
    (outputTokens / 1_000_000) * outputCostPer1M;

  return Number(cost.toFixed(6));
}

// requireAuth ensures req.user is populated with the verified JWT payload.
// req.user.client_id is used as the tenant identifier for all DQBot queries.
router.post("/ai/chat-v2", requireAuth, async (req, res) => {
  try {
    const { question } = req.body;
    const clientId = req.user.client_id;

    if (!question) {
      return res.status(400).json({
        ok: false,
        error: "question is required",
      });
    }

    const startedAt = Date.now();

    // 1. Resolver DQBot según modo: heuristic | ai | hybrid
    const dqbotResponse = await generateDQBotResponse({
      question,
      clientId,
    });

    const usage = dqbotResponse.usage || {};
    const inputTokens = usage.input_tokens || usage.inputTokens || 0;
    const outputTokens = usage.output_tokens || usage.outputTokens || 0;
    const totalTokens = inputTokens + outputTokens;

    const cost = estimateCost({
      inputTokens,
      outputTokens,
    });

    const durationMs = Date.now() - startedAt;

    // 2. Guardar uso
    await sql`
      insert into public.ai_usage_logs (
        feature,
        model,
        input_tokens,
        output_tokens,
        total_tokens,
        estimated_cost_usd,
        question,
        duration_ms
      ) values (
        'dqbot',
        ${dqbotResponse.model || "dqbot-heuristic-v1"},
        ${inputTokens},
        ${outputTokens},
        ${totalTokens},
        ${cost},
        ${question},
        ${durationMs}
      )
    `;

    return res.json({
      ok: true,
      mode: dqbotResponse.mode || process.env.DQBOT_MODE || "heuristic",
      answer: dqbotResponse.answer,
      data: dqbotResponse.data || [],
      suggestedQuestions: dqbotResponse.suggestedQuestions || [],
      usage: {
        inputTokens,
        outputTokens,
        totalTokens,
        cost,
      },
      durationMs,
    });
  } catch (e) {
    console.error("ERROR /api/ai/chat-v2:", e.message);
    return res.status(500).json({ ok: false, error: e.message });
  }
});

module.exports = router;