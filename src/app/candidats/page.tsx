import Link from "next/link";
import { prisma } from "@/lib/db";
import { PIPELINE_CANDIDAT } from "@/lib/pipelines";
import { STATUTS_LEAD } from "@/lib/options";

export const dynamic = "force-dynamic";

export default async function CandidatsListPage() {
  const candidats = await prisma.candidat.findMany({
    orderBy: { derniereActivite: "desc" },
    include: { formation: true, entite: true, societeMatchee: true, deals: true },
  });

  const etapeLib = (n: number) => PIPELINE_CANDIDAT.find((e) => e.numero === n)?.libelle ?? "—";
  const statutLeadLib = (code: string | null) => STATUTS_LEAD.find((s) => s.code === code) ?? STATUTS_LEAD[0];

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Candidats / Apprenants</h1>
          <p className="text-hubspot-text-muted text-sm mt-1">{candidats.length} contacts dans le CRM</p>
        </div>
        <div className="flex gap-2">
          <Link href="/imports" className="btn-secondary">↕️ Import / Export</Link>
          <Link href="/candidats/pipeline" className="btn-secondary">🧭 Kanban</Link>
          <Link href="/candidats/nouveau" className="btn-primary">+ Nouveau candidat</Link>
        </div>
      </header>

      <div className="card overflow-x-auto">
        <table className="crm text-xs">
          <thead>
            <tr>
              <th>Nom</th>
              <th>📞 Téléphone</th>
              <th>📍 Adresse</th>
              <th>📅 Candidature</th>
              <th>⏱️ Dernière activité</th>
              <th>💰 Financement</th>
              <th>🎯 Statut lead</th>
              <th>🏢 Société matchée</th>
              <th>📚 Formation</th>
              <th>Entité</th>
              <th>💼 Opportunités</th>
              <th>Étape</th>
            </tr>
          </thead>
          <tbody>
            {candidats.map((c) => {
              const sl = statutLeadLib(c.statutLead);
              return (
                <tr key={c.id} className="hover:bg-hubspot-bg">
                  <td>
                    <Link href={`/candidats/${c.id}`} className="font-medium text-hubspot-orange hover:underline">
                      {c.prenom} {c.nom}
                    </Link>
                    {c.email && <div className="text-[10px] text-hubspot-text-muted">{c.email}</div>}
                  </td>
                  <td className="text-hubspot-text-muted whitespace-nowrap">{c.telephone ?? "—"}</td>
                  <td className="text-hubspot-text-muted">
                    {c.ville ? <>{c.codePostal} {c.ville}</> : "—"}
                  </td>
                  <td className="text-hubspot-text-muted whitespace-nowrap">{c.dateCandidature ? new Intl.DateTimeFormat("fr-FR").format(c.dateCandidature) : "—"}</td>
                  <td className="text-hubspot-text-muted whitespace-nowrap">{c.derniereActivite ? new Intl.DateTimeFormat("fr-FR").format(c.derniereActivite) : "—"}</td>
                  <td>{c.financementChoisi ? <span className="badge bg-amber-50 text-amber-700">{c.financementChoisi}</span> : "—"}</td>
                  <td><span className={`badge bg-${sl.couleur}-50 text-${sl.couleur}-700`}>{sl.libelle}</span></td>
                  <td className="text-hubspot-text-muted">{c.societeMatchee?.raisonSociale ?? "—"}</td>
                  <td className="text-hubspot-text-muted">{c.formation?.intitule ?? "—"}</td>
                  <td>{c.entite?.code ? <span className="badge bg-hubspot-bg-alt">{c.entite.code}</span> : "—"}</td>
                  <td><span className="badge bg-orange-50 text-hubspot-orange">{c.deals.length}</span></td>
                  <td><span className="badge bg-hubspot-bg-alt">{c.etapePipeline} · {etapeLib(c.etapePipeline)}</span></td>
                </tr>
              );
            })}
            {candidats.length === 0 && (
              <tr><td colSpan={12} className="text-center text-hubspot-text-muted py-8">Aucun candidat</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
