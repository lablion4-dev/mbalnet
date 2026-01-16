const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { authenticateToken, isAdmin } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuration multer pour l'upload d'images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/products');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Seules les images sont autorisées'));
    }
  }
});

// Validation middleware pour les produits
const validateProduct = (req, res, next) => {
  const {
    name,
    description,
    category,
    price,
    unit,
    minOrderQuantity,
    origin,
    availability
  } = req.body;

  if (!name || !description || !category) {
    return res.status(400).json({
      success: false,
      message: 'Nom, description et catégorie sont requis'
    });
  }

  if (name.length > 200) {
    return res.status(400).json({
      success: false,
      message: 'Le nom ne peut pas dépasser 200 caractères'
    });
  }

  if (description.length > 2000) {
    return res.status(400).json({
      success: false,
      message: 'La description ne peut pas dépasser 2000 caractères'
    });
  }

  if (price && (isNaN(price) || price < 0)) {
    return res.status(400).json({
      success: false,
      message: 'Prix invalide'
    });
  }

  if (minOrderQuantity && (isNaN(minOrderQuantity) || minOrderQuantity < 1)) {
    return res.status(400).json({
      success: false,
      message: 'Quantité minimum invalide'
    });
  }

  next();
};

// GET /api/products - Récupérer tous les produits (public)
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      search,
      minPrice,
      maxPrice,
      origin,
      sort = '-createdAt',
      featured = false
    } = req.query;

    // Construction du filtre
    const filter = { isActive: true };

    if (category) filter.category = category;
    if (origin) filter.origin = origin;
    if (featured === 'true') filter.featured = true;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    // Options de pagination
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: sort,
      populate: [] // Pas de populate nécessaire
    };

    const products = await Product.paginate(filter, options);

    res.json({
      success: true,
      data: products.docs,
      pagination: {
        page: products.page,
        pages: products.totalPages,
        total: products.totalDocs,
        limit: products.limit
      }
    });
  } catch (error) {
    console.error('Erreur récupération produits:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// GET /api/products/categories - Récupérer les catégories disponibles
router.get('/categories', async (req, res) => {
  try {
    const categories = await Product.distinct('category', { isActive: true });
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Erreur récupération catégories:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// GET /api/products/origins - Récupérer les origines disponibles
router.get('/origins', async (req, res) => {
  try {
    const origins = await Product.distinct('origin', { isActive: true });
    res.json({
      success: true,
      data: origins
    });
  } catch (error) {
    console.error('Erreur récupération origines:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// GET /api/products/featured - Récupérer les produits phares
router.get('/featured', async (req, res) => {
  try {
    const products = await Product.find({ featured: true, isActive: true })
      .sort('-createdAt')
      .limit(8);

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Erreur récupération produits phares:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// GET /api/products/:id - Récupérer un produit par ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouvé'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Erreur récupération produit:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// POST /api/products - Créer un nouveau produit (Admin seulement)
router.post('/', authenticateToken, isAdmin, upload.array('images', 5), validateProduct, async (req, res) => {
  try {
    const productData = { ...req.body };

    // Gestion des images uploadées
    if (req.files && req.files.length > 0) {
      productData.images = req.files.map(file => `/uploads/products/${file.filename}`);
    }

    // Conversion des champs numériques
    if (productData.price) productData.price = parseFloat(productData.price);
    if (productData.minOrderQuantity) productData.minOrderQuantity = parseInt(productData.minOrderQuantity);
    if (productData.stockQuantity) productData.stockQuantity = parseInt(productData.stockQuantity);

    // Parsing des spécifications si c'est une string JSON
    if (typeof productData.specifications === 'string') {
      try {
        productData.specifications = JSON.parse(productData.specifications);
      } catch (e) {
        productData.specifications = {};
      }
    }

    const product = new Product(productData);
    await product.save();

    res.status(201).json({
      success: true,
      data: product,
      message: 'Produit créé avec succès'
    });
  } catch (error) {
    console.error('Erreur création produit:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// PUT /api/products/:id - Mettre à jour un produit (Admin seulement)
router.put('/:id', authenticateToken, isAdmin, upload.array('images', 5), validateProduct, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouvé'
      });
    }

    const updateData = { ...req.body };

    // Gestion des nouvelles images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => `/uploads/products/${file.filename}`);
      updateData.images = [...(product.images || []), ...newImages];
    }

    // Conversion des champs numériques
    if (updateData.price) updateData.price = parseFloat(updateData.price);
    if (updateData.minOrderQuantity) updateData.minOrderQuantity = parseInt(updateData.minOrderQuantity);
    if (updateData.stockQuantity) updateData.stockQuantity = parseInt(updateData.stockQuantity);

    // Parsing des spécifications
    if (typeof updateData.specifications === 'string') {
      try {
        updateData.specifications = JSON.parse(updateData.specifications);
      } catch (e) {
        updateData.specifications = {};
      }
    }

    // Mise à jour du produit
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        product[key] = updateData[key];
      }
    });

    await product.save();

    res.json({
      success: true,
      data: product,
      message: 'Produit mis à jour avec succès'
    });
  } catch (error) {
    console.error('Erreur mise à jour produit:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// DELETE /api/products/:id/images/:imageIndex - Supprimer une image spécifique
router.delete('/:id/images/:imageIndex', authenticateToken, isAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouvé'
      });
    }

    const imageIndex = parseInt(req.params.imageIndex);
    if (imageIndex < 0 || imageIndex >= product.images.length) {
      return res.status(400).json({
        success: false,
        message: 'Index d\'image invalide'
      });
    }

    // Supprimer le fichier physique
    const imagePath = path.join(__dirname, '..', product.images[imageIndex]);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    // Supprimer l'image du tableau
    product.images.splice(imageIndex, 1);
    await product.save();

    res.json({
      success: true,
      data: product,
      message: 'Image supprimée avec succès'
    });
  } catch (error) {
    console.error('Erreur suppression image:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// PATCH /api/products/:id/toggle - Activer/Désactiver un produit
router.patch('/:id/toggle', authenticateToken, isAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouvé'
      });
    }

    product.isActive = !product.isActive;
    await product.save();

    res.json({
      success: true,
      data: product,
      message: `Produit ${product.isActive ? 'activé' : 'désactivé'} avec succès`
    });
  } catch (error) {
    console.error('Erreur toggle produit:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// PATCH /api/products/:id/featured - Marquer comme produit phare
router.patch('/:id/featured', authenticateToken, isAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouvé'
      });
    }

    product.featured = !product.featured;
    await product.save();

    res.json({
      success: true,
      data: product,
      message: `Produit ${product.featured ? 'marqué comme phare' : 'retiré des phares'} avec succès`
    });
  } catch (error) {
    console.error('Erreur toggle featured:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// DELETE /api/products/:id - Supprimer un produit (Admin seulement)
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouvé'
      });
    }

    // Supprimer les images physiques
    if (product.images && product.images.length > 0) {
      product.images.forEach(imagePath => {
        const fullPath = path.join(__dirname, '..', imagePath);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Produit supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur suppression produit:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// GET /api/products/admin/all - Récupérer tous les produits pour l'admin (avec inactifs)
router.get('/admin/all', authenticateToken, isAdmin, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      search,
      isActive,
      sort = '-createdAt'
    } = req.query;

    // Construction du filtre
    const filter = {};

    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    // Options de pagination
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: sort,
      populate: []
    };

    const products = await Product.paginate(filter, options);

    res.json({
      success: true,
      data: products.docs,
      pagination: {
        page: products.page,
        pages: products.totalPages,
        total: products.totalDocs,
        limit: products.limit
      }
    });
  } catch (error) {
    console.error('Erreur récupération produits admin:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

module.exports = router;