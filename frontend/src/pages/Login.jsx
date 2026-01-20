import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock, ArrowRight } from 'lucide-react';

// Firebase Imports
import { auth, googleProvider, db } from '../firebase';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // --- GOOGLE SIGN IN ---
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Check if user exists in Firestore (Do they have a Role?)
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (userDoc.exists()) {
        alert(`Welcome back, ${user.displayName}! 🌸`);
        navigate('/dashboard');
      } else {
        // User is new, but we don't know if they are a Worker or Seeker yet.
        // Delete the auth instance temporarily or just redirect to Register to finish profile
        alert("Account not found. Please Register to select your Role.");
        navigate('/register');
      }
    } catch (error) {
      console.error(error);
      alert("Google Sign-In Failed");
    }
  };

  // --- EMAIL LOGIN ---
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login Successful! 🌸");
      navigate('/dashboard'); 
    } catch (error) {
      alert("Invalid Email or Password ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-white text-gray-800">
      {/* ... (Keep your existing background animations) ... */}
      
      <div className="relative z-10 w-full max-w-md bg-white/70 backdrop-blur-xl border border-white/80 rounded-3xl shadow-2xl p-8 md:p-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-shePurple to-purple-700 shadow-lg mb-4 text-white">
            <Shield className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold text-shePurple">Welcome Back</h2>
        </div>

        {/* GOOGLE BUTTON */}
        <button 
          onClick={handleGoogleLogin}
          className="w-full bg-white border border-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-50 transition flex items-center justify-center gap-3 mb-6 shadow-sm"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-6 h-6" alt="Google" />
          Sign in with Google
        </button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300"></div></div>
          <div className="relative flex justify-center text-sm"><span className="px-2 bg-white/50 text-gray-500">Or with Email</span></div>
        </div>

        {/* Existing Form */}
        <form onSubmit={handleEmailLogin} className="space-y-6">
          {/* ... (Keep your existing Email/Password Inputs) ... */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Email</label>
            <div className="relative flex items-center bg-white rounded-xl border border-gray-200 p-1">
              <div className="p-3 text-gray-400"><Mail className="w-5 h-5" /></div>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-transparent font-medium px-2 py-2 focus:outline-none" placeholder="name@example.com" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Password</label>
            <div className="relative flex items-center bg-white rounded-xl border border-gray-200 p-1">
              <div className="p-3 text-gray-400"><Lock className="w-5 h-5" /></div>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-transparent font-medium px-2 py-2 focus:outline-none" placeholder="••••••••" />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-shePurple to-purple-700 text-white py-4 rounded-xl font-bold text-lg shadow-xl flex items-center justify-center gap-2">
            {loading ? 'Signing in...' : 'Sign In'} <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">Don't have an account? <Link to="/register" className="text-shePurple font-bold hover:underline">Create one</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;