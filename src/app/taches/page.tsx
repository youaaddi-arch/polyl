import Link from "next/link";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function TachesPage() {
  const taches = await prisma.tache.findMany({
    orderBy: [{ statut: "asc" }, { echeance: "asc" }],
    include: { candidat: true, entreprise: true },
  });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Tâches</h1>
        <p className="text-gray-500 text-sm">Suivi des actions commerciales et administratives</p>
      </header>
      <div className="card overflow-x-auto">
        <table className="crm">
          <thead>
            <tr><th>Titre</th><th>Type</th><th>Lié à</th><th>Priorité</th><th>Échéance</th><th>Statut</th></tr>
          </thead>
          <tbody>
            {taches.map((t) => (
              <tr key={t.id}>
                <td className="font-medium">{t.titre}</td>
                <td>{t.type}</td>
                <td>
                  {t.candidat && <Link href={`/candidats/${t.candidat.id}`} className="text-brand-600 hover:underline">{t.candidat.prenom} {t.candidat.nom}</Link>}
                  {t.entreprise && <Link href={`/entreprises/${t.entreprise.id}`} className="text-brand-600 hover:underline">{t.entreprise.raisonSociale}</Link>}
                </td>
                <td>
                  <span className={`badge ${t.priorite === "haute" ? "bg-rose-50 text-rose-700" : "bg-gray-100 text-gray-700"}`}>{t.priorite}</span>
                </td>
                <td>{t.echeance ? new Intl.DateTimeFormat("fr-FR").format(t.echeance) : "—"}</td>
                <td>
                  <span className={`badge ${t.statut === "faite" ? "bg-emerald-50 text-emerald-700" : t.statut === "en_cours" ? "bg-blue-50 text-blue-700" : "bg-amber-50 text-amber-700"}`}>{t.statut}</span>
                </td>
              </tr>
            ))}
            {taches.length === 0 && <tr><td colSpan={6} className="text-center text-gray-400 py-8">Aucune tâche</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
