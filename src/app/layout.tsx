import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sygna - Signature electronique pour CFA & alternance',
  description: 'Plateforme SaaS conforme RGPD/Qualiopi pour signer livrets d\'apprentissage, conventions, attestations et emargements. Pensee pour les CFA, entreprises et apprentis.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-white text-ink-900 antialiased">{children}</body>
    </html>
  );
}
