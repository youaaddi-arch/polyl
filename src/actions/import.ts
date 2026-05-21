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
