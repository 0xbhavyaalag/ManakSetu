import React from 'react';
import { 
  Wheat, Clock, MapPin, Calendar, Users, Bot, Bell, AlertTriangle, 
  ArrowRight, ShieldCheck, DollarSign, RefreshCw, CheckCircle2, ChevronRight 
} from 'lucide-react';
import { Booking, CentreRecommendation } from '../types';
import { useLanguage } from '../hooks/useLanguage';

interface FarmerDashboardProps {
  booking: Booking | null;
  recommendations: CentreRecommendation[];
  onNavigate: (tab: string) => void;
  onOpenReschedule: () => void;
  onOpenPreVisit: () => void;
}

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({
  booking,
  recommendations,
  onNavigate,
  onOpenReschedule,
  onOpenPreVisit
}) => {
  const { t } = useLanguage();

  const topRec = recommendations.find(r => r.is_recommended) || recommendations[0];
  const overcrowdedCentres = recommendations.filter(r => r.is_overcrowded);

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-green-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <Wheat className="w-64 h-64 text-white" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 bg-emerald-900/60 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-semibold text-emerald-200 mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              SIH 2026 Smart Procurement Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {t('goodMorning')}, Ramesh Kumar
            </h1>
            <p className="text-emerald-100 text-xs sm:text-sm mt-1.5 leading-relaxed">
              Family ID: <strong className="font-mono text-white">F101</strong> • Registered Crop: Wheat • DBT Aadhaar Linked
            </p>

            <div className="mt-5 flex flex-wrap gap-2.5">
              <button
                id="btn-pre-visit-check"
                onClick={onOpenPreVisit}
                className="btn-press bg-white text-emerald-900 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md hover:bg-emerald-50 flex items-center gap-1.5 transition"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>{t('preVisitCheck')}</span>
              </button>
              <button
                onClick={() => onNavigate('booking')}
                className="btn-press bg-emerald-900/80 hover:bg-emerald-900 text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-emerald-400/30 flex items-center gap-1.5 transition"
              >
                <span>{t('bookProcurement')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="hidden lg:flex items-center justify-center p-4 bg-white/95 backdrop-blur-sm rounded-2xl border border-emerald-100 shadow-xl shrink-0">
            <img 
              src="/logo.png" 
              alt="ANNADHARA - From Uncertain Queues to Intelligent Procurement" 
              className="h-28 w-auto object-contain drop-shadow-xs"
            />
          </div>
        </div>
      </div>

      {/* Overcrowding Alert Banner (if any centre exceeds threshold) */}
      {overcrowdedCentres.length > 0 && (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex items-start gap-3 shadow-xs">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-amber-900 text-sm">
                Centre Congestion Alert: {overcrowdedCentres[0].centre.name}
              </h4>
              <span className="bg-amber-200 text-amber-900 text-[10px] font-extrabold px-1.5 py-0.5 rounded">
                QUEUE: {overcrowdedCentres[0].centre.current_queue} (HIGH)
              </span>
            </div>
            <p className="text-xs text-amber-800 mt-1">
              This centre is experiencing high congestion (&gt; 80 farmers). We strongly recommend booking at <strong>{topRec?.centre.name || 'Centre B'}</strong> to save over 60 minutes.
            </p>
          </div>
          <button
            onClick={() => onNavigate('booking')}
            className="text-xs font-bold text-amber-900 bg-amber-200 hover:bg-amber-300 px-3 py-1.5 rounded-lg whitespace-nowrap transition"
          >
            Choose Better Slot
          </button>
        </div>
      )}

      {/* Hero Active Booking & Queue Card */}
      {booking && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full">
                  ACTIVE BOOKING
                </span>
                <span className="font-mono text-xs font-bold text-slate-500">
                  {booking.booking_code}
                </span>
              </div>
              <h2 className="text-lg font-extrabold text-slate-900 mt-1">
                {booking.crop_name} Procurement ({booking.quantity_quintals} Quintals)
              </h2>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                {booking.centre_name} • {booking.booking_date} at {booking.booking_time}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="btn-dash-reschedule"
                onClick={onOpenReschedule}
                className="btn-press flex items-center gap-1 text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 px-3.5 py-2 rounded-xl transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{t('reschedule')}</span>
              </button>
              <button
                onClick={() => onNavigate('queue')}
                className="btn-press flex items-center gap-1 text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white px-3.5 py-2 rounded-xl shadow-xs transition"
              >
                <span>Live Tracker</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-center">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {t('tokenNumber')}
              </span>
              <div className="text-2xl sm:text-3xl font-black text-emerald-700 mt-1">
                {booking.token_number}
              </div>
              <span className="text-[10px] text-slate-500 font-mono">Verified Token</span>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-center">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {t('currentToken')}
              </span>
              <div className="text-2xl sm:text-3xl font-black text-slate-800 mt-1">
                {booking.current_token}
              </div>
              <span className="text-[10px] text-slate-500">Currently at Counter</span>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-center">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {t('peopleAhead')}
              </span>
              <div className="text-2xl sm:text-3xl font-black text-amber-600 mt-1">
                {booking.people_ahead}
              </div>
              <span className="text-[10px] text-slate-500">Farmers Ahead</span>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-center">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {t('estimatedWait')}
              </span>
              <div className="text-2xl sm:text-3xl font-black text-slate-800 mt-1">
                ~{booking.estimated_wait_mins}m
              </div>
              <span className="text-[10px] text-slate-400">Algorithmic Estimate</span>
            </div>
          </div>

          {/* Representative verification tag */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-600 gap-2">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Visiting Representative: <strong>{booking.visiting_member_name}</strong> ({booking.visiting_member_relationship})
              </span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.2 rounded border border-emerald-300">
                AUTHORIZED
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-500">
              <span>Status: <strong className="uppercase text-emerald-700">{booking.status}</strong></span>
              <span>• Payment: <strong className="uppercase text-amber-700">{booking.payment_status}</strong></span>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions Grid (11 Actions from Section 4) */}
      <div>
        <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-3">
          {t('quickActions')}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {[
            { id: 'booking', label: t('findCentre'), icon: MapPin, color: 'text-emerald-700 bg-emerald-50' },
            { id: 'booking', label: t('smartSlot'), icon: Calendar, color: 'text-blue-700 bg-blue-50' },
            { id: 'queue', label: t('myToken'), icon: Clock, color: 'text-amber-700 bg-amber-50' },
            { id: 'queue', label: t('queueStatus'), icon: Clock, color: 'text-indigo-700 bg-indigo-50' },
            { id: 'procurement', label: t('procurementStatus'), icon: Wheat, color: 'text-emerald-700 bg-emerald-50' },
            { id: 'payment', label: t('paymentStatus'), icon: DollarSign, color: 'text-green-700 bg-green-50' },
            { id: 'family', label: t('family'), icon: Users, color: 'text-purple-700 bg-purple-50' },
            { id: 'assistant', label: t('aiAssistant'), icon: Bot, color: 'text-teal-700 bg-teal-50' },
          ].map((act, i) => {
            const Icon = act.icon;
            return (
              <button
                key={i}
                onClick={() => onNavigate(act.id)}
                className="btn-press bg-white hover:bg-slate-50 border border-slate-200 p-3.5 rounded-2xl flex flex-col items-center justify-center text-center shadow-xs transition"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 ${act.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-800 leading-tight">
                  {act.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recommended Centre Card Section (Section 5) */}
      {topRec && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                AI RECOMMENDED FOR YOU
              </span>
              <span className="text-xs font-semibold text-slate-500">
                Score: {topRec.score}/100
              </span>
            </div>
            <button
              onClick={() => onNavigate('booking')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-900"
            >
              View All Centres &rarr;
            </button>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-base font-extrabold text-slate-900">
                {topRec.centre.name}
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                {topRec.centre.location} • {topRec.centre.distance_km} km away
              </p>
              <p className="text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 p-2 rounded-xl mt-2 leading-relaxed">
                💡 <strong>Why this centre?</strong> {topRec.reason}
              </p>
            </div>

            <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-200 shrink-0">
              <div className="text-center px-2">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Queue</span>
                <div className="text-lg font-black text-slate-800">{topRec.centre.current_queue}</div>
              </div>
              <div className="w-px h-8 bg-slate-200"></div>
              <div className="text-center px-2">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Wait Time</span>
                <div className="text-lg font-black text-emerald-700">~{topRec.centre.estimated_wait_mins}m</div>
              </div>
              <div className="w-px h-8 bg-slate-200"></div>
              <div className="text-center px-2">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Counters</span>
                <div className="text-lg font-black text-slate-800">{topRec.centre.active_counters}</div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
