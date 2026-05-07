import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/Button';
import { Building2, GraduationCap, PenLine, Shield, Mail, Lock, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const roles = [
    { href: '/admin', icon: Shield, label: 'Administrateur CFA', desc: 'Pilotage global et conformite' },
    { href: '/entreprise', icon: Building2, label: 'Entreprise / Tuteur', desc: 'Suivi des apprentis & signatures' },
    { href: '/apprenti', icon: GraduationCap, label: 'Apprenti', desc: 'Mes documents et mon livret' },
    { href: '/formateur', icon: PenLine, label: 'Formateur', desc: 'Visites, comptes rendus, suivi' },
  ];
  return (
    <main className="min-h-screen grid lg:grid-cols-2">
      <section className="hidden lg:flex flex-col justify-between p-10 gradient-hero text-white relative overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-10" />
        <Logo light />
        <div className="relative">
          <p className="text-3xl font-semibold tracking-tight leading-tight max-w-md">
            Le standard de la signature electronique pour les CFA francais.
          </p>
          <div className="mt-8 flex items-center gap-3">
            {[1,2,3].map(i => (
              <span key={i} className="size-8 rounded-full ring-2 ring-ink-900 bg-gradient-to-br from-neon-cyan to-neon-violet" />
            ))}
            <p className="text-sm text-ink-200/80">Plus de 1 200 apprentis suivis ce mois-ci</p>
          </div>
        </div>
        <p className="text-xs text-ink-300/70">(c) {new Date().getFullYear()} Sygna - Hebergement France</p>
      </section>

      <section className="flex items-center justify-center p-6 lg:p-12 bg-white">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8"><Logo /></div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink-900">Connexion</h1>
          <p className="mt-1 text-sm text-ink-500">Accedez a votre espace Sygna.</p>

          <form className="mt-8 space-y-4">
            <Field icon={Mail} label="Email professionnel" placeholder="prenom.nom@cfa.fr" type="email" />
            <Field icon={Lock} label="Mot de passe" placeholder="..." type="password" />
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-1.5 text-ink-600"><input type="checkbox" className="accent-ink-900" /> Se souvenir</label>
              <a href="#" className="text-ink-700 hover:underline">Mot de passe oublie ?</a>
            </div>
            <Link href="/admin"><Button className="w-full mt-2" size="lg">Se connecter <ArrowRight className="size-4" /></Button></Link>
          </form>

          <div className="my-8 flex items-center gap-3 text-[11px] uppercase tracking-wider text-ink-400">
            <span className="flex-1 h-px bg-ink-100" /> ou demo rapide <span className="flex-1 h-px bg-ink-100" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            {roles.map(r => (
              <Link key={r.href} href={r.href} className="group rounded-xl border border-ink-100 hover:border-ink-300 p-3 transition">
                <r.icon className="size-4 text-ink-700" />
                <p className="mt-2 text-sm font-semibold text-ink-900">{r.label}</p>
                <p className="text-[11px] text-ink-500 leading-snug">{r.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function Field({ icon: Icon, label, ...props }: { icon: React.ComponentType<{ className?: string }>; label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-ink-700">{label}</span>
      <div className="mt-1 flex items-center gap-2 h-11 px-3 rounded-xl border border-ink-100 bg-white focus-within:border-ink-400 focus-within:ring-4 focus-within:ring-ink-900/5 transition">
        <Icon className="size-4 text-ink-400" />
        <input {...props} className="flex-1 text-sm bg-transparent outline-none placeholder:text-ink-300" />
      </div>
    </label>
  );
}
