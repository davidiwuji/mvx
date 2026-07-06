/* eslint-disable @typescript-eslint/no-explicit-any */
import type { StreamSource, ContentType } from './types';

/**
 * Embed providers — ordered by ad experience (cleanest first).
 *
 * Cleanest → Heaviest:
 * ① Embed.su      — Minimal ads
 * ② 2Embed.cc     — Light ads
 * ③ VidLink.pro   — Moderate ads
 * ④ VidSrc Pro    — More ads / popups
 * ⑤ VidSrc.to     — Heaviest ads (last resort)
 */
const EMBED_PROVIDERS = [
  {
    name: 'Embed',
    movie: (id: number) => `https://embed.su/embed/movie/${id}`,
    tv: (id: number, season?: number, episode?: number) =>
      `https://embed.su/embed/tv/${id}/${season || 1}/${episode || 1}`,
  },
  {
    name: '2Embed',
    movie: (id: number) => `https://www.2embed.cc/embed/${id}`,
    tv: (id: number, season?: number, episode?: number) =>
      `https://www.2embed.cc/embedtv/${id}&s=${season || 1}&e=${episode || 1}`,
  },
  {
    name: 'VidLink',
    movie: (id: number) => `https://vidlink.pro/movie/${id}`,
    tv: (id: number, season?: number, episode?: number) =>
      `https://vidlink.pro/tv/${id}/${season || 1}/${episode || 1}`,
  },
  {
    name: 'VidSrc Pro',
    movie: (id: number) => `https://vidsrc.pro/embed/movie/${id}`,
    tv: (id: number, season?: number, episode?: number) =>
      `https://vidsrc.pro/embed/tv/${id}/${season || 1}/${episode || 1}`,
  },
  {
    name: 'VidSrc',
    movie: (id: number) => `https://vidsrc.to/embed/movie/${id}`,
    tv: (id: number, season?: number, episode?: number) =>
      `https://vidsrc.to/embed/tv/${id}/${season || 1}/${episode || 1}`,
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
      // skip invalid providers
    }
  }

  return sources;
}

/**
 * Generate stream sources from TMDB data (trailer + embeds)
 */
export function getStreamSources(
  detail: any,
  type: ContentType,
  season?: number,
  episode?: number
): StreamSource[] {
  const sources: StreamSource[] = [];

  // Add YouTube trailer if available
  if (detail.videos?.results?.length > 0) {
    const trailer = detail.videos.results.find(
      (v: any) => v.type === 'Trailer' && v.site === 'YouTube'
    ) || detail.videos.results[0];
    if (trailer?.key) {
      sources.push({
        name: 'Trailer',
        url: `https://www.youtube.com/embed/${trailer.key}`,
        type: 'embed',
        quality: 'HD',
      });
    }
  }

  // Add embed sources (cleanest → heaviest order)
  const embeds = getEmbedSources(detail.id, type, season, episode);
  sources.push(...embeds);

  return sources;
}
