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

        {/* Phone Brand Emblem with Official Logo */}
        <div className="flex items-center justify-center gap-2 mb-2 bg-slate-950/60 py-1.5 px-3 rounded-lg border border-slate-700/50">
          <img 
            src="/logo-icon.png" 
            alt="ANNADHARA" 
            className="h-6 w-6 object-contain"
          />
          <span className="text-xs font-black tracking-widest text-emerald-400 font-mono">
            ANNADHARA AI
          </span>
        </div>

        {/* Retro Backlit LCD Display */}
        <div className="phone-lcd rounded-xl p-3 min-h-[110px] flex flex-col justify-between border-2 border-slate-950/40 shadow-inner mb-4">
          <div className="flex justify-between items-center text-[10px] border-b border-slate-800/20 pb-1">
            <span className="font-bold">📶 BSNL 2G | SIM 1</span>
            <span>{isCallActive ? '📞 00:24 IN CALL' : 'STANDBY'}</span>
          </div>
          <div className="text-xs font-mono font-bold whitespace-pre-line my-1.5 leading-snug">
            {screenText}
          </div>
          <div className="text-[10px] text-right font-semibold text-slate-900/80">
            {isCallActive ? '*: Menu  #: End' : 'Dial * for info'}
          </div>
        </div>

        {/* Live Audio Prompter / Subtitles */}
        {isCallActive && spokenAudioText && (
          <div className="mb-3 p-2 bg-slate-800/80 rounded-lg border border-emerald-500/30 text-[11px] text-emerald-300 flex items-start gap-1.5">
            <Volume2 className="w-4 h-4 shrink-0 mt-0.5 animate-pulse text-emerald-400" />
            <p className="line-clamp-2 italic">{spokenAudioText}</p>
          </div>
        )}

        {/* Call Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            id="ivr-call-btn"
            onClick={handleStartCall}
            disabled={isCallActive || loading}
            className={`btn-press py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-md ${
              isCallActive
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/30'
            }`}
          >
            <Phone className="w-4 h-4" />
            <span>CALL (1800)</span>
          </button>

          <button
            id="ivr-end-btn"
            onClick={handleEndCall}
            disabled={!isCallActive}
            className={`btn-press py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-md ${
              !isCallActive
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/30'
            }`}
          >
            <PhoneOff className="w-4 h-4" />
            <span>END CALL</span>
          </button>
        </div>

        {/* DTMF Keypad Grid */}
        <div className="grid grid-cols-3 gap-2.5 px-1">
          {keypadKeys.map((k) => (
            <button
              key={k.num}
              id={`keypad-${k.num}`}
              onClick={() => handleKeyPress(k.num)}
              className="btn-press bg-gradient-to-b from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 active:scale-95 border border-slate-600 rounded-xl py-2.5 flex flex-col items-center justify-center shadow-md shadow-slate-950/40 transition"
            >
              <span className="text-lg font-extrabold text-white leading-none">
                {k.num}
              </span>
              <span className="text-[9px] font-medium text-slate-400 tracking-wider">
                {k.sub}
              </span>
            </button>
          ))}
        </div>

        {/* Dispatched SMS toast preview */}
        {lastSms && (
          <div className="mt-3 p-2 bg-amber-500/20 border border-amber-500/40 rounded-xl text-[11px] text-amber-200 flex items-start gap-1.5">
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
