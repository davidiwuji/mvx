'use client';

export default function DetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen pt-24 flex items-center justify-center bg-[#0D0D0D] text-white px-4">
      <div className="bg-[#1A1A1A] rounded-2xl p-8 max-w-md text-center border border-[#333333]">
        <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>
          </svg>
        </div>
        <h2 className="text-xl font-bold mb-2">Failed to load content</h2>
        <p className="text-gray-400 text-sm mb-6">
          {error.message || 'Could not load movie details'}
        </p>
        <button
          onClick={reset}
          className="bg-[#FF6B00] hover:bg-[#E65A00] text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
