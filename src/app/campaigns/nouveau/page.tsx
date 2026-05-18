import Link from "next/link";
import { prisma } from "@/lib/db";
import { creerCampagne } from "@/actions/hubspot";

export const dynamic = "force-dynamic";

export default async function NouvelleCampagnePage({ searchParams }: { searchParams: Record<string, string> }) {
  const [listes, templates] = await Promise.all([
    prisma.liste.findMany({ where: { objet: "candidat" }, orderBy: { createdAt: "desc" } }),
    prisma.emailTemplate.findMany({ orderBy: { nom: "asc" } }),
  ]);

  // Si on vient de la page candidats avec des filtres, on les affiche
  const filtresActifs = Object.keys(searchParams).filter((k) => !["source", "cols", "vue"].includes(k));

  // Comptage estimé des destinataires en fonction des filtres
  const where: any = {};
  if (searchParams.statut) where.statut = searchParams.statut;
  if (searchParams.statutLead) where.statutLead = searchParams.statutLead;
  if (searchParams.situation) where.situation = searchParams.situation;
  if (searchParams.financementChoisi) where.financementChoisi = searchParams.financementChoisi;
  if (searchParams.persona) where.persona = searchParams.persona;
  if (searchParams.typeContratSouhaite) where.typeContratSouhaite = searchParams.typeContratSouhaite;
  if (searchParams.mobiliteGeo) where.mobiliteGeo = searchParams.mobiliteGeo;
  if (searchParams.prescripteur) where.prescripteur = searchParams.prescripteur;
  if (searchParams.permisB) where.permisB = searchParams.permisB === "true";
  if (searchParams.consentNewsletter) where.consentNewsletter = true;
  const nbDestinataires = Object.keys(where).length > 0 ? await prisma.candidat.count({ where }) : 0;

  return (
    <div className="max-w-3xl">
      <Link href="/campaigns" className="text-sm text-hubspot-orange hover:underline">← Email campaigns</Link>
      <h1 className="text-2xl font-bold mt-2 mb-2">Nouvelle campagne email</h1>
      <p className="text-hubspot-text-muted text-sm mb-6">Envoyez un email marketing à une liste de candidats ciblée.</p>

      {filtresActifs.length > 0 && (
        <div className="card p-4 mb-4 bg-orange-50 border-hubspot-orange">
          <div className="flex items-start gap-2">
            <span className="text-xl">🎯</span>
            <div className="flex-1">
              <div className="font-semibold text-sm text-hubspot-orange">Audience pré-ciblée depuis la liste filtrée</div>
              <div className="text-xs text-hubspot-text mt-1">
                <strong>{nbDestinataires}</strong> candidat(s) correspondent aux filtres :
              </div>
              <div className="flex gap-1 flex-wrap mt-2">
                {filtresActifs.map((k) => (
                  <span key={k} className="badge bg-white text-hubspot-text border border-hubspot-border text-xs">
                    {k} = {searchParams[k]}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <form action={creerCampagne} className="card p-6 space-y-4">
        <label className="block">
          <span className="block text-sm font-medium text-hubspot-text mb-1">Nom de la campagne *</span>
          <input name="nom" required placeholder="ex : Newsletter Mai - Apprenants en cours" className="w-full rounded border border-hubspot-border px-3 py-2 text-sm" />
        </label>
        <label className="block">
          <span className="block text-sm font-medium text-hubspot-text mb-1">Sujet de l'email *</span>
          <input name="sujet" required className="w-full rounded border border-hubspot-border px-3 py-2 text-sm" />
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="block text-sm font-medium text-hubspot-text mb-1">Liste de destinataires</span>
            <select name="listeId" className="w-full rounded border border-hubspot-border px-3 py-2 bg-white text-sm">
              <option value="">— filtres actuels ({nbDestinataires} contacts) —</option>
              {listes.map((l) => <option key={l.id} value={l.id}>👁 {l.nom}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="block text-sm font-medium text-hubspot-text mb-1">Template email</span>
            <select name="templateId" className="w-full rounded border border-hubspot-border px-3 py-2 bg-white text-sm">
              <option value="">— pas de template —</option>
              {templates.map((t) => <option key={t.id} value={t.id}>{t.nom}</option>)}
            </select>
          </label>
        </div>

        {/* Filtres reportés en hidden si on vient de la page candidats */}
        {filtresActifs.map((k) => <input key={k} type="hidden" name={`filtre_${k}`} value={searchParams[k]} />)}

        <label className="block">
          <span className="block text-sm font-medium text-hubspot-text mb-1">Contenu HTML</span>
          <textarea name="contenu" rows={8} placeholder="<p>Bonjour {{prenom}},</p><p>Découvrez notre offre...</p>" className="w-full rounded border border-hubspot-border px-3 py-2 text-sm font-mono" />
          <div className="text-xs text-hubspot-text-muted mt-1">
            Variables : <code>{`{{prenom}}, {{nom}}, {{email}}, {{ville}}, {{formation}}, {{entite}}`}</code>
          </div>
        </label>

        <label className="block">
          <span className="block text-sm font-medium text-hubspot-text mb-1">Date d'envoi prévue (optionnel)</span>
          <input name="dateEnvoi" type="datetime-local" className="w-full rounded border border-hubspot-border px-3 py-2 text-sm" />
        </label>

        <div className="flex justify-end gap-2 pt-2">
          <Link href="/campaigns" className="btn-secondary">Annuler</Link>
          <button name="statut" value="brouillon" className="btn-secondary">Enregistrer en brouillon</button>
          <button name="statut" value="planifiee" className="btn-primary">📤 Planifier l'envoi</button>
        </div>
      </form>
    </div>
  );
}
