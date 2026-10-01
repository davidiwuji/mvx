/* eslint-disable @typescript-eslint/no-explicit-any */
import type { StreamSource, ContentType } from './types';

/**
 * Top verified embed providers for Movies and TV Series.
 */
export const EMBED_PROVIDERS = [
  {
    name: 'VidLink (Primary HD)',
    movie: (id: number) => `https://vidlink.pro/movie/${id}`,
    tv: (id: number, season?: number, episode?: number) =>
      `https://vidlink.pro/tv/${id}/${season || 1}/${episode || 1}`,
  },
  {
    name: 'AutoEmbed (Fast)',
    movie: (id: number) => `https://player.autoembed.cc/embed/movie/${id}`,
    tv: (id: number, season?: number, episode?: number) =>
      `https://player.autoembed.cc/embed/tv/${id}/${season || 1}/${episode || 1}`,
  },
  {
    name: 'VidSrc V2 (Multi-Lang)',
    movie: (id: number) => `https://vidsrc.cc/v2/embed/movie/${id}`,
    tv: (id: number, season?: number, episode?: number) =>
      `https://vidsrc.cc/v2/embed/${id}/${season || 1}/${episode || 1}`,
  },
  {
    name: 'VidSrc XYZ',
    movie: (id: number) => `https://vidsrc.xyz/embed/movie/${id}`,
    tv: (id: number, season?: number, episode?: number) =>
      `https://vidsrc.xyz/embed/tv/${id}/${season || 1}/${episode || 1}`,
  },
  {
    name: 'SuperEmbed (Multi)',
    movie: (id: number) => `https://multiembed.mov/?video_id=${id}&tmdb=1`,
    tv: (id: number, season?: number, episode?: number) =>
      `https://multiembed.mov/?video_id=${id}&tmdb=1&s=${season || 1}&e=${episode || 1}`,
  },
  {
    name: 'VidEasy (Adaptive)',
    movie: (id: number) => `https://player.videasy.net/movie/${id}`,
    tv: (id: number, season?: number, episode?: number) =>
      `https://player.videasy.net/tv/${id}/${season || 1}/${episode || 1}`,
  },
  {
    name: 'Embed.su (Global)',
    movie: (id: number) => `https://embed.su/embed/movie/${id}`,
    tv: (id: number, season?: number, episode?: number) =>
      `https://embed.su/embed/tv/${id}/${season || 1}/${episode || 1}`,
  },
  {
    name: 'SmashyStream',
    movie: (id: number) => `https://player.smashystream.xyz/movie/${id}`,
    tv: (id: number, season?: number, episode?: number) =>
      `https://player.smashystream.xyz/tv/${id}?s=${season || 1}&e=${episode || 1}`,
  },
  {
    name: '2Embed (Backup)',
    movie: (id: number) => `https://www.2embed.cc/embed/${id}`,
    tv: (id: number, season?: number, episode?: number) =>
      `https://www.2embed.cc/embedtv/${id}&s=${season || 1}&e=${episode || 1}`,
  },
];

export function getEmbedSources(
  tmdbId: number,
  type: ContentType,
  season?: number,
  episode?: number
): StreamSource[] {
  const sources: StreamSource[] = [];
  for (const p of EMBED_PROVIDERS) {
    try {
      const url = type === 'movie' ? p.movie(tmdbId) : p.tv(tmdbId, season, episode);
      sources.push({
        name: p.name,
        url,
        type: 'embed',
        quality: 'HD',
      });
    } catch {
      // skip
    }
  }
  return sources;
}

/**
 * Returns stream sources with movie/tv embeds FIRST, and optional trailer key.
 */
export function getStreamSources(
  detail: any,
  type: ContentType,
  season?: number,
  episode?: number
): { sources: StreamSource[]; trailerUrl: string | null } {
  // 1. Direct embed stream servers first (so user can watch immediately)
  const sources = getEmbedSources(detail.id, type, season, episode);

  // 2. Extract trailer if available
  let trailerUrl: string | null = null;
  if (detail?.videos?.results?.length > 0) {
    const trailer = detail.videos.results.find(
      (v: any) => v.type === 'Trailer' && v.site === 'YouTube'
    ) || detail.videos.results[0];
    if (trailer?.key) {
      trailerUrl = `https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0`;
    }
  }

  return { sources, trailerUrl };
}
