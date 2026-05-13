import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { soumettreFormulaire } from "@/actions/hubspot";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

type Champ = { cle: string; libelle: string; type: string; required?: boolean };

async function handleSubmit(slug: string, formData: FormData) {
  "use server";
  const data: Record<string, string> = {};
  for (const [k, v] of formData.entries()) data[k] = String(v);
  await soumettreFormulaire(slug, data);
  redirect(`/f/${slug}/merci`);
}

export default async function PublicFormPage({ params }: { params: { slug: string } }) {
  const f = await prisma.formulaire.findUnique({ where: { slug: params.slug } });
  if (!f || !f.active) notFound();
  const champs = JSON.parse(f.champs) as Champ[];
  const action = handleSubmit.bind(null, params.slug);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-brand-700">{f.nom}</h1>
        {f.description && <p className="text-gray-500 text-sm mt-2">{f.description}</p>}
        <form action={action} className="space-y-4 mt-6">
          {champs.map((c) => (
            <label key={c.cle} className="block">
              <span className="block text-sm font-medium text-gray-700 mb-1">{c.libelle}{c.required && " *"}</span>
              {c.type === "textarea" ? (
                <textarea name={c.cle} required={c.required} rows={4} className="w-full rounded-lg border border-gray-300 px-3 py-2" />
              ) : (
                <input name={c.cle} type={c.type === "tel" ? "tel" : c.type === "email" ? "email" : "text"} required={c.required} className="w-full rounded-lg border border-gray-300 px-3 py-2" />
              )}
            </label>
          ))}
          <button className="btn-primary w-full justify-center">Envoyer ma candidature</button>
        </form>
      </div>
    </div>
  );
}
