import React, { useState, useEffect, useMemo } from 'react';
import {
  Shop,
  UserLocation,
  LanguageCode,
  AiRecommendationResult,
  ShopCategory,
  ShopReview,
} from './types';
import { BASE_LOCATIONS, generateShopsForLocation } from './data/initialShops';
import { calculateDistanceMeters, formatDistance } from './utils/geo';
import { Header } from './components/Header';
import { RadarMap } from './components/RadarMap';
import { ShopCard } from './components/ShopCard';
import { ShopDetailModal } from './components/ShopDetailModal';
import { TurnByTurnNavModal } from './components/TurnByTurnNavModal';
import { AddShopModal } from './components/AddShopModal';
import { SystemAlgorithmModal } from './components/SystemAlgorithmModal';
import { ProjectDocsModal } from './components/ProjectDocsModal';
import { FlutterCodeViewerModal } from './components/FlutterCodeViewerModal';
import { AiAssistantBar } from './components/AiAssistantBar';
import { DealsBar } from './components/DealsBar';
import { TRANSLATIONS } from './data/translations';
import {
  SlidersHorizontal,
  Navigation,
  Compass,
  Store,
  CheckCircle2,
  Clock,
  Sparkles,
  Smartphone,
  ChevronRight,
  MapPin,
  RefreshCw,
  Award,
} from 'lucide-react';

const CATEGORIES_LIST: { id: string; name: string; icon: string }[] = [
  { id: 'All', name: 'All Stalls', icon: '🏪' },
  { id: 'Chai & Snacks', name: 'Chai & Snacks', icon: '☕' },
  { id: 'Xerox & Stationery', name: 'Xerox & Print', icon: '🖨️' },
  { id: 'Tailor & Alterations', name: 'Tailor & Alter', icon: '✂️' },
  { id: 'Kirana & Grocery', name: 'Kirana Store', icon: '🛒' },
  { id: 'Street Chaat & Food', name: 'Street Chaat', icon: '🍲' },
  { id: 'Cobbler & Leather', name: 'Cobbler & Shoe', icon: '👞' },
  { id: 'Juice & Fruits', name: 'Juice & Fruits', icon: '🥤' },
  { id: 'Flowers & Puja', name: 'Fresh Flowers', icon: '🌸' },
  { id: 'Watch & Key Repair', name: 'Watch & Keys', icon: '🔑' },
  { id: 'Mobile & Electronics', name: 'Mobile Cart', icon: '📱' },
];

