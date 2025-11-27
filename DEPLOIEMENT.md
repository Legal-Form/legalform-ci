# 📦 Guide de Déploiement - Legal Form

## 🎯 Obtenir les fichiers de production

### Option 1: Via l'interface Lovable (RECOMMANDÉ)

1. **Cliquez sur le bouton "Publish"** en haut à droite de l'interface Lovable
2. **Cliquez sur "Update"** pour générer le build de production
3. **Attendez la fin du build** (environ 1-2 minutes)
4. **Téléchargez les fichiers** depuis l'interface de déploiement

### Option 2: Via GitHub (si configuré)

1. Connectez votre projet à GitHub depuis Lovable
2. Les fichiers seront automatiquement synchronisés
3. Récupérez le code depuis votre repository GitHub

### Option 3: Build local (si vous avez accès au code)

```bash
# Installer les dépendances
npm install

# Créer le build de production
npm run build

# Les fichiers compilés seront dans le dossier 'dist/'
```

---

## 🌐 Déploiement sur SafaryCloud

### Étape 1: Préparer les fichiers

Les fichiers de production se trouvent dans le dossier `dist/` après le build.

### Étape 2: Upload vers SafaryCloud

1. **Connectez-vous à votre panneau SafaryCloud**
2. **Accédez au gestionnaire de fichiers**
3. **Supprimez les anciens fichiers** (si mise à jour)
4. **Uploadez tout le contenu du dossier `dist/`**:
   - `index.html`
   - Dossier `assets/` (contient JS, CSS, images)
   - Tous les autres fichiers statiques

### Étape 3: Configuration du serveur

#### Configuration Apache (.htaccess)

Créez un fichier `.htaccess` à la racine avec ce contenu:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# Cache les fichiers statiques
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>

# Compression GZIP
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css application/javascript
</IfModule>
```

#### Configuration Nginx (si applicable)

```nginx
server {
    listen 80;
    server_name votre-domaine.com;
    root /var/www/legalform;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(jpg|jpeg|png|gif|ico|css|js|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
}
```

---

## 🔧 Configuration de la Base de Données (Lovable Cloud)

**Important**: La base de données est déjà configurée via Lovable Cloud (Supabase). Aucune configuration supplémentaire n'est nécessaire côté serveur.

Les variables d'environnement sont déjà intégrées dans le build de production:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

---

## ✅ Vérification après déploiement

1. **Testez toutes les pages**:
   - ✅ Page d'accueil: `https://votre-domaine.com/`
   - ✅ Services: `https://votre-domaine.com/services`
   - ✅ Créer entreprise: `https://votre-domaine.com/create`
   - ✅ Régions: `https://votre-domaine.com/regions`
   - ✅ Tarifs: `https://votre-domaine.com/pricing`
   - ✅ À propos: `https://votre-domaine.com/about`
   - ✅ Contact: `https://votre-domaine.com/contact`
   - ✅ Showcase: `https://votre-domaine.com/showcase`

2. **Testez les formulaires**:
   - ✅ Formulaire de création d'entreprise
   - ✅ Formulaire de contact
   - ✅ Vérifiez que les données arrivent dans la base de données Cloud

3. **Testez la navigation**:
   - ✅ Tous les liens fonctionnent
   - ✅ Pas d'erreur 404
   - ✅ Version mobile responsive

---

## 🚀 Optimisations Post-Déploiement

### 1. SEO

Vérifiez que ces fichiers sont présents:
- `robots.txt` (déjà inclus)
- `sitemap.xml` (à créer)

### 2. Performance

- Activez la compression GZIP sur le serveur
- Activez le cache navigateur
- Vérifiez les temps de chargement avec Google PageSpeed Insights

### 3. Sécurité

- Activez HTTPS (SSL/TLS)
- Configurez les en-têtes de sécurité
- Activez les CORS si nécessaire

---

## 📊 Surveillance

### Logs à surveiller

1. **Logs serveur** (SafaryCloud):
   - Erreurs 404
   - Erreurs 500
   - Pics de trafic

2. **Logs Cloud** (Lovable Dashboard):
   - Nombre de demandes créées
   - Messages de contact
   - Erreurs API

---

## 🆘 Dépannage

### Problème: Page blanche après déploiement

**Solution**:
- Vérifiez que tous les fichiers du dossier `dist/` ont été uploadés
- Vérifiez la configuration `.htaccess` ou Nginx
- Vérifiez la console du navigateur pour les erreurs JavaScript

### Problème: Erreur 404 sur les sous-pages

**Solution**:
- Vérifiez la configuration du serveur (rewrite rules)
- Assurez-vous que le fichier `.htaccess` est présent

### Problème: Formulaires ne fonctionnent pas

**Solution**:
- Vérifiez la connexion à Lovable Cloud dans le dashboard
- Vérifiez les variables d'environnement
- Consultez les logs de la base de données Cloud

---

## 📞 Support

Pour toute question sur le déploiement:
- Documentation Lovable: https://docs.lovable.dev/
- Support SafaryCloud: [vos coordonnées]

---

## 🔄 Mises à jour futures

Pour mettre à jour le site:

1. Faites les modifications dans Lovable
2. Cliquez sur "Update" dans le bouton Publish
3. Téléchargez le nouveau build
4. Remplacez les fichiers sur SafaryCloud
5. Videz le cache du serveur si nécessaire

**Note**: Les modifications de la base de données (migrations) sont automatiquement déployées via Lovable Cloud.
