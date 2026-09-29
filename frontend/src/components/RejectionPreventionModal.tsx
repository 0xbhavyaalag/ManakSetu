import React, { useEffect, useState } from 'react';
import { 
  X, CheckCircle, AlertTriangle, ShieldCheck, FileText, Droplets, 
  UserCheck, Volume2, Sparkles, HelpCircle, Check, Info, ArrowRight
} from 'lucide-react';
import { api } from '../services/api';
import { speakIvrText } from '../services/audioService';
import { useLanguage } from '../hooks/useLanguage';

interface RejectionPreventionModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId?: number;
}

export const RejectionPreventionModal: React.FC<RejectionPreventionModalProps> = ({
  isOpen,
  onClose,
  bookingId = 1
}) => {
  const { language } = useLanguage();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [interactiveMoisture, setInteractiveMoisture] = useState<number>(11.8);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      api.getPreVisitCheck(bookingId)
        .then(res => setData(res))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [isOpen, bookingId]);

  if (!isOpen) return null;

  // Compute moisture risk level
  const getMoistureStatus = (val: number) => {
    if (val <= 12.0) return { label: 'Optimal Quality (Full MSP ₹2,275)', color: 'text-emerald-700 bg-emerald-100 border-emerald-300', status: 'optimal' };
    if (val <= 14.0) return { label: 'Acceptable (FCI Deduction of ₹15-30/q)', color: 'text-amber-800 bg-amber-100 border-amber-300', status: 'warning' };
    return { label: 'HIGH RISK: Will be rejected at gate (>14%)', color: 'text-rose-800 bg-rose-100 border-rose-300', status: 'danger' };
  };

  const moistureStatus = getMoistureStatus(interactiveMoisture);

  const handleSpeakAdvisory = () => {
    if (!data) return;
    const textToSpeak = language === 'hi'
      ? `पूर्व-जाँच सलाह: ${data.advisory}। कृपया सुनिश्चित करें कि गेहूं की नमी 12 प्रतिशत से कम हो और आधार कार्ड तथा खतौनी साथ रखें।`
      : `Pre-visit advisory: ${data.advisory}. Please ensure wheat moisture is below 12% and bring your linked Aadhaar card and land records.`;
    speakIvrText(textToSpeak, language);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center shadow-md shadow-emerald-900/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 text-base sm:text-lg font-display">
                  {language === 'hi' ? 'पूर्व-यात्रा अस्वीकृति रोकथाम जाँच' : 'Pre-Visit Quality & Rejection Shield'}
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                AI verification before loading tractor to prevent mandi turnaround
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="my-4 space-y-4">
          {loading ? (
            <div className="py-12 text-center text-slate-500 text-sm flex flex-col items-center justify-center gap-2">
              <Sparkles className="w-6 h-6 animate-spin text-emerald-600" />
              <span>Analyzing procurement criteria and moisture thresholds...</span>
            </div>
          ) : data ? (
            <>
              {/* Overall Status Banner */}
              <div className={`p-4 rounded-2xl border flex items-start justify-between gap-3 shadow-xs ${
                data.all_clear 
                  ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200 text-emerald-900' 
                  : 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 text-amber-900'
              }`}>
                <div className="flex items-start gap-2.5">
                  {data.all_clear ? (
                    <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider block text-emerald-800">
                      {data.all_clear ? 'READY FOR DISPATCH' : 'ACTION REQUIRED BEFORE VISIT'}
                    </span>
                    <p className="text-xs font-semibold leading-relaxed mt-0.5">
                      {data.advisory}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleSpeakAdvisory}
                  className="btn-press shrink-0 p-2 bg-white rounded-xl border border-slate-200 hover:bg-emerald-50 text-emerald-800 shadow-2xs flex items-center gap-1 text-[11px] font-bold"
                  title="Listen in Voice"
                >
                  <Volume2 className="w-4 h-4 text-emerald-600" />
                  <span>सुनें</span>
                </button>
              </div>

              {/* Interactive Moisture Simulator Gauge */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold text-slate-800">
                      Moisture Content Self-Check (FCI Limit: 12.0%)
                    </span>
                  </div>
                  <span className="text-sm font-black font-mono text-slate-900 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200 shadow-2xs">
                    {interactiveMoisture.toFixed(1)}%
                  </span>
                </div>

                <input
                  type="range"
                  min="9.0"
                  max="16.0"
                  step="0.1"
                  value={interactiveMoisture}
                  onChange={(e) => setInteractiveMoisture(parseFloat(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-200 rounded-lg appearance-none"
                />

                <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                  <span>9.0% (Very Dry)</span>
                  <span className="font-bold text-emerald-700">12.0% (FCI Norm)</span>
                  <span className="font-bold text-rose-600">14.0%+ (Rejection)</span>
                </div>

                <div className={`mt-2.5 p-2 rounded-xl border text-xs font-bold flex items-center gap-2 ${moistureStatus.color}`}>
                  <Info className="w-3.5 h-3.5 shrink-0" />
                  <span>{moistureStatus.label}</span>
                </div>
              </div>

              {/* Checklist items list */}
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {data.items.map((item: any) => (
                  <div
                    key={item.id}
                    className="p-3 bg-white rounded-xl border border-slate-200/90 flex items-start gap-3 shadow-2xs hover:border-emerald-200 transition"
                  >
                    <div className="mt-0.5 shrink-0">
                      {item.status === 'passed' ? (
                        <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                          <AlertTriangle className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-slate-800 truncate">
                          {item.label}
                        </span>
                        <span className={`text-[9px] font-black tracking-wider px-2 py-0.5 rounded-full uppercase shrink-0 ${
                          item.status === 'passed' 
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}>
                          {item.status === 'passed' ? 'PASSED' : 'CHECK NEEDED'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                        {item.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Disclaimer */}
              <p className="text-[10px] text-slate-400 italic text-center">
                * {data.disclaimer} Final moisture is certified by on-site moisture meter at weighbridge.
              </p>
            </>
          ) : null}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="text-[11px] text-slate-400 font-mono">
            Booking ID: #{bookingId}
          </div>
          <button
            onClick={onClose}
            className="btn-press px-5 py-2.5 bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-800 hover:to-teal-800 text-white rounded-xl text-xs font-bold transition shadow-md"
          >
            I Understand, Proceed to Mandi
          </button>
        </div>

      </div>
    </div>
  );
};

