import React, { useState, useEffect } from 'react';
import { Shop, UserLocation } from '../types';
import { calculateBearing, getCompassDirection, formatDistance, calculateWalkingMinutes } from '../utils/geo';
import { X, Navigation, Compass, CheckCircle2, Volume2, ExternalLink } from 'lucide-react';

interface TurnByTurnNavModalProps {
  shop: Shop | null;
  userLocation: UserLocation;
  onClose: () => void;
}

export const TurnByTurnNavModal: React.FC<TurnByTurnNavModalProps> = ({
  shop,
  userLocation,
  onClose,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [simulatedDistance, setSimulatedDistance] = useState(shop?.distanceMeters || 120);

  useEffect(() => {
    if (shop?.distanceMeters) {
      setSimulatedDistance(shop.distanceMeters);
    }
  }, [shop]);

  if (!shop) return null;

  const bearing = calculateBearing(
    userLocation.latitude,
    userLocation.longitude,
    shop.latitude,
    shop.longitude
  );
  const directionStr = getCompassDirection(bearing);
  const walkMinutes = calculateWalkingMinutes(simulatedDistance);

  // Generate realistic hyperlocal street walking instructions
  const steps = [
    {
      instruction: `Head ${directionStr} towards ${shop.landmark.split(',')[0] || 'the main street'}`,
      distance: Math.round(simulatedDistance * 0.4),
      icon: '⬆️',
    },
    {
      instruction: `Continue straight along the sidewalk past local vendors`,
      distance: Math.round(simulatedDistance * 0.4),
      icon: '🚶‍♂️',
    },
    {
      instruction: `Look for ${shop.stallType}: "${shop.name}" (${shop.landmark})`,
      distance: Math.round(simulatedDistance * 0.2),
      icon: '📍',
    },
  ];

  const handleSimulateWalk = () => {
    setSimulatedDistance((prev) => {
      const next = Math.max(0, prev - 45);
      if (next === 0) {
        setCurrentStepIndex(steps.length - 1);
      } else if (next < simulatedDistance * 0.5) {
        setCurrentStepIndex(1);
      }
      return next;
    });
  };

  const openGoogleMapsExternal = () => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.latitude},${userLocation.longitude}&destination=${shop.latitude},${shop.longitude}&travelmode=walking`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-emerald-500/40 rounded-3xl p-5 shadow-2xl flex flex-col space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Navigation className="w-5 h-5 fill-emerald-400" />
            </span>
            <div>
              <h3 className="font-bold text-white text-sm">Walking Navigation</h3>
              <p className="text-[11px] text-slate-400 truncate max-w-[200px]">
                To: {shop.name}
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

        {/* Distance Remaining & Compass HUD */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Remaining</span>
            <div className="text-3xl font-black text-emerald-400 tracking-tight">
              {formatDistance(simulatedDistance)}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              ~{walkMinutes} min leisurely walk
            </p>
          </div>

          <div className="flex flex-col items-center">
            <div
              style={{ transform: `rotate(${bearing}deg)` }}
              className="w-12 h-12 rounded-full border-2 border-emerald-500/50 bg-emerald-950/40 flex items-center justify-center text-emerald-300 shadow-lg transition-transform duration-500"
            >
              <Compass className="w-7 h-7 text-emerald-400" />
            </div>
            <span className="text-[10px] font-mono text-emerald-300 mt-1 font-bold">
              {directionStr} ({Math.round(bearing)}°)
            </span>
          </div>
        </div>

        {/* Step-by-step Route Cards */}
        <div className="space-y-2">
          {steps.map((st, i) => (
            <div
              key={i}
              className={`p-3 rounded-xl border flex items-center gap-3 transition ${
                i === currentStepIndex
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-white'
                  : i < currentStepIndex
                  ? 'bg-slate-800/40 border-slate-800 text-slate-500 line-through'
                  : 'bg-slate-800/30 border-slate-800 text-slate-400'
              }`}
            >
              <span className="text-lg">{st.icon}</span>
              <div className="flex-1 text-xs">
                <p className="font-semibold leading-tight">{st.instruction}</p>
                <span className="text-[10px] text-slate-400 font-mono">
                  {st.distance}m
                </span>
              </div>
              {i < currentStepIndex && (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              )}
            </div>
          ))}
        </div>

        {/* Arrival status */}
        {simulatedDistance <= 10 && (
          <div className="bg-emerald-500 text-slate-950 font-black p-3 rounded-2xl text-center text-xs animate-bounce">
            🎉 You have arrived at {shop.name}!
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={handleSimulateWalk}
            className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border border-slate-700"
          >
            <span>🚶 Test Step Forward</span>
          </button>

          <button
            onClick={openGoogleMapsExternal}
            className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 py-2.5 px-3 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open in Google Maps</span>
          </button>
        </div>
      </div>
    </div>
  );
};
