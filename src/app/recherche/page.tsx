import Link from "next/link";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function RecherchePage({ searchParams }: { searchParams: { q?: string } }) {
  const q = (searchParams.q ?? "").trim();
  const where = q ? { contains: q } : undefined;

  const [candidats, entreprises, deals, tickets, formations] = q
    ? await Promise.all([
        prisma.candidat.findMany({ where: { OR: [{ prenom: where }, { nom: where }, { email: where }, { ville: where }] }, take: 10 }),
        prisma.entreprise.findMany({ where: { OR: [{ raisonSociale: where }, { siret: where }, { ville: where }, { secteur: where }] }, take: 10 }),
        prisma.deal.findMany({ where: { titre: where }, take: 10 }),
        prisma.ticket.findMany({ where: { OR: [{ sujet: where }, { description: where }] }, take: 10 }),
        prisma.formation.findMany({ where: { intitule: where }, include: { entite: true }, take: 10 }),
      ])
    : [[], [], [], [], []];

  return (
    <div className="space-y-6 max-w-4xl">
      <header>
        <h1 className="text-2xl font-bold">Recherche globale</h1>
        <form className="mt-3">
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Rechercher un candidat, une entreprise, un deal, un ticket, une formation…"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
            autoFocus
          />
        </form>
      </header>

      {!q ? (
        <p className="text-sm text-gray-400">Tapez votre recherche puis appuyez sur Entrée.</p>
      ) : (
        <>
          <Group titre={`🎓 Candidats (${candidats.length})`}>
            {candidats.map((c) => (
              <Link key={c.id} href={`/candidats/${c.id}`} className="block card p-3 hover:border-brand-300">
                <div className="font-medium">{c.prenom} {c.nom}</div>
                <div className="text-xs text-gray-500">{c.email ?? "—"} · {c.ville ?? "—"}</div>
              </Link>
            ))}
          </Group>
          <Group titre={`🏢 Entreprises (${entreprises.length})`}>
            {entreprises.map((e) => (
              <Link key={e.id} href={`/entreprises/${e.id}`} className="block card p-3 hover:border-brand-300">
                <div className="font-medium">{e.raisonSociale}</div>
                <div className="text-xs text-gray-500">{e.secteur ?? "—"} · {e.ville ?? "—"}</div>
              </Link>
            ))}
          </Group>
          <Group titre={`💼 Deals (${deals.length})`}>
            {deals.map((d) => (
              <Link key={d.id} href={`/deals/${d.id}`} className="block card p-3 hover:border-brand-300">
                <div className="font-medium">{d.titre}</div>
                <div className="text-xs text-gray-500">{d.montant ? `${d.montant.toLocaleString("fr-FR")} €` : "—"} · {d.etapeCle}</div>
              </Link>
            ))}
          </Group>
          <Group titre={`🎫 Tickets (${tickets.length})`}>
            {tickets.map((t) => (
              <Link key={t.id} href={`/tickets/${t.id}`} className="block card p-3 hover:border-brand-300">
                <div className="font-medium">{t.sujet}</div>
                <div className="text-xs text-gray-500">{t.statut} · {t.priorite}</div>
              </Link>
            ))}
          </Group>
          <Group titre={`📚 Formations (${formations.length})`}>
            {formations.map((f) => (
              <Link key={f.id} href={`/formations/${f.id}`} className="block card p-3 hover:border-brand-300">
                <div className="font-medium">{f.intitule}</div>
                <div className="text-xs text-gray-500">{f.entite?.code ?? "ALIOS"} · {f.niveau}</div>
              </Link>
            ))}
          </Group>
        </>
      )}
    </div>
  );
}

function Group({ titre, children }: { titre: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-semibold mb-2">{titre}</h2>
      <div className="space-y-2">{children}</div>
    </section>
  );
}
