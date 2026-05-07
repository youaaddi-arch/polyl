'use client';
import { Search, Bell, Plus } from 'lucide-react';
import { Avatar } from './ui/Avatar';
import { Button } from './ui/Button';

export function Topbar({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="h-16 border-b border-ink-100 bg-white/70 glass sticky top-0 z-30">
      <div className="h-full px-6 flex items-center gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-base font-semibold text-ink-900 truncate">{title}</h1>
          {subtitle && <p className="text-xs text-ink-400 truncate">{subtitle}</p>}
        </div>
        <div className="hidden md:flex items-center gap-2 px-3 h-9 w-72 rounded-xl border border-ink-100 bg-ink-50/60">
          <Search className="size-4 text-ink-400" />
          <input placeholder="Rechercher un apprenti, un document..." className="flex-1 bg-transparent text-sm outline-none placeholder:text-ink-400" />
          <kbd className="hidden lg:inline px-1.5 py-0.5 text-[10px] rounded bg-white border border-ink-100 text-ink-400">ctrl K</kbd>
        </div>
        <Button size="sm" variant="neon" className="gap-1.5"><Plus className="size-3.5" /> Nouveau document</Button>
        <button className="relative size-9 rounded-xl border border-ink-100 hover:bg-ink-50 flex items-center justify-center">
          <Bell className="size-4 text-ink-600" />
          <span className="absolute top-2 right-2 size-1.5 rounded-full bg-rose-500" />
        </button>
        <Avatar name="Mireille Nadeau" color="from-cyan-400 to-violet-500" size="sm" />
      </div>
    </header>
  );
}
