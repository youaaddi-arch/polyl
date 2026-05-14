import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function EntitesSettingsPage() {
  const entites = await prisma.entite.findMany({
    include: { _count: { select: { candidats: true, entreprises: true, formations: true } } },
    orderBy: { code: "asc" },
  });
  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Entités du groupe</h1>
          <p className="text-hubspot-text-muted text-sm">Les 6 entités juridiques du groupe CFA</p>
        </div>
        <button className="btn-primary">+ Ajouter une entité</button>
      </header>

      <div className="card overflow-hidden">
        <table className="crm">
          <thead><tr><th>Code</th><th>Nom</th><th>Spécialité</th><th>Ville</th><th>Candidats</th><th>Entreprises</th><th>Formations</th></tr></thead>
          <tbody>
            {entites.map((e) => (
              <tr key={e.id}>
                <td><span className="badge bg-hubspot-bg-alt text-hubspot-text">{e.code}</span></td>
                <td className="font-medium">{e.nom}</td>
                <td className="text-hubspot-text-muted">{e.specialite}</td>
                <td>{e.ville}</td>
                <td><span className="badge bg-orange-50 text-hubspot-orange">{e._count.candidats}</span></td>
                <td><span className="badge bg-orange-50 text-hubspot-orange">{e._count.entreprises}</span></td>
                <td><span className="badge bg-orange-50 text-hubspot-orange">{e._count.formations}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
