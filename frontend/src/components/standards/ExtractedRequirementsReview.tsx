import React, { useState } from 'react';
import { ExtractedRequirements, TechnicalParameter } from '../../types/standards';
import { 
  Plus, 
  Trash2, 
  Check, 
  ArrowRight, 
  Edit3, 
  ShieldAlert, 
  Sliders, 
  FlaskConical, 
  HardHat, 
  MapPin, 
  Layers,
  FileCheck,
  Building2,
  FileSpreadsheet
} from 'lucide-react';

interface ExtractedRequirementsReviewProps {
  requirements: ExtractedRequirements;
  onConfirm: (updated: ExtractedRequirements) => void;
  onBack: () => void;
  isProcessing: boolean;
}

export const ExtractedRequirementsReview: React.FC<ExtractedRequirementsReviewProps> = ({
  requirements,
  onConfirm,
  onBack,
  isProcessing
}) => {
  const [data, setData] = useState<ExtractedRequirements>(requirements);
  const [newParamName, setNewParamName] = useState('');
  const [newParamValue, setNewParamValue] = useState('');
  const [newTest, setNewTest] = useState('');
  const [newSafety, setNewSafety] = useState('');

  const handleUpdateParam = (id: string, field: keyof TechnicalParameter, val: any) => {
    setData(prev => ({
      ...prev,
      technicalParameters: prev.technicalParameters.map(p => 
        p.id === id ? { ...p, [field]: val } : p
      )
    }));
  };

  const handleDeleteParam = (id: string) => {
    setData(prev => ({
      ...prev,
      technicalParameters: prev.technicalParameters.filter(p => p.id !== id)
    }));
  };

  const handleAddParam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newParamName.trim() || !newParamValue.trim()) return;
    const newP: TechnicalParameter = {
      id: `param-${Date.now()}`,
      name: newParamName.trim(),
      value: newParamValue.trim(),
      mandatory: true
    };
    setData(prev => ({
      ...prev,
      technicalParameters: [...prev.technicalParameters, newP]
    }));
    setNewParamName('');
    setNewParamValue('');
  };

  const handleAddTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTest.trim()) return;
    setData(prev => ({
      ...prev,
      testMethods: [...prev.testMethods, newTest.trim()]
    }));
    setNewTest('');
  };

  const handleRemoveTest = (idx: number) => {
    setData(prev => ({
      ...prev,
      testMethods: prev.testMethods.filter((_, i) => i !== idx)
    }));
  };

  const handleAddSafety = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSafety.trim()) return;
    setData(prev => ({
      ...prev,
      safetyAndEnvironmental: [...prev.safetyAndEnvironmental, newSafety.trim()]
    }));
    setNewSafety('');
  };

  const handleRemoveSafety = (idx: number) => {
    setData(prev => ({
      ...prev,
      safetyAndEnvironmental: prev.safetyAndEnvironmental.filter((_, i) => i !== idx)
    }));
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      
      {/* Review Instruction Banner */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#111a29] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-teal-800 text-white shrink-0 mt-0.5 shadow-xs">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300 font-mono">
                TECHNICAL EVALUATION MATRIX
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-[11px] text-slate-500 font-mono">Schedule Form D-1</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
              Review & Verification of Extracted Procurement Parameters
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
              Verify the technical ratings, routine test methods, and statutory safety constraints identified from your tender schedule. You can edit parameters or add missing clauses before the system cross-references authoritative Indian Standards.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-end sm:self-center shrink-0">
          <button
            onClick={onBack}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            Back to Input
          </button>
          <button
            onClick={() => onConfirm(data)}
            disabled={isProcessing}
            className="btn-press px-4 py-2 text-xs font-bold rounded-xl bg-teal-800 text-white hover:bg-teal-900 shadow-xs flex items-center gap-1.5 transition disabled:opacity-50"
          >
            <span>Proceed to Standards Cross-Reference</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid: Classification & Technical Parameters */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Scope & Classification */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#111a29] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2">
              <Building2 className="w-4 h-4 text-teal-700" />
              <span>Product Classification & Scope</span>
            </h4>

            <div>
              <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                Identified Item Specification:
              </label>
              <input
                type="text"
                value={data.productName}
                onChange={(e) => setData({ ...data, productName: e.target.value })}
                className="w-full text-xs font-semibold px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                Technical Sector / Sectional Committee:
              </label>
              <input
                type="text"
                value={data.productCategory}
                onChange={(e) => setData({ ...data, productCategory: e.target.value })}
                className="w-full text-xs font-medium px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                Intended Operational Context:
              </label>
              <textarea
                rows={3}
                value={data.intendedApplication}
                onChange={(e) => setData({ ...data, intendedApplication: e.target.value })}
                className="w-full text-xs font-medium px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-hidden resize-none"
              />
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500">Clausal Alignment:</span>
              <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                {Math.round(data.confidenceScore * 100)}% Matched
              </span>
            </div>
          </div>

          {/* Installation & Operating Context */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#111a29] border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2">
              <MapPin className="w-4 h-4 text-slate-600" />
              <span>Installation & Site Operating Conditions</span>
            </h4>
            <div className="space-y-1.5">
              {data.installationContext.map((ctx, i) => (
                <div key={i} className="text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                  <span>{ctx}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center & Right Column: Technical Parameters & Test Methods */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* Technical Parameters Table */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#111a29] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-teal-700" />
                  <span>Technical Parameters Schedule ({data.technicalParameters.length})</span>
                </h4>
                <p className="text-[11px] text-slate-500">Specified ratings, material grades, and efficiency metrics</p>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">Editable Matrix</span>
            </div>

            <div className="space-y-2.5">
              {data.technicalParameters.map((param) => (
                <div 
                  key={param.id}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={param.name}
                      onChange={(e) => handleUpdateParam(param.id, 'name', e.target.value)}
                      placeholder="Parameter name"
                      className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-semibold text-slate-900 dark:text-slate-100"
                    />
                    <input
                      type="text"
                      value={param.value}
                      onChange={(e) => handleUpdateParam(param.id, 'value', e.target.value)}
                      placeholder="Specification value"
                      className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                    />
                  </div>

                  <div className="flex items-center gap-2.5 self-end sm:self-center shrink-0">
                    <label className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={param.mandatory}
                        onChange={(e) => handleUpdateParam(param.id, 'mandatory', e.target.checked)}
                        className="w-3.5 h-3.5 text-teal-600 rounded border-slate-300"
                      />
                      <span>Mandatory</span>
                    </label>

                    <button
                      onClick={() => handleDeleteParam(param.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded transition"
                      title="Remove parameter"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Parameter Row */}
            <form onSubmit={handleAddParam} className="pt-2 flex flex-col sm:flex-row items-center gap-2 text-xs">
              <input
                type="text"
                placeholder="New parameter (e.g. Dielectric Breakdown Voltage)"
                value={newParamName}
                onChange={(e) => setNewParamName(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-dashed border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-hidden"
              />
              <input
                type="text"
                placeholder="Value (e.g. >= 70 kV)"
                value={newParamValue}
                onChange={(e) => setNewParamValue(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-dashed border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-hidden"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-medium flex items-center gap-1 shrink-0 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Row</span>
              </button>
            </form>
          </div>

          {/* Test Protocols and Statutory QCO Requirements */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Routine & Acceptance Tests */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#111a29] border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2">
                <FlaskConical className="w-4 h-4 text-teal-700" />
                <span>Routine & Type Test Protocols</span>
              </h4>

              <div className="space-y-1.5">
                {data.testMethods.map((test, idx) => (
                  <div key={idx} className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs flex items-center justify-between text-slate-700 dark:text-slate-300">
                    <span className="line-clamp-1">{test}</span>
                    <button
                      onClick={() => handleRemoveTest(idx)}
                      className="text-slate-400 hover:text-rose-500 p-0.5 shrink-0"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>

              <form onSubmit={handleAddTest} className="flex gap-1.5 text-xs pt-1">
                <input
                  type="text"
                  placeholder="Add test code or method..."
                  value={newTest}
                  onChange={(e) => setNewTest(e.target.value)}
                  className="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs focus:outline-hidden"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-slate-700 text-white rounded-lg text-xs"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </form>
            </div>

            {/* Quality Control Orders & Statutory Constraints */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#111a29] border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2">
                <HardHat className="w-4 h-4 text-amber-600" />
                <span>Statutory QCO & Safety Directives</span>
              </h4>

              <div className="space-y-1.5">
                {data.safetyAndEnvironmental.map((item, idx) => (
                  <div key={idx} className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs flex items-center justify-between text-slate-700 dark:text-slate-300">
                    <span className="line-clamp-1">{item}</span>
                    <button
                      onClick={() => handleRemoveSafety(idx)}
                      className="text-slate-400 hover:text-rose-500 p-0.5 shrink-0"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>

              <form onSubmit={handleAddSafety} className="flex gap-1.5 text-xs pt-1">
                <input
                  type="text"
                  placeholder="Add statutory requirement..."
                  value={newSafety}
                  onChange={(e) => setNewSafety(e.target.value)}
                  className="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs focus:outline-hidden"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-slate-700 text-white rounded-lg text-xs"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </form>
            </div>

          </div>

        </div>

      </div>

      {/* Confirmation Bottom Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#111a29] border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-xs">
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          Cancel & Edit Input
        </button>

        <button
          onClick={() => onConfirm(data)}
          disabled={isProcessing}
          className="btn-press px-6 py-2.5 text-xs font-bold rounded-xl bg-teal-800 hover:bg-teal-900 text-white shadow-sm flex items-center gap-2 transition disabled:opacity-50"
        >
          <span>Confirm Schedule & Cross-Reference Standards</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
