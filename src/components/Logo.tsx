import React from 'react';
import Link from 'next/link';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export default function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2.5 group cursor-pointer select-none transition-transform duration-300 hover:scale-[1.02] ${className}`}
      aria-label="MVX Home"
    >
      {/* Glowing Cinema Play Icon */}
      <div className={`relative ${iconSizes[size]} flex items-center justify-center rounded-xl bg-gradient-to-br from-[#1C1F2E] to-[#0D0F17] p-1.5 ring-1 ring-white/15 shadow-[0_0_20px_rgba(255,107,0,0.25)] group-hover:shadow-[0_0_25px_rgba(255,107,0,0.5)] group-hover:ring-[#FF6B00]/50 transition-all duration-300`}>
        <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
          <defs>
            <linearGradient id="logo-glow-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF8A00" />
              <stop offset="100%" stopColor="#FF3D00" />
            </linearGradient>
          </defs>
          <path
            d="M13 10L31 20L13 30V10Z"
            fill="url(#logo-glow-grad)"
            className="drop-shadow-[0_2px_8px_rgba(255,107,0,0.6)]"
          />
          <circle cx="30" cy="11" r="2.5" fill="#FFA726" />
        </svg>
      </div>

      {showText && (
        <div className="flex items-center">
          <span className={`font-black tracking-tight font-sans text-white ${textSizes[size]}`}>
            MV<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B00] via-[#FF8A00] to-[#FFA726]">X</span>
          </span>
          <span className="ml-1 px-1.5 py-0.2 text-[9px] font-extrabold uppercase tracking-widest text-[#FF8A00] bg-[#FF6B00]/10 border border-[#FF6B00]/25 rounded-md hidden sm:inline-block">
            Cinema
          </span>
        </div>
      )}
    </Link>
  );
}
