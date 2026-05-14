import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function SequencesPage() {
  const sequences = await prisma.sequence.findMany({ include: { _count: { select: { enrollments: true } } }, orderBy: { createdAt: "desc" } });
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Sequences emails</h1>
        <p className="text-gray-500 text-sm">Cadences automatisées multi-étapes (onboarding, réactivation, nurturing)</p>
      </header>
      <div className="space-y-4">
        {sequences.map((s) => {
          const etapes = JSON.parse(s.etapes) as { ordre: number; jourOffset: number; sujet: string }[];
          return (
            <div key={s.id} className="card p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold">{s.nom}</h2>
                  <p className="text-xs text-gray-500 mt-1">{s.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="badge bg-purple-50 text-purple-700">{s.cibleObjet}</span>
                  <span className="badge bg-brand-50 text-brand-700">{s._count.enrollments} inscrits</span>
                  <span className={`badge ${s.active ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>{s.active ? "active" : "pause"}</span>
                </div>
              </div>
              <ol className="mt-4 space-y-2">
                {etapes.map((e) => (
                  <li key={e.ordre} className="flex gap-3 items-start">
                    <span className="badge bg-brand-100 text-brand-700 shrink-0">J+{e.jourOffset}</span>
                    <div className="text-sm">
                      <div className="font-medium">📧 {e.sujet}</div>
                      <div className="text-xs text-gray-500">Étape {e.ordre}/{etapes.length}</div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          );
        })}
        {sequences.length === 0 && <div className="text-sm text-gray-400">Aucune séquence</div>}
      </div>
    </div>
  );
}
