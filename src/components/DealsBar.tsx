import React from 'react';
import { Tag, Sparkles, ArrowRight } from 'lucide-react';
import { Shop } from '../types';

interface DealsBarProps {
  shops: Shop[];
  onSelectShop: (shop: Shop) => void;
}

export const DealsBar: React.FC<DealsBarProps> = ({ shops, onSelectShop }) => {
  const shopsWithDeals = shops.filter((s) => s.activeDeal);

  if (shopsWithDeals.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/5 border border-amber-500/30 rounded-2xl p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
          <Tag className="w-3.5 h-3.5 text-amber-400" />
          <span>Hyperlocal Street Deals & Combos (0.5km)</span>
          <span className="bg-amber-500 text-slate-950 font-black text-[9px] px-1.5 py-0.2 rounded uppercase">
            Live
          </span>
        </div>
        <span className="text-[11px] text-slate-400">
          {shopsWithDeals.length} stalls offering deals today
        </span>
      </div>

      <div className="flex items-center gap-2.5 overflow-x-auto scrollbar-none pb-1">
        {shopsWithDeals.map((shop) => (
          <div
            key={shop.id}
            onClick={() => onSelectShop(shop)}
            className="flex-shrink-0 bg-slate-900/90 hover:bg-slate-850 border border-slate-700/80 hover:border-amber-500/60 rounded-xl p-2.5 cursor-pointer transition flex items-center gap-2.5 max-w-[280px] shadow-sm group"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs flex-shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[11px] font-bold text-white group-hover:text-amber-300 transition truncate">
                  {shop.name}
                </span>
                <span className="text-[10px] font-extrabold text-amber-400 bg-amber-500/15 px-1.5 py-0.2 rounded flex-shrink-0">
                  {shop.activeDeal?.discount}
                </span>
              </div>
              <p className="text-[10px] text-slate-300 truncate mt-0.5">
                {shop.activeDeal?.title}: {shop.activeDeal?.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
