import React, { useState, useRef } from 'react';
import { SAMPLE_PROMPTS } from '../../services/standardsData';
import { SamplePrompt, InputLanguage, ProcurementAnalysis } from '../../types/standards';
import { 
  UploadCloud, 
  FileText, 
  ArrowRight, 
  Building2, 
  Hash, 
  FileCheck, 
  Globe, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Layers, 
  Scale, 
  ShieldCheck, 
  Check, 
  ChevronRight,
  Info,
  Tag,
  Paperclip,
  Calendar,
  Sparkles
} from 'lucide-react';

interface WorkspacePageProps {
  onAnalyze: (input: {
    text: string;
    language: InputLanguage;
    department: string;
    tenderRef: string;
    uploadedFile?: { name: string; size: string; pageCount: number };
  }) => void;
  recentAnalyses: ProcurementAnalysis[];
  onSelectAnalysis: (analysis: ProcurementAnalysis) => void;
  language: 'en' | 'hi';
}

export const WorkspacePage: React.FC<WorkspacePageProps> = ({
  onAnalyze,
  recentAnalyses,
  onSelectAnalysis,
  language
}) => {
  const [inputText, setInputText] = useState('');
  const [inputLanguage, setInputLanguage] = useState<InputLanguage>('en');
  const [department, setDepartment] = useState('Central Public Works Department (CPWD) - Electrical Division');
  const [tenderRef, setTenderRef] = useState('NIT/CPWD/EE-ED-I/2026/842');
  const [procurementCategory, setProcurementCategory] = useState<'goods' | 'works' | 'services'>('goods');
  const [estimatedValue, setEstimatedValue] = useState<string>('₹2.5 Crore (NCB)');
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string; pageCount: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSelectSample = (sample: SamplePrompt) => {
    setInputText(sample.text);
    setDepartment(sample.department);
    setTenderRef(sample.tenderRef);
    if (sample.documentName) {
      setUploadedFile({
        name: sample.documentName,
        size: '2.4 MB',
        pageCount: 14
      });
    } else {
      setUploadedFile(null);
    }
    setUploadError(null);
  };

  const handleFileUpload = (file: File) => {
    setUploadError(null);
    const validExtensions = ['.pdf', '.docx', '.doc', '.txt'];
    const hasValidExt = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));

    if (!hasValidExt) {
      setUploadError('Please upload a PDF or DOCX procurement file.');
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setUploadError('File size exceeds 25 MB limit.');
      return;
    }

    const sizeStr = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
    setUploadedFile({
      name: file.name,
      size: sizeStr,
      pageCount: Math.max(4, Math.floor(file.size / (80 * 1024)))
    });

    if (!inputText.trim()) {
      setInputText(`Extracted from ${file.name}:\nTechnical specification, scope of supply, mandatory quality control orders, and routine acceptance tests.`);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() && !uploadedFile) {
      setUploadError('Please provide a technical specification or attach a tender schedule.');
      return;
    }

    onAnalyze({
      text: inputText.trim() || `Technical specification schedule extracted from ${uploadedFile?.name}`,
      language: inputLanguage,
      department: department.trim() || 'Central Public Procurement Entity',
      tenderRef: tenderRef.trim() || 'NIT/TENDER/2026/01',
      uploadedFile: uploadedFile || undefined
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in py-4 pb-24 text-[#37352f] dark:text-[#ebebeb]">
      
      {/* MANAK-AI Page Header */}
      <div className="space-y-3">
        {/* Page Icon */}
        <div className="w-12 h-12 flex items-center justify-center text-3xl select-none cursor-default">
          🏛️
        </div>

        {/* Page Title */}
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#191919] dark:text-[#f7f7f5]">
          Procurement Specification Workspace
        </h1>

        <p className="text-sm text-[#787774] dark:text-[#9b9b9b] leading-relaxed">
          Enter product requirements or attach tender schedules to identify applicable Bureau of Indian Standards (BIS) specifications, mandatory Quality Control Orders (QCO), and clausal test codes for procurement decision support.
        </p>
      </div>

      {/* Statutory Guidance Callout Box */}
      <div className="p-4 rounded-md bg-[#f7f7f5] dark:bg-[#202020] border border-[#e8e8e6] dark:border-[#2e2e2e] flex items-start gap-3 text-xs leading-relaxed">
        <span className="text-base select-none mt-0.5">⚖️</span>
        <div>
          <span className="font-semibold text-[#191919] dark:text-[#f7f7f5]">
            GFR 2017 Rule 144(i) Compliance Desk:
          </span>
          <span className="text-[#5a5a58] dark:text-[#9b9b9b] ml-1">
            "Technical specifications shall, to the extent practicable, be based on national standards certified by the Bureau of Indian Standards." The suggestions generated serve as internal decision support ranking aids.
          </span>
        </div>
      </div>

      {/* Page Properties Table */}
      <div className="border-t border-b border-[#e8e8e6] dark:border-[#2e2e2e] py-3 text-xs space-y-2">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
          <div className="sm:col-span-4 text-[#787774] dark:text-[#9b9b9b] flex items-center gap-1.5 font-medium">
            <Building2 className="w-3.5 h-3.5" />
            <span>Department</span>
          </div>
          <div className="sm:col-span-8">
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-2 py-1 rounded hover:bg-[#f7f7f5] dark:hover:bg-[#242424] focus:bg-white dark:focus:bg-[#1f1f1f] border border-transparent focus:border-[#2383e2] text-[#191919] dark:text-white transition outline-hidden font-medium"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
          <div className="sm:col-span-4 text-[#787774] dark:text-[#9b9b9b] flex items-center gap-1.5 font-medium">
            <Hash className="w-3.5 h-3.5" />
            <span>NIT Reference No</span>
          </div>
          <div className="sm:col-span-8">
            <input
              type="text"
              value={tenderRef}
              onChange={(e) => setTenderRef(e.target.value)}
              className="w-full px-2 py-1 rounded hover:bg-[#f7f7f5] dark:hover:bg-[#242424] focus:bg-white dark:focus:bg-[#1f1f1f] border border-transparent focus:border-[#2383e2] text-[#191919] dark:text-white transition outline-hidden font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
          <div className="sm:col-span-4 text-[#787774] dark:text-[#9b9b9b] flex items-center gap-1.5 font-medium">
            <Globe className="w-3.5 h-3.5" />
            <span>Document Language</span>
          </div>
          <div className="sm:col-span-8 flex items-center gap-2">
            <select
              value={inputLanguage}
              onChange={(e) => setInputLanguage(e.target.value as InputLanguage)}
              className="px-2 py-1 rounded text-xs bg-transparent hover:bg-[#f7f7f5] dark:hover:bg-[#242424] border border-transparent focus:border-[#2383e2] text-[#191919] dark:text-white outline-hidden cursor-pointer"
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी (Hindi)</option>
              <option value="ta">தமிழ் (Tamil)</option>
              <option value="mr">मराठी (Marathi)</option>
              <option value="te">తెలుగు (Telugu)</option>
            </select>
            <span className="text-[11px] text-[#787774]">|</span>
            <span className="text-[11px] text-[#787774]">Budget: {estimatedValue}</span>
          </div>
        </div>
      </div>

      {/* Reference Tender Gallery Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-[#787774] dark:text-[#9b9b9b]">
          <span className="font-semibold uppercase tracking-wider text-[11px]">
            Reference Procurement Dockets
          </span>
          <span>Click to populate</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {SAMPLE_PROMPTS.map((sample) => {
            const isSelected = tenderRef === sample.tenderRef;
            return (
              <div
                key={sample.id}
                onClick={() => handleSelectSample(sample)}
                className={`p-3 rounded-md border text-xs cursor-pointer transition ${
                  isSelected
                    ? 'border-[#2383e2] bg-[#2383e2]/5 text-[#191919] dark:text-white'
                    : 'border-[#e8e8e6] dark:border-[#2e2e2e] bg-white dark:bg-[#202020] hover:bg-[#f7f7f5] dark:hover:bg-[#262626]'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] text-[#787774] font-mono mb-1">
                  <span>{sample.tenderRef.split('/')[1] || 'NIT'}</span>
                  {isSelected && <span className="text-[#2383e2] font-semibold">Active</span>}
                </div>
                <h4 className="font-semibold text-[#191919] dark:text-white line-clamp-1">
                  {sample.title}
                </h4>
                <p className="text-[11px] text-[#787774] line-clamp-1 mt-0.5">
                  {sample.department}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Technical Schedule & Content Editor */}
      <form onSubmit={handleSubmit} className="space-y-5">
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-[#787774]">
            <span className="font-semibold uppercase tracking-wider text-[11px]">
              Technical Schedule & Clauses
            </span>
            <span className="font-mono text-[11px]">{inputText.length} characters</span>
          </div>

          <textarea
            rows={8}
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              setUploadError(null);
            }}
            placeholder="Type or paste procurement specifications, product ratings (e.g. 500 kVA, 11 kV), material grades, routine/type tests, and environmental standards..."
            className="w-full text-xs sm:text-sm p-4 rounded-md bg-[#fafaf9] dark:bg-[#202020] border border-[#e8e8e6] dark:border-[#2e2e2e] text-[#191919] dark:text-[#ebebeb] placeholder-[#9b9b9b] focus:border-[#2383e2] focus:bg-white dark:focus:bg-[#1a1a1a] focus:outline-hidden transition leading-relaxed"
          />
        </div>

        {/* Tender Schedule File Attachment Block */}
        <div className="space-y-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileUpload(e.target.files[0]);
              }
            }}
            accept=".pdf,.docx,.doc,.txt"
            className="hidden"
          />

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`p-4 rounded-md border border-dashed transition cursor-pointer text-xs flex items-center justify-between ${
              isDragging
                ? 'border-[#2383e2] bg-[#2383e2]/5'
                : uploadedFile
                ? 'border-[#0f7b55] bg-[#0f7b55]/5'
                : 'border-[#e0e0de] dark:border-[#333333] hover:bg-[#f7f7f5] dark:hover:bg-[#202020]'
            }`}
          >
            <div className="flex items-center gap-3">
              <Paperclip className="w-4 h-4 text-[#787774]" />
              {uploadedFile ? (
                <div>
                  <span className="font-semibold text-[#191919] dark:text-white">
                    {uploadedFile.name}
                  </span>
                  <span className="text-[#787774] ml-2 font-mono text-[11px]">
                    ({uploadedFile.size})
                  </span>
                </div>
              ) : (
                <span className="text-[#787774]">
                  Attach Tender Document (PDF or DOCX, max 25 MB)...
                </span>
              )}
            </div>

            {uploadedFile && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setUploadedFile(null);
                }}
                className="text-[11px] text-[#eb5757] hover:underline"
              >
                Remove
              </button>
            )}
          </div>

          {uploadError && (
            <p className="text-xs text-[#eb5757] flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{uploadError}</span>
            </p>
          )}
        </div>

        {/* Primary Action Button */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-[11px] text-[#787774]">
            Cross-references Bureau of Indian Standards (BIS) e-Sale Catalog
          </span>

          <button
            type="submit"
            className="px-4 py-2 rounded-md bg-[#191919] hover:bg-[#2f2f2f] text-white dark:bg-[#f7f7f5] dark:hover:bg-[#e6e6e4] dark:text-[#191919] text-xs font-medium shadow-2xs transition flex items-center gap-2 cursor-pointer"
          >
            <span>Cross-Reference Standards</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </form>

      {/* Recent Tender Pages / Audits List */}
      {recentAnalyses.length > 0 && (
        <div className="pt-6 border-t border-[#e8e8e6] dark:border-[#2e2e2e] space-y-3">
          <div className="flex items-center justify-between text-xs text-[#787774]">
            <span className="font-semibold uppercase tracking-wider text-[11px]">
              Previous Tender Audits ({recentAnalyses.length})
            </span>
          </div>

          <div className="space-y-1">
            {recentAnalyses.map((rec) => (
              <div
                key={rec.id}
                onClick={() => onSelectAnalysis(rec)}
                className="p-2.5 rounded-md hover:bg-[#f7f7f5] dark:hover:bg-[#202020] transition flex items-center justify-between text-xs cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-3.5 h-3.5 text-[#787774] shrink-0" />
                  <span className="font-medium text-[#191919] dark:text-[#ebebeb] line-clamp-1">
                    {rec.title}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#f1f1ef] dark:bg-[#2b2b2b] text-[#787774] font-mono">
                    {rec.tenderReference}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-[#787774] font-mono text-[11px]">
                  <span>{rec.recommendations.length} Standards</span>
                  <span>{rec.createdAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
