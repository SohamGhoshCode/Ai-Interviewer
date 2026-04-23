import React from 'react'
import { LuTriangleAlert } from 'react-icons/lu';

const DeleteAlertContent = ({ content, onDelete }) => {
    return (
        <div className='p-6'>
            <div className="flex items-start gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center flex-shrink-0">
                    <LuTriangleAlert className="text-red-500 text-sm" />
                </div>
                <p className='text-[14px] text-gray-600 leading-relaxed pt-1.5'>{content}</p>
            </div>
            <div className='flex justify-end gap-2'>
                <button
                    type='button'
                    className='flex items-center gap-2 text-sm font-semibold text-red-500 bg-red-50 border border-red-100 hover:border-red-200 hover:bg-red-100 px-5 py-2 rounded-xl cursor-pointer transition-all duration-200'
                    onClick={onDelete}
                >
                    Delete
                </button>
            </div>
        </div>
    );
};

export default DeleteAlertContent;
