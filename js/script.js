// Gestion du menu
document.addEventListener('DOMContentLoaded', function() {
    const menuBtn = document.getElementById('menuBtn');
    const closeMenuBtn = document.getElementById('closeMenuBtn');
    const sideMenu = document.getElementById('sideMenu');
    const menuOverlay = document.getElementById('menuOverlay');
    const menuContent = document.getElementById('menuContent');

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

    // Charger et construire le menu depuis le CSV
    loadMenu();
});

async function loadMenu() {
    try {
        const response = await fetch('moorealife.csv');
        const csvText = await response.text();
        const categories = parseCSV(csvText);
        buildMenu(categories);
    } catch (error) {
        console.error('Erreur lors du chargement du menu:', error);
    }
}

function parseCSV(csvText) {
    const lines = csvText.split('\n');
    const categories = {};

    // Ignorer la première ligne (en-tête)
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const parts = line.split(';');
        if (parts.length < 5) continue;

        const cat1 = parts[0].trim();
        const cat2 = parts[1].trim();
        const cat3 = parts[2].trim();
        const nom = parts[3].trim();
        const lien = parts[4].trim();

        if (!cat1) continue;

        // Initialiser la catégorie 1 si nécessaire
        if (!categories[cat1]) {
            categories[cat1] = {};
        }

        // Si cat2 existe
        if (cat2) {
            if (!categories[cat1][cat2]) {
                categories[cat1][cat2] = {};
            }

            // Si cat3 existe
            if (cat3) {
                if (!categories[cat1][cat2][cat3]) {
                    categories[cat1][cat2][cat3] = [];
                }

                // Ajouter le lien si nom et lien existent
                if (nom && lien) {
                    categories[cat1][cat2][cat3].push({ nom, lien });
                }
            } else if (nom && lien) {
                // Pas de cat3, ajouter directement à cat2
                if (!Array.isArray(categories[cat1][cat2])) {
                    categories[cat1][cat2] = [];
                }
                categories[cat1][cat2].push({ nom, lien });
            }
        }
    }

    return categories;
}

function buildMenu(categories) {
    const menuContent = document.getElementById('menuContent');
    let html = '';

    for (const [cat1Name, cat1Data] of Object.entries(categories)) {
        html += `<div class="menu-category">
            <div class="menu-category-title">${cat1Name}</div>`;

        for (const [cat2Name, cat2Data] of Object.entries(cat1Data)) {
            html += `<div class="menu-subcategory">
                <div class="menu-subcategory-title">${cat2Name}</div>`;

            // Vérifier si cat2Data contient des sous-sous-catégories ou des liens directs
            let hasSubSubCategories = false;
            for (const key in cat2Data) {
                if (typeof cat2Data[key] === 'object' && !Array.isArray(cat2Data[key])) {
                    hasSubSubCategories = true;
                    break;
                }
            }

            if (hasSubSubCategories) {
                // Il y a des sous-sous-catégories
                for (const [cat3Name, cat3Data] of Object.entries(cat2Data)) {
                    if (Array.isArray(cat3Data) && cat3Data.length > 0) {
                        const pageUrl = generatePageUrl(cat1Name, cat2Name, cat3Name);
                        html += `<div class="menu-subsubcategory">
                            <a href="${pageUrl}" class="menu-subsubcategory-link">${cat3Name}</a>
                        </div>`;
                    }
                }
            } else if (Array.isArray(cat2Data) && cat2Data.length > 0) {
                // Pas de sous-sous-catégories, lien direct à cat2
                const pageUrl = generatePageUrl(cat1Name, cat2Name, '');
                html += `<div class="menu-subsubcategory">
                    <a href="${pageUrl}" class="menu-subsubcategory-link">Voir ${cat2Name}</a>
                </div>`;
            }

            html += `</div>`;
        }

        html += `</div>`;
    }

    menuContent.innerHTML = html;
}

function generatePageUrl(cat1, cat2, cat3) {
    // Créer un nom de fichier sécurisé
    const safeName = cat3 ? `${cat1}-${cat2}-${cat3}` : `${cat1}-${cat2}`;
    const filename = safeName
        .toLowerCase()
        .replace(/[àáâãäå]/g, 'a')
        .replace(/[èéêë]/g, 'e')
        .replace(/[ìíîï]/g, 'i')
        .replace(/[òóôõö]/g, 'o')
        .replace(/[ùúûü]/g, 'u')
        .replace(/[ç]/g, 'c')
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

    return `pages/${filename}.html`;
}
