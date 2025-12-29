# Project Structure

## Root Level Configuration
- **package.json**: Dependencies and npm scripts
- **next.config.js**: Next.js configuration with image optimization and rewrites
- **tailwind.config.js**: Tailwind CSS configuration with custom theme extensions
- **tsconfig.json**: TypeScript configuration (partial implementation)
- **netlify.toml**: Netlify deployment configuration with caching rules
- **.env / .env.example**: Environment variables for API keys and configuration

## Core Application Structure

### `/pages` - Next.js Pages Router
- **index.jsx**: Main landing page with hero section and product showcase
- **checkout.jsx**: Payment processing page
- **faq.jsx**: Frequently asked questions page
- **features.jsx**: Product features and benefits page
- **reserve-vip-spot.jsx**: VIP reservation landing page
- **shop.jsx**: Product catalog page
- **_app.jsx**: Global app wrapper with providers
- **_document.js**: Custom HTML document structure

### `/pages/api` - Server-side API Routes
- **subscribe.js**: Email subscription endpoint (deprecated, uses Google Sheets)
- **payment.js**: Payment processing coordination
- **payment/stripe-intent.js**: Stripe payment intent creation
- **payment/paypal/**: PayPal integration endpoints
- **payment/payoneer/**: Payoneer integration endpoints

### `/components` - Reusable UI Components
- **layout/**: Navigation and footer components
- **EmailNotifyFloatingBox.jsx**: Floating email capture widget
- **GlobalEmailNotifyBox.jsx**: Global email notification component
- **PopModal.jsx**: VIP reservation popup modal
- **ProductCarousel.jsx**: Product showcase carousel

### `/context` - React Context Providers
- **LanguageContext.jsx**: Multi-language support (currently locked to English)

### `/lib` - Utility Libraries
- **api.js**: API utility functions and URL sanitization
- **analytics.js**: Analytics tracking utilities
- **countryRegions.js**: Geographic data for forms
- **fbq.js**: Facebook Pixel integration

### `/public` - Static Assets
- **assets/**: Images, icons, and media files organized by feature
- **assets/ima/**: Main product images and graphics
- **assets/ks_pic/**: Kickstarter campaign images
- **assets/reserve-vip-spot/**: VIP reservation page assets
- **faq.md / faq-zh.md**: FAQ content in markdown format
- **features.md / features-zh.md**: Features content in markdown format

### `/styles` - Global Styling
- **globals.css**: Global CSS styles and Tailwind imports

## File Naming Conventions
- **Pages**: kebab-case for URLs (reserve-vip-spot.jsx)
- **Components**: PascalCase (PopModal.jsx)
- **Utilities**: camelCase (api.js)
- **Assets**: Descriptive names with hyphens for readability
- **CSS Modules**: Component.module.css pattern

## Key Architectural Decisions
- **Static Generation**: Optimized for Netlify deployment with pre-built pages
- **Component Isolation**: CSS Modules for component-specific styling
- **API Abstraction**: Centralized API utilities in `/lib/api.js`
- **Asset Organization**: Grouped by feature/page for maintainability
- **Environment-based Configuration**: Separate configs for development and production