import { prisma } from "@/lib/db";
import NouveauCandidatForm from "@/components/NouveauCandidatForm";

export const dynamic = "force-dynamic";

export default async function NouveauCandidatPage() {
  const [entites, formationsRaw, entreprises] = await Promise.all([
    prisma.entite.findMany({ orderBy: { code: "asc" } }),
    prisma.formation.findMany({ orderBy: [{ type: "asc" }, { intitule: "asc" }], include: { entite: true } }),
    prisma.entreprise.findMany({ orderBy: { raisonSociale: "asc" } }),
  ]);

  const formations = formationsRaw.map((f) => ({
    id: f.id,
    intitule: f.intitule,
    niveau: f.niveau,
    type: f.type,
    entiteCode: f.entite?.code ?? null,
    domaine: f.domaine,
    montant: f.montant,
  }));

  return (
    <NouveauCandidatForm
      entites={entites.map((e) => ({ id: e.id, code: e.code, specialite: e.specialite }))}
      formations={formations}
      entreprises={entreprises.map((e) => ({ id: e.id, raisonSociale: e.raisonSociale }))}
    />
  );
}
