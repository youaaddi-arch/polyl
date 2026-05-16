import "dotenv/config";

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}. Copy .env.example to .env and fill it in.`);
  }
  return value;
}

export const config = {
  workspaceUrl: required("TWENTY_WORKSPACE_URL"),
  apiBase: process.env.TWENTY_API_BASE ?? `${required("TWENTY_WORKSPACE_URL")}/api`,
  apiKey: required("TWENTY_API_KEY"),
};
