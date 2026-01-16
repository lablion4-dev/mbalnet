// Analytics Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeAnalytics();
    loadAnalyticsData();
    setupCharts();
    setupDateFilters();
    setupExportButtons();
});

// Initialize analytics functionality
function initializeAnalytics() {
    console.log('Analytics dashboard initialized');
}

// Load analytics data
function loadAnalyticsData() {
    // Simulate API call to get analytics data
    console.log('Loading analytics data...');

    // Update metrics cards
    updateMetricsCards();

    // Update charts
    updateCharts();

    // Update tables
    updateTopProductsTable();
    updateTrafficSourcesTable();
    updateGeographicData();
}

// Update metrics cards
function updateMetricsCards() {
    const metrics = {
        totalVisitors: 15420,
        totalPageViews: 45230,
        conversionRate: 3.2,
        averageSessionDuration: '4:32',
        bounceRate: 42.5,
        newUsers: 2840
    };

    // Animate counters
    animateCounter('total-visitors', metrics.totalVisitors);
    animateCounter('total-page-views', metrics.totalPageViews);
    animateCounter('conversion-rate', metrics.conversionRate, 1);
    document.getElementById('avg-session-duration').textContent = metrics.averageSessionDuration;
    animateCounter('bounce-rate', metrics.bounceRate, 1);
    animateCounter('new-users', metrics.newUsers);
}

// Animate counter
function animateCounter(elementId, targetValue, decimals = 0) {
    const element = document.getElementById(elementId);
    const startValue = 0;
    const duration = 2000;
    const startTime = performance.now();

    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = startValue + (targetValue - startValue) * easeOutQuart;

        element.textContent = currentValue.toFixed(decimals) + (decimals > 0 ? '%' : '');

        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }

    requestAnimationFrame(updateCounter);
}

// Setup charts
function setupCharts() {
    // Traffic overview chart
    createTrafficChart();

    // Conversion funnel chart
    createConversionFunnel();

    // Device breakdown chart
    createDeviceChart();

    // Revenue chart
    createRevenueChart();

    // Geographic chart
    createGeographicChart();
}

// Create traffic overview chart
function createTrafficChart() {
    const ctx = document.getElementById('traffic-chart').getContext('2d');

    const data = {
        labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'],
        datasets: [{
            label: 'Visiteurs',
            data: [1200, 1350, 1180, 1420, 1680, 1520, 1890, 1750, 2100, 1950, 2280, 2450],
            borderColor: '#007bff',
            backgroundColor: 'rgba(0, 123, 255, 0.1)',
            tension: 0.4,
            fill: true
        }, {
            label: 'Pages vues',
            data: [3600, 4050, 3540, 4260, 5040, 4560, 5670, 5250, 6300, 5850, 6840, 7350],
            borderColor: '#28a745',
            backgroundColor: 'rgba(40, 167, 69, 0.1)',
            tension: 0.4,
            fill: true
        }]
    };

    new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Évolution du trafic'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

// Create conversion funnel chart
function createConversionFunnel() {
    const ctx = document.getElementById('conversion-funnel').getContext('2d');

    const data = {
        labels: ['Visiteurs', 'Consultation produits', 'Demande devis', 'Conversion'],
        datasets: [{
            label: 'Nombre',
            data: [15420, 4626, 616, 492],
            backgroundColor: [
                'rgba(0, 123, 255, 0.8)',
                'rgba(40, 167, 69, 0.8)',
                'rgba(255, 193, 7, 0.8)',
                'rgba(220, 53, 69, 0.8)'
            ],
            borderWidth: 1
        }]
    };

    new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Entonnoir de conversion'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                        return value.toLocaleString();
                    }
                }
            }
        }
    });
}

