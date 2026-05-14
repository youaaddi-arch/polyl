export const dynamic = "force-dynamic";

export default function CalendrierSettings() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Calendrier</h1>
        <p className="text-hubspot-text-muted text-sm">Synchronisation calendrier & disponibilités</p>
      </header>

      <section className="card p-6">
        <h2 className="font-semibold mb-3">Connecter un calendrier</h2>
        <div className="grid grid-cols-2 gap-3">
          <button className="border-2 border-hubspot-border rounded p-4 text-left hover:border-hubspot-orange">
            <div className="text-2xl mb-1">📆</div>
            <div className="font-medium">Google Calendar</div>
            <div className="text-xs text-hubspot-text-muted mt-1">Synchronisation bidirectionnelle</div>
          </button>
          <button className="border-2 border-hubspot-border rounded p-4 text-left hover:border-hubspot-orange">
            <div className="text-2xl mb-1">📅</div>
            <div className="font-medium">Outlook / Microsoft 365</div>
            <div className="text-xs text-hubspot-text-muted mt-1">Synchronisation bidirectionnelle</div>
          </button>
        </div>
      </section>

      <section className="card p-6 space-y-3">
        <h2 className="font-semibold">Plage de disponibilité par défaut</h2>
        <div className="grid grid-cols-7 gap-2 text-xs">
          {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((j, i) => (
            <div key={j} className={`border rounded p-2 text-center ${i < 5 ? "bg-orange-50 border-hubspot-orange" : "bg-hubspot-bg border-hubspot-border opacity-50"}`}>
              <div className="font-semibold">{j}</div>
              {i < 5 && <div className="text-[10px] mt-1">09:00-18:00</div>}
            </div>
          ))}
        </div>
        <button className="btn-secondary text-xs">Modifier les plages</button>
      </section>

      <section className="card p-6">
        <h2 className="font-semibold mb-3">Page de réservation publique</h2>
        <p className="text-sm text-hubspot-text-muted mb-3">Partagez un lien public pour que vos prospects/candidats réservent un créneau.</p>
        <code className="block bg-hubspot-bg p-3 rounded text-xs">https://votre-domaine.fr/meet/sophie-martin</code>
        <button className="btn-secondary mt-3">Copier le lien</button>
      </section>
    </div>
  );
}
