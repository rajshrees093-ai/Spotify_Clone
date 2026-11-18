import React, { useState, useEffect } from 'react';
import { X, Music2 } from 'lucide-react';
import { useLibraryStore } from '../stores/useLibraryStore';

export const PlaylistModal: React.FC = () => {
  const {
    isCreatePlaylistModalOpen,
    setCreatePlaylistModalOpen,
    editingPlaylist,
    setEditingPlaylist,
    createPlaylist,
    updatePlaylist,
  } = useLibraryStore();

  const isOpen = isCreatePlaylistModalOpen || Boolean(editingPlaylist);
  const isEditing = Boolean(editingPlaylist);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverUrl, setCoverUrl] = useState('');

  useEffect(() => {
    if (editingPlaylist) {
      setTitle(editingPlaylist.title);
      setDescription(editingPlaylist.description || '');
      setCoverUrl(editingPlaylist.coverUrl || '');
    } else {
      setTitle('');
      setDescription('');
      setCoverUrl('');
    }
  }, [editingPlaylist, isCreatePlaylistModalOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    setCreatePlaylistModalOpen(false);
    setEditingPlaylist(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (isEditing && editingPlaylist) {
      updatePlaylist(editingPlaylist.id, {
        title: title.trim(),
        description: description.trim(),
        coverUrl: coverUrl.trim() || editingPlaylist.coverUrl,
      });
    } else {
      createPlaylist(title.trim(), description.trim(), coverUrl.trim());
    }
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#282828] w-full max-w-lg rounded-xl shadow-2xl border border-white/10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="text-xl font-bold text-white">
            {isEditing ? 'Edit details' : 'Create playlist'}
          </h2>
          <button
            onClick={handleClose}
            className="p-1 rounded-full text-spotify-subtext hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Cover Preview / Selector */}
            <div className="w-40 h-40 bg-[#181818] rounded-lg border border-white/10 flex flex-col items-center justify-center relative overflow-hidden group shrink-0">
              {coverUrl ? (
                <img src={coverUrl} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center justify-center text-spotify-subtext gap-2">
                  <Music2 size={42} />
                  <span className="text-[11px]">Artwork preview</span>
                </div>
              )}
            </div>

            {/* Inputs */}
            <div className="flex-1 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-spotify-subtext uppercase tracking-wider mb-1">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="My Playlist"
                  className="w-full bg-[#3e3e3e] focus:bg-[#333] text-white text-sm rounded px-3 py-2 outline-none focus:ring-1 focus:ring-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-spotify-subtext uppercase tracking-wider mb-1">
                  Cover Image URL (optional)
                </label>
                <input
                  type="url"
                  value={coverUrl}
                  onChange={(e) => setCoverUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-[#3e3e3e] focus:bg-[#333] text-white text-xs rounded px-3 py-2 outline-none focus:ring-1 focus:ring-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-spotify-subtext uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Give your playlist a catchy description"
                  className="w-full bg-[#3e3e3e] focus:bg-[#333] text-white text-xs rounded px-3 py-2 outline-none focus:ring-1 focus:ring-white resize-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Footer Save Button */}
          <div className="flex justify-end pt-4 border-t border-white/5">
            <button
              type="submit"
              disabled={!title.trim()}
              className="bg-white hover:bg-white/90 text-black font-bold text-sm px-7 py-2.5 rounded-full hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
