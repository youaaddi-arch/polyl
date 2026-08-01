# Paris Nord Groupe — Twenty CRM Setup

Setup automatisé du CRM Twenty pour Paris Nord Groupe (9 entités, 3 pipelines métier, conformité Qualiopi).

- Workspace : `https://parisnordgroupe.twenty.com`
- Plan : Free trial (migration Pro à prévoir si limites atteintes)
- Stratégie : Cloud d'abord, migration self-hosted OVH plus tard via rejeu de `objects-schema.json`

## Prérequis

- Node.js >= 20
- Clé API Twenty (Settings → API & Webhooks)

## Setup local

```bash
cd crm-twenty
npm install
cp .env.example .env
# éditer .env et renseigner TWENTY_API_KEY
```

## Vérifier la connexion (read-only)

```bash
npm run ping            # GET /metadata/objects, /metadata/fields
npm run list-objects    # liste tous les objets du workspace
```

## Structure du projet

```
crm-twenty/
├── src/
│   ├── config.ts            # chargement .env
│   └── client.ts            # wrapper REST + Metadata + GraphQL
├── scripts/
│   ├── ping.ts              # smoke test
│   └── list-objects.ts      # inventaire workspace
├── objects-schema.json      # schéma rejouable (objets, champs, pipelines)
├── docs/
│   └── design-decisions.md  # choix d'architecture
└── .env.example
```

## Modèle métier (synthèse)

### Objets custom prévus
- `Entite` — 9 records (PNBS, PBA, PNFF, DBS, ORCEA, PNFB, ALIOS, CIDD, Mycènes)
- `Apprenant` — custom object (pas extension Person)
- `Formation` — fiche catalogue
- `ActionDeFormation` — instance d'une formation pour une session/groupe
- `Contrat` — objet unifié (champ `type` : apprentissage / pro / convention FC dipl / convention FC courte)
- `DossierFinancement` — CPF / AIF / POEI / Plan dev / OPCO / Auto
- `DocumentApprenant` — 1 record par document Qualiopi (21 types)
- `OffreAlternance` — offres d'emploi pour matching

### Extensions d'objets natifs
- `Person` : champ multi-select `roles` (Maître d'apprentissage / RH / Tuteur / Décideur achat / Prescripteur)
- `Company` (Entreprise) : champ multi-select `typeRelation` (Employeur alternant / Prescripteur FC / Cliente B2B / Prospect)

### Pipelines (champs `select` sur Apprenant)
- `stageAlternance` — 16 stages
- `stageFcDiplomante` — 12 stages
- `stageFcCourte` — 8 stages

Détail complet dans `objects-schema.json`.

## Roadmap

- **J1 (fait)** : scaffolding repo, client API, scripts ping/list-objects
- **J2** : création des objets custom + relations + champs multi-select sur Person/Company
- **J3** : pipelines + vues filtrées (9 entités × 3 modalités)
- **S2** : import Excel, templates emails, intégration Brevo, workflows

## Sécurité

- `.env` est git-ignoré : la clé API Twenty n'est JAMAIS commitée
- Aucune action destructive sans confirmation explicite
- Tous les objets de test sont préfixés `TEST_` pour suppression facile
