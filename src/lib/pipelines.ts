// Pipelines du CDC V2.0
// Section 6.1 : pipeline Candidat (19 étapes)
// Section 7.1 : pipeline Entreprise (17 étapes)

export type PipelineEtape = {
  numero: number;
  cle: string;
  libelle: string;
  description: string;
  mode: "auto" | "semi";
};

export const PIPELINE_CANDIDAT: PipelineEtape[] = [
  { numero: 1,  cle: "candidature_recue",         libelle: "Candidature reçue",         description: "Dépôt via ATS, formulaire web ou prescription", mode: "auto" },
  { numero: 2,  cle: "bienvenue",                 libelle: "Bienvenue + fiche besoin",   description: "Email auto avec lien fiche de renseignement",   mode: "auto" },
  { numero: 3,  cle: "fiche_complete",            libelle: "Fiche renseignement complétée", description: "Formulaire retourné → notification commerciale", mode: "auto" },
  { numero: 4,  cle: "convocation_entretien",     libelle: "Convocation entretien école", description: "Email auto pré-requis + test + entretien",      mode: "auto" },
  { numero: 5,  cle: "test_prerequis",            libelle: "Évaluation pré-requis",       description: "Test dématérialisé en ligne",                   mode: "semi" },
  { numero: 6,  cle: "test_positionnement",       libelle: "Test de positionnement",      description: "Présentiel à l'école, score saisi dans le CRM", mode: "semi" },
  { numero: 7,  cle: "entretien_motivation",      libelle: "Entretien de motivation",     description: "Présentiel, grille d'évaluation",              mode: "semi" },
  { numero: 8,  cle: "eligible_placement",        libelle: "Éligible au placement",       description: "Fiche d'adaptation générée auto",              mode: "auto" },
  { numero: 9,  cle: "matching_en_cours",         libelle: "Matching en cours",           description: "Agent IA lance le matching multicritères",     mode: "auto" },
  { numero: 10, cle: "profil_envoye_entreprise",  libelle: "Profil envoyé à l'entreprise", description: "Email auto avec profil anonymisé",            mode: "auto" },
  { numero: 11, cle: "entretien_entreprise_planifie", libelle: "Entretien entreprise planifié", description: "Convocation + rappel J-2 + guide",       mode: "auto" },
  { numero: 12, cle: "entretien_entreprise_realise",  libelle: "Entretien entreprise réalisé", description: "Feedback commercial sous 48h",            mode: "semi" },
  { numero: 13, cle: "candidat_retenu",           libelle: "Candidat retenu / placé",     description: "Félicitations + création dossier ERP",         mode: "auto" },
  { numero: 14, cle: "contrat_signe",             libelle: "Contrat signé",               description: "Contrat + CERFA via Yousign",                  mode: "auto" },
  { numero: 15, cle: "en_formation",              libelle: "En formation",                description: "Suivi pédagogique depuis ERP",                 mode: "auto" },
  { numero: 16, cle: "fin_formation",             libelle: "Fin de formation",            description: "Convocation examen + enquête + attestation",   mode: "auto" },
  { numero: 17, cle: "resultat_examen",           libelle: "Résultat examen",             description: "Réussite → avis Google / Échec → module compl.", mode: "semi" },
  { numero: 18, cle: "enquete_froid",             libelle: "Enquête à froid (3-6 mois)",  description: "Vente croisée formation supérieure",           mode: "auto" },
  { numero: 19, cle: "fidelisation",              libelle: "Fidélisation & upsell",       description: "Invitations Job Dating + newsletter Alumni",   mode: "auto" },
];

