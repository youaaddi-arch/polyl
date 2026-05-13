import Link from "next/link";
import { prisma } from "@/lib/db";
import { PIPELINE_ENTREPRISE } from "@/lib/pipelines";

export const dynamic = "force-dynamic";

export default async function EntreprisesListPage() {
  const entreprises = await prisma.entreprise.findMany({
    orderBy: { createdAt: "desc" },
    include: { entite: true, contacts: true },
  });

  const etapeLib = (n: number) => PIPELINE_ENTREPRISE.find((e) => e.numero === n)?.libelle ?? "—";

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Entreprises</h1>
          <p className="text-gray-500 text-sm mt-1">{entreprises.length} entreprise(s) dans le CRM</p>
        </div>
        <div className="flex gap-2">
          <Link href="/entreprises/pipeline" className="btn-secondary">💼 Pipeline kanban</Link>
          <Link href="/entreprises/nouveau" className="btn-primary">+ Nouvelle entreprise</Link>
        </div>
      </header>

      <div className="card overflow-x-auto">
        <table className="crm">
          <thead>
            <tr>
              <th>Raison sociale</th>
              <th>SIRET</th>
              <th>Secteur</th>
              <th>Ville</th>
              <th>Persona</th>
              <th>Source</th>
              <th>Étape</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {entreprises.map((e) => (
              <tr key={e.id} className="hover:bg-gray-50">
                <td>
                  <Link href={`/entreprises/${e.id}`} className="font-medium text-brand-600 hover:underline">{e.raisonSociale}</Link>
                  <div className="text-xs text-gray-400">{e.contacts.length} contact(s)</div>
                </td>
                <td className="text-gray-600">{e.siret ?? "—"}</td>
                <td className="text-gray-600">{e.secteur ?? "—"}</td>
                <td className="text-gray-600">{e.ville ?? "—"}</td>
                <td>{e.persona ? <span className="badge bg-purple-50 text-purple-700">{e.persona}</span> : "—"}</td>
                <td className="text-gray-600">{e.sourceDetection ?? "—"}</td>
                <td><span className="badge bg-brand-50 text-brand-700">{e.etapePipeline} · {etapeLib(e.etapePipeline)}</span></td>
                <td>
                  <span className={`badge ${
                    e.statut === "partenaire_actif" ? "bg-emerald-50 text-emerald-700" :
                    e.statut === "qualifie" ? "bg-blue-50 text-blue-700" :
                    "bg-amber-50 text-amber-700"
                  }`}>{e.statut}</span>
                </td>
              </tr>
            ))}
            {entreprises.length === 0 && (
              <tr><td colSpan={8} className="text-center text-gray-400 py-8">Aucune entreprise — lance <code>npm run db:seed</code></td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
