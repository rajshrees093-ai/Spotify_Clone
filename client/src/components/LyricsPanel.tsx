import React from 'react';
import { X, Mic2 } from 'lucide-react';
import { usePlayerStore } from '../stores/usePlayerStore';

export const LyricsPanel: React.FC = () => {
  const { currentSong, isLyricsOpen, toggleLyrics, currentTime } = usePlayerStore();

  if (!isLyricsOpen || !currentSong) return null;

  const lines = currentSong.lyrics
    ? currentSong.lyrics.split('\n').filter((l) => l.trim().length > 0)
    : ['No lyrics available for this track.'];

  // Calculate simulated line highlighting based on playback percentage
  const progressRatio = currentSong.duration > 0 ? currentTime / currentSong.duration : 0;
  const activeLineIndex = Math.min(lines.length - 1, Math.floor(progressRatio * lines.length));

  return (
    <div className="absolute inset-0 z-30 bg-gradient-to-b from-emerald-950 via-spotify-dark to-spotify-black p-8 md:p-14 overflow-y-auto flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-spotify-green/20 flex items-center justify-center text-spotify-green">
            <Mic2 size={22} />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">{currentSong.title}</h2>
            <p className="text-sm text-spotify-subtext">{currentSong.artist}</p>
          </div>
        </div>

        <button
          onClick={toggleLyrics}
          className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors"
          title="Close lyrics"
        >
          <X size={22} />
        </button>
      </div>

      {/* Lyrics Body */}
      <div className="flex-1 max-w-3xl mx-auto py-12 space-y-6">
        {lines.map((line, index) => {
          const isHeader = line.startsWith('[');
          const isActive = index === activeLineIndex;

          if (isHeader) {
            return (
              <p
                key={index}
                className="text-sm font-bold text-spotify-green/80 uppercase tracking-widest pt-4"
              >
                {line}
              </p>
            );
          }

          return (
            <p
              key={index}
              className={`text-2xl md:text-3xl font-extrabold transition-all duration-300 leading-snug cursor-pointer ${
                isActive
                  ? 'text-white scale-105 origin-left drop-shadow-md'
                  : 'text-white/40 hover:text-white/70'
              }`}
            >
              {line}
            </p>
          );
        })}
      </div>
    </div>
  );
};
