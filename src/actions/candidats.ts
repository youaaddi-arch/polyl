"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function creerCandidat(formData: FormData) {
  const prenom = String(formData.get("prenom") || "").trim();
  const nom = String(formData.get("nom") || "").trim();
  if (!prenom || !nom) throw new Error("Prénom et nom obligatoires");

  const candidat = await prisma.candidat.create({
    data: {
      prenom,
      nom,
      email: String(formData.get("email") || "") || null,
      telephone: String(formData.get("telephone") || "") || null,
      ville: String(formData.get("ville") || "") || null,
      persona: String(formData.get("persona") || "") || null,
      sourceEntree: String(formData.get("sourceEntree") || "") || null,
      formationId: String(formData.get("formationId") || "") || null,
      entiteId: String(formData.get("entiteId") || "") || null,
      etapePipeline: 1,
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
      statut: etape >= 13 ? (etape >= 17 ? "diplome" : "place") : "en_cours",
    },
  });
  revalidatePath("/candidats");
  revalidatePath("/candidats/pipeline");
  revalidatePath(`/candidats/${id}`);
}
