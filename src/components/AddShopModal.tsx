import React, { useState } from 'react';
import { Shop, ShopCategory } from '../types';
import { X, Store, Sparkles, MapPin, CheckCircle2, Loader2, Plus } from 'lucide-react';

interface AddShopModalProps {
  userLat: number;
  userLng: number;
  onClose: () => void;
  onAddShop: (shop: Shop) => void;
}

const CATEGORIES: ShopCategory[] = [
  'Chai & Snacks',
  'Kirana & Grocery',
  'Tailor & Alterations',
  'Xerox & Stationery',
  'Street Chaat & Food',
  'Cobbler & Leather',
  'Juice & Fruits',
  'Flowers & Puja',
  'Watch & Key Repair',
  'Mobile & Electronics',
  'Other',
];

export const AddShopModal: React.FC<AddShopModalProps> = ({
  userLat,
  userLng,
  onClose,
  onAddShop,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ShopCategory>('Chai & Snacks');
  const [stallType, setStallType] = useState<Shop['stallType']>('Pushcart Stall');
  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('+91 ');
  const [whatsapp, setWhatsapp] = useState('+91 ');
  const [landmark, setLandmark] = useState('');
  const [operatingHours, setOperatingHours] = useState('08:00 AM - 09:30 PM');
  const [priceRange, setPriceRange] = useState<'₹' | '₹₹' | '₹₹₹'>('₹');
  const [upiAccepted, setUpiAccepted] = useState(true);
  const [specialties, setSpecialties] = useState('');
  const [vendorStory, setVendorStory] = useState('');
  const [dailyOffer, setDailyOffer] = useState('');

  const [isGeneratingAiPitch, setIsGeneratingAiPitch] = useState(false);
  const [aiGeneratedTagline, setAiGeneratedTagline] = useState<string | null>(null);

  const handleGenerateAiPitch = async () => {
    if (!name || !category) return;
    setIsGeneratingAiPitch(true);
    try {
      const res = await fetch('/api/ai/vendor-pitch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shopName: name,
          category,
          landmark,
          items: specialties,
        }),
      });
      const data = await res.json();
      if (data.tagline) {
        setAiGeneratedTagline(data.tagline);
        if (!vendorStory) setVendorStory(data.tagline);
      }
      if (data.dailyDeal && !dailyOffer) {
        setDailyOffer(data.dailyDeal);
      }
    } catch {
      setAiGeneratedTagline(`Authentic ${category} stall serving delicious street favorites near ${landmark || 'the corner'}.`);
    } finally {
      setIsGeneratingAiPitch(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !ownerName.trim()) return;

    // Place new shop at a realistic slight offset (~100m) from user
    const offsetLat = (Math.random() - 0.5) * 0.002;
    const offsetLng = (Math.random() - 0.5) * 0.002;

    const specsArray = specialties
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const newShop: Shop = {
      id: `user-shop-${Date.now()}`,
      name: name.trim(),
      category,
      stallType,
      ownerName: ownerName.trim(),
      landmark: landmark.trim() || 'Street Corner, Near Market',
      address: `Opposite ${landmark.trim() || 'Main Gate'}, Gali 3`,
      latitude: userLat + offsetLat,
      longitude: userLng + offsetLng,
      phone: phone.trim() || '+91 98450 99999',
      whatsapp: whatsapp.trim() || phone.trim(),
      operatingHours,
      isOpen: true,
      rating: 5.0,
      reviewCount: 1,
      priceRange,
      upiAccepted,
      specialties: specsArray.length > 0 ? specsArray : ['Fresh Street Special', 'Fast Turnaround'],
      tags: [category, 'Street Stall', 'New Dukaan'],
      imageUrl:
        category === 'Chai & Snacks'
          ? 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80'
          : category === 'Xerox & Stationery'
          ? 'https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&w=600&q=80'
          : 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
      vendorStory:
        vendorStory.trim() ||
        aiGeneratedTagline ||
        `Locally registered street vendor proud to serve neighbors and students with genuine care.`,
      services: specsArray.map((item, idx) => ({
        name: item,
        price: idx === 0 ? '₹30' : '₹50',
      })),
      activeDeal: dailyOffer
        ? {
            id: `deal-${Date.now()}`,
            title: 'Welcome Deal',
            description: dailyOffer,
            discount: 'Special',
            validUntil: 'All Day',
            badge: 'New Stall',
          }
        : undefined,
      reviews: [
        {
          id: `rev-${Date.now()}`,
          userName: 'Local Resident',
          rating: 5,
          comment: 'Welcome to LocalLens! Excited to have this stall listed nearby.',
          createdAt: 'Just now',
          helpfulCount: 1,
        },
      ],
    };

    onAddShop(newShop);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg max-h-[92vh] bg-slate-900 border border-amber-500/30 rounded-3xl p-5 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">List Your Street Dukaan</h3>
              <p className="text-[11px] text-slate-400">
                Register small vendor cart or shop on the 0.5km radar
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 py-4 space-y-3.5 text-xs pr-1">
          {/* Shop Name & Owner Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                Shop / Stall Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Gupta Chai Tapri"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                Owner / Vendor Name *
              </label>
              <input
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder="e.g. Ramesh Bhai"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                required
              />
            </div>
          </div>

          {/* Category & Stall Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ShopCategory)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                Stall Type
              </label>
              <select
                value={stallType}
                onChange={(e) => setStallType(e.target.value as Shop['stallType'])}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
              >
                <option value="Pushcart Stall">Pushcart Stall (Thela)</option>
                <option value="Sidewalk Kiosk">Sidewalk Kiosk (Chota Kiosk)</option>
                <option value="Small Dukaan">Small Dukaan / Shop</option>
                <option value="Mom & Pop Store">Mom & Pop Store</option>
              </select>
            </div>
          </div>

          {/* Contact Numbers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                Phone Number (Calls)
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                WhatsApp Number
              </label>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Landmark & Street Spot */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
              Exact Street Landmark (Easy for customers to find)
            </label>
            <div className="relative">
              <input
                type="text"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                placeholder="e.g. Under Banyan Tree, opposite Gate 2, near post office"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-8 pr-3 py-2 text-white focus:outline-none focus:border-amber-500"
              />
              <MapPin className="w-3.5 h-3.5 text-amber-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          {/* Key Specialties */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
              Key Specialties (Comma separated)
            </label>
            <input
              type="text"
              value={specialties}
              onChange={(e) => setSpecialties(e.target.value)}
              placeholder="e.g. Masala Chai, Bun Maska, Samosa, Poha"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* AI Pitch Generator Button */}
          <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-transparent p-3 rounded-2xl border border-amber-500/25 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <div>
                <p className="font-bold text-amber-300 text-xs">AI Tagline & Daily Offer Generator</p>
                <p className="text-[10px] text-slate-400">Generate an authentic street pitch via Gemini</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleGenerateAiPitch}
              disabled={isGeneratingAiPitch || !name}
              className="bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 transition"
            >
              {isGeneratingAiPitch ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>Thinking...</span>
                </>
              ) : (
                <span>Auto-Generate</span>
              )}
            </button>
          </div>

          {/* Vendor Story & Daily Offer */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
              Vendor Story / Pitch
            </label>
            <textarea
              value={vendorStory}
              onChange={(e) => setVendorStory(e.target.value)}
              placeholder="Tell nearby shoppers what makes your stall unique..."
              rows={2}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
              Today's Daily Deal or Student Offer (Optional)
            </label>
            <input
              type="text"
              value={dailyOffer}
              onChange={(e) => setDailyOffer(e.target.value)}
              placeholder="e.g. Free extra chutney on 2 plates / 10% off for college students"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Payment & Price options */}
          <div className="flex items-center justify-between bg-slate-800/60 p-3 rounded-xl border border-slate-700">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={upiAccepted}
                onChange={(e) => setUpiAccepted(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 focus:ring-0 bg-slate-700"
              />
              <span className="text-xs font-semibold text-white">Accepts UPI (GPay/PhonePe/Paytm)</span>
            </label>
            <div className="flex items-center gap-1">
              {(['₹', '₹₹', '₹₹₹'] as const).map((pr) => (
                <button
                  key={pr}
                  type="button"
                  onClick={() => setPriceRange(pr)}
                  className={`px-2 py-0.5 rounded text-xs font-bold transition ${
                    priceRange === pr
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  {pr}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>List Stall on 0.5km Radar Instantly</span>
          </button>
        </form>
      </div>
    </div>
  );
};
