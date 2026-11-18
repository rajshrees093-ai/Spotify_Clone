export interface Song {
  id: string;
  title: string;
  artist: string;
  artistId: string;
  album: string;
  albumId: string;
  duration: number; // in seconds
  audioUrl: string;
  coverUrl: string;
  lyrics?: string;
  genre: string;
  playsCount: number;
  addedAt?: string;
  isExplicit?: boolean;
}

export interface Artist {
  id: string;
  name: string;
  bio: string;
  imageUrl: string;
  bannerUrl: string;
  monthlyListeners: number;
  verified: boolean;
  genres: string[];
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  artistId: string;
  coverUrl: string;
  releaseYear: number;
  genre: string;
  albumType: 'album' | 'single' | 'ep' | 'compilation';
  songCount: number;
  duration?: number;
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  isPublic: boolean;
  creator: {
    id: string;
    name: string;
    avatarUrl: string;
  };
  songs: Song[];
  songCount?: number;
  followersCount: number;
  gradientColor?: string;
  createdAt?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  fullName: string;
  avatarUrl: string;
}

export type RepeatMode = 'off' | 'all' | 'one';

export interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  currentTime: number;
  duration: number;
  queue: Song[];
  history: Song[];
  isShuffle: boolean;
  repeatMode: RepeatMode;
  isLyricsOpen: boolean;
  isQueueOpen: boolean;
  isFullscreen: boolean;
  playbackError: string | null;
}
