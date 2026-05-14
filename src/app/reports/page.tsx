import { prisma } from "@/lib/db";
import { PIPELINE_CANDIDAT, PIPELINE_ENTREPRISE } from "@/lib/pipelines";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const [candidats, entreprises, deals, dealsByStage, candidatsByEntite] = await Promise.all([
    prisma.candidat.findMany(),
    prisma.entreprise.findMany(),
    prisma.deal.findMany(),
    prisma.deal.groupBy({ by: ["etapeCle"], _count: true, _sum: { montant: true } }),
    prisma.candidat.groupBy({ by: ["entiteId"], _count: true }),
  ]);
  const entites = await prisma.entite.findMany();
  const entiteById = Object.fromEntries(entites.map((e) => [e.id, e]));

  const repCandidats = PIPELINE_CANDIDAT.map((e) => ({ libelle: `${e.numero}. ${e.libelle}`, count: candidats.filter((c) => c.etapePipeline === e.numero).length }));
  const repEntreprises = PIPELINE_ENTREPRISE.map((e) => ({ libelle: `${e.numero}. ${e.libelle}`, count: entreprises.filter((c) => c.etapePipeline === e.numero).length }));
  const maxC = Math.max(...repCandidats.map((r) => r.count), 1);
  const maxE = Math.max(...repEntreprises.map((r) => r.count), 1);
  const dealTotal = deals.reduce((s, d) => s + (d.montant ?? 0), 0);
  const dealGagne = deals.filter((d) => d.statut === "gagnee").reduce((s, d) => s + (d.montant ?? 0), 0);
  const tauxConv = candidats.length ? Math.round((candidats.filter((c) => c.statut === "place" || c.statut === "diplome").length / candidats.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Reports & analytics</h1>
        <p className="text-gray-500 text-sm">Tableaux de bord avancés — suivi de la performance commerciale & pédagogique</p>
      </header>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Kpi label="CA pipeline" value={`${dealTotal.toLocaleString("fr-FR")} €`} accent="blue" />
        <Kpi label="CA gagné" value={`${dealGagne.toLocaleString("fr-FR")} €`} accent="green" />
        <Kpi label="Taux placement" value={`${tauxConv} %`} accent="purple" />
        <Kpi label="Total apprenants" value={candidats.length} accent="amber" />
      </section>

      <section className="card p-5">
        <h2 className="font-semibold mb-4">📊 Répartition candidats par étape pipeline</h2>
        <BarChart data={repCandidats} max={maxC} />
      </section>

      <section className="card p-5">
        <h2 className="font-semibold mb-4">📊 Répartition entreprises par étape pipeline</h2>
        <BarChart data={repEntreprises} max={maxE} color="emerald" />
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-5">
          <h2 className="font-semibold mb-4">💰 Deals par stage</h2>
          <table className="crm">
            <thead><tr><th>Stage</th><th>Nb</th><th>€ Total</th></tr></thead>
            <tbody>
              {dealsByStage.map((d) => (
                <tr key={d.etapeCle}>
                  <td>{d.etapeCle}</td>
                  <td>{d._count}</td>
                  <td>{(d._sum.montant ?? 0).toLocaleString("fr-FR")} €</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card p-5">
          <h2 className="font-semibold mb-4">🏢 Candidats par entité</h2>
          <ul className="space-y-2">
            {candidatsByEntite.map((c) => {
              const e = c.entiteId ? entiteById[c.entiteId] : null;
              const pct = candidats.length ? Math.round((c._count / candidats.length) * 100) : 0;
              return (
                <li key={c.entiteId ?? "none"} className="text-sm">
                  <div className="flex justify-between mb-1">
                    <span>{e?.code ?? "—"}</span>
                    <span className="text-gray-500">{c._count} ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded">
                    <div className="h-2 bg-brand-500 rounded" style={{ width: `${pct}%` }} />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </div>
  );
}

function Kpi({ label, value, accent }: { label: string; value: string | number; accent?: string }) {
  const cls = accent === "green" ? "text-emerald-600" : accent === "purple" ? "text-purple-600" : accent === "amber" ? "text-amber-600" : "text-brand-600";
  return (
    <div className="card p-5">
      <div className="text-xs uppercase tracking-wide text-gray-500">{label}</div>
      <div className={`mt-1 text-2xl font-bold ${cls}`}>{value}</div>
    </div>
  );
}

function BarChart({ data, max, color = "brand" }: { data: { libelle: string; count: number }[]; max: number; color?: "brand" | "emerald" }) {
  const bg = color === "emerald" ? "bg-emerald-500" : "bg-brand-500";
  return (
    <ul className="space-y-1.5">
      {data.map((d) => (
        <li key={d.libelle} className="grid grid-cols-[14rem_1fr_3rem] items-center gap-2 text-sm">
          <span className="text-gray-700 truncate">{d.libelle}</span>
          <div className="h-5 bg-gray-100 rounded">
            <div className={`h-5 ${bg} rounded transition-all`} style={{ width: max ? `${(d.count / max) * 100}%` : "0%" }} />
          </div>
          <span className="text-right text-gray-500">{d.count}</span>
        </li>
      ))}
    </ul>
  );
}
