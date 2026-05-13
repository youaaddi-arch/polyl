import { ajouterNote } from "@/actions/hubspot";

export default function AjouterNote({ candidatId, entrepriseId, dealId }: { candidatId?: string; entrepriseId?: string; dealId?: string }) {
  return (
    <form action={ajouterNote} className="card p-4 space-y-2">
      {candidatId && <input type="hidden" name="candidatId" value={candidatId} />}
      {entrepriseId && <input type="hidden" name="entrepriseId" value={entrepriseId} />}
      {dealId && <input type="hidden" name="dealId" value={dealId} />}
      <textarea
        name="contenu"
        placeholder="Ajouter une note (compte rendu d'appel, info importante...)"
        rows={3}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
      />
      <div className="flex justify-end">
        <button className="btn-primary text-xs">+ Ajouter la note</button>
      </div>
    </form>
  );
}
