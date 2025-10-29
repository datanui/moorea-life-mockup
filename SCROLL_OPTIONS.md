# Options de gestion du scroll des cartes Facebook

Ce document explique les différentes options disponibles pour gérer le scroll des cartes Facebook et comment basculer entre elles.

## 🎯 Problème

Par défaut, les cartes Facebook (iframes) sont scrollables. Lorsqu'on scroll la page et que la souris passe sur une carte, c'est la carte qui scroll au lieu de la page, ce qui peut être frustrant.

## ✅ Option 1 : Overlay cliquable (IMPLÉMENTÉE PAR DÉFAUT)

### Fonctionnement
- Un overlay transparent s'affiche au survol de chaque carte
- Message "Cliquer pour interagir" apparaît au hover
- Au clic sur la carte : l'overlay disparaît, la carte devient interactive
- Au clic ailleurs : tous les overlays réapparaissent

### Avantages
✓ Scroll de page fluide par défaut
✓ Interaction possible après un clic intentionnel
✓ Feedback visuel clair pour l'utilisateur
✓ Aucune perte de fonctionnalité

### Inconvénients
✗ Nécessite un clic supplémentaire pour interagir avec la carte

### Code
Déjà implémenté dans :
- `js/category.js` : fonction `setupCardOverlays()`
- `css/style.css` : classes `.fb-card-overlay` et `.fb-card-overlay-text`

---

## 🔄 Option 2 : Pointer-events désactivés

### Fonctionnement
- Les cartes Facebook ne sont pas interactives par défaut
- Elles deviennent interactives au clic
- Plus simple, sans overlay visuel

### Avantages
✓ Très simple à implémenter
✓ Scroll de page fluide
✓ Pas de CSS complexe

### Inconvénients
✗ Pas de feedback visuel
✗ L'utilisateur ne sait pas qu'il faut cliquer

### Comment activer cette option

1. **Dans `js/category.js`**, ligne 181, commentez :
```javascript
// setupCardOverlays();
```

2. **Ajoutez** à la place :
```javascript
disableCardScroll();
```

3. **Décommentez** la fonction `disableCardScroll()` (lignes 232-244)

---

## 📏 Option 3 : Limiter la hauteur des cartes

### Fonctionnement
- Réduit la hauteur maximale des cartes Facebook
- Les cartes ne deviennent pas scrollables
- Solution la plus simple

### Avantages
✓ Aucun JavaScript supplémentaire
✓ Pas de conflit de scroll
✓ Très simple

### Inconvénients
✗ Contenu Facebook limité/tronqué
✗ L'utilisateur ne voit pas tout

### Comment activer cette option

Dans `js/category.js`, ligne 161, modifiez :
```javascript
data-height="500"
```

En :
```javascript
data-height="300"
```

Vous pouvez aussi combiner avec Option 1 ou 2 si nécessaire.

---

## 🎨 Personnalisation de l'Option 1 (par défaut)

### Modifier le message de l'overlay

Dans `js/category.js`, lignes 146-151, changez :
```html
<div class="fb-card-overlay-text">
    <svg>...</svg>
    <p>Cliquer pour interagir</p>
</div>
```

### Changer la couleur de l'overlay

Dans `css/style.css`, ligne 316, modifiez :
```css
background: rgba(24, 119, 242, 0.05); /* Bleu Facebook transparent */
```

Exemples :
```css
background: rgba(0, 0, 0, 0.03);      /* Noir léger */
background: rgba(255, 255, 255, 0.8);  /* Blanc opaque */
```

### Toujours afficher l'overlay (pas seulement au hover)

Dans `css/style.css`, ligne 325, changez :
```css
opacity: 0;
```

En :
```css
opacity: 1;
```

Et supprimez les lignes 328-330 :
```css
.fb-card:hover .fb-card-overlay {
    opacity: 1;
}
```

### Changer l'animation

Dans `css/style.css`, lignes 348-350, modifiez :
```css
.fb-card:hover .fb-card-overlay-text {
    transform: scale(1.05); /* Zoom de 5% au hover */
}
```

---

## 🔧 Recommandation

**Option 1 (par défaut)** est recommandée car elle offre le meilleur compromis :
- Scroll de page fluide
- Interaction possible avec les cartes
- Feedback visuel clair
- Expérience utilisateur intuitive

Si vous préférez une solution plus minimaliste, utilisez **Option 3** (hauteur limitée à 300px).

---

## 🧪 Tests

Pour tester les différentes options :

1. Lancez le serveur local :
```bash
python3 -m http.server 8000
```

2. Ouvrez http://localhost:8000/category.html?cat=arts-culture-creationpareo

3. Testez le scroll :
   - Scrollez la page normalement
   - Survolez une carte (l'overlay devrait apparaître)
   - Cliquez sur une carte (l'overlay disparaît)
   - Scrollez la carte (elle devrait scroller)
   - Cliquez ailleurs (l'overlay réapparaît)

---

## 📝 Notes techniques

### Pourquoi on ne peut pas simplement désactiver le scroll ?

Les iframes Facebook sont **cross-origin**, ce qui signifie :
- On ne peut pas accéder à leur contenu JavaScript
- On ne peut pas capturer leurs événements internes
- On ne peut pas modifier leur scroll directement

Les solutions disponibles passent donc par :
1. Un overlay qui empêche l'interaction (Option 1)
2. Désactiver `pointer-events` sur l'iframe (Option 2)
3. Limiter la hauteur pour éviter le scroll (Option 3)

### Performance

Toutes les options ont une performance similaire :
- L'Option 1 ajoute un élément DOM par carte (~100 octets)
- L'Option 2 ajoute un style CSS dynamique (~50 octets)
- L'Option 3 ne change rien

L'impact est négligeable même avec 100+ cartes.
