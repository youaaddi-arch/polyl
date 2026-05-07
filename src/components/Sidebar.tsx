'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from './Logo';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, Users, FileText, ShieldCheck, Settings, Building2, GraduationCap,
  PenLine, Sparkles, BookOpen, FolderClock,
} from 'lucide-react';

const groups = [
  {
    label: 'Vue d\'ensemble',
    items: [
      { href: '/admin', label: 'Tableau de bord', icon: LayoutDashboard },
      { href: '/apprentis', label: 'Apprentis', icon: GraduationCap },
      { href: '/documents', label: 'Documents', icon: FileText },
      { href: '/livret/apr_001', label: 'Livret type', icon: BookOpen },
    ],
  },
  {
    label: 'Espaces',
    items: [
      { href: '/entreprise', label: 'Espace entreprise', icon: Building2 },
      { href: '/apprenti', label: 'Espace apprenti', icon: Users },
      { href: '/formateur', label: 'Espace formateur', icon: PenLine },
    ],
  },
  {
    label: 'Conformite',
    items: [
      { href: '/audit', label: 'Audit & Qualiopi', icon: ShieldCheck },
      { href: '/parametres', label: 'Parametres', icon: Settings },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-ink-100 bg-white">
      <div className="p-4 border-b border-ink-100">
        <Link href="/admin"><Logo /></Link>
      </div>
      <nav className="flex-1 p-3 space-y-6 overflow-y-auto scrollbar-thin">
        {groups.map(g => (
          <div key={g.label}>
            <p className="px-2 mb-1 text-[10px] uppercase tracking-wider font-semibold text-ink-300">{g.label}</p>
            <ul className="space-y-0.5">
              {g.items.map(item => {
                const active = pathname === item.href || (item.href !== '/admin' && pathname?.startsWith(item.href));
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        'group flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition',
                        active
                          ? 'bg-ink-900 text-white shadow-[0_4px_16px_-6px_rgba(11,20,55,0.4)]'
                          : 'text-ink-600 hover:bg-ink-50 hover:text-ink-900',
                      )}
                    >
                      <item.icon className={cn('size-4', active ? 'text-neon-cyan' : 'text-ink-400 group-hover:text-ink-700')} />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
      <div className="p-3 border-t border-ink-100">
        <div className="rounded-xl p-3 bg-gradient-to-br from-ink-900 to-ink-700 text-white">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <Sparkles className="size-3.5 text-neon-cyan" />
            Sygna IA
          </div>
          <p className="mt-1 text-[11px] text-ink-200/80 leading-snug">
            3 dossiers a verifier, 2 documents manquants detectes ce matin.
          </p>
          <Link href="/audit" className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-neon-cyan hover:underline">
            <FolderClock className="size-3" /> Voir l\'analyse
          </Link>
        </div>
      </div>
    </aside>
  );
}
