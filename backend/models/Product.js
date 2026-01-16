const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  // Informations de base
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
    index: true
  },
  slug: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true,
    index: true
  },
  sku: {
    type: String,
    unique: true,
    trim: true,
    uppercase: true,
    index: true
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  shortDescription: {
    type: String,
    trim: true,
    maxlength: 300
  },

  // Catégorisation
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
    index: true
  },
  subcategories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
    index: true
  }],
  attributes: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    value: {
      type: String,
      required: true,
      trim: true
    },
    unit: {
      type: String,
      trim: true
    },
    isFilterable: {
      type: Boolean,
      default: false
    }
  }],

  // Prix et tarification
  pricing: {
    basePrice: {
      type: Number,
      required: true,
      min: 0
    },
    salePrice: {
      type: Number,
      min: 0,
      validate: {
        validator: function(value) {
          return !value || value < this.basePrice;
        },
        message: 'Sale price must be less than base price'
      }
    },
    currency: {
      type: String,
      default: 'XAF',
      enum: ['XAF', 'EUR', 'USD', 'GBP']
    },
    priceType: {
      type: String,
      enum: ['fixed', 'negotiable', 'quote_required'],
      default: 'fixed'
    },
    bulkPricing: [{
      minQuantity: {
        type: Number,
        required: true,
        min: 1
      },
      maxQuantity: {
        type: Number,
        min: 1
      },
      price: {
        type: Number,
        required: true,
        min: 0
      },
      discount: {
        type: Number,
        min: 0,
        max: 100
      }
    }],
    moq: {
      type: Number,
      default: 1,
      min: 1
    },
    unit: {
      type: String,
      default: 'kg',
      enum: ['kg', 'g', 't', 'l', 'ml', 'pcs', 'box', 'carton', 'sack', 'bag']
    }
  },

  // Inventaire et stock
  inventory: {
    stockQuantity: {
      type: Number,
      default: 0,
      min: 0
    },
    stockStatus: {
      type: String,
      enum: ['in_stock', 'low_stock', 'out_of_stock', 'on_demand'],
      default: 'in_stock'
    },
    lowStockThreshold: {
      type: Number,
      default: 10,
      min: 0
    },
    backorderAllowed: {
      type: Boolean,
      default: false
    },
    stockLocation: {
      type: String,
      trim: true
    },
    expiryDate: {
      type: Date
    },
    batchNumber: {
      type: String,
      trim: true
    }
  },

  // Médias
  images: [{
    url: {
      type: String,
      required: true,
      trim: true
    },
    alt: {
      type: String,
      trim: true
    },
    isPrimary: {
      type: Boolean,
      default: false
    },
    order: {
      type: Number,
      default: 0
    },
    metadata: {
      width: Number,
      height: Number,
      size: Number,
      format: String
    }
  }],
  videos: [{
    url: {
      type: String,
      trim: true
    },
    title: {
      type: String,
      trim: true
    },
    thumbnail: {
      type: String,
      trim: true
    },
    duration: Number
  }],
  documents: [{
    url: {
      type: String,
      trim: true
    },
    title: {
      type: String,
      trim: true
    },
    type: {
      type: String,
      enum: ['certificate', 'spec_sheet', 'manual', 'other']
    }
  }],

  // Origine et provenance
  origin: {
    country: {
      type: String,
      required: true,
      default: 'Cameroon'
    },
    region: {
      type: String,
      trim: true
    },
    farm: {
      type: String,
      trim: true
    },
    producer: {
      type: String,
      trim: true
    },
    cooperative: {
      type: String,
      trim: true
    },
    harvestDate: {
      type: Date
    },
    processingDate: {
      type: Date
    }
  },

  // Certifications et conformité
  certifications: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    issuer: {
      type: String,
      trim: true
    },
    number: {
      type: String,
      trim: true
    },
    expiryDate: {
      type: Date
    },
    document: {
      type: String,
      trim: true
    },
    verified: {
      type: Boolean,
      default: false
    }
  }],
  compliance: {
    organic: {
      type: Boolean,
      default: false
    },
    fairTrade: {
      type: Boolean,
      default: false
    },
    gmoFree: {
      type: Boolean,
      default: false
    },
    halal: {
      type: Boolean,
      default: false
    },
    kosher: {
      type: Boolean,
      default: false
    },
    standards: [{
      type: String,
      enum: ['ISO', 'HACCP', 'GMP', 'GAP', 'GLOBALGAP']
    }]
  },

  // Conditionnement et logistique
  packaging: {
    type: {
      type: String,
      enum: ['bulk', 'retail', 'wholesale'],
      default: 'bulk'
    },
    unitWeight: {
      type: Number,
      min: 0
    },
    unitWeightUnit: {
      type: String,
      default: 'kg',
      enum: ['kg', 'g', 't', 'l', 'ml']
    },
    packageWeight: {
      type: Number,
      min: 0
    },
    packageDimensions: {
      length: Number,
      width: Number,
      height: Number,
      unit: {
        type: String,
        default: 'cm',
        enum: ['cm', 'm', 'mm', 'in']
      }
    },
    palletCapacity: {
      type: Number,
      min: 1
    },
    containerCapacity: {
      type: Number,
      min: 1
    }
  },

  // Logistique et transport
  shipping: {
    weight: {
      type: Number,
      min: 0
    },
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    },
    incoterms: [{
      type: String,
      enum: ['FOB', 'CIF', 'DDP', 'EXW', 'FCA', 'CPT', 'CIP', 'DAT', 'DAP']
    }],
    ports: [{
      type: String,
      trim: true
    }],
    leadTime: {
      type: Number,
      min: 1
    },
    leadTimeUnit: {
      type: String,
      default: 'days',
      enum: ['hours', 'days', 'weeks', 'months']
    },
    shippingClass: {
      type: String,
      enum: ['standard', 'express', 'refrigerated', 'hazardous', 'fragile']
    }
  },

  // Configuration d'affichage
  display: {
    featured: {
      type: Boolean,
      default: false,
      index: true
    },
    trending: {
      type: Boolean,
      default: false,
      index: true
    },
    onSale: {
      type: Boolean,
      default: false,
      index: true
    },
    newArrival: {
      type: Boolean,
      default: false,
      index: true
    },
    bestseller: {
      type: Boolean,
      default: false,
      index: true
    },
    order: {
      type: Number,
      default: 0,
      index: true
    },
    badge: {
      type: String,
      trim: true,
      enum: ['nouveau', 'tendance', 'promotion', 'bio', 'local']
    }
  },

  // SEO
  seo: {
    metaTitle: {
      type: String,
      trim: true,
      maxlength: 60
    },
    metaDescription: {
      type: String,
      trim: true,
      maxlength: 160
    },
    metaKeywords: [{
      type: String,
      trim: true,
      lowercase: true
    }],
    canonicalUrl: {
      type: String,
      trim: true
    }
  },

  // Statut et visibilité
  status: {
    type: String,
    enum: ['draft', 'pending_review', 'published', 'archived', 'suspended'],
    default: 'draft',
    index: true
  },
  visibility: {
    type: String,
    enum: ['public', 'private', 'partners_only', 'wholesale_only'],
    default: 'public',
    index: true
  },
  publishedAt: {
    type: Date,
    index: true
  },

  // Statistiques
  stats: {
    viewCount: {
      type: Number,
      default: 0,
      index: true
    },
    inquiryCount: {
      type: Number,
      default: 0,
      index: true
    },
    orderCount: {
      type: Number,
      default: 0,
      index: true
    },
    favoriteCount: {
      type: Number,
      default: 0,
      index: true
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
      index: true
    },
    reviewCount: {
      type: Number,
      default: 0,
      index: true
    },
    conversionRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    lastViewed: {
      type: Date
    },
    lastOrdered: {
      type: Date
    }
  },

  // Avis et commentaires
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    title: {
      type: String,
      trim: true,
      maxlength: 100
    },
    comment: {
      type: String,
      trim: true,
      maxlength: 500
    },
    verified: {
      type: Boolean,
      default: false
    },
    helpful: {
      type: Number,
      default: 0
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],

  // Métadonnées
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  // Champs personnalisés
  customFields: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index pour les performances
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, status: 1, visibility: 1 });
productSchema.index({ 'pricing.basePrice': 1 });
productSchema.index({ 'pricing.salePrice': 1 });
productSchema.index({ 'inventory.stockStatus': 1 });
productSchema.index({ 'display.featured': 1 });
productSchema.index({ 'display.trending': 1 });
productSchema.index({ 'display.onSale': 1 });
productSchema.index({ 'display.newArrival': 1 });
productSchema.index({ 'display.bestseller': 1 });
productSchema.index({ 'stats.viewCount': -1 });
productSchema.index({ 'stats.averageRating': -1 });
productSchema.index({ 'stats.orderCount': -1 });
productSchema.index({ publishedAt: -1 });
productSchema.index({ createdAt: -1 });

