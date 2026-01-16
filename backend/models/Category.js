const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  // Informations de base
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
    index: true
  },
  slug: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true,
    index: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },

  // Hiérarchie
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null,
    index: true
  },
  ancestors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  level: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
    index: true
  },

  // Médias
  image: {
    url: {
      type: String,
      trim: true
    },
    alt: {
      type: String,
      trim: true
    },
    metadata: {
      width: Number,
      height: Number,
      size: Number,
      format: String
    }
  },
  icon: {
    type: String,
    trim: true
  },

  // Configuration d'affichage
  display: {
    order: {
      type: Number,
      default: 0,
      index: true
    },
    featured: {
      type: Boolean,
      default: false,
      index: true
    },
    showInMenu: {
      type: Boolean,
      default: true
    },
    showInHome: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      trim: true,
      default: '#2d5a27'
    },
    badge: {
      type: String,
      trim: true,
      enum: ['nouveau', 'tendance', 'populaire', 'saisonnier']
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
    enum: ['active', 'inactive', 'archived'],
    default: 'active',
    index: true
  },
  visibility: {
    type: String,
    enum: ['public', 'private', 'partners_only'],
    default: 'public',
    index: true
  },

  // Statistiques
  stats: {
    productCount: {
      type: Number,
      default: 0,
      index: true
    },
    viewCount: {
      type: Number,
      default: 0,
      index: true
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    }
  },

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
categorySchema.index({ name: 'text', description: 'text' });
categorySchema.index({ parent: 1, level: 1 });
categorySchema.index({ 'display.order': 1 });
categorySchema.index({ 'display.featured': 1 });
categorySchema.index({ 'stats.productCount': -1 });
categorySchema.index({ 'stats.viewCount': -1 });
categorySchema.index({ status: 1, visibility: 1 });
categorySchema.index({ createdAt: -1 });

// Virtual pour l'URL
categorySchema.virtual('url').get(function() {
  return `/categories/${this.slug}`;
});

// Virtual pour vérifier si c'est une catégorie parente
categorySchema.virtual('isParent').get(function() {
  return this.level === 0;
});

// Virtual pour vérifier si c'est une sous-catégorie
categorySchema.virtual('isChild').get(function() {
  return this.level > 0;
});

// Virtual pour obtenir le chemin complet
categorySchema.virtual('fullPath').get(function() {
  if (this.ancestors && this.ancestors.length > 0) {
    return [...this.ancestors.map(a => a.name), this.name].join(' > ');
  }
  return this.name;
});

// Virtual pour vérifier si la catégorie a des produits
categorySchema.virtual('hasProducts').get(function() {
  return this.stats.productCount > 0;
});

// Virtual pour vérifier si la catégorie est vide
categorySchema.virtual('isEmpty').get(function() {
  return this.stats.productCount === 0;
});

// Virtual pour obtenir les catégories enfants
categorySchema.virtual('children', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parent',
  options: { sort: { 'display.order': 1 } }
});

// Virtual pour obtenir les produits de la catégorie
categorySchema.virtual('products', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'category',
  options: {
    match: { status: 'published', visibility: 'public' },
    sort: { 'stats.averageRating': -1, 'stats.viewCount': -1 },
    limit: 12
  }
});

// Middleware pour générer le slug
categorySchema.pre('save', function(next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }

  // Mettre à jour les ancêtres si c'est une sous-catégorie
  if (this.parent && this.isModified('parent')) {
    this.constructor.findById(this.parent).then(parent => {
      if (parent) {
        this.ancestors = [...parent.ancestors, parent._id];
        this.level = parent.level + 1;
      }
      next();
    }).catch(next);
  } else {
    next();
  }
});

// Middleware pour mettre à jour les niveaux des sous-catégories lors de la modification
categorySchema.post('save', async function(doc) {
  if (doc.isModified('parent') || doc.isModified('name')) {
    // Mettre à jour les ancêtres et niveaux des sous-catégories
    await updateChildrenAncestors(doc._id);
  }
});

// Fonction récursive pour mettre à jour les ancêtres des sous-catégories
async function updateChildrenAncestors(categoryId) {
  const Category = mongoose.model('Category');

  const children = await Category.find({ parent: categoryId });

  for (const child of children) {
    const parent = await Category.findById(categoryId);
    if (parent) {
      child.ancestors = [...parent.ancestors, parent._id];
      child.level = parent.level + 1;
      await child.save();

      // Récursion pour les sous-sous-catégories
      await updateChildrenAncestors(child._id);
    }
  }
}

