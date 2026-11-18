import { create } from 'zustand';
import { Song, Artist, Album, Playlist, UserProfile } from '../types';
import { DEMO_PLAYLISTS, DEMO_SONGS, DEMO_ARTISTS, DEMO_ALBUMS } from '../data/mockData';
import { api, DatabaseStats } from '../services/api';

interface LibraryStore {
  user: UserProfile | null;
  songs: Song[];
  artists: Artist[];
  albums: Album[];
  likedSongIds: string[];
  savedAlbumIds: string[];
  followedArtistIds: string[];
  userPlaylists: Playlist[];
  recentHistory: Song[];
  searchQuery: string;
  isCreatePlaylistModalOpen: boolean;
  editingPlaylist: Playlist | null;

  // Live Database Status
  isDbConnected: boolean;
  dbEngine: string;
  dbStats: DatabaseStats | null;
  isLoadingCatalog: boolean;

  // Actions
  initializeFromDatabase: () => Promise<void>;
  setUser: (user: UserProfile | null) => void;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  toggleLikeSong: (songId: string) => void;
  isSongLiked: (songId: string) => boolean;
  toggleSaveAlbum: (albumId: string) => void;
  isAlbumSaved: (albumId: string) => boolean;
  toggleFollowArtist: (artistId: string) => void;
  isArtistFollowed: (artistId: string) => boolean;

  createPlaylist: (title: string, description?: string, coverUrl?: string) => Promise<Playlist>;
  updatePlaylist: (id: string, updates: Partial<Playlist>) => void;
  deletePlaylist: (id: string) => void;
  addSongToPlaylist: (playlistId: string, song: Song) => void;
  removeSongFromPlaylist: (playlistId: string, songId: string) => void;
  recordPlayHistory: (song: Song) => void;

  setSearchQuery: (query: string) => void;
  setCreatePlaylistModalOpen: (open: boolean) => void;
  setEditingPlaylist: (playlist: Playlist | null) => void;
}

const STORAGE_KEY_LIKES = 'pulsewave_liked_songs';
const STORAGE_KEY_PLAYLISTS = 'pulsewave_user_playlists';
const STORAGE_KEY_ALBUMS = 'pulsewave_saved_albums';
const STORAGE_KEY_ARTISTS = 'pulsewave_followed_artists';
const STORAGE_KEY_USER = 'pulsewave_user';

const getInitialLikes = (): string[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_LIKES);
    return saved ? JSON.parse(saved) : ['song-1', 'song-6', 'song-13', 'song-18', 'song-24'];
  } catch {
    return ['song-1', 'song-6', 'song-13'];
  }
};

const getInitialPlaylists = (): Playlist[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_PLAYLISTS);
    return saved ? JSON.parse(saved) : DEMO_PLAYLISTS;
  } catch {
    return DEMO_PLAYLISTS;
  }
};

const getInitialUser = (): UserProfile | null => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_USER);
    return saved
      ? JSON.parse(saved)
      : {
          id: 'usr-demo-1',
          email: 'alex.sound@pulsewave.app',
          username: 'Alex Parker',
          fullName: 'Alex Parker',
          avatarUrl:
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        };
  } catch {
    return null;
  }
};

