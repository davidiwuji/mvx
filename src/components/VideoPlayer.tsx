'use client';

import React, { useState, useRef } from 'react';
import type { StreamSource } from '@/lib/types';

interface VideoPlayerProps {
  sources: StreamSource[];
  activeServerIndex: number;
  onSelectServer: (index: number) => void;
  trailerUrl?: string | null;
  mode: 'stream' | 'trailer';
  onToggleMode: (mode: 'stream' | 'trailer') => void;
  title?: string;
}

export default function VideoPlayer({
  sources,
  activeServerIndex,
  onSelectServer,
  trailerUrl,
  mode,
  onToggleMode,
  title,
}: VideoPlayerProps) {
  const [isTheater, setIsTheater] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const playerContainerRef = useRef<HTMLDivElement>(null);

  const activeSource = sources[activeServerIndex] || sources[0];
  const currentUrl = mode === 'trailer' && trailerUrl ? trailerUrl : activeSource?.url;

  const handleReload = () => {
    setIframeKey(k => k + 1);
  };

  const handleFullscreen = () => {
    if (!playerContainerRef.current) return;
    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div
      ref={playerContainerRef}
      className={`relative w-full rounded-2xl overflow-hidden bg-black ring-1 ring-white/10 shadow-2xl transition-all duration-300 ${
        isTheater ? 'fixed inset-0 z-50 rounded-none bg-black flex flex-col justify-center' : ''
      }`}
    >
      {/* Top Player Control Bar */}
      <div className="bg-[#0e111a]/95 backdrop-blur-md px-4 py-2.5 flex items-center justify-between border-b border-white/10 z-10 text-xs">
        {/* Stream vs Trailer Tabs */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onToggleMode('stream')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
              mode === 'stream'
                ? 'bg-[#FF6B00] text-white shadow-[0_0_12px_rgba(255,107,0,0.4)]'
                : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5,3 19,12 5,21" />
            </svg>
            <span>Watch Stream</span>
          </button>

          {trailerUrl && (
            <button
              onClick={() => onToggleMode('trailer')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                mode === 'trailer'
                  ? 'bg-red-600 text-white shadow-[0_0_12px_rgba(220,38,38,0.4)]'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
              </svg>
              <span>Official Trailer</span>
            </button>
          )}
        </div>

        {/* Player Tools: Reload, Theater Mode, Fullscreen */}
        <div className="flex items-center gap-1 text-gray-400">
          {/* Reload Server */}
          <button
            onClick={handleReload}
            className="p-1.5 rounded-lg hover:text-white hover:bg-white/10 transition-colors"
            title="Reload current stream"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
            </svg>
          </button>

          {/* Theater Mode */}
          <button
            onClick={() => setIsTheater(!isTheater)}
            className={`p-1.5 rounded-lg transition-colors ${
              isTheater ? 'text-[#FF6B00] bg-white/10' : 'hover:text-white hover:bg-white/10'
            }`}
            title={isTheater ? 'Exit Cinema Mode' : 'Cinema Mode'}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M7 15h10" />
            </svg>
          </button>

          {/* Fullscreen */}
          <button
            onClick={handleFullscreen}
            className="p-1.5 rounded-lg hover:text-white hover:bg-white/10 transition-colors"
            title="Toggle Fullscreen"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Video Embed Iframe Area */}
      <div className={`relative bg-black ${isTheater ? 'h-[90vh]' : 'aspect-video'}`}>
        {currentUrl ? (
          <iframe
            key={`${currentUrl}-${iframeKey}`}
            src={currentUrl}
            className="w-full h-full border-0"
            allowFullScreen
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            title={title || 'MVX Video Player'}
            referrerPolicy="origin"
            loading="eager"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 gap-3">
            <svg className="w-12 h-12 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" />
              <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
            </svg>
            <p className="text-sm font-medium">No streaming source available for this title</p>
          </div>
        )}
      </div>

      {/* Server Selection Pills (Shown during stream mode) */}
      {mode === 'stream' && sources.length > 1 && (
        <div className="bg-[#0b0d14] px-4 py-3 border-t border-white/5 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400 mr-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Server:
          </span>
          {sources.map((s, idx) => {
            const isSelected = idx === activeServerIndex;
            return (
              <button
                key={idx}
                onClick={() => onSelectServer(idx)}
                className={`text-xs px-3 py-1 rounded-full font-semibold transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#FF6B00] to-[#FF8A00] text-white shadow-[0_0_12px_rgba(255,107,0,0.4)]'
                    : 'bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 border border-white/10'
                }`}
              >
                <span>{s.name || `Server ${idx + 1}`}</span>
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
