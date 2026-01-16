// Messages Management JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeMessages();
    loadMessages();
    setupMessageFilters();
    setupBulkActions();
});

// Initialize messages functionality
function initializeMessages() {
    console.log('Messages management initialized');
}

// Load messages from API
function loadMessages(status = 'all', type = 'all') {
    // Simulate API call
    console.log(`Loading messages with status: ${status}, type: ${type}`);

    // Update messages table with sample data
    updateMessagesTable(getSampleMessages(status, type));

    // Update counters
    updateMessageCounters();
}

// Update messages table
function updateMessagesTable(messages) {
    const tbody = document.querySelector('#messages-table tbody');
    tbody.innerHTML = '';

    messages.forEach(message => {
        const row = document.createElement('tr');
        row.className = message.status === 'unread' ? 'unread' : '';
        row.innerHTML = `
            <td>
                <input type="checkbox" class="message-checkbox" value="${message.id}">
            </td>
            <td>
                <div class="message-sender">
                    <strong>${message.name}</strong>
                    <small>${message.email}</small>
                </div>
            </td>
            <td>
                <div class="message-subject">
                    ${message.subject}
                    ${message.status === 'unread' ? '<span class="unread-indicator"></span>' : ''}
                </div>
            </td>
            <td>${message.type}</td>
            <td>
                <span class="status-badge status-${message.status}">${getStatusLabel(message.status)}</span>
            </td>
            <td>${formatDate(message.date)}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-sm btn-primary" onclick="viewMessage(${message.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-success" onclick="markAsRead(${message.id})">
                        <i class="fas fa-check"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteMessage(${message.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });

    // Update bulk actions state
    updateBulkActionsState();
}

// Setup message filters
function setupMessageFilters() {
    const statusFilter = document.getElementById('status-filter');
    const typeFilter = document.getElementById('type-filter');

    statusFilter.addEventListener('change', function() {
        loadMessages(this.value, typeFilter.value);
    });

    typeFilter.addEventListener('change', function() {
        loadMessages(statusFilter.value, this.value);
    });
}

// Setup bulk actions
function setupBulkActions() {
    const selectAllCheckbox = document.getElementById('select-all-messages');
    const bulkActionSelect = document.getElementById('bulk-action');
    const bulkApplyBtn = document.getElementById('bulk-apply');

    // Select all checkbox
    selectAllCheckbox.addEventListener('change', function() {
        const checkboxes = document.querySelectorAll('.message-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = this.checked;
        });
        updateBulkActionsState();
    });

    // Individual checkboxes
    document.addEventListener('change', function(e) {
        if (e.target.classList.contains('message-checkbox')) {
            updateBulkActionsState();
            updateSelectAllState();
        }
    });

    // Bulk apply button
    bulkApplyBtn.addEventListener('click', function() {
        const action = bulkActionSelect.value;
        const selectedIds = getSelectedMessageIds();

        if (selectedIds.length === 0) {
            showNotification('Aucun message sélectionné', 'warning');
            return;
        }

        applyBulkAction(action, selectedIds);
    });
}

// Update bulk actions state
function updateBulkActionsState() {
    const selectedCount = getSelectedMessageIds().length;
    const bulkActions = document.getElementById('bulk-actions');

    if (selectedCount > 0) {
        bulkActions.style.display = 'flex';
        document.getElementById('selected-count').textContent = selectedCount;
    } else {
        bulkActions.style.display = 'none';
    }
}

// Update select all checkbox state
function updateSelectAllState() {
    const selectAllCheckbox = document.getElementById('select-all-messages');
    const checkboxes = document.querySelectorAll('.message-checkbox');
    const checkedBoxes = document.querySelectorAll('.message-checkbox:checked');

    selectAllCheckbox.checked = checkboxes.length > 0 && checkedBoxes.length === checkboxes.length;
    selectAllCheckbox.indeterminate = checkedBoxes.length > 0 && checkedBoxes.length < checkboxes.length;
}

// Get selected message IDs
function getSelectedMessageIds() {
    const checkboxes = document.querySelectorAll('.message-checkbox:checked');
    return Array.from(checkboxes).map(checkbox => parseInt(checkbox.value));
}

// Apply bulk action
function applyBulkAction(action, messageIds) {
    console.log(`Applying ${action} to messages:`, messageIds);

    // Simulate API call
    setTimeout(() => {
        switch (action) {
            case 'mark-read':
                markMessagesAsRead(messageIds);
                break;
            case 'mark-unread':
                markMessagesAsUnread(messageIds);
                break;
            case 'archive':
                archiveMessages(messageIds);
                break;
            case 'delete':
                deleteMessages(messageIds);
                break;
        }

        showNotification(`Action appliquée à ${messageIds.length} message(s)`, 'success');
        loadMessages();
    }, 1000);
}

// View message details
function viewMessage(messageId) {
    const message = getSampleMessages().find(m => m.id === messageId);
    if (!message) return;

    // Create modal content
    const modalContent = `
        <div class="message-modal">
            <div class="message-modal-header">
                <h3>${message.subject}</h3>
                <button class="close-modal" onclick="closeMessageModal()">&times;</button>
            </div>
            <div class="message-modal-body">
                <div class="message-info">
                    <div class="info-row">
                        <strong>De:</strong> ${message.name} <${message.email}>
                    </div>
                    <div class="info-row">
                        <strong>Type:</strong> ${message.type}
                    </div>
                    <div class="info-row">
                        <strong>Date:</strong> ${formatDate(message.date)}
                    </div>
                    ${message.phone ? `<div class="info-row"><strong>Téléphone:</strong> ${message.phone}</div>` : ''}
                    ${message.company ? `<div class="info-row"><strong>Entreprise:</strong> ${message.company}</div>` : ''}
                </div>
                <div class="message-content">
                    <h4>Message:</h4>
                    <p>${message.message}</p>
                </div>
            </div>
            <div class="message-modal-footer">
                <button class="btn btn-success" onclick="markAsRead(${messageId}); closeMessageModal();">
                    <i class="fas fa-check"></i> Marquer comme lu
                </button>
                <button class="btn btn-primary" onclick="replyToMessage('${message.email}', '${message.subject}')">
                    <i class="fas fa-reply"></i> Répondre
                </button>
                <button class="btn btn-danger" onclick="deleteMessage(${messageId}); closeMessageModal();">
                    <i class="fas fa-trash"></i> Supprimer
                </button>
            </div>
        </div>
    `;

    // Show modal
    showModal(modalContent);

    // Mark as read if unread
    if (message.status === 'unread') {
        markAsRead(messageId);
    }
}

// Close message modal
function closeMessageModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.remove();
    }
}

// Mark message as read
function markAsRead(messageId) {
    console.log(`Marking message ${messageId} as read`);
    // Simulate API call
    showNotification('Message marqué comme lu', 'success');
}

// Mark messages as read (bulk)
function markMessagesAsRead(messageIds) {
    console.log('Marking messages as read:', messageIds);
}

// Mark messages as unread (bulk)
function markMessagesAsUnread(messageIds) {
    console.log('Marking messages as unread:', messageIds);
}

// Archive messages (bulk)
function archiveMessages(messageIds) {
    console.log('Archiving messages:', messageIds);
}

// Delete message
function deleteMessage(messageId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) {
        console.log(`Deleting message ${messageId}`);
        // Simulate API call
        showNotification('Message supprimé', 'success');
        loadMessages();
    }
}

// Delete messages (bulk)
function deleteMessages(messageIds) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${messageIds.length} message(s) ?`)) {
        console.log('Deleting messages:', messageIds);
        // Simulate API call
        showNotification(`${messageIds.length} message(s) supprimé(s)`, 'success');
        loadMessages();
    }
}

