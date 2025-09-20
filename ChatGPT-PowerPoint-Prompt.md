# Prompt ChatGPT pour génération PowerPoint

## Instructions pour ChatGPT :

Je souhaite que tu génères un fichier PowerPoint (.pptx) professionnel à
partir des fichiers markdown modulaires que je vais t'attacher. La
présentation est organisée en slides individuelles avec leurs propres
dossiers d'images. Voici les spécifications détaillées :

### 📋 **Consignes générales :**

- **Format** : Fichier .pptx compatible PowerPoint/Google Slides
- **Structure** : Slides modulaires avec dossiers d'images dédiés
- **Versions disponibles** :
  - **5 minutes** : 6 slides (presentations/5min/)
  - **Complète** : 15 slides (presentations/complete/)
- **Style** : Professionnel, moderne, épuré
- **Thème** : Technologie blockchain/immobilier

### 📁 **Structure modulaire :**

Chaque slide est un fichier markdown individuel avec :

- **Contenu structuré** : Titre, images, texte, notes
- **Dossier images dédié** : `./images/slide-X/`
- **Chemins relatifs** : Toutes les images référencées localement
- **Notes de design** : Spécifications couleurs, layout, timing

### 🎨 **Design et mise en page :**

- **Palette de couleurs** :
  - Bleu professionnel (#1e40af, #3b82f6)
  - Gris moderne (#374151, #6b7280)
  - Blanc (#ffffff)
  - Accents orange/doré (#f59e0b) pour les highlights
- **Police** : Sans-serif moderne (Calibri, Arial, ou équivalent)
- **Style** : Minimaliste avec beaucoup d'espace blanc
- **Icons** : Utiliser des icônes modernes pour illustrer les points

### 📊 **Structure des slides :**

**Version 5 minutes (6 slides) :**

1. **SLIDE 1** - Page de titre : Logo, titre, contact
2. **SLIDE 2** - Problématique & Solution : Layout 2 colonnes avec flèche
3. **SLIDE 3** - Système commissions : Graphique 5%, tableau répartitions
4. **SLIDE 4** - Démonstration : Interface démo, call-to-action
5. **SLIDE 5** - Qualité & Roadmap : Colonnes Aujourd'hui/Demain
6. **SLIDE 6** - Conclusion : Citation, contact, QR code

**Version complète (15 slides) :**

- Slides 1-6 : Identiques à la version 5min mais plus détaillées
- Slides 7-15 : Architecture, intermédiaires, sacrifices, machine d'états,
  tests, avantages, roadmap complète

### 🖼️ **Gestion des images :**

- **Chemins relatifs** : `./images/slide-X/image-name.png`
- **Dossiers dédiés** : Chaque slide a son dossier d'images
- **Placeholders** : Si image manquante, créer placeholder approprié
- **Types requis** : Logos, icônes, graphiques, diagrammes, captures
  d'écran
- **Style cohérent** : Toutes les images suivent la palette de couleurs

### ⚡ **Éléments visuels spécifiques :**

- **Animations** : Transitions fluides entre slides (Fade/Push)
- **Graphiques** : Diagrammes pour les pourcentages de commission
- **Icônes** : Blockchain (🔗), Immobilier (🏠), Argent (💰), etc.
- **Mise en forme** : Texte en gras pour les points clés
- **Espacement** : Marges généreuses, pas de surcharge

### 📱 **Format de sortie :**

- **Ratio** : 16:9 (format standard présentation)
- **Résolution** : Haute définition
- **Compatibilité** : PowerPoint 2016+ / Google Slides
- **Taille** : Optimisée pour projection

### 🎯 **Points d'attention :**

- **Structure modulaire** : Traiter chaque slide-X.md comme une slide
  indépendante
- **Cohérence visuelle** : Maintenir le style à travers toutes les slides
- **Images manquantes** : Créer des placeholders professionnels si
  nécessaire
- **Préserver le contenu** : Respecter exactement le texte et les chiffres
  techniques
- **Timing** : Suivre les indications de durée dans les notes (5min vs
  complète)
- **Chemins d'images** : Convertir les chemins relatifs en images
  PowerPoint

### 📝 **Notes du présentateur :**

Chaque slide markdown contient :

- **Timing spécifique** pour la présentation orale
- **Notes de design** avec couleurs et layout
- **Images requises** avec descriptions détaillées
- **Points clés** à mentionner pendant la présentation

### 🔧 **Livrable attendu :**

- **Fichier unique** : Un .pptx avec toutes les slides assemblées
- **Images intégrées** : Toutes les images importées dans le PowerPoint
- **Notes de présentation** : Timing et points clés dans les notes speaker
- **Animations** : Transitions fluides et animations appropriées
- **Prêt à présenter** : Fichier directement utilisable pour présentation

---

**Note** : Les fichiers markdown ci-joints sont organisés en slides
modulaires. Chaque fichier slide-X.md correspond à une slide PowerPoint
avec son propre dossier d'images. Traiter l'ensemble comme une présentation
cohérente en respectant l'ordre numérique et la structure modulaire.

## 📋 **Instructions d'utilisation :**

1. **Attacher tous les fichiers** slide-X.md de la version souhaitée (5min
   ou complète)
2. **Mentionner la version** : "Utilise la version 5 minutes" ou "Utilise
   la version complète"
3. **Préciser si nécessaire** : Ajustements spécifiques ou préférences de
   design
4. ChatGPT assemblera automatiquement toutes les slides en un PowerPoint
   unifié
