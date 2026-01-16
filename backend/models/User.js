const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Informations de base
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Veuillez entrer un email valide']
  },
  phone: {
    type: String,
    trim: true,
    match: [/^\+?[\d\s\-\(\)]+$/, 'Veuillez entrer un numéro de téléphone valide']
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false // Ne pas inclure dans les requêtes par défaut
  },

  // Profil et rôle
  role: {
    type: String,
    enum: ['admin', 'manager', 'sales', 'supplier', 'customer', 'partner'],
    default: 'customer'
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended', 'pending_verification'],
    default: 'active'
  },
  profile: {
    avatar: {
      type: String,
      trim: true
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 500
    },
    company: {
      name: {
        type: String,
        trim: true,
        maxlength: 100
      },
      position: {
        type: String,
        trim: true,
        maxlength: 50
      },
      website: {
        type: String,
        trim: true,
        match: [/^https?:\/\/.*/, 'L\'URL doit commencer par http:// ou https://']
      },
      address: {
        street: String,
        city: String,
        region: String,
        country: {
          type: String,
          default: 'Cameroun'
        },
        postalCode: String
      }
    },
    socialLinks: {
      linkedin: String,
      twitter: String,
      facebook: String,
      whatsapp: String
    }
  },

  // Préférences et paramètres
  preferences: {
    language: {
      type: String,
      enum: ['fr', 'en'],
      default: 'fr'
    },
    currency: {
      type: String,
      enum: ['XAF', 'EUR', 'USD'],
      default: 'XAF'
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      sms: {
        type: Boolean,
        default: false
      },
      marketing: {
        type: Boolean,
        default: false
      },
      products: {
        type: Boolean,
        default: true
      },
      orders: {
        type: Boolean,
        default: true
      }
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'light'
    }
  },

  // Vérification et sécurité
  emailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  emailVerificationExpires: Date,

  passwordResetToken: String,
  passwordResetExpires: Date,

  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  twoFactorSecret: String,

  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: Date,

  // Historique d'activité
  lastLogin: Date,
  lastActivity: Date,
  ipAddress: String,
  userAgent: String,

  // Relations
  createdProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  favoriteProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  orders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  }],
  inquiries: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Inquiry'
  }],
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }],

  // Métadonnées
  metadata: {
    source: {
      type: String,
      enum: ['registration', 'admin_created', 'import', 'api'],
      default: 'registration'
    },
    registrationIP: String,
    referrer: String,
    utm: {
      source: String,
      medium: String,
      campaign: String,
      term: String,
      content: String
    },
    customFields: {
      type: Map,
      of: mongoose.Schema.Types.Mixed
    }
  },

  // Statistiques
  stats: {
    totalOrders: {
      type: Number,
      default: 0
    },
    totalSpent: {
      type: Number,
      default: 0,
      min: 0
    },
    averageOrderValue: {
      type: Number,
      default: 0,
      min: 0
    },
    lastOrderDate: Date,
    favoriteCategories: [{
      category: String,
      count: Number
    }],
    loginCount: {
      type: Number,
      default: 0
    },
    profileCompleteness: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    }
  },

  // Notes internes (pour les admins)
  internalNotes: [{
    note: {
      type: String,
      required: true,
      trim: true
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

  // Consentements et conformité
  consents: {
    termsAccepted: {
      type: Boolean,
      default: false
    },
    termsAcceptedAt: Date,
    privacyAccepted: {
      type: Boolean,
      default: false
    },
    privacyAcceptedAt: Date,
    marketingAccepted: {
      type: Boolean,
      default: false
    },
    marketingAcceptedAt: Date,
    dataProcessingAccepted: {
      type: Boolean,
      default: false
    },
    dataProcessingAcceptedAt: Date
  },

  // Champs pour les fournisseurs/partenaires
  supplierInfo: {
    businessType: {
      type: String,
      enum: ['individual', 'company', 'cooperative', 'farm'],
      default: 'individual'
    },
    businessRegistration: {
      number: String,
      type: {
        type: String,
        enum: ['rccm', 'ifu', 'cce', 'other']
      },
      expiryDate: Date
    },
    products: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    }],
    capacity: {
      monthlyVolume: Number,
      unit: {
        type: String,
        enum: ['kg', 'tonne', 'litre', 'pièce']
      }
    },
    certifications: [{
      type: String,
      enum: ['bio', 'fair_trade', 'organic', 'halal', 'kosher', 'gap', 'global_gap']
    }],
    regions: [{
      type: String,
      trim: true
    }],
    verified: {
      type: Boolean,
      default: false
    },
    verificationDate: Date,
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    }
  },

  // Champs pour les clients
  customerInfo: {
    customerType: {
      type: String,
      enum: ['individual', 'company', 'distributor', 'retailer'],
      default: 'individual'
    },
    interests: [{
      type: String,
      enum: [
        'farines-locales',
        'produits-agro-alimentaires',
        'epices-condiments',
        'produits-transformes',
        'produits-bruts-agricoles',
        'produits-export'
      ]
    }],
    preferredPaymentMethods: [{
      type: String,
      enum: ['bank_transfer', 'cash', 'mobile_money', 'credit_card', 'paypal']
    }],
    shippingAddress: {
      street: String,
      city: String,
      region: String,
      country: {
        type: String,
        default: 'Cameroun'
      },
      postalCode: String,
      isDefault: {
        type: Boolean,
        default: true
      }
    },
    billingAddress: {
      street: String,
      city: String,
      region: String,
      country: {
        type: String,
        default: 'Cameroun'
      },
      postalCode: String,
      isDefault: {
        type: Boolean,
        default: true
      }
    }
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      // Supprimer les champs sensibles
      delete ret.password;
      delete ret.passwordResetToken;
      delete ret.passwordResetExpires;
      delete ret.emailVerificationToken;
      delete ret.emailVerificationExpires;
      delete ret.twoFactorSecret;
      delete ret.loginAttempts;
      delete ret.lockUntil;
      return ret;
    }
  },
  toObject: { virtuals: true }
});

