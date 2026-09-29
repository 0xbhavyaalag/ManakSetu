import React, { useState } from 'react';
import { StandardRecommendation, RelationshipType } from '../../types/standards';
import { STANDARDS_DATABASE } from '../../services/standardsData';
import { 
  X, 
  ShieldCheck, 
  AlertTriangle, 
  ExternalLink, 
  Copy, 
  Check, 
  Calendar, 
  Layers, 
  FileText, 
  Sparkles, 
  Landmark, 
  BookOpen, 
  History, 
  Info,
  CheckCircle2,
  BookmarkPlus,
  BookmarkCheck,
  Scale,
  ArrowRight
} from 'lucide-react';

interface StandardDetailModalProps {
  standard: StandardRecommendation | null;
  isOpen: boolean;
  onClose: () => void;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onNavigateToStandard?: (standard: StandardRecommendation) => void;
  selectedStandardIds?: string[];
}

export const StandardDetailModal: React.FC<StandardDetailModalProps> = ({
  standard,
  isOpen,
  onClose,
  isSelected,
  onToggleSelect,
  onNavigateToStandard,
  selectedStandardIds = []
}) => {
  const [activeTab, setActiveTab] = useState<'evidence' | 'scope' | 'amendments' | 'related' | 'compliance'>('evidence');
  const [copiedCitation, setCopiedCitation] = useState(false);

  if (!isOpen || !standard) return null;

  const handleCopyCitation = () => {
    const citation = `${standard.isNumber} : ${standard.title} (Bureau of Indian Standards). Edition ${standard.editionYear}.`;
    navigator.clipboard.writeText(citation);
    setCopiedCitation(true);
    setTimeout(() => setCopiedCitation(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div 
        className="relative w-full max-w-4xl bg-white dark:bg-[#161616] rounded-2xl shadow-2xl border border-slate-200 dark:border-[#282828] overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-[#262626] bg-slate-50/70 dark:bg-[#1b1b1b]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  {standard.isNumber}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  {standard.status}
                </span>
                <span className="px-2 py-0.5 rounded-md text-xs font-mono bg-slate-200 dark:bg-[#252525] text-slate-700 dark:text-slate-300">
                  Edition {standard.editionYear}
                </span>
                {standard.complianceInfo.qcoMandatory && (
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200 border border-amber-300 dark:border-amber-800 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-amber-600" />
                    <span>Mandatory QCO</span>
                  </span>
                )}
              </div>

              <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 mt-1.5 leading-snug">
                {standard.title}
              </h2>

              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex flex-wrap items-center gap-2">
                <span>BIS Committee: <strong>{standard.sourceProvenance.bisSectionalCommittee}</strong></span>
                <span>•</span>
                <span>Category: <strong>{standard.category}</strong></span>
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition cursor-pointer"
              title="Close modal (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Action Bar inside Header */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200/70 dark:border-[#262626]">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 dark:text-slate-400">Relevance Score:</span>
              <span className="font-bold text-indigo-800 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
                {standard.relevanceScore}% ({standard.relevanceLabel})
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyCitation}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#222222] text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#2b2b2b] transition cursor-pointer"
              >
                {copiedCitation ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCitation ? 'Citation Copied' : 'Copy Citation'}</span>
              </button>

              <button
                onClick={() => onToggleSelect(standard.id)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-700 text-white hover:bg-emerald-800'
                    : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800'
                }`}
              >
                {isSelected ? <BookmarkCheck className="w-3.5 h-3.5" /> : <BookmarkPlus className="w-3.5 h-3.5" />}
                <span>{isSelected ? 'In Tender Draft Spec' : 'Add to Tender Draft'}</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 mt-4 overflow-x-auto text-xs border-b border-transparent">
            <button
              onClick={() => setActiveTab('evidence')}
              className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${activeTab === 'evidence' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800'}`}
            >
              Matched Evidence ({standard.matchedClauses.length})
            </button>
            <button
              onClick={() => setActiveTab('scope')}
              className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${activeTab === 'scope' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800'}`}
            >
              Authoritative Scope
            </button>
            <button
              onClick={() => setActiveTab('compliance')}
              className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${activeTab === 'compliance' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800'}`}
            >
              QCO Statutory Status
            </button>
            <button
              onClick={() => setActiveTab('related')}
              className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${activeTab === 'related' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800'}`}
            >
              Normative References ({standard.relatedStandards.length})
            </button>
            <button
              onClick={() => setActiveTab('amendments')}
              className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${activeTab === 'amendments' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800'}`}
            >
              Amendments ({standard.amendments.length})
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
          
          {/* TAB 1: Matched Evidence */}
          {activeTab === 'evidence' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#1f1f1f] border border-slate-200 dark:border-[#2a2a2a] text-xs text-slate-700 dark:text-slate-300">
                <strong className="text-slate-900 dark:text-white block mb-0.5">Matching Rationale:</strong>
                {standard.explanation}
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Clausal Mapping to Requirement Specifications
                </h4>

                {standard.matchedClauses.map((clause, idx) => (
                  <div 
                    key={idx}
                    className="p-4 rounded-xl border border-slate-200 dark:border-[#282828] bg-white dark:bg-[#1a1a1a] space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded">
                          {clause.clauseNumber}
                        </span>
                        <span className="font-semibold text-slate-800 dark:text-slate-100">
                          {clause.title}
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        {clause.matchDegree}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-slate-600 dark:text-slate-300">
                      <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#222222] border border-slate-100 dark:border-[#2e2e2e]">
                        <span className="text-[10px] text-slate-400 block mb-1 font-semibold uppercase">Extracted Parameter:</span>
                        {clause.requirementMatch}
                      </div>

                      <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#222222] border border-slate-100 dark:border-[#2e2e2e]">
                        <span className="text-[10px] text-slate-400 block mb-1 font-semibold uppercase">Authoritative Standard Clause:</span>
                        {clause.standardExcerpt}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: Scope & Provenance */}
          {activeTab === 'scope' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-[#282828] bg-white dark:bg-[#1a1a1a] space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-600" />
                  <span>Authoritative Scope & Field of Application</span>
                </h4>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-serif text-sm bg-slate-50 dark:bg-[#202020] p-3 rounded-lg border border-slate-100 dark:border-[#2a2a2a]">
                  "{standard.scopeExcerptAuthoritative}"
                </p>
                <p className="text-slate-500 dark:text-slate-400 text-xs">
                  Summary: {standard.scopeSummary}
                </p>
              </div>

              {/* Provenance & BIS Sectional Committee */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-[#282828] bg-slate-50 dark:bg-[#1a1a1a] space-y-2">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Landmark className="w-4 h-4 text-slate-600" />
                  <span>Data Provenance & Gazette Authenticity</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600 dark:text-slate-300">
                  <div>Issuing Authority: <strong className="text-slate-800 dark:text-slate-100">{standard.sourceProvenance.authority}</strong></div>
                  <div>Sectional Committee: <strong className="text-slate-800 dark:text-slate-100">{standard.sourceProvenance.bisSectionalCommittee}</strong></div>
                  <div>Gazette Ref: <strong className="text-slate-800 dark:text-slate-100">{standard.sourceProvenance.gazetteNotification || 'Official BIS Gazette'}</strong></div>
                  <div>Last Synced: <strong className="text-slate-800 dark:text-slate-100">{standard.sourceProvenance.lastSynced.slice(0, 10)}</strong></div>
                </div>
                <div className="pt-2">
                  <a
                    href={standard.sourceProvenance.portalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                  >
                    <span>Verify directly on official BIS Standards Portal (services.bis.gov.in)</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Compliance & QCO */}
          {activeTab === 'compliance' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-[#282828] bg-white dark:bg-[#1a1a1a] space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <span>Statutory Quality Control Order (QCO) Status</span>
                  </h4>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    standard.complianceInfo.qcoMandatory
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  }`}>
                    {standard.complianceInfo.qcoMandatory ? 'Mandatory ISI Mark' : 'Voluntary / Advisory'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#222222] border border-slate-200 dark:border-[#2f2f2f]">
                    <span className="text-slate-500 dark:text-slate-400 block mb-0.5">Statutory QCO Order:</span>
                    <strong className="text-slate-800 dark:text-slate-100">{standard.complianceInfo.qcoOrderNumber || 'Not subject to mandatory QCO'}</strong>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#222222] border border-slate-200 dark:border-[#2f2f2f]">
                    <span className="text-slate-500 dark:text-slate-400 block mb-0.5">Administering Ministry:</span>
                    <strong className="text-slate-800 dark:text-slate-100">{standard.complianceInfo.qcoMinistry || 'Bureau of Indian Standards'}</strong>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#222222] border border-slate-200 dark:border-[#2f2f2f]">
                    <span className="text-slate-500 dark:text-slate-400 block mb-0.5">Certification Scheme:</span>
                    <strong className="text-slate-800 dark:text-slate-100">{standard.complianceInfo.scheme}</strong>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#222222] border border-slate-200 dark:border-[#2f2f2f]">
                    <span className="text-slate-500 dark:text-slate-400 block mb-0.5">Effective Date:</span>
                    <strong className="text-slate-800 dark:text-slate-100">{standard.complianceInfo.effectiveDate || 'Consult BIS Gazette'}</strong>
                  </div>
                </div>

                {standard.complianceInfo.verificationNotes && (
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#222222] border border-slate-200 dark:border-[#2f2f2f] text-slate-700 dark:text-slate-300">
                    <span className="font-bold block mb-1">Procurement Legal Note:</span>
                    {standard.complianceInfo.verificationNotes}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: Related Standards & Interactive Normative Graph */}
          {activeTab === 'related' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                The following standards are normatively invoked in <strong>{standard.isNumber}</strong> for test methods, components, and raw materials. Click to inspect or add directly into your tender draft:
              </p>

              <div className="space-y-2.5">
                {standard.relatedStandards.map((rel, idx) => {
                  // Find full standard in STANDARDS_DATABASE if present
                  const matchedStd = STANDARDS_DATABASE.find(s => 
                    s.isNumber.replace(/\s+/g, '').toLowerCase() === rel.isNumber.replace(/\s+/g, '').toLowerCase() ||
                    rel.isNumber.includes(s.isNumber.split(' ')[1] || '---')
                  );
                  const isRelSelected = matchedStd ? selectedStandardIds.includes(matchedStd.id) : false;

                  return (
                    <div 
                      key={idx}
                      className="p-3.5 rounded-xl border border-slate-200 dark:border-[#282828] bg-slate-50/50 dark:bg-[#1a1a1a] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-900 dark:text-white">
                            {rel.isNumber}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 text-[11px] font-semibold">
                            {rel.relationship}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-[#252525] text-slate-700 dark:text-slate-300 text-[10px] font-medium">
                            {rel.importance}
                          </span>
                        </div>
                        <p className="font-medium text-slate-700 dark:text-slate-300 mt-1">
                          {rel.title}
                        </p>
                        {rel.notes && (
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 italic">
                            Note: {rel.notes}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {matchedStd && onNavigateToStandard && (
                          <button
                            type="button"
                            onClick={() => onNavigateToStandard(matchedStd)}
                            className="px-2.5 py-1 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#222222] hover:bg-slate-50 dark:hover:bg-[#282828] text-slate-700 dark:text-slate-200 text-xs font-medium flex items-center gap-1 transition cursor-pointer"
                          >
                            <BookOpen className="w-3 h-3 text-indigo-600" />
                            <span>Inspect</span>
                          </button>
                        )}

                        {matchedStd && (
                          <button
                            type="button"
                            onClick={() => onToggleSelect(matchedStd.id)}
                            className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1 transition cursor-pointer ${
                              isRelSelected 
                                ? 'bg-emerald-700 text-white' 
                                : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                            }`}
                          >
                            {isRelSelected ? <BookmarkCheck className="w-3 h-3" /> : <BookmarkPlus className="w-3 h-3" />}
                            <span>{isRelSelected ? 'In Draft' : 'Add'}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 5: Amendments Timeline */}
          {activeTab === 'amendments' && (
            <div className="space-y-3">
              {standard.amendments.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500">
                  No active amendments published for this edition.
                </div>
              ) : (
                <div className="relative border-l-2 border-slate-200 dark:border-slate-700 ml-4 pl-4 space-y-4 text-xs">
                  {standard.amendments.map((am, i) => (
                    <div key={i} className="relative">
                      <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-indigo-600 border-2 border-white dark:border-[#161616]"></div>
                      <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                        <span>{am.amendmentNumber}</span>
                        <span className="text-slate-400 font-normal font-mono">({am.date})</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 mt-1">
                        {am.summary}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-[#262626] bg-slate-50/50 dark:bg-[#1b1b1b] flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-mono">
            MANAK-AI Decision Support • SIH 2026 PS 26108
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
