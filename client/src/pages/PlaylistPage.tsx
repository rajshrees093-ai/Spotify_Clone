import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Play,
  Pause,
  MoreHorizontal,
  Clock,
  Heart,
  Edit2,
  Trash2,
  Share2,
  ListPlus,
  Radio
} from 'lucide-react';
import { usePlayerStore } from '../stores/usePlayerStore';
import { useLibraryStore } from '../stores/useLibraryStore';
import { SongRow } from '../components/SongRow';
import { formatDuration } from '../utils/formatters';

export const PlaylistPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentSong, isPlaying, playSong, togglePlay, addToQueue } = usePlayerStore();
  const {
    songs: allSongs,
    userPlaylists,
    deletePlaylist,
    setEditingPlaylist,
    likedSongIds,
  } = useLibraryStore();

  const [showMenu, setShowMenu] = useState(false);

  // Check if this is the special Liked Songs playlist
  const isLikedView = id === 'liked';

  let playlist = userPlaylists.find((pl) => pl.id === id);

  if (isLikedView) {
    const likedSongs = allSongs.filter((s) => likedSongIds.includes(s.id));
    playlist = {
      id: 'liked',
      title: 'Liked Songs',
      description: 'Your personal collection of saved favorite tracks.',
      coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
      isPublic: false,
      creator: {
        id: 'usr-1',
        name: 'You',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      },
      songs: likedSongs,
      songCount: likedSongs.length,
      followersCount: 0,
      gradientColor: 'from-indigo-900 to-spotify-dark',
      createdAt: 'Always',
    };
  }

  if (!playlist) {
    return (
      <div className="p-8 text-center text-spotify-subtext">
        <h2 className="text-xl text-white font-bold mb-2">Playlist not found</h2>
        <button
          onClick={() => navigate('/')}
          className="text-spotify-green hover:underline text-sm font-semibold"
        >
          Return to Home
        </button>
      </div>
    );
  }

  const songs = playlist.songs || [];
  const isPlaylistPlaying = songs.some((s) => s.id === currentSong?.id) && isPlaying;

  const handlePlayPlaylist = () => {
    if (songs.length === 0) return;
    if (isPlaylistPlaying) {
      togglePlay();
    } else {
      playSong(songs[0], songs.slice(1));
    }
  };

  const totalDurationSeconds = songs.reduce((acc, curr) => acc + (curr.duration || 0), 0);
  const durationHours = Math.floor(totalDurationSeconds / 3600);
  const durationMinutes = Math.floor((totalDurationSeconds % 3600) / 60);
  const formattedDuration =
    durationHours > 0
      ? `${durationHours} hr ${durationMinutes} min`
      : `${durationMinutes} min`;

  return (
    <div className="min-h-full pb-28">
      {/* Dynamic Gradient Header (Matches screenshot 5!) */}
      <div
        className={`bg-gradient-to-b ${
          playlist.gradientColor || 'from-rose-900 to-spotify-dark'
        } p-6 md:p-8 flex flex-col sm:flex-row items-end gap-6 pt-12 md:pt-16 transition-colors duration-500`}
      >
        {/* Cover Art / 2x2 Collage */}
        <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-lg overflow-hidden shadow-2xl shrink-0 bg-black/40 border border-white/5">
          {songs.length >= 4 && !playlist.coverUrl.includes('unsplash') ? (
            <div className="grid grid-cols-2 grid-rows-2 w-full h-full">
              {songs.slice(0, 4).map((s, idx) => (
                <img
                  key={idx}
                  src={s.coverUrl}
                  alt={s.title}
                  className="w-full h-full object-cover"
                />
              ))}
            </div>
          ) : (
            <img
              src={playlist.coverUrl}
              alt={playlist.title}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Playlist Metadata Header */}
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-black uppercase tracking-wider text-white">
            {playlist.id === 'pl-office' ? 'Collaborative Playlist' : 'Public Playlist'}
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight py-2 truncate">
            {playlist.title}
          </h1>
          <p className="text-sm text-white/80 line-clamp-2 mb-3 leading-relaxed">
            {playlist.description}
          </p>

          <div className="flex items-center gap-2 text-xs font-semibold text-white/90">
            <img
              src={playlist.creator.avatarUrl}
              alt={playlist.creator.name}
              className="w-6 h-6 rounded-full object-cover"
            />
            <span className="hover:underline cursor-pointer">{playlist.creator.name}</span>
            <span>•</span>
            <span>{songs.length} songs</span>
            <span>•</span>
            <span className="text-white/60 font-normal">{formattedDuration}</span>
          </div>
        </div>
      </div>

      {/* Action Row: Play, Like, More Options */}
      <div className="px-6 md:px-8 py-5 flex items-center gap-6 relative">
        <button
          onClick={handlePlayPlaylist}
          disabled={songs.length === 0}
          className="w-14 h-14 rounded-full bg-spotify-green text-black flex items-center justify-center hover:scale-105 transition-transform shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
          title={isPlaylistPlaying ? 'Pause' : 'Play playlist'}
        >
          {isPlaylistPlaying ? (
            <Pause size={24} fill="black" />
          ) : (
            <Play size={24} fill="black" className="ml-1" />
          )}
        </button>

        <button
          onClick={() => setShowMenu(!showMenu)}
          className="text-spotify-subtext hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <MoreHorizontal size={28} />
        </button>

        {/* Playlist Context Menu (Matches screenshot 5!) */}
        {showMenu && (
          <div
            className="absolute left-24 top-16 w-56 bg-[#282828] rounded-md shadow-2xl py-1 z-50 border border-white/10 text-xs text-white"
            onMouseLeave={() => setShowMenu(false)}
          >
            <button
              onClick={() => {
                songs.forEach((s) => addToQueue(s));
                setShowMenu(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-white/10 flex items-center gap-2"
            >
              <ListPlus size={15} />
              <span>Add to queue</span>
            </button>
            <button
              onClick={() => {
                alert('Radio stream generated for this playlist!');
                setShowMenu(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-white/10 flex items-center gap-2"
            >
              <Radio size={15} />
              <span>Go to playlist radio</span>
            </button>
            <div className="border-t border-white/10 my-1" />
            <button
              onClick={() => {
                setEditingPlaylist(playlist);
                setShowMenu(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-white/10 flex items-center gap-2 text-spotify-green font-semibold"
            >
              <Edit2 size={15} />
              <span>Edit details</span>
            </button>
            <button
              onClick={() => {
                if (window.confirm(`Delete "${playlist.title}"?`)) {
                  deletePlaylist(playlist.id);
                  navigate('/');
                }
              }}
              className="w-full text-left px-4 py-2 hover:bg-white/10 flex items-center gap-2 text-rose-400"
            >
              <Trash2 size={15} />
              <span>Delete</span>
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert('Playlist link copied to clipboard!');
                setShowMenu(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-white/10 flex items-center gap-2"
            >
              <Share2 size={15} />
              <span>Share</span>
            </button>
          </div>
        )}
      </div>

      {/* Song List Table (Exact headers as screenshot 5) */}
      <div className="px-6 md:px-8">
        <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 text-xs font-semibold text-spotify-subtext uppercase tracking-wider mb-2">
          <div className="flex items-center gap-3.5 flex-1 min-w-0">
            <span className="w-6 text-center">#</span>
            <span>Title</span>
          </div>
          <span className="hidden md:block w-1/4 pr-4">Album</span>
          <span className="hidden lg:block w-1/5 pr-4">Date Added</span>
          <div className="flex items-center justify-end w-20 pr-2">
            <Clock size={16} />
          </div>
        </div>

        {songs.length === 0 ? (
          <div className="text-center py-16 text-spotify-subtext">
            <p className="text-base text-white font-bold mb-1">It's a bit empty here</p>
            <p className="text-xs">Find more of the songs you love by browsing or searching.</p>
          </div>
        ) : (
          <div className="space-y-0.5">
            {songs.map((song, index) => (
              <SongRow
                key={`${song.id}-${index}`}
                song={song}
                index={index}
                playlistContext={songs}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
