import React, { useState, useEffect } from 'react';
import { 
  ProcurementAnalysis, 
  ExtractedRequirements, 
  StandardRecommendation, 
  InputLanguage 
} from '../../types/standards';
import { 
  StandardsRecommendationEngine, 
  ExtractionProgressUpdate 
} from '../../services/standardsEngine';
import { 
  INITIAL_ANALYSES_HISTORY, 
  STANDARDS_DATABASE 
} from '../../services/standardsData';
import { ManakNavbar } from '../../components/standards/ManakNavbar';
import { ManakHero } from '../../components/standards/ManakHero';
import { WorkspacePage } from './WorkspacePage';
import { ExtractedRequirementsReview } from '../../components/standards/ExtractedRequirementsReview';
import { RecommendationsPage } from './RecommendationsPage';
import { ProcessingModal } from '../../components/standards/ProcessingModal';
import { StandardDetailModal } from '../../components/standards/StandardDetailModal';
import { DraftTenderDrawer } from '../../components/standards/DraftTenderDrawer';
import { FeedbackModal } from '../../components/standards/FeedbackModal';
import { StandardsDirectoryModal } from '../../components/standards/StandardsDirectoryModal';
import { AnalysisHistoryModal } from '../../components/standards/AnalysisHistoryModal';
import { AppTheme } from '../../components/Navbar';

interface StandardsProcurementAppProps {
  onSwitchToAgro?: () => void;
}

