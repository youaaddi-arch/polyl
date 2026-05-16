import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { twenty } from "../src/client.ts";

type FieldType =
  | "TEXT" | "NUMBER" | "BOOLEAN" | "DATE_TIME" | "EMAILS" | "PHONES"
  | "SELECT" | "MULTI_SELECT" | "RELATION";

type SelectOption = { value: string; label: string; color?: string; position?: number };

type FieldSpec = {
  name: string;
  label: string;
  type: FieldType;
  description?: string;
  isNullable?: boolean;
  defaultValue?: unknown;
  options?: SelectOption[];
  relatedObject?: string;
  relatedLabel?: string;
};

type ObjectSpec = {
  labelSingular: string;
  labelPlural: string;
  description?: string;
  icon?: string;
  labelIdentifier?: string;
  fields: FieldSpec[];
};

type Schema = {
  objects: Record<string, ObjectSpec>;
  nativeExtensions: Record<string, { fields: FieldSpec[] }>;
};

type ObjectMeta = {
  id: string;
  nameSingular: string;
  namePlural: string;
  labelSingular: string;
  isCustom: boolean;
  isSystem?: boolean;
};

type FieldMeta = {
  id: string;
  name: string;
  type: string;
  objectMetadataId: string;
};

type Flags = { dryRun: boolean; prefix: string };

