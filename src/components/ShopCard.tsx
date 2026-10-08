import React from 'react';
import { Shop } from '../types';
import { formatDistance, calculateWalkingMinutes } from '../utils/geo';
import { Phone, MessageCircle, Navigation, Bookmark, Star, Clock, CheckCircle2 } from 'lucide-react';

interface ShopCardProps {
  shop: Shop;
  isSaved: boolean;
  onToggleSave: (shopId: string) => void;
  onSelect: (shop: Shop) => void;
  onNavigate: (shop: Shop) => void;
  isSelected?: boolean;
}

export const ShopCard: React.FC<ShopCardProps> = ({
  shop,
  isSaved,
  onToggleSave,
  onSelect,
  onNavigate,
  isSelected = false,
}) => {
  const distText = shop.distanceMeters !== undefined ? formatDistance(shop.distanceMeters) : '--';
  const walkMins = shop.distanceMeters !== undefined ? calculateWalkingMinutes(shop.distanceMeters) : 1;

  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.location.href = `tel:${shop.phone}`;
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!shop.whatsapp) return;
    const cleanPhone = shop.whatsapp.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `Hello ${shop.ownerName}! I found "${shop.name}" on LocalLens nearby. Are you open right now?`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  const handleNavigateClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onNavigate(shop);
  };

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleSave(shop.id);
  };

  return (
    <div
      onClick={() => onSelect(shop)}
      className={`group relative bg-slate-900/90 border rounded-2xl p-4 transition-all duration-200 cursor-pointer hover:shadow-xl hover:border-amber-500/60 ${
        isSelected
          ? 'border-amber-500 ring-2 ring-amber-500/30 bg-slate-850'
          : 'border-slate-800'
      }`}
    >
      {/* AI Match Badge (if available) */}
      {shop.aiMatchScore && shop.aiMatchScore > 75 && (
        <div className="mb-2.5 flex items-center justify-between bg-gradient-to-r from-amber-500/20 via-orange-500/15 to-transparent border border-amber-500/40 rounded-xl px-2.5 py-1 text-xs text-amber-300">
          <div className="flex items-center gap-1.5 font-bold">
            <span className="text-amber-400">⚡</span>
            <span>{shop.aiMatchScore}% AI Match</span>
          </div>
          {shop.aiReason && (
            <span className="text-[11px] text-slate-300 truncate max-w-[220px]">
              {shop.aiReason}
            </span>
          )}
        </div>
      )}

      {/* Main Shop Info Layout */}
      <div className="flex gap-3.5">
        {/* Thumbnail Image */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-slate-800 flex-shrink-0 border border-slate-700">
          <img
            src={shop.imageUrl}
            alt={shop.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          <div className="absolute top-1 left-1 bg-slate-950/80 backdrop-blur-xs text-[10px] font-bold text-amber-400 px-1.5 py-0.5 rounded">
            {shop.priceRange}
          </div>
          <div
            className={`absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
              shop.isOpen
                ? 'bg-emerald-500 text-slate-950'
                : 'bg-slate-700 text-slate-300'
            }`}
          >
            {shop.isOpen ? 'Open' : 'Closed'}
          </div>
        </div>

        {/* Info Column */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-1">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                {shop.stallType}
              </span>
              <h3 className="font-bold text-white text-base group-hover:text-amber-400 transition-colors truncate mt-1">
                {shop.name}
              </h3>
            </div>
            <button
              onClick={handleSaveClick}
              className={`p-1.5 rounded-lg transition ${
                isSaved
                  ? 'text-amber-400 bg-amber-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title={isSaved ? 'Remove Bookmark' : 'Save Shop'}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-400' : ''}`} />
            </button>
          </div>

          {/* Distance and Walking Time */}
          <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-300">
            <span className="font-bold text-amber-400 flex items-center gap-1 bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700">
              <Navigation className="w-3 h-3 text-amber-400" />
              {distText}
            </span>
            <span className="text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              ~{walkMins} min walk
            </span>
            <span className="text-slate-400 flex items-center gap-1 ml-auto">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span className="font-bold text-white">{shop.rating.toFixed(1)}</span>
              <span className="text-[11px] text-slate-400">({shop.reviewCount})</span>
            </span>
          </div>

          {/* Landmark */}
          <p className="text-xs text-slate-400 truncate mt-1.5">
            📍 {shop.landmark}
          </p>

          {/* Specialties Pills */}
          <div className="flex flex-wrap gap-1 mt-2">
            {shop.specialties.slice(0, 3).map((item, idx) => (
              <span
                key={idx}
                className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700/60"
              >
                {item}
              </span>
            ))}
            {shop.upiAccepted && (
              <span className="text-[10px] bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 px-1.5 py-0.5 rounded-md flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-2.5 h-2.5" />
                UPI
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Active Deal Ribbon (if available) */}
      {shop.activeDeal && (
        <div className="mt-3 bg-amber-500/10 border border-amber-500/30 rounded-xl p-2 flex items-center justify-between text-xs text-amber-200">
          <div className="flex items-center gap-1.5 truncate">
            <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded uppercase">
              {shop.activeDeal.badge || 'DEAL'}
            </span>
            <span className="font-semibold truncate">{shop.activeDeal.title}:</span>
            <span className="text-amber-300 font-bold">{shop.activeDeal.discount}</span>
          </div>
          <span className="text-[10px] text-slate-400 flex-shrink-0 ml-2">
            Ends {shop.activeDeal.validUntil}
          </span>
        </div>
      )}

      {/* Quick Action Buttons */}
      <div className="mt-3 pt-3 border-t border-slate-800 flex items-center gap-2">
        <button
          onClick={handleCall}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition active:scale-95 border border-slate-700"
        >
          <Phone className="w-3.5 h-3.5 text-emerald-400" />
          <span>Call</span>
        </button>

        {shop.whatsapp && (
          <button
            onClick={handleWhatsApp}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-200 text-xs font-semibold transition active:scale-95 border border-emerald-800/60"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>WhatsApp</span>
          </button>
        )}

        <button
          onClick={handleNavigateClick}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition active:scale-95 shadow-md shadow-amber-500/10"
        >
          <Navigation className="w-3.5 h-3.5 fill-slate-950" />
          <span>Navigate</span>
        </button>
      </div>
    </div>
  );
};
