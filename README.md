# MVX - Cinema Streaming Platform

MVX is a sleek, modern, zero-registration movie and TV series streaming application built with Next.js 14, React 18, and Tailwind CSS.

---

## ✨ Features

- **Floating Deck Menu**: Modern macOS/iOS Dynamic Island-style floating pill navigation with quick category access, live search, and reactive watchlist counter.
- **Surprise Me**: One-click random hit title discovery engine for instant entertainment recommendations.
- **Cinematic Hero Carousel**: High-impact auto-rotating featured banner with 4K badges, IMDb ratings, synopses, and quick actions.
- **Full-Width Netflix-Style Carousels**: Smooth scrolling category carousels with hover arrows and responsive snap scrolling.
- **Streaming Hub & Multi-Server Player**: Direct HD streaming embed options (VidLink, VidSrc, Videasy, Embed.su, 2Embed), Theater/Cinema Mode toggle, and trailer switcher.
- **TV Series Episode Navigator**: Interactive Season and Episode selector for TV shows.
- **My Watchlist (Favorites)**: Persistent client-side bookmarking system with dedicated `/watchlist` management page.
- **Zero-Crash Resilience**: Built-in curated catalog ensures the site works immediately out-of-the-box even before configuring an external TMDB API key.
- **Clean & Secure**: 100% adware-free with zero click hijacking.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (Optional)
If you wish to use live TMDB data rather than curated fallback data:
1. Copy `.env.example` to `.env.local`
```bash
cp .env.example .env.local
```
2. Enter your free TMDB API key in `.env.local`:
```env
TMDB_API_KEY=your_api_key_here
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 18
- **Styling**: Tailwind CSS 3.4 with custom glassmorphism and animations
- **Language**: TypeScript 5
- **Icons**: Lightweight, zero-dependency SVG system
