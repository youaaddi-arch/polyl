// Catalogue ALIOS — 120 formations continues
// Source : src/data/catalogue.json du site formation-ia-site
// Toutes les formations sont SANS entité (formation continue, accessibles à tous)

export type AliosFormation = {
  code: string;
  domaine: string;
  intitule: string;
  certification: string | null;
  financements: string[];
  demande: string;
};

// Prix par défaut selon le domaine (en €)
const PRIX_DOMAINE: Record<string, number> = {
  management: 1500,
  commerce:   1500,
  rh:         1500,
  bureautique:1200,
  ia:         2200,
  anglais:    1200,
  securite:    500,
  btp:         700,
  esthetique: 1000,
  electricite: 700,
  inclusion:   800,
  hcr:         600,
  cyber:      1800,
};

export function prixDefaut(domaine: string): number {
  return PRIX_DOMAINE[domaine] ?? 1500;
}

export const DOMAINES_ALIOS: { id: string; nom: string }[] = [
  { id: "management",  nom: "Management & Encadrement" },
  { id: "commerce",    nom: "Commerce & Relation Client" },
  { id: "rh",          nom: "Ressources Humaines" },
  { id: "bureautique", nom: "Bureautique & Numérique" },
  { id: "ia",          nom: "Intelligence Artificielle" },
  { id: "anglais",     nom: "Anglais Professionnel" },
  { id: "securite",    nom: "Hygiène & Sécurité" },
  { id: "btp",         nom: "BTP" },
  { id: "esthetique",  nom: "Esthétique & Bien-être" },
  { id: "electricite", nom: "Électricité — Habilitations" },
  { id: "inclusion",   nom: "Apprentissage & Inclusion" },
  { id: "hcr",         nom: "Hôtellerie & Restauration" },
  { id: "cyber",       nom: "Cybersécurité" },
];

