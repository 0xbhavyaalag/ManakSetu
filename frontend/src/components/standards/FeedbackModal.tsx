import React, { useState } from 'react';
import { StandardRecommendation } from '../../types/standards';
import { 
  X, 
  ThumbsUp, 
  ThumbsDown, 
  Flag, 
  Send, 
  CheckCircle2,
  Info 
} from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  standard: StandardRecommendation | null;
  initialStatus: 'relevant' | 'not_relevant' | 'needs_correction';
  onSubmit: (isId: string, status: 'relevant' | 'not_relevant' | 'needs_correction', note: string) => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  standard,
  initialStatus,
  onSubmit
}) => {
  const [status, setStatus] = useState<'relevant' | 'not_relevant' | 'needs_correction'>(initialStatus);
  const [note, setNote] = useState('');
  const [reasonCategory, setReasonCategory] = useState<string>('Scope match accurate');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !standard) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalNote = note.trim() ? `${reasonCategory}: ${note.trim()}` : reasonCategory;
    onSubmit(standard.id, status, finalNote);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1200);
  };

  const getReasonOptions = () => {
    if (status === 'relevant') {
      return [
        'Scope match accurate to specification',
        'Mandatory QCO correctly identified',
        'Normative test methods applicable',
        'Exact product rating matched'
      ];
    } else if (status === 'not_relevant') {
      return [
        'Out of scope for this procurement rating',
        'Standard is for indoor use instead of outdoor',
        'Superseded by alternative code',
        'Product category mismatch'
      ];
    } else {
      return [
        'Active amendment missing in record',
        'QCO notification date requires update',
        'Clause mapping is incomplete',
        'Conflicting normative reference'
      ];
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div 
        className="relative w-full max-w-md bg-white dark:bg-[#111a29] rounded-2xl shadow-2xl border border-slate-200 dark:border-[#1f2e47] p-5 sm:p-6 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="text-[11px] font-semibold text-teal-700 dark:text-teal-400 uppercase tracking-wider">
              Procurement Officer Feedback
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
              Review Recommendation Accuracy
            </h3>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              {standard.isNumber}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="p-6 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Feedback Recorded</h4>
            <p className="text-xs text-slate-500">Thank you for helping refine the MANAK-AI recommendation engine.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Status Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Evaluation Assessment:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setStatus('relevant')}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition ${
                    status === 'relevant'
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <ThumbsUp className="w-4 h-4 text-emerald-600" />
                  <span>Applicable</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStatus('not_relevant')}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition ${
                    status === 'not_relevant'
                      ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200 shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <ThumbsDown className="w-4 h-4 text-rose-600" />
                  <span>Not Applicable</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStatus('needs_correction')}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition ${
                    status === 'needs_correction'
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Flag className="w-4 h-4 text-amber-600" />
                  <span>Correction</span>
                </button>
              </div>
            </div>

            {/* Reason Category */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Primary Factor:
              </label>
              <select
                value={reasonCategory}
                onChange={(e) => setReasonCategory(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-hidden"
              >
                {getReasonOptions().map((opt, i) => (
                  <option key={i} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            {/* Optional Note */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Procurement Officer Notes (Optional):
              </label>
              <textarea
                rows={3}
                placeholder="e.g., this clause should reference the 2024 amendment table 3..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-teal-500 focus:outline-hidden resize-none"
              />
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-press px-4 py-2 text-xs font-bold rounded-xl bg-teal-700 text-white hover:bg-teal-800 shadow-sm flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Evaluation</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
