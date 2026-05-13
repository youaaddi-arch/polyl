import Link from "next/link";

export type KanbanCard = {
  id: string;
  titre: string;
  soustitre?: string | null;
  badge?: string | null;
  href: string;
};

export default function KanbanColonne({
  numero,
  libelle,
  description,
  cards,
}: {
  numero: number;
  libelle: string;
  description: string;
  cards: KanbanCard[];
}) {
  return (
    <div className="shrink-0 w-72 bg-gray-100 rounded-xl p-3 flex flex-col">
      <div className="mb-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-500">ÉTAPE {numero}</span>
          <span className="badge bg-white text-gray-600 border">{cards.length}</span>
        </div>
        <div className="font-medium text-sm mt-1 leading-tight">{libelle}</div>
        <div className="text-[11px] text-gray-500 mt-1">{description}</div>
      </div>
      <div className="space-y-2 overflow-y-auto">
        {cards.map((c) => (
          <Link key={c.id} href={c.href} className="block bg-white rounded-lg p-3 shadow-sm border border-gray-200 hover:border-brand-300">
            <div className="font-medium text-sm">{c.titre}</div>
            {c.soustitre && <div className="text-xs text-gray-500 mt-0.5">{c.soustitre}</div>}
            {c.badge && <span className="badge bg-brand-50 text-brand-700 mt-2">{c.badge}</span>}
          </Link>
        ))}
        {cards.length === 0 && (
          <div className="text-xs text-gray-400 italic px-1 py-2">Aucun élément</div>
        )}
      </div>
    </div>
  );
}
