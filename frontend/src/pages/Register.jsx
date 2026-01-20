import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Upload, User, Phone, Lock, ChevronRight, CheckCircle, Mail } from 'lucide-react';
import VideoKYC from '../components/VideoKYC';

// Firebase Imports
import { auth, db, googleProvider } from '../firebase';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [kycVerified, setKycVerified] = useState(false);

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', password: '',
    role: 'worker', profession: '', language: 'hi', idCard: null
  });

  const professions = ["Electrician", "Plumber", "Caregiver", "Cleaner", "Cook", "Painter"];

  // --- GOOGLE REGISTER ---
  const handleGoogleRegister = async () => {
    // Validation: Ensure Role is selected first
    if (formData.role === 'worker' && !formData.profession) {
      return alert("Please select your Skill/Profession before signing up.");
    }

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Check if already exists to prevent overwriting
      const userDoc = await getDoc(doc(db, "users", user.uid));
      
      if (!userDoc.exists()) {
        // Save New User with selected Role/Profession
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          phone: user.phoneNumber || formData.phone, // Google sometimes doesn't give phone
          role: formData.role,
          profession: formData.role === 'worker' ? formData.profession : null,
          language: formData.language,
          kycVerified: false, // They still need to do KYC
          createdAt: new Date()
        });
      }
      
      // Move to ID Upload Step (Since Google doesn't provide ID Card/KYC)
      setStep(2); 
      
    } catch (error) {
      console.error(error);
      alert("Google Signup Failed");
    }
  };

  // ... (Keep existing handleChange, handleFileChange, validation functions) ...
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e) => { if (e.target.files[0]) setFormData({ ...formData, idCard: e.target.files[0] }); };
  const handleKycSuccess = () => { setKycVerified(true); setTimeout(() => setStep(4), 1500); };
  
  const validateStep1 = () => {
    if (!formData.name) return alert("Enter Name");
    if (formData.role === 'worker' && !formData.profession) return alert("Select Profession");
    setStep(2);
  };
  const validateStep2 = () => { if (!formData.idCard) return alert("Upload ID"); setStep(3); };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Logic for Manual Email/Pass Registration
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        profession: formData.role === 'worker' ? formData.profession : null,
        language: formData.language,
        kycVerified: kycVerified,
        createdAt: new Date()
      });
      navigate('/login');
    } catch (error) { alert(error.message); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-pink-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden">
        
        <div className="bg-shePurple p-6 text-center">
          <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2"><Shield className="w-6 h-6" /> She-Fix Registration</h2>
          <p className="text-purple-200 text-sm mt-1">Step {step} of 4</p>
        </div>

        <div className="p-8">
          {step === 1 && (
            <div className="space-y-5 animate-fadeIn">
              
              {/* Role & Profession UI */}
              <div className="grid grid-cols-2 gap-3 p-1 bg-gray-100 rounded-xl">
                {['worker', 'seeker'].map((r) => (
                  <button key={r} onClick={() => setFormData({ ...formData, role: r })} className={`py-2.5 rounded-lg text-sm font-bold capitalize transition-all ${formData.role === r ? 'bg-white text-shePurple shadow-sm' : 'text-gray-500'}`}>
                    {r === 'worker' ? 'I need Work' : 'I need Service'}
                  </button>
                ))}
              </div>

              {formData.role === 'worker' && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Select Your Skill <span className="text-red-500">*</span></label>
                  <div className="grid grid-cols-3 gap-2">
                    {professions.map((prof) => (
                      <button key={prof} onClick={() => setFormData({...formData, profession: prof})} className={`text-xs py-2 px-1 rounded-lg border font-medium transition ${formData.profession === prof ? 'bg-shePurple text-white border-shePurple' : 'bg-white text-gray-600 border-gray-200 hover:border-shePurple'}`}>
                        {prof}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Google Sign Up Button */}
              <button onClick={handleGoogleRegister} className="w-full bg-white border border-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-50 transition flex items-center justify-center gap-3">
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-6 h-6" alt="Google" />
                Sign Up with Google
              </button>

              <div className="relative"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300"></div></div><div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">Or Manual Setup</span></div></div>

              {/* Manual Inputs */}
              <div className="space-y-4">
                <div className="relative"><User className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" /><input name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" className="w-full pl-10 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-shePurple" /></div>
                <div className="relative"><Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" /><input name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full pl-10 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-shePurple" /></div>
                <div className="relative"><Phone className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" /><input name="phone" value={formData.phone} onChange={handleChange} placeholder="Mobile" className="w-full pl-10 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-shePurple" /></div>
                <div className="relative"><Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" /><input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Password" className="w-full pl-10 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-shePurple" /></div>
              </div>

              <button onClick={validateStep1} className="w-full bg-shePurple text-white py-3 rounded-xl font-bold hover:bg-purple-800 transition">Next Step <ChevronRight className="w-5 h-5 inline" /></button>
            </div>
          )}

          {/* ... (Keep Steps 2, 3, 4 from previous code) ... */}
          {/* Ensure Step 2 has Back Button */}
          {step === 2 && (
            <div className="space-y-6 animate-fadeIn">
               <h3 className="text-lg font-bold text-center">Upload ID Proof</h3>
               <div className="border-2 border-dashed border-purple-200 rounded-xl p-8 text-center bg-purple-50/30 cursor-pointer">
                 <input type="file" id="id-upload" className="hidden" onChange={handleFileChange} />
                 <label htmlFor="id-upload" className="cursor-pointer flex flex-col items-center">
                   <Upload className="w-10 h-10 text-shePurple" /> <span className="text-shePurple font-medium">Click to Upload</span>
                 </label>
                 {formData.idCard && <p className="text-green-600 font-bold mt-2">{formData.idCard.name}</p>}
               </div>
               <div className="flex gap-3">
                 <button onClick={() => setStep(1)} className="flex-1 py-3 text-gray-500 font-bold border rounded-xl">Back</button>
                 <button onClick={validateStep2} className="flex-1 bg-shePurple text-white py-3 rounded-xl font-bold">Start KYC</button>
               </div>
            </div>
          )}
          
          {step === 3 && (
            <div className="animate-fadeIn text-center">
              <h3 className="text-lg font-bold mb-4">Video Verification</h3>
              <div className="border-4 border-shePurple rounded-xl overflow-hidden mb-4 bg-black"><VideoKYC userId="firebase-temp" onVerified={handleKycSuccess} /></div>
              {kycVerified && <p className="text-green-600 font-bold animate-bounce">Verified! ✅</p>}
            </div>
          )}

          {step === 4 && (
            <div className="text-center animate-fadeIn py-4">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle className="w-10 h-10 text-green-600" /></div>
              <h3 className="text-2xl font-bold">All Set!</h3>
              <button onClick={handleSubmit} disabled={loading} className="w-full bg-shePurple text-white py-3 rounded-xl font-bold mt-4">Go to Dashboard</button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Register;