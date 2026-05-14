import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function SnippetsPage() {
  const snippets = await prisma.snippet.findMany({ orderBy: { raccourci: "asc" } });
  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Snippets / Raccourcis texte</h1>
          <p className="text-hubspot-text-muted text-sm">Tapez le raccourci dans un email pour insérer le texte complet</p>
        </div>
        <button className="btn-primary">+ Nouveau snippet</button>
      </header>

      <div className="card overflow-hidden">
        <table className="crm">
          <thead><tr><th>Raccourci</th><th>Titre</th><th>Aperçu</th><th>Auteur</th><th /></tr></thead>
          <tbody>
            {snippets.map((s) => (
              <tr key={s.id}>
                <td><code className="text-xs bg-hubspot-bg-alt px-2 py-1 rounded font-semibold text-hubspot-orange">{s.raccourci}</code></td>
                <td className="font-medium">{s.titre}</td>
                <td className="text-hubspot-text-muted text-sm max-w-md truncate">{s.contenu}</td>
                <td className="text-xs">{s.auteur ?? "—"}</td>
                <td className="text-right"><button className="text-xs text-hubspot-orange hover:underline">Modifier</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-xs text-hubspot-text-muted">
        💡 Astuce : commencez votre raccourci par <code>;</code> (point-virgule) pour qu'il soit déclenché automatiquement dans les emails.
      </div>
    </div>
  );
}