export const useLibraryStore = create<LibraryStore>((set, get) => ({
  user: getInitialUser(),
  songs: DEMO_SONGS,
  artists: DEMO_ARTISTS,
  albums: DEMO_ALBUMS,
  likedSongIds: getInitialLikes(),
  savedAlbumIds: ['alb-1', 'alb-2', 'alb-5'],
  followedArtistIds: ['art-1', 'art-2', 'art-3', 'art-6'],
  userPlaylists: getInitialPlaylists(),
  recentHistory: [],
  searchQuery: '',
  isCreatePlaylistModalOpen: false,
  editingPlaylist: null,

  isDbConnected: false,
  dbEngine: 'Local Cache',
  dbStats: null,
  isLoadingCatalog: false,

  initializeFromDatabase: async () => {
    set({ isLoadingCatalog: true });
    try {
      const currentUser = get().user;
      const data = await api.getBootstrap(currentUser?.id);

      set({
        songs: data.songs.length > 0 ? data.songs : DEMO_SONGS,
        artists: data.artists.length > 0 ? data.artists : DEMO_ARTISTS,
        albums: data.albums.length > 0 ? data.albums : DEMO_ALBUMS,
        userPlaylists: data.playlists,
        likedSongIds: data.likedSongIds,
        savedAlbumIds: data.savedAlbumIds,
        followedArtistIds: data.followedArtistIds,
        recentHistory: data.recentHistory || [],
        user: currentUser || data.user,
        isDbConnected: Boolean(data.database?.connected),
        dbEngine: data.database?.engine || 'SQLite (pulsewave.db)',
        dbStats: data.database?.stats || null,
        isLoadingCatalog: false,
      });

      // Mirror fresh DB state to localStorage cache
      try {
        localStorage.setItem(STORAGE_KEY_PLAYLISTS, JSON.stringify(data.playlists));
        localStorage.setItem(STORAGE_KEY_LIKES, JSON.stringify(data.likedSongIds));
        localStorage.setItem(STORAGE_KEY_ALBUMS, JSON.stringify(data.savedAlbumIds));
        localStorage.setItem(STORAGE_KEY_ARTISTS, JSON.stringify(data.followedArtistIds));
      } catch {
        // ignore storage quota errors
      }
    } catch (err) {
      console.warn('[Database] Backend API unreachable, running with local fallback cache:', err);
      set({
        isDbConnected: false,
        dbEngine: 'Offline Fallback',
        isLoadingCatalog: false,
      });
    }
  },

  setUser: (user) => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEY_USER);
      }
    } catch {
      // ignore
    }
    set({ user });
    if (user) {
      get().initializeFromDatabase();
    }
  },

  updateProfile: async (updates) => {
    const current = get().user;
    if (!current) return;
    const optimistic = { ...current, ...updates };
    set({ user: optimistic });
    try {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(optimistic));
    } catch {
      // ignore
    }
    try {
      const res = await api.updateUserProfile(current.id, updates);
      if (res.user) {
        set({ user: res.user });
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(res.user));
      }
    } catch {
      // keep optimistic update
    }
  },

  toggleLikeSong: (songId: string) => {
    const current = get().likedSongIds;
    const exists = current.includes(songId);
    const updated = exists ? current.filter((id) => id !== songId) : [songId, ...current];

    try {
      localStorage.setItem(STORAGE_KEY_LIKES, JSON.stringify(updated));
    } catch {
      // ignore
    }
    set({ likedSongIds: updated });

    api
      .toggleLikeSong(songId, get().user?.id)
      .then((res) => {
        set({ likedSongIds: res.likedSongIds, dbStats: res.stats, isDbConnected: true });
        localStorage.setItem(STORAGE_KEY_LIKES, JSON.stringify(res.likedSongIds));
      })
      .catch(() => {});
  },

  isSongLiked: (songId: string) => get().likedSongIds.includes(songId),

  toggleSaveAlbum: (albumId: string) => {
    const current = get().savedAlbumIds;
    const exists = current.includes(albumId);
    const updated = exists ? current.filter((id) => id !== albumId) : [albumId, ...current];
    try {
      localStorage.setItem(STORAGE_KEY_ALBUMS, JSON.stringify(updated));
    } catch {
      // ignore
    }
    set({ savedAlbumIds: updated });

    api
      .toggleSaveAlbum(albumId, get().user?.id)
      .then((res) => {
        set({ savedAlbumIds: res.savedAlbumIds, isDbConnected: true });
        localStorage.setItem(STORAGE_KEY_ALBUMS, JSON.stringify(res.savedAlbumIds));
      })
      .catch(() => {});
  },

  isAlbumSaved: (albumId: string) => get().savedAlbumIds.includes(albumId),

  toggleFollowArtist: (artistId: string) => {
    const current = get().followedArtistIds;
    const exists = current.includes(artistId);
    const updated = exists ? current.filter((id) => id !== artistId) : [artistId, ...current];
    try {
      localStorage.setItem(STORAGE_KEY_ARTISTS, JSON.stringify(updated));
    } catch {
      // ignore
    }
    set({ followedArtistIds: updated });

    api
      .toggleFollowArtist(artistId, get().user?.id)
      .then((res) => {
        set({ followedArtistIds: res.followedArtistIds, isDbConnected: true });
        localStorage.setItem(STORAGE_KEY_ARTISTS, JSON.stringify(res.followedArtistIds));
      })
      .catch(() => {});
  },

  isArtistFollowed: (artistId: string) => get().followedArtistIds.includes(artistId),

  createPlaylist: async (title: string, description = '', coverUrl = '') => {
    const user = get().user;
    const fallbackCover =
      coverUrl ||
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80';

    try {
      const res = await api.createPlaylist({
        title,
        description,
        coverUrl: fallbackCover,
        userId: user?.id,
        creatorName: user?.fullName || 'My Profile',
        creatorAvatar: user?.avatarUrl,
      });

      const updated = [res.playlist, ...get().userPlaylists];
      set({ userPlaylists: updated, dbStats: res.stats, isDbConnected: true });
      localStorage.setItem(STORAGE_KEY_PLAYLISTS, JSON.stringify(updated));
      return res.playlist;
    } catch {
      // Offline fallback
      const newPlaylist: Playlist = {
        id: `pl-${Date.now()}`,
        title,
        description: description || 'Created by you.',
        coverUrl: fallbackCover,
        isPublic: true,
        creator: {
          id: user?.id || 'usr-guest',
          name: user?.fullName || 'My Profile',
          avatarUrl:
            user?.avatarUrl ||
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        },
        songs: [],
        songCount: 0,
        followersCount: 1,
        gradientColor: 'from-purple-900 to-spotify-dark',
        createdAt: 'Just now',
      };

      const updated = [newPlaylist, ...get().userPlaylists];
      try {
        localStorage.setItem(STORAGE_KEY_PLAYLISTS, JSON.stringify(updated));
      } catch {
        // ignore
      }
      set({ userPlaylists: updated });
      return newPlaylist;
    }
  },

  updatePlaylist: (id: string, updates: Partial<Playlist>) => {
    const updated = get().userPlaylists.map((pl) => (pl.id === id ? { ...pl, ...updates } : pl));
    try {
      localStorage.setItem(STORAGE_KEY_PLAYLISTS, JSON.stringify(updated));
    } catch {
      // ignore
    }
    set({ userPlaylists: updated, editingPlaylist: null });

    api
      .updatePlaylist(id, {
        title: updates.title,
        description: updates.description,
        coverUrl: updates.coverUrl,
      })
      .then((res) => {
        if (res.playlist) {
          const synced = get().userPlaylists.map((pl) => (pl.id === id ? res.playlist : pl));
          set({ userPlaylists: synced, isDbConnected: true });
          localStorage.setItem(STORAGE_KEY_PLAYLISTS, JSON.stringify(synced));
        }
      })
      .catch(() => {});
  },

  deletePlaylist: (id: string) => {
    const updated = get().userPlaylists.filter((pl) => pl.id !== id);
    try {
      localStorage.setItem(STORAGE_KEY_PLAYLISTS, JSON.stringify(updated));
    } catch {
      // ignore
    }
    set({ userPlaylists: updated });

    api
      .deletePlaylist(id)
      .then((res) => {
        set({ dbStats: res.stats, isDbConnected: true });
      })
      .catch(() => {});
  },

  addSongToPlaylist: (playlistId: string, song: Song) => {
    const updated = get().userPlaylists.map((pl) => {
      if (pl.id === playlistId) {
        if (pl.songs.some((s) => s.id === song.id)) return pl;
        const newSongs = [...pl.songs, { ...song, addedAt: new Date().toISOString() }];
        return {
          ...pl,
          songs: newSongs,
          songCount: newSongs.length,
        };
      }
      return pl;
    });

    try {
      localStorage.setItem(STORAGE_KEY_PLAYLISTS, JSON.stringify(updated));
    } catch {
      // ignore
    }
    set({ userPlaylists: updated });

    api
      .addSongToPlaylist(playlistId, song.id)
      .then((res) => {
        if (res.playlist) {
          const synced = get().userPlaylists.map((pl) => (pl.id === playlistId ? res.playlist : pl));
          set({ userPlaylists: synced, isDbConnected: true });
          localStorage.setItem(STORAGE_KEY_PLAYLISTS, JSON.stringify(synced));
        }
      })
      .catch(() => {});
  },

  removeSongFromPlaylist: (playlistId: string, songId: string) => {
    const updated = get().userPlaylists.map((pl) => {
      if (pl.id === playlistId) {
        const newSongs = pl.songs.filter((s) => s.id !== songId);
        return {
          ...pl,
          songs: newSongs,
          songCount: newSongs.length,
        };
      }
      return pl;
    });

    try {
      localStorage.setItem(STORAGE_KEY_PLAYLISTS, JSON.stringify(updated));
    } catch {
      // ignore
    }
    set({ userPlaylists: updated });

    api
      .removeSongFromPlaylist(playlistId, songId)
      .then((res) => {
        if (res.playlist) {
          const synced = get().userPlaylists.map((pl) => (pl.id === playlistId ? res.playlist : pl));
          set({ userPlaylists: synced, isDbConnected: true });
          localStorage.setItem(STORAGE_KEY_PLAYLISTS, JSON.stringify(synced));
        }
      })
      .catch(() => {});
  },

  recordPlayHistory: (song: Song) => {
    set((state) => ({
      recentHistory: [song, ...state.recentHistory.filter((s) => s.id !== song.id)].slice(0, 20),
    }));

    api
      .recordHistory(song.id, get().user?.id)
      .then((res) => {
        set({ dbStats: res.stats, isDbConnected: true });
      })
      .catch(() => {});
  },

  setSearchQuery: (query: string) => set({ searchQuery: query }),
  setCreatePlaylistModalOpen: (open: boolean) => set({ isCreatePlaylistModalOpen: open }),
  setEditingPlaylist: (playlist: Playlist | null) => set({ editingPlaylist: playlist }),
}));
