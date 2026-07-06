import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Boxo - Watch Movies Free Online, Watch TV Series Online",
  description: "Watch thousands of movies and TV series online for free. HD quality streaming with no registration required.",
  keywords: "watch movies free online, free streaming, watch tv series online, Boxo, movies, tv series",
  openGraph: {
    title: "Boxo - Watch Movies Free Online",
    description: "Watch thousands of movies and TV series online for free.",
    type: "website",
    siteName: "Boxo",
    locale: "en_US",
    images: [{ url: "/favicon/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Boxo - Watch Movies Free Online",
    description: "Watch thousands of movies and TV series online for free.",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://boxo.app" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Boxo",
  url: "https://boxo.app",
  description: "Watch thousands of movies and TV series online for free.",
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: "https://boxo.app/search?q={search_term_string}" },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className="min-h-screen">
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
