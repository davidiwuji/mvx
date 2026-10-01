'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import VideoPlayer from '@/components/VideoPlayer';
import MovieCard from '@/components/MovieCard';
import { tmdbImage, getYear, formatRuntime } from '@/lib/tmdb';
import { getStreamSources } from '@/lib/sources';
import { addToWatchHistory } from '@/lib/storage';
import { isWatchlisted, toggleWatchlist, subscribeToWatchlist } from '@/lib/watchlist';
import { getRandomSurprise } from '@/lib/surprise';
import { IMDB_TRENDING_MOVIES, IMDB_TRENDING_TV, IMDB_TOP_ANIME_SERIES, IMDB_TOP_ANIME_MOVIES } from '@/lib/imdb';
import type { ContentType, StreamSource } from '@/lib/types';

const tmdbFetch = async (url: string) => {
  const r = await fetch(url);
  if (!r.ok) throw new Error('Fetch failed');
  return r.json();
};

export default function DetailPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const router = useRouter();

  const [detail, setDetail] = useState<any>(null);
  const [sources, setSources] = useState<StreamSource[]>([]);
  const [trailerUrl, setTrailerUrl] = useState<string | null>(null);
  const [playerMode, setPlayerMode] = useState<'stream' | 'trailer'>('stream');
  const [activeServerIndex, setActiveServerIndex] = useState(0);

  const [cast, setCast] = useState<any[]>([]);
  const [recommended, setRecommended] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState<ContentType>('movie');
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);

  const getTmdbId = () => {
    const m = slug.match(/-(\d+)$/);
    return m ? parseInt(m[1], 10) : 0;
  };

  useEffect(() => {
    const tid = getTmdbId();
    if (!tid) {
      setLoading(false);
      return;
    }

    const t = (new URLSearchParams(window.location.search).get('type') || 'movie') as ContentType;
    setType(t);

    const loadContent = async () => {
      try {
        const [d, cred, rec] = await Promise.all([
          tmdbFetch(`/api/tmdb?endpoint=${t}/${tid}&append_to_response=videos,external_ids`),
          tmdbFetch(`/api/tmdb?endpoint=${t}/${tid}/credits`).catch(() => ({ cast: [] })),
          tmdbFetch(`/api/tmdb?endpoint=${t}/${tid}/recommendations`).catch(() => ({ results: [] })),
        ]);

        d.credits = cred;
        d.recommendations = rec;
        setDetail(d);
        setCast(cred.cast?.slice(0, 12) || []);
        const recList = rec.results?.length
          ? rec.results.slice(0, 12)
          : [...IMDB_TRENDING_MOVIES, ...IMDB_TRENDING_TV]
              .filter(m => m.id !== tid)
              .slice(0, 12)
              .map(m => ({
                id: m.id,
                title: m.title,
                name: m.title,
                poster_path: m.posterPath,
                release_date: `${m.year}-01-01`,
                first_air_date: `${m.year}-01-01`,
                vote_average: m.imdbRating,
                media_type: m.mediaType,
              }));

        setRecommended(recList);

        const result = getStreamSources(d, t, season, episode);
        setSources(result.sources);
        setTrailerUrl(result.trailerUrl);
        setIsBookmarked(isWatchlisted(d.id, t));
      } catch (err) {
        console.warn('Could not load detail data from API, checking IMDb database:', err);
        const allImdb = [...IMDB_TRENDING_MOVIES, ...IMDB_TRENDING_TV, ...IMDB_TOP_ANIME_SERIES, ...IMDB_TOP_ANIME_MOVIES];
        const found = allImdb.find(item => item.id === tid);
        if (found) {
          const synthDetail: any = {
            id: found.id,
            title: found.title,
            name: found.title,
            overview: found.overview,
            poster_path: found.posterPath,
            backdrop_path: found.backdropPath,
            release_date: `${found.year}-01-01`,
            first_air_date: `${found.year}-01-01`,
            vote_average: found.imdbRating,
            vote_count: found.voteCount,
            genres: found.genres.map((g, idx) => ({ id: idx + 1, name: g })),
            number_of_seasons: 3,
            number_of_episodes: 24,
          };
          setDetail(synthDetail);
          const otherRecommendations = allImdb
            .filter(item => item.id !== tid)
            .slice(0, 12)
            .map(item => ({
              id: item.id,
              title: item.title,
              name: item.title,
              poster_path: item.posterPath,
              release_date: `${item.year}-01-01`,
              first_air_date: `${item.year}-01-01`,
              vote_average: item.imdbRating,
              media_type: item.mediaType,
            }));
          setRecommended(otherRecommendations);
          const result = getStreamSources(synthDetail, t, season, episode);
          setSources(result.sources);
          setTrailerUrl(result.trailerUrl);
          setIsBookmarked(isWatchlisted(found.id, t));
        }
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [slug]);

  // Update stream sources when season or episode changes
  useEffect(() => {
    if (!detail) return;
    const result = getStreamSources(detail, type, season, episode);
    setSources(result.sources);
    if (result.trailerUrl) setTrailerUrl(result.trailerUrl);

    // Track in watch history
    addToWatchHistory({
      id: detail.id,
      title: detail.title || detail.name,
      posterPath: detail.poster_path,
      mediaType: type,
      year: getYear(detail.release_date || detail.first_air_date),
      rating: detail.vote_average,
      genreIds: (detail.genres || []).map((g: any) => g.id),
    });
  }, [detail, type, season, episode]);

  // Subscribe to watchlist changes
  useEffect(() => {
    if (!detail) return;
    const unsub = subscribeToWatchlist(() => {
      setIsBookmarked(isWatchlisted(detail.id, type));
    });
    return () => unsub();
  }, [detail, type]);

  // SEO document title update
  useEffect(() => {
    if (detail) {
      const t = detail.title || detail.name;
      document.title = `${t} - Stream Free in HD | MVX`;
    }
  }, [detail]);

  const handleBookmarkToggle = () => {
    if (!detail) return;
    const now = toggleWatchlist({
      id: detail.id,
      title: detail.title || detail.name,
      posterPath: detail.poster_path,
      backdropPath: detail.backdrop_path,
      mediaType: type,
      year: getYear(detail.release_date || detail.first_air_date),
      rating: detail.vote_average,
    });
    setIsBookmarked(now);
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleSurpriseMe = () => {
    const s = getRandomSurprise();
    router.push(s.url);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-36 flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-3 border-[#FF6B00] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-gray-400">Loading cinema stream...</p>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="min-h-screen pt-36 flex flex-col items-center justify-center text-center px-4">
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 text-gray-500">
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" />
            <path d="m15 9-6 6" />
            <path d="m9 9 6 6" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Content Not Found</h1>
        <p className="text-sm text-gray-400 mb-6 max-w-sm">This title could not be loaded. Try another movie or series.</p>
        <button
          onClick={() => router.push('/')}
          className="px-6 py-2.5 rounded-full bg-[#FF6B00] text-white font-semibold text-sm hover:bg-[#FF8A00] transition-colors"
        >
          Back to Home
        </button>
      </div>
    );
  }

  const isMovie = type === 'movie';
  const title = isMovie ? detail.title : detail.name;
  const releaseDate = isMovie ? detail.release_date : detail.first_air_date;
  const year = getYear(releaseDate);
  const runtimeStr = detail.runtime ? formatRuntime(detail.runtime) : null;
  const seasons = detail.seasons?.filter((s: any) => s.season_number > 0) || [];
  const currentSeasonObj = seasons.find((s: any) => s.season_number === season) || seasons[0];
  const episodeCount = currentSeasonObj?.episode_count || 12;

  return (
    <div className="min-h-screen pt-28 pb-20">
      {/* ─── Immersive Backdrop Section ─── */}
      <div className="relative">
        {/* Backdrop Image */}
        <div
          className="absolute inset-0 h-[520px] bg-cover bg-center opacity-30 blur-[2px] pointer-events-none"
          style={{ backgroundImage: `url(${tmdbImage(detail.backdrop_path, 'original')})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#090B10] via-[#090B10]/80 to-transparent" />
        </div>

        {/* Info Header */}
        <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-8 pt-6 pb-8">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
            {/* Poster Card */}
            <div className="w-[160px] sm:w-[200px] aspect-[2/3] rounded-2xl overflow-hidden bg-[#121624] ring-1 ring-white/15 shadow-2xl flex-shrink-0 mx-auto md:mx-0">
              {detail.poster_path ? (
                <img
                  src={tmdbImage(detail.poster_path, 'w500')}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-900 text-gray-600 text-xs">
                  No Poster
                </div>
              )}
            </div>

            {/* Metadata & Actions */}
            <div className="flex-1 min-w-0 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
                <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                  isMovie
                    ? 'bg-[#FF6B00]/20 text-[#FF8A00] border border-[#FF6B00]/40'
                    : 'bg-purple-600/20 text-purple-300 border border-purple-500/40'
                }`}>
                  {isMovie ? 'Movie' : 'TV Series'}
                </span>
                {year && <span className="text-xs text-gray-400 font-medium">{year}</span>}
                {runtimeStr && <span className="text-xs text-gray-400 font-medium">&bull; {runtimeStr}</span>}
                <span className="text-[10px] font-black px-1.5 py-0.5 bg-white/10 rounded text-white border border-white/10">
                  HD
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-2">
                {title}
              </h1>

              {detail.tagline && (
                <p className="text-xs sm:text-sm italic text-gray-400 mb-3">
                  &ldquo;{detail.tagline}&rdquo;
                </p>
              )}

              {/* Rating & Genres */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
                {detail.vote_average > 0 && (
                  <div className="flex items-center gap-1.5 bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full border border-amber-500/30 text-xs font-bold">
                    <svg className="w-3.5 h-3.5 text-amber-400 fill-current" viewBox="0 0 24 24">
                      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                    </svg>
                    <span>{detail.vote_average.toFixed(1)}</span>
                    <span className="text-[10px] text-gray-400 font-normal">
                      ({detail.vote_count?.toLocaleString()} votes)
                    </span>
                  </div>
                )}

                {detail.genres?.map((g: any) => (
                  <Link
                    key={g.id}
                    href={`/${isMovie ? 'movies' : 'tv-series'}?genre=${g.name.toLowerCase()}`}
                    className="text-xs px-3 py-1 rounded-full bg-white/5 hover:bg-[#FF6B00]/20 hover:text-[#FF8A00] text-gray-300 border border-white/10 transition-colors"
                  >
                    {g.name}
                  </Link>
                ))}
              </div>

              {/* Synopsis */}
              <p className="text-xs sm:text-sm md:text-base text-gray-300 leading-relaxed max-w-3xl mb-6">
                {detail.overview || 'No synopsis available for this title.'}
              </p>

              {/* Action Buttons: Watchlist + Share + Surprise Me */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <button
                  onClick={handleBookmarkToggle}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs transition-all ${
                    isBookmarked
                      ? 'bg-[#FF6B00] text-white shadow-[0_0_20px_rgba(255,107,0,0.5)]'
                      : 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
                  }`}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.5">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                  </svg>
                  <span>{isBookmarked ? 'In Watchlist' : 'Add to Watchlist'}</span>
                </button>

                <button
                  onClick={handleShare}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white font-medium text-xs border border-white/15 transition-all"
                  title="Copy share link"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="18" cy="5" r="3" />
                    <circle cx="6" cy="12" r="3" />
                    <circle cx="18" cy="19" r="3" />
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                  </svg>
                  <span>{copied ? 'Copied Link!' : 'Share'}</span>
                </button>

                <button
                  onClick={handleSurpriseMe}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 font-medium text-xs border border-purple-500/30 transition-all"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z" />
                  </svg>
                  <span>Surprise Me</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── TV Series Season & Episode Selector (For TV Shows) ─── */}
      {!isMovie && seasons.length > 0 && (
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 mb-6">
          <div className="glass-panel rounded-2xl p-4 md:p-6 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#FF8A00]">Season</span>
                <select
                  value={season}
                  onChange={e => {
                    setSeason(parseInt(e.target.value, 10));
                    setEpisode(1);
                  }}
                  className="bg-[#0b0d14] text-white border border-white/15 rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none focus:border-[#FF6B00]"
                >
                  {seasons.map((s: any) => (
                    <option key={s.season_number} value={s.season_number}>
                      {s.name || `Season ${s.season_number}`}
                    </option>
                  ))}
                </select>
              </div>
              <span className="text-xs text-gray-400">
                Episode {episode} of {episodeCount}
              </span>
            </div>

            {/* Episode Grid Selector */}
            <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto pr-1">
              {Array.from({ length: episodeCount }, (_, i) => i + 1).map(ep => (
                <button
                  key={ep}
                  onClick={() => setEpisode(ep)}
                  className={`w-11 h-9 rounded-xl text-xs font-bold transition-all flex items-center justify-center ${
                    ep === episode
                      ? 'bg-gradient-to-r from-[#FF6B00] to-[#FF8A00] text-white shadow-md'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-white/5'
                  }`}
                >
                  E{ep}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── Video Streaming Hub ─── */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 mb-12">
        <VideoPlayer
          sources={sources}
          activeServerIndex={activeServerIndex}
          onSelectServer={setActiveServerIndex}
          trailerUrl={trailerUrl}
          mode={playerMode}
          onToggleMode={setPlayerMode}
          title={title}
        />
        <p className="text-[11px] text-gray-500 mt-2 text-center">
          &#9432; Media streaming is embedded from trusted third-party providers. If a server is slow, switch servers using the pills above.
        </p>
      </div>

      {/* ─── Cast & Crew Section ─── */}
      {cast.length > 0 && (
        <section className="max-w-[1400px] mx-auto px-4 md:px-8 mb-12">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1.5 h-5 bg-[#FF6B00] rounded-full" />
            <h2 className="text-lg font-bold text-white">Top Cast</h2>
          </div>
          <div className="flex overflow-x-auto gap-4 pb-3 hide-scrollbar">
            {cast.map((person: any) => (
              <div key={person.id} className="flex-shrink-0 w-[95px] sm:w-[110px] text-center">
                <div className="w-full aspect-[2/3] rounded-xl overflow-hidden bg-[#121624] ring-1 ring-white/10 mb-2">
                  {person.profile_path ? (
                    <img
                      src={tmdbImage(person.profile_path, 'w185')}
                      alt={person.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-900 text-gray-600 text-xs">
                      No Photo
                    </div>
                  )}
                </div>
                <p className="text-xs font-semibold text-white truncate">{person.name}</p>
                <p className="text-[10px] text-gray-400 truncate">{person.character}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ─── Similar / Recommendations ─── */}
      {recommended.length > 0 && (
        <section className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1.5 h-5 bg-[#FF6B00] rounded-full" />
            <h2 className="text-lg font-bold text-white">More Like This</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
            {recommended.slice(0, 12).map((item: any) => {
              const recType: ContentType = item.media_type === 'tv' ? 'tv' : 'movie';
              const recTitle = recType === 'movie' ? item.title : item.name;
              return (
                <MovieCard
                  key={item.id}
                  id={item.id}
                  title={recTitle}
                  posterPath={item.poster_path}
                  year={getYear(recType === 'movie' ? item.release_date : item.first_air_date)}
                  rating={item.vote_average}
                  mediaType={recType}
                />
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
