const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { authenticateToken, isAdmin } = require('../middleware/auth');
const nodemailer = require('nodemailer');

// Configuration du transporteur email
const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Validation middleware pour les messages
const validateMessage = (req, res, next) => {
  const { name, email, subject, message, type } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({
      success: false,
      message: 'Tous les champs sont requis'
    });
  }

  // Validation email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Adresse email invalide'
    });
  }

  if (name.length > 100) {
    return res.status(400).json({
      success: false,
      message: 'Le nom ne peut pas dépasser 100 caractères'
    });
  }

  if (subject.length > 200) {
    return res.status(400).json({
      success: false,
      message: 'Le sujet ne peut pas dépasser 200 caractères'
    });
  }

  if (message.length > 5000) {
    return res.status(400).json({
      success: false,
      message: 'Le message ne peut pas dépasser 5000 caractères'
    });
  }

  // Validation du type
  const validTypes = ['contact', 'quote', 'partnership', 'sourcing'];
  if (type && !validTypes.includes(type)) {
    return res.status(400).json({
      success: false,
      message: 'Type de message invalide'
    });
  }

  next();
};

// POST /api/messages - Créer un nouveau message (public)
router.post('/', validateMessage, async (req, res) => {
  try {
    const messageData = {
      ...req.body,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    };

    const message = new Message(messageData);
    await message.save();

    // Envoi d'email de notification à l'admin
    try {
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@mbaal.com';

      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: adminEmail,
        subject: `Nouveau message MBAAL: ${message.subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2d5a27;">Nouveau message sur MBAAL.com</h2>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Type:</strong> ${message.type || 'Contact'}</p>
              <p><strong>Nom:</strong> ${message.name}</p>
              <p><strong>Email:</strong> ${message.email}</p>
              <p><strong>Téléphone:</strong> ${message.phone || 'Non fourni'}</p>
              <p><strong>Société:</strong> ${message.company || 'Non fourni'}</p>
              <p><strong>Sujet:</strong> ${message.subject}</p>
              <p><strong>Message:</strong></p>
              <div style="background: white; padding: 15px; border-radius: 4px; border-left: 4px solid #2d5a27;">
                ${message.message.replace(/\n/g, '<br>')}
              </div>
              ${message.product ? `<p><strong>Produit concerné:</strong> ${message.product}</p>` : ''}
              ${message.quantity ? `<p><strong>Quantité:</strong> ${message.quantity}</p>` : ''}
              ${message.destination ? `<p><strong>Destination:</strong> ${message.destination}</p>` : ''}
            </div>
            <p style="color: #666; font-size: 12px;">
              Message reçu le ${new Date().toLocaleString('fr-FR')}
            </p>
          </div>
        `
      });
    } catch (emailError) {
      console.error('Erreur envoi email:', emailError);
      // Ne pas échouer la requête pour autant
    }

    res.status(201).json({
      success: true,
      data: message,
      message: 'Message envoyé avec succès'
    });
  } catch (error) {
    console.error('Erreur création message:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// GET /api/messages - Récupérer tous les messages (Admin seulement)
router.get('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      type,
      status,
      search,
      sort = '-createdAt'
    } = req.query;

    // Construction du filtre
    const filter = {};

    if (type) filter.type = type;
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } }
      ];
    }

    // Options de pagination
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: sort,
      populate: []
    };

    const messages = await Message.paginate(filter, options);

    res.json({
      success: true,
      data: messages.docs,
      pagination: {
        page: messages.page,
        pages: messages.totalPages,
        total: messages.totalDocs,
        limit: messages.limit
      }
    });
  } catch (error) {
    console.error('Erreur récupération messages:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// GET /api/messages/stats - Statistiques des messages (Admin seulement)
router.get('/stats/summary', authenticateToken, isAdmin, async (req, res) => {
  try {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);

    const [
      totalMessages,
      unreadMessages,
      monthlyMessages,
      yearlyMessages,
      messagesByType,
      messagesByStatus
    ] = await Promise.all([
      Message.countDocuments(),
      Message.countDocuments({ status: 'unread' }),
      Message.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Message.countDocuments({ createdAt: { $gte: startOfYear } }),
      Message.aggregate([
        { $group: { _id: '$type', count: { $sum: 1 } } }
      ]),
      Message.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ])
    ]);

    res.json({
      success: true,
      data: {
        total: totalMessages,
        unread: unreadMessages,
        monthly: monthlyMessages,
        yearly: yearlyMessages,
        byType: messagesByType,
        byStatus: messagesByStatus
      }
    });
  } catch (error) {
    console.error('Erreur récupération stats messages:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// GET /api/messages/:id - Récupérer un message par ID (Admin seulement)
router.get('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message non trouvé'
      });
    }

    res.json({
      success: true,
      data: message
    });
  } catch (error) {
    console.error('Erreur récupération message:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// PATCH /api/messages/:id/status - Mettre à jour le statut d'un message (Admin seulement)
router.patch('/:id/status', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { status, notes } = req.body;

    const validStatuses = ['unread', 'read', 'replied', 'archived'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Statut invalide'
      });
    }

    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message non trouvé'
      });
    }

    message.status = status;
    if (notes) message.adminNotes = notes;
    message.lastUpdated = new Date();

    await message.save();

    res.json({
      success: true,
      data: message,
      message: 'Statut du message mis à jour'
    });
  } catch (error) {
    console.error('Erreur mise à jour statut message:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// POST /api/messages/:id/reply - Répondre à un message (Admin seulement)
router.post('/:id/reply', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { replyMessage, replySubject } = req.body;

    if (!replyMessage) {
      return res.status(400).json({
        success: false,
        message: 'Le message de réponse est requis'
      });
    }

    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message non trouvé'
      });
    }

    // Envoi de l'email de réponse
    try {
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: message.email,
        subject: replySubject || `Re: ${message.subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #2d5a27, #4a7c59); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
              <h2 style="margin: 0;">MBAAL - Réponse à votre message</h2>
            </div>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 0 0 8px 8px;">
              <p>Bonjour ${message.name},</p>

              <div style="background: white; padding: 15px; border-radius: 4px; margin: 20px 0; border-left: 4px solid #2d5a27;">
                ${replyMessage.replace(/\n/g, '<br>')}
              </div>

              <p style="color: #666; font-size: 12px; border-top: 1px solid #ddd; padding-top: 15px; margin-top: 20px;">
                <strong>Votre message original:</strong><br>
                ${message.message.replace(/\n/g, '<br>')}
              </p>

              <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">

              <p style="text-align: center; color: #666;">
                Cordialement,<br>
                <strong>L'équipe MBAAL</strong><br>
                Commerce Général - Import/Export<br>
                Douala, Cameroun
              </p>
            </div>
          </div>
        `
      });

      // Mise à jour du message
      message.status = 'replied';
      message.repliedAt = new Date();
      message.adminNotes = (message.adminNotes || '') + `\n[${new Date().toISOString()}] Réponse envoyée`;

      await message.save();

      res.json({
        success: true,
        data: message,
        message: 'Réponse envoyée avec succès'
      });
    } catch (emailError) {
      console.error('Erreur envoi email réponse:', emailError);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'envoi de l\'email'
      });
    }
  } catch (error) {
    console.error('Erreur réponse message:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// DELETE /api/messages/:id - Supprimer un message (Admin seulement)
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Message supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur suppression message:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// POST /api/messages/bulk/status - Mise à jour en masse du statut (Admin seulement)
router.post('/bulk/status', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { messageIds, status } = req.body;

    if (!Array.isArray(messageIds) || messageIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Liste d\'IDs de messages requise'
      });
    }

    const validStatuses = ['unread', 'read', 'replied', 'archived'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Statut invalide'
      });
    }

    const result = await Message.updateMany(
      { _id: { $in: messageIds } },
      {
        status: status,
        lastUpdated: new Date()
      }
    );

    res.json({
      success: true,
      data: {
        modifiedCount: result.modifiedCount,
        matchedCount: result.matchedCount
      },
      message: `${result.modifiedCount} message(s) mis à jour`
    });
  } catch (error) {
    console.error('Erreur mise à jour en masse:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// DELETE /api/messages/bulk - Suppression en masse (Admin seulement)
router.delete('/bulk/delete', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { messageIds } = req.body;

    if (!Array.isArray(messageIds) || messageIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Liste d\'IDs de messages requise'
      });
    }

    const result = await Message.deleteMany({ _id: { $in: messageIds } });

    res.json({
      success: true,
      data: {
        deletedCount: result.deletedCount
      },
      message: `${result.deletedCount} message(s) supprimé(s)`
    });
  } catch (error) {
    console.error('Erreur suppression en masse:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

module.exports = router;