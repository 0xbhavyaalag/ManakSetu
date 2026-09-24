import React from 'react';
import { 
  Wheat, Globe, Bell, PhoneCall, Smartphone, PlayCircle, 
  UserCheck, Shield, ChevronDown 
} from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { UserRole } from '../types';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  unreadCount: number;
  onOpenNotifications: () => void;
  onOpenKeypad: () => void;
  onOpenMissedCall: () => void;
  onOpenDemoTour: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  unreadCount,
  onOpenNotifications,
  onOpenKeypad,
  onOpenMissedCall,
  onOpenDemoTour
}) => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <button 
            onClick={() => onRoleChange('farmer')}
            className="flex items-center gap-2.5 sm:gap-3 text-left focus:outline-none group cursor-pointer"
            title="Go to Farmer Dashboard"
          >
            <img 
              src="/logo-icon.png" 
              alt="ANNADHARA AI" 
              className="h-10 w-10 sm:h-11 sm:w-11 object-contain drop-shadow-sm group-hover:scale-105 transition-transform shrink-0"
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-lg sm:text-xl tracking-tight text-emerald-950 leading-none group-hover:text-emerald-800 transition-colors">
                  ANNADHARA
                </span>
                <span className="bg-emerald-600 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-full shadow-xs">
                  AI 2026
                </span>
              </div>
              <p className="text-[11px] text-emerald-800/80 font-medium hidden sm:block mt-0.5">
                {t('tagline')}
              </p>
            </div>
          </button>

          {/* Action Tools & Role Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Run Demo Tour Button */}
            <button
              id="btn-run-demo"
              onClick={onOpenDemoTour}
              className="btn-press flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold text-xs sm:text-sm px-2.5 sm:px-3 py-1.5 rounded-lg shadow-sm hover:from-amber-600 hover:to-orange-600 transition"
              title="20-step SIH 2026 Demo Walkthrough"
            >
              <PlayCircle className="w-4 h-4" />
              <span className="hidden md:inline">{t('demoTour')}</span>
              <span className="md:hidden">Demo</span>
            </button>

            {/* Keypad Phone Simulator */}
            <button
              id="btn-open-keypad"
              onClick={onOpenKeypad}
              className="btn-press flex items-center gap-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs sm:text-sm font-medium px-2.5 py-1.5 rounded-lg shadow-sm transition"
              title="Test DTMF Keypad Phone & IVR Call"
            >
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span className="hidden lg:inline">{t('keypadPhone')}</span>
            </button>

            {/* Missed Call Simulation */}
            <button
              id="btn-open-missed-call"
              onClick={onOpenMissedCall}
              className="btn-press flex items-center gap-1.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300 text-xs sm:text-sm font-medium px-2.5 py-1.5 rounded-lg transition"
              title="1-Click Missed Call Simulation"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-700" />
              <span className="hidden sm:inline">{t('missedCall')}</span>
            </button>

            {/* Language Switcher */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 text-xs font-semibold rounded-md transition ${
                  language === 'en' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`px-2 py-1 text-xs font-semibold rounded-md transition ${
                  language === 'hi' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                हिन्दी
              </button>
            </div>

            {/* Role Switcher */}
            <div className="relative">
              <select
                id="select-role"
                value={currentRole}
                onChange={(e) => onRoleChange(e.target.value as UserRole)}
                className="text-xs sm:text-sm bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 font-medium rounded-lg px-2.5 py-1.5 cursor-pointer focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                <option value="farmer">🌾 {t('roleFarmer')}</option>
                <option value="operator">🏢 {t('roleOperator')}</option>
                <option value="admin">🛡️ {t('roleAdmin')}</option>
              </select>
            </div>

            {/* Notification Bell */}
            <button
              id="btn-notifications"
              onClick={onOpenNotifications}
              className="btn-press relative p-2 text-slate-600 hover:text-emerald-700 hover:bg-slate-100 rounded-lg transition"
              title="View Alerts & Simulated SMS"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};
