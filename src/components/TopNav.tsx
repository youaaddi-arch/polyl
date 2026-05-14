"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

type Item = { href: string; label: string; desc?: string };
type Section = { label: string; items: Item[] };

const NAV: Section[] = [
  {
    label: "CRM",
    items: [
      { href: "/candidats", label: "Contacts (Candidats)", desc: "Fiches apprenants & prospects" },
      { href: "/entreprises", label: "Entreprises", desc: "Comptes & partenaires" },
      { href: "/deals", label: "Deals", desc: "Pipeline d'opportunités" },
      { href: "/tickets", label: "Tickets", desc: "Support & SAV" },
      { href: "/listes", label: "Listes", desc: "Segments sauvegardés" },
      { href: "/inbox", label: "Inbox", desc: "Communications unifiées" },
      { href: "/taches", label: "Tâches", desc: "Actions commerciales" },
      { href: "/meetings", label: "Rendez-vous", desc: "Calendrier RDV" },
    ],
  },
  {
    label: "Marketing",
    items: [
      { href: "/campaigns", label: "Email", desc: "Campagnes marketing" },
      { href: "/formulaires", label: "Formulaires", desc: "Capture leads publics" },
      { href: "/templates-emails", label: "Templates emails", desc: "Modèles réutilisables" },
      { href: "/evenements", label: "Événements", desc: "Job Dating, JIC" },
      { href: "/veille", label: "Veille", desc: "Veille réglementaire" },
    ],
  },
  {
    label: "Sales",
    items: [
      { href: "/deals", label: "Pipeline Deals", desc: "Opportunités B2B" },
      { href: "/quotes", label: "Devis (Quotes)", desc: "Génération devis PDF" },
      { href: "/sequences", label: "Sequences", desc: "Cadences emails" },
      { href: "/candidats/pipeline", label: "Pipeline candidats", desc: "Kanban 19 étapes" },
      { href: "/entreprises/pipeline", label: "Pipeline entreprises", desc: "Kanban 17 étapes" },
      { href: "/meetings", label: "Meeting scheduler", desc: "Réservation de RDV" },
    ],
  },
  {
    label: "Service",
    items: [
      { href: "/tickets", label: "Tickets", desc: "Support kanban" },
      { href: "/inbox", label: "Conversations", desc: "Inbox unifié" },
    ],
  },
  {
    label: "Automations",
    items: [
      { href: "/workflows", label: "Workflows", desc: "Si X alors Y" },
      { href: "/sequences", label: "Sequences", desc: "Multi-étapes emails" },
    ],
  },
  {
    label: "Reports",
    items: [
      { href: "/reports", label: "Reports & analytics", desc: "Tableaux de bord" },
      { href: "/", label: "Dashboard accueil", desc: "Vue d'ensemble" },
      { href: "/imports", label: "Imports / Exports", desc: "CSV en masse" },
    ],
  },
  {
    label: "Catalogue",
    items: [
      { href: "/formations", label: "Formations", desc: "6 entités, ~20 formations" },
    ],
  },
];

