import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Logo } from '@/components/Logo';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { CategoryIcon } from '@/components/CategoryIcon';
import { StatusPill } from '@/components/StatusPill';
import { SignaturePad } from '@/components/SignaturePad';
import { documents, apprentis, categoryLabels } from '@/lib/mock-data';
import { formatDate, formatDateTime } from '@/lib/utils';
import { Shield, Clock, FileSignature, Lock, X, Check, KeyRound } from 'lucide-react';

interface Props { params: Promise<{ token: string }> }

export default async function SignPage({ params }: Props) {
  const { token } = await params;
  const doc = documents.find(d => d.id === token) ?? documents[0];
  if (!doc) notFound();
  const apprenti = apprentis.find(a => a.id === doc.apprentiId);

  return (
    <main className="min-h-screen bg-ink-50/40 flex flex-col">
      <header className="h-16 px-6 flex items-center justify-between bg-white border-b border-ink-100">
        <Link href="/"><Logo /></Link>
        <div className="flex items-center gap-3 text-xs text-ink-500">
          <span className="flex items-center gap-1.5"><Lock className="size-3.5 text-emerald-500" /> Connexion securisee</span>
          <span className="flex items-center gap-1.5"><Shield className="size-3.5 text-ink-700" /> eIDAS</span>
        </div>
      </header>

      <div className="flex-1 grid lg:grid-cols-3 gap-6 p-6 max-w-7xl w-full mx-auto">
        {/* Document preview */}
        <Card className="lg:col-span-2 p-0 overflow-hidden">
          <div className="px-5 py-4 border-b border-ink-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CategoryIcon category={doc.category} />
              <div>
                <p className="text-sm font-semibold text-ink-900">{doc.title}</p>
                <p className="text-[11px] text-ink-400">{categoryLabels[doc.category]} - {doc.pages} pages - {doc.size}</p>
              </div>
            </div>
            <StatusPill status={doc.status} />
          </div>
          {/* Mock document body */}
          <div className="bg-ink-50/40 p-8 min-h-[640px]">
            <div className="max-w-2xl mx-auto bg-white rounded-xl border border-ink-100 p-10 shadow-[0_30px_60px_-30px_rgba(11,20,55,0.15)]">
              <p className="text-[11px] uppercase tracking-wider text-ink-400 font-semibold">Livret d\'apprentissage</p>
              <h2 className="mt-2 text-2xl font-semibold text-ink-900">Suivi pedagogique - Septembre 2025</h2>
              <p className="mt-2 text-sm text-ink-500">{apprenti?.name} - {apprenti?.formation}</p>
              <div className="mt-8 space-y-4 text-sm text-ink-700 leading-relaxed">
                <p>Le present livret atteste du suivi mensuel de l\'apprenti(e) {apprenti?.name} dans le cadre de sa formation {apprenti?.formation} au sein de l\'entreprise {apprenti?.entreprise}.</p>
                <p>Au cours du mois de septembre 2025, l\'apprenti a participe aux missions suivantes :</p>
                <ul className="list-disc pl-5 space-y-1 text-ink-600">
                  <li>Migration du backend de paiement vers Stripe API</li>
                  <li>Mise en place de la CI sur GitHub Actions</li>
                  <li>Refonte de la page de connexion en React 19</li>
                </ul>
                <p>Le tuteur en entreprise et le formateur referent valident la progression et l\'engagement de l\'apprenti(e). Aucun fait notable n\'est a signaler. La signature electronique des trois parties atteste de la conformite du suivi mensuel selon les exigences Qualiopi.</p>
              </div>

              <div className="mt-12 grid grid-cols-3 gap-6 text-xs">
                {doc.signers.map(s => (
                  <div key={s.id} className="border-t border-dashed border-ink-200 pt-3">
                    <p className="font-semibold text-ink-700">{s.name}</p>
                    <p className="text-ink-400">{s.role}</p>
                    <div className="mt-2 h-12 flex items-center">
                      {s.status === 'signe'
                        ? <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold"><Check className="size-3.5" /> Signe le {s.signedAt ? formatDate(s.signedAt) : ''}</span>
                        : <span className="inline-flex items-center gap-1 text-ink-400"><Clock className="size-3.5" /> En attente</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Signature panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Signataires</CardTitle>
                <Badge tone="cyan" dot>{doc.signers.filter(s => s.status === 'signe').length}/{doc.signers.length}</Badge>
              </div>
            </CardHeader>
            <CardBody className="p-0">
              <ol className="divide-y divide-ink-100">
                {doc.signers.map(s => (
                  <li key={s.id} className="px-4 py-3 flex items-center gap-3">
                    <span className="size-7 rounded-full bg-ink-50 text-ink-600 text-xs flex items-center justify-center font-semibold">{s.order}</span>
                    <Avatar name={s.name} size="sm" color="from-cyan-400 to-violet-500" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-ink-900 truncate">{s.name}</p>
                      <p className="text-[11px] text-ink-400 capitalize">{s.role}</p>
                    </div>
                    <StatusPill status={s.status} />
                  </li>
                ))}
              </ol>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Votre signature</CardTitle>
                <span className="text-[11px] text-ink-400 inline-flex items-center gap-1"><KeyRound className="size-3" /> OTP requis</span>
              </div>
            </CardHeader>
            <CardBody className="space-y-3">
              <SignaturePad />
              <div className="flex items-center gap-2">
                <input className="flex-1 h-10 px-3 rounded-xl border border-ink-100 bg-white text-sm tracking-[0.4em] text-center font-semibold" placeholder="OTP" maxLength={6} />
                <Button variant="outline" size="sm">Renvoyer</Button>
              </div>
              <Button variant="neon" size="lg" className="w-full"><FileSignature className="size-4" /> Signer & valider</Button>
              <Button variant="ghost" size="sm" className="w-full text-ink-500"><X className="size-3.5" /> Refuser le document</Button>
              <p className="text-[11px] text-ink-400 leading-snug">
                En cliquant sur Signer, vous certifiez avoir lu le document. Sygna genere un certificat horodate eIDAS, archive 10 ans dans un coffre souverain UE.
              </p>
            </CardBody>
          </Card>

          <Card className="bg-ink-50/40 border-dashed">
            <CardBody className="text-xs text-ink-500 space-y-1.5">
              <p className="flex items-center gap-2 text-ink-700 font-semibold"><Shield className="size-3.5" /> Piste d\'audit</p>
              <p>Token: <span className="font-mono text-ink-700">{token}</span></p>
              <p>Cree le {formatDateTime(doc.createdAt)}</p>
              <p>Expire le {doc.expiresAt ? formatDateTime(doc.expiresAt) : 'jamais'}</p>
            </CardBody>
          </Card>
        </div>
      </div>
    </main>
  );
}
