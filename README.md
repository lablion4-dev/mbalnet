# MBAALNET.COM - Site Web Professionnel

## 🌍 À Propos

**MBAAL.COM** est le site web officiel de **ETS MBA & AL**, une entreprise camerounaise spécialisée dans:
- Commerce général
- Import-Export
- Négoce et intermédiation d'affaires
- Distribution agro-alimentaire
- Sourcing de produits locaux camerounais

**Siège:** Douala, Cameroun  
**Portée:** Afrique et International

---

## 📁 Structure du Projet

```
mbalnet/
├── index.html              # Page d'accueil
├── about.html              # Page À propos
├── products.html           # Catalogue de produits
├── contact.html            # Page de contact et devis
├── css/
│   ├── style.css          # Styles principaux
│   └── pages.css          # Styles des pages additionnelles
├── js/
│   └── script.js          # JavaScript interactif
├── images/
│   └── placeholder.txt    # Instructions pour les images
└── README.md              # Documentation
```

---

## 🎨 Design & Identité Visuelle

### Couleurs Principales
- **Vert primaire:** `#2d7a3e` (Agriculture, durabilité)
- **Bleu primaire:** `#1e5a8e` (Commerce international, fiabilité)
- **Or accent:** `#d4af37` (Premium, excellence)
- **Gris clair:** `#f5f7fa` (Arrière-plans)

### Typographie
- **Police principale:** Segoe UI, sans-serif
- **Police titres:** Arial, sans-serif

---

## 📄 Pages du Site

### 1. **Page d'Accueil** (`index.html`)
- Hero section avec slogan
- Présentation des 4 pôles d'activités
- Produits phares
- Avantages compétitifs
- Zones desservies
- Call-to-action

### 2. **À Propos** (`about.html`)
- Présentation de l'entreprise
- Mission et vision
- Valeurs
- Expertise et chiffres clés
- Pourquoi nous choisir

### 3. **Produits** (`products.html`)
- Filtres par catégorie
- Catalogue organisé:
  - Farines locales
  - Épices & condiments
  - Céréales & riz
  - Produits transformés
- Fiches produits détaillées avec MOQ et conditionnement

### 4. **Contact & Devis** (`contact.html`)
- Informations de contact
- Formulaire de contact général
- Formulaire de demande de devis rapide
- Horaires et disponibilité
- FAQ

---

## 🚀 Fonctionnalités

### Navigation
- Menu responsive avec hamburger mobile
- Navigation sticky
- Liens actifs selon la page
- Switcher de langue (FR/EN)

### Interactivité
- Animations au scroll
- Filtres de produits dynamiques
- Formulaires de contact validés
- Bouton "Retour en haut"
- Notifications toast
- Smooth scrolling

### Responsive Design
- Mobile-first approach
- Breakpoints: 480px, 768px, 1200px
- Grids adaptatives
- Images optimisées

---

## 🛠️ Technologies Utilisées

- **HTML5** - Structure sémantique
- **CSS3** - Styles modernes avec variables CSS
- **JavaScript (Vanilla)** - Interactivité sans framework
- **Font Awesome 6.4.0** - Icônes
- **Google Fonts** - Typographie (optionnel)

---

## 📦 Installation & Utilisation

### Méthode 1: Ouverture Directe
1. Téléchargez tous les fichiers
2. Ouvrez `index.html` dans votre navigateur
3. Naviguez entre les pages

### Méthode 2: Serveur Local
```bash
# Avec Python 3
python -m http.server 8000

# Avec Node.js (http-server)
npx http-server

# Avec PHP
php -S localhost:8000
```

Puis ouvrez: `http://localhost:8000`

---

## 🖼️ Images

Le site utilise actuellement des **placeholders CSS**. Pour un rendu professionnel:

1. Ajoutez de vraies images dans le dossier `images/`
2. Formats recommandés: JPG (photos), PNG (logos), WebP (performance)
3. Dimensions suggérées:
   - Produits: 800x600px
   - Hero: 1920x1080px
   - Logos: 400x400px

---

## 🌐 Déploiement

### Hébergement Recommandé
- **Netlify** (gratuit, facile)
- **Vercel** (gratuit, performant)
- **GitHub Pages** (gratuit)
- **Hostinger** (payant, professionnel)
- **OVH** (payant, européen)

### Étapes de Déploiement
1. Créez un compte sur la plateforme choisie
2. Connectez votre dépôt Git ou uploadez les fichiers
3. Configurez le domaine `mbalnet.com`
4. Activez HTTPS (SSL)

---

## 📧 Configuration Email

Pour que les formulaires fonctionnent:

