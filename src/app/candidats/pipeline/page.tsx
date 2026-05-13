import { prisma } from "@/lib/db";
import { PIPELINE_CANDIDAT } from "@/lib/pipelines";
import KanbanColonne from "@/components/KanbanColonne";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function PipelineCandidatPage() {
  const candidats = await prisma.candidat.findMany({
    include: { formation: true, entite: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Pipeline Candidat</h1>
          <p className="text-gray-500 text-sm">19 étapes — du dépôt de candidature à la fidélisation Alumni (CDC section 6.1)</p>
        </div>
        <div className="flex gap-2">
          <Link href="/candidats" className="btn-secondary">📋 Vue liste</Link>
          <Link href="/candidats/nouveau" className="btn-primary">+ Nouveau candidat</Link>
        </div>
      </header>

      <div className="flex gap-3 overflow-x-auto pb-4">
        {PIPELINE_CANDIDAT.map((etape) => {
          const cards = candidats
            .filter((c) => c.etapePipeline === etape.numero)
            .map((c) => ({
              id: c.id,
              titre: `${c.prenom} ${c.nom}`,
              soustitre: c.formation?.intitule ?? c.ville ?? "—",
              badge: c.entite?.code ?? null,
              href: `/candidats/${c.id}`,
            }));
          return (
            <KanbanColonne
              key={etape.cle}
              numero={etape.numero}
              libelle={etape.libelle}
              description={etape.description}
              cards={cards}
            />
          );
        })}
      </div>
    </div>
  );
}
