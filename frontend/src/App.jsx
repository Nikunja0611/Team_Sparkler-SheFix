import React, { useState } from 'react';
import VideoKYC from './components/VideoKYC';
import { registerUser } from './services/api';

function App() {
  const [user, setUser] = useState(null);
  const [showKYC, setShowKYC] = useState(false);

  const handleLogin = async () => {
    // Mock Registration
    const res = await registerUser({
      name: "Savita Devi",
      phone: "9876543210",
      role: "worker",
      language: "hi"
    });
    setUser(res.data);
    setShowKYC(true);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-shePurple text-white p-4 shadow-md flex justify-between items-center">
        <h1 className="text-2xl font-bold">She-Fix 🛡️</h1>
        <button className="bg-shePink text-shePurple px-4 py-2 rounded-full font-bold">
          English / हिंदी
        </button>
      </header>

      {/* Main Content */}
      <main className="p-4 max-w-md mx-auto">
        {!user ? (
          <div className="text-center mt-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Find Work. Be Safe.</h2>
            <button 
              onClick={handleLogin}
              className="w-full bg-shePurple text-white py-3 rounded-lg text-xl shadow-lg hover:bg-purple-800 transition"
            >
              Login with Mobile
            </button>
          </div>
        ) : showKYC ? (
          <VideoKYC userId={user._id} onVerified={() => setShowKYC(false)} />
        ) : (
          <div className="mt-10">
            <h2 className="text-2xl font-bold text-green-600 mb-4">Welcome, {user.name}! ✅</h2>
            <p className="text-gray-600">You are a verified verified technician.</p>
            
            {/* Dashboard Mockup */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="bg-shePink p-4 rounded-lg text-center">
                <span className="text-2xl">⚡</span>
                <p className="font-bold">Find Jobs</p>
              </div>
              <div className="bg-blue-100 p-4 rounded-lg text-center">
                <span className="text-2xl">🎓</span>
                <p className="font-bold">Learn Skills</p>
              </div>
            </div>

            {/* Floating Mic Button */}
            <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2">
              <button className="bg-shePurple p-4 rounded-full shadow-2xl animate-pulse">
                🎤
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;