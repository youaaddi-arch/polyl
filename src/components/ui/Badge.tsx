import * as React from 'react';
import { cn } from '@/lib/utils';

type Tone = 'neutral' | 'cyan' | 'violet' | 'emerald' | 'amber' | 'rose' | 'sky' | 'ink';

const tones: Record<Tone, string> = {
  neutral: 'bg-ink-50 text-ink-700 border border-ink-100',
  cyan: 'bg-cyan-50 text-cyan-700 border border-cyan-100',
  violet: 'bg-violet-50 text-violet-700 border border-violet-100',
  emerald: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
  amber: 'bg-amber-50 text-amber-700 border border-amber-100',
  rose: 'bg-rose-50 text-rose-700 border border-rose-100',
  sky: 'bg-sky-50 text-sky-700 border border-sky-100',
  ink: 'bg-ink-900 text-white border border-ink-800',
};

export function Badge({
  children, tone = 'neutral', className, dot = false,
}: { children: React.ReactNode; tone?: Tone; className?: string; dot?: boolean }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium', tones[tone], className)}>
      {dot && <span className="size-1.5 rounded-full bg-current opacity-70" />}
      {children}
    </span>
  );
}

export function statusTone(status: string): Tone {
  switch (status) {
    case 'signe': return 'emerald';
    case 'consulte': return 'sky';
    case 'envoye': return 'cyan';
    case 'refuse': return 'rose';
    case 'expire': return 'amber';
    case 'brouillon': return 'neutral';
    default: return 'neutral';
  }
}
