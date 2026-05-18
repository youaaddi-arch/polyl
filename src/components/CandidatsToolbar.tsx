"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";

const FILTRES_DISPOS = [
  {
    key: "statut",
    label: "Statut parcours",
    options: [
      { value: "nouveau",  label: "Nouveau" },
      { value: "en_cours", label: "En cours" },
      { value: "place",    label: "Placé" },
      { value: "diplome",  label: "Diplômé" },
      { value: "abandon",  label: "Abandon" },
    ],
  },
  {
    key: "statutLead",
    label: "Statut lead",
    options: [
      { value: "froid",  label: "Froid" },
      { value: "tiede",  label: "Tiède" },
      { value: "chaud",  label: "Chaud" },
      { value: "mql",    label: "MQL" },
      { value: "sql",    label: "SQL" },
      { value: "client", label: "Client" },
      { value: "perdu",  label: "Perdu" },
    ],
  },
  {
    key: "situation",
    label: "Situation",
    options: [
      { value: "Demandeur·euse d'emploi", label: "Demandeur d'emploi" },
      { value: "Salarié·e en poste",      label: "Salarié en poste" },
      { value: "Salarié·e en CDD",        label: "Salarié en CDD" },
      { value: "Étudiant·e",              label: "Étudiant" },
      { value: "Lycéen·ne",               label: "Lycéen" },
      { value: "En reconversion",         label: "En reconversion" },
      { value: "Indépendant·e",           label: "Indépendant" },
    ],
  },
  {
    key: "financementChoisi",
    label: "Financement",
    options: [
      { value: "CPF",            label: "CPF" },
      { value: "OPCO",           label: "OPCO" },
      { value: "France Travail", label: "France Travail" },
      { value: "Employeur",      label: "Employeur" },
      { value: "Personnel",      label: "Personnel" },
    ],
  },
  {
    key: "entiteCode",
    label: "Entité",
    options: ["PNFF", "DBS", "PNBS", "ORCEA", "PNFB", "PBA"].map((c) => ({ value: c, label: c })),
  },
  {
    key: "typeContratSouhaite",
    label: "Type contrat",
    options: [
      { value: "apprentissage",       label: "Apprentissage" },
      { value: "professionnalisation", label: "Professionnalisation" },
      { value: "CDI",                  label: "CDI" },
      { value: "CDD",                  label: "CDD" },
      { value: "formation_continue",   label: "Formation continue" },
    ],
  },
  {
    key: "persona",
    label: "Persona",
    options: [
      { value: "C1", label: "C1 — Primo-entrant" },
      { value: "C2", label: "C2 — Montée en compétences" },
      { value: "C3", label: "C3 — Bac+2 à Bac+5" },
    ],
  },
  {
    key: "mobiliteGeo",
    label: "Mobilité",
    options: [
      { value: "Locale (< 30 km)", label: "Locale" },
      { value: "Régionale",         label: "Régionale" },
      { value: "Nationale",         label: "Nationale" },
    ],
  },
  {
    key: "prescripteur",
    label: "Prescripteur",
    options: ["France Travail", "Mission Locale", "Cap Emploi", "Bouche-à-oreille", "Recommandation", "Site web", "Salon", "Réseaux sociaux"].map((p) => ({ value: p, label: p })),
  },
  {
    key: "permisB",
    label: "Permis B",
    options: [{ value: "true", label: "Oui" }, { value: "false", label: "Non" }],
  },
  {
    key: "rqth",
    label: "RQTH",
    options: [{ value: "true", label: "Oui" }, { value: "false", label: "Non" }],
  },
];

