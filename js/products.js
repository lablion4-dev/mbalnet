// Products JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize products page
    initializeProducts();

    // Search and filters
    initializeProductSearchAndFilters();

    // Product actions
    initializeProductActions();

    // Category navigation
    initializeCategoryNavigation();

    // Quick actions
    initializeQuickActions();
});

// Initialize products page
function initializeProducts() {
    loadProducts();
    loadCategories();
    updateProductStats();

    // Refresh products every 5 minutes
    setInterval(loadProducts, 300000);
}

// Load products from API
function loadProducts() {
    // Show loading state
    showProductsLoading();

    // Simulate API call
    setTimeout(() => {
        const products = generateMockProducts();
        renderProducts(products);

        // Hide loading state
        hideProductsLoading();
    }, 1000);
}

// Show loading state
function showProductsLoading() {
    const loadingElement = document.getElementById('products-loading');
    if (loadingElement) {
        loadingElement.style.display = 'flex';
    }
}

// Hide loading state
function hideProductsLoading() {
    const loadingElement = document.getElementById('products-loading');
    if (loadingElement) {
        loadingElement.style.display = 'none';
    }
}

// Generate mock products
function generateMockProducts() {
    const categories = ['farines', 'cereales', 'epices', 'produits-transformes', 'produits-bruts'];
    const statuses = ['available', 'low-stock', 'out-of-stock', 'discontinued'];
    const origins = ['Cameroun', 'Afrique de l\'Ouest', 'Afrique Centrale'];

    const products = [];

    for (let i = 1; i <= 100; i++) {
        const category = categories[Math.floor(Math.random() * categories.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const origin = origins[Math.floor(Math.random() * origins.length)];

        products.push({
            id: i,
            name: generateProductName(category),
            category: category,
            description: generateProductDescription(category),
            price: Math.floor(Math.random() * 5000) + 500,
            currency: 'XAF',
            unit: 'kg',
            minOrder: Math.floor(Math.random() * 50) + 10,
            stock: Math.floor(Math.random() * 1000) + 100,
            status: status,
            origin: origin,
            region: generateRegion(origin),
            certification: Math.random() > 0.5 ? 'Bio' : 'Standard',
            image: `images/products/product-${i}.jpg`,
            tags: generateProductTags(category),
            rating: Math.floor(Math.random() * 5) + 1,
            reviews: Math.floor(Math.random() * 50),
            featured: Math.random() > 0.8,
            exportReady: Math.random() > 0.3,
            createdAt: generateTimestamp(),
            updatedAt: generateTimestamp()
        });
    }

    return products;
}

// Generate product name based on category
function generateProductName(category) {
    const names = {
        farines: [
            'Farine de Manioc Extra',
            'Farine de Maïs Blanc',
            'Farine de Sorgho Rouge',
            'Farine de Plantain',
            'Farine de Blé Complet'
        ],
        cereales: [
            'Riz Local Parfumé',
            'Maïs Grain Jaune',
            'Sorgho Blanc',
            'Millet Doré',
            'Quinoa Africain'
        ],
        epices: [
            'Poivre Noir de Guinée',
            'Gingembre Frais',
            'Curcuma en Poudre',
            'Piment Fort Camerounais',
            'Clou de Girofle'
        ],
        'produits-transformes': [
            'Huile de Palme Raffinée',
            'Beurre de Karité',
            'Chocolat Local',
            'Confiture d\'Ananas',
            'Pâte d\'Arachide'
        ],
        'produits-bruts': [
            'Cacao en Fèves',
            'Café Arabica Vert',
            'Arachides Non Décortiquées',
            'Noix de Cajou',
            'Bananes Plantains'
        ]
    };

    return names[category][Math.floor(Math.random() * names[category].length)];
}

// Generate product description
function generateProductDescription(category) {
    const descriptions = {
        farines: 'Farine de haute qualité, idéale pour la cuisine traditionnelle africaine et internationale.',
        cereales: 'Céréale locale cultivée selon les méthodes traditionnelles, riche en nutriments.',
        epices: 'Épice authentique d\'Afrique, parfaite pour relever vos plats et donner du goût.',
        'produits-transformes': 'Produit transformé localement, respectant les normes de qualité et d\'hygiène.',
        'produits-bruts': 'Produit brut de qualité supérieure, prêt pour la transformation ou l\'export.'
    };

    return descriptions[category];
}

// Generate region based on origin
function generateRegion(origin) {
    const regions = {
        'Cameroun': ['Centre', 'Littoral', 'Ouest', 'Nord-Ouest', 'Sud-Ouest'],
        'Afrique de l\'Ouest': ['Côte d\'Ivoire', 'Ghana', 'Sénégal', 'Mali', 'Burkina Faso'],
        'Afrique Centrale': ['Gabon', 'Congo', 'Tchad', 'Centrafrique', 'Guinée Équatoriale']
    };

    const regionList = regions[origin] || regions['Cameroun'];
    return regionList[Math.floor(Math.random() * regionList.length)];
}

// Generate product tags
function generateProductTags(category) {
    const tagMap = {
        farines: ['farine', 'cuisine', 'traditionnel', 'bio'],
        cereales: ['céréale', 'nutrition', 'local', 'sain'],
        epices: ['épice', 'saveur', 'culinaire', 'naturel'],
        'produits-transformes': ['transformé', 'prêt', 'qualité', 'local'],
        'produits-bruts': ['brut', 'frais', 'nature', 'export']
    };

    return tagMap[category] || [];
}

// Render products
function renderProducts(products) {
    const productsGrid = document.getElementById('products-grid');

    // Clear existing content
    productsGrid.innerHTML = '';

    products.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });

    // Update product count
    updateProductCount(products.length);
}

