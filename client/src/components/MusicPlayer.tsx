import React, { useEffect, useRef, useState } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Volume2,
  Volume1,
  VolumeX,
  Heart,
  Maximize2,
  Mic2,
  ListMusic,
  Tv,
  Info,
  PlusCircle,
  AlertCircle
} from 'lucide-react';
import { usePlayerStore } from '../stores/usePlayerStore';
import { useLibraryStore } from '../stores/useLibraryStore';
import { formatDuration } from '../utils/formatters';
import { audioSynthesizer } from '../utils/audioSynthesizer';

export const MusicPlayer: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isAudioLoaded, setIsAudioLoaded] = useState(false);
  const [usingSynthesizer, setUsingSynthesizer] = useState(false);

  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffle,
    repeatMode,
    isLyricsOpen,
    isQueueOpen,
    isRightPanelOpen,
    togglePlay,
    pause,
    resume,
    nextSong,
    prevSong,
    seek,
    setVolume,
    toggleMute,
    toggleShuffle,
    cycleRepeatMode,
    toggleLyrics,
    toggleQueue,
    toggleRightPanel,
    toggleFullscreen,
    setCurrentTime,
    setDuration,
    setPlaybackError,
    playbackError,
  } = usePlayerStore();

  const { isSongLiked, toggleLikeSong, userPlaylists, addSongToPlaylist } = useLibraryStore();
  const [showAddToPlaylist, setShowAddToPlaylist] = useState(false);

  // Keyboard shortcuts (Space, Arrow keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = (document.activeElement?.tagName || '').toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea') return;

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        seek(Math.min((duration || 100), currentTime + 5));
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        seek(Math.max(0, currentTime - 5));
      } else if (e.code === 'ArrowUp') {
        e.preventDefault();
        setVolume(Math.min(1, volume + 0.05));
      } else if (e.code === 'ArrowDown') {
        e.preventDefault();
        setVolume(Math.max(0, volume - 0.05));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, seek, setVolume, currentTime, duration, volume]);

  // Handle Play/Pause and source change
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;

    if (audio.src !== currentSong.audioUrl) {
      audio.src = currentSong.audioUrl;
      audio.load();
      setUsingSynthesizer(false);
      setPlaybackError(null);
    }

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('[Audio Player] Native stream playback blocked or errored, falling back to Web Audio Synthesizer:', err);
          // Seamless Web Audio Synthesizer fallback
          setUsingSynthesizer(true);
          audioSynthesizer.setVolume(isMuted ? 0 : volume);
          audioSynthesizer.start(currentSong.id, currentSong.genre);
        });
      }
    } else {
      audio.pause();
      if (usingSynthesizer) {
        audioSynthesizer.stop();
      }
    }
  }, [currentSong, isPlaying]);

  // Handle Volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
    if (usingSynthesizer) {
      audioSynthesizer.setVolume(isMuted ? 0 : volume);
    }
  }, [volume, isMuted, usingSynthesizer]);

  // Handle Audio events
  const handleTimeUpdate = () => {
    if (audioRef.current && !usingSynthesizer) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || currentSong?.duration || 180);
      setIsAudioLoaded(true);
    }
  };

  const handleEnded = () => {
    if (repeatMode === 'one') {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else {
      nextSong();
    }
  };

  const handleError = () => {
    console.warn('[Audio Player] Audio loading error, switching to Web Audio Synthesizer fallback');
    setUsingSynthesizer(true);
    if (isPlaying && currentSong) {
      audioSynthesizer.setVolume(isMuted ? 0 : volume);
      audioSynthesizer.start(currentSong.id, currentSong.genre);
    }
  };

  // Synthesizer timer advance if in fallback mode
  useEffect(() => {
    if (!usingSynthesizer || !isPlaying) return;
    const interval = setInterval(() => {
      const { currentTime, duration, nextSong } = usePlayerStore.getState();
      const newTime = currentTime + 1;
      if (newTime >= duration) {
        nextSong();
      } else {
        setCurrentTime(newTime);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [usingSynthesizer, isPlaying, setCurrentTime]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      audioSynthesizer.stop();
    };
  }, []);

  if (!currentSong) return null;

  const isLiked = isSongLiked(currentSong.id);
  const progressRatio = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <footer className="h-20 md:h-[88px] bg-[#0D111A]/95 backdrop-blur-xl border-t border-white/[0.08] px-4 md:px-6 flex items-center justify-between z-40 select-none relative shadow-[0_-10px_30px_rgba(0,0,0,0.45)]">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onError={handleError}
      />

      {/* LEFT: Currently Playing Track Info */}
      <div className="flex items-center gap-3 w-1/4 min-w-[180px] max-w-[320px]">
        <div
          onClick={toggleRightPanel}
          className="relative group w-14 h-14 rounded-xl overflow-hidden shrink-0 cursor-pointer shadow-md ring-1 ring-white/10"
          title="Open track info"
        >
          <img
            src={currentSong.coverUrl}
            alt={currentSong.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <Info size={18} className="text-white" />
          </div>
        </div>

        <div className="min-w-0 pr-1">
          <div className="flex items-center gap-1.5">
            <p
              onClick={toggleRightPanel}
              className="text-xs md:text-sm font-semibold text-white hover:underline cursor-pointer truncate"
              title={currentSong.title}
            >
              {currentSong.title}
            </p>
            {usingSynthesizer && (
              <span
                className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-spotify-green/20 text-spotify-green shrink-0"
                title="Synthesizer engine active"
              >
                HQ Synth
              </span>
            )}
          </div>
          <p
            onClick={toggleRightPanel}
            className="text-[11px] md:text-xs text-spotify-subtext hover:underline cursor-pointer truncate"
            title={currentSong.artist}
          >
            {currentSong.artist}
          </p>
        </div>

        <div className="flex items-center gap-2 relative">
          <button
            onClick={() => toggleLikeSong(currentSong.id)}
            className={`transition-transform hover:scale-110 ${
              isLiked ? 'text-spotify-green' : 'text-spotify-subtext hover:text-white'
            }`}
            title={isLiked ? 'Remove from Liked Songs' : 'Save to Liked Songs'}
          >
            <Heart size={18} className={isLiked ? 'fill-spotify-green' : ''} />
          </button>

          {/* Add to playlist button */}
          <button
            onClick={() => setShowAddToPlaylist(!showAddToPlaylist)}
            className="text-spotify-subtext hover:text-white transition-colors"
            title="Add to playlist"
          >
            <PlusCircle size={18} />
          </button>

          {/* Add to Playlist Popover */}
          {showAddToPlaylist && (
            <div
              className="absolute left-0 bottom-8 w-48 bg-[#282828] rounded-lg shadow-2xl p-2 z-50 border border-white/10"
              onMouseLeave={() => setShowAddToPlaylist(false)}
            >
              <p className="text-[11px] font-bold text-spotify-subtext px-2 py-1 uppercase tracking-wider">
                Add to Playlist
              </p>
              <div className="max-h-40 overflow-y-auto space-y-1">
                {userPlaylists.map((pl) => (
                  <button
                    key={pl.id}
                    onClick={() => {
                      addSongToPlaylist(pl.id, currentSong);
                      setShowAddToPlaylist(false);
                    }}
                    className="w-full text-left px-2 py-1.5 rounded text-xs text-white hover:bg-white/10 truncate"
                  >
                    {pl.title}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CENTER: Player Controls & Progress Bar */}
      <div className="flex flex-col items-center gap-1.5 w-2/4 max-w-[720px]">
        {/* Buttons Row */}
        <div className="flex items-center gap-4 md:gap-6">
          <button
            onClick={toggleShuffle}
            className={`transition-colors relative ${
              isShuffle ? 'text-spotify-green' : 'text-spotify-subtext hover:text-white'
            }`}
            title={isShuffle ? 'Disable shuffle' : 'Enable shuffle'}
          >
            <Shuffle size={18} />
            {isShuffle && (
              <span className="w-1 h-1 bg-spotify-green rounded-full absolute -bottom-1.5 left-1/2 -translate-x-1/2" />
            )}
          </button>

          <button
            onClick={prevSong}
            className="text-spotify-subtext hover:text-white transition-colors"
            title="Previous (or restart)"
          >
            <SkipBack size={20} fill="currentColor" />
          </button>

          <button
            onClick={togglePlay}
            className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-[#10D9A0] to-[#22D3EE] text-[#061214] flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-teal-500/25"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause size={18} fill="#061214" />
            ) : (
              <Play size={18} fill="#061214" className="ml-0.5" />
            )}
          </button>

          <button
            onClick={nextSong}
            className="text-spotify-subtext hover:text-white transition-colors"
            title="Next"
          >
            <SkipForward size={20} fill="currentColor" />
          </button>

          <button
            onClick={cycleRepeatMode}
            className={`transition-colors relative ${
              repeatMode !== 'off' ? 'text-spotify-green' : 'text-spotify-subtext hover:text-white'
            }`}
            title={`Repeat: ${repeatMode}`}
          >
            <Repeat size={18} />
            {repeatMode !== 'off' && (
              <span className="w-1 h-1 bg-spotify-green rounded-full absolute -bottom-1.5 left-1/2 -translate-x-1/2" />
            )}
            {repeatMode === 'one' && (
              <span className="absolute -top-1.5 -right-2 text-[9px] font-black">1</span>
            )}
          </button>
        </div>

        {/* Progress Bar & Timers */}
        <div className="w-full flex items-center gap-2 text-[11px] text-spotify-subtext font-mono">
          <span className="w-10 text-right">{formatDuration(currentTime)}</span>
          <div className="flex-1 relative group flex items-center">
            {/* Background Track */}
            <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white group-hover:bg-spotify-green transition-colors"
                style={{ width: `${progressRatio}%` }}
              />
            </div>
            {/* Transparent native range slider overlay */}
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={(e) => {
                const newTime = Number(e.target.value);
                seek(newTime);
                if (audioRef.current && !usingSynthesizer) {
                  audioRef.current.currentTime = newTime;
                }
              }}
              className="absolute inset-0 w-full opacity-0 cursor-pointer h-4 -top-1.5"
            />
          </div>
          <span className="w-10">{formatDuration(duration)}</span>
        </div>
      </div>

      {/* RIGHT: Volume, Lyrics, Queue & Fullscreen */}
      <div className="flex items-center justify-end gap-3 w-1/4 min-w-[180px] max-w-[280px]">
        {/* Now Playing / About Artist Panel Toggle */}
        <button
          onClick={toggleRightPanel}
          className={`p-1.5 rounded-full transition-colors ${
            isRightPanelOpen ? 'text-spotify-green bg-white/10' : 'text-spotify-subtext hover:text-white'
          }`}
          title="Now Playing view"
        >
          <Info size={18} />
        </button>

        {/* Lyrics Toggle */}
        <button
          onClick={toggleLyrics}
          className={`p-1.5 rounded-full transition-colors ${
            isLyricsOpen ? 'text-spotify-green bg-white/10' : 'text-spotify-subtext hover:text-white'
          }`}
          title="Lyrics"
        >
          <Mic2 size={18} />
        </button>

        {/* Queue Toggle */}
        <button
          onClick={toggleQueue}
          className={`p-1.5 rounded-full transition-colors ${
            isQueueOpen ? 'text-spotify-green bg-white/10' : 'text-spotify-subtext hover:text-white'
          }`}
          title="Queue"
        >
          <ListMusic size={18} />
        </button>

        {/* Volume Controls */}
        <div className="flex items-center gap-1.5 group">
          <button
            onClick={toggleMute}
            className="text-spotify-subtext hover:text-white transition-colors"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted || volume === 0 ? (
              <VolumeX size={18} />
            ) : volume < 0.5 ? (
              <Volume1 size={18} />
            ) : (
              <Volume2 size={18} />
            )}
          </button>
          <div className="w-16 md:w-24 relative flex items-center">
            <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white group-hover:bg-spotify-green transition-colors"
                style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
              />
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="absolute inset-0 w-full opacity-0 cursor-pointer h-4 -top-1.5"
            />
          </div>
        </div>

        {/* Fullscreen Button */}
        <button
          onClick={toggleFullscreen}
          className="text-spotify-subtext hover:text-white transition-colors"
          title="Fullscreen Mode"
        >
          <Maximize2 size={17} />
        </button>
      </div>
    </footer>
  );
};