### Option 1: Service Email (Recommandé)
- **EmailJS** - Gratuit, facile à intégrer
- **Formspree** - Simple, fiable
- **SendGrid** - Professionnel

### Option 2: Backend PHP
Créez un fichier `contact.php`:
```php
<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST['name'];
    $email = $_POST['email'];
    $message = $_POST['message'];
    
    $to = "contact@mbalnet.com";
    $subject = "Nouveau message depuis mbalnet.com";
    
    mail($to, $subject, $message);
}
?>
```

---

## 🔧 Personnalisation

### Modifier les Couleurs
Éditez les variables CSS dans `css/style.css`:
```css
:root {
    --primary-green: #2d7a3e;
    --primary-blue: #1e5a8e;
    --accent-gold: #d4af37;
}
```

### Ajouter une Page
1. Créez `nouvelle-page.html`
2. Copiez la structure d'une page existante
3. Ajoutez le lien dans la navigation
4. Créez le contenu spécifique

### Modifier le Contenu
- Textes: Directement dans les fichiers HTML
- Styles: Dans `css/style.css` ou `css/pages.css`
- Comportements: Dans `js/script.js`

---

## 📱 Réseaux Sociaux

Mettez à jour les liens dans le footer:
```html
<a href="https://facebook.com/mbalnet"><i class="fab fa-facebook"></i></a>
<a href="https://linkedin.com/company/mbalnet"><i class="fab fa-linkedin"></i></a>
```

---

## 🔒 Sécurité

### Recommandations
- Activez HTTPS (SSL/TLS)
- Validez tous les formulaires côté serveur
- Protégez contre les injections SQL
- Utilisez CAPTCHA pour les formulaires
- Mettez à jour régulièrement

---

## 📈 SEO & Performance

### Optimisations Incluses
- Balises meta descriptives
- Structure HTML sémantique
- Titres hiérarchisés (H1-H6)
- Alt text pour les images
- URLs propres et descriptives

### Améliorations Futures
- Ajouter un sitemap.xml
- Configurer robots.txt
- Implémenter Schema.org markup
- Optimiser les images (compression, lazy loading)
- Ajouter Google Analytics

---

## 🌍 Multilingue

Le site inclut un sélecteur de langue élégant avec support pour **7 langues** :

- 🇫🇷 **Français** (actif par défaut)
- 🇬🇧 **English**
- 🇪🇸 **Español**
- 🇸🇦 **العربية** (Arabe)
- 🇨🇳 **中文** (Mandarin)
- 🇷🇺 **Русский** (Russe)
- 🇵🇹 **Português** (Portugais)

### Fonctionnalités du sélecteur :
- Design moderne avec drapeaux emoji
- Dropdown animé avec effet glassmorphism
- Responsive (liste verticale sur mobile)
- Notifications de changement de langue
- Préparation pour intégration multilingue

### Pour Activer la Traduction Complète
1. Créez des versions traduites de chaque page (ex: `index-en.html`, `index-es.html`)
2. Ou intégrez un système de traduction JavaScript
3. Ou utilisez un CMS multilingue (WordPress, Strapi)

---

## 📞 Support & Contact

**Email:** contact@mbalnet.com
**Téléphone:** +237 XXX XXX XXX
**WhatsApp:** +237 XXX XXX XXX  
**Adresse:** Douala, Cameroun

---

## 📝 Licence

© 2026 MBAAL.COM - ETS MBA & AL. Tous droits réservés.

---

## 🎯 Prochaines Étapes

### Phase 1 (Immédiat)
- [ ] Ajouter de vraies images de produits
- [ ] Configurer les emails de contact
- [ ] Mettre à jour les coordonnées réelles
- [ ] Tester sur différents navigateurs

### Phase 2 (Court terme)
- [ ] Créer les pages manquantes (Activités, Sourcing, Import-Export, Partenaires)
- [ ] Ajouter plus de produits au catalogue
- [ ] Intégrer Google Maps
- [ ] Ajouter des témoignages clients

### Phase 3 (Moyen terme)
- [ ] Système de gestion de contenu (CMS)
- [ ] Espace client/partenaire
- [ ] Blog/Actualités
- [ ] Newsletter

### Phase 4 (Long terme)
- [ ] E-commerce complet
- [ ] Paiement en ligne
- [ ] Tracking de commandes
- [ ] Application mobile

---

## 🤝 Contribution

Pour toute amélioration ou suggestion:
1. Créez une issue
2. Proposez une pull request
3. Contactez l'équipe technique

---

**Développé avec ❤️ pour MBAALNET - Connecting African Products to Global Markets**
