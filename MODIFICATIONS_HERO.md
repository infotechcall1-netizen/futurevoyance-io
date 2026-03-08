# Rapport de Modification : Restauration du Hero avec Design FV

J'ai restauré le design original (hex pattern) tout en appliquant tes consignes strictes de palette et hiérarchie.

## 1. Fichiers modifiés
- **`app/components/HeroOracle.tsx`** :
  - Restauré le **background original** (SVG polygon/ruche).
  - Ajouté un **halo radial Indigo** (opacity 0.03) pour la profondeur, sans masquer le motif.
  - Couleurs **100% FV Palette** (Vintage Grape, Indigo, Thistle, Slate). Suppression totale des gris/noirs standards.
  - **CTA Principal ("Tester l’Oracle")** : Gradient Indigo (#4f1271) → Velvet (#783f8e), texte Thistle (#bfacc8), ombre portée violette.
  - **CTA Secondaire ("Explorer les Portails")** : Ghost button (transparent/light slate), bordure Indigo discrète.
  - **Spacing** : Réduit l'espace avant les boutons (`mt-8` vs `mt-10`).

- **`app/globals.css`** (inchangé, les variables FV étaient déjà là).

## 2. Vérification Visuelle
1.  **Background** : Tu dois voir le motif géométrique (hexagones) en fond, avec une légère teinte violette/indigo (halo).
2.  **Contrastes** :
    - Le bouton "Tester l’Oracle" doit être **très visible** (foncé/saturé) avec un texte clair.
    - Le bouton "Explorer" doit être **très discret** (ghost).
3.  **Texte** : Aucun texte n'est noir pur (`#000`) ou gris standard (`slate-600`). Tout est nuancé (Vintage Grape ou Indigo).

## 3. Prochaines étapes
- Lancer `npm run dev` pour valider le rendu en local.
- Vérifier le comportement responsive (stack vertical des boutons sur mobile).
