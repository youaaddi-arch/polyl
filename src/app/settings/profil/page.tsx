import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ProfilPage() {
  const me = await prisma.utilisateur.findFirst({ where: { role: "admin" } });
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Mon profil</h1>
        <p className="text-hubspot-text-muted text-sm">Informations personnelles & photo</p>
      </header>

      <section className="card p-6">
        <div className="flex items-start gap-6">
          <div className="w-24 h-24 rounded-full bg-hubspot-orange flex items-center justify-center text-white text-3xl font-bold">
            {me?.prenom?.[0] ?? "Y"}
          </div>
          <div className="flex-1 space-y-3">
            <Field label="Prénom" value={me?.prenom ?? "—"} />
            <Field label="Nom" value={me?.nom ?? "—"} />
            <Field label="Email professionnel" value={me?.email ?? "—"} />
            <Field label="Rôle" value={me?.role ?? "—"} />
            <Field label="Entité" value={me?.entiteCode ?? "—"} />
            <button className="btn-secondary">📷 Changer la photo</button>
          </div>
        </div>
      </section>

      <section className="card p-6 space-y-3">
        <h2 className="font-semibold">Mot de passe</h2>
        <button className="btn-secondary">🔑 Modifier mon mot de passe</button>
      </section>

      <section className="card p-6 space-y-3">
        <h2 className="font-semibold">Numéro de téléphone</h2>
        <Field label="Téléphone direct" value="—" />
        <Field label="Mobile professionnel" value="—" />
      </section>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[10rem_1fr] items-center">
      <span className="text-sm text-hubspot-text-muted">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}
