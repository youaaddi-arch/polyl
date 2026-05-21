// Constantes d'options pour les champs Candidat/Entreprise/Opportunité

// 80 nationalités les plus courantes en France (alphabétique, Française en premier)
export const NATIONALITES = [
  "Française",
  "—",
  "Algérienne", "Allemande", "Américaine", "Anglaise", "Angolaise", "Argentine", "Arménienne", "Australienne", "Autrichienne",
  "Belge", "Béninoise", "Bolivienne", "Brésilienne", "Britannique", "Bulgare", "Burkinabée",
  "Camerounaise", "Canadienne", "Centrafricaine", "Chilienne", "Chinoise", "Colombienne", "Comorienne", "Congolaise", "Coréenne", "Croate", "Cubaine",
  "Danoise", "Djiboutienne", "Dominicaine",
  "Égyptienne", "Émiratie", "Équatorienne", "Érythréenne", "Espagnole", "Estonienne", "Éthiopienne",
  "Finlandaise",
  "Gabonaise", "Géorgienne", "Ghanéenne", "Grecque", "Guatémaltèque", "Guinéenne",
  "Haïtienne", "Hondurienne", "Hongroise",
  "Indienne", "Indonésienne", "Iranienne", "Irakienne", "Irlandaise", "Islandaise", "Israélienne", "Italienne", "Ivoirienne",
  "Jamaïcaine", "Japonaise", "Jordanienne",
  "Kazakhe", "Kényane", "Kosovare",
  "Laotienne", "Lettone", "Libanaise", "Libérienne", "Libyenne", "Lituanienne", "Luxembourgeoise",
  "Macédonienne", "Malgache", "Malienne", "Marocaine", "Mauricienne", "Mauritanienne", "Mexicaine", "Moldave", "Monégasque", "Mongole",
  "Néerlandaise", "Néo-zélandaise", "Népalaise", "Nigériane", "Nigérienne", "Norvégienne",
  "Pakistanaise", "Palestinienne", "Panaméenne", "Paraguayenne", "Péruvienne", "Philippine", "Polonaise", "Portugaise",
  "Qatarienne",
  "Roumaine", "Russe", "Rwandaise",
  "Saoudienne", "Sénégalaise", "Serbe", "Slovaque", "Slovène", "Somalienne", "Soudanaise", "Sri-lankaise", "Suédoise", "Suisse", "Syrienne",
  "Tadjike", "Taïwanaise", "Tanzanienne", "Tchadienne", "Tchèque", "Thaïlandaise", "Togolaise", "Tunisienne", "Turque", "Turkmène",
  "Ukrainienne", "Uruguayenne",
  "Vénézuélienne", "Vietnamienne",
  "Yéménite",
  "Zambienne", "Zimbabwéenne",
  "Autre",
];

// Sources d'entrée standardisées
export const SOURCES_ENTREE = [
  { code: "indeed",            libelle: "Indeed",                      type: "ats" },
  { code: "hellowork",         libelle: "HelloWork",                   type: "ats" },
  { code: "labonnealternance", libelle: "La Bonne Alternance",         type: "ats" },
  { code: "francetravail",     libelle: "France Travail",              type: "ats" },
  { code: "linkedin",          libelle: "LinkedIn Jobs",               type: "ats" },
  { code: "site_internet",     libelle: "Site internet du CFA",        type: "web" },
  { code: "formulaire_public", libelle: "Formulaire public CRM",       type: "web" },
  { code: "sur_site",          libelle: "Sur site (visite au CFA)",    type: "physique" },
  { code: "salon",             libelle: "Salon / Job Dating",          type: "physique" },
  { code: "recommandation",    libelle: "Recommandation / Bouche-à-oreille", type: "off" },
  { code: "mission_locale",    libelle: "Mission Locale",              type: "prescripteur" },
  { code: "cap_emploi",        libelle: "Cap Emploi",                  type: "prescripteur" },
  { code: "appel_entrant",     libelle: "Appel téléphonique entrant",  type: "tel" },
  { code: "email_entrant",     libelle: "Email entrant",               type: "email" },
  { code: "instagram",         libelle: "Instagram",                   type: "social" },
  { code: "facebook",          libelle: "Facebook",                    type: "social" },
  { code: "tiktok",            libelle: "TikTok",                      type: "social" },
  { code: "autre",             libelle: "Autre",                       type: "autre" },
] as const;

// Codes ATS qui déclenchent l'auto-remplissage poste/CV/formation
export const SOURCES_ATS = ["indeed", "hellowork", "labonnealternance", "francetravail", "linkedin"];

