import Link from "next/link";

const NAV = [
  { href: "/",                    label: "Tableau de bord", icon: "📊" },
  { href: "/candidats",           label: "Candidats",       icon: "🎓" },
  { href: "/candidats/pipeline",  label: "Pipeline candidats", icon: "🧭" },
  { href: "/entreprises",         label: "Entreprises",     icon: "🏢" },
  { href: "/entreprises/pipeline", label: "Pipeline entreprises", icon: "💼" },
  { href: "/formations",          label: "Formations",      icon: "📚" },
  { href: "/taches",              label: "Tâches",          icon: "✅" },
  { href: "/evenements",          label: "Événements",      icon: "🗓️" },
  { href: "/veille",              label: "Veille",          icon: "🛰️" },
];

export default function Sidebar() {
  return (
    <aside className="w-64 shrink-0 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      <div className="px-6 py-5 border-b">
        <div className="text-lg font-bold text-brand-700">CRM Formation</div>
        <div className="text-xs text-gray-500">Groupe CFA — Multi-entités</div>
      </div>
      <nav className="px-3 py-4 space-y-1 flex-1">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-brand-50 hover:text-brand-700"
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="px-6 py-4 border-t text-xs text-gray-400">
        v0.1 — MVP CDC V2.0
      </div>
    </aside>
  );
}
