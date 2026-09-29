import React, { useState } from 'react';
import { StandardRecommendation } from '../../types/standards';
import { StandardsRecommendationEngine } from '../../services/standardsEngine';
import { 
  X, 
  Copy, 
  Check, 
  Download, 
  Printer, 
  FileText, 
  ShieldCheck, 
  AlertCircle, 
  Trash2, 
  Scale,
  Landmark
} from 'lucide-react';

interface DraftTenderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedStandards: StandardRecommendation[];
  onRemoveStandard: (id: string) => void;
  tenderInfo: {
    title: string;
    tenderRef: string;
    department: string;
  };
}

export const DraftTenderDrawer: React.FC<DraftTenderDrawerProps> = ({
  isOpen,
  onClose,
  selectedStandards,
  onRemoveStandard,
  tenderInfo
}) => {
  const [copied, setCopied] = useState(false);
  const [exportFormat, setExportFormat] = useState<'clause' | 'json' | 'summary'>('clause');

  if (!isOpen) return null;

  const generatedClause = StandardsRecommendationEngine.generateTenderClause(
    selectedStandards,
    tenderInfo
  );

  const handleCopyClause = () => {
    navigator.clipboard.writeText(generatedClause);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadFile = (type: 'txt' | 'json') => {
    let content = '';
    let filename = '';
    let mime = '';

    if (type === 'txt') {
      content = generatedClause;
      filename = `Tender_Spec_Clause_${tenderInfo.tenderRef.replace(/[^a-zA-Z0-9]/g, '_') || 'Draft'}.txt`;
      mime = 'text/plain;charset=utf-8';
    } else {
      content = JSON.stringify({
        metadata: {
          tenderTitle: tenderInfo.title,
          tenderRef: tenderInfo.tenderRef,
          department: tenderInfo.department,
          exportDate: new Date().toISOString(),
          system: "MANAK-AI Public Procurement Decision Support (SIH 2026 PS 26108)"
        },
        selectedStandards: selectedStandards.map(s => ({
          isNumber: s.isNumber,
          title: s.title,
          status: s.status,
          qcoMandatory: s.complianceInfo.qcoMandatory,
          qcoOrder: s.complianceInfo.qcoOrderNumber,
          amendmentsCount: s.amendments.length,
          alliedStandards: s.relatedStandards.map(r => `${r.isNumber} (${r.relationship})`)
        }))
      }, null, 2);
      filename = `Tender_Standards_BoQ_${tenderInfo.tenderRef.replace(/[^a-zA-Z0-9]/g, '_') || 'Draft'}.json`;
      mime = 'application/json;charset=utf-8';
    }

    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Tender Specification Annexure - ${tenderInfo.tenderRef}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace; line-height: 1.5; padding: 24px; color: #1e293b; }
            pre { white-space: pre-wrap; font-size: 13px; font-family: monospace; background: #f8fafc; padding: 16px; border: 1px solid #cbd5e1; border-radius: 8px; }
            h1 { font-size: 18px; margin-bottom: 4px; }
            .header { border-bottom: 2px solid #0f172a; padding-bottom: 8px; margin-bottom: 16px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Government of India - Technical Specification Annexure</h1>
            <p>Generated via MANAK-AI (SIH 2026 PS 26108) • Date: ${new Date().toLocaleDateString('en-IN')}</p>
          </div>
          <pre>${generatedClause}</pre>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div 
        className="relative w-full max-w-4xl bg-white dark:bg-[#111a29] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-teal-100 dark:bg-teal-950 text-teal-900 dark:text-teal-200 font-bold text-xs font-mono">
                  SPECIAL TECHNICAL CONDITIONS (STC)
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {selectedStandards.length} Standard{selectedStandards.length !== 1 ? 's' : ''} Included
                </span>
              </div>

              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-1">
                Contractual Tender Clause: Compliance with Indian Standards (IS)
              </h2>

              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Formatted for immediate incorporation into GeM Custom Bids, CPWD NIT schedules, and Central Public Procurement Portal (CPPP) documents.
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition"
              title="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Statutory Review Warning */}
          <div className="mt-3.5 p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs flex items-start gap-2.5">
            <Scale className="w-4 h-4 text-teal-800 dark:text-teal-400 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold text-slate-900 dark:text-white">Procurement Officer Endorsement:</strong> Prior to floating the NIT, verify active Gazette Quality Control Orders (QCO) and amendment numbers on the official BIS portal (services.bis.gov.in) to ensure compliance with General Financial Rules, 2017 Rule 144(i).
            </div>
          </div>
        </div>

        {/* Selected Standards Quick Strip */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900/40 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="font-semibold text-slate-500 shrink-0 font-mono">Incorporated:</span>
          {selectedStandards.length === 0 ? (
            <span className="text-slate-400 italic">No standards selected yet. Check boxes in recommendation cards.</span>
          ) : (
            selectedStandards.map((std) => (
              <span 
                key={std.id}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 flex items-center gap-1.5 shrink-0 shadow-xs font-mono"
              >
                <span className="font-bold">{std.isNumber.split(':')[0].trim()}</span>
                <button
                  onClick={() => onRemoveStandard(std.id)}
                  className="text-slate-400 hover:text-rose-600 ml-1 p-0.5"
                  title="Remove from draft"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))
          )}
        </div>

        {/* Content Body: Clause Text Preview */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Annexure Format:</span>
              <button
                onClick={() => setExportFormat('clause')}
                className={`px-3 py-1 rounded-md font-medium transition ${
                  exportFormat === 'clause' 
                    ? 'bg-slate-900 text-white dark:bg-teal-800' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                NIT Special Condition Clause
              </button>
              <button
                onClick={() => setExportFormat('json')}
                className={`px-3 py-1 rounded-md font-medium transition ${
                  exportFormat === 'json' 
                    ? 'bg-slate-900 text-white dark:bg-teal-800' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                GeM BoQ Schema (JSON)
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Clause</span>
              </button>
              <button
                onClick={handleCopyClause}
                className="btn-press px-3.5 py-1.5 rounded-lg bg-teal-800 text-white text-xs font-semibold hover:bg-teal-900 flex items-center gap-1.5 shadow-xs"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Clause'}</span>
              </button>
            </div>
          </div>

          {/* Formatted Code Box */}
          <div className="relative rounded-xl border border-slate-300 dark:border-slate-700 overflow-hidden bg-slate-950 text-slate-100 font-mono text-xs shadow-inner">
            <pre className="p-4 sm:p-5 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[360px]">
              {exportFormat === 'clause' ? generatedClause : JSON.stringify({
                tender: tenderInfo,
                standards: selectedStandards.map(s => ({
                  isNumber: s.isNumber,
                  title: s.title,
                  qcoMandatory: s.complianceInfo.qcoMandatory,
                  scheme: s.complianceInfo.scheme
                }))
              }, null, 2)}
            </pre>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500">Download File:</span>
            <button
              onClick={() => handleDownloadFile('txt')}
              className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold hover:bg-slate-50 transition flex items-center gap-1"
            >
              <Download className="w-3 h-3" />
              <span>Clause (.txt)</span>
            </button>
            <button
              onClick={() => handleDownloadFile('json')}
              className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold hover:bg-slate-50 transition flex items-center gap-1"
            >
              <Download className="w-3 h-3" />
              <span>GeM JSON (.json)</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Close
            </button>
            <button
              onClick={handleCopyClause}
              className="btn-press px-5 py-2 rounded-xl text-xs font-bold bg-teal-800 text-white hover:bg-teal-900 shadow-sm transition flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Copy Full Clause for NIT</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
