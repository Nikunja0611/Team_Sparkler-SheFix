import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, MapPin, Star, Calendar, User, Briefcase, 
  Wallet, Bell, CheckCircle, Search, Mic, Globe, LogOut, Filter, X
} from 'lucide-react';
import VoiceCommand from '../components/VoiceCommand';

const Dashboard = () => {
  const navigate = useNavigate();
  
  // --- STATE ---
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('feed'); 
  const [language, setLanguage] = useState('en'); 
  
  // --- NEW FILTERS STATE ---
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [minPayFilter, setMinPayFilter] = useState(0);
  const [showFilters, setShowFilters] = useState(false); // Toggle filter menu

  // Worker Stats
  const [stats, setStats] = useState({ earnings: 1200, jobsDone: 14, safetyScore: 98 });

  // Mock Data
  const [availableJobs, setAvailableJobs] = useState([
    { id: 1, title: "House Cleaning", loc: "Sector 12, Navi Mumbai", pay: 300, type: "Cleaning", time: "2 Hours", safety: "Verified" },
    { id: 2, title: "Cooking (Dinner)", loc: "Nerul, Mumbai", pay: 500, type: "Cooking", time: "3 Hours", safety: "Verified" },
    { id: 3, title: "Elderly Care", loc: "Vashi, Mumbai", pay: 800, type: "Care", time: "Full Day", safety: "Pending" },
    { id: 4, title: "Bathroom Cleaning", loc: "Belapur, Mumbai", pay: 400, type: "Cleaning", time: "1 Hour", safety: "Verified" },
    { id: 5, title: "Office Dusting", loc: "Vashi, Mumbai", pay: 600, type: "Cleaning", time: "4 Hours", safety: "Verified" },
  ]);

  const [mySchedule, setMySchedule] = useState([]);

  // Mock Seekers Data
  const topWorkers = [
    { id: 101, name: "Riya Patel", role: "Electrician", rating: 4.9, jobs: 50, verified: true, img: 30 },
    { id: 102, name: "Sunita Devi", role: "Maid / Cleaner", rating: 4.7, jobs: 120, verified: true, img: 45 },
    { id: 103, name: "Anjali Singh", role: "Caregiver", rating: 5.0, jobs: 20, verified: true, img: 12 },
  ];

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo) navigate('/login');
    else setUser(userInfo);
  }, [navigate]);

  // --- HANDLERS ---
  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/');
  };

  const handleVoiceCommand = (command) => {
    if (!command) return;
    const cmd = command.toLowerCase();
    alert(`🎤 Voice Command: "${command}"`);
    
    if (cmd.includes("clean")) setSearchQuery("Cleaning");
    else if (cmd.includes("cook")) setSearchQuery("Cooking");
    else if (cmd.includes("vashi")) setLocationFilter("Vashi");
    else if (cmd.includes("reset")) { setSearchQuery(""); setLocationFilter(""); }
  };

  const acceptJob = (job) => {
    if (job.safety !== "Verified") {
      alert("⚠️ Safety Alert: Verification Pending. Proceed with caution.");
      return;
    }
    setAvailableJobs(availableJobs.filter(j => j.id !== job.id));
    setMySchedule([...mySchedule, job]);
    setStats(prev => ({ ...prev, jobsDone: prev.jobsDone + 1, earnings: prev.earnings + job.pay }));
    alert("✅ Job Accepted!");
  };

  // --- FILTER LOGIC ---
  const filteredJobs = (activeTab === 'feed' ? availableJobs : mySchedule).filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || job.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = locationFilter ? job.loc.toLowerCase().includes(locationFilter.toLowerCase()) : true;
    const matchesPay = job.pay >= minPayFilter;
    return matchesSearch && matchesLocation && matchesPay;
  });

  if (!user) return null;
  const isWorker = user.role === 'worker';

  return (
    <div className="min-h-screen bg-gray-50 pb-24 font-sans text-gray-800">
      
      {/* --- NAVBAR --- */}
      <div className="bg-white px-6 py-4 shadow-sm flex justify-between items-center sticky top-0 z-40 border-b border-gray-100">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <Shield className="w-6 h-6 text-shePurple fill-current" />
          <h1 className="text-2xl font-bold text-shePurple hidden md:block">She-Fix</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <button onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')} className="p-2 bg-gray-100 rounded-full text-gray-600 hover:text-shePurple transition">
            <Globe className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-gray-900">{user.name}</p>
              <p className="text-xs text-shePurple capitalize">{user.role}</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-shePurple to-shePink rounded-full flex items-center justify-center text-white font-bold border-2 border-white shadow-sm">
              {user.name.charAt(0)}
            </div>
            <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 ml-2"><LogOut className="w-5 h-5" /></button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        
        {/* ================= WORKER DASHBOARD ================= */}
        {isWorker && (
          <>
            {/* 1. Hero Section (Fixed Text Color) */}
            <div className="bg-gradient-to-r from-shePurple to-purple-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                {/* Explicit text-white class ensures visibility */}
                <h2 className="text-3xl font-bold mb-2 text-white">
                  Namaste, {user.name}! 🙏
                </h2>
                <p className="text-purple-100 opacity-90 mb-6">Tap the mic to find work instantly.</p>
                
                <div className="flex flex-wrap gap-4">
                  <div className="bg-white/20 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10">
                    <p className="text-xs text-purple-100 uppercase tracking-wider">Earnings</p>
                    <p className="text-2xl font-bold text-white">₹{stats.earnings}</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10">
                    <p className="text-xs text-purple-100 uppercase tracking-wider">Jobs Done</p>
                    <p className="text-2xl font-bold text-white">{stats.jobsDone}</p>
                  </div>
                  <div className="bg-green-500/20 backdrop-blur-md px-5 py-3 rounded-2xl border border-green-400/30 flex items-center gap-3">
                    <div>
                      <p className="text-xs text-green-100 uppercase tracking-wider">Safety Score</p>
                      <p className="text-2xl font-bold text-green-300">{stats.safetyScore}%</p>
                    </div>
                    <Shield className="w-8 h-8 text-green-300 opacity-80" />
                  </div>
                </div>
              </div>
              <div className="absolute right-0 bottom-0 w-64 h-64 bg-white opacity-5 rounded-full translate-x-1/3 translate-y-1/3"></div>
            </div>

            {/* 2. Controls & Filters */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              {/* Tabs */}
              <div className="flex gap-2 bg-white p-1 rounded-xl shadow-sm border border-gray-100">
                <button 
                  onClick={() => setActiveTab('feed')}
                  className={`px-6 py-2 rounded-lg font-bold text-sm transition ${activeTab === 'feed' ? 'bg-shePurple text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  Jobs Feed
                </button>
                <button 
                  onClick={() => setActiveTab('schedule')}
                  className={`px-6 py-2 rounded-lg font-bold text-sm transition ${activeTab === 'schedule' ? 'bg-shePurple text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  My Schedule <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs ml-1">{mySchedule.length}</span>
                </button>
              </div>

              {/* Search & Filter Toggle */}
              <div className="flex gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input 
                    type="text" 
                    placeholder="Search 'Cleaning'..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-shePurple focus:ring-2 focus:ring-purple-100 outline-none transition"
                  />
                </div>
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className={`p-2.5 rounded-xl border border-gray-200 transition ${showFilters ? 'bg-shePurple text-white border-shePurple' : 'bg-white text-gray-600 hover:border-shePurple'}`}
                >
                  <Filter className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* 3. Advanced Filters Panel */}
            {showFilters && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-4 animate-fadeIn">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Location</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Vashi, Nerul"
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="w-full p-3 rounded-xl border border-gray-200 focus:border-shePurple outline-none bg-gray-50 focus:bg-white transition"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Min Charges</label>
                  <select 
                    value={minPayFilter}
                    onChange={(e) => setMinPayFilter(Number(e.target.value))}
                    className="w-full p-3 rounded-xl border border-gray-200 focus:border-shePurple outline-none bg-gray-50 focus:bg-white transition"
                  >
                    <option value="0">Any Amount</option>
                    <option value="300">₹300+</option>
                    <option value="500">₹500+</option>
                    <option value="1000">₹1000+</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button 
                    onClick={() => { setLocationFilter(''); setMinPayFilter(0); setSearchQuery(''); }}
                    className="w-full py-3 text-red-500 font-bold hover:bg-red-50 rounded-xl transition border border-transparent hover:border-red-100"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            )}

            {/* 4. Jobs List */}
            <div className="space-y-4">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <div key={job.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center hover:shadow-md transition gap-4 group">
                    <div className="flex items-center gap-4 w-full">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition ${
                        job.type === 'Cleaning' ? 'bg-blue-50' : job.type === 'Cooking' ? 'bg-orange-50' : 'bg-purple-50'
                      }`}>
                        {job.type === 'Cleaning' ? '🧹' : job.type === 'Cooking' ? '🍳' : '👵'}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 text-lg">{job.title}</h4>
                        <div className="flex flex-wrap gap-3 mt-1 text-sm text-gray-500">
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.loc}</span>
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {job.time}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                      <div className="text-right">
                        <p className="text-lg font-bold text-shePurple">₹{job.pay}</p>
                        {job.safety === 'Verified' && (
                          <span className="text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded border border-green-100 flex items-center gap-1 justify-end">
                            <Shield className="w-3 h-3" /> Safe
                          </span>
                        )}
                      </div>
                      
                      {activeTab === 'feed' ? (
                        <button 
                          onClick={() => acceptJob(job)}
                          className="bg-shePurple text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-purple-800 transition shadow-lg shadow-purple-200"
                        >
                          Accept
                        </button>
                      ) : (
                        <div className="bg-green-50 text-green-700 px-4 py-2 rounded-xl flex items-center gap-2 font-bold text-sm">
                          <CheckCircle className="w-4 h-4" /> Accepted
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                  <div className="text-4xl mb-4">🔍</div>
                  <h3 className="text-lg font-bold text-gray-900">No jobs found</h3>
                  <p className="text-gray-500">Try adjusting your filters or search terms.</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* ================= SEEKER DASHBOARD ================= */}
        {!isWorker && (
          <div className="space-y-8 animate-fadeIn">
            {/* Same Seeker View as before - Kept minimal for brevity, 
                let me know if you want upgrades here too! */}
            <div className="bg-shePink/20 rounded-3xl p-8 text-center border border-shePink/30">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Find Trusted Help, Instantly.</h2>
              <div className="relative max-w-lg mx-auto mt-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input type="text" placeholder="Search for 'Electrician'..." className="w-full pl-12 pr-4 py-4 rounded-2xl border-none shadow-lg focus:ring-2 focus:ring-shePurple outline-none" />
              </div>
            </div>
            
            {/* Categories */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {['Electrician', 'Plumber', 'Caregiver', 'Cleaner', 'Cook', 'Painter'].map((cat) => (
                <div key={cat} className="bg-white p-4 rounded-2xl shadow-sm text-center border border-gray-100 hover:border-shePurple hover:shadow-md transition cursor-pointer">
                  <span className="text-sm font-bold text-gray-700">{cat}</span>
                </div>
              ))}
            </div>

            {/* Workers List */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topWorkers.map((worker) => (
                <div key={worker.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-2xl bg-cover" style={{backgroundImage: `url(https://randomuser.me/api/portraits/women/${worker.img}.jpg)`}}></div>
                    <div>
                      <h4 className="font-bold text-gray-900">{worker.name}</h4>
                      <p className="text-sm text-shePurple font-medium">{worker.role}</p>
                      <div className="flex items-center gap-1 mt-1 text-sm font-bold text-gray-700">⭐ {worker.rating}</div>
                    </div>
                  </div>
                  <button className="w-full mt-4 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-shePurple transition">Book Now</button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {isWorker && <VoiceCommand onCommand={handleVoiceCommand} />}
    </div>
  );
};

export default Dashboard;