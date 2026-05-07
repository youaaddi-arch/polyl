import { Topbar } from '@/components/Topbar';
import { Card, CardHeader, CardTitle, CardBody } from '@/components/ui/Card';
import { KpiCard } from '@/components/KpiCard';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';
import { CategoryIcon } from '@/components/CategoryIcon';
import { StatusPill } from '@/components/StatusPill';
import { apprentis, documents } from '@/lib/mock-data';
import { formatDate, relativeTime } from '@/lib/utils';
import { Users, FileSignature, CalendarDays, BookOpen, NotebookPen, Sparkles, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function FormateurPage() {
  const mine = apprentis.filter(a => a.formateur === 'Helene Vasseur');
  const docs = documents.filter(d => mine.some(a => a.id === d.apprentiId));
  const visites = [
    { ts: '2025-10-12T10:00:00Z', apprenti: 'Lina Bouzid', entreprise: 'Acme Software SAS', city: 'Lyon 6e' },
    { ts: '2025-10-15T14:30:00Z', apprenti: 'Tom Renard', entreprise: 'Banque Forteresse', city: 'Lyon 3e' },
    { ts: '2025-10-18T09:00:00Z', apprenti: 'Amina Faure', entreprise: 'StudioPixel', city: 'Villeurbanne' },
  ];
  return (
    <>
      <Topbar title="Espace Formateur" subtitle="Helene Vasseur - Referente pedagogique" />
      <main className="flex-1 p-6 space-y-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard label="Apprentis suivis" value={mine.length} icon={Users} tone="cyan" />
          <KpiCard label="Comptes rendus a rediger" value={2} icon={NotebookPen} tone="violet" />
          <KpiCard label="Documents a signer" value={1} icon={FileSignature} tone="emerald" />
          <KpiCard label="Visites planifiees" value={visites.length} icon={CalendarDays} tone="amber" />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Mes apprentis</CardTitle>
                <Link href="/apprentis" className="text-xs font-semibold text-ink-700 hover:underline">Tous</Link>
              </div>
            </CardHeader>
            <CardBody className="p-0">
              <ul className="divide-y divide-ink-100">
                {mine.map(a => (
                  <li key={a.id} className="px-5 py-4 flex items-center gap-4">
                    <Avatar name={a.name} color={a.avatarColor} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-ink-900">{a.name}</p>
                      <p className="text-[11px] text-ink-400">{a.formation} - {a.entreprise}</p>
                      <Progress value={a.conformite} tone={a.conformite >= 90 ? 'emerald' : 'cyan'} className="mt-2 max-w-[260px]" />
                    </div>
                    <Badge tone={a.documentsManquants ? 'amber' : 'emerald'} dot>{a.documentsManquants ? `${a.documentsManquants} manquant${a.documentsManquants > 1 ? 's' : ''}` : 'A jour'}</Badge>
                    <Link href={`/livret/${a.id}`}><Button size="sm" variant="primary"><BookOpen className="size-3.5" /> Livret</Button></Link>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><CardTitle>Visites en entreprise</CardTitle></CardHeader>
            <CardBody className="space-y-3">
              {visites.map((v, i) => (
                <div key={i} className="rounded-xl border border-ink-100 p-3 flex items-start gap-3">
                  <span className="size-9 rounded-lg bg-ink-50 flex flex-col items-center justify-center text-[10px]">
                    <span className="font-semibold text-ink-900">{new Date(v.ts).getDate()}</span>
                    <span className="text-ink-400 uppercase">{new Intl.DateTimeFormat('fr', { month: 'short' }).format(new Date(v.ts))}</span>
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-ink-900">{v.apprenti}</p>
                    <p className="text-[11px] text-ink-500">{v.entreprise}</p>
                    <p className="text-[11px] text-ink-400 inline-flex items-center gap-1 mt-0.5"><MapPin className="size-3" /> {v.city}</p>
                  </div>
                  <Button size="sm" variant="ghost">CR</Button>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Activite documentaire</CardTitle>
              <Badge tone="cyan"><Sparkles className="size-3" /> 4 actions IA suggerees</Badge>
            </div>
          </CardHeader>
          <CardBody className="p-0">
            <ul className="divide-y divide-ink-100">
              {docs.slice(0, 6).map(d => {
                const a = apprentis.find(x => x.id === d.apprentiId)!;
                return (
                  <li key={d.id} className="px-5 py-3 flex items-center gap-3">
                    <CategoryIcon category={d.category} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-ink-900 truncate">{d.title}</p>
                      <p className="text-[11px] text-ink-400">{a.name} - {relativeTime(d.updatedAt)}</p>
                    </div>
                    <StatusPill status={d.status} />
                  </li>
                );
              })}
            </ul>
          </CardBody>
        </Card>
      </main>
    </>
  );
}
