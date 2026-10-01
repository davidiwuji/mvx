'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { tmdbImage, slugify } from '@/lib/tmdb';
import { isWatchlisted, toggleWatchlist, subscribeToWatchlist } from '@/lib/watchlist';
import { getRandomSurprise } from '@/lib/surprise';

export interface BannerItem {
  id: number;
  title: string;
  name?: string;
  backdrop_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  genre_ids: number[];
  overview: string;
  media_type?: 'movie' | 'tv';
}

const GENRE_MAP: Record<number, string> = {
  28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime',
  99: 'Documentary', 18: 'Drama', 10751: 'Family', 14: 'Fantasy', 27: 'Horror',
  878: 'Sci-Fi', 53: 'Thriller', 37: 'Western', 10749: 'Romance', 9648: 'Mystery',
  10759: 'Action & Adventure', 10765: 'Sci-Fi & Fantasy',
};

export default function HeroBanner({ items }: { items: BannerItem[] }) {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const featured = items.slice(0, 7);

  const activeItem = featured[current] || featured[0];
  const isTv = activeItem?.media_type === 'tv';
  const displayTitle = activeItem ? (activeItem.title || activeItem.name || '') : '';
  const releaseYear = activeItem ? (activeItem.release_date || activeItem.first_air_date || '').split('-')[0] : '';
  const detailHref = activeItem ? `/detail/${slugify(displayTitle, activeItem.id)}?type=${isTv ? 'tv' : 'movie'}` : '#';

  // Watchlist status for active item
  useEffect(() => {
    if (!activeItem) return;
    setIsBookmarked(isWatchlisted(activeItem.id, activeItem.media_type || 'movie'));
    const unsub = subscribeToWatchlist(() => {
      setIsBookmarked(isWatchlisted(activeItem.id, activeItem.media_type || 'movie'));
    });
    return () => unsub();
  }, [activeItem]);

  // Auto rotation
  useEffect(() => {
    if (featured.length <= 1 || isPaused) return;
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % featured.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [featured.length, isPaused]);

  if (!featured.length) return null;

  const handleBookmarkToggle = () => {
    if (!activeItem) return;
    const now = toggleWatchlist({
      id: activeItem.id,
      title: displayTitle,
      posterPath: activeItem.backdrop_path,
      backdropPath: activeItem.backdrop_path,
      mediaType: activeItem.media_type || 'movie',
      year: releaseYear,
      rating: activeItem.vote_average,
    });
    setIsBookmarked(now);
  };

  const handleSurpriseMe = () => {
    const surprise = getRandomSurprise();
    router.push(surprise.url);
  };

  const genreNames = activeItem?.genre_ids?.map(id => GENRE_MAP[id]).filter(Boolean).slice(0, 3) || [];

  return (
    <div
      className="relative w-full h-[85vh] min-h-[580px] max-h-[820px] overflow-hidden select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Slides with Cross-Fade */}
      {featured.map((item, index) => {
        const bgUrl = tmdbImage(item.backdrop_path, 'original');
        const isActive = index === current;

        return (
          <div
            key={item.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 scale-105'
            } transition-transform duration-7000`}
            style={{
              backgroundImage: `url(${bgUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center 20%',
            }}
          >
            {/* Cinematic Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#090B10] via-[#090B10]/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#090B10] via-[#090B10]/80 to-transparent w-full md:w-3/4" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#090B10]/70 via-transparent to-[#090B10]" />
          </div>
        );
      })}

      {/* Hero Content */}
      <div className="relative z-20 h-full max-w-[1400px] mx-auto px-4 md:px-8 flex items-center pt-16">
        <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-6 duration-700">
          {/* Metadata Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className={`text-[11px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${
              isTv
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                : 'bg-[#FF6B00]/20 text-[#FF8A00] border border-[#FF6B00]/40'
            }`}>
              {isTv ? 'TV Series' : 'Movie'}
            </span>

            {releaseYear && (
              <span className="text-xs text-gray-300 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/10 font-medium">
                {releaseYear}
              </span>
            )}

            {activeItem.vote_average > 0 && (
              <span className="flex items-center gap-1 text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
                <svg className="w-3 h-3 text-amber-400 fill-current" viewBox="0 0 24 24">
                  <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                </svg>
                {activeItem.vote_average.toFixed(1)} IMDb
              </span>
            )}

            <span className="text-[10px] font-black px-2 py-0.5 bg-black/60 text-white rounded border border-white/20">
              4K ULTRA HD
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white mb-4 tracking-tight leading-[1.1] drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
            {displayTitle}
          </h1>

          {/* Genre Pills */}
          {genreNames.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {genreNames.map(genre => (
                <span
                  key={genre}
                  className="text-xs px-2.5 py-0.5 rounded-md bg-white/10 text-gray-300 border border-white/10 font-medium"
                >
                  {genre}
                </span>
              ))}
            </div>
          )}

          {/* Overview / Synopsis */}
          {activeItem.overview && (
            <p className="text-sm md:text-base text-gray-300 line-clamp-3 max-w-xl mb-7 leading-relaxed drop-shadow-md">
              {activeItem.overview}
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Watch Now */}
            <Link
              href={detailHref}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#FF6B00] via-[#FF8A00] to-[#FF3D00] text-white font-bold text-sm shadow-[0_4px_25px_rgba(255,107,0,0.5)] hover:shadow-[0_6px_30px_rgba(255,107,0,0.7)] hover:scale-105 transition-all duration-200"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <polygon points="5,3 19,12 5,21" />
              </svg>
              Watch Now
            </Link>

            {/* Watchlist Bookmark */}
            <button
              onClick={handleBookmarkToggle}
              className={`inline-flex items-center gap-2 px-5 py-3 rounded-full font-semibold text-sm transition-all duration-200 border ${
                isBookmarked
                  ? 'bg-[#FF6B00]/20 text-[#FF8A00] border-[#FF6B00]/50 hover:bg-[#FF6B00]/30'
                  : 'bg-white/10 hover:bg-white/20 text-white border-white/15'
              }`}
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill={isBookmarked ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
              <span>{isBookmarked ? 'In Watchlist' : 'Add to List'}</span>
            </button>

            {/* Surprise Me Quick Action */}
            <button
              onClick={handleSurpriseMe}
              className="inline-flex items-center gap-1.5 px-4 py-3 rounded-full bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 font-semibold text-sm transition-all hover:scale-105"
              title="Pick a random hit title"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z" />
              </svg>
              <span>Surprise Me</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Bottom Progress Indicators */}
      <div className="absolute bottom-10 right-4 md:right-8 z-30 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
        {featured.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === current ? 'w-8 bg-[#FF6B00] shadow-[0_0_10px_rgba(255,107,0,0.8)]' : 'w-2 bg-white/30 hover:bg-white/60'
            }`}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
