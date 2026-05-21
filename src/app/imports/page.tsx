import { prisma } from "@/lib/db";
import { importerCSV } from "@/actions/import";

export const dynamic = "force-dynamic";

export default async function ImportsPage() {
  const logs = await prisma.importLog.findMany({ orderBy: { createdAt: "desc" }, take: 20 });
  return (
    <div className="space-y-6 max-w-4xl">
      <header>
        <h1 className="text-2xl font-bold">Imports & Exports CSV</h1>
        <p className="text-gray-500 text-sm">Importer/exporter en masse les fiches CRM</p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-5">
          <h2 className="font-semibold mb-3">📥 Importer CSV ou Excel</h2>
          <form action={importerCSV} className="space-y-3" encType="multipart/form-data">
            <label className="block">
              <span className="block text-sm font-medium text-gray-700 mb-1">Type de données</span>
              <select name="objet" className="w-full rounded-lg border border-gray-300 px-3 py-2 bg-white">
                <option value="candidats">Candidats</option>
                <option value="entreprises">Entreprises</option>
              </select>
            </label>
            <label className="block">
              <span className="block text-sm font-medium text-gray-700 mb-1">Fichier .csv, .xlsx ou .xls *</span>
              <input name="fichier" type="file" accept=".csv,.xlsx,.xls,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel" required className="w-full text-sm" />
            </label>
            <p className="text-xs text-gray-500">
              Format candidats : <code>prenom, nom, email, telephone, ville…</code><br />
              Format entreprises : <code>raisonSociale, siret, secteur, ville, taille…</code><br />
              <span className="text-emerald-600">✓ Excel (.xlsx) supporté — première feuille uniquement</span>
            </p>
            <button className="btn-primary w-full justify-center">Importer</button>
          </form>
        </div>

        <div className="card p-5">
          <h2 className="font-semibold mb-3">📤 Exporter en CSV</h2>
          <ul className="space-y-2">
            {["candidats", "entreprises", "deals", "tickets"].map((o) => (
              <li key={o}>
                <a href={`/api/export/${o}`} className="btn-secondary w-full justify-center capitalize">
                  ⬇️ Exporter {o}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="card p-5">
        <h2 className="font-semibold mb-3">📜 Historique des imports</h2>
        <table className="crm">
          <thead><tr><th>Date</th><th>Objet</th><th>Fichier</th><th>Lignes</th><th>Créés</th><th>Erreurs</th></tr></thead>
          <tbody>
            {logs.map((l) => (
              <tr key={l.id}>
                <td>{new Intl.DateTimeFormat("fr-FR", { dateStyle: "short", timeStyle: "short" }).format(l.createdAt)}</td>
                <td><span className="badge bg-purple-50 text-purple-700">{l.objet}</span></td>
                <td className="text-xs">{l.nomFichier ?? "—"}</td>
                <td>{l.nbLignes}</td>
                <td><span className="badge bg-emerald-50 text-emerald-700">{l.nbCrees}</span></td>
                <td>{l.nbErreurs > 0 && <span className="badge bg-rose-50 text-rose-700">{l.nbErreurs}</span>}</td>
              </tr>
            ))}
            {logs.length === 0 && <tr><td colSpan={6} className="text-center text-gray-400 py-6">Aucun import effectué</td></tr>}
          </tbody>
        </table>
      </section>
    </div>
  );
}
