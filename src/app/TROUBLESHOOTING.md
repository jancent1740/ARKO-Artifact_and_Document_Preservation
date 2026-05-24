# 🔧 Troubleshooting Guide

## Common Issues & Solutions

---

## 🚨 Installation Issues

### Issue: `npm install` fails

**Symptoms:**
```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

**Solutions:**

#### Solution 1: Clear cache and retry
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

#### Solution 2: Use legacy peer deps
```bash
npm install --legacy-peer-deps
```

#### Solution 3: Update npm
```bash
npm install -g npm@latest
npm install
```

---

### Issue: Node version too old

**Symptoms:**
```
Engine "node" is incompatible with this module
```

**Solution:**
```bash
# Check your Node version
node --version

# Should be >= 18.0.0
# If not, update Node.js from https://nodejs.org
```

---

## 🚀 Development Server Issues

### Issue: Dev server won't start

**Symptoms:**
```
Error: Cannot find module 'vite'
```

**Solution:**
```bash
# Install dependencies first
npm install

# Then start dev server
npm run dev
```

---

### Issue: Port 3000 already in use

**Symptoms:**
```
Port 3000 is in use, trying another one...
```

**Solution 1: Use the auto-assigned port**
- Vite will automatically find an available port
- Check the console for the new port number

**Solution 2: Change the port manually**

Edit `vite.config.ts`:
```typescript
server: {
  port: 3001, // Change to any available port
  open: true,
}
```

**Solution 3: Kill the process on port 3000**
```bash
# On Mac/Linux
lsof -ti:3000 | xargs kill -9

# On Windows
netstat -ano | findstr :3000
taskkill /PID [PID_NUMBER] /F
```

---

### Issue: White screen / blank page

**Symptoms:**
- Browser opens but shows nothing
- Console shows errors

**Solutions:**

#### Check 1: Console errors
```bash
# Open browser DevTools (F12)
# Check Console tab for errors
```

#### Check 2: Verify imports
```bash
# Make sure all imports are correct
# Check for typos in import paths
```

#### Check 3: Clear cache
```bash
# In browser DevTools
# Right-click refresh → Empty Cache and Hard Reload
```

#### Check 4: Restart dev server
```bash
# Stop server (Ctrl+C)
# Start again
npm run dev
```

---

## 🔨 Build Issues

### Issue: Build fails with TypeScript errors

**Symptoms:**
```
error TS2307: Cannot find module
```

**Solutions:**

#### Solution 1: Check file exists
```bash
# Make sure the imported file exists
# Check for typos in file names
```

#### Solution 2: Check tsconfig.json
```bash
# Verify paths are configured
# Check include/exclude arrays
```

#### Solution 3: Skip type check temporarily
```bash
# Edit package.json
"build": "vite build"  # Remove 'tsc &&'
```

---

### Issue: Build fails with module errors

**Symptoms:**
```
Cannot find module 'lucide-react'
```

**Solution:**
```bash
# Install missing dependencies
npm install lucide-react

# Or reinstall all
rm -rf node_modules package-lock.json
npm install
```

---

### Issue: Build succeeds but preview fails

**Symptoms:**
```
npm run preview
# Opens but shows 404 or blank page
```

**Solutions:**

#### Solution 1: Check base path
Verify `vite.config.ts`:
```typescript
export default defineConfig({
  base: '/', // Should be '/' for most cases
})
```

#### Solution 2: Rebuild
```bash
rm -rf dist
npm run build
npm run preview
```

---

## 🎨 Styling Issues

### Issue: Tailwind classes not working

**Symptoms:**
- Classes applied but no styles
- Colors not showing

**Solutions:**

#### Solution 1: Check globals.css is imported
Verify in `src/main.tsx`:
```typescript
import '../styles/globals.css'
```

#### Solution 2: Restart dev server
```bash
# Stop and restart
npm run dev
```

#### Solution 3: Clear PostCSS cache
```bash
rm -rf node_modules/.vite
npm run dev
```

---

### Issue: Custom colors not working

**Symptoms:**
```
className="bg-[#AC0000]"  # Not showing
```

**Solutions:**

#### Solution 1: Use quotes correctly
```typescript
className="bg-[#AC0000]" // ✅ Correct
className="bg-[#ac0000]" // ✅ Also works
```

#### Solution 2: Check purging
- Custom colors in `[]` syntax should always work
- No action needed

---

## 🔗 Import Issues

### Issue: Import path not found

**Symptoms:**
```
Cannot find module '@components/Button'
```

**Solutions:**

#### Solution 1: Use correct path
```typescript
// Use relative path
import Button from '../components/ui/button'

// Or path alias
import Button from '@/components/ui/button'
```

#### Solution 2: Check tsconfig.json
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@components/*": ["./components/*"]
    }
  }
}
```

#### Solution 3: Restart TypeScript server
In VS Code: `Cmd/Ctrl + Shift + P` → "Restart TS Server"

---

### Issue: Module not found - Figma imports

**Symptoms:**
```
Cannot find module 'figma:asset/...'
```

**Solution:**
This is expected - Figma asset imports are virtual:
```typescript
// These work only in Figma Make environment
import img from "figma:asset/abc123.png"

// For local development, use public folder
import img from "/images/image.png"
```

---

## 🚦 Runtime Issues

### Issue: React Router not working

**Symptoms:**
- Routes show 404
- Navigation doesn't work

**Solutions:**

#### Solution 1: Check BrowserRouter
Verify in `App.tsx`:
```typescript
import { BrowserRouter } from 'react-router-dom'

// Wrap app in BrowserRouter
<BrowserRouter>
  <Routes>...</Routes>
</BrowserRouter>
```

