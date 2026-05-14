import Link from "next/link";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

const ICONES: Record<string, string> = {
  email: "📧", sms: "💬", whatsapp: "🟢", telephone: "📞", linkedin: "💼",
};

export default async function InboxPage() {
  const comms = await prisma.communication.findMany({
    include: { candidat: true, entreprise: true },
    orderBy: { dateAction: "desc" },
    take: 100,
  });
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Inbox unifié</h1>
        <p className="text-gray-500 text-sm">Toutes les communications entrantes & sortantes (email, SMS, WhatsApp, téléphone, LinkedIn)</p>
      </header>
      <div className="card divide-y">
        {comms.map((c) => (
          <div key={c.id} className="p-4 flex items-start gap-4">
            <div className="text-xl">{ICONES[c.canal] ?? "✉️"}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">{c.sujet ?? "(sans sujet)"}</span>
                <span className={`badge ${c.direction === "entrant" ? "bg-blue-50 text-blue-700" : "bg-gray-100 text-gray-700"}`}>{c.direction}</span>
              </div>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{c.contenu ?? "—"}</p>
              <div className="text-xs text-gray-400 mt-2 flex gap-2">
                {c.candidat && <Link href={`/candidats/${c.candidat.id}`} className="text-brand-600 hover:underline">👤 {c.candidat.prenom} {c.candidat.nom}</Link>}
                {c.entreprise && <Link href={`/entreprises/${c.entreprise.id}`} className="text-brand-600 hover:underline">🏢 {c.entreprise.raisonSociale}</Link>}
                <span>· {new Intl.DateTimeFormat("fr-FR", { dateStyle: "short", timeStyle: "short" }).format(c.dateAction)}</span>
              </div>
            </div>
          </div>
        ))}
        {comms.length === 0 && <div className="p-8 text-center text-sm text-gray-400">Aucune communication enregistrée</div>}
      </div>
    </div>
  );
}
