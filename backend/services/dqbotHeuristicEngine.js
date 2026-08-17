const sql = require("../db");
const { detectRule } = require("./dqbot/intentDetector");
const { handleSalesQuery } = require("./dqbot/agents/salesAgent");
const { handleInventoryQuery } = require("./dqbot/agents/inventoryAgent");
const { handleFinanceQuery } = require("./dqbot/agents/financeAgent");
const { handleSupplyQuery } = require("./dqbot/agents/supplyAgent");
const generalDict = require("./dqbot/dictionaries/general.json");

async function getActiveAlerts() {
  return await sql`
    select *
    from public.vw_priority_engine
    where calculated_priority > 0
    order by calculated_priority desc
  `;
}

function buildSuggestedQuestions(alerts = []) {
  return alerts.slice(0, 4).map((x) => {
    const key = x.insight_key || x.rule_id || "";
    if (key.startsWith("I001")) return "¿Cuáles ítems tienen riesgo de quiebre de stock inminente?";
    if (key.startsWith("I003")) return "¿Qué capital está inmovilizado en inventario sin rotación?";
    if (key.startsWith("V001")) return "¿Qué vendedores tienen menor cumplimiento de forecast?";
    if (key.startsWith("V002")) return "¿Qué ítems explican el desvío comercial del período?";
    if (key.startsWith("C001")) return "¿Qué clientes concentran la mayor deuda vencida?";
    if (key.startsWith("E002")) return "¿Qué clientes tienen riesgo de bloqueo de despachos?";
    if (key.startsWith("S001")) return "¿Cuáles embarques están sin fecha de entrega confirmada?";
    return `Explorar alerta ${key}`;
  });
}

async function handleFallback(question = "") {
  const alerts = await getActiveAlerts();
  
  let prefix = "";
  if (question.length > 0) {
    prefix = generalDict.fallbacks[0] + " ";
  }

  const top3 = alerts.slice(0, 3);
  const greeting = generalDict.greetings[0];

  return {
    answer: prefix
      ? prefix
      : `${greeting}\n\nHe detectado **${alerts.length} alertas activas** en el sistema. Las más críticas son:\n\n${top3
          .map((x) => `- **${x.insight_type || x.insight_key}**: ${x.insight_description || x.insight_key}`)
          .join("\n")}\n\n¿Sobre cuál de estas áreas te gustaría profundizar?`,
    data: top3,
    suggestedQuestions: buildSuggestedQuestions(alerts),
  };
}

async function generateHeuristicResponse({ question, clientId }) {
  const startedAt = Date.now();
  let ruleId = detectRule(question);

  if (!ruleId) {
    const { routeSemantically } = require("./dqbot/semanticRouter");
    ruleId = await routeSemantically(question);
    console.log(`[SemanticRouter] Routed "${question}" to ${ruleId}`);
  }

  let result;

  // Route to correct agent
  if (ruleId === "I001" || ruleId === "I002" || ruleId === "I003" || ruleId === "I004" || ruleId === "I005") {
    result = await handleInventoryQuery(ruleId, question);
  } else if (ruleId === "V001" || ruleId === "V002" || ruleId === "V003" || ruleId === "V004" || ruleId === "V005") {
    result = await handleSalesQuery(ruleId, question);
  } else if (ruleId === "C001" || ruleId === "C002" || ruleId === "C003" || ruleId === "C004" || ruleId === "C005") {
    result = await handleFinanceQuery(ruleId, question);
  } else if (ruleId === "E002" || ruleId === "S001") {
    result = await handleSupplyQuery(ruleId, question);
  } else if (ruleId === "DYNAMIC_SQL") {
    const { handleDynamicSql } = require("./dqbot/agents/dynamicSqlAgent");
    result = await handleDynamicSql(question);
  } else {
    result = await handleFallback(question);
  }

  return {
    mode: "heuristic",
    model: "dqbot-heuristic-v1",
    answer: result.answer,
    data: result.data || [],
    suggestedQuestions: result.suggestedQuestions || [],
    usage: {
      input_tokens: 0,
      output_tokens: 0,
    },
    durationMs: Date.now() - startedAt,
  };
}

module.exports = {
  generateHeuristicResponse,
};