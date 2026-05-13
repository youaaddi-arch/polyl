import Link from "next/link";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function MeetingsPage() {
  const meetings = await prisma.meeting.findMany({
    include: { candidat: true, entreprise: true, deal: true },
    orderBy: { dateDebut: "asc" },
  });

  const now = Date.now();
  const upcoming = meetings.filter((m) => m.dateDebut.getTime() >= now);
  const past = meetings.filter((m) => m.dateDebut.getTime() < now);

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Rendez-vous</h1>
          <p className="text-gray-500 text-sm">{upcoming.length} à venir · {past.length} passés</p>
        </div>
        <Link href="/meetings/nouveau" className="btn-primary">+ Nouveau RDV</Link>
      </header>

      <section>
        <h2 className="font-semibold mb-3">📅 À venir</h2>
        <div className="card divide-y">
          {upcoming.map((m) => <MeetingRow key={m.id} m={m} />)}
          {upcoming.length === 0 && <div className="p-5 text-sm text-gray-400">Aucun RDV à venir</div>}
        </div>
      </section>

      <section>
        <h2 className="font-semibold mb-3 mt-6">⏪ Passés</h2>
        <div className="card divide-y">
          {past.slice(0, 20).map((m) => <MeetingRow key={m.id} m={m} />)}
          {past.length === 0 && <div className="p-5 text-sm text-gray-400">Aucun RDV passé</div>}
        </div>
      </section>
    </div>
  );
}

function MeetingRow({ m }: { m: any }) {
  return (
    <div className="p-4 flex items-center justify-between gap-4">
      <div className="flex-1">
        <div className="font-medium">{m.titre}</div>
        <div className="text-xs text-gray-500 mt-0.5">
          {m.lieu ?? "—"} · {m.type} · {m.ownerName ?? "—"}
        </div>
        <div className="text-xs text-gray-400 mt-1 flex flex-wrap gap-2">
          {m.candidat && <Link href={`/candidats/${m.candidat.id}`} className="text-brand-600 hover:underline">👤 {m.candidat.prenom} {m.candidat.nom}</Link>}
          {m.entreprise && <Link href={`/entreprises/${m.entreprise.id}`} className="text-brand-600 hover:underline">🏢 {m.entreprise.raisonSociale}</Link>}
          {m.deal && <Link href={`/deals/${m.deal.id}`} className="text-brand-600 hover:underline">💼 {m.deal.titre}</Link>}
        </div>
      </div>
      <div className="text-right">
        <div className="text-sm font-medium">{new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short" }).format(m.dateDebut)}</div>
        <span className={`badge mt-1 ${m.statut === "realise" ? "bg-emerald-50 text-emerald-700" : m.statut === "annule" ? "bg-rose-50 text-rose-700" : "bg-blue-50 text-blue-700"}`}>{m.statut}</span>
      </div>
    </div>
  );
}
