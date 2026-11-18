import React from 'react';
import { useParams } from 'react-router-dom';
import { Play, Pause, CheckCircle2, UserCheck, UserPlus } from 'lucide-react';
import { usePlayerStore } from '../stores/usePlayerStore';
import { useLibraryStore } from '../stores/useLibraryStore';
import { SongRow } from '../components/SongRow';
import { MusicCard } from '../components/MusicCard';
import { formatNumber } from '../utils/formatters';

export const ArtistPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentSong, isPlaying, playSong, togglePlay } = usePlayerStore();
  const { artists, songs, albums, isArtistFollowed, toggleFollowArtist } = useLibraryStore();

  const artist = artists.find((a) => a.id === id) || artists[0];
  const artistSongs = songs.filter((s) => s.artistId === artist.id);
  const artistAlbums = albums.filter((a) => a.artistId === artist.id);

  const isFollowed = isArtistFollowed(artist.id);
  const isArtistPlaying = artistSongs.some((s) => s.id === currentSong?.id) && isPlaying;

  const handlePlayArtist = () => {
    if (artistSongs.length === 0) return;
    if (isArtistPlaying) {
      togglePlay();
    } else {
      playSong(artistSongs[0], artistSongs.slice(1));
    }
  };

  return (
    <div className="min-h-full pb-28">
      {/* Massive Artist Banner */}
      <div className="relative h-80 sm:h-96 w-full flex flex-col justify-end p-6 md:p-8 overflow-hidden">
        {/* Banner image with overlay */}
        <img
          src={artist.bannerUrl}
          alt={artist.name}
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-spotify-dark via-black/40 to-black/20" />

        {/* Content */}
        <div className="relative z-10 space-y-2">
          {artist.verified && (
            <div className="flex items-center gap-1.5 text-xs font-bold text-sky-400">
              <CheckCircle2 size={18} fill="#38bdf8" className="text-black" />
              <span className="text-white">Verified Artist</span>
            </div>
          )}

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight">
            {artist.name}
          </h1>

          <p className="text-sm font-semibold text-white/90">
            {formatNumber(artist.monthlyListeners)} monthly listeners
          </p>
        </div>
      </div>

      {/* Action Row */}
      <div className="px-6 md:px-8 py-6 flex items-center gap-6">
        <button
          onClick={handlePlayArtist}
          disabled={artistSongs.length === 0}
          className="w-14 h-14 rounded-full bg-spotify-green text-black flex items-center justify-center hover:scale-105 transition-transform shadow-2xl disabled:opacity-50"
        >
          {isArtistPlaying ? (
            <Pause size={24} fill="black" />
          ) : (
            <Play size={24} fill="black" className="ml-1" />
          )}
        </button>

        <button
          onClick={() => toggleFollowArtist(artist.id)}
          className={`px-5 py-2 rounded-full font-bold text-xs uppercase tracking-wider border transition-all ${
            isFollowed
              ? 'border-spotify-green text-spotify-green bg-spotify-green/10'
              : 'border-white/40 text-white hover:border-white hover:scale-105'
          }`}
        >
          {isFollowed ? 'FOLLOWING' : 'FOLLOW'}
        </button>
      </div>

      {/* Main Content Sections */}
      <div className="px-6 md:px-8 space-y-10">
        {/* Popular Songs */}
        <section>
          <h2 className="text-xl md:text-2xl font-bold text-white mb-4">Popular</h2>
          <div className="space-y-0.5">
            {artistSongs.slice(0, 5).map((song, index) => (
              <SongRow
                key={song.id}
                song={song}
                index={index}
                playlistContext={artistSongs}
                showAlbum={true}
                showDateAdded={false}
              />
            ))}
          </div>
        </section>

        {/* Discography */}
        {artistAlbums.length > 0 && (
          <section>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4">Discography</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {artistAlbums.map((alb) => (
                <MusicCard key={alb.id} item={alb} type="album" />
              ))}
            </div>
          </section>
        )}

        {/* About Card */}
        <section>
          <h2 className="text-xl md:text-2xl font-bold text-white mb-4">About</h2>
          <div className="relative rounded-2xl overflow-hidden max-w-3xl bg-[#242424] group cursor-pointer shadow-xl">
            <div className="relative h-72 sm:h-80 w-full overflow-hidden">
              <img
                src={artist.imageUrl}
                alt={artist.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-transparent" />
            </div>

            <div className="p-6 relative -mt-16 bg-gradient-to-t from-[#181818] via-[#181818] to-transparent space-y-3">
              <span className="text-2xl font-black text-white">
                {formatNumber(artist.monthlyListeners)}{' '}
                <span className="text-sm font-medium text-spotify-subtext">monthly listeners</span>
              </span>
              <p className="text-sm text-spotify-subtext leading-relaxed">{artist.bio}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
