# SAAS MULTI-TENANT — Mega briefing (tout d'un coup)

**Projet** : agent-ao (repo `youaaddi-arch/agent-ao`, branche `main`)

**Client** : Yousra (groupe PNBS). Vision : SaaS payant pour organismes de formation français.

**Consigne globale** : fais TOUT d'un coup, sans validation par étape. Priorise l'architecture correcte sur le polish. À la fin, rapporte détaillé : ce qui est fini, ce qui est stub, ce qui reste, avec liens PR/commits.

## Contexte

Le repo contient déjà :
- Pipeline LangGraph 7 nœuds (`src/`) — pipeline AO formation, décision Go/No-Go
- 3 entités hardcodées (PNBS, Alios, Polylangues) avec grilles YAML dans `src/config/`
- Backend FastAPI (`api/`) + frontend Next.js 15 + Shadcn/ui (`web/`)
- Sources BOAMP (`src/sources/`)

**On ne casse rien de tout ça.** On ajoute une couche multi-tenant par-dessus. Les 3 entités existantes deviennent la première organisation seed.

## Vision produit

Tout organisme de formation :
1. Crée un compte (email + mot de passe ou Google/GitHub SSO)
2. Onboarding guidé : SIRET → auto-fetch data.gouv → questionnaire structuré (agréments, salles, formateurs, références, financials, documents)
3. Assistant IA aide à remplir chaque étape (extraction CV, catalogue, suggestions)
4. Une fois complet : accès à l'agent IA de veille AO qui utilise leur base de connaissance pour générer des mémoires ultra-personnalisés
5. Multi-utilisateurs par organisation (owner/admin/member)

## Stack technique

- **Auth** : Clerk (`@clerk/nextjs`) — gratuit jusqu'à 10k users, SSO, sessions
- **DB** : Postgres via Supabase (gratuit 500MB) — projet à créer
- **ORM** : Prisma — types TS auto-générés, migrations
- **Storage fichiers** : Supabase Storage (5GB gratuit) OU local `data/orgs/{org_id}/`
- **LLM** : Claude Sonnet 4.6 (déjà configuré via `ANTHROPIC_API_KEY`)
- **Vector store** : ChromaDB local, collection `kb_{org_id}` par tenant
- **Scraping web** : Cheerio + node-fetch (léger, suffisant)
- **API gouv** : recherche-entreprises.api.gouv.fr (gratuit sans auth), api-adresse.data.gouv.fr (BAN)

## Modèle multi-tenant

Chaque table métier contient `organizationId`. Un Prisma middleware filtre auto sur l'org active de l'utilisateur connecté (`getCurrentOrgId()` depuis Clerk `sessionClaims.org_id`).

## ÉTAPE 1 — Setup Auth + DB + Prisma

### Installe dans web/

```bash
cd web
npm install @clerk/nextjs @prisma/client @supabase/supabase-js cheerio node-fetch
npm install -D prisma
npx prisma init
```

### Config .env.local (web/)

Yousra créera un projet Supabase et un compte Clerk avant. En attendant, mets placeholders et documente dans README :

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/onboarding/create-org

DATABASE_URL=postgresql://postgres:[pwd]@[host]:5432/postgres
DIRECT_URL=postgresql://postgres:[pwd]@[host]:5432/postgres

NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

### web/prisma/schema.prisma

