import React from 'react'
import { LuBrainCircuit, LuBookOpen, LuCalendar, LuArrowLeft } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';

const RoleInfoHeader = ({
    role,
    topicsToFocus,
    experience,
    questions,
    description,
    lastUpdated,
}) => {
    const navigate = useNavigate();

    return (
        <div className='bg-white border-b border-gray-100 relative overflow-hidden'>
            {/* Subtle ambient blobs */}
            <div className='absolute top-0 right-0 w-[300px] h-[200px] pointer-events-none overflow-hidden opacity-30'>
                <div className='w-20 h-20 bg-gray-300 blur-[70px] animate-blob1 absolute top-4 right-10' />
                <div className='w-16 h-16 bg-gray-200 blur-[50px] animate-blob2 absolute bottom-4 right-4' />
            </div>

            <div className='w-9/10 container mx-auto px-4 md:px-0 py-7 relative z-10'>
                {/* Back button */}
                <button
                    onClick={() => navigate('/dashboard')}
                    className='flex items-center gap-1.5 text-xs text-gray-400 hover:text-black font-medium mb-5 transition-colors duration-200 cursor-pointer group'
                >
                    <LuArrowLeft className="text-sm group-hover:-translate-x-0.5 transition-transform duration-200" />
                    Back to Dashboard
                </button>

                <div className='flex items-start justify-between'>
                    <div>
                        <h2 className='text-2xl font-bold text-gray-900 tracking-tight'>{role}</h2>
                        <p className='text-sm text-gray-400 mt-1 max-w-xl leading-relaxed'>{topicsToFocus}</p>
                    </div>
                </div>

                {/* Stats badges */}
                <div className='flex flex-wrap items-center gap-2 mt-4'>
                    <span className='inline-flex items-center gap-1.5 text-[11px] font-semibold text-white bg-black px-3.5 py-1.5 rounded-full'>
                        <LuBrainCircuit className="text-[11px]" />
                        {experience} {experience == 1 ? "Year" : "Years"} Exp
                    </span>
                    <span className='inline-flex items-center gap-1.5 text-[11px] font-semibold text-black bg-gray-100 border border-gray-200 px-3.5 py-1.5 rounded-full'>
                        <LuBookOpen className="text-[11px]" />
                        {questions} Q&A
                    </span>
                    <span className='inline-flex items-center gap-1.5 text-[11px] font-medium text-gray-400 bg-gray-50 border border-gray-100 px-3.5 py-1.5 rounded-full'>
                        <LuCalendar className="text-[11px]" />
                        Updated {lastUpdated}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default RoleInfoHeader;
