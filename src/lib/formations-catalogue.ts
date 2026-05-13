// Catalogue formations - CDC section 2.1
// Source : pages 4-6 du cahier des charges V2.0

export type FormationSeed = {
  entiteCode: string;
  intitule: string;
  niveau: string;
  type: string;
  voieAcces: string;
  secteurs?: string;
  metiers?: string;
  dureeMois?: number;
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
