import React, { useState } from 'react';
import { X, PhoneCall, CheckCircle2, MessageSquare, Clock, PhoneForwarded } from 'lucide-react';
import { api } from '../services/api';
import { playPhoneRing, speakIvrText } from '../services/audioService';

interface MissedCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  phone?: string;
}

export const MissedCallModal: React.FC<MissedCallModalProps> = ({
  isOpen,
  onClose,
  phone = '9876543210'
}) => {
  const [loading, setLoading] = useState(false);
  const [callbackData, setCallbackData] = useState<any>(null);

  if (!isOpen) return null;

  const handleGiveMissedCall = async () => {
    setLoading(true);
    playPhoneRing(500);

    try {
      const res = await api.sendMissedCall(phone);
      setCallbackData(res);
      // Voice call simulation speaks message
      speakIvrText(
        `नमस्ते! अन्नधारा से आपका टोकन ${res.token_number} है। आपसे आगे ${res.people_ahead} किसान हैं। अनुमानित प्रतीक्षा समय ${res.estimated_wait_mins} मिनट है।`,
        'hi'
      );
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <PhoneCall className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Missed-Call Toll Free Service
              </h3>
              <p className="text-xs text-slate-500">
                Works on simple basic feature phones without internet
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="my-5 space-y-4">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700">
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold">Registered Mobile:</span>
              <span className="font-mono font-bold text-emerald-800">+91 {phone}</span>
            </div>
            <p className="text-slate-500">
              Farmers can give a free missed call to <strong>1800-266-ANNADHARA</strong> to receive their token number and waiting time instantly.
            </p>
          </div>

          {!callbackData ? (
            <button
              id="btn-trigger-missed-call"
              onClick={handleGiveMissedCall}
              disabled={loading}
              className="btn-press w-full py-3 bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2 text-sm"
            >
              <PhoneForwarded className="w-4 h-4 animate-bounce" />
              <span>{loading ? 'Dialing & Disconnecting...' : 'Give Missed Call (1-Click)'}</span>
            </button>
          ) : (
            <div className="space-y-3">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-1" />
                <h4 className="font-bold text-emerald-900 text-sm">
                  Missed Call Registered!
                </h4>
                <p className="text-xs text-emerald-700 mt-1">
                  Callback & SMS triggered to your mobile number.
                </p>
              </div>

              {/* Status details card */}
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[11px] text-slate-500 font-medium">Your Token</div>
                  <div className="text-xl font-extrabold text-emerald-700">{callbackData.token_number}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[11px] text-slate-500 font-medium">Estimated Wait</div>
                  <div className="text-xl font-extrabold text-slate-800">{callbackData.estimated_wait_mins} mins</div>
                </div>
              </div>

              {/* Dispatched SMS Preview */}
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-amber-900 mb-1">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>SMS Received on Device:</span>
                </div>
                <p className="text-slate-700 font-mono text-[11px] leading-relaxed">
                  {callbackData.sms_dispatched}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center pt-2 border-t border-slate-100">
          <button
            onClick={onClose}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            Close Window
          </button>
        </div>

      </div>
    </div>
  );
};
