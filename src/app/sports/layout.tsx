import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sports - Live Matches & Streaming',
  description: 'Watch live sports matches and events for free. Football, basketball, tennis, MMA, cricket, and more — real streaming links, no registration required.',
  keywords: [
    'live sports streaming', 'free sports', 'football live', 'basketball live',
    'sports matches', 'live streaming', 'sports online free',
  ],
  alternates: { canonical: 'https://boxo.name.ng/sports' },
  openGraph: {
    title: 'Sports - Live Matches & Streaming',
    description: 'Watch live sports matches for free — football, basketball, tennis and more.',
    url: 'https://boxo.name.ng/sports',
  },
  twitter: { title: 'Sports - Live Matches & Streaming', description: 'Watch live sports matches for free.' },
};

export default function SportsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
