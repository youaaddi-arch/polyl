import Link from "next/link";
import { prisma } from "@/lib/db";
import { TYPES_OPPORTUNITE } from "@/lib/options";

export const dynamic = "force-dynamic";

type Stage = { cle: string; libelle: string; probabilite: number; ordre: number };

export default async function OpportunitesPage({ searchParams }: { searchParams: { type?: string } }) {
  const typeActif = searchParams.type ?? "apprentissage";
  const typeConfig = TYPES_OPPORTUNITE.find((t) => t.cle === typeActif) ?? TYPES_OPPORTUNITE[0];
  const stages = typeConfig.stages as ReadonlyArray<Stage>;

  const allDeals = await prisma.deal.findMany({
    include: { entreprise: true, candidat: true, formation: true },
    orderBy: { createdAt: "desc" },
  });
  const deals = allDeals.filter((d) => d.type === typeConfig.cle);
  const countByType: Record<string, number> = {};
  for (const t of TYPES_OPPORTUNITE) countByType[t.cle] = allDeals.filter((d) => d.type === t.cle).length;

  const total = deals.reduce((s, d) => s + (d.montant ?? 0), 0);
  const ponderee = deals.reduce((s, d) => s + (d.montant ?? 0) * (d.probabilite / 100), 0);

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Opportunités</h1>
          <p className="text-hubspot-text-muted text-sm">
            Une opportunité = une candidature. Un apprenant peut avoir plusieurs opportunités.
          </p>
        </div>
        <Link href="/deals/nouveau" className="btn-primary">+ Nouvelle opportunité</Link>
      </header>

      {/* TABS — 3 types de pipeline */}
      <div className="border-b border-hubspot-border">
        <div className="flex gap-1">
          {TYPES_OPPORTUNITE.map((t) => (
            <Link
              key={t.cle}
              href={`/deals?type=${t.cle}`}
              className={`px-4 py-3 text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
                t.cle === typeActif
                  ? "border-hubspot-orange text-hubspot-orange"
                  : "border-transparent text-hubspot-text-muted hover:text-hubspot-text"
              }`}
            >
              <span className="w-2 h-2 rounded-full" style={{ background: t.couleur }} />
              {t.libelle}
              <span className="badge bg-hubspot-bg-alt text-hubspot-text ml-1">{countByType[t.cle] ?? 0}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="text-sm text-hubspot-text-muted">
        Pipeline <strong>{typeConfig.libelle}</strong> — {stages.length} étapes · {deals.length} opportunités · Total : <strong>{total.toLocaleString("fr-FR")} €</strong> · Pondéré : <strong>{Math.round(ponderee).toLocaleString("fr-FR")} €</strong>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-4">
        {[...stages].sort((a, b) => a.ordre - b.ordre).map((stage) => {
          const dealsStage = deals.filter((d) => d.etapeCle === stage.cle);
          const valeur = dealsStage.reduce((s, d) => s + (d.montant ?? 0), 0);
          return (
            <div key={stage.cle} className="shrink-0 w-80 bg-hubspot-bg-alt rounded p-3 flex flex-col">
              <div className="mb-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm">{stage.libelle}</span>
                  <span className="badge bg-white text-hubspot-text border border-hubspot-border">{dealsStage.length}</span>
                </div>
                <div className="text-xs text-hubspot-text-muted mt-1">
                  {valeur.toLocaleString("fr-FR")} € · proba {stage.probabilite}%
                </div>
              </div>
              <div className="space-y-2">
                {dealsStage.map((d) => (
                  <Link key={d.id} href={`/deals/${d.id}`} className="block bg-white rounded p-3 shadow-hs border border-hubspot-border hover:border-hubspot-orange">
                    <div className="font-medium text-sm">{d.titre}</div>
                    <div className="text-xs text-hubspot-text-muted mt-1">
                      {d.candidat && <span>👤 {d.candidat.prenom} {d.candidat.nom}</span>}
                      {d.entreprise && <><br />🏢 {d.entreprise.raisonSociale}</>}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-semibold text-hubspot-orange">
                        {d.montant ? `${d.montant.toLocaleString("fr-FR")} €` : "—"}
                      </span>
                      {d.dateClotPrevue && (
                        <span className="text-xs text-hubspot-text-muted">{new Intl.DateTimeFormat("fr-FR").format(d.dateClotPrevue)}</span>
                      )}
                    </div>
                    {d.ownerName && <div className="text-[10px] text-hubspot-text-muted mt-1">👤 {d.ownerName}</div>}
                  </Link>
                ))}
                {dealsStage.length === 0 && <div className="text-xs text-hubspot-text-muted italic px-1 py-2">—</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
