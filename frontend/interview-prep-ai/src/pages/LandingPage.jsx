import { useContext, useState } from 'react'
import HERO_IMG from "../assets/hero-img.png";
import LOGO from "../assets/logo.svg";
import { APP_FEATURES } from "../utils/data";
import { useNavigate } from 'react-router-dom';
import { LuSparkles, LuArrowRight, LuBrainCircuit, LuZap } from "react-icons/lu";
import Modal from '../components/Modal';
import Login from './Auth/Login';
import SignUp from './Auth/SignUp';
import { UserContext } from '../context/userContext';
import ProfileInfoCard from '../components/Cards/ProfileInfoCard';


const LandingPage = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [currentPage, setCurrentPage] = useState("login");

  const handleCTA = () => {
    if (!user) {
      setOpenAuthModal(true);
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <>
      {/* ─── HERO ─── */}
      <div className='w-full min-h-screen bg-white relative overflow-hidden'>
        {/* Ambient background blobs */}
        <div className='w-[600px] h-[600px] bg-gray-100 blur-[160px] absolute -top-20 -left-20 pointer-events-none opacity-70 animate-blob1' />
        <div className='w-[500px] h-[500px] bg-gray-200 blur-[160px] absolute top-10 -right-20 pointer-events-none opacity-50 animate-blob2' />
        <div className='w-[300px] h-[300px] bg-gray-100 blur-[120px] absolute bottom-20 left-1/2 pointer-events-none opacity-40 animate-blob3' />

        <div className='w-9/10 container mx-auto px-4 pt-6 pb-32 relative z-10'>

          {/* ─── Header ─── */}
          <header className='flex justify-between items-center mb-20 animate-fade-in-up'>
            <div className='flex items-center gap-2 group cursor-pointer' onClick={() => navigate('/')}>
              <div className="p-1.5 rounded-lg bg-black group-hover:scale-105 transition-transform duration-200">
                <img src={LOGO} alt="ASAP! Logo" className='w-5 h-5 invert' />
              </div>
              <span className='text-xl text-black font-bold tracking-tight'>
                ASAP<span className='text-gray-300'>!</span>
              </span>
            </div>

            {user ? (
              <ProfileInfoCard />
            ) : (
              <button
                className='bg-black text-sm font-semibold text-white px-6 py-2.5 rounded-full hover:bg-gray-800 border border-black transition-all duration-200 cursor-pointer hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0'
                onClick={() => setOpenAuthModal(true)}
              >
                Login / Sign Up
              </button>
            )}
          </header>

          {/* ─── Hero Content ─── */}
          <div className='flex flex-col md:flex-row items-center gap-12 md:gap-8'>
            {/* Left */}
            <div className='w-full md:w-1/2 animate-fade-in-up-delay-1'>
              <div className='flex items-center gap-2 mb-6'>
                <div className='flex items-center gap-2 text-[12px] text-black font-semibold bg-gray-100 px-3.5 py-1.5 rounded-full border border-gray-200 shadow-sm'>
                  <LuSparkles className="text-black text-xs" />
                  AI Powered · Free to Start
                </div>
              </div>

              <h1 className='text-5xl md:text-6xl text-black font-bold mb-6 leading-[1.08] tracking-tight'>
                Ace Interviews<br />
                <span className='relative inline-block'>
                  with{" "}
                  <span className='italic font-black'>AI-Powered</span>
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-black rounded-full opacity-20" />
                </span>
                <br />
                <span className="text-gray-400 font-medium">Learning</span>
              </h1>

              <p className='text-[16px] text-gray-500 mb-8 leading-relaxed max-w-md'>
                Get role-specific questions, expand answers when you need them, dive deeper into
                concepts, and organize everything your way.
              </p>

              <div className="flex items-center gap-4">
                <button
                  className='flex items-center gap-2.5 bg-black text-sm font-semibold text-white px-7 py-3 rounded-full hover:bg-gray-800 border border-black transition-all duration-200 cursor-pointer shadow-lg shadow-gray-900/10 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0'
                  onClick={handleCTA}
                >
                  Get Started
                  <LuArrowRight className="text-base" />
                </button>
                <span className="text-xs text-gray-400 font-medium">No credit card required</span>
              </div>
            </div>

            {/* Right */}
            <div className='w-full md:w-1/2 animate-fade-in-up-delay-2'>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: LuBrainCircuit, label: 'Smart Q&A', desc: 'AI-generated role-specific questions' },
                  { icon: LuZap, label: 'Instant Feedback', desc: 'Real-time answer analysis' },
                  { icon: LuSparkles, label: 'Personalized', desc: 'Tailored to your experience' },
                  { icon: LuArrowRight, label: 'Track Progress', desc: 'Monitor your improvement' },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="bg-gray-50 border border-gray-100 rounded-2xl p-4 hover:bg-white hover:shadow-md hover:border-gray-200 transition-all duration-300 hover:-translate-y-1 cursor-default"
                  >
                    <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center mb-3">
                      <item.icon className="text-white text-sm" />
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 mb-1">{item.label}</h3>
                    <p className="text-[11px] text-gray-400 leading-snug">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── HERO IMAGE SECTION ─── */}
      <div className='w-full bg-white relative z-10'>
        <section className='flex items-center justify-center -mt-20 md:-mt-28 px-4'>
          <div className="relative group animate-fade-in-up-delay-3">
            {/* Glow behind image */}
            <div className="absolute -inset-4 bg-black/5 blur-2xl rounded-3xl pointer-events-none" />
            <img
              src={HERO_IMG}
              alt="Dashboard Preview"
              className='w-full max-w-5xl mx-auto rounded-2xl shadow-2xl shadow-gray-200 border border-gray-100 relative z-10 transition-transform duration-500 group-hover:scale-[1.01]'
            />
            {/* Floating badge */}
            <div className="absolute -top-3 -right-3 md:top-4 md:right-4 z-20 bg-black text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              Live AI
            </div>
          </div>
        </section>
      </div>

      {/* ─── FEATURES SECTION ─── */}
      <div className='w-full bg-gray-50 mt-16 border-t border-gray-100'>
        <div className='w-9/10 container mx-auto px-4 pt-16 pb-24'>
          <section>
            <div className="text-center mb-14 animate-fade-in-up">
              <div className='inline-flex items-center gap-2 text-[11px] text-gray-500 font-semibold bg-white px-3.5 py-1.5 rounded-full border border-gray-200 mb-4 shadow-sm tracking-wide uppercase'>
                <LuSparkles className="text-xs" /> Features
              </div>
              <h2 className='text-3xl font-bold text-black mb-3 tracking-tight'>
                Features That Make You Shine
              </h2>
              <p className='text-gray-400 text-sm max-w-xs mx-auto'>
                Everything you need to land your dream job.
              </p>
            </div>

            <div className='flex flex-col items-center gap-6'>
              {/* First 3 */}
              <div className='grid grid-cols-1 md:grid-cols-3 gap-5 w-full'>
                {APP_FEATURES.slice(0, 3).map((feature, i) => (
                  <div
                    key={feature.id}
                    className='bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group hover:-translate-y-2 cursor-default'
                  >
                    <div className="w-9 h-9 rounded-xl bg-black flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                      <LuSparkles className="text-white text-sm" />
                    </div>
                    <h3 className='text-base font-bold mb-2 text-gray-900 group-hover:text-black transition-colors duration-200'>{feature.title}</h3>
                    <p className='text-gray-400 text-sm leading-relaxed'>{feature.description}</p>
                  </div>
                ))}
              </div>

              {/* Remaining 2 */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-5 w-full'>
                {APP_FEATURES.slice(3).map((feature) => (
                  <div
                    key={feature.id}
                    className='bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group hover:-translate-y-2 cursor-default'
                  >
                    <div className="w-9 h-9 rounded-xl bg-black flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                      <LuZap className="text-white text-sm" />
                    </div>
                    <h3 className='text-base font-bold mb-2 text-gray-900 group-hover:text-black transition-colors duration-200'>{feature.title}</h3>
                    <p className='text-gray-400 text-sm leading-relaxed'>{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* ─── CTA STRIP ─── */}
      <div className="w-full bg-black py-16 px-4">
        <div className="w-9/10 container mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-tight">
            Ready to ace your next interview?
          </h2>
          <p className="text-gray-400 text-sm mb-8">Join thousands of candidates who practice smarter.</p>
          <button
            className='inline-flex items-center gap-2.5 bg-white text-black text-sm font-bold px-8 py-3.5 rounded-full hover:bg-gray-100 transition-all duration-200 cursor-pointer shadow-2xl hover:shadow-white/20 hover:-translate-y-0.5 active:translate-y-0'
            onClick={handleCTA}
          >
            Start for Free
            <LuArrowRight className="text-base" />
          </button>
        </div>
      </div>

      {/* ─── FOOTER ─── */}
      <div className='text-sm bg-white text-gray-300 text-center p-6 border-t border-gray-100'>
        <span className="text-gray-400">Made with</span>{" "}
        <span>❤️</span>{" "}
        <span className="text-gray-400">by ASAP! · Happy Coding</span>
      </div>

      {/* ─── Auth Modal ─── */}
      <Modal
        isOpen={openAuthModal}
        onClose={() => {
          setOpenAuthModal(false);
          setCurrentPage("login");
        }}
        hideHeader
      >
        <div>
          {currentPage === "login" && <Login setCurrentPage={setCurrentPage} />}
          {currentPage === "signup" && <SignUp setCurrentPage={setCurrentPage} />}
        </div>
      </Modal>
    </>
  );
};

export default LandingPage;
