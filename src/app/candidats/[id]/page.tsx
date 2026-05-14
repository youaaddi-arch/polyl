import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { PIPELINE_CANDIDAT } from "@/lib/pipelines";
import { changerEtapeCandidat } from "@/actions/candidats";
import AjouterNote from "@/components/AjouterNote";
import Timeline from "@/components/Timeline";

export const dynamic = "force-dynamic";

export default async function FicheCandidat({ params }: { params: { id: string } }) {
  const c = await prisma.candidat.findUnique({
    where: { id: params.id },
    include: {
      formation: { include: { entite: true } },
      entite: true,
      taches: true,
      contrats: { include: { entreprise: true } },
      documents: true,
      communications: true,
      notesObjet: { orderBy: { createdAt: "desc" } },
      meetings: { orderBy: { dateDebut: "desc" } },
      tickets: { orderBy: { createdAt: "desc" } },
      activites: { orderBy: { createdAt: "desc" }, take: 30 },
      deals: true,
    },
  });
  if (!c) notFound();

  const etapeCourante = PIPELINE_CANDIDAT.find((e) => e.numero === c.etapePipeline);

  return (
    <div className="space-y-6 max-w-6xl">
      <header className="flex items-start justify-between">
        <div>
          <Link href="/candidats" className="text-sm text-brand-600 hover:underline">← Candidats</Link>
          <h1 className="text-2xl font-bold mt-1">{c.prenom} {c.nom}</h1>
          <div className="flex flex-wrap gap-2 mt-2">
            {c.entite && <span className="badge bg-gray-100 text-gray-700">{c.entite.code}</span>}
            {c.persona && <span className="badge bg-purple-50 text-purple-700">{c.persona}</span>}
            <span className="badge bg-brand-50 text-brand-700">Étape {c.etapePipeline} · {etapeCourante?.libelle}</span>
            <span className={`badge ${c.statut === "place" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{c.statut}</span>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card p-5 space-y-3">
          <h2 className="font-semibold">Coordonnées</h2>
          <Row label="Email" value={c.email} />
          <Row label="Téléphone" value={c.telephone} />
          <Row label="Ville" value={c.ville} />
          <Row label="Source d'entrée" value={c.sourceEntree} />
          <Row label="Conseiller dédié" value={c.conseillerDedie} />
        </div>

        <div className="card p-5 space-y-3">
          <h2 className="font-semibold">Formation visée</h2>
          {c.formation ? (
            <>
              <Row label="Intitulé" value={c.formation.intitule} />
              <Row label="Niveau" value={c.formation.niveau} />
              <Row label="Type" value={c.formation.type} />
              <Row label="Entité" value={c.formation.entite.code} />
            </>
          ) : <p className="text-sm text-gray-400">Aucune formation associée</p>}
        </div>

        <div className="card p-5 space-y-3">
          <h2 className="font-semibold">Évaluation</h2>
          <Row label="Score positionnement" value={c.scorePositionnement?.toString()} />
          <Row label="Bilan" value={c.bilanPositionnement} />
          <Row label="Note motivation" value={c.motivationNote?.toString()} />
        </div>
      </section>

      <section className="card p-5">
        <h2 className="font-semibold mb-3">Pipeline (19 étapes)</h2>
        <ol className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {PIPELINE_CANDIDAT.map((e) => {
            const passed = c.etapePipeline > e.numero;
            const current = c.etapePipeline === e.numero;
            return (
              <li key={e.cle} className={`flex items-center gap-3 rounded-lg p-2 ${current ? "bg-brand-50 border border-brand-200" : passed ? "opacity-60" : ""}`}>
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${current ? "bg-brand-600 text-white" : passed ? "bg-emerald-500 text-white" : "bg-gray-200 text-gray-600"}`}>
                  {passed ? "✓" : e.numero}
                </span>
                <div className="flex-1">
                  <div className="text-sm font-medium">{e.libelle}</div>
                  <div className="text-xs text-gray-500">{e.description}</div>
                </div>
                <form action={changerEtapeCandidat}>
                  <input type="hidden" name="id" value={c.id} />
                  <input type="hidden" name="etape" value={e.numero} />
                  <button className="text-xs text-brand-600 hover:underline">Aller →</button>
                </form>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card p-5 lg:col-span-2 space-y-4">
          <h2 className="font-semibold">📝 Notes & Timeline 360°</h2>
          <AjouterNote candidatId={c.id} />
          <Timeline items={[
            ...c.activites.map((a) => ({ id: a.id, type: a.type, titre: a.titre, contenu: a.contenu, auteur: a.auteur, createdAt: a.createdAt })),
            ...c.notesObjet.map((n) => ({ id: `note-${n.id}`, type: "note", titre: "Note", contenu: n.contenu, auteur: n.auteur, createdAt: n.createdAt })),
          ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 30)} />
        </div>

        <div className="space-y-6">
          <div className="card p-5">
            <h2 className="font-semibold mb-3">📅 Rendez-vous</h2>
            <ul className="divide-y">
              {c.meetings.map((m) => (
                <li key={m.id} className="py-2 text-sm">
                  <div className="font-medium">{m.titre}</div>
                  <div className="text-xs text-gray-500">{new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short" }).format(m.dateDebut)} · {m.lieu ?? "—"}</div>
                </li>
              ))}
              {c.meetings.length === 0 && <li className="text-sm text-gray-400 py-2">Aucun RDV</li>}
            </ul>
          </div>
          <div className="card p-5">
            <h2 className="font-semibold mb-3">💼 Deals</h2>
            <ul className="divide-y">
              {c.deals.map((d) => (
                <li key={d.id} className="py-2 text-sm flex justify-between">
                  <Link href={`/deals/${d.id}`} className="text-brand-600 hover:underline">{d.titre}</Link>
                  <span className="text-gray-400">{d.montant ? `${d.montant.toLocaleString("fr-FR")} €` : "—"}</span>
                </li>
              ))}
              {c.deals.length === 0 && <li className="text-sm text-gray-400 py-2">Aucun deal</li>}
            </ul>
          </div>
          <div className="card p-5">
            <h2 className="font-semibold mb-3">✅ Tâches</h2>
            <ul className="divide-y">
              {c.taches.map((t) => (
                <li key={t.id} className="py-2 text-sm flex justify-between">
                  <span>{t.titre}</span>
                  <span className="text-gray-400">{t.statut}</span>
                </li>
              ))}
              {c.taches.length === 0 && <li className="text-sm text-gray-400 py-2">Aucune tâche</li>}
            </ul>
          </div>
          <div className="card p-5">
            <h2 className="font-semibold mb-3">🎫 Tickets</h2>
            <ul className="divide-y">
              {c.tickets.map((t) => (
                <li key={t.id} className="py-2 text-sm flex justify-between">
                  <Link href={`/tickets/${t.id}`} className="text-brand-600 hover:underline">{t.sujet}</Link>
                  <span className="text-gray-400">{t.statut}</span>
                </li>
              ))}
              {c.tickets.length === 0 && <li className="text-sm text-gray-400 py-2">Aucun ticket</li>}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex justify-between gap-4 text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="text-gray-900 font-medium text-right">{value || "—"}</span>
    </div>
  );
}
