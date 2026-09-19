# RFR BY RIYAS — Riyas Fashion Runway
### International Luxury Fashion & Creative Ecosystem Platform

A full-viewport, cinematic, international-standard luxury fashion and creative ecosystem web platform for **RFR BY RIYAS (Riyas Fashion Runway)**, founded by **Riyas**.

---

## 🏛️ Brand Positioning

**RFR (Riyas Fashion Runway)** brings together:
* **High Couture & Fashion Runways**
* **Experiential Retail & Flea Markets**
* **Lifestyle Galas & Festivals**
* **Influencer Roster & Creator Campaigns**
* **User Generated Content (UGC) Studio**
* **Commercial Advertising & Brand Films**
* **Out-Of-Home (OOH) Billboards & Digital DOOH**
* **The RFR Podcast Studio: *Conversations Beyond the Runway***
* **Talent Portals: Models, Influencers, Artists & Careers**

> **CREATIVITY × COLLABORATION × VISIBILITY**

---

## 💎 Technology Stack & Architecture

- **Core Framework**: React 18 + Vite + TypeScript
- **3D & WebGL Engine**: Three.js / React Three Fiber (`@react-three/fiber`, `@react-three/drei`)
- **Animation & Transitions**: Framer Motion
- **Smooth Inertial Scroll**: Lenis
- **Styling**: Tailwind CSS v4 + Vanilla CSS Luxury Editorial Grid System
- **Routing**: Wouter client-side router
- **Typography**: Cormorant Garamond, Cinzel, Plus Jakarta Sans
- **SEO & Schema**: React Helmet Async + JSON-LD Structured Data

---

## 🚀 Getting Started

### Prerequisites
* Node.js v18+
* npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/adpools/rfr.git
cd rfr

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

## 📂 Project Structure

```
rfr/
├── public/                  # Favicon, robots.txt, sitemap.xml
├── src/
│   ├── components/
│   │   ├── 3d/              # RunwayCanvas, StudioMicScene, NetworkGraph3D, FallbackBackdrop
│   │   ├── common/          # CustomCursor, SectionProgressRail, Preloader, LightboxModal, AudioAmbience
│   │   ├── layout/          # Navbar, Footer, FullscreenMenu, PageWrapper
│   │   └── sections/        # 17 Full-Viewport Homepage Chapters
│   ├── data/                # Typed CMS datasets (Timeline, Services, Founder, Talent, Gallery, Press)
│   ├── hooks/               # useSmoothScroll, useCursor, useMediaQuery
│   ├── pages/               # Multi-route page views (Timeline, Services, Assets, Press, Contact, etc.)
│   ├── styles/              # Design system tokens and editorial grid classes
│   ├── types/               # TypeScript interfaces
│   ├── App.tsx              # Application root & routing
│   └── main.tsx             # Entrypoint
├── index.html
├── package.json
└── vite.config.ts
```

---

## © License & Credits

Copyright © 2026 **RFR BY RIYAS (Riyas Fashion Runway)**. All rights reserved.
