export default function Footer() {
  return (
    <footer className="bg-[#1A1A1A] border-t border-[#333333] mt-16">
      <div className="max-w-[1400px] mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-1.5 mb-3">
              <span className="text-lg font-bold text-white">▣</span>
              <span className="text-lg font-bold">Boxo</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Watch thousands of movies and TV series online for free.
            </p>
          </div>

          {/* Browse */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Browse</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <a href="/movies" className="block hover:text-white">Movies</a>
              <a href="/tv-series" className="block hover:text-white">TV Series</a>
              <a href="/search" className="block hover:text-white">Search</a>
            </div>
          </div>

          {/* Genres */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Genres</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <a href="/movies?genre=action" className="block hover:text-white">Action</a>
              <a href="/movies?genre=comedy" className="block hover:text-white">Comedy</a>
              <a href="/movies?genre=drama" className="block hover:text-white">Drama</a>
              <a href="/movies?genre=horror" className="block hover:text-white">Horror</a>
            </div>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Legal</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <a href="/privacy" className="block hover:text-white underline underline-offset-2 decoration-orange-500/30 hover:decoration-orange-500 transition-all">
                Privacy Policy
              </a>
              <p className="text-xs text-gray-600 mt-3 leading-relaxed">
                Boxo does not own or host any content. All movies and TV shows belong to their respective owners.
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer summary bar */}
        <div className="border-t border-[#333333] mt-8 pt-6">
          <p className="text-xs text-gray-600 text-center leading-relaxed max-w-3xl mx-auto">
            <strong className="text-gray-500">Disclaimer:</strong> Boxo does not host, store, or manage any video files. 
            All content displayed is embedded from third-party services and belongs to their respective copyright holders. 
            Boxo has no affiliation with any content owners. If you believe your copyright has been violated, please{' '}
            <a href="/privacy" className="text-orange-500 hover:text-orange-400 underline underline-offset-2">
              contact us
            </a>.
          </p>
        </div>

        {/* Copyright */}
        <div className="mt-4 text-center text-xs text-gray-700">
          &copy; {new Date().getFullYear()} Boxo. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
