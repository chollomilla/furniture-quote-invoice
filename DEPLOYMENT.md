# Deployment Guide

## Quick Start Deployment

### Vercel (Easiest)

1. **Connect GitHub**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import this GitHub repository

2. **Configure**
   - Framework: Other (Vite)
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Environment Variables: (none needed)

3. **Deploy**
   - Click Deploy
   - Get your live URL

4. **Custom Domain (Optional)**
   - Go to Project Settings → Domains
   - Add your custom domain

### Netlify

1. **Connect GitHub**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Choose GitHub
   - Select this repository

2. **Configure**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Click Deploy

3. **Custom Domain (Optional)**
   - Site settings → Domain management
   - Add custom domain

### GitHub Pages

1. **Create Workflow File**
   - `.github/workflows/deploy.yml`

```yaml
name: Deploy

on:
  push:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

2. **Enable GitHub Pages**
   - Settings → Pages
   - Source: Deploy from a branch
   - Branch: gh-pages
   - Save

3. **Access**
   - https://yourusername.github.io/furniture-quote-invoice

### Docker

1. **Create Dockerfile**

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
```

2. **Build Image**

```bash
docker build -t furniture-quote .
```

3. **Run Container**

```bash
docker run -p 3000:3000 furniture-quote
```

4. **Deploy to Docker Hub**

```bash
docker login
docker tag furniture-quote:latest yourusername/furniture-quote:latest
docker push yourusername/furniture-quote:latest
```

### Railway

1. **Connect GitHub**
   - Go to [railway.app](https://railway.app)
   - Create new project
   - Connect GitHub repository

2. **Configure**
   - Add environment variables (none needed)
   - Click Deploy

3. **Access**
   - Get deployment URL from Railway dashboard

### Render

1. **Connect GitHub**
   - Go to [render.com](https://render.com)
   - Create new Static Site
   - Connect GitHub
   - Select repository

2. **Configure**
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
   - Click Create Static Site

## Configuration for Different Hosts

### Environment Variables

None required for MVP (all data stored locally).

### Build Settings

All hosts should use:
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Node Version**: 18 or higher

## Post-Deployment Checklist

- [ ] App loads without errors
- [ ] Mobile layout works (test on 390px)
- [ ] Can create quotation
- [ ] Can print/save PDF
- [ ] Can share via WhatsApp
- [ ] Data persists after refresh
- [ ] PWA installs on Android
- [ ] Offline functionality works
- [ ] No console errors
- [ ] Custom domain resolves (if applicable)
- [ ] HTTPS working (should be automatic)

## Monitoring

### Vercel
- Analytics included
- View in Vercel dashboard

### Netlify
- Analytics included
- Deploy logs visible

### GitHub Pages
- Check workflow status in Actions tab
- Logs available in workflow runs

## Troubleshooting

### Build Fails
- Check Node version (need 16+)
- Verify package.json is correct
- Check for missing dependencies

### App Doesn't Load
- Check browser console for errors
- Verify build output (dist folder)
- Check network tab for 404s

### PWA Not Installable
- Ensure HTTPS is enabled (production only)
- Check manifest.json exists
- Verify service worker is registered

## Custom Domain Setup

### Vercel
1. Project Settings → Domains
2. Add domain
3. Update DNS records (instructions provided)
4. Wait for verification (usually instant)

### Netlify
1. Site settings → Domain management
2. Add custom domain
3. Update DNS records
4. Wait for verification

### GitHub Pages
1. Add CNAME file to root:
   ```
   yourdomain.com
   ```
2. Update DNS CNAME to `yourusername.github.io`
3. Enable HTTPS in repository settings

## CDN & Caching

All major hosting providers include:
- **Vercel**: Automatic CDN
- **Netlify**: Automatic CDN
- **GitHub Pages**: GitHub CDN
- **Railway**: Automatic caching
- **Render**: CDN included

## Analytics

Add Google Analytics (optional):

1. Get tracking ID from Google Analytics
2. Add to HTML head:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

## Backup & Recovery

Since data is stored locally:
- User data stays on their device
- No server backups needed
- Users can export via browser DevTools
- Each device has independent copy

## Performance

Build includes:
- Code minification
- CSS optimization
- Asset optimization
- Tree-shaking
- Source maps (optional)

Verify performance:
- Lighthouse score 90+
- First Contentful Paint < 1s
- Largest Contentful Paint < 2.5s

## Updates

To deploy updates:
1. Commit changes to main branch
2. Push to GitHub
3. Vercel/Netlify auto-deploys
4. New deployment available in minutes

## Rollback

If deployment has issues:
- **Vercel**: Deployments tab → select previous build
- **Netlify**: Deploys tab → select previous deploy
- **GitHub Pages**: Push to main branch to redeploy

## Production Checklist

- [ ] No console errors
- [ ] No console warnings
- [ ] HTTPS enabled
- [ ] PWA works
- [ ] Mobile responsive
- [ ] All features tested
- [ ] PDF printing works
- [ ] WhatsApp sharing works
- [ ] Offline mode tested
- [ ] Analytics (if added)
