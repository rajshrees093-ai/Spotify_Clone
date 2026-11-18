# Spotify Clone — Premium Music Streaming Web App 🎵

A production-ready, full-stack, Spotify-inspired web player built with **React 18, Vite, TypeScript, Tailwind CSS, Zustand, Node.js, Express, and Supabase PostgreSQL**.

---

## ✨ Features & Visual Accuracy

The application faithfully recreates the layout, typography, interaction design, and fluid transitions of the Spotify Web Player, directly incorporating the designs from the user reference screenshots:

1. **Dashboard Home View (Screenshot 1):**
   - Dynamic time-based greeting (*"Good morning" / "Good afternoon" / "Good evening"*).
   - 6-tile Quick Access Recently Played grid with hover green play button.
   - Carousels for *Recently Played*, *Made For You*, *Popular Artists*, *Popular Albums*, and *For fans of Benjamin Francis Leftwich*.
   - Live **Friend Activity** right-hand panel displaying current listening status, avatars, tracks, and timestamps.

2. **Album & EP Detail Page (Screenshot 2):**
   - Full replication of the **No New Friends EP (Sia, Diplo, Labrinth / LSD)** layout.
   - Large green `PLAY`/`PAUSE` pill, `SAVE` pill, and `...` options menu.
   - Song table with track numbers, green speaker equalizer wave animation for currently playing track, add button, duration, and copyright notices.
   - *"More by [Artist]"* music recommendations carousel below.

3. **Fullscreen Focused Now Playing Mode (Screenshot 3):**
   - Immersive fullscreen mode featuring massive album artwork, subtle atmospheric background gradient, and large typography (*Daily Mix 1* / *Let It In - Dream on Dreamer*).
   - Full timeline scrubber, volume controls, lyrics toggle, and queue shortcut.

4. **Track & Artist View with Right Panel (Screenshot 4):**
   - Top track banner with lyrics preview on the left and featured artist circles.
   - Dedicated **"About the Artist"** right sidebar containing high-resolution artist photography, verified artist badge, real-time monthly listeners (*73,211,512 monthly listeners*), bio, and **Follow/Following** state.
   - Interactive synced lyrics panel with current line highlighting and ambient background.

5. **Collaborative Playlist & Context Menu (Screenshot 5):**
   - Collaborative playlist view matching the **Office** playlist with dynamic header gradient and 2x2 album cover collage.
   - Rich interactive context menu:
     - *Add to queue*
     - *Go to playlist radio*
     - *Edit details* (modal to update playlist title, description, and cover photo)
     - *Delete playlist*
     - *Share* (copies link to clipboard)

6. **Fully Functional Audio Player with Dual Engine:**
   - Real audio stream playback via HTML5 Audio API.
   - **Automated Web Audio Synthesizer Fallback:** If any network audio stream is blocked, offline, or restricted by CORS, an integrated Web Audio synthesizer seamlessly takes over to play procedural melodic chord progressions so playback never stutters or fails.
   - Keyboard controls:
     - `Space`: Play / Pause toggle
     - `ArrowRight` / `ArrowLeft`: Seek ±5 seconds
     - `ArrowUp` / `ArrowDown`: Adjust volume ±5%
   - Shuffle, repeat (off, loop all, loop one), scrubber drag, and mute controls.

7. **Dual-Mode Backend & Auth:**
   - **Out-of-the-box Demo Mode:** Works with 100% full functionality immediately without entering any API keys or credentials. Playlists, liked songs, followed artists, and profile edits persist in `localStorage`.
   - **Full Supabase Mode:** When `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are provided, the app connects directly to Supabase Auth and PostgreSQL database with Row Level Security (RLS).

---

## 🚀 Tech Stack

- **Frontend:** React 18, Vite, TypeScript
- **Styling:** Tailwind CSS (Custom Spotify dark theme `#000000`, `#121212`, `#181818`, `#282828`, `#1DB954`)
- **Icons:** Lucide React
- **State Management:** Zustand (persistent stores for player, library, and user profile)
- **Routing:** React Router v6
- **Audio Engine:** HTML5 Audio API + Web Audio Procedural Synthesizer
- **Backend:** Node.js, Express.js, CORS, Morgan
- **Database:** Supabase PostgreSQL with Row Level Security policies
- **Deployment:** Vercel (Frontend) & Render (Backend)

---

## 📁 Project Structure