```prisma
generator client { provider = "prisma-client-js" }
datasource db {
  provider = "postgresql"
  url = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

model Organization {
  id String @id @default(cuid())
  clerkOrgId String? @unique
  name String
  siret String? @unique
  siren String?
  slug String @unique
  logoUrl String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  members OrganizationMember[]
  legalInfo LegalInfo?
  agrements Agrement[]
  salles Salle[]
  formateurs Formateur[]
  references Reference[]
  documents Document[]
  financial Financial?
  grilles Grille[]
  aoDecisions AODecision[]
  memoires Memoire[]
  onboarding Onboarding?
  webscrape WebScrape?
}

model OrganizationMember {
  id String @id @default(cuid())
  clerkUserId String
  organizationId String
  role String @default("member")
  createdAt DateTime @default(now())
  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  @@unique([clerkUserId, organizationId])
}

model LegalInfo {
  id String @id @default(cuid())
  organizationId String @unique
  formeJuridique String?
  raisonSociale String?
  codeNaf String?
  libelleNaf String?
  adresseSiege Json?
  dirigeants Json?
  dateCreation DateTime?
  capitalSocial Float?
  effectif Int?
  trancheEffectif String?
  bodaccAnnouncements Json?
  fetchedFrom String @default("data.gouv")
  fetchedAt DateTime @default(now())
  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
}

model WebScrape {
  id String @id @default(cuid())
  organizationId String @unique
  url String
  title String?
  description String?
  aboutText String?
  contactInfo Json?
  offresDetectees Json?
  scrapedAt DateTime @default(now())
  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
}

model Onboarding {
  id String @id @default(cuid())
  organizationId String @unique
  currentStep Int @default(1)
  completed Boolean @default(false)
  stepsData Json @default("{}")
  completedAt DateTime?
  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
}

model Agrement {
  id String @id @default(cuid())
  organizationId String
  type String
  numero String?
  dateObtention DateTime?
  dateFin DateTime?
  documentUrl String?
  verifie Boolean @default(false)
  verificationDate DateTime?
  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
}

model Salle {
  id String @id @default(cuid())
  organizationId String
  nom String
  adresse String
  ville String
  codePostal String
  region String?
  m2 Float?
  nbPlaces Int
  equipements String[]
  photos String[]
  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
}

model Formateur {
  id String @id @default(cuid())
  organizationId String
  nom String
  prenom String
  email String?
  telephone String?
  specialites String[]
  experienceAnnees Int?
  tauxSatisfaction Float?
  tauxReussite Float?
  methodesPedagogiques String[]
  supportsPedagogiques String[]
  cvUrl String?
  cvExtractionJson Json?
  bio String?
  langues String[]
  certifications String[]
  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
}

model Reference {
  id String @id @default(cuid())
  organizationId String
  clientNom String
  clientSecteur String?
  dateDebut DateTime?
  dateFin DateTime?
  volumeStagiaires Int?
  montantHT Float?
  intitule String?
  temoignage String?
  contactRef String?
  attestationUrl String?
  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
}

model Financial {
  id String @id @default(cuid())
  organizationId String @unique
  ca3ans Json
  effectifsEncadrant Json
  attestationAssuranceUrl String?
  attestationAssuranceDate DateTime?
  kbisUrl String?
  kbisDate DateTime?
  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
}

model Document {
  id String @id @default(cuid())
  organizationId String
  filename String
  originalName String
  category String
  storagePath String
  mimeType String
  sizeBytes Int
  metadata Json?
  uploadedAt DateTime @default(now())
  ingestedInKB Boolean @default(false)
  ingestedAt DateTime?
  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
}

model Grille {
  id String @id @default(cuid())
  organizationId String
  entiteName String
  yamlContent String
  isActive Boolean @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  @@unique([organizationId, entiteName])
}

model AODecision {
  id String @id @default(cuid())
  organizationId String
  aoId String
  source String @default("BOAMP")
  titre String
  acheteur String?
  montantEstime Float?
  dateLimite DateTime?
  url String?
  entiteRecommandee String
  decisionAgent String
  decisionHumaine String?
  humanDecidedBy String?
  humanDecidedAt DateTime?
  scoreGlobal Int
  scoresDetail Json
  bonus String[]
  synthese String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  memoire Memoire?
  @@unique([organizationId, aoId])
}

model Memoire {
  id String @id @default(cuid())
  organizationId String
  aoDecisionId String @unique
  content String
  version Int @default(1)
  exportedDocxCount Int @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  aoDecision AODecision @relation(fields: [aoDecisionId], references: [id], onDelete: Cascade)
}
```

Puis :

```bash
cd web
npx prisma migrate dev --name init_multitenant
npx prisma generate
```

