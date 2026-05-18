"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function creerDeal(formData: FormData) {
  const titre = String(formData.get("titre") || "").trim();
  const type = String(formData.get("type") || "apprentissage");
  if (!titre) throw new Error("Titre obligatoire");

  // Mappe type → nom de pipeline
  const pipelineNomByType: Record<string, string> = {
    apprentissage: "Apprentissage / Alternance",
    formation_pro: "Formation professionnelle longue",
    formation_continue: "Formation continue courte",
  };
  const pipeline = await prisma.dealPipeline.findFirst({ where: { nom: pipelineNomByType[type] ?? "Apprentissage / Alternance" } });
  if (!pipeline) throw new Error("Pipeline introuvable");

  // Première étape du pipeline = demande_renseignement
  const stages = JSON.parse(pipeline.stages) as { cle: string; ordre: number }[];
  const premiereEtape = stages.sort((a, b) => a.ordre - b.ordre)[0]?.cle ?? "demande_renseignement";

  const deal = await prisma.deal.create({
    data: {
      titre,
      type,
      montant: Number(formData.get("montant") || 0) || null,
      probabilite: 10,
      ownerName: String(formData.get("ownerName") || "") || null,
      pipelineId: pipeline.id,
      etapeCle: premiereEtape,
      centreCode: String(formData.get("centreCode") || "") || null,
      entrepriseId: String(formData.get("entrepriseId") || "") || null,
      candidatId: String(formData.get("candidatId") || "") || null,
      formationId: String(formData.get("formationId") || "") || null,
      dateOuverture: formData.get("dateOuverture") ? new Date(String(formData.get("dateOuverture"))) : new Date(),
      dateClotPrevue: formData.get("dateClotPrevue") ? new Date(String(formData.get("dateClotPrevue"))) : null,
    },
  });
  revalidatePath("/deals");
  redirect(`/deals/${deal.id}?type=${type}`);
}

export async function changerStageDeal(formData: FormData) {
  const id = String(formData.get("id") || "");
  const etapeCle = String(formData.get("etapeCle") || "");
  if (!id || !etapeCle) throw new Error("id ou étape manquant");
  const deal = await prisma.deal.findUnique({ where: { id }, include: { pipeline: true } });
  if (!deal?.pipeline) throw new Error("Deal introuvable");
  const stages = JSON.parse(deal.pipeline.stages) as { cle: string; probabilite: number }[];
  const stage = stages.find((s) => s.cle === etapeCle);
  await prisma.deal.update({
    where: { id },
    data: {
      etapeCle,
      probabilite: stage?.probabilite ?? deal.probabilite,
      statut: etapeCle === "gagne" ? "gagnee" : etapeCle === "perdu" ? "perdue" : "ouverte",
      dateGagne: etapeCle === "gagne" ? new Date() : null,
    },
  });
  revalidatePath("/deals");
  revalidatePath(`/deals/${id}`);
}

export async function ajouterNote(formData: FormData) {
  const contenu = String(formData.get("contenu") || "").trim();
  if (!contenu) return;
  const candidatId = String(formData.get("candidatId") || "") || null;
  const entrepriseId = String(formData.get("entrepriseId") || "") || null;
  const dealId = String(formData.get("dealId") || "") || null;
  await prisma.note.create({
    data: { contenu, auteur: "Vous", candidatId, entrepriseId, dealId },
  });
  await prisma.activite.create({
    data: {
      type: "note",
      titre: "Note ajoutée",
      contenu,
      auteur: "Vous",
      candidatId,
      entrepriseId,
      dealId,
    },
  });
  if (candidatId) revalidatePath(`/candidats/${candidatId}`);
  if (entrepriseId) revalidatePath(`/entreprises/${entrepriseId}`);
  if (dealId) revalidatePath(`/deals/${dealId}`);
}

