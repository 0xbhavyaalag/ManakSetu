import React, { useState } from 'react';
import { 
  Bot, Send, Sparkles, Volume2, ShieldCheck, CheckCircle2, 
  HelpCircle, ArrowRight, CornerDownRight, Mic, MicOff, Wheat,
  Clock, DollarSign, FileCheck, RefreshCw, Radio
} from 'lucide-react';
import { AIChatMessage, Booking } from '../types';
import { api } from '../services/api';
import { speakIvrText, stopSpeaking } from '../services/audioService';
import { useLanguage } from '../hooks/useLanguage';

interface AIAssistantPageProps {
  booking: Booking | null;
}

export const AIAssistantPage: React.FC<AIAssistantPageProps> = ({ booking }) => {
  const { language } = useLanguage();
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: '1',
      sender: 'assistant',
      text: language === 'hi' 
        ? "नमस्ते रमेश जी! 🙏 मैं आपका अन्नधारा AI किसान साथी हूँ। आप मुझसे केंद्र की सिफारिश, टोकन नंबर, कतार की प्रतीक्षा, जरूरी दस्तावेज या भुगतान की स्थिति के बारे में पूछ सकते हैं।"
        : "Namaste Ramesh ji! 🙏 I am your Annadhara AI Saathi. Ask me about centre recommendations, your token number, queue wait times, required documents, or payment tracking.",
      timestamp: '09:00 AM'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [currentlySpeakingId, setCurrentlySpeakingId] = useState<string | null>(null);

  const categories = [
    {
      label: language === 'hi' ? '🌾 फसल व गुणवत्ता' : '🌾 Crop & Quality',
      query: language === 'hi' ? "गेहूं के लिए अधिकतम स्वीकार्य नमी कितनी है?" : "What is the maximum moisture allowed for wheat?"
    },
    {
      label: language === 'hi' ? '⏱️ टोकन व कतार' : '⏱️ Token & Queue',
      query: language === 'hi' ? "मेरा टोकन नंबर और अनुमानित प्रतीक्षा समय क्या है?" : "What is my token number and queue wait time?"
    },
    {
      label: language === 'hi' ? '🏢 निकटतम केंद्र' : '🏢 Best Centre',
      query: language === 'hi' ? "किस खरीद केंद्र पर सबसे कम प्रतीक्षा समय है?" : "Which centre has the shortest waiting time?"
    },
    {
      label: language === 'hi' ? '📄 जरूरी दस्तावेज' : '📄 Required Docs',
      query: language === 'hi' ? "केंद्र पर मुझे कौन से दस्तावेज लाने होंगे?" : "What documents do I need to bring?"
    },
    {
      label: language === 'hi' ? '💰 DBT भुगतान' : '💰 DBT Payout',
      query: language === 'hi' ? "मेरी खरीद का भुगतान कब तक खाते में आएगा?" : "What is my procurement payment status?"
    }
  ];

  const handleSpeechPlay = (msgId: string, text: string) => {
    if (currentlySpeakingId === msgId) {
      stopSpeaking();
      setCurrentlySpeakingId(null);
    } else {
      stopSpeaking();
      setCurrentlySpeakingId(msgId);
      speakIvrText(text, language);
      // Auto-reset speaking state after estimated duration
      setTimeout(() => {
        setCurrentlySpeakingId(null);
      }, Math.max(3000, text.length * 60));
    }
  };

  const handleVoiceInputSim = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }
    setIsListening(true);
    // Simulate smart voice recognition with gentle typing effect
    const sampleQuery = language === 'hi' 
      ? "क्या आज मेरी बारी 12 बजे तक आ जाएगी?" 
      : "Will my turn come before 12 PM today?";
    
    setTimeout(() => {
      setInput(sampleQuery);
      setIsListening(false);
    }, 1800);
  };

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    const userMsg: AIChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.chatAI(text, language, booking?.id);
      const botMsg: AIChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: res.reply,
        intent: res.intent,
        action_taken: res.action_taken,
        action_result: res.action_result,
        sources: res.sources,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: language === 'hi' 
            ? "क्षमा करें, सर्वर से संपर्क नहीं हो पाया। कृपया पुनः प्रयास करें।"
            : "I am having difficulty retrieving current records. Please verify network connection.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 md:pb-8 flex flex-col h-[calc(100vh-140px)] min-h-[580px]">
      
      {/* Header with AI Saathi Badge & Live Status */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-slate-200 shadow-xs mb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 p-0.5 shadow-md flex items-center justify-center text-white">
              <Bot className="w-6 h-6" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-base sm:text-lg text-slate-900 font-display">
                ANNADHARA AI Saathi (किसान साथी)
              </h1>
              <span className="bg-gradient-to-r from-emerald-100 to-teal-100 text-teal-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-teal-300">
                ACTIVE RAG + IVR
              </span>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
              <span>🌾 MSP ₹2,275/q Guard</span>
              <span>•</span>
              <span className="text-emerald-700 font-semibold">⚡ Real-time Queue Intelligence</span>
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 bg-emerald-50 text-emerald-800 text-xs px-3 py-1.5 rounded-xl border border-emerald-200">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
          <span className="font-semibold">Bilingual English / हिन्दी</span>
        </div>
      </div>

      {/* Suggested Questions Quick Carousel */}
      <div className="pb-3 overflow-x-auto flex gap-2 no-scrollbar">
        {categories.map((item, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(item.query)}
            className="btn-press whitespace-nowrap text-xs font-semibold bg-white hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 text-slate-700 border border-slate-200 px-3.5 py-1.5 rounded-xl shadow-xs transition shrink-0 flex items-center gap-1.5"
          >
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 py-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                <Bot className="w-5 h-5" />
              </div>
            )}

            <div className={`max-w-[85%] rounded-3xl p-4 text-xs sm:text-sm leading-relaxed ${
              msg.sender === 'user'
                ? 'bg-gradient-to-r from-emerald-700 to-emerald-800 text-white shadow-md rounded-tr-xs'
                : 'bg-white border border-slate-200/90 text-slate-800 shadow-sm rounded-tl-xs'
            }`}>
              
              {/* Spoken Text Audio Controller for Assistant */}
              {msg.sender === 'assistant' && (
                <div className="flex justify-between items-center mb-2 pb-1.5 border-b border-slate-100 text-[11px]">
                  <span className="font-bold text-teal-700 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-teal-500" />
                    Annadhara AI Assistant
                  </span>

                  <button
                    onClick={() => handleSpeechPlay(msg.id, msg.text)}
                    className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-lg border border-emerald-200 transition font-medium"
                    title="Audio Readout (आवाज में सुनें)"
                  >
                    {currentlySpeakingId === msg.id ? (
                      <>
                        <div className="flex items-center gap-0.5 h-3">
                          <span className="w-1 bg-emerald-600 rounded-full wave-bar-1"></span>
                          <span className="w-1 bg-emerald-600 rounded-full wave-bar-2"></span>
                          <span className="w-1 bg-emerald-600 rounded-full wave-bar-3"></span>
                          <span className="w-1 bg-emerald-600 rounded-full wave-bar-4"></span>
                        </div>
                        <span className="text-[10px] font-bold">Speaking...</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-[10px] font-bold">सुनें / Listen</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              <p className="whitespace-pre-line font-normal leading-relaxed">
                {msg.text}
              </p>

              {/* Action Router Execution Badge */}
              {msg.action_taken && (
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-2 text-xs text-teal-900 font-mono bg-teal-50/90 p-2 rounded-xl border border-teal-200">
                  <CornerDownRight className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Verified Action: <strong>{msg.action_taken}</strong></span>
                </div>
              )}

              {/* RAG Knowledge Citations */}
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-2.5 pt-1.5 flex items-center gap-1.5 text-[11px] text-slate-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="font-medium">Sources: {msg.sources.join(', ')}</span>
                </div>
              )}

              <div className={`text-[10px] mt-2 text-right ${
                msg.sender === 'user' ? 'text-emerald-200' : 'text-slate-400'
              }`}>
                {msg.timestamp}
              </div>
            </div>

            {msg.sender === 'user' && (
              <div className="w-9 h-9 rounded-2xl bg-slate-800 text-emerald-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                RK
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-3 bg-white p-3.5 rounded-2xl border border-emerald-100 shadow-xs max-w-sm">
            <Sparkles className="w-5 h-5 animate-spin text-emerald-600" />
            <div className="text-xs text-slate-600 font-medium">
              Consulting Mandi Live Queue & MSP records...
            </div>
          </div>
        )}
      </div>

      {/* Voice input prompter if listening */}
      {isListening && (
        <div className="mb-2 p-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-xl flex items-center justify-between shadow-md animate-pulse">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <Radio className="w-4 h-4 animate-ping text-white" />
            <span>Listening... बोलिए, हम सुन रहे हैं...</span>
          </div>
          <button
            onClick={() => setIsListening(false)}
            className="text-[10px] bg-white/20 px-2 py-0.5 rounded-md hover:bg-white/30"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Input Form with Voice Dictation */}
      <form
        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
        className="pt-2 border-t border-slate-200 flex items-center gap-2"
      >
        <button
          type="button"
          onClick={handleVoiceInputSim}
          className={`btn-press p-3 rounded-2xl border transition shadow-xs flex items-center justify-center ${
            isListening
              ? 'bg-rose-600 text-white border-rose-700 ring-2 ring-rose-400'
              : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
          }`}
          title={isListening ? 'Stop Listening' : 'Speak your query (आवाज से पूछें)'}
        >
          {isListening ? <MicOff className="w-4 h-4 text-white" /> : <Mic className="w-4 h-4 text-emerald-700" />}
        </button>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={language === 'hi' 
            ? "अपना सवाल यहाँ पूछें... (उदा: आज केंद्र पर कितना समय लगेगा?)" 
            : "Ask a question (e.g. Which centre has shortest wait time?)"}
          className="flex-1 text-xs sm:text-sm p-3.5 bg-white border border-slate-300 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden shadow-xs"
        />

        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="btn-press p-3.5 bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-800 hover:to-teal-800 disabled:opacity-40 text-white rounded-2xl shadow-md transition"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
};