// Statut professionnel (avant le financement)
export const STATUTS_PRO = [
  { code: "demandeur_emploi",   libelle: "Demandeur d'emploi" },
  { code: "salarie",            libelle: "Salarié·e" },
  { code: "sans_activite",      libelle: "Sans activité" },
  { code: "auto_entrepreneur",  libelle: "Auto-entrepreneur / Indépendant" },
  { code: "etudiant",           libelle: "Étudiant·e / Lycéen·ne" },
  { code: "fonctionnaire",      libelle: "Fonctionnaire" },
  { code: "autre",              libelle: "Autre" },
] as const;

export const ANCIENNETE_SALARIE = [
  "Moins de 6 mois",
  "6 à 12 mois",
  "1 à 3 ans",
  "3 à 5 ans",
  "Plus de 5 ans",
] as const;

// Financements complets
export const FINANCEMENTS = [
  { code: "cpf",                        libelle: "CPF (Compte Personnel de Formation)" },
  { code: "france_travail",             libelle: "France Travail" },
  { code: "aif",                        libelle: "AIF (Aide Individuelle à la Formation)" },
  { code: "poei",                       libelle: "POEI (Préparation Opérationnelle à l'Emploi Individuelle)" },
  { code: "poec",                       libelle: "POEC (Préparation Opérationnelle à l'Emploi Collective)" },
  { code: "afpr",                       libelle: "AFPR (Action de Formation Préalable au Recrutement)" },
  { code: "opco",                       libelle: "OPCO (prise en charge employeur)" },
  { code: "alternance",                 libelle: "Alternance (apprentissage / contrat pro)" },
  { code: "cpf_transition_pro",         libelle: "Transition Pro (PTP — CPF de Transition Professionnelle)" },
  { code: "faf",                        libelle: "FAF (Fonds d'Assurance Formation — indépendants)" },
  { code: "region",                     libelle: "Aides régionales (Conseil régional)" },
  { code: "agefiph",                    libelle: "AGEFIPH (travailleurs handicapés)" },
  { code: "plan_dev_competences",       libelle: "Plan de développement des compétences (employeur)" },
  { code: "vae",                        libelle: "VAE (Validation des Acquis de l'Expérience)" },
  { code: "personnel",                  libelle: "Personnel / Auto-financement" },
  { code: "autre",                      libelle: "Autre" },
] as const;

// Suggestion de financement selon le statut professionnel + reconversion
export function financementsSuggeres(statutPro: string | null, reconversion: boolean): string[] {
  if (statutPro === "demandeur_emploi") return ["france_travail", "aif", "poei", "poec", "afpr", "cpf", "agefiph", "region"];
  if (statutPro === "salarie" && reconversion) return ["cpf_transition_pro", "cpf", "plan_dev_competences"];
  if (statutPro === "salarie") return ["plan_dev_competences", "opco", "cpf", "vae", "personnel"];
  if (statutPro === "auto_entrepreneur") return ["faf", "cpf", "personnel"];
  if (statutPro === "etudiant") return ["alternance", "opco", "personnel"];
  if (statutPro === "sans_activite") return ["cpf", "region", "personnel"];
  return ["cpf", "personnel"];
}

export const STATUTS_LEAD = [
  { code: "froid",     libelle: "Froid",          couleur: "gray" },
  { code: "tiede",     libelle: "Tiède",          couleur: "blue" },
  { code: "chaud",     libelle: "Chaud",          couleur: "amber" },
  { code: "mql",       libelle: "MQL",            couleur: "purple" },
  { code: "sql",       libelle: "SQL",            couleur: "orange" },
  { code: "client",    libelle: "Client (placé)", couleur: "emerald" },
  { code: "perdu",     libelle: "Perdu",          couleur: "rose" },
] as const;

// Calcul AUTOMATIQUE du statut lead selon la qualité du dossier
export function calculerStatutLead(candidat: {
  email?: string | null;
  telephone?: string | null;
  formationId?: string | null;
  formationManuelleNom?: string | null;
  financementChoisi?: string | null;
  statutPro?: string | null;
  societeMatcheeId?: string | null;
  reconversion?: boolean | null;
  consentRgpd?: boolean | null;
}): { statut: string; score: number } {
  let score = 0;
  if (candidat.email) score += 10;
  if (candidat.telephone) score += 10;
  if (candidat.consentRgpd) score += 5;
  if (candidat.statutPro) score += 10;
  if (candidat.financementChoisi) score += 20;
  if (candidat.formationId || candidat.formationManuelleNom) score += 20;
  if (candidat.reconversion) score += 5;
  if (candidat.societeMatcheeId) score += 20;

  let statut = "froid";
  if (score >= 80) statut = "sql";
  else if (score >= 60) statut = "mql";
  else if (score >= 45) statut = "chaud";
  else if (score >= 25) statut = "tiede";
  return { statut, score };
}