### web/src/lib/prisma.ts

Singleton Prisma client avec logs en dev.

### web/src/lib/auth.ts

```typescript
import { auth } from "@clerk/nextjs/server";
import { prisma } from "./prisma";

export async function getCurrentOrg() {
  const { userId, orgId, orgSlug } = await auth();
  if (!userId || !orgId) return null;
  const org = await prisma.organization.findUnique({
    where: { clerkOrgId: orgId },
    include: { onboarding: true, legalInfo: true },
  });
  return org;
}

export async function requireOrg() {
  const org = await getCurrentOrg();
  if (!org) throw new Error("No organization");
  return org;
}
```

### web/src/middleware.ts

```typescript
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks/(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ["/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)", "/(api|trpc)(.*)"],
};
```

## ÉTAPE 2 — Pages Auth

### web/src/app/sign-in/[[...sign-in]]/page.tsx et /sign-up/[[...sign-up]]/page.tsx

Composants Clerk `<SignIn />` et `<SignUp />` centrés avec branding léger.

### web/src/app/(marketing)/page.tsx

Landing page publique :
- Hero : "Répondez à 10x plus d'appels d'offres formation grâce à l'IA"
- 3 features : Veille auto BOAMP+TED / Scoring intelligent / Mémoires personnalisés
- 3 plans placeholder (Free/Pro/Enterprise)
- CTA "Créer un compte gratuit"

### web/src/app/onboarding/create-org/page.tsx

Form Clerk `<CreateOrganization />` custom, ou custom form :
- Nom de l'organisation
- SIRET (validation format 14 chiffres)
- Sur submit : crée Organization en DB + OrganizationMember pour l'user, crée Onboarding, redirige vers `/onboarding/wizard/1-entreprise`

## ÉTAPE 3 — Wizard onboarding 10 étapes

Route pattern : `web/src/app/onboarding/wizard/[step]/page.tsx`

Composant partagé `web/src/components/onboarding/WizardShell.tsx` :
- Progress bar en haut (10 étapes)
- Boutons Précédent / Suivant / Sauvegarder brouillon
- Sauvegarde partielle dans `Onboarding.stepsData` à chaque changement

### Étape 1 : Entreprise (`1-entreprise`)

Champs :
- SIRET (autocomplete avec debounce, appel `/api/gouv/entreprise/{siret}`)
- Bouton "Auto-remplir depuis data.gouv"
- Après auto-fetch, affiche : raison sociale, code NAF+libellé, adresse siège, dirigeants, effectif, date création (tous éditables)
- Store dans `LegalInfo`

### Étape 2 : Site web (`2-site-web`)

- Champ URL (optionnel)
- Bouton "Scraper" → appelle `/api/gouv/scrape-website`
- Affiche : titre site, description, texte "à propos", contacts détectés, offres détectées
- User valide/modifie, store dans `WebScrape`

### Étape 3 : Agréments (`3-agrements`)

- Liste dynamique (add/remove)
- Types : Qualiopi | RNCP | RS | Datadock | ISO 21001 | Autre
- Pour chaque : numéro, date obtention, date fin, upload document (PDF)
- Bouton spécial "Vérifier Qualiopi" pour type=Qualiopi → scrape registre officiel (fallback si scraping échoue : juste enregistre non vérifié)
- Store dans `Agrement[]`

### Étape 4 : Salles (`4-salles`)

- Liste dynamique
- Pour chaque salle :
  - Nom (ex "Salle Alpha")
  - Adresse avec autocomplete BAN (`/api/gouv/address/autocomplete`)
  - Ville, CP auto-remplis depuis BAN
  - M² (nombre)
  - Nombre de places (nombre)
  - Équipements (multi-select : vidéoprojecteur, WiFi, tableau blanc, PC, casque VR, plateforme e-learning, café/salle pause, etc.)
  - Photos (upload multiple)
- Multi-adresses OK
- Store dans `Salle[]`

### Étape 5 : Formateurs (`5-formateurs`)

