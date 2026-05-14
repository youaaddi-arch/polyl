export const dynamic = "force-dynamic";

export default function NotificationsPage() {
  const NOTIFS = [
    { groupe: "Candidats", items: [
      { lib: "Nouveau candidat reçu", email: true, app: true, mobile: false },
      { lib: "Candidat change d'étape", email: false, app: true, mobile: false },
      { lib: "Candidat placé en entreprise", email: true, app: true, mobile: true },
      { lib: "Document manquant 7 jours", email: true, app: true, mobile: false },
    ]},
    { groupe: "Entreprises & Deals", items: [
      { lib: "Nouvelle offre détectée", email: true, app: true, mobile: false },
      { lib: "Deal créé / mis à jour", email: false, app: true, mobile: false },
      { lib: "Deal gagné", email: true, app: true, mobile: true },
      { lib: "Deal en risque (sans activité 14j)", email: true, app: true, mobile: false },
    ]},
    { groupe: "Tâches & RDV", items: [
      { lib: "Tâche assignée à moi", email: true, app: true, mobile: true },
      { lib: "Échéance dans 1 jour", email: true, app: true, mobile: true },
      { lib: "RDV dans 30 min", email: false, app: true, mobile: true },
    ]},
    { groupe: "Service & Tickets", items: [
      { lib: "Nouveau ticket assigné", email: true, app: true, mobile: false },
      { lib: "Réponse client sur ticket", email: true, app: true, mobile: true },
    ]},
    { groupe: "Reports & digests", items: [
      { lib: "Digest hebdomadaire commercial", email: true, app: false, mobile: false },
      { lib: "Rapport mensuel pédago", email: true, app: false, mobile: false },
    ]},
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Notifications</h1>
        <p className="text-hubspot-text-muted text-sm">Choisissez les canaux pour chaque type d'événement</p>
      </header>

      {NOTIFS.map((g) => (
        <section key={g.groupe} className="card p-6 space-y-3">
          <h2 className="font-semibold">{g.groupe}</h2>
          <table className="w-full text-sm">
            <thead className="text-xs text-hubspot-text-muted uppercase">
              <tr>
                <th className="text-left pb-2">Événement</th>
                <th className="text-center pb-2 w-20">📧 Email</th>
                <th className="text-center pb-2 w-20">🔔 In-app</th>
                <th className="text-center pb-2 w-20">📱 Mobile</th>
              </tr>
            </thead>
            <tbody>
              {g.items.map((n) => (
                <tr key={n.lib} className="border-t border-hubspot-border">
                  <td className="py-2.5">{n.lib}</td>
                  <td className="text-center"><input type="checkbox" defaultChecked={n.email} className="w-4 h-4 accent-hubspot-orange" /></td>
                  <td className="text-center"><input type="checkbox" defaultChecked={n.app} className="w-4 h-4 accent-hubspot-orange" /></td>
                  <td className="text-center"><input type="checkbox" defaultChecked={n.mobile} className="w-4 h-4 accent-hubspot-orange" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}

      <div className="flex justify-end">
        <button className="btn-primary">💾 Enregistrer les préférences</button>
      </div>
    </div>
  );
}
