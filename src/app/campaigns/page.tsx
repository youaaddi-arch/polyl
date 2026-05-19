import Link from "next/link";
import { prisma } from "@/lib/db";
import { envoyerCampagne } from "@/actions/integrations";

export const dynamic = "force-dynamic";

export default async function CampaignsPage() {
  const [campaigns, brevo] = await Promise.all([
    prisma.campaign.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.integration.findUnique({ where: { cle: "brevo" } }),
  ]);
  const brevoConnecte = brevo?.active && brevo.config;

  async function envoyer(formData: FormData) {
    "use server";
    const id = String(formData.get("id") || "");
    await envoyerCampagne(id);
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Email campaigns</h1>
          <p className="text-hubspot-text-muted text-sm">Envois marketing one-shot vers vos listes</p>
        </div>
        <div className="flex gap-2">
          {!brevoConnecte && (
            <Link href="/settings/integrations/brevo" className="btn-secondary text-sm">⚠️ Connecter Brevo d'abord</Link>
          )}
          <Link href="/campaigns/nouveau" className="btn-primary">+ Nouvelle campagne</Link>
        </div>
      </header>

      {!brevoConnecte && (
        <div className="card p-4 bg-amber-50 border-amber-200">
          <p className="text-sm">
            ⚠️ <strong>Brevo n'est pas connecté.</strong> Vous pouvez créer des brouillons de campagnes,
            mais pour les envoyer réellement, <Link href="/settings/integrations/brevo" className="text-hubspot-orange underline font-semibold">connectez Brevo</Link> d'abord.
          </p>
        </div>
      )}

      <div className="card overflow-x-auto">
        <table className="crm">
          <thead><tr><th>Nom</th><th>Sujet</th><th>Statut</th><th>Date envoi</th><th>Destinataires</th><th>Ouvertures</th><th>Clics</th><th /></tr></thead>
          <tbody>
            {campaigns.map((c) => {
              const taux = c.nbDestinataires ? Math.round((c.nbOuvertures / c.nbDestinataires) * 100) : 0;
              return (
                <tr key={c.id}>
                  <td className="font-medium">{c.nom}</td>
                  <td className="text-hubspot-text-muted">{c.sujet}</td>
                  <td>
                    <span className={`badge ${c.statut === "envoyee" ? "bg-emerald-50 text-emerald-700" : c.statut === "planifiee" ? "bg-blue-50 text-blue-700" : "bg-gray-100 text-gray-700"}`}>
                      {c.statut}
                    </span>
                  </td>
                  <td>{c.dateEnvoi ? new Intl.DateTimeFormat("fr-FR").format(c.dateEnvoi) : "—"}</td>
                  <td><span className="badge bg-hubspot-bg-alt">{c.nbDestinataires}</span></td>
                  <td>{c.nbOuvertures} <span className="text-xs text-hubspot-text-muted">({taux}%)</span></td>
                  <td>{c.nbClics}</td>
                  <td>
                    {c.statut !== "envoyee" && brevoConnecte && (
                      <form action={envoyer}>
                        <input type="hidden" name="id" value={c.id} />
                        <button className="text-xs text-hubspot-orange hover:underline font-semibold">📤 Envoyer via Brevo</button>
                      </form>
                    )}
                  </td>
                </tr>
              );
            })}
            {campaigns.length === 0 && <tr><td colSpan={8} className="text-center text-hubspot-text-muted py-8">Aucune campagne</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
