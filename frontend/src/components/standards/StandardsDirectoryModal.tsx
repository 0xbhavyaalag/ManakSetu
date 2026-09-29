import React, { useState } from 'react';
import { STANDARDS_DATABASE } from '../../services/standardsData';
import { StandardRecommendation } from '../../types/standards';
import { 
  X, 
  Search, 
  BookOpen, 
  ShieldCheck, 
  ExternalLink, 
  Check, 
  Copy, 
  Filter,
  Layers,
  ChevronRight,
  Info,
  BookmarkCheck,
  BookmarkPlus
} from 'lucide-react';

interface StandardsDirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStandard: (standard: StandardRecommendation) => void;
  selectedStandardIds?: string[];
  onToggleSelectStandard?: (id: string) => void;
}

export const StandardsDirectoryModal: React.FC<StandardsDirectoryModalProps> = ({
  isOpen,
  onClose,
  onSelectStandard,
  selectedStandardIds = [],
  onToggleSelectStandard
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [qcoOnly, setQcoOnly] = useState(false);

  if (!isOpen) return null;

  const categories = [
    'all',
    'Electrical Engineering & Distribution',
    'Water Supply & Civil Infrastructure',
    'Civil & Structural Engineering',
    'Renewable Energy & Photovoltaics',
    'Food, Beverage & Hygiene',
    'Fire Safety & Building Fittings'
  ];

  const filtered = STANDARDS_DATABASE.filter(std => {
    const matchesSearch = 
      std.isNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      std.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      std.scopeSummary.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || std.category === selectedCategory;
    const matchesQCO = !qcoOnly || std.complianceInfo.qcoMandatory;

    return matchesSearch && matchesCategory && matchesQCO;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div 
        className="relative w-full max-w-4xl bg-white dark:bg-[#161616] rounded-2xl shadow-2xl border border-slate-200 dark:border-[#282828] overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-[#262626] bg-slate-50/70 dark:bg-[#1b1b1b]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 font-bold text-xs">
                  National Standards Catalog
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                  {filtered.length} of {STANDARDS_DATABASE.length} Standards Indexed
                </span>
              </div>

              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-1">
                Indian Standards (IS) Directory for Public Procurement
              </h2>

              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Browse official BIS standards with active Gazette Quality Control Orders (QCO), edition years, and amendments.
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition cursor-pointer"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search & Filters */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-12 gap-2.5">
            <div className="sm:col-span-6 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by IS code (e.g. IS 1180), title, or keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white dark:bg-[#222222] border border-slate-300 dark:border-[#383838] text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
              />
            </div>

            <div className="sm:col-span-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full py-2 px-3 text-xs rounded-xl bg-white dark:bg-[#222222] border border-slate-300 dark:border-[#383838] text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
              >
                <option value="all">All Sectors & Divisions</option>
                {categories.filter(c => c !== 'all').map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2 flex items-center">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={qcoOnly}
                  onChange={(e) => setQcoOnly(e.target.checked)}
                  className="w-3.5 h-3.5 text-indigo-600 rounded border-slate-300"
                />
                <span>Mandatory QCO</span>
              </label>
            </div>
          </div>
        </div>

        {/* Standards List */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-3">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 space-y-2">
              <BookOpen className="w-8 h-8 text-slate-400 mx-auto" />
              <p>No standards matching your filter criteria.</p>
            </div>
          ) : (
            filtered.map((std) => {
              const isSelected = selectedStandardIds.includes(std.id);
              return (
                <div 
                  key={std.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-[#282828] hover:border-indigo-400 dark:hover:border-indigo-600 bg-white dark:bg-[#1a1a1a] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                        {std.isNumber}
                      </span>
                      {std.complianceInfo.qcoMandatory && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          <span>Mandatory QCO</span>
                        </span>
                      )}
                      <span className="text-[10px] font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                        {std.status}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        Ed. {std.editionYear}
                      </span>
                    </div>

                    <h4 className="font-semibold text-slate-800 dark:text-slate-100 text-xs sm:text-sm">
                      {std.title}
                    </h4>

                    <p className="text-slate-500 dark:text-slate-400 text-xs line-clamp-2">
                      {std.scopeSummary}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      onClick={() => {
                        onSelectStandard(std);
                        onClose();
                      }}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#242424] hover:bg-slate-50 dark:hover:bg-[#2b2b2b] text-slate-800 dark:text-slate-200 font-medium transition flex items-center gap-1 text-xs cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Inspect</span>
                    </button>

                    {onToggleSelectStandard && (
                      <button
                        onClick={() => onToggleSelectStandard(std.id)}
                        className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1 text-xs cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-700 text-white hover:bg-emerald-800'
                            : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800'
                        }`}
                      >
                        {isSelected ? (
                          <>
                            <BookmarkCheck className="w-3.5 h-3.5" />
                            <span>In Draft</span>
                          </>
                        ) : (
                          <>
                            <BookmarkPlus className="w-3.5 h-3.5" />
                            <span>Add to Draft</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-[#262626] bg-slate-50/50 dark:bg-[#1b1b1b] flex items-center justify-between text-xs text-slate-500">
          <span>Standards Catalog Source: Bureau of Indian Standards (BIS) e-Sale Portal</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
