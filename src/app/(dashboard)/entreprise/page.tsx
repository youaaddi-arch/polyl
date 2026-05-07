import { Topbar } from '@/components/Topbar';
import { Card, CardHeader, CardTitle, CardBody } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';
import { KpiCard } from '@/components/KpiCard';
import { CategoryIcon } from '@/components/CategoryIcon';
import { StatusPill } from '@/components/StatusPill';
import { apprentis, documents, categoryLabels } from '@/lib/mock-data';
import { relativeTime } from '@/lib/utils';
import { Building2, FileSignature, ClipboardCheck, Bell, Send, GraduationCap } from 'lucide-react';
import Link from 'next/link';

export default function EntreprisePage() {
  const myApprentis = apprentis.filter(a => a.entreprise === 'Acme Software SAS');
  const myDocs = documents.filter(d => myApprentis.some(a => a.id === d.apprentiId));
  const todo = myDocs.filter(d => d.signers.some(s => s.role === 'entreprise' && s.status !== 'signe' && s.status !== 'refuse'));
  return (
    <>
      <Topbar title="Espace Entreprise" subtitle="Acme Software SAS - Karim Dupont (Tuteur)" />
      <main className="flex-1 p-6 space-y-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard label="Apprentis encadres" value={myApprentis.length} icon={GraduationCap} tone="cyan" />
          <KpiCard label="Documents a signer" value={todo.length} icon={FileSignature} tone="violet" delta={todo.length ? 'Prioritaire' : 'A jour'} />
          <KpiCard label="Signatures du mois" value={6} icon={ClipboardCheck} tone="emerald" />
          <KpiCard label="Visites planifiees" value={2} icon={Building2} tone="amber" />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>A signer</CardTitle>
                <Badge tone="amber" dot>{todo.length} en attente</Badge>
              </div>
            </CardHeader>
            <CardBody className="p-0">
              {todo.length === 0 ? (
                <p className="p-6 text-sm text-ink-500">Aucun document a signer pour le moment.</p>
              ) : (
                <ul className="divide-y divide-ink-100">
                  {todo.map(d => {
                    const a = apprentis.find(x => x.id === d.apprentiId)!;
                    return (
                      <li key={d.id} className="px-5 py-4 flex items-center gap-4">
                        <CategoryIcon category={d.category} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-ink-900 truncate">{d.title}</p>
                          <p className="text-[11px] text-ink-400">{categoryLabels[d.category]} - {a.name}</p>
                        </div>
                        <StatusPill status={d.status} />
                        <Link href={`/sign/${d.id}`}><Button size="sm" variant="neon">Signer</Button></Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader><CardTitle>Mes apprentis</CardTitle></CardHeader>
            <CardBody className="p-0">
              <ul className="divide-y divide-ink-100">
                {myApprentis.map(a => (
                  <li key={a.id} className="px-5 py-3 flex items-center gap-3">
                    <Avatar name={a.name} color={a.avatarColor} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-ink-900 truncate">{a.name}</p>
                      <p className="text-[11px] text-ink-400 truncate">{a.formation}</p>
                      <Progress value={a.conformite} tone={a.conformite >= 90 ? 'emerald' : 'cyan'} className="mt-1.5 max-w-[160px]" />
                    </div>
                    <Link href={`/livret/${a.id}`}><Button size="sm" variant="ghost">Livret</Button></Link>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle>Historique recent</CardTitle></CardHeader>
          <CardBody className="p-0">
            <ul className="divide-y divide-ink-100">
              {myDocs.slice(0, 8).map(d => (
                <li key={d.id} className="px-5 py-3 flex items-center gap-3 text-sm">
                  <CategoryIcon category={d.category} size="sm" />
                  <span className="flex-1 truncate text-ink-800">{d.title}</span>
                  <span className="text-xs text-ink-400 mr-3">{relativeTime(d.updatedAt)}</span>
                  <StatusPill status={d.status} />
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </main>
    </>
  );
}
