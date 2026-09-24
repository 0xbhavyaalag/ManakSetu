import React, { useState } from 'react';
import { X, MessageSquare, Bell, PhoneCall, Check, Clock } from 'lucide-react';
import { NotificationItem } from '../types';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkRead: (id: number) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkRead
}) => {
  const [activeChannel, setActiveChannel] = useState<'all' | 'app' | 'sms' | 'voice'>('all');

  if (!isOpen) return null;

  const filtered = activeChannel === 'all' 
    ? notifications 
    : notifications.filter(n => n.channel === activeChannel);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-emerald-800 text-white">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-emerald-300" />
            <h2 className="font-bold text-base">Alerts & SMS Simulation Center</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-emerald-700 rounded-lg text-emerald-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Channel Filter Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold">
          {[
            { id: 'all', label: 'All', icon: Bell },
            { id: 'sms', label: 'SMS Inbox (SIM)', icon: MessageSquare },
            { id: 'app', label: 'In-App Alerts', icon: Bell },
            { id: 'voice', label: 'Voice Calls', icon: PhoneCall },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveChannel(tab.id as any)}
              className={`flex-1 py-3 px-2 flex items-center justify-center gap-1.5 border-b-2 transition ${
                activeChannel === tab.id
                  ? 'border-emerald-600 text-emerald-800 bg-white font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Bell className="w-10 h-10 mx-auto stroke-1 mb-2 opacity-50" />
              <p className="text-sm">No notifications found in this channel.</p>
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className={`p-3.5 rounded-xl border transition ${
                  item.channel === 'sms'
                    ? 'bg-amber-50/60 border-amber-200'
                    : item.is_read
                    ? 'bg-slate-50 border-slate-200'
                    : 'bg-emerald-50/50 border-emerald-200 shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`p-1.5 rounded-lg text-xs font-bold ${
                      item.channel === 'sms' 
                        ? 'bg-amber-100 text-amber-800' 
                        : item.channel === 'voice'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {item.channel.toUpperCase()}
                    </span>
                    <h3 className="text-xs font-bold text-slate-800">
                      {item.title}
                    </h3>
                  </div>

                  {!item.is_read && (
                    <button
                      onClick={() => onMarkRead(item.id)}
                      className="text-xs text-emerald-700 hover:text-emerald-900 flex items-center gap-0.5"
                      title="Mark as read"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <p className="text-xs text-slate-600 mt-2 font-mono whitespace-pre-line leading-relaxed">
                  {item.message}
                </p>

                <div className="mt-2.5 flex items-center gap-1 text-[10px] text-slate-400">
                  <Clock className="w-3 h-3" />
                  <span>{new Date(item.created_at || Date.now()).toLocaleTimeString()}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-[11px] text-slate-500">
          Simulated asynchronous notification event engine (RabbitMQ Architecture)
        </div>

      </div>
    </div>
  );
};
