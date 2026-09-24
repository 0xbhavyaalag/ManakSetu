import React, { useEffect, useState } from 'react';
import { 
  CheckCircle, Clock, ShieldCheck, Scale, FileText, 
  DollarSign, AlertCircle, RefreshCw 
} from 'lucide-react';
import { Booking } from '../types';
import { api } from '../services/api';

interface ProcurementStatusPageProps {
  booking: Booking | null;
}

export const ProcurementStatusPage: React.FC<ProcurementStatusPageProps> = ({ booking }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchProc = async () => {
    if (!booking) return;
    try {
      const res = await api.getProcurement(booking.id);
      setData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProc();
    const interval = setInterval(fetchProc, 10000); // 10s poll
    return () => clearInterval(interval);
  }, [booking?.id]);

  if (!booking) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 max-w-lg mx-auto">
        <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="font-bold text-slate-800 text-lg">No Procurement in Progress</h3>
        <p className="text-xs text-slate-500 mt-1">Book a slot to track the on-ground stage progression.</p>
      </div>
    );
  }

  const stages = data?.stages || [
    { id: 'confirmed', title: 'Booking Confirmed', completed: true, active: false },
    { id: 'arrived', title: 'Farmer Arrived', completed: booking.status !== 'confirmed', active: booking.status === 'arrived' },
    { id: 'verified', title: 'Document & Representative Verification', completed: ['verified', 'quality_checked', 'weighed', 'accepted'].includes(booking.status), active: booking.status === 'verified' },
    { id: 'quality_checked', title: 'Quality Check (FAQ Standards)', completed: ['quality_checked', 'weighed', 'accepted'].includes(booking.status), active: booking.status === 'quality_checked' },
    { id: 'weighed', title: 'Gross & Tare Weighing Scale', completed: ['weighed', 'accepted'].includes(booking.status), active: booking.status === 'weighed' },
    { id: 'accepted', title: 'Procurement Formally Accepted', completed: booking.status === 'accepted', active: booking.status === 'accepted' },
    { id: 'payment_completed', title: 'Aadhaar DBT Payment Disbursed', completed: booking.payment_status === 'paid', active: booking.payment_status === 'processing' }
  ];

  const rec = data?.record;

  return (
    <div className="max-w-3xl mx-auto pb-20 md:pb-8 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Procurement Lifecycle Timeline
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Stage-by-stage verification at {booking.centre_name}
          </p>
        </div>

        <button
          onClick={() => { setLoading(true); fetchProc(); }}
          className="btn-press p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {/* Booking Badge Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase">Booking Code</span>
          <div className="text-sm font-black font-mono text-slate-800">{booking.booking_code}</div>
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase">Token</span>
          <div className="text-sm font-black text-emerald-700">{booking.token_number}</div>
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase">Crop & Qty</span>
          <div className="text-sm font-bold text-slate-800">{booking.crop_name} ({booking.quantity_quintals}q)</div>
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase">Visiting Rep</span>
          <div className="text-sm font-bold text-emerald-800">{booking.visiting_member_name}</div>
        </div>
      </div>

      {/* Vertical Stepper Timeline */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="space-y-6 relative before:absolute before:inset-0 before:left-5 before:w-0.5 before:bg-slate-200 before:z-0">
          {stages.map((st: any, idx: number) => {
            return (
              <div key={st.id} className="relative z-10 flex items-start gap-4">
                
                {/* Status Icon Indicator */}
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border-2 transition ${
                  st.completed 
                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-700/20' 
                    : st.active
                    ? 'bg-amber-100 border-amber-500 text-amber-800 animate-pulse'
                    : 'bg-white border-slate-300 text-slate-400'
                }`}>
                  {st.completed ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <span className="font-extrabold text-xs">{idx + 1}</span>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pt-1.5">
                  <div className="flex items-center justify-between">
                    <h4 className={`text-sm font-extrabold ${st.completed ? 'text-slate-900' : st.active ? 'text-amber-800' : 'text-slate-400'}`}>
                      {st.title}
                    </h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      st.completed 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : st.active 
                        ? 'bg-amber-100 text-amber-800 animate-pulse' 
                        : 'bg-slate-100 text-slate-400'
                    }`}>
                      {st.completed ? 'COMPLETED' : st.active ? 'IN PROGRESS' : 'PENDING'}
                    </span>
                  </div>

                  {/* Stage-specific details */}
                  {st.id === 'quality_checked' && rec && st.completed && (
                    <div className="mt-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Moisture Content:</span>
                        <strong className="text-emerald-700">{rec.moisture_pct}% (Limit: &le; 12.0%)</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Foreign Matter:</span>
                        <strong>{rec.foreign_matter_pct}% (Limit: &le; 1.0%)</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Grade:</span>
                        <strong>{rec.quality_grade}</strong>
                      </div>
                    </div>
                  )}

                  {st.id === 'weighed' && rec && st.completed && (
                    <div className="mt-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Net Weight Recorded:</span>
                        <strong className="text-emerald-700">{rec.net_weight} Quintals</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Government MSP Rate:</span>
                        <strong>₹{rec.rate_per_quintal}/q</strong>
                      </div>
                      <div className="flex justify-between text-emerald-900 font-bold">
                        <span>Total Payable Value:</span>
                        <span>₹{rec.total_amount_inr?.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
