import React, { useState } from 'react';
import { Mic, X, MessageSquare } from 'lucide-react';

const VoiceCommand = ({ onCommand }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  const startListening = () => {
    setIsListening(true);
    // Simulating Bhashini API / Browser Speech API
    // In production, you would connect to Bhashini here
    setTimeout(() => {
      const mockCommands = [
        "Mala udya kaam pahije", // Marathi: I need work tomorrow
        "Mujhe plumbing ka kaam chahiye", // Hindi: I need plumbing work
        "Show me electrical jobs"
      ];
      const randomCmd = mockCommands[Math.floor(Math.random() * mockCommands.length)];
      setTranscript(randomCmd);
      
      // Auto-process after delay
      setTimeout(() => {
        onCommand(randomCmd);
        setIsListening(false);
        setTranscript('');
      }, 2000);
    }, 1500);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isListening && (
        <div className="absolute bottom-20 right-0 bg-white p-4 rounded-2xl shadow-xl border border-shePurple w-64 animate-bounce-in">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-shePurple uppercase">Bhashini AI Listening...</span>
            <X className="w-4 h-4 text-gray-400 cursor-pointer" onClick={() => setIsListening(false)} />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-shePink rounded-full animate-ping"></div>
            <p className="text-gray-800 font-medium italic">"{transcript || "Listening..."}"</p>
          </div>
        </div>
      )}

      <button 
        onClick={startListening}
        className={`p-4 rounded-full shadow-2xl transition-all transform hover:scale-110 ${isListening ? 'bg-red-500 animate-pulse' : 'bg-gradient-to-r from-shePurple to-pink-600'}`}
      >
        <Mic className="w-8 h-8 text-white" />
      </button>
    </div>
  );
};

export default VoiceCommand;