```text
Spotify_clone/
├── client/                     # Frontend Vite + React + TS
│   ├── public/                 # Static assets & favicons
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Navbar.tsx             # Top navigation & search
│   │   │   ├── Sidebar.tsx            # Left collapsible library
│   │   │   ├── MusicPlayer.tsx        # Bottom persistent audio player
│   │   │   ├── FullscreenPlayer.tsx   # Immersive fullscreen mode
│   │   │   ├── FriendActivity.tsx     # Right friend activity feed
│   │   │   ├── NowPlayingPanel.tsx    # "About the Artist" panel
│   │   │   ├── LyricsPanel.tsx        # Synced lyrics viewer
│   │   │   ├── QueuePanel.tsx         # Playback queue drawer
│   │   │   ├── SongRow.tsx            # Table song row with equalizer
│   │   │   ├── MusicCard.tsx          # Card with hover green play button
│   │   │   ├── ArtistCard.tsx         # Circular artist card
│   │   │   ├── PlaylistModal.tsx      # Create/Edit playlist modal
│   │   │   └── AuthModal.tsx          # Supabase & 1-click Demo Auth
│   │   ├── data/
│   │   │   └── mockData.ts            # 32+ songs, 6 albums, 8 artists, 9 playlists
│   │   ├── pages/
│   │   │   ├── HomePage.tsx           # Main dashboard
│   │   │   ├── SearchPage.tsx         # Search & Browse categories
│   │   │   ├── BrowsePage.tsx         # Genre explore page
│   │   │   ├── PlaylistPage.tsx       # Playlist details & tracks
│   │   │   ├── AlbumPage.tsx          # Album/EP details
│   │   │   ├── ArtistPage.tsx         # Artist page & discography
│   │   │   └── ProfilePage.tsx        # User profile & public playlists
│   │   ├── services/
│   │   │   └── supabase.ts            # Supabase client & fallback auth
│   │   ├── stores/
│   │   │   ├── usePlayerStore.ts      # Zustand player state
│   │   │   └── useLibraryStore.ts     # Zustand library & playlist state
│   │   ├── types/
│   │   │   └── index.ts               # Complete TypeScript types
│   │   └── utils/
│   │       ├── audioSynthesizer.ts    # Web Audio API procedural synth
│   │       └── formatters.ts          # Duration and number formatters
│   ├── index.html
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── vite.config.ts
├── server/                     # Backend Node.js + Express
│   ├── src/
│   │   ├── data.js             # Catalog data provider
│   │   └── index.js            # Express REST API routes & healthcheck
│   └── package.json
├── supabase/
│   └── schema.sql              # Supabase PostgreSQL schema, RLS, triggers & seed
├── vercel.json                 # Vercel deployment configuration
├── render.yaml                 # Render deployment configuration
├── .env.example                # Root environment variable template
└── package.json                # Root scripts for concurrent execution
```

---

## 🛠️ Quick Start & Local Run

### Prerequisites
- Node.js (v18 or higher, tested on v24)
- npm

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd Spotify_clone

# Install client packages
npm --prefix client install

# Install server packages
npm --prefix server install
```

### 2. Run Locally

To start the **frontend Vite dev server**:
```bash
npm run client
# -> Available at http://localhost:5173
```

To start the **backend Express API**:
```bash
npm run server
# -> Available at http://localhost:5000
```

To run both concurrently:
```bash
npm run dev:all
```

---

## 🗄️ Sample SQLite Database (Connected Out-of-the-Box)

The backend ships with a persistent, pre-seeded **SQLite** database (`server/database/spotify.db`) powered by Node.js's built-in `node:sqlite` module — no external database installation required!

### Included Tables
- `users`, `artists`, `albums`, `songs`
- `playlists`, `playlist_songs`
- `liked_songs`, `saved_albums`, `followed_artists`, `listening_history`

### Seed / Reset Commands
```bash
# Seed the database (auto-runs on server startup if empty)
npm --prefix server run seed

# Wipe and re-seed fresh sample data
npm --prefix server run seed:reset
```

The frontend automatically connects to the database via `/api/bootstrap` and shows a live **`SQLite DB`** status pill in the top navigation bar with live row counts and a refresh button.

---

## 🗄️ Supabase PostgreSQL Setup (Optional)

If you wish to connect your own Supabase project:

1. Create a project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase dashboard.
3. Paste and run the complete script from [supabase/schema.sql](file:///c:/Users/rajsh/Spotify_clone/supabase/schema.sql).
4. Retrieve your `Project URL` and `anon public key` from **Project Settings > API**.
5. Create a `client/.env` file:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key
   VITE_API_URL=http://localhost:5000/api
   ```
6. The app will immediately use your live PostgreSQL tables and Supabase Auth!

---

## 🚢 Deployment Guide

### Deploy Frontend to Vercel
1. Push your repository to GitHub.
2. Import the repository in [Vercel](https://vercel.com).
3. Set the **Root Directory** to `client` (or leave root as `vercel.json` already configures `client/dist`).
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Add environment variables if using Supabase (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).
7. Click **Deploy**.

### Deploy Backend to Render
1. In [Render](https://render.com), choose **New > Web Service**.
2. Select your repository.
3. Set **Root Directory** to `server`.
4. Build Command: `npm install`
5. Start Command: `npm start`
6. Add environment variable: `PORT=10000`.
7. Click **Create Web Service**.

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
| :--- | :--- |
| `Space` | Play / Pause current track |
| `Arrow Right` | Seek forward 5 seconds |
| `Arrow Left` | Seek backward 5 seconds |
| `Arrow Up` | Increase volume by 5% |
| `Arrow Down` | Decrease volume by 5% |

---

## 🛡️ License & Attributions
Created for educational and portfolio demonstration purposes. All audio tracks are legal royalty-free samples or procedural audio synth compositions. Artwork via Unsplash photography. Not affiliated with or endorsed by Spotify AB.
