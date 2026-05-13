import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { PIPELINE_ENTREPRISE } from "@/lib/pipelines";
import { changerEtapeEntreprise } from "@/actions/entreprises";

export const dynamic = "force-dynamic";

export default async function FicheEntreprise({ params }: { params: { id: string } }) {
  const e = await prisma.entreprise.findUnique({
    where: { id: params.id },
    include: { entite: true, contacts: true, offres: true, contrats: { include: { candidat: true } }, taches: true },
  });
  if (!e) notFound();
  const etapeCourante = PIPELINE_ENTREPRISE.find((x) => x.numero === e.etapePipeline);

  return (
    <div className="space-y-6 max-w-6xl">
      <header>
        <Link href="/entreprises" className="text-sm text-brand-600 hover:underline">← Entreprises</Link>
        <h1 className="text-2xl font-bold mt-1">{e.raisonSociale}</h1>
        <div className="flex flex-wrap gap-2 mt-2">
          {e.entite && <span className="badge bg-gray-100 text-gray-700">{e.entite.code}</span>}
          {e.persona && <span className="badge bg-purple-50 text-purple-700">{e.persona}</span>}
          <span className="badge bg-brand-50 text-brand-700">Étape {e.etapePipeline} · {etapeCourante?.libelle}</span>
          <span className={`badge ${e.statut === "partenaire_actif" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{e.statut}</span>
        </div>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card p-5 space-y-3">
          <h2 className="font-semibold">Informations</h2>
          <Row label="SIRET" value={e.siret} />
          <Row label="NAF" value={e.naf} />
          <Row label="Forme juridique" value={e.formeJuridique} />
          <Row label="Taille" value={e.taille} />
          <Row label="Secteur" value={e.secteur} />
          <Row label="Ville" value={e.ville} />
        </div>

        <div className="card p-5 space-y-3">
          <h2 className="font-semibold">Source & commercial</h2>
          <Row label="Source détection" value={e.sourceDetection} />
          <Row label="URL offre" value={e.urlOffre} />
          <Row label="Commercial dédié" value={e.commercialDedie} />
          <Row label="Score potentiel" value={e.scorePotentiel ? `${e.scorePotentiel}/100` : null} />
        </div>

        <div className="card p-5 space-y-3">
          <h2 className="font-semibold">Contacts</h2>
          {e.contacts.length === 0 ? (
            <p className="text-sm text-gray-400">Aucun contact</p>
          ) : (
            <ul className="space-y-2">
              {e.contacts.map((c) => (
                <li key={c.id} className="text-sm">
                  <div className="font-medium">{c.prenom} {c.nom} {c.estMaitreApp && <span className="badge bg-amber-50 text-amber-700 ml-1">Maître app.</span>}</div>
                  <div className="text-gray-500">{c.fonction ?? "—"} · {c.email ?? "—"}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="card p-5">
        <h2 className="font-semibold mb-3">Pipeline (17 étapes)</h2>
        <ol className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {PIPELINE_ENTREPRISE.map((s) => {
            const passed = e.etapePipeline > s.numero;
            const current = e.etapePipeline === s.numero;
            return (
              <li key={s.cle} className={`flex items-center gap-3 rounded-lg p-2 ${current ? "bg-brand-50 border border-brand-200" : passed ? "opacity-60" : ""}`}>
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${current ? "bg-brand-600 text-white" : passed ? "bg-emerald-500 text-white" : "bg-gray-200 text-gray-600"}`}>
                  {passed ? "✓" : s.numero}
                </span>
                <div className="flex-1">
                  <div className="text-sm font-medium">{s.libelle}</div>
                  <div className="text-xs text-gray-500">{s.description}</div>
                </div>
                <form action={changerEtapeEntreprise}>
                  <input type="hidden" name="id" value={e.id} />
                  <input type="hidden" name="etape" value={s.numero} />
                  <button className="text-xs text-brand-600 hover:underline">Aller →</button>
                </form>
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex justify-between gap-4 text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="text-gray-900 font-medium text-right">{value || "—"}</span>
    </div>
  );
}
