type ActiviteItem = {
  id: string;
  type: string;
  titre: string;
  contenu?: string | null;
  auteur?: string | null;
  createdAt: Date;
};

const ICONES: Record<string, string> = {
  note: "📝",
  email_envoye: "📧",
  email_recu: "📨",
  appel: "📞",
  rdv: "📅",
  document: "📎",
  tache: "✅",
  changement_etape: "🔀",
  creation: "✨",
};

export default function Timeline({ items }: { items: ActiviteItem[] }) {
  if (items.length === 0) {
    return <div className="text-sm text-gray-400 italic py-4">Aucune activité enregistrée</div>;
  }
  return (
    <ol className="relative border-l-2 border-gray-200 pl-6 space-y-5">
      {items.map((it) => (
        <li key={it.id} className="relative">
          <span className="absolute -left-[34px] flex items-center justify-center w-7 h-7 rounded-full bg-white border-2 border-gray-200 text-sm">
            {ICONES[it.type] ?? "•"}
          </span>
          <div className="text-sm">
            <span className="font-medium">{it.titre}</span>
            {it.auteur && <span className="text-gray-500"> · {it.auteur}</span>}
            <span className="text-gray-400 text-xs ml-2">
              {new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short" }).format(it.createdAt)}
            </span>
          </div>
          {it.contenu && <p className="text-sm text-gray-600 mt-1">{it.contenu}</p>}
        </li>
      ))}
    </ol>
  );
}
