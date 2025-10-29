// category.js - Gestion de l'affichage des pages de catégories

document.addEventListener('DOMContentLoaded', async function() {
    // Gestion du menu
    setupMenu();

    // Charger et afficher la catégorie
    await loadCategory();
});

/**
 * Configure le menu
 */
function setupMenu() {
    const menuBtn = document.getElementById('menuBtn');
    const closeMenuBtn = document.getElementById('closeMenuBtn');
    const sideMenu = document.getElementById('sideMenu');
    const menuOverlay = document.getElementById('menuOverlay');

    // Ouvrir le menu
    menuBtn.addEventListener('click', function() {
        sideMenu.classList.add('active');
        menuOverlay.classList.add('active');
    });

    // Fermer le menu
    function closeMenu() {
        sideMenu.classList.remove('active');
        menuOverlay.classList.remove('active');
    }

    closeMenuBtn.addEventListener('click', closeMenu);
    menuOverlay.addEventListener('click', closeMenu);

    // Charger le menu
    loadMenu();
}

/**
 * Charge et affiche le menu
 */
async function loadMenu() {
    const categories = await getCategories();
    const menuContent = document.getElementById('menuContent');
    let html = '';

    for (const [cat1Name, cat1Data] of Object.entries(categories)) {
        html += `<div class="menu-category">
            <div class="menu-category-title">${cat1Name}</div>`;

        for (const [cat2Name, cat2Data] of Object.entries(cat1Data)) {
            html += `<div class="menu-subcategory">
                <div class="menu-subcategory-title">${cat2Name}</div>`;

            // Vérifier s'il y a des sous-sous-catégories
            const hasSubSubCategories = Object.keys(cat2Data.subcategories).length > 0;

            if (hasSubSubCategories) {
                // Il y a des sous-sous-catégories
                for (const cat3Name of Object.keys(cat2Data.subcategories)) {
                    const slug = generateSlug(cat1Name, cat2Name, cat3Name);
                    html += `<div class="menu-subsubcategory">
                        <a href="category.html?cat=${encodeURIComponent(slug)}" class="menu-subsubcategory-link">${cat3Name}</a>
                    </div>`;
                }
            } else if (cat2Data.items.length > 0) {
                // Pas de sous-sous-catégories, lien direct à cat2
                const slug = generateSlug(cat1Name, cat2Name, '');
                html += `<div class="menu-subsubcategory">
                    <a href="category.html?cat=${encodeURIComponent(slug)}" class="menu-subsubcategory-link">Voir ${cat2Name}</a>
                </div>`;
            }

            html += `</div>`;
        }

        html += `</div>`;
    }

    menuContent.innerHTML = html;
}

/**
 * Charge et affiche la catégorie demandée
 */
