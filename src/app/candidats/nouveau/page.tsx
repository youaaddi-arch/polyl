import { prisma } from "@/lib/db";
import { creerCandidat } from "@/actions/candidats";
import { PERSONAS_CANDIDAT } from "@/lib/entites";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function NouveauCandidatPage() {
  const [entites, formations] = await Promise.all([
    prisma.entite.findMany({ orderBy: { code: "asc" } }),
    prisma.formation.findMany({ orderBy: { intitule: "asc" }, include: { entite: true } }),
  ]);

  return (
    <div className="max-w-3xl">
      <header className="mb-6">
        <Link href="/candidats" className="text-sm text-brand-600 hover:underline">← Candidats</Link>
        <h1 className="text-2xl font-bold mt-2">Nouveau candidat</h1>
        <p className="text-gray-500 text-sm">Étape 1 du pipeline — Candidature reçue</p>
      </header>

      <form action={creerCandidat} className="card p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Prénom *" name="prenom" required />
          <Field label="Nom *" name="nom" required />
          <Field label="Email" name="email" type="email" />
          <Field label="Téléphone" name="telephone" />
          <Field label="Ville" name="ville" />
          <Field label="Source d'entrée" name="sourceEntree" placeholder="ATS, formulaire web, prescription…" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Select label="Entité" name="entiteId" options={[{ value: "", label: "— choisir —" }, ...entites.map((e) => ({ value: e.id, label: `${e.code} — ${e.specialite}` }))]} />
          <Select label="Formation" name="formationId" options={[{ value: "", label: "— choisir —" }, ...formations.map((f) => ({ value: f.id, label: `[${f.entite.code}] ${f.intitule}` }))]} />
        </div>

        <Select
          label="Persona"
          name="persona"
          options={[{ value: "", label: "— non défini —" }, ...PERSONAS_CANDIDAT.map((p) => ({ value: p.code, label: `${p.code} — ${p.nom}` }))]}
        />

        <div className="flex justify-end gap-2 pt-2">
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
      <span className="block text-sm font-medium text-gray-700 mb-1">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
      />
    </label>
  );
}

function Select({ label, name, options }: { label: string; name: string; options: { value: string; label: string }[] }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-gray-700 mb-1">{label}</span>
      <select name={name} className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none">
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </label>
  );
}
