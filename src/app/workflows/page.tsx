import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function WorkflowsPage() {
  const workflows = await prisma.workflow.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Workflows / Automations</h1>
        <p className="text-gray-500 text-sm">Règles "si X alors Y" qui automatisent vos processus métier</p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {workflows.map((w) => {
          const conditions = JSON.parse(w.conditions) as any[];
          const actions = JSON.parse(w.actions) as any[];
          return (
            <div key={w.id} className="card p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-semibold">{w.nom}</h2>
                  <p className="text-xs text-gray-500 mt-1">{w.description ?? "—"}</p>
                </div>
                <span className={`badge ${w.active ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>{w.active ? "actif" : "désactivé"}</span>
              </div>
              <div className="mt-4 text-sm space-y-2">
                <div><span className="text-gray-500">⚡ Déclencheur :</span> <code className="text-xs bg-gray-100 px-2 py-0.5 rounded">{w.declencheur}</code></div>
                {conditions.length > 0 && (
                  <div><span className="text-gray-500">🔍 Conditions :</span>
                    {conditions.map((c, i) => <span key={i} className="ml-1 text-xs bg-amber-50 text-amber-800 rounded px-1.5 py-0.5">{c.champ} {c.operateur} {String(c.valeur)}</span>)}
                  </div>
                )}
                <div><span className="text-gray-500">✅ Actions ({actions.length}) :</span>
                  <ul className="mt-1 space-y-1">
                    {actions.map((a, i) => <li key={i} className="text-xs bg-brand-50 text-brand-700 rounded px-2 py-1">→ {a.type} {a.params && Object.entries(a.params).map(([k, v]) => `${k}=${String(v)}`).join(", ")}</li>)}
                  </ul>
                </div>
              </div>
              <div className="mt-3 text-xs text-gray-400 border-t pt-2">
                ▶ {w.nbExecutions} exécutions
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
