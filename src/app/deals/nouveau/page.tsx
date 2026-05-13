import Link from "next/link";
import { prisma } from "@/lib/db";
import { creerDeal } from "@/actions/hubspot";

export const dynamic = "force-dynamic";

export default async function NouveauDealPage() {
  const [pipeline, entreprises, candidats, formations] = await Promise.all([
    prisma.dealPipeline.findFirst({ where: { isDefault: true } }),
    prisma.entreprise.findMany({ orderBy: { raisonSociale: "asc" } }),
    prisma.candidat.findMany({ orderBy: { nom: "asc" } }),
    prisma.formation.findMany({ include: { entite: true }, orderBy: { intitule: "asc" } }),
  ]);
  const stages = pipeline ? (JSON.parse(pipeline.stages) as { cle: string; libelle: string }[]) : [];

  return (
    <div className="max-w-3xl">
      <Link href="/deals" className="text-sm text-brand-600 hover:underline">← Deals</Link>
      <h1 className="text-2xl font-bold mt-2 mb-6">Nouveau deal</h1>
      <form action={creerDeal} className="card p-6 space-y-4">
        <label className="block">
          <span className="block text-sm font-medium text-gray-700 mb-1">Titre *</span>
          <input name="titre" required className="w-full rounded-lg border border-gray-300 px-3 py-2" />
        </label>
        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="block text-sm font-medium text-gray-700 mb-1">Montant (€)</span>
            <input name="montant" type="number" className="w-full rounded-lg border border-gray-300 px-3 py-2" />
          </label>
          <label className="block">
            <span className="block text-sm font-medium text-gray-700 mb-1">Probabilité (%)</span>
            <input name="probabilite" type="number" defaultValue={50} min={0} max={100} className="w-full rounded-lg border border-gray-300 px-3 py-2" />
          </label>
          <label className="block">
            <span className="block text-sm font-medium text-gray-700 mb-1">Date de clôture prévue</span>
            <input name="dateClotPrevue" type="date" className="w-full rounded-lg border border-gray-300 px-3 py-2" />
          </label>
          <label className="block">
            <span className="block text-sm font-medium text-gray-700 mb-1">Étape pipeline</span>
            <select name="etapeCle" className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white">
              {stages.map((s) => <option key={s.cle} value={s.cle}>{s.libelle}</option>)}
            </select>
          </label>
        </div>
        <label className="block">
          <span className="block text-sm font-medium text-gray-700 mb-1">Commercial responsable</span>
          <input name="ownerName" className="w-full rounded-lg border border-gray-300 px-3 py-2" />
        </label>
        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="block text-sm font-medium text-gray-700 mb-1">Entreprise</span>
            <select name="entrepriseId" className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white">
              <option value="">— aucune —</option>
              {entreprises.map((e) => <option key={e.id} value={e.id}>{e.raisonSociale}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="block text-sm font-medium text-gray-700 mb-1">Candidat associé</span>
            <select name="candidatId" className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white">
              <option value="">— aucun —</option>
              {candidats.map((c) => <option key={c.id} value={c.id}>{c.prenom} {c.nom}</option>)}
            </select>
          </label>
        </div>
        <label className="block">
          <span className="block text-sm font-medium text-gray-700 mb-1">Formation visée</span>
          <select name="formationId" className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white">
            <option value="">— aucune —</option>
            {formations.map((f) => <option key={f.id} value={f.id}>[{f.entite.code}] {f.intitule}</option>)}
          </select>
        </label>
        <div className="flex justify-end gap-2 pt-2">
          <Link href="/deals" className="btn-secondary">Annuler</Link>
          <button className="btn-primary" type="submit">Créer le deal</button>
        </div>
      </form>
    </div>
  );
}
