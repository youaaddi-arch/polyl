import { config } from "./config.ts";

type Json = Record<string, unknown>;

async function request(path: string, init: RequestInit = {}): Promise<unknown> {
  const url = `${config.apiBase}${path}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
  const text = await res.text();
  let body: unknown;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }
  if (!res.ok) {
    throw new Error(`Twenty API ${res.status} ${res.statusText} on ${path}\n${typeof body === "string" ? body : JSON.stringify(body, null, 2)}`);
  }
  return body;
}

export const twenty = {
  rest: {
    get: (path: string) => request(`/rest${path}`),
    post: (path: string, body: Json) => request(`/rest${path}`, { method: "POST", body: JSON.stringify(body) }),
    patch: (path: string, body: Json) => request(`/rest${path}`, { method: "PATCH", body: JSON.stringify(body) }),
  },
  metadata: {
    get: (path: string) => request(`/metadata${path}`),
    post: (path: string, body: Json) => request(`/metadata${path}`, { method: "POST", body: JSON.stringify(body) }),
    patch: (path: string, body: Json) => request(`/metadata${path}`, { method: "PATCH", body: JSON.stringify(body) }),
  },
  graphql: async (query: string, variables: Json = {}) => {
    return request("/graphql", { method: "POST", body: JSON.stringify({ query, variables }) });
  },
};
