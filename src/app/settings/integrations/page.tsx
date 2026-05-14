import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function IntegrationsPage() {
  const integrations = await prisma.integration.findMany({ orderBy: [{ active: "desc" }, { nom: "asc" }] });
  const parCategorie = integrations.reduce((acc, i) => {
    const cat = i.categorie ?? "autres";
    (acc[cat] = acc[cat] ?? []).push(i);
    return acc;
  }, {} as Record<string, typeof integrations>);

  const ICONES: Record<string, string> = {
    email: "✉️", signature: "✍️", telephonie: "📞", enrichissement: "🔍",
    prospection: "🎯", ats: "📋", social: "📱", ia: "🤖", automation: "⚙️", productivite: "💼",
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">App marketplace</h1>
        <p className="text-hubspot-text-muted text-sm">Connectez vos outils favoris au CRM</p>
      </header>

      <div className="flex gap-2 flex-wrap">
        {["Tous", "Actifs", "Email", "Téléphonie", "IA", "ATS", "Signature", "Social"].map((f) => (
          <button key={f} className={`px-3 py-1.5 rounded text-sm ${f === "Tous" ? "bg-hubspot-navy text-white" : "bg-white border border-hubspot-border hover:bg-hubspot-bg-alt"}`}>{f}</button>
        ))}
      </div>

      {Object.entries(parCategorie).map(([cat, list]) => (
        <section key={cat}>
          <h2 className="font-semibold mb-3 flex items-center gap-2">
            <span>{ICONES[cat] ?? "🔌"}</span>
            <span className="capitalize">{cat}</span>
            <span className="text-xs text-hubspot-text-muted">({list.length})</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {list.map((i) => (
              <div key={i.id} className="card p-5">
                <div className="flex items-start justify-between mb-2">
                  <span className="font-semibold">{i.nom}</span>
                  <span className={`badge ${i.active ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>{i.active ? "✓ connecté" : "non connecté"}</span>
                </div>
                <p className="text-xs text-hubspot-text-muted">{i.description}</p>
                {i.derniereSync && <p className="text-xs text-hubspot-text-muted mt-2">Dernière sync : {new Intl.DateTimeFormat("fr-FR", { dateStyle: "short", timeStyle: "short" }).format(i.derniereSync)}</p>}
                <div className="mt-3 flex gap-2">
                  <button className={i.active ? "btn-secondary text-xs" : "btn-primary text-xs"}>{i.active ? "Configurer" : "Connecter"}</button>
                  {i.active && <button className="btn-secondary text-xs">Déconnecter</button>}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