// Middleware pour nettoyer lors de la suppression
categorySchema.pre('remove', async function(next) {
  // Supprimer ou réassigner les sous-catégories
  const children = await this.constructor.find({ parent: this._id });

  for (const child of children) {
    // Option 1: Supprimer les sous-catégories
    await child.remove();

    // Option 2: Réassigner au parent du parent (commenter la ligne ci-dessus et décommenter ci-dessous)
    // child.parent = this.parent;
    // if (this.parent) {
    //   const parent = await this.constructor.findById(this.parent);
    //   if (parent) {
    //     child.ancestors = parent.ancestors;
    //     child.level = parent.level + 1;
    //   }
    // } else {
    //   child.ancestors = [];
    //   child.level = 0;
    // }
    // await child.save();
  }

  // Supprimer les références dans les produits
  const Product = mongoose.model('Product');
  await Product.updateMany(
    { category: this._id },
    { category: null }
  );

  next();
});

// Méthode d'instance pour incrémenter les vues
categorySchema.methods.incrementViews = function() {
  this.stats.viewCount += 1;
  return this.save();
};

// Méthode d'instance pour obtenir les produits populaires
categorySchema.methods.getPopularProducts = function(limit = 12) {
  return mongoose.model('Product').find({
    category: this._id,
    status: 'published',
    visibility: 'public'
  })
  .sort({ 'stats.viewCount': -1, 'stats.averageRating': -1 })
  .limit(limit);
};

// Méthode d'instance pour obtenir les produits récents
categorySchema.methods.getRecentProducts = function(limit = 12) {
  return mongoose.model('Product').find({
    category: this._id,
    status: 'published',
    visibility: 'public'
  })
  .sort({ publishedAt: -1 })
  .limit(limit);
};

// Méthode d'instance pour obtenir les produits en promotion
categorySchema.methods.getOnSaleProducts = function(limit = 12) {
  return mongoose.model('Product').find({
    category: this._id,
    'pricing.salePrice': { $exists: true, $ne: null },
    status: 'published',
    visibility: 'public'
  })
  .sort({ 'pricing.salePrice': 1 })
  .limit(limit);
};

// Méthode d'instance pour obtenir les statistiques détaillées
categorySchema.methods.getDetailedStats = function() {
  return mongoose.model('Product').aggregate([
    { $match: { category: this._id, status: 'published' } },
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
              { $and: ['$pricing.salePrice', { $lt: ['$pricing.salePrice', '$pricing.basePrice'] }] },
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
            $cond: [{ $eq: ['$inventory.stockStatus', 'out_of_stock'] }, 1, 0]
          }
        }
      }
    }
  ]);
};

// Méthode statique pour obtenir les catégories principales
categorySchema.statics.getMainCategories = function(options = {}) {
  const query = {
    level: 0,
    status: 'active',
    visibility: 'public'
  };

  if (options.featuredOnly) {
    query['display.featured'] = true;
  }

  if (options.withProductsOnly) {
    query['stats.productCount'] = { $gt: 0 };
  }

  return this.find(query)
    .sort({ 'display.order': 1, 'stats.productCount': -1 })
    .limit(options.limit || 20)
    .populate('children');
};

// Méthode statique pour obtenir les catégories avec leurs sous-catégories
categorySchema.statics.getCategoriesTree = function(options = {}) {
  return this.aggregate([
    {
      $match: {
        status: 'active',
        visibility: 'public',
        ...options.filter
      }
    },
    {
      $lookup: {
        from: 'categories',
        localField: '_id',
        foreignField: 'parent',
        as: 'children',
        pipeline: [
          { $sort: { 'display.order': 1 } },
          {
            $lookup: {
              from: 'categories',
              localField: '_id',
              foreignField: 'parent',
              as: 'children',
              pipeline: [
                { $sort: { 'display.order': 1 } }
              ]
            }
          }
        ]
      }
    },
    { $sort: { 'display.order': 1, level: 1 } }
  ]);
};

// Méthode statique pour obtenir les catégories populaires
categorySchema.statics.getPopularCategories = function(limit = 12) {
  return this.find({
    status: 'active',
    visibility: 'public',
    'stats.productCount': { $gt: 0 }
  })
  .sort({ 'stats.viewCount': -1, 'stats.productCount': -1 })
  .limit(limit);
};

// Méthode statique pour obtenir les catégories vedettes
categorySchema.statics.getFeaturedCategories = function(limit = 6) {
  return this.find({
    'display.featured': true,
    status: 'active',
    visibility: 'public'
  })
  .sort({ 'display.order': 1 })
  .limit(limit);
};

