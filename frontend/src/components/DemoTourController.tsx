import React, { useState } from 'react';
import { 
  Play, Pause, SkipForward, RotateCcw, X, CheckCircle, 
  Sparkles, ArrowRight, Shield, Award 
} from 'lucide-react';
import { UserRole } from '../types';
import { api } from '../services/api';

interface DemoTourControllerProps {
  isOpen: boolean;
  onClose: () => void;
  onStepChange: (stepNumber: number, role: UserRole, activeTab: string) => void;
  onOpenKeypad: () => void;
}

export const DEMO_STEPS = [
  { step: 1, title: 'Login & Identity', desc: 'Login as Farmer Ramesh Kumar (Family ID: F101)', role: 'farmer' as UserRole, tab: 'dashboard' },
  { step: 2, title: 'Family Dashboard', desc: 'Inspect registered family members and devices (Keypad/Smartphone)', role: 'farmer' as UserRole, tab: 'family' },
  { step: 3, title: 'Authorized Representative', desc: 'Verify Son (Rahul Kumar) is authorized to visit procurement centre', role: 'farmer' as UserRole, tab: 'family' },
  { step: 4, title: 'Ask AI for Best Centre', desc: 'Query AI Saathi for lowest waiting time & shortest queue', role: 'farmer' as UserRole, tab: 'assistant' },
  { step: 5, title: 'Smart Recommendation', desc: 'Centre B recommended: 15 queue vs 85 queue at Centre C (Overcrowded)', role: 'farmer' as UserRole, tab: 'booking' },
  { step: 6, title: 'Slot Selection', desc: 'Select 50 quintals Wheat and 11:00 AM slot', role: 'farmer' as UserRole, tab: 'booking' },
  { step: 7, title: 'Confirm Booking', desc: 'Submit booking with Rahul Kumar designated as visiting representative', role: 'farmer' as UserRole, tab: 'booking' },
  { step: 8, title: 'Token Generated', desc: 'Token T118 issued with Booking Code KS-2026-1025', role: 'farmer' as UserRole, tab: 'queue' },
  { step: 9, title: 'Live Queue Tracking', desc: 'Track live queue: Current T103, 15 ahead, active counters: 3', role: 'farmer' as UserRole, tab: 'queue' },
  { step: 10, title: 'Wait-Time Prediction', desc: 'Predictive waiting time algorithm estimate: 42 minutes', role: 'farmer' as UserRole, tab: 'queue' },
  { step: 11, title: 'Dynamic Reschedule', desc: 'Dynamically reschedule to 02:00 PM; release old slot instantly', role: 'farmer' as UserRole, tab: 'queue' },
  { step: 12, title: 'Instant Notification & SMS', desc: 'Verify real-time in-app & SMS alert dispatched', role: 'farmer' as UserRole, tab: 'dashboard' },
  { step: 13, title: 'Centre Operator Portal', desc: 'Switch to Mandi Operator console at Centre B', role: 'operator' as UserRole, tab: 'operator' },
  { step: 14, title: 'Mark Farmer Arrived', desc: 'Gate entry verified: Token T118 arrived at centre', role: 'operator' as UserRole, tab: 'operator' },
  { step: 15, title: 'Quality Check (FAQ)', desc: 'Lab inspection: Moisture 11.2% (Standard <= 12% - Passed)', role: 'operator' as UserRole, tab: 'operator' },
  { step: 16, title: 'Weighing Complete', desc: 'Digital weighbridge gross 50.0q, tare 0.2q -> 49.8q net', role: 'operator' as UserRole, tab: 'operator' },
  { step: 17, title: 'Accept Procurement', desc: 'Produce accepted formally into FCI state granary account', role: 'operator' as UserRole, tab: 'operator' },
  { step: 18, title: 'Update Payment (DBT)', desc: 'Generate DBT payment advice for ₹1,13,295', role: 'operator' as UserRole, tab: 'operator' },
  { step: 19, title: 'Return to Farmer Dashboard', desc: 'Switch back to Farmer view to verify updated timeline', role: 'farmer' as UserRole, tab: 'dashboard' },
  { step: 20, title: 'Payment Completed', desc: 'View Aadhaar DBT credit receipt with UTR reference', role: 'farmer' as UserRole, tab: 'payment' }
];

export const DemoTourController: React.FC<DemoTourControllerProps> = ({
  isOpen,
  onClose,
  onStepChange,
  onOpenKeypad
}) => {
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  if (!isOpen) return null;

  const current = DEMO_STEPS[currentStepIdx];

  const goToStep = async (idx: number) => {
    if (idx < 0 || idx >= DEMO_STEPS.length) return;
    setCurrentStepIdx(idx);
    const step = DEMO_STEPS[idx];
    try {
      await api.executeDemoStep(step.step);
    } catch (e) {}
    onStepChange(step.step, step.role, step.tab);
  };

  const handleNext = () => {
    if (currentStepIdx < DEMO_STEPS.length - 1) {
      goToStep(currentStepIdx + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIdx > 0) {
      goToStep(currentStepIdx - 1);
    }
  };

  const handleReset = async () => {
    try {
      await api.resetDemo();
      goToStep(0);
    } catch (e) {}
  };

  return (
    <div className="fixed bottom-16 md:bottom-6 right-4 z-50 max-w-sm w-full bg-slate-900/95 backdrop-blur-md text-white rounded-2xl p-4 shadow-2xl border border-slate-700">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" />
          <span className="text-xs font-bold tracking-wider text-amber-400 uppercase">
            SIH 2026 GUIDED DEMO TOUR
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button 
            onClick={handleReset}
            className="p-1 hover:bg-slate-800 rounded-md text-slate-400 hover:text-slate-200"
            title="Reset to Step 1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-slate-800 rounded-md text-slate-400 hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Current Step Display */}
      <div className="my-3">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="font-extrabold text-emerald-400">
            Step {current.step} of 20
          </span>
          <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300 font-mono">
            Role: {current.role.toUpperCase()}
          </span>
        </div>

        <h4 className="font-bold text-sm text-slate-100">
          {current.title}
        </h4>
        <p className="text-xs text-slate-300 mt-1 leading-relaxed">
          {current.desc}
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-amber-500 to-emerald-500 h-1.5 transition-all duration-300"
            style={{ width: `${((currentStepIdx + 1) / DEMO_STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Controller Buttons */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 gap-2">
        <button
          onClick={handlePrev}
          disabled={currentStepIdx === 0}
          className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 disabled:opacity-40 transition"
        >
          Previous
        </button>

        <button
          onClick={onOpenKeypad}
          className="text-[11px] font-bold text-emerald-400 hover:underline px-1"
        >
          ☎️ Test Keypad
        </button>

        <button
          onClick={handleNext}
          disabled={currentStepIdx === DEMO_STEPS.length - 1}
          className="btn-press px-4 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1 shadow-md shadow-emerald-950/40 disabled:opacity-40 transition"
        >
          <span>Next Step</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};
