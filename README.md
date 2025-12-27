# WE3 Agency Website

A premium, production-grade Next.js website for WE3 Agency — a boutique web design and development studio.

## 🚀 Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) with App Router
- **Language:** TypeScript (strict mode)
- **Styling:** CSS Modules + CSS Custom Properties
- **Animations:** [GSAP](https://gsap.com/) + ScrollTrigger
- **Smooth Scroll:** [Lenis](https://lenis.studiofreight.com/)
- **Fonts:** Inter via `next/font`

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout with SEO
│   ├── page.tsx            # Home page
│   ├── globals.css         # Global styles
│   ├── sitemap.ts          # Dynamic sitemap generation
│   └── robots.ts           # Robots.txt configuration
├── components/
│   ├── sections/           # Page sections (Intro, Services, etc.)
│   ├── ui/                 # Reusable UI components
│   └── providers/          # Context providers (SmoothScroll)
├── hooks/                  # Custom React hooks
│   ├── useScrollAnimation.ts
│   └── useMediaQuery.ts
└── lib/
    ├── constants/          # Site config, animation constants
    ├── types/              # TypeScript type definitions
    ├── utils/              # Utility functions
    └── seo/                # SEO helpers and schema generators
```

## 🎯 SEO Strategy

This project implements a comprehensive SEO strategy:

### Metadata
- **Title templates** for consistent branding across pages
- **Dynamic metadata generation** using `generateMetadata`
- **OpenGraph & Twitter Cards** for rich social sharing
- **Canonical URLs** to prevent duplicate content issues

### Structured Data (JSON-LD)
- Organization schema for brand recognition
- Website schema with search action
- Service schemas for each offering

### Technical SEO
- **Sitemap:** Auto-generated at `/sitemap.xml`
- **Robots.txt:** Configured at `/robots.txt`
- **Semantic HTML:** Proper heading hierarchy, ARIA labels
- **Accessibility:** Skip links, focus management, screen reader support

## ⚡ Performance Optimizations

### Core Web Vitals Focus

| Metric | Optimization |
|--------|--------------|
| **LCP** | Critical CSS inline, font preloading, above-the-fold content prioritized |
| **CLS** | Font display swap, image dimensions, skeleton layouts |
| **INP** | Debounced handlers, passive event listeners, code splitting |

### Implemented Optimizations
- **Font optimization** via `next/font` with display swap
- **Dynamic imports** for below-fold components
- **Image optimization** with AVIF/WebP formats
- **Aggressive caching** headers for static assets
- **Tree shaking** for GSAP and Lenis

### Accessibility
- Reduced motion support (`prefers-reduced-motion`)
- Keyboard navigation support
- ARIA labels and roles
- Focus visible styles

## 🛠️ Development

### Prerequisites
- Node.js 20.0.0 or higher
- npm, yarn, or pnpm

### Getting Started

```bash
# Clone the repository
git clone https://github.com/we3agency/website.git
cd website

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint issues |
| `npm run type-check` | Run TypeScript check |
| `npm run clean` | Clean build artifacts |

## 🚀 Deployment

### Vercel (Recommended)

The easiest deployment option:

1. Push to GitHub
2. Import to [Vercel](https://vercel.com)
3. Set environment variables
4. Deploy

### Other Platforms

```bash
# Build for production
npm run build

# Start production server
npm run start
```

### Environment Variables

See [.env.example](.env.example) for all available options.

**Required for production:**
- `NEXT_PUBLIC_SITE_URL` - Your production URL (for SEO)

## 📝 Code Quality

### TypeScript
- Strict mode enabled
- No implicit any
- Strict null checks
- Unused variable checks

### ESLint Rules
- Next.js recommended rules
- Core Web Vitals checks
- Accessibility (jsx-a11y)
- Import organization

### Conventions
- Components: PascalCase
- Hooks: camelCase with `use` prefix
- Constants: SCREAMING_SNAKE_CASE
- CSS Modules: camelCase

## 🎨 Design System

### Colors
```css
--bg-color: #050505
--text-color: #f0f0f0
--text-muted: #888888
--accent-gradient: linear-gradient(135deg, #667eea, #764ba2, #f093fb)
```

### Typography
- Font: Inter
- Scale: Fluid typography using `clamp()`
- Weights: 400 (body), 500 (headings), 600 (strong), 700 (display)

### Spacing
- Base unit: 4px
- Section padding: Responsive via CSS custom properties

## 📄 License

Private - All rights reserved © 2025 WE3 Agency

---

Built with ❤️ by WE3 Agency
