export const dynamic = "force-dynamic";

const ROLES = [
  { code: "admin", nom: "Administrateur", desc: "Accès total — gestion utilisateurs, paramètres, RGPD", couleur: "purple" },
  { code: "manager", nom: "Manager", desc: "Voit tout son équipe + reports, ne configure pas le CRM", couleur: "blue" },
  { code: "commercial", nom: "Commercial", desc: "Gère ses candidats/entreprises/deals, crée tâches & emails", couleur: "orange" },
  { code: "pedagogique", nom: "Pédagogique", desc: "Suivi apprenants en formation, gestion documents", couleur: "teal" },
  { code: "lecture", nom: "Lecture seule", desc: "Visualise sans modifier (consultation externe / audit)", couleur: "gray" },
];

const PERMISSIONS = [
  { groupe: "Candidats", actions: ["Voir tous", "Voir les miens", "Créer", "Modifier", "Supprimer", "Importer"] },
  { groupe: "Entreprises", actions: ["Voir tous", "Voir les miens", "Créer", "Modifier", "Supprimer", "Importer"] },
  { groupe: "Deals", actions: ["Voir tous", "Voir les miens", "Créer", "Modifier", "Supprimer", "Modifier étapes"] },
  { groupe: "Tickets", actions: ["Voir tous", "Créer", "Modifier", "Réassigner", "Supprimer"] },
  { groupe: "Reports", actions: ["Voir ses reports", "Voir tous les reports", "Créer", "Exporter"] },
  { groupe: "Paramètres", actions: ["Gérer utilisateurs", "Gérer propriétés", "Gérer pipelines", "Gérer intégrations", "Voir audit log"] },
];

export default function PermissionsPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Permissions & rôles</h1>
        <p className="text-hubspot-text-muted text-sm">Configurez ce que chaque rôle peut faire</p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {ROLES.map((r) => (
          <div key={r.code} className="card p-4">
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full bg-${r.couleur}-500`} />
              <span className="font-semibold">{r.nom}</span>
            </div>
            <p className="text-xs text-hubspot-text-muted mt-2">{r.desc}</p>
            <button className="text-xs text-hubspot-orange hover:underline mt-3">Configurer →</button>
          </div>
        ))}
      </section>

      <section className="card overflow-x-auto">
        <table className="crm">
          <thead>
            <tr>
              <th>Permission</th>
              {ROLES.map((r) => <th key={r.code} className="text-center">{r.nom}</th>)}
            </tr>
          </thead>
          <tbody>
            {PERMISSIONS.map((g) => (
              <>
                <tr key={g.groupe}>
                  <td colSpan={6} className="font-semibold bg-hubspot-bg-alt text-xs uppercase tracking-wide">{g.groupe}</td>
                </tr>
                {g.actions.map((a) => (
                  <tr key={`${g.groupe}-${a}`}>
                    <td className="pl-6">{a}</td>
                    {ROLES.map((r) => {
                      const checked = r.code === "admin" || (r.code === "manager" && !a.includes("Gérer")) || (r.code === "commercial" && !a.includes("Gérer") && !a.includes("tous"));
                      return <td key={r.code} className="text-center"><input type="checkbox" defaultChecked={checked} disabled={r.code === "admin"} className="w-4 h-4 accent-hubspot-orange" /></td>;
                    })}
                  </tr>
                ))}
              </>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
