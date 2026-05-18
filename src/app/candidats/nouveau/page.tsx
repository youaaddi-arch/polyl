import { prisma } from "@/lib/db";
import { creerCandidat } from "@/actions/candidats";
import { PERSONAS_CANDIDAT } from "@/lib/entites";
import { FINANCEMENTS, STATUTS_LEAD, SITUATIONS_CANDIDAT, NIVEAUX_ANGLAIS, MOBILITE_GEO, PRESCRIPTEURS } from "@/lib/options";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function NouveauCandidatPage() {
  const [entites, formations, entreprises] = await Promise.all([
    prisma.entite.findMany({ orderBy: { code: "asc" } }),
    prisma.formation.findMany({ orderBy: { intitule: "asc" }, include: { entite: true } }),
    prisma.entreprise.findMany({ orderBy: { raisonSociale: "asc" } }),
  ]);

  return (
    <div className="max-w-4xl">
      <Link href="/candidats" className="text-sm text-hubspot-orange hover:underline">← Candidats</Link>
      <h1 className="text-2xl font-bold mt-2">Nouveau candidat / apprenant</h1>
      <p className="text-hubspot-text-muted text-sm mb-6">Renseignez le maximum d'informations pour qualifier le lead.</p>

      <form action={creerCandidat} className="space-y-6">

        {/* IDENTITÉ */}
        <section className="card p-6 space-y-4">
          <h2 className="font-semibold border-b border-hubspot-border pb-2">👤 Identité</h2>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Prénom *" name="prenom" required />
            <Field label="Nom *" name="nom" required />
            <Field label="Date de naissance" name="dateNaissance" type="date" />
            <Select label="Genre" name="genre" options={[{ value: "", label: "—" }, { value: "homme", label: "Homme" }, { value: "femme", label: "Femme" }, { value: "autre", label: "Autre" }]} />
            <Field label="Nationalité" name="nationalite" placeholder="ex : Française" />
            <Field label="Numéro Sécurité sociale" name="numeroSecu" placeholder="optionnel" />
          </div>
        </section>

        {/* CONTACT */}
        <section className="card p-6 space-y-4">
          <h2 className="font-semibold border-b border-hubspot-border pb-2">📞 Coordonnées</h2>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Email *" name="email" type="email" required />
            <Field label="Téléphone principal" name="telephone" type="tel" placeholder="06 12 34 56 78" />
            <Field label="Téléphone secondaire" name="telephoneSecondaire" type="tel" />
            <Field label="LinkedIn URL" name="linkedinUrl" placeholder="https://linkedin.com/in/..." />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2"><Field label="Adresse" name="adresse" placeholder="N° et rue" /></div>
            <Field label="Code postal" name="codePostal" />
            <div className="col-span-2"><Field label="Ville" name="ville" /></div>
            <Field label="Pays" name="pays" placeholder="France" />
          </div>
        </section>

        {/* QUALIFICATION & LEAD */}
        <section className="card p-6 space-y-4">
          <h2 className="font-semibold border-b border-hubspot-border pb-2">🎯 Qualification du lead</h2>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Date de candidature" name="dateCandidature" type="date" />
            <Select label="Statut lead" name="statutLead" options={[{ value: "froid", label: "Froid" }, ...STATUTS_LEAD.map((s) => ({ value: s.code, label: s.libelle }))]} />
            <Field label="Source d'entrée" name="sourceEntree" placeholder="ATS, formulaire web…" />
            <Select label="Prescripteur" name="prescripteur" options={[{ value: "", label: "—" }, ...PRESCRIPTEURS.map((p) => ({ value: p, label: p }))]} />
            <Select label="Persona" name="persona" options={[{ value: "", label: "—" }, ...PERSONAS_CANDIDAT.map((p) => ({ value: p.code, label: `${p.code} — ${p.nom}` }))]} />
            <Field label="Score lead (0-100)" name="scoreLead" type="number" placeholder="50" />
          </div>
        </section>

        {/* FORMATION */}
        <section className="card p-6 space-y-4">
          <h2 className="font-semibold border-b border-hubspot-border pb-2">📚 Formation visée</h2>
          <div className="grid grid-cols-2 gap-4">
            <Select label="Centre / Entité" name="entiteId" options={[{ value: "", label: "—" }, ...entites.map((e) => ({ value: e.id, label: `${e.code} — ${e.specialite}` }))]} />
            <Select label="Formation" name="formationId" options={[{ value: "", label: "—" }, ...formations.map((f) => ({ value: f.id, label: `[${f.entite.code}] ${f.intitule}` }))]} />
            <Select label="Type de contrat souhaité" name="typeContratSouhaite" options={[
              { value: "", label: "—" },
              { value: "apprentissage", label: "Apprentissage" },
              { value: "professionnalisation", label: "Professionnalisation" },
              { value: "CDI", label: "CDI" },
              { value: "CDD", label: "CDD" },
              { value: "formation_continue", label: "Formation continue" },
            ]} />
            <Select label="Situation actuelle" name="situation" options={[{ value: "", label: "—" }, ...SITUATIONS_CANDIDAT.map((s) => ({ value: s, label: s }))]} />
            <Field label="Niveau actuel" name="niveauActuel" placeholder="CAP, Bac, Bac+2…" />
            <Field label="Année du Bac" name="anneeBac" type="number" placeholder="ex : 2024" />
            <Field label="Diplôme actuel" name="diplomeActuel" />
            <Field label="Expérience pro (mois)" name="experiencePro" />
          </div>
        </section>

        {/* FINANCEMENT */}
        <section className="card p-6 space-y-4">
          <h2 className="font-semibold border-b border-hubspot-border pb-2">💰 Financement</h2>
          <div className="grid grid-cols-2 gap-4">
            <Select label="Financement choisi" name="financementChoisi" options={[{ value: "", label: "— à définir —" }, ...FINANCEMENTS.map((f) => ({ value: f, label: f }))]} />
            <Field label="Montant financement (€)" name="montantFinancement" type="number" />
            <Field label="OPCO de rattachement" name="opco" placeholder="AKTO, OCAPIAT…" />
            <Field label="N° dossier OPCO" name="numeroDossierOpco" />
          </div>
        </section>

        {/* SOCIÉTÉ MATCHÉE */}
        <section className="card p-6 space-y-4">
          <h2 className="font-semibold border-b border-hubspot-border pb-2">🏢 Société matchée (alternance)</h2>
          <Select label="Société proposée / matchée" name="societeMatcheeId" options={[{ value: "", label: "— pas encore matché —" }, ...entreprises.map((e) => ({ value: e.id, label: e.raisonSociale }))]} />
        </section>

        {/* MOBILITÉ */}
        <section className="card p-6 space-y-4">
          <h2 className="font-semibold border-b border-hubspot-border pb-2">🚗 Mobilité & compétences</h2>
          <div className="grid grid-cols-2 gap-4">
            <Select label="Mobilité géographique" name="mobiliteGeo" options={[{ value: "", label: "—" }, ...MOBILITE_GEO.map((m) => ({ value: m, label: m }))]} />
            <Select label="Niveau d'anglais" name="niveauAnglais" options={[{ value: "", label: "—" }, ...NIVEAUX_ANGLAIS.map((n) => ({ value: n, label: n }))]} />
            <Checkbox label="Permis B" name="permisB" />
            <Checkbox label="Véhicule personnel" name="vehicule" />
            <Checkbox label="Reconnaissance handicap (RQTH)" name="rqth" />
          </div>
        </section>

        {/* SUIVI COMMERCIAL */}
        <section className="card p-6 space-y-4">
          <h2 className="font-semibold border-b border-hubspot-border pb-2">📋 Suivi commercial</h2>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Conseiller dédié" name="conseillerDedie" />
            <Field label="Date de relance" name="dateRelance" type="date" />
          </div>
          <label className="block">
            <span className="block text-sm font-medium text-hubspot-text mb-1">Notes</span>
            <textarea name="notes" rows={3} className="w-full rounded border border-hubspot-border px-3 py-2 text-sm" />
          </label>
        </section>

        {/* RGPD */}
        <section className="card p-6 space-y-3">
          <h2 className="font-semibold border-b border-hubspot-border pb-2">🔒 Consentements RGPD</h2>
          <Checkbox label="Consentement RGPD général" name="consentRgpd" defaultChecked />
          <Checkbox label="Accepte de recevoir la newsletter" name="consentNewsletter" />
          <Checkbox label="Accepte les SMS de notification" name="consentSms" />
          <Checkbox label="Accepte les appels téléphoniques" name="consentAppel" defaultChecked />
        </section>

        <div className="flex justify-end gap-2 sticky bottom-4 bg-white p-4 rounded shadow-hs-lg border border-hubspot-border">
          <Link href="/candidats" className="btn-secondary">Annuler</Link>
          <button className="btn-primary" type="submit">Créer le candidat</button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, name, type = "text", required, placeholder }: { label: string; name: string; type?: string; required?: boolean; placeholder?: string }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-hubspot-text mb-1">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full rounded border border-hubspot-border px-3 py-2 text-sm focus:border-hubspot-orange focus:ring-1 focus:ring-hubspot-orange outline-none"
      />
    </label>
  );
}

function Select({ label, name, options }: { label: string; name: string; options: { value: string; label: string }[] }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-hubspot-text mb-1">{label}</span>
      <select name={name} className="w-full rounded border border-hubspot-border px-3 py-2 bg-white text-sm focus:border-hubspot-orange focus:ring-1 focus:ring-hubspot-orange outline-none">
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  );
}

function Checkbox({ label, name, defaultChecked }: { label: string; name: string; defaultChecked?: boolean }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} value="true" className="w-4 h-4 accent-hubspot-orange" />
      <span className="text-sm">{label}</span>
    </label>
  );
}