export default function App() {
  // 1. User Location State
  const [userLocation, setUserLocation] = useState<UserLocation>({
    latitude: BASE_LOCATIONS[0].lat,
    longitude: BASE_LOCATIONS[0].lng,
    name: BASE_LOCATIONS[0].name,
    accuracyMeters: 5,
  });
  const [isUsingLiveGps, setIsUsingLiveGps] = useState(false);
  const [radiusMeters, setRadiusMeters] = useState<number>(500); // Strict 0.5km focus

  // 2. Shops State
  const [rawShops, setRawShops] = useState<Shop[]>(() =>
    generateShopsForLocation(BASE_LOCATIONS[0].lat, BASE_LOCATIONS[0].lng)
  );

  // 3. Filters State
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [filterOpenOnly, setFilterOpenOnly] = useState<boolean>(false);
  const [filterUpiOnly, setFilterUpiOnly] = useState<boolean>(false);
  const [showOnlySaved, setShowOnlySaved] = useState<boolean>(false);

  // 4. Saved / Bookmarked IDs
  const [savedShopIds, setSavedShopIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('locallens_saved_shops');
      return stored ? JSON.parse(stored) : ['shop-1', 'shop-2'];
    } catch {
      return ['shop-1', 'shop-2'];
    }
  });

  // 5. Active Shop & Navigation
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [activeRouteShop, setActiveRouteShop] = useState<Shop | null>(null);
  const [showTurnByTurnModal, setShowTurnByTurnModal] = useState<boolean>(false);

  // 6. AI State
  const [isAiActive, setIsAiActive] = useState<boolean>(false);
  const [currentAiQuery, setCurrentAiQuery] = useState<string>('');
  const [aiScoresMap, setAiScoresMap] = useState<Record<string, AiRecommendationResult>>({});

  // 7. Modals
  const [showAddShopModal, setShowAddShopModal] = useState<boolean>(false);
  const [showAlgorithmModal, setShowAlgorithmModal] = useState<boolean>(false);
  const [showFlutterCodeModal, setShowFlutterCodeModal] = useState<boolean>(false);
  const [showProjectDocsModal, setShowProjectDocsModal] = useState<boolean>(false);

  // 8. Language & UI Display Settings
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>('en');
  const [isMobileDeviceFrame, setIsMobileDeviceFrame] = useState<boolean>(false);
  const [activeMobileTab, setActiveMobileTab] = useState<'map' | 'stalls' | 'deals' | 'project'>('map');

  const t = TRANSLATIONS[selectedLanguage] || TRANSLATIONS.en;

  // Sync saved shops to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('locallens_saved_shops', JSON.stringify(savedShopIds));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [savedShopIds]);

  // Request Live GPS
  const handleRequestLiveGps = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const liveLat = pos.coords.latitude;
        const liveLng = pos.coords.longitude;
        setUserLocation({
          latitude: liveLat,
          longitude: liveLng,
          name: 'My Real-Time GPS Spot',
          accuracyMeters: Math.round(pos.coords.accuracy),
        });
        setIsUsingLiveGps(true);

        // Populate shops localized within 500m of user's real location
        setRawShops(generateShopsForLocation(liveLat, liveLng));
      },
      (err) => {
        console.warn('GPS Error or Denied:', err);
        alert(
          'Could not retrieve live GPS coordinates. Please grant location permissions or select a preset market hub.'
        );
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Switch to Preset Hub
  const handleSelectBaseLocation = (locId: string) => {
    const found = BASE_LOCATIONS.find((l) => l.id === locId);
    if (!found) return;

    setUserLocation({
      latitude: found.lat,
      longitude: found.lng,
      name: found.name,
      accuracyMeters: 4,
    });
    setIsUsingLiveGps(false);
    setRawShops(generateShopsForLocation(found.lat, found.lng));
  };

  // Recalculate distance from current user coordinates
  const shopsWithDistances = useMemo(() => {
    return rawShops.map((shop) => {
      const distance = calculateDistanceMeters(
        userLocation.latitude,
        userLocation.longitude,
        shop.latitude,
        shop.longitude
      );

      const aiInfo = aiScoresMap[shop.id];

      return {
        ...shop,
        distanceMeters: distance,
        aiMatchScore: aiInfo?.matchScore,
        aiReason: aiInfo?.aiReason,
        aiRecommendedItem: aiInfo?.recommendedItem,
      };
    });
  }, [rawShops, userLocation.latitude, userLocation.longitude, aiScoresMap]);

  // Filtered Shops based on radius, categories, and AI query
  const filteredShops = useMemo(() => {
    let result = shopsWithDistances.filter((shop) => {
      // 1. Strict radius filter (default 500m / 0.5km)
      if (shop.distanceMeters && shop.distanceMeters > radiusMeters) {
        return false;
      }

      // 2. Category filter
      if (selectedCategory !== 'All' && shop.category !== selectedCategory) {
        return false;
      }

      // 3. Open Now filter
      if (filterOpenOnly && !shop.isOpen) {
        return false;
      }

      // 4. UPI Accepted filter
      if (filterUpiOnly && !shop.upiAccepted) {
        return false;
      }

      // 5. Bookmarked filter
      if (showOnlySaved && !savedShopIds.includes(shop.id)) {
        return false;
      }

      return true;
    });

    // Sort order: If AI active, sort by AI match score; otherwise, closest street stall first
    if (isAiActive) {
      result.sort((a, b) => {
        const scoreA = a.aiMatchScore || 0;
        const scoreB = b.aiMatchScore || 0;
        return scoreB - scoreA;
      });
    } else {
      result.sort((a, b) => (a.distanceMeters || 0) - (b.distanceMeters || 0));
    }

    return result;
  }, [
    shopsWithDistances,
    radiusMeters,
    selectedCategory,
    filterOpenOnly,
    filterUpiOnly,
    showOnlySaved,
    savedShopIds,
    isAiActive,
  ]);

  // Toggle Save/Bookmark
  const handleToggleSave = (shopId: string) => {
    setSavedShopIds((prev) =>
      prev.includes(shopId) ? prev.filter((id) => id !== shopId) : [...prev, shopId]
    );
  };

  // Add Review
  const handleAddReview = (
    shopId: string,
    reviewData: Omit<ShopReview, 'id' | 'createdAt' | 'helpfulCount'>
  ) => {
    setRawShops((prev) =>
      prev.map((s) => {
        if (s.id !== shopId) return s;
        const newReview: ShopReview = {
          ...reviewData,
          id: `rev-${Date.now()}`,
          createdAt: 'Just now',
          helpfulCount: 0,
        };
        const updatedReviews = [newReview, ...s.reviews];
        const newRating =
          updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length;
        return {
          ...s,
          reviews: updatedReviews,
          rating: Number(newRating.toFixed(1)),
          reviewCount: s.reviewCount + 1,
        };
      })
    );
  };

  // Add New Shop (Owner Portal)
  const handleAddShop = (newShop: Shop) => {
    setRawShops((prev) => [newShop, ...prev]);
    setSelectedShop(newShop);
  };

  // Apply AI Recommendations
  const handleApplyAiRecommendations = (query: string, results: AiRecommendationResult[]) => {
    const mapping: Record<string, AiRecommendationResult> = {};
    results.forEach((r) => {
      mapping[r.id] = r;
    });
    setAiScoresMap(mapping);
    setCurrentAiQuery(query);
    setIsAiActive(true);
  };

  const handleClearAiFilter = () => {
    setIsAiActive(false);
    setCurrentAiQuery('');
    setAiScoresMap({});
  };

  // Start Navigation Route
  const handleStartNavigation = (shop: Shop) => {
    setActiveRouteShop(shop);
    setShowTurnByTurnModal(true);
  };

  // Main UI Canvas
  const content = (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* App Header */}
      <Header
        userLocation={userLocation}
        onSelectBaseLocation={handleSelectBaseLocation}
        onRequestLiveGps={handleRequestLiveGps}
        isUsingLiveGps={isUsingLiveGps}
        selectedLanguage={selectedLanguage}
        onChangeLanguage={setSelectedLanguage}
        savedCount={savedShopIds.length}
        showOnlySaved={showOnlySaved}
        onToggleShowSaved={() => setShowOnlySaved(!showOnlySaved)}
        onOpenAddShop={() => setShowAddShopModal(true)}
        onOpenAlgorithm={() => setShowAlgorithmModal(true)}
        onOpenFlutterCode={() => setShowFlutterCodeModal(true)}
        onOpenProjectDocs={() => setShowProjectDocsModal(true)}
        isMobileDeviceFrame={isMobileDeviceFrame}
        onToggleDeviceFrame={() => setIsMobileDeviceFrame(!isMobileDeviceFrame)}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 space-y-4">
        {/* College Project Notice & Quick Highlights Banner */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs flex-shrink-0">
              🎓
            </div>
            <div>
              <p className="text-xs font-bold text-white">
                LocalLens • AI Nearby Street Shop Finder
                <span className="text-amber-400 ml-1 font-normal">
                  (Professional College Project by Nisha Mary J)
                </span>
              </p>
              <p className="text-[11px] text-slate-400">
                Discover local/street shops within a strict 0.5km radius. Integrated with Flutter & Firebase architecture.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            <button
              onClick={() => setShowAlgorithmModal(true)}
              className="flex-1 sm:flex-initial bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              <span>Algorithm (Step 1-9)</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setShowFlutterCodeModal(true)}
              className="flex-1 sm:flex-initial bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              <span>Flutter Code</span>
            </button>
          </div>
        </div>

        {/* AI Assistant Search Bar */}
        <AiAssistantBar
          onApplyAiRecommendations={handleApplyAiRecommendations}
          onClearAiFilter={handleClearAiFilter}
          isAiActive={isAiActive}
          currentQuery={currentAiQuery}
          nearbyShops={shopsWithDistances}
        />

        {/* Hyper-Local Deals & Daily Offers Bar */}
        <DealsBar
          shops={shopsWithDistances}
          onSelectShop={(shop) => setSelectedShop(shop)}
        />

        {/* Categories Bar & Quick Filter Toggles */}
        <div className="space-y-2">
          {/* Category Chips Scroll */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
            {CATEGORIES_LIST.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                  selectedCategory === cat.id
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                    : 'bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white border-slate-800'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>

          {/* Filter Checkboxes & 0.5km Radius Selector */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilterOpenOnly(!filterOpenOnly)}
                className={`px-2.5 py-1 rounded-lg border transition flex items-center gap-1.5 ${
                  filterOpenOnly
                    ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300 font-bold'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Open Now</span>
              </button>

              <button
                onClick={() => setFilterUpiOnly(!filterUpiOnly)}
                className={`px-2.5 py-1 rounded-lg border transition flex items-center gap-1.5 ${
                  filterUpiOnly
                    ? 'bg-cyan-950/70 border-cyan-500 text-cyan-300 font-bold'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>UPI Accepted</span>
              </button>
            </div>

            {/* Radius Controller (0.5km strict focus, or expandable to 750m / 1km) */}
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-xl">
              <span className="text-[11px] text-slate-400 uppercase font-bold flex items-center gap-1">
                <Compass className="w-3 h-3 text-amber-400" />
                Radius:
              </span>
              <div className="flex items-center gap-1">
                {[300, 500, 750, 1000].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRadiusMeters(r)}
                    className={`px-2 py-0.5 rounded text-[11px] font-bold transition ${
                      radiusMeters === r
                        ? 'bg-amber-500 text-slate-950'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {r === 500 ? '0.5km (Strict)' : `${r}m`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Layout: Map + Shop Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-2">
          {/* Interactive Leaflet Radar Map (500m geofence) */}
          <div className="lg:col-span-6 xl:col-span-7 h-[360px] sm:h-[460px] lg:h-[620px] sticky top-20">
            <RadarMap
              userLocation={userLocation}
              shops={filteredShops}
              selectedShop={selectedShop}
              onSelectShop={(shop) => setSelectedShop(shop)}
              radiusMeters={radiusMeters}
              activeRouteShop={activeRouteShop}
              onClearRoute={() => setActiveRouteShop(null)}
            />
          </div>

          {/* Shop List Column */}
          <div className="lg:col-span-6 xl:col-span-5 space-y-3.5">
            <div className="flex items-center justify-between pb-1">
              <div>
                <h2 className="font-bold text-white text-base">
                  Nearby Street Stalls & Dukaan
                </h2>
                <p className="text-[11px] text-slate-400">
                  {filteredShops.length} verified vendors within {formatDistance(radiusMeters)}
                </p>
              </div>

              <button
                onClick={() => setShowAddShopModal(true)}
                className="text-xs bg-slate-900 hover:bg-slate-800 text-amber-400 border border-slate-800 hover:border-amber-500/50 px-2.5 py-1.5 rounded-xl font-bold transition flex items-center gap-1"
              >
                <Store className="w-3.5 h-3.5" />
                <span>+ List Stall</span>
              </button>
            </div>

            {/* List of Shop Cards */}
            {filteredShops.length > 0 ? (
              <div className="space-y-3">
                {filteredShops.map((shop) => (
                  <ShopCard
                    key={shop.id}
                    shop={shop}
                    isSaved={savedShopIds.includes(shop.id)}
                    onToggleSave={handleToggleSave}
                    onSelect={(s) => setSelectedShop(s)}
                    onNavigate={(s) => handleStartNavigation(s)}
                    isSelected={selectedShop?.id === shop.id}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto text-xl">
                  🔍
                </div>
                <h4 className="font-bold text-white text-sm">No Street Stalls Found</h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  No shops match your current category and filter within the {formatDistance(radiusMeters)} radius. Try expanding the radius or clearing filters!
                </p>
                <div className="pt-2 flex justify-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedCategory('All');
                      setFilterOpenOnly(false);
                      setFilterUpiOnly(false);
                      setRadiusMeters(1000);
                    }}
                    className="bg-amber-500 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition"
                  >
                    Reset All Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-900 bg-slate-950/80 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            LocalLens • Professional College Project Developed by <strong className="text-amber-400">Nisha Mary J</strong>
          </p>
          <div className="flex items-center gap-4 text-slate-400 text-xs">
            <button onClick={() => setShowProjectDocsModal(true)} className="hover:text-amber-400 transition">
              Project Architecture
            </button>
            <button onClick={() => setShowAlgorithmModal(true)} className="hover:text-amber-400 transition">
              Steps 1-9 Algorithm
            </button>
            <button onClick={() => setShowFlutterCodeModal(true)} className="hover:text-amber-400 transition">
              Flutter/Dart Code
            </button>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {selectedShop && (
        <ShopDetailModal
          shop={selectedShop}
          onClose={() => setSelectedShop(null)}
          isSaved={savedShopIds.includes(selectedShop.id)}
          onToggleSave={handleToggleSave}
          onStartNavigation={handleStartNavigation}
          onAddReview={handleAddReview}
        />
      )}

      {showTurnByTurnModal && activeRouteShop && (
        <TurnByTurnNavModal
          shop={activeRouteShop}
          userLocation={userLocation}
          onClose={() => {
            setShowTurnByTurnModal(false);
            setActiveRouteShop(null);
          }}
        />
      )}

      {showAddShopModal && (
        <AddShopModal
          userLat={userLocation.latitude}
          userLng={userLocation.longitude}
          onClose={() => setShowAddShopModal(false)}
          onAddShop={handleAddShop}
        />
      )}

      {showAlgorithmModal && (
        <SystemAlgorithmModal
          onClose={() => setShowAlgorithmModal(false)}
          userLocation={userLocation}
          totalShopsInRadius={filteredShops.length}
          sampleShop={filteredShops[0] || null}
        />
      )}

      {showProjectDocsModal && (
        <ProjectDocsModal onClose={() => setShowProjectDocsModal(false)} />
      )}

      {showFlutterCodeModal && (
        <FlutterCodeViewerModal onClose={() => setShowFlutterCodeModal(false)} />
      )}
    </div>
  );

  // If Mobile Mockup Frame is activated, wrap inside smartphone bezel
  if (isMobileDeviceFrame) {
    return (
      <div className="min-h-screen bg-slate-950 p-4 flex flex-col items-center justify-center font-['Plus_Jakarta_Sans',sans-serif]">
        {/* Toggle back to full screen banner */}
        <div className="mb-4 flex items-center justify-between w-full max-w-sm px-2 text-xs text-slate-400">
          <span className="flex items-center gap-1.5 font-bold text-amber-400">
            <Smartphone className="w-4 h-4" />
            Flutter Mobile App Mockup Shell
          </span>
          <button
            onClick={() => setIsMobileDeviceFrame(false)}
            className="text-white hover:text-amber-400 underline font-semibold transition"
          >
            Switch to Full Width
          </button>
        </div>

        {/* Smartphone Hardware Frame */}
        <div className="relative w-full max-w-[420px] h-[870px] bg-slate-900 rounded-[50px] p-3 shadow-2xl border-4 border-slate-700 ring-1 ring-slate-600 flex flex-col overflow-hidden">
          {/* Dynamic Island / Speaker Notch */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-4 bg-slate-950 rounded-full z-40 flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-900 mr-3"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-slate-800"></div>
          </div>

          {/* Screen Content Wrapper */}
          <div className="relative w-full h-full rounded-[42px] overflow-y-auto scrollbar-none bg-slate-950 flex flex-col pt-4">
            {content}
          </div>
        </div>
      </div>
    );
  }

  return content;
}
