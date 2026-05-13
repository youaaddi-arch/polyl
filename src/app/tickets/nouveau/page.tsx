import Link from "next/link";
import { prisma } from "@/lib/db";
import { creerTicket } from "@/actions/hubspot";

export const dynamic = "force-dynamic";

export default async function NouveauTicketPage() {
  const [candidats, entreprises] = await Promise.all([
    prisma.candidat.findMany({ orderBy: { nom: "asc" } }),
    prisma.entreprise.findMany({ orderBy: { raisonSociale: "asc" } }),
  ]);
  return (
    <div className="max-w-2xl">
      <Link href="/tickets" className="text-sm text-brand-600 hover:underline">← Tickets</Link>
      <h1 className="text-2xl font-bold mt-2 mb-6">Nouveau ticket</h1>
      <form action={creerTicket} className="card p-6 space-y-4">
        <label className="block">
          <span className="block text-sm font-medium text-gray-700 mb-1">Sujet *</span>
          <input name="sujet" required className="w-full rounded-lg border border-gray-300 px-3 py-2" />
        </label>
        <label className="block">
          <span className="block text-sm font-medium text-gray-700 mb-1">Description</span>
          <textarea name="description" rows={4} className="w-full rounded-lg border border-gray-300 px-3 py-2" />
        </label>
        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="block text-sm font-medium text-gray-700 mb-1">Catégorie</span>
            <select name="categorie" className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white">
              <option value="">— choisir —</option>
              <option value="pedagogique">Pédagogique</option>
              <option value="administratif">Administratif</option>
              <option value="financier">Financier</option>
              <option value="technique">Technique</option>
            </select>
          </label>
          <label className="block">
            <span className="block text-sm font-medium text-gray-700 mb-1">Priorité</span>
            <select name="priorite" defaultValue="normale" className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white">
              <option value="basse">Basse</option>
              <option value="normale">Normale</option>
              <option value="haute">Haute</option>
              <option value="urgente">Urgente</option>
            </select>
          </label>
          <label className="block">
            <span className="block text-sm font-medium text-gray-700 mb-1">Candidat</span>
            <select name="candidatId" className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white">
              <option value="">— aucun —</option>
              {candidats.map((c) => <option key={c.id} value={c.id}>{c.prenom} {c.nom}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="block text-sm font-medium text-gray-700 mb-1">Entreprise</span>
            <select name="entrepriseId" className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white">
              <option value="">— aucune —</option>
              {entreprises.map((e) => <option key={e.id} value={e.id}>{e.raisonSociale}</option>)}
            </select>
          </label>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Link href="/tickets" className="btn-secondary">Annuler</Link>
          <button className="btn-primary" type="submit">Créer le ticket</button>
        </div>
      </form>
    </div>
  );
}
