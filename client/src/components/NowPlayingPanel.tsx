import React from 'react';
import { X, Heart, Plus, MoreHorizontal, Check } from 'lucide-react';
import { usePlayerStore } from '../stores/usePlayerStore';
import { useLibraryStore } from '../stores/useLibraryStore';
import { formatNumber } from '../utils/formatters';

export const NowPlayingPanel: React.FC = () => {
  const { currentSong, isRightPanelOpen, toggleRightPanel, toggleLyrics } = usePlayerStore();
  const { artists, isSongLiked, toggleLikeSong, isArtistFollowed, toggleFollowArtist } = useLibraryStore();

  if (!isRightPanelOpen || !currentSong) return null;

  const artist = artists.find((a) => a.id === currentSong.artistId) || {
    id: currentSong.artistId,
    name: currentSong.artist,
    bio: `${currentSong.artist} is an acclaimed musical artist on SYRĒN.`,
    imageUrl: currentSong.coverUrl,
    bannerUrl: currentSong.coverUrl,
    monthlyListeners: 45200000,
    verified: true,
    genres: [currentSong.genre],
  };

  const isLiked = isSongLiked(currentSong.id);
  const isFollowed = isArtistFollowed(artist.id);

  return (
    <aside className="w-80 bg-spotify-dark/95 border-l border-white/5 flex flex-col h-full shrink-0 select-none overflow-y-auto p-4 space-y-5 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-white truncate pr-2">{currentSong.title}</span>
        <button
          onClick={toggleRightPanel}
          className="p-1 rounded-full text-spotify-subtext hover:text-white hover:bg-white/10 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Large Artwork */}
      <div className="relative group rounded-lg overflow-hidden shadow-2xl">
        <img
          src={currentSong.coverUrl}
          alt={currentSong.title}
          className="w-full aspect-square object-cover"
        />
      </div>

      {/* Title & Artist with Like & More */}
      <div className="flex items-center justify-between">
        <div className="min-w-0 pr-2">
          <h3 className="text-lg font-bold text-white truncate">{currentSong.title}</h3>
          <p className="text-sm text-spotify-subtext truncate">{currentSong.artist}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleLikeSong(currentSong.id)}
            className={`transition-colors ${
              isLiked ? 'text-spotify-green' : 'text-spotify-subtext hover:text-white'
            }`}
          >
            <Heart size={20} className={isLiked ? 'fill-spotify-green' : ''} />
          </button>
          <button className="text-spotify-subtext hover:text-white">
            <MoreHorizontal size={20} />
          </button>
        </div>
      </div>

      {/* About the Artist Card (Exact match to screenshot 4!) */}
      <div className="bg-[#242424] rounded-xl overflow-hidden group">
        <div className="relative h-44 w-full">
          <img
            src={artist.imageUrl}
            alt={artist.name}
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute top-3 left-3 text-xs font-bold text-white uppercase tracking-wider bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full">
            About the artist
          </div>
        </div>

        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-base font-bold text-white hover:underline cursor-pointer">
                {artist.name}
              </h4>
              <p className="text-xs text-spotify-subtext">
                {formatNumber(artist.monthlyListeners)} monthly listeners
              </p>
            </div>
            <button
              onClick={() => toggleFollowArtist(artist.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${
                isFollowed
                  ? 'border-spotify-green text-spotify-green hover:border-white'
                  : 'border-white/30 text-white hover:border-white hover:scale-105'
              }`}
            >
              {isFollowed ? 'Following' : 'Follow'}
            </button>
          </div>

          <p className="text-xs text-spotify-subtext line-clamp-3 leading-relaxed">
            {artist.bio}
          </p>
        </div>
      </div>

      {/* Lyrics Snippet Card (Matches screenshot 4!) */}
      {currentSong.lyrics && (
        <div
          onClick={toggleLyrics}
          className="bg-gradient-to-br from-emerald-900/40 to-[#242424] p-4 rounded-xl cursor-pointer hover:bg-emerald-900/50 transition-colors group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider">Lyrics</span>
            <span className="text-xs text-spotify-green font-semibold group-hover:underline">Show lyrics</span>
          </div>
          <p className="text-sm font-medium text-white/90 line-clamp-4 leading-relaxed whitespace-pre-line">
            {currentSong.lyrics}
          </p>
        </div>
      )}

      {/* Credits */}
      <div className="bg-[#242424] p-4 rounded-xl space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white uppercase tracking-wider">Credits</span>
          <span className="text-xs text-spotify-subtext hover:underline cursor-pointer">Show all</span>
        </div>
        <div>
          <p className="text-xs font-semibold text-white">{currentSong.artist}</p>
          <p className="text-[11px] text-spotify-subtext">Main Artist, Composer</p>
        </div>
      </div>
    </aside>
  );
};
