import Link from "next/link";
import { prisma } from "@/lib/db";
import { sauverConfigBrevo, deconnecterBrevo } from "@/actions/integrations";

export const dynamic = "force-dynamic";

export default async function BrevoSettingsPage() {
  const integ = await prisma.integration.findUnique({ where: { cle: "brevo" } });
  const isActive = integ?.active && integ.config;
  const cfg = isActive && integ?.config ? JSON.parse(integ.config) : null;

  return (
    <div className="space-y-6 max-w-3xl">
      <header>
        <Link href="/settings/integrations" className="text-sm text-hubspot-orange hover:underline">← Intégrations</Link>
        <div className="flex items-center gap-3 mt-2">
          <div className="w-12 h-12 rounded bg-blue-500 flex items-center justify-center text-white font-bold">B</div>
          <div>
            <h1 className="text-2xl font-bold">Brevo (ex-Sendinblue)</h1>
            <p className="text-hubspot-text-muted text-sm">Emails transactionnels, campagnes marketing & SMS</p>
          </div>
          <span className={`badge ml-auto ${isActive ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
            {isActive ? "✓ Connecté" : "Non connecté"}
          </span>
        </div>
      </header>

      {isActive && cfg && (
        <section className="card p-6 space-y-3">
          <h2 className="font-semibold">📊 Compte Brevo connecté</h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <Field label="Compte" value={cfg.compte?.email ?? "—"} />
            <Field label="Plan" value={cfg.compte?.plan ?? "—"} />
            <Field label="Société" value={cfg.compte?.companyName ?? "—"} />
            <Field label="Expéditeur email" value={cfg.expediteurEmail} />
            <Field label="Expéditeur nom" value={cfg.expediteurNom} />
            <Field label="Dernière sync" value={integ?.derniereSync ? new Intl.DateTimeFormat("fr-FR", { dateStyle: "short", timeStyle: "short" }).format(integ.derniereSync) : "—"} />
          </div>
          <form action={deconnecterBrevo} className="pt-3 border-t border-hubspot-border">
            <button className="btn-secondary text-sm">🚪 Déconnecter Brevo</button>
          </form>
        </section>
      )}

      <section className="card p-6 space-y-4">
        <h2 className="font-semibold">{isActive ? "🔄 Modifier la configuration" : "🔌 Connecter Brevo"}</h2>

        <details className="bg-blue-50 border border-blue-200 rounded p-4 text-sm">
          <summary className="font-semibold cursor-pointer">📖 Où trouver ma clé API Brevo ?</summary>
          <ol className="list-decimal ml-5 mt-2 space-y-1 text-xs">
            <li>Connecte-toi sur <a href="https://app.brevo.com" target="_blank" className="text-hubspot-orange underline">app.brevo.com</a></li>
            <li>En haut à droite, clique sur ton avatar → <strong>SMTP & API</strong></li>
            <li>Onglet <strong>Clés API</strong> → <strong>Générer une nouvelle clé API</strong></li>
            <li>Copie la clé (commence par <code>xkeysib-</code>) et colle-la ci-dessous</li>
          </ol>
        </details>

        <form action={sauverConfigBrevo} className="space-y-4">
          <label className="block">
            <span className="block text-sm font-medium mb-1">Clé API Brevo *</span>
            <input name="apiKey" type="password" required placeholder="xkeysib-..." className="w-full rounded border border-hubspot-border px-3 py-2 text-sm font-mono" />
            <span className="text-xs text-hubspot-text-muted mt-1 block">Ta clé est stockée en local. Elle n'est jamais partagée.</span>
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="block text-sm font-medium mb-1">Email expéditeur *</span>
              <input name="expediteurEmail" type="email" required placeholder="contact@groupe-cfa.fr" defaultValue={cfg?.expediteurEmail ?? ""} className="w-full rounded border border-hubspot-border px-3 py-2 text-sm" />
            </label>
            <label className="block">
              <span className="block text-sm font-medium mb-1">Nom expéditeur *</span>
              <input name="expediteurNom" required placeholder="Groupe CFA" defaultValue={cfg?.expediteurNom ?? ""} className="w-full rounded border border-hubspot-border px-3 py-2 text-sm" />
            </label>
          </div>

          <p className="text-xs text-hubspot-text-muted">⚠️ L'email expéditeur doit être <strong>validé dans Brevo</strong> (onglet "Expéditeurs &amp; IP" sur app.brevo.com).</p>

          <button className="btn-primary">🔌 {isActive ? "Mettre à jour" : "Connecter & tester"}</button>
        </form>
      </section>

      <section className="card p-6 space-y-3">
        <h2 className="font-semibold">⚡ Ce que Brevo fait pour ton CRM</h2>
        <ul className="text-sm space-y-2">
          <li>📧 <strong>Emails transactionnels</strong> automatiques (bienvenue candidat, convocations, relances)</li>
          <li>📨 <strong>Campagnes marketing</strong> vers tes listes filtrées</li>
          <li>📊 <strong>Statistiques</strong> ouvertures / clics remontées dans le CRM</li>
          <li>💬 <strong>SMS</strong> de rappel d'entretien (option payante chez Brevo)</li>
          <li>📋 <strong>Synchronisation</strong> automatique de la liste candidats vers Brevo</li>
        </ul>
      </section>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-hubspot-text-muted uppercase tracking-wide">{label}</div>
      <div className="font-medium mt-0.5">{value}</div>
    </div>
  );
}
