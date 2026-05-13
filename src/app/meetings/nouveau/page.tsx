import Link from "next/link";
import { prisma } from "@/lib/db";
import { creerMeeting } from "@/actions/hubspot";

export const dynamic = "force-dynamic";

export default async function NouveauMeetingPage() {
  const [candidats, entreprises] = await Promise.all([
    prisma.candidat.findMany({ orderBy: { nom: "asc" } }),
    prisma.entreprise.findMany({ orderBy: { raisonSociale: "asc" } }),
  ]);

  return (
    <div className="max-w-2xl">
      <Link href="/meetings" className="text-sm text-brand-600 hover:underline">← Rendez-vous</Link>
      <h1 className="text-2xl font-bold mt-2 mb-6">Nouveau rendez-vous</h1>
      <form action={creerMeeting} className="card p-6 space-y-4">
        <label className="block">
          <span className="block text-sm font-medium text-gray-700 mb-1">Titre *</span>
          <input name="titre" required className="w-full rounded-lg border border-gray-300 px-3 py-2" />
        </label>
        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="block text-sm font-medium text-gray-700 mb-1">Date & heure de début *</span>
            <input name="dateDebut" type="datetime-local" required className="w-full rounded-lg border border-gray-300 px-3 py-2" />
          </label>
          <label className="block">
            <span className="block text-sm font-medium text-gray-700 mb-1">Durée (minutes)</span>
            <input name="dureeMin" type="number" defaultValue={60} className="w-full rounded-lg border border-gray-300 px-3 py-2" />
          </label>
          <label className="block">
            <span className="block text-sm font-medium text-gray-700 mb-1">Type</span>
            <select name="type" className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white">
              <option value="entretien">Entretien</option>
              <option value="jic">Journée d'info collective</option>
              <option value="suivi">Suivi pédagogique</option>
              <option value="autre">Autre</option>
            </select>
          </label>
          <label className="block">
            <span className="block text-sm font-medium text-gray-700 mb-1">Lieu / Visio</span>
            <input name="lieu" placeholder="Adresse ou lien Meet/Zoom" className="w-full rounded-lg border border-gray-300 px-3 py-2" />
          </label>
        </div>
        <label className="block">
          <span className="block text-sm font-medium text-gray-700 mb-1">Responsable</span>
          <input name="ownerName" className="w-full rounded-lg border border-gray-300 px-3 py-2" />
        </label>
        <div className="grid grid-cols-2 gap-4">
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
          <Link href="/meetings" className="btn-secondary">Annuler</Link>
          <button className="btn-primary" type="submit">Créer le RDV</button>
        </div>
      </form>
    </div>
  );
}
