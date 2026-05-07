# Sygna

> Plateforme SaaS de signature electronique dediee aux CFA, organismes de formation et entreprises de l'alternance.

Sygna remplace les signatures papier et les echanges mails par une plateforme conforme RGPD, Qualiopi et OPCO, specialisee dans la gestion des **livrets d'apprentissage**, **conventions**, **emargements** et **suivis pedagogiques**.

## Fonctionnalites cles

- Quatre espaces dedies : **Administrateur CFA**, **Entreprise / tuteur**, **Apprenti**, **Formateur / referent pedagogique**
- **Signature electronique** : dessinee, par email, OTP, ordre configurable, multi-signataires, drag & drop des zones
- **Livret d'apprentissage interactif** : competences, suivi entreprise, visites, absences, signatures mensuelles
- **Workflow CFA** complet : creation dossier apprenti, relances mail/SMS, conformite, export OPCO / Qualiopi
- **Conformite francaise** : RGPD, piste d'audit, horodatage qualifie, archivage, journal des actions
- **Assistant IA Sygna** : detection de pieces manquantes, resume audit, generation de comptes rendus, relances intelligentes

## Stack

- **Front** : Next.js 15 (App Router) + React 19 + TypeScript
- **Style** : Tailwind CSS v4 (CSS-first), design system maison
- **IA** : Anthropic Claude (assistant integre)
- **Backend prevu** : Supabase (Postgres + Auth + Storage), API routes Next
- **Signature** : canvas HTML5 (signature dessinee), generation PDF dynamique

## Demarrage

```bash
npm install
cp .env.example .env.local
npm run dev
```

Application disponible sur http://localhost:3000

## Pages livrees

| Route | Description |
| --- | --- |
| `/` | Landing page commerciale |
| `/login` | Connexion multi-roles |
| `/admin` | Dashboard administrateur CFA |
| `/entreprise` | Dashboard entreprise / tuteur |
| `/apprenti` | Dashboard apprenti |
| `/formateur` | Dashboard formateur / referent |
| `/documents` | Bibliotheque documentaire |
| `/apprentis` | Liste & fiches apprenti |
| `/livret/[id]` | Livret d'apprentissage interactif |
| `/sign/[token]` | Page publique de signature |
| `/audit` | Conformite & exports |
| `/parametres` | Parametres compte / CFA |

## Identite visuelle

- Bleu nuit `#0B1437`
- Blanc `#FFFFFF`
- Gris clair `#F5F7FA`
- Cyan neon discret `#22D3EE`
- Violet neon discret `#A78BFA`

Inspirations : DocuSign, Yousign, Notion, Stripe Dashboard, Linear.
