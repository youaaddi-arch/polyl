import Link from "next/link";
import { prisma } from "@/lib/db";
import { DOMAINES_ALIOS } from "@/lib/formations-alios";

export const dynamic = "force-dynamic";

export default async function FormationsPage() {
  const formations = await prisma.formation.findMany({
    include: { entite: true, _count: { select: { candidats: true } } },
    orderBy: [{ type: "asc" }, { intitule: "asc" }],
  });

  // Sépare alternance (avec entité) et formations continues ALIOS (sans entité)
  const alternance = formations.filter((f) => f.entite != null);
  const continues = formations.filter((f) => f.entite == null);

  // Regroupe alternance par entité
  const parEntite = new Map<string, typeof formations>();
  for (const f of alternance) {
    const key = f.entite!.code;
    if (!parEntite.has(key)) parEntite.set(key, []);
    parEntite.get(key)!.push(f);
  }

  // Regroupe continues par domaine
  const parDomaine = new Map<string, typeof formations>();
  for (const f of continues) {
    const key = f.domaine ?? "autre";
    if (!parDomaine.has(key)) parDomaine.set(key, []);
    parDomaine.get(key)!.push(f);
  }
  const domaineLabel = (id: string) => DOMAINES_ALIOS.find((d) => d.id === id)?.nom ?? id;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Catalogue formations</h1>
        <p className="text-gray-500 text-sm">
          {formations.length} formations · {alternance.length} en alternance (6 CFA) · {continues.length} en formation continue (ALIOS)
        </p>
      </header>

      <h2 className="text-lg font-semibold mt-6">📚 Alternance (TP, CAP, Master)</h2>
      {Array.from(parEntite.entries()).map(([code, list]) => (
        <section key={code} className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="badge bg-gray-100 text-gray-700">{code}</span>
              <span className="ml-2 font-semibold">{list[0].entite!.specialite}</span>
            </div>
            <span className="text-xs text-gray-500">{list.length} formations</span>
          </div>
          <table className="crm">
            <thead><tr><th>Intitulé</th><th>Niveau</th><th>Type</th><th>Durée</th><th>Montant</th><th>Candidats</th></tr></thead>
            <tbody>
              {list.map((f) => (
                <tr key={f.id}>
                  <td><Link href={`/formations/${f.id}`} className="text-brand-600 hover:underline">{f.intitule}</Link></td>
                  <td>{f.niveau}</td>
                  <td>{f.type}</td>
                  <td className="text-gray-500">{f.dureeMois ? `${f.dureeMois} mois` : "—"}</td>
                  <td className="text-gray-500">{f.montant ? `${f.montant.toLocaleString("fr-FR")} €` : "—"}</td>
                  <td><span className="badge bg-brand-50 text-brand-700">{f._count.candidats}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}

      <h2 className="text-lg font-semibold mt-6">✨ Formation continue ALIOS (120 formations, 13 domaines)</h2>
      {Array.from(parDomaine.entries()).map(([dom, list]) => (
        <section key={dom} className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold">{domaineLabel(dom)}</span>
            <span className="text-xs text-gray-500">{list.length} formations</span>
          </div>
          <table className="crm">
            <thead><tr><th>Intitulé</th><th>Certification</th><th>Financements</th><th>Montant</th><th>Candidats</th></tr></thead>
            <tbody>
              {list.map((f) => (
                <tr key={f.id}>
                  <td><Link href={`/formations/${f.id}`} className="text-brand-600 hover:underline">{f.intitule}</Link></td>
                  <td className="text-xs text-gray-500">{f.codeRS ?? "—"}</td>
                  <td className="text-xs text-gray-500">{f.financements ?? "—"}</td>
                  <td className="text-gray-500">{f.montant ? `${f.montant.toLocaleString("fr-FR")} €` : "—"}</td>
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
