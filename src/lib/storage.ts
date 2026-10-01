export interface WatchItem {
  id: number;
  title: string;
  posterPath: string | null;
  mediaType: 'movie' | 'tv';
  year?: string;
  rating?: number;
  genreIds?: number[];
  watchedAt: number; // timestamp
}

const STORAGE_KEY = 'boxo_watch_history';

export function getWatchHistory(): WatchItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const items: WatchItem[] = JSON.parse(raw);
    return items.sort((a, b) => b.watchedAt - a.watchedAt);
  } catch {
    return [];
  }
}

export function addToWatchHistory(item: Omit<WatchItem, 'watchedAt'>) {
  try {
    const history = getWatchHistory();
    const existing = history.findIndex(h => h.id === item.id && h.mediaType === item.mediaType);
    if (existing >= 0) {
      history.splice(existing, 1); // remove old entry to re-add at top
    }
    history.unshift({ ...item, watchedAt: Date.now() });
    // Keep max 50 items
    const trimmed = history.slice(0, 50);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    // localStorage might be unavailable
  }
}

export function getLastWatched(): WatchItem | null {
  const history = getWatchHistory();
  return history.length > 0 ? history[0] : null;
}