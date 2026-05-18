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

export async function creerCandidat(formData: FormData) {
  const prenom = str(formData, "prenom");
  const nom = str(formData, "nom");
  if (!prenom || !nom) throw new Error("Prénom et nom obligatoires");

  const candidat = await prisma.candidat.create({
    data: {
      prenom,
      nom,
      email: str(formData, "email"),
      telephone: str(formData, "telephone"),
      telephoneSecondaire: str(formData, "telephoneSecondaire"),
      adresse: str(formData, "adresse"),
      ville: str(formData, "ville"),
      codePostal: str(formData, "codePostal"),
      pays: str(formData, "pays") ?? "France",
      dateNaissance: date(formData, "dateNaissance"),
      genre: str(formData, "genre"),
      nationalite: str(formData, "nationalite"),
      linkedinUrl: str(formData, "linkedinUrl"),

      // Qualification
      sourceEntree: str(formData, "sourceEntree"),
      prescripteur: str(formData, "prescripteur"),
      dateCandidature: date(formData, "dateCandidature") ?? new Date(),
      derniereActivite: new Date(),
      statutLead: str(formData, "statutLead") ?? "froid",
      scoreLead: num(formData, "scoreLead") ?? 0,
      persona: str(formData, "persona"),

      // Formation
      formationId: str(formData, "formationId"),
      entiteId: str(formData, "entiteId"),
      niveauActuel: str(formData, "niveauActuel"),
      situation: str(formData, "situation"),
      experiencePro: str(formData, "experiencePro"),
      diplomeActuel: str(formData, "diplomeActuel"),
      anneeBac: num(formData, "anneeBac"),
      typeContratSouhaite: str(formData, "typeContratSouhaite"),

      // Financement
      financementChoisi: str(formData, "financementChoisi"),
      montantFinancement: num(formData, "montantFinancement"),
      opco: str(formData, "opco"),
      numeroDossierOpco: str(formData, "numeroDossierOpco"),

      // Société matchée
      societeMatcheeId: str(formData, "societeMatcheeId"),

      // Mobilité
      mobiliteGeo: str(formData, "mobiliteGeo"),
      niveauAnglais: str(formData, "niveauAnglais"),
      permisB: bool(formData, "permisB"),
      vehicule: bool(formData, "vehicule"),
      rqth: bool(formData, "rqth"),

      // Suivi
      conseillerDedie: str(formData, "conseillerDedie"),
      dateRelance: date(formData, "dateRelance"),
      notes: str(formData, "notes"),

      // RGPD
      consentRgpd: bool(formData, "consentRgpd"),
      consentNewsletter: bool(formData, "consentNewsletter"),
      consentSms: bool(formData, "consentSms"),
      consentAppel: bool(formData, "consentAppel"),

      etapePipeline: 1,
      statut: "nouveau",
    },
  });
  revalidatePath("/candidats");
  redirect(`/candidats/${candidat.id}`);
}

export async function changerEtapeCandidat(formData: FormData) {
  const id = String(formData.get("id") || "");
  const etape = Number(formData.get("etape") || 1);
  if (!id) throw new Error("id manquant");
  await prisma.candidat.update({
    where: { id },
    data: {
      etapePipeline: etape,
      derniereActivite: new Date(),
      statut: etape >= 13 ? (etape >= 17 ? "diplome" : "place") : "en_cours",
    },
  });
  revalidatePath("/candidats");
  revalidatePath("/candidats/pipeline");
  revalidatePath(`/candidats/${id}`);
}
