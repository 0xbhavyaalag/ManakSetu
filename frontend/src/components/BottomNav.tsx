import React from 'react';
import { Home, CalendarPlus, Clock, Users, Bot } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const { t } = useLanguage();

  const navItems = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'booking', label: t('bookProcurement'), icon: CalendarPlus },
    { id: 'queue', label: t('queueStatus'), icon: Clock },
    { id: 'family', label: t('family'), icon: Users },
    { id: 'assistant', label: t('aiAssistant'), icon: Bot },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg px-2 py-1.5">
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-bottom-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition ${
                isActive 
                  ? 'text-emerald-700 font-bold' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
              <span className="text-[10px] mt-0.5 truncate max-w-[64px]">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
