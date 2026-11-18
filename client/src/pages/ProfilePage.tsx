import React, { useState } from 'react';
import { Camera, Edit3, Music, Heart, Users, Sparkles } from 'lucide-react';
import { useLibraryStore } from '../stores/useLibraryStore';
import { MusicCard } from '../components/MusicCard';
import { SongRow } from '../components/SongRow';

export const ProfilePage: React.FC = () => {
  const { user, songs, recentHistory, updateProfile, userPlaylists, likedSongIds, followedArtistIds } =
    useLibraryStore();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.fullName || 'Alex Parker');
  const [avatar, setAvatar] = useState(
    user?.avatarUrl ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
  );

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      await updateProfile({
        fullName: name.trim() || user.fullName,
        username: name.trim().toLowerCase().replace(/\s+/g, '') || user.username,
        avatarUrl: avatar.trim() || user.avatarUrl,
      });
    }
    setIsEditing(false);
  };

  const likedSongs = songs.filter((s) => likedSongIds.includes(s.id));

  return (
    <div className="min-h-full pb-28">
      {/* Profile Header */}
      <div className="bg-gradient-to-b from-[#24354a] to-spotify-dark p-6 md:p-8 flex flex-col sm:flex-row items-end gap-6 pt-12 md:pt-16">
        <div
          onClick={() => setIsEditing(true)}
          className="w-44 h-44 sm:w-52 sm:h-52 rounded-full overflow-hidden shadow-2xl shrink-0 border-4 border-white/10 group relative cursor-pointer"
        >
          <img
            src={user?.avatarUrl || avatar}
            alt={user?.fullName || 'Profile'}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity gap-1">
            <Camera size={26} />
            <span className="text-xs font-bold">Choose photo</span>
          </div>
        </div>

        <div className="flex flex-col min-w-0">
          <span className="text-xs font-bold uppercase tracking-wider text-white">Profile</span>
          <h1
            onClick={() => setIsEditing(true)}
            className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight py-2 truncate cursor-pointer hover:underline"
          >
            {user?.fullName || 'User Profile'}
          </h1>

          <div className="flex items-center gap-2 text-xs font-semibold text-white/90">
            <span>{userPlaylists.length} Public Playlists</span>
            <span>•</span>
            <span>{likedSongIds.length} Liked Songs</span>
            <span>•</span>
            <span>{followedArtistIds.length} Following</span>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#282828] w-full max-w-md rounded-xl p-6 shadow-2xl border border-white/10 space-y-4">
            <h3 className="text-lg font-bold text-white">Edit profile</h3>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-spotify-subtext mb-1 uppercase">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#3e3e3e] text-white text-sm rounded px-3 py-2 outline-none focus:ring-1 focus:ring-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-spotify-subtext mb-1 uppercase">
                  Avatar Image URL
                </label>
                <input
                  type="url"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  className="w-full bg-[#3e3e3e] text-white text-xs rounded px-3 py-2 outline-none focus:ring-1 focus:ring-white"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="text-xs font-bold text-white px-4 py-2 hover:underline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-white text-black font-bold text-xs px-6 py-2 rounded-full hover:scale-105 transition-transform"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Playlists created */}
      <div className="px-6 md:px-8 mt-8 space-y-10">
        <section>
          <h2 className="text-xl md:text-2xl font-bold text-white mb-4">Public Playlists</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {userPlaylists.map((pl) => (
              <MusicCard key={pl.id} item={pl} type="playlist" />
            ))}
          </div>
        </section>

        {/* Favorite Songs Preview */}
        {likedSongs.length > 0 && (
          <section>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4">Favorite Tracks</h2>
            <div className="space-y-1 max-w-4xl">
              {likedSongs.slice(0, 5).map((song, idx) => (
                <SongRow
                  key={song.id}
                  song={song}
                  index={idx}
                  playlistContext={likedSongs}
                  showAlbum={true}
                  showDateAdded={false}
                />
              ))}
            </div>
          </section>
        )}

        {/* Recently Played History from Database */}
        {recentHistory.length > 0 && (
          <section>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4">Recently Played</h2>
            <div className="space-y-1 max-w-4xl">
              {recentHistory.slice(0, 5).map((song, idx) => (
                <SongRow
                  key={`${song.id}-hist-${idx}`}
                  song={song}
                  index={idx}
                  playlistContext={recentHistory}
                  showAlbum={true}
                  showDateAdded={false}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
