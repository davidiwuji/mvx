'use client';
import { useRef } from 'react';
import MovieCard from './MovieCard';
import type { TMDBMovie, TMDBTVShow } from '@/lib/types';
import { getYear } from '@/lib/tmdb';

export default function MovieRow({ title, items, linkHref }: {
  title: string; items: (TMDBMovie | TMDBTVShow)[]; linkHref?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (d: 'left' | 'right') => {
    if (!ref.current) return;
    ref.current.scrollBy({ left: d === 'left' ? -ref.current.clientWidth * 0.75 : ref.current.clientWidth * 0.75, behavior: 'smooth' });
  };
  if (!items?.length) return null;

  return (
    <section className="flex items-start gap-4 md:gap-6 px-4">
      {/* Title column — fixed width on left */}
      <div className="flex-shrink-0 w-[90px] md:w-[130px] pt-1">
        <div className="flex items-start gap-2">
          <div className="w-1 h-5 bg-[#FF6B00] rounded-full mt-1 flex-shrink-0" />
          <div>
            <h2 className="text-sm md:text-base font-bold leading-tight">{title}</h2>
            {linkHref && (
              <a href={linkHref} className="text-[10px] md:text-xs text-[#FF6B00] hover:text-[#E65A00] font-medium mt-1 inline-block">View All &rarr;</a>
            )}
          </div>
        </div>
      </div>

      {/* Movie cards — scrollable on right */}
      <div className="flex-1 min-w-0 relative group">
        <button onClick={() => scroll('left')}
          className="absolute left-0 top-0 bottom-0 z-10 w-8 bg-gradient-to-r from-[#0D0D0D] to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center pl-1">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <div ref={ref} className="flex overflow-x-auto gap-2 md:gap-3 pb-2 hide-scrollbar" style={{ scrollSnapType: 'x mandatory' }}>
          {items.map(item => {
            const isMovie = 'title' in item;
            return <MovieCard key={item.id} id={item.id} title={isMovie ? (item as TMDBMovie).title : (item as TMDBTVShow).name}
              posterPath={item.poster_path} year={getYear(isMovie ? (item as TMDBMovie).release_date : (item as TMDBTVShow).first_air_date)}
              rating={item.vote_average} mediaType={isMovie ? 'movie' : 'tv'} />;
          })}
        </div>
        <button onClick={() => scroll('right')}
          className="absolute right-0 top-0 bottom-0 z-10 w-8 bg-gradient-to-l from-[#0D0D0D] to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-end pr-1">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
        </button>
      </div>
    </section>
  );
}
