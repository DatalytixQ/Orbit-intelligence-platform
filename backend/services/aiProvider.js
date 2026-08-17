const { GoogleGenAI } = require("@google/genai");
const Groq = require("groq-sdk");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const GEMINI_MODEL = process.env.AI_MODEL || "gemini-1.5-flash";
const GROQ_MODEL = "llama-3.3-70b-versatile";

async function generateAIResponse({ systemPrompt, userPrompt, provider = 'auto' }) {
  const startedAt = Date.now();

  if (process.env.AI_MOCK_MODE === "true") {
    return {
      answer: "Respuesta MOCK DQBot v2: análisis generado sin consumir tokens. El flujo backend, frontend y logging funciona correctamente.",
      model: "mock-dqbot-v2",
      usage: { input_tokens: 0, output_tokens: 0 },
      durationMs: Date.now() - startedAt,
      fallbackUsed: false
    };
  }

  let finalResponse = null;
  let modelUsed = GEMINI_MODEL;
  let fallbackUsed = false;
  let usage = { input_tokens: 0, output_tokens: 0 };

  const callGemini = async () => {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.0, // Freno extra de alucinaciones
      }
    });
    return {
      answer: response.text || "",
      model: GEMINI_MODEL,
      usage: {
        input_tokens: response.usageMetadata?.promptTokenCount || 0,
        output_tokens: response.usageMetadata?.candidatesTokenCount || 0,
      }
    };
  };

  const callGroq = async () => {
    const response = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      model: GROQ_MODEL,
      temperature: 0.0,
    });
    return {
      answer: response.choices[0]?.message?.content || "",
      model: GROQ_MODEL,
      usage: {
        input_tokens: response.usage?.prompt_tokens || 0,
        output_tokens: response.usage?.completion_tokens || 0,
      }
    };
  };

  if (provider === 'gemini') {
    finalResponse = await callGemini();
  } else if (provider === 'groq') {
    finalResponse = await callGroq();
    modelUsed = GROQ_MODEL;
  } else {
    // Auto mode with fallback
    try {
      finalResponse = await callGemini();
    } catch (error) {
      console.warn(`[DQBOT] Gemini failed: ${error.message}. Executing Fallback to Groq...`);
      fallbackUsed = true;
      finalResponse = await callGroq();
      modelUsed = GROQ_MODEL;
    }
  }

  const durationMs = Date.now() - startedAt;

  return {
    answer: finalResponse.answer,
    model: finalResponse.model,
    usage: finalResponse.usage,
    durationMs,
    fallbackUsed
  };
}

async function generateEmbedding(text) {
  const response = await ai.models.embedContent({
    model: "text-embedding-004",
    contents: text,
  });
  return response.embeddings[0].values;
}

module.exports = {
  generateAIResponse,
  generateEmbedding,
};