function parseFlags(argv: string[]): Flags {
  let dryRun = false;
  let prefix = "";
  for (const a of argv) {
    if (a === "--dry-run") dryRun = true;
    else if (a.startsWith("--prefix=")) prefix = a.slice("--prefix=".length);
  }
  return { dryRun, prefix };
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const applyNamePrefix = (name: string, prefix: string) =>
  prefix ? `${prefix}${cap(name)}` : name;
const applyLabelPrefix = (label: string, prefix: string) =>
  prefix ? `[${prefix.toUpperCase()}] ${label}` : label;

function loadSchema(): Schema {
  const here = dirname(fileURLToPath(import.meta.url));
  const path = resolve(here, "..", "objects-schema.json");
  return JSON.parse(readFileSync(path, "utf8")) as Schema;
}

async function fetchObjects(): Promise<Map<string, ObjectMeta>> {
  const res = (await twenty.metadata.get("/objects")) as { data?: ObjectMeta[] };
  const map = new Map<string, ObjectMeta>();
  for (const o of res.data ?? []) map.set(o.nameSingular, o);
  return map;
}

async function fetchFieldsByObject(objectId: string): Promise<Set<string>> {
  const res = (await twenty.metadata.get(`/fields?filter=objectMetadataId[eq]:${objectId}`)) as {
    data?: FieldMeta[];
  };
  return new Set((res.data ?? []).map((f) => f.name));
}

type Op =
  | { kind: "create-object"; key: string; payload: Record<string, unknown>; spec: ObjectSpec }
  | { kind: "create-field"; objectKey: string; payload: Record<string, unknown> }
  | { kind: "create-relation"; objectKey: string; from: string; to: string; payload: Record<string, unknown> }
  | { kind: "skip"; reason: string };

function buildObjectPayload(key: string, spec: ObjectSpec, prefix: string): Record<string, unknown> {
  const nameSingular = applyNamePrefix(key, prefix);
  const namePlural = applyNamePrefix(plural(key), prefix);
  return {
    nameSingular,
    namePlural,
    labelSingular: applyLabelPrefix(spec.labelSingular, prefix),
    labelPlural: applyLabelPrefix(spec.labelPlural, prefix),
    description: spec.description,
    icon: spec.icon,
  };
}

function plural(name: string): string {
  if (name.endsWith("y") && !/[aeiou]y$/.test(name)) return name.slice(0, -1) + "ies";
  if (name.endsWith("s")) return name;
  return name + "s";
}

function buildFieldPayload(objectId: string, f: FieldSpec): Record<string, unknown> {
  const base: Record<string, unknown> = {
    objectMetadataId: objectId,
    name: f.name,
    label: f.label,
    type: f.type,
  };
  if (f.description) base.description = f.description;
  if (f.isNullable === false) base.isNullable = false;
  if (f.options) base.options = f.options;
  if (f.defaultValue !== undefined) {
    if (f.type === "SELECT" && typeof f.defaultValue === "string") {
      base.defaultValue = `'${f.defaultValue}'`;
    } else if (f.type === "BOOLEAN") {
      base.defaultValue = f.defaultValue;
    } else {
      base.defaultValue = f.defaultValue;
    }
  }
  return base;
}

function buildRelationPayload(
  objectId: string,
  targetObjectId: string,
  f: FieldSpec,
): Record<string, unknown> {
  return {
    objectMetadataId: objectId,
    name: f.name,
    label: f.label,
    type: "RELATION",
    description: f.description,
    relationCreationPayload: {
      targetObjectMetadataId: targetObjectId,
      targetFieldLabel: f.relatedLabel ?? "Related",
      targetFieldIcon: "IconLink",
      type: "MANY_TO_ONE",
    },
  };
}

async function plan(schema: Schema, flags: Flags): Promise<Op[]> {
  const ops: Op[] = [];
  const existingObjects = await fetchObjects();
  const planned = new Map<string, { id?: string; key: string }>(); // schema key → meta

  // Phase 1: objects
  for (const [key, spec] of Object.entries(schema.objects)) {
    const targetName = applyNamePrefix(key, flags.prefix);
    const existing = existingObjects.get(targetName);
    if (existing) {
      planned.set(key, { id: existing.id, key });
      ops.push({ kind: "skip", reason: `object '${targetName}' already exists (id=${existing.id})` });
    } else {
      ops.push({
        kind: "create-object",
        key,
        payload: buildObjectPayload(key, spec, flags.prefix),
        spec,
      });
      planned.set(key, { key });
    }
  }

  // Resolve native object ids (person, company)
  for (const native of Object.keys(schema.nativeExtensions)) {
    const existing = existingObjects.get(native);
    if (!existing) {
      ops.push({ kind: "skip", reason: `native object '${native}' not found in workspace — skipping its extensions` });
    } else {
      planned.set(native, { id: existing.id, key: native });
    }
  }

  // Phase 2 + 3: fields. We need object ids first. For existing objects we have ids; for
  // newly-created ones we'll resolve at execute time. In dry-run we just log the intent.
  for (const [key, spec] of Object.entries(schema.objects)) {
    const objMeta = planned.get(key);
    const existingFieldNames = objMeta?.id ? await fetchFieldsByObject(objMeta.id) : new Set<string>();
    for (const f of spec.fields) {
      if (existingFieldNames.has(f.name)) {
        ops.push({ kind: "skip", reason: `field '${key}.${f.name}' already exists` });
        continue;
      }
      if (f.type === "RELATION") {
        const target = planned.get(f.relatedObject!);
        if (!target) {
          ops.push({ kind: "skip", reason: `relation '${key}.${f.name}' → '${f.relatedObject}' target missing` });
          continue;
        }
        ops.push({
          kind: "create-relation",
          objectKey: key,
          from: key,
          to: f.relatedObject!,
          payload: buildRelationPayload(objMeta?.id ?? "<resolved-at-exec>", target.id ?? "<resolved-at-exec>", f),
        });
      } else {
        ops.push({
          kind: "create-field",
          objectKey: key,
          payload: buildFieldPayload(objMeta?.id ?? "<resolved-at-exec>", f),
        });
      }
    }
  }

  // Native extensions
  for (const [native, ext] of Object.entries(schema.nativeExtensions)) {
    const objMeta = planned.get(native);
    if (!objMeta?.id) continue;
    const existingFieldNames = await fetchFieldsByObject(objMeta.id);
    for (const f of ext.fields) {
      if (existingFieldNames.has(f.name)) {
        ops.push({ kind: "skip", reason: `field '${native}.${f.name}' already exists` });
        continue;
      }
      ops.push({
        kind: "create-field",
        objectKey: native,
        payload: buildFieldPayload(objMeta.id, f),
      });
    }
  }

  return ops;
}

async function execute(ops: Op[], schema: Schema, flags: Flags): Promise<void> {
  const objectIds = new Map<string, string>(); // schema key (un-prefixed) → id
  // pre-fill known ids from skip messages? simpler: re-fetch existing objects map
  const existing = await fetchObjects();
  for (const key of Object.keys(schema.objects)) {
    const targetName = applyNamePrefix(key, flags.prefix);
    const e = existing.get(targetName);
    if (e) objectIds.set(key, e.id);
  }
  for (const native of Object.keys(schema.nativeExtensions)) {
    const e = existing.get(native);
    if (e) objectIds.set(native, e.id);
  }

  // Pass 1: create objects
  for (const op of ops) {
    if (op.kind !== "create-object") continue;
    const created = (await twenty.metadata.post("/objects", op.payload)) as ObjectMeta;
    objectIds.set(op.key, created.id);
    console.log(`+ object  ${created.nameSingular} (${created.id})`);
  }

  // Pass 2 + 3: fields (resolve ids now)
  for (const op of ops) {
    if (op.kind === "create-field") {
      const ownerId = objectIds.get(op.objectKey);
      if (!ownerId) throw new Error(`Owner object id missing for ${op.objectKey}`);
      const payload: Record<string, unknown> = { ...op.payload, objectMetadataId: ownerId };
      await twenty.metadata.post("/fields", payload);
      console.log(`+ field   ${op.objectKey}.${String(payload.name)}`);
    } else if (op.kind === "create-relation") {
      const ownerId = objectIds.get(op.from);
      const targetId = objectIds.get(op.to);
      if (!ownerId || !targetId) throw new Error(`Relation ids missing: ${op.from}→${op.to}`);
      const inner = (op.payload as { relationCreationPayload: Record<string, unknown> }).relationCreationPayload;
      const payload: Record<string, unknown> = {
        ...op.payload,
        objectMetadataId: ownerId,
        relationCreationPayload: { ...inner, targetObjectMetadataId: targetId },
      };
      await twenty.metadata.post("/fields", payload);
      console.log(`+ rel     ${op.from}.${String(payload.name)} → ${op.to}`);
    }
  }
}

function summarize(ops: Op[]): void {
  const buckets: Record<string, number> = {};
  for (const op of ops) buckets[op.kind] = (buckets[op.kind] ?? 0) + 1;
  console.log("\nSummary:");
  for (const [k, v] of Object.entries(buckets)) console.log(`  ${k}: ${v}`);
}

async function main() {
  const flags = parseFlags(process.argv.slice(2));
  const schema = loadSchema();
  console.log(`Mode    : ${flags.dryRun ? "DRY-RUN" : "APPLY"}${flags.prefix ? ` | prefix='${flags.prefix}'` : ""}`);
  console.log(`Schema  : ${Object.keys(schema.objects).length} objects + ${Object.keys(schema.nativeExtensions).length} native extensions\n`);

  const ops = await plan(schema, flags);

  for (const op of ops) {
    if (op.kind === "skip") {
      console.log(`= skip   ${op.reason}`);
    } else if (op.kind === "create-object") {
      console.log(`+ object  ${(op.payload as { nameSingular: string }).nameSingular}`);
    } else if (op.kind === "create-field") {
      console.log(`+ field   ${op.objectKey}.${(op.payload as { name: string }).name} (${(op.payload as { type: string }).type})`);
    } else if (op.kind === "create-relation") {
      console.log(`+ rel     ${op.from}.${(op.payload as { name: string }).name} → ${op.to}`);
    }
  }
  summarize(ops);

  if (flags.dryRun) {
    console.log("\nDry-run complete. Re-run without --dry-run to apply.");
    return;
  }

  console.log("\nApplying…\n");
  await execute(ops, schema, flags);
  console.log("\nDone.");
}

main().catch((err) => {
  console.error("\nFATAL");
  console.error(String(err));
  process.exit(1);
});
