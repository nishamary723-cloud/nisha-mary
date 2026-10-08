import React from 'react';
import {
  Navigation,
  MapPin,
  Globe2,
  Bookmark,
  GraduationCap,
  Activity,
  Code2,
  PlusCircle,
  Smartphone,
  Monitor,
} from 'lucide-react';
import { LanguageCode, UserLocation } from '../types';
import { BASE_LOCATIONS } from '../data/initialShops';

interface HeaderProps {
  userLocation: UserLocation;
  onSelectBaseLocation: (locId: string) => void;
  onRequestLiveGps: () => void;
  isUsingLiveGps: boolean;
  selectedLanguage: LanguageCode;
  onChangeLanguage: (lang: LanguageCode) => void;
  savedCount: number;
  showOnlySaved: boolean;
  onToggleShowSaved: () => void;
  onOpenAddShop: () => void;
  onOpenAlgorithm: () => void;
  onOpenFlutterCode: () => void;
  onOpenProjectDocs: () => void;
  isMobileDeviceFrame: boolean;
  onToggleDeviceFrame: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  userLocation,
  onSelectBaseLocation,
  onRequestLiveGps,
  isUsingLiveGps,
  selectedLanguage,
  onChangeLanguage,
  savedCount,
  showOnlySaved,
  onToggleShowSaved,
  onOpenAddShop,
  onOpenAlgorithm,
  onOpenFlutterCode,
  onOpenProjectDocs,
  isMobileDeviceFrame,
  onToggleDeviceFrame,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-3 sm:px-6 py-3">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Logo and Tagline */}
        <div className="flex items-center justify-between w-full sm:w-auto">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 p-0.5 shadow-lg shadow-amber-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Navigation className="w-5 h-5 text-amber-400 fill-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-white text-lg tracking-tight flex items-center gap-1">
                  Local<span className="text-amber-400">Lens</span>
                </h1>
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
                  0.5km Focus
                </span>
              </div>
              <p className="text-[11px] text-slate-400 flex items-center gap-1.5 font-medium">
                <span>By Nisha Mary J</span>
                <span>•</span>
                <span className="text-amber-300">Street Shop Finder</span>
              </p>
            </div>
          </div>

          {/* Device Frame Toggle on small screens */}
          <div className="sm:hidden flex items-center gap-1.5">
            <button
              onClick={onToggleDeviceFrame}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300"
              title="Toggle Mobile Mockup View"
            >
              {isMobileDeviceFrame ? <Monitor className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Location Switcher & Live GPS Button */}
        <div className="flex items-center flex-wrap gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs">
            <MapPin className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <select
              value={isUsingLiveGps ? 'live' : userLocation.name}
              onChange={(e) => {
                const val = e.target.value;
                if (val === 'live') {
                  onRequestLiveGps();
                } else {
                  onSelectBaseLocation(val);
                }
              }}
              className="bg-transparent text-white text-xs font-semibold focus:outline-none cursor-pointer max-w-[160px] sm:max-w-[210px] truncate"
            >
              <option value="live" className="bg-slate-900 text-amber-300">
                🛰️ Live GPS Hardware
              </option>
              {BASE_LOCATIONS.map((loc) => (
                <option key={loc.id} value={loc.id} className="bg-slate-900 text-white">
                  📍 {loc.name}
                </option>
              ))}
            </select>
          </div>

          {/* Language Selector */}
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl px-2 py-1.5 text-xs text-slate-300">
            <Globe2 className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedLanguage}
              onChange={(e) => onChangeLanguage(e.target.value as LanguageCode)}
              className="bg-transparent text-white text-xs font-semibold focus:outline-none cursor-pointer"
            >
              <option value="en" className="bg-slate-900">EN</option>
              <option value="hi" className="bg-slate-900">हिंदी</option>
              <option value="ta" className="bg-slate-900">தமிழ்</option>
              <option value="te" className="bg-slate-900">తెలుగు</option>
              <option value="ml" className="bg-slate-900">മലയാളം</option>
            </select>
          </div>

          {/* Bookmarked Filter */}
          <button
            onClick={onToggleShowSaved}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition border ${
              showOnlySaved
                ? 'bg-amber-500 text-slate-950 border-amber-400'
                : 'bg-slate-900 text-slate-300 hover:text-white border-slate-800'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${showOnlySaved ? 'fill-slate-950' : ''}`} />
            <span>Saved ({savedCount})</span>
          </button>

          {/* Quick Action Badges */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={onOpenAddShop}
              className="flex items-center gap-1 bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 px-2.5 py-1.5 rounded-xl text-xs font-bold transition active:scale-95"
            >
              <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">List Dukaan</span>
            </button>

            <button
              onClick={onOpenAlgorithm}
              className="flex items-center gap-1 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition"
              title="System Flow Algorithm (Steps 1-9)"
            >
              <Activity className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden lg:inline">Steps 1-9</span>
            </button>

            <button
              onClick={onOpenFlutterCode}
              className="flex items-center gap-1 bg-cyan-950/60 hover:bg-cyan-900 text-cyan-300 border border-cyan-800/60 px-2.5 py-1.5 rounded-xl text-xs font-bold transition"
              title="Flutter & Dart Source Code"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Flutter Code</span>
            </button>

            <button
              onClick={onOpenProjectDocs}
              className="flex items-center gap-1 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition"
              title="College Project Documentation"
            >
              <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden xl:inline">Project Docs</span>
            </button>

            {/* Desktop Mockup View Toggle */}
            <button
              onClick={onToggleDeviceFrame}
              className="hidden sm:flex items-center gap-1 p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition"
              title={isMobileDeviceFrame ? 'Switch to Full Width View' : 'Switch to Smartphone App Shell Mockup'}
            >
              {isMobileDeviceFrame ? <Monitor className="w-4 h-4 text-amber-400" /> : <Smartphone className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