- Liste dynamique
- Pour chaque formateur :
  - Nom, prénom, email, téléphone
  - Spécialités (multi-select : commerce, IA/digital, langues, management, RH, comptabilité, sécurité, etc. — liste extensible)
  - Expérience (années)
  - Taux satisfaction, taux réussite (%)
  - Méthodes pédagogiques (multi-select : atelier, e-learning, coaching, jeu de rôle, cas concret, projet fil rouge, etc.)
  - Supports pédagogiques (texte libre + bouton "Assistant IA" qui propose une liste selon spécialités)
  - Upload CV (PDF) → extraction auto via `/api/ai/extract-cv`
  - Après extraction : formulaire pré-rempli, user valide
- Store dans `Formateur[]`

### Étape 6 : Références (`6-references`)

- Liste dynamique
- Pour chaque ref : client (nom), secteur, date début/fin, volume stagiaires, montant HT, intitulé, témoignage (textarea), contact référent
- Upload attestation de bonne exécution (optionnel)
- Store dans `Reference[]`

### Étape 7 : Financials + docs légaux (`7-financials`)

- CA 3 dernières années (3 champs : 2023, 2024, 2025) — pré-remplir si dispo dans LegalInfo
- Effectif encadrant 3 dernières années (3 champs)
- Upload attestation assurance (PDF) + date d'échéance
- Upload KBIS (PDF) + date
- Alerte visuelle rouge si document expire dans <30j
- Store dans `Financial`

### Étape 8 : Documents commerciaux (`8-documents`)

- Upload catalogue formations (PDF)
- Upload présentation entreprise (PDF/PPTX)
- Upload mémoires techniques types (multi-upload PDF)
- Ces documents seront **ingérés dans le RAG** de l'org (voir Étape 8 backend)
- Store dans `Document[]` avec `category` approprié

### Étape 9 : Config agent AO (`9-config-agent`)

- Éditeur Monaco YAML
- Preset par défaut proposé (grille type basée sur secteur détecté)
- Reprendre la structure des grilles existantes de PNBS/Alios/Polylangues comme référence
- User peut créer plusieurs grilles (une par "entité" de son groupe)
- Store dans `Grille[]`

### Étape 10 : Récap + activation (`10-recap`)

- Récap complet de tout ce qui a été saisi (accordéons par section)
- Alertes si sections vides
- Bouton "Terminer l'onboarding et activer l'agent"
- Marque `Onboarding.completed = true`, `completedAt = now()`
- **Lance l'ingestion RAG des documents** en arrière-plan (via job queue simple ou direct)
- Redirige vers `/dashboard`

## ÉTAPE 4 — Assistant IA de saisie

### web/src/components/AIAssistant.tsx

Bouton flottant en bas à droite (FAB) sur toutes les pages onboarding.
Clic → ouvre un Sheet (drawer) avec :
- Chat basique (input + messages)
- Contexte auto-injecté : étape courante, données de l'étape
- Actions rapides : "Reformule ce texte" / "Extrait info de ce fichier" / "Suggère des options"

### api/routes/ai_assistant.py

```python
# Endpoints :
POST /api/ai/suggest
  Body: { field: str, context: dict, currentValue?: str }
  Appelle Claude avec prompt : "Tu aides à remplir le champ {field} d'un formulaire d'organisme de formation. Contexte : {context}. Propose 3-5 suggestions concises."

POST /api/ai/extract-cv
  Upload PDF, extrait via pypdf + Claude :
  Prompt : "Extrais du CV : nom, prénom, formations (année/école), expériences (période/entreprise/poste), compétences, langues, certifications. JSON strict."

POST /api/ai/extract-catalog
  Upload PDF catalogue, extrait :
  Prompt : "Liste toutes les formations proposées avec titre, durée, prix, prérequis, objectifs. JSON strict."

POST /api/ai/improve-text
  Body: { text: str, tone: "pro" | "commercial" | "concis" }
  Retourne le texte amélioré.

POST /api/ai/chat
  Body: { messages: [], context: dict }
  Chat général avec système prompt adapté à l'onboarding formation.
```