// Index pour les performances
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1, status: 1 });
userSchema.index({ 'profile.company.name': 1 });
userSchema.index({ 'supplierInfo.businessType': 1 });
userSchema.index({ 'customerInfo.customerType': 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ lastLogin: -1 });
userSchema.index({ 'stats.totalSpent': -1 });
userSchema.index({ 'supplierInfo.verified': 1 });

// Virtual pour le nom complet
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual pour vérifier si l'utilisateur est verrouillé
userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Virtual pour le statut de vérification
userSchema.virtual('verificationStatus').get(function() {
  if (this.emailVerified) return 'verified';
  if (this.emailVerificationToken && this.emailVerificationExpires > Date.now()) return 'pending';
  return 'unverified';
});

// Virtual pour les permissions (basé sur le rôle)
userSchema.virtual('permissions').get(function() {
  const rolePermissions = {
    admin: [
      'manage_users',
      'manage_products',
      'manage_orders',
      'manage_content',
      'view_analytics',
      'manage_settings',
      'delete_data'
    ],
    manager: [
      'manage_products',
      'manage_orders',
      'view_analytics',
      'manage_content'
    ],
    sales: [
      'manage_products',
      'manage_orders',
      'view_analytics'
    ],
    supplier: [
      'manage_own_products',
      'view_orders',
      'update_profile'
    ],
    customer: [
      'place_orders',
      'view_own_orders',
      'update_profile',
      'leave_reviews'
    ],
    partner: [
      'view_products',
      'place_orders',
      'update_profile',
      'refer_clients'
    ]
  };

  return rolePermissions[this.role] || [];
});

