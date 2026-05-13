import Link from "next/link";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function FormulairesPage() {
  const formulaires = await prisma.formulaire.findMany({
    include: { _count: { select: { submissions: true } } },
    orderBy: { createdAt: "desc" },
  });
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Formulaires</h1>
        <p className="text-gray-500 text-sm">Capture leads — formulaires publics intégrables sur votre site web</p>
      </header>
      <div className="card overflow-x-auto">
        <table className="crm">
          <thead><tr><th>Nom</th><th>Cible</th><th>URL publique</th><th>Soumissions</th><th>Statut</th></tr></thead>
          <tbody>
            {formulaires.map((f) => (
              <tr key={f.id}>
                <td className="font-medium">{f.nom}</td>
                <td><span className="badge bg-purple-50 text-purple-700">{f.cibleObjet}</span></td>
                <td><code className="text-xs bg-gray-100 px-2 py-1 rounded">/f/{f.slug}</code></td>
                <td><span className="badge bg-brand-50 text-brand-700">{f._count.submissions}</span></td>
                <td><span className={`badge ${f.active ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>{f.active ? "actif" : "inactif"}</span></td>
              </tr>
            ))}
            {formulaires.length === 0 && <tr><td colSpan={5} className="text-center text-gray-400 py-8">Aucun formulaire</td></tr>}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-500">
        💡 Pour intégrer un formulaire sur votre site : pointez votre lien vers <code>https://votre-domaine.fr/f/[slug]</code>
      </p>
    </div>
  );
}
