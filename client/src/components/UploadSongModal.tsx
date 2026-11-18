import React, { useState } from 'react';
import { X, Upload, Music, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';
import { useLibraryStore } from '../stores/useLibraryStore';
import { usePlayerStore } from '../stores/usePlayerStore';

interface UploadSongModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UploadSongModal: React.FC<UploadSongModalProps> = ({ isOpen, onClose }) => {
  const { addUploadedSong } = useLibraryStore();
  const { playSong } = usePlayerStore();

  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [album, setAlbum] = useState('My Uploads');
  const [genre, setGenre] = useState('Bollywood');
  const [lyrics, setLyrics] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [detectedDuration, setDetectedDuration] = useState<number>(180);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    setError('');
    if (!title) {
      setTitle(selected.name.replace(/\.[^/.]+$/, '').replace(/[_-]+/g, ' '));
    }

    // Read real audio duration using an offscreen Audio element
    const objectUrl = URL.createObjectURL(selected);
    const probe = new Audio(objectUrl);
    probe.onloadedmetadata = () => {
      if (!isNaN(probe.duration) && probe.duration > 0) {
        setDetectedDuration(Math.round(probe.duration));
      }
      URL.revokeObjectURL(objectUrl);
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title.trim()) {
      setError('Please select an audio file (.mp3, .wav, .m4a, .ogg) and enter a title.');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      const base64: string = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ''));
        reader.onerror = () => reject(new Error('Failed to read audio file'));
        reader.readAsDataURL(file);
      });

      try {
        const res = await api.uploadSong({
          title: title.trim(),
          artist: artist.trim() || 'Personal Upload',
          album: album.trim() || 'My Uploads',
          genre,
          duration: detectedDuration,
          lyrics: lyrics.trim(),
          fileName: file.name,
          audioBase64: base64,
        });
        addUploadedSong(res.song, res.stats);
        playSong(res.song);
      } catch {
        // Offline local playback fallback using blob URL
        const localUrl = URL.createObjectURL(file);
        const localSong = {
          id: `song-local-${Date.now()}`,
          title: title.trim(),
          artist: artist.trim() || 'Personal Upload',
          artistId: 'art-9',
          album: album.trim() || 'My Uploads',
          albumId: 'alb-7',
          duration: detectedDuration,
          audioUrl: localUrl,
          coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
          lyrics: lyrics.trim(),
          genre,
          playsCount: 1,
          addedAt: new Date().toISOString(),
        };
        addUploadedSong(localSong);
        playSong(localSong);
      }

      setTitle('');
      setArtist('');
      setLyrics('');
      setFile(null);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-spotify-dark w-full max-w-lg rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#10D9A0] to-[#38BDF8] flex items-center justify-center text-[#061214]">
              <Upload size={16} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Upload Full Song</h2>
              <p className="text-[11px] text-spotify-subtext">
                Play your own full-length MP3, WAV, or M4A tracks in SYRĒN
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-spotify-subtext hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
              {error}
            </div>
          )}

          {/* File Dropzone */}
          <label className="block border-2 border-dashed border-white/15 hover:border-spotify-green/60 rounded-xl p-5 text-center cursor-pointer transition-colors bg-spotify-card/60">
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
              className="hidden"
            />
            {file ? (
              <div className="flex items-center justify-center gap-2 text-spotify-green text-sm font-semibold">
                <CheckCircle2 size={18} />
                <span className="truncate max-w-xs">{file.name}</span>
              </div>
            ) : (
              <div className="space-y-1 text-spotify-subtext">
                <Music size={26} className="mx-auto text-spotify-green/80" />
                <p className="text-xs font-semibold text-white">Click to select an audio file</p>
                <p className="text-[11px]">MP3, M4A, WAV, or OGG (up to 20MB)</p>
              </div>
            )}
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-spotify-subtext uppercase mb-1">
                Song Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Kesariya (Full)"
                className="w-full bg-spotify-card text-white text-sm rounded-lg px-3 py-2 border border-white/10 outline-none focus:border-spotify-green"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-spotify-subtext uppercase mb-1">
                Artist
              </label>
              <input
                type="text"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                placeholder="e.g. Arijit Singh"
                className="w-full bg-spotify-card text-white text-sm rounded-lg px-3 py-2 border border-white/10 outline-none focus:border-spotify-green"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-spotify-subtext uppercase mb-1">
                Category / Genre
              </label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full bg-spotify-card text-white text-sm rounded-lg px-3 py-2 border border-white/10 outline-none focus:border-spotify-green"
              >
                <option value="Bollywood">Bollywood</option>
                <option value="Hindi">Hindi</option>
                <option value="Punjabi">Punjabi</option>
                <option value="Bhojpuri">Bhojpuri</option>
                <option value="Pop">Pop</option>
                <option value="Hip-Hop">Hip-Hop</option>
                <option value="Indie">Indie</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-spotify-subtext uppercase mb-1">
                Album
              </label>
              <input
                type="text"
                value={album}
                onChange={(e) => setAlbum(e.target.value)}
                placeholder="My Uploads"
                className="w-full bg-spotify-card text-white text-sm rounded-lg px-3 py-2 border border-white/10 outline-none focus:border-spotify-green"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-spotify-subtext uppercase mb-1">
              Lyrics (optional)
            </label>
            <textarea
              rows={2}
              value={lyrics}
              onChange={(e) => setLyrics(e.target.value)}
              placeholder="Paste song lyrics here to view in the Lyrics panel..."
              className="w-full bg-spotify-card text-white text-xs rounded-lg px-3 py-2 border border-white/10 outline-none focus:border-spotify-green resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-spotify-subtext hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading || !file}
              className="px-6 py-2 rounded-full bg-gradient-to-r from-[#10D9A0] to-[#38BDF8] text-[#061214] font-extrabold text-xs hover:scale-105 transition-transform disabled:opacity-50"
            >
              {isUploading ? 'Uploading...' : 'Upload & Play'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
