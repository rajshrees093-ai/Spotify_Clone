-- ====================================================================
-- SUPABASE POSTGRESQL SCHEMA FOR SPOTIFY CLONE
-- Includes: Tables, RLS Policies, Triggers, Views & Seed Data
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLES

-- Profiles (Linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  website TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Artists
CREATE TABLE IF NOT EXISTS public.artists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  bio TEXT,
  image_url TEXT,
  banner_url TEXT,
  monthly_listeners BIGINT DEFAULT 0,
  verified BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Albums
CREATE TABLE IF NOT EXISTS public.albums (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  artist_id UUID REFERENCES public.artists(id) ON DELETE CASCADE,
  cover_url TEXT,
  release_year INT,
  album_type TEXT DEFAULT 'album' CHECK (album_type IN ('album', 'single', 'ep', 'compilation')),
  genre TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Songs
CREATE TABLE IF NOT EXISTS public.songs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  artist_id UUID REFERENCES public.artists(id) ON DELETE CASCADE,
  album_id UUID REFERENCES public.albums(id) ON DELETE SET NULL,
  duration INT NOT NULL, -- in seconds
  audio_url TEXT NOT NULL,
  cover_url TEXT,
  lyrics TEXT,
  plays_count BIGINT DEFAULT 0,
  genre TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Playlists
CREATE TABLE IF NOT EXISTS public.playlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  cover_url TEXT,
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Playlist Songs (Junction table)
CREATE TABLE IF NOT EXISTS public.playlist_songs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  playlist_id UUID REFERENCES public.playlists(id) ON DELETE CASCADE,
  song_id UUID REFERENCES public.songs(id) ON DELETE CASCADE,
  position INT DEFAULT 0,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(playlist_id, song_id)
);

-- Liked Songs
CREATE TABLE IF NOT EXISTS public.liked_songs (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  song_id UUID REFERENCES public.songs(id) ON DELETE CASCADE,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, song_id)
);

-- Saved Albums
CREATE TABLE IF NOT EXISTS public.saved_albums (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  album_id UUID REFERENCES public.albums(id) ON DELETE CASCADE,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, album_id)
);

-- Followed Artists
CREATE TABLE IF NOT EXISTS public.followed_artists (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  artist_id UUID REFERENCES public.artists(id) ON DELETE CASCADE,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, artist_id)
);

-- Listening History
CREATE TABLE IF NOT EXISTS public.listening_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  song_id UUID REFERENCES public.songs(id) ON DELETE CASCADE,
  played_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlist_songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.liked_songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.followed_artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listening_history ENABLE ROW LEVEL SECURITY;

-- Public read access for catalog
CREATE POLICY "Allow public read for artists" ON public.artists FOR SELECT USING (true);
CREATE POLICY "Allow public read for albums" ON public.albums FOR SELECT USING (true);
CREATE POLICY "Allow public read for songs" ON public.songs FOR SELECT USING (true);
CREATE POLICY "Allow public read for public playlists" ON public.playlists FOR SELECT USING (is_public = true OR auth.uid() = user_id);
CREATE POLICY "Allow public read for playlist songs" ON public.playlist_songs FOR SELECT USING (true);

-- User-specific policies
CREATE POLICY "Allow users to read profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow user to update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Playlists CRUD
CREATE POLICY "Users can create their own playlists" ON public.playlists FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own playlists" ON public.playlists FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own playlists" ON public.playlists FOR DELETE USING (auth.uid() = user_id);

-- Playlist Songs CRUD
CREATE POLICY "Playlist owners can modify playlist songs" ON public.playlist_songs FOR ALL
USING (EXISTS (SELECT 1 FROM public.playlists WHERE id = playlist_id AND user_id = auth.uid()));

-- Liked Songs
CREATE POLICY "Users can manage own liked songs" ON public.liked_songs FOR ALL USING (auth.uid() = user_id);

-- Saved Albums
CREATE POLICY "Users can manage own saved albums" ON public.saved_albums FOR ALL USING (auth.uid() = user_id);

-- Followed Artists
CREATE POLICY "Users can manage followed artists" ON public.followed_artists FOR ALL USING (auth.uid() = user_id);

-- Listening History
CREATE POLICY "Users can manage own listening history" ON public.listening_history FOR ALL USING (auth.uid() = user_id);

-- Trigger for New User Profile creation from auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
