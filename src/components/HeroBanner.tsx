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

  return (
    <div className="relative w-full h-screen min-h-[600px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 transition-all duration-1000 bg-cover bg-center scale-105"
        style={{ backgroundImage: `url(${tmdbImage(item.backdrop_path, 'original')})` }}>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/50 to-[#0D0D0D]/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D0D0D]/80 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full max-w-[1400px] mx-auto px-4 flex items-center">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-3 drop-shadow-xl">{item.title}</h1>
          <div className="flex items-center gap-3 text-sm text-gray-400 mb-4">
            {item.release_date && <span>{new Date(item.release_date).getFullYear()}</span>}
            {item.vote_average > 0 && (
              <span className="flex items-center gap-1">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>
                {item.vote_average.toFixed(1)}
              </span>
            )}
            {item.genre_ids?.slice(0, 3).map(id => {
              const genres: Record<number, string> = {28:'Action',12:'Adventure',16:'Animation',35:'Comedy',80:'Crime',99:'Documentary',18:'Drama',10751:'Family',14:'Fantasy',27:'Horror',878:'Sci-Fi',53:'Thriller',37:'Western'};
              return <span key={id} className="text-xs px-2 py-0.5 bg-white/10 rounded">{genres[id] || ''}</span>;
            })}
          </div>
          <p className="text-sm md:text-base text-gray-300 line-clamp-2 max-w-xl mb-6">{item.overview}</p>
          <Link href={`/detail/${slugify(item.title, item.id)}?type=movie`}
            className="inline-flex items-center gap-2 bg-[#FF6B00] hover:bg-[#E65A00] text-white px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105 shadow-lg">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>
            Watch Now
          </Link>
        </div>
      </div>

      {/* Dots */}
      {featured.length > 1 && (
        <div className="absolute bottom-32 md:bottom-28 left-1/2 -translate-x-1/2 flex gap-2">
          {featured.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${i === current ? 'bg-[#FF6B00] w-5' : 'bg-white/30'}`} />
          ))}
        </div>
      )}
    </div>
  );
}
