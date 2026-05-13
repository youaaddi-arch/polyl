import Link from "next/link";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

const STATUTS = ["nouveau", "en_cours", "attente_client", "resolu", "ferme"] as const;

export default async function TicketsPage() {
  const tickets = await prisma.ticket.findMany({
    include: { candidat: true, entreprise: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tickets</h1>
          <p className="text-gray-500 text-sm">Support apprenants & entreprises — {tickets.length} tickets</p>
        </div>
        <Link href="/tickets/nouveau" className="btn-primary">+ Nouveau ticket</Link>
      </header>

      <div className="flex gap-3 overflow-x-auto pb-4">
        {STATUTS.map((statut) => {
          const list = tickets.filter((t) => t.statut === statut);
          return (
            <div key={statut} className="shrink-0 w-72 bg-gray-100 rounded-xl p-3">
              <div className="font-semibold text-sm mb-3 capitalize flex items-center justify-between">
                <span>{statut.replace("_", " ")}</span>
                <span className="badge bg-white text-gray-600 border">{list.length}</span>
              </div>
              <div className="space-y-2">
                {list.map((t) => (
                  <Link key={t.id} href={`/tickets/${t.id}`} className="block bg-white rounded-lg p-3 shadow-sm border border-gray-200 hover:border-brand-300">
                    <div className="font-medium text-sm">{t.sujet}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {t.categorie ?? "—"}
                      {t.candidat && ` · 👤 ${t.candidat.prenom} ${t.candidat.nom}`}
                      {t.entreprise && ` · 🏢 ${t.entreprise.raisonSociale}`}
                    </div>
                    <span className={`badge mt-2 ${t.priorite === "urgente" ? "bg-rose-100 text-rose-700" : t.priorite === "haute" ? "bg-amber-50 text-amber-700" : "bg-gray-100 text-gray-700"}`}>
                      {t.priorite}
                    </span>
                  </Link>
                ))}
                {list.length === 0 && <div className="text-xs text-gray-400 italic px-1 py-2">—</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
