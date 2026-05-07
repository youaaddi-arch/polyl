import { Topbar } from '@/components/Topbar';
import { Card, CardHeader, CardTitle, CardBody } from '@/components/ui/Card';
import { KpiCard } from '@/components/KpiCard';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';
import { CategoryIcon } from '@/components/CategoryIcon';
import { StatusPill } from '@/components/StatusPill';
import { apprentis, documents, categoryLabels } from '@/lib/mock-data';
import { formatDate, relativeTime } from '@/lib/utils';
import { BookOpen, FileSignature, CalendarCheck, GraduationCap, Building2, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function ApprentiPage() {
  const me = apprentis[0]; // Lina
  const myDocs = documents.filter(d => d.apprentiId === me.id);
  const todo = myDocs.filter(d => d.signers.some(s => s.role === 'apprenti' && s.status !== 'signe' && s.status !== 'refuse'));

  return (
    <>
      <Topbar title="Bonjour Lina" subtitle="BTS SIO SLAM - Acme Software SAS" />
      <main className="flex-1 p-6 space-y-6">
        <Card className="relative overflow-hidden bg-gradient-to-br from-ink-900 to-ink-700 text-white border-0 p-6">
          <div className="absolute inset-0 dot-grid opacity-10" />
          <div className="relative grid md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2">
              <Badge tone="cyan" className="bg-white/10 text-neon-cyan border-white/10"><Sparkles className="size-3" /> Bienvenue sur Sygna</Badge>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight">{todo.length > 0 ? `Tu as ${todo.length} document a signer cette semaine.` : 'Tout est a jour, bravo.'}</h2>
              <p className="mt-1 text-sm text-ink-200/80">Ta progression : 18 competences validees sur 22, 12 entrees mensuelles, 0 absence injustifiee.</p>
            </div>
            <div className="flex md:justify-end gap-2">
              <Link href={`/livret/${me.id}`}><Button variant="neon" size="sm"><BookOpen className="size-3.5" /> Mon livret</Button></Link>
            </div>
          </div>
        </Card>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard label="Documents a signer" value={todo.length} icon={FileSignature} tone="violet" />
          <KpiCard label="Conformite dossier" value={`${me.conformite}%`} icon={GraduationCap} tone="emerald" />
          <KpiCard label="Visites en entreprise" value={3} icon={Building2} tone="cyan" />
          <KpiCard label="Prochaine evaluation" value={formatDate('2025-11-12')} icon={CalendarCheck} tone="amber" />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Mes documents</CardTitle>
                <Link href="/documents" className="text-xs font-semibold text-ink-700 hover:underline">Tout voir</Link>
              </div>
            </CardHeader>
            <CardBody className="p-0">
              <ul className="divide-y divide-ink-100">
                {myDocs.map(d => (
                  <li key={d.id} className="px-5 py-3.5 flex items-center gap-3">
                    <CategoryIcon category={d.category} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-ink-900 truncate">{d.title}</p>
                      <p className="text-[11px] text-ink-400">{categoryLabels[d.category]} - {relativeTime(d.updatedAt)}</p>
                    </div>
                    <StatusPill status={d.status} />
                    {d.signers.find(s => s.role === 'apprenti')?.status !== 'signe' && (
                      <Link href={`/sign/${d.id}`}><Button size="sm" variant="primary">Signer</Button></Link>
                    )}
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><CardTitle>Mon parcours</CardTitle></CardHeader>
            <CardBody className="space-y-4">
              <Stat label="Competences validees" value={18} total={22} tone="emerald" />
              <Stat label="Visites entreprise" value={3} total={4} tone="cyan" />
              <Stat label="Suivi pedagogique" value={6} total={8} tone="violet" />
              <Stat label="Heures realisees" value={840} total={1200} tone="amber" suffix="h" />
              <div className="pt-2 border-t border-ink-100">
                <p className="text-xs text-ink-500">Tuteur: <span className="text-ink-800 font-semibold">{me.tuteur}</span></p>
                <p className="text-xs text-ink-500">Formateur: <span className="text-ink-800 font-semibold">{me.formateur}</span></p>
              </div>
            </CardBody>
          </Card>
        </div>
      </main>
    </>
  );
}

function Stat({ label, value, total, tone, suffix = '' }: { label: string; value: number; total: number; tone: 'emerald' | 'cyan' | 'violet' | 'amber'; suffix?: string }) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-ink-600">{label}</span>
        <span className="font-semibold text-ink-900 tabular-nums">{value}{suffix}/{total}{suffix}</span>
      </div>
      <Progress value={(value / total) * 100} tone={tone} className="mt-1.5" />
    </div>
  );
}