export const SITUATIONS_CANDIDAT = [
  "Lycéen·ne",
  "Étudiant·e",
  "Salarié·e en poste",
  "Salarié·e en CDD",
  "Demandeur·euse d'emploi",
  "En reconversion",
  "Indépendant·e",
  "Sans activité",
  "Autre",
] as const;

export const NIVEAUX_ANGLAIS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;

export const MOBILITE_GEO = [
  "Locale (< 30 km)",
  "Régionale",
  "Nationale",
  "Internationale",
] as const;

export const PRESCRIPTEURS = [
  "France Travail",
  "Mission Locale",
  "Cap Emploi",
  "Bouche-à-oreille",
  "Recommandation",
  "Site web",
  "Salon",
  "Réseaux sociaux",
  "Autre",
] as const;

// 3 PIPELINES OPPORTUNITÉ
export const PIPELINE_APPRENTISSAGE = [
  { cle: "demande_renseignement", libelle: "Demande de renseignement", probabilite: 10, ordre: 1 },
  { cle: "candidature",            libelle: "Candidature",              probabilite: 20, ordre: 2 },
  { cle: "entretien_tel",          libelle: "Entretien téléphonique",   probabilite: 30, ordre: 3 },
  { cle: "entretien_physique",     libelle: "Entretien physique",       probabilite: 40, ordre: 4 },
  { cle: "job_dating",             libelle: "Job Dating",               probabilite: 50, ordre: 5 },
  { cle: "place",                  libelle: "Placé",                    probabilite: 70, ordre: 6 },
  { cle: "contrat_saisi",          libelle: "Contrat saisi",            probabilite: 80, ordre: 7 },
  { cle: "contrat_accorde",        libelle: "Contrat accordé",          probabilite: 90, ordre: 8 },
  { cle: "entree_formation",       libelle: "Entrée en formation (client)", probabilite: 100, ordre: 9 },
  { cle: "fin_formation",          libelle: "Fin de formation",         probabilite: 100, ordre: 10 },
] as const;

export const PIPELINE_FORMATION_PRO = [
  { cle: "demande_renseignement", libelle: "Demande de renseignement", probabilite: 10, ordre: 1 },
  { cle: "candidature",            libelle: "Candidature",              probabilite: 20, ordre: 2 },
  { cle: "entretien_tel",          libelle: "Entretien téléphonique",   probabilite: 30, ordre: 3 },
  { cle: "devis_envoye",           libelle: "Devis envoyé",             probabilite: 50, ordre: 4 },
  { cle: "devis_valide",           libelle: "Devis validé",             probabilite: 65, ordre: 5 },
  { cle: "financement_envoye",     libelle: "Demande de financement envoyée", probabilite: 75, ordre: 6 },
  { cle: "financement_accorde",    libelle: "Demande de financement accordée", probabilite: 90, ordre: 7 },
  { cle: "entree_formation",       libelle: "Entrée en formation (client)", probabilite: 100, ordre: 8 },
  { cle: "fin_formation",          libelle: "Fin de formation",         probabilite: 100, ordre: 9 },
] as const;

export const PIPELINE_FORMATION_CONTINUE = [
  { cle: "demande_renseignement", libelle: "Demande de renseignement", probabilite: 15, ordre: 1 },
  { cle: "entretien_tel",          libelle: "Entretien téléphonique",   probabilite: 35, ordre: 2 },
  { cle: "devis_envoye",           libelle: "Devis envoyé",             probabilite: 55, ordre: 3 },
  { cle: "financement_envoye",     libelle: "Demande de financement envoyée", probabilite: 70, ordre: 4 },
  { cle: "financement_accorde",    libelle: "Demande de financement accordée", probabilite: 90, ordre: 5 },
  { cle: "entree_formation",       libelle: "Entrée en formation (client)", probabilite: 100, ordre: 6 },
  { cle: "fin_formation",          libelle: "Fin de formation",         probabilite: 100, ordre: 7 },
] as const;

export const TYPES_OPPORTUNITE = [
  { cle: "apprentissage",       libelle: "Apprentissage / Alternance",       stages: PIPELINE_APPRENTISSAGE,       couleur: "#FF7A59" },
  { cle: "formation_pro",       libelle: "Formation professionnelle longue", stages: PIPELINE_FORMATION_PRO,       couleur: "#00BDA5" },
  { cle: "formation_continue",  libelle: "Formation continue courte",         stages: PIPELINE_FORMATION_CONTINUE,  couleur: "#516F90" },
] as const;
