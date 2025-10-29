// data.js - Gestion des données CSV et parsing

// Cache pour éviter de charger plusieurs fois le CSV
let cachedCategories = null;
let cachedCSVData = null;

/**
 * Charge et parse le fichier CSV
 */
async function loadCSVData() {
    if (cachedCSVData) {
        return cachedCSVData;
    }

    try {
        const response = await fetch('moorealife.csv');
        // Force l'encodage UTF-8 pour les caractères accentués
        const buffer = await response.arrayBuffer();
        const decoder = new TextDecoder('utf-8');
        const csvText = decoder.decode(buffer);
        cachedCSVData = parseCSV(csvText);
        return cachedCSVData;
    } catch (error) {
        console.error('Erreur lors du chargement du CSV:', error);
        return [];
    }
}

/**
 * Parse le CSV et retourne un tableau d'objets
 */
function parseCSV(csvText) {
    const lines = csvText.split('\n');
    const data = [];

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

        if (cat1 && nom && lien) {
            data.push({
                categorie1: cat1,
                categorie2: cat2,
                categorie3: cat3,
                nom: nom,
                lien: normalizeFBUrl(lien)
            });
        }
    }

    return data;
}

/**
 * Normalise les URLs Facebook
 */
function normalizeFBUrl(url) {
    if (!url) return '';

    url = url.trim();

    // Ajouter https:// si manquant
    if (!url.startsWith('http')) {
        if (url.startsWith('facebook.com') || url.startsWith('www.facebook.com')) {
            url = 'https://' + url;
        } else if (url.startsWith('fb.me')) {
            url = 'https://' + url;
        } else {
            url = 'https://www.facebook.com/' + url;
        }
    }

    return url;
}

/**
 * Organise les données CSV en structure hiérarchique
 */
async function getCategories() {
    if (cachedCategories) {
        return cachedCategories;
    }

    const data = await loadCSVData();
    const categories = {};

    data.forEach(item => {
        const cat1 = item.categorie1;
        const cat2 = item.categorie2;
        const cat3 = item.categorie3;

        // Initialiser la catégorie 1 si nécessaire
        if (!categories[cat1]) {
            categories[cat1] = {};
        }

        // Si cat2 existe
        if (cat2) {
            if (!categories[cat1][cat2]) {
                categories[cat1][cat2] = {
                    subcategories: {},
                    items: []
                };
            }

            // Si cat3 existe
            if (cat3) {
                if (!categories[cat1][cat2].subcategories[cat3]) {
                    categories[cat1][cat2].subcategories[cat3] = [];
                }
                categories[cat1][cat2].subcategories[cat3].push({
                    nom: item.nom,
                    lien: item.lien
                });
            } else {
                // Pas de cat3, ajouter directement à cat2
                categories[cat1][cat2].items.push({
                    nom: item.nom,
                    lien: item.lien
                });
            }
        }
    });

    cachedCategories = categories;
    return categories;
}

/**
 * Récupère les items d'une catégorie spécifique
 */
async function getCategoryItems(cat1, cat2, cat3) {
    const categories = await getCategories();

    if (!categories[cat1]) {
        return null;
    }

    if (!categories[cat1][cat2]) {
        return null;
    }

    if (cat3) {
        // Retourner les items de la sous-sous-catégorie
        return {
            title: cat3,
            breadcrumb: `${cat1} > ${cat2} > ${cat3}`,
            items: categories[cat1][cat2].subcategories[cat3] || []
        };
    } else {
        // Retourner les items de la sous-catégorie
        return {
            title: cat2,
            breadcrumb: `${cat1} > ${cat2}`,
            items: categories[cat1][cat2].items || []
        };
    }
}

/**
 * Génère un slug pour les URLs
 */
function generateSlug(cat1, cat2, cat3) {
    const parts = [cat1, cat2];
    if (cat3) parts.push(cat3);

    return parts
        .join('-')
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
}

/**
 * Parse le slug pour récupérer les catégories
 */
function parseSlug(slug, categories) {
    // On va essayer de matcher le slug avec les catégories existantes
    // C'est un peu brute force mais efficace pour un petit annuaire

    for (const [cat1, cat1Data] of Object.entries(categories)) {
        for (const [cat2, cat2Data] of Object.entries(cat1Data)) {
            // Vérifier avec cat3
            for (const cat3 of Object.keys(cat2Data.subcategories)) {
                const testSlug = generateSlug(cat1, cat2, cat3);
                if (testSlug === slug) {
                    return { cat1, cat2, cat3 };
                }
            }

            // Vérifier sans cat3
            const testSlug = generateSlug(cat1, cat2, '');
            if (testSlug === slug) {
                return { cat1, cat2, cat3: '' };
            }
        }
    }

    return null;
}
