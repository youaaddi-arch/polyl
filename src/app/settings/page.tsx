import Link from "next/link";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const [users, props, pipelines, entites] = await Promise.all([
    prisma.utilisateur.findMany({ orderBy: { nom: "asc" } }),
    prisma.propPersonnalisee.findMany({ orderBy: [{ objet: "asc" }, { ordre: "asc" }] }),
    prisma.dealPipeline.findMany(),
    prisma.entite.findMany({ orderBy: { code: "asc" } }),
  ]);

  return (
    <div className="space-y-6 max-w-5xl">
      <header>
        <h1 className="text-2xl font-bold">Paramètres</h1>
        <p className="text-gray-500 text-sm">Configuration du CRM — utilisateurs, propriétés personnalisées, pipelines</p>
      </header>

      <section className="card p-5">
        <h2 className="font-semibold mb-3">👥 Utilisateurs internes ({users.length})</h2>
        <table className="crm">
          <thead><tr><th>Nom</th><th>Email</th><th>Rôle</th><th>Entité</th><th>Statut</th></tr></thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td className="font-medium">{u.prenom} {u.nom}</td>
                <td>{u.email}</td>
                <td><span className="badge bg-purple-50 text-purple-700">{u.role}</span></td>
                <td>{u.entiteCode ?? "—"}</td>
                <td><span className={`badge ${u.active ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>{u.active ? "actif" : "désactivé"}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="card p-5">
        <h2 className="font-semibold mb-3">🏷️ Propriétés personnalisées ({props.length})</h2>
        <table className="crm">
          <thead><tr><th>Objet</th><th>Clé</th><th>Libellé</th><th>Type</th><th>Options</th></tr></thead>
          <tbody>
            {props.map((p) => (
              <tr key={p.id}>
                <td><span className="badge bg-gray-100 text-gray-700">{p.objet}</span></td>
                <td><code className="text-xs">{p.cle}</code></td>
                <td>{p.libelle}</td>
                <td>{p.type}</td>
                <td className="text-xs text-gray-500">{p.options ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="card p-5">
        <h2 className="font-semibold mb-3">🔀 Pipelines de deals ({pipelines.length})</h2>
        {pipelines.map((p) => {
          const stages = JSON.parse(p.stages) as { cle: string; libelle: string; probabilite: number }[];
          return (
            <div key={p.id} className="border rounded-lg p-3 mb-2">
              <div className="font-medium">{p.nom} {p.isDefault && <span className="badge bg-emerald-50 text-emerald-700 ml-2">par défaut</span>}</div>
              <div className="flex gap-1 mt-2 flex-wrap">
                {stages.map((s) => <span key={s.cle} className="badge bg-gray-100 text-gray-700">{s.libelle} ({s.probabilite}%)</span>)}
              </div>
            </div>
          );
        })}
      </section>

      <section className="card p-5">
        <h2 className="font-semibold mb-3">🏢 Entités du groupe ({entites.length})</h2>
        <table className="crm">
          <thead><tr><th>Code</th><th>Nom</th><th>Spécialité</th><th>Ville</th></tr></thead>
          <tbody>
            {entites.map((e) => (
              <tr key={e.id}>
                <td><span className="badge bg-gray-100 text-gray-700">{e.code}</span></td>
                <td>{e.nom}</td>
                <td>{e.specialite}</td>
                <td>{e.ville}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