## ÉTAPE 5 — Intégrations API gouv

### api/routes/gouv.py

```python
import httpx
from fastapi import APIRouter, HTTPException
from bs4 import BeautifulSoup

router = APIRouter()

@router.get("/api/gouv/entreprise/{siret}")
async def entreprise(siret: str):
    """Fetch depuis recherche-entreprises.api.gouv.fr"""
    url = f"https://recherche-entreprises.api.gouv.fr/search?q={siret}&per_page=1"
    async with httpx.AsyncClient() as c:
        r = await c.get(url, timeout=15)
        r.raise_for_status()
    data = r.json()
    if not data.get("results"):
        raise HTTPException(404, "SIRET introuvable")
    result = data["results"][0]
    # Retourne : nom_complet, siege (adresse), activite_principale, tranche_effectif_salarie, date_creation, dirigeants, etc.
    return result

@router.post("/api/gouv/scrape-website")
async def scrape(payload: dict):
    """Scraping simple d'une page d'accueil"""
    url = payload["url"]
    async with httpx.AsyncClient(follow_redirects=True) as c:
        r = await c.get(url, timeout=20, headers={"User-Agent": "Mozilla/5.0"})
    soup = BeautifulSoup(r.text, "html.parser")
    return {
        "title": soup.title.string if soup.title else None,
        "description": (soup.find("meta", attrs={"name": "description"}) or {}).get("content"),
        "aboutText": soup.get_text()[:2000],
        "contactInfo": extract_contacts(soup),  # regex emails/tels
        "offresDetectees": extract_offres(soup),  # heuristique liens catalog/offres
    }

@router.get("/api/gouv/qualiopi/{siret}")
async def qualiopi(siret: str):
    """Vérifie sur registre Qualiopi (scraping si pas d'API)"""
    # Tentative via https://travail-emploi.gouv.fr/formation-professionnelle/qualite-de-la-formation/liste-organismes-certifies
    # Fallback : retourne "unverified"
    ...

@router.get("/api/gouv/address/autocomplete")
async def address(q: str):
    """Proxy vers API BAN"""
    async with httpx.AsyncClient() as c:
        r = await c.get(f"https://api-adresse.data.gouv.fr/search/?q={q}&limit=5")
    return r.json()
```

## ÉTAPE 6 — Upload documents

### api/routes/documents.py

```python
POST /api/documents/upload
  multi-part : file, category, organizationId (via auth header)
  Sauvegarde dans data/orgs/{org_id}/{category}/{uuid}.{ext}
  Crée Document en DB via Prisma (côté web)
  
GET /api/documents/{id}/download
DELETE /api/documents/{id}
GET /api/documents?category=X&organizationId=Y
```

Alternative pour perf : upload direct client → Supabase Storage via signed URL. À faire seulement si temps le permet.

## ÉTAPE 7 — RAG multi-tenant

### src/kb/ingestion.py

```python
import chromadb
from sentence_transformers import SentenceTransformer
from langchain.text_splitter import RecursiveCharacterTextSplitter
from pypdf import PdfReader
from docx import Document as DocxDoc
from pathlib import Path

CLIENT = chromadb.PersistentClient(path="data/vectorstore")
MODEL = SentenceTransformer("paraphrase-multilingual-mpnet-base-v2")

def ingest_document(org_id: str, doc_id: str, file_path: str, category: str):
    text = extract_text(file_path)
    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    chunks = splitter.split_text(text)
    embeddings = MODEL.encode(chunks).tolist()
    collection = CLIENT.get_or_create_collection(f"kb_{org_id}")
    collection.add(
        ids=[f"{doc_id}_{i}" for i in range(len(chunks))],
        embeddings=embeddings,
        documents=chunks,
        metadatas=[{"doc_id": doc_id, "category": category, "chunk_idx": i} for i in range(len(chunks))],
    )
    return len(chunks)
```

### src/kb/retrieval.py

