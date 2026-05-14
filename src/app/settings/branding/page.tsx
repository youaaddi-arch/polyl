import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function BrandingPage() {
  const c = await prisma.accountConfig.findUnique({ where: { id: "singleton" } });
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Branding & logo</h1>
        <p className="text-hubspot-text-muted text-sm">Personnalisation visuelle du CRM, des emails et formulaires publics</p>
      </header>

      <section className="card p-6 space-y-4">
        <h2 className="font-semibold">Logo du groupe</h2>
        <div className="flex items-center gap-4">
          <div className="w-32 h-32 rounded border-2 border-dashed border-hubspot-border flex items-center justify-center text-hubspot-text-muted text-sm">Aucun logo</div>
          <div>
            <button className="btn-primary">📁 Importer un logo</button>
            <p className="text-xs text-hubspot-text-muted mt-2">PNG ou SVG · max 2 Mo</p>
          </div>
        </div>
      </section>

      <section className="card p-6 space-y-4">
        <h2 className="font-semibold">Couleurs de la marque</h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="text-sm text-hubspot-text-muted">Couleur primaire</label>
            <div className="flex items-center gap-3 mt-2">
              <span className="w-10 h-10 rounded border" style={{ background: c?.couleurPrimaire }} />
              <input defaultValue={c?.couleurPrimaire ?? "#FF7A59"} className="border border-hubspot-border rounded px-3 py-1.5 text-sm w-32 font-mono" />
            </div>
          </div>
          <div>
            <label className="text-sm text-hubspot-text-muted">Couleur secondaire</label>
            <div className="flex items-center gap-3 mt-2">
              <span className="w-10 h-10 rounded border" style={{ background: c?.couleurSecondaire }} />
              <input defaultValue={c?.couleurSecondaire ?? "#2E3A4F"} className="border border-hubspot-border rounded px-3 py-1.5 text-sm w-32 font-mono" />
            </div>
          </div>
        </div>
      </section>

      <section className="card p-6 space-y-3">
        <h2 className="font-semibold">Aperçu — Email transactionnel</h2>
        <div className="border border-hubspot-border rounded overflow-hidden">
          <div className="p-4 text-white text-sm font-semibold" style={{ background: c?.couleurSecondaire }}>{c?.nomGroupe}</div>
          <div className="p-6 bg-white text-sm">
            <p>Bonjour Léa,</p>
            <p className="mt-2">Merci pour votre candidature au CAP Accompagnant Éducatif Petite Enfance.</p>
            <button className="mt-4 px-4 py-2 rounded text-white text-sm font-semibold" style={{ background: c?.couleurPrimaire }}>Compléter mon dossier</button>
          </div>
        </div>
      </section>
    </div>
  );
}
