// Constantes d'options pour les champs Candidat/Entreprise/Opportunité

export const FINANCEMENTS = [
  "CPF",
  "OPCO",
  "France Travail",
  "Employeur",
  "Personnel",
  "Région",
  "AGEFIPH",
  "Conseil départemental",
  "Autre",
] as const;

export const STATUTS_LEAD = [
  { code: "froid",     libelle: "Froid (non qualifié)",      couleur: "gray"    },
  { code: "tiede",     libelle: "Tiède",                      couleur: "blue"    },
  { code: "chaud",     libelle: "Chaud",                      couleur: "amber"   },
  { code: "mql",       libelle: "MQL (Marketing Qualified)",  couleur: "purple"  },
  { code: "sql",       libelle: "SQL (Sales Qualified)",      couleur: "orange"  },
  { code: "client",    libelle: "Client (placé)",             couleur: "emerald" },
  { code: "perdu",     libelle: "Perdu",                      couleur: "rose"    },
] as const;

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

// 3 PIPELINES OPPORTUNITÉ (= candidature)
// Chaque pipeline a sa propre liste d'étapes

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
  { cle: "apprentissage",       libelle: "Apprentissage / Alternance", stages: PIPELINE_APPRENTISSAGE,        couleur: "#FF7A59" },
  { cle: "formation_pro",       libelle: "Formation professionnelle longue", stages: PIPELINE_FORMATION_PRO, couleur: "#00BDA5" },
  { cle: "formation_continue",  libelle: "Formation continue courte",   stages: PIPELINE_FORMATION_CONTINUE,  couleur: "#516F90" },
] as const;
