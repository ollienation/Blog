# imlosing.it - Oliver's Digital Journey

[![Website](https://img.shields.io/website?url=https%3A//imlosing.it&style=for-the-badge)](https://imlosing.it)
[![License: CC BY-SA 4.0](https://img.shields.io/badge/License-CC%20BY--SA%204.0-lightgrey.svg?style=for-the-badge)](https://creativecommons.org/licenses/by-sa/4.0/)
[![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)](https://developer.mozilla.org/en-US/docs/)

> **A high-performance personal website that doubles as a creative playground for web development.**

_imlosing.it_ is Oliver's digital home on the web - a meticulously crafted personal website that serves as both a professional showcase and an experimental laboratory for modern web technologies. Built with focus on performance, security, and user experience, this project represents the intersection of thoughtful design and technical excellence.

## Features

### **Core Capabilities**

- **Dynamic Blog Engine** - Markdown-powered blog with automatic processing and rich content support
- **Theme System** - Seamless dark/light mode with system preference detection
- **Performance Optimized** - Code splitting, lazy loading, and sub-second load times
- **Mobile-First Design** - Responsive across all devices with smooth animations
- **Security Hardened** - Comprehensive CSP headers and input sanitization

### **Advanced Features**

- **Mermaid Diagrams** - Interactive diagram rendering in blog posts
- **Modal System** - Elegant blog post reader with focus trapping
- **Asset Processing** - Automated markdown blog compilation
- **SEO Optimized** - Meta tags, structured data, and performance metrics
- **Progressive Enhancement** - Works beautifully even with JavaScript disabled

## 🏗 Tech Stack

| Category         | Technologies                                              |
| ---------------- | --------------------------------------------------------- |
| **Build System** | Vite 7, Node.js 20+, esbuild                              |
| **Frontend**     | Vanilla JavaScript (ES2022), CSS Custom Properties, HTML5 |
| **Content**      | Markdown, Gray Matter, Highlight.js, Mermaid              |
| **Security**     | DOMPurify, Content Security Policy, Input Sanitization    |
| **Performance**  | Code Splitting, Lazy Loading, Tree Shaking, Preloading    |
| **Deployment**   | Static Site Generation, CDN Ready                         |

## Quick Start

### Prerequisites

- Node.js 20+ and npm 10+
- Git for version control
- A modern web browser

### Development Setup

```bash
# Clone the repository
git clone https://github.com/ollienation/blog.git
cd blog

# Install dependencies
npm install

# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Content Management

```bash
# Process markdown files and generate blog assets
npm run build
# This runs build-markdown.js and generates src/assets/blogPosts.ts

# Add new blog posts
# 1. Create .md files in the /blogs directory
# 2. Use frontmatter for metadata or let the system auto-generate
# 3. Run npm run build to process new content
```

## Project Structure

```
blog/
├── index.html                 # Main HTML template
├── vite.config.mjs            # Vite configuration
├── package.json               # Dependencies and scripts
├── src/
│   ├── app.js                # Main application logic
│   ├── styles/
│   │   ├── style.css            # Core design system
│   │   └── highlight-theme.css   # Code syntax themes
│   ├── build-markdown.js     # Blog processing engine
│   └── assets/
│       └── blogPosts.ts         # Generated blog data
├── blogs/                    # Markdown blog posts
├── .github/                  # GitHub workflows & templates
└── README.md                 # You are here
```

## Design Philosophy

This project embraces **performance-first development** with a custom design system built on CSS custom properties. The architecture prioritizes:

- **Zero Framework Overhead** - Pure JavaScript for maximum control and minimal bundle size
- **Progressive Enhancement** - Core functionality works without JavaScript
- **Semantic HTML** - Accessible markup with proper ARIA labels
- **Modern CSS** - Custom properties, logical properties, and container queries
- **Security by Design** - CSP headers, input sanitization, and secure defaults

### Color System

The design system uses semantic color tokens that automatically adapt to light/dark themes:

```css
/* Light mode */
--color-primary: var(--color-teal-500);
--color-background: var(--color-cream-50);

/* Dark mode */
--color-primary: var(--color-teal-300);
--color-background: var(--color-charcoal-700);
```

## Configuration

### Environment Setup

The build system automatically processes markdown files from the `/blogs` directory. Blog posts support:

- **Frontmatter** - YAML metadata for titles, dates, tags, and excerpts
- **Auto-generation** - Automatic title extraction and tag inference
- **Rich Content** - Code blocks, images, tables, and Mermaid diagrams

### Build Configuration

Key Vite configuration options in `vite.config.mjs`:

```javascript
export default defineConfig({
  build: {
    target: "esnext", // Modern JavaScript
    chunkSizeWarningLimit: 500, // Performance monitoring
    sourcemap: true, // Debug support
  },
  optimizeDeps: {
    include: ["marked", "highlight.js", "mermaid"], // Pre-bundle heavy deps
  },
});
```

## Performance Metrics

This site is built for speed:

- **Lighthouse Score**: 100/100/100/100 (Performance/Accessibility/Best Practices/SEO)
- **First Contentful Paint**: < 1.2s
- **Largest Contentful Paint**: < 2.5s
- **Bundle Size**: < 50KB gzipped (excluding content)
- **Time to Interactive**: < 2.5s

Performance strategies include:

- Dynamic imports for non-critical features
- Font preloading and display optimization
- Image optimization and lazy loading
- Critical CSS inlining
- Service worker caching (coming soon)

## Security Features

Security is baked into every layer:

- **Content Security Policy** - Strict CSP headers prevent XSS attacks
- **Input Sanitization** - DOMPurify cleans all user-generated content
- **Dependency Scanning** - Automated security audits with `npm audit`
- **No Inline Scripts** - All JavaScript is external with integrity checks
- **Secure Headers** - HTTPS-only, HSTS, and frame protection

## Browser Support

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Features**: CSS Custom Properties, ES2022, Fetch API, Intersection Observer
- **Progressive Enhancement**: Core functionality in older browsers
- **Mobile**: iOS 14+, Android 90+

## Acknowledgments

This project stands on the shoulders of giants:

- **[Vite](https://vitejs.dev/)** - Lightning-fast build tool
- **[Marked](https://marked.js.org/)** - Markdown processing
- **[Highlight.js](https://highlightjs.org/)** - Syntax highlighting
- **[Mermaid](https://mermaid.js.org/)** - Diagram generation
- **[DOMPurify](https://github.com/cure53/DOMPurify)** - HTML sanitization
- **[FK Grotesk](https://fonts.floriankarsten.com/fk-grotesk)** - Amazing font by Florian Karsten

## 📄 License

This project is licensed under the [Creative Commons Attribution-ShareAlike 4.0 International License](https://creativecommons.org/licenses/by-sa/4.0/).

**What this means:**

- ✅ You can use, share, and adapt this work
- ✅ Commercial use is allowed, without the font!
- ⚠️ You must provide attribution
- ⚠️ Derivative works must use the same license

## 🌐 Connect

- **Website**: [imlosing.it](https://imlosing.it)
- **GitHub**: [@ollienation](https://github.com/ollienation)
- **Email**: <hello@imlosing.it>

---

<div align="center">

**Built with ❤️ and an unhealthy obsession with web performance**

_Last updated: August 2025_

</div>
