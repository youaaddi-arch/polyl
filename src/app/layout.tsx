import "./globals.css";
import type { Metadata } from "next";
import TopNav from "@/components/TopNav";

export const metadata: Metadata = {
  title: "CRM Formation — Groupe CFA",
  description: "CRM sur mesure multi-entités CFA — Agent IA & Automatisation (CDC V2.0)",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen">
        <TopNav />
        <main className="px-8 py-8 max-w-[1400px] mx-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
