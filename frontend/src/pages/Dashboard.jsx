import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, MapPin, Calendar, Briefcase, 
  CheckCircle, Search, Globe, LogOut, Filter, Clock, Banknote,
  Home, BookOpen, User as UserIcon, PlayCircle, Award, ChevronRight, Menu, X, Star
} from 'lucide-react';
import VoiceCommand from '../components/VoiceCommand';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();
  
  // --- STATE ---
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('home'); 
  const [language, setLanguage] = useState('en'); 
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  
  // --- DATA STATE ---
  const [stats, setStats] = useState({ earnings: 4500, jobsDone: 14, safetyScore: 98 });
  const [availableJobs, setAvailableJobs] = useState([]); // For Workers
  const [workersList, setWorkersList] = useState([]);     // For Seekers (NEW)
  const [mySchedule, setMySchedule] = useState([]);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // --- MOCK ACADEMY DATA ---
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
      
      // FETCH DATA BASED ON ROLE
      if (userInfo.role === 'worker') {
        fetchJobs();
      } else {
        fetchWorkers(); // <--- Fetch Workers if Seeker
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

  // --- HANDLERS ---
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
    alert(`Booking Request sent to ${workerName}! \n\nWaiting for Pink-Shield Verification...`);
  };

  if (!user) return null;
  const isWorker = user.role === 'worker';

  // Navigation Items
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'schedule', label: 'My Bookings', icon: Calendar },
    { id: 'profile', label: 'Profile', icon: UserIcon },
  ];
  if (isWorker) navItems.splice(2, 0, { id: 'academy', label: 'Skill Academy', icon: BookOpen });

  // Filter Workers for Seeker
  const filteredWorkers = workersList.filter(worker => 
    worker.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (worker.profession && worker.profession.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      
      {/* --- NAVBAR --- */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 rounded-md text-gray-500 hover:text-shePurple hover:bg-gray-100">
                <Menu className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('home')}>
                <Shield className="w-7 h-7 text-shePurple fill-current" />
                <h1 className="text-xl font-bold text-shePurple hidden sm:block">She-Fix</h1>
              </div>
              <div className="hidden md:flex ml-8 space-x-1">
                {navItems.map((item) => (
                  <button key={item.id} onClick={() => setActiveTab(item.id)} className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${activeTab === item.id ? 'bg-purple-50 text-shePurple' : 'text-gray-500 hover:text-shePurple'}`}>
                    <item.icon className={`w-4 h-4 ${activeTab === item.id && 'fill-current'}`} /> {item.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-9 h-9 bg-gradient-to-br from-shePurple to-shePink rounded-full flex items-center justify-center text-white font-bold text-sm border-2 border-white shadow-sm">
                {user.name.charAt(0)}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* --- SIDEBAR DRAWER --- */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50" onClick={() => setSidebarOpen(false)}></div>
          <div className="relative w-64 bg-white shadow-xl h-full flex flex-col">
            <div className="p-4 flex justify-between items-center border-b border-gray-100">
               <h2 className="text-lg font-bold text-shePurple">Menu</h2>
               <button onClick={() => setSidebarOpen(false)}><X className="w-6 h-6 text-gray-500" /></button>
            </div>
            <div className="flex-1 py-4 space-y-1 px-2">
              {navItems.map((item) => (
                <button key={item.id} onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }} className="w-full px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-3 text-gray-600 hover:bg-purple-50 hover:text-shePurple">
                  <item.icon className="w-5 h-5" /> {item.label}
                </button>
              ))}
            </div>
            <div className="p-4 border-t border-gray-100">
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg font-medium"><LogOut className="w-5 h-5" /> Logout</button>
            </div>
          </div>
        </div>
      )}

      {/* --- CONTENT --- */}
      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        
        {/* ================= WORKER VIEW ================= */}
        {activeTab === 'home' && isWorker && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-gradient-to-r from-shePurple to-purple-800 rounded-3xl p-6 text-white shadow-lg">
               <h2 className="text-2xl font-bold mb-1">Namaste, {user.name}! 🙏</h2>
               <p className="text-purple-100 opacity-90 mb-4">Find daily gigs or monthly employment.</p>
               <div className="flex gap-3">
                  <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl flex-1"><p className="text-xs text-purple-100">Earnings</p><p className="text-xl font-bold">₹{stats.earnings}</p></div>
                  <div className="bg-green-500/20 backdrop-blur-md px-4 py-2 rounded-xl flex-1"><p className="text-xs text-green-100">Safety</p><p className="text-xl font-bold text-green-300">{stats.safetyScore}%</p></div>
               </div>
            </div>
            
            {/* Worker Job Feed */}
            <div className="space-y-4">
               {availableJobs.map((job) => (
                  <div key={job._id || job.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3">
                     <div className="flex justify-between">
                        <h4 className="font-bold text-gray-900">{job.title}</h4>
                        <span className="text-shePurple font-bold">₹{job.pay}</span>
                     </div>
                     <div className="flex gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3"/> {job.location || job.loc}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {job.duration}</span>
                     </div>
                     <button onClick={() => acceptJob(job)} className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold text-sm">Accept Job</button>
                  </div>
               ))}
            </div>
          </div>
        )}

        {/* ================= SEEKER VIEW (NEW) ================= */}
        {activeTab === 'home' && !isWorker && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Seeker Hero */}
            <div className="bg-shePink/20 rounded-3xl p-8 text-center border border-shePink/30">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Find Trusted Help</h2>
              <p className="text-gray-600 mb-6 text-sm">Pink-Shield Verified Professionals for your safety.</p>
              <div className="relative max-w-lg mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="Search 'Maid', 'Cook'..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-none shadow-sm focus:ring-2 focus:ring-shePurple outline-none"
                />
              </div>
            </div>

            {/* Categories */}
            <div>
               <h3 className="font-bold text-gray-900 mb-3 px-1">Categories</h3>
               <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                  {['Cleaner', 'Cook', 'Gardener', 'Caregiver', 'Electrician', 'Painter'].map(cat => (
                     <button key={cat} onClick={() => setSearchQuery(cat)} className="bg-white p-3 rounded-xl border border-gray-100 text-sm font-medium hover:border-shePurple hover:text-shePurple transition shadow-sm">
                        {cat}
                     </button>
                  ))}
               </div>
            </div>

            {/* Workers List */}
            <div>
              <h3 className="font-bold text-gray-900 mb-3 px-1">Top Rated Professionals</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredWorkers.length > 0 ? (
                  filteredWorkers.map((worker) => (
                    <div key={worker._id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
                      <div className="flex gap-4">
                        <div className="w-14 h-14 bg-gray-200 rounded-xl bg-cover" style={{backgroundImage: `url(https://ui-avatars.com/api/?name=${worker.name}&background=random)`}}></div>
                        <div>
                          <h4 className="font-bold text-gray-900">{worker.name}</h4>
                          <p className="text-sm text-shePurple font-medium">{worker.profession}</p>
                          <div className="flex items-center gap-1 mt-1 text-xs font-bold text-gray-600">
                             <Star className="w-3 h-3 fill-yellow-400 text-yellow-400"/> 4.8 Rating
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                         <span className="flex items-center gap-1 text-[10px] bg-green-50 text-green-700 px-2 py-1 rounded border border-green-100 font-bold">
                           <Shield className="w-3 h-3"/> Verified
                         </span>
                         <button onClick={() => bookWorker(worker.name)} className="bg-gray-900 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-shePurple transition">
                           Book Now
                         </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-10 text-gray-400">
                     No workers found matching "{searchQuery}"
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================= SCHEDULE TAB (Shared) ================= */}
        {activeTab === 'schedule' && (
          <div className="space-y-4 animate-fadeIn">
             <h2 className="text-xl font-bold text-gray-900">{isWorker ? 'My Jobs' : 'My Bookings'}</h2>
             {mySchedule.length > 0 ? (
               mySchedule.map((item, idx) => (
                 <div key={idx} className="bg-white p-4 rounded-xl border-l-4 border-l-green-500 shadow-sm">
                   <h4 className="font-bold">{item.title || "Booking #1234"}</h4>
                   <div className="mt-2 inline-flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-bold">
                     <CheckCircle className="w-3 h-3" /> Confirmed
                   </div>
                 </div>
               ))
             ) : (
               <div className="text-center py-20 text-gray-400 border border-dashed rounded-2xl">
                  No active {isWorker ? 'jobs' : 'bookings'}.
               </div>
             )}
          </div>
        )}

        {/* ================= PROFILE TAB (Shared) ================= */}
        {activeTab === 'profile' && (
          <div className="max-w-xl mx-auto space-y-6 animate-fadeIn">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto border-4 border-white shadow-lg bg-cover" 
                   style={{backgroundImage: `url(https://ui-avatars.com/api/?name=${user.name}&background=6B4C9A&color=fff&size=128)`}}></div>
              <h2 className="text-2xl font-bold text-gray-900 mt-4">{user.name}</h2>
              <p className="text-gray-500 capitalize">{user.role}</p>
              <button onClick={handleLogout} className="mt-6 w-full bg-red-50 text-red-500 py-3 rounded-xl font-bold">Logout</button>
            </div>
          </div>
        )}

      </div>
      
      {isWorker && <div className="fixed bottom-6 right-6 z-40"><VoiceCommand onCommand={handleVoiceCommand} /></div>}
    </div>
  );
};

export default Dashboard;