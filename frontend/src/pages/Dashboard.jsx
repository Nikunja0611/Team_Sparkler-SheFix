import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, MapPin, Star, Calendar, User, Briefcase, 
  Wallet, Bell, CheckCircle, Search, Mic, Globe, LogOut, Heart
} from 'lucide-react';
import VoiceCommand from '../components/VoiceCommand';

const Dashboard = () => {
  const navigate = useNavigate();
  
  // --- STATE ---
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('feed'); // 'feed' | 'schedule'
  const [language, setLanguage] = useState('en'); // 'en' | 'hi'
  const [filter, setFilter] = useState('');
  
  // Worker Stats (Mocked for now, connect to DB endpoint /api/stats later)
  const [stats, setStats] = useState({ earnings: 1200, jobsDone: 14, safetyScore: 98 });

  // Mock Data: Jobs available for Worker
  const [availableJobs, setAvailableJobs] = useState([
    { id: 1, title: "House Cleaning", loc: "Sector 12, Navi Mumbai", pay: 300, type: "Cleaning", time: "10:00 AM", safety: "Verified" },
    { id: 2, title: "Cooking (Dinner)", loc: "Nerul, Mumbai", pay: 500, type: "Cooking", time: "6:00 PM", safety: "Verified" },
    { id: 3, title: "Elderly Care", loc: "Vashi, Mumbai", pay: 800, type: "Care", time: "Day Shift", safety: "Pending" },
    { id: 4, title: "Bathroom Cleaning", loc: "Belapur, Mumbai", pay: 400, type: "Cleaning", time: "2:00 PM", safety: "Verified" },
  ]);

  const [mySchedule, setMySchedule] = useState([]);

  // Mock Data: Top Workers for Seekers
  const topWorkers = [
    { id: 101, name: "Riya Patel", role: "Electrician", rating: 4.9, jobs: 50, verified: true, img: 30 },
    { id: 102, name: "Sunita Devi", role: "Maid / Cleaner", rating: 4.7, jobs: 120, verified: true, img: 45 },
    { id: 103, name: "Anjali Singh", role: "Caregiver", rating: 5.0, jobs: 20, verified: true, img: 12 },
  ];

  // --- INITIALIZATION ---
  useEffect(() => {
    // 1. Get User Data from LocalStorage (Connected to MongoDB Login)
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    
    if (!userInfo) {
      navigate('/login'); // Redirect if not logged in
    } else {
      setUser(userInfo);
    }
  }, [navigate]);

  // --- HANDLERS ---

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/');
  };

  const handleVoiceCommand = (command) => {
    if (!command) return;
    const cmd = command.toLowerCase();
    alert(`🎤 Voice Command Recognized: "${command}"`);
    
    // Voice Logic
    if (cmd.includes("clean") || cmd.includes("safai")) setFilter("Cleaning");
    else if (cmd.includes("cook") || cmd.includes("khana")) setFilter("Cooking");
    else if (cmd.includes("my jobs") || cmd.includes("kaam")) setActiveTab("schedule");
    else if (cmd.includes("home") || cmd.includes("ghar")) setFilter("");
  };

  const acceptJob = (job) => {
    if (job.safety !== "Verified") {
      alert("⚠️ Safety Alert: This household's verification is pending. Proceed with caution.");
      return;
    }
    setAvailableJobs(availableJobs.filter(j => j.id !== job.id));
    setMySchedule([...mySchedule, job]);
    setStats(prev => ({ ...prev, jobsDone: prev.jobsDone + 1, earnings: prev.earnings + job.pay }));
    alert("✅ Job Accepted! Added to your schedule.");
  };

  // Prevent render until user is loaded
  if (!user) return null;

  const isWorker = user.role === 'worker';

  // Translation Dictionary
  const t = {
    welcome: language === 'en' ? `Namaste, ${user.name}!` : `नमस्ते, ${user.name}!`,
    subtitle: language === 'en' ? "Tap the mic or browse jobs near you." : "माइक टैप करें या अपने पास के काम देखें।",
    earnings: language === 'en' ? "Earnings" : "कमाई",
    jobs: language === 'en' ? "Jobs Done" : "काम पूरे किए",
    safety: language === 'en' ? "Safety Score" : "सुरक्षा स्कोर",
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 font-sans text-gray-800">
      
      {/* --- NAVBAR --- */}
      <div className="bg-white px-6 py-4 shadow-sm flex justify-between items-center sticky top-0 z-40">
        <div className="flex items-center gap-2" onClick={() => navigate('/')}>
          <Shield className="w-6 h-6 text-shePurple fill-current" />
          <h1 className="text-2xl font-bold text-shePurple hidden md:block">She-Fix</h1>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Language Toggle */}
          <button 
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-pink-50 hover:text-shePurple transition"
          >
            <Globe className="w-5 h-5" />
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-gray-900">{user.name}</p>
              <p className="text-xs text-shePurple capitalize">{user.role}</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-shePurple to-shePink rounded-full flex items-center justify-center text-white font-bold border-2 border-white shadow-sm">
              {user.name.charAt(0)}
            </div>
            
            {/* Logout */}
            <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        
        {/* ================= WORKER DASHBOARD ================= */}
        {isWorker && (
          <>
            {/* 1. Stats Banner */}
            <div className="bg-gradient-to-r from-shePurple to-purple-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-3xl font-bold mb-2">{t.welcome} 🙏</h2>
                <p className="opacity-90 mb-6">{t.subtitle}</p>
                
                <div className="flex flex-wrap gap-4">
                  <div className="bg-white/20 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10">
                    <p className="text-xs text-purple-200 uppercase tracking-wider">{t.earnings}</p>
                    <p className="text-2xl font-bold">₹{stats.earnings}</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10">
                    <p className="text-xs text-purple-200 uppercase tracking-wider">{t.jobs}</p>
                    <p className="text-2xl font-bold">{stats.jobsDone}</p>
                  </div>
                  <div className="bg-green-500/20 backdrop-blur-md px-5 py-3 rounded-2xl border border-green-400/30 flex items-center gap-3">
                    <div>
                      <p className="text-xs text-green-100 uppercase tracking-wider">{t.safety}</p>
                      <p className="text-2xl font-bold text-green-300">{stats.safetyScore}%</p>
                    </div>
                    <Shield className="w-8 h-8 text-green-300 opacity-80" />
                  </div>
                </div>
              </div>
              {/* Decoration */}
              <div className="absolute right-0 bottom-0 w-64 h-64 bg-white opacity-5 rounded-full translate-x-1/3 translate-y-1/3"></div>
            </div>

            {/* 2. Tabs */}
            <div className="flex gap-4 border-b border-gray-200 pb-1">
              <button 
                onClick={() => setActiveTab('feed')}
                className={`px-6 py-3 font-bold text-sm transition border-b-2 ${activeTab === 'feed' ? 'border-shePurple text-shePurple' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              >
                Jobs Near You
              </button>
              <button 
                onClick={() => setActiveTab('schedule')}
                className={`px-6 py-3 font-bold text-sm transition border-b-2 ${activeTab === 'schedule' ? 'border-shePurple text-shePurple' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              >
                My Schedule <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-xs ml-1">{mySchedule.length}</span>
              </button>
            </div>

            {/* 3. Content */}
            <div className="space-y-4 animate-fadeIn">
              {(activeTab === 'feed' ? availableJobs : mySchedule)
                .filter(job => !filter || job.title.toLowerCase().includes(filter.toLowerCase()))
                .map((job) => (
                <div key={job.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center hover:shadow-md transition gap-4">
                  <div className="flex items-center gap-4 w-full">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${
                      job.type === 'Cleaning' ? 'bg-blue-50 text-blue-500' : job.type === 'Cooking' ? 'bg-orange-50 text-orange-500' : 'bg-purple-50 text-purple-500'
                    }`}>
                      {job.type === 'Cleaning' ? '🧹' : job.type === 'Cooking' ? '🍳' : '👵'}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 text-lg">{job.title}</h4>
                      <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" /> {job.loc}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <span className="bg-pink-50 text-shePurple text-xs px-2 py-1 rounded font-bold">₹{job.pay}</span>
                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded flex items-center gap-1"><Calendar className="w-3 h-3" /> {job.time}</span>
                        {job.safety === 'Verified' && (
                          <span className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded flex items-center gap-1 border border-green-100">
                            <Shield className="w-3 h-3" /> Safe Household
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {activeTab === 'feed' ? (
                    <button 
                      onClick={() => acceptJob(job)}
                      className="w-full md:w-auto bg-shePurple text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-purple-800 transition shadow-lg shadow-purple-200"
                    >
                      Accept Job
                    </button>
                  ) : (
                    <div className="text-green-600 flex items-center gap-2 bg-green-50 px-4 py-2 rounded-xl">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-bold text-sm">Scheduled</span>
                    </div>
                  )}
                </div>
              ))}
              
              {activeTab === 'feed' && availableJobs.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">😴</div>
                  <p className="text-gray-500 font-medium">No new jobs available. Check back later!</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* ================= SEEKER DASHBOARD ================= */}
        {!isWorker && (
          <div className="space-y-8 animate-fadeIn">
            {/* 1. Hero Section */}
            <div className="bg-shePink/20 rounded-3xl p-8 text-center border border-shePink/30">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Find Trusted Help, Instantly.</h2>
              <p className="text-gray-600 mb-6">Pink-Shield Verified Professionals for your peace of mind.</p>
              
              <div className="relative max-w-lg mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="Search for 'Electrician', 'Maid', 'Cook'..." 
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border-none shadow-lg focus:ring-2 focus:ring-shePurple outline-none"
                />
              </div>
            </div>

            {/* 2. Categories */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 px-2">Services</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {['Electrician', 'Plumber', 'Caregiver', 'Cleaner', 'Cook', 'Painter'].map((cat) => (
                  <div key={cat} className="bg-white p-4 rounded-2xl shadow-sm text-center border border-gray-100 hover:border-shePurple hover:shadow-md transition cursor-pointer group">
                    <div className="w-14 h-14 bg-purple-50 group-hover:bg-shePurple group-hover:text-white transition rounded-full mx-auto mb-3 flex items-center justify-center text-shePurple font-bold text-xl">
                      {cat[0]}
                    </div>
                    <span className="text-sm font-bold text-gray-700">{cat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Top Workers */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 px-2">Top Rated Professionals</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {topWorkers.map((worker) => (
                  <div key={worker.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition">
                    <div className="flex gap-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-2xl bg-cover shadow-inner" style={{backgroundImage: `url(https://randomuser.me/api/portraits/women/${worker.img}.jpg)`}}></div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg">{worker.name}</h4>
                        <p className="text-sm text-shePurple font-medium">{worker.role}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-bold text-gray-700">{worker.rating}</span>
                          <span className="text-xs text-gray-400">({worker.jobs} jobs)</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-1 text-green-700 bg-green-50 px-2 py-1 rounded-lg text-xs font-bold">
                        <Shield className="w-3 h-3" /> Pink-Shield Verified
                      </div>
                      <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-shePurple transition">
                        Book Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* --- VOICE COMMAND (Workers Only) --- */}
      {isWorker && (
        <VoiceCommand onCommand={handleVoiceCommand} />
      )}
    </div>
  );
};

export default Dashboard;