import { prisma } from "@/lib/db";
import { PIPELINE_CANDIDAT, PIPELINE_ENTREPRISE } from "@/lib/pipelines";

export const dynamic = "force-dynamic";

export default async function PipelinesSettingsPage() {
  const dealPipelines = await prisma.dealPipeline.findMany();
  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Pipelines & étapes</h1>
          <p className="text-hubspot-text-muted text-sm">Configurez les étapes de vos pipelines</p>
        </div>
        <button className="btn-primary">+ Nouveau pipeline de deal</button>
      </header>

      <section className="card p-6">
        <h2 className="font-semibold mb-1">🎓 Pipeline Candidat</h2>
        <p className="text-sm text-hubspot-text-muted mb-4">19 étapes — CDC section 6.1</p>
        <ol className="space-y-1">
          {PIPELINE_CANDIDAT.map((e) => (
            <li key={e.cle} className="flex items-center gap-3 py-2 px-3 hover:bg-hubspot-bg-alt rounded">
              <span className="w-7 h-7 rounded-full bg-hubspot-bg-alt flex items-center justify-center text-xs font-semibold">{e.numero}</span>
              <div className="flex-1">
                <div className="text-sm font-medium">{e.libelle}</div>
                <div className="text-xs text-hubspot-text-muted">{e.description}</div>
              </div>
              <span className={`badge ${e.mode === "auto" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{e.mode}</span>
              <button className="text-xs text-hubspot-orange hover:underline">Modifier</button>
            </li>
          ))}
        </ol>
      </section>

      <section className="card p-6">
        <h2 className="font-semibold mb-1">🏢 Pipeline Entreprise</h2>
        <p className="text-sm text-hubspot-text-muted mb-4">17 étapes — CDC section 7.1</p>
        <ol className="space-y-1">
          {PIPELINE_ENTREPRISE.map((e) => (
            <li key={e.cle} className="flex items-center gap-3 py-2 px-3 hover:bg-hubspot-bg-alt rounded">
              <span className="w-7 h-7 rounded-full bg-hubspot-bg-alt flex items-center justify-center text-xs font-semibold">{e.numero}</span>
              <div className="flex-1">
                <div className="text-sm font-medium">{e.libelle}</div>
                <div className="text-xs text-hubspot-text-muted">{e.description}</div>
              </div>
              <span className={`badge ${e.mode === "auto" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{e.mode}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="card p-6">
        <h2 className="font-semibold mb-3">💰 Pipelines de Deals</h2>
        {dealPipelines.map((p) => {
          const stages = JSON.parse(p.stages) as { cle: string; libelle: string; probabilite: number }[];
          return (
            <div key={p.id} className="border border-hubspot-border rounded p-4 mb-3">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="font-semibold">{p.nom}</div>
                  {p.isDefault && <span className="badge bg-emerald-50 text-emerald-700 mt-1">par défaut</span>}
                </div>
                <button className="text-xs text-hubspot-orange hover:underline">Éditer les étapes</button>
              </div>
              <div className="flex gap-2 flex-wrap">
                {stages.map((s, i) => (
                  <div key={s.cle} className="flex items-center gap-1">
                    {i > 0 && <span className="text-hubspot-text-muted">→</span>}
                    <span className="badge bg-hubspot-bg-alt">{s.libelle} ({s.probabilite}%)</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
