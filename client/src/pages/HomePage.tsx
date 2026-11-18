import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Pause } from 'lucide-react';
import { usePlayerStore } from '../stores/usePlayerStore';
import { useLibraryStore } from '../stores/useLibraryStore';
import { getGreeting } from '../utils/formatters';
import { MusicCard } from '../components/MusicCard';
import { ArtistCard } from '../components/ArtistCard';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const greeting = getGreeting();
  const { currentSong, isPlaying, playSong, togglePlay } = usePlayerStore();
  const { songs, artists, albums, userPlaylists, recentHistory } = useLibraryStore();

  const recentlyPlayedSongs = recentHistory.length > 0 ? recentHistory.slice(0, 6) : songs.slice(0, 6);

  // Top 6 Recently Played quick-access grid
  const quickItems = [
    {
      id: 'pl-office',
      title: 'Office',
      cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=300&q=80',
      action: () => navigate('/playlist/pl-office'),
    },
    {
      id: 'pl-no-new-friends',
      title: 'No New Friends EP',
      cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=300&q=80',
      action: () => navigate('/playlist/pl-no-new-friends'),
    },
    {
      id: 'liked',
      title: 'Liked Songs',
      cover: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=300&q=80',
      action: () => navigate('/playlist/liked'),
    },
    {
      id: 'pl-daily-mix-1',
      title: 'Daily Mix 1',
      cover: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=300&q=80',
      action: () => navigate('/playlist/pl-daily-mix-1'),
    },
    {
      id: 'alb-2',
      title: 'RENAISSANCE',
      cover: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=300&q=80',
      action: () => navigate('/album/alb-2'),
    },
    {
      id: 'alb-3',
      title: 'After Hours',
      cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=300&q=80',
      action: () => navigate('/album/alb-3'),
    },
  ];

  return (
    <div className="min-h-full pb-28 px-6 md:px-8 pt-6 space-y-10 bg-[radial-gradient(ellipse_at_top_left,_rgba(16,217,160,0.12),_transparent_45%)]">
      {/* Top Greeting */}
      <div>
        <div className="flex items-end justify-between mb-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-spotify-green mb-1">
              PulseWave Studio
            </p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              {greeting}
            </h1>
          </div>
        </div>

        {/* Quick Access 6-Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {quickItems.map((item) => (
            <div
              key={item.id}
              onClick={item.action}
              className="group flex items-center bg-spotify-card/90 hover:bg-spotify-card-hover rounded-2xl border border-white/[0.06] hover:border-spotify-green/30 p-2 pr-3 cursor-pointer transition-all shadow-sm hover:shadow-lg"
            >
              <img
                src={item.cover}
                alt={item.title}
                className="w-14 h-14 rounded-xl object-cover shrink-0 shadow"
              />
              <div className="flex-1 px-3.5 min-w-0">
                <span className="font-bold text-sm text-white truncate block">{item.title}</span>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#10D9A0] to-[#22D3EE] flex items-center justify-center text-[#061214] shadow-lg shadow-teal-500/25 hover:scale-105 transition-transform">
                  <Play size={16} fill="#061214" className="ml-0.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 1: Recently Played */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-white hover:underline cursor-pointer">
            Recently played
          </h2>
          <span className="text-xs font-bold text-spotify-subtext hover:underline cursor-pointer">
            Show all
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {recentlyPlayedSongs.map((song) => (
            <MusicCard key={song.id} item={song} type="song" />
          ))}
        </div>
      </section>

      {/* Section 2: Made For You & Popular Playlists */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-white hover:underline cursor-pointer">
            Made For You
          </h2>
          <span className="text-xs font-bold text-spotify-subtext hover:underline cursor-pointer">
            Show all
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {userPlaylists.slice(0, 5).map((pl) => (
            <MusicCard key={pl.id} item={pl} type="playlist" />
          ))}
        </div>
      </section>

      {/* Section 3: Popular Artists (Matches screenshot 1) */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-white hover:underline cursor-pointer">
            Popular artists
          </h2>
          <span className="text-xs font-bold text-spotify-subtext hover:underline cursor-pointer">
            Show all
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {artists.slice(0, 6).map((art) => (
            <ArtistCard key={art.id} artist={art} />
          ))}
        </div>
      </section>

      {/* Section 4: Popular Albums */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-white hover:underline cursor-pointer">
            Popular albums
          </h2>
          <span className="text-xs font-bold text-spotify-subtext hover:underline cursor-pointer">
            Show all
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {albums.map((alb) => (
            <MusicCard key={alb.id} item={alb} type="album" />
          ))}
        </div>
      </section>

      {/* Section 5: For fans of Benjamin Francis Leftwich (Exact match to screenshot 1!) */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-spotify-subtext">
              Recommended based on your taste
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-white hover:underline cursor-pointer">
              For fans of Benjamin Francis Leftwich
            </h2>
          </div>
          <span className="text-xs font-bold text-spotify-subtext hover:underline cursor-pointer">
            Show all
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {songs.filter((s) => s.artistId === 'art-7' || s.genre.includes('Folk') || s.genre.includes('Ambient')).slice(0, 6).map((song) => (
            <MusicCard key={song.id} item={song} type="song" />
          ))}
        </div>
      </section>
    </div>
  );
};
