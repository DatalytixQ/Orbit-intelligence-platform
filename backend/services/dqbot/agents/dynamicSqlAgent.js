const { GoogleGenAI } = require("@google/genai");
const sql = require("../../db");
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const GEMINI_MODEL = process.env.AI_MODEL || "gemini-1.5-flash";
const { SCHEMA } = require("../../pipeline/schemaRegistry");

// Provide a condensed summary of the schema to the LLM
const schemaSummary = Object.keys(SCHEMA).map(entity => {
  const s = SCHEMA[entity];
  return `Table: ${s.raw_table} or ${s.stg_table || 'N/A'}\nColumns: ${[...s.required_cols, ...s.optional_cols].join(', ')}`;
}).join("\n\n");

const SYSTEM_PROMPT = `Eres el Agente de Datos Dinámicos (Dynamic SQL Agent) de Datalytix Quest.
Tu objetivo es responder a preguntas complejas de negocio ejecutando consultas SQL contra el ERP.

ESQUEMA DE BASE DE DATOS (Vistas/Tablas Principales):
${schemaSummary}

IMPORTANTE: 
Adicional a lo anterior, las tablas transaccionales maestras son:
- public.raw_open_sales_orders (order_internal_id, customer_id, item_internal_id, quantity_pending, ...)
- public.kpi_inventory_coverage (item_id, item_name, stock_available, stock_coverage_months, ...)
- public.kpi_finance_dso_by_customer_v5 (customer_id, customer_name, overdue_balance, dso_days, ...)
- public.raw_item_bom (parent_item_id, component_item_id, ...)

INSTRUCCIONES:
1. Para responder a la pregunta del usuario, utiliza la herramienta 'queryDatabase' para ejecutar un SQL de solo lectura (SELECT).
2. NUNCA ejecutes INSERT, UPDATE, DELETE o DROP.
3. Si la base de datos devuelve resultados, interprétalos y redacta una respuesta clara, ejecutiva y directa para el usuario.
4. Si la tabla no existe o la query falla, pídele disculpas al usuario y explica qué datos no pudiste acceder.
5. Formatea los números monetarios y cantidades de forma amigable.`;

const queryDatabase = async (queryStr) => {
  try {
    // Basic safety check
    if (!queryStr.toLowerCase().trim().startsWith("select")) {
      return JSON.stringify({ error: "Only SELECT queries are allowed." });
    }
    const rows = await sql.unsafe(queryStr);
    return JSON.stringify(rows.slice(0, 50)); // Limit to 50 rows to prevent context overflow
  } catch (error) {
    return JSON.stringify({ error: error.message });
  }
};

async function handleDynamicSql(question) {
  try {
    const chat = ai.chats.create({
      model: GEMINI_MODEL,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.1,
        tools: [{
          functionDeclarations: [{
            name: "queryDatabase",
            description: "Ejecuta una consulta SQL SELECT en la base de datos PostgreSQL del ERP y retorna los resultados en JSON.",
            parameters: {
              type: "OBJECT",
              properties: {
                queryStr: {
                  type: "STRING",
                  description: "La consulta SQL a ejecutar. Ejemplo: SELECT * FROM raw_open_sales_orders LIMIT 10"
                }
              },
              required: ["queryStr"]
            }
          }]
        }]
      }
    });

    let response = await chat.sendMessage({ message: question });

    // Handle tool calls if any
    while (response.functionCalls && response.functionCalls.length > 0) {
      const call = response.functionCalls[0];
      if (call.name === "queryDatabase") {
        const queryStr = call.args.queryStr;
        console.log("[DynamicSqlAgent] Executing SQL:", queryStr);
        const result = await queryDatabase(queryStr);
        
        response = await chat.sendMessage([{
          functionResponse: {
            name: "queryDatabase",
            response: { result }
          }
        }]);
      } else {
        break;
      }
    }

    return {
      answer: response.text || "No pude generar una respuesta con los datos disponibles.",
      data: [],
      suggestedQuestions: []
    };

  } catch (error) {
    console.error("[DynamicSqlAgent] Error:", error.message);
    return {
      answer: "Lo siento, hubo un error al intentar acceder a la base de datos de manera dinámica para responder tu consulta.",
      data: [],
      suggestedQuestions: []
    };
  }
}

module.exports = { handleDynamicSql };
