import React from 'react';
import { X, GraduationCap, Target, Cpu, CheckCircle2, Layers, Award, Sparkles } from 'lucide-react';

interface ProjectDocsModalProps {
  onClose: () => void;
}

export const ProjectDocsModal: React.FC<ProjectDocsModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl max-h-[92vh] bg-slate-900 border border-amber-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-white text-base sm:text-lg">LocalLens</h3>
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold text-[10px] px-2 py-0.5 rounded-full">
                  College Project
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Developer: <strong className="text-amber-400 font-bold">Nisha Mary J</strong>
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

        {/* Content Body */}
        <div className="overflow-y-auto flex-1 py-4 space-y-5 text-xs text-slate-300 pr-1">
          {/* Abstract */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Project Abstract</span>
            </div>
            <p className="leading-relaxed text-slate-200">
              <strong>LocalLens</strong> is an AI-powered hyper-local discovery system specifically engineered to bridge the digital divide for informal street vendors, pushcart stalls, and mom-and-pop shops within a strict <strong>0.5km (500 meter) radius</strong>. Unlike commercial map engines that prioritize large chain stores and paid ads, LocalLens champions the micro-merchant with real-time GPS, AI-driven contextual matching, and transparent street pricing.
            </p>
          </div>

          {/* Problem Statement */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
              <Target className="w-4 h-4" />
              <span>Problem Statement</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="bg-slate-800/70 p-3 rounded-2xl border border-slate-700">
                <p className="font-bold text-white text-xs mb-1">1. Digital Invisibility</p>
                <p className="text-slate-400 text-[11px] leading-tight">
                  Street vendors (chai tapris, cobblers, tailors) operate without websites or verified listings.
                </p>
              </div>
              <div className="bg-slate-800/70 p-3 rounded-2xl border border-slate-700">
                <p className="font-bold text-white text-xs mb-1">2. Chain Store Bias</p>
                <p className="text-slate-400 text-[11px] leading-tight">
                  Mainstream map engines prioritize big supermarkets and franchises over roadside dukaan stalls.
                </p>
              </div>
              <div className="bg-slate-800/70 p-3 rounded-2xl border border-slate-700">
                <p className="font-bold text-white text-xs mb-1">3. Lack of Hyperlocal Focus</p>
                <p className="text-slate-400 text-[11px] leading-tight">
                  Users searching for an urgent ₹10 photocopy or zipper repair cannot easily find 2-minute walking stalls.
                </p>
              </div>
            </div>
          </div>

          {/* Core Technologies */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
              <Cpu className="w-4 h-4" />
              <span>Core Architecture & Tech Stack</span>
            </div>
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Flutter & Dart</strong>
                  <p className="text-[11px] text-slate-400">Cross-platform client for iOS & Android mobile.</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Firebase Suite</strong>
                  <p className="text-[11px] text-slate-400">Auth, Cloud Firestore & Realtime sync.</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">GPS & Maps Engine</strong>
                  <p className="text-[11px] text-slate-400">Geolocator API & Google Maps / Leaflet geospatial geofence.</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Gemini 3.8 AI Engine</strong>
                  <p className="text-[11px] text-slate-400">Contextual recommendation, collaborative filtering & vendor pitches.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Why 0.5km strict radius */}
          <div className="bg-amber-500/10 border border-amber-500/30 p-3.5 rounded-2xl space-y-1.5">
            <h4 className="font-bold text-amber-300 text-xs flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>The 0.5km (500m) Hyper-Local Rationale</span>
            </h4>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              A 500-meter radius represents the optimal <strong>"5-minute walking catchment"</strong>. In dense Asian and Indian urban college corridors, 80% of daily transactions (tea, prints, seamstress, fruits, keys) occur within this micro-zone. Limiting the search radius eliminates noise, lowers latency, and promotes walking eco-mobility.
            </p>
          </div>

          {/* Future Enhancements */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-wider">
              <Award className="w-4 h-4" />
              <span>Future Scope & Roadmap</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                'WhatsApp Direct Ordering',
                'Peer-to-Peer Review & Rating',
                'Self-Serve Vendor Onboarding',
                'Flash Street Deals & Coupons',
                'Multilingual Vernacular UI',
                'Flexible Radius Expansion (500m/1km/2km)',
              ].map((enh, i) => (
                <span
                  key={i}
                  className="bg-slate-800 text-purple-200 border border-purple-500/30 px-2.5 py-1 rounded-xl text-[11px]"
                >
                  ✓ {enh}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="border-t border-slate-800 pt-3 flex items-center justify-between text-[11px] text-slate-500">
          <span>LocalLens • Developed by Nisha Mary J</span>
          <button
            onClick={onClose}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-1.5 rounded-xl transition"
          >
            Close Overview
          </button>
        </div>
      </div>
    </div>
  );
};