// Virtual pour l'URL
productSchema.virtual('url').get(function() {
  return `/products/${this.slug}`;
});

// Virtual pour vérifier si le produit est en promotion
productSchema.virtual('isOnSale').get(function() {
  return this.pricing.salePrice && this.pricing.salePrice < this.pricing.basePrice;
});

// Virtual pour calculer le pourcentage de réduction
productSchema.virtual('discountPercentage').get(function() {
  if (this.isOnSale) {
    return Math.round(((this.pricing.basePrice - this.pricing.salePrice) / this.pricing.basePrice) * 100);
  }
  return 0;
});

// Virtual pour vérifier si le stock est faible
productSchema.virtual('isLowStock').get(function() {
  return this.inventory.stockQuantity <= this.inventory.lowStockThreshold;
});

// Virtual pour vérifier si le produit est épuisé
productSchema.virtual('isOutOfStock').get(function() {
  return this.inventory.stockStatus === 'out_of_stock' || this.inventory.stockQuantity === 0;
});

// Virtual pour vérifier si le produit est disponible
productSchema.virtual('isAvailable').get(function() {
  return this.status === 'published' &&
         this.visibility === 'public' &&
         !this.isOutOfStock;
});

// Virtual pour obtenir l'image principale
productSchema.virtual('primaryImage').get(function() {
  if (this.images && this.images.length > 0) {
    const primary = this.images.find(img => img.isPrimary);
    return primary || this.images[0];
  }
  return null;
});

