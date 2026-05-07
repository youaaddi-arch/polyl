import { Topbar } from '@/components/Topbar';
import { Card, CardHeader, CardTitle, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';
import { activity, apprentis, documents } from '@/lib/mock-data';
import { formatDateTime, relativeTime } from '@/lib/utils';
import { ShieldCheck, Download, FileSpreadsheet, Lock, Activity, Clock, AlertTriangle, Sparkles } from 'lucide-react';

export default function AuditPage() {
  const indicators = [
    { id: 1, t: 'Information du public', score: 100 },
    { id: 11, t: 'Suivi de la formation', score: 88 },
    { id: 22, t: 'Reclamations', score: 96 },
    { id: 32, t: 'Veille reglementaire', score: 92 },
  ];
  return (
    <>
      <Topbar title="Audit & Conformite" subtitle="Qualiopi, OPCO, RGPD - Mise a jour il y a 12 minutes" />
      <main className="flex-1 p-6 space-y-6">
        {/* Score */}
        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 bg-gradient-to-br from-ink-900 to-ink-700 text-white border-0 p-6 relative overflow-hidden">
            <div className="absolute inset-0 dot-grid opacity-10" />
            <div className="relative">
              <Badge tone="cyan" className="bg-white/10 text-neon-cyan border-white/10"><ShieldCheck className="size-3" /> Score Qualiopi</Badge>
              <div className="mt-2 flex items-baseline gap-2">
                <p className="text-5xl font-semibold">94<span className="text-2xl text-ink-200/60">/100</span></p>
                <Badge tone="emerald" dot>conforme</Badge>
              </div>
              <p className="mt-1 text-sm text-ink-200/80">68 dossiers analyses, 4 indicateurs verts, 0 non-conformite majeure.</p>
              <div className="mt-6 grid sm:grid-cols-2 gap-3">
                {indicators.map(i => (
                  <div key={i.id} className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <div className="flex items-center justify-between text-xs"><span className="text-ink-100">Indicateur {i.id}</span><span className="font-semibold tabular-nums">{i.score}%</span></div>
                    <p className="text-[11px] text-ink-200/70">{i.t}</p>
                    <div className="mt-2 h-1.5 rounded-full bg-white/10">
                      <div className="h-full rounded-full bg-gradient-to-r from-neon-cyan to-neon-mint" style={{ width: `${i.score}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Exports d\'audit</CardTitle>
            </CardHeader>
            <CardBody className="space-y-3">
              {[
                { icon: FileSpreadsheet, t: 'Export OPCO (CSV)', d: '68 dossiers - 1.4 Mo' },
                { icon: ShieldCheck, t: 'Preuves Qualiopi (ZIP)', d: 'PDF + journaux horodates' },
                { icon: Lock, t: 'Coffre RGPD (ZIP)', d: 'Donnees personnelles - chiffre' },
                { icon: Activity, t: 'Journal des actions (JSON)', d: 'Piste d\'audit complete' },
              ].map(e => (
                <div key={e.t} className="flex items-center gap-3 rounded-xl border border-ink-100 p-3">
                  <span className="size-9 rounded-lg bg-ink-50 flex items-center justify-center"><e.icon className="size-4 text-ink-700" /></span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-ink-900">{e.t}</p>
                    <p className="text-[11px] text-ink-400">{e.d}</p>
                  </div>
                  <Button size="sm" variant="ghost"><Download className="size-3.5" /></Button>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>

        {/* Alertes IA */}
        <Card className="p-5 border-amber-200 bg-amber-50/40">
          <div className="flex items-start gap-3">
            <span className="size-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700"><AlertTriangle className="size-5" /></span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-ink-900 inline-flex items-center gap-2"><Sparkles className="size-3.5 text-amber-600" /> 4 alertes detectees par Sygna IA</p>
              <ul className="mt-2 text-sm text-ink-700 space-y-1">
                <li>- Tom Renard : convention 2024 sans signature OPCO depuis 5 jours</li>
                <li>- Yanis Cohen : 4 documents manquants pour son livret Q3</li>
                <li>- Hugo Pereira : livret de septembre refuse, sans nouvelle version</li>
                <li>- Indicateur 11 : 4 visites entreprise non documentees ce trimestre</li>
              </ul>
              <div className="mt-3 flex gap-2">
                <Button size="sm" variant="primary">Lancer les correctifs IA</Button>
                <Button size="sm" variant="outline">Voir le detail</Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Conformite par apprenti */}
        <Card>
          <CardHeader><CardTitle>Conformite par dossier apprenti</CardTitle></CardHeader>
          <CardBody className="p-0">
            <table className="w-full text-sm">
              <thead className="text-[11px] uppercase tracking-wider text-ink-400 bg-ink-50/40">
                <tr>
                  <th className="text-left font-medium px-5 py-2.5">Apprenti</th>
                  <th className="text-left font-medium px-5 py-2.5">Formation</th>
                  <th className="text-left font-medium px-5 py-2.5">Conformite</th>
                  <th className="text-left font-medium px-5 py-2.5">Pieces manquantes</th>
                  <th className="text-left font-medium px-5 py-2.5">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {apprentis.map(a => (
                  <tr key={a.id} className="hover:bg-ink-50/40">
                    <td className="px-5 py-3 font-semibold text-ink-900">{a.name}</td>
                    <td className="px-5 py-3 text-ink-700">{a.formation}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <Progress value={a.conformite} tone={a.conformite >= 90 ? 'emerald' : a.conformite >= 75 ? 'cyan' : 'amber'} className="flex-1" />
                        <span className="text-xs font-semibold tabular-nums w-9 text-right">{a.conformite}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-ink-700">{a.documentsManquants}</td>
                    <td className="px-5 py-3">{a.documentsManquants === 0 ? <Badge tone="emerald" dot>conforme</Badge> : <Badge tone="amber" dot>a corriger</Badge>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardBody>
        </Card>

        {/* Journal */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Journal des actions (piste d\'audit)</CardTitle>
              <Button size="sm" variant="outline"><Download className="size-3.5" /> Exporter JSON</Button>
            </div>
          </CardHeader>
          <CardBody className="p-0">
            <ul className="divide-y divide-ink-100 font-mono text-xs">
              {activity.map(a => (
                <li key={a.id} className="px-5 py-2.5 flex items-center gap-3">
                  <Clock className="size-3.5 text-ink-400 shrink-0" />
                  <span className="text-ink-400 w-44 shrink-0">{formatDateTime(a.ts)}</span>
                  <span className="text-ink-900 font-semibold">{a.actor}</span>
                  <span className="text-ink-500">{a.action}</span>
                  <span className="text-ink-700 truncate">{a.target}</span>
                  <span className="ml-auto text-ink-400">{a.ip}</span>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </main>
    </>
  );
}
