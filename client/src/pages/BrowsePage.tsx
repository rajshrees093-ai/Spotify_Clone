import React from 'react';
import { BROWSE_GENRES } from '../data/mockData';
import { MusicCard } from '../components/MusicCard';
import { useNavigate } from 'react-router-dom';
import { useLibraryStore } from '../stores/useLibraryStore';

export const BrowsePage: React.FC = () => {
  const navigate = useNavigate();
  const { userPlaylists, setSearchQuery } = useLibraryStore();

  return (
    <div className="min-h-full pb-28 px-6 md:px-8 pt-6 space-y-10">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight mb-2">Browse & Discover</h1>
        <p className="text-sm text-spotify-subtext">Explore by mood, genre, trending charts, and new releases.</p>
      </div>

      {/* Categories Grid */}
      <section>
        <h2 className="text-xl font-bold text-white mb-4">Genres & Moods</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {BROWSE_GENRES.map((cat) => (
            <div
              key={cat.id}
              onClick={() => {
                setSearchQuery(cat.name);
                navigate('/search');
              }}
              className={`${cat.color} aspect-square rounded-xl p-4 overflow-hidden relative cursor-pointer hover:scale-[1.02] transition-transform shadow-lg group`}
            >
              <h3 className="text-lg md:text-xl font-bold text-white break-words max-w-[80%] leading-tight">
                {cat.name}
              </h3>
              <img
                src={cat.image}
                alt={cat.name}
                className="w-24 h-24 object-cover absolute -bottom-2 -right-3 rotate-[25deg] shadow-2xl rounded-md group-hover:rotate-[20deg] transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Featured Playlists */}
      <section>
        <h2 className="text-xl font-bold text-white mb-4">Featured Playlists</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {userPlaylists.slice(0, 6).map((pl) => (
            <MusicCard key={pl.id} item={pl} type="playlist" />
          ))}
        </div>
      </section>
    </div>
  );
};
