export const dynamic = "force-dynamic";

export default function SauvegardesPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Sauvegardes</h1>
        <p className="text-hubspot-text-muted text-sm">Sauvegardes automatiques quotidiennes — rétention 30 jours (CDC section 17.1)</p>
      </header>

      <section className="card p-6">
        <div className="grid grid-cols-3 gap-4">
          <Stat label="Dernière sauvegarde" value="il y a 4h" />
          <Stat label="Prochaine sauvegarde" value="dans 20h" />
          <Stat label="Taille DB" value="42 Mo" />
        </div>
      </section>

      <section className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Sauvegardes disponibles</h2>
          <button className="btn-primary">💾 Sauvegarde manuelle</button>
        </div>
        <table className="w-full text-sm">
          <thead className="text-xs text-hubspot-text-muted uppercase">
            <tr><th className="text-left pb-2">Date</th><th className="text-left pb-2">Type</th><th className="text-left pb-2">Taille</th><th /></tr>
          </thead>
          <tbody>
            {[
              { date: "Aujourd'hui 04:00", type: "Automatique", size: "42 Mo" },
              { date: "Hier 04:00", type: "Automatique", size: "41 Mo" },
              { date: "Il y a 2j 04:00", type: "Automatique", size: "41 Mo" },
              { date: "Il y a 3j 14:32", type: "Manuelle", size: "40 Mo" },
              { date: "Il y a 4j 04:00", type: "Automatique", size: "40 Mo" },
            ].map((b) => (
              <tr key={b.date} className="border-t border-hubspot-border">
                <td className="py-2.5">{b.date}</td>
                <td><span className={`badge ${b.type === "Automatique" ? "bg-blue-50 text-blue-700" : "bg-purple-50 text-purple-700"}`}>{b.type}</span></td>
                <td>{b.size}</td>
                <td className="text-right space-x-2">
                  <button className="text-xs text-hubspot-orange hover:underline">⬇️ Télécharger</button>
                  <button className="text-xs text-hubspot-orange hover:underline">↩️ Restaurer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="card p-6 space-y-3">
        <h2 className="font-semibold">Configuration</h2>
        <div className="grid grid-cols-[14rem_1fr] items-center text-sm gap-y-2">
          <span className="text-hubspot-text-muted">Fréquence</span>
          <select defaultValue="quotidien" className="rounded border border-hubspot-border px-3 py-1.5 max-w-xs">
            <option>Quotidien</option><option>Toutes les 6h</option><option>Hebdomadaire</option>
          </select>
          <span className="text-hubspot-text-muted">Rétention</span>
          <select defaultValue="30j" className="rounded border border-hubspot-border px-3 py-1.5 max-w-xs">
            <option>7 jours</option><option>30 jours</option><option>90 jours</option><option>1 an</option>
          </select>
          <span className="text-hubspot-text-muted">Stockage</span>
          <span>🇪🇺 S3 EU-West (Paris)</span>
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-hubspot-text-muted uppercase tracking-wide">{label}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
    </div>
  );
}
