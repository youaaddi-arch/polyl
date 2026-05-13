import Link from "next/link";
import { prisma } from "@/lib/db";
import { PIPELINE_CANDIDAT } from "@/lib/pipelines";

export const dynamic = "force-dynamic";

export default async function CandidatsListPage() {
  const candidats = await prisma.candidat.findMany({
    orderBy: { createdAt: "desc" },
    include: { formation: true, entite: true },
  });

  const etapeLib = (n: number) => PIPELINE_CANDIDAT.find((e) => e.numero === n)?.libelle ?? "—";

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Candidats</h1>
          <p className="text-gray-500 text-sm mt-1">{candidats.length} candidat(s) dans le CRM</p>
        </div>
        <div className="flex gap-2">
          <Link href="/candidats/pipeline" className="btn-secondary">🧭 Pipeline kanban</Link>
          <Link href="/candidats/nouveau" className="btn-primary">+ Nouveau candidat</Link>
        </div>
      </header>

      <div className="card overflow-x-auto">
        <table className="crm">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Email</th>
              <th>Ville</th>
              <th>Formation</th>
              <th>Entité</th>
              <th>Persona</th>
              <th>Étape</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {candidats.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td>
                  <Link href={`/candidats/${c.id}`} className="font-medium text-brand-600 hover:underline">
                    {c.prenom} {c.nom}
                  </Link>
                </td>
                <td className="text-gray-600">{c.email ?? "—"}</td>
                <td className="text-gray-600">{c.ville ?? "—"}</td>
                <td className="text-gray-600">{c.formation?.intitule ?? "—"}</td>
                <td>{c.entite?.code ? <span className="badge bg-gray-100 text-gray-700">{c.entite.code}</span> : "—"}</td>
                <td>{c.persona ? <span className="badge bg-purple-50 text-purple-700">{c.persona}</span> : "—"}</td>
                <td><span className="badge bg-brand-50 text-brand-700">{c.etapePipeline} · {etapeLib(c.etapePipeline)}</span></td>
                <td>
                  <span className={`badge ${
                    c.statut === "place" ? "bg-emerald-50 text-emerald-700" :
                    c.statut === "diplome" ? "bg-blue-50 text-blue-700" :
                    c.statut === "abandon" ? "bg-rose-50 text-rose-700" :
                    "bg-amber-50 text-amber-700"
                  }`}>{c.statut}</span>
                </td>
              </tr>
            ))}
            {candidats.length === 0 && (
              <tr><td colSpan={8} className="text-center text-gray-400 py-8">Aucun candidat — lance <code>npm run db:seed</code></td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
