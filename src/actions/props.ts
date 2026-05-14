"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function sauverPropValeur(formData: FormData) {
  const objet = String(formData.get("objet") || "");
  const objetId = String(formData.get("objetId") || "");
  const propCle = String(formData.get("propCle") || "");
  const valeur = String(formData.get("valeur") || "");
  if (!objet || !objetId || !propCle) return;

  await prisma.propValeur.upsert({
    where: { propCle_objet_objetId: { propCle, objet, objetId } },
    create: { propCle, objet, objetId, valeur },
    update: { valeur },
  });
  revalidatePath(`/${objet}s/${objetId}`);
}
