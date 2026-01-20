import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Phone, Lock, Mic, ArrowRight } from 'lucide-react';
import { loginUser } from '../services/api'; // Ensure this exists

const Login = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser({ phone, password });
      alert("Login Successful!");
      // Redirect to Dashboard (implement navigation here later)
    } catch (error) {
      alert("Invalid Credentials");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">
      
      {/* Left Side - Brand Image/Info */}
      <div className="hidden md:flex md:w-1/2 bg-shePurple items-center justify-center p-12 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 -translate-x-1/2"></div>
        <div className="relative z-10 max-w-md">
          <h1 className="text-5xl font-bold mb-6">Welcome Back!</h1>
          <p className="text-xl text-purple-100 leading-relaxed">
            "Connecting safety-conscious households with the skilled female workforce."
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md space-y-8">
          
          <div className="text-center md:text-left">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-shePurple text-white mb-4 shadow-lg shadow-purple-200">
              <Shield className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Sign in to She-Fix</h2>
            <p className="text-gray-500 mt-2">Access your jobs and services.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <label className="text-sm font-medium text-gray-700 mb-1 block">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-shePurple/20 focus:border-shePurple transition"
                    placeholder="9876543210"
                  />
                  {/* Bhashini Voice Input Trigger */}
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 bg-pink-50 rounded-full text-shePurple hover:bg-shePurple hover:text-white transition">
                    <Mic className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="relative">
                <label className="text-sm font-medium text-gray-700 mb-1 block">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-shePurple/20 focus:border-shePurple transition"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="w-full bg-shePurple text-white py-3.5 rounded-xl font-bold text-lg hover:bg-purple-800 transition shadow-xl shadow-purple-100 flex items-center justify-center gap-2 group">
              Login <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
            </button>
          </form>

          <p className="text-center text-gray-600">
            Don't have an account? <Link to="/register" className="text-shePurple font-semibold hover:underline">Register now</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;