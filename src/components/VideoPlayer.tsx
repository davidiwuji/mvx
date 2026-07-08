'use client';
import { useState, useRef, useEffect } from 'react';

interface Source { url: string; type: 'mp4' | 'm3u8' | 'embed' | 'youtube'; quality?: string; name?: string; }

export default function VideoPlayer({ sources, poster, title }: { sources: Source[]; poster?: string; title?: string }) {
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [showCtrl, setShowCtrl] = useState(true);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onTime = () => setProgress((v.currentTime / v.duration) * 100);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    v.addEventListener('timeupdate', onTime);
    v.addEventListener('play', onPlay);
    v.addEventListener('pause', onPause);
    return () => { v.removeEventListener('timeupdate', onTime); v.removeEventListener('play', onPlay); v.removeEventListener('pause', onPause); };
  }, [idx]);

  const showTemp = () => {
    setShowCtrl(true);
    clearTimeout(timerRef.current);
    if (playing) timerRef.current = setTimeout(() => setShowCtrl(false), 3000);
  };

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play().catch(() => {}); } else { v.pause(); }
  };

  const toggleFs = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) { containerRef.current.requestFullscreen().catch(() => {}); }
    else { document.exitFullscreen().catch(() => {}); }
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const v = videoRef.current;
    if (!v) return;
    const rect = e.currentTarget.getBoundingClientRect();
    v.currentTime = ((e.clientX - rect.left) / rect.width) * v.duration;
  };

  const fmt = (s: number) => { if (!s || isNaN(s)) return '0:00'; return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`; };

  if (!sources?.length) return (
    <div className="aspect-video bg-[#222222] rounded-xl flex items-center justify-center">
      <p className="text-gray-500 text-sm">No video sources available</p>
    </div>
  );

  const src = sources[idx];

  if (src.type === 'embed' || src.type === 'youtube') return (
    <div className="aspect-video bg-black rounded-xl overflow-hidden">
      <iframe
        src={src.url}
        className="w-full h-full"
        allowFullScreen
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        title={title || 'Player'}
        referrerPolicy="origin"
        loading="eager"
      />
    </div>
  );

  return (
    <div ref={containerRef} className="relative aspect-video bg-black rounded-xl overflow-hidden group cursor-pointer"
      onMouseMove={showTemp} onMouseEnter={() => setShowCtrl(true)} onMouseLeave={() => playing && setShowCtrl(false)}>

      <video ref={videoRef} src={src.url} poster={poster} className="w-full h-full object-contain" onClick={togglePlay} playsInline preload="metadata" />

      {!playing && (
        <div className="absolute inset-0 flex items-center justify-center" onClick={togglePlay}>
          <div className="w-16 h-16 rounded-full bg-[#FF6B00]/90 flex items-center justify-center hover:bg-[#FF6B00] transition-all hover:scale-110">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><polygon points="6,3 20,12 6,21"/></svg>
          </div>
        </div>
      )}

      <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-14 pb-3 px-4 transition-opacity duration-300 ${showCtrl ? 'opacity-100' : 'opacity-0'}`}>
        <div className="w-full h-1 bg-white/20 rounded-full mb-3 cursor-pointer group/progress" onClick={seek}>
          <div className="h-full bg-[#FF6B00] rounded-full relative" style={{ width: progress + '%' }}>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover/progress:opacity-100" />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={togglePlay} className="text-white hover:text-[#FF6B00]">
              {playing ?
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg> :
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="6,3 20,12 6,21"/></svg>}
            </button>
            <div className="flex items-center gap-1.5">
              <button onClick={() => { setVolume(v => v === 0 ? 1 : 0); if (videoRef.current) videoRef.current.volume = volume === 0 ? 1 : 0; }} className="text-white hover:text-[#FF6B00]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {volume === 0 ? <><path d="M11 5 6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></> : <><path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></>}
                </svg>
              </button>
              <input type="range" min="0" max="1" step="0.05" value={volume} onChange={e => { const v = parseFloat(e.target.value); setVolume(v); if (videoRef.current) videoRef.current.volume = v; }} className="w-16 h-1 accent-[#FF6B00]" />
            </div>
            <span className="text-xs text-gray-400">{fmt(videoRef.current?.currentTime || 0)} / {fmt(videoRef.current?.duration || 0)}</span>
          </div>
          <div className="flex items-center gap-3">
            {sources.length > 1 && (
              <div className="flex gap-1">
                {sources.map((s, i) => (
                  <button key={i} onClick={() => setIdx(i)}
                    className={`text-xs px-2 py-0.5 rounded ${i === idx ? 'bg-[#FF6B00] text-white' : 'bg-white/10 text-gray-300'}`}>
                    {s.quality || s.name || `#${i + 1}`}
                  </button>
                ))}
              </div>
            )}
            <button onClick={toggleFs} className="text-white hover:text-[#FF6B00]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
