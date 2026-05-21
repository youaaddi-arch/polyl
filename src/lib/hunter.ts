// Intégration Hunter.io — recherche d'emails par domaine
// Doc : https://hunter.io/api-documentation/v2
// Free tier : 25 recherches/mois + 50 vérifications/mois
// Clé API à stocker en variable d'env HUNTER_API_KEY (gratuit après inscription sur hunter.io)

export type HunterContact = {
  email: string;
  prenom: string | null;
  nom: string | null;
  poste: string | null;
  service: string | null;     // "executive", "hr", "finance", "it", "sales", "marketing", ...
  type: string | null;        // "personal" ou "generic"
  confiance: number;          // 0-100
  linkedin: string | null;
  telephone: string | null;
};

const SERVICE_FR: Record<string, string> = {
  executive: "Direction",
  hr: "RH",
  finance: "Finance",
  it: "IT",
  marketing: "Marketing",
  sales: "Commercial",
  legal: "Juridique",
  support: "Support",
  communication: "Communication",
  management: "Management",
};

// Mots-clés pour cibler RH / Formation dans le poste si Hunter ne classifie pas
const MOTS_RH = ["rh", "ressources humaines", "drh", "hr", "human resources", "people", "talent", "recrut", "formation", "training", "learning", "développement compétences"];

export function estContactRH(c: HunterContact): boolean {
  if (c.service === "hr") return true;
  const poste = (c.poste ?? "").toLowerCase();
  return MOTS_RH.some((m) => poste.includes(m));
}

export async function chercherEmailsParDomaine(domain: string, limit = 25): Promise<HunterContact[]> {
  const apiKey = process.env.HUNTER_API_KEY;
  if (!apiKey) {
    throw new Error("Clé HUNTER_API_KEY manquante — ajoute-la dans le fichier .env");
  }
  const cleanDomain = domain.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0];
  if (!cleanDomain) return [];

  const url = `https://api.hunter.io/v2/domain-search?domain=${encodeURIComponent(cleanDomain)}&limit=${limit}&api_key=${apiKey}`;
  const r = await fetch(url, { headers: { Accept: "application/json" }, next: { revalidate: 3600 } });
  if (!r.ok) {
    const err = await r.text();
    throw new Error(`Hunter.io erreur ${r.status} : ${err.slice(0, 200)}`);
  }
  const data = await r.json();
  const emails: any[] = data.data?.emails ?? [];

  return emails.map((e) => ({
    email: e.value,
    prenom: e.first_name ?? null,
    nom: e.last_name ?? null,
    poste: e.position ?? null,
    service: e.department ? (SERVICE_FR[e.department] ?? e.department) : null,
    type: e.type ?? null,
    confiance: e.confidence ?? 0,
    linkedin: e.linkedin ?? null,
    telephone: e.phone_number ?? null,
  }));
}

// Vérifie si une clé Hunter est configurée (sans appeler l'API)
export function hunterConfigure(): boolean {
  return !!process.env.HUNTER_API_KEY;
}
