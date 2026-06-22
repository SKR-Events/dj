# Lumière d'Or — Site vitrine

Institut de beauté haut de gamme · Lille & périphérie · Nord 59

---

## Démarrage rapide

Ce site est 100 % statique (HTML / CSS / JS vanilla).  
Aucune installation npm ou build tool n'est nécessaire.

**Ouvrez simplement `index.html` dans un navigateur** pour visualiser le site en local.

---

## Configuration EmailJS (obligatoire avant mise en ligne)

Le formulaire de réservation utilise [EmailJS](https://www.emailjs.com) pour envoyer les demandes par email sans serveur.

### Étapes

1. **Créez un compte gratuit** sur [emailjs.com](https://www.emailjs.com)

2. **Ajoutez un service email** (Gmail recommandé) :
   - Tableau de bord → *Email Services* → *Add New Service*
   - Notez votre **Service ID** (ex. `service_xxxxxxx`)

3. **Créez un template email** :
   - *Email Templates* → *Create New Template*
   - Utilisez ces variables dans le corps du template :
     ```
     Prénom    : {{prenom}}
     Nom       : {{nom}}
     Email     : {{email}}
     Téléphone : {{telephone}}
     Prestation: {{prestation}}
     Date      : {{date}}
     Créneau   : {{creneau}}
     Message   : {{message}}
     ```
   - Notez votre **Template ID** (ex. `template_xxxxxxx`)

4. **Récupérez votre Public Key** :
   - *Account* → *General* → **Public Key**

5. **Mettez à jour `js/main.js`** (lignes 14–16) :
   ```js
   const EMAILJS_CONFIG = {
       publicKey:  'votre_public_key_ici',
       serviceId:  'votre_service_id_ici',
       templateId: 'votre_template_id_ici',
   };
   ```

---

## Remplacer les images

Les images actuelles sont des placeholders Unsplash (libres de droits).  
Pour les remplacer par vos propres photos :

1. Placez vos images dans le dossier `images/`
2. Formats recommandés : **WebP** ou **JPEG** optimisé
3. Tailles recommandées :
   - Hero : 1800 × 1200 px minimum
   - Cards prestations : 800 × 600 px
   - Galerie : 1200 × 800 px
4. Dans `index.html`, remplacez les attributs `src` des balises `<img>`
5. Mettez également à jour les attributs `alt` avec des descriptions précises

### Image Open Graph
Créez `images/og-image.jpg` (1200 × 630 px) et mettez à jour l'URL dans :
- `<meta property="og:image" ...>` (index.html ligne ~32)
- `<meta name="twitter:image" ...>` (index.html ligne ~38)

---

## Personnaliser le contenu

| Quoi modifier | Où |
|---|---|
| Nom, adresse, téléphone | `index.html` — chercher `+33 X XX XX XX XX` et `contact@lumieredorlille.fr` |
| Horaires d'ouverture | `index.html` — sections footer + réservation |
| Prix des prestations | `index.html` — cards `.card-price` |
| Texte À propos | `index.html` — section `#apropos` |
| Couleurs | `css/style.css` — section `:root` variables CSS |
| URL du site | `sitemap.xml`, `robots.txt`, et balises meta dans `index.html` |
| Liens réseaux sociaux | `index.html` — footer `.footer-socials` |

---

## Structure des fichiers

```
lumiere-dor/
├── index.html          → Page principale (one-page)
├── css/
│   └── style.css       → Tous les styles (mobile-first)
├── js/
│   └── main.js         → JavaScript : animations, carousel, form, lightbox
├── images/
│   └── (vos images)    → Dossier pour les images du site
├── sitemap.xml         → Plan du site pour les moteurs de recherche
├── robots.txt          → Instructions pour les robots d'indexation
└── README.md           → Ce fichier
```

---

## Mise en ligne

1. **Hébergement recommandé** : [Netlify](https://netlify.com) (gratuit, glisser-déposer le dossier)
2. **Configurez votre domaine** : `lumieredorlille.fr` dans les DNS de votre registrar
3. **HTTPS** : activé automatiquement sur Netlify/Vercel
4. **Mettez à jour les URLs** dans `sitemap.xml` et `robots.txt`
5. **Soumettez le sitemap** dans Google Search Console

---

## SEO — Checklist avant mise en ligne

- [ ] Remplacer les images placeholder par vos vraies photos
- [ ] Remplir les balises meta dans `<head>` (title, description)
- [ ] Mettre à jour le Schema.org avec votre vraie adresse
- [ ] Configurer EmailJS avec vos vraies clés
- [ ] Vérifier les liens réseaux sociaux
- [ ] Soumettre le sitemap dans Google Search Console
- [ ] Créer une fiche Google My Business

---

## Dépendances CDN (aucune installation requise)

| Bibliothèque | Version | Usage |
|---|---|---|
| [AOS.js](https://michalsnik.github.io/aos/) | 2.3.4 | Animations au scroll |
| [EmailJS](https://www.emailjs.com) | 4.x | Envoi du formulaire |
| [Google Fonts](https://fonts.google.com) | — | Playfair Display + Raleway |

---

*Site créé pour Lumière d'Or — Institut Beauté Haut de Gamme · Lille · Nord 59*
