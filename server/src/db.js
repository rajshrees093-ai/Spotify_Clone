import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';
import {
  SEED_USERS,
  SEED_ARTISTS,
  SEED_ALBUMS,
  SEED_SONGS,
  SEED_PLAYLISTS,
  SEED_LIKES,
  SEED_SAVED_ALBUMS,
  SEED_FOLLOWED_ARTISTS,
} from './seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_DIR = path.resolve(__dirname, '../database');
export const DB_PATH = path.join(DB_DIR, 'syren.db');

if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

export const db = new DatabaseSync(DB_PATH);

// Enable foreign key constraints
db.exec('PRAGMA foreign_keys = ON;');

export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      username TEXT NOT NULL,
      full_name TEXT NOT NULL,
      avatar_url TEXT,
      password_hash TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS artists (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      bio TEXT,
      image_url TEXT,
      banner_url TEXT,
      monthly_listeners INTEGER DEFAULT 0,
      verified INTEGER DEFAULT 1,
      genres TEXT DEFAULT '[]'
    );

    CREATE TABLE IF NOT EXISTS albums (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      artist TEXT NOT NULL,
      artist_id TEXT NOT NULL,
      cover_url TEXT,
      release_year INTEGER,
      genre TEXT,
      album_type TEXT DEFAULT 'album',
      song_count INTEGER DEFAULT 0,
      duration INTEGER DEFAULT 0,
      FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS songs (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      artist TEXT NOT NULL,
      artist_id TEXT NOT NULL,
      album TEXT NOT NULL,
      album_id TEXT NOT NULL,
      duration INTEGER NOT NULL,
      audio_url TEXT NOT NULL,
      cover_url TEXT,
      lyrics TEXT,
      genre TEXT,
      plays_count INTEGER DEFAULT 0,
      added_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE,
      FOREIGN KEY (album_id) REFERENCES albums(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS playlists (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      cover_url TEXT,
      is_public INTEGER DEFAULT 1,
      creator_id TEXT NOT NULL,
      creator_name TEXT NOT NULL,
      creator_avatar TEXT,
      followers_count INTEGER DEFAULT 1,
      gradient_color TEXT DEFAULT 'from-purple-900 to-spotify-dark',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS playlist_songs (
      playlist_id TEXT NOT NULL,
      song_id TEXT NOT NULL,
      position INTEGER DEFAULT 0,
      added_at TEXT DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (playlist_id, song_id),
      FOREIGN KEY (playlist_id) REFERENCES playlists(id) ON DELETE CASCADE,
      FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS liked_songs (
      user_id TEXT NOT NULL,
      song_id TEXT NOT NULL,
      added_at TEXT DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (user_id, song_id),
      FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS saved_albums (
      user_id TEXT NOT NULL,
      album_id TEXT NOT NULL,
      added_at TEXT DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (user_id, album_id),
      FOREIGN KEY (album_id) REFERENCES albums(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS followed_artists (
      user_id TEXT NOT NULL,
      artist_id TEXT NOT NULL,
      added_at TEXT DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (user_id, artist_id),
      FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS listening_history (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      song_id TEXT NOT NULL,
      played_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE
    );
  `);

  const countRow = db.prepare('SELECT COUNT(*) AS count FROM songs').get();
  if (!countRow || countRow.count === 0) {
    seedDatabase();
  }
}

export function seedDatabase({ reset = false } = {}) {
  if (reset) {
    db.exec(`
      DELETE FROM listening_history;
      DELETE FROM followed_artists;
      DELETE FROM saved_albums;
      DELETE FROM liked_songs;
      DELETE FROM playlist_songs;
      DELETE FROM playlists;
      DELETE FROM songs;
      DELETE FROM albums;
      DELETE FROM artists;
      DELETE FROM users;
    `);
  }

  const insertUser = db.prepare(`
    INSERT OR IGNORE INTO users (id, email, username, full_name, avatar_url)
    VALUES (?, ?, ?, ?, ?)
  `);
  for (const u of SEED_USERS) {
    insertUser.run(u.id, u.email, u.username, u.full_name, u.avatar_url);
  }

  const insertArtist = db.prepare(`
    INSERT OR IGNORE INTO artists (id, name, bio, image_url, banner_url, monthly_listeners, verified, genres)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const a of SEED_ARTISTS) {
    insertArtist.run(a.id, a.name, a.bio, a.image_url, a.banner_url, a.monthly_listeners, a.verified, a.genres);
  }

  const insertAlbum = db.prepare(`
    INSERT OR IGNORE INTO albums (id, title, artist, artist_id, cover_url, release_year, genre, album_type, song_count, duration)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const alb of SEED_ALBUMS) {
    insertAlbum.run(
      alb.id,
      alb.title,
      alb.artist,
      alb.artist_id,
      alb.cover_url,
      alb.release_year,
      alb.genre,
      alb.album_type,
      alb.song_count,
      alb.duration
    );
  }

  const insertSong = db.prepare(`
    INSERT OR IGNORE INTO songs (id, title, artist, artist_id, album, album_id, duration, audio_url, cover_url, lyrics, genre, plays_count, added_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  for (const s of SEED_SONGS) {
    insertSong.run(
      s.id,
      s.title,
      s.artist,
      s.artist_id,
      s.album,
      s.album_id,
      s.duration,
      s.audio_url,
      s.cover_url,
      s.lyrics || '',
      s.genre,
      s.plays_count,
      s.added_at
    );
  }

  const insertPlaylist = db.prepare(`
    INSERT OR IGNORE INTO playlists (id, title, description, cover_url, is_public, creator_id, creator_name, creator_avatar, followers_count, gradient_color, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const insertPlaylistSong = db.prepare(`
    INSERT OR IGNORE INTO playlist_songs (playlist_id, song_id, position)
    VALUES (?, ?, ?)
  `);
  for (const pl of SEED_PLAYLISTS) {
    insertPlaylist.run(
      pl.id,
      pl.title,
      pl.description,
      pl.cover_url,
      pl.is_public,
      pl.creator_id,
      pl.creator_name,
      pl.creator_avatar,
      pl.followers_count,
      pl.gradient_color,
      pl.created_at
    );
    pl.songIds.forEach((songId, index) => {
      insertPlaylistSong.run(pl.id, songId, index);
    });
  }

  const defaultUserId = SEED_USERS[0].id;
  const insertLike = db.prepare('INSERT OR IGNORE INTO liked_songs (user_id, song_id) VALUES (?, ?)');
  for (const songId of SEED_LIKES) {
    insertLike.run(defaultUserId, songId);
  }

  const insertSavedAlbum = db.prepare('INSERT OR IGNORE INTO saved_albums (user_id, album_id) VALUES (?, ?)');
  for (const albumId of SEED_SAVED_ALBUMS) {
    insertSavedAlbum.run(defaultUserId, albumId);
  }

  const insertFollowedArtist = db.prepare('INSERT OR IGNORE INTO followed_artists (user_id, artist_id) VALUES (?, ?)');
  for (const artistId of SEED_FOLLOWED_ARTISTS) {
    insertFollowedArtist.run(defaultUserId, artistId);
  }

  console.log(`[SQLite DB] Seeded sample database at ${DB_PATH}`);
}

// Formatters converting SQLite rows into frontend-ready camelCase objects
export function formatArtist(row) {
  if (!row) return null;
  let genres = [];
  try {
    genres = JSON.parse(row.genres || '[]');
  } catch {
    genres = [];
  }
  return {
    id: row.id,
    name: row.name,
    bio: row.bio,
    imageUrl: row.image_url,
    bannerUrl: row.banner_url,
    monthlyListeners: Number(row.monthly_listeners || 0),
    verified: Boolean(row.verified),
    genres,
  };
}

export function formatAlbum(row) {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    artist: row.artist,
    artistId: row.artist_id,
    coverUrl: row.cover_url,
    releaseYear: Number(row.release_year || 2023),
    genre: row.genre,
    albumType: row.album_type || 'album',
    songCount: Number(row.song_count || 0),
    duration: Number(row.duration || 0),
  };
}

export function formatSong(row) {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    artist: row.artist,
    artistId: row.artist_id,
    album: row.album,
    albumId: row.album_id,
    duration: Number(row.duration || 0),
    audioUrl: row.audio_url,
    coverUrl: row.cover_url,
    lyrics: row.lyrics || '',
    genre: row.genre,
    playsCount: Number(row.plays_count || 0),
    addedAt: row.added_at,
  };
}

export function formatUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    email: row.email,
    username: row.username,
    fullName: row.full_name,
    avatarUrl: row.avatar_url,
  };
}

export function getPlaylistsWithSongs() {
  const playlistRows = db.prepare('SELECT * FROM playlists ORDER BY rowid DESC').all();
  const songsStmt = db.prepare(`
    SELECT s.*, ps.added_at AS playlist_added_at
    FROM playlist_songs ps
    JOIN songs s ON s.id = ps.song_id
    WHERE ps.playlist_id = ?
    ORDER BY ps.position ASC, ps.added_at ASC
  `);

  return playlistRows.map((pl) => {
    const songs = songsStmt.all(pl.id).map((row) => ({
      ...formatSong(row),
      addedAt: row.playlist_added_at || row.added_at,
    }));
    return {
      id: pl.id,
      title: pl.title,
      description: pl.description,
      coverUrl: pl.cover_url,
      isPublic: Boolean(pl.is_public),
      creator: {
        id: pl.creator_id,
        name: pl.creator_name,
        avatarUrl: pl.creator_avatar,
      },
      songs,
      songCount: songs.length,
      followersCount: Number(pl.followers_count || 0),
      gradientColor: pl.gradient_color,
      createdAt: pl.created_at,
    };
  });
}

export function getDatabaseStats() {
  return {
    users: db.prepare('SELECT COUNT(*) AS count FROM users').get().count,
    artists: db.prepare('SELECT COUNT(*) AS count FROM artists').get().count,
    albums: db.prepare('SELECT COUNT(*) AS count FROM albums').get().count,
    songs: db.prepare('SELECT COUNT(*) AS count FROM songs').get().count,
    playlists: db.prepare('SELECT COUNT(*) AS count FROM playlists').get().count,
    likedSongs: db.prepare('SELECT COUNT(*) AS count FROM liked_songs').get().count,
    listeningHistory: db.prepare('SELECT COUNT(*) AS count FROM listening_history').get().count,
  };
}
