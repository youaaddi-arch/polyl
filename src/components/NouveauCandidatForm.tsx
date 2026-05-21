"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { creerCandidat } from "@/actions/candidats";
import {
  NATIONALITES,
  SOURCES_ENTREE,
  SOURCES_ATS,
  STATUTS_PRO,
  ANCIENNETE_SALARIE,
  FINANCEMENTS,
  financementsSuggeres,
  NIVEAUX_ANGLAIS,
  MOBILITE_GEO,
} from "@/lib/options";

type EntiteOpt = { id: string; code: string; specialite: string };
type FormationOpt = { id: string; intitule: string; niveau: string; type: string; entiteCode: string; montant?: number | null };
type EntrepriseOpt = { id: string; raisonSociale: string };

export default function NouveauCandidatForm({
  entites,
  formations,
  entreprises,
}: {
  entites: EntiteOpt[];
  formations: FormationOpt[];
  entreprises: EntrepriseOpt[];
}) {
  const [source, setSource] = useState<string>("");
  const [statutPro, setStatutPro] = useState<string>("");
  const [reconversion, setReconversion] = useState<boolean>(false);
  const [formationManuelle, setFormationManuelle] = useState<boolean>(false);
  const [formationId, setFormationId] = useState<string>("");
  const [montantSaisi, setMontantSaisi] = useState<string>("");

  const sourceIsATS = SOURCES_ATS.includes(source);
  const isSalarie = statutPro === "salarie";

  const finSuggCodes = financementsSuggeres(statutPro || null, reconversion);
  const financementsTriees = useMemo(() => {
    const sugg = FINANCEMENTS.filter((f) => finSuggCodes.includes(f.code));
    const autres = FINANCEMENTS.filter((f) => !finSuggCodes.includes(f.code));
    return { sugg, autres };
  }, [statutPro, reconversion]);

  const formation = formations.find((f) => f.id === formationId);
  const montantAuto = formation?.montant ?? null;
  const montantAffiche = formationManuelle ? montantSaisi : (montantAuto?.toString() ?? "");

  return (
    <div className="max-w-4xl">
      <Link href="/candidats" className="text-sm text-hubspot-orange hover:underline">← Candidats</Link>
      <h1 className="text-2xl font-bold mt-2">Nouveau candidat / apprenant</h1>
      <p className="text-hubspot-text-muted text-sm mb-6">Renseignez le maximum d'informations pour qualifier le lead.</p>

      <form action={creerCandidat} className="space-y-6">

        <section className="card p-6 space-y-4">
          <h2 className="font-semibold border-b border-hubspot-border pb-2">👤 Identité</h2>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Prénom *" name="prenom" required />
            <Field label="Nom *" name="nom" required />
            <Field label="Date de naissance" name="dateNaissance" type="date" />
            <Select label="Genre" name="genre" options={[{ value: "", label: "—" }, { value: "homme", label: "Homme" }, { value: "femme", label: "Femme" }, { value: "autre", label: "Autre" }]} />
            <label className="block">
              <span className="block text-sm font-medium text-hubspot-text mb-1">Nationalité</span>
              <select name="nationalite" className="w-full rounded border border-hubspot-border px-3 py-2 bg-white text-sm">
                <option value="">— Choisir —</option>
                {NATIONALITES.map((n) => <option key={n} value={n === "—" ? "" : n} disabled={n === "—"}>{n}</option>)}
              </select>
            </label>
          </div>
        </section>

        <section className="card p-6 space-y-4">
          <h2 className="font-semibold border-b border-hubspot-border pb-2">📞 Coordonnées</h2>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Email *" name="email" type="email" required />
            <Field label="Téléphone principal" name="telephone" type="tel" placeholder="06 12 34 56 78" />
            <Field label="Téléphone secondaire" name="telephoneSecondaire" type="tel" />
            <Field label="LinkedIn URL" name="linkedinUrl" placeholder="https://linkedin.com/in/..." />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2"><Field label="Adresse" name="adresse" /></div>
            <Field label="Code postal" name="codePostal" />
            <div className="col-span-2"><Field label="Ville" name="ville" /></div>
            <Field label="Pays" name="pays" placeholder="France" />
          </div>
        </section>

        <section className="card p-6 space-y-4">
          <h2 className="font-semibold border-b border-hubspot-border pb-2">📥 Source de la candidature</h2>
          <label className="block">
            <span className="block text-sm font-medium text-hubspot-text mb-1">Source d'entrée *</span>
            <select name="sourceEntree" required value={source} onChange={(e) => setSource(e.target.value)} className="w-full rounded border border-hubspot-border px-3 py-2 bg-white text-sm">
              <option value="">— Choisir —</option>
              <optgroup label="Sites d'emploi (auto-remplissage)">
                {SOURCES_ENTREE.filter((s) => s.type === "ats").map((s) => <option key={s.code} value={s.code}>{s.libelle}</option>)}
              </optgroup>
              <optgroup label="Web">
                {SOURCES_ENTREE.filter((s) => s.type === "web").map((s) => <option key={s.code} value={s.code}>{s.libelle}</option>)}
              </optgroup>
              <optgroup label="Physique / Entrant">
                {SOURCES_ENTREE.filter((s) => ["physique", "tel", "email"].includes(s.type)).map((s) => <option key={s.code} value={s.code}>{s.libelle}</option>)}
              </optgroup>
              <optgroup label="Prescripteur">
                {SOURCES_ENTREE.filter((s) => s.type === "prescripteur").map((s) => <option key={s.code} value={s.code}>{s.libelle}</option>)}
              </optgroup>
              <optgroup label="Autres">
                {SOURCES_ENTREE.filter((s) => ["social", "off", "autre"].includes(s.type)).map((s) => <option key={s.code} value={s.code}>{s.libelle}</option>)}
              </optgroup>
            </select>
          </label>

          {sourceIsATS && (
            <div className="bg-blue-50 border border-blue-200 rounded p-4 space-y-3">
              <p className="text-xs font-semibold text-blue-900">📡 Candidature externe — ces champs seront remontés automatiquement par l'API à terme</p>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Date de candidature" name="dateCandidature" type="date" defaultValue={new Date().toISOString().slice(0, 10)} />
                <Field label="Poste visé" name="posteVise" placeholder="ex : Alternant·e commercial·e" />
                <Field label="Formation souhaitée (texte libre)" name="formationSouhaiteeLibre" placeholder="ex : Bachelor Commerce" />
                <Field label="URL du CV" name="cv" placeholder="https://..." />
              </div>
              <input type="hidden" name="apiSource" value={source} />
            </div>
          )}
        </section>

        <section className="card p-6 space-y-4">
          <h2 className="font-semibold border-b border-hubspot-border pb-2">💼 Statut professionnel</h2>
          <label className="block">
            <span className="block text-sm font-medium text-hubspot-text mb-1">Statut actuel *</span>
            <select name="statutPro" required value={statutPro} onChange={(e) => setStatutPro(e.target.value)} className="w-full rounded border border-hubspot-border px-3 py-2 bg-white text-sm">
              <option value="">— Choisir —</option>
              {STATUTS_PRO.map((s) => <option key={s.code} value={s.code}>{s.libelle}</option>)}
            </select>
          </label>

          {isSalarie && (
            <div className="bg-amber-50 border border-amber-200 rounded p-4 space-y-3">
              <label className="block">
                <span className="block text-sm font-medium text-hubspot-text mb-1">Depuis combien de temps êtes-vous salarié·e ? *</span>
                <select name="ancienneteSalarie" required className="w-full rounded border border-hubspot-border px-3 py-2 bg-white text-sm">
                  <option value="">— Choisir —</option>
                  {ANCIENNETE_SALARIE.map((a) => <option key={a} value={a}>{a}</option>)}
                </select>
              </label>
            </div>
          )}

          {statutPro && (
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="reconversion" value="true" checked={reconversion} onChange={(e) => setReconversion(e.target.checked)} className="w-4 h-4 accent-hubspot-orange" />
              <span className="text-sm">📚 Cette formation s'inscrit dans une <strong>reconversion professionnelle</strong></span>
            </label>
          )}

          {reconversion && isSalarie && (
            <div className="bg-emerald-50 border border-emerald-200 rounded p-3 text-sm">
              💡 <strong>Financement recommandé : CPF de Transition Professionnelle (PTP)</strong>
              <br /><span className="text-xs text-hubspot-text-muted">Permet de financer une formation longue avec maintien du salaire.</span>
            </div>
          )}
        </section>

        <section className="card p-6 space-y-4">
          <h2 className="font-semibold border-b border-hubspot-border pb-2">📚 Formation visée</h2>

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={formationManuelle} onChange={(e) => { setFormationManuelle(e.target.checked); if (e.target.checked) setFormationId(""); }} className="w-4 h-4 accent-hubspot-orange" />
            <span className="text-sm">La formation visée n'est <strong>pas dans le catalogue</strong> — saisir manuellement</span>
          </label>

          {!formationManuelle ? (
            <div className="grid grid-cols-2 gap-4">
              <Select label="Centre / Entité" name="entiteId" options={[{ value: "", label: "—" }, ...entites.map((e) => ({ value: e.id, label: `${e.code} — ${e.specialite}` }))]} />
              <label className="block">
                <span className="block text-sm font-medium text-hubspot-text mb-1">Formation</span>
                <select name="formationId" value={formationId} onChange={(e) => setFormationId(e.target.value)} className="w-full rounded border border-hubspot-border px-3 py-2 bg-white text-sm">
                  <option value="">— Choisir —</option>
                  <optgroup label="Apprentissage / Alternance">
                    {formations.filter((f) => f.type !== "Formation continue").map((f) => (
                      <option key={f.id} value={f.id}>{f.intitule} — {f.entiteCode}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Formation continue (ALIOS, courte durée)">
                    {formations.filter((f) => f.type === "Formation continue").map((f) => (
                      <option key={f.id} value={f.id}>{f.intitule} — {f.entiteCode}</option>
                    ))}
                  </optgroup>
                </select>
              </label>
              {formation && montantAuto !== null && (
                <div className="col-span-2 bg-emerald-50 border border-emerald-200 rounded p-3 text-sm">
                  💶 Montant pré-rempli depuis le catalogue : <strong>{montantAuto.toLocaleString("fr-FR")} €</strong>
                  <input type="hidden" name="montantFinancement" value={montantAuto} />
                </div>
              )}
            </div>
          ) : (
            <div className="bg-orange-50 border border-orange-200 rounded p-4 space-y-3">
              <p className="text-xs font-semibold text-orange-900">📝 Saisie manuelle (formation hors catalogue)</p>
              <Field label="Intitulé de la formation *" name="formationManuelleNom" required={formationManuelle} placeholder="ex : Bachelor Marketing Digital — XYZ School" />
              <div className="grid grid-cols-2 gap-3">
                <Select label="Niveau" name="formationManuelleNiveau" options={[
                  { value: "", label: "—" },
                  { value: "Sans niveau", label: "Sans niveau" },
                  { value: "Niveau 3 (CAP/BEP)", label: "Niveau 3 (CAP/BEP)" },
                  { value: "Niveau 4 (Bac)", label: "Niveau 4 (Bac)" },
                  { value: "Niveau 5 (Bac+2)", label: "Niveau 5 (Bac+2)" },
                  { value: "Niveau 6 (Bac+3/4)", label: "Niveau 6 (Bac+3/4)" },
                  { value: "Niveau 7 (Bac+5)", label: "Niveau 7 (Bac+5)" },
                ]} />
                <label className="block">
                  <span className="block text-sm font-medium text-hubspot-text mb-1">Montant à saisir (€) *</span>
                  <input name="montantFinancement" type="number" value={montantSaisi} onChange={(e) => setMontantSaisi(e.target.value)} required={formationManuelle} placeholder="ex : 4500" className="w-full rounded border border-hubspot-border px-3 py-2 text-sm" />
                </label>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-hubspot-border">
            <Field label="Niveau actuel" name="niveauActuel" placeholder="CAP, Bac, Bac+2…" />
            <Field label="Année du Bac" name="anneeBac" type="number" placeholder="ex : 2024" />
            <Field label="Diplôme actuel" name="diplomeActuel" />
            <Field label="Expérience pro" name="experiencePro" />
          </div>
        </section>

        <section className="card p-6 space-y-4">
          <h2 className="font-semibold border-b border-hubspot-border pb-2">💰 Type de financement souhaité</h2>

          {statutPro && (
            <div className="bg-blue-50 border border-blue-200 rounded p-3 text-xs">
              💡 Selon votre statut <strong>"{STATUTS_PRO.find((s) => s.code === statutPro)?.libelle}"</strong>
              {reconversion ? " et la reconversion" : ""}, les financements adaptés sont mis en évidence ci-dessous.
            </div>
          )}

          <label className="block">
            <span className="block text-sm font-medium text-hubspot-text mb-1">Financement *</span>
            <select name="financementChoisi" required className="w-full rounded border border-hubspot-border px-3 py-2 bg-white text-sm">
              <option value="">— Choisir —</option>
              {financementsTriees.sugg.length > 0 && (
                <optgroup label="✨ Recommandés pour votre profil">
                  {financementsTriees.sugg.map((f) => <option key={f.code} value={f.code}>{f.libelle}</option>)}
                </optgroup>
              )}
              <optgroup label="Autres financements">
                {financementsTriees.autres.map((f) => <option key={f.code} value={f.code}>{f.libelle}</option>)}
              </optgroup>
            </select>
          </label>

          {montantAffiche && (
            <div className="bg-hubspot-bg-alt rounded p-3 text-sm">
              💶 Montant : <strong>{Number(montantAffiche).toLocaleString("fr-FR")} €</strong>
              {formationManuelle ? " (saisi manuellement)" : " (depuis le catalogue)"}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Field label="OPCO de rattachement" name="opco" placeholder="AKTO, OCAPIAT…" />
            <Field label="N° dossier OPCO / financeur" name="numeroDossierOpco" />
          </div>
        </section>

        <section className="card p-6 space-y-4">
          <h2 className="font-semibold border-b border-hubspot-border pb-2">🏢 Société matchée (si apprentissage)</h2>
          <Select label="Entreprise proposée / matchée" name="societeMatcheeId" options={[{ value: "", label: "— pas encore matché —" }, ...entreprises.map((e) => ({ value: e.id, label: e.raisonSociale }))]} />
        </section>

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

        <section className="card p-6 space-y-4">
          <h2 className="font-semibold border-b border-hubspot-border pb-2">📋 Suivi commercial</h2>
          <p className="text-xs text-hubspot-text-muted">Le commercial sera automatiquement affecté selon l'entité ou la disponibilité de l'équipe.</p>
          <label className="block">
            <span className="block text-sm font-medium text-hubspot-text mb-1">Notes</span>
            <textarea name="notes" rows={3} className="w-full rounded border border-hubspot-border px-3 py-2 text-sm" />
          </label>
        </section>

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

function Field({ label, name, type = "text", required, placeholder, defaultValue }: { label: string; name: string; type?: string; required?: boolean; placeholder?: string; defaultValue?: string }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-hubspot-text mb-1">{label}</span>
      <input name={name} type={type} required={required} placeholder={placeholder} defaultValue={defaultValue} className="w-full rounded border border-hubspot-border px-3 py-2 text-sm focus:border-hubspot-orange focus:ring-1 focus:ring-hubspot-orange outline-none" />
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
