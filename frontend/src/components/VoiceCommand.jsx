import React, { useState, useEffect } from 'react';
import { Mic, X, Activity } from 'lucide-react';

const VoiceCommand = ({ onCommand }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    // Initialize Web Speech API
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recog = new SpeechRecognition();
      
      recog.continuous = false; // Stop after one sentence
      recog.interimResults = true; // Show results as you speak
      recog.lang = 'hi-IN'; // Default to Hindi (you can change to 'en-IN' or others)

      recog.onstart = () => setIsListening(true);
      
      recog.onresult = (event) => {
        const current = event.resultIndex;
        const transcriptText = event.results[current][0].transcript;
        setTranscript(transcriptText);
      };

      recog.onend = () => {
        setIsListening(false);
        // Automatically send command when silence is detected
        if (transcript) {
          setTimeout(() => {
            onCommand(transcript); // Send text to parent component
            setTranscript('');
          }, 1000);
        }
      };

      setRecognition(recog);
    } else {
      alert("Your browser does not support Voice Recognition. Please use Chrome.");
    }
  }, [transcript, onCommand]);

  const toggleListening = () => {
    if (isListening) {
      recognition.stop();
    } else {
      setTranscript("Listening..."); // Reset text
      recognition.start();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Pop-up Bubble */}
      {(isListening || transcript) && (
        <div className="absolute bottom-20 right-0 bg-white p-4 rounded-2xl shadow-xl border-2 border-shePurple w-72 animate-bounce-in origin-bottom-right">
          <div className="flex justify-between items-center mb-2 border-b border-gray-100 pb-2">
            <span className="text-xs font-bold text-shePurple uppercase flex items-center gap-1">
              {isListening ? (
                <>
                  <Activity className="w-3 h-3 animate-pulse" /> Live Listening...
                </>
              ) : (
                "Processing..."
              )}
            </span>
            <X className="w-4 h-4 text-gray-400 cursor-pointer hover:text-red-500" onClick={() => setIsListening(false)} />
          </div>
          
          <div className="min-h-[40px] flex items-center">
            <p className="text-gray-800 font-medium text-lg leading-snug">
              {transcript || "Say something..."}
            </p>
          </div>
          
          <div className="mt-2 text-xs text-gray-400 text-right">
            Try: "मुझे काम चाहिए" or "Jobs near me"
          </div>
        </div>
      )}

      {/* Floating Mic Button */}
      <button 
        onClick={toggleListening}
        className={`p-5 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 border-4 border-white ${
          isListening 
            ? 'bg-red-500 animate-pulse shadow-red-300' 
            : 'bg-gradient-to-r from-shePurple to-shePink shadow-purple-300'
        }`}
      >
        <Mic className={`w-8 h-8 text-white ${isListening ? 'animate-bounce' : ''}`} />
      </button>
    </div>
  );
};

export default VoiceCommand;