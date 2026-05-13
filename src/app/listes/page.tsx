import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ListesPage() {
  const listes = await prisma.liste.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Listes intelligentes</h1>
        <p className="text-gray-500 text-sm">Segments sauvegardés réutilisables pour le ciblage et les campagnes</p>
      </header>
      <div className="card overflow-x-auto">
        <table className="crm">
          <thead><tr><th>Nom</th><th>Objet ciblé</th><th>Type</th><th>Filtres</th></tr></thead>
          <tbody>
            {listes.map((l) => {
              const f = JSON.parse(l.filtres) as any[];
              return (
                <tr key={l.id}>
                  <td className="font-medium">{l.nom}</td>
                  <td><span className="badge bg-purple-50 text-purple-700">{l.objet}</span></td>
                  <td>{l.type}</td>
                  <td className="text-xs text-gray-500">
                    {f.map((flt, i) => <span key={i} className="inline-block bg-gray-100 rounded px-2 py-0.5 mr-1 mb-1">{flt.champ} {flt.operateur} {flt.valeur ?? ""}</span>)}
                  </td>
                </tr>
              );
            })}
            {listes.length === 0 && <tr><td colSpan={4} className="text-center text-gray-400 py-8">Aucune liste</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
