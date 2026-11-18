import React from 'react';
import { Play } from 'lucide-react';
import { Artist } from '../types';
import { useNavigate } from 'react-router-dom';
import { formatNumber } from '../utils/formatters';

interface ArtistCardProps {
  artist: Artist;
}

export const ArtistCard: React.FC<ArtistCardProps> = ({ artist }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/artist/${artist.id}`)}
      className="group bg-spotify-card hover:bg-spotify-card-hover p-3.5 rounded-2xl border border-white/[0.05] hover:border-white/[0.12] transition-all duration-300 cursor-pointer flex flex-col items-center text-center relative shadow-sm hover:shadow-xl hover:-translate-y-0.5"
    >
      <div className="relative aspect-square w-full rounded-full overflow-hidden mb-3.5 shadow-xl bg-spotify-elevated ring-2 ring-white/5 group-hover:ring-spotify-green/40 transition-all">
        <img
          src={artist.imageUrl}
          alt={artist.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Floating Play Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/artist/${artist.id}`);
          }}
          className="absolute right-2 bottom-2 w-11 h-11 rounded-xl bg-gradient-to-br from-[#10D9A0] to-[#22D3EE] text-[#061214] flex items-center justify-center shadow-xl shadow-teal-500/30 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 hover:scale-105 transition-all duration-300"
        >
          <Play size={20} fill="#061214" className="ml-0.5" />
        </button>
      </div>

      <div className="flex flex-col min-w-0 w-full">
        <h3 className="text-sm font-bold text-white truncate">{artist.name}</h3>
        <p className="text-xs text-spotify-subtext mt-1">Verified Artist</p>
      </div>
    </div>
  );
};
