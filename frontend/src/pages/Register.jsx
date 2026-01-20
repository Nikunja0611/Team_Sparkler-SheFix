import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Upload, User, Phone, Lock, ChevronRight, CheckCircle, Mic, ArrowLeft } from 'lucide-react';
import VideoKYC from '../components/VideoKYC';
import { registerUser } from '../services/api';

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [kycVerified, setKycVerified] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
    role: 'worker', 
    language: 'hi', 
    idCard: null
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, idCard: e.target.files[0] });
    }
  };

  // --- VALIDATION FUNCTIONS ---
  const validateStep1 = () => {
    if (!formData.name.trim()) return alert("Please enter your Full Name");
    if (!formData.phone.trim() || formData.phone.length < 10) return alert("Please enter a valid Phone Number");
    if (!formData.password.trim()) return alert("Please create a Password");
    setStep(2);
  };

  const validateStep2 = () => {
    if (!formData.idCard) return alert("Please upload your Identity Proof (Aadhaar/DL) to proceed.");
    setStep(3);
  };

  const handleKycSuccess = () => {
    setKycVerified(true);
    setTimeout(() => setStep(4), 1500);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      data.append('kycVerified', kycVerified); 

      await registerUser(data); 
      alert("Registration Successful! Please Login.");
      navigate('/login');
    } catch (error) {
      console.error("Registration failed", error);
      alert("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur-xl w-full max-w-lg rounded-3xl shadow-2xl border border-white/50 overflow-hidden relative">
        
        {/* Top Progress Bar */}
        <div className="h-1.5 w-full bg-gray-100">
          <div 
            className="h-full bg-gradient-to-r from-shePurple to-shePink transition-all duration-500 ease-out" 
            style={{ width: `${(step / 4) * 100}%` }}
          ></div>
        </div>

        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
            <p className="text-sm text-gray-500 mt-1">Step {step} of 4: {step === 1 ? 'Basic Details' : step === 2 ? 'Upload ID' : step === 3 ? 'Video KYC' : 'Finish'}</p>
          </div>

          {/* STEP 1: Basic Details */}
          {step === 1 && (
            <div className="space-y-5 animate-fadeIn">
              
              {/* Role Toggle */}
              <div className="grid grid-cols-2 gap-3 p-1 bg-gray-100 rounded-xl">
                {['worker', 'seeker'].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setFormData({ ...formData, role: r })}
                    className={`py-2.5 rounded-lg text-sm font-bold capitalize transition-all ${
                      formData.role === r 
                        ? 'bg-white text-shePurple shadow-sm' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>

              {/* Inputs */}
              <div className="space-y-4">
                <div className="relative group">
                  <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-shePurple" />
                  <input 
                    name="name" 
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Full Name *" 
                    className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-shePurple focus:outline-none transition"
                  />
                  <Mic className="absolute right-4 top-3.5 w-5 h-5 text-shePurple cursor-pointer hover:scale-110" />
                </div>

                <div className="relative group">
                  <Phone className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-shePurple" />
                  <input 
                    name="phone" 
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Mobile Number *" 
                    className="w-full pl-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-shePurple focus:outline-none transition"
                  />
                </div>

                <div className="relative group">
                  <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-shePurple" />
                  <input 
                    name="password" 
                    type="password" 
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password *" 
                    className="w-full pl-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-shePurple focus:outline-none transition"
                  />
                </div>
              </div>

              <button 
                onClick={validateStep1}
                className="w-full bg-shePurple text-white py-3.5 rounded-xl font-bold shadow-lg hover:bg-purple-800 transition flex items-center justify-center gap-2"
              >
                Next Step <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* STEP 2: Identity Documents */}
          {step === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-2 border-dashed border-purple-200 rounded-2xl p-8 text-center bg-purple-50/30 hover:bg-purple-50 transition cursor-pointer relative">
                <input 
                  type="file" 
                  id="id-upload" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  onChange={handleFileChange} 
                  accept="image/*,.pdf"
                />
                <div className="flex flex-col items-center pointer-events-none">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-3">
                    <Upload className="w-8 h-8 text-shePurple" />
                  </div>
                  <span className="text-gray-900 font-bold">Upload Aadhaar / DL *</span>
                  <span className="text-xs text-gray-500 mt-1">Supports JPG, PNG, PDF</span>
                </div>
              </div>

              {formData.idCard && (
                <div className="flex items-center gap-3 bg-green-50 p-3 rounded-xl border border-green-100">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-green-800 font-medium truncate">{formData.idCard.name}</span>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button onClick={() => setStep(1)} className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50">Back</button>
                <button 
                  onClick={validateStep2}
                  className="flex-1 bg-shePurple text-white py-3 rounded-xl font-bold hover:bg-purple-800 transition shadow-lg"
                >
                  Continue to KYC
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Video KYC */}
          {step === 3 && (
            <div className="animate-fadeIn">
              <div className="bg-black rounded-2xl overflow-hidden shadow-2xl border-4 border-shePurple mb-6 relative aspect-[4/3]">
                {/* Overlay Text */}
                <div className="absolute top-4 left-0 right-0 text-center z-10">
                  <span className="bg-black/50 text-white text-xs px-3 py-1 rounded-full backdrop-blur-md">
                    Look at the camera
                  </span>
                </div>
                <VideoKYC userId="temp-registration-id" onVerified={handleKycSuccess} />
              </div>
              
              <div className="text-center">
                {kycVerified ? (
                  <p className="text-green-600 font-bold flex items-center justify-center gap-2 animate-bounce">
                    <CheckCircle className="w-6 h-6" /> Verification Complete!
                  </p>
                ) : (
                  <p className="text-gray-500 text-sm">Please blink to verify lifeness.</p>
                )}
              </div>
            </div>
          )}

          {/* STEP 4: Success/Submit */}
          {step === 4 && (
            <div className="text-center animate-fadeIn py-4">
              <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-200">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">You're All Set!</h3>
              <p className="text-gray-500 mb-8 max-w-xs mx-auto">Your identity has been verified. Welcome to the She-Fix family.</p>
              
              <button 
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-shePurple text-white py-4 rounded-xl font-bold text-lg hover:bg-purple-800 transition shadow-xl hover:shadow-2xl hover:-translate-y-1"
              >
                {loading ? "Creating Account..." : "Enter Dashboard"}
              </button>
            </div>
          )}

        </div>
        
        {/* Footer Link */}
        {step === 1 && (
          <div className="bg-gray-50 p-4 text-center text-sm border-t border-gray-100">
            Already have an account? <Link to="/login" className="text-shePurple font-bold hover:underline">Login here</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;