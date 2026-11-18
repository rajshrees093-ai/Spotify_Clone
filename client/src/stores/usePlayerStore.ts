import { create } from 'zustand';
import { Song, RepeatMode } from '../types';
import { DEMO_SONGS } from '../data/mockData';
import { useLibraryStore } from './useLibraryStore';

interface PlayerStore {
  currentSong: Song | null;
  isPlaying: boolean;
  volume: number;
  prevVolume: number;
  isMuted: boolean;
  currentTime: number;
  duration: number;
  queue: Song[];
  history: Song[];
  isShuffle: boolean;
  repeatMode: RepeatMode;
  isLyricsOpen: boolean;
  isQueueOpen: boolean;
  isRightPanelOpen: boolean;
  isFriendActivityOpen: boolean;
  isFullscreen: boolean;
  playbackError: string | null;

  // Actions
  playSong: (song: Song, newQueue?: Song[]) => void;
  togglePlay: () => void;
  pause: () => void;
  resume: () => void;
  nextSong: () => void;
  prevSong: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  cycleRepeatMode: () => void;
  addToQueue: (song: Song) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  toggleLyrics: () => void;
  toggleQueue: () => void;
  toggleRightPanel: () => void;
  toggleFriendActivity: () => void;
  toggleFullscreen: () => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setPlaybackError: (error: string | null) => void;
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  currentSong: DEMO_SONGS[0], // Preloaded with "No New Friends" as in screenshot!
  isPlaying: false,
  volume: 0.75,
  prevVolume: 0.75,
  isMuted: false,
  currentTime: 0,
  duration: DEMO_SONGS[0].duration,
  queue: DEMO_SONGS.slice(1, 15),
  history: [],
  isShuffle: false,
  repeatMode: 'off',
  isLyricsOpen: false,
  isQueueOpen: false,
  isRightPanelOpen: false,
  isFriendActivityOpen: false,
  isFullscreen: false,
  playbackError: null,

  playSong: (song, newQueue) => {
    const { currentSong, history, queue } = get();
    const updatedHistory = currentSong ? [currentSong, ...history.slice(0, 49)] : history;
    
    let updatedQueue = newQueue ? [...newQueue] : [...queue];
    // Filter current song out of the queue front if present
    updatedQueue = updatedQueue.filter((s) => s.id !== song.id);

    set({
      currentSong: song,
      isPlaying: true,
      currentTime: 0,
      duration: song.duration,
      history: updatedHistory,
      queue: updatedQueue,
      playbackError: null,
    });

    // Persist play event to SQLite listening_history
    useLibraryStore.getState().recordPlayHistory(song);
  },

  togglePlay: () => {
    const { isPlaying, currentSong } = get();
    if (!currentSong) {
      if (DEMO_SONGS.length > 0) {
        get().playSong(DEMO_SONGS[0]);
      }
      return;
    }
    set({ isPlaying: !isPlaying });
  },

  pause: () => set({ isPlaying: false }),
  resume: () => set({ isPlaying: true }),

  nextSong: () => {
    const { queue, isShuffle, repeatMode, currentSong, history } = get();

    if (repeatMode === 'one' && currentSong) {
      set({ currentTime: 0, isPlaying: true });
      return;
    }

    if (queue.length === 0) {
      if (repeatMode === 'all' && history.length > 0) {
        // loop back through history
        const reversedHistory = [...history].reverse();
        const next = reversedHistory[0];
        set({
          currentSong: next,
          isPlaying: true,
          queue: reversedHistory.slice(1),
          currentTime: 0,
          duration: next.duration,
        });
      } else {
        set({ isPlaying: false, currentTime: 0 });
      }
      return;
    }

    let nextIndex = 0;
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * queue.length);
    }

    const nextSong = queue[nextIndex];
    const newQueue = queue.filter((_, idx) => idx !== nextIndex);
    const updatedHistory = currentSong ? [currentSong, ...history] : history;

    set({
      currentSong: nextSong,
      isPlaying: true,
      currentTime: 0,
      duration: nextSong.duration,
      queue: newQueue,
      history: updatedHistory,
    });
  },

  prevSong: () => {
    const { currentTime, history, currentSong, queue } = get();

    // If more than 3 seconds in, restart track
    if (currentTime > 3 || history.length === 0) {
      set({ currentTime: 0 });
      return;
    }

    const prevSong = history[0];
    const updatedHistory = history.slice(1);
    const updatedQueue = currentSong ? [currentSong, ...queue] : queue;

    set({
      currentSong: prevSong,
      isPlaying: true,
      currentTime: 0,
      duration: prevSong.duration,
      history: updatedHistory,
      queue: updatedQueue,
    });
  },

  seek: (time: number) => {
    set({ currentTime: Math.max(0, Math.min(time, get().duration || 100)) });
  },

  setVolume: (volume: number) => {
    const clamped = Math.max(0, Math.min(1, volume));
    set({ volume: clamped, isMuted: clamped === 0 });
  },

  toggleMute: () => {
    const { isMuted, volume, prevVolume } = get();
    if (isMuted) {
      set({ isMuted: false, volume: prevVolume || 0.5 });
    } else {
      set({ isMuted: true, prevVolume: volume, volume: 0 });
    }
  },

  toggleShuffle: () => set((state) => ({ isShuffle: !state.isShuffle })),

  cycleRepeatMode: () => {
    const current = get().repeatMode;
    const next: RepeatMode = current === 'off' ? 'all' : current === 'all' ? 'one' : 'off';
    set({ repeatMode: next });
  },

  addToQueue: (song: Song) => {
    set((state) => ({ queue: [...state.queue, song] }));
  },

  removeFromQueue: (index: number) => {
    set((state) => ({
      queue: state.queue.filter((_, i) => i !== index),
    }));
  },

  clearQueue: () => set({ queue: [] }),

  toggleLyrics: () => set((state) => ({ isLyricsOpen: !state.isLyricsOpen, isQueueOpen: false })),
  toggleQueue: () => set((state) => ({ isQueueOpen: !state.isQueueOpen, isLyricsOpen: false })),
  toggleRightPanel: () => set((state) => ({ isRightPanelOpen: !state.isRightPanelOpen })),
  toggleFriendActivity: () => set((state) => ({ isFriendActivityOpen: !state.isFriendActivityOpen })),
  toggleFullscreen: () => set((state) => ({ isFullscreen: !state.isFullscreen })),

  setCurrentTime: (currentTime: number) => set({ currentTime }),
  setDuration: (duration: number) => set({ duration }),
  setPlaybackError: (playbackError: string | null) => set({ playbackError }),
}));
