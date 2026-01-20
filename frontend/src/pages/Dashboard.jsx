import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, MapPin, Star, Calendar, User, Briefcase, 
  Wallet, Bell, CheckCircle, Search, Mic, Globe 
} from 'lucide-react';
import VoiceCommand from '../components/VoiceCommand';

const Dashboard = () => {
  const navigate = useNavigate();
  
  // --- STATE MANAGEMENT ---
  const [userRole, setUserRole] = useState('worker'); // Toggle: 'worker' | 'seeker'
  const [language, setLanguage] = useState('en'); // 'en' | 'hi'
  const [activeTab, setActiveTab] = useState('feed'); // 'feed' | 'schedule'
  const [filter, setFilter] = useState('');
  
  // Worker Stats
  const [stats, setStats] = useState({ earnings: 1200, jobsDone: 14, safetyScore: 98 });

  // Mock Data: Jobs available for Worker
  const [availableJobs, setAvailableJobs] = useState([
    { id: 1, title: "House Cleaning", loc: "Sector 12, Navi Mumbai", pay: 300, type: "Cleaning", time: "10:00 AM" },
    { id: 2, title: "Cooking (Dinner)", loc: "Nerul, Mumbai", pay: 500, type: "Cooking", time: "6:00 PM" },
    { id: 3, title: "Elderly Care", loc: "Vashi, Mumbai", pay: 800, type: "Care", time: "Day Shift" },
    { id: 4, title: "Bathroom Cleaning", loc: "Belapur, Mumbai", pay: 400, type: "Cleaning", time: "2:00 PM" },
  ]);

  // Mock Data: Worker's Accepted Schedule
  const [mySchedule, setMySchedule] = useState([]);

  // --- HANDLERS ---

  // 1. Voice Command Handler (Filters content)
  const handleVoiceCommand = (command) => {
    const cmd = command.toLowerCase();
    alert(`🎤 Voice Command Received: "${command}"`);
    
    if (cmd.includes("cleaning") || cmd.includes("safai")) setFilter("Cleaning");
    else if (cmd.includes("cook") || cmd.includes("khana")) setFilter("Cooking");
    else if (cmd.includes("my jobs") || cmd.includes("kaam")) setActiveTab("schedule");
    else if (cmd.includes("reset")) setFilter("");
  };

  // 2. Accept Job Handler
  const acceptJob = (job) => {
    // Remove from available, add to schedule
    setAvailableJobs(availableJobs.filter(j => j.id !== job.id));
    setMySchedule([...mySchedule, job]);
    
    // Update Stats
    setStats(prev => ({ ...prev, jobsDone: prev.jobsDone + 1, earnings: prev.earnings + job.pay }));
    
    alert(`✅ Job Accepted! Added to your schedule.`);
  };

  // 3. Translations (Simulating Bhashini)
  const t = {
    welcome: language === 'en' ? "Namaste, Savita!" : "नमस्ते, सविता!",
    subtitle: language === 'en' ? "Tap the mic or browse jobs near you." : "माइक दबाएं या अपने आस-पास काम ढूंढें।",
    jobsNearYou: language === 'en' ? "Jobs Near You" : "आपके आस-पास काम",
    mySchedule: language === 'en' ? "My Schedule" : "मेरी समय सारिणी",
    learnSkills: language === 'en' ? "Learn Skills" : "कौशल सीखें",
    earnings: language === 'en' ? "Total Earnings" : "कुल कमाई",
    accept: language === 'en' ? "Accept" : "स्वीकार करें",
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 font-sans">
      
      {/* --- TOP NAVBAR --- */}
      <div className="bg-white px-6 py-4 shadow-sm flex justify-between items-center sticky top-0 z-40">
        <h1 className="text-2xl font-bold text-shePurple">She-Fix</h1>
        
        <div className="flex items-center gap-3">
          {/* Language Toggle */}
          <button 
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-shePink/20 hover:text-shePurple transition"
          >
            <Globe className="w-5 h-5" />
          </button>

          {/* Role Toggle (For Demo Purpose) */}
          <button 
            onClick={() => setUserRole(userRole === 'worker' ? 'seeker' : 'worker')}
            className="text-xs bg-purple-100 text-shePurple px-3 py-1 rounded-full border border-purple-200"
          >
            Switch to {userRole === 'worker' ? 'Seeker' : 'Worker'}
          </button>

          <div className="w-10 h-10 bg-gray-200 rounded-full bg-cover border-2 border-green-400" 
               style={{backgroundImage: 'url(https://randomuser.me/api/portraits/women/44.jpg)'}}>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        
        {/* ================= WORKER DASHBOARD ================= */}
        {userRole === 'worker' && (
          <>
            {/* 1. Welcome Banner & Stats */}
            <div className="bg-gradient-to-r from-shePurple to-pink-500 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-3xl font-bold mb-2 flex items-center gap-2">
                  {t.welcome} 🙏
                </h2>
                <p className="opacity-90 mb-6">{t.subtitle}</p>
                
                <div className="flex gap-6">
                  <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl">
                    <p className="text-xs opacity-80">{t.earnings}</p>
                    <p className="text-xl font-bold">₹{stats.earnings}</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl">
                    <p className="text-xs opacity-80">Jobs Done</p>
                    <p className="text-xl font-bold">{stats.jobsDone}</p>
                  </div>
                  <div className="bg-green-500/30 backdrop-blur-md px-4 py-2 rounded-xl border border-green-400/50">
                    <p className="text-xs opacity-80 flex items-center gap-1"><Shield className="w-3 h-3" /> Safety Score</p>
                    <p className="text-xl font-bold">{stats.safetyScore}%</p>
                  </div>
                </div>
              </div>
              
              {/* Decorative Circle */}
              <div className="absolute -right-10 -bottom-20 w-64 h-64 bg-white opacity-10 rounded-full"></div>
            </div>

            {/* 2. Action Tabs */}
            <div className="flex gap-4">
              <button 
                onClick={() => setActiveTab('feed')}
                className={`flex-1 py-3 rounded-xl font-bold text-sm transition shadow-sm ${activeTab === 'feed' ? 'bg-white text-shePurple border-2 border-shePurple' : 'bg-gray-100 text-gray-500'}`}
              >
                {t.jobsNearYou}
              </button>
              <button 
                onClick={() => setActiveTab('schedule')}
                className={`flex-1 py-3 rounded-xl font-bold text-sm transition shadow-sm ${activeTab === 'schedule' ? 'bg-white text-shePurple border-2 border-shePurple' : 'bg-gray-100 text-gray-500'}`}
              >
                {t.mySchedule} ({mySchedule.length})
              </button>
            </div>

            {/* 3. Job Feed / Schedule List */}
            <div className="space-y-4 animate-fadeIn">
              {(activeTab === 'feed' ? availableJobs : mySchedule)
                .filter(job => !filter || job.title.toLowerCase().includes(filter.toLowerCase()))
                .map((job) => (
                <div key={job.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center hover:shadow-md transition">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                      job.type === 'Cleaning' ? 'bg-blue-100' : job.type === 'Cooking' ? 'bg-orange-100' : 'bg-purple-100'
                    }`}>
                      {job.type === 'Cleaning' ? '🧹' : job.type === 'Cooking' ? '🍳' : '👵'}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{job.title}</h4>
                      <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" /> {job.loc}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <span className="bg-pink-50 text-shePurple text-xs px-2 py-1 rounded border border-pink-100 font-bold">
                          ₹{job.pay}
                        </span>
                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {job.time}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {activeTab === 'feed' ? (
                    <button 
                      onClick={() => acceptJob(job)}
                      className="bg-shePurple text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-purple-800 transition shadow-lg shadow-purple-200"
                    >
                      {t.accept}
                    </button>
                  ) : (
                    <div className="text-green-600 flex flex-col items-center">
                      <CheckCircle className="w-6 h-6" />
                      <span className="text-xs font-bold mt-1">Scheduled</span>
                    </div>
                  )}
                </div>
              ))}

              {activeTab === 'feed' && availableJobs.length === 0 && (
                <div className="text-center py-10 text-gray-500">
                  <p>No more jobs available right now!</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* ================= SEEKER DASHBOARD ================= */}
        {userRole === 'seeker' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="text-center py-4">
              <h2 className="text-3xl font-bold text-gray-900">What help do you need?</h2>
              <p className="text-gray-500">Safe, verified female professionals at your doorstep.</p>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-3 gap-4">
              {['Electrician', 'Plumber', 'Caregiver', 'Cleaner', 'Cook', 'Painter'].map((cat) => (
                <div key={cat} className="bg-white p-4 rounded-2xl shadow-sm text-center border border-gray-100 hover:border-shePurple hover:shadow-md transition cursor-pointer group">
                  <div className="w-14 h-14 bg-purple-50 group-hover:bg-shePurple group-hover:text-white transition rounded-full mx-auto mb-3 flex items-center justify-center text-shePurple font-bold text-xl">
                    {cat[0]}
                  </div>
                  <span className="text-sm font-bold text-gray-700">{cat}</span>
                </div>
              ))}
            </div>

            {/* Safety Banner */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-4">
              <Shield className="w-8 h-8 text-green-600" />
              <div>
                <h4 className="font-bold text-green-800">Pink-Shield Active</h4>
                <p className="text-xs text-green-700">Every worker is ID & Police Verified.</p>
              </div>
            </div>

            {/* Top Workers List */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Recommended for You</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100 flex gap-4 items-center shadow-sm">
                    <div className="w-16 h-16 bg-gray-200 rounded-xl bg-cover" style={{backgroundImage: `url(https://randomuser.me/api/portraits/women/${i + 30}.jpg)`}}></div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900">Riya Patel</h4>
                      <p className="text-sm text-gray-500">Expert Electrician • 50+ Jobs</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-bold">4.9</span>
                        <span className="text-xs bg-shePurple text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Shield className="w-3 h-3" /> Verified
                        </span>
                      </div>
                    </div>
                    <button 
                      onClick={() => alert("Pink-Shield Verification Check...\n\nWorker Booked Successfully! ✅")}
                      className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-black transition"
                    >
                      Book
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* --- VOICE COMMAND (Floating) --- */}
      {userRole === 'worker' && (
        <VoiceCommand onCommand={handleVoiceCommand} />
      )}
    </div>
  );
};

export default Dashboard;