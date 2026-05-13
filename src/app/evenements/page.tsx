import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function EvenementsPage() {
  const evts = await prisma.evenement.findMany({
    orderBy: { date: "asc" },
    include: { entite: true, candidats: true, entreprises: true },
  });
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Événements</h1>
        <p className="text-gray-500 text-sm">Job Dating, journées d'information collectives, événements partenaires (CDC section 14)</p>
      </header>
      <div className="card p-5 space-y-3">
        {evts.map((e) => (
          <div key={e.id} className="border rounded-lg p-4 flex items-center justify-between">
            <div>
              <div className="font-semibold">{e.titre}</div>
              <div className="text-sm text-gray-500">{e.lieu ?? "—"} · {e.entite?.code ?? "—"} · {e.type}</div>
              <div className="text-xs text-gray-400 mt-1">{e.candidats.length} candidats · {e.entreprises.length} entreprises</div>
            </div>
            <div className="text-sm font-medium text-brand-700">
              {new Intl.DateTimeFormat("fr-FR", { dateStyle: "full" }).format(e.date)}
            </div>
          </div>
        ))}
        {evts.length === 0 && <div className="text-sm text-gray-400 py-4">Aucun événement</div>}
      </div>
    </div>
  );
}
