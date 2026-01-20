import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, MapPin, Calendar, Briefcase, 
  CheckCircle, Search, Mic, Globe, LogOut, Filter, Clock, Banknote
} from 'lucide-react';
import VoiceCommand from '../components/VoiceCommand';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();
  
  // --- STATE ---
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('feed'); 
  const [language, setLanguage] = useState('en'); 
  
  // --- FILTERS STATE ---
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [serviceTypeFilter, setServiceTypeFilter] = useState('All'); // 'All', 'Short Term', 'Long Term'
  const [showFilters, setShowFilters] = useState(false);

  // Worker Stats
  const [stats, setStats] = useState({ earnings: 4500, jobsDone: 14, safetyScore: 98 });

  const [availableJobs, setAvailableJobs] = useState([]);

useEffect(() => {
  const fetchJobs = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/jobs');
      setAvailableJobs(data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  if (!userInfo) navigate('/login');
  else {
    setUser(userInfo);
    fetchJobs(); // <--- Fetch jobs when dashboard loads
  }
}, [navigate]);

  const [mySchedule, setMySchedule] = useState([]);

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
    
    if (cmd.includes("long term") || cmd.includes("mahina")) setServiceTypeFilter("Long Term");
    else if (cmd.includes("short term") || cmd.includes("ghanta")) setServiceTypeFilter("Short Term");
    else if (cmd.includes("clean")) setSearchQuery("Cleaning");
    else if (cmd.includes("cook")) setSearchQuery("Cooking");
    else if (cmd.includes("reset")) { setSearchQuery(""); setServiceTypeFilter("All"); }
  };

  const acceptJob = (job) => {
    if (job.safety !== "Verified") {
      alert("⚠️ Safety Alert: Verification Pending. Proceed with caution.");
      return;
    }
    setAvailableJobs(availableJobs.filter(j => j.id !== job.id));
    setMySchedule([...mySchedule, job]);
    
    // Logic: If hourly, add pay directly. If monthly, maybe add pro-rated amount (simplified here)
    const earningsToAdd = job.unit === 'month' ? 0 : job.pay; 
    setStats(prev => ({ ...prev, jobsDone: prev.jobsDone + 1, earnings: prev.earnings + earningsToAdd }));
    
    alert(`✅ ${job.serviceType} Job Accepted!`);
  };

  // --- FILTER LOGIC ---
  const filteredJobs = (activeTab === 'feed' ? availableJobs : mySchedule).filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || job.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = locationFilter ? job.loc.toLowerCase().includes(locationFilter.toLowerCase()) : true;
    const matchesType = serviceTypeFilter === 'All' ? true : job.serviceType === serviceTypeFilter;
    return matchesSearch && matchesLocation && matchesType;
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
            {/* 1. Hero Section */}
            <div className="bg-gradient-to-r from-shePurple to-purple-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-3xl font-bold mb-2 text-white">Namaste, {user.name}! 🙏</h2>
                <p className="text-purple-100 opacity-90 mb-6">Find daily gigs or monthly employment.</p>
                
                <div className="flex flex-wrap gap-4">
                  <div className="bg-white/20 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10">
                    <p className="text-xs text-purple-100 uppercase tracking-wider">Total Earnings</p>
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
                  New Jobs
                </button>
                <button 
                  onClick={() => setActiveTab('schedule')}
                  className={`px-6 py-2 rounded-lg font-bold text-sm transition ${activeTab === 'schedule' ? 'bg-shePurple text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  My Jobs <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs ml-1">{mySchedule.length}</span>
                </button>
              </div>

              {/* Search & Filter Toggle */}
              <div className="flex gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input 
                    type="text" 
                    placeholder="Search 'Cleaning', 'Gardener'..." 
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
                  <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Service Type</label>
                  <select 
                    value={serviceTypeFilter}
                    onChange={(e) => setServiceTypeFilter(e.target.value)}
                    className="w-full p-3 rounded-xl border border-gray-200 focus:border-shePurple outline-none bg-gray-50 focus:bg-white transition"
                  >
                    <option value="All">All Types</option>
                    <option value="Short Term">Short Term (Hourly/Daily)</option>
                    <option value="Long Term">Long Term (Monthly)</option>
                  </select>
                </div>
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
                <div className="flex items-end">
                  <button 
                    onClick={() => { setLocationFilter(''); setServiceTypeFilter('All'); setSearchQuery(''); }}
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
                      {/* Dynamic Icon Based on Category */}
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition ${
                        job.category === 'Cleaning' ? 'bg-blue-50 text-blue-500' : 
                        job.category === 'Cooking' ? 'bg-orange-50 text-orange-500' : 
                        job.category === 'Gardening' ? 'bg-green-50 text-green-600' :
                        'bg-purple-50 text-purple-500'
                      }`}>
                        {job.category === 'Cleaning' ? '🧹' : job.category === 'Cooking' ? '🍳' : job.category === 'Gardening' ? '🌱' : '👵'}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-gray-900 text-lg">{job.title}</h4>
                          {/* Service Type Badge */}
                          <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-md border ${
                            job.serviceType === 'Long Term' ? 'bg-purple-100 text-purple-700 border-purple-200' : 'bg-blue-50 text-blue-700 border-blue-100'
                          }`}>
                            {job.serviceType}
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 text-sm text-gray-500">
                          <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {job.loc}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {job.duration}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-gray-100 pt-4 md:pt-0 mt-2 md:mt-0">
                      <div className="text-right">
                        {/* Dynamic Pay Display */}
                        <p className="text-lg font-bold text-gray-900 flex items-center gap-1">
                          <Banknote className="w-4 h-4 text-gray-400" />
                          ₹{job.pay.toLocaleString()} <span className="text-xs text-gray-500 font-normal">/ {job.unit}</span>
                        </p>
                        
                        {job.safety === 'Verified' ? (
                          <span className="text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded border border-green-100 flex items-center gap-1 justify-end mt-1">
                            <Shield className="w-3 h-3" /> Pink-Shield Safe
                          </span>
                        ) : (
                          <span className="text-[10px] bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded border border-yellow-100 flex items-center gap-1 justify-end mt-1">
                            ⚠️ Verification Pending
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
                        <div className="bg-green-50 text-green-700 px-4 py-2 rounded-xl flex items-center gap-2 font-bold text-sm border border-green-100">
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
                  <p className="text-gray-500">Try adjusting your filters (Location, Service Type) or search terms.</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* ================= SEEKER DASHBOARD (Placeholder) ================= */}
        {!isWorker && (
          <div className="text-center py-20 text-gray-500">
            <Briefcase className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h2 className="text-2xl font-bold text-gray-700">Seeker Dashboard</h2>
            <p>Switch to Worker role or Log in as a Seeker to view this section.</p>
          </div>
        )}

      </div>

      {isWorker && <VoiceCommand onCommand={handleVoiceCommand} />}
    </div>
  );
};

export default Dashboard;