export async function creerMeeting(formData: FormData) {
  const titre = String(formData.get("titre") || "").trim();
  const dateDebutStr = String(formData.get("dateDebut") || "");
  if (!titre || !dateDebutStr) throw new Error("Titre et date de début obligatoires");
  const dateDebut = new Date(dateDebutStr);
  const dureeMin = Number(formData.get("dureeMin") || 60);
  const dateFin = new Date(dateDebut.getTime() + dureeMin * 60 * 1000);
  const candidatId = String(formData.get("candidatId") || "") || null;
  const entrepriseId = String(formData.get("entrepriseId") || "") || null;
  await prisma.meeting.create({
    data: {
      titre,
      type: String(formData.get("type") || "entretien"),
      dateDebut,
      dateFin,
      lieu: String(formData.get("lieu") || "") || null,
      ownerName: String(formData.get("ownerName") || "") || null,
      candidatId,
      entrepriseId,
    },
  });
  revalidatePath("/meetings");
  if (candidatId) revalidatePath(`/candidats/${candidatId}`);
  if (entrepriseId) revalidatePath(`/entreprises/${entrepriseId}`);
}

export async function creerTicket(formData: FormData) {
  const sujet = String(formData.get("sujet") || "").trim();
  if (!sujet) throw new Error("Sujet obligatoire");
  const t = await prisma.ticket.create({
    data: {
      sujet,
      description: String(formData.get("description") || "") || null,
      categorie: String(formData.get("categorie") || "") || null,
      priorite: String(formData.get("priorite") || "normale"),
      statut: "nouveau",
      candidatId: String(formData.get("candidatId") || "") || null,
      entrepriseId: String(formData.get("entrepriseId") || "") || null,
    },
  });
  revalidatePath("/tickets");
  redirect(`/tickets/${t.id}`);
}

export async function changerStatutTicket(formData: FormData) {
  const id = String(formData.get("id") || "");
  const statut = String(formData.get("statut") || "nouveau");
  await prisma.ticket.update({ where: { id }, data: { statut } });
  revalidatePath("/tickets");
  revalidatePath(`/tickets/${id}`);
}

export async function soumettreFormulaire(slug: string, donnees: Record<string, string>) {
  const form = await prisma.formulaire.findUnique({ where: { slug } });
  if (!form || !form.active) throw new Error("Formulaire introuvable");
  await prisma.formulaireSubmission.create({
    data: { formulaireId: form.id, donnees: JSON.stringify(donnees) },
  });
  // Conversion automatique : si le formulaire cible "candidat", on crée la fiche
  if (form.cibleObjet === "candidat" && donnees.prenom && donnees.nom) {
    await prisma.candidat.create({
      data: {
        prenom: donnees.prenom,
        nom: donnees.nom,
        email: donnees.email || null,
        telephone: donnees.telephone || null,
        ville: donnees.ville || null,
        sourceEntree: `Formulaire : ${form.nom}`,
        etapePipeline: 1,
        statut: "nouveau",
        notes: donnees.message || null,
      },
    });
  }
  revalidatePath("/formulaires");
  revalidatePath("/candidats");
}

export async function creerCampagne(formData: FormData) {
  const nom = String(formData.get("nom") || "").trim();
  const sujet = String(formData.get("sujet") || "").trim();
  if (!nom || !sujet) throw new Error("Nom et sujet obligatoires");

  // Calcule le nombre de destinataires depuis les filtres reportés
  const filtres: Record<string, string> = {};
  for (const [k, v] of formData.entries()) {
    if (k.startsWith("filtre_") && v) filtres[k.replace("filtre_", "")] = String(v);
  }
  const where: any = {};
  if (filtres.statut) where.statut = filtres.statut;
  if (filtres.statutLead) where.statutLead = filtres.statutLead;
  if (filtres.situation) where.situation = filtres.situation;
  if (filtres.financementChoisi) where.financementChoisi = filtres.financementChoisi;
  if (filtres.persona) where.persona = filtres.persona;
  const nbDestinataires = Object.keys(where).length > 0
    ? await prisma.candidat.count({ where: { ...where, consentNewsletter: true } })
    : 0;

  const campagne = await prisma.campaign.create({
    data: {
      nom,
      sujet,
      contenu: String(formData.get("contenu") || ""),
      listeId: String(formData.get("listeId") || "") || null,
      templateId: String(formData.get("templateId") || "") || null,
      statut: String(formData.get("statut") || "brouillon"),
      dateEnvoi: formData.get("dateEnvoi") ? new Date(String(formData.get("dateEnvoi"))) : null,
      nbDestinataires,
    },
  });
  revalidatePath("/campaigns");
  redirect(`/campaigns`);
}
