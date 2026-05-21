import { prisma } from "@/lib/db";
import { creerEntreprise } from "@/actions/entreprises";
import { PERSONAS_ENTREPRISE } from "@/lib/entites";
import SiretAutoFill from "@/components/SiretAutoFill";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function NouvelleEntreprisePage() {
  const entites = await prisma.entite.findMany({ orderBy: { code: "asc" } });
  return (
    <div className="max-w-4xl">
      <Link href="/entreprises" className="text-sm text-hubspot-orange hover:underline">← Entreprises</Link>
      <h1 className="text-2xl font-bold mt-2 mb-6">Nouvelle entreprise</h1>

      <form action={creerEntreprise} className="space-y-6">

        <section className="card p-6 space-y-4">
          <h2 className="font-semibold border-b border-hubspot-border pb-2">🏢 Identification légale</h2>
          <SiretAutoFill />
          <Field label="Raison sociale *" name="raisonSociale" required />
          <div className="grid grid-cols-2 gap-4">
            <Field label="SIREN" name="siren" placeholder="9 chiffres (auto)" />
            <Field label="Code NAF / APE" name="naf" placeholder="ex : 4711F" />
            <Field label="N° TVA intracommunautaire" name="numTVA" placeholder="FR..." />
            <Select label="Forme juridique" name="formeJuridique" options={[
              { value: "", label: "—" },
              { value: "SARL", label: "SARL" }, { value: "SAS", label: "SAS" }, { value: "SA", label: "SA" },
              { value: "EURL", label: "EURL" }, { value: "SASU", label: "SASU" }, { value: "SCI", label: "SCI" },
              { value: "Association", label: "Association" }, { value: "Indépendant", label: "Indépendant" },
            ]} />
            <Field label="Capital social (€)" name="capitalSocial" type="number" />
          </div>
        </section>

        <section className="card p-6 space-y-4">
          <h2 className="font-semibold border-b border-hubspot-border pb-2">📊 Taille & secteur</h2>
          <div className="grid grid-cols-2 gap-4">
            <Select label="Taille" name="taille" options={[
              { value: "", label: "—" },
              { value: "TPE", label: "TPE (< 10 salariés)" },
              { value: "PME", label: "PME (10-250)" },
              { value: "ETI", label: "ETI (250-5000)" },
              { value: "GE", label: "Grande entreprise (> 5000)" },
            ]} />
            <Field label="Effectif" name="effectif" type="number" />
            <Field label="Chiffre d'affaires (€)" name="chiffreAffaires" type="number" />
            <Field label="Secteur d'activité" name="secteur" placeholder="ex : Restauration, BTP…" />
            <Field label="Secteur détaillé" name="secteurDetail" />
            <Select label="Persona" name="persona" options={[{ value: "", label: "—" }, ...PERSONAS_ENTREPRISE.map((p) => ({ value: p.code, label: `${p.code} — ${p.nom}` }))]} />
          </div>
        </section>

        <section className="card p-6 space-y-4">
          <h2 className="font-semibold border-b border-hubspot-border pb-2">📞 Coordonnées</h2>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Téléphone standard" name="telephoneStandard" type="tel" placeholder="01 23 45 67 89" />
            <Field label="Email général" name="email" type="email" placeholder="contact@..." />
            <Field label="Site web" name="siteWeb" placeholder="https://www..." />
            <Field label="LinkedIn URL" name="linkedinUrl" placeholder="https://linkedin.com/company/..." />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2"><Field label="Adresse" name="adresse" /></div>
            <Field label="Complément" name="complementAdresse" />
            <Field label="Code postal" name="codePostal" />
            <div className="col-span-2"><Field label="Ville" name="ville" /></div>
            <Field label="Pays" name="pays" placeholder="France" />
          </div>
        </section>

        <section className="card p-6 space-y-4">
          <h2 className="font-semibold border-b border-hubspot-border pb-2">🎯 Besoins de recrutement</h2>
          <p className="text-sm text-hubspot-text-muted">Cochez tous les besoins identifiés pour cette entreprise.</p>
          <div className="grid grid-cols-2 gap-3">
            <Checkbox label="Recherche des alternants" name="rechercheAlternants" />
            <Checkbox label="Recherche en CDI" name="rechercheCDI" />
            <Checkbox label="Recherche en CDD" name="rechercheCDD" />
            <Checkbox label="Propose des stages" name="rechercheStage" />
            <Checkbox label="Formation continue pour ses salariés" name="rechercheFormationSalaries" />
          </div>
          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-hubspot-border">
            <Select label="Type d'alternance" name="typeAlternance" options={[
              { value: "", label: "—" },
              { value: "apprentissage", label: "Apprentissage" },
              { value: "professionnalisation", label: "Professionnalisation" },
              { value: "both", label: "Les deux" },
            ]} />
            <Field label="Nb alternants recherchés" name="nbAlternantsRecherches" type="number" />
            <Field label="Nb postes CDI recherchés" name="nbCDIRecherches" type="number" />
            <Field label="Date de besoin alternance" name="dateBesoinAlternance" type="date" />
            <Field label="Niveaux recherchés (CSV)" name="niveauxRecherches" placeholder="Niveau 3, Niveau 5" />
            <Field label="Métiers recherchés (CSV)" name="metiersRecherches" />
          </div>
        </section>

        <section className="card p-6 space-y-4">
          <h2 className="font-semibold border-b border-hubspot-border pb-2">📋 Conventions & OPCO</h2>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Convention collective" name="conventionCollective" />
            <Field label="OPCO de rattachement" name="opcoRattache" placeholder="AKTO, OCAPIAT, ATLAS…" />
            <Checkbox label="Accord OPCO en place" name="accordOPCO" />
            <Checkbox label="Accord tutorat en place" name="accordTutorat" />
          </div>
        </section>

        <section className="card p-6 space-y-4">
          <h2 className="font-semibold border-b border-hubspot-border pb-2">👥 Contacts décisionnaires</h2>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Responsable RH — Nom" name="responsableRHNom" />
            <Field label="Responsable RH — Email" name="responsableRHEmail" type="email" />
            <Field label="Responsable RH — Téléphone" name="responsableRHTelephone" type="tel" />
            <Field label="Dirigeant — Nom" name="dirigeantNom" />
            <Field label="Dirigeant — Email" name="dirigeantEmail" type="email" />
          </div>
        </section>

        <section className="card p-6 space-y-4">
          <h2 className="font-semibold border-b border-hubspot-border pb-2">🎯 Source & qualification</h2>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Source de détection" name="sourceDetection" placeholder="Indeed, France Travail, LinkedIn Jobs…" />
            <Field label="URL de l'offre" name="urlOffre" />
            <Select label="Centre / Entité associée" name="entiteId" options={[{ value: "", label: "—" }, ...entites.map((e) => ({ value: e.id, label: `${e.code} — ${e.specialite}` }))]} />
            <Field label="Commercial dédié" name="commercialDedie" />
            <Field label="Score potentiel (0-100)" name="scorePotentiel" type="number" />
          </div>
        </section>

        <div className="flex justify-end gap-2 sticky bottom-4 bg-white p-4 rounded shadow-hs-lg border border-hubspot-border">
          <Link href="/entreprises" className="btn-secondary">Annuler</Link>
          <button className="btn-primary" type="submit">Créer l'entreprise</button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, name, type = "text", required, placeholder }: { label: string; name: string; type?: string; required?: boolean; placeholder?: string }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-hubspot-text mb-1">{label}</span>
      <input name={name} type={type} required={required} placeholder={placeholder} className="w-full rounded border border-hubspot-border px-3 py-2 text-sm focus:border-hubspot-orange focus:ring-1 focus:ring-hubspot-orange outline-none" />
    </label>
  );
}
function Select({ label, name, options }: { label: string; name: string; options: { value: string; label: string }[] }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-hubspot-text mb-1">{label}</span>
      <select name={name} className="w-full rounded border border-hubspot-border px-3 py-2 bg-white text-sm">
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
