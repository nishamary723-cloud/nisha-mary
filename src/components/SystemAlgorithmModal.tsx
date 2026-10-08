import React, { useState } from 'react';
import { X, Play, RotateCcw, CheckCircle2, ArrowRight, Activity, Terminal } from 'lucide-react';
import { UserLocation, Shop } from '../types';

interface SystemAlgorithmModalProps {
  onClose: () => void;
  userLocation: UserLocation;
  totalShopsInRadius: number;
  sampleShop: Shop | null;
}

interface StepItem {
  number: number;
  title: string;
  subtext: string;
  module: string;
  inputs: string;
  outputs: string;
  codeSnippet: string;
}

const ALGORITHM_STEPS: StepItem[] = [
  {
    number: 1,
    title: 'User Login / Register',
    subtext: 'Authenticate student or local user via Firebase Auth token.',
    module: 'Firebase Auth Module',
    inputs: 'Phone OTP / Email / Guest Credentials',
    outputs: 'Authenticated User UID & Session Token',
    codeSnippet: 'final user = await FirebaseAuth.instance.signInWithCredential(cred);',
  },
  {
    number: 2,
    title: 'Request Location Permissions',
    subtext: 'Check device GPS hardware availability & runtime location permission.',
    module: 'Geolocator Platform Channel',
    inputs: 'Android / iOS Runtime Permission Request',
    outputs: 'PermissionStatus.granted',
    codeSnippet: 'LocationPermission perm = await Geolocator.requestPermission();',
  },
  {
    number: 3,
    title: 'Fetch Current GPS Coordinates',
    subtext: 'Read high-accuracy latitude and longitude from device hardware.',
    module: 'Geolocator High-Accuracy Stream',
    inputs: 'GPS Satellite / Cell Tower triangulation',
    outputs: 'Position(lat, lng, accuracy: 5.2m)',
    codeSnippet: 'final pos = await Geolocator.getCurrentPosition(desiredAccuracy: LocationAccuracy.high);',
  },
  {
    number: 4,
    title: 'Set Search Radius to 0.5 KM',
    subtext: 'Define strict hyper-local geofence boundary (R = 500 meters).',
    module: 'Hyperlocal Geofence Engine',
    inputs: 'User Center (Lat, Lng), Radius = 500m',
    outputs: 'Bounding Box & Geohash Range Queries',
    codeSnippet: 'const double radiusLimitMeters = 500.0; // Strict 0.5km focus',
  },
  {
    number: 5,
    title: 'Fetch Nearby Shops from Database',
    subtext: 'Query Cloud Firestore collections within geospatial bounding box.',
    module: 'Cloud Firestore Geospatial Query',
    inputs: 'Bounding Box Coordinates (Lat ± 0.0045, Lng ± 0.0045)',
    outputs: 'Array of Street Stall Documents matching spatial index',
    codeSnippet: 'final snapshot = await _firestore.collection("shops").where("location", ...).get();',
  },
  {
    number: 6,
    title: 'Apply AI Personalization Filter',
    subtext: 'Gemini 3.8 Flash model ranks stalls based on intent & collaborative preference.',
    module: 'Gemini 3.8 AI Recommendation Engine',
    inputs: 'User Query, Operating Hours, Distance, Ratings',
    outputs: 'AI Match Score (0-100%), Best Vernacular Item, Why Recommended',
    codeSnippet: 'const result = await ai.models.generateContent({ model: "gemini-3.8-flash", contents });',
  },
  {
    number: 7,
    title: 'Render Shop List & Map View',
    subtext: 'Plot custom category markers on Leaflet / Google Map with 500m geofence circle.',
    module: 'Google Maps / Leaflet Canvas',
    inputs: 'GeoCoordinates, Shop Metadata, 500m Polyline Circle',
    outputs: 'Interactive Map Layer + Bottom Sliding Sheet List',
    codeSnippet: 'GoogleMap(circles: {Circle(radius: 500.0)}, markers: shopMarkers)',
  },
  {
    number: 8,
    title: 'Select Shop -> Display Full Details',
    subtext: 'User taps marker or card: open full street vendor profile, menu & hours.',
    module: 'Shop Detail Modal View',
    inputs: 'shopId selected by user click event',
    outputs: 'Menu, Photos, Vendor Story, Verified UPI Tag, Reviews',
    codeSnippet: 'Navigator.push(context, MaterialPageRoute(builder: (_) => ShopDetailScreen(shop)));',
  },
  {
    number: 9,
    title: 'Execute Action (Call / Navigate / Save)',
    subtext: 'Direct turn-by-turn walking navigation or tel: call to the street stall vendor.',
    module: 'Device Intent & Action Launcher',
    inputs: 'Action Type: Call Vendor, WhatsApp Ping, or Turn-by-Turn Walk',
    outputs: 'System Dial / Google Maps Walking Route Intent Executed',
    codeSnippet: 'await launchUrl(Uri.parse("google.navigation:q=$lat,$lng&mode=w"));',
  },
];

