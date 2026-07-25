# PHASE C — Refonte UI Next.js 15 + FastAPI wrapper

**Contexte** : projet agent-ao (agent IA de veille AO formation). Le pipeline LangGraph 7 nœuds existe déjà dans `src/`. On garde LangGraph comme cerveau, on ajoute juste une couche HTTP (FastAPI) et une belle UI (Next.js).

**Consigne globale** : fais TOUT d'un coup sans validation par étape. Rapporte le résultat final à la fin. Aucun fichier existant dans `src/` ne doit être modifié pour cette phase.

## Architecture cible

```
agent-ao/
├── src/           (existant, INCHANGÉ, LangGraph reste le cerveau)
├── api/           (NOUVEAU — FastAPI mince, ne fait AUCUNE décision)
│   ├── main.py
│   ├── models.py
│   └── routes/
│       ├── ao.py
│       ├── veille.py
│       ├── memoires.py
│       ├── kb.py
│       ├── grilles.py
│       └── rapports.py
├── web/           (NOUVEAU — Next.js 15 + Shadcn/ui + Tailwind)
│   ├── src/app/
│   ├── src/components/
│   ├── src/lib/
│   └── package.json
├── scripts/
│   └── start-dev.sh   (NOUVEAU)
└── ... (existant)
```

## ÉTAPE 1 — Backend FastAPI

Ajoute à `requirements.txt` :
- `fastapi>=0.115.0`
- `uvicorn[standard]>=0.32.0`
- `python-multipart>=0.0.20`

Installe : `pip install -r requirements.txt`

### api/main.py
- FastAPI app avec CORS ouvert sur `http://localhost:3000`
- Health check `GET /health`
- Monte les routes depuis `api/routes/`

### api/models.py
Pydantic models pour réponses API : `AOResponse`, `DecisionResponse`, `MemoireResponse`, `GrilleResponse`, `RapportResponse`, `KBDocumentResponse`, `VeilleRunResponse`.

### api/routes/ao.py
- `GET /api/ao` : liste des AO du dernier rapport (parse `data/rapports/*.md`)
- `GET /api/ao/{ao_id}` : détail (structure + décision + memoire URL)

### api/routes/veille.py
- `POST /api/veille/run?mode=test|prod` : lance une veille en BackgroundTasks, retourne task_id
- `GET /api/veille/status/{task_id}` : progression (parse la sortie ou vérifie nouveau rapport)
- `GET /api/veille/latest` : timestamp du dernier run

Utilise `from src.agent import construire_graphe` et `from src.state import initial_state`. **N'implémente PAS de logique métier — appelle juste LangGraph.**

### api/routes/memoires.py
- `GET /api/memoires/{ao_id}` : contenu markdown de `data/dce/{ao_id}/memoire.md`
- `PUT /api/memoires/{ao_id}` : sauvegarde le markdown modifié
- `GET /api/memoires/{ao_id}/export` : export .docx via `python-docx`

### api/routes/kb.py
- `GET /api/kb/{entity}` : liste `data/kb/{entity}/*` (crée le dossier si absent)
- `POST /api/kb/{entity}/upload` : upload un fichier dans `data/kb/{entity}/`
- `DELETE /api/kb/{entity}/{filename}`
- Entités acceptées : `pnbs`, `alios`, `polylangues`
- **Note** : ingestion RAG viendra en Phase A, ici juste gestion fichiers

### api/routes/grilles.py
- `GET /api/grilles/{entity}` : renvoie le YAML parsé de `src/config/grille_{entity}.yaml`
- `PUT /api/grilles/{entity}` : sauvegarde le YAML (valider via `yaml.safe_load` avant écriture)

### api/routes/rapports.py
- `GET /api/rapports` : liste des rapports historiques (nom fichier + timestamp)
- `GET /api/rapports/{filename}` : contenu markdown

Test : `uvicorn api.main:app --reload --port 8000` puis vérifie `http://localhost:8000/docs`.

## ÉTAPE 2 — Frontend Next.js

Dans le dossier `agent-ao/` racine :

```bash
npx create-next-app@latest web --typescript --tailwind --app --src-dir --import-alias "@/*" --no-turbopack --no-eslint
cd web
npm install lucide-react recharts date-fns next-themes @monaco-editor/react react-markdown remark-gfm
npx shadcn@latest init
# Choix : Default + Slate
npx shadcn@latest add button card dialog badge input textarea select slider tabs table sheet toast avatar separator progress alert scroll-area dropdown-menu
```

### web/src/lib/api.ts
Client fetch typed pour `/api/*`. Base URL `http://localhost:8000`.