export const PIPELINE_ENTREPRISE: PipelineEtape[] = [
  { numero: 1,  cle: "annonce_detectee",          libelle: "Annonce détectée / Besoin identifié", description: "Détection automatique des offres d'alternance", mode: "auto" },
  { numero: 2,  cle: "contact_trouve",            libelle: "Contact trouvé (enrichissement)",     description: "Recherche auto du contact RH/dirigeant",         mode: "auto" },
  { numero: 3,  cle: "prospection_envoyee",       libelle: "Email de prospection envoyé",         description: "Email auto personnalisé + lien fiche besoin",    mode: "auto" },
  { numero: 4,  cle: "fiche_besoin_envoyee",      libelle: "Fiche besoin envoyée",                description: "Formulaire fiche besoin transmis",               mode: "auto" },
  { numero: 5,  cle: "fiche_besoin_complete",     libelle: "Fiche besoin complétée",              description: "Retour formulaire → CRM mis à jour",             mode: "auto" },
  { numero: 6,  cle: "notif_commercial_appel",    libelle: "Notification commerciale + appel",    description: "Tâche d'appel créée + script suggéré",           mode: "semi" },
  { numero: 7,  cle: "matching_en_cours",         libelle: "Matching en cours",                   description: "Sélection des 3 meilleurs profils",              mode: "auto" },
  { numero: 8,  cle: "profils_envoyes",           libelle: "Profils envoyés à l'entreprise",      description: "Email auto avec profils anonymisés",             mode: "auto" },
  { numero: 9,  cle: "entreprise_interessee",     libelle: "Entreprise intéressée / Entretien accepté", description: "Planification entretien",                 mode: "semi" },
  { numero: 10, cle: "entretien_planifie",        libelle: "Entretien planifié",                  description: "Confirmation + rappels J-7 / J-2",               mode: "auto" },
  { numero: 11, cle: "entretien_realise",         libelle: "Entretien réalisé — Attente retour",  description: "Relance commerciale sous 24h",                   mode: "semi" },
  { numero: 12, cle: "apprenant_retenu",          libelle: "Apprenant retenu par l'entreprise",   description: "Création dossier ERP + demande maître app.",     mode: "auto" },
  { numero: 13, cle: "infos_complementaires",     libelle: "Demande informations complémentaires", description: "Maître d'apprentissage + CERFA",                mode: "auto" },
  { numero: 14, cle: "contrat_envoye_signature",  libelle: "Contrat envoyé pour signature",       description: "Yousign + relance auto si non signé 5j",         mode: "auto" },
  { numero: 15, cle: "partenaire_actif",          libelle: "Contrat signé — Partenaire actif",    description: "Archivage ERP + tag partenaire actif",           mode: "auto" },
  { numero: 16, cle: "suivi_renouvellement",      libelle: "Suivi en cours / Renouvellement",     description: "Alertes échéances + proposition renouvellement", mode: "auto" },
  { numero: 17, cle: "upsell_developpement",      libelle: "Upsell & développement compte",       description: "Proposition niveau supérieur + Job Dating",      mode: "auto" },
];

// CDC section 9 : checklist documentaire 21 étapes
export const CHECKLIST_DOCUMENTS = [
  { numero: 1,  periode: "pre_formation", nom: "Fiche candidature",            source: "CRM" },
  { numero: 2,  periode: "pre_formation", nom: "Fiche besoin candidat",        source: "CRM" },
  { numero: 3,  periode: "pre_formation", nom: "Évaluation des pré-requis",    source: "CRM" },
  { numero: 4,  periode: "pre_formation", nom: "Test de positionnement",       source: "ERP" },
  { numero: 5,  periode: "pre_formation", nom: "Bilan de positionnement",      source: "ERP" },
  { numero: 6,  periode: "pre_formation", nom: "Fiche d'adaptation",           source: "ERP" },
  { numero: 7,  periode: "pre_formation", nom: "Convention de formation / CERFA", source: "ERP" },
  { numero: 8,  periode: "pre_formation", nom: "Convocation à la formation",   source: "CRM" },
  { numero: 9,  periode: "entree",        nom: "Attestation d'entrée en formation", source: "ERP" },
  { numero: 10, periode: "entree",        nom: "Certificat de scolarité",      source: "ERP" },
  { numero: 11, periode: "entree",        nom: "Attestation remise de matériel", source: "ERP" },
  { numero: 12, periode: "entree",        nom: "Livret d'accueil",             source: "ERP" },
  { numero: 13, periode: "entree",        nom: "Règlement intérieur",          source: "ERP" },
  { numero: 14, periode: "entree",        nom: "Programme de formation",       source: "ERP" },
  { numero: 15, periode: "entree",        nom: "Livret d'apprentissage",       source: "ERP" },
  { numero: 16, periode: "entree",        nom: "Attestation sur l'honneur entrée", source: "ERP" },
  { numero: 17, periode: "pendant",       nom: "Modalités d'examen",           source: "ERP" },
  { numero: 18, periode: "fin",           nom: "Convocation à l'examen",       source: "ERP" },
  { numero: 19, periode: "fin",           nom: "Enquête de satisfaction",      source: "CRM" },
  { numero: 20, periode: "fin",           nom: "Attestation de fin de formation", source: "ERP" },
  { numero: 21, periode: "fin",           nom: "Attestation sur l'honneur fin", source: "ERP" },
];
