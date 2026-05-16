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
  const contentType = res.headers.get("content-type") ?? "";
  let body: unknown;
  if (contentType.includes("application/json")) {
    try {
      body = text ? JSON.parse(text) : null;
    } catch {
      throw new Error(`Twenty API ${res.status} on ${path}: invalid JSON body\n${text.slice(0, 300)}`);
    }
  } else {
    if (res.ok) {
      throw new Error(`Twenty API ${res.status} on ${path}: non-JSON response (got ${contentType || "no content-type"}). Check TWENTY_API_BASE — cloud workspaces should target https://api.twenty.com.`);
    }
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
    delete: (path: string) => request(`/rest${path}`, { method: "DELETE" }),
  },
  metadata: {
    get: (path: string) => request(`/rest/metadata${path}`),
    post: (path: string, body: Json) => request(`/rest/metadata${path}`, { method: "POST", body: JSON.stringify(body) }),
    patch: (path: string, body: Json) => request(`/rest/metadata${path}`, { method: "PATCH", body: JSON.stringify(body) }),
    delete: (path: string) => request(`/rest/metadata${path}`, { method: "DELETE" }),
    graphql: (query: string, variables: Json = {}) =>
      request("/metadata", { method: "POST", body: JSON.stringify({ query, variables }) }),
  },
  graphql: (query: string, variables: Json = {}) =>
    request("/graphql", { method: "POST", body: JSON.stringify({ query, variables }) }),
};
