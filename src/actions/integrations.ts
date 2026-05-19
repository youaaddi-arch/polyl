"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

// ============================================================
// BREVO — connexion + test + envoi
// ============================================================

export async function sauverConfigBrevo(formData: FormData) {
  const apiKey = String(formData.get("apiKey") || "").trim();
  const expediteurEmail = String(formData.get("expediteurEmail") || "").trim();
  const expediteurNom = String(formData.get("expediteurNom") || "").trim();
  if (!apiKey) throw new Error("Clé API obligatoire");

  // Test l'API Brevo (endpoint /v3/account)
  let accountInfo: any = null;
  try {
    const res = await fetch("https://api.brevo.com/v3/account", {
      headers: { "api-key": apiKey, accept: "application/json" },
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Brevo a refusé la clé (HTTP ${res.status})`);
    accountInfo = await res.json();
  } catch (e: any) {
    throw new Error(`Échec connexion Brevo : ${e.message}`);
  }

  const config = JSON.stringify({
    apiKey,
    expediteurEmail,
    expediteurNom,
    compte: {
      email: accountInfo.email,
      firstName: accountInfo.firstName,
      lastName: accountInfo.lastName,
      companyName: accountInfo.companyName,
      plan: accountInfo.plan?.[0]?.type,
    },
  });

  await prisma.integration.upsert({
    where: { cle: "brevo" },
    create: {
      cle: "brevo",
      nom: "Brevo",
      description: "Emails transactionnels + campagnes + SMS",
      categorie: "email",
      active: true,
      config,
      derniereSync: new Date(),
    },
    update: { active: true, config, derniereSync: new Date() },
  });
  revalidatePath("/settings/integrations/brevo");
}

export async function deconnecterBrevo() {
  await prisma.integration.update({
    where: { cle: "brevo" },
    data: { active: false, config: null },
  });
  revalidatePath("/settings/integrations/brevo");
}

export async function envoyerEmailViaBrevo(
  destinataires: { email: string; nom?: string }[],
  sujet: string,
  contenuHtml: string,
) {
  const integ = await prisma.integration.findUnique({ where: { cle: "brevo" } });
  if (!integ?.active || !integ.config) throw new Error("Brevo n'est pas connecté");
  const cfg = JSON.parse(integ.config);
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": cfg.apiKey, "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: { email: cfg.expediteurEmail, name: cfg.expediteurNom },
      to: destinataires.map((d) => ({ email: d.email, name: d.nom })),
      subject: sujet,
      htmlContent: contenuHtml,
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Brevo : ${err}`);
  }
  return await res.json();
}

export async function envoyerCampagne(campagneId: string) {
  const campagne = await prisma.campaign.findUnique({ where: { id: campagneId } });
  if (!campagne) throw new Error("Campagne introuvable");

  const candidats = await prisma.candidat.findMany({
    where: { consentNewsletter: true, email: { not: null } },
    take: 1000,
  });

  const integ = await prisma.integration.findUnique({ where: { cle: "brevo" } });
  if (!integ?.active) throw new Error("Brevo non connecté — connectez-le dans Paramètres > Intégrations > Brevo");

  const cfg = JSON.parse(integ.config!);

  let envoyes = 0;
  for (let i = 0; i < candidats.length; i += 100) {
    const batch = candidats.slice(i, i + 100);
    try {
      await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: { "api-key": cfg.apiKey, "content-type": "application/json" },
        body: JSON.stringify({
          sender: { email: cfg.expediteurEmail, name: cfg.expediteurNom },
          to: batch.map((c) => ({ email: c.email, name: `${c.prenom} ${c.nom}` })),
          subject: campagne.sujet,
          htmlContent: campagne.contenu,
        }),
      });
      envoyes += batch.length;
    } catch {}
  }

  await prisma.campaign.update({
    where: { id: campagneId },
    data: { statut: "envoyee", dateEnvoi: new Date(), nbDestinataires: envoyes },
  });
  revalidatePath("/campaigns");
}

// ============================================================
// EMAIL — connexion SMTP / IMAP
// ============================================================

export async function sauverConfigEmail(formData: FormData) {
  const provider = String(formData.get("provider") || "smtp");
  const adresse = String(formData.get("adresse") || "").trim();
  const motDePasse = String(formData.get("motDePasse") || "").trim();
  const serveurSmtp = String(formData.get("serveurSmtp") || "").trim();
  const portSmtp = Number(formData.get("portSmtp") || 587);
  const serveurImap = String(formData.get("serveurImap") || "").trim();
  const portImap = Number(formData.get("portImap") || 993);

  if (!adresse || !motDePasse) throw new Error("Email et mot de passe obligatoires");

  const defaults: Record<string, { smtp: string; portSmtp: number; imap: string; portImap: number }> = {
    gmail:   { smtp: "smtp.gmail.com",         portSmtp: 587, imap: "imap.gmail.com",          portImap: 993 },
    outlook: { smtp: "smtp-mail.outlook.com",  portSmtp: 587, imap: "outlook.office365.com",   portImap: 993 },
  };
  const def = defaults[provider];
  const config = JSON.stringify({
    provider,
    adresse,
    motDePasse,
    serveurSmtp: serveurSmtp || def?.smtp,
    portSmtp: portSmtp || def?.portSmtp,
    serveurImap: serveurImap || def?.imap,
    portImap: portImap || def?.portImap,
  });

  await prisma.integration.upsert({
    where: { cle: `email_${provider}` },
    create: {
      cle: `email_${provider}`,
      nom: provider === "gmail" ? "Gmail" : provider === "outlook" ? "Outlook" : "Email SMTP",
      description: `Boîte mail ${adresse}`,
      categorie: "email",
      active: true,
      config,
      derniereSync: new Date(),
    },
    update: { active: true, config, description: `Boîte mail ${adresse}`, derniereSync: new Date() },
  });
  revalidatePath("/settings/integrations/email");
}

export async function deconnecterEmail(provider: string) {
  await prisma.integration.updateMany({
    where: { cle: `email_${provider}` },
    data: { active: false, config: null },
  });
  revalidatePath("/settings/integrations/email");
}