#### Solution 2: Check Routes configuration
```typescript
<Route path="/" element={<Homepage />} />
// Not: <Route path="/" component={Homepage} />
```

---

### Issue: Environment variables not working

**Symptoms:**
```
import.meta.env.MY_VAR  // undefined
```

**Solutions:**

#### Solution 1: Use VITE_ prefix
```bash
# In .env file
VITE_API_URL=https://api.example.com  # ✅ Works
API_URL=https://api.example.com       # ❌ Won't work
```

#### Solution 2: Restart dev server
```bash
# After changing .env file
npm run dev
```

---

## 🎯 Performance Issues

### Issue: Dev server slow

**Symptoms:**
- Initial load takes > 5 seconds
- Hot reload is slow

**Solutions:**

#### Solution 1: Clear cache
```bash
rm -rf node_modules/.vite
npm run dev
```

#### Solution 2: Optimize dependencies
Edit `vite.config.ts`:
```typescript
optimizeDeps: {
  include: [
    'react',
    'react-dom',
    'react-router-dom',
    // Add other frequently used packages
  ],
}
```

#### Solution 3: Reduce file watching
```typescript
server: {
  watch: {
    ignored: ['**/node_modules/**', '**/dist/**']
  }
}
```

---

### Issue: Large bundle size

**Symptoms:**
```
npm run build
# Shows warnings about chunk sizes
```

**Solutions:**

#### Solution 1: Enable code splitting
Already configured! Check `vite.config.ts`:
```typescript
build: {
  rollupOptions: {
    output: {
      manualChunks: { ... }
    }
  }
}
```

#### Solution 2: Lazy load routes
```typescript
const Page = lazy(() => import('./pages/Page'))
```

#### Solution 3: Analyze bundle
```bash
npm install rollup-plugin-visualizer
# Add to vite.config.ts
```

---

## 🔍 Debugging

### Enable source maps

Edit `vite.config.ts`:
```typescript
build: {
  sourcemap: true,  // Change from false
}
```

### Enable verbose logging

```bash
# Run with debug flag
DEBUG=vite:* npm run dev
```

### Check build output

```bash
npm run build -- --debug
```

---

## 📦 Deployment Issues

### Issue: Deployed site shows 404

**Symptoms:**
- Routes work locally
- Show 404 on deployed site

**Solutions:**

#### For Netlify
Create `public/_redirects`:
```
/*    /index.html   200
```

#### For Vercel
Create `vercel.json`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

#### For Apache
Create `.htaccess`:
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

---

### Issue: Assets not loading on deployed site

**Symptoms:**
- Images/fonts broken in production
- Console shows 404 for assets

**Solutions:**

#### Solution 1: Check base path
```typescript
// In vite.config.ts
export default defineConfig({
  base: '/',  // Or '/your-repo-name/' for GitHub Pages
})
```

#### Solution 2: Use absolute paths
```typescript
// Use leading slash
<img src="/images/logo.png" />  // ✅
<img src="images/logo.png" />   // ❌
```

---

## 🆘 Emergency Reset

If nothing works, try this complete reset:

```bash
# 1. Delete everything generated
rm -rf node_modules
rm -rf dist
rm -rf .vite
rm package-lock.json

# 2. Clear npm cache
npm cache clean --force

# 3. Reinstall
npm install

# 4. Try dev server
npm run dev

# 5. If still broken, try build
npm run build
npm run preview
```

---

## 📞 Getting Help

### Before asking for help:

1. ✅ Check this troubleshooting guide
2. ✅ Read error messages carefully
3. ✅ Check browser console (F12)
4. ✅ Try the solutions above
5. ✅ Check official docs:
   - [Vite](https://vitejs.dev)
   - [React](https://react.dev)
   - [TypeScript](https://typescriptlang.org)

### When asking for help, provide:

1. Full error message
2. Steps to reproduce
3. Your Node/npm version (`node -v`, `npm -v`)
4. What you've already tried
5. Relevant code snippets

---

## ✅ Quick Checks

Run these to verify everything:

```bash
# 1. Check Node version (should be >= 18)
node --version

# 2. Check npm version (should be >= 9)
npm --version

# 3. Verify files exist
ls vite.config.ts    # Should exist
ls package.json      # Should exist
ls index.html        # Should exist

# 4. Check TypeScript
npm run type-check

# 5. Check linting
npm run lint

# 6. Try build
npm run build
```

If all pass, you're good! 🎉

---

## 🎯 Common Error Codes

| Error | Meaning | Solution |
|-------|---------|----------|
| ENOENT | File not found | Check file path exists |
| EADDRINUSE | Port in use | Change port or kill process |
| ERESOLVE | Dependency conflict | Clear cache, reinstall |
| MODULE_NOT_FOUND | Missing package | Run `npm install` |
| ERR_NETWORK | Network issue | Check internet connection |

---

## 💡 Prevention Tips

1. **Always run `npm install` first**
2. **Restart dev server after config changes**
3. **Clear cache if things feel broken**
4. **Check console for errors immediately**
5. **Use exact versions in package.json**
6. **Don't modify node_modules directly**
7. **Keep Node/npm updated**
8. **Read error messages carefully**

---

## 🎉 Still Working?

If you've tried everything and it's still not working:

1. Check all solutions above
2. Review documentation files
3. Verify Node >= 18.0.0
4. Try the Emergency Reset
5. Check official Vite docs

Most issues are solved by:
- Running `npm install`
- Clearing cache
- Restarting dev server
- Reading error messages

**Good luck! You've got this! 💪**
