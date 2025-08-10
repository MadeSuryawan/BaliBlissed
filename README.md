# BaliBlissed - Professional Travel Agency Website

A modern, responsive, and professional website for BaliBlissed, a local Balinese travel agency specializing in authentic cultural experiences, adventure tours, and luxury vacation packages.

## 🌟 Features

### Professional Design

- **Modern UI/UX**: Clean, professional design with Balinese-inspired color scheme
- **Responsive Layout**: Optimized for all devices (mobile, tablet, desktop)
- **Accessibility Compliant**: WCAG 2.1 AA standards with proper ARIA labels
- **Performance Optimized**: Lazy loading, optimized images, and efficient code

### Core Functionality

- **Interactive Destination Gallery**: Paginated destination cards with dynamic image loading
- **Contact Form**: Professional contact form with WhatsApp integration
- **Newsletter Signup**: Modal-based newsletter subscription (disabled)
- **Testimonials Carousel**: Customer reviews with smooth navigation
- **Mobile-First Navigation**: Responsive header with mobile menu

### SEO & Analytics

- **Complete SEO Setup**: Meta tags, Open Graph, Twitter Cards
- **Structured Data**: JSON-LD schema markup for travel agency
- **Google Analytics**: Ready for GA4 integration
- **Google Tag Manager**: GTM implementation for advanced tracking
- **Sitemap & Robots.txt**: Search engine optimization files

### Professional Pages

- **About Page**: Comprehensive company information and team details
- **FAQ Page**: Interactive frequently asked questions
- **Privacy Policy**: GDPR-compliant privacy policy
- **Terms of Service**: Professional terms and conditions

## 🚀 Quick Start

### Prerequisites

- Web server (Apache, Nginx, or any static file server)
- Modern web browser
- Optional: Google Analytics and Google Tag Manager accounts

### Installation

1. **Clone or download the repository**

    ```bash
    git clone [repository-url]
    cd BaliBlissed
    ```

2. **Configure Analytics (Optional)**
    - Replace `GTM-XXXXXXX` in `index.html` with your Google Tag Manager ID
    - Replace `GA_MEASUREMENT_ID` with your Google Analytics 4 measurement ID

3. **Deploy to web server**
    - Upload all files to your web server's public directory
    - Ensure proper file permissions are set

4. **Test the website**
    - Open the website in a browser
    - Test all forms and interactive elements
    - Verify mobile responsiveness

## 📁 Project Structure

```plain_text
BaliBlissed/
├── index.html                 # Main homepage
├── css/
│   └── style.css             # Main stylesheet with CSS variables
├── js/
│   └── main.js               # JavaScript functionality
├── images/
│   ├── hero/                 # Hero section images
│   ├── destinations/         # Destination images
│   └── testimonials/         # Testimonial images
├── icons/
│   ├── Favicons_(logo)/      # Logo and favicon files
│   ├── Favicons_(Facebook)/  # Social media icons
│   ├── Favicons_(Instagram)/
│   ├── Favicons_(WhatsApp)/
│   └── Favicons_(Arrow)/
├── includes/
│   ├── header.html           # Header component
│   └── footer.html           # Footer component
├── pages/
│   ├── about.html            # About page
│   ├── faq.html              # FAQ page
│   ├── privacy-policy.html   # Privacy policy
│   └── terms-of-service.html # Terms of service
├── destinations/
│   └── activities/           # Individual destination pages
├── services/
│   └── private_car_charter/  # Service pages
├── sitemap.xml               # SEO sitemap
├── robots.txt                # Search engine directives
└── README.md                 # This file
```

## 🛠️ Customization

### Branding

- **Colors**: Modify CSS variables in `css/style.css` (lines 1-77)
- **Logo**: Replace files in `icons/Favicons_(logo)/`
- **Company Info**: Update contact details in `includes/footer.html`

### Content

- **Homepage**: Edit `index.html` for main content
- **About Page**: Modify `pages/about.html`
- **Destinations**: Add new destinations in `destinations/activities/`
- **Testimonials**: Update testimonials in `index.html` (lines 1375-1646)

### Contact Information

Update the following files with your contact details:

- `includes/footer.html` - Footer contact information
- `js/main.js` - WhatsApp number in CONFIG object
- `index.html` - JSON-LD structured data

## 📱 Features Overview

### Homepage Sections

1. **Hero Section**: Eye-catching banner with call-to-action
2. **Service Link Banner**: Highlights car charter services
3. **Destinations Gallery**: Paginated destination cards (30 destinations)
4. **Why Choose Us**: Value propositions and benefits
5. **Testimonials**: Customer reviews carousel
6. **Contact Form**: Professional inquiry form
7. **Footer**: Company information and links

### Interactive Elements

- **Destination Pagination**: Navigate through destination pages
- **Image Lazy Loading**: Optimized image loading for performance
- **Form Validation**: Client-side form validation with notifications
- **Mobile Menu**: Responsive navigation for mobile devices
- **WhatsApp Integration**: Direct messaging for bookings

### Accessibility Features

- **ARIA Labels**: Proper labeling for screen readers
- **Keyboard Navigation**: Full keyboard accessibility
- **Color Contrast**: WCAG AA compliant color ratios
- **Semantic HTML**: Proper HTML structure and elements
- **Alt Text**: Descriptive alternative text for images

## 🔧 Technical Details

### Technologies Used

- **HTML5**: Semantic markup with proper structure
- **CSS3**: Modern CSS with custom properties and Grid/Flexbox
- **Vanilla JavaScript**: No external dependencies
- **Font Awesome**: Icon library for UI elements
- **Google Fonts**: Poppins font family

### Performance Optimizations

- **Lazy Loading**: Images load only when needed
- **CSS Variables**: Efficient styling system
- **Minified Assets**: Optimized file sizes
- **Responsive Images**: Appropriate image sizes for different devices

### Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📊 SEO Features

### On-Page SEO

- **Meta Tags**: Comprehensive meta descriptions and keywords
- **Open Graph**: Social media sharing optimization
- **Twitter Cards**: Twitter-specific sharing metadata
- **Structured Data**: JSON-LD schema for travel agency

### Technical SEO

- **Sitemap.xml**: Complete sitemap for search engines
- **Robots.txt**: Search engine crawling directives
- **Canonical URLs**: Proper URL structure
- **Mobile-Friendly**: Google mobile-first indexing ready

## 🚀 Deployment

### Static Hosting (Recommended)

- **Netlify**: Drag and drop deployment
- **Vercel**: Git-based deployment
- **GitHub Pages**: Free hosting for public repositories

### Traditional Hosting

- **Shared Hosting**: Upload via FTP/SFTP
- **VPS/Dedicated**: Configure web server (Apache/Nginx)

### Domain Setup

1. Point domain to hosting provider
2. Configure DNS settings
3. Set up SSL certificate
4. Update absolute URLs in code if necessary

## 📞 Support & Maintenance

### Regular Updates

- **Content**: Update destinations and testimonials regularly
- **Images**: Refresh with new high-quality photos
- **SEO**: Monitor and update meta descriptions
- **Security**: Keep any server software updated

### Monitoring

- **Google Analytics**: Track website performance
- **Google Search Console**: Monitor SEO performance
- **Core Web Vitals**: Ensure optimal loading speeds

## 📄 License

This project is created for BaliBlissed travel agency. All rights reserved.

## 🤝 Contributing

For updates or modifications, please contact the development team or submit issues through the appropriate channels.

---

**BaliBlissed** - Experience the authentic heart of Bali with your local Balinese travel partner.

For technical support or questions about this website, please contact the development team.
