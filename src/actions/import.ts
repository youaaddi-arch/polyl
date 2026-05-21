"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import * as XLSX from "xlsx";

// Mapping intelligent : alias acceptés → clé Prisma
// Permet d'importer des CSV avec des noms de colonnes variés
const ALIAS_CANDIDAT: Record<string, string> = {
  // Identité
  "prenom": "prenom", "prénom": "prenom", "first name": "prenom", "firstname": "prenom",
  "nom": "nom", "lastname": "nom", "last name": "nom", "famille": "nom", "name": "nom",
  "email": "email", "mail": "email", "courriel": "email", "e-mail": "email",
  "telephone": "telephone", "téléphone": "telephone", "tel": "telephone", "phone": "telephone", "mobile": "telephone", "portable": "telephone",
  "telephone2": "telephoneSecondaire", "tel secondaire": "telephoneSecondaire", "tel2": "telephoneSecondaire",
  "adresse": "adresse", "address": "adresse", "rue": "adresse",
  "ville": "ville", "city": "ville", "commune": "ville",
  "code postal": "codePostal", "cp": "codePostal", "codepostal": "codePostal", "zip": "codePostal", "postal code": "codePostal",
  "pays": "pays", "country": "pays",
  "date naissance": "dateNaissance", "datedenaissance": "dateNaissance", "naissance": "dateNaissance", "birthdate": "dateNaissance", "dob": "dateNaissance",
  "genre": "genre", "sexe": "genre", "gender": "genre",
  "nationalite": "nationalite", "nationalité": "nationalite",
  "linkedin": "linkedinUrl", "linkedinurl": "linkedinUrl", "url linkedin": "linkedinUrl",

  // Qualification
  "source": "sourceEntree", "source entree": "sourceEntree", "origine": "sourceEntree",
  "prescripteur": "prescripteur",
  "date candidature": "dateCandidature", "datecandidature": "dateCandidature",
  "statut lead": "statutLead", "statutlead": "statutLead", "lead status": "statutLead", "qualification": "statutLead",
  "score": "scoreLead", "score lead": "scoreLead",
  "persona": "persona",

  // Formation
  "niveau": "niveauActuel", "niveau actuel": "niveauActuel",
  "situation": "situation",
  "annee bac": "anneeBac", "année bac": "anneeBac", "anneebac": "anneeBac",
  "diplome": "diplomeActuel", "diplôme": "diplomeActuel",
  "type contrat": "typeContratSouhaite", "type contrat souhaite": "typeContratSouhaite", "type de contrat": "typeContratSouhaite",
  "experience pro": "experiencePro", "expérience": "experiencePro",

  // Financement
  "financement": "financementChoisi", "financement choisi": "financementChoisi",
  "montant financement": "montantFinancement",
  "opco": "opco",
  "numero opco": "numeroDossierOpco", "dossier opco": "numeroDossierOpco",

  // Mobilité
  "mobilite": "mobiliteGeo", "mobilité": "mobiliteGeo", "mobilite geo": "mobiliteGeo",
  "anglais": "niveauAnglais", "niveau anglais": "niveauAnglais", "english": "niveauAnglais",
  "permis": "permisB", "permis b": "permisB",
  "vehicule": "vehicule", "véhicule": "vehicule", "voiture": "vehicule",
  "handicap": "handicap", "rqth": "rqth",

  // Suivi
  "conseiller": "conseillerDedie", "conseiller dedie": "conseillerDedie",
  "notes": "notes", "remarques": "notes", "commentaire": "notes", "commentaires": "notes",
};

