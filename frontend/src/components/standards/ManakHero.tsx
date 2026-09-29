import React, { useState } from 'react';
import { 
  ArrowRight, 
  Search, 
  Sparkles, 
  Check, 
  FileText, 
  Plus, 
  Filter, 
  SlidersHorizontal, 
  BookmarkCheck, 
  BookmarkPlus,
  ShieldCheck, 
  ExternalLink,
  ChevronRight,
  BookOpen,
  Layers,
  Scale,
  Landmark,
  Building2,
  FileCheck2,
  History,
  AlertTriangle,
  Lightbulb,
  Zap
} from 'lucide-react';
import { StandardRecommendation } from '../../types/standards';
import { STANDARDS_DATABASE, SAMPLE_PROMPTS } from '../../services/standardsData';

interface ManakHeroProps {
  onStartAnalysis: (text?: string, department?: string, tenderRef?: string) => void;
  onOpenWorkspace: () => void;
  onOpenStandardDetail: (std: StandardRecommendation) => void;
  onOpenDraftTray: () => void;
  onOpenDirectory: () => void;
  onOpenHistory: () => void;
  selectedCount: number;
  onToggleSelectStandard: (id: string) => void;
  selectedStandardIds: string[];
}

export const ManakHero: React.FC<ManakHeroProps> = ({
  onStartAnalysis,
  onOpenWorkspace,
  onOpenStandardDetail,
  onOpenDraftTray,
  onOpenDirectory,
  onOpenHistory,
  selectedCount,
  onToggleSelectStandard,
  selectedStandardIds
}) => {
  const [queryInput, setQueryInput] = useState('');
  const [quickSearchTerm, setQuickSearchTerm] = useState('');
  const [selectedSampleId, setSelectedSampleId] = useState<string>('sample-transformers');

  // Interactive quick live-matched standard based on search term or query input
  const effectiveSearch = (quickSearchTerm || queryInput).toLowerCase().trim();
  const matchedQuickStandard = effectiveSearch 
    ? STANDARDS_DATABASE.find(s => 
        s.isNumber.toLowerCase().includes(effectiveSearch) ||
        s.title.toLowerCase().includes(effectiveSearch) ||
        s.explanation.toLowerCase().includes(effectiveSearch) ||
        s.category.toLowerCase().includes(effectiveSearch)
      ) || STANDARDS_DATABASE[0]
    : STANDARDS_DATABASE[0];

  const handleRunSample = (sampleId: string) => {
    const sample = SAMPLE_PROMPTS.find(s => s.id === sampleId);
    if (sample) {
      setSelectedSampleId(sampleId);
      onStartAnalysis(sample.text, sample.department, sample.tenderRef);
    }
  };

  const handleExecutePrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryInput.trim()) {
      onOpenWorkspace();
      return;
    }
    onStartAnalysis(queryInput.trim());
  };

  return (
    <div className="w-full bg-[#fdfdfc] dark:bg-[#121212] text-[#191919] dark:text-[#f7f7f5] transition-colors duration-200">
      
      {/* 1. TOP STATUTORY BANNER */}
      <div className="border-b border-[#ececeb] dark:border-[#222222] bg-[#f7f7f5] dark:bg-[#181818] py-2 px-4 text-center">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs text-[#55534e] dark:text-[#a8a7a3]">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-semibold text-slate-900 dark:text-white">भारत सरकार • Government of India</span>
            <span>|</span>
            <span>Bureau of Indian Standards (BIS) Decision Support</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 font-mono text-[11px] font-semibold">
              SIH 2026 PS 26108
            </span>
            <span className="hidden sm:inline">GFR 2017 Rule 144(i) Compliant</span>
          </div>
        </div>
      </div>

      {/* 2. HERO TITLE & CORE ACTION STATION */}
      <section className="relative pt-12 pb-14 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        
        {/* Pillar Badges */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f1f1ef] dark:bg-[#202020] border border-[#e0e0de] dark:border-[#2f2f2f] text-xs font-medium text-[#45433f] dark:text-[#b0afab] mb-6">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>AI-Powered Decision Support for Public Procurement Specifications</span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#191919] dark:text-white leading-[1.15]">
          Identify, Verify & Specify <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-800 dark:from-white dark:via-indigo-200 dark:to-slate-300 bg-clip-text text-transparent">
            Indian Standards (IS)
          </span> for Tenders
        </h1>

        <p className="mt-4 text-base sm:text-lg text-[#666460] dark:text-[#a09f9a] max-w-3xl mx-auto font-normal leading-relaxed">
          Bridge natural language procurement requirements with <strong>22,000+ Bureau of Indian Standards (IS)</strong>, mandatory Quality Control Orders (QCO), and statutory GFR 2017 Rule 144(i) clauses for GeM and CPPP tenders.
        </p>

        {/* Quick Launch Buttons */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => onOpenWorkspace()}
            className="px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-slate-200 dark:text-slate-900 font-semibold text-sm transition shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <span>Open Specification Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onOpenDirectory()}
            className="px-4 py-2.5 rounded-lg border border-[#d8d8d5] dark:border-[#333333] hover:bg-[#f5f5f3] dark:hover:bg-[#1f1f1f] text-[#33322e] dark:text-[#ebebeb] text-sm font-medium transition flex items-center gap-2 cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Search Standards Directory (22,000+)</span>
          </button>

          {selectedCount > 0 && (
            <button
              onClick={() => onOpenDraftTray()}
              className="px-4 py-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 text-indigo-800 dark:text-indigo-300 text-sm font-semibold transition flex items-center gap-1.5 cursor-pointer"
            >
              <BookmarkCheck className="w-4 h-4" />
              <span>Draft Tender Spec ({selectedCount})</span>
            </button>
          )}
        </div>

        {/* 3. INTERACTIVE AI SPECIFICATION PROMPT BOX */}
        <div className="mt-10 max-w-3xl mx-auto bg-white dark:bg-[#1a1a1a] rounded-xl border border-[#e4e4e1] dark:border-[#2b2b2b] shadow-md p-4 sm:p-5 text-left transition-all">
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              Instant Specification Analyzer & Standard Matcher
            </span>
            <span className="text-[11px] text-slate-500 font-mono">NLP Parameter Extraction</span>
          </div>

          <form onSubmit={handleExecutePrompt} className="relative">
            <textarea
              rows={3}
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              placeholder="e.g. 500 kVA 11/0.433 kV outdoor oil-immersed distribution transformer with copper winding and Level 2 energy losses under Ministry of Power QCO..."
              className="w-full p-3 text-sm rounded-lg bg-[#fafafa] dark:bg-[#222222] border border-[#dcdcd9] dark:border-[#383838] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none font-sans"
            />

            <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <span>Or test tender templates:</span>
              </div>

              <button
                type="submit"
                className="px-4 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-xs cursor-pointer ml-auto"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Analyze with MANAK-AI</span>
              </button>
            </div>
          </form>

          {/* Quick Clickable Sample Chips */}
          <div className="mt-3 pt-3 border-t border-[#f0f0ed] dark:border-[#282828] flex flex-wrap gap-1.5">
            {SAMPLE_PROMPTS.map((sample) => (
              <button
                key={sample.id}
                type="button"
                onClick={() => handleRunSample(sample.id)}
                className={`text-[11px] px-2.5 py-1 rounded-md border transition cursor-pointer flex items-center gap-1 ${
                  selectedSampleId === sample.id
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-900 dark:border-white font-medium'
                    : 'bg-[#f7f7f5] dark:bg-[#242424] text-slate-700 dark:text-slate-300 border-[#e5e5e2] dark:border-[#333333] hover:border-slate-400'
                }`}
              >
                <span>{sample.id === 'sample-transformers' ? '⚡' : sample.id === 'sample-hdpe-pipes' ? '💧' : sample.id === 'sample-tmt-rebars' ? '🏗️' : sample.id === 'sample-solar-pv' ? '☀️' : sample.id === 'sample-fire-doors' ? '🧯' : '🥛'}</span>
                <span>{sample.title.split('(')[0].trim()}</span>
              </button>
            ))}
          </div>
        </div>

      </section>

      {/* 4. REAL-TIME IS STANDARDS QUICK LOOKUP TOOL (Interactive Verifier) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <div className="p-5 sm:p-6 rounded-xl border border-[#e4e4e1] dark:border-[#2b2b2b] bg-white dark:bg-[#161616] shadow-xs">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#f0f0ed] dark:border-[#262626]">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Search className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Instant Indian Standards Verifier</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Type an IS code, material, or item name to check active certification status, QCO statutory order, and normative references.
              </p>
            </div>

            {/* Quick Filter Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={quickSearchTerm}
                onChange={(e) => setQuickSearchTerm(e.target.value)}
                placeholder="Search IS 1180, pipe, rebar, solar..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-md bg-[#f7f7f5] dark:bg-[#202020] border border-[#dcdcd9] dark:border-[#333333] text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans"
              />
            </div>
          </div>

          {/* Quick Result Showcase Card */}
          {matchedQuickStandard && (
            <div className="mt-4 p-4 rounded-lg bg-[#fafaf8] dark:bg-[#1e1e1e] border border-[#e8e8e5] dark:border-[#2c2c2c] flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    {matchedQuickStandard.isNumber}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                    matchedQuickStandard.complianceInfo.qcoMandatory
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                  }`}>
                    {matchedQuickStandard.complianceInfo.qcoMandatory ? 'Mandatory QCO (ISI Mark)' : 'Voluntary Standard'}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    Edition {matchedQuickStandard.editionYear}
                  </span>
                </div>

                <h3 className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 leading-snug">
                  {matchedQuickStandard.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                  {matchedQuickStandard.explanation}
                </p>

                {matchedQuickStandard.complianceInfo.qcoOrderNumber && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 font-mono">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>Statutory Order: {matchedQuickStandard.complianceInfo.qcoOrderNumber}</span>
                  </p>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex md:flex-col items-center sm:items-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => onOpenStandardDetail(matchedQuickStandard)}
                  className="px-3 py-1.5 rounded-md border border-[#d0d0cc] dark:border-[#383838] bg-white dark:bg-[#252525] hover:bg-[#f0f0ed] dark:hover:bg-[#2f2f2f] text-xs font-medium text-slate-800 dark:text-slate-200 transition flex items-center gap-1.5 cursor-pointer w-full justify-center"
                >
                  <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Inspect Normative Graph</span>
                </button>

                <button
                  type="button"
                  onClick={() => onToggleSelectStandard(matchedQuickStandard.id)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer w-full justify-center ${
                    selectedStandardIds.includes(matchedQuickStandard.id)
                      ? 'bg-emerald-700 text-white hover:bg-emerald-800'
                      : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800'
                  }`}
                >
                  {selectedStandardIds.includes(matchedQuickStandard.id) ? (
                    <>
                      <BookmarkCheck className="w-3.5 h-3.5" />
                      <span>Added to Draft</span>
                    </>
                  ) : (
                    <>
                      <BookmarkPlus className="w-3.5 h-3.5" />
                      <span>Add to Draft Spec</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* 5. INTERCONNECTED 4-STAGE ARCHITECTURE PIPELINE */}
      <section className="border-t border-[#ececeb] dark:border-[#222222] bg-[#fbfbf9] dark:bg-[#151515] py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              End-to-End Procurement Workflow
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2">
              Every stage interconnects directly—from raw technical clause inputs to verified IS citations ready for GeM or CPPP NIT publications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            {/* Step 1 */}
            <div 
              onClick={() => onOpenWorkspace()}
              className="p-5 rounded-xl border border-[#e4e4e1] dark:border-[#2b2b2b] bg-white dark:bg-[#1c1c1c] hover:border-indigo-400 transition cursor-pointer shadow-xs flex flex-col justify-between group"
            >
              <div>
                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-xs mb-3 font-mono">
                  01
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition">
                  Specification Entry
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  Enter natural text or attach PDF/DOCX schedules. Supports English and हिंदी procurement documents.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#f0f0ed] dark:border-[#262626] flex items-center justify-between text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                <span>Enter Spec</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Step 2 */}
            <div 
              onClick={() => onOpenWorkspace()}
              className="p-5 rounded-xl border border-[#e4e4e1] dark:border-[#2b2b2b] bg-white dark:bg-[#1c1c1c] hover:border-indigo-400 transition cursor-pointer shadow-xs flex flex-col justify-between group"
            >
              <div>
                <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold text-xs mb-3 font-mono">
                  02
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition">
                  Officer Review
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  Review and refine AI-extracted technical parameters, ratings, test protocols, and materials before matching.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#f0f0ed] dark:border-[#262626] flex items-center justify-between text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                <span>Verify Matrix</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Step 3 */}
            <div 
              onClick={() => onOpenDirectory()}
              className="p-5 rounded-xl border border-[#e4e4e1] dark:border-[#2b2b2b] bg-white dark:bg-[#1c1c1c] hover:border-indigo-400 transition cursor-pointer shadow-xs flex flex-col justify-between group"
            >
              <div>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-xs mb-3 font-mono">
                  03
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition">
                  Ranked IS Match
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  Traverses 22,000+ Indian Standards graph with BM25 lexical + semantic scoring and QCO statutory compliance.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#f0f0ed] dark:border-[#262626] flex items-center justify-between text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                <span>Browse Standards</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Step 4 */}
            <div 
              onClick={() => onOpenDraftTray()}
              className="p-5 rounded-xl border border-[#e4e4e1] dark:border-[#2b2b2b] bg-white dark:bg-[#1c1c1c] hover:border-indigo-400 transition cursor-pointer shadow-xs flex flex-col justify-between group"
            >
              <div>
                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-xs mb-3 font-mono">
                  04
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition">
                  Tender Clause Export
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  Auto-compiles Section IV Special Conditions of Contract with mandatory test clauses under GFR Rule 144(i).
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#f0f0ed] dark:border-[#262626] flex items-center justify-between text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                <span>Export Draft Spec</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 6. STATUTORY GUIDANCE & GFR 2017 CALLOUT */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="p-4 sm:p-5 rounded-xl bg-slate-100 dark:bg-[#1b1b1b] border border-slate-200 dark:border-[#2c2c2c] flex items-start gap-3.5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
          <div className="p-2 rounded-lg bg-white dark:bg-[#252525] border border-slate-300 dark:border-[#383838] text-slate-800 dark:text-slate-200 shrink-0">
            <Scale className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="space-y-1">
            <strong className="text-slate-900 dark:text-white font-semibold">
              Mandatory Statutory Requirement — GFR 2017 Rule 144(i):
            </strong>
            <p>
              "The technical specifications should, to the extent practicable, be based on the national standards published by the Bureau of Indian Standards (BIS) wherever available." MANAK-AI serves as an official decision support engine to ensure all public tenders strictly conform to mandatory Quality Control Orders (QCO) and prevent vendor lock-in.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};
