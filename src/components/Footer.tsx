export default function Footer() {
  return (
    <footer className="bg-[#1A1A1A] border-t border-[#333333] mt-16">
      <div className="max-w-[1400px] mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-1.5 mb-3">
              <span className="text-lg font-bold text-white">▣</span>
              <span className="text-lg font-bold">Boxo</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">Watch thousands of movies and TV series online for free.</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">Browse</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <a href="/movies" className="block hover:text-white">Movies</a>
              <a href="/tv-series" className="block hover:text-white">TV Series</a>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">Genres</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <a href="/movies?genre=action" className="block hover:text-white">Action</a>
              <a href="/movies?genre=comedy" className="block hover:text-white">Comedy</a>
              <a href="/movies?genre=drama" className="block hover:text-white">Drama</a>
              <a href="/movies?genre=horror" className="block hover:text-white">Horror</a>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">Info</h4>
            <div className="text-sm text-gray-400 space-y-1">
              <p>Contact: hello@boxo.app</p>
              <p className="text-xs text-gray-600 mt-4">Boxo does not host any files.</p>
            </div>
          </div>
        </div>
        <div className="border-t border-[#333333] mt-8 pt-6 text-center text-xs text-gray-600">
          &copy; {new Date().getFullYear()} Boxo. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