// Virtual pour vérifier si le profil est complet
userSchema.virtual('isProfileComplete').get(function() {
  const requiredFields = ['firstName', 'lastName', 'email', 'phone'];
  const profileFields = ['avatar', 'bio', 'company.name'];

  const basicComplete = requiredFields.every(field => {
    const value = this.get(field);
    return value && value.toString().trim().length > 0;
  });

  const profileComplete = profileFields.some(field => {
    const value = this.get(field);
    return value && value.toString().trim().length > 0;
  });

  return basicComplete && profileComplete;
});

// Virtual pour le niveau de fidélité
userSchema.virtual('loyaltyLevel').get(function() {
  const spent = this.stats.totalSpent;
  if (spent >= 10000000) return 'platinum'; // 10M XAF
  if (spent >= 5000000) return 'gold'; // 5M XAF
  if (spent >= 1000000) return 'silver'; // 1M XAF
  if (spent >= 100000) return 'bronze'; // 100K XAF
  return 'new';
});

// Middleware pour hasher le mot de passe
userSchema.pre('save', async function(next) {
  // Hasher le mot de passe seulement s'il a été modifié
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Middleware pour mettre à jour la complétude du profil
userSchema.pre('save', function(next) {
  if (this.isModified()) {
    // Calculer la complétude du profil
    let completeness = 0;
    const fields = [
      'firstName', 'lastName', 'email', 'phone',
      'profile.avatar', 'profile.bio', 'profile.company.name'
    ];

    fields.forEach(field => {
      const value = this.get(field);
      if (value && value.toString().trim().length > 0) {
        completeness += 100 / fields.length;
      }
    });

    this.stats.profileCompleteness = Math.round(completeness);
  }
  next();
});

// Méthode d'instance pour comparer les mots de passe
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Méthode d'instance pour incrémenter les tentatives de connexion
userSchema.methods.incLoginAttempts = function() {
  if (this.loginAttempts >= 5) {
    this.lockUntil = Date.now() + 2 * 60 * 60 * 1000; // 2 heures
  } else {
    this.loginAttempts += 1;
  }
  return this.save();
};

// Méthode d'instance pour réinitialiser les tentatives de connexion
userSchema.methods.resetLoginAttempts = function() {
  this.loginAttempts = 0;
  this.lockUntil = undefined;
  return this.save();
};

// Méthode d'instance pour vérifier si l'utilisateur peut se connecter
userSchema.methods.canLogin = function() {
  return !this.isLocked && this.status === 'active';
};

// Méthode d'instance pour mettre à jour la dernière activité
userSchema.methods.updateLastActivity = function(ip, userAgent) {
  this.lastActivity = new Date();
  if (ip) this.ipAddress = ip;
  if (userAgent) this.userAgent = userAgent;
  return this.save({ validateBeforeSave: false });
};

// Méthode d'instance pour mettre à jour les statistiques
userSchema.methods.updateStats = function(orderTotal = 0) {
  if (orderTotal > 0) {
    this.stats.totalOrders += 1;
    this.stats.totalSpent += orderTotal;
    this.stats.lastOrderDate = new Date();

    // Calculer la valeur moyenne des commandes
    this.stats.averageOrderValue = this.stats.totalSpent / this.stats.totalOrders;
  }

  this.stats.loginCount += 1;
  return this.save();
};

// Méthode d'instance pour ajouter un produit favori
userSchema.methods.addFavorite = function(productId) {
  if (!this.favoriteProducts.includes(productId)) {
    this.favoriteProducts.push(productId);
    return this.save();
  }
  return this;
};

// Méthode d'instance pour supprimer un produit favori
userSchema.methods.removeFavorite = function(productId) {
  this.favoriteProducts = this.favoriteProducts.filter(id => id.toString() !== productId.toString());
  return this.save();
};

// Méthode d'instance pour vérifier si un produit est favori
userSchema.methods.isFavorite = function(productId) {
  return this.favoriteProducts.some(id => id.toString() === productId.toString());
};

// Méthode d'instance pour accepter les consentements
userSchema.methods.acceptConsents = function(terms = false, privacy = false, marketing = false, dataProcessing = false) {
  const now = new Date();

  if (terms) {
    this.consents.termsAccepted = true;
    this.consents.termsAcceptedAt = now;
  }

  if (privacy) {
    this.consents.privacyAccepted = true;
    this.consents.privacyAcceptedAt = now;
  }

  if (marketing) {
    this.consents.marketingAccepted = true;
    this.consents.marketingAcceptedAt = now;
  }

  if (dataProcessing) {
    this.consents.dataProcessingAccepted = true;
    this.consents.dataProcessingAcceptedAt = now;
  }

  return this.save();
};

// Méthode d'instance pour ajouter une note interne
userSchema.methods.addInternalNote = function(note, createdBy) {
  this.internalNotes.push({
    note,
    createdBy,
    createdAt: new Date()
  });
  return this.save();
};

// Méthode statique pour trouver les utilisateurs par rôle
userSchema.statics.findByRole = function(role, options = {}) {
  return this.find({ role, status: 'active' })
    .sort(options.sort || { createdAt: -1 })
    .limit(options.limit || 50)
    .skip(options.skip || 0);
};

// Méthode statique pour trouver les fournisseurs vérifiés
userSchema.statics.findVerifiedSuppliers = function(options = {}) {
  return this.find({
    role: 'supplier',
    status: 'active',
    'supplierInfo.verified': true
  })
  .sort(options.sort || { 'supplierInfo.rating': -1 })
  .limit(options.limit || 20)
  .skip(options.skip || 0);
};

// Méthode statique pour trouver les meilleurs clients
userSchema.statics.findTopCustomers = function(limit = 10) {
  return this.find({
    role: 'customer',
    status: 'active'
  })
  .sort({ 'stats.totalSpent': -1 })
  .limit(limit);
};

// Méthode statique pour rechercher des utilisateurs
userSchema.statics.search = function(query, options = {}) {
  const searchRegex = new RegExp(query, 'i');
  const searchQuery = {
    $or: [
      { firstName: searchRegex },
      { lastName: searchRegex },
      { email: searchRegex },
      { 'profile.company.name': searchRegex }
    ],
    status: 'active'
  };

  return this.find(searchQuery)
    .sort(options.sort || { createdAt: -1 })
    .limit(options.limit || 20)
    .skip(options.skip || 0);
};

// Méthode statique pour obtenir les statistiques des utilisateurs
userSchema.statics.getStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: null,
        totalUsers: { $sum: 1 },
        activeUsers: {
          $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
        },
        adminUsers: {
          $sum: { $cond: [{ $eq: ['$role', 'admin'] }, 1, 0] }
        },
        supplierUsers: {
          $sum: { $cond: [{ $eq: ['$role', 'supplier'] }, 1, 0] }
        },
        customerUsers: {
          $sum: { $cond: [{ $eq: ['$role', 'customer'] }, 1, 0] }
        },
        verifiedSuppliers: {
          $sum: { $cond: [
            { $and: [
              { $eq: ['$role', 'supplier'] },
              { $eq: ['$supplierInfo.verified', true] }
            ]}, 1, 0
          ]}
        },
        totalSpent: { $sum: '$stats.totalSpent' },
        averageSpent: { $avg: '$stats.totalSpent' }
      }
    }
  ]);
};

// Méthode statique pour nettoyer les comptes inactifs
userSchema.statics.cleanInactiveAccounts = function(daysInactive = 365) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysInactive);

  return this.updateMany(
    {
      lastLogin: { $lt: cutoffDate },
      status: 'active',
      role: { $ne: 'admin' }
    },
    {
      $set: { status: 'inactive' }
    }
  );
};

// Méthode statique pour générer un token de réinitialisation de mot de passe
userSchema.statics.generatePasswordResetToken = function() {
  const crypto = require('crypto');
  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  return { resetToken, hashedToken };
};

module.exports = mongoose.model('User', userSchema);