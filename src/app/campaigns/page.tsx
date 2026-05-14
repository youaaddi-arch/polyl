import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function CampaignsPage() {
  const campaigns = await prisma.campaign.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Email campaigns</h1>
        <p className="text-gray-500 text-sm">Envois marketing one-shot vers vos listes</p>
      </header>
      <div className="card overflow-x-auto">
        <table className="crm">
          <thead><tr><th>Nom</th><th>Sujet</th><th>Statut</th><th>Date envoi</th><th>Destinataires</th><th>Ouvertures</th><th>Clics</th></tr></thead>
          <tbody>
            {campaigns.map((c) => {
              const taux = c.nbDestinataires ? Math.round((c.nbOuvertures / c.nbDestinataires) * 100) : 0;
              return (
                <tr key={c.id}>
                  <td className="font-medium">{c.nom}</td>
                  <td className="text-gray-600">{c.sujet}</td>
                  <td>
                    <span className={`badge ${
                      c.statut === "envoyee" ? "bg-emerald-50 text-emerald-700" :
                      c.statut === "planifiee" ? "bg-blue-50 text-blue-700" :
                      "bg-gray-100 text-gray-700"
                    }`}>{c.statut}</span>
                  </td>
                  <td>{c.dateEnvoi ? new Intl.DateTimeFormat("fr-FR").format(c.dateEnvoi) : "—"}</td>
                  <td><span className="badge bg-gray-100 text-gray-700">{c.nbDestinataires}</span></td>
                  <td>{c.nbOuvertures} <span className="text-xs text-gray-400">({taux}%)</span></td>
                  <td>{c.nbClics}</td>
                </tr>
              );
            })}
            {campaigns.length === 0 && <tr><td colSpan={7} className="text-center text-gray-400 py-8">Aucune campagne</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
