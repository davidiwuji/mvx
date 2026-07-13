'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

const links = [
  { href: '/', label: 'Home' },
  { href: '/movies', label: 'Movies' },
  { href: '/tv-series', label: 'Series' },
  { href: '/anime', label: 'Anime' },
  { href: '/sports', label: 'Sports' },
  { href: '/explore', label: 'Explore' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();
  const pathname = usePathname();
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { if (searchOpen && ref.current) ref.current.focus(); }, [searchOpen]);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push('/search?q=' + encodeURIComponent(query.trim()));
      setSearchOpen(false);
      setQuery('');
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-[#0D0D0D]/98 backdrop-blur-xl shadow-[0_1px_0_#222222]'
        : 'bg-gradient-to-b from-[#0D0D0D] via-[#0D0D0D]/80 to-transparent'
    }`}>
      <div className="max-w-[1400px] mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-300 group-hover:text-white transition-colors">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span className="sr-only">Home</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map(l => {
            const isActive = pathname === l.href || pathname.startsWith(l.href + '?');
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`relative text-sm font-medium px-3.5 py-1.5 rounded-lg transition-all ${
                  isActive
                    ? 'text-white bg-white/10'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {l.label}
                {isActive && <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#FF6B00] rounded-full" />}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {searchOpen ? (
            <form onSubmit={onSubmit}>
              <input
                ref={ref}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search movies, series, anime..."
                className="bg-[#1A1A1A] border border-[#333333] rounded-lg px-3 py-1.5 text-sm w-44 md:w-56 text-white placeholder-gray-600 focus:outline-none focus:border-[#FF6B00] transition-colors"
                onBlur={() => { if (!query) setSearchOpen(false); }}
              />
            </form>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-all"
              aria-label="Search"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            </button>
          )}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-all"
            aria-label="Menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {menuOpen ? (
                <>
                  <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                </>
              ) : (
                <>
                  <path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/>
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-[#222222] bg-[#0D0D0D]/98 backdrop-blur-xl">
          <div className="max-w-[1400px] mx-auto px-4 py-4 space-y-1">
            {links.map(l => {
              const isActive = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`block text-sm font-medium px-3 py-2.5 rounded-lg transition-colors ${
                    isActive ? 'text-white bg-white/10' : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}