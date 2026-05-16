import { config } from "../src/config.ts";
import { twenty } from "../src/client.ts";

async function main() {
  console.log(`Workspace: ${config.workspaceUrl}`);
  console.log(`API base : ${config.apiBase}`);
  console.log("Pinging Twenty metadata API (read-only)...\n");

  const endpoints = ["/objects", "/fields"];
  for (const ep of endpoints) {
    try {
      const data = await twenty.metadata.get(ep);
      const count = Array.isArray((data as { data?: unknown[] })?.data)
        ? (data as { data: unknown[] }).data.length
        : "?";
      console.log(`OK  GET /metadata${ep} -> ${count} items`);
    } catch (err) {
      console.error(`FAIL GET /metadata${ep}`);
      console.error(String(err));
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
