import { cookies } from "next/headers";

export const API_BASE_URL =
  process.env.BACKEND_URL || (process.env.NODE_ENV === 'production' ? 'http://orbit_backend:3000' : 'http://localhost:3000');

export async function fetchFromApi(path: string, options: RequestInit = {}) {
  let token = "";

  if (typeof window === "undefined") {
    // Server-side
    const cookieStore = await cookies();
    token = cookieStore.get("datalytixq_token")?.value || "";
  } else {
    // Client-side
    token = localStorage.getItem("datalytixq_token") || "";
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...headers,
      ...(options.headers || {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    let errorMsg = `API error ${response.status} en ${path}`;
    try {
      const errorBody = await response.text();
      errorMsg += `: ${errorBody}`;
      console.error(errorMsg);
    } catch (e) {
      // Ignore
    }
    throw new Error(errorMsg);
  }

  return response.json();
}