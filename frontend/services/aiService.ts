import { fetchFromApiClient } from "@/lib/api.client";

export async function askDQBot(question: string) {
  const res = await fetchFromApiClient('/api/ai/chat-v2', {
    method: "POST",
    body: JSON.stringify({ question }),
  });

  if (!res.ok) {
    throw new Error(res.error || "No se pudo consultar DQBot");
  }

  return res;
}

export async function getExecutiveSummary() {
  const res = await fetchFromApiClient('/api/analytics/executive');
  if (!res.ok && res.error) {
    throw new Error(res.error || "No se pudo obtener resumen ejecutivo");
  }
  return res;
}

export async function getInsights() {
  const res = await fetchFromApiClient('/api/insights/current');
  if (!res.ok && res.error) {
    throw new Error(res.error || "No se pudo obtener insights");
  }
  return res;
}