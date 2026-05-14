export const dynamic = "force-dynamic";

export default function SecuritePage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Sécurité & 2FA</h1>
        <p className="text-hubspot-text-muted text-sm">Mot de passe, double authentification, sessions actives</p>
      </header>

      <section className="card p-6">
        <h2 className="font-semibold mb-3">Mot de passe</h2>
        <div className="flex items-center justify-between">
          <div className="text-sm">
            <div className="font-medium">Dernière modification</div>
            <div className="text-hubspot-text-muted">il y a 32 jours</div>
          </div>
          <button className="btn-secondary">Modifier</button>
        </div>
      </section>

      <section className="card p-6">
        <h2 className="font-semibold mb-3">Authentification à deux facteurs (2FA)</h2>
        <div className="flex items-center justify-between">
          <div className="text-sm">
            <div className="font-medium">Statut : <span className="badge bg-amber-50 text-amber-700">Non activée</span></div>
            <div className="text-hubspot-text-muted mt-1">Recommandé pour protéger les données candidats (RGPD)</div>
          </div>
          <button className="btn-primary">Activer la 2FA</button>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3">
          <Method icon="📱" label="App mobile (Google Authenticator)" />
          <Method icon="✉️" label="Email" />
          <Method icon="💬" label="SMS" />
        </div>
      </section>

      <section className="card p-6">
        <h2 className="font-semibold mb-3">Sessions actives</h2>
        <ul className="divide-y divide-hubspot-border">
          <Session device="💻 MacBook Air — Safari" loc="Paris, France" lastSeen="actuellement" current />
          <Session device="📱 iPhone — App mobile" loc="Paris, France" lastSeen="il y a 2h" />
          <Session device="💻 Chrome — Windows" loc="Lyon, France" lastSeen="il y a 5j" />
        </ul>
        <button className="btn-secondary mt-3">🚪 Déconnecter toutes les autres sessions</button>
      </section>

      <section className="card p-6">
        <h2 className="font-semibold mb-3">SSO / Connexion par fournisseur</h2>
        <div className="space-y-2">
          <Sso name="Google Workspace" enabled />
          <Sso name="Microsoft 365" />
          <Sso name="SAML / SSO entreprise" />
        </div>
      </section>
    </div>
  );
}

function Method({ icon, label }: { icon: string; label: string }) {
  return (
    <button className="border border-hubspot-border rounded p-3 text-sm text-left hover:bg-hubspot-bg-alt">
      <div className="text-2xl mb-1">{icon}</div>
      <div className="font-medium">{label}</div>
    </button>
  );
}

function Session({ device, loc, lastSeen, current }: { device: string; loc: string; lastSeen: string; current?: boolean }) {
  return (
    <li className="py-3 flex items-center justify-between text-sm">
      <div>
        <div className="font-medium">{device} {current && <span className="badge bg-emerald-50 text-emerald-700 ml-1">cette session</span>}</div>
        <div className="text-hubspot-text-muted text-xs">{loc} · {lastSeen}</div>
      </div>
      {!current && <button className="text-hubspot-orange hover:underline text-xs">Déconnecter</button>}
    </li>
  );
}

function Sso({ name, enabled }: { name: string; enabled?: boolean }) {
  return (
    <div className="flex items-center justify-between p-2 rounded border border-hubspot-border">
      <span className="text-sm font-medium">{name}</span>
      <span className={`badge ${enabled ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>{enabled ? "activé" : "désactivé"}</span>
    </div>
  );
}
