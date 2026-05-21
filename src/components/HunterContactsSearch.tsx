"use client";

import { useState } from "react";

type Contact = {
  email: string;
  prenom: string | null;
  nom: string | null;
  poste: string | null;
  service: string | null;
  type: string | null;
  confiance: number;
  linkedin: string | null;
  telephone: string | null;
};

export default function HunterContactsSearch() {
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  async function search() {
    let d = domain.trim();
    if (!d) {
      const siteEl = document.querySelector<HTMLInputElement>('[name="siteWeb"]');
      d = siteEl?.value?.trim() ?? "";
    }
    if (!d) { setError("Saisis un domaine ou un site web d'abord"); return; }
    setLoading(true); setError(null); setContacts([]); setSelected(new Set());
    try {
      const r = await fetch(`/api/hunter/search?domain=${encodeURIComponent(d)}`);
      const data = await r.json();
      if (!r.ok) { setError(data.error ?? "Erreur Hunter"); setLoading(false); return; }
      setContacts(data.contacts ?? []);
      // Présélectionne les RH / Formation par défaut
      const rhMots = /rh|ressource|drh|recrut|formation|talent|people|learning/i;
      const pre = new Set<string>();
      for (const c of data.contacts ?? []) {
        if (c.service === "RH" || (c.poste && rhMots.test(c.poste))) pre.add(c.email);
      }
      setSelected(pre);
    } catch (e: any) {
      setError(e.message ?? "Erreur réseau");
    }
    setLoading(false);
  }

  function toggle(email: string) {
    const next = new Set(selected);
    if (next.has(email)) next.delete(email); else next.add(email);
    setSelected(next);
  }

  const selectedList = contacts.filter((c) => selected.has(c.email));

  return (
    <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded">
      <p className="text-xs font-semibold text-orange-900 mb-2">🎯 Hunter.io — Trouver les RH / Responsables Formation</p>

      <div className="flex gap-2 mb-2">
        <input
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder="Domaine (ex : carrefour.fr) ou laisse vide pour utiliser le Site web"
          className="flex-1 text-xs rounded border border-orange-300 px-2 py-1"
        />
        <button type="button" onClick={search} disabled={loading} className="text-xs px-3 py-1 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:opacity-50">
          {loading ? "Recherche…" : "🔍 Chercher emails"}
        </button>
      </div>

      {error && <p className="text-xs text-rose-600">{error}</p>}

      {contacts.length > 0 && (
        <>
          <p className="text-xs text-orange-900 mb-2">
            {contacts.length} contacts trouvés · {selected.size} sélectionnés (les RH/Formation sont pré-cochés).
            Décoche ce que tu ne veux pas avant de sauvegarder l'entreprise.
          </p>
          <ul className="space-y-1 max-h-64 overflow-y-auto bg-white border border-orange-200 rounded p-2">
            {contacts.map((c) => (
              <li key={c.email} className="text-xs flex items-start gap-2 py-1 border-b last:border-0">
                <input
                  type="checkbox"
                  checked={selected.has(c.email)}
                  onChange={() => toggle(c.email)}
                  className="mt-0.5 w-3 h-3 accent-orange-600"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">
                    {c.prenom ?? "?"} {c.nom ?? ""} <span className="text-gray-500 font-normal">— {c.email}</span>
                  </div>
                  <div className="text-gray-600 truncate">
                    {c.poste ?? "—"}
                    {c.service && <span className="ml-1 px-1 bg-orange-100 text-orange-800 rounded">{c.service}</span>}
                    {c.telephone && <span className="ml-1">📞 {c.telephone}</span>}
                  </div>
                </div>
                <span className={`text-xs px-1 rounded ${c.confiance >= 70 ? "bg-emerald-100 text-emerald-700" : c.confiance >= 40 ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-600"}`}>
                  {c.confiance}%
                </span>
              </li>
            ))}
          </ul>
          <input type="hidden" name="contactsHunterJSON" value={JSON.stringify(selectedList)} />
          <p className="text-xs text-orange-900 mt-2">
            ✅ Les {selected.size} contacts cochés seront ajoutés comme Contacts de l'entreprise à la sauvegarde.
          </p>
        </>
      )}
    </div>
  );
}
