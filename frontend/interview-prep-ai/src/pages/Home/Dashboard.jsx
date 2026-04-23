import React, { useEffect, useRef, useState } from 'react'
import { LuPlus, LuBrainCircuit } from "react-icons/lu";
import { CARD_BG } from "../../utils/data";
import toast from "react-hot-toast";
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import SummaryCard from '../../components/Cards/SummaryCard';
import moment from "moment";
import Modal from '../../components/Modal';
import CreateSessionForm from './CreateSessionForm';
import DeleteAlertContent from '../../components/DeleteAlertContent';


const Dashboard = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    open: false,
    data: null,
  });

  const fetchAllSessions = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.SESSION.GET_ALL);
      setSessions(response.data);
    } catch (error) {
      console.error("Error fetching session data:", error);
    }
  };

  const deleteSession = async (sessionData) => {
    try {
      await axiosInstance.delete(API_PATHS.SESSION.DELETE(sessionData?._id));
      toast.success("Session Deleted Successfully");
      setOpenDeleteAlert({ open: false, data: null });
      fetchAllSessions();
    } catch (error) {
      console.error("Error deleting session data:", error);
    }
  };

  useEffect(() => {
    fetchAllSessions();
  }, []);

  // Ensure video loops perfectly
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    const playVideo = () => video.play().catch(() => {});
    playVideo();
    video.addEventListener('ended', playVideo);
    return () => video.removeEventListener('ended', playVideo);
  }, []);

  return (
    <DashboardLayout>
      <div className="w-full min-h-screen bg-white">

        {/* ─── Hero / Video Section ─── */}
        <section className="relative w-full overflow-hidden bg-black">
          {/* Ambient glow */}
          <div className="absolute inset-0 pointer-events-none z-0">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-white/5 blur-[120px] rounded-full" />
          </div>

          {/* Video */}
          <div className="relative z-10 flex items-center justify-center px-4 py-8 md:py-12">
            <div
              className="relative w-full max-w-5xl rounded-2xl overflow-hidden video-glow animate-fade-in-up"
              style={{ aspectRatio: '16/9' }}
            >
              {/* Overlay gradient for premium look */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10 z-10 pointer-events-none rounded-2xl" />

              {/* Loading placeholder */}
              {!isVideoLoaded && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-gray-950 rounded-2xl">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 rounded-full border-2 border-white/20 border-t-white/80 animate-spin" />
                    <span className="text-white/50 text-xs tracking-widest uppercase">Loading</span>
                  </div>
                </div>
              )}

              <video
                ref={videoRef}
                src="/Ai.mp4"
                autoPlay
                loop
                muted
                playsInline
                onCanPlay={() => setIsVideoLoaded(true)}
                className={`w-full h-full object-cover rounded-2xl transition-opacity duration-700 ${isVideoLoaded ? 'opacity-100' : 'opacity-0'}`}
              />

              {/* Bottom caption bar */}
              <div className="absolute bottom-0 left-0 right-0 z-20 p-4 flex items-center gap-2 bg-gradient-to-t from-black/70 to-transparent">
                <div className="flex items-center gap-2 text-white/90 text-xs font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  AI Interview Assistant · Live Preview
                </div>
              </div>
            </div>
          </div>

          {/* Stats strip */}
          <div className="relative z-10 border-t border-white/10 grid grid-cols-3 divide-x divide-white/10">
            {[
              { label: 'AI-Powered', value: 'Questions' },
              { label: 'Real-time', value: 'Feedback' },
              { label: 'Smart', value: 'Preparation' },
            ].map((stat, i) => (
              <div key={i} className={`flex flex-col items-center py-4 animate-fade-in-up`} style={{ animationDelay: `${i * 0.1 + 0.2}s`, opacity: 0 }}>
                <span className="text-white text-sm font-bold">{stat.value}</span>
                <span className="text-white/40 text-[11px] tracking-wide uppercase mt-0.5">{stat.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Sessions Section ─── */}
        <section className="w-9/10 container mx-auto px-4 pt-10 pb-28">

          {/* Section header */}
          <div className="flex items-center justify-between mb-8 animate-fade-in-up-delay-1">
            <div>
              <h2 className="text-2xl font-bold text-black tracking-tight">Your Sessions</h2>
              <p className="text-gray-400 text-sm mt-1">
                {sessions.length === 0
                  ? 'No sessions yet — create your first one'
                  : `${sessions.length} session${sessions.length > 1 ? 's' : ''} ready to practice`}
              </p>
            </div>
            <button
              className="hidden md:flex items-center gap-2 bg-black text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-gray-800 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              onClick={() => setOpenCreateModal(true)}
            >
              <LuPlus className="text-base" />
              New Session
            </button>
          </div>

          {/* Empty state */}
          {sessions.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 animate-fade-in-up-delay-2">
              <div className="w-20 h-20 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-5 animate-float shadow-md">
                <LuBrainCircuit className="text-3xl text-gray-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No sessions yet</h3>
              <p className="text-gray-400 text-sm text-center max-w-xs mb-6 leading-relaxed">
                Create your first AI interview session and start practicing with personalized questions.
              </p>
              <button
                className="flex items-center gap-2 bg-black text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-gray-800 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
                onClick={() => setOpenCreateModal(true)}
              >
                <LuPlus className="text-base" />
                Create Session
              </button>
            </div>
          )}

          {/* Session cards grid */}
          {sessions.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {sessions.map((data, index) => (
                <div
                  key={data?._id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.07 + 0.15}s`, opacity: 0 }}
                >
                  <SummaryCard
                    colors={CARD_BG[index % CARD_BG.length]}
                    role={data?.role || ""}
                    topicsToFocus={data?.topicsToFocus || ""}
                    experience={data?.experience || "-"}
                    questions={data?.questions?.length || "-"}
                    description={data?.description || ""}
                    lastUpdated={
                      data?.updatedAt
                        ? moment(data.updatedAt).format("Do MMM YYYY")
                        : ""
                    }
                    onSelect={() => navigate(`/interview-prep/${data?._id}`)}
                    onDelete={() => setOpenDeleteAlert({ open: true, data })}
                  />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ─── FAB ─── */}
        <button
          className='flex items-center justify-center gap-2.5 bg-black text-sm font-semibold text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-all duration-200 cursor-pointer shadow-xl hover:shadow-2xl hover:-translate-y-1 active:translate-y-0 fixed bottom-8 right-6 z-40 md:hidden'
          onClick={() => setOpenCreateModal(true)}
        >
          <LuPlus className='text-xl text-white' />
          <span className='hidden sm:inline'>Add New</span>
        </button>
      </div>

      {/* ─── Modals ─── */}
      <Modal
        isOpen={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        hideHeader
      >
        <div>
          <CreateSessionForm />
        </div>
      </Modal>

      <Modal
        isOpen={openDeleteAlert?.open}
        onClose={() => setOpenDeleteAlert({ open: false, data: null })}
        title="Delete Alert"
      >
        <div className="w-[30vw]">
          <DeleteAlertContent
            content="Are you sure you want to delete this session detail?"
            onDelete={() => deleteSession(openDeleteAlert.data)}
          />
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default Dashboard;
