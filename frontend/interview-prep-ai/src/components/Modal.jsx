import React from 'react'
import { LuX } from 'react-icons/lu';

const Modal = ({ children, isOpen, onClose, title, hideHeader }) => {
    if (!isOpen) return null;

    return (
        <div
            className='fixed inset-0 z-50 flex justify-center items-center w-full h-full bg-black/50 backdrop-blur-sm'
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            {/* Modal Content */}
            <div
                className='relative flex flex-col bg-white shadow-2xl shadow-black/20 rounded-2xl overflow-hidden animate-fade-in-up border border-gray-100'
                style={{ animationDuration: '0.25s' }}
            >
                {/* Modal Header */}
                {!hideHeader && (
                    <div className='flex items-center justify-between px-6 py-4 border-b border-gray-100'>
                        <h3 className='text-base font-bold text-gray-900'>{title}</h3>
                    </div>
                )}

                {/* Close button */}
                <button
                    type='button'
                    className='text-gray-400 bg-transparent hover:bg-gray-100 hover:text-gray-900 rounded-xl text-sm w-8 h-8 flex justify-center items-center absolute top-3.5 right-3.5 cursor-pointer transition-all duration-200'
                    onClick={onClose}
                >
                    <LuX className="text-base" />
                </button>

                {/* Modal Body */}
                <div className='flex-1 overflow-y-auto custom-scrollbar'>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
