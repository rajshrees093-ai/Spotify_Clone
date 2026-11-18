import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ size = 'md', showText = true }) => {
  const boxSize =
    size === 'lg' ? 'w-12 h-12 rounded-2xl' : size === 'sm' ? 'w-7 h-7 rounded-lg' : 'w-9 h-9 rounded-xl';
  const iconSize = size === 'lg' ? 'w-7 h-7' : size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
  const textSize = size === 'lg' ? 'text-2xl' : size === 'sm' ? 'text-base' : 'text-lg';

  return (
    <div className="flex items-center gap-2.5 select-none">
      <div
        className={`${boxSize} bg-gradient-to-br from-[#10D9A0] via-[#14B8A6] to-[#22D3EE] flex items-center justify-center shadow-lg shadow-teal-500/25 ring-1 ring-white/20 shrink-0`}
      >
        {/* Original PulseWave Sound-Pulse Emblem */}
        <svg viewBox="0 0 24 24" className={`${iconSize}`} fill="none" aria-hidden="true">
          <rect x="2.5" y="10" width="2.6" height="6" rx="1.3" fill="#061214" />
          <rect x="6.7" y="6" width="2.6" height="12" rx="1.3" fill="#061214" />
          <rect x="10.9" y="3" width="2.6" height="18" rx="1.3" fill="#061214" />
          <rect x="15.1" y="7" width="2.6" height="10" rx="1.3" fill="#061214" />
          <rect x="19.3" y="10.5" width="2.6" height="5" rx="1.3" fill="#061214" />
        </svg>
      </div>

      {showText && (
        <span className={`${textSize} font-extrabold tracking-tight text-white flex items-center`}>
          Pulse
          <span className="bg-gradient-to-r from-[#10D9A0] to-[#22D3EE] bg-clip-text text-transparent">
            Wave
          </span>
        </span>
      )}
    </div>
  );
};