const ALIAS_ENTREPRISE: Record<string, string> = {
  "raison sociale": "raisonSociale", "raisonsociale": "raisonSociale", "nom": "raisonSociale", "entreprise": "raisonSociale", "company": "raisonSociale", "company name": "raisonSociale",
  "siret": "siret",
  "siren": "siren",
  "naf": "naf", "code naf": "naf", "ape": "naf", "code ape": "naf",
  "tva": "numTVA", "numero tva": "numTVA", "n° tva": "numTVA",
  "forme juridique": "formeJuridique", "statut juridique": "formeJuridique",
  "taille": "taille",
  "effectif": "effectif", "salaries": "effectif", "nb salaries": "effectif",
  "chiffre affaires": "chiffreAffaires", "ca": "chiffreAffaires", "chiffredaffaires": "chiffreAffaires",
  "capital": "capitalSocial", "capital social": "capitalSocial",
  "secteur": "secteur", "secteur activite": "secteur", "industry": "secteur",
  "secteur detail": "secteurDetail",
  "telephone": "telephoneStandard", "téléphone": "telephoneStandard", "tel": "telephoneStandard", "standard": "telephoneStandard", "phone": "telephoneStandard",
  "email": "email", "mail": "email",
  "site": "siteWeb", "site web": "siteWeb", "website": "siteWeb", "url": "siteWeb",
  "linkedin": "linkedinUrl",
  "adresse": "adresse", "address": "adresse",
  "ville": "ville", "city": "ville",
  "code postal": "codePostal", "cp": "codePostal", "zip": "codePostal",
  "pays": "pays", "country": "pays",

  // Besoins
  "recherche alternants": "rechercheAlternants", "alternants": "rechercheAlternants", "alternance": "rechercheAlternants",
  "recherche cdi": "rechercheCDI", "cdi": "rechercheCDI",
  "recherche cdd": "rechercheCDD", "cdd": "rechercheCDD",
  "stage": "rechercheStage",
  "formation salaries": "rechercheFormationSalaries", "formation continue salariés": "rechercheFormationSalaries",
  "type alternance": "typeAlternance",
  "nb alternants": "nbAlternantsRecherches",
  "nb cdi": "nbCDIRecherches",
  "metiers": "metiersRecherches", "métiers": "metiersRecherches",

  "convention": "conventionCollective", "convention collective": "conventionCollective",
  "opco": "opcoRattache",

  "rh nom": "responsableRHNom", "responsable rh": "responsableRHNom",
  "rh email": "responsableRHEmail", "email rh": "responsableRHEmail",
  "rh telephone": "responsableRHTelephone", "tel rh": "responsableRHTelephone",
  "dirigeant": "dirigeantNom", "dirigeant nom": "dirigeantNom",
  "dirigeant email": "dirigeantEmail",

  "source": "sourceDetection", "source detection": "sourceDetection",
  "url offre": "urlOffre",
  "commercial": "commercialDedie",
  "score": "scorePotentiel",
  "notes": "notes", "remarques": "notes",
};

function normalize(s: string) {
  return s.toLowerCase().trim().replace(/[_-]+/g, " ").replace(/\s+/g, " ");
}

function mapHeader(header: string, dico: Record<string, string>): string | null {
  const n = normalize(header);
  return dico[n] ?? null;
}

function parseCSV(text: string): { headers: string[]; rows: string[][] } {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return { headers: [], rows: [] };
  // Détection séparateur (virgule ou point-virgule)
  const sep = (lines[0].match(/;/g)?.length ?? 0) > (lines[0].match(/,/g)?.length ?? 0) ? ";" : ",";
  const headers = lines[0].split(sep).map((h) => h.trim().replace(/^"|"$/g, ""));
  const rows = lines.slice(1).map((line) => line.split(sep).map((v) => v.trim().replace(/^"|"$/g, "")));
  return { headers, rows };
}

async function parseXLSX(file: File): Promise<{ headers: string[]; rows: string[][] }> {
  const buf = await file.arrayBuffer();
  const wb = XLSX.read(buf, { type: "array", cellDates: true });
  const sheet = wb.Sheets[wb.SheetNames[0]];
  if (!sheet) return { headers: [], rows: [] };
  const matrix = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, raw: false, defval: "" });
  if (matrix.length < 2) return { headers: [], rows: [] };
  const headers = (matrix[0] as unknown[]).map((h) => String(h ?? "").trim());
  const rows = matrix.slice(1).map((r) => (r as unknown[]).map((v) => String(v ?? "").trim()));
  return { headers, rows };
}

function castValue(prismaKey: string, val: string): any {
  if (!val) return null;
  // Booléens
  const BOOL_KEYS = ["rechercheAlternants", "rechercheCDI", "rechercheCDD", "rechercheStage", "rechercheFormationSalaries", "accordOPCO", "accordTutorat", "permisB", "vehicule", "handicap", "rqth", "consentRgpd", "consentNewsletter", "consentSms", "consentAppel"];
  if (BOOL_KEYS.includes(prismaKey)) {
    const v = val.toLowerCase();
    return v === "true" || v === "oui" || v === "1" || v === "yes" || v === "vrai" || v === "x" || v === "✓";
  }
  // Nombres
  const NUM_KEYS = ["effectif", "chiffreAffaires", "capitalSocial", "scoreLead", "scorePotentiel", "anneeBac", "age", "montantFinancement", "nbAlternantsRecherches", "nbCDIRecherches"];
  if (NUM_KEYS.includes(prismaKey)) {
    const n = Number(val.replace(/[^0-9.-]/g, ""));
    return Number.isFinite(n) ? n : null;
  }
  // Dates
  const DATE_KEYS = ["dateNaissance", "dateCandidature", "dateBesoinAlternance", "dateRelance"];
  if (DATE_KEYS.includes(prismaKey)) {
    const d = new Date(val);
    return Number.isFinite(d.getTime()) ? d : null;
  }
  return val;
}

