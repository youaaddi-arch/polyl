import { Topbar } from '@/components/Topbar';
import { Card, CardHeader, CardTitle, CardBody } from '@/components/ui/Card';
import { KpiCard } from '@/components/KpiCard';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Progress } from '@/components/ui/Progress';
import { StatusPill } from '@/components/StatusPill';
import { CategoryIcon } from '@/components/CategoryIcon';
import { Button } from '@/components/ui/Button';
import { apprentis, documents, activity, categoryLabels } from '@/lib/mock-data';
import { formatDate, relativeTime } from '@/lib/utils';
import Link from 'next/link';
import {
  Users, FileSignature, ShieldCheck, Clock, AlertTriangle, ArrowUpRight, Sparkles, Activity,
  Send, BellRing, FileSearch,
} from 'lucide-react';

export default function AdminPage() {
  const pending = documents.filter(d => d.status !== 'signe' && d.status !== 'refuse').length;
  const signed = documents.filter(d => d.status === 'signe').length;
  const avgConfo = Math.round(apprentis.reduce((a, b) => a + b.conformite, 0) / apprentis.length);

  return (
    <>
      <Topbar title="Tableau de bord" subtitle="CFA Numerique Lyon - Octobre 2025" />
      <main className="flex-1 p-6 space-y-6">
        {/* Hero Banner IA */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-ink-900 to-ink-700 text-white border-0">
          <div className="absolute inset-0 dot-grid opacity-10" />
          <div className="relative p-6 grid md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-neon-cyan font-semibold">
                <Sparkles className="size-3.5" /> Resume IA du jour
              </div>
              <h2 className="mt-2 text-xl font-semibold tracking-tight">3 dossiers a verifier, 2 documents manquants, et un livret refuse.</h2>
              <p className="mt-1 text-sm text-ink-200/80">Score Qualiopi stable a {avgConfo}%. Sygna IA propose 4 relances automatiques pour rattraper le retard.</p>
            </div>
            <div className="flex md:justify-end gap-2">
              <Button variant="neon" size="sm"><BellRing className="size-3.5" /> Lancer les relances</Button>
              <Link href="/audit"><Button variant="outline" size="sm" className="bg-white/5 border-white/15 text-white hover:bg-white/10"><FileSearch className="size-3.5" /> Audit</Button></Link>
            </div>
          </div>
        </Card>

        {/* KPIs */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard label="Apprentis actifs" value={apprentis.length} delta="+2 cette semaine" icon={Users} tone="cyan" />
          <KpiCard label="Signatures en cours" value={pending} delta="4 en retard" icon={FileSignature} tone="violet" />
          <KpiCard label="Documents signes (30j)" value={signed * 14} delta="+18% vs S-1" icon={ShieldCheck} tone="emerald" />
          <KpiCard label="Score Qualiopi" value={`${avgConfo}%`} delta="4 indicateurs verts" icon={Activity} tone="amber" />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Documents en cours */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Documents en circulation</CardTitle>
                <Link href="/documents" className="text-xs font-semibold text-ink-700 hover:underline inline-flex items-center gap-1">Tout voir <ArrowUpRight className="size-3" /></Link>
              </div>
            </CardHeader>
            <CardBody className="p-0">
              <table className="w-full text-sm">
                <thead className="text-[11px] uppercase tracking-wider text-ink-400 bg-ink-50/60">
                  <tr>
                    <th className="text-left font-medium px-5 py-2.5">Document</th>
                    <th className="text-left font-medium px-5 py-2.5">Apprenti</th>
                    <th className="text-left font-medium px-5 py-2.5">Statut</th>
                    <th className="text-left font-medium px-5 py-2.5">Mise a jour</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100">
                  {documents.slice(0, 6).map(d => {
                    const a = apprentis.find(x => x.id === d.apprentiId)!;
                    return (
                      <tr key={d.id} className="hover:bg-ink-50/40">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <CategoryIcon category={d.category} size="sm" />
                            <div>
                              <p className="text-ink-900 font-medium leading-tight">{d.title}</p>
                              <p className="text-[11px] text-ink-400">{categoryLabels[d.category]} - v{d.version}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <Avatar name={a.name} color={a.avatarColor} size="xs" />
                            <span className="text-ink-700">{a.name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3"><StatusPill status={d.status} /></td>
                        <td className="px-5 py-3 text-ink-500 text-xs">{relativeTime(d.updatedAt)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardBody>
          </Card>

          {/* Activity feed */}
          <Card>
            <CardHeader><CardTitle>Activite recente</CardTitle></CardHeader>
            <CardBody className="p-0 max-h-[420px] overflow-y-auto scrollbar-thin">
              <ul className="divide-y divide-ink-100">
                {activity.map(a => (
                  <li key={a.id} className="px-5 py-3 flex items-start gap-3">
                    <span className="mt-1.5 size-1.5 rounded-full bg-neon-cyan shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm text-ink-800 leading-snug"><span className="font-semibold">{a.actor}</span> {a.action} <span className="text-ink-700">{a.target}</span></p>
                      <p className="text-[11px] text-ink-400 mt-0.5">{relativeTime(a.ts)}{a.ip && ` - ${a.ip}`}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        </div>

        {/* Apprentis conformite */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Conformite des apprentis</CardTitle>
              <Link href="/apprentis" className="text-xs font-semibold text-ink-700 hover:underline inline-flex items-center gap-1">Tous les apprentis <ArrowUpRight className="size-3" /></Link>
            </div>
          </CardHeader>
          <CardBody className="p-0">
            <ul className="divide-y divide-ink-100">
              {apprentis.map(a => (
                <li key={a.id} className="px-5 py-4 grid grid-cols-12 items-center gap-4">
                  <div className="col-span-4 flex items-center gap-3">
                    <Avatar name={a.name} color={a.avatarColor} />
                    <div>
                      <p className="text-sm font-semibold text-ink-900">{a.name}</p>
                      <p className="text-[11px] text-ink-400">{a.formation} - {a.entreprise}</p>
                    </div>
                  </div>
                  <div className="col-span-2 text-xs text-ink-500">Promo {a.promo}</div>
                  <div className="col-span-3">
                    <div className="flex items-center gap-2">
                      <Progress value={a.conformite} tone={a.conformite >= 90 ? 'emerald' : a.conformite >= 75 ? 'cyan' : 'amber'} className="flex-1" />
                      <span className="text-xs font-semibold tabular-nums w-9 text-right">{a.conformite}%</span>
                    </div>
                  </div>
                  <div className="col-span-2">
                    {a.documentsManquants > 0
                      ? <Badge tone="amber" dot><AlertTriangle className="size-3" /> {a.documentsManquants} manquant{a.documentsManquants > 1 ? 's' : ''}</Badge>
                      : <Badge tone="emerald" dot>complet</Badge>}
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <Link href={`/livret/${a.id}`}><Button size="sm" variant="ghost">Ouvrir</Button></Link>
                  </div>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </main>
    </>
  );
}
