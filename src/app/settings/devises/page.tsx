export const dynamic = "force-dynamic";

const DEVISES = [
  { code: "EUR", nom: "Euro", symbole: "€", taux: 1, default: true },
  { code: "USD", nom: "Dollar américain", symbole: "$", taux: 1.09 },
  { code: "GBP", nom: "Livre sterling", symbole: "£", taux: 0.85 },
  { code: "CHF", nom: "Franc suisse", symbole: "CHF", taux: 0.96 },
  { code: "CAD", nom: "Dollar canadien", symbole: "C$", taux: 1.48 },
];

export default function DevisesPage() {
  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Devises</h1>
          <p className="text-hubspot-text-muted text-sm">Devises disponibles dans les deals et devis</p>
        </div>
        <button className="btn-primary">+ Ajouter une devise</button>
      </header>

      <div className="card overflow-hidden">
        <table className="crm">
          <thead><tr><th>Code</th><th>Nom</th><th>Symbole</th><th>Taux (vs EUR)</th><th>Par défaut</th><th /></tr></thead>
          <tbody>
            {DEVISES.map((d) => (
              <tr key={d.code}>
                <td className="font-mono font-semibold">{d.code}</td>
                <td>{d.nom}</td>
                <td>{d.symbole}</td>
                <td>{d.taux}</td>
                <td>{d.default && <span className="badge bg-emerald-50 text-emerald-700">par défaut</span>}</td>
                <td className="text-right"><button className="text-xs text-hubspot-orange hover:underline">Modifier</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
