import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Shop, UserLocation } from '../types';
import { calculateWalkingMinutes, formatDistance } from '../utils/geo';

interface RadarMapProps {
  userLocation: UserLocation;
  shops: Shop[];
  selectedShop: Shop | null;
  onSelectShop: (shop: Shop) => void;
  radiusMeters: number;
  activeRouteShop: Shop | null;
  onClearRoute: () => void;
}

const CATEGORY_COLORS: Record<string, { bg: string; border: string; text: string; icon: string }> = {
  'Chai & Snacks': { bg: '#f59e0b', border: '#b45309', text: '#ffffff', icon: '☕' },
  'Xerox & Stationery': { bg: '#6366f1', border: '#4338ca', text: '#ffffff', icon: '🖨️' },
  'Tailor & Alterations': { bg: '#10b981', border: '#047857', text: '#ffffff', icon: '✂️' },
  'Kirana & Grocery': { bg: '#06b6d4', border: '#0e7490', text: '#ffffff', icon: '🛒' },
  'Street Chaat & Food': { bg: '#f43f5e', border: '#be123c', text: '#ffffff', icon: '🍲' },
  'Cobbler & Leather': { bg: '#8b5cf6', border: '#6d28d9', text: '#ffffff', icon: '👞' },
  'Juice & Fruits': { bg: '#14b8a6', border: '#0f766e', text: '#ffffff', icon: '🥤' },
  'Flowers & Puja': { bg: '#ec4899', border: '#be185d', text: '#ffffff', icon: '🌸' },
  'Watch & Key Repair': { bg: '#f97316', border: '#c2410c', text: '#ffffff', icon: '🔑' },
  'Mobile & Electronics': { bg: '#3b82f6', border: '#1d4ed8', text: '#ffffff', icon: '📱' },
};

