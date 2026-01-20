import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, MapPin, Star, Calendar, User, Briefcase } from 'lucide-react';
import VoiceCommand from '../components/VoiceCommand';

const Dashboard = () => {
  const navigate = useNavigate();
  
  // MOCK USER STATE (Replace with real user context later)
  const [userRole, setUserRole] = useState('worker'); // Toggle this to 'seeker' to test the other view

  const handleVoiceCommand = (command) => {
    alert(`Bhashini Translated: "${command}" \nAction: Searching for jobs...`);
    // Logic to filter jobs would go here
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      {/* Top Navbar */}
      <div className="bg-white px-6 py-4 shadow-sm flex justify-between items-center sticky top-0 z-40">
        <h1 className="text-2xl font-bold text-shePurple">She-Fix</h1>
        <div className="flex items-center gap-3">
          <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <Shield className="w-3 h-3" /> Verified
          </div>
          <div className="w-10 h-10 bg-gray-200 rounded-full bg-cover" style={{backgroundImage: 'url(https://randomuser.me/api/portraits/women/44.jpg)'}}></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        
        {/* --- WORKER VIEW --- */}
        {userRole === 'worker' && (
          <div className="space-y-8">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-shePurple to-pink-500 rounded-3xl p-8 text-white shadow-lg">
              <h2 className="text-3xl font-bold mb-2">Namaste, Savita! 🙏</h2>
              <p className="opacity-90">Tap the mic or browse jobs near you.</p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <div onClick={() => navigate('/academy')} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:border-shePurple transition">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center text-blue-600 mb-3">
                  <Briefcase className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-800">Learn Skills</h3>
                <p className="text-xs text-gray-500">Increase your pay</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:border-shePurple transition">
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center text-green-600 mb-3">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-800">My Schedule</h3>
                <p className="text-xs text-gray-500">2 Jobs today</p>
              </div>
            </div>

            {/* Job Feed */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Jobs Near You</h3>
              <div className="space-y-4">
                {[1, 2, 3].map((job) => (
                  <div key={job} className="bg-white p-5 rounded-2xl shadow-sm flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-gray-900">House Cleaning</h4>
                      <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" /> Sector 12, Navi Mumbai
                      </p>
                      <span className="inline-block mt-2 bg-pink-50 text-shePurple text-xs px-2 py-1 rounded border border-pink-100">
                        ₹300 / hour
                      </span>
                    </div>
                    <button className="bg-shePurple text-white px-5 py-2 rounded-xl font-bold text-sm">Accept</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* --- SEEKER VIEW --- */}
        {userRole === 'seeker' && (
          <div className="space-y-8">
            <div className="text-center py-8">
              <h2 className="text-3xl font-bold text-gray-900">What help do you need?</h2>
              <p className="text-gray-500">Verified female professionals for your safety.</p>
            </div>

            {/* Categories */}
            <div className="grid grid-cols-3 gap-4">
              {['Electrician', 'Plumber', 'Caregiver', 'Cleaner', 'Cook', 'Painter'].map((cat) => (
                <div key={cat} className="bg-white p-4 rounded-xl shadow-sm text-center border border-gray-100 hover:shadow-md transition cursor-pointer">
                  <div className="w-12 h-12 bg-purple-50 rounded-full mx-auto mb-3 flex items-center justify-center text-shePurple font-bold text-lg">
                    {cat[0]}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{cat}</span>
                </div>
              ))}
            </div>

            {/* Top Rated Workers */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Pink-Shield Verified Workers</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100 flex gap-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-xl bg-cover" style={{backgroundImage: `url(https://randomuser.me/api/portraits/women/${i + 30}.jpg)`}}></div>
                    <div>
                      <h4 className="font-bold text-gray-900">Riya Patel</h4>
                      <p className="text-sm text-gray-500">Expert Electrician</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-bold">4.9</span>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Shield className="w-3 h-3" /> Safe
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Voice Assistant (Always present for Workers) */}
      {userRole === 'worker' && <VoiceCommand onCommand={handleVoiceCommand} />}
    </div>
  );
};

export default Dashboard;