export default function CandidatsToolbar({ savedViews, totalFiltered }: { savedViews: { id: string; nom: string }[]; totalFiltered: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const [showAddFilter, setShowAddFilter] = useState(false);
  const [showSaveView, setShowSaveView] = useState(false);
  const [showColumns, setShowColumns] = useState(false);
  const [viewName, setViewName] = useState("");

  const activeKeys = FILTRES_DISPOS.filter((f) => sp.get(f.key)).map((f) => f.key);
  const dispoKeys = FILTRES_DISPOS.filter((f) => !activeKeys.includes(f.key));

  function setFilter(key: string, value: string) {
    const params = new URLSearchParams(sp.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`${pathname}?${params.toString()}`);
  }

  function removeFilter(key: string) {
    const params = new URLSearchParams(sp.toString());
    params.delete(key);
    router.push(`${pathname}?${params.toString()}`);
  }

  function clearAll() {
    router.push(pathname);
  }

  async function enregistrerVue() {
    if (!viewName.trim()) return;
    const filters: Record<string, string> = {};
    sp.forEach((v, k) => { filters[k] = v; });
    const res = await fetch("/api/listes/enregistrer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nom: viewName, objet: "candidat", filtres: filters }),
    });
    if (res.ok) {
      setShowSaveView(false);
      setViewName("");
      alert("✅ Vue enregistrée comme liste !");
      router.refresh();
    }
  }

  function createCampaign() {
    const params = new URLSearchParams(sp.toString());
    params.set("source", "candidats_filtre");
    router.push(`/campaigns/nouveau?${params.toString()}`);
  }

  const exportUrl = `/api/export/candidats?${sp.toString()}`;

  return (
    <div className="space-y-3">
      {/* TOOLBAR principale */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Vue sélectionnée */}
        {savedViews.length > 0 && (
          <select
            className="border border-hubspot-border rounded px-2 py-1.5 text-sm bg-white"
            onChange={(e) => {
              if (e.target.value) router.push(`/candidats?${e.target.value}`);
              else router.push("/candidats");
            }}
          >
            <option value="">📋 Toutes les vues</option>
            {savedViews.map((v) => <option key={v.id} value={`vue=${v.id}`}>👁 {v.nom}</option>)}
          </select>
        )}

        <input
          type="search"
          placeholder="🔎 Rechercher (nom, email, ville)..."
          defaultValue={sp.get("q") ?? ""}
          onKeyDown={(e) => {
            if (e.key === "Enter") setFilter("q", (e.target as HTMLInputElement).value);
          }}
          className="flex-1 min-w-[200px] border border-hubspot-border rounded px-3 py-1.5 text-sm"
        />

        <div className="relative">
          <button onClick={() => setShowAddFilter(!showAddFilter)} className="btn-secondary text-sm">
            + Ajouter un filtre
          </button>
          {showAddFilter && (
            <div className="absolute top-full right-0 mt-1 bg-white border border-hubspot-border rounded shadow-hs-dropdown w-64 max-h-96 overflow-y-auto z-20 py-1">
              {dispoKeys.length === 0 && <div className="px-3 py-2 text-xs text-hubspot-text-muted">Tous les filtres sont actifs</div>}
              {dispoKeys.map((f) => (
                <button
                  key={f.key}
                  onClick={() => {
                    setShowAddFilter(false);
                    setFilter(f.key, f.options[0].value);
                  }}
                  className="block w-full text-left px-3 py-1.5 text-sm hover:bg-hubspot-bg-alt"
                >
                  {f.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <button onClick={() => setShowColumns(!showColumns)} className="btn-secondary text-sm">⚙️ Colonnes</button>

        <button onClick={() => setShowSaveView(true)} className="btn-secondary text-sm">💾 Enregistrer la vue</button>

        <button onClick={createCampaign} className="btn-primary text-sm">
          ✉️ Email marketing ({totalFiltered})
        </button>

        <a href={exportUrl} className="btn-secondary text-sm">⬇️ Export CSV</a>
      </div>

      {/* Picker de colonnes */}
      {showColumns && <ColumnPicker onClose={() => setShowColumns(false)} />}

      {/* CHIPS de filtres actifs */}
      {activeKeys.length > 0 && (
        <div className="flex gap-2 flex-wrap items-center">
          <span className="text-xs text-hubspot-text-muted">{activeKeys.length} filtre(s) actif(s) :</span>
          {activeKeys.map((k) => {
            const f = FILTRES_DISPOS.find((x) => x.key === k)!;
            const val = sp.get(k)!;
            const lib = f.options.find((o) => o.value === val)?.label ?? val;
            return (
              <span key={k} className="inline-flex items-center gap-1 bg-orange-50 text-hubspot-orange rounded px-2 py-1 text-xs font-medium">
                <strong>{f.label}</strong> = {lib}
                <button onClick={() => removeFilter(k)} className="ml-1 hover:text-rose-600">×</button>
              </span>
            );
          })}
          <button onClick={clearAll} className="text-xs text-hubspot-text-muted hover:text-rose-600 underline">Tout effacer</button>
        </div>
      )}

      {/* Modal "Enregistrer la vue" */}
      {showSaveView && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={() => setShowSaveView(false)}>
          <div className="bg-white rounded-lg p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-semibold text-lg mb-1">💾 Enregistrer cette vue</h2>
            <p className="text-sm text-hubspot-text-muted mb-4">
              Cette vue (filtres actifs) sera sauvegardée comme liste réutilisable pour vos campagnes email.
            </p>
            <label className="block">
              <span className="text-sm font-medium">Nom de la liste *</span>
              <input
                value={viewName}
                onChange={(e) => setViewName(e.target.value)}
                placeholder="ex : Demandeurs d'emploi CPF en cours"
                autoFocus
                className="w-full border border-hubspot-border rounded px-3 py-2 text-sm mt-1"
              />
            </label>
            <div className="text-xs text-hubspot-text-muted mt-2">
              {activeKeys.length} filtre(s) actif(s) seront sauvegardés
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setShowSaveView(false)} className="btn-secondary">Annuler</button>
              <button onClick={enregistrerVue} className="btn-primary">Enregistrer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// COLUMN PICKER — bascule les colonnes visibles via URL ?cols=...
// ============================================================
const COLONNES_DISPOS = [
  { key: "nom",                label: "Nom & email",         defaut: true },
  { key: "telephone",          label: "📞 Téléphone",         defaut: true },
  { key: "adresse",            label: "📍 Ville / CP",        defaut: true },
  { key: "dateCandidature",    label: "📅 Date candidature",  defaut: true },
  { key: "derniereActivite",   label: "⏱️ Dernière activité",  defaut: true },
  { key: "statutLead",         label: "🎯 Statut lead",       defaut: true },
  { key: "financementChoisi",  label: "💰 Financement",        defaut: true },
  { key: "societeMatchee",     label: "🏢 Société matchée",    defaut: true },
  { key: "formation",          label: "📚 Formation",         defaut: true },
  { key: "entite",             label: "Entité",               defaut: true },
  { key: "deals",              label: "💼 Nb opportunités",   defaut: true },
  { key: "etape",              label: "Étape pipeline",       defaut: true },
  { key: "situation",          label: "Situation",            defaut: false },
  { key: "persona",            label: "Persona",              defaut: false },
  { key: "typeContrat",        label: "Type contrat",         defaut: false },
  { key: "permisB",            label: "Permis B",             defaut: false },
  { key: "niveauAnglais",      label: "Niveau anglais",       defaut: false },
  { key: "mobiliteGeo",        label: "Mobilité",             defaut: false },
  { key: "prescripteur",       label: "Prescripteur",         defaut: false },
  { key: "conseillerDedie",    label: "Conseiller",           defaut: false },
  { key: "scoreLead",          label: "Score lead",           defaut: false },
];

function ColumnPicker({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const currentCols = sp.get("cols")?.split(",") ?? COLONNES_DISPOS.filter((c) => c.defaut).map((c) => c.key);

  function toggle(key: string) {
    const next = currentCols.includes(key) ? currentCols.filter((c) => c !== key) : [...currentCols, key];
    const params = new URLSearchParams(sp.toString());
    params.set("cols", next.join(","));
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="card p-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-sm">⚙️ Choisir les colonnes ({currentCols.length} visibles)</h3>
        <button onClick={onClose} className="text-xs text-hubspot-text-muted">Fermer ×</button>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {COLONNES_DISPOS.map((c) => (
          <label key={c.key} className="flex items-center gap-2 text-sm py-1 hover:bg-hubspot-bg-alt rounded px-2 cursor-pointer">
            <input
              type="checkbox"
              checked={currentCols.includes(c.key)}
              onChange={() => toggle(c.key)}
              className="w-4 h-4 accent-hubspot-orange"
            />
            <span>{c.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
