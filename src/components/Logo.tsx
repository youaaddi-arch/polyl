import { cn } from '@/lib/utils';

export function Logo({ className, light = false }: { className?: string; light?: boolean }) {
  return (
    <div className={cn('inline-flex items-center gap-2 font-display font-bold tracking-tight', className)}>
      <span className="relative inline-flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-violet-500 text-ink-900 shadow-[0_4px_16px_-4px_rgba(34,211,238,0.6)]">
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 17c2-3 4-5 7-5s5 2 6 5" />
          <path d="M5 12c1.5-1.5 3-2 5-2" />
          <circle cx="17" cy="7" r="2" />
        </svg>
      </span>
      <span className={cn('text-lg', light ? 'text-white' : 'text-ink-900')}>
        Sygna<span className="text-neon-cyan">.</span>
      </span>
    </div>
  );
}
