import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function SettingsGeneralPage() {
  const config = await prisma.accountConfig.findUnique({ where: { id: "singleton" } });
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Paramètres généraux du compte</h1>
        <p className="text-hubspot-text-muted text-sm mt-1">Configuration globale du groupe CFA</p>
      </header>

      <section className="card p-6 space-y-4">
        <h2 className="font-semibold">Informations du groupe</h2>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Nom du groupe" value={config?.nomGroupe ?? "—"} />
          <Field label="Domaine email" value={config?.domaineEmail ?? "—"} />
          <Field label="Fuseau horaire" value={config?.fuseau ?? "—"} />
          <Field label="Langue par défaut" value={config?.langue ?? "—"} />
          <Field label="Devise" value={config?.deviseDefaut ?? "—"} />
          <Field label="Couleur primaire" value={config?.couleurPrimaire ?? "—"} color />
        </div>
      </section>

      <section className="card p-6 space-y-3">
        <h2 className="font-semibold">Signature email globale</h2>
        <pre className="bg-hubspot-bg p-4 rounded text-sm whitespace-pre-wrap font-sans">{config?.signatureGlobale ?? "—"}</pre>
      </section>

      <section className="card p-6 space-y-3">
        <h2 className="font-semibold">Contact RGPD / DPO</h2>
        <Field label="Email DPO" value={config?.rgpdContact ?? "—"} />
        <Field label="Adresse" value={config?.rgpdAdresse ?? "—"} />
      </section>

      <p className="text-xs text-hubspot-text-muted">L'édition complète de ces paramètres sera disponible en vague 4 (auth + permissions).</p>
    </div>
  );
}

function Field({ label, value, color }: { label: string; value: string; color?: boolean }) {
  return (
    <div>
      <div className="text-xs text-hubspot-text-muted uppercase tracking-wide">{label}</div>
      <div className="flex items-center gap-2 mt-1">
        {color && <span className="w-4 h-4 rounded inline-block border" style={{ background: value }} />}
        <div className="font-medium">{value}</div>
      </div>
    </div>
  );
}
