'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { tmdbImage, slugify } from '@/lib/tmdb';
import { isWatchlisted, toggleWatchlist, subscribeToWatchlist } from '@/lib/watchlist';

interface MovieCardProps {
  id: number;
  title: string;
  posterPath: string | null | undefined;
  year?: string;
  rating?: number;
  mediaType?: 'movie' | 'tv';
  backdropPath?: string | null;
  className?: string;
}

export default function MovieCard({
  id,
  title,
  posterPath,
  year,
  rating,
  mediaType = 'movie',
  backdropPath,
  className = '',
}: MovieCardProps) {
  const [bookmarked, setBookmarked] = useState(false);
  const [imgError, setImgError] = useState(false);
  const href = `/detail/${slugify(title, id)}?type=${mediaType}`;

  useEffect(() => {
    setImgError(false);
  }, [posterPath, backdropPath]);

  useEffect(() => {
    setBookmarked(isWatchlisted(id, mediaType));
    const unsubscribe = subscribeToWatchlist(() => {
      setBookmarked(isWatchlisted(id, mediaType));
    });
    return () => unsubscribe();
  }, [id, mediaType]);

  const handleBookmarkToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const nowBookmarked = toggleWatchlist({
      id,
      title,
      posterPath: posterPath || null,
      backdropPath: backdropPath || null,
      mediaType,
      year,
      rating,
    });
    setBookmarked(nowBookmarked);
  };

  const imageSrc = !imgError && posterPath
    ? tmdbImage(posterPath, 'w500')
    : !imgError && backdropPath
    ? tmdbImage(backdropPath, 'w500')
    : '/placeholder.svg';

  return (
    <div
      className={`movie-card group cursor-pointer relative transition-all duration-300 w-full flex flex-col ${className}`}
    >
      <Link href={href} className="block w-full">
        {/* Strict 2/3 Aspect Ratio Container */}
        <div className="relative w-full aspect-[2/3] rounded-2xl overflow-hidden bg-[#121624] ring-1 ring-white/10 group-hover:ring-[#FF6B00]/70 group-hover:shadow-[0_8px_30px_rgba(255,107,0,0.25)] transition-all duration-500">
          {/* Poster Image */}
          <img
            src={imageSrc}
            alt={title}
            onError={() => setImgError(true)}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 will-change-transform"
            loading="lazy"
          />

          {/* Vignette Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/30 pointer-events-none" />

          {/* Hover Center Play Button */}
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#FF6B00] to-[#FF8A00] flex items-center justify-center text-white shadow-lg shadow-orange-600/50 transform scale-75 group-hover:scale-100 transition-transform duration-300">
              <svg className="w-5 h-5 ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="6,3 20,12 6,21" />
              </svg>
            </div>
          </div>

          {/* Top-Right: Official IMDb Rating Badge */}
          {rating && rating > 0 ? (
            <div className="absolute top-2 right-2 z-10 flex items-center gap-1 bg-[#F5C518] text-black font-black text-[10px] px-1.5 py-0.5 rounded shadow-md tracking-tight">
              <span className="tracking-tighter">IMDb</span>
              <span className="font-bold">{rating.toFixed(1)}</span>
            </div>
          ) : null}

          {/* Bottom-Left: Quality & Type Badges */}
          <div className="absolute bottom-2 left-2 flex items-center gap-1.5 pointer-events-none z-10">
            <span className="px-1.5 py-0.5 bg-black/85 backdrop-blur-md text-[10px] font-black text-white rounded border border-white/15">
              HD
            </span>
            {mediaType === 'tv' && (
              <span className="px-1.5 py-0.5 bg-purple-600/90 backdrop-blur-md text-[10px] font-bold text-white rounded border border-purple-400/30">
                TV
              </span>
            )}
          </div>
        </div>

        {/* Text Block (Strict Fixed Height for 100% Uniform Sizing Across Cards) */}
        <div className="mt-2.5 px-0.5 h-11 flex flex-col justify-between">
          <h3
            className="text-xs sm:text-sm font-semibold text-gray-200 truncate group-hover:text-[#FF8A00] transition-colors leading-tight"
            title={title}
          >
            {title}
          </h3>
          <div className="flex items-center justify-between text-[11px] text-gray-400 font-medium leading-none">
            <span>{year || '2024'}</span>
            <span className="capitalize text-gray-500">{mediaType === 'tv' ? 'Series' : 'Movie'}</span>
          </div>
        </div>
      </Link>

      {/* Top-Left: Watchlist Bookmark Action Button */}
      <button
        onClick={handleBookmarkToggle}
        className={`absolute top-2 left-2 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-md ${
          bookmarked
            ? 'bg-[#FF6B00] text-white opacity-100 ring-2 ring-white/30 scale-100'
            : 'bg-black/75 hover:bg-black text-gray-300 hover:text-white backdrop-blur-md opacity-0 group-hover:opacity-100 border border-white/10 hover:scale-110'
        }`}
        title={bookmarked ? 'Remove from Watchlist' : 'Add to Watchlist'}
        aria-label={bookmarked ? 'Remove from Watchlist' : 'Add to Watchlist'}
      >
        <svg
          className="w-3.5 h-3.5"
          viewBox="0 0 24 24"
          fill={bookmarked ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
      </button>
    </div>
  );
}