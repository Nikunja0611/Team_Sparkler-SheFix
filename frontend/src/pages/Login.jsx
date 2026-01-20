import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock, ArrowRight } from 'lucide-react';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post('http://localhost:5000/api/users/login', { email, password });
      
      // Save User Data (including Role) to LocalStorage
      localStorage.setItem('userInfo', JSON.stringify(data));
      
      alert(`Welcome back, ${data.name}!`);
      navigate('/dashboard'); 
    } catch (error) {
      alert(error.response?.data?.message || "Invalid Credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
     <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-white text-gray-800">
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl shadow-2xl overflow-hidden p-8 md:p-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-shePurple to-purple-700 shadow-lg shadow-purple-200 mb-4 transform hover:scale-110 transition duration-300 group">
            <Shield className="w-8 h-8 text-white group-hover:rotate-12 transition-transform duration-300" />
          </div>
          <h2 className="text-3xl font-bold text-shePurple tracking-tight">Welcome Back</h2>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Email <span className="text-red-500">*</span></label>
            <div className="relative flex items-center bg-white rounded-xl border border-gray-200 p-1 shadow-sm group-focus-within:border-shePurple group-focus-within:ring-2 group-focus-within:ring-purple-100 transition-all">
                <div className="p-3 text-gray-400"><Mail className="w-5 h-5" /></div>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-transparent text-gray-800 font-medium px-2 py-2 focus:outline-none" placeholder="name@example.com" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Password <span className="text-red-500">*</span></label>
            <div className="relative flex items-center bg-white rounded-xl border border-gray-200 p-1 shadow-sm group-focus-within:border-shePurple group-focus-within:ring-2 group-focus-within:ring-purple-100 transition-all">
                <div className="p-3 text-gray-400"><Lock className="w-5 h-5" /></div>
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-transparent text-gray-800 font-medium px-2 py-2 focus:outline-none" placeholder="••••••••" />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full relative group overflow-hidden bg-gradient-to-r from-shePurple to-purple-700 text-white py-4 rounded-xl font-bold text-lg shadow-xl shadow-purple-200 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <div className="absolute inset-0 w-full h-full bg-white/20 group-hover:translate-x-full transition-transform duration-500 ease-in-out -skew-x-12 origin-left"></div>
            <span className="relative flex items-center justify-center gap-2">
              {loading ? 'Signing in...' : 'Sign In Now'}
              {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </span>
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">Don't have an account? <Link to="/register" className="text-shePurple font-bold hover:text-purple-800 underline decoration-purple-200 hover:decoration-shePurple transition-all">Create one</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;