import { prisma } from "@/lib/db";
import { PIPELINE_ENTREPRISE } from "@/lib/pipelines";
import KanbanColonne from "@/components/KanbanColonne";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function PipelineEntreprisePage() {
  const entreprises = await prisma.entreprise.findMany({
    include: { entite: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Pipeline Entreprise</h1>
          <p className="text-gray-500 text-sm">17 étapes — de la détection d'annonce à l'upsell (CDC section 7.1)</p>
        </div>
        <div className="flex gap-2">
          <Link href="/entreprises" className="btn-secondary">📋 Vue liste</Link>
          <Link href="/entreprises/nouveau" className="btn-primary">+ Nouvelle entreprise</Link>
        </div>
      </header>

      <div className="flex gap-3 overflow-x-auto pb-4">
        {PIPELINE_ENTREPRISE.map((etape) => {
          const cards = entreprises
            .filter((e) => e.etapePipeline === etape.numero)
            .map((e) => ({
              id: e.id,
              titre: e.raisonSociale,
              soustitre: `${e.secteur ?? "—"} · ${e.ville ?? "—"}`,
              badge: e.entite?.code ?? null,
              href: `/entreprises/${e.id}`,
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
