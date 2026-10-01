'use client';

export interface WatchlistMovie {
  id: number;
  title: string;
  posterPath: string | null;
  backdropPath?: string | null;
  mediaType: 'movie' | 'tv';
  year?: string;
  rating?: number;
  genres?: string[];
  addedAt: number;
}

const WATCHLIST_KEY = 'mvx_user_watchlist';
const EVENT_NAME = 'mvx_watchlist_updated';

export function getWatchlist(): WatchlistMovie[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(WATCHLIST_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function isWatchlisted(id: number, mediaType: 'movie' | 'tv' = 'movie'): boolean {
  if (typeof window === 'undefined') return false;
  const list = getWatchlist();
  return list.some(item => item.id === id && item.mediaType === mediaType);
}

export function toggleWatchlist(item: Omit<WatchlistMovie, 'addedAt'>): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const list = getWatchlist();
    const existingIndex = list.findIndex(i => i.id === item.id && i.mediaType === item.mediaType);
    let nowWatchlisted = false;

    if (existingIndex >= 0) {
      list.splice(existingIndex, 1);
      nowWatchlisted = false;
    } else {
      list.unshift({ ...item, addedAt: Date.now() });
      nowWatchlisted = true;
    }

    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { id: item.id, count: list.length } }));
    return nowWatchlisted;
  } catch {
    return false;
  }
}

export function removeFromWatchlist(id: number, mediaType: 'movie' | 'tv' = 'movie'): void {
  if (typeof window === 'undefined') return;
  try {
    const list = getWatchlist().filter(i => !(i.id === id && i.mediaType === mediaType));
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { id, count: list.length } }));
  } catch {}
}

export function subscribeToWatchlist(callback: (items: WatchlistMovie[]) => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const handler = () => {
    callback(getWatchlist());
  };
  window.addEventListener(EVENT_NAME, handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener(EVENT_NAME, handler);
    window.removeEventListener('storage', handler);
  };
}
