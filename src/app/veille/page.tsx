import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function VeillePage() {
  const items = await prisma.veille.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Veille réglementaire</h1>
        <p className="text-gray-500 text-sm">Sources surveillées : Légifrance, JO, France Compétences, Ministère du Travail, OPCO, URSSAF (CDC section 13)</p>
      </header>
      <div className="card p-5 space-y-2">
        {items.map((v) => (
          <div key={v.id} className="border-b last:border-0 pb-3 mb-3 last:mb-0 last:pb-0">
            <div className="flex items-center justify-between">
              <div className="font-semibold">{v.titre}</div>
              <span className={`badge ${
                v.niveauImpact === "critique" ? "bg-rose-50 text-rose-700" :
                v.niveauImpact === "important" ? "bg-amber-50 text-amber-700" :
                "bg-gray-100 text-gray-700"
              }`}>{v.niveauImpact}</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">Source : {v.source} · Thème : {v.theme ?? "—"}</div>
            {v.resume && <p className="text-sm text-gray-700 mt-2">{v.resume}</p>}
          </div>
        ))}
        {items.length === 0 && <div className="text-sm text-gray-400 py-4">Aucune veille</div>}
      </div>
    </div>
  );
}
