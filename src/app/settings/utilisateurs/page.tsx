import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function UtilisateursSettingsPage() {
  const users = await prisma.utilisateur.findMany({ orderBy: { nom: "asc" } });
  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Utilisateurs</h1>
          <p className="text-hubspot-text-muted text-sm">{users.length} utilisateurs · gérez l'équipe interne du groupe</p>
        </div>
        <button className="btn-primary">✉️ Inviter un utilisateur</button>
      </header>

      <div className="flex gap-2">
        <input placeholder="Rechercher par nom ou email…" className="flex-1 rounded border border-hubspot-border px-3 py-2 text-sm" />
        <select className="rounded border border-hubspot-border px-3 py-2 text-sm bg-white">
          <option>Tous les rôles</option><option>admin</option><option>manager</option><option>commercial</option><option>pedagogique</option>
        </select>
        <select className="rounded border border-hubspot-border px-3 py-2 text-sm bg-white">
          <option>Toutes les entités</option><option>PNFF</option><option>DBS</option><option>PNBS</option><option>ORCEA</option><option>PNFB</option><option>PBA</option>
        </select>
      </div>

      <div className="card overflow-hidden">
        <table className="crm">
          <thead><tr><th>Utilisateur</th><th>Email</th><th>Rôle</th><th>Entité</th><th>Statut</th><th>Dernière connexion</th><th /></tr></thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-hubspot-orange text-white flex items-center justify-center font-semibold text-xs">
                      {u.prenom?.[0] ?? "?"}{u.nom?.[0] ?? ""}
                    </div>
                    <span className="font-medium">{u.prenom} {u.nom}</span>
                  </div>
                </td>
                <td className="text-hubspot-text-muted">{u.email}</td>
                <td><span className={`badge ${u.role === "admin" ? "bg-purple-50 text-purple-700" : u.role === "manager" ? "bg-blue-50 text-blue-700" : "bg-gray-100 text-gray-700"}`}>{u.role}</span></td>
                <td>{u.entiteCode ? <span className="badge bg-hubspot-bg-alt">{u.entiteCode}</span> : "—"}</td>
                <td><span className={`badge ${u.active ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>{u.active ? "actif" : "désactivé"}</span></td>
                <td className="text-hubspot-text-muted text-xs">il y a 2h</td>
                <td className="text-right"><button className="text-xs text-hubspot-orange hover:underline">Modifier</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
