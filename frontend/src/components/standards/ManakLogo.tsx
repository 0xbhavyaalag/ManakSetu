import React from 'react';

interface ManakLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showSubtitle?: boolean;
}

export const ManakLogo: React.FC<ManakLogoProps> = ({ 
  size = 'md', 
  className = '',
  showSubtitle = true 
}) => {
  const iconSize = size === 'sm' ? 'w-6 h-6' : size === 'lg' ? 'w-10 h-10' : 'w-8 h-8';
  const titleSize = size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-xl' : 'text-base';
  const subtitleSize = size === 'sm' ? 'text-[9px]' : size === 'lg' ? 'text-[11px]' : 'text-[10px]';

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Official BIS Standard Emblem */}
      <div className={`${iconSize} rounded-lg bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 dark:from-white dark:to-slate-200 text-white dark:text-slate-900 flex items-center justify-center shadow-xs shrink-0 border border-slate-700/20 dark:border-white/30 transition-transform hover:scale-105`}>
        <svg viewBox="0 0 100 100" fill="currentColor" className="w-5 h-5 sm:w-5.5 sm:h-5.5">
          {/* Outer Certification Standard Diamond/Gear Contour */}
          <path 
            d="M50 8 L92 50 L50 92 L8 50 Z" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="7" 
            strokeLinejoin="round" 
          />
          {/* Inner Stylized M Glyph for MANAK (मानक) */}
          <path 
            d="M30 68 L30 32 L50 54 L70 32 L70 68" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="7.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          <circle cx="50" cy="54" r="3.5" fill="currentColor" />
        </svg>
      </div>

      <div className="flex flex-col leading-none">
        <div className="flex items-center gap-1.5">
          <span className={`font-black tracking-tight text-slate-900 dark:text-white font-mono ${titleSize}`}>
            MANAK<span className="text-indigo-600 dark:text-indigo-400 font-sans">-AI</span>
          </span>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 tracking-wide font-sans">
            मानक AI
          </span>
        </div>
        {showSubtitle && (
          <span className={`text-slate-500 dark:text-slate-400 font-medium tracking-normal mt-0.5 ${subtitleSize}`}>
            Indian Standards Procurement Engine
          </span>
        )}
      </div>
    </div>
  );
};
