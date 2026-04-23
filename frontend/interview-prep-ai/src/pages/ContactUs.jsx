import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { useNavigate } from 'react-router-dom';
import LOGO from '../assets/logo.svg';
import {
  LuArrowLeft,
  LuMail,
  LuUser,
  LuMessageSquare,
  LuSend,
  LuSparkles,
  LuCircleCheck,
  LuLoaderCircle,
  LuBrainCircuit,
  LuGlobe,
} from 'react-icons/lu';
import { FaGithub, FaLinkedinIn } from 'react-icons/fa';

const SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const CONTACT_LINKS = [
  {
    icon: LuMail,
    label: 'Email',
    value: '2004sohamghosh@gmail.com',
    href: 'mailto:2004sohamghosh@gmail.com',
  },
  {
    icon: FaGithub,
    label: 'GitHub',
    value: 'SohamGhoshCode',
    href: 'https://github.com/SohamGhoshCode',
  },
  {
    icon: FaLinkedinIn,
    label: 'LinkedIn',
    value: 'Connect with me',
    href: 'https://www.linkedin.com/in/sohamghosh15/',
  },
  {
    icon: LuGlobe,
    label: 'Project',
    value: 'ASAP! AI Interviewer',
    href: '#',
  },
];

const ContactUs = () => {
  const formRef = useRef(null);
  const navigate = useNavigate();

  const [form, setForm]       = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus]   = useState('idle'); // idle | sending | success | error
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, subject, message } = form;

    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setErrorMsg('');
    setStatus('sending');

    try {
      await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, PUBLIC_KEY);
      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error('EmailJS error:', err);
      setStatus('error');
      setErrorMsg('Something went wrong. Please try again or email directly.');
    }
  };

  return (
    <div className='w-full min-h-screen bg-white relative overflow-hidden'>

      {/* ── ambient blobs ── */}
      <div className='w-[500px] h-[500px] bg-gray-100 blur-[160px] absolute -top-32 -left-20 pointer-events-none animate-blob1' />
      <div className='w-[400px] h-[400px] bg-gray-200 blur-[140px] absolute top-10 -right-20 pointer-events-none animate-blob2' />

      {/* ── Navbar ── */}
      <nav className='h-16 bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-30 shadow-sm'>
        <div className='w-9/10 container mx-auto h-full flex items-center justify-between'>
          <button
            onClick={() => navigate('/')}
            className='flex items-center gap-2 group cursor-pointer'
          >
            <div className='p-1.5 rounded-lg bg-black group-hover:scale-105 transition-transform duration-200'>
              <img src={LOGO} alt='ASAP!' className='w-5 h-5 invert' />
            </div>
            <span className='text-xl font-bold text-black tracking-tight'>
              ASAP<span className='text-gray-300'>!</span>
            </span>
          </button>

          <button
            onClick={() => navigate(-1)}
            className='flex items-center gap-1.5 text-sm text-gray-400 hover:text-black font-medium transition-colors duration-200 cursor-pointer group'
          >
            <LuArrowLeft className='group-hover:-translate-x-0.5 transition-transform duration-200' />
            Back
          </button>
        </div>
      </nav>

      <div className='w-9/10 container mx-auto px-4 py-16 relative z-10'>

        {/* ── Page header ── */}
        <div className='text-center mb-14 animate-fade-in-up'>
          <div className='inline-flex items-center gap-2 text-[11px] text-gray-500 font-semibold bg-gray-50 border border-gray-200 px-3.5 py-1.5 rounded-full mb-4 tracking-wide uppercase shadow-sm'>
            <LuSparkles className='text-xs' /> Get in Touch
          </div>
          <h1 className='text-4xl md:text-5xl font-bold text-black tracking-tight mb-4 leading-tight'>
            Let's Work <span className='italic font-black'>Together</span>
          </h1>
          <p className='text-gray-400 text-base max-w-md mx-auto leading-relaxed'>
            Have a question, a collab idea, or just want to say hi?
            Drop a message and I'll get back to you.
          </p>
        </div>

        {/* ── Two-column layout ── */}
        <div className='grid grid-cols-1 lg:grid-cols-5 gap-8 max-w-5xl mx-auto'>

          {/* ── LEFT: contact info ── */}
          <div className='lg:col-span-2 flex flex-col gap-5 animate-fade-in-up-delay-1'>

            {/* Info card */}
            <div className='bg-black rounded-2xl p-6 text-white relative overflow-hidden'>
              {/* Subtle glow */}
              <div className='absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full pointer-events-none' />
              <div className='relative z-10'>
                <div className='flex items-center gap-2.5 mb-3'>
                  <div className='w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center'>
                    <LuBrainCircuit className='text-white text-base' />
                  </div>
                  <span className='text-sm font-bold tracking-tight'>ASAP! AI Interviewer</span>
                </div>
                <p className='text-white/50 text-[13px] leading-relaxed'>
                  Built for developers and job seekers who want to ace interviews
                  with the power of AI. Open to collaborations, feedback and feature ideas.
                </p>
              </div>
            </div>

            {/* Links */}
            <div className='flex flex-col gap-3'>
              {CONTACT_LINKS.map(({ icon: Icon, label, value, href }) => (
                <a
                  key={label}
                  href={href}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center gap-3 p-4 bg-gray-50 border border-gray-100 rounded-2xl hover:bg-white hover:border-gray-300 hover:shadow-md transition-all duration-250 group card-hover'
                >
                  <div className='w-9 h-9 rounded-xl bg-black flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-200'>
                    <Icon className='text-white text-sm' />
                  </div>
                  <div className='min-w-0'>
                    <p className='text-[10px] text-gray-400 font-semibold uppercase tracking-widest'>{label}</p>
                    <p className='text-[13px] font-semibold text-gray-800 truncate'>{value}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* ── RIGHT: form ── */}
          <div className='lg:col-span-3 animate-fade-in-up-delay-2'>
            <div className='bg-white border border-gray-100 rounded-2xl shadow-xl shadow-gray-100/60 overflow-hidden'>

              {/* Form header */}
              <div className='bg-gray-50 border-b border-gray-100 px-7 py-5'>
                <h2 className='text-base font-bold text-black'>Send a Message</h2>
                <p className='text-[12px] text-gray-400 mt-0.5'>
                  I typically respond within 24 hours.
                </p>
              </div>

              {/* Success state */}
              {status === 'success' ? (
                <div className='flex flex-col items-center justify-center py-20 px-7 text-center'>
                  <div className='w-16 h-16 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center mb-5 animate-float'>
                    <LuCircleCheck className='text-green-500 text-2xl' />
                  </div>
                  <h3 className='text-lg font-bold text-black mb-2'>Message Sent! 🎉</h3>
                  <p className='text-sm text-gray-400 max-w-xs leading-relaxed mb-7'>
                    Thanks for reaching out. I'll get back to you as soon as possible.
                  </p>
                  <button
                    onClick={() => setStatus('idle')}
                    className='flex items-center gap-2 bg-black text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-gray-800 transition-all duration-200 cursor-pointer hover:-translate-y-0.5 hover:shadow-lg'
                  >
                    Send Another
                  </button>
                </div>
              ) : (
                <form ref={formRef} onSubmit={handleSubmit} className='px-7 py-6 flex flex-col gap-4'>

                  {/* Name + Email row */}
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <div className='flex flex-col gap-1.5'>
                      <label className='text-[11px] font-semibold text-gray-500 uppercase tracking-widest'>
                        Your Name <span className='text-black'>*</span>
                      </label>
                      <div className='input-box !mb-0 !mt-0'>
                        <LuUser className='text-gray-300 flex-shrink-0 text-sm' />
                        <input
                          name='name'
                          value={form.name}
                          onChange={handleChange}
                          placeholder='John Doe'
                          className='flex-1 bg-transparent outline-none text-sm text-black placeholder:text-gray-300'
                        />
                      </div>
                    </div>

                    <div className='flex flex-col gap-1.5'>
                      <label className='text-[11px] font-semibold text-gray-500 uppercase tracking-widest'>
                        Email Address <span className='text-black'>*</span>
                      </label>
                      <div className='input-box !mb-0 !mt-0'>
                        <LuMail className='text-gray-300 flex-shrink-0 text-sm' />
                        <input
                          name='email'
                          type='email'
                          value={form.email}
                          onChange={handleChange}
                          placeholder='john@example.com'
                          className='flex-1 bg-transparent outline-none text-sm text-black placeholder:text-gray-300'
                        />
                      </div>
                    </div>
                  </div>

                  {/* Subject */}
                  <div className='flex flex-col gap-1.5'>
                    <label className='text-[11px] font-semibold text-gray-500 uppercase tracking-widest'>
                      Subject
                    </label>
                    <div className='input-box !mb-0 !mt-0'>
                      <LuMessageSquare className='text-gray-300 flex-shrink-0 text-sm' />
                      <input
                        name='subject'
                        value={form.subject}
                        onChange={handleChange}
                        placeholder='Collaboration, Feedback, Question…'
                        className='flex-1 bg-transparent outline-none text-sm text-black placeholder:text-gray-300'
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div className='flex flex-col gap-1.5'>
                    <label className='text-[11px] font-semibold text-gray-500 uppercase tracking-widest'>
                      Message <span className='text-black'>*</span>
                    </label>
                    <textarea
                      name='message'
                      value={form.message}
                      onChange={handleChange}
                      rows={5}
                      placeholder="Hi! I'd love to collaborate on..."
                      className='w-full text-sm text-black bg-gray-50 rounded-xl px-4 py-3 border border-gray-200 outline-none focus:border-black focus:bg-white focus:shadow-sm transition-all duration-200 resize-none placeholder:text-gray-300 custom-scrollbar'
                    />
                  </div>

                  {/* Error */}
                  {errorMsg && (
                    <p className='text-red-500 text-xs flex items-center gap-1.5'>
                      ⚠ {errorMsg}
                    </p>
                  )}

                  {/* Submit */}
                  <button
                    type='submit'
                    disabled={status === 'sending'}
                    className='btn-primary !rounded-xl mt-1 disabled:opacity-60 disabled:cursor-not-allowed'
                  >
                    {status === 'sending' ? (
                      <>
                        <LuLoaderCircle className='text-base animate-spin' />
                        Sending…
                      </>
                    ) : (
                      <>
                        <LuSend className='text-base' />
                        Send Message
                      </>
                    )}
                  </button>

                  <p className='text-[11px] text-gray-300 text-center'>
                    Your message is sent directly to my inbox via EmailJS — no middleman.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <div className='text-sm bg-white text-center p-6 border-t border-gray-100 mt-10'>
        <span className='text-gray-400'>Made with ❤️ by ASAP! · Happy Coding</span>
      </div>
    </div>
  );
};

export default ContactUs;
