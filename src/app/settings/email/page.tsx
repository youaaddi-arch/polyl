import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function EmailSettingsPage() {
  const config = await prisma.accountConfig.findUnique({ where: { id: "singleton" } });
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Email & signature</h1>
        <p className="text-hubspot-text-muted text-sm">Configuration de l'expéditeur, domaine, signature automatique</p>
      </header>

      <section className="card p-6 space-y-3">
        <h2 className="font-semibold">Domaine d'envoi</h2>
        <Field label="Domaine principal" value={config?.domaineEmail ?? "groupe-cfa.fr"} />
        <Field label="SPF" value="✅ Configuré" />
        <Field label="DKIM" value="✅ Configuré" />
        <Field label="DMARC" value="⚠️ À configurer" />
        <button className="btn-secondary">Vérifier la configuration DNS</button>
      </section>

      <section className="card p-6 space-y-3">
        <h2 className="font-semibold">Ma signature email</h2>
        <textarea rows={6} defaultValue={config?.signatureGlobale ?? ""} className="w-full rounded border border-hubspot-border p-3 text-sm font-mono" />
        <div className="text-xs text-hubspot-text-muted">Variables : {`{{prenom}}, {{nom}}, {{role}}, {{entite}}, {{telephone}}`}</div>
        <div className="flex justify-end"><button className="btn-primary">💾 Enregistrer</button></div>
      </section>

      <section className="card p-6 space-y-3">
        <h2 className="font-semibold">Boîte de réception connectée</h2>
        <p className="text-sm text-hubspot-text-muted">Synchronisez Gmail/Outlook pour envoyer/recevoir directement depuis le CRM.</p>
        <div className="flex gap-3">
          <button className="btn-secondary">📧 Connecter Gmail</button>
          <button className="btn-secondary">📧 Connecter Outlook</button>
        </div>
      </section>

      <section className="card p-6 space-y-3">
        <h2 className="font-semibold">Adresse "Bcc tracking"</h2>
        <p className="text-sm text-hubspot-text-muted">Mettez cette adresse en Cci pour que vos emails soient automatiquement loggés.</p>
        <code className="block bg-hubspot-bg p-3 rounded text-xs">tracking@crm.groupe-cfa.fr</code>
      </section>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[12rem_1fr] items-center text-sm">
      <span className="text-hubspot-text-muted">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
