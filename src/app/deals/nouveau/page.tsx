import Link from "next/link";
import { prisma } from "@/lib/db";
import { creerDeal } from "@/actions/hubspot";
import { TYPES_OPPORTUNITE } from "@/lib/options";

export const dynamic = "force-dynamic";

export default async function NouveauDealPage() {
  const [entreprises, candidats, formations, entites] = await Promise.all([
    prisma.entreprise.findMany({ orderBy: { raisonSociale: "asc" } }),
    prisma.candidat.findMany({ orderBy: { nom: "asc" } }),
    prisma.formation.findMany({ include: { entite: true }, orderBy: { intitule: "asc" } }),
    prisma.entite.findMany({ orderBy: { code: "asc" } }),
  ]);

  return (
    <div className="max-w-3xl">
      <Link href="/deals" className="text-sm text-hubspot-orange hover:underline">← Opportunités</Link>
      <h1 className="text-2xl font-bold mt-2 mb-2">Nouvelle opportunité</h1>
      <p className="text-hubspot-text-muted text-sm mb-6">Une opportunité = une candidature. Sélectionnez d'abord le type pour appliquer le bon pipeline.</p>

      <form action={creerDeal} className="card p-6 space-y-4">
        <label className="block">
          <span className="block text-sm font-medium text-hubspot-text mb-1">Type d'opportunité * (détermine le pipeline)</span>
          <select name="type" required className="w-full rounded border border-hubspot-border px-3 py-2 bg-white">
            {TYPES_OPPORTUNITE.map((t) => (
              <option key={t.cle} value={t.cle}>
                {t.libelle} ({t.stages.length} étapes)
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="block text-sm font-medium text-hubspot-text mb-1">Titre *</span>
          <input name="titre" required placeholder="ex : Apprentissage 2026 — Léa Martin" className="w-full rounded border border-hubspot-border px-3 py-2" />
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="block text-sm font-medium text-hubspot-text mb-1">Apprenant *</span>
            <select name="candidatId" required className="w-full rounded border border-hubspot-border px-3 py-2 bg-white">
              <option value="">— choisir —</option>
              {candidats.map((c) => <option key={c.id} value={c.id}>{c.prenom} {c.nom}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="block text-sm font-medium text-hubspot-text mb-1">Formation visée</span>
            <select name="formationId" className="w-full rounded border border-hubspot-border px-3 py-2 bg-white">
              <option value="">— choisir —</option>
              {formations.map((f) => <option key={f.id} value={f.id}>[{f.entite.code}] {f.intitule}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="block text-sm font-medium text-hubspot-text mb-1">Centre / Entité</span>
            <select name="centreCode" className="w-full rounded border border-hubspot-border px-3 py-2 bg-white">
              <option value="">— choisir —</option>
              {entites.map((e) => <option key={e.id} value={e.code}>{e.code} — {e.specialite}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="block text-sm font-medium text-hubspot-text mb-1">Entreprise (alternance)</span>
            <select name="entrepriseId" className="w-full rounded border border-hubspot-border px-3 py-2 bg-white">
              <option value="">— aucune (formation seule) —</option>
              {entreprises.map((e) => <option key={e.id} value={e.id}>{e.raisonSociale}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="block text-sm font-medium text-hubspot-text mb-1">Montant prévisionnel (€)</span>
            <input name="montant" type="number" className="w-full rounded border border-hubspot-border px-3 py-2" />
          </label>
          <label className="block">
            <span className="block text-sm font-medium text-hubspot-text mb-1">Date d'ouverture</span>
            <input name="dateOuverture" type="date" defaultValue={new Date().toISOString().slice(0, 10)} className="w-full rounded border border-hubspot-border px-3 py-2" />
          </label>
          <label className="block">
            <span className="block text-sm font-medium text-hubspot-text mb-1">Date de clôture prévue</span>
            <input name="dateClotPrevue" type="date" className="w-full rounded border border-hubspot-border px-3 py-2" />
          </label>
          <label className="block">
            <span className="block text-sm font-medium text-hubspot-text mb-1">Commercial responsable</span>
            <input name="ownerName" placeholder="ex : Sophie Martin" className="w-full rounded border border-hubspot-border px-3 py-2" />
          </label>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Link href="/deals" className="btn-secondary">Annuler</Link>
          <button className="btn-primary" type="submit">Créer l'opportunité</button>
        </div>
      </form>
    </div>
  );
}
