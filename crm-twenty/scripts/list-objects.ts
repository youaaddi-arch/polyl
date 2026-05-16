import { twenty } from "../src/client.ts";

type ObjectMetadata = {
  id: string;
  nameSingular: string;
  namePlural: string;
  labelSingular: string;
  isCustom: boolean;
  isActive: boolean;
};

async function main() {
  const res = (await twenty.metadata.get("/objects")) as { data?: { objects?: ObjectMetadata[] } } | ObjectMetadata[];
  const objects: ObjectMetadata[] = Array.isArray(res)
    ? res
    : (res?.data?.objects ?? []);

  console.log(`Total objects: ${objects.length}\n`);
  const rows = objects.map((o) => ({
    name: o.nameSingular,
    label: o.labelSingular,
    custom: o.isCustom ? "yes" : "no",
    active: o.isActive ? "yes" : "no",
  }));
  console.table(rows);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
