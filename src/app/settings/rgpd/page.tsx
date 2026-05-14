import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function RgpdPage() {
  const c = await prisma.accountConfig.findUnique({ where: { id: "singleton" } });
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">RGPD & consentement</h1>
        <p className="text-hubspot-text-muted text-sm">Conformité Règlement Général de Protection des Données (UE 2016/679)</p>
      </header>

      <section className="card p-6 space-y-3">
        <h2 className="font-semibold">Contact DPO (Délégué à la Protection des Données)</h2>
        <Field label="Email DPO" value={c?.rgpdContact ?? "—"} />
        <Field label="Adresse postale" value={c?.rgpdAdresse ?? "—"} />
      </section>

      <section className="card p-6">
        <h2 className="font-semibold mb-3">Registre des traitements</h2>
        <table className="w-full text-sm">
          <thead className="text-xs text-hubspot-text-muted uppercase">
            <tr><th className="text-left pb-2">Traitement</th><th className="text-left pb-2">Base légale</th><th className="text-left pb-2">Durée conservation</th></tr>
          </thead>
          <tbody>
            {[
              { t: "Gestion candidatures", b: "Intérêt légitime", d: "3 ans" },
              { t: "Suivi pédagogique apprentis", b: "Exécution contrat", d: "10 ans (Qualiopi)" },
              { t: "Prospection commerciale entreprises", b: "Intérêt légitime", d: "3 ans après dernier contact" },
              { t: "Newsletter & marketing", b: "Consentement explicite", d: "Jusqu'au retrait" },
              { t: "Vidéosurveillance locaux", b: "Sécurité", d: "30 jours" },
              { t: "Cookies & analytics", b: "Consentement", d: "13 mois max" },
            ].map((r) => (
              <tr key={r.t} className="border-t border-hubspot-border">
                <td className="py-2.5 font-medium">{r.t}</td>
                <td>{r.b}</td>
                <td>{r.d}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="card p-6 space-y-3">
        <h2 className="font-semibold">Droits des personnes</h2>
        <div className="grid grid-cols-2 gap-3">
          {["Droit d'accès", "Droit de rectification", "Droit à l'effacement (oubli)", "Droit à la portabilité", "Droit d'opposition", "Droit à la limitation"].map((d) => (
            <div key={d} className="flex items-center gap-2 text-sm"><span className="text-emerald-600">✓</span>{d}</div>
          ))}
        </div>
        <button className="btn-secondary mt-3">📥 Traiter une demande d'accès / d'effacement</button>
      </section>

      <section className="card p-6 space-y-3">
        <h2 className="font-semibold">Consentement & cookies</h2>
        <Toggle label="Bannière cookies sur le site public" defaultChecked />
        <Toggle label="Double opt-in pour les newsletters" defaultChecked />
        <Toggle label="Consentement enregistrement appels téléphoniques" />
        <Toggle label="Anonymisation auto après période de rétention" defaultChecked />
      </section>

      <section className="card p-6 space-y-3">
        <h2 className="font-semibold">Sous-traitants RGPD</h2>
        <table className="w-full text-sm">
          <thead className="text-xs text-hubspot-text-muted uppercase">
            <tr><th className="text-left pb-2">Sous-traitant</th><th className="text-left pb-2">Finalité</th><th className="text-left pb-2">Localisation</th><th className="text-left pb-2">DPA signé</th></tr>
          </thead>
          <tbody>
            {[
              { n: "Brevo", f: "Emailing", l: "🇨🇷 France", dpa: true },
              { n: "Yousign", f: "Signature électronique", l: "🇨🇷 France", dpa: true },
              { n: "OpenAI", f: "Agent IA matching", l: "🇺🇸 USA (DPF)", dpa: true },
              { n: "Vercel", f: "Hébergement", l: "🇪🇺 UE", dpa: true },
            ].map((s) => (
              <tr key={s.n} className="border-t border-hubspot-border">
                <td className="py-2 font-medium">{s.n}</td>
                <td>{s.f}</td>
                <td>{s.l}</td>
                <td>{s.dpa && <span className="text-emerald-600">✓</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[10rem_1fr] text-sm">
      <span className="text-hubspot-text-muted">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function Toggle({ label, defaultChecked }: { label: string; defaultChecked?: boolean }) {
  return (
    <label className="flex items-center justify-between py-1.5 cursor-pointer">
      <span className="text-sm">{label}</span>
      <input type="checkbox" defaultChecked={defaultChecked} className="w-10 h-5 accent-hubspot-orange" />
    </label>
  );
}
