import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ size = 'md', showText = true }) => {
  const boxSize =
    size === 'lg'
      ? 'w-14 h-14 rounded-2xl'
      : size === 'sm'
      ? 'w-7 h-7 rounded-lg'
      : 'w-9 h-9 rounded-xl';
  const iconSize = size === 'lg' ? 'w-8 h-8' : size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
  const textSize = size === 'lg' ? 'text-2xl' : size === 'sm' ? 'text-sm' : 'text-lg';

  return (
    <div className="flex items-center gap-3 select-none group">
      {/* Iridescent Sonic-Crest Emblem */}
      <div
        className={`${boxSize} relative bg-gradient-to-br from-[#10D9A0] via-[#38BDF8] to-[#C084FC] p-[1.5px] shadow-lg shadow-cyan-500/25 shrink-0`}
      >
        <div className="w-full h-full rounded-[inherit] bg-[#090D16] flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#10D9A0]/25 via-[#38BDF8]/15 to-[#C084FC]/30" />
          <svg viewBox="0 0 32 32" className={`${iconSize} relative z-10`} fill="none" aria-hidden="true">
            <defs>
              <linearGradient id="syrenGrad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#10D9A0" />
                <stop offset="50%" stopColor="#38BDF8" />
                <stop offset="100%" stopColor="#E879F9" />
              </linearGradient>
            </defs>
            {/* Sculpted Sonic Wave Crest + Center Star Spark */}
            <path
              d="M6 19.5C8.5 14 12.2 11 16 11C19.8 11 23.5 14 26 19.5"
              stroke="url(#syrenGrad)"
              strokeWidth="2.6"
              strokeLinecap="round"
            />
            <path
              d="M9.5 23C11.4 19.2 13.6 17.5 16 17.5C18.4 17.5 20.6 19.2 22.5 23"
              stroke="url(#syrenGrad)"
              strokeWidth="2.4"
              strokeLinecap="round"
              opacity="0.85"
            />
            <path
              d="M16 4.5L17.4 7.6L20.5 9L17.4 10.4L16 13.5L14.6 10.4L11.5 9L14.6 7.6L16 4.5Z"
              fill="url(#syrenGrad)"
            />
          </svg>
        </div>
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <span
            className={`${textSize} font-extrabold tracking-[0.22em] bg-gradient-to-r from-white via-[#A5F3FC] to-[#E879F9] bg-clip-text text-transparent`}
            style={{ fontFamily: "'Syne', 'Plus Jakarta Sans', sans-serif" }}
          >
            SYRĒN
          </span>
          {size !== 'sm' && (
            <span className="text-[9px] font-semibold tracking-[0.32em] text-spotify-subtext uppercase mt-0.5">
              HI-FI AUDIO
            </span>
          )}
        </div>
      )}
    </div>
  );
};
