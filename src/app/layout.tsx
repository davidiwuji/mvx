import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import VisitCounter from '@/components/VisitCounter';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export const metadata: Metadata = {
  metadataBase: new URL('https://mvx.stream'),
  title: {
    default: 'MVX - Watch Free Movies & TV Series Online in HD',
    template: '%s | MVX',
  },
  description:
    'Watch thousands of movies and TV series online for free in HD. No registration required. Discover trending hits, Japanese anime, sports, and blockbusters on MVX.',
  keywords: [
    'watch movies free online',
    'free streaming',
    'watch tv series online',
    'movies',
    'tv series',
    'watch movies online free HD',
    'free movie streaming sites',
    'watch tv shows online free',
    'anime streaming',
    'MVX',
  ],
  applicationName: 'MVX',
  authors: [{ name: 'MVX' }],
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'MVX - Watch Free Movies & TV Series Online in HD',
    description: 'Stream thousands of movies and TV series online for free in HD. No sign up needed.',
    type: 'website',
    locale: 'en_US',
    url: 'https://mvx.stream',
    images: [{ url: '/favicon.svg', width: 512, height: 512, alt: 'MVX Cinema' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MVX - Watch Free Movies & TV Series Online in HD',
    description: 'Stream thousands of movies and TV series online for free in HD.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <script
          async
          src="https://pl31052260.profitableratecpmnetwork.com/4b/6e/cf/4b6ecf8c3c9bbcd6c1093343f5fbc50a.js"
        />
      </head>
      <body className="min-h-screen bg-[#090B10] text-white antialiased selection:bg-[#FF6B00] selection:text-white">
        {/* Floating Deck Menu */}
        <Navbar />

        {/* Main Content Viewport */}
        <main className="min-h-screen">{children}</main>

        {/* Footer */}
        <Footer />

        {/* Analytics / Visitor counter */}
        <VisitCounter />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
