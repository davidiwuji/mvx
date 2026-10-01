'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import MovieCard from './MovieCard';
import type { TMDBMovie, TMDBTVShow } from '@/lib/types';
import { getYear } from '@/lib/tmdb';

interface MovieRowProps {
  title: string;
  subtitle?: string;
  items: (TMDBMovie | TMDBTVShow)[];
  linkHref?: string;
  isImdbSource?: boolean;
}

export default function MovieRow({
  title,
  subtitle,
  items,
  linkHref,
  isImdbSource = false,
}: MovieRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!rowRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
    setCanScrollLeft(scrollLeft > 20);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 20);
  };

  useEffect(() => {
    checkScroll();
  }, [items]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!rowRef.current) return;
    const scrollAmount = rowRef.current.clientWidth * 0.75;
    rowRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
    setTimeout(checkScroll, 350);
  };

  if (!items?.length) return null;

  return (
    <section className="relative px-4 md:px-8 my-8 group/row">
      {/* Row Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-1.5 h-6 bg-gradient-to-b from-[#FF6B00] to-[#FF8A00] rounded-full shadow-[0_0_10px_rgba(255,107,0,0.5)]" />
          <div>
            <h2 className="text-lg md:text-xl font-bold tracking-tight text-white flex items-center gap-2">
              {title}
              {isImdbSource && (
                <span className="bg-[#F5C518] text-black text-[10px] font-black px-1.5 py-0.5 rounded shadow-sm">
                  IMDb
                </span>
              )}
              <span className="text-xs font-normal text-gray-500">({items.length})</span>
            </h2>
            {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
          </div>
        </div>

        {linkHref && (
          <Link
            href={linkHref}
            className="text-xs md:text-sm font-semibold text-[#FF8A00] hover:text-[#FFA726] flex items-center gap-1 group/link transition-colors"
          >
            <span>View All</span>
            <svg
              className="w-4 h-4 transform group-hover/link:translate-x-1 transition-transform"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>
        )}
      </div>

      {/* Carousel Container */}
      <div className="relative">
        {/* Left Arrow */}
        {canScrollLeft && (
          <button
            onClick={() => handleScroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/85 hover:bg-[#FF6B00] text-white flex items-center justify-center backdrop-blur-md border border-white/10 shadow-xl opacity-0 group-hover/row:opacity-100 transition-all duration-200 -ml-3 md:-ml-5"
            aria-label="Scroll left"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}

        {/* Scrollable Track (Strict Uniform Sizing for Every Card) */}
        <div
          ref={rowRef}
          onScroll={checkScroll}
          className="flex overflow-x-auto gap-3 md:gap-4 pb-3 hide-scrollbar snap-x snap-mandatory scroll-smooth"
        >
          {items.map(item => {
            const isMovie = 'title' in item;
            const itemTitle = isMovie ? (item as TMDBMovie).title : (item as TMDBTVShow).name;
            const dateStr = isMovie ? (item as TMDBMovie).release_date : (item as TMDBTVShow).first_air_date;

            return (
              <div
                key={`${isMovie ? 'm' : 't'}-${item.id}`}
                className="snap-start w-[150px] min-w-[150px] sm:w-[170px] sm:min-w-[170px] md:w-[190px] md:min-w-[190px] flex-shrink-0"
              >
                <MovieCard
                  id={item.id}
                  title={itemTitle}
                  posterPath={item.poster_path}
                  backdropPath={item.backdrop_path}
                  year={getYear(dateStr)}
                  rating={item.vote_average}
                  mediaType={isMovie ? 'movie' : 'tv'}
                />
              </div>
            );
          })}
        </div>

        {/* Right Arrow */}
        {canScrollRight && (
          <button
            onClick={() => handleScroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/85 hover:bg-[#FF6B00] text-white flex items-center justify-center backdrop-blur-md border border-white/10 shadow-xl opacity-0 group-hover/row:opacity-100 transition-all duration-200 -mr-3 md:-mr-5"
            aria-label="Scroll right"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        )}
      </div>
    </section>
  );
}
