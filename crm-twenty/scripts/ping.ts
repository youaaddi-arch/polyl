import { config } from "../src/config.ts";
import { twenty } from "../src/client.ts";

function count(res: unknown): number | string {
  const data = (res as { data?: unknown })?.data;
  if (Array.isArray(data)) return data.length;
  return "?";
}

async function main() {
  console.log(`Workspace: ${config.workspaceUrl}`);
  console.log(`API base : ${config.apiBase}`);
  console.log("Pinging Twenty metadata API (read-only)...\n");

  let failed = 0;
  for (const ep of ["/objects", "/fields"]) {
    try {
      const data = await twenty.metadata.get(ep);
      console.log(`OK   GET /rest/metadata${ep} -> ${count(data)} items`);
    } catch (err) {
      failed++;
      console.error(`FAIL GET /rest/metadata${ep}`);
      console.error(String(err));
    }
  }

  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
