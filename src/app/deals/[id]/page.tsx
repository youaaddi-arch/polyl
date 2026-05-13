import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { changerStageDeal } from "@/actions/hubspot";
import AjouterNote from "@/components/AjouterNote";
import Timeline from "@/components/Timeline";

export const dynamic = "force-dynamic";

export default async function FicheDeal({ params }: { params: { id: string } }) {
  const d = await prisma.deal.findUnique({
    where: { id: params.id },
    include: {
      pipeline: true,
      entreprise: true,
      candidat: true,
      formation: { include: { entite: true } },
      notes: { orderBy: { createdAt: "desc" } },
      meetings: { orderBy: { dateDebut: "desc" } },
      taches: true,
    },
  });
  if (!d) notFound();
  const stages = d.pipeline ? (JSON.parse(d.pipeline.stages) as { cle: string; libelle: string; probabilite: number }[]) : [];
  const stageCourante = stages.find((s) => s.cle === d.etapeCle);

  return (
    <div className="space-y-6 max-w-6xl">
      <header>
        <Link href="/deals" className="text-sm text-brand-600 hover:underline">← Deals</Link>
        <h1 className="text-2xl font-bold mt-1">{d.titre}</h1>
        <div className="flex flex-wrap items-center gap-2 mt-2">
          <span className="badge bg-brand-50 text-brand-700">{stageCourante?.libelle ?? d.etapeCle}</span>
          {d.montant && <span className="badge bg-emerald-50 text-emerald-700">{d.montant.toLocaleString("fr-FR")} €</span>}
          <span className="badge bg-gray-100 text-gray-700">{d.probabilite}% proba</span>
          {d.ownerName && <span className="text-xs text-gray-500">· {d.ownerName}</span>}
        </div>
      </header>

      <section className="card p-5">
        <h2 className="font-semibold mb-3">Étapes du pipeline</h2>
        <div className="flex gap-2 flex-wrap">
          {stages.map((s) => (
            <form key={s.cle} action={changerStageDeal}>
              <input type="hidden" name="id" value={d.id} />
              <input type="hidden" name="etapeCle" value={s.cle} />
              <button className={`badge px-3 py-1.5 ${d.etapeCle === s.cle ? "bg-brand-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-brand-50"}`}>
                {s.libelle}
              </button>
            </form>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card p-5 space-y-3 text-sm">
          <h2 className="font-semibold">Détails</h2>
          <Row label="Entreprise" value={d.entreprise && <Link href={`/entreprises/${d.entreprise.id}`} className="text-brand-600 hover:underline">{d.entreprise.raisonSociale}</Link>} />
          <Row label="Candidat" value={d.candidat && <Link href={`/candidats/${d.candidat.id}`} className="text-brand-600 hover:underline">{d.candidat.prenom} {d.candidat.nom}</Link>} />
          <Row label="Formation" value={d.formation?.intitule} />
          <Row label="Date clôture prévue" value={d.dateClotPrevue && new Intl.DateTimeFormat("fr-FR").format(d.dateClotPrevue)} />
          <Row label="Statut" value={d.statut} />
        </div>

        <div className="card p-5 lg:col-span-2 space-y-4">
          <h2 className="font-semibold">Notes & Activités</h2>
          <AjouterNote dealId={d.id} />
          <ul className="divide-y">
            {d.notes.map((n) => (
              <li key={n.id} className="py-3 text-sm">
                <div className="text-xs text-gray-500">{n.auteur} · {new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short" }).format(n.createdAt)}</div>
                <p className="mt-1">{n.contenu}</p>
              </li>
            ))}
            {d.notes.length === 0 && <li className="text-sm text-gray-400 py-2">Aucune note</li>}
          </ul>
        </div>
      </section>
    </div>
  );
}

function Row({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-gray-500">{label}</span>
      <span className="text-gray-900 font-medium text-right">{value || "—"}</span>
    </div>
  );
}
