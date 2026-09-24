import React, { useState } from 'react';
import { 
  Wheat, CheckCircle, AlertTriangle, MapPin, Calendar, Clock, 
  UserCheck, Shield, Sparkles, ArrowRight, ArrowLeft 
} from 'lucide-react';
import { CentreRecommendation, Family, Booking } from '../types';
import { api } from '../services/api';
import { useLanguage } from '../hooks/useLanguage';

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
  const { t } = useLanguage();

  const [step, setStep] = useState<number>(1);
  const [selectedCrop, setSelectedCrop] = useState<string>('Wheat');
  const [quantity, setQuantity] = useState<number>(50);
  const [selectedCentreId, setSelectedCentreId] = useState<number>(2); // Default Centre B
  const [selectedSlotId, setSelectedSlotId] = useState<number>(2); // 11:00 AM
  const [visitingMemberId, setVisitingMemberId] = useState<number | null>(3); // Rahul Kumar (Son)
  const [loading, setLoading] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [error, setError] = useState<string | null>(null);

  const crops = [
    { name: 'Wheat', msp: 2275, icon: '🌾' },
    { name: 'Rice', msp: 2300, icon: '🍚' },
    { name: 'Mustard', msp: 5650, icon: '🌼' },
    { name: 'Maize', msp: 2090, icon: '🌽' },
  ];

  const currentCrop = crops.find(c => c.name === selectedCrop) || crops[0];
  const estEarnings = quantity * currentCrop.msp;

  const selectedCentreRec = recommendations.find(r => r.centre.id === selectedCentreId) || recommendations[0];

  const handleConfirm = async () => {
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

  return (
    <div className="max-w-3xl mx-auto pb-20 md:pb-8">
      
      {/* Title */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Smart Slot Booking & AI Centre Recommendation
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Guaranteed procurement slot with minimal waiting time
        </p>
      </div>

      {/* Progress Steps Header */}
      {step < 6 && (
        <div className="bg-white rounded-2xl p-4 border border-slate-200 mb-6 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600">
            <span className={step >= 1 ? 'text-emerald-700' : ''}>1. Crop</span>
            <span>&rarr;</span>
            <span className={step >= 2 ? 'text-emerald-700' : ''}>2. Quantity</span>
            <span>&rarr;</span>
            <span className={step >= 3 ? 'text-emerald-700' : ''}>3. Smart Centre</span>
            <span>&rarr;</span>
            <span className={step >= 4 ? 'text-emerald-700' : ''}>4. Slot</span>
            <span>&rarr;</span>
            <span className={step >= 5 ? 'text-emerald-700' : ''}>5. Representative</span>
          </div>
        </div>
      )}

      {/* STEP 1: SELECT CROP */}
      {step === 1 && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
          <h2 className="text-base font-extrabold text-slate-900">
            Step 1: Select Your Crop for Procurement
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {crops.map((c) => {
              const isSel = selectedCrop === c.name;
              return (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setSelectedCrop(c.name)}
                  className={`btn-press p-4 rounded-2xl border text-center transition ${
                    isSel 
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 shadow-sm' 
                      : 'border-slate-200 bg-slate-50 hover:bg-white text-slate-800'
                  }`}
                >
                  <div className="text-3xl mb-1">{c.icon}</div>
                  <div className="font-extrabold text-sm">{c.name}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5 font-medium">
                    MSP: ₹{c.msp}/q
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <button
              onClick={() => setStep(2)}
              className="btn-press px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center gap-1.5 transition"
            >
              <span>Next: Quantity</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: QUANTITY */}
      {step === 2 && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
          <h2 className="text-base font-extrabold text-slate-900">
            Step 2: Enter Harvest Quantity (Quintals)
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Quantity to Deliver (in Quintals)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseFloat(e.target.value) || 1))}
                  className="w-full text-lg font-bold p-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
                <span className="absolute right-4 top-3.5 text-xs font-bold text-slate-400">
                  Quintals
                </span>
              </div>
            </div>

            {/* Estimated Value Card */}
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-800">
                  Calculated Government MSP Value:
                </span>
                <div className="text-2xl font-black text-emerald-900 mt-0.5">
                  ₹{estEarnings.toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-emerald-700 mt-0.5">
                  Direct transfer to bank via Aadhaar DBT upon centre acceptance
                </div>
              </div>
              <div className="text-right text-xs font-mono text-emerald-800">
                {quantity}q × ₹{currentCrop.msp}/q
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
              className="btn-press px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center gap-1.5 transition"
            >
              <span>Next: Recommend Centre</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: SMART CENTRE RECOMMENDATION */}
      {step === 3 && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">
              Step 3: Select Recommended Procurement Centre
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Ranked automatically using distance, queue size, capacity, and active counter speed
            </p>
          </div>

          <div className="space-y-3">
            {recommendations.map((rec) => {
              const c = rec.centre;
              const isSelected = selectedCentreId === c.id;

              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCentreId(c.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/60 shadow-sm ring-2 ring-emerald-500/20'
                      : rec.is_overcrowded
                      ? 'border-amber-200 bg-amber-50/40 hover:bg-amber-50/80'
                      : 'border-slate-200 bg-slate-50 hover:bg-white'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-slate-900">
                          {c.name}
                        </span>
                        {rec.is_recommended && (
                          <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            RECOMMENDED
                          </span>
                        )}
                        {rec.is_overcrowded && (
                          <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                            OVERCROWDED (&gt;80)
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {c.location} • <strong>{c.distance_km} km away</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-3 text-center text-xs">
                      <div className="bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                        <div className="text-[10px] text-slate-400 font-bold uppercase">Queue</div>
                        <div className={`font-black text-sm ${rec.is_overcrowded ? 'text-rose-600' : 'text-slate-800'}`}>
                          {c.current_queue}
                        </div>
                      </div>
                      <div className="bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                        <div className="text-[10px] text-slate-400 font-bold uppercase">Wait</div>
                        <div className="font-black text-sm text-emerald-700">
                          ~{c.estimated_wait_mins}m
                        </div>
                      </div>
                      <div className="bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                        <div className="text-[10px] text-slate-400 font-bold uppercase">Counters</div>
                        <div className="font-black text-sm text-slate-800">
                          {c.active_counters}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* AI Explanation Callout */}
                  <div className={`mt-2.5 p-2 rounded-xl text-xs ${
                    rec.is_recommended
                      ? 'bg-emerald-100/70 text-emerald-900 font-semibold'
                      : rec.is_overcrowded
                      ? 'bg-amber-100 text-amber-900'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    💡 {rec.reason}
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
              className="btn-press px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center gap-1.5 transition"
            >
              <span>Next: Available Slots</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: AVAILABLE SLOTS */}
      {step === 4 && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">
              Step 4: Select Available Slot at {selectedCentreRec?.centre.name}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Controlled hourly quotas prevent traffic bottlenecks and queue surges
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {(selectedCentreRec?.centre.slots && selectedCentreRec.centre.slots.length > 0
              ? selectedCentreRec.centre.slots
              : [
                  { id: 1, time_slot: '10:00 AM', booked_tokens: 8, capacity_tokens: 20 },
                  { id: 2, time_slot: '11:00 AM', booked_tokens: 12, capacity_tokens: 20 },
                  { id: 3, time_slot: '12:00 PM', booked_tokens: 5, capacity_tokens: 20 },
                  { id: 4, time_slot: '02:00 PM', booked_tokens: 14, capacity_tokens: 20 },
                  { id: 5, time_slot: '03:00 PM', booked_tokens: 6, capacity_tokens: 20 },
                ]
            ).map((slot: any) => {
              const isSel = selectedSlotId === slot.id;
              const spotsLeft = Math.max(1, (slot.capacity_tokens || 20) - (slot.booked_tokens || 0));
              return (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => setSelectedSlotId(slot.id)}
                  className={`p-4 rounded-2xl border text-center transition ${
                    isSel 
                      ? 'border-emerald-600 bg-emerald-600 text-white shadow-md' 
                      : 'border-slate-200 bg-slate-50 hover:bg-white text-slate-800'
                  }`}
                >
                  <Clock className={`w-5 h-5 mx-auto mb-1 ${isSel ? 'text-white' : 'text-emerald-700'}`} />
                  <div className="font-extrabold text-sm">{slot.time_slot}</div>
                  <div className={`text-[10px] mt-0.5 font-medium ${isSel ? 'text-emerald-100' : 'text-slate-500'}`}>
                    {spotsLeft} tokens open
                  </div>
                </button>
              );
            })}
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
              className="btn-press px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center gap-1.5 transition"
            >
              <span>Next: Representative</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: WHO WILL VISIT THE CENTRE? (Section 11) */}
      {step === 5 && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">
              Step 5: {t('whoWillVisit')}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              The produce belongs to registered farmer Ramesh Kumar. You may designate an authorized family member to visit on your behalf.
            </p>
          </div>

          <div className="space-y-3">
            {/* Self Option */}
            <div
              onClick={() => setVisitingMemberId(null)}
              className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between transition ${
                visitingMemberId === null
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold'
                  : 'border-slate-200 bg-slate-50 hover:bg-white text-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-200 flex items-center justify-center font-bold text-slate-700">
                  RK
                </div>
                <div>
                  <div className="text-xs font-extrabold">Self: Ramesh Kumar (Father / Head)</div>
                  <div className="text-[11px] text-slate-500 font-normal">Primary Farmer • Aadhaar Linked</div>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-700">Default</span>
            </div>

            {/* Family Members from Family F101 */}
            {family?.members.map((member) => {
              const isSel = visitingMemberId === member.id;
              return (
                <div
                  key={member.id}
                  onClick={() => setVisitingMemberId(member.id)}
                  className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between transition ${
                    isSel
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold'
                      : 'border-slate-200 bg-slate-50 hover:bg-white text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center font-bold text-emerald-800">
                      {member.name[0]}
                    </div>
                    <div>
                      <div className="text-xs font-extrabold">
                        {member.name} ({member.relationship_to_head})
                      </div>
                      <div className="text-[11px] text-slate-500 font-normal">
                        Sub-user: {member.sub_user_code} • Device: {member.device_type}
                      </div>
                    </div>
                  </div>

                  <div>
                    {member.is_authorized ? (
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                        AUTHORIZED REP
                      </span>
                    ) : (
                      <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-rose-300">
                        NOT AUTHORIZED
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Warning notice if unauthorized selected */}
          {visitingMemberId === 2 && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <p>
                <strong>Warning:</strong> Sunita Devi is not currently marked as an Authorized Representative in Family Settings. The procurement centre operator may reject entry!
              </p>
            </div>
          )}

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800">
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
              className="btn-press px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center gap-1.5 shadow-md transition"
            >
              <span>{loading ? 'Confirming...' : 'Confirm & Generate Token'}</span>
              <CheckCircle className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 6: CONFIRMATION SCREEN (Section 6) */}
      {step === 6 && confirmedBooking && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-300">
              BOOKING CONFIRMED
            </span>
            <h2 className="text-2xl font-black text-slate-900 mt-2">
              Procurement Token Generated
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              SMS confirmation dispatched to registered mobile +91 9876543210
            </p>
          </div>

          {/* Ticket Card */}
          <div className="max-w-md mx-auto bg-gradient-to-br from-slate-50 to-emerald-50/50 rounded-2xl p-5 border-2 border-dashed border-emerald-300 text-left space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200/80">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Booking ID</span>
                <div className="text-sm font-black font-mono text-slate-800">{confirmedBooking.booking_code}</div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Your Token</span>
                <div className="text-2xl font-black text-emerald-700">{confirmedBooking.token_number}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] font-bold">Centre:</span>
                <div className="font-bold text-slate-800">{confirmedBooking.centre_name}</div>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] font-bold">Slot Date & Time:</span>
                <div className="font-bold text-slate-800">{confirmedBooking.booking_date} at {confirmedBooking.booking_time}</div>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] font-bold">Crop & Quantity:</span>
                <div className="font-bold text-slate-800">{confirmedBooking.crop_name} ({confirmedBooking.quantity_quintals}q)</div>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] font-bold">Visiting Representative:</span>
                <div className="font-bold text-emerald-800">{confirmedBooking.visiting_member_name}</div>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('queue')}
              className="btn-press px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition"
            >
              Track Live Queue Status &rarr;
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-5 py-2.5 border border-slate-200 text-slate-700 font-semibold text-xs sm:text-sm rounded-xl hover:bg-slate-50"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
