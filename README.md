# Moorea Life - Annuaire Web

Un annuaire web moderne et responsive basé sur des liens Facebook, organisé par catégories hiérarchiques.

## 🌟 Caractéristiques

- **100% local** - Toutes les entreprises et services de Moorea
- **100% à jour** - Intégration directe avec les pages Facebook
- **100% gratuit** - Accessible à tous
- **100% solidaire** - Soutien à l'économie locale
- **100% collaboratif** - Contribution communautaire
- **Compatible GitHub Pages** - Génération dynamique en JavaScript

## 📁 Structure du projet

```
moorea-life-mockup/
├── index.html              # Page d'accueil
├── category.html           # Template pour les pages de catégories
├── moorealife.jpg          # Image d'en-tête
├── moorealife.csv          # Base de données des liens
├── css/
│   └── style.css          # Feuille de style
├── js/
│   ├── data.js            # Parsing CSV et gestion des données
│   ├── script.js          # Menu et page d'accueil
│   └── category.js        # Affichage des pages de catégories
└── pages/                 # Dossier (vide, pour compatibilité future)
```

## 🚀 Utilisation

### Ouvrir le site localement

Pour tester le site en local avec les widgets Facebook, utilisez un serveur web local :

```bash
# Avec Python 3
python3 -m http.server 8000

# Puis ouvrez http://localhost:8000 dans votre navigateur
```

**Important :** Les widgets Facebook nécessitent que le site soit servi via HTTP/HTTPS (pas en `file://`).

### Déployer sur GitHub Pages

1. **Créer un dépôt GitHub** et pousser le code
2. **Activer GitHub Pages** dans les paramètres du dépôt :
   - Aller dans Settings > Pages
   - Source : Deploy from a branch
   - Branch : main (ou master) / root
   - Sauvegarder

3. Le site sera accessible à : `https://[votre-username].github.io/[nom-du-repo]/`

**Aucune configuration supplémentaire n'est nécessaire !** Le site génère les pages dynamiquement en JavaScript côté client.

## 📝 Format du fichier CSV

Le fichier `moorealife.csv` utilise le format suivant :

```csv
Categorie1;Categorie2;Categorie3;Nom;Lien
ARTS, CULTURE & CRÉATION;Bijoutiers;;Aimeho Bijoux;facebook.com/feliandcie
ARTS, CULTURE & CRÉATION;Paréo;;Paréo Mana;https://www.facebook.com/Pareomana
```

### Colonnes :

- **Categorie1** : Catégorie principale (ex: ARTS, CULTURE & CRÉATION)
- **Categorie2** : Sous-catégorie (ex: Bijoutiers)
- **Categorie3** : Sous-sous-catégorie (optionnel)
- **Nom** : Nom de l'établissement/page
- **Lien** : URL de la page Facebook (formats acceptés : URL complète, facebook.com/page, ou juste le nom de la page)

### Logique de navigation :

- Si `Categorie3` existe → la page affiche les liens de cette sous-sous-catégorie
- Si `Categorie3` est vide → la page affiche les liens de la sous-catégorie (Categorie2)

## 🎨 Sections de la page d'accueil

1. **En-tête** : Image Moorea Life + titre + sous-titre
2. **Prochain ferry** : Horaires des ferries Moorea ↔ Papeete
3. **Événements** : 5 événements Facebook récents (affichage sur 4 colonnes)
4. **À la Une** : 4 posts Facebook mis en avant
5. **Sponsors** : Section vide (à venir)
6. **Infos pratiques** : Section vide (à venir)

## 🛠️ Personnalisation

### Modifier les événements

Éditez `index.html` et changez les URLs dans la section "Événements" :

```html
<div class="fb-post"
     data-href="https://fb.me/e/VOTRE_EVENEMENT"
     ...>
```

### Modifier les posts "À la Une"

Éditez `index.html` et changez les URLs dans la section "À la Une" :

```html
<div class="fb-post"
     data-href="https://www.facebook.com/groups/VOTRE_POST"
     ...>
```

### Ajouter des entrées dans l'annuaire

1. Ajoutez simplement des lignes dans `moorealife.csv`
2. Le site générera automatiquement le menu et les pages correspondantes

**Aucun script à exécuter !** Tout est géré en JavaScript côté client.

### Modifier les couleurs

Éditez `css/style.css` et modifiez les variables de couleur :

```css
/* Couleur principale Facebook : #1877f2 */
background-color: #1877f2;
```

## 🔧 Technologies utilisées

- **HTML5** - Structure des pages
- **CSS3** - Mise en page responsive avec Grid et Flexbox
- **JavaScript Vanilla** - Génération dynamique et navigation
- **Facebook SDK** - Intégration des widgets Facebook
- **GitHub Pages** - Hébergement statique gratuit

## 📱 Responsive Design

Le site est entièrement responsive et s'adapte aux différentes tailles d'écran :

- **Desktop** : Événements sur 4 colonnes
- **Tablette** : Événements sur 2 colonnes
- **Mobile** : Événements sur 1 colonne

## ⚙️ Comment ça fonctionne

### Architecture JavaScript

1. **data.js** :
   - Charge et parse le fichier CSV
   - Crée une structure de données hiérarchique en mémoire
   - Met en cache les données pour éviter de recharger le CSV

2. **script.js** (page d'accueil) :
   - Génère le menu latéral à partir des catégories
   - Gère l'ouverture/fermeture du menu

3. **category.js** (pages de catégories) :
   - Lit les paramètres d'URL (`?cat=...`)
   - Récupère les items de la catégorie demandée
   - Génère les cartes Facebook dynamiquement

### Routing

Les URLs utilisent des query parameters :
- `category.html?cat=arts-culture-creationbijoutiers`
- Les slugs sont générés automatiquement à partir des noms de catégories

## 🤝 Contribution

Pour ajouter ou modifier des entrées :

1. **Éditez** le fichier `moorealife.csv`
2. **Committez** et **poussez** les changements
3. GitHub Pages mettra automatiquement à jour le site

C'est tout ! Pas de build, pas de génération, tout est dynamique.

## 📦 Fichiers optionnels

- `generate_pages.py` : Script Python historique, conservé pour référence mais **non nécessaire**
- `pages/*.html` : Anciennes pages générées, **non utilisées** dans la version actuelle

## 🌐 Hébergement et performance

### GitHub Pages

- Hébergement gratuit et illimité
- HTTPS automatique
- CDN global pour des performances optimales
- Mise à jour automatique à chaque push

### Chargement des données

- Le CSV est chargé une seule fois et mis en cache
- Les widgets Facebook sont chargés en lazy-loading
- Performance optimale même avec des centaines d'entrées

## 📄 Licence

Ce projet est un mockup pour l'annuaire Moorea Life.

---

**Moorea Life** - Votre annuaire local 100% solidaire et collaboratif