```python
def retrieve_context(org_id: str, query: str, top_k: int = 5) -> list[dict]:
    try:
        collection = CLIENT.get_collection(f"kb_{org_id}")
    except ValueError:
        return []
    query_embedding = MODEL.encode([query]).tolist()
    results = collection.query(query_embeddings=query_embedding, n_results=top_k)
    return [
        {"content": doc, "metadata": meta, "distance": dist}
        for doc, meta, dist in zip(results["documents"][0], results["metadatas"][0], results["distances"][0])
    ]
```

### Modifie src/nodes/redaction.py

Avant l'appel Claude pour générer le mémoire :
- `query = f"{ao.objet} {' '.join(ao.thematiques)}"`
- `chunks = retrieve_context(current_org_id, query, top_k=5)`
- Si chunks non vide, injecte dans prompt : "=== CONTEXTE ORGANISATION === {chunks} === Consigne : cite au moins 2 références issues de ce contexte dans le mémoire."

Le `current_org_id` doit être passé en paramètre au pipeline LangGraph via `AgentState`.

## ÉTAPE 8 — Adaptation LangGraph multi-tenant

### Modifie src/state.py

Ajoute `organizationId: str | None` dans `AgentState`.

### Modifie src/agent.py

`initial_state(mode, organization_id)` accepte l'org.

### Modifie src/nodes/scoring.py

`_grille(entite, org_id)` charge depuis DB (via appel FastAPI ou requête directe) au lieu des YAML statiques. Si org non trouvée, fallback sur YAML legacy.

### api/routes/veille.py

`POST /api/veille/run` récupère l'org via auth Clerk, passe `organizationId` à `initial_state`.

## ÉTAPE 9 — Pages SaaS

Restructure `web/src/app/` :

```
app/
├── (marketing)/          # landing publique
│   └── page.tsx
├── sign-in/
├── sign-up/
├── onboarding/           # protégé
│   ├── create-org/
│   └── wizard/[step]/
├── dashboard/            # nouvelle racine app
│   ├── page.tsx          # AO dashboard (déplacer de /page.tsx)
│   ├── ao/[id]/
│   ├── memoires/[id]/
│   ├── kb/
│   ├── settings/
│   ├── history/
│   └── layout.tsx        # sidebar + AuthGuard
├── org/                  # gestion org
│   ├── page.tsx          # infos org
│   ├── members/          # gestion membres
│   ├── billing/          # placeholder Stripe
│   └── layout.tsx
├── formateurs/
├── salles/
├── references/
├── documents/
└── layout.tsx            # root, providers Clerk + Theme
```

### Sidebar mise à jour

Sections :
- **Veille AO** : Dashboard, Historique, Base connaissance, Réglages
- **Ma société** : Infos, Formateurs, Salles, Références, Documents
- **Compte** : Membres, Facturation

### Chaque page CRUD (formateurs, salles, refs, docs)

Structure standard :
- Table shadcn en haut (colonnes principales)
- Bouton "Ajouter"
- Dialog édition avec form
- Actions inline (edit/delete)
- Filtres + search
- Empty state avec CTA

## ÉTAPE 10 — Migration données existantes

Script `scripts/migrate-existing.py` :

```python
"""Migre les 3 entités PNBS/Alios/Polylangues vers le nouveau modèle multi-tenant."""

import yaml
from pathlib import Path
# Utiliser Prisma via subprocess ou API direct

# Créer org "PNBS Group"
org_pnbs = create_org(name="PNBS Group", siret="...")

# Importer grilles YAML dans model Grille
for entite in ["PNBS", "Alios", "Polylangues"]:
    yaml_path = Path(f"src/config/grille_{entite.lower()}.yaml")
    if yaml_path.exists():
        create_grille(
            org_id=org_pnbs.id,
            entiteName=entite,
            yamlContent=yaml_path.read_text(),
        )

# Assigner Yousra comme owner
create_member(clerk_user_id="user_...", organization_id=org_pnbs.id, role="owner")

# Marquer onboarding completed
create_onboarding(organization_id=org_pnbs.id, completed=True, completedAt=now())
```

