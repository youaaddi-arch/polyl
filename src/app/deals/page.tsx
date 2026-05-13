import Link from "next/link";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

type Stage = { cle: string; libelle: string; probabilite: number; ordre: number };

export default async function DealsKanbanPage() {
  const [pipeline, deals] = await Promise.all([
    prisma.dealPipeline.findFirst({ where: { isDefault: true } }),
    prisma.deal.findMany({ include: { entreprise: true, candidat: true, formation: true }, orderBy: { createdAt: "desc" } }),
  ]);
  const stages: Stage[] = pipeline ? JSON.parse(pipeline.stages) : [];
  stages.sort((a, b) => a.ordre - b.ordre);
  const total = deals.reduce((s, d) => s + (d.montant ?? 0), 0);
  const ponderee = deals.reduce((s, d) => s + (d.montant ?? 0) * (d.probabilite / 100), 0);

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Deals</h1>
          <p className="text-gray-500 text-sm">{deals.length} opportunités · Pipeline total : {total.toLocaleString("fr-FR")} € · Pondéré : {Math.round(ponderee).toLocaleString("fr-FR")} €</p>
        </div>
        <div className="flex gap-2">
          <Link href="/deals/nouveau" className="btn-primary">+ Nouveau deal</Link>
        </div>
      </header>

      <div className="flex gap-3 overflow-x-auto pb-4">
        {stages.map((stage) => {
          const dealsStage = deals.filter((d) => d.etapeCle === stage.cle);
          const valeur = dealsStage.reduce((s, d) => s + (d.montant ?? 0), 0);
          return (
            <div key={stage.cle} className="shrink-0 w-80 bg-gray-100 rounded-xl p-3 flex flex-col">
              <div className="mb-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm">{stage.libelle}</span>
                  <span className="badge bg-white text-gray-600 border">{dealsStage.length}</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {valeur.toLocaleString("fr-FR")} € · proba {stage.probabilite}%
                </div>
              </div>
              <div className="space-y-2">
                {dealsStage.map((d) => (
                  <Link key={d.id} href={`/deals/${d.id}`} className="block bg-white rounded-lg p-3 shadow-sm border border-gray-200 hover:border-brand-300">
                    <div className="font-medium text-sm">{d.titre}</div>
                    <div className="text-xs text-gray-500 mt-1">{d.entreprise?.raisonSociale ?? "—"}</div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-semibold text-brand-700">
                        {d.montant ? `${d.montant.toLocaleString("fr-FR")} €` : "—"}
                      </span>
                      {d.dateClotPrevue && (
                        <span className="text-xs text-gray-400">{new Intl.DateTimeFormat("fr-FR").format(d.dateClotPrevue)}</span>
                      )}
                    </div>
                  </Link>
                ))}
                {dealsStage.length === 0 && <div className="text-xs text-gray-400 italic px-1 py-2">Aucun deal</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
