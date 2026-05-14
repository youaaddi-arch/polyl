"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

function parseCSV(text: string): Record<string, string>[] {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map((h) => h.trim());
  return lines.slice(1).map((line) => {
    const values = line.split(",");
    const row: Record<string, string> = {};
    headers.forEach((h, i) => { row[h] = (values[i] ?? "").trim(); });
    return row;
  });
}

export async function importerCSV(formData: FormData) {
  const objet = String(formData.get("objet") || "candidats");
  const file = formData.get("fichier") as File | null;
  if (!file) throw new Error("Fichier obligatoire");
  const text = await file.text();
  const rows = parseCSV(text);
  let crees = 0;
  let erreurs = 0;

  if (objet === "candidats") {
    for (const r of rows) {
      try {
        if (!r.prenom || !r.nom) { erreurs++; continue; }
        await prisma.candidat.create({
          data: {
            prenom: r.prenom, nom: r.nom,
            email: r.email || null, telephone: r.telephone || null, ville: r.ville || null,
            sourceEntree: "Import CSV", etapePipeline: 1, statut: "nouveau",
          },
        });
        crees++;
      } catch { erreurs++; }
    }
  } else if (objet === "entreprises") {
    for (const r of rows) {
      try {
        if (!r.raisonSociale) { erreurs++; continue; }
        await prisma.entreprise.create({
          data: {
            raisonSociale: r.raisonSociale,
            siret: r.siret || null, secteur: r.secteur || null,
            ville: r.ville || null, taille: r.taille || null,
            sourceDetection: "Import CSV", etapePipeline: 1, statut: "prospect",
          },
        });
        crees++;
      } catch { erreurs++; }
    }
  }

  await prisma.importLog.create({
    data: { objet, nomFichier: file.name, nbLignes: rows.length, nbCrees: crees, nbErreurs: erreurs, statut: "termine" },
  });
  revalidatePath("/imports");
  revalidatePath(`/${objet}`);
}
