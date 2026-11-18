import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { MusicPlayer } from './components/MusicPlayer';
import { FriendActivity } from './components/FriendActivity';
import { NowPlayingPanel } from './components/NowPlayingPanel';
import { LyricsPanel } from './components/LyricsPanel';
import { QueuePanel } from './components/QueuePanel';
import { FullscreenPlayer } from './components/FullscreenPlayer';
import { PlaylistModal } from './components/PlaylistModal';
import { AuthModal } from './components/AuthModal';

import { HomePage } from './pages/HomePage';
import { SearchPage } from './pages/SearchPage';
import { BrowsePage } from './pages/BrowsePage';
import { PlaylistPage } from './pages/PlaylistPage';
import { AlbumPage } from './pages/AlbumPage';
import { ArtistPage } from './pages/ArtistPage';
import { ProfilePage } from './pages/ProfilePage';
import { useLibraryStore } from './stores/useLibraryStore';

// Scroll to top helper on navigation
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    const mainEl = document.getElementById('main-scroll-container');
    if (mainEl) mainEl.scrollTop = 0;
  }, [pathname]);
  return null;
};

export const AppContent: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const initializeFromDatabase = useLibraryStore((s) => s.initializeFromDatabase);

  useEffect(() => {
    initializeFromDatabase();
  }, [initializeFromDatabase]);

  return (
    <div className="flex flex-col h-screen w-screen bg-spotify-black overflow-hidden font-sans text-white">
      <ScrollToTop />

      {/* Main App Workspace: Left Sidebar + Center Scrollable Content + Right Panels */}
      <div className="flex-1 flex min-h-0 relative overflow-hidden">
        {/* Left Collapsible Sidebar */}
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        {/* Center Main Stage */}
        <div className="flex-1 flex flex-col min-w-0 bg-spotify-dark rounded-2xl border border-white/[0.06] my-2 mr-2 overflow-hidden relative shadow-2xl">
          {/* Top Fixed Header Navbar */}
          <Navbar onOpenAuth={() => setIsAuthModalOpen(true)} />

          {/* Scrollable Viewport */}
          <main
            id="main-scroll-container"
            className="flex-1 overflow-y-auto overflow-x-hidden relative"
          >
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/browse" element={<BrowsePage />} />
              <Route path="/playlist/:id" element={<PlaylistPage />} />
              <Route path="/album/:id" element={<AlbumPage />} />
              <Route path="/artist/:id" element={<ArtistPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
          </main>

          {/* Full Screen Overlays & Drawers (Lyrics & Queue) */}
          <LyricsPanel />
          <QueuePanel />
        </div>

        {/* Right Panels (Friend Activity or Now Playing / Artist Info) */}
        <FriendActivity />
        <NowPlayingPanel />
      </div>

      {/* Persistent Bottom Audio Player */}
      <MusicPlayer />

      {/* Modals & Fullscreen Player */}
      <FullscreenPlayer />
      <PlaylistModal />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