Note : ne pas exécuter automatiquement (Yousra a besoin de setup Clerk et Supabase d'abord). Juste committer le script + doc.

## ÉTAPE 11 — Docs

Update `README.md` avec sections :
- **Prérequis** : compte Clerk (clerk.com), projet Supabase (supabase.com)
- **Variables d'environnement** : template complet
- **Setup DB** : `npx prisma migrate deploy`
- **Setup Clerk** : configurer webhooks user.created / org.created
- **Migration données existantes** : lancer `python scripts/migrate-existing.py`

Créer `docs/SAAS_ARCHITECTURE.md` expliquant :
- Modèle multi-tenant
- Flow auth
- Flow onboarding
- Isolation par organizationId

## ÉTAPE 12 — Commit + PR

```bash
git checkout -b feat/saas-multitenant
git add -A
git commit -m "feat: pivot vers SaaS multi-tenant complet

- Auth Clerk (signup, signin, org)
- Prisma + Postgres (Supabase) avec 13 modèles multi-tenant
- Onboarding wizard 10 étapes (SIRET auto-fill, scraping, agréments, salles, formateurs, refs, financials, docs, config, récap)
- Intégrations data.gouv (recherche-entreprises, BAN, Qualiopi registre)
- Assistant IA de saisie (extraction CV/catalogue, suggestions)
- RAG multi-tenant avec ChromaDB (collection par org)
- Adaptation LangGraph pour prendre org_id
- 6 nouvelles pages CRUD (org, formateurs, salles, refs, docs, members)
- Landing marketing publique
- Script migration des 3 entités PNBS/Alios/Polylangues
- Documentation complète"
git push -u origin feat/saas-multitenant
gh pr create --draft --title "feat: pivot SaaS multi-tenant complet" --body "$(cat docs/SAAS_ARCHITECTURE.md | head -100)"
```

## Priorités si tu manques de temps

Ordre de priorité STRICT (si context limit atteint) :

1. **OBLIGATOIRE** : Prisma schema + migration + Clerk middleware + auth pages (Étapes 1-2)
2. **OBLIGATOIRE** : Onboarding shell (WizardShell + navigation + save partiel) + Étape 1 (SIRET auto-fill data.gouv)
3. **TRÈS IMPORTANT** : Étapes 2 (site web scrape) + 3 (agréments) du wizard
4. **IMPORTANT** : Étapes 4-8 du wizard (peut être stub avec juste form)
5. **IMPORTANT** : Intégrations data.gouv (`api/routes/gouv.py`)
6. **NICE-TO-HAVE** : Assistant IA de saisie (peut être stub avec juste UI)
7. **NICE-TO-HAVE** : RAG multi-tenant (peut être fait post-MVP)
8. **NICE-TO-HAVE** : Pages CRUD dédiées formateurs/salles/refs/docs
9. **NICE-TO-HAVE** : Migration script
10. **NICE-TO-HAVE** : Landing marketing

Si tu es à court de temps : livre 1-3 solides, stub le reste avec placeholders clairs (`{/* TODO: Phase 2 */}`), documente dans le rapport final ce qui reste à faire.

## Rapport final attendu

Structure ton rapport final ainsi :

### ✅ Terminé
Liste précise des features livrées et testées end-to-end.

### 🟡 Stub / partiel
Ce qui est commencé mais pas fini (form présent mais logique manquante, etc.).

### ❌ Reste à faire
Ce qui n'a pas été touché, à faire en session suivante.

### 🔗 Liens
- Branche : feat/saas-multitenant
- PR : lien
- Commit(s) principaux

### ⚠️ Setup requis avant démarrage
Ce que Yousra doit faire côté externe :
- Créer compte Clerk (URL sign-up)
- Créer projet Supabase (URL + guide)
- Copier les clés dans .env.local
- Lancer migrations : `npx prisma migrate deploy`
- Lancer migration existant : `python scripts/migrate-existing.py`

### 📊 Métriques
- Nombre de fichiers créés/modifiés
- Nombre de composants React
- Nombre d'endpoints API
- Nombre de modèles Prisma
