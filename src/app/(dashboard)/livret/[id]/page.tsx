import { notFound } from 'next/navigation';
import { Topbar } from '@/components/Topbar';
import { Card, CardHeader, CardTitle, CardBody } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';
import { CategoryIcon } from '@/components/CategoryIcon';
import { getApprenti, docsForApprenti } from '@/lib/mock-data';
import { formatDate } from '@/lib/utils';
import {
  CheckCircle2, Circle, Sparkles, Building2, GraduationCap, MapPin, MessageSquareQuote, Stamp,
  CalendarCheck, FileText, Send, Download, BookOpen,
} from 'lucide-react';

interface Props { params: Promise<{ id: string }> }

export default async function LivretPage({ params }: Props) {
  const { id } = await params;
  const apprenti = getApprenti(id);
  if (!apprenti) notFound();
  const docs = docsForApprenti(id);

  const competences = [
    { code: 'BP1', label: 'Gerer le patrimoine informatique', validee: true },
    { code: 'BP2', label: 'Repondre aux incidents et demandes', validee: true },
    { code: 'BP3', label: 'Developper la presence en ligne', validee: true },
    { code: 'BP4', label: 'Travailler en mode projet', validee: true },
    { code: 'BP5.1', label: 'Concevoir une solution applicative', validee: true },
    { code: 'BP5.2', label: 'Assurer la maintenance corrective', validee: false },
    { code: 'BP5.3', label: 'Gerer les donnees', validee: true },
    { code: 'BP6', label: 'Cybersecurite des services informatiques', validee: false },
  ];
  const months = [
    { m: 'Sept. 25', signApprenti: true, signEntreprise: true, signCfa: true, abs: 0, score: 'A' },
    { m: 'Oct. 25', signApprenti: true, signEntreprise: false, signCfa: false, abs: 1, score: 'A' },
    { m: 'Nov. 25', signApprenti: false, signEntreprise: false, signCfa: false, abs: 0, score: '-' },
  ];
  const visites = [
    { date: '2025-05-12', formateur: 'Helene Vasseur', city: 'Lyon 6e', resume: 'Visite de bilan, integration excellente, projets en autonomie.' },
    { date: '2025-09-22', formateur: 'Helene Vasseur', city: 'Lyon 6e', resume: 'Suivi mi-parcours, montee en competences sur React, autonomie confirmee.' },
  ];

  return (
    <>
      <Topbar title={`Livret de ${apprenti.name}`} subtitle={`${apprenti.formation} - ${apprenti.cfa}`} />
      <main className="flex-1 p-6 space-y-6">
        {/* Header */}
        <Card className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <Avatar name={apprenti.name} color={apprenti.avatarColor} size="lg" />
              <div>
                <h2 className="text-xl font-semibold text-ink-900">{apprenti.name}</h2>
                <p className="text-sm text-ink-500">{apprenti.email}</p>
                <div className="mt-3 flex flex-wrap gap-3 text-xs text-ink-600">
                  <span className="flex items-center gap-1.5"><GraduationCap className="size-3.5 text-ink-400" /> {apprenti.formation}</span>
                  <span className="flex items-center gap-1.5"><Building2 className="size-3.5 text-ink-400" /> {apprenti.entreprise}</span>
                  <span className="flex items-center gap-1.5"><MapPin className="size-3.5 text-ink-400" /> {apprenti.cfa}</span>
                  <span className="flex items-center gap-1.5"><CalendarCheck className="size-3.5 text-ink-400" /> {formatDate(apprenti.startDate)} - {formatDate(apprenti.endDate)}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm"><Download className="size-3.5" /> Exporter PDF</Button>
              <Button variant="primary" size="sm"><Send className="size-3.5" /> Envoyer pour signature</Button>
            </div>
          </div>
          <div className="mt-6 grid sm:grid-cols-4 gap-4">
            <Stat label="Conformite" value={apprenti.conformite} suffix="%" tone="emerald" />
            <Stat label="Competences validees" value={6} max={8} tone="cyan" />
            <Stat label="Heures realisees" value={840} max={1200} tone="violet" suffix="h" />
            <Stat label="Visites entreprise" value={3} max={4} tone="amber" />
          </div>
        </Card>

        {/* IA suggestions */}
        <Card className="bg-gradient-to-br from-ink-900 to-ink-700 text-white border-0 p-5">
          <div className="flex items-start gap-4">
            <span className="size-10 rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 text-ink-900 flex items-center justify-center shrink-0"><Sparkles className="size-5" /></span>
            <div className="flex-1">
              <p className="text-xs uppercase tracking-wider text-neon-cyan font-semibold">Sygna IA - resume audit</p>
              <p className="mt-1 text-sm leading-relaxed text-ink-100">
                Livret tres complet (8 entrees mensuelles signees, 2 visites en entreprise documentees).
                Manque la signature de novembre du tuteur et la validation BP5.2 - maintenance.
                Pret a 92% pour audit OPCO.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button variant="neon" size="sm">Generer le compte rendu d\'audit</Button>
                <Button variant="outline" size="sm" className="bg-white/5 border-white/15 text-white hover:bg-white/10">Programmer relance</Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Competences */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Competences a valider</CardTitle>
              <Badge tone="emerald" dot>6 / 8 validees</Badge>
            </div>
          </CardHeader>
          <CardBody className="p-0">
            <ul className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-ink-100">
              {competences.map(c => (
                <li key={c.code} className="px-5 py-3 flex items-start gap-3">
                  {c.validee ? <CheckCircle2 className="size-5 text-emerald-500 shrink-0" /> : <Circle className="size-5 text-ink-300 shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-ink-900">{c.code} - {c.label}</p>
                    <p className="text-[11px] text-ink-400">{c.validee ? 'Validee par le formateur le 12 sept. 2025' : 'En cours d\'evaluation'}</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>

        {/* Suivi mensuel */}
        <Card>
          <CardHeader><CardTitle>Suivi mensuel & signatures tripartites</CardTitle></CardHeader>
          <CardBody className="p-0">
            <table className="w-full text-sm">
              <thead className="text-[11px] uppercase tracking-wider text-ink-400 bg-ink-50/40">
                <tr>
                  <th className="text-left font-medium px-5 py-2.5">Mois</th>
                  <th className="text-left font-medium px-5 py-2.5">Apprenti</th>
                  <th className="text-left font-medium px-5 py-2.5">Entreprise</th>
                  <th className="text-left font-medium px-5 py-2.5">CFA</th>
                  <th className="text-left font-medium px-5 py-2.5">Absences</th>
                  <th className="text-left font-medium px-5 py-2.5">Score</th>
                  <th className="text-left font-medium px-5 py-2.5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {months.map(m => (
                  <tr key={m.m} className="hover:bg-ink-50/40">
                    <td className="px-5 py-3 font-semibold text-ink-900">{m.m}</td>
                    <SignCell ok={m.signApprenti} />
                    <SignCell ok={m.signEntreprise} />
                    <SignCell ok={m.signCfa} />
                    <td className="px-5 py-3"><Badge tone={m.abs > 0 ? 'amber' : 'emerald'}>{m.abs} jour{m.abs > 1 ? 's' : ''}</Badge></td>
                    <td className="px-5 py-3 text-ink-700 font-semibold">{m.score}</td>
                    <td className="px-5 py-3">
                      {(!m.signApprenti || !m.signEntreprise || !m.signCfa)
                        ? <Button size="sm" variant="primary">Relancer</Button>
                        : <Badge tone="emerald" dot>complete</Badge>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardBody>
        </Card>

        {/* Visites + commentaires */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle>Visites en entreprise</CardTitle></CardHeader>
            <CardBody className="space-y-4">
              {visites.map((v, i) => (
                <div key={i} className="rounded-xl border border-ink-100 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-ink-900 inline-flex items-center gap-2"><MapPin className="size-3.5 text-ink-400" /> {v.city}</span>
                    <span className="text-xs text-ink-400">{formatDate(v.date)}</span>
                  </div>
                  <p className="mt-2 text-sm text-ink-700 leading-relaxed">{v.resume}</p>
                  <p className="mt-2 text-[11px] text-ink-400">Formateur: {v.formateur}</p>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full"><CalendarCheck className="size-3.5" /> Planifier une nouvelle visite</Button>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><CardTitle>Commentaires</CardTitle></CardHeader>
            <CardBody className="space-y-4">
              <Comment author="Karim Dupont" role="Tuteur Acme SAS" tone="violet" date="2025-10-02" text="Lina prend des initiatives sur le projet API. Tres bonne autonomie technique." />
              <Comment author="Helene Vasseur" role="Formatrice CFA" tone="cyan" date="2025-09-30" text="Excellents resultats au CCF. Continuer sur les approfondissements cybersecurite." />
              <Comment author="Lina Bouzid" role="Apprentie" tone="emerald" date="2025-09-28" text="Formation tres concrete, j\'apprends beaucoup en cybersecurite et en architecture." />
            </CardBody>
          </Card>
        </div>

        {/* Documents associes */}
        <Card>
          <CardHeader><CardTitle>Documents associes</CardTitle></CardHeader>
          <CardBody className="p-0">
            <ul className="divide-y divide-ink-100">
              {docs.map(d => (
                <li key={d.id} className="px-5 py-3 flex items-center gap-3">
                  <CategoryIcon category={d.category} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-ink-900">{d.title}</p>
                    <p className="text-[11px] text-ink-400">v{d.version} - {d.pages} pages</p>
                  </div>
                  <Button size="sm" variant="ghost"><FileText className="size-3.5" /> Voir</Button>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </main>
    </>
  );
}

function Stat({ label, value, max, suffix = '', tone }: { label: string; value: number; max?: number; suffix?: string; tone: 'emerald' | 'cyan' | 'violet' | 'amber' }) {
  const pct = max ? (value / max) * 100 : value;
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wider text-ink-400 font-semibold">{label}</p>
      <p className="mt-1 text-xl font-semibold text-ink-900 tabular-nums">{value}{suffix}{max && <span className="text-sm text-ink-400"> / {max}{suffix}</span>}</p>
      <Progress value={pct} tone={tone} className="mt-2" />
    </div>
  );
}

function SignCell({ ok }: { ok: boolean }) {
  return (
    <td className="px-5 py-3">
      {ok
        ? <Badge tone="emerald" dot>signe</Badge>
        : <Badge tone="amber" dot>en attente</Badge>}
    </td>
  );
}

function Comment({ author, role, tone, date, text }: { author: string; role: string; tone: 'violet' | 'cyan' | 'emerald'; date: string; text: string }) {
  return (
    <div className="flex gap-3">
      <Avatar name={author} size="sm" color={tone === 'violet' ? 'from-violet-400 to-fuchsia-500' : tone === 'cyan' ? 'from-cyan-400 to-sky-500' : 'from-emerald-400 to-teal-500'} />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-ink-900">{author} <span className="text-[11px] font-normal text-ink-400">- {role}</span></p>
          <p className="text-[11px] text-ink-400">{formatDate(date)}</p>
        </div>
        <p className="mt-1 text-sm text-ink-700 leading-relaxed">{text}</p>
      </div>
    </div>
  );
}
