export const dynamic = "force-dynamic";

export default function TelephoniePage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Téléphonie VoIP</h1>
        <p className="text-hubspot-text-muted text-sm">Click-to-call, enregistrement, transcription IA</p>
      </header>

      <section className="card p-6">
        <h2 className="font-semibold mb-3">Provider VoIP connecté</h2>
        <div className="grid grid-cols-3 gap-3">
          {[
            { nom: "Aircall", desc: "Cloud-based, intégration native" },
            { nom: "Ringover", desc: "Solution française" },
            { nom: "Kavkom", desc: "Numéros France & international" },
          ].map((p) => (
            <div key={p.nom} className="border-2 border-hubspot-border rounded p-4">
              <div className="font-semibold">{p.nom}</div>
              <p className="text-xs text-hubspot-text-muted mt-1">{p.desc}</p>
              <button className="btn-secondary text-xs mt-3">Connecter</button>
            </div>
          ))}
        </div>
      </section>

      <section className="card p-6 space-y-3">
        <h2 className="font-semibold">Options d'appel</h2>
        <Toggle label="Click-to-call depuis les fiches" defaultChecked />
        <Toggle label="Enregistrement automatique des appels (consentement RGPD)" />
        <Toggle label="Transcription IA des appels" />
        <Toggle label="Résumé automatique post-appel" />
        <Toggle label="Création auto d'une tâche de suivi" defaultChecked />
      </section>

      <section className="card p-6">
        <h2 className="font-semibold mb-3">Numéros disponibles</h2>
        <p className="text-sm text-hubspot-text-muted">Aucun numéro configuré. Connectez d'abord un provider VoIP.</p>
      </section>
    </div>
  );
}

function Toggle({ label, defaultChecked }: { label: string; defaultChecked?: boolean }) {
  return (
    <label className="flex items-center justify-between py-2 cursor-pointer">
      <span className="text-sm">{label}</span>
      <input type="checkbox" defaultChecked={defaultChecked} className="w-10 h-5 accent-hubspot-orange" />
    </label>
  );
}