export const RadarMap: React.FC<RadarMapProps> = ({
  userLocation,
  shops,
  selectedShop,
  onSelectShop,
  radiusMeters,
  activeRouteShop,
  onClearRoute,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const circleRef = useRef<L.Circle | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const routePolylineRef = useRef<L.Polyline | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [userLocation.latitude, userLocation.longitude],
      zoom: 16.5,
      zoomControl: false,
    });

    // Dark-themed, elegant street map tiles (CartoDB Dark Matter / Positron)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap',
      maxZoom: 19,
    }).addTo(map);

    // Zoom control on top right
    L.control.zoom({ position: 'topright' }).addTo(map);

    markersLayerRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Center and 0.5km Geofence circle
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const userLatLng: L.LatLngExpression = [userLocation.latitude, userLocation.longitude];

    // User location marker
    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng(userLatLng);
    } else {
      const userIcon = L.divIcon({
        className: 'user-pulse-marker',
        html: `
          <div class="relative flex items-center justify-center w-8 h-8">
            <span class="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-amber-400"></span>
            <span class="relative inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-500 border-2 border-white shadow-lg text-white font-bold text-xs">
              📍
            </span>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      userMarkerRef.current = L.marker(userLatLng, { icon: userIcon, zIndexOffset: 1000 })
        .addTo(map)
        .bindPopup(`
          <div class="p-1 font-sans text-xs">
            <p class="font-bold text-slate-900">Your Current GPS Spot</p>
            <p class="text-slate-500">${userLocation.name}</p>
            <p class="text-[10px] text-amber-600 mt-1">● 0.5km Hyperlocal Radar Active</p>
          </div>
        `);
    }

    // Radius circle (Strict 0.5km = 500m)
    if (circleRef.current) {
      circleRef.current.setLatLng(userLatLng);
      circleRef.current.setRadius(radiusMeters);
    } else {
      circleRef.current = L.circle(userLatLng, {
        radius: radiusMeters,
        color: '#f59e0b',
        weight: 2,
        dashArray: '6, 6',
        fillColor: '#f59e0b',
        fillOpacity: 0.08,
      }).addTo(map);
    }

    map.panTo(userLatLng);
  }, [userLocation.latitude, userLocation.longitude, userLocation.name, radiusMeters]);

  // Update shop markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();

    shops.forEach((shop) => {
      const config = CATEGORY_COLORS[shop.category] || {
        bg: '#64748b',
        border: '#475569',
        text: '#fff',
        icon: '🏪',
      };

      const isSelected = selectedShop?.id === shop.id;
      const distText = shop.distanceMeters !== undefined ? formatDistance(shop.distanceMeters) : '';

      const markerHtml = `
        <div class="group cursor-pointer transition-transform duration-200 ${
          isSelected ? 'scale-125 z-50' : 'hover:scale-115'
        }">
          <div class="relative flex items-center justify-center">
            <div style="background-color: ${config.bg}; border-color: ${
        isSelected ? '#ffffff' : config.border
      }"
                 class="w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-md border-2 text-white">
              ${config.icon}
            </div>
            ${
              shop.isOpen
                ? `<span class="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>`
                : `<span class="absolute -top-1 -right-1 w-3 h-3 bg-slate-400 border-2 border-white rounded-full"></span>`
            }
          </div>
          <div class="mt-0.5 bg-slate-900/90 text-white text-[10px] font-semibold px-1.5 py-0.2 rounded shadow whitespace-nowrap text-center max-w-[85px] truncate border border-slate-700">
            ${shop.name.split(' ')[0]}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-shop-marker',
        html: markerHtml,
        iconSize: [40, 48],
        iconAnchor: [20, 24],
      });

      const marker = L.marker([shop.latitude, shop.longitude], { icon: customIcon });

      marker.on('click', () => {
        onSelectShop(shop);
      });

      // Quick popup on hover/click
      marker.bindPopup(`
        <div class="p-2 font-sans text-xs max-w-[210px]">
          <div class="flex items-center gap-1.5 mb-1">
            <span class="text-base">${config.icon}</span>
            <strong class="text-slate-900 text-xs font-bold leading-tight">${shop.name}</strong>
          </div>
          <p class="text-slate-600 text-[11px] mb-1.5 flex items-center justify-between">
            <span>${distText} away</span>
            <span class="font-semibold ${shop.isOpen ? 'text-emerald-600' : 'text-slate-500'}">
              ${shop.isOpen ? '● Open Now' : '○ Closed'}
            </span>
          </p>
          <div class="bg-amber-50 p-1.5 rounded text-[10px] text-amber-900 mb-2 border border-amber-200">
            ★ ${shop.rating.toFixed(1)} (${shop.reviewCount} reviews) • ${shop.priceRange}
          </div>
          <button id="view-shop-${shop.id}" class="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-1 px-2 rounded text-center text-[11px] transition">
            View Details & Call
          </button>
        </div>
      `);

      markersLayer.addLayer(marker);
    });
  }, [shops, selectedShop, onSelectShop]);

  // Handle active navigation polyline
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (routePolylineRef.current) {
      routePolylineRef.current.remove();
      routePolylineRef.current = null;
    }

    if (activeRouteShop) {
      const userCoords: [number, number] = [userLocation.latitude, userLocation.longitude];
      const shopCoords: [number, number] = [activeRouteShop.latitude, activeRouteShop.longitude];

      // Simulated street-following route with realistic slight curve
      const midLat = (userCoords[0] + shopCoords[0]) / 2 + 0.0003;
      const midLng = (userCoords[1] + shopCoords[1]) / 2 - 0.0002;

      const path: [number, number][] = [userCoords, [midLat, midLng], shopCoords];

      const polyline = L.polyline(path, {
        color: '#10b981',
        weight: 5,
        opacity: 0.9,
        dashArray: '8, 8',
      }).addTo(map);

      routePolylineRef.current = polyline;

      // Fit bounds to show route clearly
      const bounds = L.latLngBounds([userCoords, shopCoords]);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 18 });
    }
  }, [activeRouteShop, userLocation]);

  return (
    <div className="relative w-full h-full min-h-[280px] bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-inner">
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Radar Badge */}
      <div className="absolute top-3 left-3 z-[400] flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-amber-500/40 shadow-lg">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
        </span>
        <span className="text-xs font-semibold text-amber-300 tracking-wide uppercase">
          0.5km Radar Active
        </span>
        <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono">
          {shops.length} stalls
        </span>
      </div>

      {/* Recenter button */}
      <button
        onClick={() => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.setView([userLocation.latitude, userLocation.longitude], 16.5);
          }
        }}
        className="absolute bottom-4 right-4 z-[400] bg-slate-900/90 hover:bg-slate-800 text-amber-400 p-2.5 rounded-xl border border-slate-700 shadow-lg flex items-center gap-1.5 text-xs font-semibold transition active:scale-95"
        title="Recenter Map"
      >
        <span>🎯</span>
        <span className="hidden sm:inline">My Spot</span>
      </button>

      {/* Active Navigation Route Banner */}
      {activeRouteShop && (
        <div className="absolute bottom-4 left-4 right-16 z-[400] bg-emerald-950/95 border border-emerald-500/50 backdrop-blur-md text-emerald-100 p-2.5 rounded-xl shadow-xl flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="text-lg animate-bounce">🚶‍♂️</span>
            <div className="truncate">
              <p className="text-xs font-bold text-white truncate">Walking to {activeRouteShop.name}</p>
              <p className="text-[11px] text-emerald-300">
                {formatDistance(activeRouteShop.distanceMeters || 0)} • ~
                {calculateWalkingMinutes(activeRouteShop.distanceMeters || 0)} min walk
              </p>
            </div>
          </div>
          <button
            onClick={onClearRoute}
            className="text-xs bg-emerald-800 hover:bg-emerald-700 text-white px-2 py-1 rounded font-medium transition ml-2"
          >
            End
          </button>
        </div>
      )}
    </div>
  );
};