// Virtual pour vérifier si le produit a des certifications
productSchema.virtual('hasCertifications').get(function() {
  return this.certifications && this.certifications.length > 0;
});

// Virtual pour vérifier si le produit est bio
productSchema.virtual('isOrganic').get(function() {
  return this.compliance.organic === true;
});

// Virtual pour obtenir le prix actuel
productSchema.virtual('currentPrice').get(function() {
  return this.pricing.salePrice || this.pricing.basePrice;
});

// Virtual pour obtenir les avis récents
productSchema.virtual('recentReviews', {
  ref: 'Product',
  localField: '_id',
  foreignField: '_id',
  options: {
    sort: { 'reviews.createdAt': -1 },
    limit: 5
  }
});

// Middleware pour générer le slug et SKU
productSchema.pre('save', function(next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }

  if (!this.sku) {
    // Générer un SKU basé sur la catégorie et un numéro aléatoire
    const categoryPrefix = this.category ? this.category.toString().slice(-4).toUpperCase() : 'PROD';
    const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.sku = `${categoryPrefix}-${randomNum}`;
  }

  // Mettre à jour le statut de stock
  if (this.inventory.stockQuantity === 0) {
    this.inventory.stockStatus = 'out_of_stock';
  } else if (this.inventory.stockQuantity <= this.inventory.lowStockThreshold) {
    this.inventory.stockStatus = 'low_stock';
  } else {
    this.inventory.stockStatus = 'in_stock';
  }

  // Mettre à jour la date de publication
  if (this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }

  next();
});

// Middleware pour mettre à jour les statistiques de la catégorie
productSchema.post('save', async function(doc) {
  if (doc.category) {
    const Category = mongoose.model('Category');
    const productCount = await mongoose.model('Product').countDocuments({
      category: doc.category,
      status: 'published'
    });

    await Category.findByIdAndUpdate(doc.category, {
      'stats.productCount': productCount,
      'stats.lastUpdated': new Date()
    });
  }
});

