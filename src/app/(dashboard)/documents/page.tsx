import { Topbar } from '@/components/Topbar';
import { Card, CardBody } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { CategoryIcon } from '@/components/CategoryIcon';
import { StatusPill } from '@/components/StatusPill';
import { documents, apprentis, categoryLabels } from '@/lib/mock-data';
import { formatDate } from '@/lib/utils';
import { Filter, Plus, Search, Upload, FolderTree, FileSignature } from 'lucide-react';

export default function DocumentsPage() {
  const cats = Object.entries(categoryLabels);
  return (
    <>
      <Topbar title="Documents" subtitle="Bibliotheque documentaire - 248 fichiers actifs" />
      <main className="flex-1 p-6 space-y-6">
        <Card className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 h-10 px-3 rounded-xl border border-ink-100 bg-ink-50/60 flex-1 min-w-[260px]">
              <Search className="size-4 text-ink-400" />
              <input placeholder="Rechercher par titre, apprenti, entreprise..." className="flex-1 bg-transparent text-sm outline-none placeholder:text-ink-400" />
            </div>
            <Button variant="outline" size="md"><Filter className="size-3.5" /> Filtres</Button>
            <Button variant="outline" size="md"><Upload className="size-3.5" /> Importer un PDF</Button>
            <Button variant="neon" size="md"><Plus className="size-3.5" /> Nouveau document</Button>
          </div>
        </Card>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {cats.map(([k, label]) => {
            const count = documents.filter(d => d.category === k).length;
            return (
              <Card key={k} className="p-4 cursor-pointer hover:border-ink-300 transition">
                <CategoryIcon category={k as never} />
                <p className="mt-3 text-sm font-semibold text-ink-900">{label}</p>
                <p className="text-[11px] text-ink-400">{count} document{count > 1 ? 's' : ''}</p>
              </Card>
            );
          })}
        </div>

        <Card>
          <div className="px-5 py-3 flex items-center justify-between border-b border-ink-100">
            <div className="flex items-center gap-2 text-sm">
              <FolderTree className="size-4 text-ink-500" />
              <span className="font-semibold text-ink-900">Tous les documents</span>
              <Badge tone="neutral">{documents.length}</Badge>
            </div>
            <span className="text-xs text-ink-400">Trie par derniere modification</span>
          </div>
          <CardBody className="p-0">
            <table className="w-full text-sm">
              <thead className="text-[11px] uppercase tracking-wider text-ink-400 bg-ink-50/40">
                <tr>
                  <th className="text-left font-medium px-5 py-2.5">Document</th>
                  <th className="text-left font-medium px-5 py-2.5">Categorie</th>
                  <th className="text-left font-medium px-5 py-2.5">Apprenti</th>
                  <th className="text-left font-medium px-5 py-2.5">Signataires</th>
                  <th className="text-left font-medium px-5 py-2.5">Statut</th>
                  <th className="text-left font-medium px-5 py-2.5">Modifie</th>
                  <th className="px-5 py-2.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {documents.map(d => {
                  const a = apprentis.find(x => x.id === d.apprentiId)!;
                  return (
                    <tr key={d.id} className="hover:bg-ink-50/40">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <CategoryIcon category={d.category} size="sm" />
                          <div>
                            <p className="font-medium text-ink-900">{d.title}</p>
                            <p className="text-[11px] text-ink-400">v{d.version} - {d.pages} pages - {d.size}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3"><Badge tone="neutral">{categoryLabels[d.category]}</Badge></td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <Avatar name={a.name} color={a.avatarColor} size="xs" />
                          <span className="text-ink-700">{a.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex -space-x-2">
                          {d.signers.map(s => (
                            <Avatar key={s.id} name={s.name} size="xs" color="from-ink-400 to-ink-700" className="ring-2 ring-white" />
                          ))}
                        </div>
                      </td>
                      <td className="px-5 py-3"><StatusPill status={d.status} /></td>
                      <td className="px-5 py-3 text-xs text-ink-500">{formatDate(d.updatedAt)}</td>
                      <td className="px-5 py-3 text-right">
                        <Button size="sm" variant="ghost"><FileSignature className="size-3.5" /> Ouvrir</Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardBody>
        </Card>
      </main>
    </>
  );
}
