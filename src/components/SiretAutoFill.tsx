"use client";

import { useState } from "react";

type Dirigeant = { nom: string; prenom: string; qualite: string };

export default function SiretAutoFill() {
  const [siret, setSiret] = useState("");
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState<string | null>(null);
  const [dirigeants, setDirigeants] = useState<Dirigeant[]>([]);
  const [raisonSociale, setRaisonSociale] = useState("");
  const [siteWeb, setSiteWeb] = useState("");

  async function lookup(value: string) {
    const digits = value.replace(/\D/g, "");
    if (digits.length !== 14) return;
    setLoading(true);
    setInfo(null);
    try {
      const r = await fetch(`/api/insee/siret?siret=${digits}`);
      if (!r.ok) {
        setInfo("❌ Aucun établissement trouvé avec ce SIRET");
        setLoading(false);
        return;
      }
      const { entreprise: e } = await r.json();

      const set = (name: string, val: string | number | null | undefined) => {
        const el = document.querySelector<HTMLInputElement | HTMLSelectElement>(`[name="${name}"]`);
        if (el && val != null && val !== "") (el as HTMLInputElement).value = String(val);
      };

      set("raisonSociale", e.raisonSociale);
      set("siren", e.siren);
      set("naf", e.naf);
      set("formeJuridique", e.formeJuridique);
      set("adresse", e.adresse);
      set("codePostal", e.codePostal);
      set("ville", e.ville);
      set("pays", e.pays);
      if (e.trancheEffectif) set("secteurDetail", `${e.libelleNaf ?? ""} · ${e.trancheEffectif}`.trim());
      else set("secteurDetail", e.libelleNaf ?? "");
      set("secteur", e.libelleNaf?.split("(")[0]?.trim() ?? "");
      // Taille auto selon tranche INSEE
      const tranche = e.effectif ?? "";
      if (["00", "01", "02", "03"].includes(tranche)) set("taille", "TPE");
      else if (["11", "12", "21", "22"].includes(tranche)) set("taille", "PME");
      else if (["31", "32", "41", "42"].includes(tranche)) set("taille", "ETI");
      else if (["51", "52", "53"].includes(tranche)) set("taille", "GE");

      // Dirigeants → préremplit le 1er + stocke tous pour création contacts auto
      setDirigeants(e.dirigeants ?? []);
      const dir = e.dirigeants?.[0];
      if (dir) set("dirigeantNom", `${dir.prenom} ${dir.nom}`.trim());

      setRaisonSociale(e.raisonSociale ?? "");
      setSiteWeb(e.siteWeb ?? "");
      setInfo(`✅ ${e.raisonSociale} · ${e.libelleNaf ?? ""} · ${e.trancheEffectif ?? "effectif inconnu"} · ${e.estActive ? "Active" : "⚠️ Cessée"}`);
    } catch {
      setInfo("❌ Erreur de connexion à l'API INSEE");
    }
    setLoading(false);
  }

  return (
    <label className="block">
      <span className="block text-sm font-medium text-hubspot-text mb-1">
        SIRET <span className="text-emerald-600 text-xs">(auto-rempli depuis INSEE)</span>
      </span>
      <div className="flex gap-2">
        <input
          name="siret"
          value={siret}
          onChange={(e) => setSiret(e.target.value)}
          onBlur={(e) => lookup(e.target.value)}
          placeholder="14 chiffres — la fiche se complète automatiquement"
          className="flex-1 rounded border border-hubspot-border px-3 py-2 text-sm focus:border-hubspot-orange focus:ring-1 focus:ring-hubspot-orange outline-none"
        />
        <button
          type="button"
          onClick={() => lookup(siret)}
          disabled={loading || siret.replace(/\D/g, "").length !== 14}
          className="btn-secondary text-xs px-3 disabled:opacity-50"
        >
          {loading ? "Recherche…" : "🔍 Rechercher"}
        </button>
      </div>
      {info && <p className={`text-xs mt-1 ${info.startsWith("✅") ? "text-emerald-700" : "text-rose-600"}`}>{info}</p>}

      {dirigeants.length > 0 && (
        <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded">
          <p className="text-xs font-semibold text-emerald-900 mb-2">👥 Dirigeants détectés (créés automatiquement comme Contacts à la sauvegarde) :</p>
          <ul className="text-xs space-y-1">
            {dirigeants.map((d, i) => (
              <li key={i} className="flex justify-between">
                <span>{d.prenom} {d.nom}</span>
                <span className="text-gray-500">{d.qualite}</span>
              </li>
            ))}
          </ul>
          <input type="hidden" name="dirigeantsJSON" value={JSON.stringify(dirigeants)} />
        </div>
      )}

      {raisonSociale && (
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
          <p className="text-xs font-semibold text-blue-900 mb-2">🔍 Rechercher d'autres contacts (gratuit, s'ouvre dans un nouvel onglet) :</p>
          <div className="flex flex-wrap gap-2 text-xs">
            <a target="_blank" rel="noopener" className="px-2 py-1 bg-white border border-blue-300 rounded hover:bg-blue-100"
               href={`https://www.google.com/search?q=${encodeURIComponent(`site:linkedin.com/in "${raisonSociale}" (RH OR "ressources humaines" OR DRH)`)}`}>
              👤 LinkedIn RH (via Google)
            </a>
            <a target="_blank" rel="noopener" className="px-2 py-1 bg-white border border-blue-300 rounded hover:bg-blue-100"
               href={`https://www.google.com/search?q=${encodeURIComponent(`site:linkedin.com/in "${raisonSociale}" (recrutement OR talent)`)}`}>
              💼 LinkedIn Recrutement
            </a>
            <a target="_blank" rel="noopener" className="px-2 py-1 bg-white border border-blue-300 rounded hover:bg-blue-100"
               href={`https://www.pappers.fr/recherche?q=${encodeURIComponent(raisonSociale)}`}>
              📊 Pappers (gratuit)
            </a>
            <a target="_blank" rel="noopener" className="px-2 py-1 bg-white border border-blue-300 rounded hover:bg-blue-100"
               href={`https://annuaire-entreprises.data.gouv.fr/entreprise/${siret.replace(/\D/g, "").substring(0, 9)}`}>
              🏛️ Annuaire entreprises (gouv)
            </a>
          </div>
        </div>
      )}
    </label>
  );
}
