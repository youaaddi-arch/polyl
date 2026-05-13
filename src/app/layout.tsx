import "./globals.css";
import type { Metadata } from "next";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "CRM Formation — Groupe CFA",
  description: "CRM sur mesure multi-entités CFA — Agent IA & Automatisation (CDC V2.0)",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen flex">
        <Sidebar />
        <main className="flex-1 px-8 py-8 overflow-x-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
