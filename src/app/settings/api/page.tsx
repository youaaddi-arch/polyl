export const dynamic = "force-dynamic";

export default function ApiKeysPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Clés API & Webhooks</h1>
        <p className="text-hubspot-text-muted text-sm">Accès programmatique au CRM</p>
      </header>

      <section className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Clés API</h2>
          <button className="btn-primary">+ Générer une nouvelle clé</button>
        </div>
        <table className="w-full text-sm">
          <thead className="text-xs text-hubspot-text-muted uppercase">
            <tr><th className="text-left pb-2">Nom</th><th className="text-left pb-2">Clé</th><th className="text-left pb-2">Créée</th><th className="text-left pb-2">Dernière utilisation</th><th /></tr>
          </thead>
          <tbody>
            <tr className="border-t border-hubspot-border">
              <td className="py-3">Intégration n8n principale</td>
              <td><code className="text-xs">sk_live_••••••••••••XQ4P</code></td>
              <td className="text-hubspot-text-muted">il y a 12j</td>
              <td className="text-hubspot-text-muted">il y a 1h</td>
              <td className="text-right"><button className="text-xs text-rose-600 hover:underline">Révoquer</button></td>
            </tr>
            <tr className="border-t border-hubspot-border">
              <td className="py-3">Site web — formulaires</td>
              <td><code className="text-xs">pk_live_••••••••••••2YH9</code></td>
              <td className="text-hubspot-text-muted">il y a 30j</td>
              <td className="text-hubspot-text-muted">il y a 5min</td>
              <td className="text-right"><button className="text-xs text-rose-600 hover:underline">Révoquer</button></td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Webhooks sortants</h2>
          <button className="btn-primary">+ Nouveau webhook</button>
        </div>
        <table className="w-full text-sm">
          <thead className="text-xs text-hubspot-text-muted uppercase">
            <tr><th className="text-left pb-2">URL</th><th className="text-left pb-2">Événements</th><th className="text-left pb-2">Statut</th><th /></tr>
          </thead>
          <tbody>
            <tr className="border-t border-hubspot-border">
              <td className="py-3"><code className="text-xs">https://hooks.zapier.com/...</code></td>
              <td>candidat.cree, deal.gagne</td>
              <td><span className="badge bg-emerald-50 text-emerald-700">actif</span></td>
              <td className="text-right"><button className="text-xs text-hubspot-orange hover:underline">Tester</button></td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="card p-6">
        <h2 className="font-semibold mb-3">Documentation API</h2>
        <p className="text-sm text-hubspot-text-muted">Endpoints REST disponibles :</p>
        <ul className="mt-3 space-y-1 text-sm font-mono">
          <li><code>GET    /api/candidats</code></li>
          <li><code>POST   /api/candidats</code></li>
          <li><code>GET    /api/entreprises</code></li>
          <li><code>GET    /api/deals</code></li>
          <li><code>GET    /api/export/[objet]</code></li>
        </ul>
      </section>
    </div>
  );
}