### web/src/app/layout.tsx
- Layout global avec Sidebar (composant custom)
- Dark mode via `next-themes` (`ThemeProvider`)
- Font Inter via `next/font/google`

### web/src/components/Sidebar.tsx
Liens : Dashboard, Historique, Base connaissance, Réglages. Toggle dark mode en bas. Style shadcn.

### web/src/components/AOCard.tsx
Card réutilisable pour un AO :
- Header : emoji score, entité badge, montant, date limite
- Body : titre AO tronqué à 100 caractères
- Footer : boutons "Voir détail" (`/ao/{id}`), "Voir mémoire" (`/memoires/{id}`)

### web/src/components/ScoreBar.tsx
Barre de progression colorée (vert >65, jaune 50-64, orange <50).

### web/src/components/EntityBadge.tsx
Badge coloré par entité : PNBS bleu, Alios vert, Polylangues violet.

### web/src/components/DecisionEmoji.tsx
Emoji selon score : ≥65 🟢 | 50-64 🟡 | <50 🟠.

### web/src/app/page.tsx (Dashboard)
- Header : titre + bouton "🔄 Nouvelle veille" (POST /api/veille/run?mode=test)
- 4 KPI cards en haut : nb AO total, nb GO, nb à arbitrer, montant cumulé GO
- Sidebar filtres : entité (checkboxes), score min (slider), date limite (from/to)
- Grid de `AOCard` (3 colonnes desktop, 1 mobile)

### web/src/app/ao/[id]/page.tsx (Détail AO)
- Header : titre, acheteur, montant, deadline, URL BOAMP
- Tabs : Scores | Synthèse | Bonus | Mémoire
- Onglet Scores : Recharts BarChart horizontal des 5 critères
- Onglet Mémoire : preview markdown avec `react-markdown` + `remark-gfm`

### web/src/app/memoires/[id]/page.tsx (Éditeur)
- Split view 50/50 : Monaco editor à gauche, preview react-markdown à droite
- Bouton "Sauvegarder" (PUT /api/memoires/{id})
- Bouton "Exporter .docx" (download depuis /api/memoires/{id}/export)

### web/src/app/kb/page.tsx
- Tabs par entité : PNBS | Alios | Polylangues
- Chaque tab : liste des fichiers + drag-and-drop upload zone
- Boutons supprimer, télécharger
- Alert en haut : "L'ingestion RAG sera activée en Phase A"

### web/src/app/settings/page.tsx
- Tabs par entité
- Éditeur Monaco avec langage yaml
- Validation live, bouton Sauvegarder

### web/src/app/history/page.tsx
- Table shadcn des rapports (date, nb AO, nb GO)
- Clic pour ouvrir un rapport historique en Sheet (preview markdown)

## ÉTAPE 3 — Script de dev

Crée `scripts/start-dev.sh` :
```bash
#!/usr/bin/env bash
set -e
cd "$(dirname "$0")/.."
source .venv/bin/activate
echo "→ Démarrage FastAPI sur :8000"
uvicorn api.main:app --reload --port 8000 &
API_PID=$!
trap "kill $API_PID 2>/dev/null" EXIT
echo "→ Démarrage Next.js sur :3000"
cd web && npm run dev
```

`chmod +x scripts/start-dev.sh`

## ÉTAPE 4 — .gitignore

Ajoute à `.gitignore` :
```
web/node_modules/
web/.next/
web/out/
web/.env.local
```

## ÉTAPE 5 — README

Ajoute une section "Interface web" au `README.md` :

```markdown
## Interface web moderne

Pour lancer l'application web complète :
\`\`\`bash
bash scripts/start-dev.sh
\`\`\`
→ Backend FastAPI sur http://localhost:8000
→ Frontend Next.js sur http://localhost:3000

L'ancien dashboard Streamlit reste disponible via `streamlit run dashboard.py`.
```

## ÉTAPE 6 — Tests

1. `bash scripts/start-dev.sh`
2. Ouvre `http://localhost:3000`
3. Vérifie que le dashboard affiche les AO du dernier rapport
4. Clique sur un AO → vérifie `/ao/[id]`
5. Ouvre `/memoires/[id]` → vérifie l'éditeur
6. Test `/settings` → modifie une grille YAML
7. Test `/kb` → upload un fichier test

## ÉTAPE 7 — Commit + push

```bash
git add -A
git commit -m "feat: refonte UI Next.js 15 + Shadcn/ui + FastAPI wrapper (LangGraph inchangé)"
git push
```

## Rapport final attendu

À la fin, rapporte :
- Chemin de `scripts/start-dev.sh`
- Description du dashboard vu (KPI, cards, filtres)
- Lien du commit
- Éventuels choix d'implémentation faits en autonomie
- Toute limitation ou point à valider avec Yousra
