# Moorea Life - Annuaire Web Mockup

Un annuaire web moderne et responsive basé sur des liens Facebook, organisé par catégories hiérarchiques.

## 🌟 Caractéristiques

- **100% local** - Toutes les entreprises et services de Moorea
- **100% à jour** - Intégration directe avec les pages Facebook
- **100% gratuit** - Accessible à tous
- **100% solidaire** - Soutien à l'économie locale
- **100% collaboratif** - Contribution communautaire

## 📁 Structure du projet

```
moorea-life-mockup/
├── index.html              # Page d'accueil
├── moorealife.jpg          # Image d'en-tête
├── moorealife.csv          # Base de données des liens
├── generate_pages.py       # Script pour générer les pages
├── css/
│   └── style.css          # Feuille de style
├── js/
│   └── script.js          # Menu et navigation
└── pages/                 # Pages de catégories générées
    ├── arts-culture-creationbijoutiers.html
    ├── arts-culture-creationpareo.html
    └── arts-culture-creationtatoueur.html
```

## 🚀 Utilisation

### Générer les pages de catégories

Pour générer ou régénérer les pages de catégories à partir du fichier CSV :

```bash
python3 generate_pages.py
```

### Ouvrir le site

Ouvrez simplement `index.html` dans votre navigateur web.

**Note :** Pour que les widgets Facebook fonctionnent correctement, il est recommandé de servir le site via un serveur web local :

```bash
# Avec Python 3
python3 -m http.server 8000

# Puis ouvrez http://localhost:8000 dans votre navigateur
```

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
- **Lien** : URL de la page Facebook

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

1. Ajoutez des lignes dans `moorealife.csv`
2. Exécutez `python3 generate_pages.py` pour régénérer les pages

### Modifier les couleurs

Éditez `css/style.css` et modifiez les variables de couleur :

```css
/* Couleur principale Facebook : #1877f2 */
background-color: #1877f2;
```

## 🔧 Technologies utilisées

- **HTML5** - Structure des pages
- **CSS3** - Mise en page responsive avec Grid et Flexbox
- **JavaScript** - Menu interactif et navigation
- **Facebook SDK** - Intégration des widgets Facebook
- **Python 3** - Génération automatique des pages

## 📱 Responsive Design

Le site est entièrement responsive et s'adapte aux différentes tailles d'écran :

- **Desktop** : Événements sur 4 colonnes
- **Tablette** : Événements sur 2 colonnes
- **Mobile** : Événements sur 1 colonne

## 🤝 Contribution

Pour ajouter ou modifier des entrées :

1. Modifiez le fichier `moorealife.csv`
2. Régénérez les pages : `python3 generate_pages.py`
3. Testez les changements

## 📄 Licence

Ce projet est un mockup pour l'annuaire Moorea Life.

---

**Moorea Life** - Votre annuaire local 100% solidaire et collaboratif
