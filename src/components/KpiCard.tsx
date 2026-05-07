import { Card } from './ui/Card';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

export function KpiCard({
  label, value, delta, icon: Icon, tone = 'cyan',
}: {
  label: string; value: string | number; delta?: string;
  icon: LucideIcon; tone?: 'cyan' | 'violet' | 'emerald' | 'amber' | 'rose';
}) {
  const tones: Record<string, string> = {
    cyan: 'from-cyan-50 to-white text-cyan-700 ring-cyan-200/60',
    violet: 'from-violet-50 to-white text-violet-700 ring-violet-200/60',
    emerald: 'from-emerald-50 to-white text-emerald-700 ring-emerald-200/60',
    amber: 'from-amber-50 to-white text-amber-700 ring-amber-200/60',
    rose: 'from-rose-50 to-white text-rose-700 ring-rose-200/60',
  };
  return (
    <Card className="p-5 relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-ink-400 uppercase tracking-wide">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-ink-900 tabular-nums">{value}</p>
          {delta && <p className="mt-1 text-xs text-ink-500">{delta}</p>}
        </div>
        <div className={cn('size-10 rounded-xl flex items-center justify-center bg-gradient-to-br ring-1', tones[tone])}>
          <Icon className="size-5" />
        </div>
      </div>
    </Card>
  );
}
