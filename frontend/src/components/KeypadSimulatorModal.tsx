import React, { useState, useEffect } from 'react';
import { X, Phone, PhoneOff, Volume2, VolumeX, MessageSquare } from 'lucide-react';
import { playDtmfTone, playPhoneRing, speakIvrText, stopSpeaking } from '../services/audioService';
import { api } from '../services/api';

interface KeypadSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookingChanged?: () => void;
}

export const KeypadSimulatorModal: React.FC<KeypadSimulatorModalProps> = ({
  isOpen,
  onClose,
  onBookingChanged
}) => {
  const [isCallActive, setIsCallActive] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [screenText, setScreenText] = useState<string>('☎️ ANNADHARA\nReady to dial\nPress CALL');
  const [spokenAudioText, setSpokenAudioText] = useState<string>('');
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(true);
  const [language, setLanguage] = useState<'hi' | 'en'>('hi');
  const [lastSms, setLastSms] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleEndCall = () => {
    stopSpeaking();
    setIsCallActive(false);
    setSessionId('');
    setScreenText('☎️ ANNADHARA\nCall Ended\nPress CALL to start');
    setSpokenAudioText('');
  };

  useEffect(() => {
    if (!isOpen && isCallActive) {
      handleEndCall();
    }
  }, [isOpen, isCallActive]);

  const handleStartCall = async () => {
    setLoading(true);
    playPhoneRing(600);
    setScreenText('Connecting to\n1800-ANNADHARA...\nCalling...');

    try {
      const res = await api.startIvrCall('9876543210', language);
      setSessionId(res.session_id);
      setIsCallActive(true);
      setScreenText(res.screen_display);
      setSpokenAudioText(res.spoken_text);
      if (voiceEnabled) {
        speakIvrText(res.spoken_text, language);
      }
    } catch (err) {
      setScreenText('Call Failed\nNetwork Error');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleKeyPress = async (digit: string) => {
    playDtmfTone(digit, 150);

    if (!isCallActive) {
      setScreenText((prev) => (prev.includes('Ready') ? digit : prev + digit));
      return;
    }

    try {
      const res = await api.sendIvrDigit(sessionId, digit, '9876543210');
      setScreenText(res.screen_display);
      setSpokenAudioText(res.spoken_text);

      if (voiceEnabled && res.spoken_text) {
        speakIvrText(res.spoken_text, language);
      }

      if (res.sms_sent) {
        setLastSms(res.sms_sent);
      }

      if (!res.is_call_active) {
        setIsCallActive(false);
      }

      if (res.action_triggered && onBookingChanged) {
        onBookingChanged();
      }
    } catch (e) {
      console.error('IVR Digit error:', e);
    }
  };

  const keypadKeys = [
    { num: '1', sub: '.,' },
    { num: '2', sub: 'ABC' },
    { num: '3', sub: 'DEF' },
    { num: '4', sub: 'GHI' },
    { num: '5', sub: 'JKL' },
    { num: '6', sub: 'MNO' },
    { num: '7', sub: 'PQRS' },
    { num: '8', sub: 'TUV' },
    { num: '9', sub: 'WXYZ' },
    { num: '*', sub: 'Menu' },
    { num: '0', sub: '+' },
    { num: '#', sub: 'End' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3">
      <div className="relative w-full max-w-sm bg-gradient-to-b from-slate-800 to-slate-900 rounded-3xl p-5 shadow-2xl border-4 border-slate-700 text-white">
        
        {/* Top Controls Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-700/60 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-xs font-bold tracking-wider text-slate-300">
              FEATURE PHONE SIMULATOR
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Language toggle for IVR voice */}
            <button
              onClick={() => setLanguage(l => l === 'hi' ? 'en' : 'hi')}
              className="text-[11px] bg-slate-700 hover:bg-slate-600 px-2 py-0.5 rounded-md font-semibold text-emerald-300"
            >
              {language === 'hi' ? 'हिन्दी Voice' : 'EN Voice'}
            </button>
            {/* Audio Voice toggle */}
            <button
              onClick={() => {
                if (voiceEnabled) stopSpeaking();
                setVoiceEnabled(!voiceEnabled);
              }}
              className="p-1 rounded-md text-slate-300 hover:text-white"
              title={voiceEnabled ? 'Mute IVR Speech' : 'Enable IVR Speech'}
            >
              {voiceEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Speaker Grille */}
        <div className="flex justify-center items-center gap-1.5 mb-2.5">
          <div className="w-8 h-1 rounded-full bg-slate-950/80 border border-slate-700/50"></div>
          <div className="w-2 h-2 rounded-full bg-slate-950/80 border border-slate-700/50"></div>
        </div>

        {/* Phone Brand Emblem with Official Logo */}
        <div className="flex items-center justify-between gap-2 mb-2 bg-slate-950/70 py-1.5 px-3 rounded-xl border border-slate-700/50">
          <div className="flex items-center gap-1.5">
            <img 
              src="/logo-icon.png" 
              alt="ANNADHARA" 
              className="h-5 w-5 object-contain"
            />
            <span className="text-[11px] font-black tracking-widest text-emerald-400 font-mono">
              ANNADHARA BHARAT
            </span>
          </div>
          <span className="text-[9px] font-mono text-emerald-300/80 font-bold bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40">
            IVR 1800-FARM
          </span>
        </div>

        {/* Retro Backlit LCD Display */}
        <div className="phone-lcd rounded-2xl p-3 min-h-[115px] flex flex-col justify-between border-2 border-slate-950/60 shadow-inner mb-3 relative overflow-hidden">
          {/* Subtle Scanlines overlay */}
          <div className="flex justify-between items-center text-[10px] border-b border-slate-800/20 pb-1 font-bold">
            <span className="flex items-center gap-1">
              <span>📶 5/5 BSNL</span>
              <span>•</span>
              <span>Kisan Helpline</span>
            </span>
            <span className="font-mono">
              {isCallActive ? '🔴 00:24 IN CALL' : 'STANDBY'}
            </span>
          </div>

          <div className="text-xs font-mono font-bold whitespace-pre-line my-2 leading-relaxed">
            {screenText}
          </div>

          <div className="flex justify-between items-center text-[9px] font-semibold text-slate-900/80 pt-1 border-t border-slate-800/20">
            <div className="flex items-center gap-1">
              {isCallActive && (
                <div className="flex items-center gap-0.5 h-2.5">
                  <span className="w-0.5 bg-slate-900 rounded-full wave-bar-1"></span>
                  <span className="w-0.5 bg-slate-900 rounded-full wave-bar-2"></span>
                  <span className="w-0.5 bg-slate-900 rounded-full wave-bar-3"></span>
                </div>
              )}
              <span>{isCallActive ? 'Audio Stream Active' : 'Press CALL to Connect'}</span>
            </div>
            <span>{isCallActive ? '*: Menu  #: End' : 'Dial * for info'}</span>
          </div>
        </div>

        {/* Live Audio Prompter / Subtitles */}
        {isCallActive && spokenAudioText && (
          <div className="mb-3 p-2.5 bg-slate-950/80 rounded-xl border border-emerald-500/40 text-[11px] text-emerald-300 flex items-start gap-2 shadow-inner">
            <Volume2 className="w-4 h-4 shrink-0 mt-0.5 animate-pulse text-emerald-400" />
            <p className="line-clamp-2 italic leading-relaxed">{spokenAudioText}</p>
          </div>
        )}

        {/* Call Action Buttons */}
        <div className="grid grid-cols-2 gap-2.5 mb-3">
          <button
            id="ivr-call-btn"
            onClick={handleStartCall}
            disabled={isCallActive || loading}
            className={`btn-press py-3 rounded-2xl font-black text-xs flex items-center justify-center gap-2 shadow-lg transition ${
              isCallActive
                ? 'bg-slate-700/60 text-slate-500 cursor-not-allowed border border-slate-600'
                : 'bg-gradient-to-b from-emerald-500 to-emerald-700 hover:from-emerald-400 hover:to-emerald-600 text-white shadow-emerald-950/50 border border-emerald-400/50'
            }`}
          >
            <Phone className="w-4 h-4" />
            <span>CALL (1800)</span>
          </button>

          <button
            id="ivr-end-btn"
            onClick={handleEndCall}
            disabled={!isCallActive}
            className={`btn-press py-3 rounded-2xl font-black text-xs flex items-center justify-center gap-2 shadow-lg transition ${
              !isCallActive
                ? 'bg-slate-700/60 text-slate-500 cursor-not-allowed border border-slate-600'
                : 'bg-gradient-to-b from-rose-500 to-rose-700 hover:from-rose-400 hover:to-rose-600 text-white shadow-rose-950/50 border border-rose-400/50'
            }`}
          >
            <PhoneOff className="w-4 h-4" />
            <span>END CALL</span>
          </button>
        </div>

        {/* Keypad Guide Chips */}
        <div className="grid grid-cols-3 gap-1.5 mb-2.5 text-[9px] font-semibold text-slate-400 text-center font-mono">
          <span className="bg-slate-950/40 p-1 rounded-md border border-slate-800">1: Book Slot</span>
          <span className="bg-slate-950/40 p-1 rounded-md border border-slate-800">2: Token Info</span>
          <span className="bg-slate-950/40 p-1 rounded-md border border-slate-800">3: Reschedule</span>
        </div>

        {/* DTMF Keypad Grid with tactile styling */}
        <div className="grid grid-cols-3 gap-2 px-0.5">
          {keypadKeys.map((k) => (
            <button
              key={k.num}
              id={`keypad-${k.num}`}
              onClick={() => handleKeyPress(k.num)}
              className="btn-press bg-gradient-to-b from-slate-700 via-slate-750 to-slate-800 hover:from-slate-600 hover:to-slate-700 active:scale-95 border-b-2 border-slate-950 border-t border-slate-600 rounded-2xl py-2.5 flex flex-col items-center justify-center shadow-lg shadow-slate-950/60 transition group"
            >
              <span className="text-lg font-black text-white group-hover:text-emerald-300 leading-none">
                {k.num}
              </span>
              <span className="text-[9px] font-bold text-slate-400 tracking-wider">
                {k.sub}
              </span>
            </button>
          ))}
        </div>

        {/* Dispatched SMS toast preview */}
        {lastSms && (
          <div className="mt-3 p-2.5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/50 rounded-2xl text-[11px] text-amber-200 flex items-start gap-2 shadow-inner">
            <MessageSquare className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
            <div>
              <span className="font-bold text-amber-300">Incoming SIM SMS: </span>
              {lastSms}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

