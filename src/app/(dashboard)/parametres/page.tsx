import { Topbar } from '@/components/Topbar';
import { Card, CardHeader, CardTitle, CardBody, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import {
  Building2, Users, Bell, Shield, KeyRound, Plug, Sparkles, Mail, Smartphone, Lock, Globe, FileSignature,
} from 'lucide-react';

export default function ParametresPage() {
  return (
    <>
      <Topbar title="Parametres" subtitle="Compte CFA, equipe, securite, integrations" />
      <main className="flex-1 p-6 grid lg:grid-cols-3 gap-6">
        {/* Profil CFA */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Identite du CFA</CardTitle>
            <CardDescription>Affichee sur les documents et certificats de signature.</CardDescription>
          </CardHeader>
          <CardBody className="space-y-4">
            <Field label="Raison sociale" value="CFA Numerique Lyon" icon={Building2} />
            <Field label="SIRET" value="892 451 037 00027" icon={Shield} />
            <Field label="Adresse" value="15 avenue Felix Faure, 69007 Lyon" icon={Globe} />
            <Field label="Numero de declaration d'activite" value="82 69 22134 69" icon={FileSignature} />
            <div className="flex items-center gap-2 pt-2">
              <Button variant="primary" size="sm">Enregistrer</Button>
              <Button variant="ghost" size="sm">Annuler</Button>
            </div>
          </CardBody>
        </Card>

        {/* Plan */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Abonnement</CardTitle>
              <Badge tone="cyan">Pro</Badge>
            </div>
          </CardHeader>
          <CardBody className="space-y-3 text-sm">
            <p className="text-2xl font-semibold tabular-nums">249 EUR<span className="text-sm font-normal text-ink-400">/mois</span></p>
            <p className="text-xs text-ink-500">68 apprentis actifs, signatures illimitees, assistant IA inclus.</p>
            <Button variant="outline" size="sm" className="w-full">Gerer la facturation</Button>
            <Button variant="ghost" size="sm" className="w-full">Demander Enterprise</Button>
          </CardBody>
        </Card>

        {/* Equipe */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Equipe</CardTitle>
              <Button size="sm" variant="primary">Inviter</Button>
            </div>
            <CardDescription>Roles, permissions et acces.</CardDescription>
          </CardHeader>
          <CardBody className="p-0">
            <ul className="divide-y divide-ink-100">
              {[
                { n: 'Mireille Nadeau', e: 'direction@cfa.fr', r: 'Administrateur' },
                { n: 'Helene Vasseur', e: 'h.vasseur@cfa.fr', r: 'Formatrice referente' },
                { n: 'Marc Lefevre', e: 'm.lefevre@cfa.fr', r: 'Formateur' },
                { n: 'Sophie Albert', e: 's.albert@cfa.fr', r: 'Coordinatrice' },
              ].map(m => (
                <li key={m.e} className="px-5 py-3 flex items-center gap-3">
                  <Avatar name={m.n} size="sm" color="from-cyan-400 to-violet-500" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-ink-900">{m.n}</p>
                    <p className="text-[11px] text-ink-400">{m.e}</p>
                  </div>
                  <Badge tone="neutral">{m.r}</Badge>
                  <Button size="sm" variant="ghost">...</Button>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader><CardTitle>Notifications & relances</CardTitle></CardHeader>
          <CardBody className="space-y-3">
            <Toggle icon={Mail} label="Email - signataires" desc="Notifie les signataires de chaque etape." on />
            <Toggle icon={Smartphone} label="SMS - relances" desc="Relances automatiques apres 48h." on />
            <Toggle icon={Bell} label="In-app - alertes" desc="Alertes documents non signes." on />
            <Toggle icon={Sparkles} label="IA - relances intelligentes" desc="Sygna propose le bon timing et message." on />
          </CardBody>
        </Card>

        {/* Securite */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Securite</CardTitle>
            <CardDescription>Authentification, sessions et conformite.</CardDescription>
          </CardHeader>
          <CardBody className="space-y-3">
            <Toggle icon={KeyRound} label="OTP par SMS pour signatures" desc="Renforce la valeur juridique eIDAS." on />
            <Toggle icon={Lock} label="Authentification 2FA" desc="Obligatoire pour les administrateurs." on />
            <Toggle icon={Shield} label="SSO SAML" desc="Disponible en plan Enterprise." />
            <Toggle icon={Globe} label="Hebergement souverain UE" desc="Ile-de-France - chiffrement AES-256 au repos." on locked />
          </CardBody>
        </Card>

        {/* Integrations */}
        <Card>
          <CardHeader><CardTitle>Integrations</CardTitle></CardHeader>
          <CardBody className="space-y-2">
            {[
              { t: 'OPCO Atlas', s: 'Connecte', tone: 'emerald' as const },
              { t: 'Yparep', s: 'Connecte', tone: 'emerald' as const },
              { t: 'Studea', s: 'Disponible', tone: 'neutral' as const },
              { t: 'Anthropic Claude', s: 'API liee', tone: 'cyan' as const },
            ].map(i => (
              <div key={i.t} className="flex items-center gap-3 rounded-xl border border-ink-100 p-3">
                <Plug className="size-4 text-ink-500" />
                <span className="flex-1 text-sm font-semibold">{i.t}</span>
                <Badge tone={i.tone}>{i.s}</Badge>
              </div>
            ))}
          </CardBody>
        </Card>
      </main>
    </>
  );
}

function Field({ label, value, icon: Icon }: { label: string; value: string; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-ink-700">{label}</span>
      <div className="mt-1 flex items-center gap-2 h-11 px-3 rounded-xl border border-ink-100 bg-white">
        <Icon className="size-4 text-ink-400" />
        <input defaultValue={value} className="flex-1 text-sm bg-transparent outline-none" />
      </div>
    </label>
  );
}

function Toggle({ icon: Icon, label, desc, on, locked }: { icon: React.ComponentType<{ className?: string }>; label: string; desc: string; on?: boolean; locked?: boolean }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-ink-100 p-3">
      <span className="size-9 rounded-lg bg-ink-50 flex items-center justify-center"><Icon className="size-4 text-ink-700" /></span>
      <div className="flex-1">
        <p className="text-sm font-semibold text-ink-900">{label}</p>
        <p className="text-[11px] text-ink-400">{desc}</p>
      </div>
      <button disabled={locked} className={`relative w-10 h-5 rounded-full transition ${on ? 'bg-ink-900' : 'bg-ink-100'} ${locked ? 'opacity-60 cursor-not-allowed' : ''}`}>
        <span className={`absolute top-0.5 size-4 rounded-full bg-white transition ${on ? 'right-0.5' : 'left-0.5'}`} />
      </button>
    </div>
  );
}
