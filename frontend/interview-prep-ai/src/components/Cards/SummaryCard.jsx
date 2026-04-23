import React from 'react'
import { LuTrash2, LuCalendar, LuBookOpen, LuBrainCircuit } from 'react-icons/lu';
import { getInitials } from '../../utils/helper';

const SummaryCard = ({
    colors,
    role,
    topicsToFocus,
    experience,
    questions,
    description,
    lastUpdated,
    onSelect,
    onDelete,
}) => {
    return (
        <div
            className='bg-white border border-gray-100 rounded-2xl overflow-hidden cursor-pointer hover:shadow-xl hover:shadow-gray-100/80 relative group card-hover transition-all duration-300'
            onClick={onSelect}
        >
            {/* Colored top section */}
            <div
                className='rounded-t-2xl p-5 relative overflow-hidden'
                style={{ background: colors.bgcolor }}
            >
                {/* Subtle noise texture */}
                <div className="absolute inset-0 opacity-30 pointer-events-none"
                    style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.05\'/%3E%3C/svg%3E")' }}
                />

                <div className='flex items-start gap-3 relative z-10'>
                    {/* Avatar */}
                    <div className='flex-shrink-0 w-12 h-12 bg-white/90 rounded-xl flex items-center justify-center shadow-sm border border-white/60'>
                        <span className='text-sm font-bold text-black'>
                            {getInitials(role)}
                        </span>
                    </div>

                    {/* Role & Topics */}
                    <div className='flex-grow min-w-0'>
                        <h2 className='text-[16px] font-bold text-gray-900 leading-tight truncate'>
                            {role}
                        </h2>
                        <p className='text-[12px] text-gray-600 mt-0.5 line-clamp-1'>
                            {topicsToFocus}
                        </p>
                    </div>
                </div>

                {/* Delete button */}
                <button
                    className='absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 flex items-center gap-1.5 text-xs text-rose-500 font-medium bg-white/90 backdrop-blur-sm px-2.5 py-1.5 rounded-lg border border-rose-100 hover:border-rose-200 hover:bg-rose-50 cursor-pointer transition-all duration-200 shadow-sm'
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                    }}
                >
                    <LuTrash2 className="text-sm" />
                </button>
            </div>

            {/* Card body */}
            <div className='px-4 py-4'>
                {/* Tags row */}
                <div className='flex flex-wrap items-center gap-2 mb-3'>
                    <span className='inline-flex items-center gap-1 text-[10px] font-semibold text-gray-700 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-200'>
                        <LuBrainCircuit className="text-[10px]" />
                        {experience} {experience == 1 ? "Yr" : "Yrs"} Exp
                    </span>
                    <span className='inline-flex items-center gap-1 text-[10px] font-semibold text-gray-700 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-200'>
                        <LuBookOpen className="text-[10px]" />
                        {questions} Q&A
                    </span>
                    <span className='inline-flex items-center gap-1 text-[10px] font-semibold text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100 ml-auto'>
                        <LuCalendar className="text-[10px]" />
                        {lastUpdated}
                    </span>
                </div>

                {/* Description */}
                <p className='text-[12px] text-gray-400 font-medium line-clamp-2 leading-relaxed'>
                    {description || 'No description provided.'}
                </p>

                {/* Hover cta */}
                <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <span className="text-[11px] text-gray-400 font-medium">Click to practice →</span>
                </div>
            </div>
        </div>
    );
};

export default SummaryCard;
