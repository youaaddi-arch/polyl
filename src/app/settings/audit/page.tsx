import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AuditPage() {
  const logs = await prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Journal d'audit</h1>
          <p className="text-hubspot-text-muted text-sm">Toutes les actions sur les données — obligation RGPD section 17.2 du CDC</p>
        </div>
        <button className="btn-secondary">⬇️ Exporter le journal</button>
      </header>

      <div className="flex gap-2">
        <input placeholder="Rechercher par utilisateur ou objet…" className="flex-1 rounded border border-hubspot-border px-3 py-2 text-sm" />
        <select className="rounded border border-hubspot-border px-3 py-2 text-sm bg-white">
          <option>Toutes les actions</option><option>connexion</option><option>modification</option><option>suppression</option><option>export</option>
        </select>
        <select className="rounded border border-hubspot-border px-3 py-2 text-sm bg-white">
          <option>7 derniers jours</option><option>30 derniers jours</option><option>3 mois</option><option>1 an</option>
        </select>
      </div>

      <div className="card overflow-hidden">
        <table className="crm">
          <thead><tr><th>Date</th><th>Acteur</th><th>Action</th><th>Objet</th><th>Détail</th><th>IP</th></tr></thead>
          <tbody>
            {logs.map((l) => (
              <tr key={l.id}>
                <td className="text-xs text-hubspot-text-muted">{new Intl.DateTimeFormat("fr-FR", { dateStyle: "short", timeStyle: "short" }).format(l.createdAt)}</td>
                <td className="text-sm">{l.acteur}</td>
                <td><span className="badge bg-hubspot-bg-alt">{l.action}</span></td>
                <td>{l.objet}</td>
                <td className="text-sm text-hubspot-text-muted">{l.detail ?? "—"}</td>
                <td className="text-xs font-mono">{l.ip ?? "—"}</td>
              </tr>
            ))}
            {logs.length === 0 && <tr><td colSpan={6} className="text-center text-hubspot-text-muted py-8">Aucune action enregistrée</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
