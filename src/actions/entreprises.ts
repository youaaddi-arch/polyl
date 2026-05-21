"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const str = (fd: FormData, k: string) => {
  const v = String(fd.get(k) || "").trim();
  return v || null;
};
const num = (fd: FormData, k: string) => {
  const v = Number(fd.get(k) || 0);
  return Number.isFinite(v) && v !== 0 ? v : null;
};
const bool = (fd: FormData, k: string) => fd.get(k) === "true";
const date = (fd: FormData, k: string) => {
  const v = String(fd.get(k) || "");
  return v ? new Date(v) : null;
};

export async function creerEntreprise(formData: FormData) {
  const raisonSociale = str(formData, "raisonSociale");
  if (!raisonSociale) throw new Error("Raison sociale obligatoire");

  const entreprise = await prisma.entreprise.create({
    data: {
      raisonSociale,
      siret: str(formData, "siret"),
      siren: str(formData, "siren"),
      naf: str(formData, "naf"),
      numTVA: str(formData, "numTVA"),
      formeJuridique: str(formData, "formeJuridique"),
      capitalSocial: num(formData, "capitalSocial"),

      taille: str(formData, "taille"),
      effectif: num(formData, "effectif"),
      chiffreAffaires: num(formData, "chiffreAffaires"),
      secteur: str(formData, "secteur"),
      secteurDetail: str(formData, "secteurDetail"),
      persona: str(formData, "persona"),

      telephoneStandard: str(formData, "telephoneStandard"),
      email: str(formData, "email"),
      siteWeb: str(formData, "siteWeb"),
      linkedinUrl: str(formData, "linkedinUrl"),
      adresse: str(formData, "adresse"),
      complementAdresse: str(formData, "complementAdresse"),
      codePostal: str(formData, "codePostal"),
      ville: str(formData, "ville"),
      pays: str(formData, "pays") ?? "France",

      // Besoins recrutement
      rechercheAlternants: bool(formData, "rechercheAlternants"),
      rechercheCDI: bool(formData, "rechercheCDI"),
      rechercheCDD: bool(formData, "rechercheCDD"),
      rechercheStage: bool(formData, "rechercheStage"),
      rechercheFormationSalaries: bool(formData, "rechercheFormationSalaries"),
      typeAlternance: str(formData, "typeAlternance"),
      nbAlternantsRecherches: num(formData, "nbAlternantsRecherches"),
      nbCDIRecherches: num(formData, "nbCDIRecherches"),
      dateBesoinAlternance: date(formData, "dateBesoinAlternance"),
      niveauxRecherches: str(formData, "niveauxRecherches"),
      metiersRecherches: str(formData, "metiersRecherches"),

      // Conventions / OPCO
      conventionCollective: str(formData, "conventionCollective"),
      opcoRattache: str(formData, "opcoRattache"),
      accordOPCO: bool(formData, "accordOPCO"),
      accordTutorat: bool(formData, "accordTutorat"),

      // Contacts
      responsableRHNom: str(formData, "responsableRHNom"),
      responsableRHEmail: str(formData, "responsableRHEmail"),
      responsableRHTelephone: str(formData, "responsableRHTelephone"),
      dirigeantNom: str(formData, "dirigeantNom"),
      dirigeantEmail: str(formData, "dirigeantEmail"),

      // Source
      sourceDetection: str(formData, "sourceDetection"),
      urlOffre: str(formData, "urlOffre"),
      entiteId: str(formData, "entiteId"),
      commercialDedie: str(formData, "commercialDedie"),
      scorePotentiel: num(formData, "scorePotentiel"),

      derniereActivite: new Date(),
      etapePipeline: 1,
      statut: "prospect",
    },
  });

  // Crée automatiquement les Contacts à partir des dirigeants INSEE
  const dirigeantsJSON = String(formData.get("dirigeantsJSON") || "");
  if (dirigeantsJSON) {
    try {
      const dirigeants = JSON.parse(dirigeantsJSON) as { nom: string; prenom: string; qualite: string }[];
      for (const d of dirigeants) {
        if (!d.nom) continue;
        await prisma.contact.create({
          data: {
            nom: d.nom,
            prenom: d.prenom || "—",
            fonction: d.qualite || "Dirigeant",
            entrepriseId: entreprise.id,
          },
        });
      }
    } catch {}
  }

  // Crée automatiquement les Contacts depuis Hunter.io (RH / Formation cochés)
  const contactsHunterJSON = String(formData.get("contactsHunterJSON") || "");
  if (contactsHunterJSON) {
    try {
      const contacts = JSON.parse(contactsHunterJSON) as {
        email: string; prenom: string | null; nom: string | null;
        poste: string | null; service: string | null; telephone: string | null;
      }[];
      for (const c of contacts) {
        if (!c.email) continue;
        await prisma.contact.create({
          data: {
            nom: c.nom || c.email.split("@")[0],
            prenom: c.prenom || "—",
            email: c.email,
            telephone: c.telephone ?? undefined,
            fonction: c.poste || c.service || "Contact",
            entrepriseId: entreprise.id,
          },
        });
      }
    } catch {}
  }

  revalidatePath("/entreprises");
  redirect(`/entreprises/${entreprise.id}`);
}

export async function changerEtapeEntreprise(formData: FormData) {
  const id = String(formData.get("id") || "");
  const etape = Number(formData.get("etape") || 1);
  if (!id) throw new Error("id manquant");
  await prisma.entreprise.update({
    where: { id },
    data: {
      etapePipeline: etape,
      derniereActivite: new Date(),
      statut: etape >= 15 ? "partenaire_actif" : etape >= 6 ? "qualifie" : "prospect",
    },
  });
  revalidatePath("/entreprises");
  revalidatePath("/entreprises/pipeline");
  revalidatePath(`/entreprises/${id}`);
}
