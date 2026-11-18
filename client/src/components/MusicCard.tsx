import React from 'react';
import { Play, Pause } from 'lucide-react';
import { usePlayerStore } from '../stores/usePlayerStore';
import { Song, Playlist, Album } from '../types';
import { useNavigate } from 'react-router-dom';

interface MusicCardProps {
  item: Song | Playlist | Album;
  type: 'song' | 'playlist' | 'album';
  subtitle?: string;
}

export const MusicCard: React.FC<MusicCardProps> = ({ item, type, subtitle }) => {
  const navigate = useNavigate();
  const { currentSong, isPlaying, playSong, togglePlay } = usePlayerStore();

  const isSong = type === 'song';
  const songItem = isSong ? (item as Song) : null;
  const isCurrentlyPlayingThis = isSong && currentSong?.id === songItem?.id && isPlaying;

  const handleClick = () => {
    if (type === 'playlist') {
      navigate(`/playlist/${item.id}`);
    } else if (type === 'album') {
      navigate(`/album/${item.id}`);
    } else if (songItem) {
      playSong(songItem);
    }
  };

  const handlePlayButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (type === 'playlist') {
      const pl = item as Playlist;
      if (pl.songs && pl.songs.length > 0) {
        playSong(pl.songs[0], pl.songs);
      } else {
        navigate(`/playlist/${item.id}`);
      }
    } else if (type === 'album') {
      navigate(`/album/${item.id}`);
    } else if (songItem) {
      if (currentSong?.id === songItem.id) {
        togglePlay();
      } else {
        playSong(songItem);
      }
    }
  };

  const title = item.title;
  const image = item.coverUrl;
  const desc =
    subtitle ||
    ('artist' in item && typeof item.artist === 'string'
      ? item.artist
      : 'description' in item && typeof item.description === 'string'
      ? item.description
      : '');

  return (
    <div
      onClick={handleClick}
      className="group bg-spotify-card hover:bg-spotify-card-hover p-3.5 rounded-2xl border border-white/[0.05] hover:border-white/[0.12] transition-all duration-300 cursor-pointer flex flex-col relative shadow-sm hover:shadow-xl hover:-translate-y-0.5"
    >
      {/* Artwork */}
      <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-3.5 shadow-lg bg-spotify-elevated">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Floating Mint-Cyan Play Button on hover */}
        <button
          onClick={handlePlayButtonClick}
          className={`absolute right-2.5 bottom-2.5 w-11 h-11 rounded-xl bg-gradient-to-br from-[#10D9A0] to-[#22D3EE] text-[#061214] flex items-center justify-center shadow-xl shadow-teal-500/30 transition-all duration-300 transform ${
            isCurrentlyPlayingThis
              ? 'opacity-100 translate-y-0 scale-100'
              : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 hover:scale-105'
          }`}
          title={isCurrentlyPlayingThis ? 'Pause' : 'Play'}
        >
          {isCurrentlyPlayingThis ? (
            <Pause size={20} fill="#061214" />
          ) : (
            <Play size={20} fill="#061214" className="ml-0.5" />
          )}
        </button>
      </div>

      {/* Info */}
      <div className="flex flex-col min-w-0">
        <h3 className="text-sm font-bold text-white truncate group-hover:text-white transition-colors">
          {title}
        </h3>
        <p className="text-xs text-spotify-subtext line-clamp-2 mt-1 leading-relaxed">
          {desc}
        </p>
      </div>
    </div>
  );
};
