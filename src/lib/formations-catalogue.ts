// Catalogue formations - CDC section 2.1 + ALIOS Formation Continue

export type FormationSeed = {
  entiteCode: string;
  intitule: string;
  niveau: string;
  type: string;
  voieAcces: string;
  secteurs?: string;
  metiers?: string;
  dureeMois?: number;
  montant?: number;  // prix moyen en € (sert à auto-remplir le devis)
};

export const CATALOGUE: FormationSeed[] = [
  // PNFF — Hôtellerie & Restauration
  { entiteCode: "PNFF", intitule: "TP Commis de cuisine",                    niveau: "Niveau 3 (CAP)",    type: "Titre Professionnel", voieAcces: "Apprentissage & Formation continue", secteurs: "Hôtellerie, Restauration", metiers: "Commis de cuisine", dureeMois: 12 },
  { entiteCode: "PNFF", intitule: "TP Employé Polyvalent de Restauration",   niveau: "Niveau 3 (CAP)",    type: "Titre Professionnel", voieAcces: "Apprentissage & Formation continue", secteurs: "Hôtellerie, Restauration", metiers: "Employé polyvalent", dureeMois: 12 },

  // DBS — Commerce & Management
  { entiteCode: "DBS",  intitule: "TP Conseiller Commercial",                niveau: "Niveau 4 (Bac)",    type: "Titre Professionnel", voieAcces: "Apprentissage & Formation continue", secteurs: "Commerce, Distribution", metiers: "Conseiller commercial", dureeMois: 12 },
  { entiteCode: "DBS",  intitule: "TP Négociateur Technico-Commercial",      niveau: "Niveau 5 (Bac+2)",  type: "Titre Professionnel", voieAcces: "Apprentissage & Formation continue", secteurs: "Commerce, BtoB", metiers: "Négociateur technico-commercial", dureeMois: 18 },
  { entiteCode: "DBS",  intitule: "TP Responsable d'Établissement Marchand", niveau: "Niveau 5 (Bac+2)",  type: "Titre Professionnel", voieAcces: "Apprentissage & Formation continue", secteurs: "Distribution, Retail", metiers: "Responsable de point de vente", dureeMois: 18 },
  { entiteCode: "DBS",  intitule: "MASTER Manager Business Unit",            niveau: "Niveau 7 (Bac+5)",  type: "Master",              voieAcces: "Apprentissage & Formation continue", secteurs: "Management, Commerce", metiers: "Manager BU", dureeMois: 24 },

  // PNBS — Commerce & Management
  { entiteCode: "PNBS", intitule: "TP Conseiller Commercial",                niveau: "Niveau 4 (Bac)",    type: "Titre Professionnel", voieAcces: "Apprentissage & Formation continue", secteurs: "Commerce, Distribution", metiers: "Conseiller commercial", dureeMois: 12 },
  { entiteCode: "PNBS", intitule: "TP Négociateur Technico-Commercial",      niveau: "Niveau 5 (Bac+2)",  type: "Titre Professionnel", voieAcces: "Apprentissage & Formation continue", secteurs: "Commerce, BtoB", metiers: "Négociateur technico-commercial", dureeMois: 18 },
  { entiteCode: "PNBS", intitule: "TP Responsable d'Établissement Marchand", niveau: "Niveau 5 (Bac+2)",  type: "Titre Professionnel", voieAcces: "Apprentissage & Formation continue", secteurs: "Distribution, Retail", metiers: "Responsable de point de vente", dureeMois: 18 },
  { entiteCode: "PNBS", intitule: "MASTER Manager Business Unit",            niveau: "Niveau 7 (Bac+5)",  type: "Master",              voieAcces: "Apprentissage & Formation continue", secteurs: "Management, Commerce", metiers: "Manager BU", dureeMois: 24 },

  // ORCEA — Commerce & Management
  { entiteCode: "ORCEA", intitule: "TP Conseiller Commercial",               niveau: "Niveau 4 (Bac)",    type: "Titre Professionnel", voieAcces: "Apprentissage & Formation continue", secteurs: "Commerce, Distribution", metiers: "Conseiller commercial", dureeMois: 12 },
  { entiteCode: "ORCEA", intitule: "TP Négociateur Technico-Commercial",     niveau: "Niveau 5 (Bac+2)",  type: "Titre Professionnel", voieAcces: "Apprentissage & Formation continue", secteurs: "Commerce, BtoB", metiers: "Négociateur technico-commercial", dureeMois: 18 },
  { entiteCode: "ORCEA", intitule: "TP Responsable d'Établissement Marchand", niveau: "Niveau 5 (Bac+2)", type: "Titre Professionnel", voieAcces: "Apprentissage & Formation continue", secteurs: "Distribution, Retail", metiers: "Responsable de point de vente", dureeMois: 18 },
  { entiteCode: "ORCEA", intitule: "MASTER Manager Business Unit",           niveau: "Niveau 7 (Bac+5)",  type: "Master",              voieAcces: "Apprentissage & Formation continue", secteurs: "Management, Commerce", metiers: "Manager BU", dureeMois: 24 },

  // PNFB — Bâtiment & Propreté
  { entiteCode: "PNFB", intitule: "TP Peintre Décorateur",                   niveau: "Niveau 3 (CAP)",    type: "Titre Professionnel", voieAcces: "Apprentissage & Formation continue", secteurs: "Bâtiment, Peinture", metiers: "Peintre décorateur", dureeMois: 12 },
  { entiteCode: "PNFB", intitule: "TP Électricien du Bâtiment",              niveau: "Niveau 3 (CAP)",    type: "Titre Professionnel", voieAcces: "Apprentissage & Formation continue", secteurs: "Bâtiment, Électricité", metiers: "Électricien", dureeMois: 12 },
  { entiteCode: "PNFB", intitule: "TP Maçon",                                niveau: "Niveau 3 (CAP)",    type: "Titre Professionnel", voieAcces: "Apprentissage & Formation continue", secteurs: "Bâtiment, Maçonnerie", metiers: "Maçon", dureeMois: 12 },
  { entiteCode: "PNFB", intitule: "TP Agent de Propreté et d'Hygiène",       niveau: "Niveau 3 (CAP)",    type: "Titre Professionnel", voieAcces: "Apprentissage & Formation continue", secteurs: "Propreté, Hygiène", metiers: "Agent de propreté", dureeMois: 12 },

  // PBA — Petite Enfance & Esthétique
  { entiteCode: "PBA",  intitule: "CAP Accompagnant Éducatif Petite Enfance", niveau: "Niveau 3 (CAP)",   type: "CAP",                 voieAcces: "Apprentissage & Formation continue", secteurs: "Petite enfance", metiers: "AEPE, ATSEM, assistante maternelle", dureeMois: 12 },
  { entiteCode: "PBA",  intitule: "CAP Esthétique Cosmétique Parfumerie",    niveau: "Niveau 3 (CAP)",    type: "CAP",                 voieAcces: "Apprentissage & Formation continue", secteurs: "Esthétique, Cosmétique", metiers: "Esthéticienne, conseillère beauté", dureeMois: 12 },
];

