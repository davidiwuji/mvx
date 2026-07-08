import { MetadataRoute } from 'next';

const TMDB_BASE = 'https://api.themoviedb.org/3';
const BASE_URL = 'https://boxo.name.ng';

async function tmdbFetch<T>(endpoint: string): Promise<T> {
  const key = process.env.TMDB_API_KEY || '';
  const url = new URL(`${TMDB_BASE}${endpoint}`);
  url.searchParams.set('api_key', key);
  url.searchParams.set('language', 'en-US');
  const res = await fetch(url.toString(), { next: { revalidate: 86400 } });
  if (!res.ok) throw new Error(`TMDB error: ${res.status}`);
  return res.json();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/movies`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/tv-series`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/privacy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE_URL}/search`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.5 },
    { url: `${BASE_URL}/live-tv`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
  ];

  // Genre category pages
  const GENRES = ['action', 'adventure', 'animation', 'comedy', 'crime', 'documentary', 'drama',
    'family', 'fantasy', 'history', 'horror', 'music', 'mystery', 'romance', 'sci-fi',
    'thriller', 'war', 'western'];
  for (const g of GENRES) {
    entries.push({ url: `${BASE_URL}/movies?genre=${g}`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 });
    entries.push({ url: `${BASE_URL}/tv-series?genre=${g}`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 });
  }

  // Fetch popular movies for detail pages (first 4 pages = 80 movies)
  try {
    const [moviePage1, moviePage2, tvPage1, tvPage2] = await Promise.all([
      tmdbFetch<{ results: { id: number; title: string }[] }>('/movie/popular?page=1'),
      tmdbFetch<{ results: { id: number; title: string }[] }>('/movie/popular?page=2'),
      tmdbFetch<{ results: { id: number; name: string }[] }>('/tv/popular?page=1'),
      tmdbFetch<{ results: { id: number; name: string }[] }>('/tv/popular?page=2'),
    ]);

    const slugify = (title: string, id: number) =>
      title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + id;

    for (const m of [...moviePage1.results, ...moviePage2.results]) {
      entries.push({
        url: `${BASE_URL}/detail/${slugify(m.title, m.id)}?type=movie`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.6,
      });
    }

    for (const t of [...tvPage1.results, ...tvPage2.results]) {
      entries.push({
        url: `${BASE_URL}/detail/${slugify(t.name, t.id)}?type=tv`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.6,
      });
    }
  } catch {
    // Sitemap should never crash — static entries still work
  }

  return entries;
}