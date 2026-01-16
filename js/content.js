// Content Management JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeContentManager();
});

function initializeContentManager() {
    // Initialize CodeMirror for HTML editing
    initializeCodeEditors();

    // Initialize drag and drop for media upload
    initializeMediaUpload();

    // Load initial content
    loadContentData();
}

function initializeCodeEditors() {
    // HTML Editor
    const htmlEditor = CodeMirror.fromTextArea(document.getElementById('page-html-content'), {
        lineNumbers: true,
        mode: 'htmlmixed',
        theme: 'material',
        autoCloseTags: true,
        autoCloseBrackets: true
    });

    // Store editor instance globally
    window.htmlEditor = htmlEditor;
}

function initializeMediaUpload() {
    const uploadZone = document.getElementById('upload-zone');
    const fileInput = document.getElementById('file-input');

    if (uploadZone && fileInput) {
        // Click to upload
        uploadZone.addEventListener('click', () => fileInput.click());

        // Drag and drop
        uploadZone.addEventListener('dragover', handleDragOver);
        uploadZone.addEventListener('drop', handleFileDrop);

        // File selection
        fileInput.addEventListener('change', handleFileSelect);
    }
}

function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
}

function handleFileDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');

    const files = e.dataTransfer.files;
    handleFiles(files);
}

function handleFileSelect(e) {
    const files = e.target.files;
    handleFiles(files);
}

function handleFiles(files) {
    const uploadProgress = document.getElementById('upload-progress');
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');

    uploadProgress.style.display = 'block';

    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
        progress += 10;
        progressFill.style.width = progress + '%';
        progressText.textContent = `Téléchargement en cours... ${progress}%`;

        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                uploadProgress.style.display = 'none';
                progressFill.style.width = '0%';
                showNotification('Fichiers téléchargés avec succès!', 'success');
                refreshMediaGrid();
            }, 500);
        }
    }, 200);
}

function switchTab(tabName) {
    // Remove active class from all tabs
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => btn.classList.remove('active'));

    // Add active class to clicked tab
    event.target.classList.add('active');

    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => content.classList.remove('active'));

    // Show selected tab content
    const selectedTab = document.getElementById(tabName + '-tab');
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
}

function switchEditorTab(tabName) {
    const editorTabs = document.querySelectorAll('.editor-tab');
    editorTabs.forEach(tab => tab.classList.remove('active'));

    event.target.classList.add('active');

    const editorContents = document.querySelectorAll('.editor-content');
    editorContents.forEach(content => content.classList.remove('active'));

    const selectedContent = document.getElementById(tabName + '-editor');
    if (selectedContent) {
        selectedContent.classList.add('active');
    }
}

function createNewPage() {
    const modal = document.getElementById('page-editor-modal');
    modal.style.display = 'block';

    // Reset form
    document.getElementById('page-title').value = '';
    if (window.htmlEditor) {
        window.htmlEditor.setValue('');
    }

    // Focus on title
    document.getElementById('page-title').focus();
}

function editPage(pageId) {
    const modal = document.getElementById('page-editor-modal');
    modal.style.display = 'block';

    // Load page data (simulated)
    const pageData = getPageData(pageId);
    document.getElementById('page-title').value = pageData.title;

    if (window.htmlEditor) {
        window.htmlEditor.setValue(pageData.content);
    }
}

function getPageData(pageId) {
    const pages = {
        home: {
            title: 'Accueil',
            content: `<h1>Bienvenue sur MBAAL</h1>
<p>MBAAL - Connecting African Products to Global Markets</p>
<p>Commerce général, import-export et sourcing de produits camerounais.</p>`
        },
        about: {
            title: 'À Propos',
            content: `<h1>À Propos de MBAAL</h1>
<p>ETS MBA & AL - Commerce général et prestations de services.</p>`
        },
        products: {
            title: 'Nos Produits',
            content: `<h1>Nos Produits</h1>
<p>Découvrez notre catalogue de produits camerounais.</p>`
        },
        services: {
            title: 'Nos Services',
            content: `<h1>Nos Services</h1>
<p>Import-export, négoce, intermédiation et distribution.</p>`
        },
        contact: {
            title: 'Contact',
            content: `<h1>Contactez-nous</h1>
<p>Douala, Cameroun</p>`
        }
    };

    return pages[pageId] || { title: '', content: '' };
}

function savePage() {
    const title = document.getElementById('page-title').value;
    const content = window.htmlEditor ? window.htmlEditor.getValue() : '';

    if (!title.trim()) {
        showNotification('Le titre de la page est requis', 'error');
        return;
    }

    // Simulate save
    showNotification('Page sauvegardée avec succès!', 'success');
    closeModal('page-editor-modal');
}

function previewPage(pageId) {
    // Open page in new tab for preview
    const pageUrls = {
        home: '../index.html',
        about: '../about.html',
        products: '../products.html',
        services: '../services.html',
        contact: '../contact.html'
    };

    const url = pageUrls[pageId];
    if (url) {
        window.open(url, '_blank');
    }
}

function createNewSection() {
    showNotification('Fonctionnalité à implémenter', 'info');
}

function editSection(sectionId) {
    showNotification('Édition de section à implémenter', 'info');
}

function duplicateSection(sectionId) {
    showNotification('Duplication de section à implémenter', 'info');
}

function openMediaUploader() {
    const modal = document.getElementById('media-uploader-modal');
    modal.style.display = 'block';
}

function createFolder() {
    const folderName = prompt('Nom du dossier:');
    if (folderName) {
        showNotification(`Dossier "${folderName}" créé`, 'success');
    }
}

function editMedia(mediaId) {
    showNotification('Édition média à implémenter', 'info');
}

function deleteMedia(mediaId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce média?')) {
        showNotification('Média supprimé', 'success');
        // Remove from DOM
        event.target.closest('.media-item').remove();
    }
}

function saveSEOSettings() {
    // Collect SEO data
    const seoData = {
        siteTitle: document.getElementById('site-title').value,
        siteDescription: document.getElementById('site-description').value,
        siteKeywords: document.getElementById('site-keywords').value
    };

    // Simulate save
    showNotification('Paramètres SEO sauvegardés!', 'success');
}

function loadContentData() {
    // Load initial data if needed
    console.log('Content data loaded');
}

function refreshMediaGrid() {
    // Refresh media grid after upload
    console.log('Media grid refreshed');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
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

// Utility functions
function toggleSidebar() {
    const sidebar = document.querySelector('.admin-sidebar');
    const main = document.querySelector('.admin-main');

    sidebar.classList.toggle('collapsed');
    main.classList.toggle('expanded');
}

function logout() {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter?')) {
        window.location.href = 'login.html';
    }
}