import React, { useState } from 'react';
import { Play, Pause, Heart, MoreHorizontal, Plus, ListPlus, User } from 'lucide-react';
import { Song } from '../types';
import { usePlayerStore } from '../stores/usePlayerStore';
import { useLibraryStore } from '../stores/useLibraryStore';
import { formatDuration, formatTimeAgo } from '../utils/formatters';
import { useNavigate } from 'react-router-dom';

interface SongRowProps {
  song: Song;
  index: number;
  playlistContext?: Song[];
  showAlbum?: boolean;
  showDateAdded?: boolean;
}

export const SongRow: React.FC<SongRowProps> = ({
  song,
  index,
  playlistContext,
  showAlbum = true,
  showDateAdded = true,
}) => {
  const navigate = useNavigate();
  const { currentSong, isPlaying, playSong, togglePlay, addToQueue } = usePlayerStore();
  const { isSongLiked, toggleLikeSong, userPlaylists, addSongToPlaylist } = useLibraryStore();
  const [showMenu, setShowMenu] = useState(false);

  const isCurrent = currentSong?.id === song.id;
  const isLiked = isSongLiked(song.id);

  const handlePlayClick = () => {
    if (isCurrent) {
      togglePlay();
    } else {
      playSong(song, playlistContext);
    }
  };

  return (
    <div
      onDoubleClick={handlePlayClick}
      className={`group flex items-center justify-between px-4 py-2.5 rounded-md hover:bg-white/10 transition-colors text-sm text-spotify-subtext select-none ${
        isCurrent ? 'bg-white/5' : ''
      }`}
    >
      {/* Left: Index / Play Icon / Equalizer / Title / Artist */}
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        {/* Play / Index / Equalizer */}
        <div className="w-6 flex items-center justify-center shrink-0">
          {isCurrent && isPlaying ? (
            <div className="group-hover:hidden flex items-end gap-0.5 h-3.5">
              <span className="equalizer-bar" />
              <span className="equalizer-bar" />
              <span className="equalizer-bar" />
            </div>
          ) : (
            <span
              className={`group-hover:hidden text-sm ${
                isCurrent ? 'text-spotify-green font-bold' : 'text-spotify-subtext'
              }`}
            >
              {index + 1}
            </span>
          )}

          <button
            onClick={handlePlayClick}
            className="hidden group-hover:flex items-center justify-center text-white hover:scale-110 transition-transform"
          >
            {isCurrent && isPlaying ? (
              <Pause size={16} fill="white" />
            ) : (
              <Play size={16} fill="white" className="ml-0.5" />
            )}
          </button>
        </div>

        {/* Thumbnail */}
        <img
          src={song.coverUrl}
          alt={song.title}
          className="w-10 h-10 rounded object-cover shrink-0 shadow"
        />

        {/* Title and Artist */}
        <div className="min-w-0 flex-1 pr-2">
          <p
            onClick={handlePlayClick}
            className={`font-medium truncate cursor-pointer hover:underline ${
              isCurrent ? 'text-spotify-green font-semibold' : 'text-white'
            }`}
          >
            {song.title}
          </p>
          <p
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/artist/${song.artistId}`);
            }}
            className="text-xs text-spotify-subtext hover:text-white hover:underline cursor-pointer truncate"
          >
            {song.artist}
          </p>
        </div>
      </div>

      {/* Center: Album */}
      {showAlbum && (
        <div className="hidden md:block w-1/4 min-w-0 pr-4">
          <p
            onClick={() => navigate(`/album/${song.albumId}`)}
            className="truncate text-xs text-spotify-subtext hover:text-white hover:underline cursor-pointer"
          >
            {song.album}
          </p>
        </div>
      )}

      {/* Date Added */}
      {showDateAdded && (
        <div className="hidden lg:block w-1/5 min-w-0 pr-4">
          <p className="truncate text-xs text-spotify-subtext">
            {formatTimeAgo(song.addedAt)}
          </p>
        </div>
      )}

      {/* Right: Like, Duration, Options */}
      <div className="flex items-center gap-3 shrink-0 relative">
        <button
          onClick={() => toggleLikeSong(song.id)}
          className={`opacity-0 group-hover:opacity-100 transition-opacity ${
            isLiked ? '!opacity-100 text-spotify-green' : 'text-spotify-subtext hover:text-white'
          }`}
          title={isLiked ? 'Remove from Liked Songs' : 'Like'}
        >
          <Heart size={16} className={isLiked ? 'fill-spotify-green' : ''} />
        </button>

        <span className="text-xs text-spotify-subtext font-mono w-10 text-right">
          {formatDuration(song.duration)}
        </span>

        {/* More Options Button */}
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="opacity-0 group-hover:opacity-100 text-spotify-subtext hover:text-white transition-opacity p-1 rounded-full"
        >
          <MoreHorizontal size={16} />
        </button>

        {/* Context Menu Dropdown */}
        {showMenu && (
          <div
            className="absolute right-0 top-8 w-48 bg-[#282828] rounded-md shadow-2xl py-1 z-50 border border-white/10 text-xs text-white"
            onMouseLeave={() => setShowMenu(false)}
          >
            <button
              onClick={() => {
                addToQueue(song);
                setShowMenu(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-white/10 flex items-center gap-2"
            >
              <ListPlus size={14} />
              <span>Add to queue</span>
            </button>
            <button
              onClick={() => {
                navigate(`/artist/${song.artistId}`);
                setShowMenu(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-white/10 flex items-center gap-2"
            >
              <User size={14} />
              <span>Go to artist</span>
            </button>
            <div className="border-t border-white/10 my-1" />
            <p className="px-4 py-1 text-[10px] uppercase font-bold text-spotify-subtext">
              Add to Playlist:
            </p>
            {userPlaylists.map((pl) => (
              <button
                key={pl.id}
                onClick={() => {
                  addSongToPlaylist(pl.id, song);
                  setShowMenu(false);
                }}
                className="w-full text-left px-4 py-1.5 hover:bg-white/10 truncate text-[11px] text-white/90"
              >
                + {pl.title}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
