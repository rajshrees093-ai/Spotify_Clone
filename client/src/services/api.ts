import { Song, Artist, Album, Playlist, UserProfile } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export interface DatabaseStats {
  users: number;
  artists: number;
  albums: number;
  songs: number;
  playlists: number;
  likedSongs: number;
  listeningHistory: number;
}

export interface BootstrapResponse {
  database: {
    engine: string;
    connected: boolean;
    stats: DatabaseStats;
  };
  user: UserProfile | null;
  songs: Song[];
  artists: Artist[];
  albums: Album[];
  playlists: Playlist[];
  likedSongIds: string[];
  savedAlbumIds: string[];
  followedArtistIds: string[];
  recentHistory: Song[];
}

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    throw new Error(errBody.error || `API request failed: ${res.status}`);
  }
  return res.json();
}

export const api = {
  getHealth() {
    return request<{ status: string; database: { engine: string; connected: boolean; stats: DatabaseStats } }>('/health');
  },

  getBootstrap(userId?: string) {
    const query = userId ? `?userId=${encodeURIComponent(userId)}` : '';
    return request<BootstrapResponse>(`/bootstrap${query}`);
  },

  searchCatalog(q: string) {
    return request<{ songs: Song[]; artists: Artist[]; albums: Album[]; playlists: Playlist[] }>(
      `/search?q=${encodeURIComponent(q)}`
    );
  },

  createPlaylist(payload: {
    title: string;
    description?: string;
    coverUrl?: string;
    userId?: string;
    creatorName?: string;
    creatorAvatar?: string;
  }) {
    return request<{ playlist: Playlist; stats: DatabaseStats }>('/playlists', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  updatePlaylist(id: string, payload: Partial<{ title: string; description: string; coverUrl: string }>) {
    return request<{ playlist: Playlist }>(`/playlists/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  deletePlaylist(id: string) {
    return request<{ deleted: boolean; id: string; stats: DatabaseStats }>(
      `/playlists/${encodeURIComponent(id)}`,
      { method: 'DELETE' }
    );
  },

  addSongToPlaylist(playlistId: string, songId: string) {
    return request<{ playlist: Playlist }>(
      `/playlists/${encodeURIComponent(playlistId)}/songs`,
      {
        method: 'POST',
        body: JSON.stringify({ songId }),
      }
    );
  },

  removeSongFromPlaylist(playlistId: string, songId: string) {
    return request<{ playlist: Playlist }>(
      `/playlists/${encodeURIComponent(playlistId)}/songs/${encodeURIComponent(songId)}`,
      { method: 'DELETE' }
    );
  },

  toggleLikeSong(songId: string, userId?: string) {
    return request<{ liked: boolean; likedSongIds: string[]; stats: DatabaseStats }>('/likes/toggle', {
      method: 'POST',
      body: JSON.stringify({ songId, userId }),
    });
  },

  toggleSaveAlbum(albumId: string, userId?: string) {
    return request<{ saved: boolean; savedAlbumIds: string[] }>('/albums/save/toggle', {
      method: 'POST',
      body: JSON.stringify({ albumId, userId }),
    });
  },

  toggleFollowArtist(artistId: string, userId?: string) {
    return request<{ followed: boolean; followedArtistIds: string[] }>('/artists/follow/toggle', {
      method: 'POST',
      body: JSON.stringify({ artistId, userId }),
    });
  },

  recordHistory(songId: string, userId?: string) {
    return request<{ success: boolean; stats: DatabaseStats }>('/history', {
      method: 'POST',
      body: JSON.stringify({ songId, userId }),
    });
  },

  updateUserProfile(userId: string, payload: Partial<UserProfile>) {
    return request<{ user: UserProfile }>(`/users/${encodeURIComponent(userId)}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  loginLocalDb(email: string) {
    return request<{ user: UserProfile }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  signupLocalDb(email: string, username?: string) {
    return request<{ user: UserProfile }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, username }),
    });
  },

  resolveSongAudio(songId: string) {
    return request<{ audioUrl: string; coverUrl?: string; source: 'upload' | 'official_preview' | 'fallback' }>(
      `/songs/${encodeURIComponent(songId)}/audio`
    );
  },

  async fetchDirectPreview(title: string, artist: string): Promise<string | null> {
    const cleanTitle = title.replace(/\(.*?\)|\[.*?\]/g, '').trim();
    const primaryArtist = artist.split(',')[0].replace(/\(.*?\)/g, '').trim();
    const query = `${cleanTitle} ${primaryArtist}`.trim();
    for (const country of ['IN', 'US']) {
      try {
        const res = await fetch(
          `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=3&country=${country}`
        );
        if (!res.ok) continue;
        const data = await res.json();
        const match = data.results?.find((r: { previewUrl?: string }) => Boolean(r.previewUrl));
        if (match?.previewUrl) return match.previewUrl;
      } catch {
        // try next country
      }
    }
    return null;
  },

  uploadSong(payload: {
    title: string;
    artist: string;
    album?: string;
    genre: string;
    duration?: number;
    lyrics?: string;
    coverUrl?: string;
    fileName: string;
    audioBase64: string;
  }) {
    return request<{ song: Song; stats: DatabaseStats }>('/upload', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
