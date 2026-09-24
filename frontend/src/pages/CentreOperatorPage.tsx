import React, { useState, useEffect } from 'react';
import { 
  Building2, Users, Clock, CheckCircle2, AlertTriangle, ArrowRight, 
  Scale, Droplets, ShieldCheck, DollarSign, RefreshCw 
} from 'lucide-react';
import { Booking } from '../types';
import { api } from '../services/api';

interface CentreOperatorPageProps {
  booking: Booking | null;
  onRefreshBooking: () => void;
}

export const CentreOperatorPage: React.FC<CentreOperatorPageProps> = ({
  booking,
  onRefreshBooking
}) => {
  const [centreQueue, setCentreQueue] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [moisture, setMoisture] = useState<number>(11.2);
  const [netWeight, setNetWeight] = useState<number>(49.8);
  const [operatorMsg, setOperatorMsg] = useState<string | null>(null);

  const fetchOverview = async () => {
    try {
      const q = await api.getCentreQueueOverview(2); // Centre B
      setCentreQueue(q);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const handleCallNextToken = async () => {
    setLoading(true);
    try {
      await api.callNextToken(2);
      setOperatorMsg('Called next token. SMS notification dispatched to farmer!');
      fetchOverview();
      onRefreshBooking();
    } catch (e: any) {
      setOperatorMsg('Failed to advance token.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (status: string) => {
    if (!booking) return;
    setLoading(true);
    try {
      await api.updateProcurementStatus(booking.id, {
        status,
        moisture_pct: moisture,
        gross_weight_quintals: 50.0,
        net_weight_quintals: netWeight
      });

      if (status === 'accepted') {
        // Also trigger payment processing
        await api.releasePayment(booking.id, 'paid');
      }

      setOperatorMsg(`Stage advanced to: ${status.toUpperCase()}! Updated in real time.`);
      onRefreshBooking();
    } catch (e: any) {
      setOperatorMsg(e.message || 'Status update error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-20 md:pb-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 p-1.5 flex items-center justify-center shadow-md shrink-0">
            <img src="/logo-icon.png" alt="ANNADHARA" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Centre B - Annadhara Model Hub
              </h1>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                OPERATOR CONSOLE
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Operator: Surendra Singh • Terminal: Counter #3 • Status: Normal (15 Queue)
            </p>
          </div>
        </div>

        <button
          onClick={handleCallNextToken}
          disabled={loading}
          className="btn-press px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md flex items-center gap-2 transition"
        >
          <Clock className="w-4 h-4" />
          <span>Call Next Token</span>
        </button>
      </div>

      {operatorMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs text-emerald-900 font-bold flex items-center justify-between">
          <span>🔔 {operatorMsg}</span>
          <button onClick={() => setOperatorMsg(null)} className="text-slate-400 hover:text-slate-700">&times;</button>
        </div>
      )}

      {/* Operator Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Current Token</span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            {centreQueue?.current_token || 'T103'}
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold">Active at Counter</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Waiting Queue</span>
          <div className="text-2xl sm:text-3xl font-black text-amber-600 mt-1">
            {centreQueue?.total_waiting || 15}
          </div>
          <span className="text-[10px] text-slate-500">In Yard</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Active Counters</span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">3</div>
          <span className="text-[10px] text-slate-500">Speed: ~6m / farmer</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Today's Intake</span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-700 mt-1">420q</div>
          <span className="text-[10px] text-slate-500">Capacity: 1,000q</span>
        </div>
      </div>

      {/* Active Processing Vehicle Inspection Panel */}
      {booking && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                CURRENT VEHICLE UNDER INSPECTION
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-0.5">
                Token {booking.token_number} • {booking.farmer_name} ({booking.booking_code})
              </h3>
              <p className="text-xs text-slate-500">
                Produce: {booking.crop_name} ({booking.quantity_quintals} Quintals) • Rep: <strong>{booking.visiting_member_name}</strong>
              </p>
            </div>

            <span className={`text-xs font-extrabold px-3 py-1 rounded-full uppercase border ${
              booking.status === 'accepted'
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                : 'bg-amber-100 text-amber-800 border-amber-300'
            }`}>
              Current Stage: {booking.status}
            </span>
          </div>

          {/* Interactive Inspection Stages */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Step 1: Gate & Representative */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  1. Gate & Representative Check
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                  AUTHORIZED
                </span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Visiting Representative <strong>Rahul Kumar (Son)</strong> is registered and verified under Family <strong>F101</strong>.
              </p>
              <div className="flex gap-2 pt-1">
                <button
                  id="btn-op-arrived"
                  onClick={() => handleUpdateStatus('arrived')}
                  disabled={loading}
                  className="btn-press flex-1 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl transition"
                >
                  Mark Arrived
                </button>
                <button
                  id="btn-op-verified"
                  onClick={() => handleUpdateStatus('verified')}
                  disabled={loading}
                  className="btn-press flex-1 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl transition"
                >
                  Verify Rep & Docs
                </button>
              </div>
            </div>

            {/* Step 2: Quality Inspection (Moisture) */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                  <Droplets className="w-4 h-4 text-blue-600" />
                  2. Quality Check (Moisture & FAQ)
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${moisture <= 12 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                  {moisture <= 12 ? 'PASSED FAQ' : 'EXCEEDS 12% LIMIT'}
                </span>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-500">Moisture Content:</span>
                  <strong className="text-slate-900 font-mono">{moisture}%</strong>
                </div>
                <input
                  type="range"
                  min="9"
                  max="16"
                  step="0.1"
                  value={moisture}
                  onChange={(e) => setMoisture(parseFloat(e.target.value))}
                  className="w-full accent-emerald-600"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  id="btn-op-quality"
                  onClick={() => handleUpdateStatus('quality_checked')}
                  disabled={loading}
                  className="btn-press w-full py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl transition"
                >
                  Complete Quality Check ({moisture}%)
                </button>
              </div>
            </div>

            {/* Step 3: Weighbridge Scale */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-indigo-600" />
                  3. Digital Weighbridge Measurement
                </span>
                <span className="font-mono font-bold text-slate-800">Tare: 0.20q</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">Net Weight Recorded:</span>
                <input
                  type="number"
                  step="0.1"
                  value={netWeight}
                  onChange={(e) => setNetWeight(parseFloat(e.target.value))}
                  className="w-24 p-1 text-right font-mono font-bold bg-white border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <button
                id="btn-op-weighed"
                onClick={() => handleUpdateStatus('weighed')}
                disabled={loading}
                className="btn-press w-full py-2 bg-indigo-700 hover:bg-indigo-800 text-white font-bold rounded-xl transition"
              >
                Complete Weighing Scale
              </button>
            </div>

            {/* Step 4: Formal Acceptance & Payment Release */}
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-emerald-950 flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-emerald-700" />
                  4. Accept Produce & Initiate Payment
                </span>
                <span className="font-mono font-bold text-emerald-900">₹1,13,295</span>
              </div>

              <p className="text-emerald-800 leading-relaxed">
                Transfers custody to Food Corporation godown and triggers automated DBT credit.
              </p>

              <button
                id="btn-op-accept"
                onClick={() => handleUpdateStatus('accepted')}
                disabled={loading}
                className="btn-press w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-md transition"
              >
                Accept Procurement & Release Payment
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
