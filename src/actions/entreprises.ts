"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function creerEntreprise(formData: FormData) {
  const raison = String(formData.get("raisonSociale") || "").trim();
  if (!raison) throw new Error("Raison sociale obligatoire");

  const entreprise = await prisma.entreprise.create({
    data: {
      raisonSociale: raison,
      siret: String(formData.get("siret") || "") || null,
      taille: String(formData.get("taille") || "") || null,
      secteur: String(formData.get("secteur") || "") || null,
      ville: String(formData.get("ville") || "") || null,
      persona: String(formData.get("persona") || "") || null,
      sourceDetection: String(formData.get("sourceDetection") || "") || null,
      entiteId: String(formData.get("entiteId") || "") || null,
      etapePipeline: 1,
      statut: "prospect",
    },
  });
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
      statut: etape >= 15 ? "partenaire_actif" : etape >= 6 ? "qualifie" : "prospect",
    },
  });
  revalidatePath("/entreprises");
  revalidatePath("/entreprises/pipeline");
  revalidatePath(`/entreprises/${id}`);
}
