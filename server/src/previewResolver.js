// Resolves official, licensed 30-second vocal preview streams via Apple's public iTunes Search API

export async function fetchOfficialPreview(title, artist) {
  const cleanTitle = title.replace(/\(.*?\)|\[.*?\]/g, '').trim();
  const primaryArtist = artist.split(',')[0].replace(/\(.*?\)/g, '').trim();
  const query = `${cleanTitle} ${primaryArtist}`.trim();

  const countries = ['IN', 'US'];

  for (const country of countries) {
    try {
      const url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=5&country=${country}`;
      const res = await fetch(url, {
        headers: { 'User-Agent': 'SYREN-Audio-Player/1.0' },
      });
      if (!res.ok) continue;

      const data = await res.json();
      if (data.results && data.results.length > 0) {
        // Prefer an entry whose trackName closely matches cleanTitle and has a previewUrl
        const exact =
          data.results.find(
            (r) =>
              r.previewUrl &&
              r.trackName &&
              r.trackName.toLowerCase().includes(cleanTitle.toLowerCase())
          ) || data.results.find((r) => Boolean(r.previewUrl));

        if (exact && exact.previewUrl) {
          return {
            previewUrl: exact.previewUrl,
            artworkUrl: exact.artworkUrl100
              ? exact.artworkUrl100.replace('100x100bb', '600x600bb')
              : null,
            matchedTrack: exact.trackName,
            matchedArtist: exact.artistName,
          };
        }
      }
    } catch {
      // Try next country fallback
    }
  }

  return null;
}

export function isOfficialOrLocalAudio(url = '') {
  return (
    url.includes('itunes.apple.com') ||
    url.startsWith('/uploads/') ||
    url.startsWith('http://localhost') ||
    url.startsWith('blob:')
  );
}
