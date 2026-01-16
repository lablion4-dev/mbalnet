const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const messageSchema = new mongoose.Schema({
  // Informations de base
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Adresse email invalide']
  },
  phone: {
    type: String,
    trim: true,
    maxlength: 20
  },
  company: {
    type: String,
    trim: true,
    maxlength: 100
  },

  // Contenu du message
  subject: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 5000
  },

  // Type de message
  type: {
    type: String,
    enum: ['contact', 'quote', 'partnership', 'sourcing'],
    default: 'contact'
  },

  // Informations spécifiques aux demandes de devis
  product: {
    type: String,
    trim: true,
    maxlength: 200
  },
  quantity: {
    type: String,
    trim: true,
    maxlength: 100
  },
  destination: {
    type: String,
    trim: true,
    maxlength: 100
  },

  // Statut et gestion admin
  status: {
    type: String,
    enum: ['unread', 'read', 'replied', 'archived'],
    default: 'unread'
  },
  adminNotes: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  repliedAt: {
    type: Date
  },

  // Métadonnées techniques
  ipAddress: {
    type: String,
    trim: true
  },
  userAgent: {
    type: String,
    trim: true
  },

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index pour les recherches
messageSchema.index({ email: 1 });
messageSchema.index({ type: 1 });
messageSchema.index({ status: 1 });
messageSchema.index({ createdAt: -1 });
messageSchema.index({ name: 'text', email: 'text', subject: 'text', message: 'text', company: 'text' });

// Plugin de pagination
messageSchema.plugin(mongoosePaginate);

// Middleware pour mettre à jour lastUpdated
messageSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

// Méthode statique pour compter les messages par statut
messageSchema.statics.countByStatus = function(status) {
  return this.countDocuments({ status });
};

// Méthode statique pour compter les messages par type
messageSchema.statics.countByType = function(type) {
  return this.countDocuments({ type });
};

// Méthode d'instance pour marquer comme lu
messageSchema.methods.markAsRead = function() {
  this.status = 'read';
  this.lastUpdated = new Date();
  return this.save();
};

// Méthode d'instance pour archiver
messageSchema.methods.archive = function() {
  this.status = 'archived';
  this.lastUpdated = new Date();
  return this.save();
};

// Virtual pour vérifier si le message est récent (moins de 24h)
messageSchema.virtual('isRecent').get(function() {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  return this.createdAt > oneDayAgo;
});

// Virtual pour le temps écoulé depuis la création
messageSchema.virtual('timeAgo').get(function() {
  const now = new Date();
  const diff = now - this.createdAt;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (days > 0) return `${days} jour${days > 1 ? 's' : ''}`;
  if (hours > 0) return `${hours} heure${hours > 1 ? 's' : ''}`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  return 'À l\'instant';
});

// Virtual pour le statut formaté
messageSchema.virtual('statusLabel').get(function() {
  const labels = {
    unread: 'Non lu',
    read: 'Lu',
    replied: 'Répondu',
    archived: 'Archivé'
  };
  return labels[this.status] || this.status;
});

// Virtual pour le type formaté
messageSchema.virtual('typeLabel').get(function() {
  const labels = {
    contact: 'Contact',
    quote: 'Demande de devis',
    partnership: 'Partenariat',
    sourcing: 'Sourcing'
  };
  return labels[this.type] || this.type;
});

module.exports = mongoose.model('Message', messageSchema);