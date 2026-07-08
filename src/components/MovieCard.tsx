import Link from 'next/link';
import { tmdbImage, slugify } from '@/lib/tmdb';

interface MovieCardProps {
  id: number; title: string; posterPath: string | null;
  year?: string; rating?: number; mediaType?: 'movie' | 'tv';
}

export default function MovieCard({ id, title, posterPath, year, rating, mediaType = 'movie' }: MovieCardProps) {
  const href = `/detail/${slugify(title, id)}?type=${mediaType}`;
  return (
    <Link href={href} className="movie-card w-[160px] md:w-[180px] flex-shrink-0 group cursor-pointer">
      <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-[#1A1A1A] ring-1 ring-white/5 group-hover:ring-[#FF6B00]/40 transition-all duration-300">
        {posterPath ? (
          <img
            src={tmdbImage(posterPath, 'w300')}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600 text-sm">No Poster</div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-[#FF6B00]/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><polygon points="6,3 20,12 6,21"/></svg>
          </div>
        </div>

        {/* Rating badge */}
        {rating && rating > 0 && (
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm px-1.5 py-0.5 rounded-md text-[11px] font-semibold">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="gold"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>
            {rating.toFixed(1)}
          </div>
        )}

        {/* Quality badge */}
        <div className="absolute bottom-2 left-2">
          <span className="px-1.5 py-0.5 bg-black/70 backdrop-blur-sm text-[10px] font-semibold text-white rounded">HD</span>
        </div>
      </div>
      <div className="mt-2.5 px-0.5">
        <h3 className="text-sm font-medium text-white truncate group-hover:text-[#FF6B00] transition-colors">{title}</h3>
        {year && <p className="text-xs text-gray-500 mt-0.5">{year}</p>}
      </div>
    </Link>
  );
}