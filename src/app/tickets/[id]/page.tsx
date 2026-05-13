import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { changerStatutTicket } from "@/actions/hubspot";

export const dynamic = "force-dynamic";

const STATUTS = ["nouveau", "en_cours", "attente_client", "resolu", "ferme"];

export default async function FicheTicket({ params }: { params: { id: string } }) {
  const t = await prisma.ticket.findUnique({
    where: { id: params.id },
    include: { candidat: true, entreprise: true, notes: { orderBy: { createdAt: "desc" } } },
  });
  if (!t) notFound();
  return (
    <div className="space-y-6 max-w-4xl">
      <Link href="/tickets" className="text-sm text-brand-600 hover:underline">← Tickets</Link>
      <h1 className="text-2xl font-bold mt-1">{t.sujet}</h1>
      <div className="flex gap-2">
        <span className={`badge ${t.priorite === "urgente" ? "bg-rose-100 text-rose-700" : t.priorite === "haute" ? "bg-amber-50 text-amber-700" : "bg-gray-100 text-gray-700"}`}>{t.priorite}</span>
        <span className="badge bg-purple-50 text-purple-700">{t.categorie ?? "—"}</span>
        <span className="badge bg-brand-50 text-brand-700">{t.statut}</span>
      </div>

      <section className="card p-5">
        <h2 className="font-semibold mb-3">Changer de statut</h2>
        <div className="flex gap-2 flex-wrap">
          {STATUTS.map((s) => (
            <form key={s} action={changerStatutTicket}>
              <input type="hidden" name="id" value={t.id} />
              <input type="hidden" name="statut" value={s} />
              <button className={`badge px-3 py-1.5 ${t.statut === s ? "bg-brand-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-brand-50"}`}>
                {s.replace("_", " ")}
              </button>
            </form>
          ))}
        </div>
      </section>

      <section className="card p-5 space-y-3">
        <h2 className="font-semibold">Description</h2>
        <p className="text-sm whitespace-pre-wrap">{t.description ?? "—"}</p>
      </section>

      <section className="card p-5 space-y-2">
        <h2 className="font-semibold">Lié à</h2>
        {t.candidat && <Link href={`/candidats/${t.candidat.id}`} className="block text-sm text-brand-600 hover:underline">👤 {t.candidat.prenom} {t.candidat.nom}</Link>}
        {t.entreprise && <Link href={`/entreprises/${t.entreprise.id}`} className="block text-sm text-brand-600 hover:underline">🏢 {t.entreprise.raisonSociale}</Link>}
        {!t.candidat && !t.entreprise && <p className="text-sm text-gray-400">Non associé</p>}
      </section>
    </div>
  );
}
