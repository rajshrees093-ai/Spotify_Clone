import { db, initDatabase } from './db.js';
import { fetchOfficialPreview, isOfficialOrLocalAudio } from './previewResolver.js';

initDatabase();

const songs = db.prepare('SELECT id, title, artist, audio_url, cover_url FROM songs').all();
const updateStmt = db.prepare('UPDATE songs SET audio_url = ?, cover_url = COALESCE(?, cover_url) WHERE id = ?');

console.log(`Resolving official vocal previews for ${songs.length} songs...`);

let resolved = 0;
let skipped = 0;
let failed = 0;

// Process in small batches of 5 to be respectful to Apple iTunes API rate limits
const BATCH_SIZE = 2;
for (let i = 0; i < songs.length; i += BATCH_SIZE) {
  const batch = songs.slice(i, i + BATCH_SIZE);
  let didCall = false;
  await Promise.all(
    batch.map(async (song) => {
      if (isOfficialOrLocalAudio(song.audio_url)) {
        skipped++;
        return;
      }
      didCall = true;
      const match = await fetchOfficialPreview(song.title, song.artist);
      if (match && match.previewUrl) {
        updateStmt.run(match.previewUrl, match.artworkUrl || song.cover_url, song.id);
        resolved++;
        console.log(`  [OK] ${song.title} — ${song.artist} -> matched "${match.matchedTrack}"`);
      } else {
        failed++;
        console.log(`  [--] ${song.title} — ${song.artist} (kept fallback)`);
      }
    })
  );
  if (didCall) {
    await new Promise((r) => setTimeout(r, 900));
  }
}

console.log(`\nHydration complete! Resolved: ${resolved}, Already cached: ${skipped}, Fallback: ${failed}`);
