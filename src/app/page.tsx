import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  ShieldCheck, FileSignature, BookOpen, Sparkles, ArrowRight, Check, Zap, Lock,
  Users, Building2, GraduationCap, FileCheck2, Bell, Activity, Clock,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <main className="relative">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/70 border-b border-ink-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo />
          <nav className="hidden md:flex items-center gap-7 text-sm text-ink-600">
            <a href="#fonctionnalites" className="hover:text-ink-900">Fonctionnalites</a>
            <a href="#workflow" className="hover:text-ink-900">Workflow CFA</a>
            <a href="#conformite" className="hover:text-ink-900">Conformite</a>
            <a href="#tarifs" className="hover:text-ink-900">Tarifs</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/login"><Button variant="ghost" size="sm">Se connecter</Button></Link>
            <Link href="/admin"><Button variant="primary" size="sm">Demander une demo</Button></Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden gradient-hero text-white">
        <div className="absolute inset-0 dot-grid opacity-[0.07]" />
        <div className="max-w-7xl mx-auto px-6 pt-20 pb-28 relative">
          <div className="max-w-3xl">
            <Badge tone="cyan" className="bg-white/10 text-neon-cyan border-white/10">
              <Sparkles className="size-3" /> Conforme RGPD - Qualiopi - eIDAS
            </Badge>
            <h1 className="mt-5 text-5xl md:text-6xl font-semibold leading-[1.05] tracking-tight">
              La signature electronique pensee pour les <span className="bg-gradient-to-r from-neon-cyan to-neon-violet bg-clip-text text-transparent">CFA et l\'alternance.</span>
            </h1>
            <p className="mt-5 text-lg text-ink-200 leading-relaxed max-w-2xl">
              Sygna remplace les signatures papier des livrets d\'apprentissage, conventions, attestations et emargements.
              Une plateforme unique pour les CFA, les entreprises et les apprentis - avec un assistant IA qui surveille la conformite Qualiopi en continu.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/admin"><Button variant="neon" size="lg">Essayer la demo <ArrowRight className="size-4" /></Button></Link>
              <Link href="#workflow"><Button variant="outline" size="lg" className="bg-white/5 border-white/15 text-white hover:bg-white/10">Voir le workflow</Button></Link>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-6 text-xs text-ink-300">
              <div className="flex items-center gap-2"><Check className="size-3.5 text-neon-mint" /> Hebergement souverain UE</div>
              <div className="flex items-center gap-2"><Check className="size-3.5 text-neon-mint" /> Piste d\'audit horodatee</div>
              <div className="flex items-center gap-2"><Check className="size-3.5 text-neon-mint" /> Export OPCO en 1 clic</div>
            </div>
          </div>

          {/* Floating cards mockup */}
          <div className="mt-16 relative">
            <div className="grid md:grid-cols-3 gap-4">
              <HeroCard
                icon={<FileSignature className="size-4 text-neon-cyan" />}
                title="Livret d\'apprentissage - Septembre"
                meta="Lina Bouzid - Acme SAS"
                steps={[
                  { who: 'Apprenti', state: 'signe' },
                  { who: 'Tuteur', state: 'consulte' },
                  { who: 'Formateur', state: 'envoye' },
                ]}
              />
              <HeroCard
                icon={<BookOpen className="size-4 text-neon-violet" />}
                title="Convention de formation"
                meta="BTS SIO - 2024-2026"
                steps={[
                  { who: 'CFA', state: 'signe' },
                  { who: 'Entreprise', state: 'signe' },
                  { who: 'Apprenti', state: 'signe' },
                ]}
              />
              <HeroCard
                icon={<ShieldCheck className="size-4 text-neon-mint" />}
                title="Audit Qualiopi - Q3"
                meta="42 dossiers verifies"
                steps={[
                  { who: 'IA', state: 'signe' },
                  { who: 'Direction', state: 'signe' },
                  { who: 'OPCO', state: 'envoye' },
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Logos / trust */}
      <section className="border-y border-ink-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-8 grid md:grid-cols-4 gap-6 items-center">
          <p className="text-xs uppercase tracking-wider text-ink-400 font-semibold">Ils gerent leurs livrets sur Sygna</p>
          <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-5 gap-6 items-center text-ink-300">
            {['CFA Numerique Lyon', 'CFA Sup Paris', 'Acme Software', 'Banque Forteresse', 'NeuroLab'].map(n => (
              <span key={n} className="text-sm font-semibold tracking-tight text-ink-400">{n}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section id="fonctionnalites" className="max-w-7xl mx-auto px-6 py-24">
        <div className="max-w-2xl">
          <Badge tone="violet">Fonctionnalites</Badge>
          <h2 className="mt-4 text-3xl md:text-4xl font-semibold tracking-tight text-ink-900">Tout ce dont un CFA a besoin pour gerer ses signatures.</h2>
          <p className="mt-3 text-ink-500">Quatre espaces dedies, un seul moteur de signature, et une logique metier alternance pensee de bout en bout.</p>
        </div>
        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Feature icon={Users} title="4 espaces dedies" desc="Administrateur CFA, entreprise, apprenti, formateur. Chacun voit exactement ce qu\'il doit signer ou suivre." />
          <Feature icon={FileSignature} title="Signature multi-mode" desc="Dessinee, par email, OTP SMS. Ordre configurable, signatures multiples, drag & drop des zones." />
          <Feature icon={BookOpen} title="Livret d\'apprentissage interactif" desc="Competences, suivi entreprise, visites, absences, signatures mensuelles tripartites." />
          <Feature icon={Bell} title="Relances automatiques" desc="Mail + SMS, escalade tuteur, planification fine. Plus aucun document oublie." />
          <Feature icon={Activity} title="Tableau de bord conformite" desc="Etat des dossiers en temps reel, alertes documents non signes, scoring Qualiopi." />
          <Feature icon={ShieldCheck} title="Export OPCO & audit" desc="Generation des preuves d\'audit, exports OPCO, archivage horodate scelle." />
        </div>
      </section>

      {/* Workflow */}
      <section id="workflow" className="bg-ink-50/60 border-y border-ink-100">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge tone="cyan">Workflow CFA</Badge>
              <h2 className="mt-4 text-3xl md:text-4xl font-semibold tracking-tight text-ink-900">
                Du dossier apprenti au certificat de signature, en moins de 5 minutes.
              </h2>
              <p className="mt-3 text-ink-500">
                Sygna automatise les etapes critiques: creation du dossier, rattachement entreprise/tuteur, envoi des documents,
                relances et archivage. Vos equipes pedagogiques se concentrent sur l\'accompagnement.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-ink-700">
                {[
                  'Creation du dossier apprenti en 1 minute',
                  'Rattachement entreprise / tuteur via annuaire OPCO',
                  'Envoi multi-signataires avec ordre',
                  'Relances automatiques mail + SMS',
                  'Certificat de signature et preuves PDF',
                ].map(s => (
                  <li key={s} className="flex gap-2 items-center"><Check className="size-4 text-neon-mint" /> {s}</li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="rounded-2xl bg-white border border-ink-100 p-6 shadow-[0_30px_60px_-30px_rgba(11,20,55,0.25)]">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <FileSignature className="size-4 text-ink-700" />
                    <span className="text-sm font-semibold">Suivi du document</span>
                  </div>
                  <Badge tone="cyan" dot>En cours</Badge>
                </div>
                <Stepper />
              </div>
              <div className="absolute -bottom-6 -right-4 hidden md:block w-56 rounded-2xl bg-ink-900 text-white p-4 glow-cyan">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-neon-cyan">
                  <Sparkles className="size-3.5" /> Sygna IA
                </div>
                <p className="mt-1 text-xs text-ink-200/90">
                  Le tuteur de Tom n\'a pas signe depuis 4 jours. Je propose une relance SMS personnalisee.
                </p>
                <button className="mt-3 text-[11px] font-semibold text-neon-cyan hover:underline">Lancer la relance &gt;</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="max-w-2xl">
          <Badge tone="emerald">Pour chaque acteur</Badge>
          <h2 className="mt-4 text-3xl md:text-4xl font-semibold tracking-tight text-ink-900">Une experience adaptee a chaque profil.</h2>
        </div>
        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Building2, title: 'CFA', desc: 'Pilotage global, conformite Qualiopi, exports OPCO.', tone: 'from-cyan-100 to-cyan-50', accent: 'text-cyan-700' },
            { icon: Users, title: 'Entreprise', desc: 'Conventions, livret tuteur, suivi mensuel des apprentis.', tone: 'from-violet-100 to-violet-50', accent: 'text-violet-700' },
            { icon: GraduationCap, title: 'Apprenti', desc: 'Documents, signature mobile, livret en libre acces.', tone: 'from-emerald-100 to-emerald-50', accent: 'text-emerald-700' },
            { icon: FileCheck2, title: 'Formateur', desc: 'Competences, visites, comptes rendus partages.', tone: 'from-amber-100 to-amber-50', accent: 'text-amber-700' },
          ].map(r => (
            <div key={r.title} className={`rounded-2xl bg-gradient-to-br ${r.tone} p-5 border border-white/60`}>
              <div className="size-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                <r.icon className={`size-5 ${r.accent}`} />
              </div>
              <h3 className="mt-4 text-base font-semibold text-ink-900">{r.title}</h3>
              <p className="mt-1 text-sm text-ink-600 leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Conformite */}
      <section id="conformite" className="bg-ink-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-10" />
        <div className="max-w-7xl mx-auto px-6 py-24 relative">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <Badge tone="cyan" className="bg-white/10 text-neon-cyan border-white/10">Conformite</Badge>
              <h2 className="mt-4 text-3xl md:text-4xl font-semibold tracking-tight">Architecture conforme - du premier clic au dernier audit.</h2>
              <p className="mt-3 text-ink-200/90">
                Sygna integre nativement les exigences RGPD, Qualiopi, OPCO et eIDAS.
                Chaque action est tracee, horodatee et archivee dans un coffre electronique souverain.
              </p>
              <div className="mt-8 grid sm:grid-cols-2 gap-3">
                {[
                  { icon: Lock, t: 'RGPD', d: 'Hebergement UE, anonymisation, droit a l\'oubli' },
                  { icon: Clock, t: 'Horodatage', d: 'Cachet serveur qualifie eIDAS' },
                  { icon: ShieldCheck, t: 'Piste d\'audit', d: 'Journal immuable de toutes les actions' },
                  { icon: Activity, t: 'Qualiopi', d: 'Indicateurs export-ready pour audits' },
                ].map(b => (
                  <div key={b.t} className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <b.icon className="size-4 text-neon-cyan" />
                    <p className="mt-2 text-sm font-semibold">{b.t}</p>
                    <p className="text-xs text-ink-200/80">{b.d}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="w-full max-w-md rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 p-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider text-ink-200/70">Score Qualiopi</span>
                  <Badge tone="emerald" dot>conforme</Badge>
                </div>
                <p className="mt-2 text-5xl font-semibold text-neon-mint">94<span className="text-2xl text-ink-200/60">/100</span></p>
                <p className="mt-1 text-xs text-ink-200/70">Mise a jour il y a 12 minutes - 68 dossiers analyses.</p>
                <div className="mt-6 space-y-3 text-xs text-ink-200/90">
                  {[
                    ['Indicateur 1 - Information du public', 100],
                    ['Indicateur 11 - Suivi de la formation', 92],
                    ['Indicateur 22 - Reclamations', 96],
                    ['Indicateur 32 - Veille reglementaire', 88],
                  ].map(([k, v]) => (
                    <div key={k as string} className="flex items-center justify-between gap-3">
                      <span className="truncate">{k}</span>
                      <div className="flex-1 h-1.5 rounded-full bg-white/10">
                        <div className="h-full rounded-full bg-gradient-to-r from-neon-cyan to-neon-mint" style={{ width: `${v}%` }} />
                      </div>
                      <span className="tabular-nums w-8 text-right">{v}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tarifs */}
      <section id="tarifs" className="max-w-7xl mx-auto px-6 py-24">
        <div className="max-w-2xl">
          <Badge tone="amber">Tarifs</Badge>
          <h2 className="mt-4 text-3xl md:text-4xl font-semibold tracking-tight text-ink-900">Une formule par taille de CFA.</h2>
          <p className="mt-3 text-ink-500">Sans frais cache, sans engagement, hebergement France inclus.</p>
        </div>
        <div className="mt-12 grid md:grid-cols-3 gap-4">
          <PriceCard
            tier="Essentiel" price="99 EUR" suffix="/mois"
            blurb="Pour les CFA jusqu\'a 50 apprentis."
            features={['Signatures illimitees', '4 espaces utilisateurs', 'Livret d\'apprentissage', 'Support email']}
          />
          <PriceCard
            tier="Pro" price="249 EUR" suffix="/mois" highlight
            blurb="Le standard des CFA en croissance."
            features={['Tout Essentiel', 'Relances SMS', 'Export OPCO automatise', 'Assistant IA Sygna', 'Support prioritaire']}
          />
          <PriceCard
            tier="Enterprise" price="Sur devis" suffix=""
            blurb="Reseaux, branches, multi-sites."
            features={['SSO SAML', 'API ouverte', 'SLA 99,95%', 'CSM dedie', 'Personnalisation marque']}
          />
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="rounded-3xl gradient-hero text-white p-10 md:p-16 relative overflow-hidden">
          <div className="absolute inset-0 dot-grid opacity-10" />
          <div className="relative max-w-2xl">
            <Zap className="size-6 text-neon-cyan" />
            <h2 className="mt-4 text-3xl md:text-4xl font-semibold tracking-tight">Pret a abandonner les classeurs papier ?</h2>
            <p className="mt-3 text-ink-200/90">Demarrez avec un dossier reel, en moins d\'une heure. Migration et import OPCO inclus.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/admin"><Button variant="neon" size="lg">Tester la demo</Button></Link>
              <Link href="/login"><Button variant="outline" size="lg" className="bg-white/5 border-white/15 text-white hover:bg-white/10">Parler a un expert</Button></Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-ink-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-4 gap-8 text-sm">
          <div>
            <Logo />
            <p className="mt-3 text-ink-500 text-xs leading-relaxed">La signature electronique conforme pour CFA et organismes de formation francais.</p>
          </div>
          {[
            { title: 'Produit', items: ['Fonctionnalites', 'Tarifs', 'Securite', 'Roadmap'] },
            { title: 'Ressources', items: ['Documentation', 'Guide Qualiopi', 'API', 'Statut'] },
            { title: 'Legal', items: ['CGU', 'CGV', 'RGPD', 'DPO'] },
          ].map(c => (
            <div key={c.title}>
              <p className="text-ink-900 font-semibold">{c.title}</p>
              <ul className="mt-3 space-y-1.5 text-ink-500">{c.items.map(i => <li key={i}>{i}</li>)}</ul>
            </div>
          ))}
        </div>
        <div className="border-t border-ink-100">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between text-xs text-ink-400">
            <p>(c) {new Date().getFullYear()} Sygna SAS - Hebergement souverain France</p>
            <p>v0.1 demo</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

function Feature({ icon: Icon, title, desc }: { icon: React.ComponentType<{ className?: string }>; title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-ink-100 bg-white p-5 hover:border-ink-200 hover:shadow-[0_8px_30px_-12px_rgba(11,20,55,0.15)] transition">
      <div className="size-9 rounded-xl bg-ink-50 flex items-center justify-center">
        <Icon className="size-4 text-ink-700" />
      </div>
      <h3 className="mt-4 font-semibold text-ink-900">{title}</h3>
      <p className="mt-1 text-sm text-ink-500 leading-relaxed">{desc}</p>
    </div>
  );
}

function HeroCard({ icon, title, meta, steps }: { icon: React.ReactNode; title: string; meta: string; steps: { who: string; state: 'signe' | 'consulte' | 'envoye' }[] }) {
  const stateMap = { signe: { c: 'bg-emerald-400', l: 'Signe' }, consulte: { c: 'bg-sky-400', l: 'Consulte' }, envoye: { c: 'bg-cyan-400', l: 'Envoye' } };
  return (
    <div className="rounded-2xl bg-white/10 backdrop-blur border border-white/10 p-4 hover:bg-white/15 transition float-slow">
      <div className="flex items-center gap-2">
        <span className="size-7 rounded-lg bg-white/10 flex items-center justify-center">{icon}</span>
        <span className="text-xs uppercase tracking-wider text-ink-200/70">Document</span>
      </div>
      <p className="mt-3 text-sm font-semibold text-white truncate">{title}</p>
      <p className="text-xs text-ink-200/70">{meta}</p>
      <div className="mt-4 space-y-2">
        {steps.map(s => (
          <div key={s.who} className="flex items-center justify-between text-xs">
            <span className="text-ink-200/80">{s.who}</span>
            <span className="flex items-center gap-1.5 text-ink-100">
              <span className={`size-1.5 rounded-full ${stateMap[s.state].c}`} /> {stateMap[s.state].l}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Stepper() {
  const steps = [
    { who: 'Lina Bouzid', role: 'Apprenti', state: 'signe', t: 'Signe il y a 2j' },
    { who: 'Karim Dupont', role: 'Tuteur Acme', state: 'consulte', t: 'Consulte hier' },
    { who: 'Helene Vasseur', role: 'Formateur CFA', state: 'envoye', t: 'En attente' },
  ] as const;
  const colors = { signe: 'bg-emerald-500', consulte: 'bg-sky-500', envoye: 'bg-cyan-400 pulse-ring' };
  const labels = { signe: 'Signe', consulte: 'Consulte', envoye: 'En attente' };
  return (
    <ol className="relative space-y-5 ml-2">
      <span className="absolute left-2 top-2 bottom-2 w-px bg-ink-100" aria-hidden />
      {steps.map((s, i) => (
        <li key={i} className="relative pl-8">
          <span className={`absolute left-0 top-1 size-4 rounded-full ${colors[s.state]} ring-4 ring-white`} />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-ink-900">{s.who}</p>
              <p className="text-xs text-ink-500">{s.role}</p>
            </div>
            <Badge tone={s.state === 'signe' ? 'emerald' : s.state === 'consulte' ? 'sky' : 'cyan'} dot>{labels[s.state]}</Badge>
          </div>
          <p className="text-[11px] text-ink-400 mt-0.5">{s.t}</p>
        </li>
      ))}
    </ol>
  );
}

function PriceCard({ tier, price, suffix, blurb, features, highlight }: { tier: string; price: string; suffix: string; blurb: string; features: string[]; highlight?: boolean }) {
  return (
    <div className={`rounded-2xl border p-6 relative ${highlight ? 'border-ink-900 bg-gradient-to-b from-ink-900 to-ink-800 text-white shadow-[0_30px_60px_-30px_rgba(11,20,55,0.4)]' : 'border-ink-100 bg-white'}`}>
      {highlight && <Badge tone="cyan" className="absolute -top-3 left-6 bg-neon-cyan text-ink-900 border-neon-cyan">Le plus choisi</Badge>}
      <p className={`text-sm font-semibold ${highlight ? 'text-neon-cyan' : 'text-ink-700'}`}>{tier}</p>
      <p className="mt-3 text-3xl font-semibold tracking-tight">{price}<span className={`text-sm font-normal ${highlight ? 'text-ink-200/70' : 'text-ink-400'}`}>{suffix}</span></p>
      <p className={`mt-2 text-sm ${highlight ? 'text-ink-200/80' : 'text-ink-500'}`}>{blurb}</p>
      <ul className={`mt-6 space-y-2 text-sm ${highlight ? 'text-ink-100' : 'text-ink-700'}`}>
        {features.map(f => <li key={f} className="flex items-center gap-2"><Check className={`size-4 ${highlight ? 'text-neon-cyan' : 'text-emerald-500'}`} /> {f}</li>)}
      </ul>
      <Link href="/admin" className="block mt-6">
        <Button variant={highlight ? 'neon' : 'primary'} className="w-full">Choisir {tier}</Button>
      </Link>
    </div>
  );
}