export default function TopNav() {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenSection(null);
      }
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenSection(null);
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  return (
    <header className="bg-hubspot-navy text-white sticky top-0 z-50 shadow-md">
      <div className="px-6 h-14 flex items-center gap-1" ref={navRef}>
        <Link href="/" className="flex items-center gap-2 mr-6">
          <div className="w-8 h-8 bg-hubspot-orange rounded-full flex items-center justify-center font-bold text-sm">C</div>
          <span className="font-bold text-base hidden sm:inline">CRM Formation</span>
        </Link>

        <nav className="flex items-center">
          {NAV.map((section) => (
            <div key={section.label} className="relative">
              <button
                onClick={() => setOpenSection(openSection === section.label ? null : section.label)}
                className={`px-3 py-2 text-sm font-medium rounded transition flex items-center gap-1 ${
                  openSection === section.label ? "bg-white/15" : "hover:bg-white/10"
                }`}
              >
                {section.label}
                <svg className="w-3 h-3 opacity-70" fill="currentColor" viewBox="0 0 12 12">
                  <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
                </svg>
              </button>

              {openSection === section.label && (
                <div className="absolute top-full left-0 mt-1 bg-white text-hubspot-text rounded-md shadow-hs-dropdown border border-hubspot-border w-80 py-2 z-50">
                  <div className="px-4 py-2 text-[10px] font-semibold text-hubspot-text-muted uppercase tracking-wider border-b border-hubspot-border">
                    {section.label}
                  </div>
                  {section.items.map((item) => (
                    <Link
                      key={`${section.label}-${item.href}-${item.label}`}
                      href={item.href}
                      onClick={() => setOpenSection(null)}
                      className="block px-4 py-2.5 hover:bg-hubspot-bg-alt group"
                    >
                      <div className="text-sm font-medium group-hover:text-hubspot-orange">{item.label}</div>
                      {item.desc && <div className="text-xs text-hubspot-text-muted mt-0.5">{item.desc}</div>}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="flex-1" />

        <Link href="/recherche" className="px-3 py-2 hover:bg-white/10 rounded text-sm flex items-center gap-2" title="Recherche globale">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <span className="hidden md:inline">Rechercher</span>
        </Link>

        <Link href="/imports" className="p-2 hover:bg-white/10 rounded" title="Imports / Exports">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
        </Link>

        <Link href="/settings" className="p-2 hover:bg-white/10 rounded" title="Paramètres">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
        </Link>

        <div className="relative ml-2">
          <button
            onClick={() => setOpenSection(openSection === "_user" ? null : "_user")}
            className="w-9 h-9 rounded-full bg-hubspot-orange hover:bg-hubspot-orange-hover flex items-center justify-center text-sm font-semibold"
            title="Mon compte"
          >
            Y
          </button>
          {openSection === "_user" && (
            <div className="absolute top-full right-0 mt-1 bg-white text-hubspot-text rounded-md shadow-hs-dropdown border border-hubspot-border w-72 py-2 z-50">
              <div className="px-4 py-3 border-b border-hubspot-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-hubspot-orange text-white flex items-center justify-center font-bold">Y</div>
                  <div>
                    <div className="font-semibold text-sm">Yousra</div>
                    <div className="text-xs text-hubspot-text-muted">admin@groupe-cfa.fr</div>
                    <span className="badge bg-purple-50 text-purple-700 mt-1">admin</span>
                  </div>
                </div>
              </div>
              <Link href="/settings/profil" onClick={() => setOpenSection(null)} className="block px-4 py-2 text-sm hover:bg-hubspot-bg-alt">👤 Mon profil</Link>
              <Link href="/settings/preferences" onClick={() => setOpenSection(null)} className="block px-4 py-2 text-sm hover:bg-hubspot-bg-alt">🎛️ Mes préférences</Link>
              <Link href="/settings/notifications" onClick={() => setOpenSection(null)} className="block px-4 py-2 text-sm hover:bg-hubspot-bg-alt">🔔 Notifications</Link>
              <Link href="/settings/email" onClick={() => setOpenSection(null)} className="block px-4 py-2 text-sm hover:bg-hubspot-bg-alt">✉️ Email & signature</Link>
              <Link href="/settings/calendrier" onClick={() => setOpenSection(null)} className="block px-4 py-2 text-sm hover:bg-hubspot-bg-alt">📅 Calendrier</Link>
              <Link href="/settings/securite" onClick={() => setOpenSection(null)} className="block px-4 py-2 text-sm hover:bg-hubspot-bg-alt">🔒 Sécurité & 2FA</Link>
              <div className="border-t border-hubspot-border my-1" />
              <Link href="/settings" onClick={() => setOpenSection(null)} className="block px-4 py-2 text-sm hover:bg-hubspot-bg-alt">⚙️ Tous les paramètres</Link>
              <a href="#" className="block px-4 py-2 text-sm hover:bg-hubspot-bg-alt">❓ Aide & support</a>
              <div className="border-t border-hubspot-border my-1" />
              <a href="#" className="block px-4 py-2 text-sm hover:bg-rose-50 text-rose-600">🚪 Se déconnecter</a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
