import { twenty } from "../src/client.ts";

type ObjectMetadata = {
  id: string;
  nameSingular: string;
  namePlural: string;
  labelSingular: string;
  isCustom: boolean;
  isActive: boolean;
  isSystem?: boolean;
};

async function main() {
  const res = (await twenty.metadata.get("/objects")) as { data?: ObjectMetadata[] };
  const objects = res?.data ?? [];

  console.log(`Total objects: ${objects.length}`);
  const custom = objects.filter((o) => o.isCustom);
  const native = objects.filter((o) => !o.isCustom && !o.isSystem);
  const system = objects.filter((o) => o.isSystem);
  console.log(`  custom: ${custom.length} | native: ${native.length} | system: ${system.length}\n`);

  const sorted = [...objects].sort((a, b) => a.nameSingular.localeCompare(b.nameSingular));
  console.table(
    sorted.map((o) => ({
      name: o.nameSingular,
      label: o.labelSingular,
      custom: o.isCustom ? "yes" : "",
      system: o.isSystem ? "yes" : "",
      active: o.isActive ? "yes" : "no",
    })),
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
