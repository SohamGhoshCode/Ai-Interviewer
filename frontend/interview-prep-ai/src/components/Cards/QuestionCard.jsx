import React, { useEffect, useRef, useState } from 'react'
import { LuChevronDown, LuPin, LuPinOff, LuSparkles } from 'react-icons/lu'
import AIResponsePreview from '../../pages/InterviewPrep/components/AIResponsePreview';

const QuestionCard = ({
    question,
    answer,
    onLearnMore,
    isPinned,
    onTogglePin,
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [height, setHeight] = useState(0);
    const contentRef = useRef(null);

    useEffect(() => {
        if (isExpanded) {
            const contentHeight = contentRef.current.scrollHeight;
            setHeight(contentHeight + 10);
        } else {
            setHeight(0);
        }
    }, [isExpanded]);

    const toggleExpand = () => setIsExpanded(!isExpanded);

    return (
        <div className={`bg-white rounded-2xl mb-3 overflow-hidden border transition-all duration-300 group ${
            isExpanded
                ? 'border-gray-200 shadow-lg shadow-gray-100/80'
                : 'border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200'
        } ${isPinned ? 'ring-1 ring-black/10' : ''}`}>

            {/* Question row */}
            <div className='flex items-start justify-between gap-3 px-5 py-4 cursor-pointer' onClick={toggleExpand}>
                <div className='flex items-start gap-3 flex-1 min-w-0'>
                    {/* Q badge */}
                    <span className={`flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold mt-0.5 transition-colors duration-200 ${
                        isExpanded ? 'bg-black text-white' : 'bg-gray-100 text-gray-500'
                    }`}>
                        Q
                    </span>
                    <h3 className='text-[13px] md:text-[14px] font-medium text-gray-800 leading-relaxed'>
                        {question}
                    </h3>
                </div>

                {/* Action buttons */}
                <div className='flex items-center gap-1.5 flex-shrink-0' onClick={(e) => e.stopPropagation()}>
                    <div className={`flex gap-1.5 ${isExpanded ? 'flex' : 'hidden group-hover:flex'} transition-all duration-200`}>
                        {/* Pin button */}
                        <button
                            className={`flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border cursor-pointer transition-all duration-200 ${
                                isPinned
                                    ? 'bg-black text-white border-black'
                                    : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-gray-400 hover:bg-gray-100'
                            }`}
                            onClick={onTogglePin}
                            title={isPinned ? 'Unpin' : 'Pin'}
                        >
                            {isPinned ? <LuPinOff className='text-xs' /> : <LuPin className='text-xs' />}
                        </button>

                        {/* Learn More button */}
                        <button
                            className='flex items-center gap-1.5 text-[11px] font-semibold bg-gray-50 text-gray-600 px-2.5 py-1.5 rounded-lg border border-gray-200 hover:border-gray-400 hover:bg-gray-100 cursor-pointer transition-all duration-200'
                            onClick={() => {
                                setIsExpanded(true);
                                onLearnMore();
                            }}
                        >
                            <LuSparkles className='text-xs' />
                            <span className='hidden md:block'>Learn More</span>
                        </button>
                    </div>

                    {/* Chevron */}
                    <button className='text-gray-300 hover:text-gray-600 cursor-pointer p-0.5 transition-colors duration-200'>
                        <LuChevronDown
                            size={18}
                            className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                        />
                    </button>
                </div>
            </div>

            {/* Answer section */}
            <div
                className='overflow-hidden transition-all duration-350 ease-in-out'
                style={{ maxHeight: `${height}px` }}
            >
                <div
                    ref={contentRef}
                    className='mx-4 mb-4 text-gray-700 bg-gray-50 px-5 py-4 rounded-xl border border-gray-100'
                >
                    <AIResponsePreview content={answer} />
                </div>
            </div>
        </div>
    );
};

export default QuestionCard;
