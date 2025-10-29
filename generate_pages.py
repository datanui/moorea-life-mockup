#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import csv
import os
import re
from collections import defaultdict

def sanitize_filename(text):
    """Convertit un texte en nom de fichier sécurisé"""
    # Remplacer les accents
    replacements = {
        'à': 'a', 'á': 'a', 'â': 'a', 'ã': 'a', 'ä': 'a', 'å': 'a',
        'è': 'e', 'é': 'e', 'ê': 'e', 'ë': 'e',
        'ì': 'i', 'í': 'i', 'î': 'i', 'ï': 'i',
        'ò': 'o', 'ó': 'o', 'ô': 'o', 'õ': 'o', 'ö': 'o',
        'ù': 'u', 'ú': 'u', 'û': 'u', 'ü': 'u',
        'ç': 'c', 'ñ': 'n',
        'À': 'A', 'Á': 'A', 'Â': 'A', 'Ã': 'A', 'Ä': 'A', 'Å': 'A',
        'È': 'E', 'É': 'E', 'Ê': 'E', 'Ë': 'E',
        'Ì': 'I', 'Í': 'I', 'Î': 'I', 'Ï': 'I',
        'Ò': 'O', 'Ó': 'O', 'Ô': 'O', 'Õ': 'O', 'Ö': 'O',
        'Ù': 'U', 'Ú': 'U', 'Û': 'U', 'Ü': 'U',
        'Ç': 'C', 'Ñ': 'N'
    }

    text = text.lower()
    for old, new in replacements.items():
        text = text.replace(old.lower(), new)

    # Garder seulement les lettres, chiffres et espaces
    text = re.sub(r'[^a-z0-9\s]', '', text)
    # Remplacer les espaces par des tirets
    text = re.sub(r'\s+', '-', text)
    # Supprimer les tirets multiples
    text = re.sub(r'-+', '-', text)
    # Supprimer les tirets au début et à la fin
    text = text.strip('-')

    return text

def normalize_fb_url(url):
    """Normalise les URLs Facebook"""
    if not url:
        return ''

    url = url.strip()

    # Ajouter https:// si manquant
    if not url.startswith('http'):
        if url.startswith('facebook.com') or url.startswith('www.facebook.com'):
            url = 'https://' + url
        elif url.startswith('fb.me'):
            url = 'https://' + url
        else:
            url = 'https://www.facebook.com/' + url

    return url

def read_csv_data(filename):
    """Lit le fichier CSV et organise les données par catégories"""
    categories = defaultdict(lambda: defaultdict(lambda: defaultdict(list)))

    # Essayer différents encodages
    encodings = ['utf-8', 'latin-1', 'windows-1252', 'iso-8859-1']
    f = None
    for encoding in encodings:
        try:
            f = open(filename, 'r', encoding=encoding)
            # Essayer de lire une ligne pour vérifier l'encodage
            f.readline()
            f.seek(0)
            break
        except UnicodeDecodeError:
            if f:
                f.close()
            continue

    if f is None:
        raise Exception("Impossible de lire le fichier avec les encodages disponibles")

    with f:
        reader = csv.DictReader(f, delimiter=';')

        for row in reader:
            cat1 = row.get('Categorie1', '').strip()
            cat2 = row.get('Categorie2', '').strip()
            cat3 = row.get('Categorie3', '').strip()
            nom = row.get('Nom', '').strip()
            lien = row.get('Lien', '').strip()

            if not cat1:
                continue

            # Si on a un nom et un lien
            if nom and lien:
                lien = normalize_fb_url(lien)

                if cat3:
                    # Il y a une sous-sous-catégorie
                    categories[cat1][cat2][cat3].append({'nom': nom, 'lien': lien})
                elif cat2:
                    # Pas de cat3, ajouter à cat2 directement
                    categories[cat1][cat2]['_items'].append({'nom': nom, 'lien': lien})

    return categories

