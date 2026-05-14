export const dynamic = "force-dynamic";

export default function SocialPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Réseaux sociaux</h1>
        <p className="text-hubspot-text-muted text-sm">Comptes connectés pour publication & prospection</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { nom: "LinkedIn", desc: "Prospection auto + publication événements", icon: "💼" },
          { nom: "Instagram / Meta", desc: "Publication Job Dating, JIC, témoignages", icon: "📷" },
          { nom: "Facebook", desc: "Page entreprise + publicité", icon: "📘" },
          { nom: "TikTok", desc: "Communication candidats 16-25 ans", icon: "🎵" },
          { nom: "YouTube", desc: "Vidéos témoignages & formations", icon: "📹" },
          { nom: "WhatsApp Business", desc: "Notifications candidats & entreprises", icon: "💬" },
        ].map((s) => (
          <div key={s.nom} className="card p-5">
            <div className="flex items-start gap-3">
              <div className="text-3xl">{s.icon}</div>
              <div className="flex-1">
                <div className="font-semibold">{s.nom}</div>
                <p className="text-xs text-hubspot-text-muted mt-1">{s.desc}</p>
                <div className="mt-3 flex gap-2"><button className="btn-primary text-xs">Connecter</button></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
