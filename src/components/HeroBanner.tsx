'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { tmdbImage, slugify } from '@/lib/tmdb';
import type { TMDBMovie } from '@/lib/types';

export default function HeroBanner({ items }: { items: TMDBMovie[] }) {
  const [current, setCurrent] = useState(0);
  const featured = items.slice(0, 8);

  useEffect(() => {
    if (featured.length < 2) return;
    const t = setInterval(() => setCurrent(p => (p + 1) % featured.length), 7000);
    return () => clearInterval(t);
  }, [featured.length]);

  if (featured.length === 0) return null;

  const item = featured[current];

  // Genre names lookup
  const genreNames: Record<number, string> = {
    28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime',
    99: 'Documentary', 18: 'Drama', 10751: 'Family', 14: 'Fantasy', 27: 'Horror',
    878: 'Sci-Fi', 53: 'Thriller', 37: 'Western', 10749: 'Romance', 9648: 'Mystery',
  };

  return (
    <div className="relative w-full h-screen min-h-[600px] max-h-[900px] overflow-hidden">
      {/* Background Image */}
      {featured.map((m, i) => (
        <div
          key={m.id}
          className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ${
            i === current ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
          style={{ backgroundImage: `url(${tmdbImage(m.backdrop_path, 'original')})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/60 to-[#0D0D0D]/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0D0D0D]/90 via-[#0D0D0D]/40 to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="relative h-full max-w-[1400px] mx-auto px-4 flex items-center">
        <div className="max-w-2xl animate-fadeIn">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-3 drop-shadow-xl leading-tight">
            {item.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-sm mb-4">
            {item.release_date && (
              <span className="flex items-center gap-1 text-gray-400">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 2v4"/><path d="M16 2v4"/><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M3 10h18"/></svg>
                {new Date(item.release_date).getFullYear()}
              </span>
            )}
            {item.vote_average > 0 && (
              <span className="flex items-center gap-1 text-yellow-400">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>
                {item.vote_average.toFixed(1)}
              </span>
            )}
            <span className="px-2 py-0.5 text-[11px] font-semibold bg-white/10 text-gray-300 rounded border border-white/10">Movie</span>
            {item.genre_ids?.slice(0, 2).map(id => (
              <span key={id} className="px-2 py-0.5 text-[11px] bg-white/10 text-gray-300 rounded">
                {genreNames[id] || ''}
              </span>
            ))}
          </div>
          <p className="text-sm md:text-base text-gray-300 line-clamp-2 max-w-xl mb-6 leading-relaxed">
            {item.overview}
          </p>
          <div className="flex items-center gap-3">
            <Link
              href={`/detail/${slugify(item.title, item.id)}?type=movie`}
              className="inline-flex items-center gap-2.5 bg-[#FF6B00] hover:bg-[#E65A00] text-white px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 shadow-lg shadow-orange-600/20"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>
              Watch Now
            </Link>
            <Link
              href={`/detail/${slugify(item.title, item.id)}?type=movie`}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-5 py-3 rounded-xl font-medium transition-all border border-white/10 backdrop-blur-sm"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
              More Info
            </Link>
          </div>
        </div>
      </div>

      {/* Dots */}
      {featured.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {featured.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`transition-all duration-300 rounded-full ${
                i === current
                  ? 'w-8 h-1.5 bg-[#FF6B00]'
                  : 'w-1.5 h-1.5 bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}