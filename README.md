# CRM Formation — Groupe CFA Multi-Entités

CRM sur mesure implémentant le cahier des charges **V2.0** (Agent IA + CRM + ERP + Automatisation omnicanale) pour les 6 entités du groupe : **PNFF, DBS, PNBS, ORCEA, PNFB, PBA**.

## ✅ Périmètre livré (MVP — Phase 1 du CDC)

- **Modèle de données complet** (Prisma) : Entité, Formation, Candidat, Entreprise, Contact, OffreAlternance, ActionFormation, Contrat, Tâche, Événement, Document, Communication, Veille.
- **Catalogue formations pré-rempli** pour les 6 entités (CDC section 2.1).
- **Pipeline Candidat** : 19 étapes du CDC section 6.1, vue liste + kanban + fiche détaillée.
- **Pipeline Entreprise** : 17 étapes du CDC section 7.1, vue liste + kanban + fiche détaillée.
- **Personas** : C1/C2/C3 (candidats) et E1/E2/E3 (entreprises) selon CDC section 4.
- **Dashboard** : KPIs commercial, candidats, entreprises, documents, formations, veille, événements.
- **Tâches** commerciales, **événements** (Job Dating, JIC), **veille réglementaire**.

## 🛠️ Stack

- **Next.js 14** (App Router, Server Actions) + TypeScript
- **Prisma** + **SQLite** (migrable vers PostgreSQL en prod)
- **Tailwind CSS**

## 🚀 Démarrage local

Prérequis : Node.js 18+.

```bash
# 1. Installer les dépendances
npm install

# 2. Configurer la base
cp .env.example .env

# 3. Créer le schéma et seed des données
npm run db:push
npm run db:seed

# 4. Lancer le serveur de développement
npm run dev
```

Le CRM est accessible sur **http://localhost:3000**.

## 📂 Arborescence

```
prisma/
  schema.prisma           # 13 modèles de données du CRM
  seed.ts                 # 6 entités + 21 formations + démo
src/
  app/
    page.tsx              # Dashboard
    candidats/            # Liste, fiche, nouveau, pipeline kanban
    entreprises/          # Liste, fiche, nouveau, pipeline kanban
    formations/           # Catalogue par entité, fiche produit
    taches/               # Tâches commerciales
    evenements/           # Job Dating, JIC
    veille/               # Veille réglementaire
  components/             # Sidebar, StatCard, KanbanColonne
  lib/
    db.ts                 # Client Prisma singleton
    entites.ts            # 6 entités + personas
    pipelines.ts          # 19 + 17 étapes + checklist 21 docs
    formations-catalogue.ts # Seed du catalogue
  actions/                # Server actions (création, transitions)
```

## 🛣️ Suite — Phases 2 à 6 du CDC

| Phase | Contenu | Status |
|---|---|---|
| Phase 1 — Fondations CRM | Structure + objets + catalogue + email/téléphonie | ✅ MVP livré (UI) |
| Phase 2 — Pipeline candidats | ATS → CRM + documents auto + matching | 🚧 UI prête, automatisations à brancher |
| Phase 3 — Pipeline entreprises | Veille offres + enrichissement INSEE + matching avancé | 🚧 UI prête, agents IA à brancher |
| Phase 4 — ERP & contrats | Génération contrats + Yousign + facturation | ⏳ À faire |
| Phase 5 — Communication avancée | LinkedIn + Instagram + SMS/WhatsApp + newsletters | ⏳ À faire |
| Phase 6 — Optimisation & upsell | Dashboards avancés + vente croisée + Alumni | ⏳ À faire |

## 📦 Déploiement Vercel

1. Pousser le repo sur GitHub.
2. Importer le repo sur **vercel.com**.
3. Configurer la variable `DATABASE_URL` (Postgres recommandé en prod, ex : Vercel Postgres ou Supabase).
4. Adapter `provider` dans `schema.prisma` (`postgresql`) et lancer `npx prisma migrate deploy`.

## 🔐 RGPD & Sécurité (CDC section 17)

À implémenter dans les phases suivantes : auth multi-utilisateurs avec rôles, cloisonnement par entité, registre des traitements, droit à l'effacement, journalisation des accès.

---

Document de référence : `CDC Agent IA CRM V2.0` (35 pages).
