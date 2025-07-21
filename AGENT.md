# AGENT.md - BaliBlissed Travel Website

## Build/Test/Lint Commands
- **Development**: Open with Live Server (VS Code extension) on port 5501
- **Testing**: Open index.html in browser to test functionality
- **No package.json**: This is a vanilla HTML/CSS/JS project with no build tools

## Architecture & Structure
- **Static travel website** for Bali tourism packages and activities
- **Main pages**: index.html (home), destinations/activities/*/, services/private_car_charter/
- **Components**: includes/header.html, includes/footer.html (loaded via JS)
- **Assets**: css/style.css, js/main.js, images/, icons/, destinations/
- **No backend/database**: Pure frontend with WhatsApp integration for bookings

## Code Style & Conventions
- **HTML**: Semantic structure, accessibility attributes (aria-*, role), BEM-like class naming
- **CSS**: CSS variables in :root, mobile-first responsive design, component-based structure
- **JavaScript**: ES6+ with IIFE pattern, strict mode, modular controllers, utility functions
- **Images**: WebP format preferred, relative paths with base path adjustment for nested pages
- **Naming**: kebab-case for files/folders, camelCase for JS variables, BEM for CSS classes
- **Error handling**: Try-catch blocks in JS, graceful degradation for missing elements
- **WhatsApp integration**: Custom messages based on page content, phone number +6285847006743
