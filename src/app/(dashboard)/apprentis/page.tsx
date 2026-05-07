import { Topbar } from '@/components/Topbar';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';
import { apprentis } from '@/lib/mock-data';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import { Plus, Search, GraduationCap, Building2, BookOpen } from 'lucide-react';

export default function ApprentisPage() {
  return (
    <>
      <Topbar title="Apprentis" subtitle={`${apprentis.length} dossiers actifs`} />
      <main className="flex-1 p-6 space-y-6">
        <Card className="p-4 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 h-10 px-3 rounded-xl border border-ink-100 bg-ink-50/60 flex-1 min-w-[260px]">
            <Search className="size-4 text-ink-400" />
            <input placeholder="Rechercher un apprenti, formation, entreprise..." className="flex-1 bg-transparent text-sm outline-none" />
          </div>
          <Button variant="neon"><Plus className="size-3.5" /> Nouveau dossier</Button>
        </Card>

        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {apprentis.map(a => (
            <Card key={a.id} className="p-5 hover:border-ink-300 transition">
              <div className="flex items-start gap-4">
                <Avatar name={a.name} color={a.avatarColor} size="lg" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-base font-semibold text-ink-900 truncate">{a.name}</p>
                    <Badge tone={a.documentsManquants ? 'amber' : 'emerald'} dot>{a.documentsManquants ? `${a.documentsManquants}` : 'OK'}</Badge>
                  </div>
                  <p className="text-xs text-ink-500">{a.email}</p>
                  <div className="mt-3 space-y-1.5 text-xs text-ink-600">
                    <div className="flex items-center gap-2"><GraduationCap className="size-3.5 text-ink-400" /> {a.formation}</div>
                    <div className="flex items-center gap-2"><Building2 className="size-3.5 text-ink-400" /> {a.entreprise}</div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-ink-500">Conformite</span>
                      <span className="font-semibold tabular-nums">{a.conformite}%</span>
                    </div>
                    <Progress value={a.conformite} tone={a.conformite >= 90 ? 'emerald' : a.conformite >= 75 ? 'cyan' : 'amber'} className="mt-1" />
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <Link href={`/livret/${a.id}`} className="flex-1"><Button variant="primary" size="sm" className="w-full"><BookOpen className="size-3.5" /> Livret</Button></Link>
                    <Button variant="outline" size="sm">Documents</Button>
                  </div>
                  <p className="mt-3 text-[10px] text-ink-400">Du {formatDate(a.startDate)} au {formatDate(a.endDate)} - Promo {a.promo}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </>
  );
}