// FORMATIONS CONTINUES ALIOS
const FORMATIONS_CONTINUES: FormationSeed[] = [
  { entiteCode: "ALIOS", intitule: "Excel Avancé - Niveau Expert",          niveau: "Sans niveau", type: "Formation continue", voieAcces: "Formation continue (CPF, plan dev)", secteurs: "Bureautique", metiers: "Tous métiers", dureeMois: 1, montant: 1490 },
  { entiteCode: "ALIOS", intitule: "Management d'équipe niveau 1",          niveau: "Sans niveau", type: "Formation continue", voieAcces: "Formation continue (CPF, plan dev)", secteurs: "Management", metiers: "Manager", dureeMois: 1, montant: 1890 },
  { entiteCode: "ALIOS", intitule: "Anglais professionnel B1 - TOEIC",      niveau: "Sans niveau", type: "Formation continue", voieAcces: "Formation continue (CPF)", secteurs: "Langues", metiers: "Tous métiers", dureeMois: 2, montant: 1290 },
  { entiteCode: "ALIOS", intitule: "Anglais professionnel B2 - TOEIC",      niveau: "Sans niveau", type: "Formation continue", voieAcces: "Formation continue (CPF)", secteurs: "Langues", metiers: "Tous métiers", dureeMois: 2, montant: 1490 },
  { entiteCode: "ALIOS", intitule: "Habilitation électrique BR/B1V",        niveau: "Sans niveau", type: "Formation continue", voieAcces: "Formation continue (POEI, plan dev)", secteurs: "Bâtiment, Sécurité", metiers: "Électricien, agent maintenance", dureeMois: 1, montant: 690 },
  { entiteCode: "ALIOS", intitule: "SST - Sauveteur Secouriste du Travail", niveau: "Sans niveau", type: "Formation continue", voieAcces: "Formation continue (plan dev)", secteurs: "Sécurité", metiers: "Tous métiers", dureeMois: 1, montant: 450 },
  { entiteCode: "ALIOS", intitule: "Gestes et postures",                    niveau: "Sans niveau", type: "Formation continue", voieAcces: "Formation continue (plan dev)", secteurs: "Sécurité", metiers: "Tous métiers", dureeMois: 1, montant: 350 },
  { entiteCode: "ALIOS", intitule: "Comptabilité générale - Débutant",      niveau: "Sans niveau", type: "Formation continue", voieAcces: "Formation continue (CPF)", secteurs: "Comptabilité", metiers: "Assistant comptable", dureeMois: 2, montant: 1890 },
  { entiteCode: "ALIOS", intitule: "Communication digitale & réseaux sociaux", niveau: "Sans niveau", type: "Formation continue", voieAcces: "Formation continue (CPF)", secteurs: "Marketing, Communication", metiers: "Community manager", dureeMois: 1, montant: 1690 },
  { entiteCode: "ALIOS", intitule: "Reconversion - Bilan de compétences",   niveau: "Sans niveau", type: "Formation continue", voieAcces: "Formation continue (CPF, CPF TP)", secteurs: "Accompagnement", metiers: "Tous métiers", dureeMois: 1, montant: 1990 },
  { entiteCode: "ALIOS", intitule: "Préparation au permis cariste CACES R489", niveau: "Sans niveau", type: "Formation continue", voieAcces: "Formation continue (POEI, AIF)", secteurs: "Logistique", metiers: "Cariste", dureeMois: 1, montant: 890 },
  { entiteCode: "ALIOS", intitule: "Initiation à la programmation Python",  niveau: "Sans niveau", type: "Formation continue", voieAcces: "Formation continue (CPF)", secteurs: "Numérique", metiers: "Développeur junior", dureeMois: 2, montant: 2490 },
  { entiteCode: "ALIOS", intitule: "Création d'entreprise & micro-entreprise", niveau: "Sans niveau", type: "Formation continue", voieAcces: "Formation continue (AIF, CPF)", secteurs: "Entrepreneuriat", metiers: "Auto-entrepreneur", dureeMois: 1, montant: 1490 },
];

CATALOGUE.push(...FORMATIONS_CONTINUES);
