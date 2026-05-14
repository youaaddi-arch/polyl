import Link from "next/link";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function QuotesPage() {
  const quotes = await prisma.quote.findMany({ orderBy: { createdAt: "desc" } });
  const total = quotes.reduce((s, q) => s + q.totalTTC, 0);
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Devis</h1>
        <p className="text-gray-500 text-sm">{quotes.length} devis · Volume total : {total.toLocaleString("fr-FR")} € TTC</p>
      </header>
      <div className="card overflow-x-auto">
        <table className="crm">
          <thead><tr><th>N°</th><th>Titre</th><th>Statut</th><th>Total HT</th><th>Total TTC</th><th>Émission</th><th>Validité</th></tr></thead>
          <tbody>
            {quotes.map((q) => (
              <tr key={q.id}>
                <td><Link href={`/quotes/${q.id}`} className="font-mono text-brand-600 hover:underline">{q.numero}</Link></td>
                <td>{q.titre}</td>
                <td>
                  <span className={`badge ${
                    q.statut === "accepte" ? "bg-emerald-50 text-emerald-700" :
                    q.statut === "envoye" ? "bg-blue-50 text-blue-700" :
                    q.statut === "refuse" ? "bg-rose-50 text-rose-700" :
                    "bg-gray-100 text-gray-700"
                  }`}>{q.statut}</span>
                </td>
                <td>{q.totalHT.toLocaleString("fr-FR")} €</td>
                <td className="font-semibold">{q.totalTTC.toLocaleString("fr-FR")} €</td>
                <td>{new Intl.DateTimeFormat("fr-FR").format(q.dateEmission)}</td>
                <td>{q.dateValidite ? new Intl.DateTimeFormat("fr-FR").format(q.dateValidite) : "—"}</td>
              </tr>
            ))}
            {quotes.length === 0 && <tr><td colSpan={7} className="text-center text-gray-400 py-8">Aucun devis</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
