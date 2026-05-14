import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import PrintButton from "@/components/PrintButton";

export const dynamic = "force-dynamic";

export default async function FicheQuote({ params }: { params: { id: string } }) {
  const q = await prisma.quote.findUnique({ where: { id: params.id } });
  if (!q) notFound();
  const lignes = JSON.parse(q.lignes) as { libelle: string; qte: number; prixUnit: number; total: number }[];
  return (
    <div className="space-y-6 max-w-4xl">
      <Link href="/quotes" className="text-sm text-brand-600 hover:underline print:hidden">← Devis</Link>

      <div className="card p-10 print:shadow-none print:border-0">
        <header className="flex items-start justify-between border-b pb-6">
          <div>
            <div className="text-2xl font-bold text-brand-700">DEVIS</div>
            <div className="text-sm text-gray-500 mt-1">N° {q.numero}</div>
            <div className="text-sm text-gray-500">Émis le {new Intl.DateTimeFormat("fr-FR").format(q.dateEmission)}</div>
            {q.dateValidite && <div className="text-sm text-gray-500">Valable jusqu'au {new Intl.DateTimeFormat("fr-FR").format(q.dateValidite)}</div>}
          </div>
          <div className="text-right text-sm">
            <div className="font-bold">Groupe CFA</div>
            <div className="text-gray-500">contact@groupe-cfa.fr</div>
            <span className={`badge mt-2 ${
              q.statut === "accepte" ? "bg-emerald-50 text-emerald-700" :
              q.statut === "envoye" ? "bg-blue-50 text-blue-700" :
              "bg-gray-100 text-gray-700"
            }`}>{q.statut}</span>
          </div>
        </header>

        <h1 className="text-xl font-semibold mt-6">{q.titre}</h1>

        <table className="w-full text-sm mt-6">
          <thead className="border-b">
            <tr><th className="text-left py-2">Description</th><th className="text-right">Qté</th><th className="text-right">PU HT</th><th className="text-right">Total HT</th></tr>
          </thead>
          <tbody>
            {lignes.map((l, i) => (
              <tr key={i} className="border-b">
                <td className="py-2">{l.libelle}</td>
                <td className="text-right">{l.qte}</td>
                <td className="text-right">{l.prixUnit.toLocaleString("fr-FR")} €</td>
                <td className="text-right">{l.total.toLocaleString("fr-FR")} €</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6 ml-auto w-full max-w-xs space-y-1 text-sm">
          <div className="flex justify-between"><span>Total HT</span><span>{q.totalHT.toLocaleString("fr-FR")} €</span></div>
          <div className="flex justify-between text-gray-500"><span>TVA ({q.tva}%)</span><span>{(q.totalTTC - q.totalHT).toLocaleString("fr-FR")} €</span></div>
          <div className="flex justify-between font-bold text-lg border-t pt-2"><span>Total TTC</span><span>{q.totalTTC.toLocaleString("fr-FR")} €</span></div>
        </div>

        <p className="text-xs text-gray-500 mt-8 border-t pt-4">
          Formation prise en charge par OPCO / France Travail / CPF — exonérée de TVA selon l'article 261-4-4° du CGI.
        </p>
      </div>

      <div className="flex gap-2 print:hidden">
        <PrintButton />
      </div>
    </div>
  );
}
