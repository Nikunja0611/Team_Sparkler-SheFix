import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, Calendar, Briefcase, 
  CheckCircle, Search, Globe, LogOut, Filter, Clock, Banknote,
  BookOpen, User as UserIcon, PlayCircle, Award, ChevronRight, Star,
  MessageSquare, Download, Menu, X, Shield // Shield is still used for safety badges
} from 'lucide-react';
import VoiceCommand from '../components/VoiceCommand';
import axios from 'axios';

// --- IMPORT YOUR LOGO HERE ---
// Make sure you have the file in 'frontend/src/assets/'
import sheFixLogo from '../assets/logo.png'; 

const Dashboard = () => {
  const navigate = useNavigate();
  
  // --- STATE ---
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('feed'); 
  const [language, setLanguage] = useState('en'); 
  
  // --- DATA STATE ---
  const [stats, setStats] = useState({ earnings: 4500, jobsDone: 14, safetyScore: 98 });
  const [availableJobs, setAvailableJobs] = useState([]); 
  const [workersList, setWorkersList] = useState([]);     
  const [mySchedule, setMySchedule] = useState([]);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [serviceTypeFilter, setServiceTypeFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('');

  // --- ACADEMY DATA ---
  const courses = [
    { id: 1, title: "Fan Repair Basics", duration: "15 mins", lang: "Hindi", reward: "₹50 Bonus", img: "https://images.unsplash.com/photo-1581092921461-eab62e97a783?w=400&q=80" },
    { id: 2, title: "Safe Cleaning Chemicals", duration: "10 mins", lang: "Marathi", reward: "Badge", img: "https://images.unsplash.com/photo-1584622050111-993a426fbf0a?w=400&q=80" },
  ];

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    
    if (!userInfo) {
      navigate('/login');
    } else {
      setUser(userInfo);
      if (userInfo.role === 'worker') {
        fetchJobs();
      } else {
        fetchWorkers();
      }
    }
  }, [navigate]);

  const fetchJobs = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/jobs');
      setAvailableJobs(data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  const fetchWorkers = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/users/workers');
      setWorkersList(data);
    } catch (error) {
      console.error("Error fetching workers:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/');
  };

  const handleVoiceCommand = (command) => {
    if (!command) return;
    alert(`🎤 Voice Command: "${command}"`);
  };

  const acceptJob = (job) => {
    setAvailableJobs(availableJobs.filter(j => j.id !== job.id));
    setMySchedule([...mySchedule, job]);
    alert(`✅ Job Accepted!`);
  };

  const bookWorker = (workerName) => {
    alert(`Booking Request sent to ${workerName}!`);
  };

  // --- FILTER LOGIC ---
  const filteredJobs = availableJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || job.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = locationFilter ? job.loc?.toLowerCase().includes(locationFilter.toLowerCase()) : true;
    const matchesType = serviceTypeFilter === 'All' ? true : job.serviceType === serviceTypeFilter;
    return matchesSearch && matchesLocation && matchesType;
  });

  const filteredWorkers = workersList.filter(worker => 
    worker.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (worker.profession && worker.profession.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (!user) return null;
  const isWorker = user.role === 'worker';

  return (
    <div className="min-h-screen bg-gray-50 pb-10 font-sans text-gray-800">
      
      {/* --- NAVBAR --- */}
      <div className="bg-white px-6 py-4 shadow-sm flex justify-between items-center sticky top-0 z-50">
        
        {/* LOGO SECTION */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('feed')}>
          {/* Replaced Icon with Image */}
          <img 
            src={sheFixLogo} 
            alt="She-Fix Logo" 
            className="w-10 h-10 object-contain" 
          />
          <h1 className="text-xl font-bold text-shePurple">She-Fix</h1>
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
            <div className="w-9 h-9 bg-gradient-to-br from-shePurple to-shePink rounded-full flex items-center justify-center text-white font-bold text-sm border-2 border-white shadow-sm">
              {user.name.charAt(0)}
            </div>
            <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 ml-2"><LogOut className="w-5 h-5" /></button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        
        {/* ================= WORKER DASHBOARD ================= */}
        {isWorker && (
          <>
            {/* 1. HERO BANNER */}
            <div className="bg-gradient-to-r from-shePurple to-purple-800 rounded-3xl p-6 md:p-8 text-white shadow-lg relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-2xl md:text-3xl font-bold mb-1 text-white">Namaste, {user.name}! 🙏</h2>
                <p className="text-purple-100 text-sm md:text-base opacity-90 mb-6">Tap the mic to find work instantly.</p>
                
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
                      <p className="text-xs text-green-100 uppercase tracking-wider">Safety</p>
                      <p className="text-2xl font-bold text-green-300">{stats.safetyScore}%</p>
                    </div>
                    <Shield className="w-8 h-8 text-green-300 opacity-80" />
                  </div>
                </div>
              </div>
              <div className="absolute right-0 bottom-0 w-64 h-64 bg-white opacity-5 rounded-full translate-x-1/3 translate-y-1/3"></div>
            </div>

            {/* 2. TABS NAVIGATION */}
            <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-1">
              {['feed', 'schedule', 'academy', 'profile'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2.5 rounded-t-lg font-bold text-sm transition border-b-2 capitalize ${
                    activeTab === tab 
                      ? 'border-shePurple text-shePurple bg-purple-50' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {tab === 'feed' ? 'Jobs Near You' : tab === 'schedule' ? 'My Schedule' : tab === 'academy' ? 'Skill Academy' : 'Profile'}
                </button>
              ))}
            </div>

            {/* 3. TAB CONTENT */}
            <div className="min-h-[300px]">
              
              {/* --- JOBS FEED --- */}
              {activeTab === 'feed' && (
                <div className="space-y-4 animate-fadeIn">
                  {/* Filters */}
                  <div className="flex gap-2 mb-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input 
                        type="text" 
                        placeholder="Search 'Cleaning'..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 focus:border-shePurple outline-none bg-white shadow-sm"
                      />
                    </div>
                    <button onClick={() => setShowFilters(!showFilters)} className={`p-3 rounded-xl border transition ${showFilters ? 'bg-shePurple text-white' : 'bg-white text-gray-600'}`}>
                      <Filter className="w-5 h-5" />
                    </button>
                  </div>
                  
                  {showFilters && (
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 grid grid-cols-2 gap-3 mb-4">
                      <select value={serviceTypeFilter} onChange={(e) => setServiceTypeFilter(e.target.value)} className="p-2 border rounded-lg bg-gray-50"><option value="All">All Types</option><option value="Short Term">Short Term</option><option value="Long Term">Long Term</option></select>
                      <input type="text" placeholder="Location" value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} className="p-2 border rounded-lg bg-gray-50" />
                    </div>
                  )}

                  {filteredJobs.length > 0 ? (
                    filteredJobs.map((job) => (
                      <div key={job._id || job.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center hover:shadow-md transition gap-4">
                        <div className="flex items-center gap-4 w-full">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${job.category === 'Cleaning' ? 'bg-blue-50' : 'bg-orange-50'}`}>
                            {job.category === 'Cleaning' ? '🧹' : job.category === 'Cooking' ? '🍳' : '🌱'}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900 text-lg">{job.title}</h4>
                            <div className="flex gap-2 mt-1">
                              <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600 flex items-center gap-1"><MapPin className="w-3 h-3"/> {job.location || job.loc}</span>
                              <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded font-bold">{job.serviceType}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right min-w-[140px] flex flex-col items-end gap-2">
                          <div>
                            <p className="text-lg font-bold text-shePurple">₹{job.pay}</p>
                            <p className="text-[10px] text-gray-500">/{job.unit}</p>
                          </div>

                          {/* Pink-Shield Safety Badge */}
                          {job.safetyVerified ? (
                            <div className="flex items-center gap-1 bg-green-50 border border-green-200 px-2 py-1 rounded-full">
                              <div className="relative flex items-center justify-center">
                                <Shield className="w-3 h-3 text-green-600 fill-current" />
                                <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-green-400 rounded-full animate-ping"></span>
                              </div>
                              <span className="text-[9px] font-bold text-green-700 uppercase tracking-wide">Pink-Shield Safe</span>
                            </div>
                          ) : (
                             <span className="text-[9px] bg-yellow-50 text-yellow-700 px-2 py-1 rounded border border-yellow-100">Pending Verification</span>
                          )}

                          <div className="flex gap-2 w-full mt-1">
                            {/* Bhashini Chat Button */}
                            <button 
                              onClick={() => alert("Connecting to Bhashini... \nTranslating Hindi <-> English")} 
                              className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:text-shePurple hover:bg-purple-50 transition"
                              title="Chat in your Language"
                            >
                              <MessageSquare className="w-5 h-5" />
                            </button>
                            
                            <button onClick={() => acceptJob(job)} className="flex-1 bg-gray-900 text-white py-2 rounded-lg text-xs font-bold hover:bg-shePurple transition">
                              Accept
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10 text-gray-500">No jobs found matching your filters.</div>
                  )}
                </div>
              )}

              {/* --- MY SCHEDULE --- */}
              {activeTab === 'schedule' && (
                <div className="space-y-4 animate-fadeIn">
                   {mySchedule.length > 0 ? mySchedule.map((job, idx) => (
                     <div key={idx} className="bg-white p-4 rounded-xl border-l-4 border-l-green-500 shadow-sm flex justify-between items-center">
                       <div><h4 className="font-bold">{job.title}</h4><p className="text-sm text-gray-500">{job.location || job.loc}</p></div>
                       <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle className="w-3 h-3"/> Confirmed</div>
                     </div>
                   )) : <div className="text-center py-20 text-gray-400 border border-dashed rounded-2xl">No active jobs yet.</div>}
                </div>
              )}

              {/* --- ACADEMY --- */}
              {activeTab === 'academy' && (
                <div className="grid md:grid-cols-2 gap-4 animate-fadeIn">
                  {courses.map((course) => (
                    <div key={course.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4 hover:shadow-md cursor-pointer">
                       <div className="relative w-24 h-24 bg-gray-200 rounded-xl overflow-hidden flex-shrink-0">
                         <img src={course.img} alt={course.title} className="w-full h-full object-cover"/>
                         <div className="absolute inset-0 bg-black/20 flex items-center justify-center"><PlayCircle className="w-8 h-8 text-white"/></div>
                       </div>
                       <div>
                         <h4 className="font-bold text-gray-900 line-clamp-2">{course.title}</h4>
                         <p className="text-xs text-gray-500 mt-1">{course.duration} • {course.lang}</p>
                         <span className="mt-2 inline-block bg-yellow-50 text-yellow-700 text-[10px] px-2 py-1 rounded font-bold border border-yellow-100">Reward: {course.reward}</span>
                       </div>
                    </div>
                  ))}
                </div>
              )}

              {/* --- PROFILE --- */}
              {activeTab === 'profile' && (
                <div className="space-y-6 animate-fadeIn">
                  
                  {/* PWA Install Banner */}
                  <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-4 rounded-2xl shadow-lg flex items-center justify-between text-white">
                    <div className="flex items-center gap-3">
                      <div className="bg-white/10 p-2 rounded-lg">
                        <Download className="w-6 h-6 text-shePink" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">Install She-Fix</h4>
                        <p className="text-[10px] text-gray-400">Add to Home Screen for Offline Mode</p>
                      </div>
                    </div>
                    <button className="bg-white text-gray-900 px-4 py-2 rounded-lg text-xs font-bold hover:bg-gray-100 transition">Install</button>
                  </div>

                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 text-center">
                    <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto border-4 border-white shadow-lg bg-cover" style={{backgroundImage: `url(https://ui-avatars.com/api/?name=${user.name}&background=6B4C9A&color=fff&size=128)`}}></div>
                    <h2 className="text-2xl font-bold text-gray-900 mt-4">{user.name}</h2>
                    <p className="text-shePurple font-medium capitalize">{user.profession}</p>
                    <div className="mt-6 space-y-2 text-left">
                       <div className="p-3 bg-gray-50 rounded-lg flex justify-between"><span className="text-gray-600">Language</span> <span className="font-bold">English</span></div>
                       <div className="p-3 bg-gray-50 rounded-lg flex justify-between"><span className="text-gray-600">Verification</span> <span className="text-green-600 font-bold">Verified</span></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* ================= SEEKER DASHBOARD ================= */}
        {!isWorker && (
          <div className="space-y-6 animate-fadeIn">
             <div className="bg-shePink/20 rounded-3xl p-8 text-center border border-shePink/30">
               <h2 className="text-2xl font-bold text-gray-900 mb-2">Find Trusted Help</h2>
               <div className="relative max-w-lg mx-auto mt-4">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                 <input type="text" placeholder="Search 'Maid', 'Cook'..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-3 rounded-xl border-none shadow-sm focus:ring-2 focus:ring-shePurple outline-none" />
               </div>
             </div>

             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredWorkers.map((worker) => (
                  <div key={worker._id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition flex items-center gap-4">
                    <div className="w-14 h-14 bg-gray-200 rounded-xl bg-cover" style={{backgroundImage: `url(https://ui-avatars.com/api/?name=${worker.name}&background=random)`}}></div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900">{worker.name}</h4>
                      <p className="text-sm text-shePurple font-medium">{worker.profession}</p>
                      <button onClick={() => bookWorker(worker.name)} className="mt-2 text-xs bg-gray-900 text-white px-3 py-1.5 rounded-lg font-bold">Book Now</button>
                    </div>
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