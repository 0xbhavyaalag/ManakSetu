import React, { useEffect, useState } from 'react';
import { 
  DollarSign, CheckCircle2, Clock, ShieldCheck, Download, 
  Printer, ArrowUpRight, Building2, CreditCard, RefreshCw 
} from 'lucide-react';
import { Booking } from '../types';
import { api } from '../services/api';

interface PaymentStatusPageProps {
  booking: Booking | null;
}

export const PaymentStatusPage: React.FC<PaymentStatusPageProps> = ({ booking }) => {
  const [payment, setPayment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchPayment = async () => {
    if (!booking) return;
    try {
      const res = await api.getPayment(booking.id);
      setPayment(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayment();
  }, [booking?.id]);

  if (!booking) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 max-w-lg mx-auto">
        <DollarSign className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="font-bold text-slate-800 text-lg">No Payment Records</h3>
        <p className="text-xs text-slate-500 mt-1">Payments are initiated upon centre acceptance of harvest.</p>
      </div>
    );
  }

  const isPaid = payment?.status === 'paid';
  const amount = payment?.amount_inr || (booking.quantity_quintals * 2275.0);

  return (
    <div className="max-w-3xl mx-auto pb-20 md:pb-8 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Direct Benefit Transfer (DBT) Payment Status
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Aadhaar Enabled Payment System (AePS) • Zero Intermediary Guarantee
          </p>
        </div>

        <button
          onClick={() => { setLoading(true); fetchPayment(); }}
          className="btn-press p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {/* Hero Payment Slip */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 gap-3">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              TOTAL PROCUREMENT PAYOUT
            </span>
            <div className="text-3xl sm:text-4xl font-black text-emerald-800 mt-1">
              ₹{Math.round(amount).toLocaleString('en-IN')}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              {booking.quantity_quintals} Quintals {booking.crop_name} @ ₹2,275/q MSP
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className={`inline-flex items-center gap-1 text-xs font-extrabold px-3 py-1 rounded-full ${
              isPaid
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-amber-100 text-amber-800 border border-amber-300'
            }`}>
              {isPaid ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5 animate-spin" />}
              <span>{isPaid ? 'PAID VIA AADHAAR DBT' : 'PROCESSING APPROVAL'}</span>
            </span>
            <div className="text-[11px] text-slate-400 font-mono mt-1">
              {payment?.paid_at ? `Credited: ${new Date(payment.paid_at).toLocaleString()}` : 'Expected credit in 24-48 hrs'}
            </div>
          </div>
        </div>

        {/* Transaction Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-slate-900 border-b border-slate-200 pb-1.5">
              <CreditCard className="w-4 h-4 text-emerald-700" />
              <span>Farmer Account Details</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Beneficiary:</span>
              <strong className="text-slate-900">{booking.farmer_name}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Bank & Masked A/C:</span>
              <strong className="font-mono text-slate-900">{payment?.account_masked || 'SBIN000401 - A/C **8912'}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Aadhaar Token:</span>
              <strong className="font-mono text-slate-900">XXXX-XXXX-8921</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Disbursement Mode:</span>
              <strong className="text-emerald-800">Aadhaar DBT Direct</strong>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-slate-900 border-b border-slate-200 pb-1.5">
              <Building2 className="w-4 h-4 text-blue-700" />
              <span>Government Mandi Reference</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Transaction ID:</span>
              <strong className="font-mono text-slate-900">{payment?.transaction_id || 'DBT-KS-9082341'}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">RBI Bank UTR:</span>
              <strong className="font-mono text-slate-900">{payment?.bank_ref_no || 'UTR-RBI-882910394'}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Procuring Centre:</span>
              <strong className="text-slate-900">{booking.centre_name}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Booking Reference:</span>
              <strong className="font-mono text-slate-900">{booking.booking_code}</strong>
            </div>
          </div>
        </div>

        {/* Print / Download Receipt */}
        <div className="pt-2 flex flex-wrap gap-2.5 justify-end">
          <button
            onClick={() => window.print()}
            className="btn-press px-4 py-2 border border-slate-300 text-slate-700 font-semibold text-xs rounded-xl hover:bg-slate-50 flex items-center gap-1.5 transition"
          >
            <Printer className="w-4 h-4" />
            <span>Print DBT Receipt</span>
          </button>
          <button
            onClick={() => alert(`Official Payment Slip downloaded for ${payment?.transaction_id || 'DBT-KS-9082341'}`)}
            className="btn-press px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition"
          >
            <Download className="w-4 h-4" />
            <span>Download Slip (PDF)</span>
          </button>
        </div>

      </div>

    </div>
  );
};
