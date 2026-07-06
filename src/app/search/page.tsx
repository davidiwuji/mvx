'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import MovieCard from '@/components/MovieCard';
import { getYear } from '@/lib/tmdb';
import type { TMDBMovie, TMDBTVShow, ContentType } from '@/lib/types';

function SearchResults() {
  const sp = useSearchParams();
  const router = useRouter();
  const q = sp.get('q') || '';
  const page = parseInt(sp.get('page') || '1');

  const [results, setResults] = useState<(TMDBMovie | TMDBTVShow)[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState(q);

  useEffect(() => {
    if (!q) { setResults([]); setTotal(0); return; }
    setLoading(true);
    fetch(`/api/tmdb?endpoint=search/multi&query=${encodeURIComponent(q)}&page=${page}`)
      .then(r => r.json())
      .then(d => {
        const filtered = d.results?.filter((r: any) => r.media_type === 'movie' || r.media_type === 'tv') || [];
        setResults(filtered);
        setTotal(Math.min(d.total_pages || 1, 500));
      })
      .catch(() => { setResults([]); setTotal(0); })
      .finally(() => setLoading(false));
  }, [q, page]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <>
      <form onSubmit={onSubmit} className="mb-8">
        <div className="relative max-w-2xl mx-auto">
          <input type="text" value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Search movies, TV series..."
            className="w-full bg-[#1a1d29] border border-[#2d3247] rounded-xl px-5 py-3 pl-12 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 text-lg" />
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        </div>
      </form>

      {!q && (
        <div className="text-center py-20 text-gray-500">
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mx-auto mb-4 opacity-30"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <h2 className="text-lg font-medium mb-1">Search Movies &amp; TV Series</h2>
          <p className="text-sm">Type above to find what you want to watch</p>
        </div>
      )}

      {q && loading && (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {q && !loading && results.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No results for &ldquo;{q}&rdquo;</p>
        </div>
      )}

      {results.length > 0 && (
        <>
          <p className="text-sm text-gray-500 mb-4">Showing results for &ldquo;{q}&rdquo;</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5">
            {results.map(r => {
              const isMovie = r.media_type === 'movie';
              const t = isMovie ? (r as TMDBMovie).title : (r as TMDBTVShow).name;
              const d = isMovie ? (r as TMDBMovie).release_date : (r as TMDBTVShow).first_air_date;
              return (
                <MovieCard key={`${r.media_type}-${r.id}`} id={r.id} title={t}
                  posterPath={r.poster_path} year={getYear(d)} rating={r.vote_average}
                  mediaType={(r.media_type as ContentType) || 'movie'} />
              );
            })}
          </div>
          {total > 1 && (
            <div className="flex items-center justify-center gap-3 mt-12">
              {page > 1 && <button onClick={() => router.push(`/search?q=${encodeURIComponent(q)}&page=${page - 1}`)} className="px-5 py-2 bg-[#1a1d29] rounded-lg text-sm hover:bg-[#2d3247]">&larr; Previous</button>}
              <span className="text-sm text-gray-500">Page {page} of {total}</span>
              {page < total && <button onClick={() => router.push(`/search?q=${encodeURIComponent(q)}&page=${page + 1}`)} className="px-5 py-2 bg-orange-600 rounded-lg text-sm hover:bg-orange-700">Next &rarr;</button>}
            </div>
          )}
        </>
      )}
    </>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-[1400px] mx-auto px-4">
        <Suspense fallback={<div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" /></div>}>
          <SearchResults />
        </Suspense>
      </div>
    </div>
  );
}

