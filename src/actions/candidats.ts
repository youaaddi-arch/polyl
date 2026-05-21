"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { calculerStatutLead } from "@/lib/options";

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

// Affectation auto du commercial : préfère l'entité, round-robin sur le moins chargé
async function affecterCommercialAuto(entiteId?: string | null): Promise<string | null> {
  let entiteCode: string | null = null;
  if (entiteId) {
    const e = await prisma.entite.findUnique({ where: { id: entiteId } });
    entiteCode = e?.code ?? null;
  }
  const roles = ["commercial", "manager"];
  const users = await prisma.utilisateur.findMany({ where: { role: { in: roles }, active: true } });
  if (users.length === 0) return null;
  const sameEntite = entiteCode ? users.filter((u) => u.entiteCode === entiteCode) : [];
  const pool = sameEntite.length > 0 ? sameEntite : users;
  const counts = await Promise.all(
    pool.map((u) => prisma.candidat.count({ where: { conseillerDedie: `${u.prenom ?? ""} ${u.nom}`.trim() } })),
  );
  let minIdx = 0;
  for (let i = 1; i < counts.length; i++) if (counts[i] < counts[minIdx]) minIdx = i;
  const u = pool[minIdx];
  return `${u.prenom ?? ""} ${u.nom}`.trim();
}

export async function creerCandidat(formData: FormData) {
  const prenom = str(formData, "prenom");
  const nom = str(formData, "nom");
  if (!prenom || !nom) throw new Error("Prénom et nom obligatoires");

  const entiteId = str(formData, "entiteId");
  const formationId = str(formData, "formationId");
  const formationManuelleNom = str(formData, "formationManuelleNom");

  // Montant auto-rempli depuis la formation choisie (sauf si manuel)
  let montant = num(formData, "montantFinancement");
  if (!montant && formationId) {
    const f = await prisma.formation.findUnique({ where: { id: formationId } });
    if (f?.montant) montant = f.montant;
  }

  const conseillerDedie = await affecterCommercialAuto(entiteId);

  const tempData = {
    email: str(formData, "email"),
    telephone: str(formData, "telephone"),
    formationId,
    formationManuelleNom,
    financementChoisi: str(formData, "financementChoisi"),
    statutPro: str(formData, "statutPro"),
    societeMatcheeId: str(formData, "societeMatcheeId"),
    reconversion: bool(formData, "reconversion"),
    consentRgpd: bool(formData, "consentRgpd"),
  };
  const { statut: statutLead, score: scoreLead } = calculerStatutLead(tempData);

  const candidat = await prisma.candidat.create({
    data: {
      prenom, nom,
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

      sourceEntree: str(formData, "sourceEntree"),
      apiSource: str(formData, "apiSource"),
      posteVise: str(formData, "posteVise"),
      formationSouhaiteeLibre: str(formData, "formationSouhaiteeLibre"),
      cv: str(formData, "cv"),
      dateCandidature: date(formData, "dateCandidature") ?? new Date(),
      derniereActivite: new Date(),

      statutLead,
      scoreLead,

      formationId,
      entiteId,
      niveauActuel: str(formData, "niveauActuel"),
      anneeBac: num(formData, "anneeBac"),
      diplomeActuel: str(formData, "diplomeActuel"),
      experiencePro: str(formData, "experiencePro"),
      formationManuelleNom,
      formationManuelleNiveau: str(formData, "formationManuelleNiveau"),

      statutPro: str(formData, "statutPro"),
      ancienneteSalarie: str(formData, "ancienneteSalarie"),
      reconversion: bool(formData, "reconversion"),

      financementChoisi: str(formData, "financementChoisi"),
      montantFinancement: montant,
      opco: str(formData, "opco"),
      numeroDossierOpco: str(formData, "numeroDossierOpco"),

      societeMatcheeId: str(formData, "societeMatcheeId"),

      mobiliteGeo: str(formData, "mobiliteGeo"),
      niveauAnglais: str(formData, "niveauAnglais"),
      permisB: bool(formData, "permisB"),
      vehicule: bool(formData, "vehicule"),
      rqth: bool(formData, "rqth"),

      conseillerDedie,
      notes: str(formData, "notes"),

      consentRgpd: bool(formData, "consentRgpd"),
      consentNewsletter: bool(formData, "consentNewsletter"),
      consentSms: bool(formData, "consentSms"),
      consentAppel: bool(formData, "consentAppel"),

      etapePipeline: 1,
      statut: "nouveau",
    },
  });

  if (conseillerDedie) {
    await prisma.activite.create({
      data: {
        type: "creation",
        titre: `Candidat créé et affecté à ${conseillerDedie}`,
        contenu: `Statut lead auto-calculé : ${statutLead} (score ${scoreLead})`,
        auteur: "Système",
        candidatId: candidat.id,
      },
    });
  }

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
