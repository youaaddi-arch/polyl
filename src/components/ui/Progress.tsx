import { cn } from '@/lib/utils';

export function Progress({ value, tone = 'cyan', className }: { value: number; tone?: 'cyan' | 'emerald' | 'amber' | 'rose' | 'violet'; className?: string }) {
  const fills: Record<string, string> = {
    cyan: 'bg-gradient-to-r from-cyan-400 to-sky-500',
    emerald: 'bg-gradient-to-r from-emerald-400 to-teal-500',
    amber: 'bg-gradient-to-r from-amber-400 to-orange-500',
    rose: 'bg-gradient-to-r from-rose-400 to-pink-500',
    violet: 'bg-gradient-to-r from-violet-400 to-fuchsia-500',
  };
  return (
    <div className={cn('h-1.5 w-full rounded-full bg-ink-100 overflow-hidden', className)}>
      <div className={cn('h-full rounded-full transition-all', fills[tone])} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}