export async function importerCSV(formData: FormData) {
  const objet = String(formData.get("objet") || "candidats");
  const file = formData.get("fichier") as File | null;
  if (!file) throw new Error("Fichier obligatoire");

  if (objet === "alternance") return importerAlternance(file);

  const ext = file.name.toLowerCase().split(".").pop() ?? "";
  const isExcel = ext === "xlsx" || ext === "xls" || file.type.includes("spreadsheet");
  const { headers, rows } = isExcel ? await parseXLSX(file) : parseCSV(await file.text());
  if (rows.length === 0) throw new Error("Fichier vide ou invalide");

  const dico = objet === "candidats" ? ALIAS_CANDIDAT : ALIAS_ENTREPRISE;
  // Compose la table de correspondance "index colonne → champ Prisma"
  const mapping: { index: number; prismaKey: string }[] = [];
  const unmapped: string[] = [];
  headers.forEach((h, i) => {
    const k = mapHeader(h, dico);
    if (k) mapping.push({ index: i, prismaKey: k });
    else unmapped.push(h);
  });

  let crees = 0;
  let erreurs = 0;

  for (const row of rows) {
    try {
      const data: any = {};
      for (const m of mapping) {
        const v = castValue(m.prismaKey, row[m.index] ?? "");
        if (v !== null) data[m.prismaKey] = v;
      }

      if (objet === "candidats") {
        if (!data.prenom || !data.nom) { erreurs++; continue; }
        await prisma.candidat.create({
          data: {
            ...data,
            sourceEntree: data.sourceEntree ?? "Import CSV",
            statutLead: data.statutLead ?? "froid",
            etapePipeline: 1,
            statut: "nouveau",
            dateCandidature: data.dateCandidature ?? new Date(),
            derniereActivite: new Date(),
          },
        });
      } else if (objet === "entreprises") {
        if (!data.raisonSociale) { erreurs++; continue; }
        await prisma.entreprise.create({
          data: {
            ...data,
            sourceDetection: data.sourceDetection ?? "Import CSV",
            etapePipeline: 1,
            statut: "prospect",
            derniereActivite: new Date(),
          },
        });
      }
      crees++;
    } catch (e) {
      erreurs++;
    }
  }

  await prisma.importLog.create({
    data: {
      objet,
      nomFichier: file.name,
      nbLignes: rows.length,
      nbCrees: crees,
      nbErreurs: erreurs,
      statut: "termine",
      detail: unmapped.length > 0 ? `Colonnes ignorées : ${unmapped.join(", ")}` : null,
    } as any,
  });

  revalidatePath("/imports");
  revalidatePath(`/${objet}`);
}

// ============================================================
// IMPORT CONTRATS ALTERNANCE
// Chaque ligne = candidat + entreprise + tuteur + contrat
// Détecte les colonnes par position autour de "ENTREPRISE" / "NOM TUTEUR"
// ============================================================
function normSiret(v: string): string | null {
  const digits = v.replace(/\D/g, "");
  return digits.length === 14 ? digits : digits.length > 0 && digits.length <= 14 ? digits.padStart(14, "0") : null;
}

function parseDate(v: string): Date | null {
  if (!v) return null;
  const d = new Date(v);
  if (Number.isFinite(d.getTime()) && d.getFullYear() > 1950 && d.getFullYear() < 2100) return d;
  // Format dd/mm/yyyy
  const m = v.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/);
  if (m) {
    const yr = m[3].length === 2 ? 2000 + Number(m[3]) : Number(m[3]);
    const dt = new Date(yr, Number(m[2]) - 1, Number(m[1]));
    return Number.isFinite(dt.getTime()) ? dt : null;
  }
  return null;
}

