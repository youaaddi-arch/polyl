# 🍜 NunaKitchen — Korean Street Food Halal 누나키친

Site de commande à emporter / livraison pour **NunaKitchen**, restaurant de street food coréenne 100% halal.

## ✨ Fonctionnalités

- **Menu complet** : 25+ plats coréens (tteokbokki, poulet frit, kimbap, bibimbap, mandu, hotteok, bingsu, dalgona…)
- **Ingrédients & allergènes** détaillés pour chaque plat — transparence totale halal
- **Filtrage** par catégorie (Signatures, Poulet, Riz/Nouilles, Street snacks, Sucré, Boissons, Végé)
- **Recherche** instantanée
- **Panier persistant** (localStorage)
- **Personnalisation** : format (Standard / Grand / XL famille), niveau de piment (4 niveaux), instructions spéciales
- **Modes de commande** : Livraison · À emporter · Sur place
- **Codes promo** : `NUNA10` (-10%), `WELCOME` (-15%), `SEOUL` (-5%)
- **Livraison gratuite** dès 25€
- **Favoris** ❤️
- **Programme fidélité** Nuna Star
- **Avis clients**, **FAQ accordéon**, **contact**, **newsletter**
- **Responsive** mobile / tablette / desktop
- **Design coréen** authentique avec accents hangul, palette rouge/rose/jaune

## 🚀 Lancer le site

C'est un site 100% statique — aucun build requis.

```bash
# Option 1 : ouvrir directement
open index.html

# Option 2 : serveur local
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```

## 📁 Structure

```
.
├── index.html    # Structure du site
├── styles.css    # Design (Korean street food theme)
├── app.js        # Données menu + logique panier/commande
└── README.md
```

## 🌙 Engagement halal

Toutes les viandes utilisées (poulet, bœuf) sont certifiées **halal AVS**. Les recettes ont été adaptées :
- **Gochujang maison** sans alcool
- Aucun **mirin** alcoolisé (remplacé par jus de raisin réduit)
- Aucun **vin de riz** dans les marinades
- Cuisine séparée pour les plats végétariens
