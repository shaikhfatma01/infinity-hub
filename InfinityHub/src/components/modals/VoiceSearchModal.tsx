import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Mic, Sparkles, Volume2, ArrowRight } from 'lucide-react';

export const VoiceSearchModal: React.FC = () => {
  const { 
    isVoiceModalOpen, 
    setIsVoiceModalOpen, 
    handleSearchSubmit 
  } = useApp();

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  const sampleVoicePrompts = [
    'Find black purse under ₹1000 with 4 star rating',
    'Coding laptop under ₹60000 with 16GB RAM',
    'Best double bed blanket below ₹1500',
    'Daawat basmati rice with fast delivery'
  ];

  useEffect(() => {
    if (isVoiceModalOpen) {
      let recognitionRef: any = null;
      setIsListening(true);
      setTranscript('Listening... Speak now into your microphone');

      // Attempt Browser Web Speech API
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          const recognition = new SpeechRecognition();
          recognition.continuous = false;
          recognition.interimResults = true;
          recognition.lang = 'en-IN';

          recognition.onresult = (event: any) => {
            const current = event.resultIndex;
            const text = event.results[current][0].transcript;
            setTranscript(text);
          };

          recognition.onerror = () => {
            setIsListening(false);
          };

          recognition.onend = () => {
            setIsListening(false);
          };

          recognitionRef = recognition;
          recognition.start();
        } catch (e) {
          // Fallback simulation
        }
      } else {
        // Fallback simulation after 2 seconds
        const timer = setTimeout(() => {
          setTranscript('Black purse under ₹1000 with 4+ rating');
          setIsListening(false);
        }, 2000);
        return () => clearTimeout(timer);
      }

      // Stop the microphone when the modal closes or unmounts.
      return () => {
        try { recognitionRef?.abort(); } catch { /* already stopped */ }
      };
    }
  }, [isVoiceModalOpen]);

  if (!isVoiceModalOpen) return null;

  const handleVoiceSelect = (text: string) => {
    setIsVoiceModalOpen(false);
    handleSearchSubmit(text);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-chocolate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-lg w-full p-8 shadow-soft-lg border border-pink-300 text-center animate-scale-up">
        
        {/* Close Button */}
        <button
          onClick={() => setIsVoiceModalOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-xl text-chocolate-400 hover:text-chocolate-950 hover:bg-pink-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Animated Mic Indicator */}
        <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center">
          {isListening && (
            <>
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-300 opacity-75"></span>
              <span className="animate-pulse absolute inline-flex h-20 w-20 rounded-full bg-pink-200 opacity-80"></span>
            </>
          )}
          <div className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-pink-500 to-pink-400 text-white flex items-center justify-center shadow-pink-glow">
            <Mic className="w-8 h-8 animate-bounce" />
          </div>
        </div>

        <h3 className="font-serif text-xl font-bold text-chocolate-950 mb-1">
          {isListening ? 'Listening for your shopping request...' : 'Voice Query Captured'}
        </h3>
        <p className="text-xs text-chocolate-600 mb-6">
          Describe products, brands, budgets, or store preferences naturally.
        </p>

        {/* Transcript Box */}
        <div className="bg-cream-100 p-4 rounded-2xl border border-pink-200 mb-6 text-sm font-bold text-chocolate-900 min-h-[50px] flex items-center justify-center">
          {transcript || 'Say: "Find running shoes under ₹3000"'}
        </div>

        {/* Action Button */}
        <button
          onClick={() => handleVoiceSelect(transcript)}
          className="w-full py-3 rounded-2xl bg-chocolate-900 hover:bg-chocolate-800 text-cream-50 text-xs sm:text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mb-6"
        >
          <Sparkles className="w-4 h-4 text-pink-300" />
          <span>Search with Infinity AI</span>
        </button>

        {/* Quick Sample Voice Prompts */}
        <div className="pt-4 border-t border-pink-100 text-left">
          <span className="text-[11px] font-bold text-chocolate-500 uppercase tracking-wider block mb-2">
            Or tap a voice query sample:
          </span>
          <div className="space-y-1.5">
            {sampleVoicePrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleVoiceSelect(prompt)}
                className="w-full text-left p-2 rounded-xl bg-pink-50 hover:bg-pink-100 text-xs text-chocolate-800 font-medium flex items-center justify-between transition-colors cursor-pointer border border-pink-200/60"
              >
                <span>"{prompt}"</span>
                <ArrowRight className="w-3 h-3 text-pink-600" />
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