export const StandardsProcurementApp: React.FC<StandardsProcurementAppProps> = ({
  onSwitchToAgro
}) => {
  // Lighting & Theme mode
  const [theme, setTheme] = useState<AppTheme>(() => {
    return (localStorage.getItem('annadhara_theme') as AppTheme) || 'daylight';
  });

  const handleThemeChange = (newTheme: AppTheme) => {
    setTheme(newTheme);
    localStorage.setItem('annadhara_theme', newTheme);
  };

  // Language: 'en' | 'hi'
  const [language, setLanguage] = useState<'en' | 'hi'>('en');

  // Active Screen: 'hero' | 'workspace' | 'review' | 'results'
  const [activeScreen, setActiveScreen] = useState<'hero' | 'workspace' | 'review' | 'results'>('hero');

  // Saved Analyses History
  const [analysesHistory, setAnalysesHistory] = useState<ProcurementAnalysis[]>(() => {
    const saved = StandardsRecommendationEngine.getSavedAnalyses();
    return saved.length > 0 ? saved : INITIAL_ANALYSES_HISTORY;
  });

  // Active Current Analysis State
  const [currentAnalysis, setCurrentAnalysis] = useState<ProcurementAnalysis>(analysesHistory[0]);

  // Temporary extracted requirements awaiting officer review
  const [pendingRequirements, setPendingRequirements] = useState<ExtractedRequirements | null>(null);

  // Selected Standards for Draft Spec
  const [selectedStandardIds, setSelectedStandardIds] = useState<string[]>(
    currentAnalysis.selectedStandardIds || ['IS-1180-1-2014', 'IS-335-2018']
  );

  // Modals & Drawers
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState<ExtractionProgressUpdate | null>(null);

  const [detailStandard, setDetailStandard] = useState<StandardRecommendation | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [isDraftTrayOpen, setIsDraftTrayOpen] = useState(false);
  const [isDirectoryOpen, setIsDirectoryOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const [feedbackStandard, setFeedbackStandard] = useState<StandardRecommendation | null>(null);
  const [feedbackInitialStatus, setFeedbackInitialStatus] = useState<'relevant' | 'not_relevant' | 'needs_correction'>('relevant');
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  // Sync selected standards to analysis
  const handleToggleSelectStandard = (id: string) => {
    setSelectedStandardIds(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      setCurrentAnalysis(curr => {
        const updated = { ...curr, selectedStandardIds: next };
        StandardsRecommendationEngine.saveAnalysis(updated);
        return updated;
      });
      return next;
    });
  };

  // Step 1 -> Step 2: Ingest & Extract
  const handleStartAnalysis = async (input: {
    text: string;
    language?: InputLanguage;
    department?: string;
    tenderRef?: string;
    uploadedFile?: { name: string; size: string; pageCount: number };
  }) => {
    setIsProcessing(true);
    setProcessingProgress(null);

    const effectiveLang = input.language || language || 'en';
    const effectiveDept = input.department || 'Central Public Procurement Entity';
    const effectiveTenderRef = input.tenderRef || `NIT/CPWD/EE-ED-I/2026/${Math.floor(100 + Math.random() * 900)}`;

    try {
      const extracted = await StandardsRecommendationEngine.extractWithProgress(
        input.text,
        effectiveLang,
        input.uploadedFile?.name,
        (p) => setProcessingProgress(p)
      );

      setPendingRequirements(extracted);

      // Create new draft analysis object
      const newAnalysis: ProcurementAnalysis = {
        id: `ANALYSIS-${Date.now()}`,
        title: `${extracted.productName} Procurement Specification`,
        department: effectiveDept,
        tenderReference: effectiveTenderRef,
        inputText: input.text,
        inputLanguage: effectiveLang,
        uploadedDocument: input.uploadedFile ? {
          ...input.uploadedFile,
          uploadDate: new Date().toISOString().slice(0, 16).replace('T', ' ')
        } : undefined,
        extractedRequirements: extracted,
        recommendations: [],
        selectedStandardIds: [],
        status: 'extracted',
        createdAt: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        lastModifiedAt: new Date().toLocaleDateString('en-IN')
      };

      setCurrentAnalysis(newAnalysis);
      setIsProcessing(false);
      setActiveScreen('review');
    } catch (e) {
      console.error('Extraction error:', e);
      setIsProcessing(false);
    }
  };

  // Step 3 -> Step 4: Confirm Requirements and Generate Recommendations
  const handleConfirmRequirements = async (updatedReqs: ExtractedRequirements) => {
    setIsProcessing(true);
    setProcessingProgress({
      stage: 3,
      stageName: 'Vector Match & Normative Graph Traversal',
      detail: 'Scanning 22,000+ Indian Standards catalog and active Quality Control Orders...',
      percentage: 60
    });

    try {
      const recs = await StandardsRecommendationEngine.recommendStandards(updatedReqs);

      // Automatically select top 2 recommendations if none selected
      const autoSelected = recs.slice(0, 2).map(r => r.id);

      const finalized: ProcurementAnalysis = {
        ...currentAnalysis,
        extractedRequirements: updatedReqs,
        recommendations: recs,
        selectedStandardIds: autoSelected,
        status: 'completed',
        lastModifiedAt: new Date().toLocaleDateString('en-IN')
      };

      setCurrentAnalysis(finalized);
      setSelectedStandardIds(autoSelected);
      StandardsRecommendationEngine.saveAnalysis(finalized);

      setAnalysesHistory(prev => [finalized, ...prev.filter(a => a.id !== finalized.id)]);

      setIsProcessing(false);
      setActiveScreen('results');
    } catch (e) {
      console.error('Recommendation generation error:', e);
      setIsProcessing(false);
    }
  };

  // Handle Loading a Saved Analysis
  const handleSelectSavedAnalysis = (saved: ProcurementAnalysis) => {
    setCurrentAnalysis(saved);
    setSelectedStandardIds(saved.selectedStandardIds || []);
    setActiveScreen('results');
  };

  // Open Standard Detail Modal
  const handleOpenDetailModal = (standard: StandardRecommendation) => {
    setDetailStandard(standard);
    setIsDetailOpen(true);
  };

  // Open Feedback Modal
  const handleOpenFeedbackModal = (standard: StandardRecommendation, status: 'relevant' | 'not_relevant' | 'needs_correction') => {
    setFeedbackStandard(standard);
    setFeedbackInitialStatus(status);
    setIsFeedbackOpen(true);
  };

  // Submit Feedback
  const handleSubmitFeedback = (isId: string, status: 'relevant' | 'not_relevant' | 'needs_correction', note: string) => {
    StandardsRecommendationEngine.saveFeedback(isId, status, note);
    setCurrentAnalysis(curr => ({
      ...curr,
      recommendations: curr.recommendations.map(r => 
        r.id === isId ? { ...r, userFeedback: { status, note, timestamp: new Date().toISOString() } } : r
      )
    }));
  };

  // Selected recommendations objects for the draft tray
  const selectedStandardsObjects = STANDARDS_DATABASE.filter(r => 
    selectedStandardIds.includes(r.id)
  );

  return (
    <div className={`min-h-screen theme-${theme} flex flex-col font-sans transition-colors duration-200 ${
      theme === 'dark' 
        ? 'bg-[#121212] text-[#ebebeb]' 
        : theme === 'eye-comfort' 
        ? 'bg-[#fbf9f4] text-[#2e2a25]' 
        : 'bg-[#ffffff] text-[#37352f]'
    }`}>

      {/* Global MANAK-AI Navigation Bar */}
      <ManakNavbar
        activeScreen={activeScreen}
        onNavigateScreen={(screen) => setActiveScreen(screen)}
        selectedCount={selectedStandardIds.length}
        onOpenDraftTray={() => setIsDraftTrayOpen(true)}
        onOpenDirectory={() => setIsDirectoryOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        theme={theme}
        onThemeChange={handleThemeChange}
        language={language}
        onLanguageChange={setLanguage}
        onSwitchToAgro={onSwitchToAgro}
      />

      {/* Main Screen Content */}
      {activeScreen === 'hero' && (
        <ManakHero
          onStartAnalysis={(promptText, dept, ref) => {
            if (promptText) {
              handleStartAnalysis({
                text: promptText,
                language: language,
                department: dept || 'Central Public Works Department (CPWD)',
                tenderRef: ref || `NIT/CPWD/EE-ED-I/2026/${Math.floor(1000 + Math.random() * 9000)}`
              });
            } else {
              setActiveScreen('workspace');
            }
          }}
          onOpenWorkspace={() => setActiveScreen('workspace')}
          onOpenStandardDetail={(std) => {
            setDetailStandard(std);
            setIsDetailOpen(true);
          }}
          onOpenDraftTray={() => setIsDraftTrayOpen(true)}
          onOpenDirectory={() => setIsDirectoryOpen(true)}
          onOpenHistory={() => setIsHistoryOpen(true)}
          selectedCount={selectedStandardIds.length}
          onToggleSelectStandard={handleToggleSelectStandard}
          selectedStandardIds={selectedStandardIds}
        />
      )}

      {activeScreen !== 'hero' && (
        <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-6">
          {activeScreen === 'workspace' && (
            <WorkspacePage
              onAnalyze={handleStartAnalysis}
              recentAnalyses={analysesHistory}
              onSelectAnalysis={handleSelectSavedAnalysis}
              language={language}
            />
          )}

          {activeScreen === 'review' && pendingRequirements && (
            <ExtractedRequirementsReview
              requirements={pendingRequirements}
              onConfirm={handleConfirmRequirements}
              onBack={() => setActiveScreen('workspace')}
              isProcessing={isProcessing}
            />
          )}

          {activeScreen === 'results' && (
            <RecommendationsPage
              analysis={currentAnalysis}
              onReviseRequirements={() => {
                setPendingRequirements(currentAnalysis.extractedRequirements);
                setActiveScreen('review');
              }}
              onOpenDraftTray={() => setIsDraftTrayOpen(true)}
              onOpenDetailModal={handleOpenDetailModal}
              onOpenFeedbackModal={handleOpenFeedbackModal}
              onToggleSelectStandard={handleToggleSelectStandard}
              selectedStandardIds={selectedStandardIds}
            />
          )}
        </main>
      )}

      {/* Global Modals & Drawers */}
      <ProcessingModal
        isOpen={isProcessing}
        progress={processingProgress}
        onCancel={() => setIsProcessing(false)}
      />

      <StandardDetailModal
        standard={detailStandard}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        isSelected={detailStandard ? selectedStandardIds.includes(detailStandard.id) : false}
        onToggleSelect={handleToggleSelectStandard}
        onNavigateToStandard={(std) => {
          setDetailStandard(std);
        }}
        selectedStandardIds={selectedStandardIds}
      />

      <DraftTenderDrawer
        isOpen={isDraftTrayOpen}
        onClose={() => setIsDraftTrayOpen(false)}
        selectedStandards={selectedStandardsObjects}
        onRemoveStandard={handleToggleSelectStandard}
        tenderInfo={{
          title: currentAnalysis.title,
          tenderRef: currentAnalysis.tenderReference,
          department: currentAnalysis.department
        }}
      />

      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        standard={feedbackStandard}
        initialStatus={feedbackInitialStatus}
        onSubmit={handleSubmitFeedback}
      />

      <StandardsDirectoryModal
        isOpen={isDirectoryOpen}
        onClose={() => setIsDirectoryOpen(false)}
        onSelectStandard={(std) => {
          setDetailStandard(std);
          setIsDetailOpen(true);
        }}
        selectedStandardIds={selectedStandardIds}
        onToggleSelectStandard={handleToggleSelectStandard}
      />

      <AnalysisHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        analyses={analysesHistory}
        onSelectAnalysis={handleSelectSavedAnalysis}
      />

      {/* Official Footer Strip */}
      <footer className="mt-auto border-t border-[#ececeb] dark:border-[#222222] bg-[#fbfbf9] dark:bg-[#151515] py-5 px-4 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-200">MANAK-AI (मानक AI)</span>
            <span>•</span>
            <span>Smart India Hackathon 2026 Problem Statement 26108</span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            GFR 2017 Rule 144(i) & BIS Quality Control Orders (QCO) Decision Support Engine
          </div>
        </div>
      </footer>

    </div>
  );
};
