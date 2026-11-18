import React from 'react';
import {
  Minimize2,
  Heart,
  Shuffle,
  SkipBack,
  Play,
  Pause,
  SkipForward,
  Repeat,
  Volume2,
  VolumeX,
  Mic2,
  ListMusic
} from 'lucide-react';
import { usePlayerStore } from '../stores/usePlayerStore';
import { useLibraryStore } from '../stores/useLibraryStore';
import { formatDuration } from '../utils/formatters';

export const FullscreenPlayer: React.FC = () => {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffle,
    repeatMode,
    isFullscreen,
    toggleFullscreen,
    togglePlay,
    nextSong,
    prevSong,
    seek,
    setVolume,
    toggleMute,
    toggleShuffle,
    cycleRepeatMode,
    toggleLyrics,
    toggleQueue
  } = usePlayerStore();

  const { isSongLiked, toggleLikeSong } = useLibraryStore();

  if (!isFullscreen || !currentSong) return null;

  const isLiked = isSongLiked(currentSong.id);
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-b from-stone-900 via-[#121212] to-black flex flex-col justify-between p-6 md:p-12 select-none">
      {/* Top Bar */}
      <div className="flex items-center justify-between text-white">
        <div>
          <span className="text-xs font-bold text-spotify-subtext uppercase tracking-widest">
            Playing From Album
          </span>
          <h2 className="text-lg md:text-xl font-bold truncate max-w-md">{currentSong.album}</h2>
        </div>

        <button
          onClick={toggleFullscreen}
          className="p-3 rounded-full bg-black/40 hover:bg-black/80 hover:scale-105 transition-all text-white/80 hover:text-white"
          title="Exit Fullscreen"
        >
          <Minimize2 size={24} />
        </button>
      </div>

      {/* Center Artwork & Song Info (Screenshot 3 layout!) */}
      <div className="flex flex-col items-center justify-center my-auto space-y-8">
        <div className="relative group max-w-[420px] w-full aspect-square rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-white/5">
          <img
            src={currentSong.coverUrl}
            alt={currentSong.title}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
          />
        </div>

        <div className="text-center space-y-2 max-w-lg">
          <div className="flex items-center justify-center gap-4">
            <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight truncate">
              {currentSong.title}
            </h1>
            <button
              onClick={() => toggleLikeSong(currentSong.id)}
              className="text-spotify-subtext hover:text-white transition-colors"
            >
              <Heart
                size={26}
                className={isLiked ? 'fill-spotify-green text-spotify-green' : ''}
              />
            </button>
          </div>
          <p className="text-base md:text-lg text-spotify-subtext font-medium">{currentSong.artist}</p>
        </div>
      </div>

      {/* Bottom Controls Bar */}
      <div className="max-w-4xl w-full mx-auto space-y-4">
        {/* Scrubber */}
        <div className="flex items-center gap-3 text-xs text-spotify-subtext font-medium">
          <span className="w-10 text-right">{formatDuration(currentTime)}</span>
          <div className="flex-1 relative group py-2">
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={(e) => seek(Number(e.target.value))}
              className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <span className="w-10">{formatDuration(duration)}</span>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-spotify-subtext">
            <button
              onClick={toggleShuffle}
              className={`hover:text-white transition-colors ${isShuffle ? 'text-spotify-green' : ''}`}
            >
              <Shuffle size={20} />
            </button>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={prevSong}
              className="text-spotify-subtext hover:text-white transition-colors"
            >
              <SkipBack size={26} />
            </button>
            <button
              onClick={togglePlay}
              className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform shadow-xl"
            >
              {isPlaying ? <Pause size={28} fill="black" /> : <Play size={28} fill="black" className="ml-1" />}
            </button>
            <button
              onClick={nextSong}
              className="text-spotify-subtext hover:text-white transition-colors"
            >
              <SkipForward size={26} />
            </button>
          </div>

          <div className="flex items-center gap-4 text-spotify-subtext">
            <button
              onClick={cycleRepeatMode}
              className={`hover:text-white transition-colors relative ${repeatMode !== 'off' ? 'text-spotify-green' : ''}`}
            >
              <Repeat size={20} />
              {repeatMode === 'one' && (
                <span className="absolute -top-1 -right-2 text-[10px] font-bold">1</span>
              )}
            </button>

            <button
              onClick={toggleLyrics}
              className="hover:text-white transition-colors"
              title="Lyrics"
            >
              <Mic2 size={20} />
            </button>

            <button
              onClick={toggleQueue}
              className="hover:text-white transition-colors"
              title="Queue"
            >
              <ListMusic size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
