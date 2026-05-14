import Link from "next/link";

type SettingsGroup = { titre: string; items: { href: string; label: string; icon?: string }[] };

const GROUPES: SettingsGroup[] = [
  {
    titre: "Mon compte",
    items: [
      { href: "/settings/profil", label: "Mon profil", icon: "👤" },
      { href: "/settings/preferences", label: "Préférences", icon: "🎛️" },
      { href: "/settings/notifications", label: "Notifications", icon: "🔔" },
      { href: "/settings/securite", label: "Sécurité & 2FA", icon: "🔒" },
      { href: "/settings/email", label: "Email & signature", icon: "✉️" },
      { href: "/settings/calendrier", label: "Calendrier", icon: "📅" },
    ],
  },
  {
    titre: "Compte du groupe",
    items: [
      { href: "/settings", label: "Général", icon: "🏢" },
      { href: "/settings/branding", label: "Branding & logo", icon: "🎨" },
      { href: "/settings/devises", label: "Devises", icon: "💱" },
      { href: "/settings/entites", label: "Entités du groupe", icon: "🏛️" },
    ],
  },
  {
    titre: "Utilisateurs & équipes",
    items: [
      { href: "/settings/utilisateurs", label: "Utilisateurs", icon: "👥" },
      { href: "/settings/equipes", label: "Équipes", icon: "🧩" },
      { href: "/settings/permissions", label: "Permissions & rôles", icon: "🛡️" },
    ],
  },
  {
    titre: "Données",
    items: [
      { href: "/settings/proprietes", label: "Propriétés personnalisées", icon: "🏷️" },
      { href: "/settings/pipelines", label: "Pipelines & étapes", icon: "🔀" },
      { href: "/settings/snippets", label: "Snippets / Raccourcis", icon: "💬" },
      { href: "/settings/objets", label: "Objets CRM", icon: "📦" },
    ],
  },
  {
    titre: "Outils & intégrations",
    items: [
      { href: "/settings/integrations", label: "App marketplace", icon: "🔌" },
      { href: "/settings/api", label: "Clés API & Webhooks", icon: "🔑" },
      { href: "/settings/telephonie", label: "Téléphonie VoIP", icon: "📞" },
      { href: "/settings/social", label: "Réseaux sociaux", icon: "📱" },
    ],
  },
  {
    titre: "RGPD & sécurité",
    items: [
      { href: "/settings/rgpd", label: "RGPD & consentement", icon: "📋" },
      { href: "/settings/audit", label: "Journal d'audit", icon: "📜" },
      { href: "/settings/sauvegardes", label: "Sauvegardes", icon: "💾" },
    ],
  },
];

export default function SettingsNav({ active }: { active?: string }) {
  return (
    <aside className="w-64 shrink-0 border-r border-hubspot-border bg-white pr-2 py-4 min-h-[calc(100vh-3.5rem)]">
      {GROUPES.map((g) => (
        <div key={g.titre} className="mb-5">
          <div className="px-4 py-1 text-[10px] font-semibold text-hubspot-text-muted uppercase tracking-wider">{g.titre}</div>
          {g.items.map((item) => {
            const isActive = active === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2 text-sm border-l-2 transition ${
                  isActive
                    ? "border-hubspot-orange bg-hubspot-bg-alt text-hubspot-orange font-semibold"
                    : "border-transparent text-hubspot-text hover:bg-hubspot-bg-alt"
                }`}
              >
                {item.icon && <span className="text-base">{item.icon}</span>}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      ))}
    </aside>
  );
}