// Reply to message
function replyToMessage(email, subject) {
    // Open email client or show reply form
    const replySubject = 'Re: ' + subject;
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(replySubject)}`;
    window.open(mailtoLink);
}

// Update message counters
function updateMessageCounters() {
    const messages = getSampleMessages();
    const unread = messages.filter(m => m.status === 'unread').length;
    const total = messages.length;

    document.getElementById('unread-count').textContent = unread;
    document.getElementById('total-messages').textContent = total;
}

// Show modal
function showModal(content) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = content;
    document.body.appendChild(modal);

    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeMessageModal();
        }
    });
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

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Get status label
function getStatusLabel(status) {
    const labels = {
        'unread': 'Non lu',
        'read': 'Lu',
        'replied': 'Répondu',
        'archived': 'Archivé'
    };
    return labels[status] || status;
}

// Sample messages data
function getSampleMessages(status = 'all', type = 'all') {
    const allMessages = [
        {
            id: 1,
            name: 'Jean Dupont',
            email: 'jean.dupont@email.com',
            phone: '+33 6 12 34 56 78',
            company: 'ImportCo SARL',
            subject: 'Demande de devis pour farines locales',
            message: 'Bonjour, je suis intéressé par vos farines de manioc et de maïs. Pouvez-vous me faire parvenir un devis pour 500kg de chaque ? Merci.',
            type: 'Devis',
            status: 'unread',
            date: '2024-01-15T10:30:00'
        },
        {
            id: 2,
            name: 'Marie Claire',
            email: 'marie.claire@email.com',
            phone: '+225 01 02 03 04 05',
            company: 'AgroTrade Côte d\'Ivoire',
            subject: 'Partenariat distribution',
            message: 'Nous sommes distributeurs en Côte d\'Ivoire et souhaitons devenir partenaires pour vos produits agro-alimentaires.',
            type: 'Partenariat',
            status: 'read',
            date: '2024-01-14T14:20:00'
        },
        {
            id: 3,
            name: 'Ahmed Benali',
            email: 'ahmed.benali@email.com',
            phone: '+216 98 76 54 32',
            company: 'Tunisia Import',
            subject: 'Sourcing produits camerounais',
            message: 'Nous recherchons des fournisseurs de café et cacao camerounais pour nos clients européens.',
            type: 'Sourcing',
            status: 'replied',
            date: '2024-01-13T09:15:00'
        },
        {
            id: 4,
            name: 'Sophie Martin',
            email: 'sophie.martin@email.com',
            subject: 'Question sur les délais de livraison',
            message: 'Bonjour, j\'aimerais savoir quels sont vos délais moyens de livraison vers la France.',
            type: 'Contact',
            status: 'unread',
            date: '2024-01-12T16:45:00'
        },
        {
            id: 5,
            name: 'Pierre Dubois',
            email: 'pierre.dubois@email.com',
            phone: '+33 7 89 01 23 45',
            company: 'French Gourmet',
            subject: 'Demande d\'échantillons',
            message: 'Nous aimerions recevoir des échantillons de vos épices et condiments pour tester nos marchés.',
            type: 'Devis',
            status: 'read',
            date: '2024-01-11T11:30:00'
        }
    ];

    let filtered = allMessages;

    if (status !== 'all') {
        filtered = filtered.filter(m => m.status === status);
    }

    if (type !== 'all') {
        filtered = filtered.filter(m => m.type.toLowerCase() === type.toLowerCase());
    }

    return filtered;
}

// Search messages
function searchMessages() {
    const searchTerm = document.getElementById('message-search').value.toLowerCase();
    const rows = document.querySelectorAll('#messages-table tbody tr');

    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}

// Export messages
function exportMessages() {
    const messages = getSampleMessages();
    const csvContent = 'data:text/csv;charset=utf-8,' +
        'Nom,Email,Téléphone,Entreprise,Sujet,Type,Statut,Date,Message\n' +
        messages.map(m =>
            `"${m.name}","${m.email}","${m.phone || ''}","${m.company || ''}","${m.subject}","${m.type}","${getStatusLabel(m.status)}","${m.date}","${m.message.replace(/"/g, '""')}"`
        ).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'messages-export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showNotification('Messages exportés avec succès', 'success');
}