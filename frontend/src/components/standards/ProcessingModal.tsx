import React from 'react';
import { 
  Loader2, 
  CheckCircle2, 
  Cpu, 
  Network, 
  ShieldCheck, 
  X, 
  FileSearch,
  Scale,
  Landmark,
  FileText
} from 'lucide-react';
import { ExtractionProgressUpdate } from '../../services/standardsEngine';

interface ProcessingModalProps {
  isOpen: boolean;
  progress: ExtractionProgressUpdate | null;
  onCancel: () => void;
  title?: string;
}

export const ProcessingModal: React.FC<ProcessingModalProps> = ({
  isOpen,
  progress,
  onCancel,
  title = "Verifying Specifications Against National Standards"
}) => {
  if (!isOpen) return null;

  const currentStage = progress?.stage || 1;
  const percentage = progress?.percentage || 25;

  const stages = [
    { num: 1, name: 'Specification Schedule Normalization', icon: FileSearch, desc: 'Parsing tender clauses, technical schedules, and units of measurement' },
    { num: 2, name: 'Technical Parameter Parameterization', icon: FileText, desc: 'Extracting nominal ratings, tolerances, and mandatory test requirements' },
    { num: 3, name: 'BIS Standards Repository Matching', icon: Scale, desc: 'Cross-referencing active Bureau of Indian Standards (BIS) catalog' },
    { num: 4, name: 'Normative References & Test Codes Resolution', icon: Network, desc: 'Resolving allied raw material standards, routine tests, and acceptance codes' },
    { num: 5, name: 'Statutory Gazette QCO Compliance Verification', icon: ShieldCheck, desc: 'Verifying active Quality Control Orders under Section 16 of the BIS Act, 2016' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#111a29] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                {title}
              </h3>
              <p className="text-[11px] text-slate-500 font-mono">
                Bureau of Indian Standards • SIH 2026 PS 26108
              </p>
            </div>
          </div>

          <button
            onClick={onCancel}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Cancel Processing"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-teal-800 dark:text-teal-300">
              {progress?.stageName || 'Executing Institutional Verification...'}
            </span>
            <span className="text-slate-500 font-mono">{percentage}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div 
              className="h-full bg-teal-700 transition-all duration-300 rounded-full"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
            {progress?.detail || 'Analyzing specification text...'}
          </p>
        </div>

        {/* Audit Stages Checklist */}
        <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
          {stages.map((st) => {
            const isCompleted = currentStage > st.num;
            const isCurrent = currentStage === st.num;
            const isPending = currentStage < st.num;
            const Icon = st.icon;

            return (
              <div 
                key={st.num}
                className={`p-3 rounded-xl border text-xs flex items-center gap-3 transition-all ${
                  isCurrent 
                    ? 'border-teal-500 bg-teal-50/70 dark:bg-teal-950/40 text-teal-950 dark:text-teal-100 shadow-xs' 
                    : isCompleted 
                    ? 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 text-slate-600 dark:text-slate-300' 
                    : 'border-transparent text-slate-400 dark:text-slate-600 opacity-60'
                }`}
              >
                <div className={`p-1.5 rounded-lg shrink-0 ${
                  isCompleted 
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                    : isCurrent 
                    ? 'bg-teal-800 text-white' 
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                }`}>
                  {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
                </div>

                <div className="flex-1">
                  <div className="font-semibold">{st.name}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">{st.desc}</div>
                </div>

                {isCurrent && (
                  <span className="text-[10px] font-mono font-bold text-teal-800 dark:text-teal-300 shrink-0">
                    Checking...
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-100 dark:border-slate-800">
          <span className="text-slate-400 text-[11px] font-mono">
            Verifying against Gazette of India records
          </span>
          <button
            onClick={onCancel}
            className="px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition text-xs"
          >
            Cancel Audit
          </button>
        </div>

      </div>
    </div>
  );
};
