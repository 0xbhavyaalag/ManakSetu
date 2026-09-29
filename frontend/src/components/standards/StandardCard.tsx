import React, { useState } from 'react';
import { 
  StandardRecommendation, 
  ComplianceScheme,
  RelationshipType 
} from '../../types/standards';
import { 
  ShieldCheck, 
  AlertTriangle, 
  FileText, 
  ChevronRight, 
  Copy, 
  Check, 
  ThumbsUp, 
  ThumbsDown, 
  Flag, 
  Layers, 
  ExternalLink,
  BookOpen
} from 'lucide-react';

interface StandardCardProps {
  standard: StandardRecommendation;
  rank: number;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onOpenDetail: (standard: StandardRecommendation) => void;
  onFeedback: (standardId: string, status: 'relevant' | 'not_relevant' | 'needs_correction') => void;
}

export const StandardCard: React.FC<StandardCardProps> = ({
  standard,
  rank,
  isSelected,
  onToggleSelect,
  onOpenDetail,
  onFeedback
}) => {
  const [copied, setCopied] = useState(false);
  const [feedbackState, setFeedbackState] = useState<'relevant' | 'not_relevant' | 'needs_correction' | undefined>(
    standard.userFeedback?.status
  );

  const handleCopyIS = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(standard.isNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFeedbackClick = (e: React.MouseEvent, status: 'relevant' | 'not_relevant' | 'needs_correction') => {
    e.stopPropagation();
    setFeedbackState(status);
    onFeedback(standard.id, status);
  };

  const getCompliancePill = (scheme: ComplianceScheme, mandatory: boolean, status: string) => {
    if (status === 'Verification Needed') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-[#fbf3db] text-[#8f6312] dark:bg-[#382f1b] dark:text-[#cca047]">
          <span>Verification Needed</span>
        </span>
      );
    }
    if (mandatory) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-[#ddedea] text-[#0f7b6c] dark:bg-[#1a3833] dark:text-[#4dab9b]">
          <span>Mandatory QCO (ISI Mark)</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-[#e0e9f6] text-[#285d99] dark:bg-[#1f2f45] dark:text-[#6a9bcc]">
        <span>Voluntary Standard</span>
      </span>
    );
  };

  return (
    <div 
      className={`rounded-md border p-4 sm:p-5 transition bg-white dark:bg-[#202020] text-[#37352f] dark:text-[#ebebeb] ${
        isSelected 
          ? 'border-[#2383e2] ring-1 ring-[#2383e2]/30' 
          : 'border-[#e8e8e6] dark:border-[#2e2e2e] hover:border-[#d0d0ce] dark:hover:border-[#3d3d3d]'
      }`}
    >
      {/* Top Header: IS Code, Title, Rank & Selection Checkbox */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex items-center justify-center w-6 h-6 rounded bg-[#f1f1ef] dark:bg-[#2a2a2a] text-[#787774] dark:text-[#9b9b9b] text-xs font-mono font-medium shrink-0 mt-0.5">
            {rank}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-sm sm:text-base text-[#191919] dark:text-white font-mono">
                {standard.isNumber}
              </span>
              <button
                onClick={handleCopyIS}
                className="p-1 text-[#9b9b9b] hover:text-[#37352f] dark:hover:text-white rounded transition"
                title="Copy standard code"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#0f7b6c]" /> : <Copy className="w-3.5 h-3.5" />}
              </button>

              {getCompliancePill(
                standard.complianceInfo.scheme, 
                standard.complianceInfo.qcoMandatory, 
                standard.complianceInfo.verificationStatus
              )}

              <span className="text-[11px] px-1.5 py-0.2 rounded bg-[#f1f1ef] dark:bg-[#2a2a2a] text-[#787774] font-mono">
                {standard.status}
              </span>
            </div>

            <h3 className="text-xs sm:text-sm font-semibold text-[#191919] dark:text-[#f7f7f5] mt-1 leading-snug">
              {standard.title}
            </h3>

            <p className="text-[11px] text-[#787774] dark:text-[#9b9b9b] mt-0.5">
              Committee: {standard.sourceProvenance.bisSectionalCommittee} • Checked: {standard.lastCheckedDate}
            </p>
          </div>
        </div>

        {/* Right side: Score & Selection */}
        <div className="flex items-center sm:items-end flex-row sm:flex-col justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-[#f1f1ef] dark:bg-[#2b2b2b] text-[#37352f] dark:text-[#ebebeb]">
              {standard.relevanceScore}% Fit
            </span>

            <label className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#f7f7f5] dark:bg-[#262626] hover:bg-[#efefed] dark:hover:bg-[#303030] border border-[#e8e8e6] dark:border-[#333333] cursor-pointer text-xs font-medium transition">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onToggleSelect(standard.id)}
                className="w-3.5 h-3.5 rounded text-[#2383e2] cursor-pointer"
              />
              <span>{isSelected ? 'In Draft' : 'Select'}</span>
            </label>
          </div>

          <span className="text-[10px] text-[#9b9b9b] font-mono hidden sm:inline">
            Ranking Aid
          </span>
        </div>
      </div>

      {/* Matching Rationale Callout block */}
      <div className="mt-3 p-3 rounded-md bg-[#fafaf9] dark:bg-[#242424] border border-[#ebebeb] dark:border-[#2f2f2f] text-xs space-y-1.5">
        <p className="text-[#37352f] dark:text-[#d4d4d4] leading-relaxed">
          {standard.explanation}
        </p>

        {standard.matchedClauses.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] text-[#787774]">
            <span>Clauses:</span>
            {standard.matchedClauses.slice(0, 3).map((cl, i) => (
              <span key={i} className="px-1.5 py-0.2 rounded bg-white dark:bg-[#1a1a1a] border border-[#e8e8e6] dark:border-[#333333] font-mono text-[#37352f] dark:text-[#d4d4d4]">
                {cl.clauseNumber}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Normative References */}
      {standard.relatedStandards.length > 0 && (
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-xs text-[#787774]">
          <span className="text-[11px] font-medium">Allied:</span>
          {standard.relatedStandards.slice(0, 3).map((rel, idx) => (
            <span 
              key={idx}
              className="px-1.5 py-0.5 rounded bg-[#f1f1ef] dark:bg-[#2a2a2a] text-[#5a5a58] dark:text-[#a0a0a0] text-[10px] font-mono"
            >
              {rel.isNumber.split(':')[0].trim()} ({rel.relationship.split(' ')[0]})
            </span>
          ))}
        </div>
      )}

      {/* Card Footer: Detail Link & Feedback */}
      <div className="mt-3 pt-2.5 border-t border-[#f0f0ee] dark:border-[#2b2b2b] flex flex-wrap items-center justify-between gap-3 text-xs">
        
        <button
          onClick={() => onOpenDetail(standard)}
          className="text-xs font-medium text-[#2383e2] hover:underline flex items-center gap-1"
        >
          <span>Inspect scope & clause mapping</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        {/* Lightweight feedback */}
        <div className="flex items-center gap-1 text-[#9b9b9b]">
          <button
            onClick={(e) => handleFeedbackClick(e, 'relevant')}
            className={`p-1 rounded hover:bg-[#f1f1ef] dark:hover:bg-[#2c2c2c] transition ${
              feedbackState === 'relevant' ? 'text-[#0f7b6c] font-bold' : ''
            }`}
            title="Applicable"
          >
            <ThumbsUp className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => handleFeedbackClick(e, 'not_relevant')}
            className={`p-1 rounded hover:bg-[#f1f1ef] dark:hover:bg-[#2c2c2c] transition ${
              feedbackState === 'not_relevant' ? 'text-[#eb5757] font-bold' : ''
            }`}
            title="Not Applicable"
          >
            <ThumbsDown className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => handleFeedbackClick(e, 'needs_correction')}
            className={`p-1 rounded hover:bg-[#f1f1ef] dark:hover:bg-[#2c2c2c] transition ${
              feedbackState === 'needs_correction' ? 'text-[#d9730d] font-bold' : ''
            }`}
            title="Needs Correction"
          >
            <Flag className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
