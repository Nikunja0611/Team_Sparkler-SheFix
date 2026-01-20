import React from 'react';
import { Play, CheckCircle, Award, Lock } from 'lucide-react';

const SkillAcademy = () => {
  const modules = [
    {
      id: 1,
      title: "Electrical Basics (Hindi)",
      thumbnail: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&q=80",
      duration: "10 mins",
      completed: true
    },
    {
      id: 2,
      title: "Safe Plumbing (Marathi)",
      thumbnail: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=500&q=80",
      duration: "15 mins",
      completed: false
    },
    {
      id: 3,
      title: "Professional Cleaning (Tamil)",
      thumbnail: "https://images.unsplash.com/photo-1581578731117-10d52143b0e8?w=500&q=80",
      duration: "12 mins",
      completed: false
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 bg-gradient-to-r from-blue-600 to-shePurple rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Skill-to-Earn Academy</h1>
          <p className="text-blue-100">Watch videos, take quizzes, and earn your Verified Badge.</p>
          <div className="mt-4 inline-flex items-center bg-white/20 backdrop-blur-md px-4 py-2 rounded-full">
            <Award className="w-5 h-5 text-yellow-300 mr-2" />
            <span className="font-bold">Current Level: Apprentice</span>
          </div>
        </div>
        <Award className="absolute right-[-20px] bottom-[-20px] w-48 h-48 text-white/10 rotate-12" />
      </div>

      {/* Modules Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {modules.map((mod) => (
          <div key={mod.id} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition border border-gray-100 overflow-hidden group">
            <div className="relative h-48">
              <img src={mod.thumbnail} alt={mod.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                <button className="bg-white/20 backdrop-blur-md p-3 rounded-full hover:bg-shePurple hover:text-white transition">
                  <Play className="w-8 h-8 fill-current" />
                </button>
              </div>
              <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                {mod.duration}
              </span>
            </div>
            
            <div className="p-5">
              <h3 className="font-bold text-gray-800 text-lg mb-2">{mod.title}</h3>
              <div className="flex items-center justify-between mt-4">
                {mod.completed ? (
                  <span className="text-green-600 text-sm font-bold flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" /> Completed
                  </span>
                ) : (
                  <span className="text-gray-400 text-sm font-medium flex items-center gap-1">
                    <Lock className="w-4 h-4" /> Locked
                  </span>
                )}
                <button className="text-shePurple font-bold text-sm hover:underline">
                  {mod.completed ? "Review" : "Start Quiz"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillAcademy;