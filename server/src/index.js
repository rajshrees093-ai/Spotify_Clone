import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import {
  db,
  DB_PATH,
  initDatabase,
  formatArtist,
  formatAlbum,
  formatSong,
  formatUser,
  getPlaylistsWithSongs,
  getDatabaseStats,
} from './db.js';

dotenv.config();

// Initialize & auto-seed SQLite database on startup
initDatabase();

const app = express();
const PORT = process.env.PORT || 5000;
const DEFAULT_USER_ID = 'usr-demo-1';

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Health & Database Stats
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'syren-api',
    database: {
      engine: 'sqlite',
      path: DB_PATH,
      connected: true,
      stats: getDatabaseStats(),
    },
    timestamp: new Date().toISOString(),
  });
});

// Bootstrap entire catalog + user library in one request
app.get('/api/bootstrap', (req, res) => {
  try {
    const userId = (req.query.userId || DEFAULT_USER_ID).toString();
    const userRow =
      db.prepare('SELECT * FROM users WHERE id = ?').get(userId) ||
      db.prepare('SELECT * FROM users LIMIT 1').get();

    const activeUserId = userRow ? userRow.id : DEFAULT_USER_ID;

    const songs = db.prepare('SELECT * FROM songs ORDER BY rowid ASC').all().map(formatSong);
    const artists = db.prepare('SELECT * FROM artists ORDER BY monthly_listeners DESC').all().map(formatArtist);
    const albums = db.prepare('SELECT * FROM albums ORDER BY release_year DESC').all().map(formatAlbum);
    const playlists = getPlaylistsWithSongs();

    const likedSongIds = db
      .prepare('SELECT song_id FROM liked_songs WHERE user_id = ? ORDER BY added_at DESC')
      .all(activeUserId)
      .map((r) => r.song_id);

    const savedAlbumIds = db
      .prepare('SELECT album_id FROM saved_albums WHERE user_id = ? ORDER BY added_at DESC')
      .all(activeUserId)
      .map((r) => r.album_id);

    const followedArtistIds = db
      .prepare('SELECT artist_id FROM followed_artists WHERE user_id = ? ORDER BY added_at DESC')
      .all(activeUserId)
      .map((r) => r.artist_id);

    const recentHistory = db
      .prepare(`
        SELECT s.*, lh.played_at
        FROM listening_history lh
        JOIN songs s ON s.id = lh.song_id
        WHERE lh.user_id = ?
        ORDER BY lh.played_at DESC
        LIMIT 20
      `)
      .all(activeUserId)
      .map(formatSong);

    res.json({
      database: {
        engine: 'SQLite (syren.db)',
        connected: true,
        stats: getDatabaseStats(),
      },
      user: formatUser(userRow),
      songs,
      artists,
      albums,
      playlists,
      likedSongIds,
      savedAlbumIds,
      followedArtistIds,
      recentHistory,
    });
  } catch (err) {
    console.error('[API /bootstrap error]', err);
    res.status(500).json({ error: 'Failed to load catalog from database' });
  }
});

// ==================== SONGS ====================
app.get('/api/songs', (req, res) => {
  const { genre, artistId, albumId } = req.query;
  let query = 'SELECT * FROM songs WHERE 1=1';
  const params = [];

  if (genre) {
    query += ' AND LOWER(genre) = LOWER(?)';
    params.push(genre.toString());
  }
  if (artistId) {
    query += ' AND artist_id = ?';
    params.push(artistId.toString());
  }
  if (albumId) {
    query += ' AND album_id = ?';
    params.push(albumId.toString());
  }

  const rows = db.prepare(query).all(...params);
  res.json({ songs: rows.map(formatSong), total: rows.length });
});

app.get('/api/songs/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM songs WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Song not found' });
  res.json(formatSong(row));
});

// ==================== ARTISTS ====================
app.get('/api/artists', (req, res) => {
  const rows = db.prepare('SELECT * FROM artists ORDER BY monthly_listeners DESC').all();
  res.json({ artists: rows.map(formatArtist) });
});

app.get('/api/artists/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM artists WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Artist not found' });

  const artistSongs = db
    .prepare('SELECT * FROM songs WHERE artist_id = ? ORDER BY plays_count DESC')
    .all(row.id)
    .map(formatSong);
  const artistAlbums = db
    .prepare('SELECT * FROM albums WHERE artist_id = ? ORDER BY release_year DESC')
    .all(row.id)
    .map(formatAlbum);

  res.json({
    ...formatArtist(row),
    topTracks: artistSongs,
    albums: artistAlbums,
  });
});

// ==================== ALBUMS ====================
app.get('/api/albums', (req, res) => {
  const rows = db.prepare('SELECT * FROM albums ORDER BY release_year DESC').all();
  res.json({ albums: rows.map(formatAlbum) });
});

app.get('/api/albums/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM albums WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Album not found' });

  const albumSongs = db
    .prepare('SELECT * FROM songs WHERE album_id = ? ORDER BY rowid ASC')
    .all(row.id)
    .map(formatSong);

  res.json({
    ...formatAlbum(row),
    songs: albumSongs,
  });
});

// ==================== PLAYLISTS CRUD ====================
app.get('/api/playlists', (req, res) => {
  res.json({ playlists: getPlaylistsWithSongs() });
});

app.get('/api/playlists/:id', (req, res) => {
  const all = getPlaylistsWithSongs();
  const pl = all.find((p) => p.id === req.params.id);
  if (!pl) return res.status(404).json({ error: 'Playlist not found' });
  res.json(pl);
});

app.post('/api/playlists', (req, res) => {
  try {
    const { title, description, coverUrl, userId, creatorName, creatorAvatar } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Playlist title is required' });
    }

    const id = `pl-${Date.now()}`;
    const cover =
      coverUrl ||
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80';
    const cId = userId || DEFAULT_USER_ID;
    const cName = creatorName || 'Alex Parker';
    const cAvatar =
      creatorAvatar ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';

    db.prepare(`
      INSERT INTO playlists (id, title, description, cover_url, is_public, creator_id, creator_name, creator_avatar, followers_count, gradient_color, created_at)
      VALUES (?, ?, ?, ?, 1, ?, ?, ?, 1, 'from-purple-900 to-spotify-dark', 'Just now')
    `).run(id, title.trim(), (description || 'Created by you.').trim(), cover, cId, cName, cAvatar);

    const created = getPlaylistsWithSongs().find((p) => p.id === id);
    res.status(201).json({ playlist: created, stats: getDatabaseStats() });
  } catch (err) {
    console.error('[API POST /playlists error]', err);
    res.status(500).json({ error: 'Failed to create playlist' });
  }
});

app.put('/api/playlists/:id', (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT * FROM playlists WHERE id = ?').get(id);
    if (!existing) return res.status(404).json({ error: 'Playlist not found' });

    const title = req.body.title !== undefined ? req.body.title.trim() : existing.title;
    const description =
      req.body.description !== undefined ? req.body.description.trim() : existing.description;
    const coverUrl = req.body.coverUrl !== undefined ? req.body.coverUrl.trim() : existing.cover_url;

    db.prepare('UPDATE playlists SET title = ?, description = ?, cover_url = ? WHERE id = ?').run(
      title || existing.title,
      description,
      coverUrl || existing.cover_url,
      id
    );

    const updated = getPlaylistsWithSongs().find((p) => p.id === id);
    res.json({ playlist: updated });
  } catch (err) {
    console.error('[API PUT /playlists error]', err);
    res.status(500).json({ error: 'Failed to update playlist' });
  }
});

app.delete('/api/playlists/:id', (req, res) => {
  try {
    const result = db.prepare('DELETE FROM playlists WHERE id = ?').run(req.params.id);
    if (result.changes === 0) return res.status(404).json({ error: 'Playlist not found' });
    res.json({ deleted: true, id: req.params.id, stats: getDatabaseStats() });
  } catch (err) {
    console.error('[API DELETE /playlists error]', err);
    res.status(500).json({ error: 'Failed to delete playlist' });
  }
});

app.post('/api/playlists/:id/songs', (req, res) => {
  try {
    const { id } = req.params;
    const { songId } = req.body;
    if (!songId) return res.status(400).json({ error: 'songId is required' });

    const posRow = db
      .prepare('SELECT COALESCE(MAX(position), -1) + 1 AS nextPos FROM playlist_songs WHERE playlist_id = ?')
      .get(id);

    db.prepare(
      'INSERT OR IGNORE INTO playlist_songs (playlist_id, song_id, position, added_at) VALUES (?, ?, ?, ?)'
    ).run(id, songId, posRow.nextPos, new Date().toISOString());

    const updated = getPlaylistsWithSongs().find((p) => p.id === id);
    res.status(201).json({ playlist: updated });
  } catch (err) {
    console.error('[API POST /playlists/:id/songs error]', err);
    res.status(500).json({ error: 'Failed to add song to playlist' });
  }
});

app.delete('/api/playlists/:id/songs/:songId', (req, res) => {
  try {
    db.prepare('DELETE FROM playlist_songs WHERE playlist_id = ? AND song_id = ?').run(
      req.params.id,
      req.params.songId
    );
    const updated = getPlaylistsWithSongs().find((p) => p.id === req.params.id);
    res.json({ playlist: updated });
  } catch (err) {
    console.error('[API DELETE /playlists/:id/songs/:songId error]', err);
    res.status(500).json({ error: 'Failed to remove song from playlist' });
  }
});

// ==================== LIKES, SAVED ALBUMS, FOLLOWED ARTISTS ====================
app.post('/api/likes/toggle', (req, res) => {
  try {
    const userId = req.body.userId || DEFAULT_USER_ID;
    const { songId } = req.body;
    if (!songId) return res.status(400).json({ error: 'songId is required' });

    const exists = db
      .prepare('SELECT 1 FROM liked_songs WHERE user_id = ? AND song_id = ?')
      .get(userId, songId);

    if (exists) {
      db.prepare('DELETE FROM liked_songs WHERE user_id = ? AND song_id = ?').run(userId, songId);
    } else {
      db.prepare('INSERT INTO liked_songs (user_id, song_id) VALUES (?, ?)').run(userId, songId);
    }

    const likedSongIds = db
      .prepare('SELECT song_id FROM liked_songs WHERE user_id = ? ORDER BY added_at DESC')
      .all(userId)
      .map((r) => r.song_id);

    res.json({ liked: !exists, likedSongIds, stats: getDatabaseStats() });
  } catch (err) {
    console.error('[API /likes/toggle error]', err);
    res.status(500).json({ error: 'Failed to toggle like' });
  }
});

app.post('/api/albums/save/toggle', (req, res) => {
  try {
    const userId = req.body.userId || DEFAULT_USER_ID;
    const { albumId } = req.body;
    if (!albumId) return res.status(400).json({ error: 'albumId is required' });

    const exists = db
      .prepare('SELECT 1 FROM saved_albums WHERE user_id = ? AND album_id = ?')
      .get(userId, albumId);

    if (exists) {
      db.prepare('DELETE FROM saved_albums WHERE user_id = ? AND album_id = ?').run(userId, albumId);
    } else {
      db.prepare('INSERT INTO saved_albums (user_id, album_id) VALUES (?, ?)').run(userId, albumId);
    }

    const savedAlbumIds = db
      .prepare('SELECT album_id FROM saved_albums WHERE user_id = ?')
      .all(userId)
      .map((r) => r.album_id);

    res.json({ saved: !exists, savedAlbumIds });
  } catch (err) {
    console.error('[API /albums/save/toggle error]', err);
    res.status(500).json({ error: 'Failed to toggle saved album' });
  }
});

app.post('/api/artists/follow/toggle', (req, res) => {
  try {
    const userId = req.body.userId || DEFAULT_USER_ID;
    const { artistId } = req.body;
    if (!artistId) return res.status(400).json({ error: 'artistId is required' });

    const exists = db
      .prepare('SELECT 1 FROM followed_artists WHERE user_id = ? AND artist_id = ?')
      .get(userId, artistId);

    if (exists) {
      db.prepare('DELETE FROM followed_artists WHERE user_id = ? AND artist_id = ?').run(
        userId,
        artistId
      );
    } else {
      db.prepare('INSERT INTO followed_artists (user_id, artist_id) VALUES (?, ?)').run(
        userId,
        artistId
      );
    }

    const followedArtistIds = db
      .prepare('SELECT artist_id FROM followed_artists WHERE user_id = ?')
      .all(userId)
      .map((r) => r.artist_id);

    res.json({ followed: !exists, followedArtistIds });
  } catch (err) {
    console.error('[API /artists/follow/toggle error]', err);
    res.status(500).json({ error: 'Failed to toggle follow artist' });
  }
});

// ==================== SEARCH ====================
app.get('/api/search', (req, res) => {
  const q = (req.query.q || '').toString().trim();
  if (!q) {
    return res.json({ songs: [], artists: [], albums: [], playlists: [] });
  }

  const pattern = `%${q}%`;
  const songs = db
    .prepare(
      'SELECT * FROM songs WHERE title LIKE ? OR artist LIKE ? OR genre LIKE ? OR album LIKE ? LIMIT 25'
    )
    .all(pattern, pattern, pattern, pattern)
    .map(formatSong);

  const artists = db
    .prepare('SELECT * FROM artists WHERE name LIKE ? OR genres LIKE ? LIMIT 12')
    .all(pattern, pattern)
    .map(formatArtist);

  const albums = db
    .prepare('SELECT * FROM albums WHERE title LIKE ? OR artist LIKE ? OR genre LIKE ? LIMIT 12')
    .all(pattern, pattern, pattern)
    .map(formatAlbum);

  const playlists = getPlaylistsWithSongs().filter(
    (pl) =>
      pl.title.toLowerCase().includes(q.toLowerCase()) ||
      pl.description.toLowerCase().includes(q.toLowerCase())
  );

  res.json({ songs, artists, albums, playlists });
});

// ==================== LISTENING HISTORY ====================
app.get('/api/history', (req, res) => {
  const userId = (req.query.userId || DEFAULT_USER_ID).toString();
  const rows = db
    .prepare(`
      SELECT s.*, lh.played_at
      FROM listening_history lh
      JOIN songs s ON s.id = lh.song_id
      WHERE lh.user_id = ?
      ORDER BY lh.played_at DESC
      LIMIT 30
    `)
    .all(userId);
  res.json({ history: rows.map(formatSong) });
});

app.post('/api/history', (req, res) => {
  try {
    const { songId, userId } = req.body;
    if (!songId) return res.status(400).json({ error: 'songId required' });

    const id = `hist-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const activeUserId = userId || DEFAULT_USER_ID;
    const playedAt = new Date().toISOString();

    db.prepare(
      'INSERT INTO listening_history (id, user_id, song_id, played_at) VALUES (?, ?, ?, ?)'
    ).run(id, activeUserId, songId, playedAt);

    db.prepare('UPDATE songs SET plays_count = plays_count + 1 WHERE id = ?').run(songId);

    res.status(201).json({
      success: true,
      record: { id, songId, userId: activeUserId, playedAt },
      stats: getDatabaseStats(),
    });
  } catch (err) {
    console.error('[API POST /history error]', err);
    res.status(500).json({ error: 'Failed to record listening history' });
  }
});

// ==================== AUTH & PROFILE (SQLite-backed) ====================
app.post('/api/auth/signup', (req, res) => {
  try {
    const { email, username } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const existing = db.prepare('SELECT * FROM users WHERE LOWER(email) = LOWER(?)').get(email);
    if (existing) {
      return res.json({ user: formatUser(existing) });
    }

    const id = `usr-${Date.now()}`;
    const displayName = username?.trim() || email.split('@')[0];
    const avatar =
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';

    db.prepare(
      'INSERT INTO users (id, email, username, full_name, avatar_url) VALUES (?, ?, ?, ?, ?)'
    ).run(id, email.trim(), displayName, displayName, avatar);

    const created = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    res.status(201).json({ user: formatUser(created) });
  } catch (err) {
    console.error('[API /auth/signup error]', err);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

app.post('/api/auth/login', (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    let user = db.prepare('SELECT * FROM users WHERE LOWER(email) = LOWER(?)').get(email);
    if (!user) {
      const id = `usr-${Date.now()}`;
      const displayName = email.split('@')[0];
      const avatar =
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';
      db.prepare(
        'INSERT INTO users (id, email, username, full_name, avatar_url) VALUES (?, ?, ?, ?, ?)'
      ).run(id, email.trim(), displayName, displayName, avatar);
      user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    }

    res.json({ user: formatUser(user) });
  } catch (err) {
    console.error('[API /auth/login error]', err);
    res.status(500).json({ error: 'Failed to sign in' });
  }
});

app.put('/api/users/:id', (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    if (!existing) return res.status(404).json({ error: 'User not found' });

    const fullName = req.body.fullName?.trim() || existing.full_name;
    const username = req.body.username?.trim() || existing.username;
    const avatarUrl = req.body.avatarUrl?.trim() || existing.avatar_url;

    db.prepare('UPDATE users SET full_name = ?, username = ?, avatar_url = ? WHERE id = ?').run(
      fullName,
      username,
      avatarUrl,
      id
    );

    const updated = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    res.json({ user: formatUser(updated) });
  } catch (err) {
    console.error('[API PUT /users/:id error]', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

app.listen(PORT, () => {
  const stats = getDatabaseStats();
  console.log(`[SYRĒN API] Server running on http://localhost:${PORT}`);
  console.log(
    `[SQLite DB] Connected to ${DB_PATH} (${stats.songs} songs, ${stats.artists} artists, ${stats.albums} albums, ${stats.playlists} playlists)`
  );
});
