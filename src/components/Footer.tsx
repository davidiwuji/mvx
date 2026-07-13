const GENRES = [
  { href: '/movies?genre=action', label: 'Action' },
  { href: '/movies?genre=adventure', label: 'Adventure' },
  { href: '/movies?genre=comedy', label: 'Comedy' },
  { href: '/movies?genre=crime', label: 'Crime' },
  { href: '/movies?genre=drama', label: 'Drama' },
  { href: '/movies?genre=horror', label: 'Horror' },
  { href: '/movies?genre=sci-fi', label: 'Sci-Fi' },
  { href: '/movies?genre=thriller', label: 'Thriller' },
];

export default function Footer() {
  return (
    <footer className="bg-[#111111] border-t border-[#222222] mt-16">
      <div className="max-w-[1400px] mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <p className="text-sm text-gray-500 leading-relaxed mb-4">
              Watch thousands of movies and TV series online for free. No registration required.
            </p>
            <div className="flex gap-3">
              <a href="mailto:contact@boxo.name.ng" className="text-gray-600 hover:text-gray-400 transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.48a2 2 0 0 1-2.06 0L2 7"/></svg>
              </a>
            </div>
          </div>

          {/* Browse */}
          <div>
            <h4 className="text-sm font-semibold mb-4 text-white/80">Browse</h4>
            <div className="space-y-2.5 text-sm text-gray-500">
              <a href="/movies" className="block hover:text-white transition-colors">Movies</a>
              <a href="/tv-series" className="block hover:text-white transition-colors">TV Series</a>
              <a href="/search" className="block hover:text-white transition-colors">Search</a>
            </div>
          </div>

          {/* Genres */}
          <div>
            <h4 className="text-sm font-semibold mb-4 text-white/80">Genres</h4>
            <div className="space-y-2.5 text-sm text-gray-400">
              {GENRES.map(g => (
                <a key={g.href} href={g.href} className="block hover:text-white transition-colors capitalize">{g.label}</a>
              ))}
            </div>
          </div>

          {/* TV Genres */}
          <div>
            <h4 className="text-sm font-semibold mb-4 text-white/80">TV Genres</h4>
            <div className="space-y-2.5 text-sm text-gray-400">
              <a href="/tv-series?genre=action" className="block hover:text-white transition-colors">Action</a>
              <a href="/tv-series?genre=comedy" className="block hover:text-white transition-colors">Comedy</a>
              <a href="/tv-series?genre=drama" className="block hover:text-white transition-colors">Drama</a>
              <a href="/tv-series?genre=crime" className="block hover:text-white transition-colors">Crime</a>
              <a href="/tv-series?genre=sci-fi" className="block hover:text-white transition-colors">Sci-Fi</a>
              <a href="/tv-series?genre=animation" className="block hover:text-white transition-colors">Animation</a>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold mb-4 text-white/80">Legal</h4>
            <div className="space-y-2.5 text-sm text-gray-400">
              <a href="/privacy" className="block hover:text-white transition-colors">Privacy Policy</a>
              <p className="text-xs text-gray-600 mt-4 leading-relaxed">
                Boxo does not host, store, or own any content. All content is embedded from third-party services and belongs to their respective owners.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#222222] mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">
            &copy; {new Date().getFullYear()} Boxo. All rights reserved.
          </p>
          <p className="text-xs text-gray-700">
            We do not host any content. All materials belong to their respective owners.
          </p>
        </div>
      </div>
    </footer>
  );
}