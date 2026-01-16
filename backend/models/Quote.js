const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
  // Informations client
  clientName: {
    type: String,
    required: true,
    trim: true
  },
  clientEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  clientPhone: {
    type: String,
    trim: true
  },
  clientCompany: {
    type: String,
    trim: true
  },
  clientCountry: {
    type: String,
    trim: true
  },

  // Type de demande
  type: {
    type: String,
    required: true,
    enum: [
      'devis-produit',
      'sourcing',
      'intermediation',
      'partenariat',
      'export',
      'import',
      'autre'
    ]
  },

  // Produits demandés (si applicable)
  products: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    productName: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    unit: {
      type: String,
      default: 'kg'
    },
    specifications: {
      type: String,
      trim: true
    }
  }],

  // Description détaillée de la demande
  description: {
    type: String,
    required: true,
    trim: true
  },

  // Informations spécifiques au sourcing/intermédiation
  sourcingDetails: {
    productType: {
      type: String,
      trim: true
    },
    quantity: {
      type: Number,
      min: 1
    },
    budget: {
      type: Number,
      min: 0
    },
    currency: {
      type: String,
      default: 'XAF',
      enum: ['XAF', 'EUR', 'USD']
    },
    destination: {
      type: String,
      trim: true
    },
    deadline: {
      type: Date
    }
  },

  // Statut de la demande
  status: {
    type: String,
    default: 'pending',
    enum: [
      'pending',      // En attente
      'processing',   // En cours de traitement
      'quoted',       // Devis envoyé
      'accepted',     // Accepté par le client
      'rejected',     // Rejeté
      'completed',    // Terminé
      'cancelled'     // Annulé
    ]
  },

  // Informations de réponse
  quoteAmount: {
    type: Number,
    min: 0
  },
  quoteCurrency: {
    type: String,
    default: 'XAF',
    enum: ['XAF', 'EUR', 'USD']
  },
  quoteDetails: {
    type: String,
    trim: true
  },
  quoteValidity: {
    type: Date
  },

  // Informations de suivi
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  notes: [{
    content: {
      type: String,
      required: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],

  // Métadonnées
  source: {
    type: String,
    default: 'website',
    enum: ['website', 'email', 'phone', 'partner']
  },
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
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update updatedAt on save
quoteSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index pour les recherches
quoteSchema.index({ clientEmail: 1 });
quoteSchema.index({ status: 1, createdAt: -1 });
quoteSchema.index({ type: 1, status: 1 });
quoteSchema.index({ assignedTo: 1, status: 1 });

module.exports = mongoose.model('Quote', quoteSchema);