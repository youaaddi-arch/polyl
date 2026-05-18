import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.json();
  const { nom, objet, filtres } = body as { nom: string; objet: string; filtres: Record<string, string> };
  if (!nom || !objet) return NextResponse.json({ error: "nom et objet requis" }, { status: 400 });

  // Stocke les filtres au format JSON-array (compatible avec /listes existant)
  const filtresArray = Object.entries(filtres ?? {})
    .filter(([k]) => !["vue", "cols"].includes(k))
    .map(([k, v]) => ({ champ: k, operateur: "eq", valeur: v }));

  const liste = await prisma.liste.create({
    data: {
      nom,
      objet,
      type: "dynamique",
      filtres: JSON.stringify(filtresArray),
    },
  });

  return NextResponse.json({ ok: true, id: liste.id });
}