// Create product card
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = `product-card ${product.status}`;
    card.dataset.productId = product.id;

    const statusClass = `status-${product.status}`;
    const statusLabel = getStatusLabel(product.status);
    const ratingStars = generateRatingStars(product.rating);

    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}" loading="lazy">
            ${product.featured ? '<span class="badge-featured">⭐ Produit vedette</span>' : ''}
            <span class="badge-status ${statusClass}">${statusLabel}</span>
            ${product.exportReady ? '<span class="badge-export">✈️ Export</span>' : ''}
        </div>
        <div class="product-info">
            <div class="product-category">${getCategoryLabel(product.category)}</div>
            <h3 class="product-name">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-details">
                <div class="product-origin">
                    <i class="fas fa-map-marker-alt"></i>
                    ${product.origin} - ${product.region}
                </div>
                <div class="product-rating">
                    ${ratingStars}
                    <span class="rating-count">(${product.reviews})</span>
                </div>
            </div>
            <div class="product-price">
                <span class="price">${product.price.toLocaleString()} ${product.currency}</span>
                <span class="unit">/ ${product.unit}</span>
            </div>
            <div class="product-stock">
                Stock: ${product.stock} ${product.unit} (Min: ${product.minOrder} ${product.unit})
            </div>
            <div class="product-actions">
                <button class="btn-primary btn-quote" data-action="quote" data-product-id="${product.id}">
                    <i class="fas fa-calculator"></i>
                    Demander devis
                </button>
                <button class="btn-secondary btn-details" data-action="details" data-product-id="${product.id}">
                    <i class="fas fa-info-circle"></i>
                    Détails
                </button>
            </div>
        </div>
    `;

    // Add event listeners
    card.addEventListener('click', (e) => {
        if (!e.target.closest('.btn-quote') && !e.target.closest('.btn-details')) {
            viewProductDetails(product.id);
        }
    });

    return card;
}

// Get category label
function getCategoryLabel(category) {
    const labels = {
        farines: 'Farines',
        cereales: 'Céréales',
        epices: 'Épices & Condiments',
        'produits-transformes': 'Produits Transformés',
        'produits-bruts': 'Produits Bruts'
    };

    return labels[category] || category;
}

// Get status label
function getStatusLabel(status) {
    const labels = {
        available: 'Disponible',
        'low-stock': 'Stock faible',
        'out-of-stock': 'Rupture',
        discontinued: 'Discontinué'
    };

    return labels[status] || status;
}

// Generate rating stars
function generateRatingStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += `<i class="fas fa-star ${i <= rating ? 'filled' : ''}"></i>`;
    }
    return stars;
}

// Update product count
function updateProductCount(count) {
    const countElement = document.getElementById('products-count');
    if (countElement) {
        countElement.textContent = count;
    }
}

// Load categories
function loadCategories() {
    const categories = [
        { id: 'all', name: 'Tous les produits', count: 100 },
        { id: 'farines', name: 'Farines', count: 25 },
        { id: 'cereales', name: 'Céréales', count: 20 },
        { id: 'epices', name: 'Épices & Condiments', count: 15 },
        { id: 'produits-transformes', name: 'Produits Transformés', count: 20 },
        { id: 'produits-bruts', name: 'Produits Bruts', count: 20 }
    ];

    const categoriesList = document.getElementById('categories-list');
    categoriesList.innerHTML = '';

    categories.forEach(category => {
        const categoryItem = document.createElement('li');
        categoryItem.className = 'category-item';
        categoryItem.dataset.categoryId = category.id;

        categoryItem.innerHTML = `
            <a href="#" class="category-link">
                <span class="category-name">${category.name}</span>
                <span class="category-count">${category.count}</span>
            </a>
        `;

        categoryItem.addEventListener('click', (e) => {
            e.preventDefault();
            filterByCategory(category.id);
        });

        categoriesList.appendChild(categoryItem);
    });
}

// Update product stats
function updateProductStats() {
    // Mock stats - in real app, this would come from API
    const stats = {
        total: 156,
        available: 134,
        lowStock: 12,
        outOfStock: 10,
        featured: 8
    };

    document.getElementById('stats-total-products').textContent = stats.total;
    document.getElementById('stats-available').textContent = stats.available;
    document.getElementById('stats-low-stock').textContent = stats.lowStock;
    document.getElementById('stats-out-of-stock').textContent = stats.outOfStock;
    document.getElementById('stats-featured').textContent = stats.featured;
}

// Initialize product search and filters
function initializeProductSearchAndFilters() {
    const searchInput = document.getElementById('product-search');
    const categoryFilter = document.getElementById('filter-category');
    const statusFilter = document.getElementById('filter-status');
    const originFilter = document.getElementById('filter-origin');
    const sortSelect = document.getElementById('sort-products');
    const priceRange = document.getElementById('price-range');

    // Search functionality
    searchInput.addEventListener('input', debounce(filterProducts, 300));

    // Filter functionality
    categoryFilter.addEventListener('change', filterProducts);
    statusFilter.addEventListener('change', filterProducts);
    originFilter.addEventListener('change', filterProducts);

    // Sort functionality
    sortSelect.addEventListener('change', sortProducts);

    // Price range filter
    priceRange.addEventListener('input', debounce(filterProducts, 300));
}

// Filter products
function filterProducts() {
    const searchTerm = document.getElementById('product-search').value.toLowerCase();
    const categoryFilter = document.getElementById('filter-category').value;
    const statusFilter = document.getElementById('filter-status').value;
    const originFilter = document.getElementById('filter-origin').value;
    const maxPrice = document.getElementById('price-range').value;

    const cards = document.querySelectorAll('.product-card');

    cards.forEach(card => {
        const productId = card.dataset.productId;
        const product = getProductById(productId); // In real app, this would be from a data store

        if (!product) return;

        const matchesSearch = !searchTerm ||
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.tags.some(tag => tag.toLowerCase().includes(searchTerm));

        const matchesCategory = !categoryFilter || product.category === categoryFilter;
        const matchesStatus = !statusFilter || product.status === statusFilter;
        const matchesOrigin = !originFilter || product.origin === originFilter;
        const matchesPrice = product.price <= parseInt(maxPrice);

        if (matchesSearch && matchesCategory && matchesStatus && matchesOrigin && matchesPrice) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}

// Sort products
function sortProducts() {
    const sortBy = document.getElementById('sort-products').value;
    const grid = document.getElementById('products-grid');
    const cards = Array.from(grid.querySelectorAll('.product-card'));

    cards.sort((a, b) => {
        const productA = getProductById(a.dataset.productId);
        const productB = getProductById(b.dataset.productId);

        if (!productA || !productB) return 0;

        switch (sortBy) {
            case 'name-asc':
                return productA.name.localeCompare(productB.name);
            case 'name-desc':
                return productB.name.localeCompare(productA.name);
            case 'price-asc':
                return productA.price - productB.price;
            case 'price-desc':
                return productB.price - productA.price;
            case 'rating-desc':
                return productB.rating - productA.rating;
            case 'newest':
                return new Date(productB.createdAt) - new Date(productA.createdAt);
            default:
                return 0;
        }
    });

    // Re-append sorted cards
    cards.forEach(card => grid.appendChild(card));
}

// Filter by category
function filterByCategory(categoryId) {
    // Update active category
    document.querySelectorAll('.category-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`.category-item[data-category-id="${categoryId}"]`).classList.add('active');

    // Update filter dropdown
    document.getElementById('filter-category').value = categoryId === 'all' ? '' : categoryId;

    // Apply filter
    filterProducts();
}

// Get product by ID (mock function)
function getProductById(id) {
    // In real app, this would fetch from a data store or API
    // For now, return mock data
    return {
        id: parseInt(id),
        name: 'Mock Product',
        category: 'farines',
        price: 2500,
        status: 'available',
        origin: 'Cameroun',
        rating: 4,
        createdAt: new Date().toISOString(),
        tags: ['mock', 'test']
    };
}

// Initialize product actions
function initializeProductActions() {
    document.addEventListener('click', function(e) {
        if (e.target.closest('.btn-quote') || e.target.closest('.btn-details')) {
            e.stopPropagation();
            const button = e.target.closest('.btn-quote') || e.target.closest('.btn-details');
            const action = button.dataset.action;
            const productId = button.dataset.productId;

            performProductAction(action, productId);
        }
    });
}

// Perform product action
function performProductAction(action, productId) {
    switch (action) {
        case 'quote':
            requestQuote(productId);
            break;
        case 'details':
            viewProductDetails(productId);
            break;
    }
}

// Request quote for product
function requestQuote(productId) {
    // In real app, this would open a quote request modal
    showNotification(`Demande de devis pour le produit ${productId}`, 'success');
}

// View product details
function viewProductDetails(productId) {
    // In real app, this would open a product detail modal or navigate to detail page
    showNotification(`Affichage des détails du produit ${productId}`, 'info');
}

// Initialize category navigation
function initializeCategoryNavigation() {
    // Category navigation is handled in loadCategories()
}

// Initialize quick actions
function initializeQuickActions() {
    const quickActions = document.querySelectorAll('.quick-action');

    quickActions.forEach(action => {
        action.addEventListener('click', function() {
            const actionType = this.dataset.action;

            switch (actionType) {
                case 'add-product':
                    showAddProductModal();
                    break;
                case 'bulk-import':
                    showBulkImportModal();
                    break;
                case 'export-catalog':
                    exportProductCatalog();
                    break;
                case 'featured-products':
                    showFeaturedProducts();
                    break;
            }
        });
    });
}

// Quick action functions
function showAddProductModal() {
    showNotification('Ouverture du formulaire d\'ajout de produit', 'info');
}

function showBulkImportModal() {
    showNotification('Ouverture de l\'import en masse', 'info');
}

function exportProductCatalog() {
    showNotification('Export du catalogue en cours...', 'info');
    setTimeout(() => {
        showNotification('Catalogue exporté avec succès', 'success');
    }, 2000);
}

function showFeaturedProducts() {
    // Filter to show only featured products
    document.getElementById('filter-status').value = 'featured';
    filterProducts();
    showNotification('Produits vedettes affichés', 'info');
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
    `;

    // Add to page
    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);

    // Hide and remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
}

// Debounce function for search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Export functions for potential use in other modules
window.Products = {
    loadProducts: loadProducts,
    showNotification: showNotification,
    updateStats: updateProductStats,
    filterByCategory: filterByCategory
};