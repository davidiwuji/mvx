import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://boxo.name.ng"),
  title: {
    default: "Boxo - Watch Movies Free Online, Watch TV Series Online",
    template: "%s - Boxo",
  },
  description:
    "Watch thousands of movies and TV series online for free. HD quality streaming with no registration required. Browse the latest blockbusters, classic films, trending TV shows, and anime — all in one place.",
  keywords: [
    // Core
    "watch movies free online",
    "free streaming",
    "watch tv series online",
    "Boxo",
    "movies",
    "tv series",
    // Long-tail
    "watch movies online free HD",
    "free movie streaming sites",
    "watch tv shows online free",
    "latest movies 2025 2026",
    "stream movies free no sign up",
    "free HD movies streaming",
    "online movie streaming free",
    "watch full movies online free",
    "free tv series streaming",
    "movies and tv shows free",
    // Content types
    "Hollywood movies free",
    "Nollywood movies online",
    "animated movies free",
    "action movies stream",
    "comedy movies online",
    "horror movies free",
    "romance movies stream",
    "sci-fi movies online",
    // TV & Anime
    "watch anime online free",
    "TV series free online",
    "binge watch tv shows free",
    "popular tv series stream",
    // Tech
    "HD streaming no registration",
    "free movie database",
    "online video streaming",
  ],
  applicationName: "Boxo",
  authors: [{ name: "Boxo" }],
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  robots: {
    index: true,
    follow: true,
    "max-snippet": -1,
    "max-image-preview": "large",
    "max-video-preview": -1,
  },
  openGraph: {
    title: "Boxo - Watch Movies Free Online",
    description:
      "Watch thousands of movies and TV series online for free. HD quality streaming with no registration required.",
    type: "website",
    siteName: "Boxo",
    locale: "en_US",
    url: "https://boxo.name.ng",
    images: [
      {
        url: "/favicon.svg",
        width: 1200,
        height: 630,
        alt: "Boxo - Free Movie Streaming",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Boxo - Watch Movies Free Online",
    description:
      "Watch thousands of movies and TV series online for free. HD quality streaming with no registration required.",
  },
  alternates: {
    canonical: "https://boxo.name.ng",
  },
  category: "entertainment",
  classification: "Entertainment",
  verification: {
    // Add your Google Search Console verification code here
    // google: "your-verification-code",
  },
  other: {
    "og:keywords":
      "boxo, watch movies free online, free streaming, watch tv series online, movies, tv series, HD streaming, watch online free, movie streaming site, free tv shows",
    "twitter:keywords":
      "boxo, watch movies free online, free streaming, watch tv series online, movies, tv series",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Boxo",
  url: "https://boxo.name.ng",
  description:
    "Watch thousands of movies and TV series online for free. HD quality streaming with no registration required.",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://boxo.name.ng/search?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        {/* Google Search Console — replace with your verification code */}
        {/* <meta name="google-site-verification" content="YOUR_VERIFICATION_CODE" /> */}
        <meta name="og:keywords" content="boxo, watch movies free online, free streaming, watch tv series online, movies, tv series, HD streaming, watch online free, movie streaming site, free tv shows" />
        <meta name="twitter:keywords" content="boxo, watch movies free online, free streaming, watch tv series online, movies, tv series" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen">
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