async function loadCategory() {
    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get('cat');

    const loader = document.getElementById('loader');
    const container = document.getElementById('fbCardsContainer');
    const noResults = document.getElementById('noResults');
    const titleElement = document.getElementById('categoryTitle');
    const breadcrumbElement = document.getElementById('categoryBreadcrumb');

    if (!slug) {
        titleElement.textContent = 'Erreur';
        breadcrumbElement.textContent = 'Aucune catégorie spécifiée';
        loader.style.display = 'none';
        noResults.style.display = 'block';
        return;
    }

    try {
        // Charger les catégories
        const categories = await getCategories();

        // Parser le slug
        const parsedCats = parseSlug(slug, categories);

        if (!parsedCats) {
            titleElement.textContent = 'Catégorie introuvable';
            breadcrumbElement.textContent = 'La catégorie demandée n\'existe pas';
            loader.style.display = 'none';
            noResults.style.display = 'block';
            return;
        }

        // Récupérer les items
        const categoryData = await getCategoryItems(
            parsedCats.cat1,
            parsedCats.cat2,
            parsedCats.cat3
        );

        if (!categoryData || categoryData.items.length === 0) {
            titleElement.textContent = parsedCats.cat3 || parsedCats.cat2;
            breadcrumbElement.textContent = categoryData ? categoryData.breadcrumb : '';
            loader.style.display = 'none';
            noResults.style.display = 'block';
            return;
        }

        // Mettre à jour le titre et le breadcrumb
        titleElement.textContent = categoryData.title;
        breadcrumbElement.textContent = categoryData.breadcrumb;
        document.title = `${categoryData.title} - Moorea Life`;

        // Générer les cartes Facebook
        let html = '';
        categoryData.items.forEach((item, index) => {
            html += `
            <!-- Carte : ${item.nom} -->
            <div class="fb-card" data-card-index="${index}">
                <div class="fb-card-overlay">
                    <div class="fb-card-overlay-text">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M15 3h4a2 2 0 0 1 2 2v4m0 6v4a2 2 0 0 1-2 2h-4m-6 0H7a2 2 0 0 1-2-2v-4m0-6V7a2 2 0 0 1 2-2h4"/>
                        </svg>
                        <p>Cliquer pour interagir</p>
                    </div>
                </div>
                <div class="fb-feed">
                    <div class="fb-page"
                         data-href="${item.lien}"
                         data-tabs="timeline"
                         data-small-header="true"
                         data-hide-cover="true"
                         data-show-facepile="false"
                         data-adapt-container-width="true"
                         data-height="500">
                        <blockquote cite="${item.lien}" class="fb-xfbml-parse-ignore">
                            <a href="${item.lien}">${item.nom}</a>
                        </blockquote>
                    </div>
                </div>
            </div>
            `;
        });

        container.innerHTML = html;
        loader.style.display = 'none';
        container.style.display = 'grid';

        // Reparser les widgets Facebook
        if (window.FB) {
            window.FB.XFBML.parse();
        }

        // Setup des overlays pour gérer le scroll
        setupCardOverlays();

    } catch (error) {
        console.error('Erreur lors du chargement de la catégorie:', error);
        titleElement.textContent = 'Erreur';
        breadcrumbElement.textContent = 'Une erreur est survenue';
        loader.style.display = 'none';
        noResults.style.display = 'block';
    }
}

/**
 * OPTION 1 : Configure les overlays pour gérer le scroll des cartes
 * Au clic sur une carte, l'overlay disparaît et la carte devient interactive
 * Au clic ailleurs, tous les overlays réapparaissent
 */
function setupCardOverlays() {
    const cards = document.querySelectorAll('.fb-card');

    cards.forEach(card => {
        const overlay = card.querySelector('.fb-card-overlay');

        // Au clic sur l'overlay, le retirer pour permettre l'interaction
        overlay.addEventListener('click', function(e) {
            e.stopPropagation();

            // Réactiver tous les autres overlays
            document.querySelectorAll('.fb-card-overlay').forEach(o => {
                o.classList.remove('hidden');
            });

            // Cacher cet overlay
            overlay.classList.add('hidden');
        });
    });

    // Au clic ailleurs sur la page, réactiver tous les overlays
    document.addEventListener('click', function(e) {
        // Vérifier si le clic n'est pas sur une carte ou son overlay
        if (!e.target.closest('.fb-card')) {
            document.querySelectorAll('.fb-card-overlay').forEach(overlay => {
                overlay.classList.remove('hidden');
            });
        }
    });
}

/*
 * OPTION 2 (alternative) : Désactiver complètement le scroll des cartes
 * Décommentez cette fonction et commentez setupCardOverlays() ci-dessus
 *
function disableCardScroll() {
    const style = document.createElement('style');
    style.textContent = `
        .fb-feed iframe {
            pointer-events: auto !important;
            overflow: hidden !important;
        }
        .fb-card:hover {
            cursor: pointer;
        }
    `;
    document.head.appendChild(style);
}
*/

/*
 * OPTION 3 (alternative) : Limiter la hauteur des cartes
 * Modifiez data-height="500" à data-height="300" dans le code HTML ci-dessus
 * Cela réduit la hauteur des cartes pour éviter qu'elles soient scrollables
 */
