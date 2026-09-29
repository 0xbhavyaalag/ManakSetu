import React from 'react';
import { 
  FileText, 
  History, 
  Layers, 
  Sun, 
  Moon, 
  Eye, 
  Bookmark, 
  Scale,
  ArrowRightLeft,
  ChevronRight,
  ExternalLink,
  Search,
  BookOpen,
  Sparkles,
  BookmarkCheck
} from 'lucide-react';
import { AppTheme } from '../Navbar';
import { ManakLogo } from './ManakLogo';

interface ManakNavbarProps {
  activeScreen: 'hero' | 'workspace' | 'review' | 'results';
  onNavigateScreen: (screen: 'hero' | 'workspace' | 'results') => void;
  selectedCount: number;
  onOpenDraftTray: () => void;
  onOpenDirectory: () => void;
  onOpenHistory: () => void;
  theme: AppTheme;
  onThemeChange: (theme: AppTheme) => void;
  language: 'en' | 'hi';
  onLanguageChange: (lang: 'en' | 'hi') => void;
  onSwitchToAgro?: () => void;
}

export const ManakNavbar: React.FC<ManakNavbarProps> = ({
  activeScreen,
  onNavigateScreen,
  selectedCount,
  onOpenDraftTray,
  onOpenDirectory,
  onOpenHistory,
  theme,
  onThemeChange,
  language,
  onLanguageChange,
  onSwitchToAgro
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-[#161616] border-b border-[#e8e8e6] dark:border-[#282828] transition-colors">
      
      {/* Top Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          
          {/* Left: MANAK-AI Logo & Breadcrumb Navigation */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => onNavigateScreen('hero')}
              className="flex items-center gap-2 text-left focus:outline-none cursor-pointer"
              title="MANAK-AI Home"
            >
              <ManakLogo size="sm" showSubtitle={false} />
            </button>

            <span className="text-[#c7c6c4] dark:text-[#454545] font-light hidden sm:inline">/</span>

            {/* Breadcrumb Path */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#787774] dark:text-[#9b9b9b]">
              <span 
                onClick={() => onNavigateScreen('hero')} 
                className="hover:text-[#37352f] dark:hover:text-[#ebebeb] cursor-pointer"
              >
                MANAK-AI
              </span>
              <span className="text-[#c7c6c4] dark:text-[#454545]">/</span>
              <span className="hover:text-[#37352f] dark:hover:text-[#ebebeb] font-semibold text-slate-800 dark:text-slate-100">
                {activeScreen === 'hero' ? 'Overview' : activeScreen === 'workspace' ? 'Specification Entry' : activeScreen === 'review' ? 'Technical Verification' : 'Ranked Indian Standards'}
              </span>
            </div>
          </div>

          {/* Center Navigation Shortcuts */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            
            <button
              onClick={() => onNavigateScreen('hero')}
              className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition flex items-center gap-1.5 cursor-pointer ${
                activeScreen === 'hero' 
                  ? 'bg-slate-100 dark:bg-[#252525] text-slate-900 dark:text-white font-semibold' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#202020]'
              }`}
            >
              <span>Overview</span>
            </button>

            <button
              onClick={() => onNavigateScreen('workspace')}
              className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition flex items-center gap-1.5 cursor-pointer ${
                activeScreen === 'workspace' 
                  ? 'bg-slate-100 dark:bg-[#252525] text-slate-900 dark:text-white font-semibold' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#202020]'
              }`}
            >
              <span>Workspace</span>
            </button>

            <button
              onClick={() => onNavigateScreen('results')}
              className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition flex items-center gap-1.5 cursor-pointer ${
                activeScreen === 'results' 
                  ? 'bg-slate-100 dark:bg-[#252525] text-slate-900 dark:text-white font-semibold' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#202020]'
              }`}
            >
              <span>Ranked IS</span>
            </button>

            {/* Standards Directory Button */}
            <button
              onClick={onOpenDirectory}
              className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#202020] transition cursor-pointer"
              title="Search official Indian Standards database"
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>IS Directory</span>
            </button>

            {/* History Button */}
            <button
              onClick={onOpenHistory}
              className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#202020] transition cursor-pointer"
              title="View past specification audits"
            >
              <History className="w-3.5 h-3.5 text-slate-500" />
              <span>Audits</span>
            </button>

            {/* Draft Spec Drawer Button */}
            <button
              onClick={onOpenDraftTray}
              className={`px-2.5 py-1.5 rounded-md text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                selectedCount > 0
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-2xs'
                  : 'border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
              title="View compiled Section IV tender specification"
            >
              <BookmarkCheck className="w-3.5 h-3.5" />
              <span>Draft ({selectedCount})</span>
            </button>
          </div>

          {/* Right: Language, Theme & Optional Portal Switch */}
          <div className="flex items-center gap-2">
            
            {/* Language Toggle (EN / HI) */}
            <button
              onClick={() => onLanguageChange(language === 'en' ? 'hi' : 'en')}
              className="px-2 py-1 rounded text-xs font-mono font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#242424] transition cursor-pointer"
              title="Toggle interface language"
            >
              {language === 'en' ? 'हिंदी' : 'EN'}
            </button>

            {/* Theme Toggle (Daylight / Eye-comfort / Dark) */}
            <div className="flex items-center rounded-md border border-slate-200 dark:border-slate-700 p-0.5 bg-slate-50 dark:bg-slate-900">
              <button
                onClick={() => onThemeChange('daylight')}
                className={`p-1 rounded transition cursor-pointer ${theme === 'daylight' ? 'bg-white dark:bg-slate-800 text-amber-600 shadow-2xs' : 'text-slate-400 hover:text-slate-600'}`}
                title="Daylight mode"
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onThemeChange('eye-comfort')}
                className={`p-1 rounded transition cursor-pointer ${theme === 'eye-comfort' ? 'bg-[#f4efe4] text-amber-800 shadow-2xs' : 'text-slate-400 hover:text-slate-600'}`}
                title="Eye comfort warm mode"
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onThemeChange('dark')}
                className={`p-1 rounded transition cursor-pointer ${theme === 'dark' ? 'bg-slate-800 text-indigo-400 shadow-2xs' : 'text-slate-400 hover:text-slate-600'}`}
                title="Dark mode"
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Switch to Agro/Mandi Platform */}
            {onSwitchToAgro && (
              <button
                onClick={onSwitchToAgro}
                className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition cursor-pointer"
                title="Switch to Annadhara Agro Procurement Portal"
              >
                <ArrowRightLeft className="w-3 h-3 text-emerald-600" />
                <span>Annadhara Mandi</span>
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