// Middleware pour nettoyer lors de la suppression
productSchema.pre('remove', async function(next) {
  // Mettre à jour les statistiques de la catégorie
  if (this.category) {
    const Category = mongoose.model('Category');
    const productCount = await mongoose.model('Product').countDocuments({
      category: this.category,
      status: 'published',
      _id: { $ne: this._id }
    });

    await Category.findByIdAndUpdate(this.category, {
      'stats.productCount': productCount,
      'stats.lastUpdated': new Date()
    });
  }

  next();
});

// Méthode d'instance pour incrémenter les vues
productSchema.methods.incrementViews = function() {
  this.stats.viewCount += 1;
  this.stats.lastViewed = new Date();
  return this.save();
};

// Méthode d'instance pour incrémenter les demandes de devis
productSchema.methods.incrementInquiries = function() {
  this.stats.inquiryCount += 1;
  return this.save();
};

// Méthode d'instance pour incrémenter les commandes
productSchema.methods.incrementOrders = function() {
  this.stats.orderCount += 1;
  this.stats.lastOrdered = new Date();
  return this.save();
};

// Méthode d'instance pour ajouter un avis
productSchema.methods.addReview = function(reviewData) {
  this.reviews.push(reviewData);

  // Recalculer la moyenne des avis
  const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
  this.stats.averageRating = totalRating / this.reviews.length;
  this.stats.reviewCount = this.reviews.length;

  return this.save();
};

// Méthode d'instance pour obtenir le prix pour une quantité donnée
productSchema.methods.getPriceForQuantity = function(quantity) {
  if (this.pricing.bulkPricing && this.pricing.bulkPricing.length > 0) {
    const applicablePricing = this.pricing.bulkPricing
      .filter(bp => quantity >= bp.minQuantity && (!bp.maxQuantity || quantity <= bp.maxQuantity))
      .sort((a, b) => b.minQuantity - a.minQuantity)[0];

    if (applicablePricing) {
      return applicablePricing.price;
    }
  }

  return this.currentPrice;
};

// Méthode d'instance pour vérifier la disponibilité pour une quantité donnée
productSchema.methods.checkAvailability = function(quantity) {
  if (this.inventory.stockStatus === 'out_of_stock') {
    return false;
  }

  if (this.inventory.stockStatus === 'on_demand') {
    return true;
  }

  return this.inventory.stockQuantity >= quantity;
};

// Méthode d'instance pour obtenir les produits similaires
productSchema.methods.getSimilarProducts = function(limit = 6) {
  return mongoose.model('Product').find({
    category: this.category,
    status: 'published',
    visibility: 'public',
    _id: { $ne: this._id }
  })
  .sort({ 'stats.averageRating': -1, 'stats.viewCount': -1 })
  .limit(limit);
};

// Méthode d'instance pour obtenir les produits complémentaires
productSchema.methods.getRelatedProducts = function(limit = 6) {
  return mongoose.model('Product').find({
    tags: { $in: this.tags },
    status: 'published',
    visibility: 'public',
    _id: { $ne: this._id }
  })
  .sort({ 'stats.averageRating': -1 })
  .limit(limit);
};

// Méthode d'instance pour obtenir les statistiques détaillées
productSchema.methods.getDetailedStats = function() {
  return {
    totalViews: this.stats.viewCount,
    totalInquiries: this.stats.inquiryCount,
    totalOrders: this.stats.orderCount,
    conversionRate: this.stats.viewCount > 0 ?
      (this.stats.orderCount / this.stats.viewCount) * 100 : 0,
    inquiryConversionRate: this.stats.inquiryCount > 0 ?
      (this.stats.orderCount / this.stats.inquiryCount) * 100 : 0,
    averageRating: this.stats.averageRating,
    reviewCount: this.stats.reviewCount,
    stockValue: this.inventory.stockQuantity * this.currentPrice,
    daysSinceLastOrder: this.stats.lastOrdered ?
      Math.floor((Date.now() - this.stats.lastOrdered) / (1000 * 60 * 60 * 24)) : null,
    daysSinceLastView: this.stats.lastViewed ?
      Math.floor((Date.now() - this.stats.lastViewed) / (1000 * 60 * 60 * 24)) : null
  };
};

