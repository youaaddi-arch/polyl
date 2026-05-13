import { prisma } from "@/lib/db";
import { creerEntreprise } from "@/actions/entreprises";
import { PERSONAS_ENTREPRISE } from "@/lib/entites";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function NouvelleEntreprisePage() {
  const entites = await prisma.entite.findMany({ orderBy: { code: "asc" } });
  return (
    <div className="max-w-3xl">
      <header className="mb-6">
        <Link href="/entreprises" className="text-sm text-brand-600 hover:underline">← Entreprises</Link>
        <h1 className="text-2xl font-bold mt-2">Nouvelle entreprise</h1>
        <p className="text-gray-500 text-sm">Étape 1 du pipeline — Annonce détectée / Besoin identifié</p>
      </header>

      <form action={creerEntreprise} className="card p-6 space-y-4">
        <Field label="Raison sociale *" name="raisonSociale" required />
        <div className="grid grid-cols-2 gap-4">
          <Field label="SIRET" name="siret" />
          <Field label="Secteur" name="secteur" />
          <Field label="Ville" name="ville" />
          <Select label="Taille" name="taille" options={[
            { value: "", label: "—" },
            { value: "PME", label: "PME (10-50)" },
            { value: "ETI", label: "ETI (50-500)" },
            { value: "GE",  label: "Grande entreprise (>500)" },
          ]} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Select label="Entité associée" name="entiteId" options={[{ value: "", label: "— choisir —" }, ...entites.map((e) => ({ value: e.id, label: `${e.code} — ${e.specialite}` }))]} />
          <Select label="Persona" name="persona" options={[{ value: "", label: "— non défini —" }, ...PERSONAS_ENTREPRISE.map((p) => ({ value: p.code, label: `${p.code} — ${p.nom}` }))]} />
        </div>
        <Field label="Source de détection" name="sourceDetection" placeholder="Indeed, France Travail, LinkedIn Jobs…" />

        <div className="flex justify-end gap-2 pt-2">
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
      <span className="block text-sm font-medium text-gray-700 mb-1">{label}</span>
      <input name={name} type={type} required={required} placeholder={placeholder}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none" />
    </label>
  );
}
function Select({ label, name, options }: { label: string; name: string; options: { value: string; label: string }[] }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-gray-700 mb-1">{label}</span>
      <select name={name} className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none">
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  );
}
