// Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize dashboard
    initializeDashboard();
});

// Global variables
let dashboardCharts = {};
let currentPeriod = 'month';

// Initialize dashboard
function initializeDashboard() {
    setupEventListeners();
    loadDashboardData();
    initializeCharts();
    setupRealTimeUpdates();
}

// Setup event listeners
function setupEventListeners() {
    // Period selector
    const periodSelect = document.getElementById('period-select');
    if (periodSelect) {
        periodSelect.addEventListener('change', function(e) {
            currentPeriod = e.target.value;
            loadDashboardData();
        });
    }

    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }

    // Sidebar toggle
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', toggleSidebar);
    }

    // Quick action buttons
    const quickActions = document.querySelectorAll('.quick-action-btn');
    quickActions.forEach(btn => {
        btn.addEventListener('click', handleQuickAction);
    });

    // Export buttons
    const exportButtons = document.querySelectorAll('.export-btn');
    exportButtons.forEach(btn => {
        btn.addEventListener('click', handleExport);
    });
}

// Load dashboard data
function loadDashboardData() {
    // Simulate API calls - in production, these would be real API endpoints
    const data = getMockDashboardData(currentPeriod);

    updateStatsCards(data.stats);
    updateRecentActivities(data.activities);
    updateTopProducts(data.topProducts);
    updateCharts(data.charts);
}

// Get mock dashboard data
function getMockDashboardData(period) {
    const periods = {
        'week': {
            multiplier: 1,
            label: 'cette semaine'
        },
        'month': {
            multiplier: 4,
            label: 'ce mois'
        },
        'quarter': {
            multiplier: 12,
            label: 'ce trimestre'
        },
        'year': {
            multiplier: 52,
            label: 'cette année'
        }
    };

    const multiplier = periods[period].multiplier;

    return {
        stats: {
            totalRevenue: 2500000 * multiplier,
            totalOrders: 45 * multiplier,
            totalProducts: 156,
            activePartners: 23
        },
        activities: [
            {
                type: 'order',
                message: 'Nouvelle commande reçue - Farine de manioc (50kg)',
                time: '2 minutes ago',
                icon: 'fas fa-shopping-cart'
            },
            {
                type: 'partner',
                message: 'Nouveau partenaire ajouté - Coopérative Agricole du Centre',
                time: '15 minutes ago',
                icon: 'fas fa-handshake'
            },
            {
                type: 'product',
                message: 'Produit mis à jour - Épices mixtes Camerounaises',
                time: '1 heure ago',
                icon: 'fas fa-box'
            },
            {
                type: 'quote',
                message: 'Demande de devis reçue - Café Arabica (100kg)',
                time: '2 heures ago',
                icon: 'fas fa-file-invoice-dollar'
            },
            {
                type: 'export',
                message: 'Export vers l\'Europe finalisé - Bananes plantains',
                time: '3 heures ago',
                icon: 'fas fa-plane'
            }
        ],
        topProducts: [
            {
                name: 'Farine de Manioc',
                sales: 125 * multiplier,
                revenue: 312500 * multiplier,
                growth: 15.2
            },
            {
                name: 'Épices Mixtes Camerounaises',
                sales: 89 * multiplier,
                revenue: 311500 * multiplier,
                growth: 8.7
            },
            {
                name: 'Bananes Plantains',
                sales: 67 * multiplier,
                revenue: 120600 * multiplier,
                growth: -2.1
            },
            {
                name: 'Maïs Blanc',
                sales: 54 * multiplier,
                revenue: 118800 * multiplier,
                growth: 22.4
            },
            {
                name: 'Café Arabica',
                sales: 43 * multiplier,
                revenue: 365500 * multiplier,
                growth: 12.8
            }
        ],
        charts: {
            revenue: getRevenueChartData(period),
            orders: getOrdersChartData(period),
            products: getProductsChartData(period),
            regions: getRegionsChartData()
        }
    };
}

// Update stats cards
function updateStatsCards(stats) {
    const cards = [
        {
            id: 'revenue-card',
            value: formatCurrency(stats.totalRevenue),
            change: '+12.5%',
            changeType: 'positive'
        },
        {
            id: 'orders-card',
            value: stats.totalOrders.toLocaleString(),
            change: '+8.2%',
            changeType: 'positive'
        },
        {
            id: 'products-card',
            value: stats.totalProducts.toString(),
            change: '+5.1%',
            changeType: 'positive'
        },
        {
            id: 'partners-card',
            value: stats.activePartners.toString(),
            change: '+15.3%',
            changeType: 'positive'
        }
    ];

    cards.forEach(card => {
        const element = document.getElementById(card.id);
        if (element) {
            const valueElement = element.querySelector('.stat-value');
            const changeElement = element.querySelector('.stat-change');

            if (valueElement) valueElement.textContent = card.value;
            if (changeElement) {
                changeElement.textContent = card.change;
                changeElement.className = `stat-change ${card.changeType}`;
            }
        }
    });
}

