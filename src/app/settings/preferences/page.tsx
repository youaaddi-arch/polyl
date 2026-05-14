export const dynamic = "force-dynamic";

export default function PreferencesPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Mes préférences</h1>
        <p className="text-hubspot-text-muted text-sm">Langue, fuseau, apparence</p>
      </header>

      <section className="card p-6 space-y-4">
        <Setting label="Langue de l'interface" value="Français (France)" choices={["Français", "English", "Español", "Deutsch"]} />
        <Setting label="Fuseau horaire" value="Europe/Paris (UTC+1)" choices={["Europe/Paris", "Europe/London", "America/New_York"]} />
        <Setting label="Format de date" value="JJ/MM/AAAA" choices={["JJ/MM/AAAA", "MM/JJ/AAAA", "AAAA-MM-JJ"]} />
        <Setting label="Premier jour de la semaine" value="Lundi" choices={["Lundi", "Dimanche"]} />
      </section>

      <section className="card p-6 space-y-4">
        <h2 className="font-semibold">Apparence</h2>
        <div className="flex gap-3">
          <ThemeOption label="Clair" active />
          <ThemeOption label="Sombre" />
          <ThemeOption label="Auto" />
        </div>
        <Setting label="Couleur d'accent" value="Orange HubSpot" choices={["Orange", "Bleu", "Vert", "Violet"]} />
        <Setting label="Densité de l'interface" value="Confortable" choices={["Compacte", "Confortable", "Spacieuse"]} />
      </section>

      <section className="card p-6 space-y-3">
        <h2 className="font-semibold">Page d'accueil</h2>
        <Setting label="Au login, ouvrir" value="Tableau de bord" choices={["Tableau de bord", "Pipeline Candidats", "Pipeline Entreprises", "Tâches"]} />
      </section>
    </div>
  );
}

function Setting({ label, value, choices }: { label: string; value: string; choices: string[] }) {
  return (
    <div className="grid grid-cols-[14rem_1fr] items-center">
      <span className="text-sm text-hubspot-text-muted">{label}</span>
      <select defaultValue={value} className="rounded border border-hubspot-border px-3 py-1.5 text-sm bg-white max-w-xs">
        {choices.map((c) => <option key={c}>{c}</option>)}
      </select>
    </div>
  );
}

function ThemeOption({ label, active }: { label: string; active?: boolean }) {
  return (
    <button className={`px-4 py-3 rounded border-2 text-sm font-medium ${active ? "border-hubspot-orange bg-orange-50 text-hubspot-orange" : "border-hubspot-border bg-white"}`}>
      {label}
    </button>
  );
}
