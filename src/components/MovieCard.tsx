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
      <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-mvx-card">
        {posterPath ? (
          <img src={tmdbImage(posterPath, 'w300')} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-mvx-dim text-sm">No Poster</div>
        )}
        {rating && rating > 0 && (
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded-md text-xs font-semibold">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="gold"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>
            {rating.toFixed(1)}
          </div>
        )}
      </div>
      <div className="mt-2 px-0.5">
        <h3 className="text-sm font-medium text-white truncate">{title}</h3>
        {year && <p className="text-xs text-mvx-dim mt-0.5">{year}</p>}
      </div>
    </Link>
  );
}
