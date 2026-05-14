import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ProprietesPage() {
  const props = await prisma.propPersonnalisee.findMany({ orderBy: [{ objet: "asc" }, { ordre: "asc" }] });
  const parObjet = props.reduce((acc, p) => {
    (acc[p.objet] = acc[p.objet] ?? []).push(p);
    return acc;
  }, {} as Record<string, typeof props>);
  const OBJETS = ["candidat", "entreprise", "deal", "ticket"];
  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Propriétés personnalisées</h1>
          <p className="text-hubspot-text-muted text-sm">Ajoutez vos propres champs à chaque objet du CRM</p>
        </div>
        <button className="btn-primary">+ Nouvelle propriété</button>
      </header>

      <div className="flex gap-2 border-b border-hubspot-border">
        {OBJETS.map((o) => (
          <button key={o} className="px-4 py-2 text-sm font-medium border-b-2 border-transparent hover:border-hubspot-orange capitalize">
            {o}s <span className="ml-1 text-xs text-hubspot-text-muted">({parObjet[o]?.length ?? 0})</span>
          </button>
        ))}
      </div>

      {OBJETS.map((objet) => (
        <section key={objet} className="card overflow-hidden">
          <div className="bg-hubspot-bg-alt px-4 py-2 text-xs font-semibold uppercase tracking-wider">Propriétés {objet}</div>
          <table className="crm">
            <thead><tr><th>Libellé</th><th>Clé interne</th><th>Type</th><th>Options</th><th>Ordre</th><th /></tr></thead>
            <tbody>
              {(parObjet[objet] ?? []).map((p) => (
                <tr key={p.id}>
                  <td className="font-medium">{p.libelle}</td>
                  <td><code className="text-xs">{p.cle}</code></td>
                  <td><span className="badge bg-hubspot-bg-alt">{p.type}</span></td>
                  <td className="text-xs text-hubspot-text-muted">{p.options ?? "—"}</td>
                  <td>{p.ordre}</td>
                  <td className="text-right"><button className="text-xs text-hubspot-orange hover:underline">Modifier</button></td>
                </tr>
              ))}
              {(!parObjet[objet] || parObjet[objet].length === 0) && (
                <tr><td colSpan={6} className="text-center text-hubspot-text-muted py-6">Aucune propriété personnalisée pour les {objet}s</td></tr>
              )}
            </tbody>
          </table>
        </section>
      ))}
    </div>
  );
}
