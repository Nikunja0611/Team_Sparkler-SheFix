import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Upload, User, Phone, Lock, ChevronRight, CheckCircle, Mic } from 'lucide-react';
import VideoKYC from '../components/VideoKYC';
import { registerUser } from '../services/api'; // Ensure this exists

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
    role: 'worker', // 'worker' or 'seeker'
    language: 'hi', // Default to Hindi for workers
    idCard: null
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, idCard: e.target.files[0] });
  };

  const handleKycSuccess = () => {
    setKycVerified(true);
    // Auto-advance after 1.5 seconds
    setTimeout(() => setStep(4), 1500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create FormData to handle File Upload + JSON data
      const data = new FormData();
      data.append('name', formData.name);
      data.append('phone', formData.phone);
      data.append('password', formData.password);
      data.append('role', formData.role);
      data.append('language', formData.language);
      data.append('kycVerified', kycVerified); 
      if (formData.idCard) {
        data.append('idCard', formData.idCard);
      }

      // Call API
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
    <div className="min-h-screen bg-pink-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-shePurple p-6 text-center">
          <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
            <Shield className="w-6 h-6" /> She-Fix Registration
          </h2>
          <p className="text-purple-200 text-sm mt-1">Step {step} of 3</p>
        </div>

        {/* Progress Bar */}
        <div className="flex w-full h-1.5 bg-gray-100">
          <div className={`h-full bg-shePink transition-all duration-500 ${step === 1 ? 'w-1/3' : step === 2 ? 'w-2/3' : 'w-full'}`}></div>
        </div>

        <div className="p-8">
          
          {/* STEP 1: Basic Details */}
          {step === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Who are you?</h3>
              
              {/* Role Selection */}
              <div className="flex gap-4 mb-6">
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, role: 'worker'})}
                  className={`flex-1 py-3 rounded-xl border-2 font-medium transition ${formData.role === 'worker' ? 'border-shePurple bg-purple-50 text-shePurple' : 'border-gray-200 text-gray-500'}`}
                >
                  I want Work <br/><span className="text-xs">(Worker)</span>
                </button>
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, role: 'seeker'})}
                  className={`flex-1 py-3 rounded-xl border-2 font-medium transition ${formData.role === 'seeker' ? 'border-shePurple bg-purple-50 text-shePurple' : 'border-gray-200 text-gray-500'}`}
                >
                  I want Service <br/><span className="text-xs">(Seeker)</span>
                </button>
              </div>

              {/* Inputs with Voice Icon (Visual only for now) */}
              <div className="relative">
                <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input 
                  name="name" 
                  placeholder="Full Name" 
                  className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-shePurple"
                  onChange={handleChange}
                />
                <Mic className="absolute right-3 top-3.5 w-5 h-5 text-shePurple cursor-pointer hover:scale-110 transition" />
              </div>

              <div className="relative">
                <Phone className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input 
                  name="phone" 
                  placeholder="Mobile Number" 
                  className="w-full pl-10 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-shePurple"
                  onChange={handleChange}
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input 
                  name="password" 
                  type="password" 
                  placeholder="Create Password" 
                  className="w-full pl-10 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-shePurple"
                  onChange={handleChange}
                />
              </div>

              <button 
                onClick={() => setStep(2)}
                className="w-full bg-shePurple text-white py-3 rounded-xl font-bold hover:bg-purple-800 transition flex items-center justify-center gap-2 mt-4"
              >
                Next Step <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* STEP 2: Identity Documents */}
          {step === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <h3 className="text-xl font-bold text-gray-800">Upload Identity Proof</h3>
              <p className="text-sm text-gray-500">Required for "Pink-Shield" Verification</p>

              <div className="border-2 border-dashed border-shePurple/30 rounded-xl p-8 text-center bg-purple-50/50 hover:bg-purple-50 transition">
                <input 
                  type="file" 
                  id="id-upload" 
                  className="hidden" 
                  onChange={handleFileChange} 
                  accept="image/*,.pdf"
                />
                <label htmlFor="id-upload" className="cursor-pointer flex flex-col items-center">
                  <Upload className="w-10 h-10 text-shePurple mb-2" />
                  <span className="text-shePurple font-medium">Click to Upload Aadhaar / DL</span>
                  <span className="text-xs text-gray-400 mt-1">Supports JPG, PNG, PDF</span>
                </label>
                {formData.idCard && (
                  <div className="mt-4 flex items-center justify-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm">
                    <CheckCircle className="w-4 h-4" /> {formData.idCard.name}
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 py-3 text-gray-500 font-medium">Back</button>
                <button 
                  onClick={() => setStep(3)}
                  disabled={!formData.idCard}
                  className="flex-1 bg-shePurple text-white py-3 rounded-xl font-bold hover:bg-purple-800 transition disabled:opacity-50"
                >
                  Start Video KYC
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Video KYC */}
          {step === 3 && (
            <div className="animate-fadeIn text-center">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Face Verification</h3>
              <p className="text-sm text-gray-500 mb-4">Please look at the camera to verify your identity.</p>
              
              {/* Reuse your existing VideoKYC component */}
              <div className="border-4 border-shePurple rounded-xl overflow-hidden mb-4">
                <VideoKYC userId="temp-registration-id" onVerified={handleKycSuccess} />
              </div>

              {kycVerified && (
                <p className="text-green-600 font-bold flex items-center justify-center gap-2">
                  <CheckCircle className="w-5 h-5" /> Verified Successfully!
                </p>
              )}
            </div>
          )}

          {/* STEP 4: Submit (Auto-shown after KYC) */}
          {step === 4 && (
            <div className="text-center animate-fadeIn space-y-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">All Set!</h3>
              <p className="text-gray-600">Your details and KYC have been captured.</p>
              
              <button 
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-shePurple text-white py-4 rounded-xl font-bold hover:bg-purple-800 transition shadow-lg"
              >
                {loading ? "Creating Account..." : "Finish Registration"}
              </button>
            </div>
          )}

        </div>
        
        <div className="bg-gray-50 p-4 text-center text-sm text-gray-600">
          Already have an account? <Link to="/login" className="text-shePurple font-bold hover:underline">Login here</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;