# AI Agent Website Development Guidelines

## Overview

This document provides comprehensive guidelines for AI agents to create professional, modern websites. Follow these structured prompts and utilize the recommended tools to ensure high-quality deliverables.

## 1. Project Discovery & Planning

### Initial Assessment Prompts

**AGENT INSTRUCTION**: Ask these questions sequentially to understand the project requirements before proceeding with development.

#### Primary Discovery Questions

1. **Purpose Definition**: "What is the primary objective of this website? (e.g., business showcase, e-commerce, portfolio, blog, SaaS platform)"

2. **Website Type**: "Do you need a static or dynamic website?"
   - **Static**: "Content rarely changes, faster loading, lower cost (portfolios, brochures, simple business sites)"
   - **Dynamic**: "Content updates frequently, user interactions, database-driven (e-commerce, booking systems, user accounts)"
   - **Follow-up**: "Will you need to update content regularly? Do you need user accounts, real-time data, or interactive features?"

3. **Target Audience**: "Who are the primary users? Define demographics, technical proficiency, and user goals."

4. **Success Metrics**: "What defines success for this project? (conversions, engagement, lead generation)"

5. **Budget & Timeline**: "What are the resource constraints and delivery expectations?"

#### Industry-Specific Follow-ups

**If Travel Agency/Tourism:**

- "What travel services do you offer?" (tours, rentals, bookings, itineraries)
- "Do you handle direct bookings or redirect to partners?"
- "What's your geographic focus?" (local, regional, international)
- "What's your target traveler type?" (luxury, budget, adventure, family)

**If E-commerce:**

- "What products/services are you selling?"
- "Do you need payment processing integration?"
- "Will you manage inventory directly?"
- "Do you need user accounts/profiles?"

**If Business/Corporate:**

- "What's your main business offering?"
- "Do you need lead generation forms?"
- "Will you have a blog/news section?"
- "Do you need client portals or dashboards?"

#### Next Steps After Assessment

Once answers are collected, the agent should:

1. Summarize the project requirements
2. Recommend appropriate technology stack
3. Suggest essential features and pages
4. Proceed to design and development phases

### Competitive Analysis

- Research 3-5 competitor websites
- Analyze their UX/UI patterns, content strategy, and technical implementation
- Identify opportunities for differentiation

### Feature Requirements

- **Core Features**: Essential functionality (contact forms, navigation, content management)
- **Advanced Features**: Interactive elements, integrations, custom functionality
- **Future Scalability**: Plan for growth and additional features

## 2. Design & Branding Strategy

### Visual Identity Development

- **Logo Creation**: Use tools like Canva, Figma, or Adobe Creative Suite
- **Color Palette**:
  - Primary color (brand identity)
  - Secondary colors (2-3 complementary)
  - Neutral colors (backgrounds, text)
  - Accessibility-compliant contrast ratios (WCAG AA: 4.5:1)

### Typography System

- **Heading Fonts**: Choose 1 distinctive font for headers
- **Body Text**: Select readable font for content
- **Font Pairing**: Ensure visual hierarchy and readability
- **Web Font Sources**: Google Fonts, Adobe Fonts, or custom fonts

### Design Tools & Resources

- **Wireframing**: Figma, Adobe XD, Sketch, or Balsamiq
- **Prototyping**: InVision, Marvel, or Figma
- **Image Resources**: Unsplash, Pexels, Shutterstock
- **Icon Libraries**: Font Awesome, Heroicons, Feather Icons
- **Color Tools**: Coolors.co, Adobe Color, Paletton

## 3. Technical Architecture

### Technology Stack Selection

- **Frontend Frameworks**:

  - React.js + Next.js (for dynamic applications)
  - Vue.js + Nuxt.js (progressive enhancement)
  - Vanilla HTML/CSS/JS (for simple sites)
  - Static Site Generators: Gatsby, Hugo, Jekyll

- **CSS Frameworks**:

  - Tailwind CSS (utility-first)
  - Bootstrap (component-based)
  - Bulma (modern CSS framework)
  - Custom CSS with preprocessors (Sass, Less)

- **Backend Solutions**:
  - Node.js + Express
  - Python + Django/Flask
  - PHP + Laravel
  - Headless CMS: Strapi, Contentful, Sanity

### Development Environment Setup

- **Code Editor**: VS Code with essential extensions
- **Version Control**: Git + GitHub/GitLab/Bitbucket
- **Package Managers**: npm, yarn, or pnpm
- **Build Tools**: Webpack, Vite, or Parcel
- **Local Development**: Live Server, Local by Flywheel, or Docker

## 4. Content Strategy & SEO

### Content Planning

- **Information Architecture**: Sitemap and page hierarchy
- **Content Audit**: Inventory existing content and identify gaps
- **Content Calendar**: Plan for ongoing content updates
- **Copywriting Guidelines**: Tone, voice, and messaging consistency

### SEO Implementation

- **Keyword Research**: Use Google Keyword Planner, SEMrush, or Ahrefs
- **On-Page SEO**:
  - Meta titles (50-60 characters)
  - Meta descriptions (150-160 characters)
  - Header tag hierarchy (H1, H2, H3)
  - Alt text for images
  - Schema markup implementation

### Content Management

- **CMS Selection**: WordPress, Strapi, Contentful, or custom solutions
- **Content Types**: Pages, posts, media, custom fields
- **User Roles**: Admin, editor, contributor permissions

## 5. Development Best Practices

### Code Quality Standards