async function importerAlternance(file: File) {
  const ext = file.name.toLowerCase().split(".").pop() ?? "";
  const isExcel = ext === "xlsx" || ext === "xls" || file.type.includes("spreadsheet");
  const { headers, rows } = isExcel ? await parseXLSX(file) : parseCSV(await file.text());
  if (rows.length === 0) throw new Error("Fichier vide ou invalide");

  // Détection des bornes via les titres-clés
  const norm = (s: string) => normalize(s);
  const idxEntreprise = headers.findIndex((h) => norm(h) === "entreprise");
  const idxTuteur = headers.findIndex((h) => norm(h).includes("nom tuteur"));
  const idxSiret = headers.findIndex((h) => norm(h) === "siret");
  const idxNom = headers.findIndex((h) => norm(h) === "nom");
  const idxPrenom = headers.findIndex((h) => norm(h) === "prenom" || norm(h) === "prénom");
  const idxStatut = headers.findIndex((h) => norm(h) === "statut");
  const idxOpcoDossier = headers.findIndex((h) => norm(h).includes("dossier opco"));
  const idxNumSecu = headers.findIndex((h) => norm(h).includes("num secu stagiaire"));
  const idxDernierDiplome = headers.findIndex((h) => norm(h).includes("dernier dipl"));
  const idxDateFormation = headers.findIndex((h) => norm(h).includes("date demarrage formation"));
  const idxDateEnvoi = headers.findIndex((h) => norm(h).includes("envoi contrat"));
  const idxDateRetour = headers.findIndex((h) => norm(h).includes("retour contrat"));
  const idxDateContrat = headers.findIndex((h) => norm(h).includes("date demarrage contrat"));
  const idxOpcoEnt = headers.findIndex((h) => norm(h) === "opco");
  const idxContratUrl = headers.findIndex((h) => norm(h) === "contrats");
  // Colonne "AFFECTATION PROMO REELLE" ou colonne vide juste après DATE DEMARRAGE FORMATION
  let idxPromo = headers.findIndex((h) => norm(h).includes("affectation promo") || norm(h).includes("promo reelle"));
  if (idxPromo < 0 && idxDateFormation >= 0) idxPromo = idxDateFormation + 1;

  // Map code promo → intitulé formation (catalogue PNBS/DBS)
  function detecterFormation(code: string): string | null {
    const c = code.toUpperCase().replace(/\s+/g, "");
    if (/^BACH\d*/.test(c) || c.includes("BACHELOR") || c.includes("REM")) return "TP Responsable d'Établissement Marchand";
    if (c.startsWith("NTC") || c.includes("NEGOCIATEUR") || c.includes("TECHNICO")) return "TP Négociateur Technico-Commercial";
    if (c === "CC" || /^CC\d/.test(c) || c.includes("CONSEILLER")) return "TP Conseiller Commercial";
    if (c.includes("MASTER") || c.includes("MBU") || c.includes("MANAGER BUSINESS")) return "MASTER Manager Business Unit";
    return null;
  }

  // Pré-charge les formations PNBS pour matcher rapidement
  const entitePNBS = await prisma.entite.findUnique({ where: { code: "PNBS" } });
  const formationsCache: Map<string, string> = new Map();
  if (entitePNBS) {
    const formations = await prisma.formation.findMany({ where: { entiteId: entitePNBS.id } });
    for (const f of formations) formationsCache.set(f.intitule, f.id);
  }

  if (idxEntreprise < 0 || idxNom < 0 || idxPrenom < 0) {
    throw new Error("Colonnes minimales manquantes (NOM, Prenom, ENTREPRISE)");
  }

  // Sous-colonnes candidat : recherche dans [0, idxEntreprise[
  const findIn = (re: RegExp, from = 0, to = headers.length) => {
    for (let i = from; i < to; i++) if (re.test(norm(headers[i]))) return i;
    return -1;
  };
  const idxTelCand = findIn(/^tel$/, 0, idxEntreprise);
  const idxMailCand = findIn(/^mail$/, 0, idxEntreprise);
  const idxAdrCand = findIn(/^adresse$/, 0, idxEntreprise);
  // CP candidat = colonne sans titre juste après adresse, on prend les chiffres
  const idxVilleCand = findIn(/^ville$/, 0, idxEntreprise);
  const idxDateNaiss = idxMailCand >= 0 ? idxMailCand + 1 : -1; // date naissance = col après mail (vu dans le fichier)

  // Sous-colonnes entreprise : entre idxEntreprise et idxTuteur (exclu)
  const limitEnt = idxTuteur >= 0 ? idxTuteur : headers.length;
  const idxTelEnt = findIn(/^tel$/, idxEntreprise, limitEnt);
  const idxMailEnt = findIn(/^mail$/, idxEntreprise, limitEnt);
  const idxAdrEnt = findIn(/^adresse$/, idxEntreprise, limitEnt);
  const idxVilleEnt = findIn(/^ville$/, idxEntreprise, limitEnt);

  // Tuteur
  const idxPrenomTut = findIn(/prenom tut|^prenom$/, idxTuteur, headers.length);
  const idxMailTut = findIn(/mail tuteur|^mail$/, idxTuteur, headers.length);

  let candidatsCrees = 0, entreprisesCreees = 0, contactsCrees = 0, contratsCrees = 0, dealsCrees = 0;
  let rejNomVide = 0, rejPrenomVide = 0, exceptions = 0;
  const entrepriseCache = new Map<string, string>(); // SIRET ou nom normalisé → id

  // Pipeline apprentissage pour les deals
  const pipelineApp = await prisma.dealPipeline.findFirst({ where: { nom: { contains: "Apprentissage" } } });

  const STATUT_MAP: Record<string, string> = {
    "accorde": "actif", "accordé": "actif",
    "rupture": "termine",
    "solde": "termine", "soldé": "termine",
    "envoye": "envoye", "envoyé": "envoye",
    "signe": "signe", "signé": "signe",
  };

  const get = (row: string[], i: number): string => (i >= 0 ? (row[i] ?? "").toString().trim() : "");

  for (const row of rows) {
    try {
      const nom = get(row, idxNom);
      const prenom = get(row, idxPrenom);
      const raison = get(row, idxEntreprise);
      if (!nom) { rejNomVide++; continue; }
      if (!prenom) { rejPrenomVide++; continue; }

      // 1) ENTREPRISE (dédupe par SIRET, sinon par nom) — optionnelle
      let entrepriseId: string | undefined;
      if (raison) {
        const siret = normSiret(get(row, idxSiret));
        const cacheKey = siret ?? raison.toLowerCase().trim();
        entrepriseId = entrepriseCache.get(cacheKey);
        if (!entrepriseId) {
          const existante = siret ? await prisma.entreprise.findFirst({ where: { siret } }) : await prisma.entreprise.findFirst({ where: { raisonSociale: raison } });
          if (existante) {
            entrepriseId = existante.id;
          } else {
            const e = await prisma.entreprise.create({
              data: {
                raisonSociale: raison,
                siret: siret ?? undefined,
                siren: siret?.substring(0, 9),
                opcoRattache: get(row, idxOpcoEnt) || null,
                adresse: get(row, idxAdrEnt) || null,
                ville: get(row, idxVilleEnt) || null,
                telephoneStandard: get(row, idxTelEnt) || null,
                email: get(row, idxMailEnt) || null,
                statut: "partenaire_actif",
                etapePipeline: 15,
                sourceDetection: "Import alternance",
                accordOPCO: true,
                rechercheAlternants: true,
                derniereActivite: new Date(),
              },
            });
            entrepriseId = e.id;
            entreprisesCreees++;
          }
          entrepriseCache.set(cacheKey, entrepriseId);
        }
      }

      // 2) CANDIDAT
      const dateNaiss = parseDate(get(row, idxDateNaiss));
      const dateFormation = parseDate(get(row, idxDateFormation));
      const numSecu = get(row, idxNumSecu);
      const statutRaw = get(row, idxStatut).toLowerCase();
      const statutContrat = STATUT_MAP[statutRaw] ?? "brouillon";

      // Détection formation visée depuis code promo
      const codePromo = get(row, idxPromo);
      const intituleFormation = detecterFormation(codePromo);
      const formationId = intituleFormation ? formationsCache.get(intituleFormation) ?? null : null;

      const candidat = await prisma.candidat.create({
        data: {
          nom,
          prenom,
          telephone: get(row, idxTelCand) || null,
          email: get(row, idxMailCand) || null,
          adresse: get(row, idxAdrCand) || null,
          ville: get(row, idxVilleCand) || null,
          dateNaissance: dateNaiss,
          diplomeActuel: get(row, idxDernierDiplome) || null,
          numeroDossierOpco: get(row, idxOpcoDossier) || null,
          formationId,
          entiteId: entitePNBS?.id,
          societeMatcheeId: entrepriseId,
          sourceEntree: "Import alternance PNBS",
          statutLead: statutRaw === "accorde" || statutRaw === "accordé" ? "client" : statutRaw === "rupture" ? "perdu" : "chaud",
          scoreLead: 100,
          etapePipeline: statutRaw === "accorde" || statutRaw === "accordé" ? 9 : 6,
          statut: statutRaw === "rupture" ? "perdu" : "place",
          typeContratSouhaite: "apprentissage",
          dateCandidature: dateFormation ?? new Date(),
          derniereActivite: new Date(),
          notes: [numSecu ? `N° SS : ${numSecu}` : null, codePromo ? `Promo : ${codePromo}` : null].filter(Boolean).join("\n") || undefined,
          consentRgpd: true,
        },
      });
      candidatsCrees++;

      // 3) CONTACT TUTEUR (uniquement si entreprise existe)
      const nomTut = get(row, idxTuteur);
      const prenomTut = get(row, idxPrenomTut);
      const mailTut = get(row, idxMailTut);
      let contactId: string | null = null;
      if (entrepriseId && nomTut) {
        const c = await prisma.contact.create({
          data: {
            nom: nomTut,
            prenom: prenomTut || "—",
            email: mailTut || null,
            fonction: "Maître d'apprentissage",
            estMaitreApp: true,
            entrepriseId,
          },
        });
        contactId = c.id;
        contactsCrees++;
      }

      // 4) CONTRAT + DEAL (uniquement si entreprise existe)
      if (entrepriseId) {
        const dateDebut = parseDate(get(row, idxDateContrat)) ?? dateFormation ?? new Date();
        const dateFin = new Date(dateDebut);
        dateFin.setMonth(dateFin.getMonth() + 12);
        await prisma.contrat.create({
          data: {
            type: "apprentissage",
            dateDebut,
            dateFin,
            opco: get(row, idxOpcoEnt) || null,
            numeroCERFA: get(row, idxOpcoDossier) || null,
            statut: statutContrat,
            candidatId: candidat.id,
            entrepriseId,
            maitreAppContactId: contactId ?? undefined,
          },
        });
        contratsCrees++;

        // DEAL / OPPORTUNITÉ (= une candidature placée)
        const estGagne = statutRaw === "accorde" || statutRaw === "accordé";
        const estPerdu = statutRaw === "rupture";
        await prisma.deal.create({
          data: {
            titre: `Apprentissage — ${prenom} ${nom} chez ${raison}`,
            type: "apprentissage",
            montant: 9500,
            probabilite: estGagne ? 100 : estPerdu ? 0 : 80,
            dateOuverture: dateFormation ?? new Date(),
            dateGagne: estGagne ? (dateDebut ?? new Date()) : null,
            dateCloture: estPerdu ? new Date() : null,
            ownerName: "Import alternance",
            centreCode: "PNBS",
            pipelineId: pipelineApp?.id ?? null,
            etapeCle: estGagne ? "entree_formation" : estPerdu ? "perdu" : "contrat_accorde",
            statut: estGagne ? "gagne" : estPerdu ? "perdu" : "ouverte",
            candidatId: candidat.id,
            entrepriseId,
            formationId: formationId ?? undefined,
          },
        });
        dealsCrees++;
      }

      // 5) Activite (timeline)
      const urlDrive = get(row, idxContratUrl);
      await prisma.activite.create({
        data: {
          type: "document",
          titre: `Contrat alternance ${statutRaw.toUpperCase() || "importé"}${raison ? " — " + raison : ""}`,
          contenu: urlDrive ? `Lien Drive du contrat : ${urlDrive}` : null,
          auteur: "Import alternance",
          candidatId: candidat.id,
          entrepriseId,
        },
      });
    } catch (e) {
      exceptions++;
    }
  }

  const totalErreurs = rejNomVide + rejPrenomVide + exceptions;
  await prisma.importLog.create({
    data: {
      objet: "alternance",
      nomFichier: file.name,
      nbLignes: rows.length,
      nbCrees: candidatsCrees,
      nbErreurs: totalErreurs,
      statut: "termine",
      detail: `${candidatsCrees} candidats · ${entreprisesCreees} entreprises · ${contactsCrees} tuteurs · ${contratsCrees} contrats · ${dealsCrees} opportunités | Rejets : NOM vide ${rejNomVide}, Prenom vide ${rejPrenomVide}, exceptions ${exceptions}`,
    } as any,
  });

  revalidatePath("/imports");
  revalidatePath("/candidats");
  revalidatePath("/entreprises");
}
