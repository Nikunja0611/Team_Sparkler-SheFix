import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // <--- Import useNavigate
import { 
  Menu, X, ChevronRight, Shield, Mic, GraduationCap, 
  Users, Star, MapPin, Phone, Mail, CheckCircle, ArrowRight 
} from 'lucide-react';

const Landing = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate(); // <--- Initialize Hook

  // Navigation Handlers
  const handleRegister = () => navigate('/register');
  const handleLogin = () => navigate('/login');

  const features = [
    {
      icon: <Mic className="w-8 h-8" />,
      title: "Voice-First Interface",
      description: "Powered by Bhashini AI - Navigate in your native language using voice commands. No English barrier!"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Pink-Shield Safety",
      description: "AI-verified households, safety scores, and secure dispatch ensuring worker protection at every step."
    },
    {
      icon: <GraduationCap className="w-8 h-8" />,
      title: "Skill-to-Earn Academy",
      description: "Free video courses in 10+ languages. Learn, earn badges, unlock higher-paying opportunities."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Multilingual Support",
      description: "Real-time translation between workers and clients. Speak Hindi, read English - seamlessly!"
    }
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Electrician, Mumbai",
      text: "मैं अंग्रेजी नहीं बोल सकती थी, लेकिन She-Fix की आवाज़ सुविधा से मुझे काम मिल गया!",
      rating: 5
    },
    {
      name: "Anjali Devi",
      role: "Home Service Seeker",
      text: "Finally found trusted female workers for my home. The safety verification gives me peace of mind.",
      rating: 5
    },
    {
      name: "Lakshmi K",
      role: "Caregiver, Chennai",
      text: "இலவச பயிற்சி வீடியோக்கள் மூலம் புதிய திறன்களைக் கற்றுக்கொண்டேன். இப்போது அதிக ஊதியம் பெறுகிறேன்!",
      rating: 5
    }
  ];

  const stats = [
    { number: "10,000+", label: "Active Workers" },
    { number: "50,000+", label: "Verified Households" },
    { number: "15+", label: "Languages Supported" },
    { number: "98%", label: "Safety Rating" }
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      
      {/* --- Navigation --- */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-10 h-10 bg-gradient-to-br from-shePurple to-purple-700 rounded-lg flex items-center justify-center shadow-md">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-shePurple tracking-tight">She-Fix</h1>
                <p className="text-[10px] text-pink-500 font-medium tracking-wider uppercase">Safe & Skilled</p>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {['Features', 'How It Works', 'Success Stories'].map((item) => (
                <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`} className="text-sm font-medium text-gray-600 hover:text-shePurple transition">
                  {item}
                </a>
              ))}
              {/* Updated: Redirects to Register */}
              <button 
                onClick={handleRegister}
                className="bg-shePurple text-white px-6 py-2.5 rounded-full font-medium hover:bg-purple-800 transition shadow-lg shadow-purple-200 transform hover:-translate-y-0.5"
              >
                Get Started
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-gray-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-6 space-y-4 pt-4 border-t border-gray-100">
              {['Features', 'How It Works', 'Success Stories'].map((item) => (
                <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`} className="block text-base font-medium text-gray-600 hover:text-shePurple px-2">
                  {item}
                </a>
              ))}
              {/* Updated: Redirects to Register */}
              <button 
                onClick={handleRegister}
                className="w-full bg-shePurple text-white px-6 py-3 rounded-xl font-medium shadow-md"
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <section className="relative overflow-hidden pt-16 pb-24 lg:pt-32 lg:pb-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <div className="space-y-8 z-10">
              <div className="inline-flex items-center gap-2 bg-pink-50 text-shePurple px-4 py-2 rounded-full text-sm font-semibold border border-pink-100">
                <span className="flex h-2 w-2 rounded-full bg-pink-500 animate-pulse"></span>
                Empowering Women, One Job at a Time
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-[1.1]">
                Safe, Skilled & <br/>
                <span className="bg-gradient-to-r from-shePurple to-pink-500 bg-clip-text text-transparent">Multilingual</span> <br/>
                Workforce
              </h1>
              
              <p className="text-lg text-gray-600 max-w-lg leading-relaxed">
                Connecting safety-conscious households with verified female workers through voice-powered technology in <span className="font-semibold text-shePurple">15+ Indian languages</span>.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                {/* Updated: Redirects to Register */}
                <button 
                  onClick={handleRegister}
                  className="bg-shePurple text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-purple-800 transition shadow-xl shadow-purple-200 flex items-center justify-center gap-2 group"
                >
                  Join as Worker
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                </button>
                {/* Updated: Redirects to Register (or Login if you prefer) */}
                <button 
                  onClick={handleRegister}
                  className="bg-white text-shePurple border-2 border-shePurple/20 px-8 py-4 rounded-full text-lg font-semibold hover:bg-purple-50 transition"
                >
                  Find Workers
                </button>
              </div>

              {/* Social Proof */}
              <div className="flex items-center gap-6 pt-6">
                <div className="flex -space-x-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={`w-12 h-12 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center text-xs font-bold text-white bg-cover`} style={{backgroundImage: `url(https://randomuser.me/api/portraits/women/${i + 20}.jpg)`}} />
                  ))}
                </div>
                <div>
                  <p className="font-bold text-gray-900">10,000+ Active Workers</p>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <div className="flex text-yellow-400">
                      {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                    </div>
                    <span>4.9/5 Rating</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Image/Graphic */}
            <div className="relative lg:ml-auto">
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-200 to-pink-200 rounded-[3rem] rotate-6 transform scale-95 opacity-50 blur-2xl"></div>
              <div className="relative bg-white rounded-[2rem] p-6 shadow-2xl border border-gray-100">
                {/* Simulated UI Card */}
                <div className="bg-gray-50 rounded-2xl p-6 space-y-6">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-shePink/30 rounded-full flex items-center justify-center">
                        <Mic className="w-5 h-5 text-shePurple" />
                      </div>
                      <div className="space-y-1">
                        <div className="h-2 w-24 bg-gray-200 rounded"></div>
                        <div className="h-2 w-16 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                    <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                  </div>

                  {/* Voice Bubble */}
                  <div className="bg-white p-4 rounded-xl rounded-tl-none border border-purple-100 shadow-sm">
                    <p className="text-xs text-shePurple font-bold mb-1 uppercase tracking-wider">Voice Input (Hindi)</p>
                    <p className="text-lg font-medium text-gray-800">"मुझे कल काम चाहिए"</p>
                  </div>

                  {/* Translation Bubble */}
                  <div className="bg-shePurple p-4 rounded-xl rounded-tr-none shadow-md text-white">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="w-3 h-3 text-green-300" />
                      <p className="text-xs font-bold uppercase tracking-wider opacity-80">Translated</p>
                    </div>
                    <p className="text-lg font-medium">"I need work tomorrow"</p>
                  </div>

                  {/* Safety Badge */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Shield className="w-4 h-4 text-green-500" />
                      Verified Profile
                    </div>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-md font-bold">98% Match</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- Stats Section --- */}
      <section className="bg-shePurple py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-purple-500/30">
            {stats.map((stat, index) => (
              <div key={index} className="text-center px-4">
                <p className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.number}</p>
                <p className="text-purple-200 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Features Section --- */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Why Choose <span className="text-shePurple">She-Fix?</span>
            </h2>
            <p className="text-xl text-gray-600">
              Breaking barriers with technology, empowering women with opportunity and safety.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                <div className="w-14 h-14 bg-pink-50 rounded-xl flex items-center justify-center text-shePurple mb-6 group-hover:bg-shePurple group-hover:text-white transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- How It Works --- */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Simple as <span className="text-shePurple">1-2-3</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gray-100 -z-10"></div>

            {[
              { step: "01", title: "Sign Up", desc: "Quick registration with voice verification in your language" },
              { step: "02", title: "Get Verified", desc: "Complete AI-powered safety verification for trust & security" },
              { step: "03", title: "Start Working", desc: "Browse jobs, communicate easily, and earn with dignity" }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-24 h-24 bg-white border-4 border-pink-100 rounded-full flex items-center justify-center text-3xl font-bold text-shePurple mx-auto mb-6 shadow-sm relative z-10">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 max-w-xs mx-auto">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Testimonials --- */}
      <section id="testimonials" className="py-24 bg-pink-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Success <span className="text-shePurple">Stories</span>
            </h2>
            <p className="text-xl text-gray-600">Real voices, real impact</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic leading-relaxed">"{testimonial.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200 bg-cover" style={{backgroundImage: `url(https://randomuser.me/api/portraits/women/${index + 45}.jpg)`}}></div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{testimonial.name}</p>
                    <p className="text-xs text-shePurple font-medium">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA Section --- */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-shePurple to-purple-800 rounded-3xl p-12 md:p-16 text-center shadow-2xl relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-pink-500 opacity-10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
            
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 relative z-10">
              Ready to Make a Difference?
            </h2>
            <p className="text-lg md:text-xl text-purple-100 mb-10 max-w-2xl mx-auto relative z-10">
              Join thousands of empowered women earning with dignity and safety. Start your journey today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
              {/* Updated: Redirects to Register */}
              <button 
                onClick={handleRegister}
                className="bg-white text-shePurple px-8 py-4 rounded-full text-lg font-bold hover:shadow-lg transition transform hover:scale-105"
              >
                Register as Worker
              </button>
              {/* Updated: Redirects to Register */}
              <button 
                onClick={handleRegister}
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-white/10 transition"
              >
                Post a Job
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="bg-gray-900 text-gray-300 py-16 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <Shield className="w-8 h-8 text-shePurple" />
                <span className="text-2xl font-bold text-white">She-Fix</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Empowering women through safe, skilled, and localized work opportunities across India.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-6">Quick Links</h4>
              <ul className="space-y-3">
                {['About Us', 'How It Works', 'Safety Guidelines', 'Blog'].map(link => (
                  <li key={link}><a href="#" className="hover:text-shePurple transition">{link}</a></li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-6">Support</h4>
              <ul className="space-y-3">
                {['Help Center', 'Privacy Policy', 'Terms of Service', 'Contact Us'].map(link => (
                  <li key={link}><a href="#" className="hover:text-shePurple transition">{link}</a></li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-6">Contact</h4>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-shePurple" />
                  support@shefix.in
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-shePurple" />
                  +91 1800-SHEFIX
                </li>
                <li className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-shePurple" />
                  Mumbai, India
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
            <p>&copy; 2025 She-Fix. All rights reserved. Built with ❤️ for empowering women.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;