export const SystemAlgorithmModal: React.FC<SystemAlgorithmModalProps> = ({
  onClose,
  userLocation,
  totalShopsInRadius,
  sampleShop,
}) => {
  const [activeStep, setActiveStep] = useState(1);
  const [isRunningAuto, setIsRunningAuto] = useState(false);

  const currentStep = ALGORITHM_STEPS[activeStep - 1];

  const handleNextStep = () => {
    setActiveStep((prev) => (prev < 9 ? prev + 1 : 1));
  };

  const handleAutoRun = () => {
    setIsRunningAuto(true);
    let step = 1;
    setActiveStep(1);
    const interval = setInterval(() => {
      step++;
      if (step <= 9) {
        setActiveStep(step);
      } else {
        clearInterval(interval);
        setIsRunningAuto(false);
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl max-h-[92vh] bg-slate-900 border border-amber-500/40 rounded-3xl p-5 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base">System Flow Algorithm</h3>
                <span className="bg-amber-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded uppercase">
                  Steps 1 to 9
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Core Execution Pipeline of LocalLens • Nisha Mary J
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

        {/* Step Progress Pills */}
        <div className="pt-3 pb-2 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {ALGORITHM_STEPS.map((s) => (
            <button
              key={s.number}
              onClick={() => setActiveStep(s.number)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                activeStep === s.number
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                  : s.number < activeStep
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              <span>{s.number < activeStep ? '✓' : s.number}.</span>
              <span className="whitespace-nowrap">{s.title.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Active Step Showcase */}
        <div className="overflow-y-auto flex-1 py-3 space-y-3.5 text-xs">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-amber-400 uppercase tracking-widest font-bold">
                PHASE {currentStep.number} OF 9
              </span>
              <span className="bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border border-slate-700">
                {currentStep.module}
              </span>
            </div>

            <h4 className="text-lg font-black text-white leading-tight">
              STEP {currentStep.number}: {currentStep.title}
            </h4>

            <p className="text-slate-300 text-xs leading-relaxed">
              {currentStep.subtext}
            </p>

            {/* Live Data Context */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                  📥 Input Stream
                </span>
                <p className="text-slate-200 text-xs font-mono">
                  {currentStep.number === 3
                    ? `${userLocation.latitude.toFixed(4)}, ${userLocation.longitude.toFixed(4)}`
                    : currentStep.inputs}
                </p>
              </div>

              <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-emerald-400 uppercase font-bold block mb-1">
                  📤 Output State
                </span>
                <p className="text-emerald-300 text-xs font-mono">
                  {currentStep.number === 4
                    ? 'Radius = 500m (Strict Local Geofence)'
                    : currentStep.number === 5
                    ? `${totalShopsInRadius} shops fetched from Firestore`
                    : currentStep.outputs}
                </p>
              </div>
            </div>

            {/* Code Snippet Box */}
            <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800 font-mono text-[11px] text-amber-300 flex items-start gap-2">
              <Terminal className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
              <code className="overflow-x-auto text-slate-200">{currentStep.codeSnippet}</code>
            </div>
          </div>
        </div>

        {/* Footer Navigation Bar */}
        <div className="border-t border-slate-800 pt-3 flex items-center justify-between gap-2">
          <button
            onClick={() => setActiveStep(1)}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            title="Reset to Step 1"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={handleAutoRun}
            disabled={isRunningAuto}
            className="flex-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition border border-slate-700"
          >
            <Play className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>{isRunningAuto ? 'Simulating Pipeline...' : 'Auto-Run All 9 Steps'}</span>
          </button>

          <button
            onClick={handleNextStep}
            className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow-md shadow-amber-500/20 active:scale-95"
          >
            <span>Step {activeStep < 9 ? activeStep + 1 : 1}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
