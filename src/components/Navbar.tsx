'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const links = [
  { href: '/movies', label: 'Movies' },
  { href: '/tv-series', label: 'TV Series' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { if (searchOpen && ref.current) ref.current.focus(); }, [searchOpen]);

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
      scrolled ? 'bg-[#1A1A1A]/95 backdrop-blur-md shadow-lg' : 'bg-gradient-to-b from-[#0D0D0D]/90 to-transparent'
    }`}>
      <div className="max-w-[1400px] mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1.5 group">
          <span className="text-xl font-bold text-white">▣</span>
          <span className="text-lg font-bold tracking-tight">Boxo</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {links.map(l => (
            <Link key={l.href} href={l.href} className="text-sm font-medium text-gray-400 hover:text-white transition-colors">{l.label}</Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {searchOpen ? (
            <form onSubmit={onSubmit}>
              <input ref={ref} type="text" value={query} onChange={e => setQuery(e.target.value)}
                placeholder="Search..."
                className="bg-[#222222] border border-[#333333] rounded-lg px-3 py-1.5 text-sm w-40 md:w-56 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6B00]"
                onBlur={() => { if (!query) setSearchOpen(false); }}
              />
            </form>
          ) : (
            <button onClick={() => setSearchOpen(true)} className="text-gray-400 hover:text-white p-1">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            </button>
          )}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-gray-400 hover:text-white p-1">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {menuOpen ? <><path d="M18 6 6 18"/><path d="m6 6 12 12"/></> : <><path d="M3 12h18"/><path d="M3 6h18"/><path d="M3 18h18"/></>}
            </svg>
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="md:hidden bg-[#1A1A1A] border-t border-[#333333] animate-fade-in">
          <div className="px-4 py-3 space-y-2">
            {links.map(l => (
              <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
                className="block py-2 text-sm font-medium text-gray-400 hover:text-white">{l.label}</Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
