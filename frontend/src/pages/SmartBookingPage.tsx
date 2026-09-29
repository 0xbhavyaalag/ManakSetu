import React, { useState, useEffect } from 'react';
import { 
  Wheat, CheckCircle, AlertTriangle, MapPin, Calendar, Clock, 
  UserCheck, Shield, Sparkles, ArrowRight, ArrowLeft,
  Volume2, Copy, Check, QrCode, FileText, Printer, Share2, 
  IndianRupee, ChevronRight, Info, CheckCircle2, ShieldCheck, Zap
} from 'lucide-react';
import { CentreRecommendation, Family, Booking } from '../types';
import { api } from '../services/api';
import { useLanguage } from '../hooks/useLanguage';
import { speakIvrText } from '../services/audioService';

interface SmartBookingPageProps {
  recommendations: CentreRecommendation[];
  family: Family | null;
  onBookingCreated: (booking: Booking) => void;
  onNavigate: (tab: string) => void;
}

export const SmartBookingPage: React.FC<SmartBookingPageProps> = ({
  recommendations,
  family,
  onBookingCreated,
  onNavigate
}) => {
  const { language, t } = useLanguage();

  const [step, setStep] = useState<number>(1);
  const [selectedCrop, setSelectedCrop] = useState<string>('Wheat');
  const [quantity, setQuantity] = useState<number>(50);
  const [liveRecs, setLiveRecs] = useState<CentreRecommendation[]>(recommendations);
  
  const [selectedCentreId, setSelectedCentreId] = useState<number>(() => {
    return recommendations?.[0]?.centre?.id || 2;
  });
  
  const [selectedSlotId, setSelectedSlotId] = useState<number>(() => {
    const r = recommendations?.[0];
    return r?.centre?.slots?.[0]?.id || 11;
  });

  const [visitingMemberId, setVisitingMemberId] = useState<number | null>(3); // Default Rahul Kumar (Son)
  const [loading, setLoading] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isSpeakingToken, setIsSpeakingToken] = useState(false);

  const crops = [
    { name: 'Wheat', msp: 2275, icon: '🌾', season: 'Rabi 2026', color: 'from-amber-500 to-yellow-600' },
    { name: 'Rice', msp: 2300, icon: '🍚', season: 'Kharif 2026', color: 'from-emerald-500 to-teal-600' },
    { name: 'Mustard', msp: 5650, icon: '🌼', season: 'Rabi 2026', color: 'from-yellow-500 to-amber-600' },
    { name: 'Maize', msp: 2090, icon: '🌽', season: 'Kharif 2026', color: 'from-orange-500 to-amber-600' },
  ];

  const currentCrop = crops.find(c => c.name === selectedCrop) || crops[0];
  const estEarnings = quantity * currentCrop.msp;

  // Sync recommendations
  useEffect(() => {
    if (recommendations && recommendations.length > 0) {
      setLiveRecs(recommendations);
    }
  }, [recommendations]);

  const selectedCentreRec = liveRecs.find(r => r.centre.id === selectedCentreId) || liveRecs[0];

  // Auto-sync selectedSlotId whenever centre changes or slots arrive
  useEffect(() => {
    const slots = selectedCentreRec?.centre?.slots;
    if (slots && slots.length > 0) {
      const activeSlots = slots.filter((s: any) => s.is_active);
      const exists = activeSlots.some((s: any) => s.id === selectedSlotId);
      if (!exists && activeSlots.length > 0) {
        setSelectedSlotId(activeSlots[0].id);
      }
    }
  }, [selectedCentreId, selectedCentreRec]);

  const handleCropSelect = async (cropName: string) => {
    setSelectedCrop(cropName);
    try {
      const recs = await api.getRecommendations(cropName);
      if (recs && recs.length > 0) {
        setLiveRecs(recs);
        const best = recs.find(r => r.is_recommended) || recs[0];
        if (best) {
          setSelectedCentreId(best.centre.id);
          if (best.centre.slots && best.centre.slots.length > 0) {
            setSelectedSlotId(best.centre.slots[0].id);
          }
        }
      }
    } catch (e) {
      console.warn('Could not refresh recommendations for crop', e);
    }
  };

  const handleSelectCentre = (centreId: number) => {
    setSelectedCentreId(centreId);
    const rec = liveRecs.find(r => r.centre.id === centreId);
    if (rec?.centre?.slots && rec.centre.slots.length > 0) {
      const active = rec.centre.slots.filter((s: any) => s.is_active);
      if (active.length > 0) {
        setSelectedSlotId(active[0].id);
      }
    }
  };

  const handleCopyBookingCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleListenToken = (bookingObj: Booking) => {
    setIsSpeakingToken(true);
    const textToSpeak = language === 'hi'
      ? `बुकिंग सफल! आपका टोकन नंबर है ${bookingObj.token_number}, खरीद केंद्र ${bookingObj.centre_name}, स्लॉट समय ${bookingObj.booking_time}। कृपया समय पर पहुंचें।`
      : `Booking confirmed! Your Token number is ${bookingObj.token_number} at ${bookingObj.centre_name}, slot time ${bookingObj.booking_time}. Please arrive 15 minutes early.`;
    
    speakIvrText(textToSpeak, language);
    setTimeout(() => setIsSpeakingToken(false), 5000);
  };

  const handleConfirm = async () => {
    // Validate representative
    if (visitingMemberId !== null && family?.members) {
      const m = family.members.find(mem => mem.id === visitingMemberId);
      if (m && !m.is_authorized) {
        setError(`${m.name} (${m.relationship_to_head}) is not currently marked as an Authorized Representative. Please select an authorized representative (e.g. Rahul Kumar) or Self.`);
        return;
      }
    }

    setLoading(true);
    setError(null);
    try {
      const res = await api.createBooking({
        centre_id: selectedCentreId,
        slot_id: selectedSlotId,
        crop_name: selectedCrop,
        quantity_quintals: quantity,
        visiting_member_id: visitingMemberId,
        notes: "Booked via Annadhara AI Smart Portal"
      });
      setConfirmedBooking(res);
      onBookingCreated(res);
      setStep(6); // Confirmation screen
    } catch (err: any) {
      setError(err.message || 'Failed to confirm booking.');
    } finally {
      setLoading(false);
    }
  };

  const stepsMetadata = [
    { num: 1, label: 'Crop', icon: '🌾' },
    { num: 2, label: 'Quantity', icon: '⚖️' },
    { num: 3, label: 'Smart Centre', icon: '🏢' },
    { num: 4, label: 'Slot', icon: '⏰' },
    { num: 5, label: 'Representative', icon: '👤' },
  ];

  return (
    <div className="max-w-3xl mx-auto pb-20 md:pb-8">
      
      {/* Title & SIH Badge */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 border border-emerald-300 text-emerald-800 text-[11px] font-extrabold mb-1.5 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-spin" style={{ animationDuration: '6s' }} />
            <span>AI-Driven Zero Waiting Time Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-display">
            Smart Slot Booking & AI Centre Routing
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Guaranteed procurement window with instant digital token generation
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-2 bg-white px-3 py-2 rounded-2xl border border-slate-200/80 shadow-xs text-right">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
            DBT
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">Direct Bank Payout</div>
            <div className="text-xs font-black text-slate-800">Aadhaar Enabled</div>
          </div>
        </div>
      </div>

      {/* Modern Interactive Stepper Header */}
      {step < 6 && (
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 mb-6 shadow-xs">
          <div className="flex items-center justify-between relative mb-2">
            {/* Progress Track */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-100 -translate-y-1/2 z-0" />
            <div 
              className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-emerald-600 to-teal-500 -translate-y-1/2 z-0 transition-all duration-300"
              style={{ width: `${((step - 1) / 4) * 100}%` }}
            />

            {stepsMetadata.map((s) => {
              const isActive = step === s.num;
              const isDone = step > s.num;

              return (
                <button
                  key={s.num}
                  type="button"
                  onClick={() => {
                    if (isDone) setStep(s.num);
                  }}
                  disabled={!isDone}
                  className={`relative z-10 flex flex-col items-center group ${
                    isDone ? 'cursor-pointer' : 'cursor-default'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                    isDone
                      ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-200'
                      : isActive
                      ? 'bg-emerald-800 text-white shadow-md ring-4 ring-emerald-100 scale-110'
                      : 'bg-white text-slate-400 border-2 border-slate-200'
                  }`}>
                    {isDone ? <Check className="w-4 h-4" /> : s.icon}
                  </div>
                  <span className={`text-[11px] font-bold mt-1.5 transition-colors hidden sm:inline ${
                    isActive ? 'text-emerald-900 font-extrabold' : isDone ? 'text-emerald-700' : 'text-slate-400'
                  }`}>
                    {s.num}. {s.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 1: SELECT CROP */}
      {step === 1 && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-black text-slate-900 font-display">
                Step 1: Select Your Harvest Crop
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Government Minimum Support Price (MSP) guaranteed for certified quality produce
              </p>
            </div>
            <span className="text-[11px] font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 self-start sm:self-auto">
              Govt. MSP 2026 Active
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            {crops.map((c) => {
              const isSel = selectedCrop === c.name;
              return (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => handleCropSelect(c.name)}
                  className={`btn-press p-5 rounded-2xl border text-center transition-all cursor-pointer relative overflow-hidden ${
                    isSel 
                      ? 'border-emerald-600 bg-gradient-to-b from-emerald-50/80 to-white text-emerald-950 shadow-md ring-2 ring-emerald-500/20' 
                      : 'border-slate-200 bg-slate-50/80 hover:bg-white text-slate-800 hover:border-slate-300'
                  }`}
                >
                  {isSel && (
                    <div className="absolute top-2.5 right-2.5 text-emerald-600">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  )}
                  <div className="text-4xl mb-2 filter drop-shadow-xs">{c.icon}</div>
                  <div className="font-black text-base tracking-tight">{c.name}</div>
                  <div className="text-[10px] font-semibold text-slate-400 mt-0.5">{c.season}</div>
                  
                  <div className={`mt-2.5 pt-2 border-t text-xs font-black rounded-lg py-1 ${
                    isSel ? 'border-emerald-200 text-emerald-800 bg-emerald-100/60' : 'border-slate-200/80 text-slate-700 bg-white'
                  }`}>
                    ₹{c.msp.toLocaleString('en-IN')}<span className="text-[10px] font-normal text-slate-500">/quintal</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="p-3.5 bg-amber-50/60 border border-amber-200 rounded-2xl flex items-center justify-between text-xs text-amber-900">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Selecting <strong>{selectedCrop}</strong> automatically routes you to centres with specialized testing counters.</span>
            </div>
            <div className="font-extrabold font-mono text-emerald-800 hidden sm:block">MSP: ₹{currentCrop.msp}/q</div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <button
              onClick={() => setStep(2)}
              className="btn-press px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center gap-1.5 shadow-sm transition"
            >
              <span>Next: Quantity</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: QUANTITY & EARNINGS CALCULATOR */}
      {step === 2 && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-black text-slate-900 font-display">
              Step 2: Enter Harvest Quantity (Quintals)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter total load to be weighed and inspected for {selectedCrop}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Quantity to Deliver (in Quintals)
                </label>
                <span className="text-xs font-mono font-bold text-emerald-700">
                  {quantity} Quintals = {(quantity * 100).toLocaleString('en-IN')} kg
                </span>
              </div>

              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseFloat(e.target.value) || 1))}
                  className="w-full text-xl font-black p-3.5 bg-slate-50 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-emerald-500 text-slate-900"
                />
                <span className="absolute right-4 top-4 text-xs font-black uppercase text-slate-400">
                  Quintals
                </span>
              </div>

              {/* Slider for smooth touch interaction */}
              <div className="mt-3">
                <input 
                  type="range"
                  min="5"
                  max="200"
                  step="5"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-bold mt-1">
                  <span>5 q</span>
                  <span>50 q (Avg Trolley)</span>
                  <span>100 q (Double Trailer)</span>
                  <span>200 q</span>
                </div>
              </div>

              {/* Quick Preset Increment Chips */}
              <div className="flex flex-wrap gap-2 mt-3.5">
                <span className="text-[11px] font-bold text-slate-400 py-1">Quick Select:</span>
                {[10, 25, 50, 75, 100].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setQuantity(preset)}
                    className={`btn-press px-3 py-1 rounded-xl text-xs font-bold transition border ${
                      quantity === preset
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                    }`}
                  >
                    {preset} q
                  </button>
                ))}
              </div>
            </div>

            {/* Calculated Government MSP Value Card */}
            <div className="p-5 bg-gradient-to-br from-emerald-50 via-teal-50/40 to-slate-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
              <div>
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                  <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
                  Calculated Government MSP Payout:
                </span>
                <div className="text-3xl font-black text-emerald-950 mt-1 font-display">
                  ₹{estEarnings.toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-emerald-700 mt-1 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Direct DBT settlement to linked Bank A/C within 48-72 hours of weighment.</span>
                </div>
              </div>
              <div className="bg-white/90 p-3 rounded-xl border border-emerald-200 text-right sm:text-right shrink-0">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Pricing Formula</span>
                <div className="text-xs font-black font-mono text-emerald-900 mt-0.5">
                  {quantity}q × ₹{currentCrop.msp}
                </div>
                <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Zero Commission</div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-between">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="btn-press px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center gap-1.5 shadow-sm transition"
            >
              <span>Next: Recommend Centre</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: SMART CENTRE RECOMMENDATION */}
      {step === 3 && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-black text-slate-900 font-display">
                Step 3: Select Recommended Procurement Centre
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Ranked automatically using distance, live queue length, active weighbridges, and counter speed
              </p>
            </div>
            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">
              Updated Live
            </span>
          </div>

          <div className="space-y-3.5">
            {liveRecs.map((rec) => {
              const c = rec.centre;
              const isSelected = selectedCentreId === c.id;

              return (
                <div
                  key={c.id}
                  onClick={() => handleSelectCentre(c.id)}
                  className={`p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-emerald-600 bg-gradient-to-r from-emerald-50/70 to-teal-50/30 shadow-md ring-2 ring-emerald-500/20'
                      : rec.is_overcrowded
                      ? 'border-amber-200 bg-amber-50/40 hover:bg-amber-50/70'
                      : 'border-slate-200 bg-slate-50/70 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-black text-base text-slate-900">
                          {c.name}
                        </span>
                        {rec.is_recommended && (
                          <span className="bg-emerald-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs animate-pulse">
                            <Sparkles className="w-3 h-3" />
                            AI RECOMMENDED
                          </span>
                        )}
                        {rec.is_overcrowded && (
                          <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                            HIGH TRAFFIC (&gt;80)
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{c.location} • <strong>{c.distance_km} km away</strong></span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2.5 text-center text-xs shrink-0">
                      <div className="bg-white px-3 py-1.5 rounded-xl border border-slate-200/80 shadow-xs">
                        <div className="text-[10px] text-slate-400 font-bold uppercase">Live Queue</div>
                        <div className={`font-black text-sm ${rec.is_overcrowded ? 'text-rose-600' : 'text-slate-800'}`}>
                          {c.current_queue}
                        </div>
                      </div>
                      <div className="bg-white px-3 py-1.5 rounded-xl border border-slate-200/80 shadow-xs">
                        <div className="text-[10px] text-slate-400 font-bold uppercase">Wait</div>
                        <div className="font-black text-sm text-emerald-700">
                          ~{c.estimated_wait_mins}m
                        </div>
                      </div>
                      <div className="bg-white px-3 py-1.5 rounded-xl border border-slate-200/80 shadow-xs">
                        <div className="text-[10px] text-slate-400 font-bold uppercase">Counters</div>
                        <div className="font-black text-sm text-slate-800">
                          {c.active_counters} Active
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* AI Explanation Callout */}
                  <div className={`mt-3 p-2.5 rounded-xl text-xs flex items-center gap-2 ${
                    rec.is_recommended
                      ? 'bg-emerald-100/70 text-emerald-950 font-bold'
                      : rec.is_overcrowded
                      ? 'bg-amber-100 text-amber-950'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    <Sparkles className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>{rec.reason}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-between">
            <button
              onClick={() => setStep(2)}
              className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50"
            >
              Back
            </button>
            <button
              onClick={() => setStep(4)}
              className="btn-press px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center gap-1.5 shadow-sm transition"
            >
              <span>Next: Available Slots</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: AVAILABLE SLOTS */}
      {step === 4 && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-black text-slate-900 font-display">
                Step 4: Select Available Slot at {selectedCentreRec?.centre.name}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Controlled hourly quotas prevent gate traffic bottlenecks and long vehicle queues
              </p>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Valid Date: 24 September (Today)
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {((selectedCentreRec?.centre?.slots && selectedCentreRec.centre.slots.length > 0)
              ? selectedCentreRec.centre.slots
              : [
                  { id: (selectedCentreId === 2 ? 11 : (selectedCentreId === 3 ? 21 : 1)), time_slot: '10:00 AM', booked_tokens: 8, capacity_tokens: 20 },
                  { id: (selectedCentreId === 2 ? 12 : (selectedCentreId === 3 ? 22 : 2)), time_slot: '11:00 AM', booked_tokens: 12, capacity_tokens: 20 },
                  { id: (selectedCentreId === 2 ? 13 : (selectedCentreId === 3 ? 23 : 3)), time_slot: '12:00 PM', booked_tokens: 5, capacity_tokens: 20 },
                  { id: (selectedCentreId === 2 ? 14 : (selectedCentreId === 3 ? 24 : 4)), time_slot: '02:00 PM', booked_tokens: 14, capacity_tokens: 20 },
                  { id: (selectedCentreId === 2 ? 15 : (selectedCentreId === 3 ? 25 : 5)), time_slot: '03:00 PM', booked_tokens: 6, capacity_tokens: 20 },
                ]
            ).map((slot: any) => {
              const isSel = selectedSlotId === slot.id;
              const spotsLeft = Math.max(1, (slot.capacity_tokens || 20) - (slot.booked_tokens || 0));
              return (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => setSelectedSlotId(slot.id)}
                  className={`btn-press p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                    isSel 
                      ? 'border-emerald-600 bg-emerald-700 text-white shadow-md ring-2 ring-emerald-500/20' 
                      : 'border-slate-200 bg-slate-50/80 hover:bg-white text-slate-800 hover:border-slate-300'
                  }`}
                >
                  <Clock className={`w-5 h-5 mx-auto mb-1.5 ${isSel ? 'text-white' : 'text-emerald-700'}`} />
                  <div className="font-black text-sm">{slot.time_slot}</div>
                  <div className={`text-[10px] mt-1 font-semibold ${isSel ? 'text-emerald-100' : 'text-slate-500'}`}>
                    {spotsLeft} tokens remaining
                  </div>
                </button>
              );
            })}
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 flex items-center gap-2">
            <Info className="w-4 h-4 text-slate-400 shrink-0" />
            <span>Arriving within your designated 60-minute window guarantees express gate pass entry.</span>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-between">
            <button
              onClick={() => setStep(3)}
              className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50"
            >
              Back
            </button>
            <button
              onClick={() => setStep(5)}
              className="btn-press px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center gap-1.5 shadow-sm transition"
            >
              <span>Next: Representative</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: WHO WILL VISIT THE CENTRE? */}
      {step === 5 && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-black text-slate-900 font-display">
                Step 5: Designate Procurement Representative
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                The harvest belongs to registered farmer Ramesh Kumar. You may visit in person or send an authorized family member.
              </p>
            </div>
            <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
              Family Account F101
            </span>
          </div>

          <div className="space-y-3">
            {/* Self Option */}
            <div
              onClick={() => { setVisitingMemberId(null); setError(null); }}
              className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                visitingMemberId === null
                  ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 font-bold shadow-xs ring-2 ring-emerald-500/20'
                  : 'border-slate-200 bg-slate-50/70 hover:bg-white text-slate-800 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center font-black text-sm">
                  RK
                </div>
                <div>
                  <div className="text-sm font-black text-slate-900">Self: Ramesh Kumar (Head of Household)</div>
                  <div className="text-[11px] text-slate-500 font-normal">Primary Registered Farmer • Aadhaar DBT Linked</div>
                </div>
              </div>
              <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-300">
                Default
              </span>
            </div>

            {/* Family Members from Family F101 */}
            {family?.members.map((member) => {
              const isSel = visitingMemberId === member.id;
              return (
                <div
                  key={member.id}
                  onClick={() => { setVisitingMemberId(member.id); setError(null); }}
                  className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                    isSel
                      ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 font-bold shadow-xs ring-2 ring-emerald-500/20'
                      : 'border-slate-200 bg-slate-50/70 hover:bg-white text-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-sm">
                      {member.name[0]}
                    </div>
                    <div>
                      <div className="text-sm font-black text-slate-900">
                        {member.name} ({member.relationship_to_head})
                      </div>
                      <div className="text-[11px] text-slate-500 font-normal">
                        Sub-user: {member.sub_user_code} • Device: {member.device_type}
                      </div>
                    </div>
                  </div>

                  <div>
                    {member.is_authorized ? (
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-1 rounded-full border border-emerald-300">
                        AUTHORIZED REP
                      </span>
                    ) : (
                      <span className="bg-rose-100 text-rose-800 text-[10px] font-black px-2.5 py-1 rounded-full border border-rose-300">
                        NOT AUTHORIZED
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dynamic Warning Notice if unauthorized selected */}
          {visitingMemberId !== null && (() => {
            const m = family?.members?.find((mem) => mem.id === visitingMemberId);
            if (m && !m.is_authorized) {
              return (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <p>
                    <strong>Notice:</strong> {m.name} ({m.relationship_to_head}) is currently marked as <em>Not Authorized</em>. To generate token, please select <strong>Self</strong> or an authorized representative (such as Rahul Kumar), or toggle authorization in the Family tab.
                  </p>
                </div>
              );
            }
            return null;
          })()}

          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 font-medium">
              {error}
            </div>
          )}

          <div className="pt-3 border-t border-slate-100 flex justify-between">
            <button
              onClick={() => setStep(4)}
              className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50"
            >
              Back
            </button>
            <button
              id="btn-submit-booking"
              onClick={handleConfirm}
              disabled={loading}
              className="btn-press px-7 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-sm rounded-xl flex items-center gap-2 shadow-md transition"
            >
              <span>{loading ? 'Issuing Token...' : 'Confirm & Generate Token'}</span>
              <CheckCircle className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 6: AUTHENTIC DIGITAL PROCUREMENT TICKET (Section 6) */}
      {step === 6 && confirmedBooking && (
        <div className="space-y-6">
          
          {/* Header Banner */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-md text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner animate-bounce" style={{ animationIterationCount: 2 }}>
              <CheckCircle className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-300">
                PROCURING TOKEN ISSUED
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 font-display">
                Token Successfully Generated!
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                SMS alert dispatched to registered mobile: <strong className="text-slate-800">+91 9876543210</strong>
              </p>
            </div>
          </div>

          {/* Authentic Government Mandi Digital Pass (Ticket Card) */}
          <div className="ticket-card p-6 sm:p-7 space-y-5 border border-emerald-300">
            {/* Top Pass Brand */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <img src="/logo-icon.png" alt="ANNADHARA" className="w-8 h-8 object-contain" />
                <div>
                  <div className="text-xs font-black text-slate-900 tracking-tight">ANNADHARA MANDI PASS</div>
                  <div className="text-[10px] text-emerald-700 font-bold">GOVERNMENT OF INDIA • E-PROCUREMENT</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleListenToken(confirmedBooking)}
                  className={`btn-press p-2 rounded-xl border text-xs font-bold flex items-center gap-1 transition ${
                    isSpeakingToken ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                  }`}
                  title="Listen in Audio"
                >
                  <Volume2 className="w-4 h-4" />
                  <span className="hidden sm:inline">सुनें / Listen</span>
                </button>
              </div>
            </div>

            {/* Token Big Display */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-gradient-to-r from-emerald-50 to-teal-50/50 rounded-2xl border border-emerald-200">
              <div>
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Your Live Token</span>
                <div className="text-4xl sm:text-5xl font-black text-emerald-800 tracking-tight font-display mt-0.5">
                  {confirmedBooking.token_number}
                </div>
                <div className="text-xs text-emerald-700 font-semibold mt-1">
                  Estimated Entry Window: ~{confirmedBooking.booking_time}
                </div>
              </div>

              <div className="text-left sm:text-right shrink-0">
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Booking Reference</span>
                <div className="flex items-center gap-2 sm:justify-end mt-0.5">
                  <span className="text-base font-black font-mono text-slate-900">{confirmedBooking.booking_code}</span>
                  <button
                    onClick={() => handleCopyBookingCode(confirmedBooking.booking_code)}
                    className="p-1 rounded-md text-slate-400 hover:text-slate-700 bg-white border border-slate-200"
                    title="Copy Booking ID"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <span className="text-[10px] text-emerald-700 font-bold bg-white px-2 py-0.5 rounded border border-emerald-200 mt-1 inline-block">
                  Verified Aadhaar Link
                </span>
              </div>
            </div>

            {/* Perforation Divider */}
            <div className="ticket-perforation my-4" />

            {/* Token Detail Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Centre</span>
                <span className="font-extrabold text-slate-900 mt-0.5 block truncate">{confirmedBooking.centre_name}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Slot Date</span>
                <span className="font-extrabold text-slate-900 mt-0.5 block">{confirmedBooking.booking_date}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Crop & Weight</span>
                <span className="font-extrabold text-slate-900 mt-0.5 block">{confirmedBooking.crop_name} ({confirmedBooking.quantity_quintals}q)</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Visiting Rep</span>
                <span className="font-extrabold text-emerald-800 mt-0.5 block truncate">{confirmedBooking.visiting_member_name}</span>
              </div>
            </div>

            {/* Guaranteed MSP Payout Banner */}
            <div className="p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <IndianRupee className="w-4 h-4 text-emerald-700 shrink-0" />
                <span className="text-emerald-950 font-bold">Government MSP Value Guaranteed:</span>
              </div>
              <div className="text-sm font-black text-emerald-900 font-mono">
                ₹{confirmedBooking.total_amount_inr?.toLocaleString('en-IN') || (confirmedBooking.quantity_quintals * 2275).toLocaleString('en-IN')}
              </div>
            </div>

            {/* Simulated Barcode */}
            <div className="pt-2 text-center">
              <div className="inline-block px-4 py-1.5 bg-slate-900 text-white font-mono text-[10px] tracking-widest rounded-md">
                |||||| | ||||| ||| ||||||| | |||| {confirmedBooking.booking_code}
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Scan this barcode or present Token {confirmedBooking.token_number} at the procurement gate weighbridge
              </p>
            </div>
          </div>

          {/* Navigation Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('queue')}
              className="btn-press w-full sm:w-auto px-7 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2"
            >
              <span>Track Live Queue Position</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className="btn-press w-full sm:w-auto px-6 py-3 border border-slate-200 bg-white text-slate-700 font-bold text-sm rounded-xl hover:bg-slate-50 transition"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
