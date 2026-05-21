import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function FicheFormation({ params }: { params: { id: string } }) {
  const f = await prisma.formation.findUnique({
    where: { id: params.id },
    include: { entite: true, candidats: true },
  });
  if (!f) notFound();
  return (
    <div className="space-y-6 max-w-4xl">
      <header>
        <Link href="/formations" className="text-sm text-brand-600 hover:underline">← Catalogue</Link>
        <h1 className="text-2xl font-bold mt-1">{f.intitule}</h1>
        <div className="flex gap-2 mt-2">
          {f.entite && <span className="badge bg-gray-100 text-gray-700">{f.entite.code}</span>}
          {f.domaine && !f.entite && <span className="badge bg-purple-100 text-purple-700">ALIOS · {f.domaine}</span>}
          <span className="badge bg-brand-50 text-brand-700">{f.niveau}</span>
          <span className="badge bg-purple-50 text-purple-700">{f.type}</span>
        </div>
      </header>

      <section className="card p-5 grid grid-cols-2 gap-y-3 text-sm">
        <Row label="Voie d'accès" value={f.voieAcces} />
        <Row label="Durée" value={f.dureeMois ? `${f.dureeMois} mois` : "—"} />
        <Row label="Rythme alternance" value={f.rythme} />
        <Row label="Secteur(s) cible" value={f.secteurs} />
        <Row label="Métiers visés" value={f.metiers} />
        <Row label="Prérequis" value={f.prerequis} />
        <Row label="Financements" value={f.financements} />
        <Row label="Aides employeur" value={f.aidesEmployeur} />
        <Row label="Taux de réussite" value={f.tauxReussite ? `${f.tauxReussite}%` : null} />
        <Row label="Taux d'insertion" value={f.tauxInsertion ? `${f.tauxInsertion}%` : null} />
      </section>

      <section className="card p-5">
        <h2 className="font-semibold mb-3">Candidats inscrits sur cette formation ({f.candidats.length})</h2>
        <ul className="divide-y">
          {f.candidats.map((c) => (
            <li key={c.id} className="py-2 flex justify-between text-sm">
              <Link href={`/candidats/${c.id}`} className="text-brand-600 hover:underline">{c.prenom} {c.nom}</Link>
              <span className="text-gray-400">Étape {c.etapePipeline}</span>
            </li>
          ))}
          {f.candidats.length === 0 && <li className="text-sm text-gray-400 py-2">Aucun candidat</li>}
        </ul>
      </section>
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string | null }) {
  return (
    <>
      <div className="text-gray-500">{label}</div>
      <div className="font-medium">{value || "—"}</div>
    </>
  );
}