// Méthode statique pour obtenir les produits populaires
productSchema.statics.getPopularProducts = function(limit = 12, category = null) {
  const query = {
    status: 'published',
    visibility: 'public'
  };

  if (category) {
    query.category = category;
  }

  return this.find(query)
    .sort({ 'stats.viewCount': -1, 'stats.averageRating': -1 })
    .limit(limit)
    .populate('category', 'name slug');
};

// Méthode statique pour obtenir les produits vedettes
productSchema.statics.getFeaturedProducts = function(limit = 12) {
  return this.find({
    'display.featured': true,
    status: 'published',
    visibility: 'public'
  })
  .sort({ 'display.order': 1, 'stats.averageRating': -1 })
  .limit(limit)
  .populate('category', 'name slug');
};

// Méthode statique pour obtenir les produits en promotion
productSchema.statics.getOnSaleProducts = function(limit = 12) {
  return this.find({
    'pricing.salePrice': { $exists: true, $ne: null },
    status: 'published',
    visibility: 'public'
  })
  .sort({ 'pricing.salePrice': 1 })
  .limit(limit)
  .populate('category', 'name slug');
};

// Méthode statique pour obtenir les nouveaux produits
productSchema.statics.getNewArrivals = function(limit = 12, days = 30) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  return this.find({
    publishedAt: { $gte: cutoffDate },
    status: 'published',
    visibility: 'public'
  })
  .sort({ publishedAt: -1 })
  .limit(limit)
  .populate('category', 'name slug');
};

// Méthode statique pour obtenir les produits tendance
productSchema.statics.getTrendingProducts = function(limit = 12) {
  return this.find({
    'display.trending': true,
    status: 'published',
    visibility: 'public'
  })
  .sort({ 'stats.viewCount': -1 })
  .limit(limit)
  .populate('category', 'name slug');
};

// Méthode statique pour obtenir les best-sellers
productSchema.statics.getBestsellers = function(limit = 12) {
  return this.find({
    'display.bestseller': true,
    status: 'published',
    visibility: 'public'
  })
  .sort({ 'stats.orderCount': -1 })
  .limit(limit)
  .populate('category', 'name slug');
};

// Méthode statique pour rechercher des produits
productSchema.statics.search = function(query, options = {}) {
  const searchQuery = {
    $text: { $search: query },
    status: 'published',
    visibility: 'public'
  };

  if (options.category) {
    searchQuery.category = options.category;
  }

  if (options.minPrice || options.maxPrice) {
    searchQuery['pricing.basePrice'] = {};
    if (options.minPrice) searchQuery['pricing.basePrice'].$gte = options.minPrice;
    if (options.maxPrice) searchQuery['pricing.basePrice'].$lte = options.maxPrice;
  }

  if (options.tags && options.tags.length > 0) {
    searchQuery.tags = { $in: options.tags };
  }

  if (options.origin) {
    searchQuery['origin.country'] = options.origin;
  }

  if (options.certifications && options.certifications.length > 0) {
    searchQuery['certifications.name'] = { $in: options.certifications };
  }

  const sortOptions = {};
  switch (options.sortBy) {
    case 'price_asc':
      sortOptions['pricing.basePrice'] = 1;
      break;
    case 'price_desc':
      sortOptions['pricing.basePrice'] = -1;
      break;
    case 'rating':
      sortOptions['stats.averageRating'] = -1;
      break;
    case 'newest':
      sortOptions.publishedAt = -1;
      break;
    case 'popular':
    default:
      sortOptions['stats.viewCount'] = -1;
      break;
  }

  return this.find(searchQuery, { score: { $meta: 'textScore' } })
    .sort(sortOptions)
    .limit(options.limit || 20)
    .skip(options.skip || 0)
    .populate('category', 'name slug');
};

// Méthode statique pour obtenir les produits par catégorie
productSchema.statics.getByCategory = function(categoryId, options = {}) {
  const query = {
    category: categoryId,
    status: 'published',
    visibility: 'public'
  };

  const sortOptions = {};
  switch (options.sortBy) {
    case 'price_asc':
      sortOptions['pricing.basePrice'] = 1;
      break;
    case 'price_desc':
      sortOptions['pricing.basePrice'] = -1;
      break;
    case 'rating':
      sortOptions['stats.averageRating'] = -1;
      break;
    case 'newest':
      sortOptions.publishedAt = -1;
      break;
    case 'popular':
    default:
      sortOptions['stats.viewCount'] = -1;
      break;
  }

  return this.find(query)
    .sort(sortOptions)
    .limit(options.limit || 20)
    .skip(options.skip || 0)
    .populate('category', 'name slug');
};

