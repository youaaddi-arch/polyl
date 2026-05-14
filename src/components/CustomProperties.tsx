import { prisma } from "@/lib/db";
import { sauverPropValeur } from "@/actions/props";

export default async function CustomProperties({ objet, objetId }: { objet: string; objetId: string }) {
  const [props, valeurs] = await Promise.all([
    prisma.propPersonnalisee.findMany({ where: { objet }, orderBy: { ordre: "asc" } }),
    prisma.propValeur.findMany({ where: { objet, objetId } }),
  ]);
  if (props.length === 0) return null;
  const valById = Object.fromEntries(valeurs.map((v) => [v.propCle, v.valeur]));

  return (
    <div className="card p-5 space-y-3">
      <h2 className="font-semibold">🏷️ Propriétés personnalisées</h2>
      {props.map((p) => {
        const opts = p.options?.split(",").map((s) => s.trim()) ?? [];
        return (
          <form key={p.id} action={sauverPropValeur} className="flex items-center gap-2">
            <input type="hidden" name="objet" value={objet} />
            <input type="hidden" name="objetId" value={objetId} />
            <input type="hidden" name="propCle" value={p.cle} />
            <label className="text-sm text-gray-500 w-44 shrink-0">{p.libelle}</label>
            {p.type === "select" ? (
              <select name="valeur" defaultValue={valById[p.cle] ?? ""} className="flex-1 rounded-lg border border-gray-300 px-2 py-1 text-sm bg-white">
                <option value="">—</option>
                {opts.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            ) : p.type === "booleen" ? (
              <select name="valeur" defaultValue={valById[p.cle] ?? ""} className="flex-1 rounded-lg border border-gray-300 px-2 py-1 text-sm bg-white">
                <option value="">—</option>
                <option value="oui">Oui</option>
                <option value="non">Non</option>
              </select>
            ) : (
              <input name="valeur" type={p.type === "nombre" ? "number" : p.type === "date" ? "date" : "text"} defaultValue={valById[p.cle] ?? ""} className="flex-1 rounded-lg border border-gray-300 px-2 py-1 text-sm" />
            )}
            <button className="text-xs text-brand-600 hover:underline">💾</button>
          </form>
        );
      })}
    </div>
  );
}
