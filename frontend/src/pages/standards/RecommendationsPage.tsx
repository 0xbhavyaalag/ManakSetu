import React, { useState } from 'react';
import { 
  StandardRecommendation, 
  ExtractedRequirements, 
  ProcurementAnalysis 
} from '../../types/standards';
import { StandardCard } from '../../components/standards/StandardCard';
import { 
  Search, 
  BookmarkCheck, 
  ArrowLeft, 
  Edit3, 
  Download, 
  Scale, 
  Building2, 
  Info,
  Filter,
  Check
} from 'lucide-react';

interface RecommendationsPageProps {
  analysis: ProcurementAnalysis;
  onReviseRequirements: () => void;
  onOpenDraftTray: () => void;
  onOpenDetailModal: (standard: StandardRecommendation) => void;
  onOpenFeedbackModal: (standard: StandardRecommendation, status: 'relevant' | 'not_relevant' | 'needs_correction') => void;
  onToggleSelectStandard: (id: string) => void;
  selectedStandardIds: string[];
}

export const RecommendationsPage: React.FC<RecommendationsPageProps> = ({
  analysis,
  onReviseRequirements,
  onOpenDraftTray,
  onOpenDetailModal,
  onOpenFeedbackModal,
  onToggleSelectStandard,
  selectedStandardIds
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCompliance, setFilterCompliance] = useState<'all' | 'mandatory' | 'voluntary' | 'verification_needed'>('all');
  const [minScore, setMinScore] = useState<number>(0);

  const recommendations = analysis.recommendations || [];

  const filtered = recommendations.filter(std => {
    const matchesSearch = 
      std.isNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      std.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      std.explanation.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesCompliance = true;
    if (filterCompliance === 'mandatory') matchesCompliance = std.complianceInfo.qcoMandatory;
    if (filterCompliance === 'voluntary') matchesCompliance = !std.complianceInfo.qcoMandatory && std.complianceInfo.verificationStatus !== 'Verification Needed';
    if (filterCompliance === 'verification_needed') matchesCompliance = std.complianceInfo.verificationStatus === 'Verification Needed';

    const matchesScore = std.relevanceScore >= minScore;

    return matchesSearch && matchesCompliance && matchesScore;
  });

  const selectedCount = selectedStandardIds.length;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in py-4 pb-28 text-[#37352f] dark:text-[#ebebeb]">
      
      {/* MANAK-AI Results Header */}
      <div className="space-y-3">
        <div className="w-12 h-12 flex items-center justify-center text-3xl select-none cursor-default">
          📊
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#191919] dark:text-[#f7f7f5]">
              Ranked Indian Standards
            </h1>
            <p className="text-xs text-[#787774] dark:text-[#9b9b9b] mt-0.5">
              {analysis.tenderReference} • {analysis.department}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onReviseRequirements}
              className="px-3 py-1.5 rounded-md border border-[#e8e8e6] dark:border-[#2e2e2e] hover:bg-[#f7f7f5] dark:hover:bg-[#262626] text-xs font-medium text-[#37352f] dark:text-[#ebebeb] flex items-center gap-1.5 transition"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Parameters</span>
            </button>

            <button
              onClick={onOpenDraftTray}
              className="px-3 py-1.5 rounded-md bg-[#191919] hover:bg-[#2f2f2f] text-white dark:bg-[#f7f7f5] dark:hover:bg-[#e6e6e4] dark:text-[#191919] text-xs font-medium flex items-center gap-1.5 transition shadow-2xs"
            >
              <BookmarkCheck className="w-3.5 h-3.5" />
              <span>Draft Spec ({selectedCount})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Statutory Guidance: Decision Support Notice */}
      <div className="p-3.5 rounded-md bg-[#f7f7f5] dark:bg-[#202020] border border-[#e8e8e6] dark:border-[#2e2e2e] flex items-start gap-2.5 text-xs leading-relaxed text-[#787774] dark:text-[#9b9b9b]">
        <span className="text-sm select-none">💡</span>
        <div>
          <strong className="text-[#191919] dark:text-white font-semibold">
            Decision Support Notice:
          </strong>{' '}
          Relevance scores represent internal ranking aids to assist technical specification drafting under GFR 2017 Rule 144(i). Procuring officials must verify current gazette status and active Quality Control Orders (QCO) on the official BIS portal (services.bis.gov.in) before tender publication.
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs border-b border-[#e8e8e6] dark:border-[#2e2e2e] pb-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-[#9b9b9b] absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search standards by IS code or keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-md bg-[#fafaf9] dark:bg-[#202020] border border-[#e8e8e6] dark:border-[#2e2e2e] text-[#191919] dark:text-[#ebebeb] placeholder-[#9b9b9b] focus:border-[#2383e2] focus:outline-hidden transition"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <select
            value={filterCompliance}
            onChange={(e) => setFilterCompliance(e.target.value as any)}
            className="px-2.5 py-1.5 rounded-md bg-transparent border border-[#e8e8e6] dark:border-[#2e2e2e] hover:bg-[#f7f7f5] dark:hover:bg-[#242424] text-[#37352f] dark:text-[#ebebeb] text-xs outline-hidden cursor-pointer"
          >
            <option value="all">All Compliance Statuses</option>
            <option value="mandatory">Mandatory QCO (ISI Mark)</option>
            <option value="voluntary">Voluntary Standards</option>
            <option value="verification_needed">Verification Needed</option>
          </select>

          <select
            value={minScore}
            onChange={(e) => setMinScore(Number(e.target.value))}
            className="px-2.5 py-1.5 rounded-md bg-transparent border border-[#e8e8e6] dark:border-[#2e2e2e] hover:bg-[#f7f7f5] dark:hover:bg-[#242424] text-[#37352f] dark:text-[#ebebeb] text-xs outline-hidden cursor-pointer"
          >
            <option value={0}>All Scores</option>
            <option value={90}>&gt;= 90% Fit</option>
            <option value={80}>&gt;= 80% Fit</option>
          </select>

          {(searchTerm || filterCompliance !== 'all' || minScore > 0) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterCompliance('all');
                setMinScore(0);
              }}
              className="text-[#eb5757] hover:underline px-1 text-xs"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Cards List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#787774]">
            No standards match your filter criteria.
          </div>
        ) : (
          filtered.map((std, idx) => (
            <StandardCard
              key={std.id}
              standard={std}
              rank={idx + 1}
              isSelected={selectedStandardIds.includes(std.id)}
              onToggleSelect={onToggleSelectStandard}
              onOpenDetail={onOpenDetailModal}
              onFeedback={(stdId, status) => {
                const s = recommendations.find(r => r.id === stdId);
                if (s) onOpenFeedbackModal(s, status);
              }}
            />
          ))
        )}
      </div>

      {/* Floating Action Tray */}
      {selectedCount > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-lg bg-[#191919] dark:bg-[#262626] text-white rounded-lg p-3 shadow-lg border border-black/10 dark:border-white/10 flex items-center justify-between gap-4 animate-slide-up text-xs">
          <div className="flex items-center gap-2.5">
            <span className="w-5 h-5 rounded-full bg-[#2383e2] text-white flex items-center justify-center font-bold text-[11px]">
              {selectedCount}
            </span>
            <span className="font-medium text-[#ebebeb]">
              {selectedCount} Standard{selectedCount !== 1 ? 's' : ''} in Draft
            </span>
          </div>

          <button
            onClick={onOpenDraftTray}
            className="px-3 py-1.5 rounded-md bg-[#2383e2] hover:bg-[#1a73e8] text-white font-medium transition flex items-center gap-1.5"
          >
            <span>View Tender Clause</span>
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

    </div>
  );
};
