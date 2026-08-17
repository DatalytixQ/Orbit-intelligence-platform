const { GoogleGenAI } = require("@google/genai");
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const GEMINI_MODEL = process.env.AI_MODEL || "gemini-1.5-flash";

const SYSTEM_PROMPT = `Eres el Enrutador Semántico de DQBot. Tu objetivo es clasificar la pregunta del usuario en una de las reglas de negocio predefinidas, O determinar si requiere una consulta dinámica a la base de datos (DYNAMIC_SQL).

REGLAS DE NEGOCIO DISPONIBLES:
- I001: Riesgo de quiebre de stock inminente.
- I002: Cobertura vs Lead time de inventario (Stock en tránsito).
- I003: Capital Inmovilizado / Slow Moving.
- I004: Demanda y Ventas Perdidas por Quiebre.
- V001: Cumplimiento de Forecast de Ventas por vendedor/cliente.
- V002: Desviación y caída en facturación comercial.
- V003: Tendencia y estacionalidad de ventas.
- V004: Concentración estructural de ventas (Dependencia).
- C001: DSO y Cartera Vencida (Clientes críticos por deuda, clientes en mora).
- C002: Deterioro en la tendencia de pago (clientes empeorando pagos).
- C003: Forecast de cobranza y flujo de caja proyectado.
- C005: Facturas críticas vencidas.
- E002: Riesgo de abastecimiento por cliente deudor.

SI LA PREGUNTA COINCIDE SEMÁNTICAMENTE CON UNA REGLA: 
Responde ÚNICAMENTE con el código de la regla (ej. C001).

SI LA PREGUNTA REQUIERE CONSULTAR DATOS ESPECÍFICOS NO CUBIERTOS ARRIBA (ej. buscar el estado de una OV específica, cruzar datos de un SKU particular, buscar detalles de la base de datos que requieren SQL dinámico):
Responde ÚNICAMENTE con la palabra: DYNAMIC_SQL

SI LA PREGUNTA ES UN SALUDO O FUERA DE CONTEXTO EMPRESARIAL:
Responde ÚNICAMENTE con la palabra: FALLBACK`;

async function routeSemantically(question) {
  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: question,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.0,
      }
    });

    const rule = (response.text || "").trim().toUpperCase();
    
    const ruleMatch = rule.match(/([IVCE][0-9]{3})/);
    if (ruleMatch) {
        return ruleMatch[1];
    }

    if (rule.includes("DYNAMIC_SQL")) return "DYNAMIC_SQL";

    return "FALLBACK";
  } catch (error) {
    console.error("[SemanticRouter] Error:", error.message);
    return "FALLBACK";
  }
}

module.exports = { routeSemantically };
