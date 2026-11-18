import React from 'react';
import { X, Trash2, Play, Music } from 'lucide-react';
import { usePlayerStore } from '../stores/usePlayerStore';
import { formatDuration } from '../utils/formatters';

export const QueuePanel: React.FC = () => {
  const {
    currentSong,
    queue,
    isQueueOpen,
    toggleQueue,
    playSong,
    removeFromQueue,
    clearQueue,
    isPlaying,
  } = usePlayerStore();

  if (!isQueueOpen) return null;

  return (
    <div className="absolute inset-0 z-30 bg-spotify-dark/95 backdrop-blur-xl p-6 md:p-10 overflow-y-auto flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
        <h2 className="text-2xl font-extrabold text-white">Playback Queue</h2>
        <div className="flex items-center gap-3">
          {queue.length > 0 && (
            <button
              onClick={clearQueue}
              className="text-xs font-bold text-spotify-subtext hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
            >
              <Trash2 size={14} />
              <span>Clear queue</span>
            </button>
          )}
          <button
            onClick={toggleQueue}
            className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="max-w-4xl w-full mx-auto py-6 space-y-6">
        {/* Now Playing Section */}
        {currentSong && (
          <div>
            <h3 className="text-xs font-bold text-spotify-subtext uppercase tracking-wider mb-3">
              Now Playing
            </h3>
            <div className="flex items-center justify-between p-3 rounded-lg bg-white/10 border border-white/5 group">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={currentSong.coverUrl}
                  alt={currentSong.title}
                  className="w-12 h-12 rounded object-cover shadow"
                />
                <div className="min-w-0">
                  <p className="text-sm font-bold text-spotify-green truncate">
                    {currentSong.title}
                  </p>
                  <p className="text-xs text-white/70 truncate">{currentSong.artist}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {isPlaying && (
                  <div className="flex items-end gap-1 h-4">
                    <span className="equalizer-bar" />
                    <span className="equalizer-bar" />
                    <span className="equalizer-bar" />
                  </div>
                )}
                <span className="text-xs text-spotify-subtext">
                  {formatDuration(currentSong.duration)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Next Up Section */}
        <div>
          <h3 className="text-xs font-bold text-spotify-subtext uppercase tracking-wider mb-3">
            Next Up {queue.length > 0 ? `(${queue.length})` : ''}
          </h3>

          {queue.length === 0 ? (
            <div className="text-center py-12 text-spotify-subtext text-sm">
              <Music size={36} className="mx-auto mb-2 opacity-30" />
              <p>Your queue is empty.</p>
              <p className="text-xs mt-1">Add tracks to your queue from any playlist or album.</p>
            </div>
          ) : (
            <div className="space-y-1">
              {queue.map((song, index) => (
                <div
                  key={`${song.id}-${index}`}
                  className="flex items-center justify-between p-2.5 rounded-lg hover:bg-white/5 group transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs text-spotify-subtext w-4 text-center">
                      {index + 1}
                    </span>
                    <img
                      src={song.coverUrl}
                      alt={song.title}
                      className="w-10 h-10 rounded object-cover shadow"
                    />
                    <div className="min-w-0">
                      <p
                        onClick={() => playSong(song, queue.slice(index + 1))}
                        className="text-sm font-medium text-white hover:text-spotify-green cursor-pointer truncate transition-colors"
                      >
                        {song.title}
                      </p>
                      <p className="text-xs text-spotify-subtext truncate">{song.artist}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => playSong(song, queue.slice(index + 1))}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-full hover:bg-white/10 text-white transition-opacity"
                      title="Play track"
                    >
                      <Play size={16} fill="white" />
                    </button>
                    <button
                      onClick={() => removeFromQueue(index)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-full hover:bg-white/10 text-rose-400 transition-opacity"
                      title="Remove from queue"
                    >
                      <Trash2 size={16} />
                    </button>
                    <span className="text-xs text-spotify-subtext">
                      {formatDuration(song.duration)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