def create_page_html(cat1, cat2, cat3, items):
    """Crée le HTML pour une page de catégorie"""

    # Titre de la page
    if cat3:
        title = cat3
        breadcrumb = f"{cat1} > {cat2} > {cat3}"
    else:
        title = cat2
        breadcrumb = f"{cat1} > {cat2}"

    html = f'''<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title} - Moorea Life</title>
    <link rel="stylesheet" href="../css/style.css">

    <!-- SDK Facebook : inclure une seule fois par page -->
    <div id="fb-root"></div>
    <script async defer crossorigin="anonymous"
            src="https://connect.facebook.net/fr_FR/sdk.js#xfbml=1&version=v19.0"></script>
</head>
<body>
    <!-- Bouton Menu -->
    <button id="menuBtn" class="menu-btn">☰ Menu</button>

    <!-- Menu latéral -->
    <nav id="sideMenu" class="side-menu">
        <div class="menu-header">
            <h2>Catégories</h2>
            <button id="closeMenuBtn" class="close-btn">&times;</button>
        </div>
        <div id="menuContent" class="menu-content">
            <!-- Le menu sera généré par JavaScript -->
        </div>
    </nav>

    <!-- Overlay pour fermer le menu en cliquant à côté -->
    <div id="menuOverlay" class="menu-overlay"></div>

    <div class="container">
        <!-- En-tête de catégorie -->
        <div class="category-header">
            <h1 class="category-title">{title}</h1>
            <p class="category-breadcrumb">{breadcrumb}</p>
            <a href="../index.html" style="color: #1877f2; text-decoration: none;">← Retour à l'accueil</a>
        </div>

        <!-- Conteneur des cartes Facebook -->
        <div class="fb-cards-container">
'''

    # Ajouter chaque item
    for item in items:
        nom = item['nom']
        lien = item['lien']

        html += f'''            <!-- Carte : {nom} -->
            <div class="fb-card">
                <div class="fb-feed">
                    <div class="fb-page"
                         data-href="{lien}"
                         data-tabs="timeline"
                         data-small-header="true"
                         data-hide-cover="true"
                         data-show-facepile="false"
                         data-adapt-container-width="true"
                         data-height="500">
                        <blockquote cite="{lien}" class="fb-xfbml-parse-ignore">
                            <a href="{lien}">{nom}</a>
                        </blockquote>
                    </div>
                </div>
            </div>

'''

    html += '''        </div>
    </div>

    <footer class="footer">
        <p>&copy; 2024 Moorea Life - Annuaire local</p>
    </footer>

    <script src="../js/script.js"></script>
</body>
</html>
'''

    return html

def generate_pages(categories, output_dir='pages'):
    """Génère toutes les pages HTML"""

    # Créer le dossier de sortie s'il n'existe pas
    os.makedirs(output_dir, exist_ok=True)

    pages_created = 0

    for cat1, cat1_data in categories.items():
        for cat2, cat2_data in cat1_data.items():

            # Vérifier s'il y a des sous-sous-catégories
            has_subsubcategories = any(key != '_items' for key in cat2_data.keys())

            if has_subsubcategories:
                # Générer une page pour chaque sous-sous-catégorie
                for cat3, items in cat2_data.items():
                    if cat3 == '_items' or not items:
                        continue

                    # Générer le nom de fichier
                    filename = sanitize_filename(f"{cat1}-{cat2}-{cat3}") + '.html'
                    filepath = os.path.join(output_dir, filename)

                    # Créer le HTML
                    html = create_page_html(cat1, cat2, cat3, items)

                    # Écrire le fichier
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(html)

                    pages_created += 1
                    print(f"Créé: {filepath}")

            else:
                # Pas de sous-sous-catégories, créer une page pour cat2
                items = cat2_data.get('_items', [])
                if items:
                    # Générer le nom de fichier
                    filename = sanitize_filename(f"{cat1}-{cat2}") + '.html'
                    filepath = os.path.join(output_dir, filename)

                    # Créer le HTML
                    html = create_page_html(cat1, cat2, '', items)

                    # Écrire le fichier
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(html)

                    pages_created += 1
                    print(f"Créé: {filepath}")

    return pages_created

if __name__ == '__main__':
    print("Génération des pages de catégories...")

    # Lire les données du CSV
    categories = read_csv_data('moorealife.csv')

    # Générer les pages
    pages_count = generate_pages(categories)

    print(f"\n✓ {pages_count} pages ont été générées avec succès!")
