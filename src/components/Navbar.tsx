'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import Logo from './Logo';
import { getRandomSurprise } from '@/lib/surprise';
import { getWatchlist, subscribeToWatchlist } from '@/lib/watchlist';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/movies', label: 'Movies' },
  { href: '/tv-series', label: 'Series' },
  { href: '/anime', label: 'Anime' },
  { href: '/sports', label: 'Sports' },
  { href: '/explore', label: 'Explore' },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [watchlistCount, setWatchlistCount] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSurprising, setIsSurprising] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Sync watchlist count
  useEffect(() => {
    setWatchlistCount(getWatchlist().length);
    const unsubscribe = subscribeToWatchlist(items => {
      setWatchlistCount(items.length);
    });
    return () => unsubscribe();
  }, []);

  // Track scroll position to adjust floating deck elevation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleSurpriseMe = () => {
    setIsSurprising(true);
    setTimeout(() => {
      const surprise = getRandomSurprise();
      router.push(surprise.url);
      setIsSurprising(false);
    }, 600);
  };

  return (
    <>
      {/* ─── Floating Top Deck Menu (Desktop & Tablet) ─── */}
      <header
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[94vw] max-w-[1180px] transition-all duration-300 ${
          isScrolled ? 'top-3 scale-[0.99]' : 'top-5 scale-100'
        }`}
      >
        <div className="glass-dock rounded-full px-4 md:px-6 py-2.5 flex items-center justify-between shadow-[0_12px_40px_rgba(0,0,0,0.7)] ring-1 ring-white/10">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <Logo size="sm" showText={true} />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/[0.04] p-1 rounded-full border border-white/5">
            {NAV_LINKS.map(link => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xs md:text-sm font-medium px-3.5 py-1.5 rounded-full transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#FF6B00] to-[#FF8A00] text-white shadow-[0_2px_12px_rgba(255,107,0,0.4)] font-semibold'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Action Hub: Surprise Me + Search + Watchlist + Mobile Toggle */}
          <div className="flex items-center gap-2">
            {/* Surprise Me Button */}
            <button
              onClick={handleSurpriseMe}
              disabled={isSurprising}
              title="Pick a random hit title"
              className={`relative inline-flex items-center gap-1.5 px-3 md:px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 shadow-md ${
                isSurprising
                  ? 'bg-purple-600 text-white animate-pulse'
                  : 'bg-gradient-to-r from-purple-600/80 via-pink-600/80 to-[#FF6B00]/80 hover:from-purple-600 hover:to-[#FF6B00] text-white ring-1 ring-purple-400/30 hover:shadow-[0_0_20px_rgba(217,70,239,0.4)] hover:scale-105'
              }`}
            >
              <svg
                className={`w-3.5 h-3.5 transition-transform duration-500 ${isSurprising ? 'rotate-180' : 'group-hover:rotate-12'}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z" />
                <path d="m14 7 3 3" />
                <path d="M5 6v4" />
                <path d="M19 14v4" />
                <path d="M10 2v2" />
                <path d="M7 8H3" />
                <path d="M21 16h-4" />
                <path d="M11 3H9" />
              </svg>
              <span className="hidden sm:inline">{isSurprising ? 'Rolling...' : 'Surprise Me'}</span>
            </button>

            {/* Quick Search Toggle / Form */}
            {searchOpen ? (
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search movies, shows..."
                  className="bg-[#141824] border border-[#FF6B00]/60 rounded-full px-4 py-1.5 text-xs text-white placeholder-gray-500 w-36 sm:w-48 md:w-56 focus:outline-none shadow-[0_0_15px_rgba(255,107,0,0.3)] transition-all"
                  onBlur={() => {
                    if (!searchQuery) setSearchOpen(false);
                  }}
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="absolute right-2 text-gray-400 hover:text-white p-1"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </form>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                title="Search titles"
                aria-label="Open search"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </button>
            )}

            {/* Watchlist Bookmark Icon with Live Badge */}
            <Link
              href="/watchlist"
              className="relative p-2 rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition-colors group"
              title="My Watchlist"
              aria-label="View Watchlist"
            >
              <svg
                className="w-4 h-4 group-hover:scale-110 transition-transform"
                viewBox="0 0 24 24"
                fill={watchlistCount > 0 ? '#FF6B00' : 'none'}
                stroke={watchlistCount > 0 ? '#FF6B00' : 'currentColor'}
                strokeWidth="2"
              >
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
              {watchlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-gradient-to-r from-[#FF6B00] to-[#FF3D00] text-white text-[10px] font-black flex items-center justify-center shadow-md">
                  {watchlistCount > 99 ? '99+' : watchlistCount}
                </span>
              )}
            </Link>

            {/* Mobile Drawer Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {mobileMenuOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </>
                ) : (
                  <>
                    <line x1="4" y1="7" x2="20" y2="7" />
                    <line x1="4" y1="12" x2="20" y2="12" />
                    <line x1="4" y1="17" x2="20" y2="17" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Glass Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-2 glass-dock rounded-3xl p-4 shadow-2xl ring-1 ring-white/10 animate-in fade-in slide-in-from-top-3 duration-200">
            <div className="grid grid-cols-2 gap-2">
              {NAV_LINKS.map(link => {
                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center justify-center py-2.5 px-4 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-[#FF6B00] to-[#FF8A00] text-white shadow-md'
                        : 'bg-white/[0.04] text-gray-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-gray-400 px-2">
              <span>Saved in Watchlist:</span>
              <Link href="/watchlist" className="text-[#FF8A00] font-bold hover:underline">
                {watchlistCount} {watchlistCount === 1 ? 'title' : 'titles'} &rarr;
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ─── Mobile Floating Bottom Dock (Extra Convenience on Touch Devices) ─── */}
      <div className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50 max-w-[94vw] w-auto">
        <div className="glass-dock rounded-full px-4 py-2 flex items-center gap-3 shadow-[0_10px_30px_rgba(0,0,0,0.8)] ring-1 ring-white/15">
          <Link
            href="/"
            className={`p-2 rounded-full transition-all ${
              pathname === '/' ? 'text-[#FF8A00] bg-white/10' : 'text-gray-400 hover:text-white'
            }`}
            title="Home"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </Link>

          <Link
            href="/movies"
            className={`p-2 rounded-full transition-all ${
              pathname.startsWith('/movies') ? 'text-[#FF8A00] bg-white/10' : 'text-gray-400 hover:text-white'
            }`}
            title="Movies"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
              <line x1="7" y1="2" x2="7" y2="22" />
              <line x1="17" y1="2" x2="17" y2="22" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <line x1="2" y1="7" x2="7" y2="7" />
              <line x1="2" y1="17" x2="7" y2="17" />
              <line x1="17" y1="17" x2="22" y2="17" />
              <line x1="17" y1="7" x2="22" y2="7" />
            </svg>
          </Link>

          <Link
            href="/tv-series"
            className={`p-2 rounded-full transition-all ${
              pathname.startsWith('/tv-series') ? 'text-[#FF8A00] bg-white/10' : 'text-gray-400 hover:text-white'
            }`}
            title="TV Series"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
              <polyline points="17 2 12 7 7 2" />
            </svg>
          </Link>

          {/* Surprise Me center button */}
          <button
            onClick={handleSurpriseMe}
            className="p-2.5 rounded-full bg-gradient-to-r from-purple-600 to-[#FF6B00] text-white shadow-lg shadow-purple-600/30 hover:scale-110 active:scale-95 transition-transform"
            title="Surprise Me!"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
          </button>

          <Link
            href="/search"
            className={`p-2 rounded-full transition-all ${
              pathname.startsWith('/search') ? 'text-[#FF8A00] bg-white/10' : 'text-gray-400 hover:text-white'
            }`}
            title="Search"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </Link>

          <Link
            href="/watchlist"
            className={`relative p-2 rounded-full transition-all ${
              pathname === '/watchlist' ? 'text-[#FF8A00] bg-white/10' : 'text-gray-400 hover:text-white'
            }`}
            title="Watchlist"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
            {watchlistCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#FF6B00] text-white text-[9px] font-black flex items-center justify-center">
                {watchlistCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </>
  );
}