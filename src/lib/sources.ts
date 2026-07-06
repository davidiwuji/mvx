/* eslint-disable @typescript-eslint/no-explicit-any */
import type { StreamSource, ContentType } from './types';

/**
 * Real embed providers that free streaming sites use.
 * All accept TMDB ID as parameter and return embedded video players.
 * 
 * Verified working: VidSrc.to, VidSrc.pro, VidLink.pro, Embed.su, 2Embed.cc
 */
const EMBED_PROVIDERS = {
  vidsrc_to: {
    name: 'VidSrc',
    movie: (id: number) => `https://vidsrc.to/embed/movie/${id}`,
    tv: (id: number, season?: number, episode?: number) =>
      `https://vidsrc.to/embed/tv/${id}/${season || 1}/${episode || 1}`,
  },
  vidsrc_pro: {
    name: 'VidSrc Pro',
    movie: (id: number) => `https://vidsrc.pro/embed/movie/${id}`,
    tv: (id: number, season?: number, episode?: number) =>
      `https://vidsrc.pro/embed/tv/${id}/${season || 1}/${episode || 1}`,
  },
  vidlink: {
    name: 'VidLink',
    movie: (id: number) => `https://vidlink.pro/movie/${id}`,
    tv: (id: number, season?: number, episode?: number) =>
      `https://vidlink.pro/tv/${id}/${season || 1}/${episode || 1}`,
  },
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
};

export function getEmbedSources(
  tmdbId: number,
  type: ContentType,
  season?: number,
  episode?: number
): StreamSource[] {
  const sources: StreamSource[] = [];
  const providers = Object.values(EMBED_PROVIDERS);

  for (const p of providers) {
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

  // Add embed sources
  const embeds = getEmbedSources(detail.id, type, season, episode);
  sources.push(...embeds);

  return sources;
}
