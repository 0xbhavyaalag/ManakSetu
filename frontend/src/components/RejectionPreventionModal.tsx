import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertTriangle, ShieldCheck, FileText, Droplets, UserCheck } from 'lucide-react';
import { api } from '../services/api';

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
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-emerald-700" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Pre-Visit Rejection Prevention Check
              </h3>
              <p className="text-xs text-slate-500">
                Advisory inspection before traveling to the procurement centre
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="my-4">
          {loading ? (
            <div className="py-12 text-center text-slate-500 text-sm">
              Analyzing centre criteria and farmer profile...
            </div>
          ) : data ? (
            <div className="space-y-4">
              
              {/* Banner */}
              <div className={`p-3.5 rounded-xl border flex items-center gap-3 ${
                data.all_clear 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                  : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}>
                {data.all_clear ? (
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                )}
                <p className="text-xs font-semibold leading-relaxed">
                  {data.advisory}
                </p>
              </div>

              {/* Checklist items */}
              <div className="space-y-2.5">
                {data.items.map((item: any) => (
                  <div
                    key={item.id}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200/90 flex items-start gap-3"
                  >
                    <div className="mt-0.5">
                      {item.status === 'passed' ? (
                        <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                          <CheckCircle className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                          <AlertTriangle className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800">
                          {item.label}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          item.status === 'passed' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {item.status === 'passed' ? 'VERIFIED' : 'ACTION REQUIRED'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {item.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Disclaimer */}
              <p className="text-[11px] text-slate-400 italic text-center pt-2">
                * Note: {data.disclaimer} Final acceptance occurs after physical weighing and lab testing.
              </p>

            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition"
          >
            I Understand, Proceed
          </button>
        </div>

      </div>
    </div>
  );
};
