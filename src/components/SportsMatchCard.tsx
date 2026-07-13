'use client';

interface TeamInfo {
  name: string;
  badge: string | null;
  badgeUrl: string | null;
}

interface SourceInfo {
  source: string;
  id: string;
}

interface MatchData {
  id: string;
  title: string;
  category: string;
  date: number;
  popular?: boolean;
  teams: {
    home: TeamInfo;
    away: TeamInfo;
  };
  sources: SourceInfo[];
  poster?: string;
  posterUrl?: string | null;
}

const CATEGORY_EMOJIS: Record<string, string> = {
  football: '⚽',
  basketball: '🏀',
  'american-football': '🏈',
  baseball: '⚾',
  cricket: '🏏',
  tennis: '🎾',
  golf: '⛳',
  fight: '🥊',
  rugby: '🏉',
  darts: '🎯',
  'motor-sports': '🏎️',
  other: '🏆',
};

const CATEGORY_COLORS: Record<string, string> = {
  football: 'bg-green-600/20 text-green-400 border-green-600/30',
  basketball: 'bg-orange-600/20 text-orange-400 border-orange-600/30',
  'american-football': 'bg-brown-600/20 text-brown-400 border-brown-600/30',
  baseball: 'bg-red-600/20 text-red-400 border-red-600/30',
  cricket: 'bg-blue-600/20 text-blue-400 border-blue-600/30',
  tennis: 'bg-yellow-600/20 text-yellow-400 border-yellow-600/30',
  golf: 'bg-emerald-600/20 text-emerald-400 border-emerald-600/30',
  fight: 'bg-red-700/20 text-red-400 border-red-700/30',
  rugby: 'bg-indigo-600/20 text-indigo-400 border-indigo-600/30',
  darts: 'bg-cyan-600/20 text-cyan-400 border-cyan-600/30',
  'motor-sports': 'bg-gray-600/20 text-gray-400 border-gray-600/30',
  other: 'bg-purple-600/20 text-purple-400 border-purple-600/30',
};

function formatMatchDate(ts: number): string {
  const d = new Date(ts);
  const now = new Date();
  const today = now.toDateString();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const time = d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  if (d.toDateString() === today) return `Today ${time}`;
  if (d.toDateString() === tomorrow.toDateString()) return `Tomorrow ${time}`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ` ${time}`;
}

export default function SportsMatchCard({ match }: { match: MatchData }) {
  const emoji = CATEGORY_EMOJIS[match.category] || '🏆';
  const colorClass = CATEGORY_COLORS[match.category] || 'bg-purple-600/20 text-purple-400';

  return (
    <div className="bg-[#1A1A1A] border border-[#222222] hover:border-[#FF6B00]/30 rounded-xl p-4 transition-all group">
      {/* Category badge */}
      <div className="flex items-center justify-between mb-3">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider border ${colorClass}`}>
          <span>{emoji}</span>
          <span>{match.category}</span>
        </span>
        {match.popular && (
          <span className="text-[10px] font-semibold text-[#FF6B00] bg-[#FF6B00]/10 px-2 py-0.5 rounded-full">
            LIVE
          </span>
        )}
      </div>

      {/* Teams */}
      <div className="flex items-center gap-3 mb-3">
        {/* Home team */}
        <div className="flex-1 text-right">
          <p className="text-sm font-medium text-white truncate">{match.teams?.home?.name || 'TBD'}</p>
        </div>

        <div className="flex items-center gap-2">
          {match.teams?.home?.badgeUrl ? (
            <img src={match.teams.home.badgeUrl} alt="" className="w-8 h-8 object-contain rounded-full bg-[#0D0D0D]"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#222222] flex items-center justify-center text-xs text-gray-500">
              {match.teams?.home?.name?.charAt(0) || '?'}
            </div>
          )}

          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">VS</span>

          {match.teams?.away?.badgeUrl ? (
            <img src={match.teams.away.badgeUrl} alt="" className="w-8 h-8 object-contain rounded-full bg-[#0D0D0D]"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#222222] flex items-center justify-center text-xs text-gray-500">
              {match.teams?.away?.name?.charAt(0) || '?'}
            </div>
          )}
        </div>

        {/* Away team */}
        <div className="flex-1 text-left">
          <p className="text-sm font-medium text-white truncate">{match.teams?.away?.name || 'TBD'}</p>
        </div>
      </div>

      {/* Match info */}
      <div className="flex items-center justify-between text-[11px] text-gray-500">
        <span>{formatMatchDate(match.date)}</span>
        {match.sources && match.sources.length > 0 && (
          <span className="flex items-center gap-1 text-[#FF6B00] group-hover:text-white transition-colors">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="6,3 20,12 6,21" />
            </svg>
            {match.sources.length} source{match.sources.length > 1 ? 's' : ''}
          </span>
        )}
      </div>
    </div>
  );
}