// Create device breakdown chart
function createDeviceChart() {
    const ctx = document.getElementById('device-chart').getContext('2d');

    const data = {
        labels: ['Desktop', 'Mobile', 'Tablette'],
        datasets: [{
            data: [45.2, 42.8, 12.0],
            backgroundColor: [
                'rgba(0, 123, 255, 0.8)',
                'rgba(40, 167, 69, 0.8)',
                'rgba(255, 193, 7, 0.8)'
            ],
            borderWidth: 1
        }]
    };

    new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                },
                title: {
                    display: true,
                    text: 'Répartition par appareil'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.parsed + '%';
                        }
                    }
                }
            }
        }
    });
}

// Create revenue chart
function createRevenueChart() {
    const ctx = document.getElementById('revenue-chart').getContext('2d');

    const data = {
        labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'],
        datasets: [{
            label: 'Revenus (€)',
            data: [12500, 15200, 13800, 18900, 22100, 19800, 25600, 23400, 28900, 26700, 31200, 34800],
            borderColor: '#28a745',
            backgroundColor: 'rgba(40, 167, 69, 0.1)',
            tension: 0.4,
            fill: true
        }]
    };

    new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Évolution des revenus'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString() + ' €';
                        }
                    }
                }
            }
        }
    });
}

// Create geographic chart
function createGeographicChart() {
    const ctx = document.getElementById('geographic-chart').getContext('2d');

    const data = {
        labels: ['Cameroun', 'France', 'Côte d\'Ivoire', 'Sénégal', 'Mali', 'Burkina Faso', 'Togo', 'Bénin', 'Autres'],
        datasets: [{
            label: 'Visiteurs',
            data: [4520, 3210, 2890, 2150, 1680, 1420, 980, 760, 1810],
            backgroundColor: [
                'rgba(0, 123, 255, 0.8)',
                'rgba(40, 167, 69, 0.8)',
                'rgba(255, 193, 7, 0.8)',
                'rgba(220, 53, 69, 0.8)',
                'rgba(23, 162, 184, 0.8)',
                'rgba(108, 117, 125, 0.8)',
                'rgba(52, 58, 64, 0.8)',
                'rgba(255, 193, 7, 0.8)',
                'rgba(40, 167, 69, 0.8)'
            ],
            borderWidth: 1
        }]
    };

    new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Visiteurs par pays'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

// Update charts with new data
function updateCharts() {
    // This would be called when date filters change
    console.log('Updating charts with new data...');
}

// Update top products table
function updateTopProductsTable() {
    const products = [
        { name: 'Farine de manioc', views: 2450, conversions: 89, revenue: 12450 },
        { name: 'Farine de maïs', views: 1890, conversions: 67, revenue: 9870 },
        { name: 'Riz local', views: 1650, conversions: 54, revenue: 7560 },
        { name: 'Épices mélangées', views: 1420, conversions: 43, revenue: 6020 },
        { name: 'Café camerounais', views: 1280, conversions: 38, revenue: 5320 }
    ];

    const tbody = document.querySelector('#top-products-table tbody');
    tbody.innerHTML = '';

    products.forEach((product, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${product.name}</td>
            <td>${product.views.toLocaleString()}</td>
            <td>${product.conversions}</td>
            <td>${product.revenue.toLocaleString()} €</td>
            <td>${(product.conversions / product.views * 100).toFixed(1)}%</td>
        `;
        tbody.appendChild(row);
    });
}

// Update traffic sources table
function updateTrafficSourcesTable() {
    const sources = [
        { source: 'Recherche organique', visitors: 5840, percentage: 37.8 },
        { source: 'Réseaux sociaux', visitors: 4260, percentage: 27.6 },
        { source: 'Référencement', visitors: 3120, percentage: 20.2 },
        { source: 'Direct', visitors: 1680, percentage: 10.9 },
        { source: 'Email', visitors: 520, percentage: 3.4 }
    ];

    const tbody = document.querySelector('#traffic-sources-table tbody');
    tbody.innerHTML = '';

    sources.forEach(source => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${source.source}</td>
            <td>${source.visitors.toLocaleString()}</td>
            <td>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${source.percentage}%"></div>
                </div>
                ${source.percentage}%
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Update geographic data
function updateGeographicData() {
    const countries = [
        { country: 'Cameroun', visitors: 4520, flag: '🇨🇲' },
        { country: 'France', visitors: 3210, flag: '🇫🇷' },
        { country: 'Côte d\'Ivoire', visitors: 2890, flag: '🇨🇮' },
        { country: 'Sénégal', visitors: 2150, flag: '🇸🇳' },
        { country: 'Mali', visitors: 1680, flag: '🇲🇱' }
    ];

    const container = document.getElementById('geographic-list');
    container.innerHTML = '';

    countries.forEach(country => {
        const item = document.createElement('div');
        item.className = 'geographic-item';
        item.innerHTML = `
            <span class="country-flag">${country.flag}</span>
            <span class="country-name">${country.country}</span>
            <span class="country-visitors">${country.visitors.toLocaleString()}</span>
        `;
        container.appendChild(item);
    });
}

// Setup date filters
function setupDateFilters() {
    const dateRangeSelect = document.getElementById('date-range');
    const customDateRange = document.getElementById('custom-date-range');

    dateRangeSelect.addEventListener('change', function() {
        if (this.value === 'custom') {
            customDateRange.style.display = 'block';
        } else {
            customDateRange.style.display = 'none';
            applyDateFilter(this.value);
        }
    });

    // Custom date inputs
    const startDate = document.getElementById('start-date');
    const endDate = document.getElementById('end-date');

    startDate.addEventListener('change', function() {
        if (endDate.value) {
            applyCustomDateFilter(startDate.value, endDate.value);
        }
    });

    endDate.addEventListener('change', function() {
        if (startDate.value) {
            applyCustomDateFilter(startDate.value, endDate.value);
        }
    });
}

// Apply date filter
function applyDateFilter(range) {
    console.log(`Applying date filter: ${range}`);
    // Simulate loading new data
    setTimeout(() => {
        loadAnalyticsData();
        showNotification('Données mises à jour', 'success');
    }, 1000);
}

// Apply custom date filter
function applyCustomDateFilter(startDate, endDate) {
    console.log(`Applying custom date filter: ${startDate} to ${endDate}`);
    // Simulate loading new data
    setTimeout(() => {
        loadAnalyticsData();
        showNotification('Données mises à jour', 'success');
    }, 1000);
}

// Setup export buttons
function setupExportButtons() {
    const exportPdfBtn = document.getElementById('export-pdf');
    const exportCsvBtn = document.getElementById('export-csv');

    exportPdfBtn.addEventListener('click', function() {
        exportAnalyticsReport('pdf');
    });

    exportCsvBtn.addEventListener('click', function() {
        exportAnalyticsReport('csv');
    });
}

// Export analytics report
function exportAnalyticsReport(format) {
    console.log(`Exporting analytics report as ${format}`);

    // Simulate export
    setTimeout(() => {
        showNotification(`Rapport exporté au format ${format.toUpperCase()}`, 'success');
    }, 2000);
}

// Refresh analytics data
function refreshAnalytics() {
    console.log('Refreshing analytics data...');
    loadAnalyticsData();
    showNotification('Données actualisées', 'success');
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Real-time updates simulation
function startRealTimeUpdates() {
    setInterval(() => {
        // Simulate real-time metric updates
        const metrics = ['total-visitors', 'total-page-views', 'conversion-rate'];
        const randomMetric = metrics[Math.floor(Math.random() * metrics.length)];

        if (Math.random() > 0.7) { // 30% chance of update
            const element = document.getElementById(randomMetric);
            const currentValue = parseFloat(element.textContent.replace(/[^\d.]/g, ''));
            const change = (Math.random() - 0.5) * 0.1; // ±5% change
            const newValue = Math.max(0, currentValue * (1 + change));

            if (randomMetric === 'conversion-rate') {
                element.textContent = newValue.toFixed(1) + '%';
            } else {
                element.textContent = Math.round(newValue).toLocaleString();
            }
        }
    }, 30000); // Update every 30 seconds
}

// Initialize real-time updates
startRealTimeUpdates();