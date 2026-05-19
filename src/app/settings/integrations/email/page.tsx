import Link from "next/link";
import { prisma } from "@/lib/db";
import { sauverConfigEmail } from "@/actions/integrations";

export const dynamic = "force-dynamic";

export default async function EmailIntegrationsPage() {
  const [gmail, outlook, smtp] = await Promise.all([
    prisma.integration.findUnique({ where: { cle: "email_gmail" } }),
    prisma.integration.findUnique({ where: { cle: "email_outlook" } }),
    prisma.integration.findUnique({ where: { cle: "email_smtp" } }),
  ]);

  const connecteur = (i: any) => i?.active && i?.config ? JSON.parse(i.config) : null;
  const cfgGmail = connecteur(gmail);
  const cfgOutlook = connecteur(outlook);
  const cfgSmtp = connecteur(smtp);

  return (
    <div className="space-y-6 max-w-3xl">
      <header>
        <Link href="/settings/integrations" className="text-sm text-hubspot-orange hover:underline">← Intégrations</Link>
        <h1 className="text-2xl font-bold mt-2">Connecter ma boîte mail</h1>
        <p className="text-hubspot-text-muted text-sm">Envoyez & recevez vos emails directement depuis le CRM</p>
      </header>

      <section className="card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-red-500 flex items-center justify-center text-white font-bold">G</div>
            <div>
              <h2 className="font-semibold">Gmail</h2>
              <p className="text-xs text-hubspot-text-muted">{cfgGmail?.adresse ?? "Non connecté"}</p>
            </div>
          </div>
          <span className={`badge ${cfgGmail ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
            {cfgGmail ? "✓ Connecté" : "Non connecté"}
          </span>
        </div>

        <details className="bg-amber-50 border border-amber-200 rounded p-3 text-xs">
          <summary className="font-semibold cursor-pointer">⚠️ Comment générer un "mot de passe d'application" Gmail</summary>
          <ol className="list-decimal ml-5 mt-2 space-y-1">
            <li>Active la <strong>double authentification</strong> sur ton compte Google (obligatoire)</li>
            <li>Va sur <a href="https://myaccount.google.com/apppasswords" target="_blank" className="text-hubspot-orange underline">myaccount.google.com/apppasswords</a></li>
            <li>Crée un mot de passe d'application "CRM Formation"</li>
            <li>Copie le mot de passe à 16 caractères et colle-le ci-dessous</li>
          </ol>
        </details>

        <form action={sauverConfigEmail} className="space-y-3">
          <input type="hidden" name="provider" value="gmail" />
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="block text-sm font-medium mb-1">Email Gmail *</span>
              <input name="adresse" type="email" required defaultValue={cfgGmail?.adresse ?? ""} placeholder="vous@gmail.com" className="w-full rounded border border-hubspot-border px-3 py-2 text-sm" />
            </label>
            <label className="block">
              <span className="block text-sm font-medium mb-1">Mot de passe d'application *</span>
              <input name="motDePasse" type="password" required placeholder="16 caractères" className="w-full rounded border border-hubspot-border px-3 py-2 text-sm font-mono" />
            </label>
          </div>
          <button className="btn-primary text-sm">🔌 Connecter Gmail</button>
        </form>
      </section>

      <section className="card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-blue-600 flex items-center justify-center text-white font-bold">O</div>
            <div>
              <h2 className="font-semibold">Outlook / Microsoft 365</h2>
              <p className="text-xs text-hubspot-text-muted">{cfgOutlook?.adresse ?? "Non connecté"}</p>
            </div>
          </div>
          <span className={`badge ${cfgOutlook ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
            {cfgOutlook ? "✓ Connecté" : "Non connecté"}
          </span>
        </div>

        <form action={sauverConfigEmail} className="space-y-3">
          <input type="hidden" name="provider" value="outlook" />
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="block text-sm font-medium mb-1">Email Outlook *</span>
              <input name="adresse" type="email" required defaultValue={cfgOutlook?.adresse ?? ""} placeholder="vous@outlook.com" className="w-full rounded border border-hubspot-border px-3 py-2 text-sm" />
            </label>
            <label className="block">
              <span className="block text-sm font-medium mb-1">Mot de passe *</span>
              <input name="motDePasse" type="password" required className="w-full rounded border border-hubspot-border px-3 py-2 text-sm" />
            </label>
          </div>
          <button className="btn-primary text-sm">🔌 Connecter Outlook</button>
        </form>
      </section>

      <section className="card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-hubspot-navy flex items-center justify-center text-white font-bold">📧</div>
            <div>
              <h2 className="font-semibold">SMTP / IMAP personnalisé</h2>
              <p className="text-xs text-hubspot-text-muted">Pour un email pro ou un autre fournisseur</p>
            </div>
          </div>
          <span className={`badge ${cfgSmtp ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
            {cfgSmtp ? "✓ Connecté" : "Non connecté"}
          </span>
        </div>

        <form action={sauverConfigEmail} className="space-y-3">
          <input type="hidden" name="provider" value="smtp" />
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="block text-sm font-medium mb-1">Adresse email *</span>
              <input name="adresse" type="email" required defaultValue={cfgSmtp?.adresse ?? ""} placeholder="contact@votre-domaine.fr" className="w-full rounded border border-hubspot-border px-3 py-2 text-sm" />
            </label>
            <label className="block">
              <span className="block text-sm font-medium mb-1">Mot de passe *</span>
              <input name="motDePasse" type="password" required className="w-full rounded border border-hubspot-border px-3 py-2 text-sm" />
            </label>
            <label className="block">
              <span className="block text-sm font-medium mb-1">Serveur SMTP</span>
              <input name="serveurSmtp" defaultValue={cfgSmtp?.serveurSmtp ?? ""} placeholder="smtp.votre-fai.fr" className="w-full rounded border border-hubspot-border px-3 py-2 text-sm" />
            </label>
            <label className="block">
              <span className="block text-sm font-medium mb-1">Port SMTP</span>
              <input name="portSmtp" type="number" defaultValue={cfgSmtp?.portSmtp ?? 587} className="w-full rounded border border-hubspot-border px-3 py-2 text-sm" />
            </label>
            <label className="block">
              <span className="block text-sm font-medium mb-1">Serveur IMAP (réception)</span>
              <input name="serveurImap" defaultValue={cfgSmtp?.serveurImap ?? ""} placeholder="imap.votre-fai.fr" className="w-full rounded border border-hubspot-border px-3 py-2 text-sm" />
            </label>
            <label className="block">
              <span className="block text-sm font-medium mb-1">Port IMAP</span>
              <input name="portImap" type="number" defaultValue={cfgSmtp?.portImap ?? 993} className="w-full rounded border border-hubspot-border px-3 py-2 text-sm" />
            </label>
          </div>
          <button className="btn-primary text-sm">🔌 Connecter SMTP</button>
        </form>
      </section>

      <section className="card p-6 bg-amber-50 border-amber-200 space-y-2">
        <h3 className="font-semibold text-sm">💡 Recommandation</h3>
        <p className="text-sm">Pour les <strong>emails marketing</strong> (campagnes vers + de 50 contacts), utilisez <strong>Brevo</strong> (taux de délivrabilité optimisé).</p>
        <p className="text-sm">Pour les <strong>emails transactionnels personnels</strong> (réponse à un candidat, envoi 1-to-1), utilisez votre <strong>Gmail / Outlook</strong>.</p>
        <div className="flex gap-2 mt-2">
          <Link href="/settings/integrations/brevo" className="btn-primary text-xs">Configurer Brevo →</Link>
        </div>
      </section>
    </div>
  );
}
