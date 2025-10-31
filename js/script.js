// script.js - Gestion du menu et de la page d'accueil

document.addEventListener('DOMContentLoaded', function() {
    // Gestion du menu
    setupMenu();

    // Charger le menu
    loadMenu();
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
}

/**
 * Charge et affiche le menu
 */
async function loadMenu() {
    try {
        const categories = await getCategories();
        const menuContent = document.getElementById('menuContent');
        let html = '';

        for (const [cat1Name, cat1Data] of Object.entries(categories)) {
            html += `<div class="menu-category">
                <div class="menu-category-title">${cat1Name}</div>`;

            for (const [cat2Name, cat2Data] of Object.entries(cat1Data)) {
                // Vérifier s'il y a des sous-sous-catégories
                const hasSubSubCategories = Object.keys(cat2Data.subcategories).length > 0;

                // Si pas de sous-sous-catégories, rendre le titre cliquable
                if (!hasSubSubCategories && cat2Data.items.length > 0) {
                    const slug = generateSlug(cat1Name, cat2Name, '');
                    html += `<div class="menu-subcategory">
                        <a href="category.html?cat=${encodeURIComponent(slug)}" class="menu-subcategory-title clickable">${cat2Name}</a>`;
                } else {
                    html += `<div class="menu-subcategory">
                        <div class="menu-subcategory-title">${cat2Name}</div>`;
                }

                if (hasSubSubCategories) {
                    // Il y a des sous-sous-catégories
                    for (const cat3Name of Object.keys(cat2Data.subcategories)) {
                        const slug = generateSlug(cat1Name, cat2Name, cat3Name);
                        html += `<div class="menu-subsubcategory">
                            <a href="category.html?cat=${encodeURIComponent(slug)}" class="menu-subsubcategory-link">${cat3Name}</a>
                        </div>`;
                    }
                }

                html += `</div>`;
            }

            html += `</div>`;
        }

        menuContent.innerHTML = html;
    } catch (error) {
        console.error('Erreur lors du chargement du menu:', error);
    }
}
