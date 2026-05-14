import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function EquipesPage() {
  const equipes = await prisma.equipe.findMany({ orderBy: { nom: "asc" } });
  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Équipes</h1>
          <p className="text-hubspot-text-muted text-sm">Regroupez les utilisateurs par fonction ou entité</p>
        </div>
        <button className="btn-primary">+ Nouvelle équipe</button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {equipes.map((e) => (
          <div key={e.id} className="card p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded" style={{ background: e.couleur ?? "#FF7A59" }} />
                <div>
                  <div className="font-semibold">{e.nom}</div>
                  {e.entiteCode && <span className="badge bg-hubspot-bg-alt text-xs mt-1">{e.entiteCode}</span>}
                </div>
              </div>
              <button className="text-xs text-hubspot-orange hover:underline">Modifier</button>
            </div>
            <p className="text-sm text-hubspot-text-muted mt-3">{e.description}</p>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-hubspot-text-muted">Membres :</span>
              <div className="flex -space-x-2">
                {[1,2,3].map((i) => (
                  <span key={i} className="w-7 h-7 rounded-full bg-hubspot-bg-alt border-2 border-white flex items-center justify-center text-xs font-semibold">U{i}</span>
                ))}
                <span className="w-7 h-7 rounded-full bg-hubspot-bg border-2 border-white flex items-center justify-center text-xs text-hubspot-text-muted">+2</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
