import React, { useState } from 'react';
import { 
  Bot, Send, Sparkles, Volume2, ShieldCheck, CheckCircle2, 
  HelpCircle, ArrowRight, CornerDownRight 
} from 'lucide-react';
import { AIChatMessage, Booking } from '../types';
import { api } from '../services/api';
import { speakIvrText } from '../services/audioService';
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
        ? "नमस्ते रमेश जी! मैं आपका अन्नधारा AI किसान साथी हूँ। आप मुझसे केंद्र की सिफारिश, टोकन नंबर, कतार की प्रतीक्षा, जरूरी दस्तावेज या भुगतान की स्थिति के बारे में पूछ सकते हैं।"
        : "Namaste Ramesh ji! I am your Annadhara AI Saathi. Ask me about centre recommendations, your token number, queue wait times, required documents, or payment tracking.",
      timestamp: '09:00 AM'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const suggestedQuestions = [
    "Which centre has the shortest waiting time?",
    "What is my token number and queue wait time?",
    "What documents do I need to bring?",
    "What is my procurement payment status?",
    "How can I reschedule my slot to tomorrow?",
    "What is the maximum moisture allowed for wheat?"
  ];

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
          text: "I am having difficulty retrieving current records. Please verify network connection.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto pb-20 md:pb-8 flex flex-col h-[calc(100vh-140px)] min-h-[550px]">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <div className="w-11 h-11 rounded-2xl bg-white border border-emerald-200 p-1 flex items-center justify-center shadow-md shrink-0">
            <img 
              src="/logo-icon.png" 
              alt="ANNADHARA AI" 
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-extrabold text-base sm:text-lg text-slate-900">
                ANNADHARA AI Farmer Assistant
              </h1>
              <span className="bg-teal-100 text-teal-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-teal-300">
                RAG + ACTION ROUTER
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Verified MSP guidelines, live queue lookups, and advisory checklists
            </p>
          </div>
        </div>
      </div>

      {/* Suggested Questions Carousel */}
      <div className="py-2.5 overflow-x-auto flex gap-2 no-scrollbar">
        {suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="btn-press whitespace-nowrap text-xs font-medium bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-3 py-1.5 rounded-xl shadow-xs transition shrink-0"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 py-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-8 h-8 rounded-xl bg-white border border-emerald-200 p-0.5 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                <img 
                  src="/logo-icon.png" 
                  alt="AI Assistant" 
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            <div className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
              msg.sender === 'user'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-800 shadow-sm'
            }`}>
              
              {/* Spoken Text button for Assistant */}
              {msg.sender === 'assistant' && (
                <div className="flex justify-between items-center mb-1 text-[11px] text-slate-400">
                  <span className="font-semibold text-teal-700">Annadhara Saathi</span>
                  <button
                    onClick={() => speakIvrText(msg.text, language)}
                    className="p-1 hover:text-teal-700 rounded transition"
                    title="Read aloud in voice"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-slate-400 hover:text-teal-600" />
                  </button>
                </div>
              )}

              <p className="whitespace-pre-line text-xs font-normal">
                {msg.text}
              </p>

              {/* Action Router execution badge */}
              {msg.action_taken && (
                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[10px] text-teal-800 font-mono bg-teal-50/80 p-1.5 rounded-lg border border-teal-200/80">
                  <CornerDownRight className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span>Action Router: <strong>{msg.action_taken}</strong> verified</span>
                </div>
              )}

              {/* RAG Knowledge Citations */}
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-2 text-[10px] text-slate-400 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>Source: {msg.sources.join(', ')}</span>
                </div>
              )}

              <div className={`text-[9px] mt-1.5 text-right ${
                msg.sender === 'user' ? 'text-emerald-200' : 'text-slate-400'
              }`}>
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-slate-400 italic py-2">
            <Sparkles className="w-4 h-4 animate-spin text-teal-600" />
            <span>Analyzing procurement database & guidelines...</span>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
        className="pt-2 border-t border-slate-200 flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={language === 'hi' ? "अपना सवाल यहाँ पूछें... (उदा: सबसे कम प्रतीक्षा वाला केंद्र कौन सा है?)" : "Ask a question (e.g. Which centre has the shortest waiting time?)"}
          className="flex-1 text-xs sm:text-sm p-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:outline-hidden shadow-xs"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="btn-press p-3 bg-teal-700 hover:bg-teal-800 disabled:opacity-40 text-white rounded-xl shadow-md transition"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
};
