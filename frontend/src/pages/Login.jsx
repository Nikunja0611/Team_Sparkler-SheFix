import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, User, Lock, ArrowRight, Mic } from 'lucide-react';
import { loginUser } from '../services/api';

const Login = () => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState(''); // Stores Name OR Phone
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Sending 'identifier' which backend should handle as name or phone
      await loginUser({ identifier, password }); 
      alert("Login Successful! ✅");
      navigate('/dashboard'); // Redirect to dashboard
    } catch (error) {
      alert("Invalid Credentials ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-200 rounded-full filter blur-3xl opacity-20 -z-10 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-200 rounded-full filter blur-3xl opacity-20 -z-10"></div>

      <div className="bg-white/80 backdrop-blur-xl w-full max-w-md rounded-3xl shadow-2xl border border-white/50 p-8 md:p-10">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-shePurple to-purple-700 text-white shadow-lg shadow-purple-200 mb-4 transform hover:scale-105 transition duration-300">
            <Shield className="w-7 h-7" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome Back</h2>
          <p className="text-gray-500 mt-2 text-sm">Safe. Skilled. Secure.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          
          {/* Identifier Field (Name or Phone) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Name or Phone Number <span className="text-red-500">*</span></label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-shePurple transition" />
              <input 
                type="text" 
                required // <--- VALIDATION
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-shePurple/30 focus:border-shePurple transition font-medium text-gray-700 placeholder-gray-400"
                placeholder="Savita Devi / 9876543210"
              />
              <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-shePurple transition">
                <Mic className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Password <span className="text-red-500">*</span></label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-shePurple transition" />
              <input 
                type="password"
                required // <--- VALIDATION
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-shePurple/30 focus:border-shePurple transition font-medium text-gray-700 placeholder-gray-400"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-shePurple to-purple-700 text-white py-4 rounded-xl font-bold text-lg shadow-xl shadow-purple-200 hover:shadow-2xl hover:-translate-y-1 transition duration-300 flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? 'Signing in...' : 'Sign In'}
            {!loading && <ArrowRight className="w-5 h-5" />}
          </button>

        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">
            New to She-Fix?{' '}
            <Link to="/register" className="text-shePurple font-bold hover:text-purple-800 transition">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;