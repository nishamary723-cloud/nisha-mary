import React, { useState } from 'react';
import { Shop, ShopReview } from '../types';
import { formatDistance, calculateWalkingMinutes } from '../utils/geo';
import {
  X,
  Phone,
  MessageCircle,
  Navigation,
  Bookmark,
  Star,
  Clock,
  MapPin,
  CheckCircle2,
  Share2,
  ThumbsUp,
  Send,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';

interface ShopDetailModalProps {
  shop: Shop | null;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (shopId: string) => void;
  onStartNavigation: (shop: Shop) => void;
  onAddReview: (shopId: string, review: Omit<ShopReview, 'id' | 'createdAt' | 'helpfulCount'>) => void;
}

export const ShopDetailModal: React.FC<ShopDetailModalProps> = ({
  shop,
  onClose,
  isSaved,
  onToggleSave,
  onStartNavigation,
  onAddReview,
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'services' | 'reviews'>('info');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [copiedShare, setCopiedShare] = useState(false);

  if (!shop) return null;

  const distText = shop.distanceMeters !== undefined ? formatDistance(shop.distanceMeters) : '--';
  const walkMins = shop.distanceMeters !== undefined ? calculateWalkingMinutes(shop.distanceMeters) : 1;

  const handleShare = () => {
    navigator.clipboard.writeText(
      `Check out ${shop.name} (${shop.category}) on LocalLens! Located at ${shop.landmark}.`
    );
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewComment.trim()) return;

    onAddReview(shop.id, {
      userName: reviewerName.trim(),
      rating: reviewRating,
      comment: reviewComment.trim(),
    });

    setReviewerName('');
    setReviewComment('');
    setShowReviewForm(false);
  };

  const handleWhatsAppItemOrder = (itemName: string, price: string) => {
    if (!shop.whatsapp) return;
    const cleanPhone = shop.whatsapp.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `Hi ${shop.ownerName}! I am at LocalLens (within 500m). Is "${itemName}" (${price}) available right now?`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header Image & Overlays */}
        <div className="relative h-48 sm:h-56 w-full bg-slate-800 flex-shrink-0">
          <img
            src={shop.imageUrl}
            alt={shop.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

          {/* Close & Action Buttons */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <span className="bg-slate-950/80 backdrop-blur-md text-amber-400 border border-amber-500/30 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {shop.stallType}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="bg-slate-950/80 hover:bg-slate-900 text-white p-2 rounded-full backdrop-blur-md border border-slate-700 transition"
                title="Share Shop"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onToggleSave(shop.id)}
                className={`p-2 rounded-full backdrop-blur-md border border-slate-700 transition ${
                  isSaved
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-950/80 text-white hover:bg-slate-900'
                }`}
                title="Save Shop"
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={onClose}
                className="bg-slate-950/80 hover:bg-slate-900 text-slate-300 hover:text-white p-2 rounded-full backdrop-blur-md border border-slate-700 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Title & Proximity Bar */}
          <div className="absolute bottom-3 left-4 right-4">
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                {shop.name}
              </h2>
            </div>
            <p className="text-xs text-amber-300 flex items-center gap-2 mt-1 font-semibold">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>{shop.landmark}</span>
              <span>•</span>
              <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
                {distText} away (~{walkMins} min walk)
              </span>
            </p>
          </div>
        </div>

        {/* Copy share banner */}
        {copiedShare && (
          <div className="bg-emerald-500 text-slate-950 text-xs font-bold text-center py-1">
            Shop details copied to clipboard!
          </div>
        )}

        {/* Navigation / Call Action Toolbar */}
        <div className="p-3 bg-slate-950/80 border-b border-slate-800 flex items-center gap-2">
          <a
            href={`tel:${shop.phone}`}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition border border-slate-700"
          >
            <Phone className="w-4 h-4 text-emerald-400" />
            <span>Call Vendor</span>
          </a>

          {shop.whatsapp && (
            <button
              onClick={() => {
                const cleanPhone = shop.whatsapp!.replace(/[^0-9]/g, '');
                window.open(
                  `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                    `Hello ${shop.ownerName}, saw your stall on LocalLens!`
                  )}`,
                  '_blank'
                );
              }}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 text-xs font-bold transition border border-emerald-700/60"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp</span>
            </button>
          )}

          <button
            onClick={() => {
              onStartNavigation(shop);
              onClose();
            }}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition shadow-lg shadow-amber-500/20"
          >
            <Navigation className="w-4 h-4 fill-slate-950" />
            <span>Walk Route</span>
          </button>
        </div>

        {/* Tabs: Info, Menu/Services, Reviews */}
        <div className="flex border-b border-slate-800 bg-slate-900/60 px-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('info')}
            className={`py-3 px-3 border-b-2 transition ${
              activeTab === 'info'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Vendor Details
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`py-3 px-3 border-b-2 transition ${
              activeTab === 'services'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Menu & Rates ({shop.services.length})
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-3 px-3 border-b-2 transition ${
              activeTab === 'reviews'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Reviews ({shop.reviews.length})
          </button>
        </div>

        {/* Tab Contents (Scrollable) */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4 text-xs">
          {activeTab === 'info' && (
            <div className="space-y-4">
              {/* Timing & Payment badges */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/80 flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Hours</span>
                    <p className="font-bold text-white text-xs">{shop.operatingHours}</p>
                    <span className={shop.isOpen ? 'text-emerald-400 text-[10px]' : 'text-slate-400 text-[10px]'}>
                      ● {shop.isOpen ? 'Open Now' : 'Closed'}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/80 flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Payment</span>
                    <p className="font-bold text-white text-xs">
                      {shop.upiAccepted ? 'UPI & QR Code' : 'Cash Preferred'}
                    </p>
                    <span className="text-[10px] text-slate-400">Range: {shop.priceRange}</span>
                  </div>
                </div>
              </div>

              {/* Vendor Story */}
              <div className="bg-gradient-to-br from-amber-500/10 via-slate-800/60 to-slate-800/60 p-3.5 rounded-2xl border border-amber-500/20">
                <div className="flex items-center gap-2 mb-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <h4 className="font-bold text-amber-300 text-xs">Street Vendor Heritage & Story</h4>
                </div>
                <p className="text-slate-300 leading-relaxed text-xs">{shop.vendorStory}</p>
                <div className="mt-2 pt-2 border-t border-slate-700/60 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Vendor: <strong className="text-white">{shop.ownerName}</strong></span>
                  <span>Address: {shop.address}</span>
                </div>
              </div>

              {/* Specialties */}
              <div>
                <h4 className="font-bold text-white text-xs mb-2">Popular Vernacular Specialties</h4>
                <div className="flex flex-wrap gap-1.5">
                  {shop.specialties.map((item, idx) => (
                    <span
                      key={idx}
                      className="bg-slate-800 hover:bg-slate-700 text-amber-300 px-2.5 py-1 rounded-xl border border-slate-700 text-xs font-medium"
                    >
                      ★ {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Active Deal / Promo */}
              {shop.activeDeal && (
                <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 p-3 rounded-2xl">
                  <div className="flex items-center justify-between mb-1">
                    <span className="bg-amber-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded uppercase">
                      Special Offer
                    </span>
                    <span className="text-amber-300 font-bold text-xs">
                      {shop.activeDeal.discount}
                    </span>
                  </div>
                  <h5 className="font-bold text-white text-xs">{shop.activeDeal.title}</h5>
                  <p className="text-[11px] text-slate-300">{shop.activeDeal.description}</p>
                  <p className="text-[10px] text-slate-400 mt-1">Valid until: {shop.activeDeal.validUntil}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'services' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-400">
                  Direct pricing from {shop.ownerName}. Tap any item to ping vendor on WhatsApp!
                </span>
              </div>
              {shop.services.map((svc, idx) => (
                <div
                  key={idx}
                  className="bg-slate-800/80 hover:bg-slate-800 p-3 rounded-2xl border border-slate-700 flex items-center justify-between transition group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-xs border border-amber-500/20">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-bold text-white text-xs group-hover:text-amber-400 transition">
                        {svc.name}
                      </p>
                      <span className="text-[11px] text-emerald-400 font-semibold">{svc.price}</span>
                    </div>
                  </div>

                  {shop.whatsapp && (
                    <button
                      onClick={() => handleWhatsAppItemOrder(svc.name, svc.price)}
                      className="flex items-center gap-1 bg-emerald-950/70 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/60 px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition active:scale-95"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      <span>Inquire</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-slate-800/60 p-3 rounded-2xl border border-slate-700">
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-black text-amber-400">
                    {shop.rating.toFixed(1)}
                  </div>
                  <div>
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < Math.round(shop.rating) ? 'fill-amber-400' : 'text-slate-600'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[11px] text-slate-400">
                      Based on {shop.reviewCount} local reviews
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-3 py-1.5 rounded-xl font-bold text-xs transition"
                >
                  {showReviewForm ? 'Cancel' : 'Write Review'}
                </button>
              </div>

              {/* Review Form */}
              {showReviewForm && (
                <form
                  onSubmit={handleReviewSubmit}
                  className="bg-slate-850 p-3.5 rounded-2xl border border-amber-500/40 space-y-3"
                >
                  <h4 className="font-bold text-white text-xs">Share Your Experience</h4>
                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      placeholder="e.g. Rahul, Sneha"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">
                      Rating
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className="p-1"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              star <= reviewRating
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-slate-600'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">
                      Feedback / Tip for Locals
                    </label>
                    <textarea
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Was the service fast? Did they accept UPI? Best item to order?"
                      rows={2}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-500"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Post Review</span>
                  </button>
                </form>
              )}

              {/* Reviews List */}
              <div className="space-y-2.5">
                {shop.reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700/80 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center text-[10px]">
                          {rev.userName[0]}
                        </div>
                        <span className="font-bold text-white text-xs">{rev.userName}</span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-400 text-[11px]">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span>{rev.rating}</span>
                        <span className="text-slate-500 text-[10px] ml-1">● {rev.createdAt}</span>
                      </div>
                    </div>
                    <p className="text-slate-300 text-xs">{rev.comment}</p>
                    <div className="flex items-center gap-1 text-[10px] text-slate-500 pt-1">
                      <ThumbsUp className="w-3 h-3" />
                      <span>{rev.helpfulCount} locals found this helpful</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
