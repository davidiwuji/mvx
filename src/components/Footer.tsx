'use client';

import React from 'react';
import Link from 'next/link';
import Logo from './Logo';
import { getRandomSurprise } from '@/lib/surprise';
import { useRouter } from 'next/navigation';

const MOVIE_GENRES = [
  { href: '/movies?genre=action', label: 'Action' },
  { href: '/movies?genre=adventure', label: 'Adventure' },
  { href: '/movies?genre=comedy', label: 'Comedy' },
  { href: '/movies?genre=crime', label: 'Crime' },
  { href: '/movies?genre=drama', label: 'Drama' },
  { href: '/movies?genre=horror', label: 'Horror' },
  { href: '/movies?genre=sci-fi', label: 'Sci-Fi' },
  { href: '/movies?genre=thriller', label: 'Thriller' },
];

const TV_GENRES = [
  { href: '/tv-series?genre=action-adventure', label: 'Action & Adventure' },
  { href: '/tv-series?genre=animation', label: 'Animation' },
  { href: '/tv-series?genre=comedy', label: 'Comedy' },
  { href: '/tv-series?genre=crime', label: 'Crime' },
  { href: '/tv-series?genre=drama', label: 'Drama' },
  { href: '/tv-series?genre=mystery', label: 'Mystery' },
  { href: '/tv-series?genre=sci-fi', label: 'Sci-Fi & Fantasy' },
];

export default function Footer() {
  const router = useRouter();

  const handleSurpriseMe = (e: React.MouseEvent) => {
    e.preventDefault();
    const s = getRandomSurprise();
    router.push(s.url);
  };

  return (
    <footer className="relative bg-[#07090E] border-t border-white/10 mt-20 text-gray-400">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 gap-8 md:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <div className="mb-4">
              <Logo size="md" showText={true} />
            </div>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed mb-4">
              Your ultimate gateway to thousands of movies and TV series online in HD. Free streaming, zero registration.
            </p>
            <button
              onClick={handleSurpriseMe}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-600/20 text-purple-300 border border-purple-500/30 text-xs font-semibold hover:bg-purple-600/30 transition-all"
            >
              <span>🎲 Surprise Me</span>
            </button>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs font-black tracking-wider uppercase text-white mb-4">Navigation</h4>
            <div className="space-y-2 text-xs sm:text-sm">
              <Link href="/" className="block hover:text-[#FF8A00] transition-colors">Home</Link>
              <Link href="/movies" className="block hover:text-[#FF8A00] transition-colors">Movies</Link>
              <Link href="/tv-series" className="block hover:text-[#FF8A00] transition-colors">TV Series</Link>
              <Link href="/anime" className="block hover:text-[#FF8A00] transition-colors">Anime</Link>
              <Link href="/sports" className="block hover:text-[#FF8A00] transition-colors">Sports</Link>
              <Link href="/explore" className="block hover:text-[#FF8A00] transition-colors">Explore</Link>
              <Link href="/watchlist" className="block hover:text-[#FF8A00] transition-colors">My Watchlist</Link>
            </div>
          </div>

          {/* Movie Genres */}
          <div>
            <h4 className="text-xs font-black tracking-wider uppercase text-white mb-4">Movie Genres</h4>
            <div className="space-y-2 text-xs sm:text-sm">
              {MOVIE_GENRES.map(g => (
                <Link key={g.href} href={g.href} className="block hover:text-[#FF8A00] transition-colors">
                  {g.label}
                </Link>
              ))}
            </div>
          </div>

          {/* TV Genres */}
          <div>
            <h4 className="text-xs font-black tracking-wider uppercase text-white mb-4">Series Genres</h4>
            <div className="space-y-2 text-xs sm:text-sm">
              {TV_GENRES.map(g => (
                <Link key={g.href} href={g.href} className="block hover:text-[#FF8A00] transition-colors">
                  {g.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Legal & Disclaimer */}
          <div>
            <h4 className="text-xs font-black tracking-wider uppercase text-white mb-4">Legal Notice</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              MVX does not host, upload, or store any media files on its servers. All videos and streams are embedded from third-party media hosting services.
            </p>
            <div className="mt-4 pt-4 border-t border-white/5 text-xs text-gray-500">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="border-t border-white/5 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
          <p>&copy; {new Date().getFullYear()} MVX Cinema. All rights reserved.</p>
          <p>Stream responsibly &bull; HD Media Player</p>
        </div>
      </div>
    </footer>
  );
}