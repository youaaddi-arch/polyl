// CDC section 1.1 : 6 entités du groupe + ALIOS
export const ENTITES = [
  { code: "PNFF",  nom: "PNFF",       specialite: "Formations Hôtellerie-Restauration", ville: "Paris / Île-de-France" },
  { code: "DBS",   nom: "DBS Paris",  specialite: "Commerce, Négociation, Management", ville: "Province" },
  { code: "PNBS",  nom: "PNBS Paris", specialite: "Commerce, Négociation, Management", ville: "National" },
  { code: "ORCEA", nom: "ORCEA",      specialite: "Commerce, Négociation, Management", ville: "Amiens" },
  { code: "PNFB",  nom: "PNFB Paris", specialite: "Bâtiment, Peinture, Électricité, Maçonnerie, Propreté", ville: "Paris" },
  { code: "PBA",   nom: "PBA Paris",  specialite: "Petite Enfance, Esthétique Cosmétique", ville: "Paris" },
  { code: "ALIOS", nom: "ALIOS",      specialite: "Formation continue & reconversion professionnelle", ville: "Paris" },
] as const;

export type EntiteCode = (typeof ENTITES)[number]["code"];

export const PERSONAS_CANDIDAT = [
  { code: "C1", nom: "Le Jeune en Reconversion / Primo-entrant", description: "16-25 ans | Sans expérience" },
  { code: "C2", nom: "Le Demandeur d'Emploi en Montée en Compétences", description: "25-45 ans | Expérience secteur" },
  { code: "C3", nom: "L'Ambitieux Diplômant (Bac+2 à Bac+5)", description: "20-30 ans | Vise diplôme supérieur" },
] as const;

export const PERSONAS_ENTREPRISE = [
  { code: "E1", nom: "La PME en Croissance", description: "10-50 salariés | Recrutement régulier" },
  { code: "E2", nom: "L'Entreprise Partenaire Récurrente", description: "1-5 alternants/an | Relation établie" },
  { code: "E3", nom: "Le Grand Compte / ETI", description: "50-500 salariés | Service RH dédié" },
] as const;