// Update recent activities
function updateRecentActivities(activities) {
    const container = document.getElementById('recent-activities');
    if (!container) return;

    container.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon">
                <i class="${activity.icon}"></i>
            </div>
            <div class="activity-content">
                <p class="activity-message">${activity.message}</p>
                <span class="activity-time">${activity.time}</span>
            </div>
        </div>
    `).join('');
}

// Update top products
function updateTopProducts(products) {
    const container = document.getElementById('top-products-list');
    if (!container) return;

    container.innerHTML = products.map(product => `
        <div class="product-item">
            <div class="product-info">
                <h4>${product.name}</h4>
                <span class="product-sales">${product.sales} ventes</span>
            </div>
            <div class="product-metrics">
                <span class="product-revenue">${formatCurrency(product.revenue)}</span>
                <span class="product-growth ${product.growth >= 0 ? 'positive' : 'negative'}">
                    ${product.growth >= 0 ? '+' : ''}${product.growth}%
                </span>
            </div>
        </div>
    `).join('');
}

// Initialize charts
function initializeCharts() {
    // Revenue Chart
    const revenueCtx = document.getElementById('revenue-chart');
    if (revenueCtx) {
        dashboardCharts.revenue = new Chart(revenueCtx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Revenus (FCFA)',
                    data: [],
                    borderColor: '#2e7d32',
                    backgroundColor: 'rgba(46, 125, 50, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return formatCurrency(value, true);
                            }
                        }
                    }
                }
            }
        });
    }

    // Orders Chart
    const ordersCtx = document.getElementById('orders-chart');
    if (ordersCtx) {
        dashboardCharts.orders = new Chart(ordersCtx, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: 'Commandes',
                    data: [],
                    backgroundColor: '#1976d2',
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Products Chart
    const productsCtx = document.getElementById('products-chart');
    if (productsCtx) {
        dashboardCharts.products = new Chart(productsCtx, {
            type: 'doughnut',
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    backgroundColor: [
                        '#2e7d32',
                        '#1976d2',
                        '#f57c00',
                        '#d32f2f',
                        '#7b1fa2'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    // Regions Chart
    const regionsCtx = document.getElementById('regions-chart');
    if (regionsCtx) {
        dashboardCharts.regions = new Chart(regionsCtx, {
            type: 'pie',
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    backgroundColor: [
                        '#2e7d32',
                        '#1976d2',
                        '#f57c00',
                        '#d32f2f',
                        '#7b1fa2',
                        '#0097a7'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
}

// Update charts with data
function updateCharts(chartsData) {
    if (dashboardCharts.revenue) {
        dashboardCharts.revenue.data.labels = chartsData.revenue.labels;
        dashboardCharts.revenue.data.datasets[0].data = chartsData.revenue.data;
        dashboardCharts.revenue.update();
    }

    if (dashboardCharts.orders) {
        dashboardCharts.orders.data.labels = chartsData.orders.labels;
        dashboardCharts.orders.data.datasets[0].data = chartsData.orders.data;
        dashboardCharts.orders.update();
    }

    if (dashboardCharts.products) {
        dashboardCharts.products.data.labels = chartsData.products.labels;
        dashboardCharts.products.data.datasets[0].data = chartsData.products.data;
        dashboardCharts.products.update();
    }

    if (dashboardCharts.regions) {
        dashboardCharts.regions.data.labels = chartsData.regions.labels;
        dashboardCharts.regions.data.datasets[0].data = chartsData.regions.data;
        dashboardCharts.regions.update();
    }
}

// Get revenue chart data
function getRevenueChartData(period) {
    const periods = {
        'week': { days: 7, label: 'Jours' },
        'month': { days: 30, label: 'Jours' },
        'quarter': { days: 90, label: 'Jours' },
        'year': { days: 12, label: 'Mois' }
    };

    const config = periods[period];
    const labels = [];
    const data = [];

    for (let i = config.days; i >= 1; i--) {
        if (period === 'year') {
            const month = new Date();
            month.setMonth(month.getMonth() - i + 1);
            labels.push(month.toLocaleDateString('fr-FR', { month: 'short' }));
        } else {
            labels.push(`J-${i}`);
        }

        // Generate realistic revenue data
        const baseRevenue = 50000;
        const variation = (Math.random() - 0.5) * 20000;
        data.push(Math.max(0, baseRevenue + variation));
    }

    return { labels, data };
}

// Get orders chart data
function getOrdersChartData(period) {
    const periods = {
        'week': { days: 7, label: 'Jours' },
        'month': { days: 30, label: 'Jours' },
        'quarter': { days: 90, label: 'Jours' },
        'year': { days: 12, label: 'Mois' }
    };

    const config = periods[period];
    const labels = [];
    const data = [];

    for (let i = config.days; i >= 1; i--) {
        if (period === 'year') {
            const month = new Date();
            month.setMonth(month.getMonth() - i + 1);
            labels.push(month.toLocaleDateString('fr-FR', { month: 'short' }));
        } else {
            labels.push(`J-${i}`);
        }

        // Generate realistic orders data
        const baseOrders = 5;
        const variation = (Math.random() - 0.5) * 4;
        data.push(Math.max(0, Math.round(baseOrders + variation)));
    }

    return { labels, data };
}

// Get products chart data
function getProductsChartData() {
    return {
        labels: ['Farines', 'Épices', 'Fruits', 'Céréales', 'Autres'],
        data: [35, 25, 20, 15, 5]
    };
}

// Get regions chart data
function getRegionsChartData() {
    return {
        labels: ['Cameroun', 'Europe', 'Afrique Centrale', 'Moyen-Orient', 'Amérique', 'Asie'],
        data: [45, 25, 15, 8, 5, 2]
    };
}

// Handle quick actions
function handleQuickAction(e) {
    const action = e.currentTarget.dataset.action;

    switch (action) {
        case 'add-product':
            window.location.href = 'products.html';
            break;
        case 'add-partner':
            // Open add partner modal or redirect
            showNotification('Fonctionnalité à venir', 'info');
            break;
        case 'export-data':
            exportDashboardData();
            break;
        case 'view-reports':
            window.location.href = 'reports.html';
            break;
    }
}

// Handle export
function handleExport(e) {
    const type = e.currentTarget.dataset.type;

    switch (type) {
        case 'pdf':
            exportToPDF();
            break;
        case 'excel':
            exportToExcel();
            break;
        case 'csv':
            exportToCSV();
            break;
    }
}

// Export dashboard data
function exportDashboardData() {
    const data = getMockDashboardData(currentPeriod);

    // Create CSV content
    let csvContent = 'Section,Valeur\n';

    // Stats
    csvContent += `Revenus totaux,${data.stats.totalRevenue}\n`;
    csvContent += `Commandes totales,${data.stats.totalOrders}\n`;
    csvContent += `Produits totaux,${data.stats.totalProducts}\n`;
    csvContent += `Partenaires actifs,${data.stats.activePartners}\n\n`;

    // Top products
    csvContent += 'Top Produits\n';
    csvContent += 'Produit,Ventes,Revenus,Croissance\n';
    data.topProducts.forEach(product => {
        csvContent += `"${product.name}",${product.sales},${product.revenue},${product.growth}%\n`;
    });

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `dashboard-mbaal-${currentPeriod}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showNotification('Export terminé!', 'success');
}

