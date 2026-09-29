import React, { useState } from 'react';
import { ProcurementAnalysis } from '../../types/standards';
import { 
  X, 
  Search, 
  Clock, 
  Building2, 
  FileText, 
  ArrowRight, 
  CheckCircle2, 
  ExternalLink,
  Trash2
} from 'lucide-react';

interface AnalysisHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  analyses: ProcurementAnalysis[];
  onSelectAnalysis: (analysis: ProcurementAnalysis) => void;
}

export const AnalysisHistoryModal: React.FC<AnalysisHistoryModalProps> = ({
  isOpen,
  onClose,
  analyses,
  onSelectAnalysis
}) => {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filtered = analyses.filter(a => 
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.department.toLowerCase().includes(search.toLowerCase()) ||
    a.tenderReference.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div 
        className="relative w-full max-w-3xl bg-white dark:bg-[#111a29] rounded-2xl shadow-2xl border border-slate-200 dark:border-[#1f2e47] overflow-hidden flex flex-col max-h-[88vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-bold text-xs">
                  Saved Records
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {analyses.length} Analysis Submissions
                </span>
              </div>

              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-1">
                Procurement Analysis History & Saved Tenders
              </h2>

              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Retrieve previous specification analyses, extracted parameters, and verified Indian Standards lists.
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search bar */}
          <div className="mt-4 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by tender title, department, or NIT reference number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        {/* History List */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-3">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No saved analyses match your search query.
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-teal-400 dark:hover:border-teal-600 bg-white dark:bg-[#131f33] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[11px] font-bold text-teal-800 dark:text-teal-300">
                      {item.tenderReference}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold">
                      {item.recommendations.length} Standards Matched
                    </span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3" />
                      <span>{item.createdAt}</span>
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                    {item.title}
                  </h4>

                  <p className="text-slate-500 dark:text-slate-400 text-xs flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.department}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => {
                      onSelectAnalysis(item);
                      onClose();
                    }}
                    className="btn-press px-3.5 py-1.5 rounded-lg bg-teal-700 text-white font-semibold hover:bg-teal-800 transition flex items-center gap-1 text-xs"
                  >
                    <span>Load Workspace</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between text-xs">
          <span className="text-slate-400">
            Stored securely in local procurement officer session
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
