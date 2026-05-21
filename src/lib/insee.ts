// Intégration API gouv "recherche-entreprises" — gratuite, sans clé
// Doc : https://api.gouv.fr/documentation/api-recherche-entreprises
// SIRET → infos complètes (raison sociale, NAF, effectif, adresse, dirigeants…)

export type InseeEntreprise = {
  siret: string;
  siren: string;
  raisonSociale: string;
  formeJuridique: string | null;
  naf: string | null;
  libelleNaf: string | null;
  effectif: string | null;
  trancheEffectif: string | null;
  dateCreation: string | null;
  adresse: string | null;
  codePostal: string | null;
  ville: string | null;
  pays: string;
  estActive: boolean;
  dirigeants: { nom: string; prenom: string; qualite: string }[];
};

const TRANCHES_EFFECTIF: Record<string, string> = {
  "00": "0 salarié",
  "01": "1 à 2 salariés",
  "02": "3 à 5 salariés",
  "03": "6 à 9 salariés",
  "11": "10 à 19 salariés",
  "12": "20 à 49 salariés",
  "21": "50 à 99 salariés",
  "22": "100 à 199 salariés",
  "31": "200 à 249 salariés",
  "32": "250 à 499 salariés",
  "41": "500 à 999 salariés",
  "42": "1000 à 1999 salariés",
  "51": "2000 à 4999 salariés",
  "52": "5000 à 9999 salariés",
  "53": "10000 salariés et plus",
};

export async function chercherEntrepriseParSiret(siret: string): Promise<InseeEntreprise | null> {
  const siretNet = siret.replace(/\D/g, "");
  if (siretNet.length !== 14) return null;

  const url = `https://recherche-entreprises.api.gouv.fr/search?q=${siretNet}&page=1&per_page=1`;
  try {
    const r = await fetch(url, { headers: { Accept: "application/json" }, next: { revalidate: 3600 } });
    if (!r.ok) return null;
    const data = await r.json();
    const e = data.results?.[0];
    if (!e) return null;

    const matchingEtab = e.matching_etablissements?.[0] ?? e.siege ?? {};
    const adresse = matchingEtab.adresse ?? e.siege?.adresse ?? null;
    const codePostal = matchingEtab.code_postal ?? e.siege?.code_postal ?? null;
    const ville = matchingEtab.libelle_commune ?? e.siege?.libelle_commune ?? null;
    const trancheCode = matchingEtab.tranche_effectif_salarie ?? e.tranche_effectif_salarie ?? null;

    return {
      siret: matchingEtab.siret ?? siretNet,
      siren: e.siren,
      raisonSociale: e.nom_complet ?? e.nom_raison_sociale ?? "",
      formeJuridique: e.nature_juridique ?? null,
      naf: matchingEtab.activite_principale ?? e.activite_principale ?? null,
      libelleNaf: matchingEtab.libelle_activite_principale ?? e.libelle_activite_principale ?? null,
      effectif: e.tranche_effectif_salarie ?? null,
      trancheEffectif: trancheCode ? (TRANCHES_EFFECTIF[trancheCode] ?? trancheCode) : null,
      dateCreation: e.date_creation ?? null,
      adresse,
      codePostal,
      ville,
      pays: "France",
      estActive: e.etat_administratif === "A",
      dirigeants: (e.dirigeants ?? []).slice(0, 5).map((d: any) => ({
        nom: d.nom ?? "",
        prenom: d.prenoms ?? "",
        qualite: d.qualite ?? "",
      })),
    };
  } catch {
    return null;
  }
}

// Recherche par nom (raison sociale) — utile si pas de SIRET
export async function chercherEntreprisesParNom(nom: string, limite = 10): Promise<InseeEntreprise[]> {
  if (!nom || nom.length < 3) return [];
  const url = `https://recherche-entreprises.api.gouv.fr/search?q=${encodeURIComponent(nom)}&page=1&per_page=${limite}`;
  try {
    const r = await fetch(url, { headers: { Accept: "application/json" }, next: { revalidate: 3600 } });
    if (!r.ok) return [];
    const data = await r.json();
    return (data.results ?? []).map((e: any) => {
      const etab = e.siege ?? {};
      const trancheCode = etab.tranche_effectif_salarie ?? null;
      return {
        siret: etab.siret ?? "",
        siren: e.siren,
        raisonSociale: e.nom_complet ?? e.nom_raison_sociale ?? "",
        formeJuridique: e.nature_juridique ?? null,
        naf: etab.activite_principale ?? null,
        libelleNaf: etab.libelle_activite_principale ?? null,
        effectif: e.tranche_effectif_salarie ?? null,
        trancheEffectif: trancheCode ? (TRANCHES_EFFECTIF[trancheCode] ?? trancheCode) : null,
        dateCreation: e.date_creation ?? null,
        adresse: etab.adresse ?? null,
        codePostal: etab.code_postal ?? null,
        ville: etab.libelle_commune ?? null,
        pays: "France",
        estActive: e.etat_administratif === "A",
        dirigeants: (e.dirigeants ?? []).slice(0, 5).map((d: any) => ({
          nom: d.nom ?? "",
          prenom: d.prenoms ?? "",
          qualite: d.qualite ?? "",
        })),
      };
    });
  } catch {
    return [];
  }
}