// Export to PDF (simplified)
function exportToPDF() {
    showNotification('Export PDF en cours de développement', 'info');
}

// Export to Excel (simplified)
function exportToExcel() {
    showNotification('Export Excel en cours de développement', 'info');
}

// Export to CSV (simplified)
function exportToCSV() {
    exportDashboardData();
}

// Setup real-time updates (simulated)
function setupRealTimeUpdates() {
    // Simulate real-time updates every 30 seconds
    setInterval(() => {
        // Small random updates to stats
        const revenueCard = document.getElementById('revenue-card');
        const ordersCard = document.getElementById('orders-card');

        if (revenueCard && Math.random() < 0.3) { // 30% chance of update
            const currentValue = parseFloat(revenueCard.querySelector('.stat-value').textContent.replace(/[^0-9]/g, ''));
            const change = (Math.random() - 0.5) * 10000;
            const newValue = Math.max(0, currentValue + change);

            revenueCard.querySelector('.stat-value').textContent = formatCurrency(newValue);
            showNotification('Revenus mis à jour', 'info');
        }

        if (ordersCard && Math.random() < 0.2) { // 20% chance of update
            const currentValue = parseInt(ordersCard.querySelector('.stat-value').textContent.replace(/[^0-9]/g, ''));
            const change = Math.random() < 0.5 ? 1 : -1;
            const newValue = Math.max(0, currentValue + change);

            ordersCard.querySelector('.stat-value').textContent = newValue.toLocaleString();
            showNotification('Nouvelle commande reçue', 'success');
        }
    }, 30000);
}

// Utility functions
function formatCurrency(amount, short = false) {
    if (short) {
        if (amount >= 1000000) {
            return (amount / 1000000).toFixed(1) + 'M';
        } else if (amount >= 1000) {
            return (amount / 1000).toFixed(1) + 'K';
        }
    }

    return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
}

// Toggle mobile menu
function toggleMobileMenu() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('mobile-open');
}

// Toggle sidebar
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('collapsed');
}

// Logout function
function logout() {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
        window.location.href = 'login.html';
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;

    // Add to page
    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}