// Méthode statique pour obtenir les catégories par niveau
categorySchema.statics.getByLevel = function(level = 0, limit = 20) {
  return this.find({
    level: level,
    status: 'active',
    visibility: 'public'
  })
  .sort({ 'display.order': 1, 'stats.productCount': -1 })
  .limit(limit);
};

// Méthode statique pour rechercher des catégories
categorySchema.statics.search = function(query, options = {}) {
  const searchQuery = {
    $text: { $search: query },
    status: 'active',
    visibility: 'public'
  };

  return this.find(searchQuery, { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' } })
    .limit(options.limit || 20)
    .skip(options.skip || 0);
};

// Méthode statique pour obtenir les statistiques globales des catégories
categorySchema.statics.getGlobalStats = function() {
  return this.aggregate([
    {
      $match: { status: 'active' }
    },
    {
      $group: {
        _id: null,
        totalCategories: { $sum: 1 },
        totalProducts: { $sum: '$stats.productCount' },
        totalViews: { $sum: '$stats.viewCount' },
        averageProductsPerCategory: { $avg: '$stats.productCount' },
        categoriesWithProducts: {
          $sum: { $cond: [{ $gt: ['$stats.productCount', 0] }, 1, 0] }
        },
        featuredCategories: {
          $sum: { $cond: ['$display.featured', 1, 0] }
        },
        mainCategories: {
          $sum: { $cond: [{ $eq: ['$level', 0] }, 1, 0] }
        },
        subcategories: {
          $sum: { $cond: [{ $gt: ['$level', 0] }, 1, 0] }
        }
      }
    }
  ]);
};

// Méthode statique pour créer une catégorie avec validation
categorySchema.statics.createWithValidation = async function(data) {
  // Vérifier l'unicité du slug
  if (data.slug) {
    const existingCategory = await this.findOne({ slug: data.slug });
    if (existingCategory) {
      throw new Error('Category slug already exists');
    }
  }

  // Vérifier que la catégorie parente existe et n'est pas elle-même
  if (data.parent) {
    if (data.parent.toString() === data._id) {
      throw new Error('Category cannot be its own parent');
    }

    const parent = await this.findById(data.parent);
    if (!parent) {
      throw new Error('Parent category not found');
    }

    // Vérifier la profondeur maximale
    if (parent.level >= 4) {
      throw new Error('Maximum category depth exceeded');
    }
  }

  return this.create(data);
};

// Méthode statique pour réorganiser l'ordre des catégories
categorySchema.statics.reorderCategories = async function(categoryIds) {
  const bulkOps = categoryIds.map((id, index) => ({
    updateOne: {
      filter: { _id: id },
      update: { 'display.order': index }
    }
  }));

  return this.bulkWrite(bulkOps);
};

// Méthode statique pour obtenir les catégories vides
categorySchema.statics.getEmptyCategories = function() {
  return this.find({
    'stats.productCount': 0,
    status: 'active',
    visibility: 'public'
  })
  .sort({ createdAt: -1 });
};

// Méthode statique pour obtenir les catégories avec des produits en rupture
categorySchema.statics.getCategoriesWithLowStock = function() {
  return this.aggregate([
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: 'category',
        as: 'products',
        pipeline: [
          {
            $match: {
              status: 'published',
              $expr: {
                $lte: ['$inventory.stockQuantity', '$inventory.lowStockThreshold']
              }
            }
          }
        ]
      }
    },
    {
      $match: {
        'products.0': { $exists: true },
        status: 'active',
        visibility: 'public'
      }
    },
    {
      $project: {
        name: 1,
        slug: 1,
        lowStockProductsCount: { $size: '$products' },
        products: { $slice: ['$products', 5] }
      }
    },
    { $sort: { lowStockProductsCount: -1 } }
  ]);
};

// Méthode statique pour obtenir les catégories avec des produits populaires
categorySchema.statics.getCategoriesWithPopularProducts = function(limit = 10) {
  return this.aggregate([
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: 'category',
        as: 'products',
        pipeline: [
          {
            $match: { status: 'published', visibility: 'public' }
          },
          { $sort: { 'stats.viewCount': -1 } },
          { $limit: 5 }
        ]
      }
    },
    {
      $match: {
        'products.0': { $exists: true },
        status: 'active',
        visibility: 'public'
      }
    },
    {
      $project: {
        name: 1,
        slug: 1,
        productCount: 1,
        topProducts: '$products'
      }
    },
    { $sort: { productCount: -1 } },
    { $limit: limit }
  ]);
};

module.exports = mongoose.model('Category', categorySchema);