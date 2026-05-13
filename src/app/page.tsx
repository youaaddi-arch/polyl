import { prisma } from "@/lib/db";
import StatCard from "@/components/StatCard";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [
    nbCandidats,
    nbEnCours,
    nbPlaces,
    nbEntreprises,
    nbPartenaires,
    nbTaches,
    nbFormations,
    nbVeille,
    prochainsEvts,
    derniersCandidats,
  ] = await Promise.all([
    prisma.candidat.count(),
    prisma.candidat.count({ where: { statut: "en_cours" } }),
    prisma.candidat.count({ where: { statut: "place" } }),
    prisma.entreprise.count(),
    prisma.entreprise.count({ where: { statut: "partenaire_actif" } }),
    prisma.tache.count({ where: { statut: "a_faire" } }),
    prisma.formation.count(),
    prisma.veille.count(),
    prisma.evenement.findMany({ orderBy: { date: "asc" }, take: 5, include: { entite: true } }),
    prisma.candidat.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { formation: true, entite: true },
    }),
  ]);

  const tauxPlacement = nbCandidats ? Math.round((nbPlaces / nbCandidats) * 100) : 0;

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-gray-500 text-sm mt-1">Vue 360° du groupe — 6 entités, pipelines candidats & entreprises</p>
        </div>
        <div className="flex gap-2">
          <Link href="/candidats/nouveau" className="btn-primary">+ Nouveau candidat</Link>
          <Link href="/entreprises/nouveau" className="btn-secondary">+ Nouvelle entreprise</Link>
        </div>
      </header>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Candidats"    value={nbCandidats}    hint={`${nbEnCours} en cours`} />
        <StatCard label="Placés"       value={nbPlaces}       hint={`Taux : ${tauxPlacement} %`} accent="green" />
        <StatCard label="Entreprises"  value={nbEntreprises}  hint={`${nbPartenaires} partenaires actifs`} />
        <StatCard label="Tâches"       value={nbTaches}       hint="à traiter" accent="amber" />
        <StatCard label="Formations"   value={nbFormations}   hint="catalogue 6 entités" />
        <StatCard label="Veille"       value={nbVeille}       hint="éléments en base" />
        <StatCard label="Événements"   value={prochainsEvts.length} hint="à venir" />
        <StatCard label="Doc checklist" value={21} hint="étapes obligatoires" />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Derniers candidats</h2>
            <Link href="/candidats" className="text-sm text-brand-600 hover:underline">Voir tout →</Link>
          </div>
          <table className="crm">
            <thead><tr><th>Nom</th><th>Formation</th><th>Entité</th><th>Étape</th></tr></thead>
            <tbody>
              {derniersCandidats.map((c) => (
                <tr key={c.id}>
                  <td>
                    <Link href={`/candidats/${c.id}`} className="text-brand-600 hover:underline">
                      {c.prenom} {c.nom}
                    </Link>
                  </td>
                  <td className="text-gray-600">{c.formation?.intitule ?? "—"}</td>
                  <td><span className="badge bg-gray-100 text-gray-700">{c.entite?.code ?? "—"}</span></td>
                  <td><span className="badge bg-brand-50 text-brand-700">Étape {c.etapePipeline}</span></td>
                </tr>
              ))}
              {derniersCandidats.length === 0 && (
                <tr><td colSpan={4} className="text-center text-gray-400 py-4">Aucun candidat</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Prochains événements</h2>
            <Link href="/evenements" className="text-sm text-brand-600 hover:underline">Voir tout →</Link>
          </div>
          <ul className="divide-y">
            {prochainsEvts.map((e) => (
              <li key={e.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-medium">{e.titre}</div>
                  <div className="text-xs text-gray-500">
                    {e.lieu} · {e.entite?.code ?? "—"}
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  {new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(e.date)}
                </div>
              </li>
            ))}
            {prochainsEvts.length === 0 && (
              <li className="py-4 text-center text-gray-400 text-sm">Aucun événement</li>
            )}
          </ul>
        </div>
      </section>
    </div>
  );
}
