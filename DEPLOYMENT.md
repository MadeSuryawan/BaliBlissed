# BaliBlissed Deployment Guide

This guide provides step-by-step instructions for deploying the BaliBlissed website to various hosting platforms.

## 🚀 Pre-Deployment Checklist

Before deploying, ensure you have completed the following:

### 1. Analytics Setup

- [ ] Create Google Analytics 4 property
- [ ] Create Google Tag Manager container
- [ ] Replace placeholder IDs in `index.html`:
  - `GTM-XXXXXXX` → Your GTM container ID
  - `GA_MEASUREMENT_ID` → Your GA4 measurement ID

### 2. Contact Information

- [ ] Update WhatsApp number in `js/main.js` (CONFIG.WHATSAPP_NUMBER)
- [ ] Update contact details in `includes/footer.html`
- [ ] Update structured data in `index.html`

### 3. Domain Configuration

- [ ] Update absolute URLs in sitemap.xml
- [ ] Update Open Graph URLs in all HTML files
- [ ] Configure canonical URLs if needed

## 🌐 Deployment Options

### Option 1: Static Hosting (Recommended)

#### Netlify Deployment

1. **Prepare for deployment:**

   ```bash
   # Ensure all files are ready
   ls -la
   ```

2. **Deploy via Netlify Drop:**
   - Visit [netlify.com](https://netlify.com)
   - Drag and drop your project folder to the deploy area
   - Your site will be live immediately with a random subdomain

3. **Custom Domain Setup:**
   - Go to Site Settings → Domain Management
   - Add your custom domain
   - Configure DNS records as instructed
   - SSL certificate will be automatically provisioned

4. **Environment Configuration:**
   - No server-side configuration needed
   - All optimizations are handled client-side

#### Vercel Deployment

1. **Install Vercel CLI (optional):**

   ```bash
   npm i -g vercel
   ```

2. **Deploy:**

   ```bash
   vercel --prod
   ```

3. **Or use GitHub integration:**
   - Connect your GitHub repository
   - Automatic deployments on push

### Option 2: Traditional Web Hosting

#### Shared Hosting (cPanel/FTP)

1. **Upload files:**

   ```bash
   # Via FTP client or cPanel File Manager
   # Upload all files to public_html/ or www/ directory
   ```

2. **File permissions:**

   ```bash
   # Set proper permissions
   find . -type f -exec chmod 644 {} \;
   find . -type d -exec chmod 755 {} \;
   chmod 644 .htaccess
   ```

3. **Verify .htaccess:**
   - Ensure .htaccess file is uploaded
   - Check if mod_rewrite is enabled
   - Test security headers

#### VPS/Dedicated Server

1. **Nginx Configuration:**

   ```nginx
   server {
       listen 80;
       server_name baliblissed.com www.baliblissed.com;
       root /var/www/baliblissed;
       index index.html;
       
       # Security headers
       add_header X-Content-Type-Options nosniff;
       add_header X-XSS-Protection "1; mode=block";
       add_header X-Frame-Options SAMEORIGIN;
       add_header Referrer-Policy "strict-origin-when-cross-origin";
       
       # Gzip compression
       gzip on;
       gzip_types text/css application/javascript image/svg+xml;
       
       # Cache static assets
       location ~* \.(css|js|png|jpg|jpeg|gif|webp|svg|woff|woff2)$ {
           expires 1M;
           add_header Cache-Control "public, immutable";
       }
       
       # Handle 404 errors
       error_page 404 /404.html;
   }
   ```

2. **Apache Configuration:**
   - The included `.htaccess` file handles most configurations
   - Ensure mod_rewrite, mod_headers, and mod_expires are enabled

## 🔒 SSL Certificate Setup

### Automatic SSL (Recommended)

1. **Netlify/Vercel:**
   - SSL certificates are automatically provisioned
   - No additional configuration needed

2. **Cloudflare:**
   - Add your domain to Cloudflare
   - Enable "Always Use HTTPS"
   - Configure SSL/TLS settings

### Manual SSL Setup

1. **Let's Encrypt (Free):**

   ```bash
   # Install Certbot
   sudo apt install certbot python3-certbot-nginx
   
   # Generate certificate
   sudo certbot --nginx -d baliblissed.com -d www.baliblissed.com
   ```

2. **Commercial SSL:**
   - Purchase SSL certificate from provider
   - Install according to hosting provider instructions

## 📊 Post-Deployment Configuration

### 1. Google Analytics Setup

1. **Verify tracking:**
   - Visit your website
   - Check Google Analytics Real-Time reports
   - Ensure events are being tracked

2. **Configure goals:**
   - Contact form submissions
   - WhatsApp button clicks
   - Newsletter signups

### 2. Google Search Console

1. **Add property:**
   - Add your domain to Google Search Console
   - Verify ownership via HTML file or DNS

2. **Submit sitemap:**
   - Submit `sitemap.xml` to Google Search Console
   - Monitor indexing status

### 3. Performance Testing

1. **Core Web Vitals:**
   - Test with Google PageSpeed Insights
   - Aim for scores above 90

2. **Cross-browser testing:**
   - Test on Chrome, Firefox, Safari, Edge
   - Verify mobile responsiveness

## 🔧 Troubleshooting

### Common Issues

1. **Images not loading:**
   - Check file paths and case sensitivity
   - Verify image files are uploaded
   - Check server permissions

2. **Contact form not working:**
   - Verify WhatsApp number format
   - Check JavaScript console for errors
   - Test form validation

3. **CSS/JS not loading:**
   - Check file paths in HTML
   - Verify MIME types are configured
   - Clear browser cache

4. **404 errors:**
   - Ensure 404.html is in root directory
   - Check .htaccess configuration
   - Verify server error page settings

### Performance Issues

1. **Slow loading:**
   - Enable compression (gzip)
   - Optimize images
   - Check CDN configuration

2. **Poor mobile performance:**
   - Test on actual mobile devices
   - Check viewport meta tag
   - Verify touch interactions

## 📱 Mobile Testing

### Testing Checklist

- [ ] Navigation menu works on mobile
- [ ] Forms are easy to fill on mobile
- [ ] Images load properly
- [ ] WhatsApp integration works
- [ ] Touch targets are appropriately sized

### Testing Tools

- Chrome DevTools Device Mode
- BrowserStack for real device testing
- Google Mobile-Friendly Test

## 🔄 Maintenance

### Regular Tasks

1. **Weekly:**
   - Check website functionality
   - Monitor Google Analytics
   - Review contact form submissions

2. **Monthly:**
   - Update content and testimonials
   - Check for broken links
   - Review performance metrics
   - Update destination information

3. **Quarterly:**
   - Security audit
   - Performance optimization
   - SEO review and updates
   - Backup verification

### Backup Strategy

1. **Automated backups:**
   - Set up daily backups with hosting provider
   - Store backups in multiple locations

2. **Version control:**
   - Use Git for code changes
   - Tag releases for easy rollback

## 📞 Support

For technical issues or questions:

- Check the main README.md file
- Review browser console for JavaScript errors
- Contact hosting provider for server-related issues

## 🎯 Success Metrics

Monitor these KPIs after deployment:

- Website loading speed (< 3 seconds)
- Mobile usability score (> 95)
- SEO score (> 90)
- Contact form conversion rate
- Bounce rate (< 60%)

---

**Note:** Always test thoroughly in a staging environment before deploying to production.
