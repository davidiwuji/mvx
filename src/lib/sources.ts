/* eslint-disable @typescript-eslint/no-explicit-any */
import type { StreamSource, ContentType } from './types';

/**
 * Embed providers ordered by ad cleanliness (cleanest first).
 *
 * Ad experience ranking (based on real usage):
 * ① Embed.su      — Minimal ads, plays cleanly, few popups
 * ② 2Embed.cc     — Light ads, reliable playback
 * ③ VidLink.pro   — Some overlay ads, moderate
 * ④ VidSrc Pro    — More popups/redirects, use as fallback
 * ⑤ VidSrc.to     — Heaviest ads, last resort
 */
const EMBED_PROVIDERS = {
  embed_su: {
    name: 'Embed',
    movie: (id: number) => `https://embed.su/embed/movie/${id}`,
    tv: (id: number, season?: number, episode?: number) =>
      `https://embed.su/embed/tv/${id}/${season || 1}/${episode || 1}`,
  },
  two_embed: {
    name: '2Embed',
    movie: (id: number) => `https://www.2embed.cc/embed/${id}`,
    tv: (id: number, season?: number, episode?: number) =>
      `https://www.2embed.cc/embedtv/${id}&s=${season || 1}&e=${episode || 1}`,
  },
  vidlink: {
    name: 'VidLink',
    movie: (id: number) => `https://vidlink.pro/movie/${id}`,
    tv: (id: number, season?: number, episode?: number) =>
      `https://vidlink.pro/tv/${id}/${season || 1}/${episode || 1}`,
  },
  vidsrc_pro: {
    name: 'VidSrc Pro',
    movie: (id: number) => `https://vidsrc.pro/embed/movie/${id}`,
    tv: (id: number, season?: number, episode?: number) =>
      `https://vidsrc.pro/embed/tv/${id}/${season || 1}/${episode || 1}`,
  },
  vidsrc_to: {
    name: 'VidSrc',
    movie: (id: number) => `https://vidsrc.to/embed/movie/${id}`,
    tv: (id: number, season?: number, episode?: number) =>
      `https://vidsrc.to/embed/tv/${id}/${season || 1}/${episode || 1}`,
  },
};

/**
 * Number of embed sources to expose.
 * Fewer sources = fewer ad-heavy fallbacks offered to users.
 * Set to 3 for a good balance: clean playback + sufficient coverage.
 */
const MAX_EMBED_SOURCES = 3;

export function getEmbedSources(
  tmdbId: number,
  type: ContentType,
  season?: number,
  episode?: number
): StreamSource[] {
  const sources: StreamSource[] = [];
  const providers = Object.values(EMBED_PROVIDERS);

  // Only take the top-N cleanest providers
  const activeProviders = providers.slice(0, MAX_EMBED_SOURCES);

  for (const p of activeProviders) {
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

  // Add embed sources (limited to cleanest providers)
  const embeds = getEmbedSources(detail.id, type, season, episode);
  sources.push(...embeds);

  return sources;
}