export const ALIOS_FORMATIONS: AliosFormation[] = [
  // MANAGEMENT (9)
  { code: "mgt-01", domaine: "management", intitule: "Management d'équipe", certification: "RS5366", financements: ["CPF", "OPCO"], demande: "Forte" },
  { code: "mgt-02", domaine: "management", intitule: "Leadership managérial", certification: null, financements: ["OPCO"], demande: "Forte" },
  { code: "mgt-03", domaine: "management", intitule: "Gestion des conflits", certification: null, financements: ["OPCO"], demande: "Élevée" },
  { code: "mgt-04", domaine: "management", intitule: "Animation de réunion", certification: null, financements: ["OPCO"], demande: "Stable" },
  { code: "mgt-05", domaine: "management", intitule: "Conduite du changement", certification: null, financements: ["OPCO"], demande: "Élevée" },
  { code: "mgt-06", domaine: "management", intitule: "Management à distance", certification: null, financements: ["OPCO"], demande: "En hausse" },
  { code: "mgt-07", domaine: "management", intitule: "Communication managériale", certification: null, financements: ["OPCO"], demande: "Élevée" },
  { code: "mgt-08", domaine: "management", intitule: "Entretien professionnel obligatoire", certification: "RS5368", financements: ["CPF", "OPCO"], demande: "Forte" },
  { code: "mgt-09", domaine: "management", intitule: "Manager un projet", certification: "RS5367", financements: ["CPF", "OPCO"], demande: "Élevée" },

  // COMMERCE (8)
  { code: "com-01", domaine: "commerce", intitule: "Techniques de vente", certification: "RS5444", financements: ["CPF", "OPCO"], demande: "Forte" },
  { code: "com-02", domaine: "commerce", intitule: "Négociation commerciale", certification: "RS5444", financements: ["CPF", "OPCO"], demande: "Forte" },
  { code: "com-03", domaine: "commerce", intitule: "Relation client", certification: "RS5370", financements: ["CPF", "OPCO"], demande: "Forte" },
  { code: "com-04", domaine: "commerce", intitule: "Prospection commerciale", certification: null, financements: ["OPCO"], demande: "Élevée" },
  { code: "com-05", domaine: "commerce", intitule: "Gestion des réclamations", certification: null, financements: ["OPCO"], demande: "Stable" },
  { code: "com-06", domaine: "commerce", intitule: "Fidélisation client", certification: null, financements: ["OPCO"], demande: "Élevée" },
  { code: "com-07", domaine: "commerce", intitule: "Vente digitale", certification: null, financements: ["OPCO"], demande: "En hausse" },
  { code: "com-08", domaine: "commerce", intitule: "Merchandising", certification: null, financements: ["OPCO"], demande: "Stable" },

  // RH (7)
  { code: "rh-01", domaine: "rh", intitule: "Droit du travail — fondamentaux", certification: null, financements: ["OPCO"], demande: "Forte" },
  { code: "rh-02", domaine: "rh", intitule: "Recrutement et intégration", certification: "RS6037", financements: ["CPF", "OPCO"], demande: "Forte" },
  { code: "rh-03", domaine: "rh", intitule: "Gestion administrative du personnel", certification: "RS6038", financements: ["CPF", "OPCO"], demande: "Élevée" },
  { code: "rh-04", domaine: "rh", intitule: "Entretien professionnel", certification: null, financements: ["OPCO"], demande: "Élevée" },
  { code: "rh-05", domaine: "rh", intitule: "Gestion des compétences (GEPP)", certification: null, financements: ["OPCO"], demande: "Élevée" },
  { code: "rh-06", domaine: "rh", intitule: "Qualité de vie au travail (QVT)", certification: null, financements: ["OPCO"], demande: "En hausse" },
  { code: "rh-07", domaine: "rh", intitule: "Non-discrimination à l'embauche", certification: null, financements: ["OPCO"], demande: "Stable" },

  // BUREAUTIQUE (9)
  { code: "bur-01", domaine: "bureautique", intitule: "Excel — débutant", certification: "TOSA Excel RS5252", financements: ["CPF", "OPCO"], demande: "Forte" },
  { code: "bur-02", domaine: "bureautique", intitule: "Excel — intermédiaire", certification: "TOSA Excel RS5252", financements: ["CPF", "OPCO"], demande: "Forte" },
  { code: "bur-03", domaine: "bureautique", intitule: "Excel — avancé", certification: "TOSA Excel RS5252", financements: ["CPF", "OPCO"], demande: "Forte" },
  { code: "bur-04", domaine: "bureautique", intitule: "Word professionnel", certification: "TOSA Word RS6159", financements: ["CPF", "OPCO"], demande: "Élevée" },
  { code: "bur-05", domaine: "bureautique", intitule: "PowerPoint professionnel", certification: "TOSA PPT RS6199", financements: ["CPF", "OPCO"], demande: "Élevée" },
  { code: "bur-06", domaine: "bureautique", intitule: "Outlook professionnel", certification: "ICDL RS6559", financements: ["CPF", "OPCO"], demande: "Élevée" },
  { code: "bur-07", domaine: "bureautique", intitule: "Google Workspace", certification: null, financements: ["OPCO"], demande: "En hausse" },
  { code: "bur-08", domaine: "bureautique", intitule: "Tableaux de bord Excel", certification: "TOSA Excel RS5252", financements: ["CPF", "OPCO"], demande: "Forte" },
  { code: "bur-09", domaine: "bureautique", intitule: "Power BI — initiation", certification: null, financements: ["OPCO"], demande: "En hausse" },

  // IA (17)
  { code: "ia-01", domaine: "ia", intitule: "Initiation à l'intelligence artificielle", certification: null, financements: ["OPCO"], demande: "Forte" },
  { code: "ia-02", domaine: "ia", intitule: "Prompt engineering", certification: null, financements: ["OPCO"], demande: "Forte" },
  { code: "ia-03", domaine: "ia", intitule: "Automatisation des tâches avec IA", certification: null, financements: ["OPCO"], demande: "Forte" },
  { code: "ia-04", domaine: "ia", intitule: "IA appliquée aux métiers", certification: null, financements: ["OPCO"], demande: "Forte" },
  { code: "ia-05", domaine: "ia", intitule: "Création de contenus avec IA", certification: null, financements: ["OPCO"], demande: "En hausse" },
  { code: "ia-06", domaine: "ia", intitule: "Analyse de données avec IA", certification: null, financements: ["OPCO"], demande: "En hausse" },
  { code: "ia-07", domaine: "ia", intitule: "Enjeux éthiques de l'IA", certification: null, financements: ["OPCO"], demande: "En hausse" },
  { code: "ia-08", domaine: "ia", intitule: "Claude d'Anthropic — Fondamentaux de l'API", certification: null, financements: ["OPCO"], demande: "Forte" },
  { code: "ia-09", domaine: "ia", intitule: "Prompt engineering avancé avec Claude (méthode Anthropic)", certification: null, financements: ["OPCO"], demande: "Forte" },
  { code: "ia-10", domaine: "ia", intitule: "Real World Prompting — cas d'usage métier avec Claude", certification: null, financements: ["OPCO"], demande: "Forte" },
  { code: "ia-11", domaine: "ia", intitule: "Évaluation et fiabilité des prompts (Prompt Evaluations)", certification: null, financements: ["OPCO"], demande: "En hausse" },
  { code: "ia-12", domaine: "ia", intitule: "Tool Use avec Claude — applications connectées", certification: null, financements: ["OPCO"], demande: "Forte" },
  { code: "ia-13", domaine: "ia", intitule: "Construire un assistant RAG avec Claude", certification: null, financements: ["OPCO"], demande: "Forte" },
  { code: "ia-14", domaine: "ia", intitule: "Model Context Protocol (MCP) — connecter Claude à vos données", certification: null, financements: ["OPCO"], demande: "En hausse" },
  { code: "ia-15", domaine: "ia", intitule: "Claude Code — automatiser les workflows de développement", certification: null, financements: ["OPCO"], demande: "Forte" },
  { code: "ia-16", domaine: "ia", intitule: "Computer Use avec Claude — agents qui pilotent un ordinateur", certification: null, financements: ["OPCO"], demande: "En hausse" },
  { code: "ia-17", domaine: "ia", intitule: "Claude Agent SDK — créer des agents IA autonomes", certification: null, financements: ["OPCO"], demande: "En hausse" },

  // ANGLAIS (6)
  { code: "ang-01", domaine: "anglais", intitule: "Anglais professionnel débutant (A1)", certification: "TOEIC RS6151", financements: ["CPF"], demande: "Forte" },
  { code: "ang-02", domaine: "anglais", intitule: "Anglais professionnel élémentaire (A2)", certification: "TOEIC RS6151", financements: ["CPF"], demande: "Forte" },
  { code: "ang-03", domaine: "anglais", intitule: "Anglais professionnel intermédiaire (B1)", certification: "Linguaskill RS6225", financements: ["CPF"], demande: "Forte" },
  { code: "ang-04", domaine: "anglais", intitule: "Anglais professionnel avancé (B2)", certification: "TOEIC S&W RS6225", financements: ["CPF"], demande: "Élevée" },
  { code: "ang-05", domaine: "anglais", intitule: "Anglais métier", certification: "CLOE RS6435", financements: ["CPF", "OPCO"], demande: "Élevée" },
  { code: "ang-06", domaine: "anglais", intitule: "Anglais pour l'emploi", certification: "TOEIC RS6151", financements: ["CPF"], demande: "Élevée" },

  // SÉCURITÉ (6)
  { code: "sec-01", domaine: "securite", intitule: "Sauveteur Secouriste du Travail (SST)", certification: "SST INRS", financements: ["CPF", "OPCO"], demande: "Forte" },
  { code: "sec-02", domaine: "securite", intitule: "Gestes et postures / prévention TMS", certification: null, financements: ["OPCO"], demande: "Forte" },
  { code: "sec-03", domaine: "securite", intitule: "Prévention des risques professionnels", certification: null, financements: ["OPCO"], demande: "Élevée" },
  { code: "sec-04", domaine: "securite", intitule: "Prévention des TMS", certification: null, financements: ["OPCO"], demande: "Élevée" },
  { code: "sec-05", domaine: "securite", intitule: "Équipier première intervention incendie (EPI)", certification: null, financements: ["OPCO"], demande: "Élevée" },
  { code: "sec-06", domaine: "securite", intitule: "Évacuation incendie", certification: null, financements: ["OPCO"], demande: "Stable" },

  // BTP (10)
  { code: "btp-01", domaine: "btp", intitule: "AIPR — Autorisation Intervention Proximité Réseaux", certification: "AIPR réglementaire", financements: ["CPF", "OPCO"], demande: "Forte" },
  { code: "btp-02", domaine: "btp", intitule: "Travail en hauteur", certification: null, financements: ["OPCO"], demande: "Forte" },
  { code: "btp-03", domaine: "btp", intitule: "Port du harnais", certification: null, financements: ["OPCO"], demande: "Forte" },
  { code: "btp-04", domaine: "btp", intitule: "Lecture de plans", certification: null, financements: ["OPCO"], demande: "Élevée" },
  { code: "btp-05", domaine: "btp", intitule: "Métrés", certification: null, financements: ["OPCO"], demande: "Élevée" },
  { code: "btp-06", domaine: "btp", intitule: "Organisation de chantier", certification: null, financements: ["OPCO"], demande: "Élevée" },
  { code: "btp-07", domaine: "btp", intitule: "Introduction au BIM / Maquette numérique", certification: null, financements: ["OPCO"], demande: "En hausse" },
  { code: "btp-08", domaine: "btp", intitule: "Coordination d'équipe chantier", certification: null, financements: ["OPCO"], demande: "Élevée" },
  { code: "btp-09", domaine: "btp", intitule: "Montage échafaudage", certification: null, financements: ["OPCO"], demande: "Élevée" },
  { code: "btp-10", domaine: "btp", intitule: "Amiante SS4", certification: "SS4 réglementaire", financements: ["OPCO"], demande: "Forte" },

  // ESTHÉTIQUE (8)
  { code: "est-01", domaine: "esthetique", intitule: "Hygiène en institut", certification: null, financements: ["OPCO"], demande: "Forte" },
  { code: "est-02", domaine: "esthetique", intitule: "Techniques soins visage", certification: null, financements: ["OPCO"], demande: "Élevée" },
  { code: "est-03", domaine: "esthetique", intitule: "Techniques soins corps", certification: null, financements: ["OPCO"], demande: "Élevée" },
  { code: "est-04", domaine: "esthetique", intitule: "Épilation professionnelle", certification: null, financements: ["OPCO"], demande: "Stable" },
  { code: "est-05", domaine: "esthetique", intitule: "Extensions de cils", certification: null, financements: ["OPCO"], demande: "En hausse" },
  { code: "est-06", domaine: "esthetique", intitule: "Nail art", certification: null, financements: ["OPCO"], demande: "En hausse" },
  { code: "est-07", domaine: "esthetique", intitule: "Vente en institut", certification: null, financements: ["OPCO"], demande: "Élevée" },
  { code: "est-08", domaine: "esthetique", intitule: "Développement activité esthétique", certification: null, financements: ["OPCO"], demande: "Stable" },

  // ÉLECTRICITÉ (12)
  { code: "ele-01", domaine: "electricite", intitule: "Habilitation électrique B0 H0 H0V", certification: "NF C 18-510", financements: ["CPF", "OPCO"], demande: "Forte" },
  { code: "ele-02", domaine: "electricite", intitule: "Habilitation électrique BS BE", certification: "NF C 18-510", financements: ["CPF", "OPCO"], demande: "Forte" },
  { code: "ele-03", domaine: "electricite", intitule: "Habilitation électrique B1 B2", certification: "NF C 18-510", financements: ["CPF", "OPCO"], demande: "Forte" },
  { code: "ele-04", domaine: "electricite", intitule: "Habilitation électrique BR", certification: "NF C 18-510", financements: ["CPF", "OPCO"], demande: "Forte" },
  { code: "ele-05", domaine: "electricite", intitule: "Habilitation électrique BC", certification: "NF C 18-510", financements: ["CPF", "OPCO"], demande: "Forte" },
  { code: "ele-06", domaine: "electricite", intitule: "Recyclage habilitation B0 H0 H0V", certification: "NF C 18-510", financements: ["OPCO"], demande: "Élevée" },
  { code: "ele-07", domaine: "electricite", intitule: "Recyclage habilitation BS BE", certification: "NF C 18-510", financements: ["OPCO"], demande: "Élevée" },
  { code: "ele-08", domaine: "electricite", intitule: "Recyclage habilitation BR", certification: "NF C 18-510", financements: ["OPCO"], demande: "Élevée" },
  { code: "ele-09", domaine: "electricite", intitule: "Recyclage habilitation BC", certification: "NF C 18-510", financements: ["OPCO"], demande: "Élevée" },
  { code: "ele-10", domaine: "electricite", intitule: "Lecture de schémas électriques", certification: null, financements: ["OPCO"], demande: "Élevée" },
  { code: "ele-11", domaine: "electricite", intitule: "Maintenance électrique niveau 1", certification: null, financements: ["OPCO"], demande: "Élevée" },
  { code: "ele-12", domaine: "electricite", intitule: "Maintenance électrique niveau 2", certification: null, financements: ["OPCO"], demande: "Élevée" },

  // INCLUSION (12)
  { code: "inc-01", domaine: "inclusion", intitule: "Formation Maître d'apprentissage / Tuteur en entreprise", certification: null, financements: ["OPCO", "France Travail"], demande: "Forte" },
  { code: "inc-02", domaine: "inclusion", intitule: "Actualisation des compétences du tuteur", certification: null, financements: ["OPCO"], demande: "Élevée" },
  { code: "inc-03", domaine: "inclusion", intitule: "Référent handicap — rôle et missions", certification: null, financements: ["OPCO", "AGEFIPH"], demande: "En hausse" },
  { code: "inc-04", domaine: "inclusion", intitule: "Accueillir un apprenant en situation de handicap", certification: null, financements: ["OPCO", "AGEFIPH"], demande: "En hausse" },
  { code: "inc-05", domaine: "inclusion", intitule: "Non-discrimination à l'embauche", certification: null, financements: ["OPCO"], demande: "Stable" },
  { code: "inc-06", domaine: "inclusion", intitule: "Égalité professionnelle femmes-hommes", certification: null, financements: ["OPCO"], demande: "En hausse" },
  { code: "inc-07", domaine: "inclusion", intitule: "Prévention des discriminations en entreprise", certification: null, financements: ["OPCO"], demande: "Stable" },
  { code: "inc-08", domaine: "inclusion", intitule: "Diversité et inclusion en milieu professionnel", certification: null, financements: ["OPCO"], demande: "En hausse" },
  { code: "inc-09", domaine: "inclusion", intitule: "Sensibilisation au harcèlement et aux violences", certification: null, financements: ["OPCO"], demande: "En hausse" },
  { code: "inc-10", domaine: "inclusion", intitule: "Accompagnement des publics à besoins spécifiques", certification: null, financements: ["OPCO"], demande: "Stable" },
  { code: "inc-11", domaine: "inclusion", intitule: "Prévention des ruptures en apprentissage", certification: null, financements: ["OPCO"], demande: "Stable" },
  { code: "inc-12", domaine: "inclusion", intitule: "Posture du tuteur face à la diversité des publics", certification: null, financements: ["OPCO"], demande: "Stable" },

  // HCR (8)
  { code: "hcr-01", domaine: "hcr", intitule: "Hygiène alimentaire HACCP (14h)", certification: "Attestation HACCP", financements: ["OPCO AKT", "France Travail"], demande: "Forte" },
  { code: "hcr-02", domaine: "hcr", intitule: "Permis d'exploitation (vente d'alcool)", certification: "Attestation Permis", financements: ["OPCO AKT"], demande: "Forte" },
  { code: "hcr-03", domaine: "hcr", intitule: "CQP Serveur en restauration", certification: "CQP branche HCR", financements: ["OPCO AKT"], demande: "Forte" },
  { code: "hcr-04", domaine: "hcr", intitule: "CQP Cuisinier", certification: "CQP branche HCR", financements: ["OPCO AKT"], demande: "Forte" },
  { code: "hcr-05", domaine: "hcr", intitule: "CQP Réceptionniste hôtellerie", certification: "CQP branche HCR", financements: ["OPCO AKT"], demande: "Élevée" },
  { code: "hcr-06", domaine: "hcr", intitule: "Management en restauration / encadrement CHR", certification: null, financements: ["OPCO AKT"], demande: "Forte" },
  { code: "hcr-07", domaine: "hcr", intitule: "Gestion des allergènes alimentaires", certification: null, financements: ["OPCO AKT"], demande: "En hausse" },
  { code: "hcr-08", domaine: "hcr", intitule: "Permis de former HCR (tuteurs — 14h)", certification: "Permis de former", financements: ["OPCO AKT"], demande: "Élevée" },

  // CYBERSÉCURITÉ (8)
  { code: "cyb-01", domaine: "cyber", intitule: "Sensibilisation cybersécurité pour tous", certification: null, financements: ["OPCO"], demande: "Forte" },
  { code: "cyb-02", domaine: "cyber", intitule: "Phishing et ingénierie sociale", certification: null, financements: ["OPCO"], demande: "Forte" },
  { code: "cyb-03", domaine: "cyber", intitule: "RGPD et protection des données", certification: null, financements: ["OPCO"], demande: "Forte" },
  { code: "cyb-04", domaine: "cyber", intitule: "Sécurisation des systèmes d'information", certification: null, financements: ["OPCO"], demande: "Forte" },
  { code: "cyb-05", domaine: "cyber", intitule: "Gestion des incidents de sécurité", certification: null, financements: ["OPCO"], demande: "En hausse" },
  { code: "cyb-06", domaine: "cyber", intitule: "Cybersécurité pour les PME", certification: null, financements: ["OPCO"], demande: "En hausse" },
  { code: "cyb-07", domaine: "cyber", intitule: "Sécurité du cloud", certification: null, financements: ["OPCO"], demande: "En hausse" },
  { code: "cyb-08", domaine: "cyber", intitule: "Plan de continuité et reprise d'activité (PCA/PRA)", certification: null, financements: ["OPCO"], demande: "Élevée" },
];
