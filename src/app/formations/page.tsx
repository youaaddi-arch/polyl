import Link from "next/link";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function FormationsPage() {
  const formations = await prisma.formation.findMany({
    include: { entite: true, _count: { select: { candidats: true } } },
    orderBy: [{ entite: { code: "asc" } }, { niveau: "asc" }],
  });
  const parEntite = new Map<string, typeof formations>();
  for (const f of formations) {
    const key = f.entite.code;
    if (!parEntite.has(key)) parEntite.set(key, []);
    parEntite.get(key)!.push(f);
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Catalogue formations</h1>
        <p className="text-gray-500 text-sm">{formations.length} formations · 6 entités du groupe</p>
      </header>

      {Array.from(parEntite.entries()).map(([code, list]) => (
        <section key={code} className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="badge bg-gray-100 text-gray-700">{code}</span>
              <span className="ml-2 font-semibold">{list[0].entite.specialite}</span>
            </div>
            <span className="text-xs text-gray-500">{list.length} formations</span>
          </div>
          <table className="crm">
            <thead><tr><th>Intitulé</th><th>Niveau</th><th>Type</th><th>Durée</th><th>Candidats</th></tr></thead>
            <tbody>
              {list.map((f) => (
                <tr key={f.id}>
                  <td>
                    <Link href={`/formations/${f.id}`} className="text-brand-600 hover:underline">{f.intitule}</Link>
                  </td>
                  <td>{f.niveau}</td>
                  <td>{f.type}</td>
                  <td className="text-gray-500">{f.dureeMois ? `${f.dureeMois} mois` : "—"}</td>
                  <td><span className="badge bg-brand-50 text-brand-700">{f._count.candidats}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}
    </div>
  );
}
