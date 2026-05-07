import { BookOpen, FileSignature, FileCheck2, CalendarDays, NotebookPen, ClipboardList, Stamp } from 'lucide-react';
import type { DocCategory } from '@/lib/types';
import { cn } from '@/lib/utils';

const map: Record<DocCategory, { icon: typeof BookOpen; bg: string; fg: string }> = {
  livret: { icon: BookOpen, bg: 'bg-violet-50', fg: 'text-violet-600' },
  convention: { icon: FileSignature, bg: 'bg-cyan-50', fg: 'text-cyan-600' },
  attestation: { icon: FileCheck2, bg: 'bg-emerald-50', fg: 'text-emerald-600' },
  convocation: { icon: CalendarDays, bg: 'bg-amber-50', fg: 'text-amber-600' },
  'compte-rendu': { icon: NotebookPen, bg: 'bg-sky-50', fg: 'text-sky-600' },
  suivi: { icon: ClipboardList, bg: 'bg-rose-50', fg: 'text-rose-600' },
  emargement: { icon: Stamp, bg: 'bg-ink-50', fg: 'text-ink-700' },
};

export function CategoryIcon({ category, size = 'md' }: { category: DocCategory; size?: 'sm' | 'md' }) {
  const meta = map[category];
  const Icon = meta.icon;
  return (
    <span className={cn('inline-flex items-center justify-center rounded-lg', meta.bg, size === 'sm' ? 'size-7' : 'size-9')}>
      <Icon className={cn(meta.fg, size === 'sm' ? 'size-3.5' : 'size-4')} />
    </span>
  );
}
