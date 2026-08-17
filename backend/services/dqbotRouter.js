const { generateAIResponse } = require("./aiProvider");
const { generateHeuristicResponse } = require("./dqbotHeuristicEngine");

async function generateDQBotResponse({ question, clientId }) {
  const mode = process.env.DQBOT_MODE || "heuristic";

  const systemPrompt = `ROL: Eres DQBot, el Analista Senior de Estrategia, Operaciones y Finanzas de la compañía.
OBJETIVO: Analizar el contexto de datos adjunto y responder con criterio de oportunidad, impacto económico y acción correctiva.

REGLAS DE SALIDA OBLIGATORIAS:
1. SÍNTESIS EJECUTIVA: Explica la situación en un máximo de 2 oraciones directas.
2. DIAGNÓSTICO FINANCIERO / OPERATIVO: Presenta los valores clave ($ / % / Días / Unidades) y explica la CAUSA RAÍZ de la anomalía.
3. JERARQUIZACIÓN Y DETALLE CRÍTICO: Muestra ÚNICAMENTE el Top 5 de ítems, clientes o facturas más críticas. NO hagas dumps masivos de datos.
4. ACCIÓN SUGERIDA (Oportunidad y Beneficio): Propón una acción concreta de negocio (ej. 'Llamar a cliente X', 'Revisar fecha de entrega en OV', 'Reasignar stock inmovilizado').
SI NO HAY DATOS O EL CONTEXTO NO ES RELEVANTE: Indícalo de forma directa sin especular ni alucinar.`;

  if (mode === "ai") {
    return generateAIResponse({
      systemPrompt: systemPrompt,
      userPrompt: question,
    });
  }

  if (mode === "hybrid") {
    const heuristic = await generateHeuristicResponse({ question, clientId });

    return generateAIResponse({
      systemPrompt: systemPrompt,
      userPrompt: JSON.stringify({
        question,
        heuristic,
      }),
    });
  }

  return generateHeuristicResponse({ question, clientId });
}

module.exports = { generateDQBotResponse };