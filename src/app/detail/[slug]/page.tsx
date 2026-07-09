'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import VideoPlayer from '@/components/VideoPlayer';
import MovieCard from '@/components/MovieCard';
import { tmdbImage, getYear } from '@/lib/tmdb';
import { getStreamSources } from '@/lib/sources';
import { addToWatchHistory } from '@/lib/storage';
import type { TMDBMovie, TMDBTVShow, ContentType, StreamSource } from '@/lib/types';

const tmdbFetch = async (url: string) => { const r = await fetch(url); if (!r.ok) throw new Error('Fetch failed'); return r.json(); };

export default function DetailPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const router = useRouter();
  const [detail, setDetail] = useState<any>(null);
  const [sources, setSources] = useState<StreamSource[]>([]);
  const [cast, setCast] = useState<any[]>([]);
  const [recommended, setRecommended] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState<ContentType>('movie');
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);

  const getTmdbId = () => { const m = slug.match(/-(\d+)$/); return m ? parseInt(m[1]) : 0; };

  useEffect(() => {
    const tid = getTmdbId();
    if (!tid) { setLoading(false); return; }

    const t = new URLSearchParams(window.location.search).get('type') || 'movie';
    setType(t as ContentType);

    const load = async () => {
      try {
        const [d, cred, rec] = await Promise.all([
          tmdbFetch(`/api/tmdb?endpoint=${t}/${tid}&append_to_response=videos,external_ids`),
          tmdbFetch(`/api/tmdb?endpoint=${t}/${tid}/credits`),
          tmdbFetch(`/api/tmdb?endpoint=${t}/${tid}/recommendations`),
        ]);
        d.credits = cred;
        d.recommendations = rec;
        setDetail(d);
        setCast(cred.cast?.slice(0, 12) || []);
        setRecommended(rec.results?.slice(0, 12) || []);

        setSources(getStreamSources(d, t as ContentType, season, episode));
      } catch { setDetail(null); }
      setLoading(false);
    };
    load();
  }, [slug, season, episode]);

  const updateSource = () => {
    if (!detail) return;
    setSources(getStreamSources(detail, type, season, episode));
  };

  useEffect(() => {
    if (detail) {
      updateSource();
      // Track watch history
      addToWatchHistory({
        id: detail.id,
        title: detail.title || detail.name,
        posterPath: detail.poster_path,
        mediaType: type,
        year: getYear(detail.release_date || detail.first_air_date),
        rating: detail.vote_average,
        genreIds: (detail.genres || []).map((g: any) => g.id),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [season, episode, detail]);

  // Update document title for SEO
  useEffect(() => {
    if (detail) {
      const t = isMovie ? detail.title : detail.name;
      document.title = `${t} - Watch Free ${isMovie ? 'Movie' : 'TV Series'} Online | Boxo`;
    }
  }, [detail]);

  if (loading) return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-[#FF6B00] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!detail) return (
    <div className="min-h-screen pt-24 flex flex-col items-center justify-center text-center px-4">
      <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-600 mb-4"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
      <h1 className="text-xl font-bold mb-2">Content not found</h1>
      <p className="text-gray-500 mb-6">This movie or TV series could not be loaded.</p>
      <button onClick={() => router.push('/')} className="bg-[#FF6B00] hover:bg-[#E65A00] px-6 py-2 rounded-lg">Go Home</button>
    </div>
  );

  const isMovie = type === 'movie';
  const title = isMovie ? detail.title : detail.name;
  const release = isMovie ? detail.release_date : detail.first_air_date;
  const seasons: number = detail.seasons?.filter((s: any) => s.season_number > 0)?.length || 0;
  const episodes: number = detail.seasons?.find((s: any) => s.season_number === season)?.episode_count || 0;

  const extWarning = (
    <p className="text-xs text-gray-600 mt-1">
      &#9432; External player loads from third-party servers. We do not host any content.
    </p>
  );

  // JSON-LD structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': isMovie ? 'Movie' : 'TVSeries',
    name: title,
    description: detail.overview,
    image: detail.poster_path ? `https://image.tmdb.org/t/p/original${detail.poster_path}` : undefined,
    datePublished: release || undefined,
    ...(isMovie ? { duration: detail.runtime ? `PT${detail.runtime}M` : undefined } : {}),
    aggregateRating: detail.vote_average > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: detail.vote_average.toFixed(1),
      ratingCount: detail.vote_count,
      bestRating: '10',
    } : undefined,
    genre: detail.genres?.map((g: any) => g.name),
    ...(detail.external_ids?.imdb_id ? { sameAs: `https://www.imdb.com/title/${detail.external_ids.imdb_id}` } : {}),
  };

  // BreadcrumbList structured data
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://boxo.name.ng' },
      { '@type': 'ListItem', position: 2, name: isMovie ? 'Movies' : 'TV Series', item: `https://boxo.name.ng/${isMovie ? 'movies' : 'tv-series'}` },
      { '@type': 'ListItem', position: 3, name: title },
    ],
  };

  return (
    <div className="min-h-screen pt-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <div className="relative">
        <div className="absolute inset-0 h-[70vh] bg-cover bg-center"
          style={{ backgroundImage: `url(${tmdbImage(detail.backdrop_path, 'original')})` }}>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/70 to-transparent" />
        </div>
        <div className="relative max-w-[1400px] mx-auto px-4 pt-20 pb-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-[200px] aspect-[2/3] rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10 flex-shrink-0">
              {detail.poster_path ? <img src={tmdbImage(detail.poster_path, 'w500')} alt={title} className="w-full h-full object-cover" />
              : <div className="w-full h-full bg-[#222222] flex items-center justify-center"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-500"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg></div>}
            </div>
            <div className="flex-1 min-w-0 pt-4">
              <h1 className="text-3xl md:text-5xl font-bold mb-2">{title}</h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400 mb-3">
                {release && <span>{getYear(release)}</span>}
                {detail.vote_average > 0 && (
                  <span className="flex items-center gap-1">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>
                    {detail.vote_average.toFixed(1)} ({detail.vote_count?.toLocaleString()})
                  </span>
                )}
                {detail.runtime > 0 && <span>{detail.runtime} min</span>}
                {!isMovie && seasons > 0 && <span>{seasons} Season{seasons > 1 ? 's' : ''}</span>}
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {detail.genres?.map((g: any) => (
                  <Link key={g.id} href={`/${isMovie ? 'movies' : 'tv-series'}?genre=${g.name.toLowerCase()}`}
                    className="text-xs px-3 py-1 rounded-full bg-[#222222] text-gray-300 hover:bg-[#FF6B00]/20 hover:text-[#FF6B00] transition-colors">{g.name}</Link>
                ))}
              </div>
              {detail.tagline && <p className="text-sm italic text-gray-500 mb-3">&ldquo;{detail.tagline}&rdquo;</p>}
              <p className="text-sm md:text-base text-gray-300 leading-relaxed max-w-3xl">{detail.overview || 'No overview available.'}</p>
              {cast.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs text-gray-500">
                    <span className="font-semibold text-gray-400">Cast: </span>
                    {cast.slice(0, 5).map((c: any) => c.name).join(', ')}
                    {cast.length > 5 && ' ...'}
                  </p>
                </div>
              )}
              {(detail.homepage || detail.external_ids?.imdb_id) && (
                <div className="flex gap-3 mt-4">
                  {detail.homepage && <a href={detail.homepage} target="_blank" className="text-xs text-[#FF6B00] hover:text-[#E65A00] underline">Official Site</a>}
                  {detail.external_ids?.imdb_id && <a href={`https://www.imdb.com/title/${detail.external_ids.imdb_id}`} target="_blank" className="text-xs text-[#FF6B00] hover:text-[#E65A00] underline">IMDb</a>}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 -mt-10 relative z-20">
        <div className="bg-[#1A1A1A] rounded-xl p-3 md:p-5 shadow-2xl">
          {!isMovie && seasons > 0 && (
            <div className="flex items-center gap-4 mb-4 pb-4 border-b border-[#333333]">
              <div>
                <label className="text-xs text-gray-500 block mb-1">Season</label>
                <select value={season} onChange={e => { setSeason(parseInt(e.target.value)); setEpisode(1); }}
                  className="bg-[#0D0D0D] border border-[#333333] rounded-lg px-3 py-1.5 text-sm text-white">
                  {detail.seasons?.filter((s: any) => s.season_number > 0).map((s: any) => (
                    <option key={s.season_number} value={s.season_number}>{s.name || `Season ${s.season_number}`}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Episode</label>
                <select value={episode} onChange={e => setEpisode(parseInt(e.target.value))}
                  className="bg-[#0D0D0D] border border-[#333333] rounded-lg px-3 py-1.5 text-sm text-white">
                  {Array.from({ length: episodes || 12 }, (_, i) => i + 1).map(e => (
                    <option key={e} value={e}>Episode {e}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
          <VideoPlayer sources={sources} poster={tmdbImage(detail.backdrop_path, 'original')} title={title} />
          {extWarning}
          {sources.length > 1 && (
            <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-3 border-t border-[#333333]">
              <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider mr-1">Server</span>
              {sources.map((s, i) => (
                <button key={i} onClick={() => {
                  const newSources = [...sources];
                  const [selected] = newSources.splice(i, 1);
                  newSources.unshift(selected);
                  setSources(newSources);
                }}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                    i === 0
                      ? 'bg-[#FF6B00] text-white shadow-sm shadow-orange-600/20'
                      : 'bg-[#222222] text-gray-400 hover:bg-[#2a2a2a] hover:text-white border border-[#333333]'
                  }`}>
                  {s.name || `Server ${i + 1}`}
                  {i === 0 && <span className="ml-1.5 text-[10px] opacity-70">●</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {cast.length > 0 && (
        <section className="max-w-[1400px] mx-auto px-4 mt-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-5 bg-[#FF6B00] rounded-full" />
            <h2 className="text-xl font-bold">Cast</h2>
          </div>
          <div className="flex overflow-x-auto gap-4 pb-2 hide-scrollbar">
            {cast.map((c: any) => (
              <div key={c.id} className="flex-shrink-0 w-[100px] text-center">
                <div className="w-[100px] aspect-[2/3] rounded-lg overflow-hidden bg-[#222222] mb-2">
                  {c.profile_path ? <img src={tmdbImage(c.profile_path, 'w185')} alt={c.name} className="w-full h-full object-cover" loading="lazy" />
                  : <div className="w-full h-full flex items-center justify-center"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-600"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>}
                </div>
                <p className="text-xs font-medium truncate">{c.name}</p>
                <p className="text-[10px] text-gray-500 truncate">{c.character}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {recommended.length > 0 && (
        <section className="max-w-[1400px] mx-auto px-4 mt-10 pb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-5 bg-[#FF6B00] rounded-full" />
            <h2 className="text-xl font-bold">You May Also Like</h2>
          </div>
          <div className="flex overflow-x-auto gap-3 pb-2 hide-scrollbar">
            {recommended.map((r: any) => {
              const rt: ContentType = r.media_type === 'tv' ? 'tv' : 'movie';
              const rtitle = rt === 'movie' ? (r as TMDBMovie).title : (r as TMDBTVShow).name;
              return (
                <MovieCard key={r.id} id={r.id} title={rtitle} posterPath={r.poster_path}
                  year={getYear(rt === 'movie' ? (r as TMDBMovie).release_date : (r as TMDBTVShow).first_air_date)}
                  rating={r.vote_average} mediaType={rt} />
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
