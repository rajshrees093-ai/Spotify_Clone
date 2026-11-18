import React from 'react';
import { X, UserPlus, Music2 } from 'lucide-react';
import { usePlayerStore } from '../stores/usePlayerStore';
import { DEMO_FRIENDS_ACTIVITY } from '../data/mockData';

export const FriendActivity: React.FC = () => {
  const { isFriendActivityOpen, toggleFriendActivity } = usePlayerStore();

  if (!isFriendActivityOpen) return null;

  return (
    <aside className="w-72 bg-spotify-dark/95 border-l border-white/5 flex flex-col h-full shrink-0 select-none transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/5">
        <span className="text-sm font-bold text-white tracking-wide">Friend Activity</span>
        <div className="flex items-center gap-1">
          <button
            onClick={toggleFriendActivity}
            className="p-1 rounded-full text-spotify-subtext hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Friends list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {DEMO_FRIENDS_ACTIVITY.map((friend) => (
          <div key={friend.id} className="flex items-start gap-3 group cursor-pointer">
            <div className="relative shrink-0">
              <img
                src={friend.avatar}
                alt={friend.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-spotify-green rounded-full border-2 border-spotify-dark" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <span className="text-xs font-bold text-white group-hover:text-spotify-green truncate transition-colors">
                  {friend.name}
                </span>
                <span className="text-[11px] text-spotify-subtext shrink-0">{friend.timeAgo}</span>
              </div>
              <p className="text-xs text-white/90 truncate flex items-center gap-1 mt-0.5">
                <Music2 size={12} className="text-spotify-subtext shrink-0" />
                <span className="truncate">{friend.songTitle}</span>
              </p>
              <p className="text-[11px] text-spotify-subtext truncate mt-0.5">
                {friend.artist} • {friend.album}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Find Friends Footer */}
      <div className="p-4 border-t border-white/5 bg-spotify-black/40 text-center">
        <button
          onClick={() => alert('Friend discovery is enabled in live connected mode!')}
          className="w-full py-2 px-4 rounded-full border border-white/30 hover:border-white text-xs font-bold text-white tracking-wider uppercase hover:scale-105 transition-all flex items-center justify-center gap-2"
        >
          <UserPlus size={14} />
          <span>FIND FRIENDS</span>
        </button>
      </div>
    </aside>
  );
};
