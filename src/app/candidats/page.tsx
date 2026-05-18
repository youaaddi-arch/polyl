import Link from "next/link";
import { prisma } from "@/lib/db";
import { PIPELINE_CANDIDAT } from "@/lib/pipelines";
import { STATUTS_LEAD } from "@/lib/options";
import CandidatsToolbar from "@/components/CandidatsToolbar";

export const dynamic = "force-dynamic";

const DEFAULT_COLS = [
  "nom","telephone","adresse","dateCandidature","derniereActivite",
  "statutLead","financementChoisi","societeMatchee","formation","entite","deals","etape",
];

export default async function CandidatsListPage({ searchParams }: { searchParams: Record<string, string> }) {
  // Construit le where Prisma à partir des searchParams
  const where: any = {};

  if (searchParams.q) {
    const q = searchParams.q;
    where.OR = [
      { prenom: { contains: q } }, { nom: { contains: q } },
      { email: { contains: q } }, { ville: { contains: q } }, { telephone: { contains: q } },
    ];
  }
  if (searchParams.statut)            where.statut = searchParams.statut;
  if (searchParams.statutLead)        where.statutLead = searchParams.statutLead;
  if (searchParams.situation)         where.situation = searchParams.situation;
  if (searchParams.financementChoisi) where.financementChoisi = searchParams.financementChoisi;
  if (searchParams.typeContratSouhaite) where.typeContratSouhaite = searchParams.typeContratSouhaite;
  if (searchParams.persona)           where.persona = searchParams.persona;
  if (searchParams.mobiliteGeo)       where.mobiliteGeo = searchParams.mobiliteGeo;
  if (searchParams.prescripteur)      where.prescripteur = searchParams.prescripteur;
  if (searchParams.permisB)           where.permisB = searchParams.permisB === "true";
  if (searchParams.rqth)              where.rqth = searchParams.rqth === "true";
  if (searchParams.entiteCode) {
    const e = await prisma.entite.findUnique({ where: { code: searchParams.entiteCode } });
    if (e) where.entiteId = e.id;
  }

  // Chargement vue sauvegardée (si ?vue=ID)
  if (searchParams.vue) {
    const liste = await prisma.liste.findUnique({ where: { id: searchParams.vue } });
    if (liste) {
      const f = JSON.parse(liste.filtres) as Record<string, string>;
      // Ré-applique tous les filtres de la vue (sauf q déjà traité)
      for (const [k, v] of Object.entries(f)) {
        if (!searchParams[k] && k !== "vue") {
          if (k === "permisB" || k === "rqth") where[k] = v === "true";
          else if (k === "entiteCode") {
            const e = await prisma.entite.findUnique({ where: { code: v } });
            if (e) where.entiteId = e.id;
          } else where[k] = v;
        }
      }
    }
  }

  const [candidats, savedViews] = await Promise.all([
    prisma.candidat.findMany({
      where,
      orderBy: { derniereActivite: "desc" },
      include: { formation: true, entite: true, societeMatchee: true, deals: true },
    }),
    prisma.liste.findMany({ where: { objet: "candidat" }, orderBy: { createdAt: "desc" } }),
  ]);

  const visibleCols = searchParams.cols ? searchParams.cols.split(",") : DEFAULT_COLS;
  const has = (c: string) => visibleCols.includes(c);
  const etapeLib = (n: number) => PIPELINE_CANDIDAT.find((e) => e.numero === n)?.libelle ?? "—";
  const statutLeadLib = (code: string | null) => STATUTS_LEAD.find((s) => s.code === code) ?? STATUTS_LEAD[0];

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Candidats / Apprenants</h1>
          <p className="text-hubspot-text-muted text-sm mt-1">
            {candidats.length} contact(s) {Object.keys(searchParams).length > 0 ? "(filtré)" : "au total"}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/candidats/pipeline" className="btn-secondary">🧭 Kanban</Link>
          <Link href="/candidats/nouveau" className="btn-primary">+ Nouveau candidat</Link>
        </div>
      </header>

      <CandidatsToolbar
        savedViews={savedViews.map((v) => ({ id: v.id, nom: v.nom }))}
        totalFiltered={candidats.length}
      />

      <div className="card overflow-x-auto">
        <table className="crm text-xs">
          <thead>
            <tr>
              {has("nom") && <th>Nom</th>}
              {has("telephone") && <th>📞 Téléphone</th>}
              {has("adresse") && <th>📍 Ville / CP</th>}
              {has("dateCandidature") && <th>📅 Candidature</th>}
              {has("derniereActivite") && <th>⏱️ Dernière activité</th>}
              {has("statutLead") && <th>🎯 Statut lead</th>}
              {has("financementChoisi") && <th>💰 Financement</th>}
              {has("situation") && <th>Situation</th>}
              {has("societeMatchee") && <th>🏢 Société matchée</th>}
              {has("formation") && <th>📚 Formation</th>}
              {has("entite") && <th>Entité</th>}
              {has("persona") && <th>Persona</th>}
              {has("typeContrat") && <th>Type contrat</th>}
              {has("permisB") && <th>Permis B</th>}
              {has("niveauAnglais") && <th>Anglais</th>}
              {has("mobiliteGeo") && <th>Mobilité</th>}
              {has("prescripteur") && <th>Prescripteur</th>}
              {has("conseillerDedie") && <th>Conseiller</th>}
              {has("scoreLead") && <th>Score</th>}
              {has("deals") && <th>💼 Opp.</th>}
              {has("etape") && <th>Étape</th>}
            </tr>
          </thead>
          <tbody>
            {candidats.map((c) => {
              const sl = statutLeadLib(c.statutLead);
              return (
                <tr key={c.id} className="hover:bg-hubspot-bg">
                  {has("nom") && (
                    <td>
                      <Link href={`/candidats/${c.id}`} className="font-medium text-hubspot-orange hover:underline">
                        {c.prenom} {c.nom}
                      </Link>
                      {c.email && <div className="text-[10px] text-hubspot-text-muted">{c.email}</div>}
                    </td>
                  )}
                  {has("telephone") && <td className="text-hubspot-text-muted whitespace-nowrap">{c.telephone ?? "—"}</td>}
                  {has("adresse") && <td className="text-hubspot-text-muted">{c.ville ? `${c.codePostal ?? ""} ${c.ville}` : "—"}</td>}
                  {has("dateCandidature") && <td className="text-hubspot-text-muted whitespace-nowrap">{c.dateCandidature ? new Intl.DateTimeFormat("fr-FR").format(c.dateCandidature) : "—"}</td>}
                  {has("derniereActivite") && <td className="text-hubspot-text-muted whitespace-nowrap">{c.derniereActivite ? new Intl.DateTimeFormat("fr-FR").format(c.derniereActivite) : "—"}</td>}
                  {has("statutLead") && <td><span className={`badge bg-${sl.couleur}-50 text-${sl.couleur}-700`}>{sl.libelle}</span></td>}
                  {has("financementChoisi") && <td>{c.financementChoisi ? <span className="badge bg-amber-50 text-amber-700">{c.financementChoisi}</span> : "—"}</td>}
                  {has("situation") && <td className="text-hubspot-text-muted">{c.situation ?? "—"}</td>}
                  {has("societeMatchee") && <td className="text-hubspot-text-muted">{c.societeMatchee?.raisonSociale ?? "—"}</td>}
                  {has("formation") && <td className="text-hubspot-text-muted">{c.formation?.intitule ?? "—"}</td>}
                  {has("entite") && <td>{c.entite?.code ? <span className="badge bg-hubspot-bg-alt">{c.entite.code}</span> : "—"}</td>}
                  {has("persona") && <td>{c.persona ? <span className="badge bg-purple-50 text-purple-700">{c.persona}</span> : "—"}</td>}
                  {has("typeContrat") && <td className="text-hubspot-text-muted">{c.typeContratSouhaite ?? "—"}</td>}
                  {has("permisB") && <td>{c.permisB ? "✅" : "—"}</td>}
                  {has("niveauAnglais") && <td>{c.niveauAnglais ?? "—"}</td>}
                  {has("mobiliteGeo") && <td className="text-hubspot-text-muted">{c.mobiliteGeo ?? "—"}</td>}
                  {has("prescripteur") && <td className="text-hubspot-text-muted">{c.prescripteur ?? "—"}</td>}
                  {has("conseillerDedie") && <td className="text-hubspot-text-muted">{c.conseillerDedie ?? "—"}</td>}
                  {has("scoreLead") && <td>{c.scoreLead ?? "—"}</td>}
                  {has("deals") && <td><span className="badge bg-orange-50 text-hubspot-orange">{c.deals.length}</span></td>}
                  {has("etape") && <td><span className="badge bg-hubspot-bg-alt">{c.etapePipeline} · {etapeLib(c.etapePipeline)}</span></td>}
                </tr>
              );
            })}
            {candidats.length === 0 && (
              <tr><td colSpan={visibleCols.length} className="text-center text-hubspot-text-muted py-8">Aucun candidat ne correspond aux filtres</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
