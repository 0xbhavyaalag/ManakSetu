import React, { useState, useEffect } from 'react';
import { 
  Clock, Users, RefreshCw, AlertTriangle, ArrowRight, ShieldCheck, 
  MapPin, CheckCircle, Calculator, Info, Volume2, Sparkles, Truck, CheckCircle2, Play 
} from 'lucide-react';
import { Booking, QueueStatus } from '../types';
import { api } from '../services/api';
import { useLanguage } from '../hooks/useLanguage';
import { speakIvrText, playDtmfTone } from '../services/audioService';

interface LiveQueuePageProps {
  booking: Booking | null;
  onOpenReschedule: () => void;
  onOpenPreVisit: () => void;
}

export const LiveQueuePage: React.FC<LiveQueuePageProps> = ({
  booking,
  onOpenReschedule,
  onOpenPreVisit
}) => {
  const { language, t } = useLanguage();
  const [queueData, setQueueData] = useState<QueueStatus | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [lastRefreshed, setLastRefreshed] = useState<string>('Just now');
  const [isAnnouncing, setIsAnnouncing] = useState<boolean>(false);
  const [advancingQueue, setAdvancingQueue] = useState<boolean>(false);
  const [advanceMsg, setAdvanceMsg] = useState<string | null>(null);

  const fetchQueue = async () => {
    if (!booking) return;
    try {
      const data = await api.getQueueStatus(booking.id);
      setQueueData(data);
      setLastRefreshed('Just now');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 15000); // Poll every 15s
    return () => clearInterval(interval);
  }, [booking?.id]);

  const handleSimulateQueueAdvance = async () => {
    if (!booking) return;
    setAdvancingQueue(true);
    playDtmfTone('6', 180);
    try {
      await api.callNextToken(booking.centre_id || 2);
      await fetchQueue();
      const msg = language === 'hi'
        ? `काउंटर टोकन आगे बढ़ गया! कतार में प्रतीक्षा समय कम हो गया है।`
        : `Token advanced! Live weighbridge queue moved forward.`;
      setAdvanceMsg(msg);
      speakIvrText(msg, language);
      setTimeout(() => setAdvanceMsg(null), 3500);
    } catch (e) {
      console.error(e);
    } finally {
      setAdvancingQueue(false);
    }
  };

  const handleAnnounceStatus = () => {
    if (!booking) return;
    setIsAnnouncing(true);
    const curr = queueData ? queueData.current_token : booking.current_token;
    const yours = queueData ? queueData.token_number : booking.token_number;
    const ahead = queueData ? queueData.people_ahead : booking.people_ahead;
    const mins = queueData ? queueData.estimated_wait_mins : booking.estimated_wait_mins;

    const speech = language === 'hi'
      ? `वर्तमान में टोकन ${curr} की सेवा जारी है। आपका टोकन ${yours} है। आपके आगे ${ahead} किसान हैं और अनुमानित प्रतीक्षा समय लगभग ${mins} मिनट है।`
      : `Currently serving token ${curr}. Your token is ${yours}. There are ${ahead} farmers ahead with an estimated wait of ${mins} minutes.`;

    speakIvrText(speech, language);
    setTimeout(() => setIsAnnouncing(false), 5000);
  };

  if (!booking) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 max-w-lg mx-auto">
        <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="font-bold text-slate-800 text-lg">No Active Queue Entry</h3>
        <p className="text-xs text-slate-500 mt-1">Please book a slot first to receive a live token.</p>
      </div>
    );
  }

  const peopleAhead = queueData ? queueData.people_ahead : booking.people_ahead;
  const currentToken = queueData ? queueData.current_token : booking.current_token;
  const yourToken = queueData ? queueData.token_number : booking.token_number;
  const waitMins = queueData ? queueData.estimated_wait_mins : booking.estimated_wait_mins;
  const activeCounters = queueData ? queueData.active_counters : 3;
  const avgProcessing = queueData ? queueData.average_processing_time : 6;

  // Calculate progress: assuming starting queue was ~25
  const progressPct = Math.min(100, Math.max(12, Math.round(((25 - peopleAhead) / 25) * 100)));

  return (
    <div className="max-w-3xl mx-auto pb-20 md:pb-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-display">
              Live Queue & Token Status
            </h1>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time counter sync • Last updated {lastRefreshed}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSimulateQueueAdvance}
            disabled={advancingQueue}
            className="btn-press px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-xs transition"
            title="Advance Queue by 1 token (Live Simulation Demo)"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>{advancingQueue ? 'Advancing...' : 'Advance +1'}</span>
          </button>

          <button
            onClick={handleAnnounceStatus}
            className={`btn-press px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition ${
              isAnnouncing ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
            }`}
            title="Listen to Live Queue Audio"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>सुनें / Speak</span>
          </button>

          <button
            onClick={() => { setLoading(true); fetchQueue(); }}
            className="btn-press p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1 transition"
            title="Refresh Queue"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            id="btn-live-reschedule"
            onClick={onOpenReschedule}
            className="btn-press px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{t('reschedule')}</span>
          </button>
        </div>
      </div>

      {/* Advance Toast Banner */}
      {advanceMsg && (
        <div className="p-3 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl shadow-lg flex items-center justify-between text-xs font-bold animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-200 animate-spin" />
            <span>{advanceMsg}</span>
          </div>
          <button onClick={() => setAdvanceMsg(null)} className="text-white/80 hover:text-white">&times;</button>
        </div>
      )}

      {/* Main Token Banner */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-emerald-900/50">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
          
          <div>
            <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-extrabold text-emerald-300 mb-2">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>YOUR LIVE APPOINTMENT TOKEN</span>
            </div>
            <div className="text-5xl sm:text-6xl font-black tracking-tight text-white mt-1 font-display">
              {yourToken}
            </div>
            <p className="text-xs text-slate-300 mt-2 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{booking.centre_name} • Slot: <strong>{booking.booking_time}</strong></span>
            </p>
            <div className="text-xs text-emerald-300/90 font-mono mt-1">
              Booking Ref: {booking.booking_code} ({booking.crop_name} {booking.quantity_quintals}q)
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 text-center space-y-3">
            <div className="flex justify-between items-center text-xs pb-2 border-b border-white/10">
              <span className="text-slate-300">Currently Serving Counter:</span>
              <span className="font-black text-white text-base font-mono">{currentToken}</span>
            </div>

            <div className="flex justify-between items-center text-xs pb-2 border-b border-white/10">
              <span className="text-slate-300">Farmers Ahead of You:</span>
              <span className="font-extrabold text-amber-400 text-base">{peopleAhead} Trucks</span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300">Estimated Waiting Window:</span>
              <span className="font-black text-emerald-300 text-xl font-display">~{waitMins} Minutes</span>
            </div>

            <div className="text-[10px] text-slate-400 italic">
              * Live dynamic sync with Counter #3 sensor feed
            </div>
          </div>

        </div>

        {/* Dynamic Queue Progression Visualizer */}
        <div className="mt-6 pt-5 border-t border-white/10">
          <div className="flex justify-between text-xs text-slate-300 mb-2">
            <span className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-emerald-400" />
              <span>Weighbridge Queue Pipeline</span>
            </span>
            <span className="font-bold text-emerald-400">{progressPct}% Throughput Complete</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-emerald-500 via-teal-400 to-green-400 h-2.5 transition-all duration-700 rounded-full shadow-sm"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 mt-2 font-mono">
            <span>Now Serving: {currentToken}</span>
            <span>Pipeline Ahead: {peopleAhead}</span>
            <span className="text-emerald-300 font-bold">Your Turn: {yourToken}</span>
          </div>
        </div>
      </div>

      {/* Transparent Waiting-Time Prediction Algorithm Card (Section 8) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
            <Calculator className="w-4 h-4 text-blue-700" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-900">
              Transparent Waiting-Time Prediction Algorithm
            </h3>
            <p className="text-xs text-slate-500">
              Formula: waiting_time = (people_ahead × average_processing_time) ÷ active_counters
            </p>
          </div>
        </div>

        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 font-mono text-xs text-slate-700 space-y-2">
          <div className="flex justify-between items-center">
            <span>People Ahead (N):</span>
            <strong className="text-slate-900">{peopleAhead} farmers</strong>
          </div>
          <div className="flex justify-between items-center">
            <span>Average Processing Time (T):</span>
            <strong className="text-slate-900">{avgProcessing} minutes per vehicle</strong>
          </div>
          <div className="flex justify-between items-center">
            <span>Active Weighing & Quality Counters (C):</span>
            <strong className="text-slate-900">{activeCounters} parallel counters</strong>
          </div>
          <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm font-bold text-emerald-800">
            <span>Calculated Output:</span>
            <span>({peopleAhead} × {avgProcessing}) ÷ {activeCounters} = {waitMins} Minutes</span>
          </div>
        </div>
      </div>

      {/* Pre-Visit Verification CTA */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-emerald-700 shrink-0" />
          <div>
            <h4 className="font-bold text-emerald-950 text-sm">
              Avoid Rejections at Centre Gate
            </h4>
            <p className="text-xs text-emerald-800">
              Check moisture standards (max 12%), land records, and authorized representative status.
            </p>
          </div>
        </div>
        <button
          onClick={onOpenPreVisit}
          className="btn-press bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs shrink-0 transition"
        >
          Open Pre-Visit Checklist
        </button>
      </div>

    </div>
  );
};
