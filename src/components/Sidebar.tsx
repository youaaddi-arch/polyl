import Link from "next/link";

const SECTIONS: { titre: string; items: { href: string; label: string; icon: string }[] }[] = [
  {
    titre: "Vue d'ensemble",
    items: [
      { href: "/", label: "Tableau de bord", icon: "📊" },
      { href: "/recherche", label: "Recherche globale", icon: "🔎" },
    ],
  },
  {
    titre: "Sales Hub",
    items: [
      { href: "/candidats", label: "Candidats", icon: "🎓" },
      { href: "/candidats/pipeline", label: "Pipeline candidats", icon: "🧭" },
      { href: "/entreprises", label: "Entreprises", icon: "🏢" },
      { href: "/entreprises/pipeline", label: "Pipeline entreprises", icon: "💼" },
      { href: "/deals", label: "Deals", icon: "💰" },
      { href: "/meetings", label: "Rendez-vous", icon: "📅" },
      { href: "/taches", label: "Tâches", icon: "✅" },
      { href: "/quotes", label: "Devis", icon: "📄" },
    ],
  },
  {
    titre: "Service Hub",
    items: [
      { href: "/tickets", label: "Tickets", icon: "🎫" },
      { href: "/inbox", label: "Inbox unifié", icon: "📥" },
    ],
  },
  {
    titre: "Marketing Hub",
    items: [
      { href: "/formulaires", label: "Formulaires", icon: "📋" },
      { href: "/listes", label: "Listes intelligentes", icon: "🗂️" },
      { href: "/templates-emails", label: "Templates emails", icon: "✉️" },
      { href: "/sequences", label: "Sequences", icon: "🔁" },
      { href: "/campaigns", label: "Email campaigns", icon: "📨" },
      { href: "/evenements", label: "Événements", icon: "🗓️" },
    ],
  },
  {
    titre: "Automation & Reports",
    items: [
      { href: "/workflows", label: "Workflows", icon: "⚡" },
      { href: "/reports", label: "Reports", icon: "📈" },
      { href: "/imports", label: "Imports / Exports", icon: "↕️" },
    ],
  },
  {
    titre: "Pédagogique & Veille",
    items: [
      { href: "/formations", label: "Formations", icon: "📚" },
      { href: "/veille", label: "Veille", icon: "🛰️" },
    ],
  },
  {
    titre: "Administration",
    items: [
      { href: "/settings", label: "Paramètres", icon: "⚙️" },
    ],
  },
];

export default function Sidebar() {
  return (
    <aside className="w-64 shrink-0 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      <div className="px-6 py-5 border-b">
        <div className="text-lg font-bold text-brand-700">CRM Formation</div>
        <div className="text-xs text-gray-500">Groupe CFA — HubSpot-like</div>
      </div>
      <nav className="px-3 py-3 flex-1 overflow-y-auto">
        {SECTIONS.map((sec) => (
          <div key={sec.titre} className="mb-4">
            <div className="px-3 py-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{sec.titre}</div>
            {sec.items.map((item) => (
              <Link key={item.href} href={item.href} className="flex items-center gap-3 px-3 py-1.5 rounded-lg text-sm text-gray-700 hover:bg-brand-50 hover:text-brand-700">
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        ))}
      </nav>
      <div className="px-6 py-4 border-t text-xs text-gray-400">
        v0.3 — HubSpot-like (vague 2)
      </div>
    </aside>
  );
}
