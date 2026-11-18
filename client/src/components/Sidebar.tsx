import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home,
  Search,
  Library,
  Plus,
  Heart,
  Music,
  Compass,
  Radio,
  FolderPlus,
  ListFilter,
  CheckCircle2,
  Upload
} from 'lucide-react';
import { useLibraryStore } from '../stores/useLibraryStore';
import { usePlayerStore } from '../stores/usePlayerStore';
import { BrandLogo } from './BrandLogo';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onOpenUpload?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggleCollapse, onOpenUpload }) => {
  const navigate = useNavigate();
  const { artists, albums, userPlaylists, likedSongIds, followedArtistIds, setCreatePlaylistModalOpen } = useLibraryStore();
  const { currentSong, isPlaying } = usePlayerStore();
  const [filter, setFilter] = useState<'all' | 'playlists' | 'artists' | 'albums'>('all');
  const [librarySearch, setLibrarySearch] = useState('');

  const filteredPlaylists = userPlaylists.filter((pl) =>
    pl.title.toLowerCase().includes(librarySearch.toLowerCase())
  );

  const followedArtists = artists.filter((art) => followedArtistIds.includes(art.id));

  return (
    <aside
      className={`h-full bg-spotify-black flex flex-col gap-2 p-2 select-none transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-72 md:w-80'
      }`}
    >
      {/* Top Main Navigation Box */}
      <div className="bg-spotify-dark rounded-2xl border border-white/[0.06] p-4 flex flex-col gap-4">
        {/* Branding Logo */}
        <div
          onClick={() => navigate('/')}
          className="cursor-pointer hover:opacity-90 transition-opacity px-1"
        >
          <BrandLogo size="md" showText={!isCollapsed} />
        </div>

        {/* Links */}
        <nav className="flex flex-col gap-1">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex items-center gap-4 px-3 py-2.5 rounded-xl font-bold text-sm transition-all ${
                isActive
                  ? 'text-spotify-green bg-spotify-green/10 border border-spotify-green/20'
                  : 'text-spotify-subtext hover:text-white hover:bg-white/5 border border-transparent'
              }`
            }
          >
            <Home size={20} />
            {!isCollapsed && <span>Home</span>}
          </NavLink>

          <NavLink
            to="/search"
            className={({ isActive }) =>
              `flex items-center gap-4 px-3 py-2.5 rounded-xl font-bold text-sm transition-all ${
                isActive
                  ? 'text-spotify-green bg-spotify-green/10 border border-spotify-green/20'
                  : 'text-spotify-subtext hover:text-white hover:bg-white/5 border border-transparent'
              }`
            }
          >
            <Search size={20} />
            {!isCollapsed && <span>Search</span>}
          </NavLink>

          <NavLink
            to="/browse"
            className={({ isActive }) =>
              `flex items-center gap-4 px-3 py-2.5 rounded-xl font-bold text-sm transition-all ${
                isActive
                  ? 'text-spotify-green bg-spotify-green/10 border border-spotify-green/20'
                  : 'text-spotify-subtext hover:text-white hover:bg-white/5 border border-transparent'
              }`
            }
          >
            <Compass size={20} />
            {!isCollapsed && <span>Discover</span>}
          </NavLink>

          {onOpenUpload && (
            <button
              onClick={onOpenUpload}
              className="flex items-center gap-4 px-3 py-2.5 rounded-xl font-bold text-sm transition-all text-spotify-subtext hover:text-white hover:bg-white/5 border border-transparent text-left"
              title="Upload your own full-length MP3/WAV song"
            >
              <Upload size={20} className="text-spotify-green" />
              {!isCollapsed && <span>Upload Song</span>}
            </button>
          )}
        </nav>
      </div>

      {/* Library Box */}
      <div className="bg-spotify-dark rounded-2xl border border-white/[0.06] p-3 flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-2 py-1 mb-2">
          <button
            onClick={onToggleCollapse}
            className="flex items-center gap-2.5 text-spotify-subtext hover:text-white transition-colors group font-bold text-sm"
            title="Collapse or expand library"
          >
            <Library size={22} className="group-hover:text-white" />
            {!isCollapsed && <span>Your Library</span>}
          </button>

          {!isCollapsed && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCreatePlaylistModalOpen(true)}
                className="p-1.5 rounded-full text-spotify-subtext hover:text-white hover:bg-white/10 transition-colors"
                title="Create playlist or folder"
              >
                <Plus size={20} />
              </button>
            </div>
          )}
        </div>

        {/* Filter Chips */}
        {!isCollapsed && (
          <div className="flex items-center gap-2 px-1 py-1.5 overflow-x-auto no-scrollbar">
            {(['all', 'playlists', 'artists', 'albums'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`text-xs capitalize px-3 py-1.5 rounded-full font-medium transition-colors shrink-0 ${
                  filter === tab
                    ? 'bg-white text-black'
                    : 'bg-[#242424] text-white hover:bg-[#2e2e2e]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        )}

        {/* Library Items List */}
        <div className="flex-1 overflow-y-auto mt-2 space-y-1 pr-1">
          {/* Liked Songs Special Card */}
          {(filter === 'all' || filter === 'playlists') && (
            <div
              onClick={() => navigate('/playlist/liked')}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer group transition-colors"
            >
              <div className="w-12 h-12 rounded-md bg-gradient-to-br from-indigo-600 via-purple-700 to-emerald-400 flex items-center justify-center shrink-0 shadow-md">
                <Heart size={20} className="text-white fill-white" />
              </div>
              {!isCollapsed && (
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold text-white group-hover:text-spotify-green truncate transition-colors">
                    Liked Songs
                  </span>
                  <span className="text-xs text-spotify-subtext truncate flex items-center gap-1">
                    <span className="text-spotify-green">📌</span> Playlist • {likedSongIds.length} songs
                  </span>
                </div>
              )}
            </div>
          )}

          {/* User Playlists */}
          {(filter === 'all' || filter === 'playlists') &&
            filteredPlaylists.map((pl) => (
              <div
                key={pl.id}
                onClick={() => navigate(`/playlist/${pl.id}`)}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer group transition-colors"
              >
                <img
                  src={pl.coverUrl}
                  alt={pl.title}
                  className="w-12 h-12 rounded-md object-cover shrink-0 shadow"
                />
                {!isCollapsed && (
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium text-white group-hover:text-spotify-green truncate transition-colors">
                      {pl.title}
                    </span>
                    <span className="text-xs text-spotify-subtext truncate">
                      Playlist • {pl.creator.name}
                    </span>
                  </div>
                )}
              </div>
            ))}

          {/* Followed Artists */}
          {(filter === 'all' || filter === 'artists') &&
            followedArtists.map((art) => (
              <div
                key={art.id}
                onClick={() => navigate(`/artist/${art.id}`)}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer group transition-colors"
              >
                <img
                  src={art.imageUrl}
                  alt={art.name}
                  className="w-12 h-12 rounded-full object-cover shrink-0 shadow"
                />
                {!isCollapsed && (
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium text-white group-hover:text-spotify-green truncate transition-colors">
                      {art.name}
                    </span>
                    <span className="text-xs text-spotify-subtext truncate">Artist</span>
                  </div>
                )}
              </div>
            ))}

          {/* Albums */}
          {(filter === 'all' || filter === 'albums') &&
            albums.map((alb) => (
              <div
                key={alb.id}
                onClick={() => navigate(`/album/${alb.id}`)}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer group transition-colors"
              >
                <img
                  src={alb.coverUrl}
                  alt={alb.title}
                  className="w-12 h-12 rounded-md object-cover shrink-0 shadow"
                />
                {!isCollapsed && (
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium text-white group-hover:text-spotify-green truncate transition-colors">
                      {alb.title}
                    </span>
                    <span className="text-xs text-spotify-subtext truncate">
                      Album • {alb.artist}
                    </span>
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    </aside>
  );
};
