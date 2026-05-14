export const dynamic = "force-dynamic";

const OBJETS = [
  { code: "candidat",   nom: "Candidats",      icon: "🎓", desc: "Apprenants & prospects formation", standard: true },
  { code: "entreprise", nom: "Entreprises",    icon: "🏢", desc: "Comptes & partenaires alternance", standard: true },
  { code: "contact",    nom: "Contacts",       icon: "📇", desc: "Personnes rattachées aux entreprises", standard: true },
  { code: "deal",       nom: "Deals",          icon: "💰", desc: "Opportunités commerciales", standard: true },
  { code: "ticket",     nom: "Tickets",        icon: "🎫", desc: "Support apprenants & entreprises", standard: true },
  { code: "formation",  nom: "Formations",     icon: "📚", desc: "Catalogue produits", standard: true },
  { code: "contrat",    nom: "Contrats",       icon: "📄", desc: "Contrats apprentissage / pro", standard: true },
  { code: "evenement",  nom: "Événements",     icon: "🗓️", desc: "Job Dating, JIC", standard: true },
];

export default function ObjetsPage() {
  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Objets CRM</h1>
          <p className="text-hubspot-text-muted text-sm">Standards et personnalisés — chaque objet a ses fiches, propriétés, pipelines</p>
        </div>
        <button className="btn-primary">+ Créer un objet personnalisé</button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {OBJETS.map((o) => (
          <div key={o.code} className="card p-5 flex items-start gap-4">
            <div className="text-3xl">{o.icon}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold">{o.nom}</span>
                {o.standard && <span className="badge bg-hubspot-bg-alt text-xs">standard</span>}
              </div>
              <p className="text-sm text-hubspot-text-muted mt-1">{o.desc}</p>
              <div className="flex gap-2 mt-3 text-xs">
                <button className="text-hubspot-orange hover:underline">Propriétés</button>
                <span className="text-hubspot-text-muted">·</span>
                <button className="text-hubspot-orange hover:underline">Pipeline</button>
                <span className="text-hubspot-text-muted">·</span>
                <button className="text-hubspot-orange hover:underline">Associations</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
