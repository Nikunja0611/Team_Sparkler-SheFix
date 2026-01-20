import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Upload, User, Phone, Lock, ChevronRight, CheckCircle, Mail } from 'lucide-react';
import VideoKYC from '../components/VideoKYC';
import axios from 'axios'; // Use Axios for API calls

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [kycVerified, setKycVerified] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'worker', 
    profession: '',
    language: 'hi', 
    idCard: null
  });

  const professions = ["Electrician", "Plumber", "Caregiver", "Cleaner", "Cook", "Painter"];

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const handleFileChange = (e) => {
    if (e.target.files[0]) setFormData({ ...formData, idCard: e.target.files[0] });
  };

  const handleKycSuccess = () => {
    setKycVerified(true);
    setTimeout(() => setStep(4), 1500);
  };

  // Validation
  const validateStep1 = () => {
    if (!formData.name || !formData.email || !formData.password) return alert("Please fill all fields");
    if (formData.role === 'worker' && !formData.profession) return alert("Select a profession");
    setStep(2);
  };
  const validateStep2 = () => {
    if (!formData.idCard) return alert("Please upload ID");
    setStep(3);
  };

  // --- SUBMIT TO MONGODB ---
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role,
        profession: formData.profession,
        language: formData.language,
        kycVerified: kycVerified
      };

      // Call Your Backend API
      const { data } = await axios.post('http://localhost:5000/api/users/register', userData);

      // Save to LocalStorage (Auto Login)
      localStorage.setItem('userInfo', JSON.stringify(data));

      alert("Registration Successful! Welcome.");
      navigate('/dashboard'); // Direct access

    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-pink-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-shePurple p-6 text-center">
          <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2"><Shield className="w-6 h-6" /> She-Fix Registration</h2>
          <p className="text-purple-200 text-sm mt-1">Step {step} of 4</p>
        </div>
        
        {/* Step 1 */}
        {step === 1 && (
            <div className="p-8 space-y-5">
              <div className="grid grid-cols-2 gap-3 p-1 bg-gray-100 rounded-xl">
                {['worker', 'seeker'].map((r) => (
                  <button
                    key={r}
                    onClick={() => setFormData({ ...formData, role: r })}
                    className={`py-2.5 rounded-lg text-sm font-bold capitalize transition-all ${
                      formData.role === r ? 'bg-white text-shePurple shadow-sm' : 'text-gray-500'
                    }`}
                  >
                    {r === 'worker' ? 'I need Work' : 'I need Service'}
                  </button>
                ))}
              </div>

              {formData.role === 'worker' && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Select Your Skill <span className="text-red-500">*</span></label>
                  <div className="grid grid-cols-3 gap-2">
                    {professions.map((prof) => (
                      <button
                        key={prof}
                        onClick={() => setFormData({...formData, profession: prof})}
                        className={`text-xs py-2 px-1 rounded-lg border font-medium transition ${
                          formData.profession === prof 
                            ? 'bg-shePurple text-white border-shePurple' 
                            : 'bg-white text-gray-600 border-gray-200 hover:border-shePurple'
                        }`}
                      >
                        {prof}
                      </button>
                    ))}
                  </div>
                </div>
              )}
                
              <div className="space-y-3">
                <div className="relative group">
                  <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-shePurple" />
                  <input name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-shePurple transition" />
                </div>
                <div className="relative group">
                  <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-shePurple" />
                  <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email Address" className="w-full pl-10 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-shePurple transition" />
                </div>
                <div className="relative group">
                  <Phone className="absolute left-3 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-shePurple" />
                  <input name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="Mobile Number" className="w-full pl-10 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-shePurple transition" />
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400 group-focus-within:text-shePurple" />
                  <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Create Password" className="w-full pl-10 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-shePurple transition" />
                </div>
              </div>

              <button onClick={validateStep1} className="w-full bg-shePurple text-white py-3 rounded-xl font-bold hover:bg-purple-800 transition flex items-center justify-center gap-2 mt-2">
                Next Step <ChevronRight className="w-5 h-5" />
              </button>
            </div>
        )}
        
        {/* Step 2 */}
        {step === 2 && (
            <div className="p-8 space-y-6">
                <h3 className="text-lg font-bold text-gray-800 text-center">Upload Identity Proof</h3>
              <div className="border-2 border-dashed border-purple-200 rounded-xl p-8 text-center bg-purple-50/30 cursor-pointer hover:bg-purple-50 transition">
                <input type="file" id="id-upload" className="hidden" onChange={handleFileChange} accept="image/*,.pdf" />
                <label htmlFor="id-upload" className="cursor-pointer flex flex-col items-center">
                  <Upload className="w-10 h-10 text-shePurple mb-2" />
                  <span className="text-shePurple font-medium">Click to Upload Aadhaar / DL</span>
                </label>
                {formData.idCard && <div className="mt-3 bg-green-50 text-green-700 px-3 py-1 rounded-lg text-sm font-bold flex items-center gap-2 justify-center"><CheckCircle className="w-4 h-4"/> {formData.idCard.name}</div>}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 py-3 text-gray-500 font-bold border rounded-xl hover:bg-gray-50">Back</button>
                <button onClick={validateStep2} className="flex-1 bg-shePurple text-white py-3 rounded-xl font-bold hover:bg-purple-800 transition">Start KYC</button>
              </div>
            </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
            <div className="p-8 text-center space-y-4">
                 <h3 className="text-lg font-bold text-gray-800 mb-4">Video Verification</h3>
              <div className="border-4 border-shePurple rounded-xl overflow-hidden mb-4 bg-black relative">
                <VideoKYC userId="firebase-temp-id" onVerified={handleKycSuccess} />
              </div>
              {kycVerified && <p className="text-green-600 font-bold animate-bounce flex justify-center gap-2"><CheckCircle className="w-5 h-5"/> Verification Complete!</p>}
            </div>
        )}

        {/* Step 4 */}
        {step === 4 && (
            <div className="p-8 text-center py-4">
                 <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-100">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">All Set!</h3>
              <p className="text-gray-500 mb-6">Creating your digital identity...</p>
              <button onClick={handleSubmit} disabled={loading} className="w-full bg-shePurple text-white py-3 rounded-xl font-bold hover:bg-purple-800 transition shadow-md">
                {loading ? "Creating Account..." : "Go to Dashboard"}
              </button>
            </div>
        )}
        
        <div className="bg-gray-50 p-4 text-center text-sm text-gray-600 border-t border-gray-100">
          Already registered? <Link to="/login" className="text-shePurple font-bold hover:underline">Login here</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;