import React, { useState } from 'react';
import { Sparkles, Search, Loader2, ArrowRight, X, Bot, Compass } from 'lucide-react';
import { Shop, AiRecommendationResult } from '../types';

interface AiAssistantBarProps {
  onApplyAiRecommendations: (query: string, results: AiRecommendationResult[]) => void;
  onClearAiFilter: () => void;
  isAiActive: boolean;
  currentQuery: string;
  nearbyShops: Shop[];
}

const PRESET_QUERIES = [
  '☕ Kadak ginger chai & hot bun maska',
  '📄 Urgent photocopy & spiral binding',
  '✂️ Jeans zipper fix or shirt alteration',
  '🍲 Crispy pani puri & dahi puri',
  '👞 Sports shoe sole repair or stitching',
  '🥥 Fresh sugarcane juice or coconut',
];

export const AiAssistantBar: React.FC<AiAssistantBarProps> = ({
  onApplyAiRecommendations,
  onClearAiFilter,
  isAiActive,
  currentQuery,
  nearbyShops,
}) => {
  const [queryInput, setQueryInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAssistantChat, setShowAssistantChat] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [assistantReply, setAssistantReply] = useState<string | null>(null);
  const [isAskingAssistant, setIsAskingAssistant] = useState(false);

  const handleSearch = async (queryText: string) => {
    if (!queryText.trim()) return;
    setIsLoading(true);
    setQueryInput(queryText);

    try {
      const response = await fetch('/api/ai/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userQuery: queryText,
          shops: nearbyShops,
          userPreferences: ['student budget', 'quick service', 'under 500m'],
        }),
      });

      const data = await response.json();
      if (data.recommendations) {
        onApplyAiRecommendations(queryText, data.recommendations);
      }
    } catch (err) {
      console.error('AI Recommend Error:', err);
      // Fallback client-side matching
      const queryLower = queryText.toLowerCase();
      const fallbackResults: AiRecommendationResult[] = nearbyShops.map((shop) => {
        let score = 65;
        if (
          shop.name.toLowerCase().includes(queryLower) ||
          shop.specialties.some((s) => s.toLowerCase().includes(queryLower))
        ) {
          score += 25;
        }
        return {
          id: shop.id,
          matchScore: Math.min(score, 98),
          aiReason: `Matches "${queryText}" just ${Math.round(shop.distanceMeters || 100)}m away.`,
          recommendedItem: shop.specialties[0] || 'Popular choice',
        };
      });
      onApplyAiRecommendations(queryText, fallbackResults);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAskAssistant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    setIsAskingAssistant(true);
    try {
      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: chatMessage,
          nearbyShops: nearbyShops.slice(0, 8),
        }),
      });
      const data = await res.json();
      setAssistantReply(data.reply);
    } catch {
      setAssistantReply(
        `Within 500m, there are ${nearbyShops.length} street stalls and dukaan shops ready to help you.`
      );
    } finally {
      setIsAskingAssistant(false);
    }
  };

  return (
    <div className="space-y-2.5">
      {/* Search Input Bar */}
      <div className="relative flex items-center">
        <div className="absolute left-3.5 flex items-center gap-1.5 pointer-events-none text-amber-400">
          <Sparkles className="w-4 h-4 animate-pulse" />
        </div>

        <input
          type="text"
          value={queryInput}
          onChange={(e) => setQueryInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSearch(queryInput);
          }}
          placeholder="Ask AI: 'Where can I get stitching done for ₹50?' or 'tea & snacks'..."
          className="w-full bg-slate-900 border border-slate-700 focus:border-amber-500 rounded-2xl pl-10 pr-24 py-3 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none transition shadow-lg"
        />

        <div className="absolute right-2 flex items-center gap-1">
          {isAiActive && (
            <button
              onClick={() => {
                setQueryInput('');
                onClearAiFilter();
              }}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition"
              title="Clear Filter"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => handleSearch(queryInput)}
            disabled={isLoading || !queryInput.trim()}
            className="bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 transition shadow-md shadow-amber-500/20 active:scale-95"
          >
            {isLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <>
                <Search className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Ask AI</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Preset Query Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
        <button
          onClick={() => setShowAssistantChat(!showAssistantChat)}
          className="flex-shrink-0 flex items-center gap-1 bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-1 rounded-xl text-[11px] font-bold hover:border-amber-400 transition"
        >
          <Bot className="w-3 h-3 text-amber-400" />
          <span>Lensy AI Chat</span>
        </button>

        {PRESET_QUERIES.map((preset, idx) => (
          <button
            key={idx}
            onClick={() => handleSearch(preset.replace(/^[^\s]+\s/, ''))}
            className="flex-shrink-0 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 px-2.5 py-1 rounded-xl text-[11px] transition whitespace-nowrap"
          >
            {preset}
          </button>
        ))}
      </div>

      {/* Active AI Query Notification Bar */}
      {isAiActive && (
        <div className="bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-transparent border border-amber-500/40 rounded-2xl p-2.5 flex items-center justify-between text-xs text-amber-200">
          <div className="flex items-center gap-2">
            <span className="text-base">⚡</span>
            <div>
              <p className="font-bold text-white text-xs">
                AI Recommendation Filter Active: "{currentQuery}"
              </p>
              <p className="text-[11px] text-amber-300">
                Ranked by collaborative match score & 500m proximity
              </p>
            </div>
          </div>
          <button
            onClick={onClearAiFilter}
            className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg border border-slate-700 transition"
          >
            Reset
          </button>
        </div>
      )}

      {/* Lensy AI Hyperlocal Chat Sheet */}
      {showAssistantChat && (
        <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-3.5 space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs">
                🤖
              </div>
              <div>
                <h4 className="font-bold text-white text-xs">Lensy Street Assistant</h4>
                <p className="text-[10px] text-slate-400">Ask any question about stalls within 500m</p>
              </div>
            </div>
            <button
              onClick={() => setShowAssistantChat(false)}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {assistantReply && (
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-200 leading-relaxed">
              <p className="text-amber-400 font-bold text-[10px] uppercase mb-1">
                Hyperlocal Insight:
              </p>
              {assistantReply}
            </div>
          )}

          <form onSubmit={handleAskAssistant} className="flex gap-2">
            <input
              type="text"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="e.g. Which tailor can replace a zip right now?"
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              disabled={isAskingAssistant || !chatMessage.trim()}
              className="bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1 transition"
            >
              {isAskingAssistant ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