// Méthode statique pour obtenir les statistiques globales des produits
productSchema.statics.getGlobalStats = function() {
  return this.aggregate([
    {
      $match: { status: 'published' }
    },
    {
      $group: {
        _id: null,
        totalProducts: { $sum: 1 },
        totalValue: {
          $sum: {
            $multiply: ['$pricing.basePrice', '$inventory.stockQuantity']
          }
        },
        averagePrice: { $avg: '$pricing.basePrice' },
        minPrice: { $min: '$pricing.basePrice' },
        maxPrice: { $max: '$pricing.basePrice' },
        totalViews: { $sum: '$stats.viewCount' },
        totalInquiries: { $sum: '$stats.inquiryCount' },
        totalOrders: { $sum: '$stats.orderCount' },
        averageRating: { $avg: '$stats.averageRating' },
        productsOnSale: {
          $sum: {
            $cond: [
              { $and: [{ $ne: ['$pricing.salePrice', null] }, { $lt: ['$pricing.salePrice', '$pricing.basePrice'] }] },
              1,
              0
            ]
          }
        },
        lowStockProducts: {
          $sum: {
            $cond: [
              { $lte: ['$inventory.stockQuantity', '$inventory.lowStockThreshold'] },
              1,
              0
            ]
          }
        },
        outOfStockProducts: {
          $sum: {
            $cond: {
              if: { $eq: ['$inventory.stockStatus', 'out_of_stock'] },
              then: 1,
              else: 0
            }
          }
        },
        organicProducts: {
          $sum: { $cond: ['$compliance.organic', 1, 0] }
        },
        certifiedProducts: {
          $sum: {
            $cond: [
              { $gt: [{ $size: '$certifications' }, 0] },
              1,
              0
            ]
          }
        }
      }
    }
  ]);
};

// Méthode statique pour obtenir les produits en rupture de stock
productSchema.statics.getLowStockProducts = function(limit = 20) {
  return this.find({
    $or: [
      { 'inventory.stockStatus': 'low_stock' },
      { 'inventory.stockStatus': 'out_of_stock' }
    ],
    status: 'published'
  })
  .sort({ 'inventory.stockQuantity': 1 })
  .limit(limit)
  .populate('category', 'name slug');
};

// Méthode statique pour obtenir les produits expirant bientôt
productSchema.statics.getExpiringProducts = function(days = 30) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() + days);

  return this.find({
    'inventory.expiryDate': { $lte: cutoffDate, $exists: true },
    status: 'published'
  })
  .sort({ 'inventory.expiryDate': 1 })
  .populate('category', 'name slug');
};

// Méthode statique pour créer un produit avec validation
productSchema.statics.createWithValidation = async function(data) {
  // Vérifier l'unicité du slug
  if (data.slug) {
    const existingProduct = await this.findOne({ slug: data.slug });
    if (existingProduct) {
      throw new Error('Product slug already exists');
    }
  }

  // Vérifier l'unicité du SKU
  if (data.sku) {
    const existingProduct = await this.findOne({ sku: data.sku });
    if (existingProduct) {
      throw new Error('Product SKU already exists');
    }
  }

  // Vérifier que la catégorie existe
  if (data.category) {
    const Category = mongoose.model('Category');
    const category = await Category.findById(data.category);
    if (!category) {
      throw new Error('Category not found');
    }
  }

  // Validation des prix
  if (data.pricing) {
    if (data.pricing.salePrice && data.pricing.salePrice >= data.pricing.basePrice) {
      throw new Error('Sale price must be less than base price');
    }

    if (data.pricing.bulkPricing) {
      for (const bp of data.pricing.bulkPricing) {
        if (bp.maxQuantity && bp.minQuantity > bp.maxQuantity) {
          throw new Error('Bulk pricing min quantity cannot be greater than max quantity');
        }
      }
    }
  }

  return this.create(data);
};

module.exports = mongoose.model('Product', productSchema);