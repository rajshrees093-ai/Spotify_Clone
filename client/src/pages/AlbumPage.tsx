import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Pause, MoreHorizontal, Clock, Heart, Check } from 'lucide-react';
import { usePlayerStore } from '../stores/usePlayerStore';
import { useLibraryStore } from '../stores/useLibraryStore';
import { SongRow } from '../components/SongRow';
import { MusicCard } from '../components/MusicCard';
import { formatDuration } from '../utils/formatters';

export const AlbumPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentSong, isPlaying, playSong, togglePlay } = usePlayerStore();
  const { albums, songs, artists, isAlbumSaved, toggleSaveAlbum } = useLibraryStore();

  const album = albums.find((a) => a.id === id) || albums[0];
  const albumSongs = songs.filter((s) => s.albumId === album.id);
  const artist = artists.find((a) => a.id === album.artistId);

  const isSaved = isAlbumSaved(album.id);
  const isThisAlbumPlaying = albumSongs.some((s) => s.id === currentSong?.id) && isPlaying;

  const handlePlayAlbum = () => {
    if (albumSongs.length === 0) return;
    if (isThisAlbumPlaying) {
      togglePlay();
    } else {
      playSong(albumSongs[0], albumSongs.slice(1));
    }
  };

  const totalDurationSeconds = albumSongs.reduce((acc, curr) => acc + curr.duration, 0);
  const durationMins = Math.floor(totalDurationSeconds / 60);

  // Other songs by this artist
  const moreByArtist = songs.filter(
    (s) => s.artistId === album.artistId && s.albumId !== album.id
  );

  return (
    <div className="min-h-full pb-28">
      {/* Header (Screenshot 2 layout) */}
      <div className="bg-gradient-to-b from-[#402010] to-spotify-dark p-6 md:p-8 flex flex-col sm:flex-row items-end gap-6 pt-12 md:pt-16">
        <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-lg overflow-hidden shadow-2xl shrink-0 border border-white/10">
          <img src={album.coverUrl} alt={album.title} className="w-full h-full object-cover" />
        </div>

        <div className="flex flex-col min-w-0">
          <span className="text-xs font-black uppercase tracking-wider text-white">
            {album.albumType.toUpperCase()}
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight py-2 truncate">
            {album.title}
          </h1>
          <p
            onClick={() => navigate(`/artist/${album.artistId}`)}
            className="text-sm font-semibold text-white/90 hover:underline cursor-pointer mb-2"
          >
            By {album.artist}
          </p>
          <div className="text-xs text-white/60 font-medium">
            <span>{album.releaseYear}</span>
            <span> • </span>
            <span>{albumSongs.length} songs</span>
            <span>, </span>
            <span>{durationMins} min</span>
          </div>

          {/* Action Buttons (Screenshot 2: Green PAUSE/PLAY pill + SAVE pill + ...) */}
          <div className="flex items-center gap-3 mt-5">
            <button
              onClick={handlePlayAlbum}
              className="px-8 py-2 rounded-full bg-spotify-green hover:bg-spotify-green-light text-black font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl"
            >
              {isThisAlbumPlaying ? 'PAUSE' : 'PLAY'}
            </button>

            <button
              onClick={() => toggleSaveAlbum(album.id)}
              className={`px-6 py-2 rounded-full font-bold text-xs uppercase tracking-widest border transition-all ${
                isSaved
                  ? 'border-spotify-green text-spotify-green bg-spotify-green/10'
                  : 'border-white/40 text-white hover:border-white hover:scale-105'
              }`}
            >
              {isSaved ? 'SAVED' : 'SAVE'}
            </button>

            <button className="text-spotify-subtext hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors">
              <MoreHorizontal size={22} />
            </button>
          </div>
        </div>
      </div>

      {/* Song List Table */}
      <div className="px-6 md:px-8 mt-6">
        <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 text-xs font-semibold text-spotify-subtext uppercase tracking-wider mb-2">
          <div className="flex items-center gap-3.5 flex-1 min-w-0">
            <span className="w-6 text-center">#</span>
            <span>Title</span>
          </div>
          <div className="flex items-center justify-end w-20 pr-2">
            <Clock size={16} />
          </div>
        </div>

        <div className="space-y-0.5">
          {albumSongs.map((song, index) => (
            <SongRow
              key={song.id}
              song={song}
              index={index}
              playlistContext={albumSongs}
              showAlbum={false}
              showDateAdded={false}
            />
          ))}
        </div>

        {/* Copyright notice (Screenshot 2 exact detail) */}
        <div className="mt-8 text-xs text-spotify-subtext border-t border-white/5 pt-4">
          <p>© {album.releaseYear} RECORDS, LLC / Columbia</p>
          <p>℗ {album.releaseYear} Columbia Records, a Division of Sony Music Entertainment</p>
        </div>

        {/* More by Artist Carousel (Screenshot 2 exact detail) */}
        {moreByArtist.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold text-white mb-4">More by {album.artist}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {moreByArtist.map((s) => (
                <MusicCard key={s.id} item={s} type="song" />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
