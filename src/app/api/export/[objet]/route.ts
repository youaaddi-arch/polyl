import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

function toCSV(rows: any[]): string {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const escape = (v: any) => {
    if (v === null || v === undefined) return "";
    const s = v instanceof Date ? v.toISOString() : String(v);
    return s.includes(",") || s.includes('"') || s.includes("\n") ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [headers.join(","), ...rows.map((r) => headers.map((h) => escape(r[h])).join(","))].join("\n");
}

export async function GET(_req: Request, { params }: { params: { objet: string } }) {
  let rows: any[] = [];
  switch (params.objet) {
    case "candidats":
      rows = await prisma.candidat.findMany({ include: { entite: true, formation: true } });
      rows = rows.map((c) => ({ id: c.id, prenom: c.prenom, nom: c.nom, email: c.email, telephone: c.telephone, ville: c.ville, persona: c.persona, statut: c.statut, etape: c.etapePipeline, entite: c.entite?.code, formation: c.formation?.intitule, createdAt: c.createdAt }));
      break;
    case "entreprises":
      rows = await prisma.entreprise.findMany({ include: { entite: true } });
      rows = rows.map((e) => ({ id: e.id, raisonSociale: e.raisonSociale, siret: e.siret, secteur: e.secteur, ville: e.ville, taille: e.taille, persona: e.persona, statut: e.statut, etape: e.etapePipeline, entite: e.entite?.code, createdAt: e.createdAt }));
      break;
    case "deals":
      rows = await prisma.deal.findMany({ include: { entreprise: true, candidat: true } });
      rows = rows.map((d) => ({ id: d.id, titre: d.titre, montant: d.montant, probabilite: d.probabilite, etapeCle: d.etapeCle, statut: d.statut, entreprise: d.entreprise?.raisonSociale, candidat: d.candidat ? `${d.candidat.prenom} ${d.candidat.nom}` : null, dateClotPrevue: d.dateClotPrevue }));
      break;
    case "tickets":
      rows = await prisma.ticket.findMany();
      break;
    default:
      return NextResponse.json({ error: "objet inconnu" }, { status: 400 });
  }
  const csv = toCSV(rows);
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${params.objet}-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
