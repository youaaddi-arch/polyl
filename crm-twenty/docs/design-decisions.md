# Décisions de design — CRM Twenty Paris Nord Groupe

Trace des choix structurants validés avec Yousra (directrice).

## D1 — Workspace unique
**Choix** : 1 seul workspace Twenty pour le groupe, cloisonnement via champ `Entite`.
**Alternative écartée** : 1 workspace par entité (9 workspaces).
**Raison** : reporting groupé natif, mutualisation des contacts inter-entités, coût licence × 1 au lieu de × 9.

## D2 — Entité = custom object (pas enum)
**Choix** : `Entite` est un custom object avec relations FK depuis tous les autres objets.
**Alternative écartée** : champ select enum figé sur chaque objet.
**Raison** : permet de stocker SIRET, n° Qualiopi, n° déclaration activité, adresse, logo et modalités proposées par entité. Plus propre pour vues filtrées.

## D3 — Apprenant = custom object séparé
**Choix** : `Apprenant` est un custom object distinct, pas une extension de `Person`.
**Alternative écartée** : étendre `Person` avec 30+ champs custom.
**Raison** : cycle de vie distinct, 3 pipelines dédiés, `Person` reste pour contacts B2B (RH, maîtres d'apprentissage, prescripteurs).

## D4 — Contrat = 1 objet unifié
**Choix** : objet `Contrat` unique avec champ `type` (apprentissage / pro / convention FC dipl / convention FC courte).
**Alternative écartée** : 4 objets séparés.
**Raison** : maintenance × 1, reporting transverse simple, champs spécifiques laissés vides si non pertinents.

## D5 — Document Apprenant = 1 record par document
**Choix** : `DocumentApprenant` avec ~21 records par apprenant (1 par document Qualiopi).
**Alternative écartée** : 1 record par apprenant avec 21 booléens.
**Raison** : traçabilité audit Qualiopi optimale (date_emission, date_signature, fichier_pdf joint).

## D6 — Pipeline stages = champ sur Apprenant
**Choix** : 3 champs `select` distincts sur `Apprenant` (stageAlternance, stageFcDiplomante, stageFcCourte).
**Alternative écartée** : objet `ParcoursApprenant` séparé.
**Raison** : un apprenant a un parcours actif à la fois. Si reformation alumni, nouveau record Apprenant. Plus simple, vues kanban natives Twenty.

## D7 — Maître d'apprentissage = Person + rôle multi-select
**Choix** : `Person` natif + champ `roles` multi-select (Maître apprentissage / RH / Tuteur / Décideur achat / Prescripteur).
**Alternative écartée** : custom object `MaitreApprentissage`.
**Raison** : un même contact peut cumuler plusieurs rôles. Compteur « max 2 apprentis » se calcule via les Contrats liés.

## D8 — Stack technique
**Choix** : Node.js 20+ / TypeScript / `tsx` / `fetch` natif / `dotenv`.
**Raison** : Twenty est en TS, écosystème natif, pas de SDK officiel à intégrer (REST + GraphQL bruts via wrapper).

## D9 — Repo
**Choix** : sous-dossier `crm-twenty/` dans `youaaddi-arch/polyl`, branche `claude/paris-nord-groupe-setup-Qp8Dn`.
**Note** : scope GitHub restreint à 2 repos dans cette session, choix provisoire. Migration possible vers repo dédié plus tard.
