'use client';
import { useState } from 'react';
import { Sparkles, X, Send, FileSearch, FileWarning, MessageSquare, Bell, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

type Msg = { role: 'user' | 'ai'; content: string; suggestions?: string[] };

const quick = [
  { icon: FileSearch, label: 'Detecter les pieces manquantes' },
  { icon: FileWarning, label: 'Verifier la conformite Qualiopi' },
  { icon: BookOpen, label: 'Resumer un livret pour audit' },
  { icon: Bell, label: 'Proposer des relances intelligentes' },
];

const seedReply: Record<string, string> = {
  'Detecter les pieces manquantes':
    "J'ai analyse 68 dossiers. 7 apprentis ont des pieces manquantes : 3 conventions non signees par le tuteur, 2 livrets sans signature mensuelle, 2 attestations OPCO en retard. Voulez-vous que je prepare les relances ?",
  'Verifier la conformite Qualiopi':
    "Score actuel : 94/100. Indicateur 11 (suivi de la formation) descend a 88% : 4 apprentis n'ont pas eu de visite entreprise au T3. Je propose de planifier les visites et generer les comptes rendus.",
  'Resumer un livret pour audit':
    "Livret de Lina Bouzid (BTS SIO SLAM) - 12 entrees mensuelles, 18 competences validees sur 22, 3 visites en entreprise, 0 absence injustifiee. Pret pour audit OPCO.",
  'Proposer des relances intelligentes':
    "Je recommande 3 relances : SMS doux a Karim Dupont (signature en retard de 4 jours), email de rappel a Lucas Mercier (suivi pedagogique), et notification CFA pour Hugo Pereira (livret refuse).",
};

export function AiAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'ai', content: "Bonjour, je suis Sygna IA. Je surveille la conformite de vos dossiers en temps reel. Comment puis-je vous aider ?" },
  ]);

  function send(text: string) {
    if (!text.trim()) return;
    const reply = seedReply[text]
      ?? "J'ai bien recu votre demande. Dans la version connectee, j'analyserai vos donnees Sygna et Anthropic Claude pour vous repondre en moins de 2 secondes.";
    setMessages(prev => [...prev, { role: 'user', content: text }, { role: 'ai', content: reply }]);
    setInput('');
  }

  return (
    <>
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-6 z-40 size-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-500 text-ink-900 shadow-[0_20px_50px_-15px_rgba(34,211,238,0.6)] flex items-center justify-center hover:scale-105 transition"
        aria-label="Ouvrir l'assistant Sygna IA"
      >
        <Sparkles className="size-6" />
        <span className="absolute -top-1 -right-1 size-3 rounded-full bg-rose-500 ring-2 ring-white" />
      </button>

      <aside className={cn(
        'fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] h-[560px] max-h-[calc(100vh-3rem)] bg-white rounded-2xl border border-ink-100 shadow-2xl flex flex-col origin-bottom-right transition',
        open ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none',
      )}>
        <header className="p-4 border-b border-ink-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="size-8 rounded-lg bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center"><Sparkles className="size-4 text-ink-900" /></span>
            <div>
              <p className="text-sm font-semibold">Sygna IA</p>
              <p className="text-[11px] text-ink-400">Assistant conformite & relances</p>
            </div>
          </div>
          <button onClick={() => setOpen(false)} className="size-8 rounded-lg hover:bg-ink-50 flex items-center justify-center"><X className="size-4 text-ink-500" /></button>
        </header>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-3">
          {messages.map((m, i) => (
            <div key={i} className={cn('max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed', m.role === 'user' ? 'ml-auto bg-ink-900 text-white rounded-br-sm' : 'bg-ink-50 text-ink-800 rounded-bl-sm')}>
              {m.content}
            </div>
          ))}
          {messages.length === 1 && (
            <div className="pt-2">
              <p className="text-[11px] uppercase tracking-wider text-ink-400 font-semibold mb-2">Actions rapides</p>
              <div className="grid grid-cols-1 gap-1.5">
                {quick.map(q => (
                  <button key={q.label} onClick={() => send(q.label)} className="flex items-center gap-2 p-2.5 rounded-xl border border-ink-100 hover:border-ink-300 hover:bg-ink-50 text-left text-sm text-ink-700 transition">
                    <q.icon className="size-4 text-ink-500" /> {q.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <form
          className="p-3 border-t border-ink-100 flex items-center gap-2"
          onSubmit={e => { e.preventDefault(); send(input); }}
        >
          <div className="flex-1 flex items-center gap-2 h-10 px-3 rounded-xl border border-ink-100 bg-ink-50/60">
            <MessageSquare className="size-4 text-ink-400" />
            <input value={input} onChange={e => setInput(e.target.value)} placeholder="Demander a Sygna IA..." className="flex-1 bg-transparent text-sm outline-none placeholder:text-ink-400" />
          </div>
          <button type="submit" className="size-10 rounded-xl bg-ink-900 text-white flex items-center justify-center hover:bg-ink-800 transition"><Send className="size-4" /></button>
        </form>
      </aside>
    </>
  );
}
