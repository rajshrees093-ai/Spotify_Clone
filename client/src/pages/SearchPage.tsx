import React, { useState } from 'react';
import { Search as SearchIcon, Play } from 'lucide-react';
import { useLibraryStore } from '../stores/useLibraryStore';
import { usePlayerStore } from '../stores/usePlayerStore';
import { BROWSE_GENRES } from '../data/mockData';
import { SongRow } from '../components/SongRow';
import { MusicCard } from '../components/MusicCard';
import { ArtistCard } from '../components/ArtistCard';
import { useNavigate } from 'react-router-dom';

export const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const { songs, artists, albums, userPlaylists, searchQuery, setSearchQuery } = useLibraryStore();
  const { playSong } = usePlayerStore();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'songs' | 'artists' | 'albums' | 'playlists'>('all');

  const query = searchQuery.trim().toLowerCase();

  // Filter items from live DB-hydrated store
  const matchedSongs = query
    ? songs.filter(
        (s) =>
          s.title.toLowerCase().includes(query) ||
          s.artist.toLowerCase().includes(query) ||
          s.genre.toLowerCase().includes(query)
      )
    : [];

  const matchedArtists = query
    ? artists.filter(
        (a) =>
          a.name.toLowerCase().includes(query) ||
          a.genres.some((g) => g.toLowerCase().includes(query))
      )
    : [];

  const matchedAlbums = query
    ? albums.filter(
        (alb) =>
          alb.title.toLowerCase().includes(query) ||
          alb.artist.toLowerCase().includes(query) ||
          alb.genre.toLowerCase().includes(query)
      )
    : [];

  const matchedPlaylists = query
    ? userPlaylists.filter(
        (pl) =>
          pl.title.toLowerCase().includes(query) ||
          pl.description.toLowerCase().includes(query)
      )
    : [];

  const topResult = matchedSongs[0] || null;

  return (
    <div className="min-h-full pb-28 px-6 md:px-8 pt-4 space-y-8">
      {/* Search Filter Tabs (When searching) */}
      {query && (
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {(['all', 'songs', 'artists', 'albums', 'playlists'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedFilter(tab)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-colors ${
                selectedFilter === tab
                  ? 'bg-white text-black'
                  : 'bg-[#242424] text-white hover:bg-[#2e2e2e]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      )}

      {/* If No Query: Render Browse All Categories */}
      {!query ? (
        <section>
          <h2 className="text-2xl font-black text-white tracking-tight mb-5">Browse all</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {BROWSE_GENRES.map((cat) => (
              <div
                key={cat.id}
                onClick={() => setSearchQuery(cat.name)}
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
      ) : (
        /* If Query: Render Search Results */
        <div className="space-y-10">
          {/* Top Result & Top 4 Songs */}
          {(selectedFilter === 'all' || selectedFilter === 'songs') && topResult && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Top Result Card */}
              <div className="lg:col-span-5 flex flex-col">
                <h3 className="text-xl font-bold text-white mb-3">Top result</h3>
                <div
                  onClick={() => playSong(topResult)}
                  className="bg-[#181818] hover:bg-[#282828] p-6 rounded-2xl flex-1 flex flex-col justify-between cursor-pointer group relative transition-colors shadow-lg"
                >
                  <img
                    src={topResult.coverUrl}
                    alt={topResult.title}
                    className="w-24 h-24 rounded-lg object-cover shadow-2xl mb-4"
                  />
                  <div>
                    <h2 className="text-2xl md:text-3xl font-black text-white truncate mb-1">
                      {topResult.title}
                    </h2>
                    <p className="text-sm text-spotify-subtext font-medium flex items-center gap-2">
                      <span className="text-white hover:underline">{topResult.artist}</span>
                      <span className="bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Song
                      </span>
                    </p>
                  </div>

                  {/* Play Button */}
                  <div className="absolute right-6 bottom-6 w-12 h-12 rounded-full bg-spotify-green text-black flex items-center justify-center shadow-xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:scale-105">
                    <Play size={22} fill="black" className="ml-0.5" />
                  </div>
                </div>
              </div>

              {/* Songs Column */}
              <div className="lg:col-span-7 flex flex-col">
                <h3 className="text-xl font-bold text-white mb-3">Songs</h3>
                <div className="space-y-1">
                  {matchedSongs.slice(0, 4).map((song, idx) => (
                    <SongRow
                      key={song.id}
                      song={song}
                      index={idx}
                      playlistContext={matchedSongs}
                      showAlbum={false}
                      showDateAdded={false}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Artists */}
          {(selectedFilter === 'all' || selectedFilter === 'artists') && matchedArtists.length > 0 && (
            <section>
              <h3 className="text-xl font-bold text-white mb-4">Artists</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {matchedArtists.map((artist) => (
                  <ArtistCard key={artist.id} artist={artist} />
                ))}
              </div>
            </section>
          )}

          {/* Albums */}
          {(selectedFilter === 'all' || selectedFilter === 'albums') && matchedAlbums.length > 0 && (
            <section>
              <h3 className="text-xl font-bold text-white mb-4">Albums</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {matchedAlbums.map((alb) => (
                  <MusicCard key={alb.id} item={alb} type="album" />
                ))}
              </div>
            </section>
          )}

          {/* Playlists */}
          {(selectedFilter === 'all' || selectedFilter === 'playlists') && matchedPlaylists.length > 0 && (
            <section>
              <h3 className="text-xl font-bold text-white mb-4">Playlists</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {matchedPlaylists.map((pl) => (
                  <MusicCard key={pl.id} item={pl} type="playlist" />
                ))}
              </div>
            </section>
          )}

          {/* Empty search results fallback */}
          {matchedSongs.length === 0 &&
            matchedArtists.length === 0 &&
            matchedAlbums.length === 0 &&
            matchedPlaylists.length === 0 && (
              <div className="text-center py-20 text-spotify-subtext">
                <p className="text-xl text-white font-bold mb-2">No results found for "{searchQuery}"</p>
                <p className="text-sm">Please make sure your words are spelled correctly, or try using less or different keywords.</p>
              </div>
            )}
        </div>
      )}
    </div>
  );
};