- **HTML**: Semantic markup, accessibility attributes
- **CSS**: BEM methodology, mobile-first approach, CSS Grid/Flexbox
- **JavaScript**: ES6+ features, modular code, error handling
- **Performance**: Code splitting, lazy loading, image optimization

### Responsive Design Implementation

- **Breakpoints**: Mobile (320px+), Tablet (768px+), Desktop (1024px+)
- **Testing Devices**: iPhone, Android, iPad, various desktop sizes
- **Touch Interactions**: Ensure mobile-friendly navigation and buttons

### Accessibility Compliance

- **WCAG 2.1 AA Standards**:
  - Keyboard navigation support
  - Screen reader compatibility
  - Color contrast compliance
  - Focus indicators
  - Alternative text for images

## 6. Performance Optimization

### Core Web Vitals

- **Largest Contentful Paint (LCP)**: < 2.5 seconds
- **First Input Delay (FID)**: < 100 milliseconds
- **Cumulative Layout Shift (CLS)**: < 0.1

### Optimization Techniques

- **Image Optimization**: WebP format, responsive images, lazy loading
- **Code Optimization**: Minification, compression, tree shaking
- **Caching Strategies**: Browser caching, CDN implementation
- **Database Optimization**: Query optimization, indexing

### Performance Tools

- Google Lighthouse
- GTmetrix
- WebPageTest
- Google PageSpeed Insights

## 7. Security Implementation

### Security Measures

- **HTTPS**: SSL certificate implementation
- **Input Validation**: Sanitize all user inputs
- **Authentication**: Secure login systems
- **Data Protection**: GDPR/CCPA compliance
- **Regular Updates**: Keep all dependencies current

### Security Tools

- **SSL Testing**: SSL Labs
- **Vulnerability Scanning**: OWASP ZAP, Snyk
- **Security Headers**: SecurityHeaders.com

## 8. Testing & Quality Assurance

### Testing Checklist

- **Functionality Testing**: All features work as expected
- **Cross-Browser Testing**: Chrome, Firefox, Safari, Edge
- **Device Testing**: Mobile, tablet, desktop
- **Performance Testing**: Load times, Core Web Vitals
- **Accessibility Testing**: Screen readers, keyboard navigation
- **Security Testing**: Vulnerability assessment

### Testing Tools

- **Browser Testing**: BrowserStack, CrossBrowserTesting
- **Accessibility**: axe, WAVE, Lighthouse
- **Performance**: Google Lighthouse, GTmetrix
- **Code Quality**: ESLint, Prettier, SonarQube

## 9. Deployment & Launch

### Pre-Launch Checklist

- [ ] All content reviewed and approved
- [ ] SEO meta tags implemented
- [ ] Analytics tracking setup (Google Analytics, Google Tag Manager)
- [ ] Search Console verification
- [ ] Sitemap.xml generated and submitted
- [ ] Robots.txt configured
- [ ] Favicon and social sharing images added
- [ ] Contact forms tested
- [ ] 404 error page created
- [ ] Backup system configured
- [ ] SSL certificate installed
- [ ] Performance optimization complete

### Hosting & Deployment

- **Hosting Options**: Netlify, Vercel, AWS, DigitalOcean, traditional hosting
- **Domain Setup**: DNS configuration, subdomain setup
- **CDN**: Cloudflare, AWS CloudFront
- **Monitoring**: Uptime monitoring, error tracking

## 10. Post-Launch Maintenance

### Ongoing Tasks

- **Performance Monitoring**: Regular speed tests and optimization
- **Content Updates**: Fresh content, blog posts, news updates
- **Security Updates**: Plugin updates, security patches
- **Analytics Review**: Monthly performance reports
- **User Feedback**: Collect and implement user suggestions
- **Backup Management**: Regular backups and restore testing

### Growth & Optimization

- **A/B Testing**: Conversion optimization
- **SEO Monitoring**: Keyword rankings, organic traffic
- **User Experience**: Heatmaps, user session recordings
- **Feature Enhancement**: Based on user feedback and analytics

## 11. Essential Tools & Resources

### Design Tools

- Figma (UI/UX design)
- Adobe Creative Suite
- Canva (quick graphics)
- Unsplash/Pexels (stock photos)

### Development Tools

- VS Code + Extensions
- Git + GitHub/GitLab
- Chrome DevTools
- Postman (API testing)

### SEO & Analytics

- Google Analytics
- Google Search Console
- SEMrush/Ahrefs
- Google Tag Manager

### Performance & Testing

- Google Lighthouse
- GTmetrix
- BrowserStack
- axe DevTools

### Deployment & Hosting

- Netlify/Vercel (JAMstack)
- AWS/DigitalOcean (full-stack)
- Cloudflare (CDN/Security)

## 12. AI Agent Specific Prompts

### Code Generation Prompts

- "Generate semantic HTML structure for [specific component]"
- "Create responsive CSS for [layout description] using [framework]"
- "Write JavaScript functionality for [specific feature]"
- "Implement accessibility features for [component type]"

### Content Creation Prompts

- "Write compelling copy for [page type] targeting [audience]"
- "Generate SEO-optimized meta descriptions for [page content]"
- "Create user-friendly error messages for [form validation]"

### Problem-Solving Prompts

- "Debug [specific issue] in [technology stack]"
- "Optimize [performance metric] for [website type]"
- "Implement [security measure] for [specific vulnerability]"

---

## Quick Start Template

For rapid development, use this template structure:

```plaintext
project-name/
├── index.html
├── assets/
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   └── script.js
│   └── images/
├── pages/
├── components/
└── README.md
```

Remember: Always prioritize user experience, accessibility, and performance in every decision.
