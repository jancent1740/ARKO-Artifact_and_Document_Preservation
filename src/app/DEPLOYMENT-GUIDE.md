# Deployment Guide - UNC Digital Museum Application

This guide provides comprehensive instructions for deploying the Digital Museum Application to various hosting platforms.

## 📋 Pre-Deployment Checklist

- ✅ All code is React + Vite compatible
- ✅ All pages use default exports for lazy loading
- ✅ All components use named exports
- ✅ ES6 imports throughout (no CommonJS)
- ✅ Asset imports use proper Vite syntax
- ✅ Environment variables configured (if needed)
- ✅ Build tested locally

## 🏗️ Build Process

### 1. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 2. Build for Production

```bash
npm run build
# or
yarn build
# or
pnpm build
```

This creates an optimized production build in the `/dist` folder.

### 3. Preview Production Build Locally

```bash
npm run preview
# or
yarn preview
# or
pnpm preview
```

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)

**Why Vercel?**
- Zero configuration for Vite projects
- Automatic HTTPS
- Global CDN
- Instant deployments
- Free tier available

**Steps:**

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. For production deployment:
```bash
vercel --prod
```

**vercel.json Configuration:**
```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "routes": [
    {
      "src": "/[^.]+",
      "dest": "/index.html",
      "status": 200
    }
  ]
}
```

---

### Option 2: Netlify

**Steps:**

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Login to Netlify:
```bash
netlify login
```

3. Deploy:
```bash
netlify deploy --prod
```

**netlify.toml Configuration:**
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

### Option 3: GitHub Pages

**Steps:**

1. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

2. Add to package.json:
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  },
  "homepage": "https://<username>.github.io/<repo-name>"
}
```

3. Update vite.config.ts:
```typescript
export default defineConfig({
  base: '/<repo-name>/',
  // ... rest of config
})
```

4. Deploy:
```bash
npm run deploy
```

---

### Option 4: Firebase Hosting

**Steps:**

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase:
```bash
firebase init hosting
```

Select:
- Public directory: `dist`
- Single-page app: `Yes`
- GitHub deployments: `No` (or Yes if desired)

4. Build and deploy:
```bash
npm run build
firebase deploy
```

**firebase.json:**
```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

---

### Option 5: Traditional Hosting (cPanel, FTP, etc.)

**Steps:**

1. Build the application:
```bash
npm run build
```

2. Upload the entire `/dist` folder contents to your hosting provider

3. Configure the web server:

**Apache (.htaccess):**
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

**Nginx (nginx.conf):**
```nginx
server {
  listen 80;
  server_name yourdomain.com;
  root /var/www/html/dist;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

---

## 🔐 Environment Variables

If you need environment variables, create a `.env.production` file:

```env
VITE_APP_TITLE="UNC Digital Museum"
VITE_API_URL="https://api.example.com"
VITE_ANALYTICS_ID="UA-XXXXXXXXX-X"
```

Access in code:
```typescript
const appTitle = import.meta.env.VITE_APP_TITLE;
```

---

## 🌐 Custom Domain Configuration

### Vercel
1. Go to project settings
2. Add custom domain
3. Update DNS records as instructed

### Netlify
1. Go to Domain settings
2. Add custom domain
3. Configure DNS or use Netlify DNS

### Firebase
```bash
firebase hosting:channel:create <channel-name>
firebase hosting:channel:deploy <channel-name>
```

---

## 🔍 SEO & Meta Tags

Add to `/index.html`:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    
    <!-- SEO Meta Tags -->
    <title>UNC Digital Museum - Cultural Heritage Network</title>
    <meta name="description" content="Explore the rich history, art, and culture of Naga City through five magnificent museums. Discover centuries of Bicolano heritage in one unified platform." />
    <meta name="keywords" content="UNC Museum, Naga City, Bicol Heritage, Digital Museum, Cultural Heritage" />
    <meta name="author" content="University of Nueva Caceres" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://unc-museum.edu/" />
    <meta property="og:title" content="UNC Digital Museum - Cultural Heritage Network" />
    <meta property="og:description" content="Explore the rich history, art, and culture of Naga City through five magnificent museums." />
    <meta property="og:image" content="/og-image.jpg" />
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="https://unc-museum.edu/" />
    <meta name="twitter:title" content="UNC Digital Museum - Cultural Heritage Network" />
    <meta name="twitter:description" content="Explore the rich history, art, and culture of Naga City through five magnificent museums." />
    <meta name="twitter:image" content="/og-image.jpg" />
    
    <!-- Favicon -->
    <link rel="icon" type="image/png" href="/favicon.png" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

---

## 📊 Performance Optimization

### 1. Image Optimization
- All images use Unsplash optimized URLs
- Figma assets are properly imported
- Consider adding image loading="lazy" for below-fold images

### 2. Code Splitting
- ✅ Already implemented with lazy loading in App.tsx
- All pages are code-split automatically

### 3. Bundle Analysis

Install bundle analyzer:
```bash
npm install --save-dev rollup-plugin-visualizer
```

Add to vite.config.ts:
```typescript
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({ open: true })
  ]
})
```

Run build to see bundle analysis.

---

## 🐛 Troubleshooting

### Issue: Routes return 404
**Solution:** Ensure server is configured for SPA routing (see hosting configurations above)

### Issue: Assets not loading
**Solution:** Check base URL in vite.config.ts matches your hosting path

### Issue: Build fails
**Solution:** 
- Run `npm install` again
- Delete `node_modules` and `dist` folders
- Clear npm cache: `npm cache clean --force`

### Issue: Environment variables not working
**Solution:** 
- Must prefix with `VITE_`
- Restart dev server after changes
- Use `import.meta.env.VITE_VAR_NAME`

---

## 📈 Post-Deployment

### 1. Test All Routes
- ✅ Landing portal (/)
- ✅ UNC Museum (/unc-museum)
- ✅ Collections (/collections)
- ✅ Educational (/educational)
- ✅ Exclusive (/exclusive)

### 2. Test Features
- ✅ Search functionality
- ✅ Filter dropdowns
- ✅ View toggles
- ✅ Detail views
- ✅ Share modals
- ✅ Zoom/pan controls
- ✅ Responsive design

### 3. Performance Testing
- Run Lighthouse audit
- Check Core Web Vitals
- Test on mobile devices
- Verify loading times

### 4. Analytics (Optional)

Add Google Analytics to `/index.html`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

---

## 🎯 Success Criteria

Your deployment is successful when:

- ✅ All routes work correctly
- ✅ No console errors
- ✅ Images load properly
- ✅ Search and filters work
- ✅ Mobile responsive
- ✅ Fast loading times (< 3s)
- ✅ Lighthouse score > 90

---

## 📞 Support

For deployment issues:
1. Check Vite documentation: https://vitejs.dev/guide/
2. Check hosting provider documentation
3. Review this deployment guide
4. Check browser console for errors

---

**Last Updated:** December 15, 2025  
**Version:** 1.0.0  
**Deployment Ready:** ✅
