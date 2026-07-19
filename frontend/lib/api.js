/**
 * API client — the only place that talks to the backend. Every response
 * uses the envelope {success, data} | {success:false, error:{code,
 * message_en, message_ta}}; failures throw an Error carrying the bilingual
 * messages so the UI can show them directly.
 */

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${BASE}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
  } catch {
    const error = new Error("network");
    error.code = "NETWORK";
    throw error;
  }

  let body;
  try {
    body = await response.json();
  } catch {
    body = null;
  }

  if (!body || body.success !== true) {
    const info = body?.error ?? {};
    const error = new Error(info.code || "SERVER_ERROR");
    error.code = info.code || "SERVER_ERROR";
    error.message_en = info.message_en;
    error.message_ta = info.message_ta;
    throw error;
  }
  return body.data;
}

export function getSchemes(category) {
  const suffix = category ? `?category=${encodeURIComponent(category)}` : "";
  return request(`/api/schemes${suffix}`);
}

export function getScheme(slug) {
  return request(`/api/schemes/${encodeURIComponent(slug)}`);
}

export function postMatch(profile) {
  return request("/api/match", { method: "POST", body: JSON.stringify(profile) });
}

export function postChat(payload) {
  return request("/api/chat", { method: "POST", body: JSON.stringify(payload) });
}
