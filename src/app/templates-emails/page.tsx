import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function TemplatesEmailsPage() {
  const templates = await prisma.emailTemplate.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Templates emails</h1>
        <p className="text-gray-500 text-sm">Modèles réutilisables pour vos campagnes & emails transactionnels</p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map((t) => (
          <div key={t.id} className="card p-5">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-semibold">{t.nom}</h2>
              <span className="badge bg-purple-50 text-purple-700">{t.categorie ?? "—"}</span>
            </div>
            <div className="text-sm text-gray-600 mb-2"><strong>Sujet :</strong> {t.sujet}</div>
            <div className="text-xs text-gray-500 border-t pt-2 mt-2" dangerouslySetInnerHTML={{ __html: t.contenu }} />
            {t.variables && (
              <div className="text-xs text-gray-400 mt-3">
                Variables : {t.variables.split(",").map((v) => <code key={v} className="bg-gray-100 px-1 rounded mr-1">{`{{${v}}}`}</code>)}
              </div>
            )}
          </div>
        ))}
        {templates.length === 0 && <div className="text-sm text-gray-400">Aucun template</div>}
      </div>
    </div>
  );
}
