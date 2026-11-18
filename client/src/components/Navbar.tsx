import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Bell,
  Users,
  User,
  LogOut,
  Sparkles,
  Download,
  ExternalLink,
  X,
  Database,
  RefreshCw
} from 'lucide-react';
import { usePlayerStore } from '../stores/usePlayerStore';
import { useLibraryStore } from '../stores/useLibraryStore';

interface NavbarProps {
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    searchQuery,
    setSearchQuery,
    user,
    setUser,
    isDbConnected,
    dbEngine,
    dbStats,
    initializeFromDatabase,
    isLoadingCatalog,
  } = useLibraryStore();
  const { isFriendActivityOpen, toggleFriendActivity } = usePlayerStore();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isDbPopoverOpen, setIsDbPopoverOpen] = useState(false);

  const isSearchPage = location.pathname === '/search';

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (!isSearchPage && val.trim().length > 0) {
      navigate('/search');
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleLogout = () => {
    setUser(null);
    setIsProfileMenuOpen(false);
  };

  return (
    <header className="h-16 px-6 bg-spotify-dark/95 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between border-b border-white/5 gap-4">
      {/* Navigation history arrows */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate(-1)}
          className="w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-white/70 hover:text-white transition-all hover:bg-black/80"
          title="Go back"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => navigate(1)}
          className="w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-white/70 hover:text-white transition-all hover:bg-black/80"
          title="Go forward"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Center Search Bar */}
      <div className="flex-1 max-w-md relative">
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 text-spotify-subtext pointer-events-none" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => {
              if (!isSearchPage) navigate('/search');
            }}
            placeholder="Search tracks, artists, albums, or moods..."
            className="w-full bg-[#161B26] hover:bg-[#1E2534] focus:bg-[#1E2534] text-white text-sm rounded-xl border border-white/[0.08] focus:border-spotify-green/50 pl-10 pr-10 py-2.5 transition-all outline-none placeholder:text-spotify-subtext"
          />
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 text-spotify-subtext hover:text-white"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Right Controls: DB Status, Explore, Install App, Friend Activity & Profile */}
      <div className="flex items-center gap-3">
        {/* Live Database Status Pill */}
        <div className="relative">
          <button
            onClick={() => setIsDbPopoverOpen(!isDbPopoverOpen)}
            className={`hidden sm:flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-full border transition-colors ${
              isDbConnected
                ? 'bg-spotify-green/10 border-spotify-green/30 text-spotify-green hover:bg-spotify-green/20'
                : 'bg-white/5 border-white/10 text-spotify-subtext hover:text-white'
            }`}
            title="Database Connection Status"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isDbConnected ? 'bg-spotify-green animate-pulse' : 'bg-amber-400'
              }`}
            />
            <Database size={13} />
            <span>{isDbConnected ? 'SQLite DB' : 'Local Cache'}</span>
          </button>

          {isDbPopoverOpen && (
            <div
              className="absolute right-0 mt-2 w-64 bg-[#282828] rounded-xl shadow-2xl p-4 z-50 border border-white/10 text-xs space-y-3"
              onMouseLeave={() => setIsDbPopoverOpen(false)}
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <div className="flex items-center gap-2">
                  <Database size={15} className="text-spotify-green" />
                  <span className="font-bold text-white">{dbEngine}</span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isDbConnected
                      ? 'bg-spotify-green/20 text-spotify-green'
                      : 'bg-amber-500/20 text-amber-300'
                  }`}
                >
                  {isDbConnected ? 'LIVE' : 'OFFLINE'}
                </span>
              </div>

              {dbStats ? (
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-black/30 rounded-lg p-2">
                    <p className="text-spotify-subtext">Songs</p>
                    <p className="text-white font-bold text-sm">{dbStats.songs}</p>
                  </div>
                  <div className="bg-black/30 rounded-lg p-2">
                    <p className="text-spotify-subtext">Playlists</p>
                    <p className="text-white font-bold text-sm">{dbStats.playlists}</p>
                  </div>
                  <div className="bg-black/30 rounded-lg p-2">
                    <p className="text-spotify-subtext">Artists / Albums</p>
                    <p className="text-white font-bold text-sm">
                      {dbStats.artists} / {dbStats.albums}
                    </p>
                  </div>
                  <div className="bg-black/30 rounded-lg p-2">
                    <p className="text-spotify-subtext">Likes / Plays</p>
                    <p className="text-white font-bold text-sm">
                      {dbStats.likedSongs} / {dbStats.listeningHistory}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-spotify-subtext text-[11px] leading-relaxed">
                  Start the backend API (<code className="text-white">npm run server</code>) to sync live with{' '}
                  <code className="text-spotify-green">spotify.db</code>.
                </p>
              )}

              <button
                onClick={() => initializeFromDatabase()}
                disabled={isLoadingCatalog}
                className="w-full py-1.5 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <RefreshCw size={13} className={isLoadingCatalog ? 'animate-spin' : ''} />
                <span>{isLoadingCatalog ? 'Syncing...' : 'Refresh from Database'}</span>
              </button>
            </div>
          )}
        </div>

        <button
          onClick={() => navigate('/browse')}
          className="hidden md:flex items-center gap-1.5 text-xs font-bold px-4 py-1.5 rounded-full bg-gradient-to-r from-[#10D9A0] to-[#22D3EE] text-[#061214] hover:brightness-110 hover:scale-105 transition-all shadow-md shadow-teal-500/20"
        >
          <Sparkles size={14} />
          <span>PulseWave Plus</span>
        </button>

        <button
          onClick={() => alert('PulseWave Web App can be installed directly from your browser address bar!')}
          className="hidden lg:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full text-spotify-subtext hover:text-white hover:bg-white/10 transition-colors"
        >
          <Download size={15} />
          <span>Get App</span>
        </button>

        {/* Friend Activity Toggle */}
        <button
          onClick={toggleFriendActivity}
          className={`p-2 rounded-full transition-colors ${
            isFriendActivityOpen ? 'text-spotify-green bg-white/10' : 'text-spotify-subtext hover:text-white hover:bg-white/5'
          }`}
          title="Friend Activity"
        >
          <Users size={18} />
        </button>

        {/* Profile or Login/Signup */}
        {user ? (
          <div className="relative">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-2 p-1 pl-1 pr-2 rounded-full bg-black/60 hover:bg-[#282828] transition-colors"
            >
              <img
                src={user.avatarUrl}
                alt={user.fullName}
                className="w-7 h-7 rounded-full object-cover"
              />
              <span className="text-xs font-bold text-white max-w-[100px] truncate hidden sm:inline">
                {user.fullName || user.username}
              </span>
            </button>

            {isProfileMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-52 bg-[#282828] rounded-md shadow-2xl py-1 z-50 border border-white/10 text-sm"
                onMouseLeave={() => setIsProfileMenuOpen(false)}
              >
                <div className="px-4 py-2 border-b border-white/10">
                  <p className="text-white font-medium text-xs truncate">{user.fullName}</p>
                  <p className="text-spotify-subtext text-[11px] truncate">{user.email}</p>
                </div>
                <button
                  onClick={() => {
                    navigate('/profile');
                    setIsProfileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-white/10 flex items-center justify-between text-white text-xs"
                >
                  <span>Profile</span>
                  <ExternalLink size={14} className="text-spotify-subtext" />
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-white/10 flex items-center gap-2 text-rose-400 hover:text-rose-300 text-xs border-t border-white/10"
                >
                  <LogOut size={14} />
                  <span>Log out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenAuth}
              className="text-spotify-subtext hover:text-white font-bold text-sm transition-colors"
            >
              Sign up
            </button>
            <button
              onClick={onOpenAuth}
              className="bg-white text-black font-bold text-sm px-6 py-2.5 rounded-full hover:scale-105 transition-transform"
            >
              Log in
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
